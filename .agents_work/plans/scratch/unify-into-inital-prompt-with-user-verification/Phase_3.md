## Phase 3: Suno Client Integration & Mock Networking


# Phase 3: Suno API Client Integration & Mock Data

Implement the network module responsible for Suno API communication. The UI is not built yet; strictly focus on the backend data logic and data models.

## Context & Persistence Rules
1. Create `/libs/network/RULES.md` governing network interactions. Mandate the use of asynchronous handlers and strict separation from UI rendering code.
2. **Security Warning:** The actual Bearer/JWT tokens and cookies will be captured via the user's browser DevTools at a later date. **Do not hardcode secrets.**

## Tasks
1. **Mock/Offline Architecture:**
   - Write a secure parser to read a local credentials file (path defined in the Phase 2 JSON config).
   - **Crucial:** Gracefully handle the absence of this file by immediately falling back to a "Mock API Mode". This mock mode must emit simulated network delays and return fake generated song metadata (JSON format).

2. **Async HTTP Engine:**
   - Using `QNetworkAccessManager`, build a non-blocking API client that prepares direct POST requests for the Suno backend endpoints.
   - Implement session management, request queuing, and automatic retry-on-failure protocols. Keep the authentication header injection modular so it can accept JWTs later.

3. **Data Serialization & Exposure:**
   - Parse JSON response payloads into strongly typed C++ classes (e.g., `TrackMetadata`, `GenerationJob`, `Playlist`).
   - Expose this data using Qt's Property System (`Q_PROPERTY`, `Q_INVOKABLE`, and `QAbstractListModel` for playlists) so it is natively ready for QML consumption.

4. **Verification:**
   - Write a diagnostic CLI routine or unit test to verify the network client successfully falls back to mock mode and populates the C++ data models. Output results to `/.agent/logs/phase_3_network.log`.
