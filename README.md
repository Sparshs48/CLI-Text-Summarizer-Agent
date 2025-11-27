# Text Summarizer Agent - Zypher-Powered AI Agent

A **Zypher-powered** AI agent for text summarization with both CLI and modern
web UI interfaces. Built for CoreSpeed's technical assessment, this project
demonstrates proper integration with the Zypher agent framework.

**Built with Zypher** - Uses `ZypherAgent` and `createZypherContext` from
`@corespeed/zypher` to orchestrate summarization tasks.

## 🎯 Features

- 🤖 **Zypher Agent Integration** - Properly uses ZypherAgent for task
  orchestration
- 🌐 **Modern Web UI** - Beautiful Cursor-inspired interface with sidebar
- 📝 **Text Summarization** - Summarize any text input
- 🔗 **URL Summarization** - Fetch and summarize web content
- 🎯 **Structured Output** - Returns concise summary + 3 key takeaways
- 💻 **CLI Interface** - Command-line version for automation
- 🚀 **Zero Deployment** - Runs locally with Deno
- 🔒 **Secure** - API keys never hardcoded, multiple storage options

## 📋 Prerequisites

- **Deno 2.0+**: [Install Deno](https://deno.land/)
  - Windows: `irm https://deno.land/install.ps1 | iex`
  - macOS/Linux: `curl -fsSL https://deno.land/install.sh | sh`
- **Google Gemini API Key**:
  [Get one here](https://makersuite.google.com/app/apikey)

## 🚀 Quick Start

### Step 1: Install Deno

**Windows PowerShell:**

```powershell
irm https://deno.land/install.ps1 | iex
```

**macOS/Linux:**

```bash
curl -fsSL https://deno.land/install.sh | sh
```

### Step 2: Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Set Up API Key

**Choose ONE of these methods:**

#### Method 1: Create `.gemini_api_key` file (Recommended - Easiest)

```powershell
# Windows PowerShell
echo "YOUR_API_KEY_HERE" > .gemini_api_key

# macOS/Linux
echo "YOUR_API_KEY_HERE" > .gemini_api_key
```

This file is automatically ignored by git, so your API key won't be committed.

#### Method 2: Set Environment Variable

```powershell
# Windows PowerShell
$env:GEMINI_API_KEY="YOUR_API_KEY_HERE"
$env:HOME = $env:USERPROFILE

# macOS/Linux
export GEMINI_API_KEY="YOUR_API_KEY_HERE"
export HOME=$HOME
```

**Note:** Environment variables only last for the current terminal session.
You'll need to set them again in new terminals.

#### Method 3: Enter in Web UI

- The web interface stores your API key in browser localStorage
- You only need to enter it once per browser
- Works alongside Method 1 or 2 as a fallback

### Step 4: Run the Application

**Web UI (Recommended for first-time users):**

```powershell
deno task server
```

Then open your browser and go to: **http://localhost:8000**

**CLI (For automation and scripts):**

```powershell
deno task summarize "Your text here"
```

## 📖 Usage Guide

### Web UI Usage

1. **Start the server:**
   ```powershell
   deno task server
   ```

2. **Open in browser:** Navigate to `http://localhost:8000`

3. **Using the interface:**
   - **Enter API Key:** If you haven't set up Method 1 or 2, enter your Gemini
     API key in the sidebar (saved in browser)
   - **Choose Input Type:** Toggle between "Text" and "URL" buttons
   - **Enter Content:**
     - **Text Mode:** Paste or type your text in the textarea
     - **URL Mode:** Enter a URL (e.g., `https://example.com/article`)
   - **Generate:** Click "Generate Summary" button
   - **View Results:** Summary appears in the main content area
   - **Copy:** Click the 📋 button to copy summary to clipboard

**Keyboard Shortcuts:**

- `Ctrl+Enter` (in text area): Generate summary
- `Enter` (in URL field): Generate summary

### CLI Usage

#### Summarize Text Directly

```powershell
deno task summarize "Your text here to summarize"
```

**Example:**

```powershell
deno task summarize "Artificial intelligence is transforming how we work and live. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions."
```

#### Summarize from URL

```powershell
deno task summarize:url https://example.com/article
```

**Example:**

```powershell
deno task summarize:url https://en.wikipedia.org/wiki/Artificial_intelligence
```

#### Using Full Command (Alternative)

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "Your text here"
```

#### Get Help

```powershell
deno run summarizer.ts --help
```

## 🏗️ How It Works

### Architecture Overview

```
┌─────────────────┐
│   User Input    │ (Text or URL)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Input Handler  │ (Fetches URL if needed)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Zypher Agent   │ (createZypherContext + ZypherAgent)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini Provider │ (Custom GeminiModelProvider)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gemini API     │ (Google Generative AI)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Formatted      │ (Summary + 3 Takeaways)
│  Output         │
└─────────────────┘
```

### Zypher Integration

This project properly implements **Zypher Agent** as required:

1. **Context Creation:**
   ```typescript
   const zypherContext = await createZypherContext(Deno.cwd());
   ```

2. **Model Provider:**
   ```typescript
   class GeminiModelProvider {
     async generate(prompt: string): Promise<Observable<string>>
     async streamChat(messages: Array<...>): Promise<Observable<string>>
   }
   ```

3. **Agent Initialization:**
   ```typescript
   const agent = new ZypherAgent(zypherContext, geminiProvider);
   ```

4. **Task Execution:**
   ```typescript
   const task = agent.runTask(prompt, "gemini-2.0-flash");
   task.subscribe({
     next: (value) => {/* Handle response */},
   });
   ```

### Code Flow

1. **Input Processing:**
   - CLI: Parses command-line arguments
   - Web: Receives JSON from frontend
   - URL: Fetches content and extracts text

2. **Zypher Setup:**
   - Creates Zypher context
   - Initializes custom Gemini model provider
   - Creates ZypherAgent instance

3. **Summarization:**
   - Constructs prompt with formatting instructions
   - Calls `agent.runTask()` with prompt and model
   - Processes Observable stream from Zypher

4. **Output Formatting:**
   - Parses response for SUMMARY and KEY TAKEAWAYS
   - Formats for display (CLI or Web UI)
   - Returns structured result

## 💡 Use Cases

### 1. Research & Learning

- **Summarize long articles** for quick understanding
- **Extract key points** from research papers
- **Get takeaways** from blog posts and tutorials

**Example:**

```powershell
deno task summarize:url https://arxiv.org/pdf/some-paper.pdf
```

### 2. Content Curation

- **Quick content review** before sharing
- **Generate summaries** for newsletters
- **Extract insights** from competitor content

### 3. Meeting Notes & Documents

- **Summarize meeting transcripts**
- **Extract action items** from documents
- **Quick document review**

### 4. News & Current Events

- **Stay informed** with article summaries
- **Get key points** from news stories
- **Track multiple sources** efficiently

### 5. Academic & Professional

- **Paper abstracts** and key findings
- **Report summaries** for stakeholders
- **Literature review** assistance

### 6. Automation & Scripts

- **CLI integration** in workflows
- **Batch processing** of multiple URLs
- **API integration** for other tools

**Example Script:**

```powershell
# Summarize multiple URLs
$urls = @("https://example.com/article1", "https://example.com/article2")
foreach ($url in $urls) {
    deno task summarize:url $url
    Write-Host "---`n"
}
```

## 📁 Project Structure

```
.
├── summarizer.ts       # CLI agent using ZypherAgent
├── server.ts           # Web server using ZypherAgent
├── index.html          # Web UI HTML structure
├── app.js              # Frontend JavaScript logic
├── styles.css          # UI styling (Cursor-inspired dark theme)
├── deno.json           # Deno configuration and tasks
├── deno.lock           # Dependency lock file
├── README.md           # This file
├── .gitignore          # Git ignore rules
└── .gemini_api_key     # API key file (not in git, created by user)
```

## 🔧 Dependencies

- **`@corespeed/zypher`** - Zypher framework for agent orchestration
- **`rxjs`** - RxJS for Observable handling
- **`rxjs-for-await`** - RxJS utilities for async iteration

Dependencies are automatically installed by Deno on first run.

## 📝 Example Output

**Input:**

```
Artificial intelligence is transforming industries across the globe. Machine learning algorithms can process vast amounts of data to identify patterns and make predictions. Companies are using AI to automate processes, improve customer service, and drive innovation. However, there are concerns about job displacement and the need for ethical AI development.
```

**Output:**

```
SUMMARY:
Artificial intelligence is revolutionizing industries through machine learning and automation, enabling companies to improve processes and innovate. However, this transformation raises concerns about employment impacts and the importance of ethical AI development.

KEY TAKEAWAYS:
• AI and machine learning are transforming industries through data processing and automation
• Companies are leveraging AI for process automation, customer service, and innovation
• Ethical considerations and job displacement are important concerns in AI development
```

## 🐛 Troubleshooting

### "Please set GEMINI_API_KEY environment variable"

**Solution:** Create a `.gemini_api_key` file:

```powershell
echo "your_api_key_here" > .gemini_api_key
```

### "Could not determine home directory"

**Solution:**

```powershell
$env:HOME = $env:USERPROFILE
```

### "Permission denied"

**Solution:** Make sure you include all required permissions:

```powershell
deno run --allow-env --allow-read --allow-net --allow-sys summarizer.ts "text"
```

### "Cannot find module '@corespeed/zypher'"

**Solution:** Dependencies install automatically. If not:

```powershell
deno add jsr:@corespeed/zypher
deno add npm:rxjs
deno add npm:rxjs-for-await
```

### Port 8000 Already in Use

**Solution:**

1. Close the application using port 8000, OR
2. Change port in `server.ts` (line 290):
   ```typescript
   const port = 8001; // Change to any available port
   ```

### TypeScript Errors in IDE

**Solution:** Install
[Deno VS Code Extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
and reload VS Code.

### Web UI Not Loading

**Solution:**

1. Make sure server is running: `deno task server`
2. Check browser console for errors (F12)
3. Verify all files exist: `index.html`, `app.js`, `styles.css`
4. Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## 🎬 Demo Video Guide

For the CoreSpeed assessment, create a 2-3 minute demo showing:

1. **Introduction (10s)**
   - Project overview
   - Zypher integration mention

2. **CLI Demo (30s)**
   - Show API key setup (`.gemini_api_key` file)
   - Run `deno task summarize "sample text"`
   - Show formatted output

3. **Web UI Demo (40s)**
   - Start server: `deno task server`
   - Open browser, show interface
   - Enter text/URL and generate summary
   - Show copy functionality

4. **Zypher Code Highlight (20s)**
   - Show `summarizer.ts` or `server.ts`
   - Point out `createZypherContext`, `ZypherAgent`, `agent.runTask()`
   - Show Observable handling

## ✅ Assessment Requirements Status

- ✅ **Review Zypher Documentation** - Completed
- ✅ **Build AI Agent with Zypher** - Both CLI and Web use ZypherAgent
- ✅ **GitHub Repository** - Ready (no API keys in code)
- ✅ **Clear Instructions** - This README provides complete instructions
- ⏳ **Demo Video** - To be created

## 🔒 Security

- ✅ No API keys hardcoded in source code
- ✅ API keys stored in:
  - Environment variables (session-based)
  - `.gemini_api_key` file (local, git-ignored)
  - Browser localStorage (web UI only)
- ✅ `.gitignore` configured to exclude sensitive files
- ✅ All API calls made server-side (web UI)

## 🚀 Advanced Usage

### Custom Port for Web Server

Edit `server.ts`:

```typescript
const port = 3000; // Change to your preferred port
```

### Batch Processing Script

Create `batch_summarize.ps1`:

```powershell
$urls = Get-Content urls.txt
foreach ($url in $urls) {
    Write-Host "Summarizing: $url"
    deno task summarize:url $url
    Write-Host "`n---`n"
}
```

### Integration with Other Tools

The CLI can be integrated into scripts, CI/CD pipelines, or other automation
tools:

```powershell
# Example: Summarize and save to file
deno task summarize "Your text" | Out-File summary.txt
```

## 📄 License

MIT

## 🙏 Acknowledgments

Built for CoreSpeed's technical assessment. Uses the
[Zypher](https://zypher.corespeed.io) agent framework.

## 📞 Support

If you encounter any issues:

1. Check the Troubleshooting section above
2. Review the error message carefully
3. Ensure all prerequisites are installed
4. Verify API key is set correctly

---

**Ready to get started?** Follow the Quick Start guide above and you'll be
summarizing text in minutes! 🚀
