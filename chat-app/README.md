# ChatBot - Modern AI Chat ApplicationThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A complete, functional chatbot application that mimics the core features and user experience of modern large language model (LLM) interfaces like Gemini.## Getting Started



## FeaturesFirst, run the development server:



🤖 **AI-Powered Conversations**```bash

- Streaming responses from Google's Gemini AInpm run dev

- Real-time message display with typing indicators# or

- Conversation context preservationyarn dev

# or

💬 **Modern Chat Interface**pnpm dev

- Clean, intuitive design inspired by Gemini# or

- Message bubbles with user/AI distinctionbun dev

- Collapsible sidebar for chat history```

- Mobile-responsive design

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

🌙 **Dark Mode Support**

- System theme detectionYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- Manual theme switching

- Consistent dark/light mode across all componentsThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



📱 **Responsive Design**## Learn More

- Mobile-first approach

- Collapsible sidebar on small screensTo learn more about Next.js, take a look at the following resources:

- Touch-friendly interface

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

🗃️ **Persistent Storage**- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- PostgreSQL database for chat history

- Automatic chat title generationYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- User session management

## Deploy on Vercel

## Tech Stack

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Frontend

- **Next.js 15** - React framework with App RouterCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database
- **Google Generative AI** - LLM integration

## Prerequisites

Before running this application, make sure you have:

1. **Node.js 18+** installed
2. **PostgreSQL** database running
3. **Google AI API key** (from [Google AI Studio](https://aistudio.google.com/))

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd chat-app

# Install dependencies
npm install
```

### 2. Database Setup

1. **Create a PostgreSQL database:**
```sql
CREATE DATABASE chatbot_db;
```

2. **Update the `.env.local` file with your database credentials:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/chatbot_db
```

3. **Initialize the database schema:**
```bash
npm run db:init
```

### 3. API Configuration

1. **Get your Google AI API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key
   - Copy the key

2. **Update the `.env.local` file:**
```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Environment Variables

Your complete `.env.local` should look like this:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/chatbot_db

# Google Generative AI API Key
GOOGLE_API_KEY=your_google_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
chat-app/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── chat/      # Chat endpoints
│   │   │   └── chats/     # Chat management
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page
│   ├── components/        # React components
│   │   ├── chat-interface.tsx
│   │   ├── sidebar.tsx
│   │   ├── message-bubble.tsx
│   │   ├── message-input.tsx
│   │   ├── streaming-message.tsx
│   │   └── theme-toggle.tsx
│   └── lib/              # Utilities and services
│       ├── ai-service.ts
│       ├── database-service.ts
│       ├── database.ts
│       ├── types.ts
│       └── utils.ts
├── database/
│   ├── schema.sql        # Database schema
│   └── init.ts          # Database initialization
├── .env.example         # Environment template
└── .env.local          # Your environment variables
```

## API Endpoints

### Chat Management
- `POST /api/chat/new` - Create a new chat session
- `GET /api/chats` - Get all chats for a user
- `GET /api/chats/[chatId]` - Get specific chat with messages
- `DELETE /api/chats/[chatId]` - Delete a chat

### Messaging
- `POST /api/chat` - Send a message and get AI response (streaming)

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `email` (String, Optional)
- `name` (String, Optional)
- `created_at`, `updated_at` (Timestamps)

### Chats
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (String, Optional)
- `created_at`, `updated_at` (Timestamps)

### Messages
- `id` (UUID, Primary Key)
- `chat_id` (UUID, Foreign Key)
- `content` (Text)
- `sender` ('user' | 'ai')
- `created_at`, `updated_at` (Timestamps)

## Features Walkthrough

### 🚀 Starting a Chat
1. Click "New Chat" in the sidebar
2. Type your message in the input field
3. Press Enter or click the send button
4. Watch the AI response stream in real-time

### 💾 Chat History
- All conversations are automatically saved
- Access previous chats from the sidebar
- Chat titles are generated from the first message
- Delete chats you no longer need

### 🌙 Dark Mode
- Toggle between light and dark themes
- Respects system theme preference
- Theme choice is remembered

### 📱 Mobile Experience
- Responsive design works on all screen sizes
- Collapsible sidebar for mobile devices
- Touch-friendly interaction

## Customization

### Changing the AI Model
To use a different AI model, modify `src/lib/ai-service.ts`:
```typescript
// For OpenAI instead of Google AI
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

### Styling
The app uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Theme configuration
- Component files - Individual component styles

### Database
To use a different database, modify:
- `src/lib/database.ts` - Connection configuration
- `src/lib/database-service.ts` - Query implementations

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
```env
DATABASE_URL=your_production_database_url
GOOGLE_API_KEY=your_google_api_key
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists and is accessible

### AI API Issues
- Verify GOOGLE_API_KEY is correct
- Check API quota and billing
- Ensure API is enabled in Google Cloud Console

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run lint`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using Next.js, TypeScript, and Google Generative AI