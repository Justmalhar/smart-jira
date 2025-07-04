import { Ticket } from '@/types/ticket';

// In-memory storage for tickets (in production, use a database)
let tickets: Ticket[] = [];

export async function getTickets(): Promise<Ticket[]> {
  return tickets;
}

export async function addTickets(newTickets: Ticket[]): Promise<Ticket[]> {
  tickets.push(...newTickets);
  return newTickets;
}

export async function updateTicketStatus(
  ticketId: string,
  status: 'todo' | 'in-progress' | 'done'
): Promise<Ticket | null> {
  const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
  if (ticketIndex === -1) {
    return null;
  }

  tickets[ticketIndex].status = status;
  tickets[ticketIndex].updatedAt = new Date().toISOString();
  return tickets[ticketIndex];
}

export async function deleteTicket(ticketId: string): Promise<boolean> {
  const initialLength = tickets.length;
  tickets = tickets.filter(ticket => ticket.id !== ticketId);
  return tickets.length !== initialLength;
}

export async function clearAllTickets(): Promise<void> {
  tickets = [];
}