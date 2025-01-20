import dbConnect from "@/lib/mongo";
import Graph from '@/app/phantoms/workflows/schemas/GraphMongooseSchema';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect(); 

        // Find the graph by `graph_id`
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
