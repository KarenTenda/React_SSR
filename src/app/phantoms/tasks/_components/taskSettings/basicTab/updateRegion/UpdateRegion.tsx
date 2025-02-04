import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Urls from '@/lib/Urls'

function UpdateRegion({ regionId, savedRegionIDs, cameraId }: {
    regionId: string, savedRegionIDs: string[], cameraId: string
}) {

    const onChangeRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
    }

    return (
        <>
            <div className='flex flex-row gap-2'>
                <Select
                    value={regionId}
                    onValueChange={onChangeRegion}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                        {savedRegionIDs.map((regionId) => (
                            <SelectItem key={regionId} value={regionId}>
                                {regionId}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    type="text"
                    name="camera_id"
                    value={cameraId}
                    onChange={() => { }}
                    placeholder="Camera ID"
                    readOnly
                />
            </div>
            <Image
                src={`${Urls.fetchPhantomCameras}/${cameraId}/stream`}
                alt="Region"
                width={200}
                height={200}
                priority={true}
                unoptimized
            />
        </>
    )
}

export default UpdateRegion