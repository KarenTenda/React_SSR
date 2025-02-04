import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const MODEL_DIR = path.join(process.cwd(), "models");

if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
}

const FLASK_SERVER_URL = "http://127.0.0.1:50050"; 

export async function POST(req: Request) {
    try {
        const { datasetId, epochs, batchSize, learningRate } = await req.json();

        if (!datasetId) {
            return NextResponse.json({ success: false, message: "Dataset ID is required" });
        }

        console.log(`🚀 Sending training request to Flask server for dataset: ${datasetId}`);

        // Send request to Flask `/train` endpoint
        const response = await fetch(`${FLASK_SERVER_URL}/train`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ datasetId, epochs, batchSize, learningRate })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("✅ Training request successful:", result);
            return NextResponse.json({ success: true, message: "Training started", data: result });
        } else {
            console.error("❌ Training request failed:", result);
            return NextResponse.json({ success: false, message: "Training failed", error: result });
        }

    } catch (error) {
        console.error("❌ Error sending training request:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}


// export async function POST(req: Request) {
//     try {
//         const { datasetId, epochs, batchSize, learningRate } = await req.json();
//         if (!datasetId) return NextResponse.json({ success: false, message: "Dataset ID is required" });

//         const datasetPath = path.join(process.cwd(), "datasets", datasetId);
//         const modelSavePath = path.join(process.cwd(), "models", datasetId);
//         const scriptPath = path.join(process.cwd(), "src/scripts/train_model.py");

//         // Ensure dataset and script exist
//         if (!fs.existsSync(datasetPath)) return NextResponse.json({ success: false, message: "Dataset not found" });
//         if (!fs.existsSync(scriptPath)) return NextResponse.json({ success: false, message: "Script not found" });

//         // Ensure models directory exists
//         if (!fs.existsSync(modelSavePath)) {
//             console.log("📁 Creating model directory:", modelSavePath);
//             fs.mkdirSync(modelSavePath, { recursive: true });
//         }

//         console.log("✅ Starting YOLO training...");

//         const condaEnvName = "vision_v5_py311";

//         const pythonProcess = spawn("conda", [
//             "run", "-n", condaEnvName, "python",
//             scriptPath, datasetPath, modelSavePath, String(epochs), String(batchSize), String(learningRate)
//         ], {
//             shell: true,
//             env: {
//                 ...process.env,
//                 PYTHONIOENCODING: "utf-8",
//                 LANG: "en_US.UTF-8"
//             }
//         });
        

//         let output = "";
//         let errorOutput = "";

//         pythonProcess.stdout.on("data", (data) => {
//             output += data.toString();
//             console.log("✅ Python STDOUT:", data.toString());
//         });

//         pythonProcess.stderr.on("data", (data) => {
//             errorOutput += data.toString();
//             console.error("❌ Python STDERR:", data.toString());
//         });

//         return new Promise((resolve) => {
//             pythonProcess.on("close", (code) => {
//                 console.log(`🚨 Training process exited with code: ${code}`);
//                 if (code === 0 || output.includes("Training complete")) {
//                     resolve(NextResponse.json({ success: true, message: "Training completed", output }));
//                 } else {
//                     resolve(NextResponse.json({ success: false, message: "Training failed", output, errorOutput }));
//                 }
//             });
//         });

//     } catch (error) {
//         console.error("Error training model:", error);
//         return NextResponse.json({ success: false, message: "Internal Server Error" });
//     }
// }