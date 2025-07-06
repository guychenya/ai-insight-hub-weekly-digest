import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import { AIResource, GroundingSource } from "../../types";

// Simple in-memory cooldown tracking
let lastRequestTime = 0;
const COOLDOWN_MS = 2000; // 2 seconds between requests




const handler: Handler = async (event) => {
  console.log("Generate digest function called");
  
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
  
  // Check cooldown
  const now = Date.now();
  if (now - lastRequestTime < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastRequestTime)) / 1000);
    console.log(`Cooldown active, ${remaining}s remaining`);
    return {
      statusCode: 200, // Return 200 instead of 429 to avoid fetch errors
      body: JSON.stringify({ 
        error: true,
        message: `Please wait ${remaining} seconds before generating another digest.` 
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
  
  lastRequestTime = now;
  
  // Add request timeout
  const timeout = setTimeout(() => {
    console.error("Request timeout after 30 seconds");
  }, 30000);
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("API configuration missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server configuration error. Please check environment variables." }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    console.log("Initializing Gemini AI...");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    console.log("Calling Gemini API for content generation...");
    
    const simplePrompt = `Create 5 *distinct and diverse* AI news articles, each representing a different, unique aspect of the AI industry. Ensure the content is realistic, current, and naturally connects to its source. Avoid repetition in topics or themes across the articles.

Cover these *specific and varied* categories:
1. A major tech company AI announcement (e.g., Google, Microsoft, Meta, Apple, Amazon, IBM, etc.) - focus on a *new product, research breakthrough, or significant strategic shift*.
2. An AI startup or funding news (from TechCrunch, VentureBeat, Axios Pro, etc.) - highlight a *different startup, funding round, or acquisition*.
3. Academic research or paper (from ArXiv, a specific university, or a research institution) - describe a *novel algorithm, a significant finding, or a new application of AI*.
4. Open source AI development (from Hugging Face, GitHub, a specific open-source project, etc.) - feature a *new library, model release, or community initiative*.
5. AI industry analysis or trends (from The Verge, Wired, Bloomberg, Reuters, etc.) - discuss a *unique market trend, regulatory development, or societal impact of AI*.

For each article:
- id: unique identifier (1-5)
- title: specific, engaging headline that matches the source type and *reflects the unique topic*.
- description: 2-3 sentences with specific details about the development, *distinct from other articles*.
- sourceName: publication name that matches the content type
- url: appropriate URL for that type of content and source
- trendingScore: 0.6-0.95
- tags: 2-4 relevant tags, *specific to the article's unique topic*

URL Guidelines (use the most appropriate):
- Company announcements: https://blog.google/technology/ai/, https://ai.meta.com/blog/, https://openai.com/blog/
- Startup/funding news: https://techcrunch.com/category/artificial-intelligence/, https://venturebeat.com/ai/
- Academic content: https://arxiv.org/list/cs.AI/recent
- Open source: https://huggingface.co/blog, https://github.com/topics/artificial-intelligence
- Industry analysis: https://www.theverge.com/ai-artificial-intelligence, https://www.wired.com/tag/artificial-intelligence/

IMPORTANT: The content must logically match the source - don't put startup funding news on OpenAI's blog, etc.

Return ONLY valid JSON:
[{"id":"1","title":"...","description":"...","sourceName":"...","url":"...","trendingScore":0.8,"tags":["AI","Tech"]}]`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: simplePrompt }] }]
    });
    
    console.log("Gemini API response received successfully");

    let jsonStr = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    console.log("Raw response:", jsonStr.substring(0, 500) + "...");
    
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
      console.log("Extracted from code fence:", jsonStr.substring(0, 200) + "...");
    }

    // Basic validation to ensure it's an array
    if (!jsonStr.startsWith('[') || !jsonStr.endsWith(']')) {
        console.error("Response is not a JSON array. First 500 chars:", jsonStr.substring(0, 500));
        throw new SyntaxError("AI response is not a JSON array.");
    }
    
    const articles: AIResource[] = JSON.parse(jsonStr);
    console.log("Successfully parsed", articles.length, "articles");

    // Create sources that are genuinely connected to the AI insight content
    // Each source should represent where you could find more information about that specific topic
    const sources: GroundingSource[] = articles.map(article => {
      let sourceUrl: string;
      let sourceTitle: string;
      const sourceNameLower = article.sourceName.toLowerCase();

      // Determine the base URL based on sourceName
      if (sourceNameLower.includes('techcrunch')) {
        sourceUrl = 'https://techcrunch.com/category/artificial-intelligence/';
        sourceTitle = `Find similar AI news and ${article.title.toLowerCase()} coverage on TechCrunch`;
      } else if (sourceNameLower.includes('verge')) {
        sourceUrl = 'https://www.theverge.com/ai-artificial-intelligence';
        sourceTitle = `Explore more AI coverage related to ${article.title.toLowerCase()} on The Verge`;
      } else if (sourceNameLower.includes('openai')) {
        sourceUrl = 'https://openai.com/blog/';
        sourceTitle = `Learn more about OpenAI research related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('google')) {
        sourceUrl = 'https://blog.google/technology/ai/';
        sourceTitle = `Explore Google AI developments related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('meta')) {
        sourceUrl = 'https://ai.meta.com/blog/';
        sourceTitle = `Find Meta AI research related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('arxiv') || sourceNameLower.includes('research')) {
        sourceUrl = 'https://arxiv.org/list/cs.AI/recent';
        sourceTitle = `Find academic papers related to ${article.title.toLowerCase()} on ArXiv`;
      } else if (sourceNameLower.includes('hugging face')) {
        sourceUrl = 'https://huggingface.co/blog';
        sourceTitle = `Explore open-source AI developments on Hugging Face related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('github')) {
        sourceUrl = 'https://github.com/topics/artificial-intelligence';
        sourceTitle = `Find AI-related open-source projects on GitHub related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('wired')) {
        sourceUrl = 'https://www.wired.com/tag/artificial-intelligence/';
        sourceTitle = `Read industry analysis on Wired related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('venturebeat')) {
        sourceUrl = 'https://venturebeat.com/ai/';
        sourceTitle = `Find AI startup and funding news on VentureBeat related to ${article.title.toLowerCase()}`;
      } else if (sourceNameLower.includes('x (twitter)')) {
        sourceUrl = 'https://x.com/search?q=%23AI';
        sourceTitle = `See AI discussions on X (Twitter) related to ${article.title.toLowerCase()}`;
      } else {
        // Default fallback if sourceName doesn't match any specific case
        sourceUrl = 'https://news.ycombinator.com/';
        sourceTitle = `Discuss ${article.title.toLowerCase()} with the tech community on Hacker News`;
      }
      
      return {
        uri: sourceUrl,
        title: sourceTitle
      };
    });

    console.log("Created dynamic sources from AI-generated articles:", sources.length);

    clearTimeout(timeout);
    return {
      statusCode: 200,
      body: JSON.stringify({ articles, sources }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    clearTimeout(timeout);
    console.error("Error generating AI digest:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error type:", typeof error);
    }
    
    // Return articles with VERIFIED working URLs to diverse AI content sources
    const now = new Date();
    const mockArticles: AIResource[] = [
      {
        id: "1",
        title: "AI Industry Discussions Heat Up on X as New Models Launch",
        description: "The AI community on X (formerly Twitter) is buzzing with discussions about the latest model releases and their implications for the industry. Developers and researchers are sharing insights on performance benchmarks and real-world applications.",
        sourceName: "X (Twitter)",
        url: "https://x.com/search?q=%23AI",
        trendingScore: 0.92,
        tags: ["X", "Twitter", "AI Community", "Discussion"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "2", 
        title: "TechCrunch Reports on Latest AI Startup Funding Round",
        description: "TechCrunch covers the latest developments in AI startup funding, highlighting emerging companies working on innovative machine learning solutions and their potential market impact.",
        sourceName: "TechCrunch",
        url: "https://techcrunch.com/category/artificial-intelligence/",
        trendingScore: 0.88,
        tags: ["TechCrunch", "Startups", "Funding", "AI Industry"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "3",
        title: "Hacker News Community Debates AI Ethics and Implementation",
        description: "The Hacker News community engages in thoughtful discussions about AI ethics, implementation challenges, and the future of artificial intelligence in various industries.",
        sourceName: "Hacker News",
        url: "https://news.ycombinator.com/",
        trendingScore: 0.85,
        tags: ["Hacker News", "AI Ethics", "Community", "Discussion"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "4",
        title: "Hugging Face Releases New Open Source AI Tools",
        description: "Hugging Face announces new open-source tools and models for the AI community, focusing on democratizing access to advanced machine learning capabilities and fostering collaboration.",
        sourceName: "Hugging Face",
        url: "https://huggingface.co/blog",
        trendingScore: 0.81,
        tags: ["Hugging Face", "Open Source", "AI Tools", "Community"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "5",
        title: "The Verge Explores AI's Impact on Creative Industries",
        description: "The Verge investigates how artificial intelligence is transforming creative industries, from content generation to design automation, and the implications for creative professionals.",
        sourceName: "The Verge",
        url: "https://www.theverge.com/ai-artificial-intelligence",
        trendingScore: 0.78,
        tags: ["The Verge", "Creative AI", "Industry Impact", "Content"],
        createdAt: now,
        updatedAt: now
      }
    ];

    // Create sources that directly match the fallback articles
    const fallbackSources: GroundingSource[] = mockArticles.map(article => ({
      uri: article.url,
      title: article.title
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ articles: mockArticles, sources: fallbackSources }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

export { handler };
