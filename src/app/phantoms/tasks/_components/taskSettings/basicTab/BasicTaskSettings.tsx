import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { TaskStructure } from '../../../structure/TaskStructure'
import { TaskTypes } from '../../../types/TaskTypes';
import { CheckingTaskSchema, InferenceTaskSchema, TaskSettings, TrackingTaskSchema } from '../../../schemas/TasksSettingsSchema';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import Urls from '@/lib/Urls';
import InferenceTaskSettings from './InferenceTaskSettings';
import useRegionService from '@/app/phantoms/regions/hooks/useRegions';
import { InferenceTask } from '../../../structure/inference/InferenceStructure';
import { CheckingTask } from '../../../structure/CheckingStructure';

function BasicTaskSettingsForm({ task }: { task: TaskStructure | InferenceTask | CheckingTask | null }) {
    const [regions, savedRegionIDs] = useRegionService()
    const { toast } = useToast();

    const getSchema = (task: TaskStructure | null) => {
        if (!task) return z.object({});

        switch (task.type) {
            case TaskTypes.INFERENCE:
                return InferenceTaskSchema;
            case TaskTypes.CHECKING:
                return CheckingTaskSchema;
            case TaskTypes.TRACKING:
                return TrackingTaskSchema;
            default:
                return z.object({});
        }
    };

    const schema = getSchema(task);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: task || {},
    });

    const onSubmit = async (data: TaskStructure) => {
        try {
            const component = {
                "component_id": task?.id,
                "update_model": data
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
        <>
            <FormProvider {...form}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-h-[500px] overflow-y-auto">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter Camera ID"
                                            {...field}
                                            readOnly
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Type</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter Camera Type"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="specific_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specific Type</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter Source Type"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {task?.type === TaskTypes.INFERENCE && (
                            <InferenceTaskSettings task={task as InferenceTask} savedRegionIDs={savedRegionIDs} />
                        )}

                    </form>
                </Form>
            </FormProvider>
            <Button
                type="submit"
                // disabled={form.formState.isValid}
                className={`mt-4 bg-[#FA8072] text-white`}
            >
                Submit
            </Button>
        </>
    )
}

export default BasicTaskSettingsForm