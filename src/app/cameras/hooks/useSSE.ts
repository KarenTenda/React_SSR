// hooks/useSSE.ts
import { useEffect, useState } from 'react';

type EventData = {
  message: string;
};

export function useSSE(url: string) {
  const [data, setData] = useState<EventData | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      console.log('Raw event data:', event.data); // Debugging: Log raw event data
      try {
        // Here we just log the incoming raw data for debugging
        const parsedData: EventData = JSON.parse(event.data);
        setData(parsedData);
        console.log('Parsed event data:', parsedData); // Debugging: Log parsed event data
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    // Adding listeners for custom events
    eventSource.addEventListener('CameraServiceEventNames.CAMERA_REGISTERED', (event) => {
      console.log('Camera Registered Event:', event);
      setData({ message: `Received: ${event.data}` });
    });

    eventSource.addEventListener('CameraServiceEventNames.CAMERA_REINITIALIZED', (event) => {
      console.log('Camera Reinitialized Event:', event);
      setData({ message: `Received: ${event.data}` });
    });

    return () => {
      eventSource.close();
    };
  }, [url]);

  return data;
}
