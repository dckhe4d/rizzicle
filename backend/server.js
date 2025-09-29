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

    // Fallback replies when API is not available
    const fallbackReplies = {
      flirty: [
        "Your energy is everything ✨",
        "Keep talking, I'm listening 👀",
        "You're making this interesting 😏",
        "That's actually really attractive 💫",
        "I like where this is going 😌"
      ],
      teasing: [
        "Oh really? Tell me more 🤔",
        "Someone's being mysterious today 😜",
        "That's what you think 😏",
        "Careful, I might start believing you 😉",
        "You're trouble, aren't you? 😈"
      ],
      direct: [
        "Let's be honest here 💯",
        "Cut to the chase",
        "No games, just truth 🎯",
        "I appreciate the directness",
        "Straight to the point, I like it"
      ],
      witty: [
        "Careful, my brain is loading ⚡",
        "That's... actually smart 🧠",
        "Plot twist incoming 🎭",
        "You're giving me too much credit 😅",
        "My wit is still buffering... 💭"
      ],
      sweet: [
        "You're so thoughtful 🥺",
        "That's actually really sweet 💕",
        "You made my day better ☀️",
        "This is why I like talking to you 🌸",
        "You always know what to say 💝"
      ],
      savage: [
        "That's a bold move 🔥",
        "Someone's feeling spicy today 🌶️",
        "Shots fired 💥",
        "You really went there 😤",
        "No mercy, I respect it 👑"
      ]
    };

    // Generate replies based on selected tones
    const replies = tones.map(tone => {
      const toneReplies = fallbackReplies[tone] || fallbackReplies.flirty;
      const randomReply = toneReplies[Math.floor(Math.random() * toneReplies.length)];
      
      // Add explanations for why each reply works
      const explanations = {
        flirty: "Shows interest while maintaining mystery and confidence",
        teasing: "Creates playful tension and keeps the conversation engaging",
        direct: "Demonstrates confidence and authenticity without games",
        witty: "Uses humor to create connection and show personality",
        sweet: "Shows genuine care and emotional intelligence",
        savage: "Displays confidence and shows you're not easily impressed"
      };

      return {
        tone: tone,
        reply: randomReply,
        explanation: explanations[tone] || "This response matches the conversation's energy"
      };
    });

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