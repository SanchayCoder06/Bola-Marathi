export const user = {
  name: "Aarav Sharma",
  handle: "@aarav_marathi",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Aarav",
  level: 4,
  xp: 320,
  streak: 7,
  gems: 45,
  hearts: 5,
};

export const dailyGoal = {
  current: 35,
  total: 50,
};

export const continueLearning = {
  title: "Mumbai Local",
  chapter: "Chapter 4",
  progress: 0.65,
  minutesLeft: 8,
};

export const quickActions = [
  { id: "practice", label: "Conversation", icon: "MessagesSquare", tone: "primary", to: "/conversation" },
  { id: "grammar", label: "Grammar", icon: "BookA", tone: "info", to: "/grammar" },
  { id: "translator", label: "Translator", icon: "Sparkles", tone: "accent", to: "/translator" },
  { id: "streak", label: "7 Day Streak", icon: "Flame", tone: "secondary", to: "/daily-challenge" },
];

export const cities = [
  { id: "mumbai", name: "Mumbai", tag: "Konkan", subtitle: "Financial Capital", phrases: 45, img: "/assets/illustrations/cities/mumbai.png" },
  { id: "pune", name: "Pune", tag: "Desh", subtitle: "Cultural Heartland", phrases: 38, img: "/assets/illustrations/cities/pune.png" },
  { id: "nashik", name: "Nashik", tag: "North", subtitle: "Wine & Pilgrimage", phrases: 30, img: "/assets/illustrations/cities/nashik.png" },
  { id: "nagpur", name: "Nagpur", tag: "Vidarbha", subtitle: "Orange Capital", phrases: 28, img: "/assets/illustrations/cities/nagpur.png" },
];

export const missions = [
  { id: "m1", level: 1, title: "Greetings at Dadar", subtitle: "Learn Namaskar & basics", xp: 50, status: "done" },
  { id: "m2", level: 2, title: "Chai at Station", subtitle: "Ordering a cutting chai", xp: 60, status: "done" },
  { id: "m3", level: 3, title: "Local Train Ticket", subtitle: "Platform 3 conversation", xp: 75, status: "current" },
  { id: "m4", level: 4, title: "Asking Directions", subtitle: "Right vs left in Marathi", xp: 80, status: "locked" },
  { id: "m5", level: 5, title: "Street Food Bargaining", subtitle: "How much is this?", xp: 90, status: "locked" },
  { id: "m6", level: 6, title: "Boss Battle: Vada Pav Stall", subtitle: "Full conversation test", xp: 150, status: "locked", boss: true },
];

export const recentLessons = [
  { id: "l1", title: "Daily Greetings", subtitle: "10 essential phrases", progress: 1.0, minutes: 5 },
  { id: "l2", title: "Numbers 1-20", subtitle: "Counting rupees & time", progress: 0.4, minutes: 8 },
  { id: "l3", title: "Food & Water", subtitle: "Ordering at a hotel", progress: 0.0, minutes: 6 },
];

export const achievements = [
  { id: "first_lesson", title: "First Lesson", desc: "Complete your first Marathi lesson", unlocked: true, icon: "Sparkles", rarity: "common" },
  { id: "first_conversation", title: "First Conversation", desc: "Finish your first AI conversation", unlocked: true, icon: "MessagesSquare", rarity: "common" },
  { id: "first_perfect_pronunciation", title: "Perfect Speaker", desc: "Achieve 90%+ in pronunciation practice", unlocked: false, icon: "Award", rarity: "rare" },
  { id: "streak_7", title: "7 Day Streak", desc: "Maintain a 7-day learning streak", unlocked: true, icon: "Flame", rarity: "rare" },
  { id: "streak_30", title: "30 Day Streak", desc: "Maintain a 30-day learning streak", unlocked: false, icon: "Flame", rarity: "epic", progress: 0.23 },
  { id: "xp_100", title: "100 XP", desc: "Earn your first 100 XP points", unlocked: true, icon: "Gem", rarity: "common" },
  { id: "xp_500", title: "500 XP", desc: "Earn 500 XP points", unlocked: false, icon: "Gem", rarity: "rare", progress: 0.64 },
  { id: "xp_1000", title: "1000 XP", desc: "Earn 1000 XP points", unlocked: false, icon: "Crown", rarity: "legendary", progress: 0.32 },
  { id: "city_mumbai", title: "Complete Mumbai", desc: "Finish all 5 Mumbai locations", unlocked: false, icon: "Landmark", rarity: "rare", progress: 0.4 },
  { id: "city_pune", title: "Complete Pune", desc: "Finish all 5 Pune locations", unlocked: false, icon: "Coffee", rarity: "rare" },
  { id: "city_nashik", title: "Complete Nashik", desc: "Finish all 5 Nashik locations", unlocked: false, icon: "BookOpen", rarity: "epic" },
  { id: "city_nagpur", title: "Complete Nagpur", desc: "Finish all 5 Nagpur locations", unlocked: false, icon: "Crown", rarity: "legendary" },
];

export const leaderboard = [
  { rank: 1, name: "Priya P.", xp: 4820, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Priya" },
  { rank: 2, name: "Rohan D.", xp: 4210, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Rohan" },
  { rank: 3, name: "You", xp: 2840, avatar: user.avatar, isMe: true },
  { rank: 4, name: "Ishaan K.", xp: 2610, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Ishaan" },
  { rank: 5, name: "Neha B.", xp: 2402, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Neha" },
  { rank: 6, name: "Sara M.", xp: 2210, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Sara" },
  { rank: 7, name: "Kabir R.", xp: 2050, avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Kabir" },
];

export const dictionaryCategories = [
  { id: "greet", label: "Greetings", count: 24, icon: "Hand" },
  { id: "food", label: "Food", count: 58, icon: "Utensils" },
  { id: "travel", label: "Travel", count: 42, icon: "Plane" },
  { id: "family", label: "Family", count: 30, icon: "Users" },
  { id: "numbers", label: "Numbers", count: 20, icon: "Hash" },
  { id: "culture", label: "Culture", count: 36, icon: "Landmark" },
];

export const dictionaryWords = [
  { mr: "नमस्कार", en: "Hello / Greetings", ipa: "namaskār", pos: "interjection" },
  { mr: "धन्यवाद", en: "Thank you", ipa: "dhanyavād", pos: "interjection" },
  { mr: "पाणी", en: "Water", ipa: "pāṇī", pos: "noun" },
  { mr: "किती?", en: "How much?", ipa: "kitī", pos: "question" },
  { mr: "मित्र", en: "Friend", ipa: "mitra", pos: "noun" },
  { mr: "छान", en: "Nice / Lovely", ipa: "chān", pos: "adjective" },
];

export const flashcards = [
  { mr: "नमस्कार", ipa: "namaskār", en: "Hello", example: "नमस्कार, तुमचं नाव काय?", exampleEn: "Hello, what is your name?" },
  { mr: "पाणी", ipa: "pāṇī", en: "Water", example: "मला पाणी हवं आहे.", exampleEn: "I would like some water." },
  { mr: "धन्यवाद", ipa: "dhanyavād", en: "Thank you", example: "मदतीबद्दल धन्यवाद.", exampleEn: "Thank you for your help." },
];

export const conversation = [
  { role: "bot", mr: "नमस्कार! तुम्ही कसे आहात?", en: "Hello! How are you?" },
  { role: "user", mr: "मी छान आहे, धन्यवाद.", en: "I am well, thank you." },
  { role: "bot", mr: "तुम्ही कुठून आलात?", en: "Where are you from?" },
  { role: "user", mr: "मी बंगळुरू येथून आलो.", en: "I am from Bengaluru." },
  { role: "bot", mr: "मस्त! मराठी शिकायला आवडतंय का?", en: "Nice! Do you enjoy learning Marathi?" },
];

export const grammarTopics = [
  { id: "g1", title: "Gender of Nouns", level: "A1", desc: "पुल्लिंग · स्त्रीलिंग · नपुंसकलिंग", minutes: 6, progress: 1.0 },
  { id: "g2", title: "Present Tense", level: "A2", desc: "Regular verb conjugation", minutes: 8, progress: 0.6 },
  { id: "g3", title: "Postpositions", level: "A2", desc: "ला, ने, चा, ची, चे", minutes: 10, progress: 0.3 },
  { id: "g4", title: "Past Tense", level: "B1", desc: "Perfect & imperfect forms", minutes: 12, progress: 0.0 },
];

export const notifications = [
  { id: "n1", icon: "Flame", title: "Streak saved!", body: "Your 27-day streak is safe. Keep going!", time: "2m", tone: "secondary" },
  { id: "n2", icon: "Trophy", title: "New achievement", body: "You unlocked 'First Words'.", time: "1h", tone: "accent" },
  { id: "n3", icon: "MessagesSquare", title: "Daily conversation ready", body: "Practice ordering at a vada pav stall.", time: "3h", tone: "primary" },
  { id: "n4", icon: "Users", title: "Rohan passed you", body: "You dropped to rank #4 this week.", time: "1d", tone: "info" },
];
