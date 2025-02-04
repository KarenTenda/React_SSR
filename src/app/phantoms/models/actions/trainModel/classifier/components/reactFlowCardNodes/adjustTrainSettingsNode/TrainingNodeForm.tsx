"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrainModelSettings, trainModelSchema } from "./schemas/TrainingNodeSchema";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { SaveIcon } from "@/public/assets/Icons"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Urls from "@/lib/Urls";
import { Loader2 } from "lucide-react";

const batchSizeOptions = [16, 32, 64, 128, 256, 512];

export default function TrainModelForm({ datasetId, onTrainingComplete }: {
    datasetId: string,
    onTrainingComplete: () => void
}) {
    const [isTraining, setIsTraining] = useState(false);
    const { toast } = useToast();
    const form = useForm<TrainModelSettings>({
        resolver: zodResolver(trainModelSchema),
        defaultValues: {
            epochs: 3,
            learningRate: 0.01,
            batchSize: 32,
        },
    });

    const onSubmit = (values: TrainModelSettings) => {
        console.log("Updated settings:", values);
        toast({
            title: "Success!",
            // variant: "success",
            description: "Settings saved successfully.",
        });
    };

    const handleTrainModel = async (values: TrainModelSettings) => {
        console.log("Starting training with settings:", values);
        setIsTraining(true);
        try {
            const response = await fetch(Urls.fetchTrainResults, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    datasetId: datasetId,
                    epochs: values.epochs,
                    batchSize: values.batchSize,
                    learningRate: values.learningRate
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                console.log("Training successful:", data);
                onTrainingComplete();
                toast({
                    title: "Training successful!",
                    // variant: "success",
                    description: `Training successfully for ${datasetId}.`,
                });
                setIsTraining(false);
            } else {
                console.error("Training failed:", data.message);
                toast({
                    title: "Training Failed",
                    variant: "destructive",
                    description: data.message,
                });
                setIsTraining(false);
            }
        } catch (error) {
            console.error("Error:", error);
            setIsTraining(false);
        }
    };


    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex justify-between px-4 py-2">
                <CardTitle className="text-lg font-semibold">Train Model</CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrainModel(form.getValues())}
                    disabled={isTraining}
                >
                    {isTraining ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Training...
                        </>
                    ) : "Start Training"}

                </Button>
            </CardHeader>

            <div className="border-t border-gray-300" />

            <CardContent className="px-4 py-2">
                <Accordion type="single" collapsible>
                    <AccordionItem value="advanced-settings">
                        <AccordionTrigger>Advanced Settings</AccordionTrigger>
                        <AccordionContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Epochs Field */}
                                    <FormField
                                        control={form.control}
                                        name="epochs"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Epochs</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter number of epochs"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage>
                                                    {form.formState.errors.epochs?.message}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Learning Rate Field */}
                                    <FormField
                                        control={form.control}
                                        name="learningRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Learning Rate</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        placeholder="Enter learning rate"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage>
                                                    {form.formState.errors.learningRate?.message}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Batch Size Field */}
                                    <FormField
                                        control={form.control}
                                        name="batchSize"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Batch Size</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        defaultValue={field.value.toString()}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select batch size" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {batchSizeOptions.map((size) => (
                                                                <SelectItem key={size} value={size.toString()}>
                                                                    {size}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage>
                                                    {form.formState.errors.batchSize?.message}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end">
                                        <Button type="submit" variant='ghost'>
                                            <SaveIcon />
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
