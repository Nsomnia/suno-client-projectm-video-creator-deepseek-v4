## Phase 2: Core Platform, Logging, & Concurrency Systems


# Phase 2: Core Platform, Logging, & Concurrency Systems

You are working in the base library layers. Your goal is to establish cross-cutting system concerns: structured logging, thread pools, serialization, and robust configuration handling.

## Context & Persistence Rules
1. Read the root `RULES.md` before proceeding.
2. Create `/libs/engine/RULES.md` highlighting memory ownership patterns (smart pointers), lifetime management guidelines, and thread-safety invariants.
3. Update `/.agent/SKILLS.md` with new threading configurations or JSON parsing toolchains utilized.

## Tasks
1. **Structured Logging Engine:**
   - Implement a C++23 categorized logging system (wrapping `QMessageLogger` or integrating `spdlog` via CPM).
   - Ensure it writes to both the stdout console and a rotating log file in `/.agent/logs/app_runtime.log`.
   - Provide severity indicators (DEBUG, INFO, WARN, ERROR, CRITICAL) and component origins (e.g., `[RENDER]`, `[AUDIO]`, `[NET]`, `[UI]`).

2. **Configuration & Serialization:**
   - Implement a strongly typed configuration manager reading JSON files.
   - Support loading visualizer preferences, layout presets, and network endpoints. Create a default `config.json` payload if none exists.

3. **Concurrency & Task Management:**
   - Design an asynchronous task pool / job queue system (utilizing `QThreadPool` and `QRunnable`, or C++23 `std::jthread` and futures) for offloading network responses and audio processing from the Qt main UI thread.
   - Ensure safe application teardown protocols (waiting for tasks to finish or safely detaching).

4. **Integration & Validation:**
   - Integrate the logging and config systems into the `/apps/app_shell` entrypoint.
   - Validate that the application boots, reads the configuration, dispatches a background test task, logs its completion, and shuts down safely without segfaults.
