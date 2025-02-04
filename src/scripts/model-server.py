import os
import sys
from pathlib import Path
from ultralytics import YOLO
from flask import Flask, request, jsonify
import requests
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# -------------------- 📌 TRAIN MODEL ENDPOINT -------------------- #
@app.route("/train", methods=["POST"])
def train():
    try:
        data = request.json
        dataset_id = data.get("datasetId")
        epochs = data.get("epochs", 10)  # Default: 10
        batch_size = data.get("batchSize", 32)  # Default: 32
        learning_rate = data.get("learningRate", 0.01)  # Default: 0.01

        if not dataset_id:
            return jsonify({"error": "No dataset ID provided"}), 400

        dataset_path = Path(os.getcwd()) / "datasets" / dataset_id
        model_save_path = Path(os.getcwd()) / "models" / dataset_id

        # Verify dataset structure
        train_dir = dataset_path / "train"
        val_dir = dataset_path / "val"

        if not train_dir.exists() or not val_dir.exists():
            return jsonify({"error": f"Dataset structure incorrect in {dataset_path}"}), 400

        print(f"🚀 Training YOLO model with dataset {dataset_id}...")

        model = YOLO("yolov8n-cls.pt")
        model.train(
            data=str(dataset_path),
            epochs=int(epochs),
            batch=int(batch_size),
            lr0=float(learning_rate),
            imgsz=224,
            project=str(model_save_path),
            name="trained_model"
        )

        return jsonify({"message": f"Training complete! Model saved at {model_save_path}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- 📌 PREDICT MODEL ENDPOINT -------------------- #
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        model_id = data.get("id")
        image_url = data.get("imageUrl")

        if not model_id:
            return jsonify({"error": "No model ID provided"}), 400
        if not image_url:
            return jsonify({"error": "No image URL provided"}), 400

        model_path = Path(os.getcwd()) / "models" / model_id / "trained_model" / "weights" / "best.pt"

        if not model_path.exists():
            return jsonify({"error": f"Model not found at {model_path}"}), 404

        print(f"✅ Loading YOLO model from: {model_path}")
        model = YOLO(str(model_path))

        class_labels = model.names
        predictions = []

        print("📹 Processing video stream (capturing only first frame)...")

        results_generator = model.predict(source=image_url, device="cuda:0", task="classify", stream=True, verbose=False)

        for r in results_generator:
            if r.probs is not None:
                class_indices = r.probs.top5  
                confidences = r.probs.top5conf  

                predictions.append([
                    {"label": class_labels[int(cls)], "confidence": float(conf)} 
                    for cls, conf in zip(class_indices, confidences)
                ])
            
            print(f"✅ Predictions Extracted (First Frame Only): {predictions}")
            break  # Stop after the first frame

        if not predictions:
            return jsonify({"error": "No predictions generated"}), 500

        return jsonify({"predictions": predictions})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch image: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500


# -------------------- 📌 START FLASK SERVER -------------------- #

if __name__ == "__main__":
    host = os.getenv("NEXT_BACKEND_SERVER_HOST")
    port = int(os.getenv("NEXT_BACKEND_SERVER_PORT"))
    print(f"🚀 YOLO Server running at http://{host}:{port}/")
    app.run(host=host, port=port, debug=True)
