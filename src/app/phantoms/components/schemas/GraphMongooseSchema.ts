// Mongodb schema
import mongoose, { Schema, Document } from 'mongoose';

interface Node {
    id: string;
    type?: string; // optional for custom types
    data: { label: string };
    position: { x: number; y: number };
}

interface Edge {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
}

interface IGraph extends Document {
    graph_id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
}

const NodeSchema = new Schema<Node>({
    id: { type: String, required: true },
    type: { type: String },
    data: { label: { type: String, required: true } },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
});

const EdgeSchema = new Schema<Edge>({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    animated: { type: Boolean }
});

const GraphMongooseSchema = new Schema<IGraph>({
    graph_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    nodes: [NodeSchema],
    edges: [EdgeSchema]
});

export default mongoose.models.Graph || mongoose.model<IGraph>('Graph', GraphMongooseSchema);