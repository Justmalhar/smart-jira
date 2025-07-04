'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Ticket } from '@/types/ticket';
import { apiService } from '@/lib/api';
import PromptComposer from './PromptComposer';
import KanbanColumn from './KanbanColumn';
import TicketCard from './TicketCard';

const KanbanBoard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  // Load tickets on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await apiService.getTickets();
      setTickets(response.tickets);
    } catch (err) {
      setError('Failed to load tickets');
      console.error('Error loading tickets:', err);
    }
  };

  const handleGenerateTickets = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.generateTickets(prompt);
      setTickets(prevTickets => [...prevTickets, ...response.tickets]);
    } catch (err) {
      setError('Failed to generate tickets. Please try again.');
      console.error('Error generating tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await apiService.deleteTicket(ticketId);
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
    } catch (err) {
      setError('Failed to delete ticket');
      console.error('Error deleting ticket:', err);
    }
  };

  const handleClearAllTickets = async () => {
    try {
      await apiService.clearAllTickets();
      setTickets([]);
    } catch (err) {
      setError('Failed to clear tickets');
      console.error('Error clearing tickets:', err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const ticket = tickets.find(t => t.id === active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATicket = tickets.some(t => t.id === activeId);
    const isOverATicket = tickets.some(t => t.id === overId);

    if (!isActiveATicket) return;

    // Dropping a ticket over another ticket
    if (isActiveATicket && isOverATicket) {
      setTickets(prevTickets => {
        const activeIndex = prevTickets.findIndex(t => t.id === activeId);
        const overIndex = prevTickets.findIndex(t => t.id === overId);

        if (prevTickets[activeIndex].status !== prevTickets[overIndex].status) {
          prevTickets[activeIndex].status = prevTickets[overIndex].status;
          return arrayMove(prevTickets, activeIndex, overIndex - 1);
        }

        return arrayMove(prevTickets, activeIndex, overIndex);
      });
    }

    // Dropping a ticket over a column
    const isOverAColumn = columns.some(col => col.id === overId);
    if (isActiveATicket && isOverAColumn) {
      setTickets(prevTickets => {
        const activeIndex = prevTickets.findIndex(t => t.id === activeId);
        prevTickets[activeIndex].status = overId as 'todo' | 'in-progress' | 'done';
        return [...prevTickets];
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTicket = tickets.find(t => t.id === activeId);
    if (!activeTicket) return;

    // Update ticket status on the server
    try {
      await apiService.updateTicketStatus(activeTicket.id, activeTicket.status);
    } catch (err) {
      setError('Failed to update ticket status');
      console.error('Error updating ticket status:', err);
      // Revert the change on error
      loadTickets();
    }
  };

  const getTicketsByStatus = (status: string) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const totalEstimatedHours = tickets.reduce((sum, ticket) => sum + ticket.estimatedHours, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Jira Board</h1>
          <p className="text-gray-600">Describe your project and let AI break it down into actionable tasks</p>
        </div>

        {/* Prompt Composer */}
        <PromptComposer onSubmit={handleGenerateTickets} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        {tickets.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Estimated Hours</div>
              <div className="text-2xl font-bold text-gray-900">{totalEstimatedHours}h</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">{getTicketsByStatus('in-progress').length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-green-600">{getTicketsByStatus('done').length}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {tickets.length > 0 && (
          <div className="mb-6 flex justify-end space-x-2">
            <button
              onClick={loadTickets}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={handleClearAllTickets}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tickets={getTicketsByStatus(column.id)}
                onDeleteTicket={handleDeleteTicket}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTicket ? (
              <TicketCard ticket={activeTicket} onDelete={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {tickets.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600">Start by describing your project idea above to generate AI-powered task breakdowns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;