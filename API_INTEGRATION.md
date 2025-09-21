# API Integration for Personal Blog

## Overview
This document describes the changes made to integrate the blog API into the personal blog project for the React Data Fetching assignment.

## Changes Made

### 1. API Service (`src/services/blogApi.js`)
- Created a service to handle API calls to `https://blog-post-project-api.vercel.app/posts`
- Supports query parameters: `page`, `limit`, `category`
- Includes error handling and proper response parsing

### 2. Custom Hook (`src/hooks/useBlogPosts.js`)
- Created a React hook to manage blog posts state
- Handles loading states, errors, and pagination
- Provides methods for changing page, category, and limit
- Automatically fetches data when parameters change

### 3. Updated ArticleSection Component (`src/components/ArticleSection.jsx`)
- Replaced static data import with dynamic API calls
- Added loading spinner and error handling
- Implemented pagination controls
- Enhanced category filtering functionality
- Added posts count display

## Features Implemented

### ✅ Pagination
- Page navigation with Previous/Next buttons
- Page number buttons for direct navigation
- Shows current page and total pages
- Displays posts count information

### ✅ Category Filtering
- Filter posts by category (Highlight, Cat, Inspiration, General)
- Works with both desktop tabs and mobile combobox
- Resets to page 1 when changing category

### ✅ Loading States
- Loading spinner while fetching data
- Error handling with retry functionality
- Smooth user experience

### ✅ API Integration
- Dynamic data fetching from external API
- Proper error handling for network issues
- Query parameter support (page, limit, category)

## API Endpoints Used

- **Base URL**: `https://blog-post-project-api.vercel.app/`
- **Endpoint**: `/posts`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Posts per page (default: 6)
  - `category` (string): Filter by category (optional)

## Usage

The blog now automatically fetches data from the API when the component loads. Users can:

1. **Navigate pages**: Use pagination controls at the bottom
2. **Filter by category**: Click on category tabs or use mobile dropdown
3. **View loading states**: See spinner while data loads
4. **Handle errors**: Retry if API fails

## Technical Details

- Uses React hooks for state management
- Implements proper error boundaries
- Responsive design maintained
- Clean separation of concerns (API service, hooks, components)
- TypeScript-ready structure

## Testing

The API has been tested with:
- Basic data fetching
- Category filtering
- Pagination
- Error handling

All functionality works as expected according to the assignment requirements.