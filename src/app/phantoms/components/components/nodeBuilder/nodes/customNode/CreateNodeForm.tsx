"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';  
import { useForm } from 'react-hook-form'; 

const nodeSchema = z.object({
  inputCount: z.number().min(1, { message: 'Must have at least 1 input.' }),
  outputCount: z.number().min(1, { message: 'Must have at least 1 output.' }),
  inputNames: z.array(z.string().nonempty({ message: 'Input name cannot be empty.' })),
  outputNames: z.array(z.string().nonempty({ message: 'Output name cannot be empty.' })),
});

type NodeFormData = z.infer<typeof nodeSchema>;

const CreateNodeForm = () => {
  const router = useRouter();
  const [inputNames, setInputNames] = useState<string[]>(['']);  
  const [outputNames, setOutputNames] = useState<string[]>(['']);  

  const form = useForm<NodeFormData>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      inputCount: 1,
      outputCount: 1,
      inputNames: [''],
      outputNames: [''],
    },
  });

  const updateInputNames = (count: number) => {
    setInputNames((prev) => {
      if (count > prev.length) {
        return [...prev, ...new Array(count - prev.length).fill('')];
      }
      return prev.slice(0, count);
    });
    form.setValue('inputNames', inputNames); 
  };

  const updateOutputNames = (count: number) => {
    setOutputNames((prev) => {
      if (count > prev.length) {
        return [...prev, ...new Array(count - prev.length).fill('')];
      }
      return prev.slice(0, count);
    });
    form.setValue('outputNames', outputNames);
  };

  const handleInputCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(event.target.value, 10);
    updateInputNames(count);
    form.setValue('inputCount', count);
  };

  const handleOutputCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(event.target.value, 10);
    updateOutputNames(count);
    form.setValue('outputCount', count);
  };

  const onSubmit = (data: NodeFormData) => {
    const inputs = JSON.stringify(data.inputNames);
    const outputs = JSON.stringify(data.outputNames);
    const pins = [
      ...data.inputNames.map((name, index) => ({ id: `input${index + 1}`, label: name, type: 'input' })),
      ...data.outputNames.map((name, index) => ({ id: `output${index + 1}`, label: name, type: 'output' })),
    ];

    const pinsJson = JSON.stringify(pins); 

    const queryUrl = `/phantoms/components/components/nodeBuilder/nodes/customNode/write-code?inputs=${encodeURIComponent(inputs)}&outputs=${encodeURIComponent(outputs)}&pins=${encodeURIComponent(pinsJson)}`;

    router.push(queryUrl);  
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Create Your Node</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-h-[500px] overflow-y-auto">
            <FormItem className="text-xl font-bold mb-4">Define Node Inputs and Outputs</FormItem>

            <FormField
              control={form.control}
              name="inputCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Inputs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Number of Inputs"
                      {...field}
                      onChange={handleInputCountChange}
                      value={inputNames.length}
                      min={1}
                      className="mt-1 w-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {inputNames.map((name, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`inputNames.${index}`} 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input {index + 1} Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={name}
                        onChange={(e) => {
                          const updatedNames = [...inputNames];
                          updatedNames[index] = e.target.value;
                          setInputNames(updatedNames);
                          form.setValue('inputNames', updatedNames);
                        }}
                        className="mt-1 w-full"
                        placeholder={`Input ${index + 1}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Number of Outputs */}
            <FormField
              control={form.control}
              name="outputCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Outputs</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Number of Outputs"
                      {...field}
                      onChange={handleOutputCountChange}
                      value={outputNames.length}
                      min={1}
                      className="mt-1 w-20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {outputNames.map((name, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`outputNames.${index}`} 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output {index + 1} Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={name}
                        onChange={(e) => {
                          const updatedNames = [...outputNames];
                          updatedNames[index] = e.target.value;
                          setOutputNames(updatedNames);
                          form.setValue('outputNames', updatedNames);
                        }}
                        className="mt-1 w-full"
                        placeholder={`Output ${index + 1}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {/* Submit Button */}
            <Button type="submit" className="mt-4 w-full">
              Next: Write Python Code
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateNodeForm;
