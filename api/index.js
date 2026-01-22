// Simple in-memory cache that persists across requests
let globalCache = {};

// Sample blog data
const blogPosts = [
    {
        id: 1,
        date: "2024-01-20T10:00:00",
        slug: "best-coffee-shops-downtown",
        status: "publish",
        title: { rendered: "Top 10 Coffee Shops in Downtown You Must Visit" },
        content: { rendered: "<p>Coffee culture has exploded in downtown areas, and finding the perfect cup has become an art form. Whether you're a casual coffee drinker or a serious connoisseur, these handpicked locations offer something special.</p><p>From artisanal roasters to cozy neighborhood spots, each cafe on this list brings its own unique character and exceptional brews. Let's explore what makes each of these places worth your time and taste buds.</p><p>The atmosphere, quality of beans, and skilled baristas all contribute to an unforgettable coffee experience that goes beyond just caffeine.</p>" },
        excerpt: { rendered: "Discover the most amazing coffee shops downtown has to offer, from artisanal roasters to cozy neighborhood gems..." },
        author: 1,
        featured_media: 1,
        categories: [1, 4],
        tags: [1, 4, 5]
    },
    {
        id: 2,
        date: "2024-01-18T14:30:00",
        slug: "healthy-meal-prep-ideas",
        status: "publish",
        title: { rendered: "5 Easy Meal Prep Ideas for Busy Professionals" },
        content: { rendered: "<p>Meal prepping doesn't have to be complicated or time-consuming. With the right strategies and recipes, you can prepare nutritious meals that will keep you energized throughout your busy week.</p><p>These five meal prep ideas focus on simple ingredients, balanced nutrition, and flavors that actually improve over time. Each recipe can be prepared in under 30 minutes and stored for up to 5 days.</p><p>From protein-packed breakfast bowls to satisfying dinner combinations, these meals will help you maintain healthy eating habits even during your busiest days.</p>" },
        excerpt: { rendered: "Simple and nutritious meal prep recipes perfect for maintaining healthy eating habits during busy workweeks..." },
        author: 1,
        featured_media: 2,
        categories: [2, 3],
        tags: [2, 3, 6]
    },
    {
        id: 3,
        date: "2024-01-15T09:15:00",
        slug: "weekend-hiking-trails-guide",
        status: "publish",
        title: { rendered: "Weekend Warrior's Guide to Local Hiking Trails" },
        content: { rendered: "<p>Escape the city hustle and reconnect with nature on these incredible local hiking trails. Each trail offers unique scenery, varying difficulty levels, and the perfect opportunity to recharge your batteries.</p><p>Whether you're a beginner looking for gentle walks or an experienced hiker seeking challenging terrain, our local area has something for everyone. These trails showcase the natural beauty that's often hidden just outside our urban environment.</p><p>Pack your hiking boots, grab some water, and prepare to discover breathtaking views and peaceful moments in nature.</p>" },
        excerpt: { rendered: "Explore the best local hiking trails perfect for weekend adventures and connecting with nature..." },
        author: 1,
        featured_media: 3,
        categories: [4, 5],
        tags: [4, 7, 8]
    },
    {
        id: 4,
        date: "2024-01-12T16:45:00",
        slug: "home-gardening-beginners-tips",
        status: "publish",
        title: { rendered: "Starting Your First Home Garden: A Beginner's Journey" },
        content: { rendered: "<p>Growing your own vegetables and herbs is one of the most rewarding hobbies you can start. There's something magical about nurturing a seed into a thriving plant that eventually feeds your family.</p><p>This beginner's guide covers everything from choosing the right location and soil preparation to selecting plants that are forgiving for new gardeners. You don't need a large space or expensive equipment to get started.</p><p>Even a small balcony or windowsill can become a productive garden with the right approach and plant choices.</p>" },
        excerpt: { rendered: "Everything you need to know to start your first home garden, from soil prep to plant selection..." },
        author: 1,
        featured_media: 4,
        categories: [3, 5],
        tags: [3, 5, 9]
    },
    {
        id: 5,
        date: "2024-01-10T11:20:00",
        slug: "photography-tips-smartphone",
        status: "publish",
        title: { rendered: "Smartphone Photography: Capturing Professional-Looking Photos" },
        content: { rendered: "<p>Your smartphone is capable of taking stunning photographs that rival traditional cameras when you know the right techniques. Modern phone cameras have incredible capabilities that most people never fully utilize.</p><p>From understanding lighting and composition to using built-in editing tools effectively, these tips will transform your everyday snapshots into memorable images worth sharing and printing.</p><p>The best camera is the one you have with you, and chances are, that's your smartphone. Let's unlock its full potential together.</p>" },
        excerpt: { rendered: "Learn professional photography techniques using just your smartphone camera..." },
        author: 1,
        featured_media: 5,
        categories: [1, 6],
        tags: [1, 6, 10]
    },
    {
        id: 6,
        date: "2024-01-08T13:10:00",
        slug: "budget-travel-tips-2024",
        status: "publish",
        title: { rendered: "Budget Travel Hacks: See the World Without Breaking the Bank" },
        content: { rendered: "<p>Traveling doesn't have to drain your savings account. With smart planning, flexible dates, and insider knowledge, you can explore amazing destinations while staying within your budget.</p><p>These proven strategies cover everything from finding cheap flights and accommodation to eating well for less and discovering free activities that locals love.</p><p>The key to budget travel is being resourceful, not restrictive. You can still have incredible experiences while being mindful of your spending.</p>" },
        excerpt: { rendered: "Discover proven strategies for traveling the world on a budget without sacrificing amazing experiences..." },
        author: 1,
        featured_media: 6,
        categories: [4, 6],
        tags: [4, 6, 11]
    }
];

const categories = [
    { id: 1, name: "Lifestyle", slug: "lifestyle" },
    { id: 2, name: "Health & Wellness", slug: "health-wellness" },
    { id: 3, name: "Food & Recipes", slug: "food-recipes" },
    { id: 4, name: "Travel", slug: "travel" },
    { id: 5, name: "Outdoor Activities", slug: "outdoor-activities" },
    { id: 6, name: "Photography", slug: "photography" }
];

const tags = [
    { id: 1, name: "Coffee", slug: "coffee" },
    { id: 2, name: "Meal Prep", slug: "meal-prep" },
    { id: 3, name: "Gardening", slug: "gardening" },
    { id: 4, name: "Adventure", slug: "adventure" },
    { id: 5, name: "Beginner Tips", slug: "beginner-tips" },
    { id: 6, name: "Budget", slug: "budget" },
    { id: 7, name: "Hiking", slug: "hiking" },
    { id: 8, name: "Nature", slug: "nature" },
    { id: 9, name: "DIY", slug: "diy" },
    { id: 10, name: "Tips", slug: "tips" },
    { id: 11, name: "Money Saving", slug: "money-saving" }
];

function handleCORS(req, res) {
    const origin = req.headers.origin;
    const baseUrl = req.url.split('?')[0];
    const cacheKey = baseUrl;
    const now = Date.now();
    
    const cachedResponse = globalCache[cacheKey];
    if (cachedResponse && (now - cachedResponse.timestamp) < 300000) { // 5 min cache
        res.setHeader('X-Cache', 'hit');
        // VULNERABILITY: Return cached origin (might be different from current request)
        res.setHeader('Access-Control-Allow-Origin', cachedResponse.origin);
        res.setHeader('Content-Type', 'application/json');
        return { data: cachedResponse.data, cached: true, cacheKey };
    }
    
    res.setHeader('X-Cache', 'miss');
    // VULNERABILITY: Echo the origin header instead of using wildcard
    const responseOrigin = origin || '*';
    res.setHeader('Access-Control-Allow-Origin', responseOrigin);
    res.setHeader('Content-Type', 'application/json');
    
    return { 
        cached: false, 
        cacheKey, 
        origin: responseOrigin,
        timestamp: now
    };
}

module.exports = (req, res) => {
    const { url, method } = req;
    
    // Set Vercel cache headers to disable edge caching for demo
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Simulate application cache status based on Vercel cache
    const isVercelCached = req.headers['x-vercel-cache'] === 'HIT';
    if (isVercelCached) {
        res.setHeader('X-Cache', 'hit');
    } else {
        res.setHeader('X-Cache', 'miss');
    }
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin');
        return res.status(200).end();
    }
    
    // Root wp-json endpoint
    if (url === '/wp-json' || url.startsWith('/wp-json?')) {
        const corsResult = handleCORS(req, res);
        
        const responseData = {
            name: "LifeStyle Blog",
            description: "Your Daily Inspiration",
            url: req.headers.host ? `https://${req.headers.host}` : "http://localhost:3000",
            home: req.headers.host ? `https://${req.headers.host}` : "http://localhost:3000",
            routes: {
                "/wp-json/wp/v2/posts": {
                    "methods": ["GET"],
                    "endpoints": [{ "methods": ["GET"], "args": {} }]
                }
            }
        };
        
        if (!corsResult.cached) {
            const cacheData = {
                data: responseData,
                origin: corsResult.origin
            };
            cache.set(corsResult.cacheKey, cacheData);
        }
        
        return res.json(corsResult.cached ? corsResult.data : responseData);
    }
    
    // Posts endpoint
    if (url === '/wp-json/wp/v2/posts' || url.startsWith('/wp-json/wp/v2/posts?')) {
        const corsResult = handleCORS(req, res);
        
        if (!corsResult.cached) {
            globalCache[corsResult.cacheKey] = {
                data: blogPosts,
                origin: corsResult.origin,
                timestamp: corsResult.timestamp
            };
        }
        
        return res.json(corsResult.cached ? corsResult.data : blogPosts);
    }
    
    // Single post endpoint
    if (url.match(/^\/wp-json\/wp\/v2\/posts\/(\d+)$/)) {
        const postId = parseInt(url.split('/').pop());
        const corsResult = handleCORS(req, res);
        
        const post = blogPosts.find(p => p.id === postId);
        if (!post) {
            return res.status(404).json({ code: "rest_post_invalid_id", message: "Invalid post ID." });
        }
        
        if (!corsResult.cached) {
            const cacheData = {
                data: post,
                origin: corsResult.origin
            };
            cache.set(corsResult.cacheKey, cacheData);
        }
        
        return res.json(corsResult.cached ? corsResult.data : post);
    }
    
    // Categories endpoint
    if (url === '/wp-json/wp/v2/categories' || url.startsWith('/wp-json/wp/v2/categories?')) {
        const corsResult = handleCORS(req, res);
        
        if (!corsResult.cached) {
            const cacheData = {
                data: categories,
                origin: corsResult.origin
            };
            cache.set(corsResult.cacheKey, cacheData);
        }
        
        return res.json(corsResult.cached ? corsResult.data : categories);
    }
    
    // Tags endpoint
    if (url === '/wp-json/wp/v2/tags' || url.startsWith('/wp-json/wp/v2/tags?')) {
        const corsResult = handleCORS(req, res);
        
        if (!corsResult.cached) {
            const cacheData = {
                data: tags,
                origin: corsResult.origin
            };
            cache.set(corsResult.cacheKey, cacheData);
        }
        
        return res.json(corsResult.cached ? corsResult.data : tags);
    }
    
    // Clear cache endpoint
    if (url === '/clear-cache') {
        globalCache = {};
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Content-Type', 'application/json');
        return res.json({ message: 'Cache cleared successfully' });
    }
    
    // Default 404
    return res.status(404).json({ error: 'Not found' });
};

// Alternative: Time-based cache (replace handleCORS function above to use)
/*
function handleCORS(req, res) {
    const origin = req.headers.origin;
    const cacheKey = req.url;
    const CACHE_DELAY = 30000; // 30 seconds delay before cache hit
    
    const cacheEntry = cache.get(cacheKey);
    const now = Date.now();
    
    if (cacheEntry && (now - cacheEntry.timestamp) > CACHE_DELAY) {
        res.setHeader('X-Cache', 'hit');
        res.setHeader('Access-Control-Allow-Origin', cacheEntry.origin);
        res.setHeader('Content-Type', 'application/json');
        return { data: cacheEntry.data, cached: true };
    }
    
    res.setHeader('X-Cache', 'miss');
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Content-Type', 'application/json');
    return { cached: false };
}
*/
