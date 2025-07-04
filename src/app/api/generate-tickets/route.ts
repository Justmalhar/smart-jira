import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { addTickets } from '@/lib/tickets';

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
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

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: 'No content received from OpenAI' }, { status: 500 });
    }
    
    const generatedTickets = JSON.parse(content);
    
    // Add metadata to each ticket
    const ticketsWithMetadata = generatedTickets.tickets.map((ticket: any) => ({
      id: uuidv4(),
      ...ticket,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return NextResponse.json({ tickets: ticketsWithMetadata });
  } catch (error) {
    console.error('Error generating tickets:', error);
    return NextResponse.json({ error: 'Failed to generate tickets' }, { status: 500 });
  }
}