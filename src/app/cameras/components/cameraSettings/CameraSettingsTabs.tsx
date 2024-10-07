import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import CameraBasicSettingsForm from "./cameraBasicSettings/BasicSettingsForm"
import { CameraSettings } from "../../schemas/CameraSettingsSchemas"

export function CameraSettingsTab({ camera }: { camera: CameraSettings | null }) {
  return (
    <Tabs defaultValue="basic" className="w-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="calibration">Calibration</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <CameraBasicSettingsForm
            camera={camera}
        />
      </TabsContent>
      <TabsContent value="calibration">

      </TabsContent>
    </Tabs>
  )
}
