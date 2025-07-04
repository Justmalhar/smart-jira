# Deployment Guide - Vercel

This guide walks you through deploying your AI Jira Board Next.js application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## Step 1: Prepare Your Project

### 1.1 Environment Variables
Create a `.env.local` file in your project root:
```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 1.2 Verify Your Project Structure
Your project should look like this:
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
│   │   ├── PromptComposer.tsx
│   │   └── TicketCard.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── tickets.ts
│   └── types/
│       └── ticket.ts
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
└── .env.example
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? → No
   - What's your project's name? → `ai-jira-board` (or your preferred name)
   - In which directory is your code located? → `./`
   - Want to override the settings? → No

### Option B: Deploy via Vercel Dashboard

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Step 3: Configure Environment Variables

### In Vercel Dashboard:
1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your actual OpenAI API key
   - **Environments**: Production, Preview, Development

### Via Vercel CLI:
```bash
vercel env add OPENAI_API_KEY production
```

## Step 4: Deploy Production Build

### Via CLI:
```bash
vercel --prod
```

### Via Dashboard:
- Push to your main branch
- Vercel will automatically deploy

## Step 5: Custom Domain (Optional)

1. **Go to your project dashboard**
2. **Navigate to Settings → Domains**
3. **Add your custom domain**
4. **Configure DNS settings** as instructed by Vercel

## Step 6: Verify Deployment

1. **Visit your deployed URL**
2. **Test the application**:
   - Enter a project prompt
   - Generate tickets
   - Test drag & drop functionality
   - Test ticket deletion

## Production Optimizations

### 1. Environment-Specific Configuration
Update your `next.config.js` for production:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
```

### 2. Add Analytics (Optional)
Enable Vercel Analytics:
```bash
npm install @vercel/analytics
```

Add to your `layout.tsx`:
```javascript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Troubleshooting

### Common Issues:

1. **Build Errors**:
   - Check TypeScript errors: `npm run type-check`
   - Verify all dependencies are installed
   - Check API routes are properly typed

2. **OpenAI API Errors**:
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the API key has the right permissions

3. **Environment Variables Not Working**:
   - Redeploy after adding environment variables
   - Check variable names match exactly
   - Verify variables are set for correct environments

### Build Commands:
```bash
# Type check
npm run type-check

# Build locally
npm run build

# Start production server locally
npm run start
```

## Performance Monitoring

1. **Enable Vercel Speed Insights**:
   ```bash
   npm install @vercel/speed-insights
   ```

2. **Add to your app**:
   ```javascript
   import { SpeedInsights } from '@vercel/speed-insights/next'
   
   // Add to your layout.tsx
   <SpeedInsights />
   ```

## Security Considerations

1. **API Rate Limiting**: Consider implementing rate limiting for OpenAI API calls
2. **Input Validation**: Validate all user inputs
3. **CORS**: Configure CORS properly for your domain
4. **Environment Variables**: Never commit `.env.local` to version control

## Scaling Considerations

For production use, consider:
1. **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB)
2. **Authentication**: Add user authentication
3. **Caching**: Implement Redis or similar for ticket caching
4. **Error Monitoring**: Add Sentry or similar for error tracking

## Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Check your deployment logs in Vercel dashboard