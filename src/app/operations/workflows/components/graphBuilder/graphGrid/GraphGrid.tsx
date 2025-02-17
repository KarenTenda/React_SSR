import React from 'react'
import TestGraphCard from '../graphCard/TestGraphCard'
import { EditorGraphType } from '../editor/[editorId]/playground_ext';
// import { EditorGraphType } from '../../../types/EditorCanvasTypes'

const GraphGrid = () => {
    const [graphs, setGraphs] = React.useState<EditorGraphType[]>([]);

    const onGetGraphs = async () => {
        const response = await fetch('/api/graphs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log("Graphs : ",data);
        setGraphs(data.graphs);
    }

    React.useEffect(() => {
        onGetGraphs();
    }, []);

    return (
        <>
            {/* {graphs.map((graph, index) => (
                <GraphCard
                    key={index}
                    graph={graph}
                    deleteGraph={() => console.log('Delete graph', graph)}
                />
            ))} */}
            {graphs?.length ?
                graphs.map((graph, index) => (
                    <TestGraphCard
                        key={index}
                        id={graph.graph_id}
                        name={graph.name}
                        description={graph.description}
                        publish={graph.publish}
                    />
                )) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h2 className="text-lg">No workflows found</h2>
                        <p className="text-sm text-gray-500">Create a new workflow to get started</p>
                    </div>
                )}
        </>
    )
}

export default GraphGrid