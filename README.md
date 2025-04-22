# JobQuest

A full-stack job search and posting application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Overview

JobQuest is a platform that allows:
- Job seekers to browse and apply for jobs
- Employers to post and manage job listings
- Users to filter jobs by various criteria
- Authentication and user profiles

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- ES Modules

### Frontend
- React with Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas connection)
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables:
   - Backend `.env` file (in the backend directory)
   - Frontend `.env` file (in the frontend directory)

4. Start MongoDB (if using local instance):
   ```
   mongod
   ```

5. Start the application using the convenience script:
   ```
   npm run dev
   ```
   
   This will start both the backend and frontend servers.

   Alternatively, you can run:
   - Backend only: `npm run backend`
   - Frontend only: `npm run frontend`

## Testing the Setup

Run the connection test script to verify both backend and frontend are properly configured:

```
node test-connection.js
```

This will check:
- Backend API connectivity
- Database connection
- Frontend environment variables

## Directory Structure

```
JobQuest/
├── backend/                 # Backend API
│   ├── controllers/         # Route controllers
│   ├── db/                  # Database connection
│   ├── errors/              # Error handling
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   └── server.js            # Entry point
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   └── src/
│       ├── assets/          # Media files
│       ├── components/      # Reusable components
│       ├── context/         # Context providers
│       ├── layouts/         # Page layouts
│       ├── pages/           # Page components
│       ├── utils/           # Utility functions
│       └── App.jsx          # Main component
└── package.json             # Root package.json
```

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login a user

### Jobs
- GET `/api/v1/jobs` - Get all jobs
- GET `/api/v1/jobs/:id` - Get a job by ID
- GET `/api/v1/jobs/search` - Search for jobs
- GET `/api/v1/jobs/user/myjobs` - Get jobs posted by the current user
- POST `/api/v1/jobs` - Create a new job
- PUT `/api/v1/jobs/:id/like` - Like a job
- PUT `/api/v1/jobs/:id/apply` - Apply to a job
- DELETE `/api/v1/jobs/:id` - Delete a job

## Troubleshooting

If you encounter issues:

1. Check both the frontend and backend consoles for error messages
2. Verify MongoDB is running and accessible
3. Ensure environment variables are set correctly
4. Check network requests in the browser's developer tools
5. Verify proper API URLs in the frontend configuration
6. Run the test-connection.js script for diagnostics
