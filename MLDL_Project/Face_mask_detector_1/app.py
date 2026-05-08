import os
import cv2
import torch
import torch.nn as nn
from torchvision import transforms
import numpy as np
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
import base64
import tempfile

app = FastAPI()

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- #
# Model Definitions #
# ----------------- #

class FaceMaskCNN(nn.Module):
    def __init__(self):
        super(FaceMaskCNN, self).__init__()
        
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Dropout(0.25),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Dropout(0.25),
            
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Dropout(0.3)
        )
        
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256 * 14 * 14, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, 3)
        )
        
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

# Initialization
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Server using device: {device}")

model_path = 'mask_model.pth'
model = FaceMaskCNN().to(device)
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print("Mask CNN Loaded successfully.")
else:
    print(f"WARNING: Weights not found at {model_path}.")

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

class_names = ['incorrect_mask', 'with_mask', 'without_mask']

# Load OpenCV DNN Face Detector
prototxt_path = "deploy.prototxt"
weights_path = "res10_300x300_ssd_iter_140000.caffemodel"
if os.path.exists(prototxt_path) and os.path.exists(weights_path):
    face_net = cv2.dnn.readNetFromCaffe(prototxt_path, weights_path)
    print("Face DNN Loaded successfully.")
else:
    print("WARNING: Face DNN files missing.")
    face_net = None

# ------------- #
# Core Predict  #
# ------------- #

def process_frame(frame, confidence_threshold=0.2):
    if face_net is None:
        return []

    h, w = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104.0, 177.0, 123.0))
    face_net.setInput(blob)
    detections = face_net.forward()
    
    results = []
    
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > confidence_threshold:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
            
            startX, startY = max(0, startX), max(0, startY)
            endX, endY = min(w - 1, endX), min(h - 1, endY)
            
            fw, fh = endX - startX, endY - startY
            
            if fw == 0 or fh == 0: continue

            # Expand bottom padding to capture chin/neck where incorrectly-worn
            # masks (chin strap, below-nose masks) typically appear
            pad_x = int(fw * 0.05)
            pad_y_top = int(fh * 0.05)
            pad_y_bottom = int(fh * 0.30)  # was 0.1 — capture chin/neck
            
            x1 = max(0, startX - pad_x)
            y1 = max(0, startY - pad_y_top)
            x2 = min(w, endX + pad_x)
            y2 = min(h, endY + pad_y_bottom)
            
            face_img = frame[y1:y2, x1:x2]
            if face_img.size == 0:
                continue

            face_rgb = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            input_tensor = transform(face_rgb).unsqueeze(0).to(device)
            
            with torch.no_grad():
                outputs = model(input_tensor)
                probs = torch.nn.functional.softmax(outputs, dim=1)
                
                # Boost incorrect_mask class to counter severe class imbalance
                # (incorrect_mask is ~3x underrepresented vs without_mask in training)
                probs[0, 0] *= 2.5  # was 1.8
                probs /= probs.sum()
                
                conf, predicted = torch.max(probs, 1)
                
            pred_class = class_names[predicted.item()]
            
            # Pack results for JSON/React
            results.append({
                "class_name": pred_class,
                "confidence": conf.item() * 100,
                "box": {
                    "x": int(x1),
                    "y": int(y1),
                    "width": int(x2 - x1),
                    "height": int(y2 - y1)
                }
            })
            
    return results

# --------- #
# API Routes#
# --------- #

@app.post("/api/detect/image")
async def detect_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        return {"error": "Invalid image"}
        
    detections = process_frame(frame)
    return {"results": detections, "total": len(detections)}

@app.post("/api/detect/video")
async def detect_video(file: UploadFile = File(...)):
    """
    Samples 1 frame per second from an uploaded video and runs
    face mask detection on each sample. Returns cumulative class counts.
    """
    contents = await file.read()
    
    # OpenCV VideoCapture needs a real file path, so write to a temp file
    suffix = ".mp4"
    if file.filename:
        ext = os.path.splitext(file.filename)[1]
        if ext:
            suffix = ext
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, mode='wb') as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    
    try:
        cap = cv2.VideoCapture(tmp_path)
        
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0:
            fps = 25  # fallback
        
        # Sample every N frames to get ~1 detection sample per second
        sample_interval = max(1, int(fps))
        
        total_counts = {"with_mask": 0, "without_mask": 0, "incorrect_mask": 0}
        frame_number = 0
        sampled_frames = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Only process at the sample rate
            if frame_number % sample_interval == 0:
                results = process_frame(frame)
                for detection in results:
                    cls = detection.get("class_name", "")
                    if cls in total_counts:
                        total_counts[cls] += 1
                sampled_frames += 1
            
            frame_number += 1
        
        cap.release()
        
        return {
            "total_counts": total_counts,
            "total_faces": sum(total_counts.values()),
            "frames_sampled": sampled_frames,
            "total_frames": frame_number
        }
    finally:
        # Always clean up the temp file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.websocket("/ws/detect/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive base64 frame from React
            data = await websocket.receive_text()
            
            # Decode base64
            encoded_data = data.split(',')[1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is not None:
                # Need to resize keeping aspect ratio to match React Webcam rendering coords, 
                # or react bounds calculation. Assuming react webcam scales down, so we process
                # the 640x480 standard webcam dimension.
                detections = process_frame(frame)
                await websocket.send_json({"results": detections})
            else:
                await websocket.send_json({"results": []})
                
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
