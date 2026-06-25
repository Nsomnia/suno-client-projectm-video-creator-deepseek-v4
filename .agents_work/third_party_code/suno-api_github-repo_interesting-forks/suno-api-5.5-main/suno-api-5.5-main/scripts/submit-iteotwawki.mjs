/**
 * Submit + poll "ITEOTWAWKI- API Test" via local suno-api.
 * Lyrics rewritten to avoid Suno copyright filter (original R.E.M. lines removed).
 */
const API = 'http://localhost:3005';

const prompt = `[Intro - Rickenbacker jangle riff]

[Verse 1 - rapid-fire staccato]
Breaking news crawls, ticker tape on fire
Phone rings hot, two leaders trading blame on the wire
Crisis in the lens, somebody shouts across the line
Markets spin their own way, we misread every sign
Feed the signal through a crackling aux, half a word, no weight
Narrative starts to fracture — was that doubt or just fate?
Cables under oceans, decades in the ground
Ceasefire on the paper while the rockets trace the sound
City lights go up and sirens chase the night
Pressure on your collar, cameras hunting for a fight
Beat by beat the anchors stumble, headlines clipped and cropped
Watch that low arc crossing — hold your breath, then stop
Overflow of faces, empty shelves, shared bread
Save yourself if you can, serve the fear instead
World runs its cold math, listen to your pulse complain
Mixing holy thunder with the terror and the shame
Vitriolic fever, flags snap in the light
Strangely energized!

[Chorus - full band, defiant sarcastic tone]
Sounds like the finish of the world we thought we knew!
Sounds like the finish of the world we thought we knew!
Sounds like the finish of the world we thought we knew!
And I'm still upright!

[Verse 2 - rapid-fire breathless]
Six o'clock glow, don't get trapped in foreign glass
Slash the feed, return, hear your own thoughts pass
Lock the uniform, leak sparks, press keeps spinning
Every motive climbs the ladder, ruse keeps winning
Strike a match, strike a vow, step down, step down
Heel comes down, crushed — no fear allowed
Cavalier and reckless, steer away
A bracket, a bracket, a bracket full of play
Offer me the answers, offer me the route
I refuse!

[Chorus]
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
And I'm still upright! (I feel fine!)

[Verse 3 - sparse spoken-word]
The other night I dreamt of knives, continental drift divide
Mountains sit in a line, Operation Lion
Leaders duck and pivot — the ruse played perfect
Birthday party, cheesecake, jelly bean, boom!
You symbiotic, patriotic, slam but neck, right? Right!

[Final Chorus - full power]
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
And I'm still upright!
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
Sounds like the finish of the world we thought we knew! (It's just another Tuesday alone)
And I'm still upright, upright!

[Outro - solo acoustic]
It's just another Tuesday alone...
B'seder...`;

const body = {
  title: 'ITEOTWAWKI- API Test',
  tags: 'college rock, jangle pop, post-punk, 80s alt, Rickenbacker jangle, rapid-fire male vocal, 145 BPM, E major, defiant sarcastic geopolitical satire',
  negative_tags: 'overproduced, wall of sound, gang vocals, muddy mix, slow tempo, ballad, heavy reverb, buried vocals',
  make_instrumental: false,
  wait_audio: false,
  model: 'chirp-v3-5',
  weirdness: 70,
  style_influence: 55,
  prompt,
};

console.log('prompt chars:', prompt.length);
console.log('tags chars:', body.tags.length);

const res = await fetch(`${API}/api/custom_generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log('submit status', res.status);

if (!res.ok) {
  console.error(text);
  process.exit(1);
}

const clips = JSON.parse(text);
const fs = await import('node:fs');
fs.writeFileSync(new URL('./iteotwawki-submit-result.json', import.meta.url), JSON.stringify(clips, null, 2));

const ids = clips.map((c) => c.id).join(',');
console.log('track ids:', ids);
console.log('polling...');

const deadline = Date.now() + 180_000;
let last = clips;

while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 5000));
  const poll = await fetch(`${API}/api/get?ids=${ids}`);
  if (!poll.ok) {
    console.error('poll failed', poll.status, await poll.text());
    continue;
  }
  last = JSON.parse(await poll.text());
  const summary = last.map((t) => ({
    id: t.id,
    status: t.status,
    error_message: t.error_message,
    audio_url: t.audio_url,
  }));
  console.log(new Date().toISOString(), JSON.stringify(summary, null, 2));

  const done = last.every((t) => ['streaming', 'complete', 'error'].includes(t.status));
  if (done) break;
}

fs.writeFileSync(new URL('./iteotwawki-poll-result.json', import.meta.url), JSON.stringify(last, null, 2));

const errors = last.filter((t) => t.status === 'error');
const ok = last.filter((t) => t.status === 'streaming' || t.status === 'complete');

if (errors.length) {
  console.error('\nFAILED:', errors.map((t) => t.error_message || t.status).join('; '));
  process.exit(2);
}

if (!ok.length) {
  console.error('\nTIMEOUT — no tracks reached streaming/complete');
  process.exit(3);
}

console.log('\nSUCCESS');
for (const t of ok) {
  console.log(`  ${t.title}: ${t.audio_url}`);
}