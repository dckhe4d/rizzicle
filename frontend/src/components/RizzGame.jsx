import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Star, Zap, Crown } from 'lucide-react';

const RizzGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameQuestions, setGameQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const allQuestions = [
    {
      scenario: "She says: 'I'm so bored 😴'",
      mood: "bored",
      options: [
        { text: "Same tbh 😐", rizz: 20, explanation: "Too dry, no effort to engage" },
        { text: "Wanna be bored together? 😏", rizz: 85, explanation: "Playful and inviting without being pushy" },
        { text: "I can fix that 😈", rizz: 70, explanation: "Confident but might come on too strong" },
        { text: "Cool story", rizz: 5, explanation: "Dismissive and rude" }
      ]
    },
    {
      scenario: "She sends: '🔥🔥🔥' on your selfie",
      mood: "flirty",
      options: [
        { text: "Thanks 😊", rizz: 30, explanation: "Polite but missed the flirty energy" },
        { text: "You're not so bad yourself 😏", rizz: 90, explanation: "Perfect balance of confidence and flirtation" },
        { text: "I know right 💪", rizz: 60, explanation: "Confident but a bit cocky" },
        { text: "😘😘😘", rizz: 75, explanation: "Matching energy but could be more creative" }
      ]
    },
    {
      scenario: "She's being dry: 'Ok' 'Yeah' 'Sure'",
      mood: "dry",
      options: [
        { text: "Are you mad at me?", rizz: 25, explanation: "Insecure and puts pressure on her" },
        { text: "I'll let you get back to it ✌️", rizz: 80, explanation: "Respectful exit that might make her chase" },
        { text: "Lol ok", rizz: 40, explanation: "Passive aggressive, not helpful" },
        { text: "*sends funny meme*", rizz: 75, explanation: "Good attempt to shift the energy" }
      ]
    },
    {
      scenario: "She says: 'You're actually funny 😂'",
      mood: "funny",
      options: [
        { text: "Actually? Wow thanks 😒", rizz: 45, explanation: "Sarcastic but might kill the vibe" },
        { text: "I have my moments 😎", rizz: 85, explanation: "Confident and keeps the playful energy" },
        { text: "Wait till you hear my dad jokes", rizz: 70, explanation: "Self-deprecating humor, safe choice" },
        { text: "I'm full of surprises 😏", rizz: 80, explanation: "Mysterious and confident" }
      ]
    },
    {
      scenario: "She posts: 'Ugh men are trash 🙄'",
      mood: "angry",
      options: [
        { text: "Not all men!", rizz: 10, explanation: "Defensive and missing the point" },
        { text: "*quietly takes out the trash*", rizz: 95, explanation: "Clever, supportive, and shows emotional intelligence" },
        { text: "What happened?", rizz: 60, explanation: "Shows care but might seem generic" },
        { text: "True bestie 💅", rizz: 75, explanation: "Supportive but might friend-zone yourself" }
      ]
    },
    {
      scenario: "She says: 'I'm having the worst day ever 😭'",
      mood: "sad",
      options: [
        { text: "That sucks", rizz: 15, explanation: "Too dismissive and shows no empathy" },
        { text: "Want to talk about it? I'm here 🤗", rizz: 85, explanation: "Supportive and caring without being pushy" },
        { text: "Tomorrow will be better!", rizz: 40, explanation: "Generic positivity that dismisses her feelings" },
        { text: "Come here, you need a hug 🫂", rizz: 80, explanation: "Sweet and comforting, shows you care" }
      ]
    },
    {
      scenario: "She sends: 'Just got out of the shower 🚿'",
      mood: "flirty",
      options: [
        { text: "Cool", rizz: 20, explanation: "Completely missed the hint and killed the vibe" },
        { text: "Lucky shower 😏", rizz: 85, explanation: "Flirty and clever without being too explicit" },
        { text: "Send pics 😈", rizz: 30, explanation: "Too direct and might come off as creepy" },
        { text: "Hope you used soap 🧼", rizz: 60, explanation: "Playful but safe, might be too innocent" }
      ]
    },
    {
      scenario: "She says: 'I don't know what to wear tonight 🤔'",
      mood: "confused",
      options: [
        { text: "Anything looks good on you 😍", rizz: 70, explanation: "Sweet compliment but a bit generic" },
        { text: "Nothing works too 😏", rizz: 75, explanation: "Bold and flirty but risky" },
        { text: "Where are you going?", rizz: 40, explanation: "Practical but misses the flirty opportunity" },
        { text: "Whatever makes you feel confident ✨", rizz: 90, explanation: "Supportive and empowering, shows you care about her feelings" }
      ]
    },
    {
      scenario: "She says: 'My ex just texted me 🙄'",
      mood: "annoyed",
      options: [
        { text: "What did he want?", rizz: 50, explanation: "Shows interest but might seem nosy" },
        { text: "Block him", rizz: 60, explanation: "Protective but might seem controlling" },
        { text: "His loss, my gain 😏", rizz: 85, explanation: "Confident and shows you're not threatened" },
        { text: "Want me to text him back? 😈", rizz: 80, explanation: "Playful and protective, shows confidence" }
      ]
    },
    {
      scenario: "She says: 'I'm so tired of dating apps 😤'",
      mood: "frustrated",
      options: [
        { text: "Same, they're the worst", rizz: 45, explanation: "Agreeable but doesn't add value" },
        { text: "Good thing you found me then 😎", rizz: 85, explanation: "Confident and implies you're different" },
        { text: "Maybe try meeting people in real life?", rizz: 30, explanation: "Practical advice but kills the moment" },
        { text: "Delete them all, I'm right here 😏", rizz: 90, explanation: "Bold, confident, and direct about your interest" }
      ]
    },
    {
      scenario: "She sends: 'Can't sleep 😴'",
      mood: "restless",
      options: [
        { text: "Count sheep", rizz: 25, explanation: "Generic advice that shows no creativity" },
        { text: "Want me to sing you a lullaby? 🎵", rizz: 80, explanation: "Sweet and playful, shows care" },
        { text: "Same, wanna stay up together? 😏", rizz: 85, explanation: "Creates opportunity for late night conversation" },
        { text: "Try some warm milk", rizz: 20, explanation: "Boring practical advice" }
      ]
    },
    {
      scenario: "She says: 'I look terrible today 😞'",
      mood: "insecure",
      options: [
        { text: "No you don't!", rizz: 60, explanation: "Supportive but generic response" },
        { text: "Impossible, you're always beautiful 😍", rizz: 85, explanation: "Sweet compliment that boosts her confidence" },
        { text: "I doubt that", rizz: 70, explanation: "Subtle compliment but could be clearer" },
        { text: "Send a selfie, I'll be the judge 😏", rizz: 75, explanation: "Playful way to get a photo while complimenting" }
      ]
    },
    {
      scenario: "She says: 'I'm craving pizza 🍕'",
      mood: "hungry",
      options: [
        { text: "Order some then", rizz: 30, explanation: "Practical but boring response" },
        { text: "I know a great place, wanna go? 😊", rizz: 90, explanation: "Perfect opportunity to ask her out naturally" },
        { text: "Pizza is life 🙌", rizz: 50, explanation: "Relatable but doesn't move things forward" },
        { text: "I make amazing pizza 😏", rizz: 80, explanation: "Shows skills and hints at cooking for her" }
      ]
    },
    {
      scenario: "She says: 'Work is so stressful 😩'",
      mood: "stressed",
      options: [
        { text: "That sucks", rizz: 25, explanation: "Shows no empathy or support" },
        { text: "You need a massage 😏", rizz: 70, explanation: "Flirty but might be too forward" },
        { text: "Want to vent about it? I'm listening 👂", rizz: 85, explanation: "Supportive and shows you care about her problems" },
        { text: "Time for a drink then! 🍷", rizz: 75, explanation: "Suggests a solution and potential date" }
      ]
    },
    {
      scenario: "She says: 'I love your style 😍'",
      mood: "complimentary",
      options: [
        { text: "Thanks!", rizz: 40, explanation: "Polite but doesn't build on the compliment" },
        { text: "You have great taste 😏", rizz: 85, explanation: "Confident response that compliments her back" },
        { text: "I try my best 😊", rizz: 60, explanation: "Modest but safe response" },
        { text: "Wait till you see my other outfits 😎", rizz: 80, explanation: "Confident and creates intrigue" }
      ]
    },
    {
      scenario: "She says: 'I'm so clumsy, just dropped my phone 🤦‍♀️'",
      mood: "embarrassed",
      options: [
        { text: "Lol that's funny", rizz: 30, explanation: "Laughing at her embarrassment isn't supportive" },
        { text: "It's okay, happens to everyone 😊", rizz: 70, explanation: "Reassuring and kind" },
        { text: "Good thing you're cute when you're clumsy 😏", rizz: 85, explanation: "Turns her embarrassment into a compliment" },
        { text: "Is your phone okay?", rizz: 60, explanation: "Shows concern but misses the emotional moment" }
      ]
    },
    {
      scenario: "She says: 'I'm watching Netflix alone 📺'",
      mood: "lonely",
      options: [
        { text: "What show?", rizz: 45, explanation: "Shows interest but misses the hint" },
        { text: "Want some company? 😏", rizz: 90, explanation: "Perfect response to her hint about being alone" },
        { text: "Netflix is better alone", rizz: 20, explanation: "Completely misses the opportunity" },
        { text: "I'm free if you want to watch together 😊", rizz: 85, explanation: "Sweet offer that shows you want to spend time with her" }
      ]
    },
    {
      scenario: "She says: 'I just got a new haircut ✂️'",
      mood: "excited",
      options: [
        { text: "Cool", rizz: 25, explanation: "Shows no interest or enthusiasm" },
        { text: "I bet you look amazing 😍", rizz: 80, explanation: "Supportive compliment that boosts her confidence" },
        { text: "Send a pic! 📸", rizz: 75, explanation: "Shows interest and gets you a photo" },
        { text: "New hair, new you? I'm here for it ✨", rizz: 85, explanation: "Enthusiastic and supportive of her change" }
      ]
    },
    {
      scenario: "She says: 'I'm terrible at cooking 👩‍🍳'",
      mood: "self-deprecating",
      options: [
        { text: "Order takeout then", rizz: 35, explanation: "Practical but doesn't offer help or support" },
        { text: "I could teach you sometime 😊", rizz: 90, explanation: "Perfect opportunity to offer a cooking date" },
        { text: "Same lol", rizz: 40, explanation: "Relatable but doesn't add value" },
        { text: "Good thing I cook 😏", rizz: 80, explanation: "Shows your skills and hints at cooking for her" }
      ]
    },
    {
      scenario: "She says: 'I'm going to the gym 💪'",
      mood: "motivated",
      options: [
        { text: "Have fun", rizz: 40, explanation: "Polite but doesn't engage with her energy" },
        { text: "Get those gains! 🔥", rizz: 70, explanation: "Supportive and matches her energy" },
        { text: "Need a workout partner? 😏", rizz: 85, explanation: "Great opportunity to suggest working out together" },
        { text: "Don't forget to stretch 😊", rizz: 60, explanation: "Shows care but might sound like a parent" }
      ]
    },
    {
      scenario: "She says: 'It's raining and I'm stuck inside 🌧️'",
      mood: "bored",
      options: [
        { text: "That sucks", rizz: 25, explanation: "Boring and doesn't help the situation" },
        { text: "Perfect weather for cuddling 😏", rizz: 85, explanation: "Flirty and creates romantic imagery" },
        { text: "Time for a movie marathon! 🍿", rizz: 75, explanation: "Suggests a fun activity" },
        { text: "I love rainy days", rizz: 50, explanation: "Positive but doesn't engage with her situation" }
      ]
    },
    {
      scenario: "She says: 'I'm so bad at texting back 😅'",
      mood: "apologetic",
      options: [
        { text: "Yeah I noticed", rizz: 30, explanation: "Passive aggressive and makes her feel worse" },
        { text: "You're worth the wait 😊", rizz: 85, explanation: "Sweet and reassuring, shows patience" },
        { text: "It's fine", rizz: 40, explanation: "Dismissive and doesn't show understanding" },
        { text: "Quality over quantity 😏", rizz: 80, explanation: "Clever way to say her messages are worth it" }
      ]
    },
    {
      scenario: "She says: 'I'm addicted to coffee ☕'",
      mood: "casual",
      options: [
        { text: "Coffee is life", rizz: 45, explanation: "Relatable but generic" },
        { text: "I know the perfect coffee shop 😊", rizz: 85, explanation: "Great opportunity to suggest a coffee date" },
        { text: "That's not healthy", rizz: 20, explanation: "Judgmental and kills the vibe" },
        { text: "I make better coffee than Starbucks 😏", rizz: 80, explanation: "Confident claim that hints at making coffee for her" }
      ]
    },
    {
      scenario: "She says: 'I'm procrastinating so hard right now 😭'",
      mood: "stressed",
      options: [
        { text: "Just do it", rizz: 25, explanation: "Unhelpful advice that shows no empathy" },
        { text: "What are you avoiding? 🤔", rizz: 70, explanation: "Shows interest in her problems" },
        { text: "Want a study buddy? 📚", rizz: 85, explanation: "Offers help and creates opportunity to spend time together" },
        { text: "Procrastination is an art form 😏", rizz: 75, explanation: "Playful way to make her feel better about it" }
      ]
    },
    {
      scenario: "She says: 'I'm obsessed with this new song 🎵'",
      mood: "excited",
      options: [
        { text: "What song?", rizz: 50, explanation: "Shows interest but basic response" },
        { text: "Send it to me! I need new music 😊", rizz: 80, explanation: "Shows you value her taste and want to share interests" },
        { text: "Cool", rizz: 20, explanation: "Dismissive and shows no interest" },
        { text: "Play it when we hang out 😏", rizz: 85, explanation: "Assumes future plans together confidently" }
      ]
    },
    {
      scenario: "She says: 'I'm so indecisive about everything 🤷‍♀️'",
      mood: "frustrated",
      options: [
        { text: "Just pick something", rizz: 30, explanation: "Dismissive and doesn't understand her struggle" },
        { text: "I can help you decide 😊", rizz: 85, explanation: "Supportive and offers to be involved in her life" },
        { text: "Same honestly", rizz: 50, explanation: "Relatable but doesn't add value" },
        { text: "Good thing I'm decisive enough for both of us 😏", rizz: 80, explanation: "Confident and suggests you complement each other" }
      ]
    },
    {
      scenario: "She says: 'I'm having a lazy Sunday 😴'",
      mood: "relaxed",
      options: [
        { text: "Nice", rizz: 30, explanation: "Boring and doesn't engage" },
        { text: "Perfect day for doing nothing together 😏", rizz: 85, explanation: "Romantic and suggests spending lazy time together" },
        { text: "You should be productive", rizz: 15, explanation: "Judgmental and kills her relaxed mood" },
        { text: "Lazy Sundays are the best 😊", rizz: 60, explanation: "Agreeable but doesn't create connection" }
      ]
    },
    {
      scenario: "She says: 'I'm terrible with directions 🗺️'",
      mood: "helpless",
      options: [
        { text: "Use GPS", rizz: 25, explanation: "Practical but shows no personality" },
        { text: "Good thing I'm your personal GPS now 😏", rizz: 90, explanation: "Confident offer to always be there for her" },
        { text: "That's why Uber exists", rizz: 35, explanation: "Practical but dismissive" },
        { text: "I'll pick you up then 😊", rizz: 85, explanation: "Sweet offer that shows you want to take care of her" }
      ]
    },
    {
      scenario: "She says: 'I'm craving ice cream at midnight 🍦'",
      mood: "impulsive",
      options: [
        { text: "That's random", rizz: 30, explanation: "Dismissive and doesn't match her energy" },
        { text: "Midnight ice cream run? I'm in 😏", rizz: 90, explanation: "Spontaneous and shows you're up for adventures with her" },
        { text: "You'll regret it tomorrow", rizz: 15, explanation: "Judgmental and kills the fun mood" },
        { text: "What flavor? 🤔", rizz: 60, explanation: "Shows interest but misses the opportunity for spontaneity" }
      ]
    },
    {
      scenario: "She says: 'I'm so competitive about everything 🏆'",
      mood: "confident",
      options: [
        { text: "That's annoying", rizz: 10, explanation: "Rude and attacks her personality" },
        { text: "I love a challenge 😏", rizz: 85, explanation: "Shows you're not intimidated and find it attractive" },
        { text: "Same here", rizz: 50, explanation: "Relatable but doesn't create interesting dynamic" },
        { text: "Bet I can out-compete you 😈", rizz: 80, explanation: "Playful challenge that creates fun tension" }
      ]
    }
  ];

  // Initialize game with random questions
  useEffect(() => {
    const initializeGame = () => {
      try {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        setGameQuestions(shuffled.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing game:', error);
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(option);
    setScore(score + option.rizz);
    
    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetGame = () => {
    try {
      // Generate new random questions for replay
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      setGameQuestions(shuffled.slice(0, 5));
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  const getFinalRank = () => {
    if (gameQuestions.length === 0) return { rank: "Loading...", emoji: "⏳", color: "text-gray-400" };
    
    const finalScore = score / gameQuestions.length;
    if (finalScore >= 85) return { rank: "Certified Rizzler", emoji: "👑", color: "text-yellow-400" };
    if (finalScore >= 70) return { rank: "Smooth Operator", emoji: "😎", color: "text-blue-400" };
    if (finalScore >= 55) return { rank: "Getting There", emoji: "🤔", color: "text-green-400" };
    if (finalScore >= 40) return { rank: "Needs Work", emoji: "😅", color: "text-orange-400" };
    return { rank: "Bro Dropped the Rizz", emoji: "😭", color: "text-red-400" };
  };

  if (isLoading) {
    return (
      <div className="glassmorphism p-8 rounded-3xl shadow-2xl text-center">
        <div className="animate-spin w-12 h-12 border-4 border-ice-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading Rizz Game...</p>
      </div>
    );
  }

  if (showResult) {
    const finalRank = getFinalRank();
    return (
      <div className="glassmorphism p-8 rounded-3xl shadow-2xl text-center">
        <div className="mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400 animate-bounce" />
          <h2 className="text-3xl font-orbitron font-bold gradient-text mb-4">
            Game Complete! 🎉
          </h2>
        </div>

        <div className="space-y-6">
          <div className="glassmorphism p-6 rounded-2xl">
            <div className="text-6xl mb-4">{finalRank.emoji}</div>
            <h3 className={`text-2xl font-bold ${finalRank.color} mb-2`}>
              {finalRank.rank}
            </h3>
            <div className="text-4xl font-bold text-white mb-2">
              {gameQuestions.length > 0 ? Math.round(score / gameQuestions.length) : 0}/100
            </div>
            <p className="text-gray-300">Average Rizz Score</p>
          </div>

          <div className="glassmorphism p-4 rounded-xl">
            <h4 className="text-lg font-semibold text-white mb-3">Your Performance:</h4>
            <div className="space-y-2">
              {gameQuestions.map((q, index) => {
                const questionScore = Math.round(score / gameQuestions.length);
                return (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Scenario {index + 1}</span>
                    <span className={`text-sm font-semibold ${
                      questionScore >= 80 ? 'text-green-400' : 
                      questionScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {questionScore >= 80 ? '🔥' : questionScore >= 60 ? '👍' : '💔'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="px-8 py-3 bg-gradient-to-r from-ice-blue to-electric-purple text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
          >
            <Gamepad2 className="w-5 h-5 inline mr-2" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameQuestions.length === 0) {
    return (
      <div className="glassmorphism p-8 rounded-3xl shadow-2xl text-center">
        <p className="text-white text-lg">Error loading game questions. Please refresh.</p>
        <button
          onClick={resetGame}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-ice-blue to-electric-purple text-white font-bold rounded-xl hover:scale-105 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = gameQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / gameQuestions.length) * 100;

  return (
    <div className="glassmorphism p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-orbitron font-bold gradient-text mb-4">
          Rizz Game Mode 🎮
        </h2>
        <p className="text-gray-300">Test your reply game with real scenarios</p>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {gameQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-ice-blue to-electric-purple h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Scenario */}
        <div className="glassmorphism p-6 rounded-2xl text-center">
          <div className="text-lg font-semibold text-white mb-4">Scenario:</div>
          <div className="text-2xl text-ice-blue font-medium mb-2">
            {question.scenario}
          </div>
          <div className="text-sm text-gray-400">
            Mood: {question.mood} • Which reply has the best rizz?
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid gap-4 md:grid-cols-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
              className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                selectedAnswer
                  ? selectedAnswer === option
                    ? option.rizz >= 80
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-105'
                      : option.rizz >= 60
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white scale-105'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white scale-105'
                    : 'glassmorphism opacity-50'
                  : 'glassmorphism hover:bg-white/10 hover:scale-105'
              } disabled:cursor-not-allowed`}
            >
              <div className="text-lg text-white font-medium mb-2">
                {option.text}
              </div>
              
              {selectedAnswer === option && (
                <div className="space-y-2 mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Rizz Score:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">{option.rizz}/100</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(option.rizz / 20) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-200">{option.explanation}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Current Score */}
        <div className="text-center glassmorphism p-4 rounded-xl">
          <div className="flex items-center justify-center space-x-4">
            <Zap className="w-6 h-6 text-electric-purple" />
            <span className="text-lg font-semibold text-white">
              Current Score: {gameQuestions.length > 0 ? Math.round(score / (currentQuestion + 1)) : 0}/100
            </span>
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RizzGame;