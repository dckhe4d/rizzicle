import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq client (you'll need to add your API key)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Generate replies endpoint
app.post('/api/generate-replies', async (req, res) => {
  try {
    const { chatText, mood, tones } = req.body;

    if (!chatText) {
      return res.status(400).json({ error: 'Chat text is required' });
    }

    // Get the last message from chat
    const lastMessage = chatText.split('\n').filter(line => line.trim()).pop() || '';
    const msgLower = lastMessage.toLowerCase().strip();
    
    // List of casual greetings
    const greetings = ["how u doin", "how are you", "what's up", "sup", "hey", "hi", "hello", "yo", "wassup"];
    
    // Check if message is a casual greeting
    const isGreeting = greetings.some(greeting => msgLower.includes(greeting) || msgLower === greeting);
    
    if (isGreeting) {
      // Handle greetings naturally - always respond appropriately first
      const greetingReplies = {
        flirty: [
          "I'm good! How about you? 😏",
          "Better now that you texted me 😉",
          "I'm great! You're looking good today 👀",
          "Good, just thinking about you actually 😈",
          "I'm doing well, thanks for asking cutie 💕"
        ],
        teasing: [
          "I'm good! You miss me already? 😜",
          "Better than you probably 😏",
          "I'm great! Someone's being polite today 🙄",
          "Good, thanks for finally asking 😂",
          "I'm doing amazing, obviously 💅"
        ],
        sweet: [
          "I'm doing well, thank you for asking! How are you? 🥺",
          "I'm good! Hope you're having a great day ☀️",
          "I'm doing great! Thanks for checking in 💕",
          "I'm well, how about you sweetie? ✨",
          "I'm good! You're so thoughtful for asking 🌸"
        ],
        direct: [
          "I'm good, how about you?",
          "I'm doing well, thanks. You?",
          "Good, what's up with you?",
          "I'm fine, how are things?",
          "I'm alright, how's your day?"
        ],
        witty: [
          "Living the dream! How about you? ⚡",
          "I'm fantastic, thanks for the status check 🧠",
          "I'm doing great! Plot twist: how are YOU? 🎭",
          "I'm good! Thanks for the wellness survey 💭",
          "I'm excellent! Your turn to share 🎯"
        ],
        savage: [
          "I'm good, why do you care? 🔥",
          "Better than expected, thanks 💥",
          "I'm doing fine, not that you asked before 🌶️",
          "I'm great, obviously 👑",
          "I'm good, what's it to you? 😈"
        ]
      };
      
      const replies = tones.map(tone => {
        const toneReplies = greetingReplies[tone] || greetingReplies.direct;
        const randomReply = toneReplies[Math.floor(Math.random() * toneReplies.length)];
        return {
          tone: tone,
          reply: randomReply,
          explanation: `Natural greeting response with ${tone} energy`,
          context: 'greeting'
        };
      });
      
      return res.json({ replies });
    }
    
    // For non-greetings, use contextual replies
    const lowerMessage = lastMessage.toLowerCase();
    const contextualReplies = {
      // Questions about activities
      activities: {
        triggers: ['what are you doing', 'what you doing', 'wyd', 'whatchu doing', 'up to', 'plans'],
        flirty: [
          "Just thinking about our conversation actually 😏",
          "Nothing as interesting as talking to you 😉",
          "Was hoping you'd text me, and here you are ✨",
          "Just wondering when we're hanging out 👀"
        ],
        teasing: [
          "Wouldn't you like to know 😜",
          "Something way cooler than whatever you're doing 😏",
          "Plotting world domination, the usual 😈",
          "Missing your texts, obviously 🙄"
        ],
        direct: [
          "Just chilling at home, you?",
          "Working on some stuff, what about you?",
          "Not much, just relaxing",
          "Same old, same old"
        ]
      },
      
      // Food related
      food: {
        triggers: ['hungry', 'food', 'eat', 'dinner', 'lunch', 'breakfast', 'pizza', 'coffee'],
        flirty: [
          "I know a great place we should try together 😏",
          "I make amazing [food], want me to cook for you? 😉",
          "Food tastes better with good company 👀",
          "I'm hungry too... for your attention 😈"
        ],
        teasing: [
          "Let me guess, you can't cook? 😜",
          "Someone's always hungry, aren't they? 😏",
          "I bet you eat cereal for dinner 🙄",
          "Your stomach has perfect timing 😂"
        ],
        sweet: [
          "Aww, you should eat something good 🥺",
          "I wish I could bring you food right now 💕",
          "Make sure you're taking care of yourself ☀️",
          "Food always makes everything better 🌸"
        ]
      },
      
      // Feelings/emotions
      feelings: {
        triggers: ['tired', 'bored', 'sad', 'happy', 'excited', 'stressed', 'annoyed', 'mad'],
        flirty: [
          "I know something that might cheer you up 😏",
          "Come here, you need a hug 🫂",
          "I could make your day better 😉",
          "You're cute even when you're [feeling] 👀"
        ],
        sweet: [
          "Aww, I'm sorry you're feeling that way 🥺",
          "You deserve all the good things 💕",
          "I'm here if you want to talk about it ☀️",
          "Sending you good vibes ✨"
        ],
        teasing: [
          "Drama queen much? 😜",
          "You're so dramatic, I love it 😏",
          "Someone needs attention today 😈",
          "Let me guess, someone's being moody 🙄"
        ]
      },
      
      // Time related
      time: {
        triggers: ['morning', 'night', 'late', 'early', 'sleep', 'wake up', 'bed'],
        flirty: [
          "Good morning beautiful 😏",
          "Sweet dreams, think of me 😉",
          "Wish I was there to tuck you in 👀",
          "You're up late... thinking about me? 😈"
        ],
        teasing: [
          "Someone's a night owl 😜",
          "Early bird gets the worm, sleepyhead 😏",
          "Let me guess, you just woke up 🙄",
          "Your sleep schedule is a mess 😂"
        ],
        sweet: [
          "Hope you slept well 🥺",
          "Good morning sunshine ☀️",
          "Sweet dreams 💕",
          "Rest well, you deserve it ✨"
        ]
      },
      
      // Work/school
      work: {
        triggers: ['work', 'job', 'school', 'class', 'homework', 'study', 'exam', 'test'],
        flirty: [
          "Work's boring, let's talk about us instead 😏",
          "I'm way more interesting than work 😉",
          "You deserve a break... with me 👀",
          "Forget work, focus on me 😈"
        ],
        teasing: [
          "Someone's a workaholic 😜",
          "Nerd alert 🤓",
          "All work and no play makes you boring 😏",
          "You probably love homework 🙄"
        ],
        sweet: [
          "You work so hard 🥺",
          "I'm proud of you ☀️",
          "You've got this! 💕",
          "Don't stress too much ✨"
        ]
      },
      
      // Weather
      weather: {
        triggers: ['hot', 'cold', 'rain', 'sunny', 'weather', 'snow'],
        flirty: [
          "Perfect weather for cuddling 😏",
          "You're hotter than this weather 😉",
          "I could warm you up 👀",
          "This weather's got nothing on you 😈"
        ],
        teasing: [
          "Someone's always complaining about weather 😜",
          "Let me guess, you forgot your jacket 😏",
          "Weather app exists, you know 🙄",
          "You're so dramatic about everything 😂"
        ],
        direct: [
          "Yeah, the weather's crazy today",
          "I know right, so [weather]",
          "Perfect day to stay inside",
          "Hope it gets better"
        ]
      },
      
      // Generic positive responses
      positive: {
        triggers: ['good', 'great', 'awesome', 'amazing', 'perfect', 'love', 'like'],
        flirty: [
          "You know what else is good? This conversation 😏",
          "Not as good as you though 😉",
          "I love your energy 👀",
          "You're pretty amazing yourself 😈"
        ],
        teasing: [
          "Someone's in a good mood 😜",
          "Easy to please, aren't you? 😏",
          "Your standards must be low 🙄",
          "Okay, calm down there 😂"
        ],
        sweet: [
          "I'm so happy for you 🥺",
          "You deserve all the good things ☀️",
          "Your happiness makes me smile 💕",
          "Love seeing you happy ✨"
        ]
      },
      
      // Generic negative responses  
      negative: {
        triggers: ['bad', 'terrible', 'awful', 'hate', 'sucks', 'worst', 'annoying'],
        flirty: [
          "I could make it better 😏",
          "Come here, let me fix that 😉",
          "You need some cheering up 👀",
          "I know how to turn your day around 😈"
        ],
        sweet: [
          "I'm sorry you're going through that 🥺",
          "You don't deserve that ☀️",
          "Sending you hugs 💕",
          "Tomorrow will be better ✨"
        ],
        teasing: [
          "Someone's being dramatic again 😜",
          "Life's tough, huh? 😏",
          "First world problems 🙄",
          "You'll survive 😂"
        ]
      },
      
      // Default fallbacks for any message
      fallback: {
        flirty: [
          "Interesting... tell me more 😏",
          "You always know what to say 😉",
          "I like where this is going 👀",
          "You're full of surprises 😈"
        ],
        teasing: [
          "That's what you think 😜",
          "Sure, sure 😏",
          "If you say so 🙄",
          "Okay drama queen 😂"
        ],
        sweet: [
          "You're so thoughtful 🥺",
          "That's really nice ☀️",
          "I appreciate you 💕",
          "You're the best ✨"
        ],
        direct: [
          "I hear you",
          "Makes sense",
          "Fair point",
          "I get that"
        ],
        witty: [
          "My brain is still processing that ⚡",
          "Plot twist incoming 🎭",
          "That's actually clever 🧠",
          "You got me there 💭"
        ],
        savage: [
          "Bold move 🌶️",
          "Someone's feeling spicy 🔥",
          "Shots fired 💥",
          "That's ruthless 👑"
        ]
      }
    };
    
    // Find matching context
    function findContext(message) {
      for (const [contextName, contextData] of Object.entries(contextualReplies)) {
        if (contextName === 'fallback') continue;
        if (contextData.triggers.some(trigger => message.includes(trigger))) {
          return contextName;
        }
      }
      return 'fallback';
    }
    
    const context = findContext(lowerMessage);
    const contextData = contextualReplies[context];

    // Generate replies based on selected tones
    const replies = tones.map(tone => {
      // Get replies for this tone from the matched context
      let toneReplies = contextData[tone] || contextualReplies.fallback[tone];
      
      // If no replies for this tone in context, use fallback
      if (!toneReplies) {
        toneReplies = contextualReplies.fallback[tone] || contextualReplies.fallback.flirty;
      }
      
      const randomReply = toneReplies[Math.floor(Math.random() * toneReplies.length)];
      
      // Replace placeholders with actual content
      const finalReply = randomReply
        .replace('[food]', extractFood(lowerMessage) || 'food')
        .replace('[feeling]', extractFeeling(lowerMessage) || 'like this')
        .replace('[weather]', extractWeather(lowerMessage) || 'crazy');
      
      return {
        tone: tone,
        reply: finalReply,
        explanation: `Responds to "${context}" context with ${tone} energy`,
        context: context
      };
    });
    
    // Helper functions to extract specific words
    function extractFood(message) {
      const foods = ['pizza', 'coffee', 'food', 'dinner', 'lunch', 'breakfast'];
      return foods.find(food => message.includes(food));
    }
    
    function extractFeeling(message) {
      const feelings = ['tired', 'bored', 'sad', 'happy', 'excited', 'stressed', 'annoyed', 'mad'];
      return feelings.find(feeling => message.includes(feeling));
    }
    
    function extractWeather(message) {
      const weather = ['hot', 'cold', 'rainy', 'sunny', 'snowy'];
      return weather.find(w => message.includes(w));
    }

    res.json({ replies });

  } catch (error) {
    console.error('Reply generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate replies',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});