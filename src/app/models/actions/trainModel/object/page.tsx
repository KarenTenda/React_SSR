import React from 'react'
import { Image } from 'react-bootstrap'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"; // Import ShadCN Breadcrumb


const TrainObjectModelPage = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-gray-800">
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 py-4 px-6 shadow-md">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/models">Models</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/models/actions/trainModel">Train Model</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-gray-500 dark:text-gray-400">
                Object Detection Model
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-xl font-bold text-center mt-2 text-gray-900 dark:text-white">
          Object Detection Model Training
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center">
            <Image
              src="/images/undraw_web-developer_ggt0.svg"
              alt="Description of the SVG"
              width={500}
              height={500}
            />
            <p className="text-lg text-gray-500">Object Page Underdevelopment.</p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default TrainObjectModelPage;