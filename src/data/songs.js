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
    audio: asset('audio/hello.mp3'),
    poster: asset('posters/hello.jpg'),
    cover: asset('covers/hello.jpg'),
    posterPos: 'center 32%',
    accent: '#ee5f93',
    lyrics: parse(`
[00:08] Hello?
[00:28] Are you into me, like I'm into you?
[00:32] Do you wanna do the things I wanna do with you?
[00:37] You're so close, and yet so far
[00:42] I wonder how you look when you're in the dark
[00:48] You're just one click away, click away, click away
[00:55] From something real or fake, real or fake, real or fake
[00:59] You're just one click away, click away, click away
[01:02] From something real or fake, real or fake, real or fake
[01:05] Played you DOOM, man, you play Drake
[01:08] You left crumbs all on my face
[01:11] Taste like RiRi, taste like Bey
[01:14] Bought you Fenty, took his place
[01:17] Rolled your weed and kissed your face
[01:19] Man, wanna smoke you out like all-day
[01:22] Man, wanna do a quickie in the hallway, can
[01:24] You be all down for the boy, no mass
[01:26] Hot jump, skip rope, twenty-three years old
[01:29] Made a hundred grand and went broke, I'm an asshole
[01:31] Clairo, will you be my real or my fake though?
[01:33] Pesos, cashing out checks when I say so
[01:36] Frame my life and take my soul
[01:39] Make me crazy, make me old
[01:42] Save me roses, text my phone
[01:45] Fake like rappers, fake like jokes
[01:47] I know
[01:48] You're just one click away, click away, click away
[01:51] From something real or fake, real or fake, real or fake
[01:58] You're just one click away, click away, click away
[02:02] From something real or fake, real or fake, real or fake
`),
  },
  {
    id: 'perfect-pair',
    title: 'the perfect pair',
    artist: 'beabadoobee',
    theme: 'pair',
    audio: asset('audio/perfect-pair.mp3'),
    poster: asset('posters/perfect-pair.jpg'),
    cover: asset('covers/perfect-pair.jpg'),
    posterPos: 'center 30%',
    accent: '#ec4f8f',
    lyrics: parse(`
[00:07] You ought to know that I think we're one and the same
[00:12] I don't think we could help it, no, I don't think we could help it
[00:19] We don't talk much, guess 'cause nothing has changed
[00:26] And I'm not sure I like it, and I'm so tired of fighting
[00:33] If I told you, you'd know how to go and break my heart in two
[00:41] 'Cause I would anyways, we'd end up like always
[00:47] You know me, you better show me that you could say it to my face
[00:53] 'Cause you know we're the same, there's worse things I can take
[01:06] I know you hate it when there's nothing to say
[01:12] I'm not quite sure we'd fix it, guess we're so used to it
[01:18] Wish I had known this from the beginning
[01:24] We'd find it hard to work out, why we have all this doubt
[01:33] If I told you, you'd know how to go and break my heart in two
[01:40] 'Cause I would anyways, we'd end up like always
[01:47] You know me, you better show me that you could say it to my face
[01:52] 'Cause you know we're the same, there's worse things I can take
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
    cover: asset('covers/linger.jpg'),
    posterPos: 'center 6%',
    accent: '#5d7a3a',
    lyrics: parse(`
[00:49] If you, if you could return
[00:53] Don't let it burn, don't let it fade
[00:58] I'm sure I'm not being rude
[01:01] But it's just your attitude
[01:04] It's tearing me apart
[01:06] It's ruining everything
[01:10] And I swore, I swore I would be true
[01:14] And honey, so did you
[01:17] So why were you holding her hand?
[01:20] Is that the way we stand?
[01:23] Were you lying all the time?
[01:26] Was it just a game to you?
[01:28] But I'm in so deep
[01:30] You know I'm such a fool for you
[01:37] You've got me wrapped around your finger
[01:40] Do you have to let it linger?
[01:43] Do you have to, do you have to, do you have to let it linger?
[01:47] Oh, I thought the world of you
[01:51] I thought nothing could go wrong
[01:54] But I was wrong, I was wrong
[02:10] If you, if you could get by
[02:14] Trying not to lie
[02:18] Things wouldn't be so confused
[02:21] And I wouldn't feel so used
[02:25] But you always really knew
[02:27] I just want to be with you
[02:30] And I'm in so deep
[02:33] You know I'm such a fool for you
[02:38] You've got me wrapped around your finger
[02:40] Do you have to let it linger?
[02:43] Do you have to, do you have to, do you have to let it linger?
[03:14] And I'm in so deep
[03:16] You know I'm such a fool for you
[03:20] You've got me wrapped around your finger
[03:23] Do you have to let it linger?
[03:26] Do you have to, do you have to, do you have to let it linger?
`),
  },
]

// Each line stays up until the next one starts, but never longer than this,
// so instrumental breaks fall back to just the poster + spinning record.
const MAX_HOLD = 10

songs.forEach((s) => {
  s.lyrics.forEach((l, i) => {
    const next = s.lyrics[i + 1]
    if (l.end == null) l.end = Math.min(next ? next.t : Infinity, l.t + MAX_HOLD)
    if (next && l.end > next.t) l.end = next.t
  })
})
