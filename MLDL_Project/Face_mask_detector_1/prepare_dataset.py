import os
import xml.etree.ElementTree as ET
import cv2
import numpy as np
import random
from tqdm import tqdm

def prepare_dataset(archive_dir="archive", output_dir="dataset", split_ratio=(0.7, 0.15, 0.15), seed=42):
    random.seed(seed)
    
    # Paths
    annotations_dir = os.path.join(archive_dir, "annotations")
    images_dir = os.path.join(archive_dir, "images")
    
    if not os.path.exists(annotations_dir) or not os.path.exists(images_dir):
        print(f"Error: Could not find annotations or images in {archive_dir}")
        return

    # Categories mapping
    categories = {
        "without_mask": "without_mask",
        "with_mask": "with_mask",
        "mask_weared_incorrect": "incorrect_mask"
    }
    
    # Create splits
    splits = ["train", "validation", "test"]
    for split in splits:
        for cat in categories.values():
            os.makedirs(os.path.join(output_dir, split, cat), exist_ok=True)
            
    # Gather all images/xmls
    xml_files = [f for f in os.listdir(annotations_dir) if f.endswith('.xml')]
    random.shuffle(xml_files)
    
    num_files = len(xml_files)
    train_end = int(num_files * split_ratio[0])
    val_end = train_end + int(num_files * split_ratio[1])
    
    train_files = xml_files[:train_end]
    val_files = xml_files[train_end:val_end]
    test_files = xml_files[val_end:]
    
    print(f"Total images: {num_files}")
    print(f"Train: {len(train_files)}, Val: {len(val_files)}, Test: {len(test_files)}")
    
    def process_files(files, split_name):
        print(f"Processing {split_name}...")
        face_count = 0
        for xml_file in tqdm(files):
            xml_path = os.path.join(annotations_dir, xml_file)
            tree = ET.parse(xml_path)
            root = tree.getroot()
            
            filename = root.find("filename").text
            image_path = os.path.join(images_dir, filename)
            
            if not os.path.exists(image_path):
                print(f"Warning: image {filename} not found.")
                continue
                
            img = cv2.imread(image_path)
            if img is None:
                continue
                
            objects = root.findall("object")
            for obj in objects:
                name = obj.find("name").text
                if name not in categories:
                    continue
                    
                target_cat = categories[name]
                
                bndbox = obj.find("bndbox")
                xmin = int(bndbox.find("xmin").text)
                ymin = int(bndbox.find("ymin").text)
                xmax = int(bndbox.find("xmax").text)
                ymax = int(bndbox.find("ymax").text)
                
                # Ensure bounds are within image
                xmin = max(0, xmin)
                ymin = max(0, ymin)
                xmax = min(img.shape[1], xmax)
                ymax = min(img.shape[0], ymax)
                
                if xmax <= xmin or ymax <= ymin:
                    continue # invalid box
                    
                # Crop face
                face = img[ymin:ymax, xmin:xmax]
                
                # Save cropped face
                face_filename = f"{filename.split('.')[0]}_{face_count}.jpg"
                save_path = os.path.join(output_dir, split_name, target_cat, face_filename)
                
                cv2.imwrite(save_path, face)
                face_count += 1
                
        print(f"Generated {face_count} face images for {split_name}.")
        
    process_files(train_files, "train")
    process_files(val_files, "validation")
    process_files(test_files, "test")
    print("Dataset preparation complete!")

if __name__ == "__main__":
    prepare_dataset()
