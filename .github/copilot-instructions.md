# URJC To-Do Web App - AI Agent Instructions

## Architecture Overview
This is a Node.js Express application using ES modules with an MVC-like structure:
- **Router** (`src/toDoRouter.js`): Handles HTTP routes and user session management
- **Service** (`src/toDoService.js`): Manages data persistence to JSON file
- **Views** (`views/`): Mustache templates with partials (header, aside, footer)
- **Public** (`public/`): Static assets (CSS, JS, images)

## Key Patterns & Conventions

### User Management
- Users stored as Map in `src/users.json` with username as key
- Session handled via global `currentUser` variable (not secure for production)
- Each user has: `username`, `email`, `password`, `badge[]`, `profile_photo`, `tasks[]`
- Profile photos stored as base64 data strings (data URLs)

### Task Structure
```javascript
{
  title: string,
  description: string,
  dueDate: string, // YYYY-MM-DD format
  priority: string, // "alta"/"high", "media"/"medium", "baja"/"low"
  completed: boolean,
  createdAt: Date,
  id: number // Auto-incrementing, shared across users
}
```

### Priority System
- Bilingual support: Spanish ("alta", "media", "baja") and English ("high", "medium", "low")
- CSS classes: `priority-High`, `priority-Medium`, `priority-Low`
- Color coding: Red (high), Yellow (medium), Green (low)

### Routing Patterns
- `/home`: Dashboard with recent tasks and summary cards
- `/tasks`: Task management view
- `/calendar`: Calendar view with FullCalendar integration
- `/task/add`: POST endpoint for new tasks
- `/tasks/:id/delete`: POST endpoint for deletion
- `/tasks/:id/update`: POST endpoint for updating tasks

### Data Flow
1. Tasks stored per-user in memory Map loaded from JSON
2. Changes automatically persisted to `src/users.json`
3. Frontend uses fetch() for AJAX operations
4. Bootstrap modals for task creation

## Development Workflow
- **Start**: `npm start` or `pnpm start` (runs `node src/app.js`)
- **Dev mode**: `npm run watch` or `pnpm run watch` (nodemon auto-restart)
- **No build step** - direct Node.js execution
- **No tests** currently implemented

## Common Patterns
- Use `src/dirname.js` helper for ES module `__dirname` equivalent
- Spanish language throughout codebase (comments, UI text, variable names)
- Priority normalization happens in multiple places (router, templates)
- Task IDs are global counter - potential race condition with concurrent users
- File uploads configured but commented out in router

## File Uploads
- Profile photos converted to base64 data strings on frontend
- Multer configured with `uploads/` destination but unused for profile photos
- `DEMO_FOLDER = "demo"` defined but unused

## Frontend Integration
- Bootstrap modals for task creation and editing
- Date inputs prevent past dates
- Calendar uses JSON-serialized task data
- Edit buttons populate modal with existing task data
- Shared modal form handles both add and edit operations

## Security Notes
- Plain text password storage
- Global user session (not thread-safe)
- No input validation visible
- Development-only data persistence path logic</content>
<parameter name="filePath">c:\Users\Porti\Desktop\repos-uni\URJC-ToDoWebApp\.github\copilot-instructions.md