"use client";

import React, { Suspense, useRef } from 'react';
import { Container } from 'react-bootstrap';
import GraphGrid from './components/graphBuilder/graphGrid/GraphGrid';

const ComponentsPage: React.FC = () => {
  const graphs: any = [
    {
      id: 1,
      type: 'line',
      name: 'Graph 1',
      nodes: [
        { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
        { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
        { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3' }
      ]
    },
    {
      id: 2,
      type: 'line',
      name: 'Graph 2', nodes: [
      ],
      edges: [
      ]
    },
    {
      id: 3,
      type: 'line',
      name: 'Graph 3',
      nodes: [
      ],
      edges: [
      ]
    }
  ]

  return (
    <Container fluid>
      <Suspense fallback={<div>Loading camera data...</div>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <GraphGrid graphs={graphs} />
        </div>
      </Suspense>
    </Container>
  );
}

export default ComponentsPage;
