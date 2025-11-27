# Text Summarizer Agent - Zypher-Powered AI Agent

A **Zypher-powered** AI agent for text summarization with both CLI and modern
web UI interfaces. Built for CoreSpeed's technical assessment.

**Built with Zypher** - Uses `ZypherAgent` and `createZypherContext` from
`@corespeed/zypher`.

## 🎯 Features

- 🤖 **Zypher Agent Integration** - Uses ZypherAgent for task orchestration
- 🌐 **Modern Web UI** - Beautiful Cursor-inspired interface
- 📝 **Text Summarization** - Summarize any text input
- 🔗 **URL Summarization** - Fetch and summarize web content
- 🎯 **Structured Output** - Returns summary + 3 key takeaways
- 💻 **CLI Interface** - Command-line version

## 🚀 Quick Start (3 Steps)

### Step 1: Install Deno

**Windows:**

```powershell
irm https://deno.land/install.ps1 | iex
```

**Mac/Linux:**

```bash
curl -fsSL https://deno.land/install.sh | sh
```

### Step 2: Get API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in and create an API key
3. Copy your API key

### Step 3: Set Up API Key

**Easiest Method - Create a file:**

```powershell
# Windows PowerShell
echo "YOUR_API_KEY_HERE" > .gemini_api_key
```

That's it! The file is automatically ignored by git.

## 📖 How to Run

### Option 1: Web UI (Easiest - Recommended)

1. **Start the server:**
   ```powershell
   deno task server
   ```

2. **Open your browser:**
   - Go to: **http://localhost:8000**
   - Enter your API key (if you didn't create the file)
   - Paste text or enter URL
   - Click "Generate Summary"

**That's it!** The web UI is the easiest way to use the summarizer.

### Option 2: CLI (Command Line)

**Summarize text:**

```powershell
deno task summarize "Your text here"
```

**Summarize from URL:**

```powershell
deno task summarize:url https://example.com/article
```

## 💡 Use Cases

- **Research:** Quickly understand long articles and papers
- **News:** Get key points from news stories
- **Learning:** Extract takeaways from tutorials and blog posts
- **Work:** Summarize meeting notes and documents
- **Content:** Review articles before sharing

## 🏗️ How It Works

1. **You provide:** Text or URL
2. **Zypher Agent:** Processes the input using Zypher framework
3. **Gemini AI:** Generates the summary
4. **You get:** Concise summary + 3 key takeaways

### Zypher Integration

The project uses Zypher properly:

```typescript
// Create Zypher context
const zypherContext = await createZypherContext(Deno.cwd());

// Create custom Gemini provider
const geminiProvider = new GeminiModelProvider(apiKey);

// Create Zypher agent
const agent = new ZypherAgent(zypherContext, geminiProvider);

// Run task
const task = agent.runTask(prompt, "gemini-2.0-flash");
```

## 📝 Example

**Input:**

```
Artificial intelligence is transforming industries. Machine learning can process vast amounts of data to make predictions. Companies use AI to automate processes and drive innovation.
```

**Output:**

```
SUMMARY:
Artificial intelligence is revolutionizing industries through machine learning and automation, enabling companies to process data and drive innovation.

KEY TAKEAWAYS:
• AI and machine learning are transforming industries through automation
• Companies leverage AI for data processing and innovation
• Machine learning enables predictive capabilities from large datasets
```

## 🐛 Troubleshooting

### "Please set GEMINI_API_KEY"

**Fix:** Create the file:

```powershell
echo "your_api_key_here" > .gemini_api_key
```

### "Could not determine home directory"

**Fix:**

```powershell
$env:HOME = $env:USERPROFILE
```

### Port 8000 Already in Use

**Fix:** Close other apps using port 8000, or change port in `server.ts`
(line 290)

### Web UI Not Loading

**Fix:**

1. Make sure server is running: `deno task server`
2. Check the terminal for errors
3. Try: http://localhost:8000

## 📁 Project Files

- `summarizer.ts` - CLI version
- `server.ts` - Web server
- `index.html` - Web UI
- `app.js` - Frontend code
- `styles.css` - UI styling
- `deno.json` - Configuration

## 🔒 Security

- ✅ No API keys in code
- ✅ API key file is git-ignored
- ✅ Safe to push to GitHub

## 📄 License

MIT

## 🙏 Acknowledgments

Built for CoreSpeed's technical assessment using
[Zypher](https://zypher.corespeed.io).

---

**Need help?** Check the Troubleshooting section above or review the error
message.
