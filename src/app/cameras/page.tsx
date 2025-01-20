"use client";

import useCameraService from './hooks/useCameraService';
import React, { Suspense, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import CameraGrid from './components/cameraGrid/CameraGrid';
import Navbar from '@/components/navbar/Navbar';
import useNavbarComponents from '@/components/navbar/useNavbarComponents';
// import CameraEventsService from './services/CameraEventsService';

const CamerasPage: React.FC = () => {
    const [cameras, savedCameraIDs] = useCameraService();
    // const [searchQuery, setSearchQuery] = useState('');
    // const [sortOption, setSortOption] = useState('Name');
    // const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');

    // const filteredCameras = cameras
    //     .filter(
    //         (camera) =>
    //             camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //             camera.id.toString().includes(searchQuery)
    //     )
    //     .sort((a, b) => {
    //         let comparison = 0;

    //         if (sortOption === "Name") {
    //             comparison = a.name.localeCompare(b.name);
    //         } else if (sortOption === "Type") {
    //             comparison = a.type.localeCompare(b.type);
    //         }

    //         return sortOrder === "ascending" ? comparison : -comparison;
    //     });

    // const handleSearch = (query: string) => {
    //     setSearchQuery(query);
    // };

    // const handleSortChange = (option: string) => {
    //     setSortOption(option);
    //     // sort cameras based on option
    //     if (option === 'Name') {
    //         cameras.sort((a, b) => a.name.localeCompare(b.name));
    //     } else if (option === 'Type') {
    //         cameras.sort((a, b) => a.type.localeCompare(b.type));
    //     }
    // };

    // const toggleSortOrder = () => {
    //     setSortOrder((prevOrder) =>
    //         prevOrder === "ascending" ? "descending" : "ascending"
    //     );
    // };
    const {
        filteredAndSortedItems: filteredCameras,
        handleSearch,
        handleSortChange,
        toggleSortOrder,
        sortKey,
        sortOrder,
    } = useNavbarComponents({
        items: cameras,
        searchKeys: ["name", "id"],
        initialSortKey: "name",
        sortOptions: [
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
        ],
    });



    return (
        <div className='flex-1 inline-flex flex-col max-h-full px-1 pt-3 md:pt-3 h-full gap-4 w-full overflow-y-auto'>
            <Navbar
                pageName="Cameras"
                searchPlaceholder="Search cameras..."
                sortOption={sortKey}
                sortOptions={[
                  { key: "name", label: "Name" },
                  { key: "type", label: "Type" },
                ]}
                onSearch={handleSearch}
                onSortChange={handleSortChange}
                sortOrder={sortOrder}
                onSortOrderChange={toggleSortOrder}
                addButtonText='Add Camera'
            />
            {cameras.length > 0 ? (
                <Container fluid>
                    <Suspense fallback={<div>Loading camera data...</div>}>
                        <div className='flex flex-1 px-3 md:px-5 pb-0'>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                <CameraGrid cameras={filteredCameras} />
                                {/* <CameraEventsService /> */}
                            </div>
                        </div>

                    </Suspense>
                </Container>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <div className="text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="t-20"
                        >
                            <path d="M16 7h.01" /><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
                            <path d="m20 7 2 .5-2 .5" /><path d="M10 18v3" /><path d="M14 17.75V21" />
                            <path d="M7 18a6 6 0 0 0 3.84-10.61" />

                        </svg>
                        <p className="text-lg text-gray-500">No cameras available.</p>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default CamerasPage;
