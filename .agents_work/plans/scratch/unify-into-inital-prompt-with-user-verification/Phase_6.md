## Phase 6: System Integration, Polish, & Release Build

```markdown
# Phase 6: System Integration, Diagnostics, & Production Polish

Bring all loosely coupled components together into a robust, production-grade prototype application. 

## Context & Persistence Rules
1. Perform a final clean-up of all `RULES.md` and `/.agent/SKILLS.md` files. Ensure they accurately reflect the current state of the architecture. Remove obsolete logs.

## Tasks
1. **Subsystem Wiring:**
   - Connect the mock audio/beat generator directly to both the projectM visualizer *and* the QML Karaoke/UI components so the interface physically pulses/reacts to the music data.
   - Bind the Suno API client state machine directly to the QML loading animations, progress indicators, and playlist views.

2. **Performance Diagnostics HUD:**
   - Implement an interactive, toggleable on-screen developer HUD.
   - Display real-time render frame times (FPS), active task queues, network status, and build metadata.

3. **Robust Error Recovery:**
   - Add graceful UI fallbacks for failing network calls, missing preset paths for projectM, and rendering initialization errors. The app must never hard-crash from an expected exception.

4. **Final Scrutiny & Documentation:**
   - Generate a complete, polished set of developer documentation in `/docs` (setup instructions, architecture diagrams, and API guides).
   - Compile and execute the final Release build using Ninja. Ensure strictly zero compilation errors and zero runtime warning cycles. 
   - Update `/CHANGELOG.md` with the finalized design details.
