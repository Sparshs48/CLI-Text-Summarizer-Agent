# Quick Setup Guide

## Step 1: Install Deno

If you don't have Deno installed, download it from [deno.land](https://deno.land/)

## Step 2: Set Environment Variable

### Option A: Create .env file (requires dotenv)

Create a `.env` file:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Then load it before running:

```bash
export $(cat .env | xargs)
deno run --allow-env --allow-read --allow-net summarizer.ts "Your text"
```

### Option B: Export directly (recommended for quick start)

```bash
export GEMINI_API_KEY=your_api_key_here
deno run --allow-env --allow-read --allow-net summarizer.ts "Your text"
```

### Option C: Windows PowerShell

```powershell
$env:GEMINI_API_KEY="your_api_key_here"
deno run --allow-env --allow-read --allow-net summarizer.ts "Your text"
```

## Step 3: Install Dependencies

Dependencies will be automatically downloaded on first run. Or manually:

```bash
deno add jsr:@corespeed/zypher
deno add npm:rxjs-for-await
```

## Step 4: Run the Summarizer

```bash
# Summarize text
deno run --allow-env --allow-read --allow-net summarizer.ts "Your text here"

# Summarize from URL
deno run --allow-env --allow-read --allow-net summarizer.ts --url https://example.com
```
