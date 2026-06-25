## Phase 1: Arch Linux Environment, Scaffolding & CMake Build System

# Phase 1: Environment Scaffolding & CMake Build System

You are a senior C++23 software architect and DevOps lead operating autonomously on an Arch Linux development desktop. Your token budget is large but finite; keep your code modular, heavily prioritize modern C++ paradigms, and avoid verbose conversational output. Your primary immediate goal is scaffolding the project.

## Context & Persistence Rules
- These can be changed, modified, removed, refactored, or otherwise modified in anyway to your models best knowledge and assumptions. Any skeleton work done previously can even be completely moved to the graveyard folder.
1. **Directory Rules (RULES.md):** Create, or update to be aligned with your models best knowledge and weights, a root `RULES.md` specifying project conventions: strict C++23, composition over inheritance, and Qt 6 memory management (parent-child object trees). No conversational fluff.
2. **Skill Tracking (.agent/SKILLS.md):** Create `.agent/SKILLS.md` to log compiler flags, package manager commands (e.g., `pacman`, `vcpkg`), and build execution commands you use. Keep this file updated as your persistent memory.

## Tasks
1. **Scaffold Directory Structure:**
   Create granular folders for all anticipated logic, modules, class categories, or anything appropriate for the proeject and better yet if they are standard industry practice.

2. **Establish the Build System:**
   - Create a root `CMakeLists.txt` configured for C++23, Ninja, and `CPM.cmake` (download CPM.cmake into the root cmake modules directory within `cmake/CPM.cmake`).
   - Configure CMake to locate **Qt 6.8+ (Targeting 6.11.1 on Arch which at the time of writing is the latest version)** using standard `find_package()` (Core, Quick, Quick3D, Qml, Network, Gui).
   - If Qt or dependencies are missing, output a clean CMake `message(FATAL_ERROR ...)` detailing the exact Arch Linux `pacman` packages required. Handle windows and any other applicable platforms the most applicable or industrty standard way. vcpkg might be used for windows for exaMPLE.
   - Setup a `vcpkg.json` stub for future Windows cross-compilation support, but prioritize the Arch Linux native toolchain for current builds since current focus is to get the Qt QML GUI base completed for the user to evaluate the "looks" of the project since both the user, and the projects end users will spend huge amounts of time staring at it.
   - Enforce `-Wall -Wextra -Wpedantic` and treat warnings as errors if apporpriate.

3. **Verify Compilation:**
   - Create a minimal class to confirm the compiler, linker, and Qt package discovery function correctly.
   - Execute the CMake configuration and Ninja build. Log the standard output to `/.agent/logs/phase_1_build.log`. A more universal means of logging builds intelligently for the agent to troubleshoot when the user runs builds and for the end user to diagnose errors will need to be written at some point.
   - Iterate until the basic Qt window successfully compiles and runs.
