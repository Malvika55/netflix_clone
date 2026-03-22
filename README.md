# Netflix Clone (React + Vite + TypeScript)

A Netflix-style app with live catalog updates and playable trailers.

## Features

- Route-based sections (Home, TV Shows, Movies, My List)
- Real-time catalog refresh from TMDB every 60 seconds
- Playable trailers in an in-app modal
- Responsive Netflix-like UI
- Automatic fallback to local mock data if API key is missing

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TMDB REST API

## Setup live data

1. Create a `.env` file in the project root.
2. Add your TMDB API key:

   `VITE_TMDB_API_KEY=your_api_key_here`

If this key is not set, the app still works using local demo data.

## Run locally

Install dependencies and start the dev server.

The app runs at http://localhost:5173 by default.

## Build

Run the build script to create a production bundle.

## Notes

This project streams trailer embeds (YouTube) from TMDB metadata, not full movies.
