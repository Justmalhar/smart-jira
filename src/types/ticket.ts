export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  estimatedHours: number;
  category: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
  updatedAt: string;
}

export interface TicketGenerationResponse {
  tickets: Ticket[];
}

export interface TicketsResponse {
  tickets: Ticket[];
}

export interface TicketUpdateRequest {
  status: 'todo' | 'in-progress' | 'done';
}

export interface TicketUpdateResponse {
  ticket: Ticket;
}

export interface PromptRequest {
  prompt: string;
}

export interface ErrorResponse {
  error: string;
}