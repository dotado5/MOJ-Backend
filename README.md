# MOJ Backend API Documentation

## Homepage Integration

### What's on the Homepage
The homepage (`Church-Site/Frontend/src/app/page.tsx`) displays:

1. **Activities Timeline Section**
   - Shows church activities grouped by month
   - Displays activity names, dates, and descriptions
   - Data source: Activities API

2. **Latest Articles Section**
   - Shows the 4 most recent articles
   - Displays article cards with images, titles, and truncated text
   - Data source: Articles API

3. **Pastor's Corner Section** ✅ **UPDATED**
   - Shows the latest published pastor corner post
   - Displays dynamic title, content, and publication date
   - Shows pastor's name, title, and photo
   - Data source: Pastor Corner API (tied to Pastor)
   - Fallback to welcome message if no posts available

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

#### 3. Pastor Corner Endpoint ✅ **UPDATED**
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
- `GET /activity/:id` - Get activity by ID ✅ **New**
- `POST /activity` - Create activity ✅ **New**
- `PUT /activity/:id` - Update activity ✅ **New**
- `PATCH /activity/:id` - Partially update activity ✅ **New**
- `DELETE /activity/:id` - Delete activity ✅ **New**

### 2. Article Endpoints
- `GET /article` - Get all articles ✅ **Used on Homepage**
- `GET /article/:id` - Get article by ID ✅ **New**
- `POST /article` - Create article ✅ **New**
- `PUT /article/:id` - Update article ✅ **New**
- `PATCH /article/:id` - Partially update article ✅ **New**
- `DELETE /article/:id` - Delete article ✅ **New**

### 3. Author Endpoints
- `GET /author` - Get all authors ✅ **New**
- `GET /author/:id` - Get author by ID ✅ **New**
- `POST /author` - Create author ✅ **New**
- `PUT /author/:id` - Update author ✅ **New**
- `PATCH /author/:id` - Partially update author ✅ **New**
- `DELETE /author/:id` - Delete author ✅ **New**

### 4. Coordinator Endpoints
- `GET /coordinator` - Get all coordinators ✅ **New**
- `GET /coordinator/:id` - Get coordinator by ID ✅ **New**
- `POST /coordinator` - Create coordinator ✅ **New**
- `PUT /coordinator/:id` - Update coordinator ✅ **New**
- `PATCH /coordinator/:id` - Partially update coordinator ✅ **New**
- `DELETE /coordinator/:id` - Delete coordinator ✅ **New**

### 5. Memory Endpoints
- `GET /memory` - Get all memories ✅ **New**
- `GET /memory/:id` - Get memory by ID ✅ **New**
- `POST /memory` - Create memory ✅ **New**
- `PUT /memory/:id` - Update memory ✅ **New**
- `PATCH /memory/:id` - Partially update memory ✅ **New**
- `DELETE /memory/:id` - Delete memory ✅ **New**

### 6. Pastor Endpoints ✅ **NEW**
- `GET /pastor/active` - Get active pastor ✅ **New**
- `GET /pastor` - Get all pastors ✅ **New**
- `GET /pastor/:id` - Get pastor by ID ✅ **New**
- `POST /pastor` - Create pastor ✅ **New**
- `PUT /pastor/:id` - Update pastor ✅ **New**
- `PATCH /pastor/:id` - Partially update pastor ✅ **New**
- `DELETE /pastor/:id` - Delete pastor ✅ **New**

### 7. Pastor Corner Endpoints ✅ **NEW**
- `GET /pastor-corner/latest` - Get latest published post ✅ **Used on Homepage**
- `GET /pastor-corner/pastor/:pastorId` - Get posts by pastor ✅ **New**
- `GET /pastor-corner` - Get all pastor corner posts ✅ **New**
- `GET /pastor-corner/:id` - Get pastor corner post by ID ✅ **New**
- `POST /pastor-corner` - Create pastor corner post ✅ **New**
- `PUT /pastor-corner/:id` - Update pastor corner post ✅ **New**
- `PATCH /pastor-corner/:id` - Partially update pastor corner post ✅ **New**
- `DELETE /pastor-corner/:id` - Delete pastor corner post ✅ **New**

## Recently Added Endpoints

### Before (Limited CRUD)
- Only `GET /entity` (read all) and `POST /entity` (create) were available
- No way to update, delete, or get individual records
- Pastor's Corner was static content

### After (Full CRUD) ✅
Added the following operations for ALL entities:

#### New Pastor Entity (Complete CRUD)
- `GET /pastor/active` - Get active pastor
- `GET /pastor` - Get all pastors
- `GET /pastor/:id` - Get pastor by ID
- `POST /pastor` - Create pastor
- `PUT /pastor/:id` & `PATCH /pastor/:id` - Update pastor
- `DELETE /pastor/:id` - Delete pastor

#### New Pastor Corner Entity (Complete CRUD) ✅ **NEW**
- `GET /pastor-corner/latest` - Get latest published post (for homepage)
- `GET /pastor-corner/pastor/:pastorId` - Get posts by specific pastor
- `GET /pastor-corner` - Get all pastor corner posts
- `GET /pastor-corner/:id` - Get pastor corner post by ID
- `POST /pastor-corner` - Create pastor corner post
- `PUT /pastor-corner/:id` & `PATCH /pastor-corner/:id` - Update pastor corner post
- `DELETE /pastor-corner/:id` - Delete pastor corner post

#### Individual READ Operations
- `GET /activity/:id`
- `GET /article/:id`
- `GET /author/:id`
- `GET /coordinator/:id`
- `GET /memory/:id`

#### UPDATE Operations
- `PUT /activity/:id` & `PATCH /activity/:id`
- `PUT /article/:id` & `PATCH /article/:id`
- `PUT /author/:id` & `PATCH /author/:id`
- `PUT /coordinator/:id` & `PATCH /coordinator/:id`
- `PUT /memory/:id` & `PATCH /memory/:id`

#### DELETE Operations
- `DELETE /activity/:id`
- `DELETE /article/:id`
- `DELETE /author/:id`
- `DELETE /coordinator/:id`
- `DELETE /memory/:id`

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

### Pastor ✅ **NEW**
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

### PastorCorner ✅ **NEW**
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

## Summary

**Homepage Requirements**: 
- ✅ 3 API calls: `GET /activity`, `GET /article`, and `GET /pastor-corner/latest`
- ✅ Displays activities timeline, latest articles, and dynamic pastor's corner

**API Completeness**:
- ✅ Full CRUD operations for all 7 entities
- ✅ 45 total endpoints (6 per entity + 3 special endpoints)
- ✅ Proper error handling and validation
- ✅ Consistent response format

**Pastor's Corner Improvements**:
- ✅ **Before**: Static hardcoded welcome message
- ✅ **After**: Dynamic pastor corner posts tied to specific pastors
- ✅ Latest published post automatically shows on homepage
- ✅ Admin can create, update, and manage pastor corner content
- ✅ Fallback mechanism if no posts are available
- ✅ Publication date display
- ✅ Pastor relationship (pastorId references Pastor entity)

**Key Features**:
- ✅ **Dynamic Content**: Pastor corner posts can be created and managed
- ✅ **Pastor Association**: Each post is tied to a specific pastor
- ✅ **Publication Control**: Posts can be published/unpublished
- ✅ **Homepage Integration**: Latest post automatically appears
- ✅ **Fallback Support**: Graceful handling when no posts exist

**Deployment**:
- ✅ Backend: Google Cloud Run (`https://api-2at6qg5khq-uc.a.run.app`)
- ✅ Frontend: Vercel (`https://church-site-seven.vercel.app`)
- ✅ Database: MongoDB

The API now provides a complete content management system for Pastor's Corner with dynamic, pastor-specific posts!
