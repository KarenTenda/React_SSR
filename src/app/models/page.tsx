"use client";

import useNavbarComponents from '@/components/navbar/useNavbarComponents';
import React, { Suspense, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ModelStructure } from './structure/ModelStructure';
import Navbar from '@/components/navbar/Navbar';
import { useRouter } from 'next/navigation';

const Model: ModelStructure = {
  id: '1',
  name: 'Pose Model',
  model_task: 'Pose Estimation',
  model_format: 'ONNX',
  model_input_size: [256, 256]
}

const models: ModelStructure[] = [];

function ModelsPage() {
  const router = useRouter();

  const onClickTrainModel = () => {
    router.push('/models/actions/trainModel');
  };
  

  const {
    filteredAndSortedItems: filteredModels,
    handleSearch,
    handleSortChange,
    toggleSortOrder,
    sortKey,
    sortOrder,
  } = useNavbarComponents({
    items: models,
    searchKeys: ["id", "name", "model_task", "model_format"],
    initialSortKey: "id",
    sortOptions: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "model_task", label: "Model Task" },
      { key: "model_format", label: "Model Format" }
    ],
  });

  return (
    <div className='flex-1 inline-flex flex-col max-h-full px-1 pt-3 md:pt-3 h-full gap-4 w-full overflow-y-auto'>
      <Navbar
        pageName="Models"
        searchPlaceholder="Search models..."
        sortOption={sortKey}
        sortOptions={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "model_task", label: "Model Task" },
          { key: "model_format", label: "Model Format" }
        ]}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        sortOrder={sortOrder}
        onSortOrderChange={toggleSortOrder}
        addButtonText='Train Model'
        isAddButtonDisabled={true}
        onAddClick={onClickTrainModel}
      />

      {models.length > 0 ? (
        <Container fluid>
          <Suspense fallback={<div>Loading camera data...</div>}>
            <div className='flex flex-1 px-3 md:px-5 pb-0'>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                
              </div>
            </div>

          </Suspense>
        </Container>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="t-20"
            >
              <path d="M16 7h.01" /><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
              <path d="m20 7 2 .5-2 .5" /><path d="M10 18v3" /><path d="M14 17.75V21" />
              <path d="M7 18a6 6 0 0 0 3.84-10.61" />

            </svg>
            <p className="text-lg text-gray-500">No models available.</p>
          </div>
        </div>
      )
      }
    </div>
  )
}

export default ModelsPage