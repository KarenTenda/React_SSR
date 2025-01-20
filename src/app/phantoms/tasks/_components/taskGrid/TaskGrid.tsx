import React from 'react'
import { TaskStructure } from '../../structure/TaskStructure'
import useTaskOperations from '../../hooks/useTaskOperations'
import TaskCard from '../taskCard/TaskCard'
import TaskSettingsModal from '../taskSettings/TaskSettingsModal'

const TaskGrid = ({ tasks }: { tasks: TaskStructure[] }) => {
    const {
        handleEditTaskSettings,
        deleteTask,
        handleClose,
        showModal,
        setShowModal,
        selectedTask,
        setSelectedTask,
        displayedTasks
    } = useTaskOperations(tasks);

    return (
        <>
            {tasks.map((task, index) => (
                <TaskCard
                    key={index}
                    task={task}
                    tasks={tasks}
                    handleEditTasksSettings={handleEditTaskSettings}
                    deleteTask={deleteTask}
                />
            ))}
            <TaskSettingsModal
                open={showModal}
                onClose={handleClose}
                task={selectedTask}
            />
        </>
    )
}

export default TaskGrid