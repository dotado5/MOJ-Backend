# MOJ Backend API Documentation

## Overview
This document provides comprehensive information about the MOJ Backend API, including homepage functionality and all available endpoints.

## Frontend Homepage Integration

### Homepage Location
- **Frontend URL**: `https://church-site-seven.vercel.app`
- **Homepage Component**: `Church-Site/Frontend/src/app/page.tsx`

### Homepage Data Requirements
The homepage displays three main sections that require API data:

#### 1. Activities Timeline Section
- **Section**: "Activities Timeline"
- **Purpose**: Shows church activities grouped by month
- **Data Source**: Activities API
- **Display**: Activities are grouped by month/year with activity names, dates, and descriptions

#### 2. Latest Articles Section
- **Section**: "Latest Articles" 
- **Purpose**: Shows the 4 most recent articles
- **Data Source**: Articles API
- **Display**: Article cards with images, titles, and truncated text (first 100 characters)

#### 3. Pastor's Corner Section
- **Section**: "Pastor's Corner"
- **Purpose**: Shows the latest published pastor corner post
- **Data Source**: Pastor Corner API (tied to Pastor)
- **Display**: Dynamic title, content, publication date, and pastor attribution
- **Fallback**: Welcome message if no posts available

### Homepage API Calls

#### 1. Activities Endpoint
```
GET https://api-2at6qg5khq-uc.a.run.app/activity
```
- **Hook**: `useActivities()` → `getAllActivities()`
- **Used for**: Activities Timeline section
- **Data Structure**: `{ _id, name, date, description }`

#### 2. Articles Endpoint
```
GET https://api-2at6qg5khq-uc.a.run.app/article
```
- **Hook**: `useArticles()` → `getAllArticles()`
- **Used for**: Latest Articles section (first 4 articles)
- **Data Structure**: `{ displayImage, title, authorId, text, date, readTime }`

#### 3. Pastor Corner Endpoint
```
GET https://api-2at6qg5khq-uc.a.run.app/pastor-corner/latest
```
- **Hook**: `usePastorCorner()` → `getLatestPastorCorner()`
- **Used for**: Pastor's Corner section (latest published post)
- **Data Structure**: `{ _id, title, content, pastorId, datePublished, isPublished }`

## Complete API Endpoints

### Base URL
```
https://api-2at6qg5khq-uc.a.run.app
```

### 1. Activity Endpoints
- `GET /activity` - Get all activities ✅ **Used on Homepage**
- `GET /activity/:id` - Get activity by ID
- `POST /activity` - Create activity
- `PUT /activity/:id` - Update activity
- `PATCH /activity/:id` - Partially update activity
- `DELETE /activity/:id` - Delete activity

### 2. Article Endpoints
- `GET /article` - Get all articles ✅ **Used on Homepage**
- `GET /article/:id` - Get article by ID
- `POST /article` - Create article
- `PUT /article/:id` - Update article
- `PATCH /article/:id` - Partially update article
- `DELETE /article/:id` - Delete article

### 3. Author Endpoints
- `GET /author` - Get all authors
- `GET /author/:id` - Get author by ID
- `POST /author` - Create author
- `PUT /author/:id` - Update author
- `PATCH /author/:id` - Partially update author
- `DELETE /author/:id` - Delete author

### 4. Coordinator Endpoints
- `GET /coordinator` - Get all coordinators
- `GET /coordinator/:id` - Get coordinator by ID
- `POST /coordinator` - Create coordinator
- `PUT /coordinator/:id` - Update coordinator
- `PATCH /coordinator/:id` - Partially update coordinator
- `DELETE /coordinator/:id` - Delete coordinator

### 5. Memory Endpoints
- `GET /memory` - Get all memories
- `GET /memory/:id` - Get memory by ID
- `POST /memory` - Create memory
- `PUT /memory/:id` - Update memory
- `PATCH /memory/:id` - Partially update memory
- `DELETE /memory/:id` - Delete memory

### 6. Pastor Endpoints
- `GET /pastor/active` - Get active pastor
- `GET /pastor` - Get all pastors
- `GET /pastor/:id` - Get pastor by ID
- `POST /pastor` - Create pastor
- `PUT /pastor/:id` - Update pastor
- `PATCH /pastor/:id` - Partially update pastor
- `DELETE /pastor/:id` - Delete pastor

### 7. Pastor Corner Endpoints
- `GET /pastor-corner/latest` - Get latest published post ✅ **Used on Homepage**
- `GET /pastor-corner/pastor/:pastorId` - Get posts by pastor
- `GET /pastor-corner` - Get all pastor corner posts
- `GET /pastor-corner/:id` - Get pastor corner post by ID
- `POST /pastor-corner` - Create pastor corner post
- `PUT /pastor-corner/:id` - Update pastor corner post
- `PATCH /pastor-corner/:id` - Partially update pastor corner post
- `DELETE /pastor-corner/:id` - Delete pastor corner post

## Data Models

### Activity
```typescript
interface Activity {
  _id: string;
  name: string;
  date: string;
  description: string;
}
```

### Article
```typescript
interface Article {
  displayImage: string;
  title: string;
  authorId: string;
  text: string;
  date: string;
  readTime: Date;
}
```

### Author
```typescript
interface Author {
  firstName: string;
  lastName: string;
  profileImage: string;
}
```

### Coordinator
```typescript
interface Coordinator {
  name: string;
  occupation: string;
  phone_number: string;
  image_url: string;
  about: string;
}
```

### Memory
```typescript
interface Memory {
  imageUrl: string;
  height: number;
  width: number;
  imgType: string;
  activityId: string;
}
```

### Pastor
```typescript
interface Pastor {
  _id: string;
  name: string;
  title: string;
  welcomeMessage: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### PastorCorner
```typescript
interface PastorCorner {
  _id: string;
  title: string;
  content: string;
  pastorId: Pastor; // References Pastor
  datePublished: string;
  isPublished: boolean;
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Response Format

### Success Response
```json
{
  "status": "Success",
  "message": "Operation completed successfully",
  "data": {} // Response data
}
```

### Error Response (404)
```json
{
  "status": "Error",
  "message": "Resource not found"
}
```

### Error Response (500)
```json
{
  "error": "Internal server error details"
}
```

## CORS Configuration

The API allows requests from:
- `http://localhost:5000` (Development)
- `https://church-site-seven.vercel.app` (Production Frontend)

## Database

- **Type**: MongoDB
- **Connection**: Configured via environment variables
- **Models**: Activity, Article, Author, Coordinator, Memory, Pastor, PastorCorner

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Usage Notes

1. **Homepage Performance**: The homepage makes 3 concurrent API calls on load
2. **Data Validation**: All update operations include validation
3. **Error Handling**: Comprehensive error handling with proper HTTP status codes
4. **Deployment**: Backend deployed on Google Cloud Run
5. **Frontend**: Deployed on Vercel

## API Statistics

**Total Endpoints**: **45**
- **7 entities** with full CRUD operations
- **3 special endpoints** (active pastor, latest pastor corner, posts by pastor)

**Homepage API Calls**: **3**
- Activities, Articles, and Pastor Corner

## Recent Improvements

### Pastor's Corner Evolution
- **Before**: Static hardcoded welcome message
- **After**: Dynamic pastor corner posts tied to specific pastors
- **Features**: Latest published post automatically shows on homepage
- **Management**: Admin can create, update, and manage pastor corner content
- **Fallback**: Graceful handling when no posts are available
- **Attribution**: Publication date display and pastor relationship

### Key Features Added
- **Dynamic Content**: Pastor corner posts can be created and managed
- **Pastor Association**: Each post is tied to a specific pastor
- **Publication Control**: Posts can be published/unpublished
- **Homepage Integration**: Latest post automatically appears
- **Fallback Support**: Graceful handling when no posts exist

## Future Enhancements

Potential areas for improvement:
- Add authentication and authorization
- Implement pagination for large datasets
- Add search and filtering capabilities
- Include rate limiting
- Add request validation middleware
- Implement caching for frequently accessed data 