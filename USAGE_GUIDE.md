# Complete Usage Guide - CLI Text Summarizer Agent

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Basic Usage](#basic-usage)
5. [Advanced Usage](#advanced-usage)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

**Windows PowerShell:**

```powershell
# Set environment variables
$env:HOME = $env:USERPROFILE
$env:GEMINI_API_KEY="Your Key"

# Run the summarizer
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text here"
```

---

## Prerequisites

### 1. Install Deno

**Windows:**

```powershell
# Using PowerShell
irm https://deno.land/install.ps1 | iex
```

**macOS/Linux:**

```bash
curl -fsSL https://deno.land/install.sh | sh
```

**Verify installation:**

```bash
deno --version
```

You should see something like: `deno 2.0.0` or higher.

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (it will look like: `AIzaSy...` - keep this secure!)

---

## Setup Instructions

### Option 1: Set Environment Variables (Recommended for Testing)

**Windows PowerShell:**

```powershell
# Set HOME (required for Zypher)
$env:HOME = $env:USERPROFILE

# Set your Gemini API key
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

**Windows CMD:**

```cmd
set HOME=%USERPROFILE%
set GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**macOS/Linux:**

```bash
export HOME=$HOME
export GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

**Note:** These settings are temporary and will be lost when you close the
terminal.

### Option 2: Create .env File (Permanent Solution)

1. Create a file named `.env` in the project root directory
2. Add the following content:

```
HOME=C:\Users\YourUsername
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

**Windows PowerShell (load .env file):**

```powershell
# Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
```

**macOS/Linux (load .env file):**

```bash
export $(cat .env | xargs)
```

### Option 3: Set System Environment Variables (Windows)

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to "Advanced" tab → "Environment Variables"
3. Under "User variables", click "New"
4. Add:
   - Variable name: `GEMINI_API_KEY`
   - Variable value: `YOUR_API_KEY_HERE`
5. Click OK and restart your terminal

---

## Basic Usage

### Summarize Text Directly

**Windows PowerShell:**

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text to summarize here"
```

**macOS/Linux:**

```bash
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text to summarize here"
```

### Using Deno Tasks (Shorter Command)

**Windows PowerShell:**

```powershell
deno task summarize "Your text here"
```

**macOS/Linux:**

```bash
deno task summarize "Your text here"
```

---

## Advanced Usage

### Summarize from URL

**Method 1: Using --url flag**

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts --url https://example.com/article
```

**Method 2: Auto-detect URL**

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts https://example.com/article
```

**Using Deno task:**

```powershell
deno task summarize:url https://example.com/article
```

### Get Help

```powershell
deno run summarizer.ts --help
```

Or:

```powershell
deno run summarizer.ts -h
```

### Summarize Long Text

The tool automatically handles long text (up to 50,000 characters). If your text
is longer, it will be truncated with a warning.

---

## Examples

### Example 1: Summarize a Short Text

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Artificial intelligence is transforming the way we work and live. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions."
```

**Expected Output:**

```
Using Google Gemini model...

Generating summary...

SUMMARY:
[Concise summary here]

KEY TAKEAWAYS:
• [First takeaway]
• [Second takeaway]
• [Third takeaway]
```

### Example 2: Summarize an Article from URL

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts --url https://www.example.com/article
```

### Example 3: Summarize Multiple Sentences

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Climate change is one of the most pressing issues of our time. Rising global temperatures are causing sea levels to rise, extreme weather events to become more frequent, and ecosystems to collapse. Scientists agree that immediate action is needed to reduce greenhouse gas emissions and transition to renewable energy sources."
```

### Example 4: Using with File Content (PowerShell)

```powershell
# Read file content and summarize
$content = Get-Content "article.txt" -Raw
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts $content
```

### Example 5: Save Output to File

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text" > summary.txt
```

---

## Complete Workflow Example

### Step-by-Step: First Time Setup

1. **Open PowerShell/Terminal**
   ```powershell
   # Navigate to project directory
   cd D:\Assesment_11_25\CLI-Text-Summarizer-Agent
   ```

2. **Set Environment Variables**
   ```powershell
   $env:HOME = $env:USERPROFILE
   $env:GEMINI_API_KEY="your key"
   ```

3. **Test the Installation**
   ```powershell
   deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Hello, this is a test"
   ```

4. **If successful, you should see:**
   ```
   Using Google Gemini model...
   Generating summary...
   SUMMARY:
   [Summary appears here]
   KEY TAKEAWAYS:
   • [Takeaway 1]
   • [Takeaway 2]
   • [Takeaway 3]
   ```

---

## Command Reference

### Full Command Syntax

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts [OPTIONS] [TEXT|URL]
```

### Options

- `--url, -u` - Treat the following argument as a URL
- `--help, -h` - Show help message

### Permissions Explained

- `--allow-env` - Allows reading environment variables (needed for API key)
- `--allow-read` - Allows reading files (needed for Zypher context)
- `--allow-net` - Allows network access (needed for Gemini API)
- `--allow-sys` - Allows system access (needed for home directory)

### Shortcuts (Deno Tasks)

```powershell
# Summarize text
deno task summarize "Your text"

# Summarize from URL
deno task summarize:url https://example.com
```

---

## Troubleshooting

### Error: "Please set GEMINI_API_KEY environment variable"

**Solution:**

```powershell
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

### Error: "Could not determine home directory"

**Solution:**

```powershell
$env:HOME = $env:USERPROFILE
```

### Error: "Gemini API error: 404"

**Solution:** The model name might be outdated. The code uses `gemini-2.0-flash`
which should work. If not, check available models:

```powershell
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY" | ConvertFrom-Json | Select-Object -ExpandProperty models | Select-Object name
```

### Error: "Permission denied"

**Solution:** Make sure you include all required permissions:

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "text"
```

### Error: "Cannot find module"

**Solution:** Dependencies should install automatically. If not:

```powershell
deno add jsr:@corespeed/zypher
deno add npm:rxjs-for-await
deno add npm:rxjs
```

### No Output or Empty Response

**Possible causes:**

1. API key is invalid
2. Network connection issue
3. Text is too long (over 50,000 characters)

**Solution:**

- Verify your API key is correct
- Check your internet connection
- Try with shorter text first

---

## Tips & Best Practices

1. **Keep API Key Secure**
   - Never commit your API key to version control
   - Use environment variables instead of hardcoding
   - Add `.env` to `.gitignore`

2. **Batch Processing**
   ```powershell
   # Process multiple texts
   $texts = @("Text 1", "Text 2", "Text 3")
   foreach ($text in $texts) {
       deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts $text
   }
   ```

3. **Combine with Other Tools**
   ```powershell
   # Summarize and save to file
   deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Text" | Out-File summary.txt
   ```

4. **Use Aliases (PowerShell)**
   ```powershell
   # Add to your PowerShell profile
   function Summarize {
       param([string]$text)
       deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts $text
   }

   # Then use: Summarize "Your text"
   ```

---

## Quick Reference Card

```powershell
# Setup (one time per session)
$env:HOME = $env:USERPROFILE
$env:GEMINI_API_KEY="YOUR_KEY"

# Basic usage
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Text"

# URL
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts --url https://example.com

# Help
deno run summarizer.ts --help

# Shortcut
deno task summarize "Text"
```

---

## Need More Help?

- Check `README.md` for project overview
- Check `TROUBLESHOOTING.md` for common issues
- Check `QUICKSTART.md` for quick setup
- Review the code in `summarizer.ts` for implementation details
