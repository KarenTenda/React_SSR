import os
from ultralytics import YOLO
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get request data
        data = request.json
        model_id = data.get("id")
        image_url = data.get("imageUrl")

        if not model_id:
            return jsonify({"error": "No model ID provided"}), 400
        if not image_url:
            return jsonify({"error": "No image URL provided"}), 400

        # Model path
        model_path = os.path.join(os.getcwd(), "models", model_id, "trained_model", "weights", "best.pt")
        
        if not os.path.exists(model_path):
            return jsonify({"error": f"Model not found at {model_path}"}), 404

        print(f"✅ Loading YOLO model from: {model_path}")
        model = YOLO(model_path)

        class_labels = model.names

        predictions = []

        print("📹 Processing video stream (capturing only first frame)...")

        # Run YOLO inference on a video stream, but only take the first frame
        results_generator = model.predict(source=image_url, device="cuda:0", task="classify", stream=True, verbose=False)

        for r in results_generator:
            if r.probs is not None:
                class_indices = r.probs.top5  # ✅ Already a list, no need for `.tolist()`
                confidences = r.probs.top5conf  # ✅ Already a list, no need for `.tolist()`

                predictions.append([
                    {"label": class_labels[int(cls)], "confidence": float(conf)} 
                    for cls, conf in zip(class_indices, confidences)
                ])
            
            print(f"✅ Predictions Extracted (First Frame Only): {predictions}")

            break  # 🚀 Stop after the first frame

        # Ensure predictions are not empty
        if not predictions:
            return jsonify({"error": "No predictions generated"}), 500

        return jsonify({"predictions": predictions})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch image: {str(e)}"}), 500
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == "__main__":
    print("🚀 YOLO Inference Server is running at http://0.0.0.0:50050/predict")
    app.run(host="0.0.0.0", port=50050, debug=True)
