import sys
from pathlib import Path
from ultralytics import YOLO
from ultralytics.utils import LOGGER

def train_yolo():
    # Convert input arguments to Path objects
    # dataset_path = r"C:\Users\KarenT\Desktop\Personal Projects\React\React_SSR\datasets\c57bbab7-4d38-4587-acdc-db9384fc9643"
    # model_save_path = r"C:\Users\KarenT\Desktop\Personal Projects\React\React_SSR\models\c57bbab7-4d38-4587-acdc-db9384fc9643"  
    # epochs = 10
    # batch_size = 32
    # learning_rate = 0.01
    dataset_path = Path(sys.argv[1]).resolve()  # Dataset folder
    model_save_path = Path(sys.argv[2]).resolve()  # Model save location
    epochs = int(sys.argv[3])
    batch_size = int(sys.argv[4])
    learning_rate = float(sys.argv[5])

    # Debugging prints
    print(f"Dataset Path: {dataset_path}")
    print(f"Checking if dataset exists: {dataset_path.exists()}")

    # Verify dataset structure
    # train_dir = r"C:\Users\KarenT\Desktop\Personal Projects\React\React_SSR\datasets\c57bbab7-4d38-4587-acdc-db9384fc9643\train"
    # val_dir = r"C:\Users\KarenT\Desktop\Personal Projects\React\React_SSR\datasets\c57bbab7-4d38-4587-acdc-db9384fc9643\val"
    # dataset_yaml = r"C:\Users\KarenT\Desktop\Personal Projects\React\React_SSR\datasets\c57bbab7-4d38-4587-acdc-db9384fc9643\dataset.yaml"

    train_dir = dataset_path / "train"
    val_dir = dataset_path / "val"
    # dataset_yaml = dataset_path / "dataset.yaml"

    print(f"Train Directory: {train_dir}, Exists: {train_dir.exists()}")
    print(f"Val Directory: {val_dir}, Exists: {val_dir.exists()}")
    # print(f"Dataset YAML: {dataset_yaml}, Exists: {dataset_yaml.exists()}")

    if not train_dir.exists() or not val_dir.exists():
        raise FileNotFoundError(f"Dataset structure is incorrect. Train or val folder is missing in {dataset_path}")

    # Load YOLO model
    model = YOLO("yolov8n-cls.pt")

    # Start training
    model.train(
        data=str(dataset_path),  
        epochs=epochs,
        batch=batch_size,
        lr0=learning_rate,
        imgsz=224,
        project=str(model_save_path),
        name="trained_model"
    )

if __name__ == "__main__":
    train_yolo()
