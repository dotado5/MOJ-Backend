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
- **Images**: Article thumbnails stored in AWS S3

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
- **Images**: `displayImage` contains S3 URLs for article thumbnails

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

### 2. Article Endpoints ✅ **Updated with S3 Image Support**
- `GET /article` - Get all articles ✅ **Used on Homepage**
- `GET /article/:id` - Get article by ID
- `POST /article` - Create article (JSON only)
- `POST /article/with-image` - Create article with image upload ✅ **New**
- `POST /article/upload-image` - Upload image only ✅ **New**
- `PUT /article/:id` - Update article (JSON only)
- `PUT /article/:id/with-image` - Update article with image upload ✅ **New**
- `PATCH /article/:id` - Partially update article (JSON only)
- `PATCH /article/:id/with-image` - Partially update article with image ✅ **New**
- `DELETE /article/:id` - Delete article (also deletes S3 image)

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

## Image Upload System

### AWS S3 Integration
The API includes comprehensive S3 integration for handling article thumbnail images:

#### Features
- ✅ **Secure Upload**: Images uploaded directly to AWS S3
- ✅ **Automatic Cleanup**: Old images deleted when updated/removed
- ✅ **File Validation**: Type and size validation (max 5MB)
- ✅ **Unique Naming**: UUID-based filenames prevent conflicts
- ✅ **CDN Support**: CloudFront integration for faster delivery
- ✅ **Multiple Formats**: Supports JPG, PNG, GIF, WebP, SVG

#### Supported Image Types
- JPEG/JPG
- PNG  
- GIF
- WebP
- SVG

#### File Size Limits
- **Maximum**: 5MB per image
- **Recommended**: 1MB or less for optimal performance

#### S3 Bucket Structure
```
moj-article-images/
├── articles/
│   ├── uuid-1.jpg
│   ├── uuid-2.png
│   └── ...
└── pastors/
    ├── uuid-3.jpg
    └── ...
```

### Image Upload Endpoints

#### Upload Article Image Only
```
POST /article/upload-image
Content-Type: multipart/form-data

Body:
- image: File (required)
```

#### Create Article with Image
```
POST /article/with-image
Content-Type: multipart/form-data

Body:
- image: File (optional)
- title: String (required)
- authorId: String (required)
- text: String (required)
- readTime: Date (required)
```

#### Update Article with Image
```
PUT /article/:id/with-image
PATCH /article/:id/with-image
Content-Type: multipart/form-data

Body:
- image: File (optional) - replaces existing image if provided
- title: String (optional)
- authorId: String (optional)
- text: String (optional)
- readTime: Date (optional)
```

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

### Article ✅ **Updated with S3 Support**
```typescript
interface Article {
  displayImage: string; // S3 URL or CloudFront URL
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

## Environment Configuration

### Required Environment Variables
```env
# Database
MONGO_URL=your_mongodb_connection_string

# Server
PORT=5000

# AWS S3 (Required for image uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET=moj-article-images

# Optional: CloudFront CDN
CLOUDFRONT_URL=https://your-distribution.cloudfront.net
```

### AWS S3 Setup
1. **Create S3 Bucket**: Create a bucket for storing images
2. **Configure Permissions**: Set bucket policy for public read access
3. **IAM User**: Create IAM user with S3 permissions
4. **CloudFront** (Optional): Set up CDN for faster image delivery

### Required S3 Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::moj-article-images/*"
    }
  ]
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

### Image Upload Response
```json
{
  "status": "Success",
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://bucket.s3.amazonaws.com/articles/uuid.jpg",
    "originalName": "thumbnail.jpg",
    "size": 245760,
    "mimetype": "image/jpeg"
  }
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
- **Storage**: Images stored in AWS S3, URLs in MongoDB

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Usage Notes

1. **Homepage Performance**: The homepage makes 3 concurrent API calls on load
2. **Data Validation**: All update operations include validation
3. **Error Handling**: Comprehensive error handling with proper HTTP status codes
4. **Image Management**: Automatic S3 cleanup when articles are updated/deleted
5. **Deployment**: Backend deployed on Google Cloud Run
6. **Frontend**: Deployed on Vercel

## API Statistics

**Total Endpoints**: **49**
- **7 entities** with full CRUD operations
- **4 image upload endpoints** for articles
- **3 special endpoints** (active pastor, latest pastor corner, posts by pastor)

**Homepage API Calls**: **3**
- Activities, Articles (with S3 images), and Pastor Corner

## Recent Improvements

### S3 Image Integration ✅ **New**
- **Before**: Article images stored as URLs or file paths
- **After**: Professional S3 integration with automatic management
- **Features**: Upload, update, delete, validation, CDN support
- **Benefits**: Scalable, secure, fast image delivery

### Pastor's Corner Evolution
- **Before**: Static hardcoded welcome message
- **After**: Dynamic pastor corner posts tied to specific pastors
- **Features**: Latest published post automatically shows on homepage
- **Management**: Admin can create, update, and manage pastor corner content
- **Fallback**: Graceful handling when no posts are available
- **Attribution**: Publication date display and pastor relationship

### Key Features Added
- **S3 Image Storage**: Professional cloud storage for article thumbnails
- **Image Validation**: Type and size validation with proper error handling
- **Automatic Cleanup**: Old images deleted when articles updated/removed
- **CDN Support**: CloudFront integration for faster global delivery
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
- Extend S3 integration to other entities (Pastor, Coordinator images)
- Add image resizing and optimization
- Implement image metadata extraction 