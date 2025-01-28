"use client";

import React, { useState } from 'react';
import ModelCard from '../../components/modelCard/ModelCard';
import { useRouter } from 'next/navigation';
import ModelsDialog from '../../components/modelsDialog/ModelsDialog';
import { Button } from '@/components/ui/button';
import { BackIcon } from '@/public/assets/Icons';
import { ClickableIconButton } from './classifier/components';

function TrainModelPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleTrainModel = () => {
    setModalOpen(true);
  };

  const handleTestModel = () => {
    console.log('Test model button clicked');
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModelTypeSelect = (type: string) => {
    setModalOpen(false);
    router.push(`/phantoms/models/actions/trainModel/${type}`);
  };

  return (
    <>
      {/* put back buttton at the top left coner of the page */}
      <div className="absolute top-0 left-50 p-4">
        <ClickableIconButton
          onClick={() => router.push('/phantoms/models')}
          Icon={BackIcon}
        />
        {/* <Button 
          onClick={() => router.push('/phantoms/models')} 
          className="bg-[#FA8072] text-white px-4 py-2 rounded"
          variant="ghost"
          size="icon"
        >
          <BackIcon/>
        </Button> */}
      </div>
      <div className='min-h-screen flex flex-row items-center justify-center space-x-8'>
        <ModelCard
          title="Train Model"
          buttonText="Start Training"
          onModelsCardClick={handleTrainModel}
          img='/images/classify.png'
          description='Train existing or new model with your own data'
        />
        <ModelCard
          title="Test Model"
          buttonText="Start Testing"
          onModelsCardClick={handleTestModel}
          img='/images/human_pose_estimation_b.png'
          description='Test existing models.'
        />
        <ModelsDialog
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSelect={handleModelTypeSelect}
        />
      </div>
    </>

  );
};

export default TrainModelPage;
