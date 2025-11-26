# Quick Reference Card

## One-Time Setup (Windows PowerShell)

```powershell
# Set environment variables
$env:HOME = $env:USERPROFILE
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

## Basic Commands

### Summarize Text

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text here"
```

### Summarize from URL

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts --url https://example.com
```

### Shortcuts

```powershell
deno task summarize "Your text"
deno task summarize:url https://example.com
```

### Help

```powershell
deno run summarizer.ts --help
```

## Your API Key

```
AIzaSyBbD_4BQ9C_YJQpMwjNsY0woh913B5GbvA
```

## Complete Command Template

```powershell
# Setup (run once per terminal session)
$env:HOME = $env:USERPROFILE
$env:GEMINI_API_KEY="AIzaSyBbD_4BQ9C_YJQpMwjNsY0woh913B5GbvA"

# Then use:
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Text to summarize"
```

## Common Examples

```powershell
# Example 1: Simple text
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "AI is transforming technology"

# Example 2: Long text
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your long article text here..."

# Example 3: From URL
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts --url https://example.com/article

# Example 4: Save to file
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Text" > output.txt
```

## Troubleshooting

| Error                                | Solution                         |
| ------------------------------------ | -------------------------------- |
| "Please set GEMINI_API_KEY"          | `$env:GEMINI_API_KEY="YOUR_KEY"` |
| "Could not determine home directory" | `$env:HOME = $env:USERPROFILE`   |
| "Permission denied"                  | Add `--allow-sys` flag           |
| "404 error"                          | Check API key is valid           |

## Need More Help?

- Full guide: `USAGE_GUIDE.md`
- Troubleshooting: `TROUBLESHOOTING.md`
- Quick start: `QUICKSTART.md`
