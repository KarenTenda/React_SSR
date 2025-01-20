"use client";

import useTaskService from './hooks/useTaskService';
import React, { Suspense, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import Navbar from '@/components/navbar/Navbar';
import useNavbarComponents from '@/components/navbar/useNavbarComponents';
import TaskGrid from './_components/taskGrid/TaskGrid';

const TasksPage: React.FC = () => {
    const [tasks, savedTaskIDs] = useTaskService();

    const {
        filteredAndSortedItems: filteredTasks,
        handleSearch,
        handleSortChange,
        toggleSortOrder,
        sortKey,
        sortOrder,
    } = useNavbarComponents({
        items: tasks,
        searchKeys: ["type", "id"],
        initialSortKey: "type",
        sortOptions: [
            { key: "id", label: "Id" },
            { key: "type", label: "Type" },
        ],
    });

    // when add task button clicked, it should open a 

    return (
        <div className='flex-1 inline-flex flex-col max-h-full px-1 pt-3 md:pt-3 h-full gap-4 w-full overflow-y-auto'>
            <Navbar
                pageName="Tasks"
                searchPlaceholder="Search tasks..."
                sortOption={sortKey}
                sortOptions={[
                  { key: "id", label: "Id" },
                  { key: "type", label: "Type" },
                ]}
                onSearch={handleSearch}
                onSortChange={handleSortChange}
                sortOrder={sortOrder}
                onSortOrderChange={toggleSortOrder}
                onAddClick={() => { }}
                addButtonText='Add Task'
                isAddButtonDisabled={true}
            />
            {tasks.length > 0 ? (
                <Container fluid>
                    <Suspense fallback={<div>Loading task data...</div>}>
                        <div className='flex flex-1 px-3 md:px-5 pb-0'>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                <TaskGrid tasks={filteredTasks} />
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
                        <p className="text-lg text-gray-500">No tasks available.</p>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default TasksPage;
