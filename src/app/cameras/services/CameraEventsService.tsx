
'use client';

import { useEffect } from 'react';
import { useSSE } from '../hooks/useSSE';
import { useToast } from '@/components/ui/use-toast';

const CameraEventsService: React.FC = () => {
  const data = useSSE('http://127.0.0.1:5001/camera/event/stream');
  const { toast } = useToast();

  useEffect(() => {
    // Trigger the toast when data is received and not null
    if (data?.message) {
      toast({
        title: 'New Event Received',
        description: data.message,
      });
    }
  }, [data, toast]); // Dependencies array ensures effect runs when data or toast function changes

  return null; // No UI needed here
};

export default CameraEventsService;
