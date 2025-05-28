# Rental Property Tracker

A modern web application built with Next.js and TypeScript to help users track their rental property applications, viewings, and status updates. This project demonstrates my skills in full-stack development, focusing on React, Next.js, and modern web technologies.

## Features

- 📱 **Responsive Dashboard**: Clean, modern interface with dark mode support
- 🏠 **Property Management**: Track multiple rental properties and their applications
- 📅 **Viewing Calendar**: Schedule and manage property viewings
- 📊 **Status Tracking**: Monitor application status (Applied, Rejected, Not Applying)
- 🔍 **Quick Actions**: Fast access to common tasks
- 📝 **Notes & Details**: Store important information about each property
- 🔗 **External Links**: Direct access to property listings

## Tech Stack

- **Frontend**:

  - Next.js 15 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Lucide Icons

- **Backend**:

  - tRPC for type-safe API
  - Drizzle ORM
  - MySQL Database
  - Zod for validation

- **Development**:
  - ESLint & Prettier
  - pnpm for package management
  - TypeScript for type safety

## Getting Started

1. **Prerequisites**

   - Node.js 18+
   - pnpm
   - MySQL

2. **Installation**

   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install dependencies
   pnpm install

   # Set up environment variables
   cp .env.example .env
   ```

3. **Database Setup**

   You have two options for setting up the database:

   **Option 1: Railway (Recommended)**

   ```bash
   # I used Railway for the mySQL database - so instructions are below
   # Create a new project on Railway.app
   # Add a MySQL database to your project
   # Copy the DATABASE_URL from Railway's dashboard
   # Add it to your .env file:
   DATABASE_URL="mysql://..."
   ```

4. **Development**
   ```bash
   # Start the development server
   pnpm dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Shared UI components
├── server/             # Backend logic
│   ├── api/           # tRPC API routes
│   └── db/            # Database schema and configuration
└── types/             # TypeScript type definitions
```

## Key Features Implementation

- **Type-Safe API**: Using tRPC for end-to-end type safety
- **Modern UI**: Built with Radix UI and Tailwind CSS
- **Responsive Design**: Mobile-first approach with fluid layouts
- **State Management**: React Query for server state
- **Form Handling**: Built-in form validation with Zod

## Development Experience

This project demonstrates my experience with:

- Modern React patterns and hooks
- Next.js App Router and server components
- TypeScript for type safety
- Database design and ORM usage
- API design and implementation
- UI/UX best practices
- Responsive design principles

## Future Improvements

- [ ] User authentication
- [ ] Email notifications
- [ ] Property image uploads
- [ ] Advanced filtering and search
- [ ] Mobile app version

## License

MIT
