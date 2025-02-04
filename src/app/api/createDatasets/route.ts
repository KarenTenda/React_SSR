import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Define dataset folder
const DATASET_DIR = path.join(process.cwd(), "datasets");

export async function POST(req: Request) {
  try {
    const { annotations } = await req.json(); 
    if (!annotations || annotations.length === 0) {
      return NextResponse.json({ success: false, message: "No classes provided" });
    }

    // Create a unique dataset ID
    const datasetId = uuidv4();
    const datasetPath = path.join(DATASET_DIR, datasetId);
    const trainPath = path.join(datasetPath, "train");
    const valPath = path.join(datasetPath, "val");

    // Ensure the dataset directories exist
    fs.mkdirSync(trainPath, { recursive: true });
    fs.mkdirSync(valPath, { recursive: true });

    // Process each class in annotations
    annotations.forEach(({ annotation_id, annotation }) => {
      const className = annotation.label.replace(/\s+/g, "_"); 
      const classTrainPath = path.join(trainPath, className);
      const classValPath = path.join(valPath, className);

      fs.mkdirSync(classTrainPath, { recursive: true });
      fs.mkdirSync(classValPath, { recursive: true });

      // Shuffle images and split into train/val (80/20)
      const shuffledImages = annotation.images.sort(() => 0.5 - Math.random());
      const trainImages = shuffledImages.slice(0, Math.floor(shuffledImages.length * 0.8));
      const valImages = shuffledImages.slice(Math.floor(shuffledImages.length * 0.8));

      // Save images
      trainImages.forEach((img, index) => saveImage(classTrainPath, img, index));
      valImages.forEach((img, index) => saveImage(classValPath, img, index));
    });

    return NextResponse.json({ success: true, datasetId });
  } catch (error) {
    console.error("Error creating dataset:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
}

// Helper function to save base64 image
function saveImage(folder: string, base64Data: string, index: number) {
  const filePath = path.join(folder, `image_${index + 1}.jpg`);
  const base64Image = base64Data.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFileSync(filePath, base64Image, "base64");
}

