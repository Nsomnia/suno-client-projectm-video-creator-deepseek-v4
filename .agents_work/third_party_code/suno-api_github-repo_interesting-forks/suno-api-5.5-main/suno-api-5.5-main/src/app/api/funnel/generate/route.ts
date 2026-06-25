import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEFAULT_MODEL, sunoApi } from '@/lib/SunoApi';
import { corsHeaders } from '@/lib/utils';
import { FunnelPromptRequest, generateFunnelPrompt } from '@/lib/sunoFunnel';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      command,
      artist,
      theme,
      song,
      style,
      genre,
      description,
      make_instrumental,
      model,
      wait_audio,
      negative_tags,
    } = body;

    const funnel = generateFunnelPrompt({
      command,
      artist,
      theme,
      song,
      style,
      genre,
      description,
    } as FunnelPromptRequest);

    const audioInfo = await (
      await sunoApi((await cookies()).toString())
    ).custom_generate(
      funnel.prompt,
      funnel.tags,
      funnel.title,
      Boolean(make_instrumental),
      model || DEFAULT_MODEL,
      Boolean(wait_audio),
      negative_tags,
    );

    return new NextResponse(
      JSON.stringify({
        funnel,
        audio: audioInfo,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  } catch (error: any) {
    console.error('Error generating audio from Suno Funnel prompt:', error);
    return new NextResponse(
      JSON.stringify({ error: error.response?.data?.detail || error.toString() }),
      {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}