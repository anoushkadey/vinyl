# vinyl

A record-crate lyric player. Pick a vinyl from an endless crate and the song
plays over its poster, with the lyrics pasted on in stop-motion paper
cut-outs, timed to the track.

- **Laptop**: records flow top → bottom in a tilted 3D column. Hover to pull
  one out, click to play.
- **Phone**: records flow left → right. Swipe the crate, tap to play.
- **Player**: the poster fills the screen. A polished vinyl (cover as the
  label) spins at the bottom left. Its light reflection stays still while the
  record turns. Below it are transparent black controls: previous song,
  −10s, play/pause, +10s, next song. Pausing freezes the music and the whole
  collage.
  Keys: `space` play/pause, `←` / `→` skip 10s, `esc` back to the crate.

| Song | Lyric style |
| --- | --- |
| Hello? – Clairo | pink paper word boxes from the poster + black-on-pink ransom letters |
| the perfect pair – beabadoobee | patterned alphabet squares + illustrated drop caps |
| Francis Forever – Mitski | small white word labels, like the ripple poster |
| Fade Into You – Mazzy Star | gothic purple-and-black: purple tiles, white letters in mixed fonts, black scraps, glitter spiral |
| Linger – The Cranberries | torn white paper in brown serif, like the poster |

Letters that exist on the alphabet sheets are cropped straight from them
(`src/data/sprites.json`). Missing letters are built in code in the matching style.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static build in dist/ (relative paths, works on GitHub Pages)
```

## Editing lyrics

Lyrics and timestamps live in `src/data/songs.js` (`[mm:ss] line`). A line
stays up until the next one starts, for at most 10 seconds.
