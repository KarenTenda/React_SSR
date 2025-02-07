"use client";

import React from "react";
import ModelCard from "../../components/modelCard/ModelCard";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"; // Import ShadCN Breadcrumb

const models = [
  {
    title: "Classification Model",
    slug: "classifier",
    img: "/images/classify.png",
    description:
      "Categorize data for tasks such as content tagging, object recognition, and personalized recommendations with classification models powered by YOLOv8 by Ultralytics.",
  },
  {
    title: "Object Detection Model",
    slug: "object",
    img: "/images/object_detection.png",
    description:
      "Identify, locate, and track objects with object detection. Suitable for various applications, including human tracking and object counting in images and videos.",
  },
  {
    title: "Keypoint Model",
    slug: "pose",
    img: "/images/human_pose_estimation_b.png",
    description:
      "Utilize keypoint annotations for accurate human pose estimation, enhancing fitness tracking, gesture recognition, and improving user experience through facial expression analysis.",
  },
];

const TrainModelPage = () => {
  const router = useRouter();

  const handleModelNavigation = (slug: string) => {
    router.push(`/models/actions/trainModel/${slug}`);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-800 flex flex-col">
      {/* ✅ Breadcrumbs Instead of Back Button */}
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 py-4 px-6 shadow-md">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/models">Models</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500 dark:text-gray-400">
                Train Model
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Description */}
        <p className="text-center text-lg max-w-3xl text-gray-700 dark:text-gray-300 mx-auto mt-2">
          Build and train AI models to classify images, detect objects, and analyze keypoints in photos and videos. Select a model type below to get started.
        </p>
        <hr className="w-full max-w-3xl border-gray-300 dark:border-gray-600 mx-auto mt-2" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-10 px-4 flex flex-col items-center">
        {/* Model Cards */}
        <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-6 w-full max-w-5xl mt-6">
          {models.map((model, index) => (
            <ModelCard
              key={model.slug}
              title={model.title}
              createModelButtonText="Create Model"
              isCreateTrainingButtonDisabled={true}
              testModelButtonText="Test Model"
              isTestModelButtonDisabled={false}
              onCreateModelClick={() => handleModelNavigation(model.slug)}
              onTestModelClick={() => console.log("Test model clicked")}
              img={model.img}
              description={model.description}
              isImageLeft={index % 2 === 0} // Alternate image position
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainModelPage;
