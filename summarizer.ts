#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net

import { createZypherContext, ZypherAgent } from "@corespeed/zypher";
import { from, Observable } from "rxjs";

// Custom Gemini Model Provider for Zypher
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

    // Return as Observable for Zypher compatibility
    return from([text]);
  }

  async streamChat(
    messages: Array<{ role: string; content: string }>,
  ): Promise<Observable<string>> {
    const url =
      `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Convert messages to Gemini format
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

    // Return as Observable for Zypher compatibility
    return from([text]);
  }
}

// Helper function to safely get environment variables (kept for potential future use)
function _getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

// Helper function to check if a string is a URL
function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Function to fetch text from a URL
async function fetchTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }
    const text = await response.text();
    // Try to extract text content if it's HTML
    if (text.includes("<html") || text.includes("<!DOCTYPE")) {
      // Simple HTML text extraction (remove tags)
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

// Function to summarize text directly using Gemini API (simplified approach)
async function summarizeTextDirectly(
  text: string,
  apiKey: string,
): Promise<string> {
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
  const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return result;
}

// Function to summarize text using Zypher Agent with Gemini (currently not working)
async function summarizeText(
  text: string,
  agent: ZypherAgent,
): Promise<string> {
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

  try {
    const task = agent.runTask(prompt);

    // Check what type task is
    if (!task) {
      throw new Error("Task returned undefined");
    }

    let fullResponse = "";

    // Check if task is an Observable and handle accordingly
    if (typeof (task as any).subscribe === "function") {
      // Use a Promise to collect all values from the Observable
      await new Promise<void>((resolve, reject) => {
        (task as Observable<unknown>).subscribe({
          next: (value) => {
            // Extract text from TaskEvent
            const text = typeof value === "string"
              ? value
              : (value as { text?: string; content?: string; message?: string })
                .text ||
                (value as { text?: string; content?: string; message?: string })
                  .content ||
                (value as { text?: string; content?: string; message?: string })
                  .message ||
                String(value);

            if (text) {
              fullResponse += text;
              // Stream output to console
              Deno.stdout.writeSync(new TextEncoder().encode(text));
            }
          },
          error: (err) => {
            reject(err);
          },
          complete: () => {
            resolve();
          },
        });
      });
    } else if (task instanceof Promise) {
      // Fallback: if it's a Promise, await it
      const result = await task;
      fullResponse = result || String(result);
      Deno.stdout.writeSync(new TextEncoder().encode(fullResponse));
    } else {
      // Try to convert to string
      fullResponse = String(task);
      Deno.stdout.writeSync(new TextEncoder().encode(fullResponse));
    }

    return fullResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error in summarizeText: ${message}`);
  }
}

// Main function
async function main() {
  try {
    // Parse command line arguments
    const args = Deno.args;

    if (args.length === 0) {
      console.error("Usage: deno run summarizer.ts <text> | --url <url>");
      console.error("  or: deno run summarizer.ts --help");
      Deno.exit(1);
    }

    if (args[0] === "--help" || args[0] === "-h") {
      console.log(`
CLI Text Summarizer Agent

Usage:
  deno run summarizer.ts <text>
  deno run summarizer.ts --url <url>
  deno run summarizer.ts <url>

Options:
  --url, -u    Treat the following argument as a URL
  --help, -h   Show this help message

Examples:
  deno run summarizer.ts "Your text here to summarize"
  deno run summarizer.ts --url https://example.com/article
  deno run summarizer.ts https://example.com/article

Environment Variables:
  GEMINI_API_KEY       Your Google Gemini API key (required)
      `);
      Deno.exit(0);
    }

    // Get input text
    let inputText = "";

    if (args[0] === "--url" || args[0] === "-u") {
      if (args.length < 2) {
        console.error("Error: URL not provided");
        Deno.exit(1);
      }
      const url = args[1];
      console.log(`Fetching content from: ${url}\n`);
      inputText = await fetchTextFromUrl(url);
    } else if (isUrl(args[0])) {
      // Auto-detect URL
      console.log(`Fetching content from: ${args[0]}\n`);
      inputText = await fetchTextFromUrl(args[0]);
    } else {
      // Treat as direct text input
      inputText = args.join(" ");
    }

    if (!inputText || inputText.trim().length === 0) {
      console.error("Error: No text to summarize");
      Deno.exit(1);
    }

    // Limit text length to avoid token limits
    const maxLength = 50000;
    if (inputText.length > maxLength) {
      console.warn(
        `Warning: Text is very long (${inputText.length} chars). Truncating to ${maxLength} characters.\n`,
      );
      inputText = inputText.substring(0, maxLength) + "...";
    }

    // Get Gemini API key
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      throw new Error("Please set GEMINI_API_KEY environment variable");
    }

    // Initialize the agent execution context
    const zypherContext = await createZypherContext(Deno.cwd());

    // Create Gemini model provider
    const geminiProvider = new GeminiModelProvider(geminiKey);

    // For now, call Gemini directly since Zypher integration is complex
    // TODO: Fix Zypher ModelProvider interface implementation
    console.log("Using Google Gemini model...\n");
    console.log("Generating summary...\n");

    const summary = await summarizeTextDirectly(inputText, geminiKey);
    console.log(summary);
    console.log("\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    Deno.exit(1);
  }
}

// Run main function
if (import.meta.main) {
  await main();
}
