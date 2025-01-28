"use client";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Urls from "@/lib/Urls";
import Image from "next/image";
import { useState } from "react";

const HomePage = () => {
  const [imageSrc, setImageSrc] = useState(`${Urls.fetchMainWindowCamera}`);
  const { toast } = useToast();

  const handleImageError = () => {
    setImageSrc('/images/default-image.jpg');
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request. Backend might not be connected.",
      action: (<ToastAction altText="Try again" onClick={handleRetry}>
        Try again
      </ToastAction>),
    });
  };

  const handleRetry = () => {
    setImageSrc(`${Urls.fetchMainWindowCamera}`);
  }

  return (
    <>
      <Image
        src={imageSrc}
        alt="Main Window Camera"
        width={800}
        height={450}
        // loading="lazy"
        priority={true}
        onError={handleImageError}
        unoptimized
      />
    </>
  );
};

export default HomePage;