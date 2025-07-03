# MOJ Backend

## Overview
Backend API for the Minds of Josiah (MOJ) church application, providing endpoints for managing church activities, articles, coordinators, pastors, and pastor corner posts.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Environment variables configured

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
```

## API Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://api-2at6qg5khq-uc.a.run.app`

## Quick API Overview

The API provides full CRUD operations for 7 main entities:

- **Activities** - Church activities and events
- **Articles** - Blog posts and articles  
- **Authors** - Article authors
- **Coordinators** - Church coordinators
- **Memories** - Photo gallery items
- **Pastors** - Pastor information
- **Pastor Corner** - Dynamic pastor posts

### Homepage Integration
The API serves data for the church website homepage:
- Activities Timeline (latest activities)
- Latest Articles (4 most recent)
- Pastor's Corner (latest published post)

## Documentation

📖 **[Complete API Documentation](./API_DOCUMENTATION.md)**

For detailed information about:
- All API endpoints and methods
- Request/response formats
- Data models and schemas
- Homepage integration details
- Usage examples

## Project Structure
```
src/
├── controllers/     # Request handlers
├── models/         # MongoDB schemas
├── routes/         # API route definitions
├── config/         # Database configuration
└── server.ts       # Main application file
```

## Deployment

### Google Cloud Run
The backend is deployed on Google Cloud Run at:
`https://api-2at6qg5khq-uc.a.run.app`

### Connected Frontend
- **Frontend**: `https://church-site-seven.vercel.app`
- **Admin Panel**: Available in Church-Site/Admin

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript  
- `npm start` - Start production server

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Deployment**: Google Cloud Run

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Create feature branch: `git checkout -b feature/your-feature`
4. Make changes and test
5. Commit: `git commit -m "feat: your feature"`
6. Push and create pull request

## License

This project is private and proprietary to the Minds of Josiah church.
cle