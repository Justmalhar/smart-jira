import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Ticket } from '../types';
import TicketCard from './TicketCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tickets: Ticket[];
  onDeleteTicket: (ticketId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tickets, onDeleteTicket }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-gray-50 border-gray-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      case 'done':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getHeaderColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'text-gray-700 bg-gray-100';
      case 'in-progress':
        return 'text-blue-700 bg-blue-100';
      case 'done':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-0 ${getColumnColor(id)} border-2 rounded-lg p-4 transition-colors ${
        isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
      }`}
    >
      <div className={`flex items-center justify-between mb-4 p-2 rounded-md ${getHeaderColor(id)}`}>
        <h2 className="text-lg font-semibold capitalize">{title}</h2>
        <span className="text-sm font-medium bg-white px-2 py-1 rounded-full">
          {tickets.length}
        </span>
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        <SortableContext items={tickets.map((ticket) => ticket.id)} strategy={verticalListSortingStrategy}>
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onDelete={onDeleteTicket}
            />
          ))}
        </SortableContext>
        
        {tickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No tickets yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;