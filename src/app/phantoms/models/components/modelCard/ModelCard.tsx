"use client";

import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardImg, CardTitle } from '@/components/ui/card'
import React from 'react'
import { CardBody } from 'react-bootstrap'

interface ModelCardProps {
    title: string;
    buttonText: string;
    onModelsCardClick: () => void;
    img:string;
    description?: string;
  }

const ModelCard = ({title, buttonText, onModelsCardClick, img, description}:ModelCardProps) => {
  return (
    <Card className="flex flex-col p-4 shadow-lg">
        <CardImg 
            src={img} 
            loading="lazy"
            style={{ height: '200px', objectFit: 'cover' }}
        />
        <CardBody>
            <CardTitle className='text-md'>{title}</CardTitle>
            <CardDescription className='text-sm text-gray-500'>{description}</CardDescription>
            <Button variant="outline" onClick={onModelsCardClick}>{buttonText}</Button>
        </CardBody>
    </Card>
  )
}

export default ModelCard