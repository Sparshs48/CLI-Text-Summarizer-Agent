# Troubleshooting TypeScript Errors

If you're seeing TypeScript errors in your IDE (like "Cannot find module" or
"Cannot find name 'Deno'"), these are likely false positives from the TypeScript
language server not recognizing Deno.

## Solution

### 1. Install the Deno Extension for VS Code

Install the official Deno extension:

- Open VS Code
- Go to Extensions (Ctrl+Shift+X)
- Search for "Deno" by Deno Land Inc.
- Install it

### 2. Reload VS Code

After installing the extension, reload VS Code:

- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Reload Window"
- Select "Developer: Reload Window"

### 3. Verify Settings

The `.vscode/settings.json` file should have Deno enabled. It should contain:

```json
{
  "deno.enable": true,
  "deno.lint": true
}
```

### 4. The Code Will Still Work

Even if you see errors in the IDE, the code will run correctly with Deno. These
are just IDE warnings, not actual runtime errors.

To test:

```bash
deno run --allow-env --allow-read --allow-net summarizer.ts "test"
```

## Common Errors and Solutions

### "Cannot find module '@corespeed/zypher'"

- **Solution**: Dependencies are installed via `deno.json`. The IDE just needs
  the Deno extension to recognize them.

### "Cannot find name 'Deno'"

- **Solution**: Install the Deno extension and reload VS Code. Deno types are
  provided by the extension.

### "Property 'main' does not exist on type 'ImportMeta'"

- **Solution**: This is a Deno-specific feature. The Deno extension will
  recognize `import.meta.main`.

## Alternative: Use Deno CLI

If IDE errors persist, you can always use the Deno CLI directly - it will work
perfectly:

```bash
deno run --allow-env --allow-read --allow-net summarizer.ts "Your text"
```
