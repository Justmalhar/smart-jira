import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onDelete: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-teal-100 text-teal-800',
    ];
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing p-4 mb-3 ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">
          {ticket.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ticket.id);
          }}
          className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete ticket"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-3">
        {ticket.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
          {ticket.category}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{ticket.estimatedHours}h</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TicketCard;