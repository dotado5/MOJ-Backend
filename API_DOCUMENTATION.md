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

#### 2. Latest Articles Section ✅ **Enhanced with Author Data**
- **Section**: "Latest Articles" 
- **Purpose**: Shows the 4 most recent articles with full author information
- **Data Source**: Enhanced Articles API with Authors
- **Display**: Article cards with S3 images, titles, author names, and excerpts
- **Images**: Article thumbnails stored in AWS S3
- **Authors**: Full author information populated from Author collection

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

#### 2. Enhanced Articles Endpoint ✅ **Updated**
```
GET https://api-2at6qg5khq-uc.a.run.app/article/with-authors?page=1&limit=4
```
- **Hook**: `useArticles()` → `getAllArticlesWithAuthors(1, 4)`
- **Used for**: Latest Articles section (first 4 articles with authors)
- **Data Structure**: Enhanced articles with populated author information
- **Images**: S3 URLs for article thumbnails
- **Authors**: Full author details including names and profile images
- **Features**: Read time calculation, time ago formatting, excerpts

#### 3. Pastor Corner Endpoint
```
GET https://api-2at6qg5khq-uc.a.run.app/pastor-corner/latest
```
- **Hook**: `usePastorCorner()` → `getLatestPastorCorner()`
- **Used for**: Pastor's Corner section (latest published post)
- **Data Structure**: `{ _id, title, content, pastorId, datePublished, isPublished }`

## Frontend Coordinators Page Integration

### Coordinators Page Location
- **Frontend URL**: `https://church-site-seven.vercel.app/coordinators`
- **Page Component**: `Church-Site/Frontend/src/app/(main)/coordinators/page.tsx`

### Coordinators Page Data Requirements
The coordinators page displays two main sections:

#### 1. Coordinator of the Month Section
- **Section**: "Coordinator of the Month"
- **Purpose**: Shows the featured coordinator with full details
- **Data Source**: Featured Coordinator API
- **Display**: Name, occupation, phone, image, and biography
- **Dynamic**: Based on `isFeatured` field in database

#### 2. Coordinators Spotlight Section
- **Section**: "Coordinators Spotlight"
- **Purpose**: Shows all non-featured coordinators in a grid
- **Data Source**: All Coordinators API (filtered to exclude featured)
- **Display**: Coordinator cards with image, name, occupation, and phone
- **Images**: Coordinator profile images stored in AWS S3

### Coordinators Page API Calls

#### 1. Featured Coordinator Endpoint ✅ **New**
```
GET https://api-2at6qg5khq-uc.a.run.app/coordinator/featured
```
- **Hook**: `useCoordinator()` → `getFeaturedCoordinator()`
- **Used for**: Coordinator of the Month section
- **Data Structure**: `{ _id, name, occupation, phone_number, image_url, about, isFeatured: true }`

#### 2. All Coordinators Endpoint
```
GET https://api-2at6qg5khq-uc.a.run.app/coordinator
```
- **Hook**: `useCoordinator()` → `getAllCoordinators()`
- **Used for**: Coordinators Spotlight section (filtered to exclude featured)
- **Data Structure**: `{ _id, name, occupation, phone_number, image_url, about, isFeatured }`

## Frontend Articles Page Integration ✅ **New**

### Articles Page Location
- **Frontend URL**: `https://church-site-seven.vercel.app/articles`
- **Page Component**: `Church-Site/Frontend/src/app/(main)/articles/page.tsx`

### Articles Page Data Requirements
The articles page displays a comprehensive list of all articles with full author information:

#### 1. Articles with Authors Section
- **Section**: "Latest Articles"
- **Purpose**: Shows all articles with full author details and pagination
- **Data Source**: Enhanced Articles API with Authors
- **Display**: Article cards with S3 images, titles, author information, excerpts, read times
- **Features**: Pagination, search capability, responsive grid layout
- **Images**: High-quality S3 thumbnails
- **Authors**: Complete author profiles with names and images

#### 2. Pagination Controls
- **Purpose**: Navigate through large number of articles
- **Features**: Previous/Next buttons, page numbers, article count display
- **Performance**: Only loads articles for current page

### Articles Page API Calls

#### 1. Enhanced Articles with Pagination ✅ **New**
```
GET https://api-2at6qg5khq-uc.a.run.app/article/with-authors?page=1&limit=12
```
- **Hook**: `useArticles()` → `getAllArticlesWithAuthors(page, 12)`
- **Used for**: All articles display with pagination
- **Data Structure**: Enhanced articles with populated author information and pagination metadata
- **Features**: Author names, profile images, calculated read times, time ago formatting
- **Pagination**: Page controls, total counts, navigation state

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

### 2. Article Endpoints ✅ **Enhanced with Author Population & Blog Integration**
- `GET /article` - Get all articles (basic) ✅ **Legacy endpoint**
- `GET /article/with-authors` - Get articles with author info & pagination ✅ **New - Used on Homepage & Articles Page**
- `GET /article/:id` - Get article by ID (basic)
- `GET /article/:id/with-author` - Get article by ID with author info ✅ **New**
- `POST /article` - Create article (JSON only)
- `POST /article/with-image` - Create article with image upload
- `POST /article/upload-image` - Upload image only
- `PUT /article/:id` - Update article (JSON only)
- `PUT /article/:id/with-image` - Update article with image upload
- `PATCH /article/:id` - Partially update article (JSON only)
- `PATCH /article/:id/with-image` - Partially update article with image
- `DELETE /article/:id` - Delete article (also deletes S3 image)

### 3. Author Endpoints
- `GET /author` - Get all authors
- `GET /author/:id` - Get author by ID
- `POST /author` - Create author
- `PUT /author/:id` - Update author
- `PATCH /author/:id` - Partially update author
- `DELETE /author/:id` - Delete author

### 4. Coordinator Endpoints ✅ **Updated with S3 Image Support & Featured System**
- `GET /coordinator` - Get all coordinators ✅ **Used on Coordinators Page**
- `GET /coordinator/featured` - Get featured coordinator ✅ **New - Used on Coordinators Page**
- `GET /coordinator/:id` - Get coordinator by ID
- `POST /coordinator` - Create coordinator (JSON only)
- `POST /coordinator/with-image` - Create coordinator with image upload ✅ **New**
- `POST /coordinator/upload-image` - Upload image only ✅ **New**
- `PUT /coordinator/:id` - Update coordinator (JSON only)
- `PUT /coordinator/:id/with-image` - Update coordinator with image upload ✅ **New**
- `PATCH /coordinator/:id` - Partially update coordinator (JSON only)
- `PATCH /coordinator/:id/with-image` - Partially update coordinator with image ✅ **New**
- `PATCH /coordinator/:id/featured` - Set coordinator as featured ✅ **New**
- `DELETE /coordinator/:id` - Delete coordinator (also deletes S3 image)

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
The API includes comprehensive S3 integration for handling images:

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
├── coordinators/
│   ├── uuid-3.jpg
│   ├── uuid-4.png
│   └── ...
└── pastors/
    ├── uuid-5.jpg
    └── ...
```

### Article Image Upload Endpoints

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

### Coordinator Image Upload Endpoints ✅ **New**

#### Upload Coordinator Image Only
```
POST /coordinator/upload-image
Content-Type: multipart/form-data

Body:
- image: File (required)
```

#### Create Coordinator with Image
```
POST /coordinator/with-image
Content-Type: multipart/form-data

Body:
- image: File (optional)
- name: String (required)
- occupation: String (required)
- phone_number: String (required)
- about: String (required)
- isFeatured: Boolean (optional, default: false)
```

#### Update Coordinator with Image
```
PUT /coordinator/:id/with-image
PATCH /coordinator/:id/with-image
Content-Type: multipart/form-data

Body:
- image: File (optional) - replaces existing image if provided
- name: String (optional)
- occupation: String (optional)
- phone_number: String (optional)
- about: String (optional)
- isFeatured: Boolean (optional)
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

### Enhanced Article with Author ✅ **New**
```typescript
interface ArticleWithAuthor {
  _id: string;
  displayImage: string; // S3 URL or CloudFront URL
  title: string;
  authorId: string;
  author: Author | null; // Populated author information
  text: string;
  excerpt: string; // First 150 characters + "..."
  date: string;
  formattedDate: string; // "January 1, 2024"
  timeAgo: string; // "2 hours ago"
  readTime: Date;
  estimatedReadTime: string; // "5 mins read"
}
```

### Author ✅ **Enhanced**
```typescript
interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Combined first and last name
  profileImage: string;
}
```

### Coordinator ✅ **Updated with S3 Support & Featured System**
```typescript
interface Coordinator {
  _id: string;
  name: string;
  occupation: string;
  phone_number: string;
  image_url: string; // S3 URL or CloudFront URL
  about: string;
  isFeatured: boolean; // New field for featured coordinator
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

### Enhanced Articles Response ✅ **New**
```json
{
  "status": "Success",
  "message": "Articles with authors loaded successfully",
  "data": [
    {
      "_id": "article_id",
      "displayImage": "https://bucket.s3.amazonaws.com/articles/uuid.jpg",
      "title": "Article Title",
      "authorId": "author_id",
      "author": {
        "_id": "author_id",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "profileImage": "https://bucket.s3.amazonaws.com/authors/author.jpg"
      },
      "text": "Full article content...",
      "excerpt": "First 150 characters of the article...",
      "date": "2024-01-01T00:00:00Z",
      "formattedDate": "January 1, 2024",
      "timeAgo": "2 hours ago",
      "readTime": "2024-01-01T00:05:00Z",
      "estimatedReadTime": "5 mins read"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalArticles": 48,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Featured Coordinator Response ✅ **New**
```json
{
  "status": "Success",
  "message": "Featured coordinator loaded successfully",
  "data": {
    "_id": "coordinator_id",
    "name": "John Doe",
    "occupation": "Senior Coordinator",
    "phone_number": "+234123456789",
    "image_url": "https://bucket.s3.amazonaws.com/coordinators/uuid.jpg",
    "about": "Biography and background information...",
    "isFeatured": true
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
2. **Coordinators Page Performance**: The coordinators page makes 2 concurrent API calls on load
3. **Articles Page Performance**: The articles page makes 1 API call with pagination for optimal loading
4. **Data Validation**: All update operations include validation
5. **Image Management**: Automatic S3 cleanup when articles/coordinators are updated/deleted
6. **Featured System**: Only one coordinator can be featured at a time
7. **Author Population**: Articles automatically include full author information
8. **Read Time Calculation**: Estimated reading time calculated at 200 words per minute
9. **Deployment**: Backend deployed on Google Cloud Run
10. **Frontend**: Deployed on Vercel

## API Statistics

**Total Endpoints**: **58**
- **7 entities** with full CRUD operations
- **8 image upload endpoints** (4 articles + 4 coordinators)
- **6 special endpoints** (featured coordinator, active pastor, latest pastor corner, posts by pastor, articles with authors, article by ID with author)

**Homepage API Calls**: **3**
- Activities, Enhanced Articles (with S3 images & authors), and Pastor Corner

**Coordinators Page API Calls**: **2**
- Featured Coordinator and All Coordinators (with S3 images)

**Articles Page API Calls**: **1**
- Enhanced Articles with Authors and Pagination (with S3 images)

## Recent Improvements

### S3 Image Integration for Articles ✅ **Previous**
- **Before**: Article images stored as URLs or file paths
- **After**: Professional S3 integration with automatic management
- **Features**: Upload, update, delete, validation, CDN support
- **Benefits**: Scalable, secure, fast image delivery

### S3 Image Integration for Coordinators ✅ **Previous**
- **Before**: Hardcoded image URLs and dummy data
- **After**: Professional S3 integration with automatic management
- **Features**: Upload, update, delete, validation, CDN support for coordinator profile images
- **Benefits**: Scalable, secure, fast image delivery

### Featured Coordinator System ✅ **Previous**
- **Before**: Hardcoded search for "Fatoki Victor"
- **After**: Dynamic featured coordinator system based on database field
- **Features**: Set any coordinator as featured, automatic featured status management
- **Benefits**: Flexible, dynamic, admin-controllable

### Coordinators Page Evolution ✅ **Previous**
- **Before**: Hardcoded "Fatoki Victor" lookup and dummy data in spotlight
- **After**: Dynamic featured coordinator and real data for all coordinators
- **Features**: 
  - Dynamic "Coordinator of the Month" based on `isFeatured` field
  - Real coordinator data in spotlight section
  - S3 image support for all coordinator profiles
  - Concurrent API calls for optimal performance
  - Fallback handling when no featured coordinator exists
- **Benefits**: Fully dynamic, data-driven, maintainable

### Articles Page Integration ✅ **New**
- **Before**: Mixed dummy and real data, hardcoded authors, static images
- **After**: Fully dynamic articles page with complete author integration
- **Features**:
  - Real author information populated from Author collection
  - S3 images for all article thumbnails
  - Calculated read times based on word count
  - Time ago formatting ("2 hours ago", "3 days ago")
  - Article excerpts automatically generated
  - Pagination for large article collections
  - Responsive grid layout
  - Loading states and error handling
- **Benefits**: Professional articles experience, scalable content management

### Enhanced Articles System ✅ **New**
- **Before**: Basic article data without author details
- **After**: Rich article objects with populated author information
- **Features**:
  - Author names, profile images, and full details
  - Smart read time calculation (200 words per minute)
  - Automatic excerpt generation (first 150 characters)
  - Multiple date formats (formatted date, time ago)
  - Pagination support for large datasets
  - Fallback handling for missing authors
- **Benefits**: Rich content display, better user experience

### Homepage Articles Enhancement ✅ **New**
- **Before**: Homepage mixed dummy data with real article content
- **After**: Homepage uses enhanced articles with full author data
- **Features**: Real S3 images, author names, proper read times, excerpts
- **Benefits**: Consistent data across homepage and articles page

### Pastor's Corner Evolution ✅ **Previous**
- **Before**: Static hardcoded welcome message
- **After**: Dynamic pastor corner posts tied to specific pastors
- **Features**: Latest published post automatically shows on homepage
- **Management**: Admin can create, update, and manage pastor corner content
- **Fallback**: Graceful handling when no posts are available
- **Attribution**: Publication date display and pastor relationship

### Key Features Added
- **S3 Image Storage**: Professional cloud storage for article and coordinator images
- **Image Validation**: Type and size validation with proper error handling
- **Automatic Cleanup**: Old images deleted when articles/coordinators updated/removed
- **CDN Support**: CloudFront integration for faster global delivery
- **Dynamic Content**: Pastor corner posts and featured coordinators can be created and managed
- **Author Integration**: Complete author-article relationship with population
- **Smart Calculations**: Automatic read time estimation and excerpt generation
- **Date Formatting**: Multiple date display formats for better UX
- **Pagination System**: Efficient handling of large article collections
- **Pastor Association**: Each post is tied to a specific pastor
- **Publication Control**: Posts can be published/unpublished
- **Homepage Integration**: Latest post automatically appears
- **Coordinators Page Integration**: Featured coordinator and all coordinators display properly
- **Articles Page Integration**: Professional articles experience with full author details
- **Fallback Support**: Graceful handling when no posts/coordinators/authors exist
- **Featured System**: One coordinator can be featured at a time with automatic management

## Future Enhancements

Potential areas for improvement:
- Add authentication and authorization
- Implement search functionality for articles
- Add article categories and tags
- Include rate limiting
- Add request validation middleware
- Implement caching for frequently accessed data
- Extend S3 integration to other entities (Pastor images, Memory images)
- Add image resizing and optimization
- Implement image metadata extraction
- Add coordinator search and filtering
- Add coordinator categories/departments
- Implement coordinator rotation system for featured status
- Add article comments system
- Implement article bookmarking
- Add social sharing capabilities
- Create RSS feed for articles
- Add article draft system
- Implement article versioning 
- Add article draft system
- Implement article versioning 
- Implement caching for frequently accessed data 