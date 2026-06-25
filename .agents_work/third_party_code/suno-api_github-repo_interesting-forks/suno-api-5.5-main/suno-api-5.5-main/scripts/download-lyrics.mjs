import fs from 'fs';
import path from 'path';
import axios from 'axios';

function formatSrtTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function convertToSrt(alignedWords) {
    let srt = '';
    let index = 1;
    let i = 0;

    while (i < alignedWords.length) {
        const word = alignedWords[i];
        let line = word.word;
        let lineEnd = word.end_s;

        while (i + 1 < alignedWords.length) {
            const nextWord = alignedWords[i + 1];
            const gap = nextWord.start_s - lineEnd;

            if (gap < 0.5 && line.length < 80) {
                i++;
                line += ' ' + nextWord.word;
                lineEnd = nextWord.end_s;
            } else {
                break;
            }
        }

        srt += `${index}\n`;
        srt += `${formatSrtTime(word.start_s)} --> ${formatSrtTime(lineEnd)}\n`;
        srt += `${line.trim()}\n\n`;

        index++;
        i++;
    }
    return srt;
}

function convertToLrc(alignedWords) {
    let lrc = '';
    let i = 0;

    while (i < alignedWords.length) {
        const word = alignedWords[i];
        let line = word.word;
        let lineStart = word.start_s;
        let lineEnd = word.end_s;

        while (i + 1 < alignedWords.length) {
            const nextWord = alignedWords[i + 1];
            const gap = nextWord.start_s - lineEnd;

            if (gap < 0.5 && line.length < 80) {
                i++;
                line += ' ' + nextWord.word;
                lineEnd = nextWord.end_s;
            } else {
                break;
            }
        }

        const min = Math.floor(lineStart / 60);
        const sec = Math.floor(lineStart % 60);
        const hundredths = Math.floor((lineStart % 1) * 100);
        const timeStr = `[${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}]`;

        lrc += `${timeStr}${line.trim()}\n`;
        i++;
    }
    return lrc;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("Usage: node scripts/download-lyrics.mjs <suno-url-or-song-id>");
        process.exit(1);
    }

    const input = args[0];
    const urlMatch = input.match(/song\/([a-f0-9-]+)/);
    const songId = urlMatch ? urlMatch[1] : input;

    if (!/^[a-f0-9-]+$/.test(songId)) {
        console.error("Invalid Suno URL or Song ID format");
        process.exit(1);
    }

    console.log(`🎵 Querying local server for aligned lyrics of Song ID: ${songId}`);

    try {
        const response = await axios.get(`http://localhost:3005/api/get_aligned_lyrics?song_id=${songId}`);
        const alignedWords = response.data;

        if (!Array.isArray(alignedWords) || alignedWords.length === 0) {
            console.error("❌ No aligned words found for this track. Lyrics might not be aligned yet.");
            process.exit(1);
        }

        console.log(`🔄 Converting ${alignedWords.length} words to SRT and LRC formats...`);
        const srtContent = convertToSrt(alignedWords);
        const lrcContent = convertToLrc(alignedWords);

        // Target folders
        const gdriveDir = "G:/My Drive";
        const desktopDir = "C:/Users/mg26/Desktop";

        const srtName = `${songId}-lyrics.srt`;
        const lrcName = `${songId}-lyrics.lrc`;

        for (const dir of [gdriveDir, desktopDir]) {
            fs.writeFileSync(path.join(dir, srtName), srtContent, 'utf8');
            fs.writeFileSync(path.join(dir, lrcName), lrcContent, 'utf8');
        }

        console.log(`\n✅ Successfully downloaded and saved!`);
        console.log(`📂 G:\\My Drive\\${srtName}`);
        console.log(`📂 G:\\My Drive\\${lrcName}`);
        console.log(`📂 Desktop\\${srtName}`);
        console.log(`📂 Desktop\\${lrcName}`);

    } catch (error) {
        console.error("❌ Error downloading lyrics:", error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

main();
