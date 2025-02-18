import mongoose, { Schema, Document } from 'mongoose';
import { EditorNode, EditorEdge, EditorHandle } from '../components/graphBuilder/editor/[editorId]/playground_ext';

interface IGraph extends Document {
    graph_id: string;
    name: string;
    description: string;
    publish: boolean | null;
    nodes: EditorNode[];
    edges: EditorEdge[];
    subgraphs?: IGraph[];
}

const EditorHandleSchema = new Schema<EditorHandle>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    datatype: { type: String, required: true },
    dataTypeColor: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    settings: {
        immutable: { type: Boolean, required: true },
    },
});

const EditorNodeSchema = new Schema<EditorNode>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    data: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        completed: { type: Boolean, required: true },
        current: { type: Boolean, required: true },
        metadata: {
            inputs: { type: Number, required: true },
            outputs: { type: Number, required: true },
            selectedHandle: EditorHandleSchema,
            inputHandles: [EditorHandleSchema],
            outputHandles: [EditorHandleSchema],
        },
        specificType: { type: String, required: true },
    },
});

const EditorEdgeSchema = new Schema<EditorEdge>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    sourceHandleId: { type: String, required: true },
    targetHandleId: { type: String, required: true },
    data: {
        sourceHandleData: EditorHandleSchema,
        targetHandleData: EditorHandleSchema,
    },
});

const GraphMongooseSchema = new Schema<IGraph>({
    graph_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    publish: { type: Boolean, default: null },
    nodes: [EditorNodeSchema],
    edges: [EditorEdgeSchema],
    subgraphs: [{ type: Schema.Types.ObjectId, ref: 'Graph', default: [] }],
});

export default mongoose.models.Graph || mongoose.model<IGraph>('Graph', GraphMongooseSchema);