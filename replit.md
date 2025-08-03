

# Next.js Application Project

## Overview
This is a Next.js application built as a single-page app (SPA) for API documentation. It features a modern, mobile-first design with a bottom navigation bar.

## Recent Changes
- **2025-02-03**: Added a stateful API counter feature with a PostgreSQL database.
- **2025-02-03**: Implemented a `/api/cron` endpoint for automatic database cleanup of old records.
- **2025-02-02**: Major UI overhaul. Replaced sidebar with a bottom navigation bar (Home, Category, Search, Blog).
- **2025-02-02**: Converted the documentation page into the main application at the root (`/`).
- **2025-02-02**: Moved the blog content to a dedicated `/blog` page.
- **2025-02-01**: Restructured the site to have a blog at the root (/) and moved the API documentation to /docs.
- **2025-01-30**: Fixed ES6 import statement errors in API routes by replacing CommonJS require() with dynamic import()
- **2025-01-30**: Updated docs.js API endpoint to use proper file:// URLs for dynamic imports
- **2025-01-30**: Installed missing Node.js dependencies (axios, cheerio) that were causing module not found errors
- **2025-01-30**: Restarted the development workflow to ensure proper application startup

## Project Architecture
- **Framework**: Next.js 13.0.0
- **Runtime**: Node.js 22
- **Main Dependencies**: 
  - axios: HTTP client for API requests
  - cheerio: Server-side HTML parsing
  - react-syntax-highlighter: Code highlighting
  - formidable: File upload handling
  - glob: File pattern matching
  - pg: PostgreSQL client for Node.js

## Development Setup
- Run `npm install` to install dependencies.
- Run `npm run dev` to start the development server.
- The application runs on port 3000.

## Current Status
The application now functions as an SPA with database connectivity. Dependencies are installed, and the dev server is ready.