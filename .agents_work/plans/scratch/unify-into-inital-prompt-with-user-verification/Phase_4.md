## Phase 4: projectM v4 Scaffold & Audio Analysis


# Phase 4: Audio Analysis & projectM v4 Rendering Backbone

You are building the real-time graphics and audio analysis bridge. projectM v4.1.6 is the target visualizer engine.

## Context & Persistence Rules
1. Create `/libs/engine/rendering/RULES.md` outlining the OpenGL/Vulkan Qt rendering pipeline and boundaries between standard C++ and the graphics API.
2. Update `/.agent/SKILLS.md` with dynamic linker settings or Arch Linux package dependencies needed for projectM and OpenGL.

## Tasks
1. **Research & Reference:**
   - projectM v4 integration within Qt can be complex. **Before writing code**, clone the reference implementation into your scratch folder:
     `git clone https://github.com/projectM-visualizer/frontend-sdl-cpp/ /user_scratch/frontend-sdl-cpp`
   - Read `/user_scratch/frontend-sdl-cpp/CMakeLists.txt`, `dependencies_check.cmake`, and the C++ implementation to understand how the projectM developers handle v4 initializations, audio passing, and rendering contexts.

2. **projectM v4 CMake Integration:**
   - Use `CPM.cmake` to fetch `https://github.com/projectM-visualizer/projectm.git` (tag `v4.1.6` or `main`), OR use standard Arch Linux packages (`libprojectm`, `projectm-pulseaudio`). Choose the most stable integration method based on your system analysis.

3. **Audio Analysis Abstraction:**
   - Construct a mockable FFT spectrum and beat detection pipeline.
   - Provide a simulated waveform generator that feeds floating-point audio data to projectM when no real audio device is active.

4. **Qt Quick Render Node:**
   - Develop a custom QML item using `QQuickFramebufferObject` or Qt 6's modern `QSGRenderNode`.
   - Wrap the projectM OpenGL context inside this node so its output can be rendered seamlessly within a QML layout.
   - Implement fallback rendering (e.g., a simple colored procedural shader) if projectM fails to initialize.

5. **Validation:**
   - Link the rendering block to the main app. Ensure it compiles and displays the visualizer (or the fallback shader) responding to the mock audio data.
