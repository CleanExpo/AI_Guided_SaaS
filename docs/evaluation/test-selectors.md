# Test Selectors Reference

## Dashboard Page
```html
<div data-testid="dashboard-metrics"><!-- metrics content --></div>
<button data-testid="refresh-button">Refresh</button>
<div data-testid="loading-spinner">Loading...</div>
<select data-testid="filter-dropdown"><!-- options --></select>
```

## Prompts Page
```html
<button data-testid="create-prompt-button">Create Prompt</button>
<input data-testid="prompt-title" placeholder="Prompt title">
<textarea data-testid="prompt-content">Prompt content</textarea>
<input data-testid="search-input" placeholder="Search prompts">
```

## Folders Page
```html
<button data-testid="create-folder-button">Create Folder</button>
<div data-testid="folder-item">Folder Item</div>
<div data-testid="draggable-item">Draggable Item</div>
<div data-testid="folder-drop-zone">Drop Zone</div>
```

## Implementation Guide
Add these test selectors to your React components:

```tsx
// Dashboard Component
<div data-testid="dashboard-metrics">
  {/* Your metrics content */}
</div>

// Prompts Component
<button data-testid="create-prompt-button" onClick={handleCreatePrompt}>
  Create Prompt
</button>

// Folders Component
<div 
  data-testid="folder-item" 
  draggable
  onDragStart={handleDragStart}
>
  {folderName}
</div>
```
