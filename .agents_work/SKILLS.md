# Agent Skills / Persistent Memory

> Append-only operational memory. Log toolchain facts, commands, and gotchas here so
> every future prompt benefits. Update as the build evolves.

## Host Environment (verified 2026-06-18)
- **OS:** Arch Linux (kernel 7.0.12-1-cachyos)
- **Shell:** fish (user), bash/zsh available for scripting
- **Compiler:** GCC 16.1.1 (`/usr/bin/g++`), clang 22.1.6 (`/usr/bin/clang++`) — both C++23 capable
- **CMake:** 4.3.4 (`/usr/bin/cmake`) ✅ (user installed: `sudo pacman -S cmake ccache sccache ninja vcpkg`)
- **Ninja:** 1.13.2 at `/usr/sbin/ninja`
- **pkg-config:** 2.5.1
- **Git:** 2.54.0
- **ccache:** installed (`/usr/sbin/ccache`) ✅
- **sccache:** installed (`/usr/sbin/sccache`) ✅
- **vcpkg:** 2026-05-27 (`/usr/sbin/vcpkg`) ✅

## ⚠️ CRITICAL: PATH Shadowing by ZCode AppImage (MUST READ)
The ZCode harness AppImage dir (`~/.local/share/AppImage/`) is prepended to PATH
in `~/.bashrc`, `~/.zshrc`, and `~/.config/fish/config.fish`. That dir contains
ONLY the `ZCode-3.1.2-linux-x64.AppImage` file — it is NOT a real tool dir.

**Symptom:** invoking `gcc`, `cmake`, `ccache`, etc. by bare name fails:
  - gcc/g++: `fatal error: cannot execute 'cc1': posix_spawnp: No such file or directory`
  - cmake: `CMake Error: Could not find CMAKE_ROOT !!!`
  - ccache: `error: Could not find compiler "ZCode-3.1.2-linux-x64.AppImage"`
`g++ --version` LIES — it prints version fine but actual compilation fails.

**Fix for ALL build commands:** run with a sanitized PATH excluding the AppImage dir:
```fish
env PATH=/usr/bin:/usr/sbin:/bin:/sbin HOME=$HOME <command>
```
Or export at the top of a build script. NEVER run `cmake`/`gcc`/`ninja`/`ccache`
with the default PATH from this harness — they will fail cryptically.
The real tools are all at `/usr/bin` (gcc/g++/cmake/ccache) and `/usr/sbin` (ninja).
Verified: clean-PATH `gcc /tmp/t.c -o /tmp/t` → 15776-byte binary; `cmake --version` → 4.3.4.

## Qt 6 (verified 2026-06-18)
- **Version:** 6.11.1 (exact Phase 1 target) via `qt6-base`, `qt6-declarative`, etc.
- **qmake6:** present, reports "Using Qt version 6.11.1 in /usr/lib"
- **CMake config dir:** `/usr/lib/cmake/Qt6/` — standard `find_package(Qt6 ...)` works once CMake is installed.
- **Relevant modules installed (all 6.11.1):**
  - `qt6-base` — Core, Gui, Network, Widgets, Concurrent, OpenGL, OpenGLWidgets
  - `qt6-declarative` — Qml, Quick, QuickTest, QuickLayouts
  - `qt6-quick3d` — Quick3D + helpers + particles + effects (Phase 5 cinematic)
  - `qt6-multimedia` — audio/video (Phase 4 audio pipeline)
  - `qt6-shadertools` + `qt6-shadertools-private` — runtime shader compilation (projectM fallback shader)
  - `qt6-5compat` — Qt5 compat APIs
  - `Qt6QuickEffects` present → **MultiEffect available** for Phase 5 blur/translucency.
- **`find_package` components to use:** `Core Gui Quick Quick3D Qml Network Multimedia OpenGL`

## projectM (verified 2026-06-18)
- **Installed (pacman):** `projectm 3.1.12-5.1` — ⚠️ **this is v3, NOT the v4.1.6 target in Phase 4.**
- **pkg-config:** `pkg-config --modversion projectM` → 3.1.12
- **Decision (Phase 4, deferred):** use **CPM fetch of projectm v4.1.6** from GitHub rather than the system v3 package, per Phase 4 spec. System v3 may coexist for reference but will NOT be linked.
- **libprojectM shared lib:** not present at `/usr/lib/libprojectm*` — v3 ships headers + the SDL frontend binary. Confirms CPM fetch is the right call for v4.

## Other libs (verified 2026-06-18)
- **spdlog:** installed (pacman) — use system package for logging (Phase 2).
- **nlohmann-json:** installed (pacman) — use system package for config/serialization (Phase 2).
- **OpenGL:** `pkg-config --modversion gl` → 1.2 (GL pkg-config, Mesa underneath).

- *NOTE:* The LLM is totally free to find any existing libraries or do code searches for any other need that may benefit whether within it's training data, reading docs freely, doing extensive web_search tool calls to find info, searching git programmatically or via the users host system's github-cli program via `gh search repos --sort stars --limit 15 SIMPLE_SEARCH_TERM_SUCH_AS qml library` or for finer grained search parameters one can find them via `gh search repos --help`. Expanding on that the harness in use should have at least one web search tool call available but the AI agent may also excecut `ddgr`, `googler`, `w3m`, and `lynx`, to perform web searches or dump web pages, assuming the appropriate flags are used to not get caught in an interactive TTY prompt and become stuck, such as lynx having the -dump flag that will dump a websites raw textual elements nicely formatted with/without sources at the bottom for any URL which can optionally be piped into a file 


## Build Commands (canonical)
- **TODO:** Fun side-project to have a model build a project config+build utility that has a keyboard navigable texctual user interface for the end user which can also be operated in feature parity agentically by LLM's using command line options and parameters. Perhaps with a config/build/compile config file to set settings independantly for each [different] project that uses it and to allow configuring/changing settings *and saving* them persistantly whether by the user, the end user, or the LLM model when working agentically. Should be able to use that gcc flag that Arch Linux's pacman uses to get the best build config such as cpu type for insruction set with `-march value --mtune value` and whatever is best for LTO etc. Build profile optimizations should default to 0 (lowest/none) always and only be set to system specific optimizations such as `-O3` if the end-user (or LLm/user during development for testing) explicitly select a flag for production ready compiulation such that devleopment is as speedy as possible to us (the LLM agent and the user) 

```bash
# TODO: configure and build script that can be run interactively in a TUI or programatically for agents via command line options
# Configure (once CMake is installed)
cmake -S . -B build -G Ninja \
      -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
      -DCMAKE_CXX_COMPILER=g++ \
      -DCMAKE_CXX_STANDARD=23

# Build
cmake --build build

# Run the shell
./build/apps/app_shell/suno_creator
```

## Pacman packages the user still needs to install
```bash
sudo pacman -S cmake ccache
```
- `cmake` — BLOCKER for Phase 1 build verification.
- `ccache` — strongly recommended for rebuild speed (GCC 16 + Qt templates are heavy).
- `Optional (not in use yet or unveriifed):` sccache, ninja

## Windows Notes
TODO
- vcpkg pretty standard
- scoop, winget, etc?

## Gotchas Log
- (empty — append as discovered)
