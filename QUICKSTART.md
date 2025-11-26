# Quick Start Guide

## Set Your Gemini API Key

You need a Gemini API key. Get one from
[Google AI Studio](https://makersuite.google.com/app/apikey)

### Option 1: Set Environment Variable (Recommended)

**Windows PowerShell:**

```powershell
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

**Windows CMD:**

```cmd
set GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**Linux/Mac:**

```bash
export GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

### Option 2: Create .env File

Create a `.env` file in the project root:

```
GEMINI_API_KEY=Your key
```

Then load it before running (requires a .env loader):

```bash
export $(cat .env | xargs)
```

## Run the Summarizer

After setting the API key, run:

```bash
# Summarize text
deno run --allow-env --allow-read --allow-net summarizer.ts "Your text here"

# Summarize from URL
deno run --allow-env --allow-read --allow-net summarizer.ts --url https://example.com
```

## Test It

Try this example:

```bash
deno run --allow-env --allow-read --allow-net summarizer.ts "Artificial intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions. This technology is being applied across industries from healthcare to finance."
```
