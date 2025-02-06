
import dbConnect from '@/lib/mongo';
import Graph from '@/app/operations/workflows/schemas/GraphMongooseSchema';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    const data = await request.json();  

    try {
        await dbConnect();  

        const newGraph = new Graph({
            graph_id: data.graph_id || uuidv4(),  
            name: data.name,
            description: data.description,
            nodes: data.nodes,
            edges: data.edges
        });

        console.log('New graph:', newGraph);

        await newGraph.save();  // Save the new graph to MongoDB

        return NextResponse.json({ success: true, message: 'Graph saved successfully' });
    } catch (error) {
        console.error('Error saving graph:', error);
        return NextResponse.json({ success: false, message: 'Error saving graph' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();  // Ensure the MongoDB connection

        const graphs = await Graph.find({});  // Find all graphs in the database

        return NextResponse.json({ success: true, graphs });
    } catch (error) {
        console.error('Error fetching graphs:', error);
        return NextResponse.json({ success: false, message: 'Error fetching graphs' }, { status: 500 });
    }
}
