import { NextResponse } from "next/server";
import axios from "axios";
import { spawn } from "child_process";
// import { exec } from "child_process";
// import path from "path";

const INFERENCE_SERVER_URL = "http://0.0.0.0:50050/predict";
const condaEnvName = "vision_v5_py311";
const scriptPath = "C:/Users/KarenT/Desktop/Personal_Projects/React/React_SSR/src/scripts/predict_model.py";

async function isServerRunning() {
  try {
    const response = await axios.get(INFERENCE_SERVER_URL);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}


function startInferenceServer() {
    return new Promise((resolve, reject) => {
        console.log("🚀 Starting inference server...");

        const pythonProcess = spawn("conda", [
            "run", "-n", condaEnvName, "python", scriptPath
        ], {
            shell: true,
            env: {
                ...process.env,
                PYTHONIOENCODING: "utf-8",
                LANG: "en_US.UTF-8"
            }
        });

        pythonProcess.stdout.on("data", (data) => {
            console.log(`Server: ${data}`);
            if (data.toString().includes("Running on")) {
                console.log("✅ Flask inference server started!");
                resolve(true);
            }
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Server Error: ${data}`);
        });

        pythonProcess.on("error", (error) => {
            console.error(`❌ Error starting server: ${error.message}`);
            reject(error);
        });

        pythonProcess.on("exit", (code) => {
            console.log(`🚨 Server exited with code: ${code}`);
        });
    });
}



export async function POST(req: Request) {
  try {
    const { id, imageUrl } = await req.json();

    if (!id || !imageUrl) {
      return NextResponse.json({ success: false, message: "ID and imageUrl are required" });
    }

    console.log(`🟢 Processing frame from: ${imageUrl}`);

    // Step 1: Check if server is running
    // const isRunning = await isServerRunning();
    // if (!isRunning) {
    //   console.log("🔴 Inference server is NOT running. Attempting to start...");
    //   await startInferenceServer();
    // }

    console.log(`🟢 Moving to Step 2`);

    // Step 2: Send image URL to Python server
    const response = await axios.post(INFERENCE_SERVER_URL, { id, imageUrl });

    console.log(`🟢 Inference response: ${response.data.predictions}`);
    return NextResponse.json({ success: true, predictions: response.data.predictions });

  } catch (error) {
    console.error("❌ Error in inference:", error);
    return NextResponse.json({ success: false, predictions: [], message: "Inference failed" });
  }
}
