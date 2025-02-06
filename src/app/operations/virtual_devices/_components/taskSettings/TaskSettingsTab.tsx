import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { TaskStructure } from "../../structure/TaskStructure"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AdvancedTaskSettings from "./advancedTab/AdvancedTaskSettings";
import BasicTaskSettingsForm from "./basicTab/BasicTaskSettings";

export function TaskSettingsTab({ task }: { task: TaskStructure | null }) {
    const [activeTab, setActiveTab] = useState("basic");

    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-auto"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Task</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <div className="h-[550px]">
                <TabsContent
                    value="basic"
                    className={`h-full flex items-center justify-center ${activeTab === "basic" ? "block" : "hidden"
                        }`}
                >
                    <BasicTaskSettingsForm task={task} />
                </TabsContent>
                <TabsContent
                    value="advanced"
                    className={`h-full flex items-center justify-center ${activeTab === "advanced" ? "block" : "hidden"
                        }`}
                >
                    <AdvancedTaskSettings task={task} />
                </TabsContent>
            </div>
        </Tabs>
    )
}
