"use client";

import React, {useState, useEffect} from 'react'
import { TaskStructure } from '../structure/TaskStructure';

const useTaskOperations = (initialTasks:TaskStructure[]) => {
    const [displayedTasks, setDisplayedTasks] = useState<TaskStructure[]>(initialTasks);
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskStructure | null>(null);

    useEffect(() => {
        setDisplayedTasks(initialTasks);
    }, [initialTasks]);

    const handleEditTaskSettings = (task:TaskStructure) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const deleteTask = () => {
            
    };

    return {
        handleEditTaskSettings: handleEditTaskSettings,
        deleteTask,
        handleClose,
        showModal,
        setShowModal,
        selectedTask: selectedTask,
        setSelectedTask: setSelectedTask,
        displayedTasks: displayedTasks
    }
}

export default useTaskOperations