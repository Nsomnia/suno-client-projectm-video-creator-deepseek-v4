'use client';

import { useState } from 'react';

const FUNNEL_WEB = 'https://2569658930.github.io/tan/';
const FUNNEL_REPO = 'https://github.com/2569658930/tan';
const FUNNEL_AUTHOR = 'https://github.com/2569658930';

type FunnelMode = 'full' | 'cover' | 'remix';

interface PromptResult {
  prompt: string;
  tags: string;
  title: string;
  artist: string;
}

export default function SunoFunnel() {
  const [mode, setMode] = useState<FunnelMode>('full');
  const [artist, setArtist] = useState('周杰伦');
  const [theme, setTheme] = useState('雨天下的便利店');
  const [song, setSong] = useState('晴天');
  const [style, setStyle] = useState('ballad');
  const [description, setDescription] = useState('深夜城市霓虹');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generatePrompt() {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const payload =
        mode === 'cover'
          ? { command: 'cover', artist, song, style }
          : mode === 'remix'
            ? { command: 'remix', description, genre: style }
            : { command: 'full', artist, theme, style };

      const response = await fetch('/api/funnel/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prompt');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    if (!result?.prompt) return;
    await navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="not-prose my-12 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-indigo-50 p-6 shadow-lg lg:p-8">
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Community shout-out
        </p>
        <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
          Saw the fix <a href="https://github.com/gcui-art/suno-api/issues/278" className="font-medium underline" target="_blank" rel="noreferrer">@2569658930</a> offered for the Vercel <code className="rounded bg-amber-100 px-1">url.parse()</code> issue — but upstream never had a working Suno Funnel connector, so we wired one in here and wanted to give him the credit.
        </p>
        <p className="mt-2 text-sm text-amber-900/80">
          Prompt logic adapted from{' '}
          <a href={FUNNEL_REPO} className="font-medium underline" target="_blank" rel="noreferrer">
            Suno Funnel
          </a>{' '}
          by{' '}
          <a href={FUNNEL_AUTHOR} className="font-medium underline" target="_blank" rel="noreferrer">
            @2569658930
          </a>
          . Star his repo if this saves you time.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">Suno Funnel Connector</h2>
          <p className="mt-1 text-sm text-indigo-900/70">
            Generate a Suno-ready prompt here, then send it straight to this API.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={FUNNEL_WEB}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50"
          >
            Open Web App
          </a>
          <a
            href={FUNNEL_REPO}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-indigo-900 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
          >
            Suno Funnel on GitHub
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(['full', 'cover', 'remix'] as FunnelMode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === item
                ? 'bg-indigo-900 text-white'
                : 'bg-white text-indigo-900 ring-1 ring-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {mode !== 'remix' && (
          <label className="flex flex-col gap-1 text-sm text-indigo-950">
            Artist style
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="rounded-lg border border-indigo-200 px-3 py-2"
              placeholder="周杰伦"
            />
          </label>
        )}

        {mode === 'full' && (
          <label className="flex flex-col gap-1 text-sm text-indigo-950">
            Theme / song idea
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="rounded-lg border border-indigo-200 px-3 py-2"
              placeholder="雨天下的便利店"
            />
          </label>
        )}

        {mode === 'cover' && (
          <label className="flex flex-col gap-1 text-sm text-indigo-950">
            Original song
            <input
              value={song}
              onChange={(e) => setSong(e.target.value)}
              className="rounded-lg border border-indigo-200 px-3 py-2"
              placeholder="晴天"
            />
          </label>
        )}

        {mode === 'remix' && (
          <label className="flex flex-col gap-1 text-sm text-indigo-950 md:col-span-2">
            Remix description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border border-indigo-200 px-3 py-2"
              placeholder="深夜城市霓虹"
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm text-indigo-950">
          {mode === 'remix' ? 'Genre' : 'Style'}
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="rounded-lg border border-indigo-200 px-3 py-2"
          >
            {mode === 'cover' ? (
              <>
                <option value="piano">piano</option>
                <option value="acoustic">acoustic</option>
                <option value="lofi">lofi</option>
                <option value="rock">rock</option>
                <option value="electronic">electronic</option>
                <option value="jazz">jazz</option>
              </>
            ) : mode === 'remix' ? (
              <>
                <option value="electronic">electronic</option>
                <option value="lofi">lofi</option>
                <option value="rock">rock</option>
                <option value="ballad">ballad</option>
                <option value="hiphop">hiphop</option>
              </>
            ) : (
              <>
                <option value="ballad">ballad</option>
                <option value="rock">rock</option>
                <option value="electronic">electronic</option>
                <option value="hiphop">hiphop</option>
                <option value="standard">standard</option>
              </>
            )}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generatePrompt}
          disabled={loading}
          className="rounded-full bg-indigo-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-60"
        >
          {loading ? 'Generating…' : 'Generate Prompt'}
        </button>
        {result && (
          <button
            type="button"
            onClick={copyPrompt}
            className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-medium text-indigo-900 hover:bg-indigo-50"
          >
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4 rounded-xl border border-indigo-100 bg-white/80 p-4 text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Title</p>
            <p className="mt-1 text-sm text-indigo-950">{result.title}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Suno prompt</p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-indigo-950/5 p-3 text-sm text-indigo-950">
              {result.prompt}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Send to API</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-indigo-950/5 p-3 text-xs text-indigo-950">
{`POST /api/funnel/generate
{
  "command": "${mode}",
  "artist": "${artist}",
  ${mode === 'cover' ? `"song": "${song}",` : mode === 'remix' ? `"description": "${description}",` : `"theme": "${theme}",`}
  "style": "${style}",
  "wait_audio": true
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}