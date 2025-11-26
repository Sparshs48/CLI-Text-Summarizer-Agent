# PowerShell script to run the summarizer with environment variables set

# Check if arguments provided
if ($args.Count -eq 0) {
    Write-Host "Usage: .\run.ps1 <text>"
    Write-Host "   or: .\run.ps1 --url <url>"
    exit 1
}

# Run the summarizer
if ($args[0] -eq "--url" -or $args[0] -eq "-u") {
    deno task summarize:url $args[1]
} else {
    deno task summarize $args[0]
}

