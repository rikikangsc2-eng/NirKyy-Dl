

# Next.js Application Project

## Overview
This is a Next.js application with a main blog page and a separate page for API documentation. It uses axios and cheerio for web scraping functionality.

## Recent Changes
- **2025-02-01**: Restructured the site to have a blog at the root (/) and moved the API documentation to /docs.
- **2025-01-30**: Fixed ES6 import statement errors in API routes by replacing CommonJS require() with dynamic import()
- **2025-01-30**: Updated docs.js API endpoint to use proper file:// URLs for dynamic imports
- **2025-01-30**: Installed missing Node.js dependencies (axios, cheerio) that were causing module not found errors
- **2025-01-30**: Restarted the development workflow to ensure proper application startup

## Project Architecture
- **Framework**: Next.js 13.0.0
- **Runtime**: Node.js 22
- **Dependencies**: 
  - axios: HTTP client for API requests
  - cheerio: Server-side HTML parsing and manipulation
  - react-syntax-highlighter: Code highlighting
  - formidable: File upload handling
  - glob: File pattern matching

## Development Setup
- Run `npm install` to install dependencies
- Run `npm run dev` to start development server
- Application runs on port 3000

## User Preferences
- Language: Indonesian
- Prefers installing dependencies before running development server

## Current Status
Dependencies installed successfully. Development server should now run without module resolution errors.