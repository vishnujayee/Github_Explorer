# API-Driven Mini Web App - GitHub Repository Explorer

A full-stack web application that allows users to search GitHub repositories, stores results in MongoDB, and provides a dashboard to view search history and statistics.

## Features

- **GitHub API Integration**: Search for repositories using GitHub's public API
- **Real-time Search**: Instant search results with pagination support
- **Data Persistence**: Automatically stores all search results in MongoDB
- **Modern UI/UX**: Clean, responsive design built with React and Tailwind CSS
- **Dashboard**: View search history, statistics, and stored results
- **Error Handling**: Comprehensive error handling for API failures
- **Rate Limiting**: Built-in rate limiting and API error handling
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Axios** for HTTP requests
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **Context API** for state management

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api-driven-mini-app
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/api-mini-app
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the `MONGODB_URI` to point to your MongoDB instance.

## Running the Application

### Development Mode (Recommended)
Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Individual Services
Run only the backend:
```bash
npm run server or npm start
```

Run only the frontend:
```bash
npm run client or npm start
```

## Usage

1. **Search Page** (`/`)
   - Enter keywords to search for GitHub repositories
   - Use advanced options for customizing search parameters
   - View real-time search results
   - Results are automatically stored in the database

2. **Dashboard** (`/dashboard`)
   - View all stored search results
   - Filter results by keyword
   - Sort by different criteria
   - View application statistics
   - Pagination for large result sets

## API Endpoints

### Search Endpoints
- `POST /api/search/github` - Search GitHub repositories
- `GET /api/search/history/:keyword` - Get search history for a keyword

### Results Endpoints
- `GET /api/results` - Get all stored results with pagination
- `GET /api/results/:id` - Get specific search result
- `GET /api/results/recent/searches` - Get recent searches
- `GET /api/results/stats/overview` - Get application statistics

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

