# AI Jira Board

An AI-powered project management tool that breaks down your project ideas into actionable tasks using OpenAI's structured outputs. Features a beautiful kanban board interface with drag-and-drop functionality similar to Jira.

## 🚀 Latest Update: Next.js Migration

This project has been **migrated from Express.js + React to Next.js 14** with the following improvements:

- ✅ **Next.js 14** with App Router and API Routes
- ✅ **Production-ready** with optimized build settings
- ✅ **Vercel deployment** ready with comprehensive guide
- ✅ **TypeScript** throughout the entire application
- ✅ **Server-side rendering** for better performance
- ✅ **Modern architecture** with collocated API routes

## Features

- **AI-Powered Task Generation**: Describe your project in natural language and get structured task breakdowns
- **Structured Outputs**: Uses OpenAI's structured outputs feature to ensure consistent, well-formatted task data
- **Twitter-like Composer**: Familiar interface for entering project prompts
- **Drag & Drop Kanban Board**: Move tasks between Todo, In Progress, and Done columns
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Task Management**: View task details, priorities, categories, and time estimates
- **Real-time Updates**: Seamless integration between frontend and backend

## Tech Stack

### Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 18** with modern hooks

### Backend
- **Next.js API Routes** for serverless functions
- **OpenAI API** with structured outputs
- **Server-side rendering** and API endpoints

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **React Textarea Autosize** for the composer

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- OpenAI API key

## Quick Start

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
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start the Next.js development server on `http://localhost:3000`.

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
- `PUT /api/tickets/[id]/status` - Update ticket status
- `DELETE /api/tickets/[id]` - Delete a specific ticket
- `DELETE /api/tickets` - Clear all tickets

## Project Structure

```
ai-jira-board/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-tickets/
│   │   │   │   └── route.ts
│   │   │   └── tickets/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           ├── route.ts
│   │   │           └── status/
│   │   │               └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── TicketCard.tsx
│   │   └── PromptComposer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── tickets.ts
│   └── types/
│       └── ticket.ts
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key

## OpenAI Structured Outputs

This project uses OpenAI's structured outputs feature to ensure consistent task generation. The structured schema includes:

- **Title**: Brief task description
- **Description**: Detailed task requirements
- **Priority**: Low, Medium, or High
- **Estimated Hours**: Time estimate for completion
- **Category**: Task type (Frontend, Backend, Design, Testing, etc.)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app is using Vercel:

1. **Push your code to GitHub**
2. **Import your repo in Vercel**
3. **Add environment variables**:
   - `OPENAI_API_KEY=your_openai_api_key_here`
4. **Deploy!**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Alternative Deployment Options

- **Vercel**: Best for Next.js apps (recommended)
- **Netlify**: Good alternative with similar features
- **Railway**: Great for full-stack apps
- **AWS/Google Cloud**: For more control and scalability

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

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
   - Make sure your API key is correctly set in the `.env.local` file
   - Ensure you have sufficient API credits
   - Verify the API key has the correct permissions

2. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Ensure all dependencies are installed: `npm install`
   - Clear Next.js cache: `rm -rf .next`

3. **Environment Variables**
   - Use `.env.local` for local development
   - Never commit `.env.local` to version control
   - For production, set environment variables in your hosting platform

### Development Tips

- Use the browser's developer tools to debug API calls
- Check the development console for detailed error messages
- The application stores tickets in memory by default - they will be lost on server restart
- For production, consider implementing database persistence

## Migration from Express.js Version

If you're migrating from the previous Express.js version:

1. **Backup your data** if you have any persistent storage
2. **Update your deployment** to use the new Next.js structure
3. **Environment variables** now use `.env.local` instead of `.env`
4. **API endpoints** are now at `/api/*` instead of requiring a separate server

## Future Enhancements

- Database persistence (PostgreSQL, MongoDB, Supabase)
- User authentication and authorization
- Real-time collaboration with WebSockets
- Advanced task filtering and search
- Project templates and saved prompts
- Integration with external tools (GitHub, Slack, etc.)
- Mobile app version
- AI-powered task prioritization
- Time tracking and reporting