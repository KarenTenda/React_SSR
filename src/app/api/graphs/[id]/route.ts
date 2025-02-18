import dbConnect from "@/lib/mongo";
import Graph from '@/app/operations/workflows/schemas/GraphMongooseSchema';
import { NextResponse } from 'next/server';

// ✅ GET: Fetch a graph by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const graph = await Graph.findOne({ graph_id: params.id });

        if (!graph) {
            return NextResponse.json({ success: false, message: 'Graph not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, graph });
    } catch (error) {
        console.error('Error fetching graph:', error);
        return NextResponse.json({ success: false, message: 'Error fetching graph' }, { status: 500 });
    }
}

// ✅ POST: Create a new graph
export async function POST(req: Request) {
    try {
        await dbConnect();
        const { graph_id, nodes, edges, subgraphs } = await req.json();

        // Check if graph already exists
        const existingGraph = await Graph.findOne({ graph_id });

        if (existingGraph) {
            return NextResponse.json({ success: false, message: "Graph already exists" }, { status: 409 });
        }

        // Create new graph entry
        const newGraph = new Graph({
            graph_id,
            nodes,
            edges,
            subgraphs: subgraphs || [], // Ensure subgraphs is an array
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newGraph.save();
        return NextResponse.json({ success: true, message: "Graph created successfully", graph: newGraph }, { status: 201 });

    } catch (error) {
        console.error("Error creating graph:", error);
        return NextResponse.json({ success: false, message: "Error creating graph" }, { status: 500 });
    }
}

// ✅ PUT: Update an existing graph
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        console.log("🔧 Connecting to DB...");
        await dbConnect();

        const requestText = await req.text();
        console.log("📦 Raw request body:", requestText);

        // Try parsing JSON manually to catch potential JSON errors
        let parsedData;
        try {
            parsedData = JSON.parse(requestText);
        } catch (jsonError) {
            console.error("❌ JSON Parse Error:", jsonError);
            return NextResponse.json({ success: false, message: "Invalid JSON body", error: jsonError }, { status: 400 });
        }

        const { nodes, edges } = parsedData;
        console.log("📥 Parsed request body:", JSON.stringify({ nodes, edges }, null, 2));

        if (!nodes || !edges) {
            return NextResponse.json({ success: false, message: "Missing nodes or edges data" }, { status: 400 });
        }

        // Update graph
        const updatedGraph = await Graph.findOneAndUpdate(
            { graph_id: params.id },
            { nodes, edges, updatedAt: new Date() },
            { new: true, upsert: true } // Creates if it doesn't exist
        );

        if (!updatedGraph) {
            throw new Error("Graph update failed");
        }

        console.log("✅ Graph successfully updated:", updatedGraph);

        return NextResponse.json({ success: true, message: "Graph updated successfully", graph: updatedGraph });

    } catch (error) {
        console.error("❌ Error updating graph:", error);

        return NextResponse.json({
            success: false,
            message: "Error updating graph",
            error: error,
        }, { status: 500 });
    }
}
