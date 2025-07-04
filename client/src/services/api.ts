import {
  Ticket,
  TicketGenerationResponse,
  TicketUpdateRequest,
  TicketUpdateResponse,
  TicketsResponse,
  PromptRequest,
  ErrorResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async generateTickets(prompt: string): Promise<TicketGenerationResponse> {
    const body: PromptRequest = { prompt };
    
    return this.request<TicketGenerationResponse>('/api/generate-tickets', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getTickets(): Promise<TicketsResponse> {
    return this.request<TicketsResponse>('/api/tickets');
  }

  async updateTicketStatus(
    ticketId: string,
    status: 'todo' | 'in-progress' | 'done'
  ): Promise<TicketUpdateResponse> {
    const body: TicketUpdateRequest = { status };
    
    return this.request<TicketUpdateResponse>(`/api/tickets/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async deleteTicket(ticketId: string): Promise<void> {
    await this.request<void>(`/api/tickets/${ticketId}`, {
      method: 'DELETE',
    });
  }

  async clearAllTickets(): Promise<void> {
    await this.request<void>('/api/tickets', {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();