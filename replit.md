# Edit Hive

## Overview

Edit Hive is a creative resource platform for video editors, providing CapCut templates, editing tips/tutorials, and an AI-powered idea generator. The application helps content creators find viral-ready templates for TikTok, Reels, and Shorts, learn professional editing techniques, and generate unique video concepts using AI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom dark theme featuring warm color palette (amber/honey gold accents)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and interactive effects
- **Fonts**: DM Sans (body) and Outfit (headings) from Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Build Tool**: Vite for frontend, esbuild for server bundling
- **API Structure**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas
- **Development**: Hot module replacement via Vite middleware

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: templates, tips, ideas, conversations, assistantMessages, comments, users, chatConversations, chatMessages, globalChatMessages
- **Object Storage**: Replit Object Storage for image uploads (thumbnails)

### File Uploads
- **Admin Thumbnail Uploads**: Protected endpoint `/api/uploads/admin-request-url` for presigned URL generation
- **Two-Step Upload Flow**: 
  1. POST to get presigned URL and object path
  2. PUT file directly to presigned URL
  3. Store `/objects/{objectPath}` as the public URL
- **ImageUploader Component**: Handles file validation, preview, and upload flow

### Comments System
- **Public Read/Create**: Anyone can view and add comments to templates and tips
- **Admin-Only Delete**: Only authenticated admins can delete comments
- **API Routes**:
  - GET `/api/templates/:id/comments` - List template comments
  - GET `/api/tips/:id/comments` - List tip comments
  - POST `/api/templates/:id/comments` - Create template comment
  - POST `/api/tips/:id/comments` - Create tip comment
  - DELETE `/api/comments/:id` - Delete comment (admin only)

### Private Chat System
- **Purpose**: Back-and-forth messaging between visitors and admin for ideas/suggestions
- **Visitor Flow**: 
  - `/contact` page shows conversation list and new chat form
  - Visitors identified by UUID stored in localStorage for continuity
  - Messages auto-refresh every 5 seconds
- **Admin Flow**:
  - `/admin/inbox` shows all conversations with reply capability
  - Admin can toggle conversation status (open/closed)
  - Link on admin dashboard for quick access
- **API Routes**:
  - POST `/api/chat/conversations` - Create new conversation (visitor)
  - GET `/api/chat/conversations?visitorId=xxx` - Get visitor's conversations
  - GET `/api/chat/conversations` - Get all conversations (admin)
  - GET `/api/chat/conversations/:id/messages` - Get messages
  - POST `/api/chat/conversations/:id/messages` - Send message
  - PATCH `/api/chat/conversations/:id/status` - Toggle status (admin)
- **Security**: Server-side admin verification ignores client isAdmin flag

### Vertical Feed (TikTok/Reels Style)
- **Page**: `/feed` - accessible from main navigation with Play icon
- **Features**:
  - Full-screen vertical scrolling experience
  - Auto-playing videos when available (muted by default)
  - Combines templates and tips in randomized order
  - Swipe gestures for mobile navigation
  - Keyboard shortcuts: Arrow keys/jk to navigate, Space to play/pause, M to mute/unmute
  - Navigation buttons for prev/next items
  - Counter showing current position in feed
  - View Details button links to full content page
  - Open in CapCut button for templates

### Global Community Chat
- **Purpose**: Public chatroom where all visitors can communicate
- **Page**: `/chat` - accessible from main navigation
- **Features**:
  - Nickname-based identity stored in localStorage
  - Real-time message updates (3 second polling)
  - Messages sorted by time with newest at bottom
  - User's own messages styled differently (right-aligned, primary color)
- **API Routes**:
  - GET `/api/global-chat` - Get latest 100 messages
  - POST `/api/global-chat` - Send a message with { nickname, content }
- **No authentication required** - anyone can join and chat

### Community Content Submission
- **Purpose**: Logged-in users can submit templates and tips for admin approval
- **Pages**:
  - `/submit` - Form for users to submit templates or tips (requires login)
  - `/admin/moderation` - Admin page to approve/reject submissions and manage users
- **Content Flow**:
  - User submits content → status set to "pending"
  - Admin reviews in moderation page → approves or rejects
  - Only "approved" content appears in public listings
  - Author names displayed on community-submitted content
- **User Management**:
  - Admin can ban users from submitting content
  - Banned users receive 403 errors when attempting uploads
  - Admin cannot ban themselves
- **API Routes**:
  - POST `/api/community/templates` - Submit a template (requires auth)
  - POST `/api/community/tips` - Submit a tip (requires auth)
  - GET `/api/admin/pending` - Get pending templates and tips (admin only)
  - PATCH `/api/admin/templates/:id/status` - Approve/reject template (admin only)
  - PATCH `/api/admin/tips/:id/status` - Approve/reject tip (admin only)
  - GET `/api/admin/users` - Get all users (admin only)
  - POST `/api/admin/users/:id/ban` - Ban a user (admin only)
  - POST `/api/admin/users/:id/unban` - Unban a user (admin only)
- **Schema Fields**:
  - `status` - "pending", "approved", or "rejected" (default: "approved" for admin posts)
  - `authorId` - User ID of the submitter
  - `authorName` - Display name of the submitter
  - `isBanned` - Boolean field on users table

### Engagement Features

#### Likes/Favorites System
- **Purpose**: Allow users to like and save favorite templates and tips
- **User Identification**: Uses visitor UUID stored in localStorage (no login required)
- **Database Tables**:
  - `favorites` - Stores visitor ID with template/tip references
  - `likes` and `views` columns on templates and tips tables
- **Components**:
  - `LikeButton` - Heart icon button with like count, available in default and compact variants
  - Used on detail pages and in card grids
- **API Routes**:
  - POST `/api/favorites/templates/:id` - Toggle template favorite (increments/decrements likes)
  - POST `/api/favorites/tips/:id` - Toggle tip favorite
  - GET `/api/favorites/check/templates/:id?visitorId=xxx` - Check if favorited
  - GET `/api/favorites/check/tips/:id?visitorId=xxx` - Check if favorited
  - GET `/api/favorites?visitorId=xxx` - Get all favorites for a visitor

#### Trending Content
- **Purpose**: Highlight popular content sorted by likes and views
- **Components**:
  - `TrendingSection` - Displays trending templates and tips on home page
  - Shows "Hot" badge on trending items
- **API Routes**:
  - GET `/api/trending/templates?limit=N` - Get trending templates (sorted by likes, then views)
  - GET `/api/trending/tips?limit=N` - Get trending tips

#### Share Buttons
- **Purpose**: Enable social sharing of templates and tips
- **Component**: `ShareButtons` - Dropdown with share options
- **Features**:
  - Native share API on supported devices (mobile)
  - Twitter/X share with pre-filled text
  - Facebook share
  - Copy link to clipboard
- **Location**: Template and tip detail pages

#### Skeleton Loaders
- **Purpose**: Improve perceived loading performance with realistic placeholders
- **Component**: `SkeletonCard` - Skeleton loaders for template and tip cards
- **Usage**: Templates and Tips listing pages show skeleton cards during data loading

### Security Features
- **Secure Cookies**: 
  - `httpOnly: true` - Prevents JavaScript access to session cookies
  - `secure: true` - Only sends cookies over HTTPS
  - `sameSite: "lax"` - Protects against CSRF attacks
- **Security Headers**:
  - `X-Frame-Options: DENY` - Prevents clickjacking attacks
  - `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
  - `X-XSS-Protection: 1; mode=block` - Enables browser XSS filter
  - `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
  - `Cache-Control: no-store` - Prevents caching of sensitive API responses
- **Rate Limiting**:
  - General API: 100 requests per minute
  - Community submissions: Rate limited to prevent spam
  - In-memory store with automatic cleanup

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `/shared` directory are used by both client and server
- **Type-Safe API**: Zod schemas define request/response types, ensuring end-to-end type safety
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared directory

### AI Integrations
- **OpenAI Integration**: Used for idea generation and AI assistant chat
- **Replit AI Integrations**: Modular structure in `server/replit_integrations/` for:
  - Audio processing (voice chat, speech-to-text, text-to-speech)
  - Chat conversations with persistent storage
  - Image generation
  - Batch processing utilities

## External Dependencies

### AI Services
- **OpenAI API**: Powers the idea generator and AI assistant features
- **Google Generative AI**: `@google/genai` package available for Gemini integration

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for Express sessions

### Third-Party UI Libraries
- **Radix UI**: Comprehensive primitive components (dialogs, dropdowns, tooltips, etc.)
- **Framer Motion**: Animation library
- **Embla Carousel**: Carousel/slider functionality
- **react-day-picker**: Calendar component

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server-side bundling for production
- **Drizzle Kit**: Database migration tooling

### Authentication
- **Replit Auth**: OIDC-based authentication using Replit as identity provider
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **Auth Routes**: 
  - `/api/login` - Initiate login flow
  - `/api/logout` - End session
  - `/api/auth/user` - Get current user
- **Admin Access**: Set `ADMIN_USER_ID` environment variable to your user ID to enable template/tip management

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption secret (auto-provided by Replit)
- `ADMIN_USER_ID`: Your user ID for admin access (get this from database after first login)
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key for AI features
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI API base URL (for Replit AI integrations)

### Admin Setup
1. Log in to the app using the Login button
2. Check the `users` table in the database to find your user ID (the `id` column)
3. Set the `ADMIN_USER_ID` environment variable to your user ID
4. Restart the app to enable admin features