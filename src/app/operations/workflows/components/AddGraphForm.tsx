"use client";

import { GraphZodSchema } from '../schemas/GraphFormSchema';
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"
// import { onCreateGraph } from '@/app/api/graphs/route';
import { useModal } from '@/providers/modal-provider';
import { v4 as uuidv4 } from 'uuid';

type Props = {
    title?: string
    subTitle?: string
}


const AddGraphForm = ({ title, subTitle }: Props) => {
    const { setClose } = useModal()
    const form = useForm({
        mode: 'onChange',
        resolver: zodResolver(GraphZodSchema),
        defaultValues: {
            graph_id: uuidv4(),
            name: '',
            description: '',
            nodes: [],
            edges: []
        }
    });

    const isLoading = form.formState.isLoading
    const router = useRouter()

    const handleSubmit = async (values: z.infer<typeof GraphZodSchema>) => {
        console.log("send values", values)
        // const newValues = {
        //     graph_id: values.graph_id || uuidv4(),
        //     name: values.name,
        //     description: values.description,
        //     nodes: {
        //         id: "1234",
        //         type: "Camera",
        //         data: {},
        //         position: {
        //             x: 0,
        //             y: 0
        //         }
        //     },
        //     edges: values.edges

        // }
        const response = await fetch('/api/graphs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        console.log(response)

        if (response.ok) {
            toast.message('Graph saved successfully')
            router.refresh()
        }
        setClose()
    }

    return (
        <Card className="w-full max-w-[650px] border-none">
            {title && subTitle && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subTitle}</CardDescription>
                </CardHeader>
            )}
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4 text-left"
                    >
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="mt-4 bg-[#FA8072] text-white"
                            disabled={isLoading}
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                                </>
                            ) : (
                                'Save Settings'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default AddGraphForm