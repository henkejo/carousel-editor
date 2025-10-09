

## How to use it

1. **Navigate around**: 
   - Scroll to move the view
   - Hold Cmd/Ctrl + scroll to zoom in/out
   - Hold Cmd/Ctrl + drag to move the view

2. **Add stuff**:
   - Click the "Add layer" button to upload an image
   - Or just drag images directly onto a slide
   - Click "Add slide" to create a new slide

3. **Work with images**:
   - Click on an image to select it
   - When an image is selected, press backspace or delete to remove it
   - Drag the corners to resize
   (Hold shift to to keep aspect ratio)
   - Drag the rotation handle to rotate
   (Hold shift to rotate in 45 degree increments)
   - Images snap to edges of other images and slides

4. **Delete slides**:
   - Right-click on any slide to get a delete button

## How to run it

You'll need Node.js and pnpm installed.

```bash
# Install dependencies
pnpm install

# Start both the frontend and backend
pnpm dev
```

## Tech

- **Frontend**: React + TypeScript + Vite + Tailwind
- **State**: Zustand with Immer for state management
Uses DOM elements to manage layers and slides (canvases).
Zoom + Pan + Rotates made possible via CSS transforms.

- **UI**: A few shadcn/Radix UI components + Lucide icons
- **Backend**: Express (didn't end up using)

## Future work

This is just a prototype but it's set up to work well with:
- Saving projects (it has serialisable state)
- Live collaboration (Zustand+Immer works well with Yjs)

