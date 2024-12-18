# Based or Biased

A Twitter-based personality analysis app that determines if you're based or biased.

## Images

The app uses the following images from the `/lovable-uploads/` directory:

1. Grey/Chad Wojak: `/lovable-uploads/de2c843b-c6a6-41e9-a60b-59afd80be163.png`
   - Used for both the grey wojak and chad (flipped horizontally)
2. White Wojak: `/lovable-uploads/80766027-5ef1-432a-9f7c-69457750b3cd.png`
   - Used for the analyzing state

## Environment Setup

1. Copy `.env.default` to `.env` and fill in the required values:
```
VITE_SERVER_URL=http://localhost:8787
VITE_TWITTER_CLIENT_ID=your_twitter_client_id
XAI_API_KEY=your_xai_api_key
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
FRONTEND_URL=http://localhost:5173
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Features

- Twitter OAuth integration
- Real-time tweet analysis
- Personality trait scoring
- Based vs Biased calculation
- Modern UI with wojak themes

## Development

The app is built with:
- React + TypeScript
- Vite
- Tailwind CSS
- Twitter OAuth
- X.ai API integration
- Supabase for token storage