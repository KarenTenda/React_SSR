import React, { useState } from 'react'
import { TaskStructure } from '../../../structure/TaskStructure'
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Urls from '@/lib/Urls';
import { useToast } from '@/components/ui/use-toast';

export default function AdvancedTaskSettings({ task }: { task: TaskStructure | null }) {
    const { toast } = useToast();
    const [textareaValue, setTextareaValue] = useState(JSON.stringify(task, null, 2));

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const parsedJson = JSON.parse(textareaValue);
            const component = {
              "component_id": task?.id,
              "update_model": parsedJson
            }
            await axios.post(`${Urls.fetchPhantomComponents}/`, component);
            toast({
                variant: "default",
                title: "Success",
                description: "Component settings updated successfully.",
            });
          } catch (error) {
            toast({
                variant: "destructive",
                title: "Error updating setting",
                description: `Failed to update ${task?.id}. Please try again.`,
              });
          }
    };

    return (
        <div className="grid w-full gap-2">
            <Textarea
                placeholder="Enter Task settings here"
                value={textareaValue} 
                onChange={handleTextareaChange} 
                // className="h-[500px]"
                rows={25}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}
