"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import React from "react";
import { CardBody } from "react-bootstrap";

interface ModelCardProps {
  title: string;
  createModelButtonText: string;
  onCreateModelClick: () => void;
  isCreateTrainingButtonDisabled: boolean;
  testModelButtonText: string;
  onTestModelClick: () => void;
  isTestModelButtonDisabled: boolean;
  img: string;
  description?: string;
  isImageLeft?: boolean; // Determines image placement
}

const ModelCard = ({
  title,
  createModelButtonText,
  isCreateTrainingButtonDisabled,
  testModelButtonText,
  isTestModelButtonDisabled,
  onCreateModelClick,
  onTestModelClick,
  img,
  description,
  isImageLeft = true, // Default to left
}: ModelCardProps) => {
  return (
    <Card className="flex flex-col md:flex-row items-center p-4 shadow-lg w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg transition-all">
      {/* Image Section */}
      <div className={`w-[137px] h-[139px] flex-shrink-0 overflow-hidden border ${isImageLeft ? "order-1" : "order-2 md:ml-auto"}`}>
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Content Section */}
      <CardBody className="flex flex-col flex-grow p-4 order-2 md:order-1">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{description}</CardDescription>
        <div className="flex space-x-2 mt-3">
          <Button variant="outline" onClick={onCreateModelClick} disabled={!isCreateTrainingButtonDisabled}>
            {createModelButtonText}
          </Button>
          <Button variant="outline" onClick={onTestModelClick} disabled={!isTestModelButtonDisabled}>
            {testModelButtonText}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ModelCard;
