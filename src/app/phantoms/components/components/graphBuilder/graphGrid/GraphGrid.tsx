import React from 'react'
import GraphCard from '../graphCard/GraphCard'

const GraphGrid = ({ graphs }: { graphs: any[] }) => {

    return (
        <>
            {graphs.map((graph, index) => (
                <GraphCard
                    key={index}
                    graph={graph}
                    deleteGraph={() => console.log('Delete graph', graph)}
                />
            ))}
        </>
    )
}

export default GraphGrid