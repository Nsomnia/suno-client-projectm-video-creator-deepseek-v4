# Project Rules — Suno Client / projectM Video Creator

> Canonical conventions for every contributor (human or agent). Read before writing code.
> Directory-scoped `RULES.md` files may add stricter rules; they never relax these.

## 1. Language & Standard
- **C++23**, no exceptions. `-std=c++23` is mandated by the root CMake.
- Prefer standard library over Qt where there is no Qt benefit (e.g. `std::format` is fine for non-translated strings; `QString` for anything user-facing or i18n-bound).
- `-Wall -Wextra -Wpedantic` are enabled and **warnings are errors** (`-Werror`). Fix the code, never silence a warning without a tracked justification.

## 2. Design Philosophy
- **Composition over inheritance.** No virtual-heavy type hierarchies except where Qt requires them (e.g. `QQuickItem`, `QAbstractListModel`). Model domain logic as free functions and small value types; reserve inheritance for Qt interface adaption.
- **Value semantics by default.** Pass by `const T&` for read, return by value. Reach for `std::unique_ptr` / `std::shared_ptr` only when ownership is genuinely shared or polymorphic; otherwise stack-allocate.
- **No raw `new`/`delete` in domain code.** Use `std::make_unique`, `std::make_shared`, or Qt parent-child ownership.

## 3. Qt 6 Memory Model
- Qt object trees own lifetime: pass a `QObject* parent` in constructors, let `~QObject` cascade-delete children. Never `delete` a QObject that has a parent.
- `Q_PROPERTY` + `Q_INVOKABLE` is the *only* bridge from C++ to QML. Expose state, hide implementation.
- Register C++ types to QML via `qmlRegisterType` / `qmlRegisterSingletonType`. Never reach into QML objects from C++ by object name.
- QML-facing model classes derive from `QAbstractListModel` and emit `beginInsertRows/endInsertRows` etc. — never mutate the underlying container without the guard pairs.

## 4. Concurrency
- UI thread is sacred: **no blocking work on the main/GUI thread.** Network, FFT, file I/O go through the task pool (Phase 2).
- Cross-thread communication uses Qt signal/slot (queued connections) or `QMetaObject::invokeMethod` with `Qt::QueuedConnection`. Never share raw pointers to QObject across threads without a connection hop.
- `std::jthread` + `std::stop_token` for non-Qt worker threads; cooperative cancellation only.

## 5. Error Handling
- Exceptions are for *exceptional* failures crossing module boundaries. Domain logic returns `std::expected<T, Error>` (or a project error type) where the failure is a normal control-flow outcome (missing file, network timeout, mock fallback).
- `noexcept` on move constructors / destructors / leaf functions where provably safe.
- The app **must never hard-crash** from an expected error — see Phase 6. Every external boundary (file, network, GL init) has a graceful fallback.

## 6. Build & Dependencies
- Single generator: **Ninja**. Single toolchain on Arch: system GCC + system Qt 6.11.1.
- External deps via **CPM.cmake** (fetch at configure time) unless a stable Arch package exists — prefer the system package to reduce build time and binary size.
- `vcpkg.json` is maintained as a cross-compile stub (Windows path); it is **not** the primary toolchain on Arch.
- Commit `compile_commands.json` is NOT committed (gitignored) — generate it for clangd locally via `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON`.

## 7. File & Module Organization
- Each `.cpp`/`.h` pair has one clear responsibility. Header guards are `#pragma once`.
- Public headers of a lib live alongside source; the consuming target links the lib, not individual files.
- QML files: small, composable components. No monolithic 1000-line QML (Phase 5 rule). One component per file.

## 8. Git & Commits
- Conventional Commits (`feat:`, `fix:`, `build:`, `docs:`, `chore:`, `refactor:`).
- Never commit: `build/`, `user_scratch/`, secrets, `.agent/logs/*.log` (logs are gitignored).
- One logical change per commit. Build must pass before commit.

## 9. Secrets
- **Never hardcode tokens, cookies, or Bearer strings.** Credentials come from a config-specified file path (Phase 3) or env vars. Absence of credentials → Mock Mode, silently and safely.
