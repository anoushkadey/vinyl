// Song catalogue. Lyrics are "[mm:ss] text" lines; Francis Forever also has
// explicit end times "(m:ss - m:ss) text".

const parse = (raw) =>
  raw
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const range = l.match(/^\((\d+):(\d+)\s*-\s*(\d+):(\d+)\)\s*(.*)$/)
      if (range) {
        const [, m1, s1, m2, s2, text] = range
        return { t: +m1 * 60 + +s1, end: +m2 * 60 + +s2 + 0.9, text }
      }
      const single = l.match(/^\((\d+):(\d+)\)\s*(.*)$/)
      if (single) return { t: +single[1] * 60 + +single[2], text: single[3] }
      const m = l.match(/^\[(\d+):(\d+)\]\s*(.*)$/)
      return { t: +m[1] * 60 + +m[2], text: m[3] }
    })

const asset = (p) => `${import.meta.env.BASE_URL}${p}`

export const songs = [
  {
    id: 'hello',
    title: 'Hello?',
    artist: 'Clairo ft. Rejjie Snow',
    theme: 'hello',
    offset: 2, // lyrics were landing ~2s early against this recording
    audio: asset('audio/hello.mp3'),
    poster: asset('posters/hello.jpg'),
    cover: asset('covers/hello.jpg'),
    posterPos: 'center 32%',
    accent: '#ee5f93',
    lyrics: parse(`
(0:08) Hello?
(0:28 - 0:32) Are you into me, like I'm into you?
(0:32 - 0:37) Do you wanna do the things I wanna do with you?
(0:37 - 0:42) You're so close, and yet so far
(0:42 - 0:48) I wonder how you look when you're in the dark
(0:48 - 0:52) You're just one click away, click away, click away
(0:52 - 0:56) From something real or fake, real or fake, real or fake
(0:56 - 1:01) You're just one click away, click away, click away
(1:01 - 1:05) From something real or fake, real or fake, real or fake
(1:05 - 1:08) Played you DOOM, man, you play Drake
(1:08 - 1:11) You left crumbs all on my face
(1:11 - 1:14) Taste like RiRi, taste like Bey
(1:14 - 1:16) Bought you Fenty, took his place
(1:16 - 1:19) Rolled your weed and kissed your face
(1:19 - 1:21) Man, wanna smoke you out like all-day
(1:21 - 1:24) Man, wanna do a quickie in the hallway, can
(1:24 - 1:26) You be all down for the boy, no mass
(1:26 - 1:29) Hot jump, skip rope, twenty-three years old
(1:29 - 1:31) Made a hundred grand and went broke, I'm an asshole
(1:31 - 1:33) Clairo, will you be my real or my fake though?
(1:33 - 1:36) Pesos, cashing out checks when I say so
(1:36 - 1:38) Frame my life and take my soul
(1:38 - 1:40) Make me crazy, make me old
(1:40 - 1:42) Save me roses, text my phone
(1:42 - 1:44) Fake like rappers, fake like jokes
(1:44 - 1:45) I know
(1:47 - 1:51) You're just one click away, click away, click away
(1:51 - 1:55) From something real or fake, real or fake, real or fake
(1:55 - 2:00) You're just one click away, click away, click away
(2:00 - 2:05) From something real or fake, real or fake, real or fake
`),
  },
  {
    id: 'perfect-pair',
    title: 'the perfect pair',
    artist: 'beabadoobee',
    theme: 'pair',
    audio: asset('audio/perfect-pair.mp3'),
    poster: asset('posters/perfect-pair.jpg'),
    posterDesk: asset('posters/perfect-pair-wide.jpg'),
    cover: asset('covers/perfect-pair.jpg'),
    posterPos: 'center 12%',
    accent: '#ec4f8f',
    lyrics: parse(`
(0:07 - 0:18) You ought to know that I think we're one and the same, I don't think we could help it, no, I don't think we could help it
(0:19 - 0:31) We don't talk much, guess 'cause nothing has changed, and I'm not sure I like it, and I'm so tired of fighting
(0:32 - 0:46) If I told you, you'd know how to go and break my heart in two, 'cause I would anyways, we'd end up like always
(0:47 - 0:59) You know me, you better show me that you could say it to my face, 'cause you know we're the same, there's worse things I can take
(1:06 - 1:17) I know you hate it when there's nothing to say, I'm not quite sure we'd fix it, guess we're so used to it
(1:18 - 1:30) Wish I had known this from the beginning, we'd find it hard to work out, why we have all this doubt
(1:31 - 1:45) If I told you, you'd know how to go and break my heart in two, 'cause I would anyways, we'd end up like always
(1:46 - 1:58) You know me, you better show me that you could say it to my face, 'cause you know we're the same, there's worse things I can take
`),
  },
  {
    id: 'francis-forever',
    title: 'Francis Forever',
    artist: 'Mitski',
    theme: 'francis',
    audio: asset('audio/francis-forever.mp3'),
    poster: asset('posters/francis-clean.jpg'),
    // landscape: the ripple artwork mirrored into three ponds; lyrics are
    // laid out in each pond where the poster's own word labels used to be
    posterWide: asset('posters/francis-wide.jpg'),
    cover: asset('covers/francis-forever.jpg'),
    posterPos: 'center 45%',
    accent: '#1f3550',
    lyrics: parse(`
(0:08 - 0:11) I don't know what to do without you
(0:12 - 0:16) I don't know where to put my hands
(0:17 - 0:25) I've been trying to lay my head down, but I'm writing this at 3 a.m.
(0:26 - 0:34) I don't need the world to see that I've been the best I can be, but
(0:35 - 0:44) I don't think I could stand to be where you don't see me
(1:02 - 1:06) On sunny days I go out walking
(1:07 - 1:11) I end up on a tree-lined street
(1:12 - 1:15) I look up at the gaps of sunlight
(1:16 - 1:20) I miss you more than anything
(1:21 - 1:29) I don't need the world to see that I've been the best I can be, but
(1:30 - 1:39) I don't think I could stand to be where you don't see me
(1:40 - 1:44) And autumn comes when you're not yet done
(1:45 - 1:48) With the summer passing by, but
(1:49 - 1:59) I don't think I could stand to be where you don't see me
`),
  },
  {
    id: 'fade-into-you',
    title: 'Fade Into You',
    artist: 'Mazzy Star',
    theme: 'fade',
    audio: asset('audio/fade-into-you.mp3'),
    poster: asset('posters/fade-into-you.jpg'),
    cover: asset('covers/fade-into-you.jpg'),
    posterPos: 'center 42%',
    accent: '#9b5fc0',
    lyrics: parse(`
[00:20] I wanna hold the hand inside you
[00:29] I wanna take the breath that's true
[00:38] I look to you and I see nothing
[00:47] I look to you to see the truth
[00:57] You live your life, you go in shadows
[01:06] You'll come apart and you'll go blind
[01:14] Some kind of light into your darkness
[01:24] Colors your eyes with what's not there
[01:33] Fade into you
[01:42] Strange you never knew
[01:51] Fade into you
[02:00] I think it's strange you never knew
[02:46] A stranger's light comes on slowly
[02:55] A stranger's heart without a home
[03:05] You put your hands into your head
[03:14] A million smiles cover your heart
[03:23] Fade into you
[03:32] Strange you never knew
[03:41] Fade into you
[03:51] I think it's strange you never knew
[04:00] Fade into you
[04:09] Strange you never knew
[04:18] Fade into you
[04:27] I think it's strange you never knew
[04:36] I think it's strange you never knew
`),
  },
  {
    id: 'linger',
    title: 'Linger',
    artist: 'The Cranberries',
    theme: 'linger',
    audio: asset('audio/linger.mp3'),
    poster: asset('posters/linger.jpg'),
    posterDesk: asset('posters/linger-desk.jpg'),
    // the cover has a black background, so on laptop it is shown at full
    // height (not stretched to the width) to keep it sharp
    deskSize: 'auto 100%',
    cover: asset('covers/linger.jpg'),
    posterPos: 'center',
    accent: '#5d7a3a',
    lyrics: parse(`
(0:49 - 0:59) If you, if you could return, don't let it burn, don't let it fade
(0:59 - 1:04) I'm sure I'm not being rude, but it's just your attitude
(1:04 - 1:10) It's tearing me apart, it's ruining everything
(1:11 - 1:17) And I swore, I swore I would be true, and honey, so did you
(1:18 - 1:22) So why were you holding her hand? Is that the way we stand?
(1:23 - 1:28) Were you lying all the time? Was it just a game to you?
(1:29 - 1:38) But I'm in so deep, you know I'm such a fool for you
(1:38 - 1:47) You've got me wrapped around your finger, do you have to let it linger?
(1:47 - 1:55) Do you have to, do you have to, do you have to let it linger?
(1:55 - 2:00) Oh, I thought the world of you, I thought nothing could go wrong
(2:00 - 2:05) But I was wrong, I was wrong
(2:05 - 2:13) If you, if you could get by, trying not to lie
(2:13 - 2:25) Things wouldn't be so confused, and I wouldn't feel so used
(2:25 - 2:29) But you always really knew, I just want to be with you
(2:30 - 2:38) And I'm in so deep, you know I'm such a fool for you
(2:39 - 2:47) You've got me wrapped around your finger, do you have to let it linger?
(2:47 - 3:00) Do you have to, do you have to, do you have to let it linger?
(3:14 - 3:24) And I'm in so deep, you know I'm such a fool for you
(3:25 - 3:33) You've got me wrapped around your finger, do you have to let it linger?
(3:33 - 3:45) Do you have to, do you have to, do you have to let it linger?
(3:45 - 3:55) You know I'm such a fool for you, you've got me wrapped around your finger
(3:55 - 4:03) Do you have to let it linger? Do you have to, do you have to, do you have to let it linger?
`),
  },
]

// Each line stays up until the next one starts, but never longer than this,
// so instrumental breaks fall back to just the poster + spinning record.
const MAX_HOLD = 10

songs.forEach((s) => {
  if (s.offset) s.lyrics.forEach((l) => {
    l.t += s.offset
    if (l.end != null) l.end += s.offset
  })
  s.lyrics.forEach((l, i) => {
    const next = s.lyrics[i + 1]
    if (l.end == null) l.end = Math.min(next ? next.t : Infinity, l.t + MAX_HOLD)
    if (next && l.end > next.t) l.end = next.t
  })
})
