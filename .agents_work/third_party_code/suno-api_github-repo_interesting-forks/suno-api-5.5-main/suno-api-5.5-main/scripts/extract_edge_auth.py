"""Extract Suno auth cookies from Microsoft Edge on Windows."""

from __future__ import annotations

import json
import os
import shutil
import sqlite3
import sys
from pathlib import Path


def cookie_db_paths() -> list[tuple[str, Path]]:
    edge_root = Path(os.environ["LOCALAPPDATA"]) / "Microsoft" / "Edge" / "User Data"
    candidates: list[tuple[str, Path]] = []

    for profile_dir in sorted(edge_root.iterdir()):
        if not profile_dir.is_dir():
            continue
        if profile_dir.name not in {"Default", "Profile 1", "Profile 2"} and not profile_dir.name.startswith("Profile "):
            continue
        for relative in ("Network/Cookies", "Cookies"):
            path = profile_dir / relative
            if path.exists():
                candidates.append((profile_dir.name, path))
                break

    return candidates


def open_cookie_db(source: Path) -> sqlite3.Connection:
    try:
        return sqlite3.connect(f"file:{source}?mode=ro&nolock=1", uri=True)
    except sqlite3.OperationalError:
        temp = Path(os.environ["TEMP"]) / f"edge-cookies-copy.db"
        shutil.copy2(source, temp)
        return sqlite3.connect(temp)


def list_suno_cookies(profile: str, source: Path) -> list[dict]:
    connection = open_cookie_db(source)
    rows = connection.execute(
        """
        SELECT host_key, name, length(encrypted_value), is_secure, expires_utc
        FROM cookies
        WHERE host_key LIKE '%suno%' OR host_key LIKE '%clerk%'
        ORDER BY host_key, name
        """
    ).fetchall()
    connection.close()

    return [
        {
            "profile": profile,
            "host": host,
            "name": name,
            "encrypted_length": enc_len,
            "secure": bool(is_secure),
            "expires_utc": expires,
        }
        for host, name, enc_len, is_secure, expires in rows
    ]


def decrypt_edge_cookies() -> dict[str, str]:
    import browser_cookie3

    cookies: dict[str, str] = {}
    jar = browser_cookie3.edge()
    for cookie in jar:
        host = cookie.domain.lower()
        if "suno" in host or "clerk" in host:
            cookies[f"{cookie.domain}|{cookie.name}"] = cookie.value
    return cookies


def build_suno_cookie_header(values: dict[str, str]) -> str | None:
    named = {}
    for key, value in values.items():
        name = key.split("|", 1)[-1]
        named[name] = value

    if "__client" not in named:
        return None

    priority = [
        "__client",
        "__session",
        "__refresh",
        "_cfuvid",
        "cf_clearance",
    ]
    parts = []
    for name in priority:
        if name in named:
            parts.append(f"{name}={named[name]}")

    for name, value in sorted(named.items()):
        if name not in priority:
            parts.append(f"{name}={value}")

    return "; ".join(parts)


def main() -> int:
    print("Scanning Edge profiles for Suno/Clerk cookies...\n")
    all_rows: list[dict] = []
    for profile, path in cookie_db_paths():
        try:
            rows = list_suno_cookies(profile, path)
            all_rows.extend(rows)
            print(f"[{profile}] {path}")
            print(f"  matches: {len(rows)}")
        except Exception as error:
            print(f"[{profile}] failed to read cookie DB: {error}")

    if not all_rows:
        print("\nNo Suno/Clerk cookies found in Edge.")
        print("Sign in at https://app.suno.ai in Edge first, then rerun this script.")
        return 1

    print("\nCookie names found:")
    print(json.dumps(all_rows, indent=2))

    try:
        decrypted = decrypt_edge_cookies()
    except Exception as error:
        print(f"\nCould not decrypt Edge cookies: {error}")
        print(
            "Edge cookie decryption may require running this terminal as Administrator "
            "on recent Edge versions with app-bound encryption."
        )
        return 2

    if not decrypted:
        print("\nSuno cookies exist in Edge, but none could be decrypted.")
        return 2

    header = build_suno_cookie_header(decrypted)
    if not header:
        print("\nDecrypted cookies found, but required __client cookie is missing.")
        return 2

    env_path = Path(__file__).resolve().parents[1] / ".env"
    env_path.write_text(f"SUNO_COOKIE={header}\n", encoding="utf-8")

    masked = header[:48] + "..." if len(header) > 48 else header
    print("\nWrote SUNO_COOKIE to:", env_path)
    print("Preview:", masked)
    print("Cookie count:", len(decrypted))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())