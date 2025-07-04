# AI Jira Board

An AI-powered project management tool that breaks down your project ideas into actionable tasks using OpenAI's structured outputs. Features a beautiful kanban board interface with drag-and-drop functionality similar to Jira.

## Features

- **AI-Powered Task Generation**: Describe your project in natural language and get structured task breakdowns
- **Structured Outputs**: Uses OpenAI's structured outputs feature to ensure consistent, well-formatted task data
- **Twitter-like Composer**: Familiar interface for entering project prompts
- **Drag & Drop Kanban Board**: Move tasks between Todo, In Progress, and Done columns
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Task Management**: View task details, priorities, categories, and time estimates
- **Real-time Updates**: Seamless integration between frontend and backend

## Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** with structured outputs
- **CORS** for cross-origin requests
- **UUID** for unique task identifiers

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **React Textarea Autosize** for the composer

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-jira-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Enter your project idea** in the composer (similar to Twitter's interface)
   - Example: "Build a todo app with React and Node.js that allows users to create, edit, and delete tasks"

3. **Generate tasks** by clicking "Generate Tasks" or pressing Ctrl+Enter

4. **Manage your tasks** using the kanban board:
   - Drag tasks between columns (Todo, In Progress, Done)
   - View task details including priority, category, and time estimates
   - Delete tasks using the X button

## API Endpoints

- `POST /api/generate-tickets` - Generate tickets from a prompt
- `GET /api/tickets` - Get all tickets
- `PUT /api/tickets/:id/status` - Update ticket status
- `DELETE /api/tickets/:id` - Delete a specific ticket
- `DELETE /api/tickets` - Clear all tickets

## Project Structure

```
ai-jira-board/
├── server/
│   └── index.js          # Express server with OpenAI integration
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   └── PromptComposer.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types.ts
│   │   └── App.tsx
│   └── package.json
├── package.json
└── README.md
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key
- `PORT` - Server port (default: 5000)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)

## OpenAI Structured Outputs

This project uses OpenAI's structured outputs feature to ensure consistent task generation. The structured schema includes:

- **Title**: Brief task description
- **Description**: Detailed task requirements
- **Priority**: Low, Medium, or High
- **Estimated Hours**: Time estimate for completion
- **Category**: Task type (Frontend, Backend, Design, Testing, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**
   - Make sure your API key is correctly set in the `.env` file
   - Ensure you have sufficient API credits

2. **CORS Issues**
   - The server includes CORS middleware for development
   - For production, configure CORS for your specific domain

3. **Port Conflicts**
   - Change the PORT in `.env` if 5000 is already in use
   - Update REACT_APP_API_URL accordingly

### Development Tips

- Use the browser's developer tools to debug API calls
- Check the server console for detailed error messages
- The application stores tickets in memory by default - they will be lost on server restart

## Future Enhancements

- Database persistence (PostgreSQL, MongoDB)
- User authentication and authorization
- Real-time collaboration with WebSockets
- Advanced task filtering and search
- Project templates and saved prompts
- Integration with external tools (GitHub, Slack, etc.)
- Mobile app version