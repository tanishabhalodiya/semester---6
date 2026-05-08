import os
import cv2
import torch
import torch.nn as nn
from torchvision import transforms
import numpy as np
import argparse

# Same CNN architecture
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

def main():
    parser = argparse.ArgumentParser(description="Face Mask Detection")
    parser.add_argument('--image', type=str, help='Path to image file for detection')
    parser.add_argument('--video', type=str, help='Path to video file for detection')
    parser.add_argument('--webcam', action='store_true', help='Use webcam for real-time detection')
    parser.add_argument('--confidence', type=float, default=0.2, help='Minimum probability to filter weak face detections')
    args = parser.parse_args()

    # Device configuration
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    # Load Model
    model_path = 'mask_model.pth'
    if not os.path.exists(model_path):
        print(f"Error: Model weights not found at {model_path}. Please train the model first.")
        return

    model = FaceMaskCNN().to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    # Transformations matches test_transforms
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # Class mapping from ImageFolder alphabetical order
    # Our folders are: incorrect_mask, with_mask, without_mask
    class_names = ['incorrect_mask', 'with_mask', 'without_mask']
    
    # Bounding Box Colors (BGR format for OpenCV)
    # Green -> With Mask
    # Red -> Without Mask
    # Orange -> Incorrect Mask
    colors = {
        'with_mask': (0, 255, 0),        # Green
        'without_mask': (0, 0, 255),     # Red
        'incorrect_mask': (0, 165, 255)  # Orange
    }

    # Load OpenCV DNN Face Detector (ResNet SSD)
    prototxt_path = "deploy.prototxt"
    weights_path = "res10_300x300_ssd_iter_140000.caffemodel"
    
    if not os.path.exists(prototxt_path) or not os.path.exists(weights_path):
        print("Error: DNN Face Detector files not found. Please ensure deploy.prototxt and res10_300x300_ssd_iter_140000.caffemodel exist.")
        return
        
    net = cv2.dnn.readNetFromCaffe(prototxt_path, weights_path)

    def detect_and_predict(frame):
        h, w = frame.shape[:2]
        
        # Preprocess the frame for the DNN face detector
        blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104.0, 177.0, 123.0))
        net.setInput(blob)
        detections = net.forward()
        
        faces = []
        # Loop over the detections
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            
            # Filter out weak detections
            if confidence > args.confidence:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                
                # Ensure bounding boxes fall within the dimensions of the frame
                startX, startY = max(0, startX), max(0, startY)
                endX, endY = min(w - 1, endX), min(h - 1, endY)
                
                faces.append((startX, startY, endX - startX, endY - startY))

        if len(faces) == 0:
            return frame

        for (x, y, fw, fh) in faces:
            # Expand bottom crop significantly to capture chin area where
            # incorrectly-worn masks (chin strap, below-nose) typically sit
            pad_x = int(fw * 0.05)
            pad_y_top = int(fh * 0.05)
            pad_y_bottom = int(fh * 0.30)  # was 0.1 — capture chin/neck
            
            x1 = max(0, x - pad_x)
            y1 = max(0, y - pad_y_top)
            x2 = min(frame.shape[1], x + fw + pad_x)
            y2 = min(frame.shape[0], y + fh + pad_y_bottom)
            
            face_img = frame[y1:y2, x1:x2]
            
            if face_img.size == 0:
                continue

            # Convert BGR to RGB
            face_rgb = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            
            # Preprocess
            input_tensor = transform(face_rgb).unsqueeze(0).to(device)
            
            # Predict
            with torch.no_grad():
                outputs = model(input_tensor)
                probs = torch.nn.functional.softmax(outputs, dim=1)
                
                # Boost probability for 'incorrect_mask' class to compensate for
                # severe class imbalance in training data (~3x fewer incorrect samples)
                # Also slightly suppress without_mask when it barely wins over incorrect_mask
                probs[0, 0] *= 2.5   # incorrect_mask boost (was 1.8)
                probs /= probs.sum() # renormalize
                
                confidence, predicted = torch.max(probs, 1)
                
            pred_class = class_names[predicted.item()]
            conf_score = confidence.item() * 100
            
            # Formatting Label
            label_text = f"{pred_class.replace('_', ' ').title()} ({conf_score:.1f}%)"
            color = colors[pred_class]
            
            # Draw bounding box and label
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # Background for label text
            (label_width, label_height), baseline = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
            cv2.rectangle(frame, (x1, y1 - label_height - 10), (x1 + label_width, y1), color, cv2.FILLED)
            cv2.putText(frame, label_text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
        return frame

    if args.image:
        if not os.path.exists(args.image):
            print(f"Error: Could not find image at {args.image}")
            return
            
        print(f"Processing image {args.image}...")
        img = cv2.imread(args.image)
        if img is None:
            print("Failed to load image.")
            return

        result_img = detect_and_predict(img)
        
        # Show image (Wait for key)
        cv2.imshow('Face Mask Detection', result_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        
    elif args.video:
        if not os.path.exists(args.video):
            print(f"Error: Could not find video at {args.video}")
            return
            
        print(f"Processing video {args.video}...")
        cap = cv2.VideoCapture(args.video)
        
        # Output video configuration
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        # Using mp4v for general mp4 support
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_path = 'output_' + os.path.basename(args.video)
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            result_frame = detect_and_predict(frame)
            out.write(result_frame)
            cv2.imshow('Face Mask Detection - Video', result_frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        cap.release()
        out.release()
        cv2.destroyAllWindows()
        print(f"Saved output video to {out_path}")
        
    elif args.webcam:
        print("Starting webcam... Press 'q' to quit.")
        cap = cv2.VideoCapture(0)
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame from webcam.")
                break
                
            result_frame = detect_and_predict(frame)
            cv2.imshow('Face Mask Detection - WebCam', result_frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
        cap.release()
        cv2.destroyAllWindows()
    else:
        print("Please specify --image <path>, --video <path>, or --webcam")

if __name__ == "__main__":
    main()
