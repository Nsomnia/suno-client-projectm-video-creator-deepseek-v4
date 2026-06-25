## Phase 5: Cinematic QML UI & Overlay Compositor


# Phase 5: Cinematic UI, Overlay Compositor, & Karaoke System

Design the visual interface using Qt 6 QML. The design must be premium, cinematic, animated, and highly responsive. 

## Context & Persistence Rules
1. Create `/libs/ui/RULES.md` defining QML performance guidelines: avoid giant monolithic QML files, avoid inline anchors inside reusable components, and absolutely no blocking main-thread bindings.

## Tasks
1. **App Shell Layout (Cyberpunk/Cinematic Theme):**
   - Create an immersive, multi-page layout (Dashboard, Generation Station, Visualizer Canvas, Settings).
   - Utilize Qt Quick MultiEffect for translucency, blurred panels, and animated background gradients. Use `State` and `Transition` blocks for smooth view routing.

2. **Overlay Compositor:**
   - Design a layered rendering framework (`Item` z-indexing or `ShaderEffect` layers) that draws *over* the projectM visualizer canvas created in Phase 4.
   - Layers include: Diagnostic HUD, Music Video Crediting, Song Metadata Overlay, and Toast Notifications.

3. **Karaoke Lyric Engine:**
   - Implement an advanced text-rendering component in QML.
   - Support word-by-word timing synchronization (simulated for now), smooth glow/color highlight transitions, and easing animations for entering/exiting screen space.
   - Provide layouts for scrolling, centered cinematic, and lower-third subtitle strips.

4. **Integration:**
   - Connect the QML interface directly to the C++ models generated in Phase 3 (Suno API) and Phase 4. Ensure fluid GPU-accelerated performance.
