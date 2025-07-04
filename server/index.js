const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage for tickets (in production, use a database)
let tickets = [];

// JSON Schema for structured outputs
const ticketSchema = {
  type: "object",
  properties: {
    tickets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Brief title of the task"
          },
          description: {
            type: "string",
            description: "Detailed description of what needs to be done"
          },
          priority: {
            type: "string",
            enum: ["Low", "Medium", "High"],
            description: "Priority level of the task"
          },
          estimatedHours: {
            type: "number",
            description: "Estimated hours to complete the task"
          },
          category: {
            type: "string",
            description: "Category or type of work (e.g., Frontend, Backend, Design, Testing)"
          }
        },
        required: ["title", "description", "priority", "estimatedHours", "category"],
        additionalProperties: false
      }
    }
  },
  required: ["tickets"],
  additionalProperties: false
};

// API Routes

// Generate tickets from prompt
app.post('/api/generate-tickets', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `You are a project management assistant. Break down the given project or task into specific, actionable tickets. Each ticket should be a concrete task that can be assigned to a developer. Consider different aspects like frontend, backend, database, testing, documentation, etc. Make sure each ticket is:
          
          1. Specific and actionable
          2. Has a clear deliverable
          3. Can be completed independently or with minimal dependencies
          4. Includes technical details where relevant
          5. Has realistic time estimates
          
          Focus on creating 3-8 tickets that cover all aspects of the project.`
        },
        {
          role: "user",
          content: `Please break down this project into specific development tickets: ${prompt}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ticket_breakdown",
          schema: ticketSchema
        }
      }
    });

    const generatedTickets = JSON.parse(response.choices[0].message.content);
    
    // Add metadata to each ticket
    const ticketsWithMetadata = generatedTickets.tickets.map(ticket => ({
      id: uuidv4(),
      ...ticket,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // Store tickets in memory
    tickets.push(...ticketsWithMetadata);

    res.json({ tickets: ticketsWithMetadata });
  } catch (error) {
    console.error('Error generating tickets:', error);
    res.status(500).json({ error: 'Failed to generate tickets' });
  }
});

// Get all tickets
app.get('/api/tickets', (req, res) => {
  res.json({ tickets });
});

// Update ticket status
app.put('/api/tickets/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    tickets[ticketIndex].status = status;
    tickets[ticketIndex].updatedAt = new Date().toISOString();

    res.json({ ticket: tickets[ticketIndex] });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// Delete ticket
app.delete('/api/tickets/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = tickets.length;
    tickets = tickets.filter(ticket => ticket.id !== id);

    if (tickets.length === initialLength) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// Clear all tickets
app.delete('/api/tickets', (req, res) => {
  tickets = [];
  res.json({ message: 'All tickets cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});