"use client";
import { useEffect, useState } from 'react';
import { TaskStructure } from '../structure/TaskStructure';
import { TaskService } from '../services/TaskService';
import Urls from '@/lib/Urls';
import { useToast } from '@/components/ui/use-toast';

function useTaskService(): [TaskStructure[], string[]] {
  const [tasks, setTasks] = useState<TaskStructure[]>([]);
  const [savedTaskIDs, setSavedTaskIDs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await TaskService(Urls.fetchPhantomComponents);
        setSavedTaskIDs(data.map((task) => task.id));
        setTasks(data);
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

  return [tasks, savedTaskIDs];
};

export default useTaskService;

export function useTaskServiceByType(type: string): TaskStructure[] {
  const [tasks] = useTaskService();
  const filteredTasks = tasks.filter((task) => task.type === type);
  return filteredTasks;
}

export function useInferenceTaskIDs(): string[] {
  const tasks = useTaskServiceByType("inference");
  return tasks.map((task) => task.id);
}

export function useCheckingTaskIDs(): string[] {
  const tasks = useTaskServiceByType("checking");
  return tasks.map((task) => task.id);
}

export function useTrackingTaskIDs(): string[] {
  const tasks = useTaskServiceByType("tracking");
  return tasks.map((task) => task.id);
}