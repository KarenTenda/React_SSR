"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CameraSettingsSchema, CameraSettings } from "@/app/cameras/schemas/CameraSettingsSchemas";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Urls from "@/lib/Urls";
// import { CameraStructure } from "@/app/cameras/structure/CameraStructure";

const CameraBasicSettingsForm = ({ camera }: { camera: CameraSettings | null }) => {
  const { toast } = useToast();

  const form = useForm<CameraSettings>({
    resolver: zodResolver(CameraSettingsSchema),
    defaultValues: camera
  });

  async function onSubmit(data: CameraSettings) {
    console.log(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 max-h-[400px] overflow-y-auto">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    try {
      await axios.put(`${Urls.fetchPhantomCameras}/${camera?.id}`, data);

      toast({
        title: "Settings updated successfully!",
        description: "The camera settings have been updated and applied.",
      });
    } catch (error) {
      console.error("Error updating camera settings:", error);
      toast({
        title: "Failed to update settings",
        description: "There was an error updating the camera settings.",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-h-[500px] overflow-y-auto">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera ID</FormLabel>
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
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Camera Name</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="Enter Camera Name" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camera Type</FormLabel>
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
            name="source_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Type</FormLabel>
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

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Source"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Width"
                      {...field}
                      value={field.value[0] || ""}
                      onChange={(e) => field.onChange([+e.target.value, field.value[1]])}
                    />
                    <Input
                      type="number"
                      placeholder="Height"
                      {...field}
                      value={field.value[1] || ""}
                      onChange={(e) => field.onChange([field.value[0], +e.target.value])}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backend</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Backend"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Enabled</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horizontal_flip"
            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Horizontal Flip</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vertical_flip"
            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Vertical Flip</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="centre_crop"
            render={({ field }) => (
              <FormItem>

                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormLabel>Centre Crop</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rotation_angle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rotation Angle</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Rotation Angle"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="focus_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Focus Mode</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Focus Mode"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manual_focus_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manual focus value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Manual focus value"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exposure_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposure Mode</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Exposure Mode"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exposure_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exposure Time</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Exposure Time"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="white_balance_mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>White Balance Mode</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter White Balance Mode"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="white_balance_temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>White Balance Temperature</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter White Balance Temperature"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="power_line_frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power Line Frequency</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Power Line Frequency"
                    {...field}
                    value={field.value || 0}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="encoding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encoding</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Encoding"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zoom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zoom</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Zoom"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="calibration_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calibration ID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Calibration ID"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


        </form>
      </Form>
      <Button
        type="submit"
        // disabled={form.formState.isValid}
        className={`mt-4 bg-[#FA8072] text-white`}
      >
        Submit
      </Button>
    </>

  );
};

export default CameraBasicSettingsForm;
