"use client"; // Ensure it's a client component

import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";

function Canvas({ children }: { children: React.ReactNode }) {
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

    useEffect(() => {
        // Ensure window is defined before accessing it
        if (typeof window !== "undefined") {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
    }, []);

    return (
        <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
                {children}
                <Circle x={200} y={100} radius={50} fill="green" />
            </Layer>
        </Stage>
    );
}

export default Canvas;
