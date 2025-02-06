import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Node } from '../../../schemas/NodeSchema';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { CardBody } from 'react-bootstrap';

interface NodePreviewProps {
    data: Node;
}

const NodePreview: React.FC<NodePreviewProps> = ({ data }) => {
    return (
        <Card className="border border-gray-700 shadow-lg p-4 rounded-lg relative w-60 bg-gray-800 text-white">

            <CardHeader className="text-center text-sm font-bold text-white">
                {data.name}
            </CardHeader>

            <Separator className="my-2" />

            <CardBody>
                <div className="absolute left-0 top-12 flex flex-col items-start space-y-2">
                    {data.pins
                        .filter(pin => pin.type === 'input')
                        .map((pin, index) => (
                            <div key={pin.id} className="flex items-center mb-2">
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={pin.id}
                                    className="bg-blue-500 h-3 w-3"
                                />
                                <span className="ml-2 text-sm">{pin.label}</span>
                            </div>
                        ))}
                </div>

                <div className="bg-gray-900 py-4 px-2 rounded-md my-4 text-center">
                    {data.content || `${data.name} Content`}
                </div>

                <div className="absolute right-0 top-12 flex flex-col items-end space-y-2">
                    {data.pins
                        .filter(pin => pin.type === 'output')
                        .map((pin, index) => (
                            <div key={pin.id} className="flex items-center mb-2">
                                <span className="mr-2 text-sm">{pin.label}</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={pin.id}
                                    className="bg-green-500 h-3 w-3"
                                />
                            </div>
                        ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default NodePreview;