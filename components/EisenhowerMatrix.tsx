'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskInput from './TaskInput';
import MatrixQuadrant from './MatrixQuadrant';
import { Task, Quadrant } from '@/types';
import { Plus } from 'lucide-react';

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showInput, setShowInput] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const addTask = (title: string, quadrant: Quadrant) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      quadrant,
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setShowInput(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newQuadrant = over.id as Quadrant;

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, quadrant: newQuadrant } : task
      ));
    }
  };

  const getTasksByQuadrant = (quadrant: Quadrant) => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
            <span className="text-slate-600 group-hover:text-blue-600 font-medium">
              Add New Task
            </span>
          </button>
        ) : (
          <TaskInput onAdd={addTask} onCancel={() => setShowInput(false)} />
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <MatrixQuadrant
            quadrant="urgent-important"
            title="Urgent & Important"
            subtitle="Do First"
            color="bg-red-50"
            borderColor="border-red-300"
            textColor="text-red-900"
            tasks={getTasksByQuadrant('urgent-important')}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
          <MatrixQuadrant
            quadrant="not-urgent-important"
            title="Not Urgent & Important"
            subtitle="Schedule"
            color="bg-blue-50"
            borderColor="border-blue-300"
            textColor="text-blue-900"
            tasks={getTasksByQuadrant('not-urgent-important')}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
          <MatrixQuadrant
            quadrant="urgent-not-important"
            title="Urgent & Not Important"
            subtitle="Delegate"
            color="bg-yellow-50"
            borderColor="border-yellow-300"
            textColor="text-yellow-900"
            tasks={getTasksByQuadrant('urgent-not-important')}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
          <MatrixQuadrant
            quadrant="not-urgent-not-important"
            title="Not Urgent & Not Important"
            subtitle="Eliminate"
            color="bg-green-50"
            borderColor="border-green-300"
            textColor="text-green-900"
            tasks={getTasksByQuadrant('not-urgent-not-important')}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </DndContext>

      <div className="mt-8 p-4 bg-white rounded-lg border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Legend</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded border border-red-300"></div>
            <span>Do First - Crisis & Deadlines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded border border-blue-300"></div>
            <span>Schedule - Long-term Goals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded border border-yellow-300"></div>
            <span>Delegate - Interruptions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded border border-green-300"></div>
            <span>Eliminate - Time Wasters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
