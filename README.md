# CORS Cache Poisoning Demo - Vercel Deployment

A WordPress-like blog demonstrating CORS cache poisoning vulnerability, deployed on Vercel.

## Live Demo

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/cors-cache-poison-demo)

## Local Development

```bash
npm install
npm start
```

## Vercel Deployment

1. **Fork/Clone this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy automatically

3. **Test the vulnerability**:
   - Visit your deployed URL
   - Use the CORS demo page to test cache poisoning
   - Open external test page from different origin

## API Endpoints

- `/wp-json/wp/v2/posts` - Blog posts (vulnerable)
- `/wp-json/wp/v2/categories` - Categories (vulnerable)
- `/wp-json/wp/v2/tags` - Tags (vulnerable)
- `/clear-cache` - Clear cache for testing

## Vulnerability Demo

1. **Main Blog**: `https://your-app.vercel.app/`
2. **CORS Demo**: `https://your-app.vercel.app/index.html`
3. **External Test**: `https://your-app.vercel.app/external.html`

## How It Works

The application demonstrates the exact CORS cache poisoning vulnerability described in the instruction.txt:

- Server echoes Origin header in Access-Control-Allow-Origin
- Responses are cached without including Origin in cache key
- Different origins receive wrong CORS headers from cache
- Results in CORS failures and denial of service

## Files Structure

```
├── api/
│   └── index.js          # Vercel serverless function
├── public/
│   ├── index.html        # Main blog page
│   ├── blog.html         # Alternative blog view
│   └── external.html     # External test page
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```
