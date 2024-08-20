"use client";
import { useEffect, useState } from 'react';
import { CameraStructure } from '../structure/CameraStructure';
import { CameraService } from '../services/CameraService';
import Urls from '@/constants/Urls';
import { useToast } from '@/components/ui/use-toast';
// import { useError } from '@/components/errorProvider/ErrorProvider';

function useCameraService(): [CameraStructure[], string[]] {
  const [cameras, setCameras] = useState<CameraStructure[]>([]);
  const [savedCameraIDs, setSavedCameraIDs] = useState<string[]>([]);
  const { toast } = useToast();
  //   const { handleError } = useError();

  // useEffect(() => {
  //   const fetchData = async () => {
  //   //   try {
  //       const availableCameras = await CameraService(Urls.fetchPhantomCameras);
  //       // console.log("Raw Camera Settings",JSON.stringify(availableCameras, null, 2))
  //       setCameras(availableCameras);
  //       setSavedCameraIDs(availableCameras.map((camera) => camera.id));
  //   //   } catch (error) {
  //   //     handleError('Failed to fetch cameras.');
  //   //     console.error('Failed to fetch cameras:', error);
  //   //   }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CameraService(Urls.fetchPhantomCameras);
        setSavedCameraIDs(data.map((camera) => camera.id));
        setCameras(data);
      } catch (error) {
        toast({
          title: "Uh Oh! Something went wrong",
          description: "Unable to connect to the server or fetch data",
        });
      }
    };

    fetchData();
  }, []);

  return [cameras, savedCameraIDs];
};

export default useCameraService;