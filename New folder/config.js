/**
 * ============================================================================
 * "For You, My Love ❤️" — Central Configuration File
 * ============================================================================
 * You can personalize every single text, name, date, photograph, memory,
 * reason, and letter paragraph right here or via the built-in Editor on the website!
 */

const DEFAULT_CONFIG = {
  // Couple Details
  recipientName: "Priyanka",
  senderName: "Yours Forever",
  birthdayDate: "29 October 2026",
  birthdayHeading: "HAPPY 20TH BIRTHDAY, MY LOVE ❤️",

  // Page 1: The Mysterious Welcome
  page1: {
    badge: "A SPECIAL JOURNEY FOR YOU ✨",
    portrait: "photo1.jpeg",
    greeting: "Hey, beautiful... ❤️",
    line1: "I made something special for you.",
    line2: "Every single page has a secret waiting to be uncovered.",
    question: "Are you ready to discover them with me?",
    buttonText: "LET'S BEGIN ❤️"
  },

  // Page 2: A Little Surprise For You
  page2: {
    badge: "CHAPTER 2 · A SOFT TRUTH 🌸",
    heading: "Before anything else, there's something I want you to know...",
    photo: "photo2.jpeg",
    quote: "You make my world infinitely more beautiful just by being in it.",
    message: "Out of 8 billion people on this planet, meeting you, knowing your heart, and sharing this life with you is my favorite miracle. Every smile of yours brings peace to my soul.",
    hint: "There is so much more waiting for you...",
    buttonText: "CONTINUE TO YOUR SURPRISE →"
  },

  // Page 3: Just You, Being You (Her Personal Photos)
  page3: {
    badge: "CHAPTER 3 · HER RADIANCE 💖",
    heading: "How can someone be this beautiful? ❤️",
    subtitle: "A little gallery dedicated exclusively to your smile, your eyes, and the effortless way you light up every room you walk into.",
    bottomNote: "These pictures are breathtaking, but there's something even more special waiting ahead...",
    buttonText: "DISCOVER THE NEXT PAGE →",
    photos: [
      {
        id: "her-1",
        src: "photo1.jpeg",
        caption: "The smile that completely stole my heart from day one.",
        tag: "Pure Sunshine ☀️"
      },
      {
        id: "her-2",
        src: "photo2.jpeg",
        caption: "Effortlessly gorgeous, radiant, and genuine in every way.",
        tag: "My Queen 👑"
      }
    ]
  },

  // Page 4: Our Little World (Couple Memories / Scrapbook)
  page4: {
    badge: "CHAPTER 4 · OUR SCRAPBOOK 💑",
    heading: "Our Little World ✨",
    quote: "Every picture tells a story. And my favorite stories are always the ones that have you in them.",
    subtitle: "A polaroid scrapbook of the adventures, the quiet laughs, and the unforgettable moments we've shared together.",
    bottomNote: "One more deeply personal surprise is waiting just for you...",
    buttonText: "SHOW ME WHAT'S NEXT ❤️",
    photos: [
      {
        id: "couple-1",
        src: "photo3.jpeg",
        caption: "The evening we laughed so hard our cheeks hurt.",
        date: "October Memories",
        location: "Our Favorite Spot"
      },
      {
        id: "couple-2",
        src: "photo4.jpeg",
        caption: "Hand in hand, building a lifetime of memories together.",
        date: "Special Moments",
        location: "By Your Side"
      },
      {
        id: "couple-3",
        src: "photo5.jpeg",
        caption: "My happiest place in the universe is right next to you.",
        date: "Forever & Always",
        location: "In Your Arms"
      }
    ]
  },

  // Page 5: The Things I Want You to Know (Heartfelt Wishes & Reasons)
  page5: {
    badge: "CHAPTER 5 · FROM MY SOUL 💌",
    heading: "Wishes & Truths for My Beautiful Girl",
    subtitle: "Whenever the world feels loud or overwhelming, I hope you look at these pictures and remember these heartfelt truths:",
    profileAvatar: "photo1.jpeg",
    profileTagline: "To the most gorgeous girl who turned my entire world into poetry...",
    bottomNote: "I've saved something even more personal and intimate for you...",
    buttonText: "OPEN YOUR LETTER 💌",
    reasons: [
      {
        id: "reason-1",
        name: "Priyanka",
        avatar: "photo1.jpeg",
        icon: "✨",
        tag: "My Sunshine ☀️",
        title: "Your Electric Smile",
        text: "Your smile can take the most ordinary, mundane day and make it feel extraordinary in a second."
      },
      {
        id: "reason-2",
        name: "Riya",
        avatar: "photo2.jpeg",
        icon: "🌸",
        tag: "Pure Grace 🌸",
        title: "Your Gentle Kindness",
        text: "You make the quiet, little moments in life feel warm, safe, and deeply meaningful."
      },
      {
        id: "reason-3",
        name: "Sona",
        avatar: "photo3.jpeg",
        icon: "🌟",
        tag: "Endless Radiance ✨",
        title: "Everything You Deserve",
        text: "You deserve all the happiness, peace, success, and beautiful things this world could ever offer."
      },
      {
        id: "reason-4",
        name: "Koto ma",
        avatar: "photo5.jpeg",
        icon: "💖",
        tag: "Forever Cherished 💖",
        title: "Deeply Cherished",
        text: "I hope you never, ever forget how deeply appreciated, loved, and treasured you truly are."
      },
      {
        id: "reason-5",
        name: "Tuktuki",
        avatar: "photo1.jpeg",
        icon: "👑",
        tag: "My Queen 👑",
        title: "Your Inspiring Strength",
        text: "The way you care for people, your passion, and your grace inspire me to be a better person every day."
      },
      {
        id: "reason-6",
        name: "Layli",
        avatar: "photo2.jpeg",
        icon: "💫",
        tag: "My Safest Harbor 💫",
        title: "My Safest Harbor",
        text: "No matter where life takes us, being with you will always feel like coming home."
      }
    ]
  },

  // Page 6: A Letter From My Heart
  page6: {
    badge: "CHAPTER 6 · WRITTEN FOR YOU 🕊️",
    promptTitle: "There's something I've wanted to tell you.",
    promptSubtitle: "Click to break the wax seal and open the letter written just for your eyes...",
    openButtonText: "BREAK SEAL & READ LETTER 💌",
    keepsakePhoto: "photo5.jpeg",
    letter: {
      salutation: "My Dearest Priyanka,",
      paragraphs: [
        "As you celebrate your 20th birthday on this 29th of October, I look at the extraordinary person you are with so much admiration, joy, and endless love. Stepping into your twenties is a milestone as magnificent as you are.",
        "Thank you for being my anchor, my sweetest comfort, and my favorite adventure. Thank you for every late-night conversation, every gentle touch, and every moment where words weren't even needed for us to understand each other.",
        "May this new decade bring you closer to all your dreams. May you always be surrounded by laughter, good health, peace of mind, and the knowledge that someone in this world loves you more than words could ever convey.",
        "No matter where the future leads us, my promise to you is simple: I will celebrate you, respect you, and cherish you through every season of life."
      ],
      closing: "With all my love and devotion,",
      signature: "Forever & Always Yours ❤️"
    },
    bottomNote: "There's just one final page waiting for you...",
    buttonText: "REVEAL YOUR FINAL SURPRISE ❤️"
  },

  // Page 7: The Ultimate Birthday Surprise (Grand Celebration)
  page7: {
    badge: "CHAPTER 7 · THE GRAND CELEBRATION 🎂",
    introLine1: "You've reached the end of this little journey...",
    introLine2: "But the most beautiful part was never the website.",
    introLine3: "It's the person this entire surprise was made for.",
    cakeTitle: "Priyanka's 20th Birthday Cake",
    cakeWishPrompt: "Make your 20th birthday wish for October 29th before blowing the candles, Priyanka... ✨",
    cakeBlownWish: "✨ Happy 20th Birthday, Priyanka! Your wish has flown to the stars on October 29th. May your twenties be filled with endless love, radiant joy, and magic! ❤️🎂✨",
    spotlightPhoto: "photo4.jpeg",
    spotlightCaption: "With you, every single second is a memory I treasure.",
    finalMessage: "Today is your special day, but having you in my life is a gift I appreciate every single second.",
    restartButtonText: "START OUR STORY AGAIN ↻"
  }
};

// Export to window for browser usage
if (typeof window !== "undefined") {
  window.DEFAULT_CONFIG = DEFAULT_CONFIG;
}
