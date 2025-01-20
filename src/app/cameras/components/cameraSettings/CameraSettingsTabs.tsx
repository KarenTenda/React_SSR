import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CameraBasicSettingsForm from "./cameraBasicSettings/BasicSettingsForm";
import { CameraSettings } from "../../schemas/CameraSettingsSchemas";
import { useState } from "react";

export function CameraSettingsTab({ camera }: { camera: CameraSettings | null }) {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="w-auto"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="calibration">Calibration</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <div className="h-[550px]">
        <TabsContent
          value="basic"
          className={`h-full flex items-center justify-center ${
            activeTab === "basic" ? "block" : "hidden"
          }`}
        >
          <CameraBasicSettingsForm camera={camera} />
        </TabsContent>
        <TabsContent
          value="calibration"
          className={`h-full flex items-center justify-center ${
            activeTab === "calibration" ? "block" : "hidden"
          }`}
        >
          <p className="text-gray-500">Calibration settings are under development.</p>
        </TabsContent>
        <TabsContent
          value="advanced"
          className={`h-full flex items-center justify-center ${
            activeTab === "advanced" ? "block" : "hidden"
          }`}
        >
          <p className="text-gray-500">Advanced settings are under development.</p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
