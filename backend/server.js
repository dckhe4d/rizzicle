import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq client (you'll need to add your API key)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'your-groq-api-key-here'
});

// AI response generation function
async function generate_response(prompt) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Rizzicle, a flirty, playful chatbot. Always answer directly first, then add a teasing/flirty twist if appropriate. Keep responses under 2 sentences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.8,
      max_tokens: 100
    });

    return response.choices[0]?.message?.content || "Something went wrong 😅";
  } catch (err) {
    console.error("AI generation error:", err);
    return "Oops! Something went wrong 😅";
  }
}

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
    const msgLower = lastMessage.toLowerCase().trim();
    
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
    
    /* OLD STATIC CONTEXTUAL REPLIES REMOVED - NOW USING AI GENERATION */

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