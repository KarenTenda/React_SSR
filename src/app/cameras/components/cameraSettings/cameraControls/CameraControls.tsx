"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast"; 
// import axios from "axios";
// import Urls from "@/constants/Urls";
import { CameraSettings } from "../../../schemas/CameraSettingsSchemas";
import { Input } from "@/components/ui/input"; 
import { Switch } from "@/components/ui/switch";

const CameraControlPanel = ({ cameraSettings, setCameraSettings }: { 
  cameraSettings:CameraSettings, setCameraSettings: (settings: CameraSettings) => void
 }) => {
  const { toast } = useToast();
  // const [settings, setCameraSettings] = useState(camera);

  const handleSettingChange = async (name: string, value: any) => {
    try {
      setCameraSettings({
        ...cameraSettings,
        [name]: value,
      });

      console.log(`Updated ${name} to ${value}`);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating setting",
        description: `Failed to update ${name}. Please try again.`,
      });
    }
  };

  const handleInputChange = (setting: keyof CameraSettings, value: any) => {
    handleSettingChange(setting, value);
  };

  if (cameraSettings.white_balance_mode === null || cameraSettings.white_balance_mode === undefined) {
    handleSettingChange("white_balance_mode", 3);
  }

  if (cameraSettings.exposure_mode === null || cameraSettings.exposure_mode === undefined) {
    handleSettingChange("exposure_mode", 3);
  }

  
  return (
    <div className="p-4">
      {/* Exposure Time Control   
        AUTO = 3
        MANUAL = 1 
      */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Exposure Time</label>
        <Slider
          value={[cameraSettings.exposure_time || 0]}
          onValueChange={([newValue]) => handleSettingChange("exposure_time", newValue)}
          max={700}
          min={-15}
          disabled={cameraSettings.exposure_mode === 3} 
        />
        <Input
          type="number"
          value={cameraSettings.exposure_time || 0}
          onChange={(e) => handleInputChange("exposure_time", Number(e.target.value))}
          className="w-20 ml-2"
          disabled={cameraSettings.exposure_mode ? cameraSettings.exposure_mode === 3 : cameraSettings.exposure_mode === 1} 
        />
        <Checkbox
          checked={cameraSettings.exposure_mode === 1} 
          onCheckedChange={(checked) => handleSettingChange("exposure_mode", checked ? 1 : 3)} 
        />
      </div>

      {/* White Balance Temperature Control 
        AUTO = 3
        MANUAL = 0
      */}
       <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">White Balance</label>
        <Slider
          value={[cameraSettings.white_balance_temperature || 3]}
          onValueChange={([newValue]) =>
            handleSettingChange("white_balance_temperature", newValue)
          }
          max={10000}
          min={0}
          disabled={cameraSettings.white_balance_mode === 3 || undefined} // Converts null or undefined to false
        />
        <Input
          type="number"
          value={cameraSettings.white_balance_temperature || 3}
          onChange={(e) =>
            handleInputChange("white_balance_temperature", Number(e.target.value))
          }
          className="w-20 ml-2"
          disabled={cameraSettings.white_balance_mode === 3 || undefined} // Converts null or undefined to false
        />
        <Checkbox
          checked={cameraSettings.white_balance_mode === 0}
          onCheckedChange={(checked) =>
            handleSettingChange("white_balance_mode", checked ? 0 : 3)
          }
        />
      </div>

      {/* Resolution Control */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Resolution</label>
        <Input
          type="number"
          placeholder="Width"
          value={cameraSettings.resolution[0] || 0}
          onChange={(e) =>
            handleInputChange("resolution", [
              Number(e.target.value),
              cameraSettings.resolution[1],
            ])
          }
          className="w-20"
        />
        <Input
          type="number"
          placeholder="Height"
          value={cameraSettings.resolution[1] || 0}
          onChange={(e) =>
            handleInputChange("resolution", [
              cameraSettings.resolution[0],
              Number(e.target.value),
            ])
          }
          className="w-20"
        />
      </div>

      {/* Rotation Angle Control */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Rotation Angle</label>
        <Slider
          value={[cameraSettings.rotation_angle || 0]}
          onValueChange={([newValue]) => handleSettingChange("rotation_angle", newValue)}
          max={360}
          min={0}
        />
        <Input
          type="number"
          value={cameraSettings.rotation_angle || 0}
          onChange={(e) => handleInputChange("rotation_angle", Number(e.target.value))}
          className="w-20 ml-2"
        />
      </div>

      {/* Zoom Control */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Zoom</label>
        <Slider
          value={[cameraSettings.zoom || 0]}
          onValueChange={([newValue]) => handleSettingChange("zoom", newValue)}
          max={180}
          min={0}
        />
        <Input
          type="number"
          value={cameraSettings.zoom || 0}
          onChange={(e) => handleInputChange("zoom", Number(e.target.value))}
          className="w-20 ml-2"
        />
      </div>

      {/* Center crop Control */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Center Crop</label>
        <Switch
          checked={cameraSettings.centre_crop || false}
          onCheckedChange={(checked) => handleSettingChange("centre_crop", checked)}
        />
      </div>

      {/* Enabled Toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Enabled</label>
        <Switch
          checked={cameraSettings.enabled}
          onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
        />
      </div>

      {/* Horizontal Flip Toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Horizontal Flip</label>
        <Switch
          checked={cameraSettings.horizontal_flip || false}
          onCheckedChange={(checked) => handleSettingChange("horizontal_flip", checked)}
        />
      </div>

      {/* Vertical Flip Toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="w-32">Vertical Flip</label>
        <Switch
          checked={cameraSettings.vertical_flip || false}
          onCheckedChange={(checked) => handleSettingChange("vertical_flip", checked)}
        />
      </div>

    </div>
  );
};

export default CameraControlPanel;
