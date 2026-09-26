/**
 * ROMANTIC CINEMATIC EXPERIENCE CONFIGURATION
 * 
 * Customize HER_NAME and romantic milestones below.
 * You can also change the name directly via URL query parameter: ?name=HerName
 */

export const CONFIG = {
  // Her name
  herName: 'Nishi',

  // Subtitle in the hero section
  heroSubtitle: 'In an infinite universe, every star led me to you.',

  // Romantic messages displayed throughout the cinematic journey
  romanticQuotes: [
    {
      id: 1,
      tag: 'A WHISPER IN THE DARK',
      text: 'Some people enter your life softly, and somehow make everything more beautiful than it ever was before.',
      subtext: 'You turned the ordinary into poetry.'
    },
    {
      id: 2,
      tag: 'MY CONSTANT LIGHT',
      text: 'You are my favorite part of every day—the quiet sanctuary where my soul feels completely at peace.',
      subtext: 'No matter how chaotic the world gets.'
    },
    {
      id: 3,
      tag: 'AN ETERNAL PROMISE',
      text: 'And if I had to choose again, in every lifetime, in every parallel universe, across all of time...',
      subtext: 'I would still choose you. Always.'
    }
  ],

  // Constellation Timeline Milestones (Romantic Story without photos)
  milestones: [
    {
      id: 'spark',
      icon: '✨',
      title: 'The First Spark',
      date: 'The Beginning',
      description: 'The moment our orbits crossed. A simple conversation that changed the trajectory of my entire world.',
      quote: '"I didn\'t know I was looking for anything until I found you."'
    },
    {
      id: 'whispers',
      icon: '🌙',
      title: 'Midnight Whispers',
      date: 'The Connection',
      description: 'Hours that melted like minutes under midnight skies. Sharing hopes, fears, and laughter that resonated deep in my chest.',
      quote: '"With you, silence is never awkward and conversation is never enough."'
    },
    {
      id: 'sanctuary',
      icon: '💫',
      title: 'The Safe Harbor',
      date: 'The Realization',
      description: 'Realizing that home is no longer a place on a map, but the warmth in your voice and the shelter of your embrace.',
      quote: '"You became the place where my heart finally rested."'
    },
    {
      id: 'forever',
      icon: '🌌',
      title: 'Infinite Tomorrows',
      date: 'Our Future',
      description: 'Every sunrise ahead belongs to the story we are writing together. An unwritten universe waiting for our footsteps.',
      quote: '"Every tomorrow is a gift because you are in it."'
    }
  ],

  // Reasons why she is irreplaceable
  reasons: [
    {
      id: 'smile',
      title: 'Your Radiant Smile',
      text: 'The way your eyes crinkle with genuine joy can brighten the darkest storm in my mind.',
      glow: '#ff2d75'
    },
    {
      id: 'warmth',
      title: 'Your Gentle Heart',
      text: 'How deeply you care, how softly you love, and the kindness you pour into everything you touch.',
      glow: '#9d4edd'
    },
    {
      id: 'voice',
      title: 'Your Laugh',
      text: 'My favorite melody in existence. It has the power to reset my entire day in half a second.',
      glow: '#ff758f'
    },
    {
      id: 'strength',
      title: 'Your Quiet Strength',
      text: 'You carry yourself with grace and resilience that leaves me in absolute awe of who you are.',
      glow: '#e0aaff'
    },
    {
      id: 'mind',
      title: 'Your Beautiful Soul',
      text: 'The thoughtful, passionate, brilliant way your mind works and the depths of your imagination.',
      glow: '#ffd166'
    },
    {
      id: 'presence',
      title: 'Just Being You',
      text: 'You do not need to do anything extraordinary. Your mere existence makes my world complete.',
      glow: '#ff4d6d'
    }
  ],

  // Final Scene Quote
  finalQuote: 'My favorite story is the one that has you in it.',
  finalSubQuote: 'Thank you for being my dream come true.',

  // Audio Settings
  audio: {
    // If you have a custom romantic mp3 file, paste its URL here (e.g., '/music.mp3')
    // If left empty, our built-in celestial synthesizer generates soothing ambient chords automatically!
    customAudioUrl: '',
    defaultVolume: 0.65
  }
};
