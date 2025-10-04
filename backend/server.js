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

    // Rizzicle personality rules:
    // Rule 1: Always directly answer the user's question first in a natural, conversational way
    // Rule 2: Then, if it fits, add a teasing or flirty twist
    // Rule 3: Never ignore the user's question or replace it with a random unrelated line
    // Keep replies short (1–2 sentences)
    
    const contextualReplies = {
      flirty: [
        "That's actually interesting. You're full of surprises, aren't you? 😏",
        "Fair point. I like how your mind works ✨",
        "You're right about that. Keep talking, I'm listening 👀",
        "Good observation. You're making this conversation way more fun 💫",
        "True that. I'm starting to see why people like talking to you 😌"
      ],
      teasing: [
        "Oh really? Someone's feeling confident today 😜",
        "That's what you think. We'll see about that 😏",
        "Interesting take. You're trouble, aren't you? 😈",
        "Sure, sure. Tell me more, mystery person 🤔",
        "Mhmm. Careful, I might actually start believing you 😉"
      ],
      direct: [
        "Exactly. No point beating around the bush 💯",
        "Facts. I respect the honesty 🎯",
        "True. Let's keep it real here",
        "Right. I appreciate someone who's straightforward",
        "Agreed. No games, just truth"
      ],
      witty: [
        "Good point. My brain is still processing that one ⚡",
        "That's actually clever. You're smarter than you look 😅",
        "Fair enough. Plot twist: you might be right 🎭",
        "True. You're giving my wit a run for its money 🧠",
        "Valid. My comeback is still loading... 💭"
      ],
      sweet: [
        "That's really thoughtful. You're actually pretty sweet 🥺",
        "Aww, that's nice. You just made my day better ☀️",
        "That's so sweet. This is why I like our chats 💕",
        "You're right. You always know what to say 💝",
        "That's lovely. You have such a good heart 🌸"
      ],
      savage: [
        "Bold move. Someone's feeling spicy today 🌶️",
        "Damn. You really went there, didn't you? 🔥",
        "Shots fired. I respect the energy 💥",
        "Savage. You're not playing around today 😤",
        "Ruthless. I like that confidence 👑"
      ]
    };

    // Generate replies based on selected tones
    const replies = tones.map(tone => {
      const toneReplies = contextualReplies[tone] || contextualReplies.flirty;
      const randomReply = toneReplies[Math.floor(Math.random() * toneReplies.length)];
      
      // Add explanations for why each reply works
      const explanations = {
        flirty: "Acknowledges their point first, then adds flirty intrigue",
        teasing: "Responds to what they said, then playfully challenges them",
        direct: "Agrees with their statement, then shows appreciation for honesty",
        witty: "Validates their point, then adds clever banter",
        sweet: "Recognizes their message, then shows genuine appreciation",
        savage: "Acknowledges their boldness, then matches their energy"
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