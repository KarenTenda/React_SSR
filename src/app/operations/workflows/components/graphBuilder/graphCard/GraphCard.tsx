import React from 'react'
import { Card, CardContent, CardTitle, CardDescription, CardImg } from '@/components/ui/card'
import { WorkflowIcon, DeleteIcon } from '@/public/assets/Icons'
import Urls from '@/lib/Urls'
import { useRouter } from 'next/navigation'
import ClickableIconButton from '@/components/custom/buttons/ClickableIconButton'


const GraphCard = ({ graph, deleteGraph }: 
    { 
        graph: any, 
        deleteGraph: () => void
    }) => {
        const router = useRouter();

        const handleGraphClick = () => {
            const url = `/operations/workflows/components/graphBuilder/${graph.id}?settings=${encodeURIComponent(JSON.stringify(graph))}`;
            router.push(url);
        };
        
        

    return (
        <>
            <Card className='mb-4 space-y-2'>
                <CardImg
                    src={`/images/default-image.jpg`}
                    loading="lazy"
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <CardContent className='space-y-2'>
                    <CardTitle>Name: {graph.name}</CardTitle>
                    <CardDescription>ID: {graph.id}</CardDescription>
                    <div>
                        <ClickableIconButton Icon={WorkflowIcon} onClick={handleGraphClick} tooltipText="Display Graph" disabled={false}/>
                        <ClickableIconButton Icon={DeleteIcon} onClick={deleteGraph} tooltipText='Delete' disabled={true} />
                    </div>
                </CardContent>
            </Card>
        </>

    )
}

export default GraphCard