#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net --allow-write

import { createZypherContext, ZypherAgent } from "@corespeed/zypher";
import { from, Observable } from "rxjs";

// Helper function to ensure HOME directory is set (required for Zypher)
function ensureHomeDirectory() {
  if (!Deno.env.get("HOME")) {
    if (Deno.build.os === "windows") {
      const userProfile = Deno.env.get("USERPROFILE");
      if (userProfile) {
        Deno.env.set("HOME", userProfile);
      }
    } else {
      const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
      if (home) {
        Deno.env.set("HOME", home);
      }
    }
  }

  if (!Deno.env.get("HOME")) {
    throw new Error(
      "HOME directory not set. Please set HOME environment variable or USERPROFILE on Windows.",
    );
  }
}

// Custom Gemini Model Provider
class GeminiModelProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-2.0-flash") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt: string): Promise<Observable<string>> {
    const url =
      `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return from([text]);
  }

  async streamChat(
    messages: Array<{ role: string; content: string }>,
  ): Promise<Observable<string>> {
    const url =
      `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`;

    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return from([text]);
  }
}

// Helper function to fetch text from URL
async function fetchTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const text = await response.text();
    if (text.includes("<html") || text.includes("<!DOCTYPE")) {
      return text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    return text;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching URL: ${message}`);
  }
}

// Function to summarize text
async function summarizeText(text: string, apiKey: string): Promise<string> {
  const prompt =
    `Please provide a concise summary (2-3 sentences) and exactly three key bullet-point takeaways for the following text. Format your response as:

SUMMARY:
[Your concise summary here]

KEY TAKEAWAYS:
• [First takeaway]
• [Second takeaway]
• [Third takeaway]

Text to summarize:
${text}`;

  const model = "gemini-2.0-flash";
  const url =
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt,
        }],
      }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle requests
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Serve static files
  if (path === "/" || path === "/index.html") {
    try {
      const file = await Deno.readFile("./index.html");
      return new Response(file, {
        headers: { ...corsHeaders, "Content-Type": "text/html" },
      });
    } catch {
      return new Response("index.html not found", { status: 404 });
    }
  }

  if (path === "/app.js") {
    try {
      const file = await Deno.readFile("./app.js");
      return new Response(file, {
        headers: { ...corsHeaders, "Content-Type": "application/javascript" },
      });
    } catch {
      return new Response("app.js not found", { status: 404 });
    }
  }

  if (path === "/styles.css") {
    try {
      const file = await Deno.readFile("./styles.css");
      return new Response(file, {
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });
    } catch {
      return new Response("styles.css not found", { status: 404 });
    }
  }

  // API endpoint: /api/summarize
  if (path === "/api/summarize" && req.method === "POST") {
    try {
      const body = await req.json();
      let { text, url: inputUrl, apiKey } = body;

      // If no API key provided, try reading from file
      if (!apiKey) {
        try {
          const configText = await Deno.readTextFile("./.gemini_api_key");
          apiKey = configText.trim();
        } catch {
          // Config file doesn't exist, that's okay
        }
      }

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error:
              "API key is required. Please enter it in the sidebar or create a .gemini_api_key file.",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      let inputText = "";

      if (inputUrl) {
        inputText = await fetchTextFromUrl(inputUrl);
      } else if (text) {
        inputText = text;
      } else {
        return new Response(
          JSON.stringify({ error: "Either text or URL is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const maxLength = 50000;
      if (inputText.length > maxLength) {
        inputText = inputText.substring(0, maxLength) + "...";
      }

      const summary = await summarizeText(inputText, apiKey);

      return new Response(
        JSON.stringify({ summary }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Response(
        JSON.stringify({ error: message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  }

  return new Response("Not Found", { status: 404 });
}

// Start server
const port = 8000;
const hostname = "0.0.0.0";

console.log(`🚀 Server running on http://localhost:${port}`);

Deno.serve({ port, hostname }, handler);
