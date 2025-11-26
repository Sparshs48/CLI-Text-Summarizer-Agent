# CLI Text Summarizer Agent

A minimal CLI tool built with Zypher that accepts text or a URL and returns a
concise summary with 3 key takeaways.

## Features

- 📝 Summarize text directly from command line
- 🔗 Fetch and summarize content from URLs
- 🎯 Returns concise summary + 3 bullet-point takeaways
- 🚀 Minimal dependencies, no deployment required
- ⚡ Powered by Zypher Agent with Google Gemini

## Prerequisites

- **Deno 2.0+**: Install from [deno.land](https://deno.land/)
- **Google Gemini API Key**: Get one from
  [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **VS Code Deno Extension** (optional, for IDE support): Install from
  [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)

> **Note**: If you see TypeScript errors in your IDE, install the Deno extension
> and reload VS Code. See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for details.

## Setup

1. **Install Deno** (if not already installed)
   - Windows: `irm https://deno.land/install.ps1 | iex`
   - macOS/Linux: `curl -fsSL https://deno.land/install.sh | sh`

2. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key

3. **Set up environment variables**

   **Windows PowerShell:**
   ```powershell
   $env:HOME = $env:USERPROFILE
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

   **macOS/Linux:**
   ```bash
   export HOME=$HOME
   export GEMINI_API_KEY="your_api_key_here"
   ```

   **Or create a `.env` file:**
   ```
   HOME=C:\Users\YourUsername
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Install dependencies** (Deno will handle this automatically on first run)

## Quick Start

**Windows PowerShell:**

```powershell
# Set environment variables (required)
$env:HOME = $env:USERPROFILE
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"

# Run the summarizer
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text here"
```

**📖 For complete instructions, see [USAGE_GUIDE.md](USAGE_GUIDE.md)**

## Usage

### Summarize text directly

```bash
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text here to summarize"
```

### Summarize from URL

```bash
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts --url https://example.com/article
```

Or let it auto-detect URLs:

```bash
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts https://example.com/article
```

### Using Deno tasks (shorter commands)

```bash
deno task summarize "Your text here"
deno task summarize:url https://example.com/article
```

### Help

```bash
deno run summarizer.ts --help
```

## Example Output

```
Using Google Gemini model...

Generating summary...

SUMMARY:
This article discusses the key principles of effective communication in remote teams, emphasizing the importance of clear documentation, regular check-ins, and asynchronous collaboration tools.

KEY TAKEAWAYS:
• Clear documentation is essential for remote team success
• Regular synchronous check-ins help maintain team cohesion
• Asynchronous tools enable flexible collaboration across time zones
```

## How It Works

1. The tool accepts text input or fetches content from a URL
2. It uses Zypher's `ZypherAgent` with a custom `GeminiModelProvider` to process
   the text
3. The agent generates a structured response with a summary and 3 takeaways
4. Results are streamed to the console in real-time

## Project Structure

```
.
├── summarizer.ts         # Main CLI script
├── deno.json            # Deno configuration
├── README.md            # This file
├── USAGE_GUIDE.md      # Complete usage instructions
├── QUICKSTART.md       # Quick setup guide
├── TROUBLESHOOTING.md  # Troubleshooting guide
└── .gitignore          # Git ignore rules
```

## Dependencies

- `@corespeed/zypher`: Zypher framework for agent orchestration
- `rxjs`: RxJS for Observable handling
- `rxjs-for-await`: RxJS utilities for async iteration

## Documentation

- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Complete step-by-step usage
  instructions
- **[QUICKSTART.md](QUICKSTART.md)** - Quick setup guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## Demo

Record a short screen recording showing:

1. Setting up the `.env` file
2. Running the summarizer with sample text
3. Running the summarizer with a URL
4. Viewing the formatted output

## License

MIT
