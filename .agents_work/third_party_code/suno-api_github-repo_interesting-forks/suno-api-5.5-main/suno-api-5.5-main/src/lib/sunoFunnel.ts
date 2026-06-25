const STYLE_DB: Record<string, string> = {
  '周杰伦': 'Mandarin pop, R&B, piano ballad, Chinese style pentatonic, melancholic male vocal, 80-100 BPM',
  '林俊杰': 'Mandarin pop ballad, powerful tenor vocal, piano-driven, emotional, wide vocal range, 70-90 BPM',
  '邓紫棋': 'Mandarin pop, powerful female vocal, rock influence, high notes, emotional build-up, 80-100 BPM',
  '陈奕迅': 'Cantopop ballad, deep baritone vocal, minimalist arrangement, storytelling, 60-80 BPM',
  '五月天': 'Mandarin rock, band sound, uplifting, guitar-driven, stadium anthem, 120-140 BPM',
  '蔡依林': 'Mandopop dance, electronic, female vocal, upbeat, synth-heavy, 120-130 BPM',
  '薛之谦': 'Mandarin ballad, emotional male vocal, string arrangement, dramatic, 70-85 BPM',
  '王菲': 'Art pop, ethereal female vocal, dreamy, reverb-heavy, atmospheric, 60-80 BPM',
  '陶喆': 'Mandarin R&B, soulful male vocal, falsetto, groovy bass, 80-100 BPM',
  '李荣浩': 'Mandarin pop, laid-back male vocal, guitar-based, minimalist production, 70-90 BPM',
  'Taylor Swift': 'Pop, confessional female vocal, acoustic guitar, storytelling, 80-120 BPM',
  'BTS': 'K-pop, rap, vocal harmony, electronic, dance, 120-140 BPM',
  'Bruno Mars': 'Funk, soul, retro pop, male vocal, groovy bass, 100-115 BPM',
  'Adele': 'Soul pop, powerful female vocal, piano, emotional ballad, 60-80 BPM',
  'Ed Sheeran': 'Pop folk, acoustic guitar, male vocal, loop pedal, 80-100 BPM',
};

const COVER_TEMPLATES: Record<string, string> = {
  acoustic: 'acoustic cover, stripped down, soft guitar, intimate vocal, raw emotion',
  piano: 'piano cover, solo piano arrangement, classical influence, minimal, spacious',
  orchestral: 'orchestral cover, cinematic strings, epic, film score style, dramatic build',
  lofi: 'lofi cover, chill beats, warm vinyl sound, relaxed version, bedroom pop',
  rock: 'rock cover, electric guitar reinterpretation, band energy, powerful drums',
  electronic: 'electronic cover, synth remake, retro 80s, vaporwave, digital reimagining',
  jazz: 'jazz cover, swing reinterpretation, walking bass, lounge piano, sophisticated',
  chinese_traditional: '国风改编, 民乐版, 古筝和笛子主导, 戏曲元素, 悠远意境',
};

const GENRE_TEMPLATES: Record<string, string> = {
  ballad: 'slow tempo, emotional piano, string orchestra, heartfelt vocal, reverb, cinematic',
  rock: 'electric guitar, drums, bass, energetic, distorted, 120-140 BPM, stadium sound',
  electronic: 'synth, arpeggiator, 808 drums, sidechain compression, 120-130 BPM, club energy',
  'r&b': 'smooth, groovy bass, soulful vocal, 808 kick, chill vibe, 80-100 BPM',
  hiphop: 'trap beat, 808 bass, hi-hat rolls, rap vocal, urban, 140-160 BPM',
  folk: 'acoustic guitar, warm vocal, simple arrangement, storytelling, 70-90 BPM',
  jazz: 'swing, piano trio, walking bass, brush drums, improvised feel, 100-120 BPM',
  lofi: 'chillhop, vinyl crackle, mellow, study beats, filtered drums, 70-90 BPM',
  chinese_style: '古风, 中国五声调式, 笛子, 古筝, 琵琶, 二胡, 悠远, 60-80 BPM',
  kpop: 'polished production, vocal layering, dance beat, catchy hook, 110-130 BPM',
};

const TIMBRE_MAP: Record<string, string> = {
  '周杰伦': 'slightly nasal, melancholic male tenor, relaxed delivery',
  '林俊杰': 'powerful clear tenor, effortless high notes, emotional vibrato',
  '邓紫棋': 'strong belting female vocal, gritty texture, wide dynamic range',
  '陈奕迅': 'deep warm baritone, storytelling tone, understated power',
  '五月天': 'band vocal, energetic rock tenor, crowd-feel',
  '蔡依林': 'bright pop female vocal, precise articulation, dance energy',
  '薛之谦': 'raspy emotional male, intimate delivery, whispered sections',
  '王菲': 'ethereal soprano, breathy delivery, floating tone',
  '陶喆': 'smooth R&B tenor, effortless falsetto, groovy phrasing',
  '李荣浩': 'laid-back male vocal, conversational tone, subtle emotion',
};

export type FunnelCommand = 'full' | 'cover' | 'remix' | 'style';

export interface FunnelPromptRequest {
  command: FunnelCommand;
  artist?: string;
  theme?: string;
  song?: string;
  style?: string;
  genre?: string;
  description?: string;
}

export interface FunnelPromptResult {
  command: FunnelCommand;
  prompt: string;
  tags: string;
  title: string;
  artist: string;
  source: 'suno-funnel';
  attribution: {
    author: '@2569658930';
    project: 'Suno Funnel';
    repo: 'https://github.com/2569658930/tan';
    web: 'https://2569658930.github.io/tan/';
  };
}

function resolveArtist(artist: string): { name: string; style: string } {
  if (STYLE_DB[artist]) {
    return { name: artist, style: STYLE_DB[artist] };
  }

  for (const [name, style] of Object.entries(STYLE_DB)) {
    if (artist.includes(name) || name.includes(artist)) {
      return { name, style };
    }
  }

  return { name: artist, style: 'Mandarin pop, emotional vocal, modern production' };
}

export function generateFunnelPrompt(input: FunnelPromptRequest): FunnelPromptResult {
  const command = input.command;

  if (command === 'style') {
    const artist = input.artist?.trim() || '周杰伦';
    const resolved = resolveArtist(artist);
    return {
      command,
      prompt: resolved.style,
      tags: resolved.style,
      title: `${resolved.name} Style Reference`,
      artist: resolved.name,
      source: 'suno-funnel',
      attribution: {
        author: '@2569658930',
        project: 'Suno Funnel',
        repo: 'https://github.com/2569658930/tan',
        web: 'https://2569658930.github.io/tan/',
      },
    };
  }

  if (command === 'cover') {
    const artist = input.artist?.trim() || '周杰伦';
    const song = input.song?.trim() || input.theme?.trim() || 'Untitled';
    const coverStyle = input.style || 'piano';
    const stylePrompt = COVER_TEMPLATES[coverStyle] || COVER_TEMPLATES.piano;
    const prompt = `A ${stylePrompt}, cover of ${song} originally by ${artist}, reimagined with emotional depth and fresh interpretation. High quality production, clear vocals, warm mix.`;

    return {
      command,
      prompt,
      tags: stylePrompt,
      title: `${song} (${coverStyle} Cover)`,
      artist,
      source: 'suno-funnel',
      attribution: {
        author: '@2569658930',
        project: 'Suno Funnel',
        repo: 'https://github.com/2569658930/tan',
        web: 'https://2569658930.github.io/tan/',
      },
    };
  }

  if (command === 'remix') {
    const description = input.description?.trim() || input.theme?.trim() || 'Midnight city lights';
    const genre = input.genre || input.style || 'electronic';
    const genrePrompt = GENRE_TEMPLATES[genre] || GENRE_TEMPLATES.electronic;
    const prompt = `A ${genrePrompt} remix, ${description}. Driving energy, powerful drop, professional production, club-ready sound, clean mastering.`;

    return {
      command,
      prompt,
      tags: genrePrompt,
      title: `${description.slice(0, 30)} (${genre} Remix)`,
      artist: 'Remix',
      source: 'suno-funnel',
      attribution: {
        author: '@2569658930',
        project: 'Suno Funnel',
        repo: 'https://github.com/2569658930/tan',
        web: 'https://2569658930.github.io/tan/',
      },
    };
  }

  const artistInput = input.artist?.trim() || '周杰伦';
  const theme = input.theme?.trim() || 'Rainy convenience store';
  const style = input.style || 'ballad';
  const resolved = resolveArtist(artistInput);
  const timbre = TIMBRE_MAP[resolved.name] || 'emotional vocal, clear articulation';
  const prompt = `${resolved.style}. A song about ${theme}, ${timbre}. Professional production, clean mix, emotional delivery.`;
  const title = `${theme} (${style.replace('_', ' ')})`;

  return {
    command: 'full',
    prompt,
    tags: resolved.style,
    title,
    artist: resolved.name,
    source: 'suno-funnel',
    attribution: {
      author: '@2569658930',
      project: 'Suno Funnel',
      repo: 'https://github.com/2569658930/tan',
      web: 'https://2569658930.github.io/tan/',
    },
  };
}