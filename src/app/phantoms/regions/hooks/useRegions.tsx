"use client";
import { useEffect, useState } from 'react';
import { RegionStructure } from '../structures/RegionStructure';
import { RegionService } from '../services/RegionService';
import Urls from '@/lib/Urls';
import { useToast } from '@/components/ui/use-toast';

function useRegionService(): [RegionStructure[], string[]] {
  const [regions, setRegions] = useState<RegionStructure[]>([]);
  const [savedRegionIDs, setSavedRegionIDs] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await RegionService(Urls.fetchRegions);
        setSavedRegionIDs(data.map((region) => region.id));
        setRegions(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh Oh! Something went wrong",
          description: "Unable to connect to the server or fetch data",
        });
      }
    };

    fetchData();
  }, []);

  return [regions, savedRegionIDs];
};

export default useRegionService;