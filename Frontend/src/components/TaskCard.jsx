import React from 'react';
import { Calendar, CheckCircle, Circle, Clock, Edit2, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-green-100 text-green-800 border-green-200',
    };

    const statusIcons = {
        pending: <Circle className="h-4 w-4" />,
        in_progress: <Clock className="h-4 w-4" />,
        completed: <CheckCircle className="h-4 w-4" />,
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={clsx(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
                    statusColors[task.status]
                )}>
                    {statusIcons[task.status]}
                    <span className="capitalize">{task.status.replace('_', ' ')}</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

            {task.due_date && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-50">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
