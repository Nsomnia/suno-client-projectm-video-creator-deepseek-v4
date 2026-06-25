$prompt = @'
[Intro - bright chiming Rickenbacker jangle, clean electric, iconic opening riff]

[Verse 1 - rapid-fire staccato delivery, each item clipped to one beat, building intensity]
That's great!
It starts with a phone call, Trump and Bibi, the ruse in plain view
Eye of the crisis, "You're fucking crazy," he yells down the line
World serves its own needs, don't mis-serve our own needs
Feed it off an aux, speak, grunt, no strength
The story starts to shatter with a hint of doubt, down, doubt
Wire in a tunnel, representing forty years
And a ceasefire for Lebanon but the rockets fly
Beirut on board and firing in a hurry with the furies
Breathing down your neck
Team by team, reporters baffled, Trump, tethered, crop
Look at that low plane, fine, then
Oh-oh, overflow, population, common food
But it'll do, save yourself, serve yourself
World serves its own needs, listen to your heart bleed
Dummy with the raptured and the revered and the right, right
You vitriolic, patriotic, slam fight, bright light
Feeling pretty psyched!

[Chorus - full band joins, backing harmonies swell, defiant sarcastic tone, exact repetition locked to rhythm]
Looks like the end of the world as we know it!
Looks like the end of the world as we know it!
Looks like the end of the world as we know it!
So I feel fine!

[Verse 2 - rapid-fire breathless delivery, accelerating imagery, whispered breakdown mid-verse]
Six o'clock, TV hour, don't get caught in foreign tower
Slash and burn, return, listen to yourself churn
Lock him in uniform, leak burning, press releasing
Every motive escalate, ruse in the cinerate
Light a candle, light a votive, step down, step down
Watch your heel crush, crushed, oh-oh, this means no fear
Cavalier renegade, steer clear
A tournament, a tournament, a tournament of lies
Offer me solutions, offer me alternatives
And I decline!

[Chorus - full band, backing harmonies, four exact repeats, defiant sarcastic tone]
Looks like the end of the world as we know it! (It's just another Tuesday alone)
Looks like the end of the world as we know it! (It's just another Tuesday alone)
Looks like the end of the world as we know it! (It's just another Tuesday alone)
So I feel fine! (I feel fine!)

[Verse 3 - sparse, guitars drop to minimal, spoken-word rhythmic delivery over drums and bass only]
The other night I dreamt of knives, continental drift divide
Mountains sit in a line, Operation Lion
Trump said "duck him," took Bibi's hand — the ruse played perfect
Birthday party, cheesecake, jelly bean, boom!
You symbiotic, patriotic, slam but neck, right? Right!

[Final Chorus - full power, all layers, overlapping backing vocals, defiant peak energy]
Looks like the end of the world as we know it! (It's just another Tuesday alone)
Looks like the end of the world as we know it! (It's just another Tuesday alone)
Looks like the end of the world as we know it! (It's just another Tuesday alone)
So I feel fine!
Looks like the end of the world as we know it! (It's just another Tuesday alone)
Looks like the end of the world as we know it! (It's just another Tuesday alone)
Looks like the end of the world as we know it! (It's just another Tuesday alone)
So I feel fine, fine!

[Outro - fading, sparse, solo acoustic, deadpan delivery]
It's just another Tuesday alone...
B'seder...
'@

$body = @{
  title = 'ITEOTWAWKI- API Test'
  tags = 'College rock, jangle pop, post-punk, 80s alternative, R.E.M.-style, rapid-fire spoken-sung male vocal, Rickenbacker jangle guitar, driving drums, bass groove, clean electric guitars, occasional organ swell, live band feel, urgent mix, vocals forward, minimal compression, 145 BPM, E major, defiant, sarcastic, chaotic, resilient, geopolitical satire, layered call-and-response chorus vocals, breathless verse delivery, controlled vocal strain, sarcastic cheerfulness on chorus hook'
  negative_tags = 'overproduced, wall of sound, gang vocals, muddy mix, slow tempo, ballad, heavy reverb, buried vocals'
  make_instrumental = $false
  wait_audio = $false
  model = 'chirp-v3-5'
  prompt = $prompt
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri 'http://localhost:3005/api/custom_generate' -Method POST -ContentType 'application/json' -Body $body
$response | ConvertTo-Json -Depth 6
$response | ConvertTo-Json -Depth 6 | Out-File 'C:\Users\mg26\suno-api-5.5\scripts\iteotwawki-submit-result.json'
Write-Output "Saved result to scripts/iteotwawki-submit-result.json"