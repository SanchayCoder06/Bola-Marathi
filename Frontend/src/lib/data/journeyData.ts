/**
 * BOLA Marathi — Structured 60-Module Duolingo Learning Journey Data
 * Teaches Marathi from absolute beginner to conversational fluency.
 * 3 Tiers: Foundation (1–15), Conversational (16–40), Fluency (41–60).
 */

export interface VocabularyItem {
  mr: string;
  en: string;
  hi: string;
  ipa: string;
}

export interface PhraseItem {
  mr: string;
  en: string;
  hi: string;
  ipa: string;
}

export interface ConversationTurn {
  speaker: string;
  textMr: string;
  textEn: string;
  textHi?: string;
}

export interface JourneyModule {
  id: string; // e.g. "mod_1", "mod_2" ... "mod_60"
  moduleNumber: number; // 1 to 60
  stageId: "foundation" | "conversational" | "fluency";
  stageTitle: string; // "Foundation", "Conversational", "Fluency"
  stageHindi: string; // "आधारशिला", "संभाषण", "प्रवाह"
  titleEn: string; // English title
  titleHindi: string; // Hindi subtitle
  descriptionEn: string;
  learningObjective: string;
  xp: number;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  vocabulary: VocabularyItem[];
  phrases: PhraseItem[];
  conversationScenario: ConversationTurn[];
  estimatedMinutes: number;
}

export interface JourneyStage {
  id: "foundation" | "conversational" | "fluency";
  title: string;
  hindiTitle: string;
  description: string;
  startModule: number;
  endModule: number;
  colorTone: string;
  modules: JourneyModule[];
}

// Exact 60-Module Curriculum Definitions
const RAW_MODULES: {
  num: number;
  stage: "foundation" | "conversational" | "fluency";
  stageTitle: string;
  stageHindi: string;
  en: string;
  hi: string;
  desc: string;
  vocab: VocabularyItem[];
  phrases: PhraseItem[];
  estimatedMinutes?: number;
}[] = [
  // ====================================================
  // TIER 1 — FOUNDATION (MODULES 1–15)
  // ====================================================
  {
    num: 1,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Marathi Sounds & Script Basics",
    hi: "मराठी ध्वनी और लिपि",
    desc: "Learn Devanagari vowels, consonants, and basic script pronunciation rules.",
    vocab: [
      { mr: "अ", en: "A (Vowel)", hi: "अ (स्वर)", ipa: "a" },
      { mr: "क", en: "Ka (Consonant)", hi: "क (व्यंजन)", ipa: "ka" }
    ],
    phrases: [
      { mr: "मराठी अक्षरे सोपी आहेत.", en: "Marathi letters are easy.", hi: "मराठी अक्षर आसान हैं।", ipa: "marāṭhī akṣare sopī āhet." }
    ]
  },
  {
    num: 2,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Tricky Sounds (ळ, ण, ऱ)",
    hi: "कठिन ध्वनियाँ (ळ, ण, ऱ)",
    desc: "Master specific Marathi phoneme drills with mouth-position guidance.",
    vocab: [
      { mr: "बाळ", en: "Child / Baby", hi: "बच्चा", ipa: "bāḷ" },
      { mr: "पाणी", en: "Water", hi: "पानी", ipa: "pāṇी" },
      { mr: "रस्ता", en: "Road / Path", hi: "सड़क", ipa: "rastā" }
    ],
    phrases: [
      { mr: "बाळ पाणी पिते.", en: "The baby drinks water.", hi: "बच्चा पानी पीता है।", ipa: "bāḷ pāṇī pite." }
    ]
  },
  {
    num: 3,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Greetings & Politeness",
    hi: "अभिवादन और शिष्टाचार",
    desc: "Learn polite greetings like Namaskar, Kasa/Kashi aahes, and expressions of gratitude.",
    vocab: [
      { mr: "नमस्कार", en: "Hello / Greetings", hi: "नमस्ते", ipa: "namaskār" },
      { mr: "धन्यवाद", en: "Thank you", hi: "धन्यवाद", ipa: "dhanyavād" },
      { mr: "कृपया", en: "Please", hi: "कृपया", ipa: "kr̥payā" },
      { mr: "क्षमस्व", en: "Sorry / Excuse me", hi: "क्षमा करें", ipa: "kṣamasva" }
    ],
    phrases: [
      { mr: "नमस्कार! तुम्ही कसे आहात?", en: "Hello! How are you?", hi: "नमस्ते! आप कैसे हैं?", ipa: "namaskār! tumhī kase āhāt?" }
    ]
  },
  {
    num: 4,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Introducing Yourself",
    hi: "अपना परिचय",
    desc: "Introduce yourself, state your name, origin, and make basic self-introductions.",
    vocab: [
      { mr: "नाव", en: "Name", hi: "नाम", ipa: "nāv" },
      { mr: "मी", en: "I / Me", hi: "मैं", ipa: "mī" },
      { mr: "माझे", en: "My", hi: "मेरा", ipa: "mājhe" },
      { mr: "मित्र", en: "Friend", hi: "दोस्त", ipa: "mitra" }
    ],
    phrases: [
      { mr: "माझं नाव आरव आहे.", en: "My name is Aarav.", hi: "मेरा नाम आरव है।", ipa: "mājhaṁ nāv ārav āhe." }
    ]
  },
  {
    num: 5,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Numbers 1–20",
    hi: "संख्याएँ 1–20",
    desc: "Count from 1 to 20 in Marathi and use numbers in daily settings.",
    vocab: [
      { mr: "एक", en: "One (1)", hi: "एक", ipa: "ek" },
      { mr: "दोन", en: "Two (2)", hi: "दो", ipa: "don" },
      { mr: "तीन", en: "Three (3)", hi: "तीन", ipa: "tīn" },
      { mr: "चार", en: "Four (4)", hi: "चार", ipa: "chār" },
      { mr: "पाच", en: "Five (5)", hi: "पाँच", ipa: "pāch" }
    ],
    phrases: [
      { mr: "मला दोन आंबे हवे आहेत.", en: "I want two mangoes.", hi: "मुझे दो आम चाहिए।", ipa: "malā don āmbe have āhet." }
    ]
  },
  {
    num: 6,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Numbers 20–100 & Money",
    hi: "संख्याएँ 20–100 और धन",
    desc: "Learn higher numbers, prices, bargaining numbers, and rupee terms.",
    vocab: [
      { mr: "वीस", en: "Twenty (20)", hi: "बीस", ipa: "vīs" },
      { mr: "शंभर", en: "Hundred (100)", hi: "सौ", ipa: "shambhar" },
      { mr: "पैसे", en: "Money", hi: "पैसे / धन", ipa: "paise" },
      { mr: "रुपये", en: "Rupees", hi: "रुपये", ipa: "rupaye" }
    ],
    phrases: [
      { mr: "हे किती रुपयांना आहे?", en: "How many rupees is this for?", hi: "यह कितने रुपये का है?", ipa: "he kitī rupayānnā āhe?" }
    ]
  },
  {
    num: 7,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Family Members",
    hi: "परिवार के सदस्य",
    desc: "Words for parents, siblings, and common household relationships.",
    vocab: [
      { mr: "आई", en: "Mother", hi: "माँ", ipa: "āī" },
      { mr: "बाबा", en: "Father", hi: "पिताजी", ipa: "bābā" },
      { mr: "भाऊ", en: "Brother", hi: "भाई", ipa: "bhāū" },
      { mr: "बहीण", en: "Sister", hi: "बहन", ipa: "bahīṇ" }
    ],
    phrases: [
      { mr: "हे माझे बाबा आहेत.", en: "This is my father.", hi: "यह मेरे पिताजी हैं।", ipa: "he mājhe bābā āhet." }
    ]
  },
  {
    num: 8,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Days, Months & Time",
    hi: "दिन, महीने और समय",
    desc: "Telling time and using words like today, tomorrow, and yesterday.",
    vocab: [
      { mr: "आज", en: "Today", hi: "आज", ipa: "āj" },
      { mr: "उद्या", en: "Tomorrow", hi: "कल (आने वाला)", ipa: "udyā" },
      { mr: "काल", en: "Yesterday", hi: "कल (बीता हुआ)", ipa: "kāl" },
      { mr: "वेळ", en: "Time", hi: "समय", ipa: "veḷ" }
    ],
    phrases: [
      { mr: "आज रविवार आहे.", en: "Today is Sunday.", hi: "आज रविवार है।", ipa: "āj ravivār āhe." }
    ]
  },
  {
    num: 9,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Common Objects at Home",
    hi: "घर की सामान्य वस्तुएँ",
    desc: "Build vocabulary for household items, furniture, and rooms.",
    vocab: [
      { mr: "घर", en: "House / Home", hi: "घर", ipa: "ghar" },
      { mr: "खोली", en: "Room", hi: "कमरा", ipa: "kholī" },
      { mr: "खुर्ची", en: "Chair", hi: "कुर्सी", ipa: "khurchī" },
      { mr: "टेबल", en: "Table", hi: "मेज", ipa: "ṭebal" }
    ],
    phrases: [
      { mr: "खुर्ची खोलीत आहे.", en: "The chair is in the room.", hi: "कुर्सी कमरे में है।", ipa: "khurchī kholīt āhe." }
    ]
  },
  {
    num: 10,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Colors & Basic Adjectives",
    hi: "रंग और मूल विशेषण",
    desc: "Learn core colors and adjectives like big/small, good/bad.",
    vocab: [
      { mr: "लाल", en: "Red", hi: "लाल", ipa: "lāl" },
      { mr: "मोठा", en: "Big", hi: "बड़ा", ipa: "moṭhā" },
      { mr: "लहान", en: "Small", hi: "छोटा", ipa: "lahān" },
      { mr: "छान", en: "Nice / Good", hi: "अच्छा", ipa: "chān" }
    ],
    phrases: [
      { mr: "हा आंबा मोठा आणि गोड आहे.", en: "This mango is big and sweet.", hi: "यह आम बड़ा और मीठा है।", ipa: "hā āmbā moṭhā āṇi goḍ āhe." }
    ]
  },
  {
    num: 11,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Pronouns & Simple Sentences",
    hi: "सर्वनाम और सरल वाक्य",
    desc: "Use pronouns (I, you, he, she, we) to construct simple descriptive sentences.",
    vocab: [
      { mr: "आम्ही", en: "We", hi: "हम", ipa: "āmhī" },
      { mr: "ते", en: "They", hi: "वे", ipa: "te" },
      { mr: "तो", en: "He", hi: "वह (पु.)", ipa: "to" },
      { mr: "ती", en: "She / They (fem)", hi: "वह (स्त्री.)", ipa: "tī" }
    ],
    phrases: [
      { mr: "आम्ही मराठी शिकत आहोत.", en: "We are learning Marathi.", hi: "हम मराठी सीख रहे हैं।", ipa: "āmhī marāṭhī shikat āhot." }
    ]
  },
  {
    num: 12,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Yes/No & Basic Questions",
    hi: "हाँ/ना और मूल प्रश्न",
    desc: "Ask simple questions using what, where, when, who, yes, and no.",
    vocab: [
      { mr: "हो", en: "Yes", hi: "हाँ", ipa: "ho" },
      { mr: "नाही", en: "No", hi: "नहीं", ipa: "nāhī" },
      { mr: "काय", en: "What", hi: "क्या", ipa: "kāy" },
      { mr: "कुठे", en: "Where", hi: "कहाँ", ipa: "kuṭhe" }
    ],
    phrases: [
      { mr: "तुमचे घर कुठे आहे?", en: "Where is your house?", hi: "आपका घर कहाँ है?", ipa: "tumche ghar kuṭhe āhe?" }
    ]
  },
  {
    num: 13,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Likes & Dislikes",
    hi: "पसंद और नापसंद",
    desc: "Express likes and dislikes using sentence structures built around 'awadte'.",
    vocab: [
      { mr: "आवादतो", en: "Like (masc)", hi: "पसंद है", ipa: "āvaḍto" },
      { mr: "आवडत नाही", en: "Do not like", hi: "पसंद नहीं है", ipa: "āvaḍat nāhī" },
      { mr: "चहा", en: "Tea", hi: "चाय", ipa: "chahā" },
      { mr: "अभ्यास", en: "Study", hi: "पढ़ाई", ipa: "abhyās" }
    ],
    phrases: [
      { mr: "मला चहा आवडतो.", en: "I like tea.", hi: "मुझे चाय पसंद है।", ipa: "malā chahā āvaḍto." }
    ]
  },
  {
    num: 14,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Body Parts & Health Basics",
    hi: "शरीर के अंग और स्वास्थ्य",
    desc: "Learn vocabulary for main body parts and express basic physical discomfort.",
    vocab: [
      { mr: "डोळे", en: "Eyes", hi: "आँखें", ipa: "doḷe" },
      { mr: "हात", en: "Hands", hi: "हाथ", ipa: "hāt" },
      { mr: "पाय", en: "Feet / Legs", hi: "पैर", ipa: "pāy" },
      { mr: "डोकं", en: "Head", hi: "सिर", ipa: "dokaṁ" }
    ],
    phrases: [
      { mr: "माझं डोकं दुखत आहे.", en: "My head is hurting.", hi: "मेरा सिर दुख रहा है।", ipa: "mājhaṁ dokaṁ dukhat āhe." }
    ]
  },
  {
    num: 15,
    stage: "foundation",
    stageTitle: "Foundation",
    stageHindi: "आधारशिला",
    en: "Foundation Review & Mini-Test",
    hi: "बुनियादी समीक्षा और परीक्षा",
    desc: "Perform a cumulative check of Tier 1 sounds, script, and basic sentence concepts.",
    vocab: [
      { mr: "परीक्षा", en: "Exam / Test", hi: "परीक्षा", ipa: "parīkṣā" },
      { mr: "सराव", en: "Practice", hi: "अभ्यास", ipa: "sarāv" },
      { mr: "गुण", en: "Marks / Score", hi: "अंक", ipa: "guṇ" }
    ],
    phrases: [
      { mr: "मी परीक्षेसाठी तयार आहे.", en: "I am ready for the test.", hi: "मैं परीक्षा के लिए तैयार हूँ।", ipa: "mī parīkṣesāṭhī tayār āhe." }
    ]
  },

  // ====================================================
  // TIER 2 — CONVERSATIONAL (MODULES 16–40)
  // ====================================================
  {
    num: 16,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "At the Market — Vegetables & Fruits",
    hi: "बाजार में — सब्जियाँ और फल",
    desc: "Learn to name and buy fresh produce, asking prices of vegetables and fruits.",
    vocab: [
      { mr: "बाजार", en: "Market", hi: "बाज़ार", ipa: "bājār" },
      { mr: "भाजी", en: "Vegetable", hi: "सब्जी", ipa: "bhājī" },
      { mr: "सफरचंद", en: "Apple", hi: "सेब", ipa: "saparchand" },
      { mr: "कांदा", en: "Onion", hi: "प्याज़", ipa: "kāndā" }
    ],
    phrases: [
      { mr: "ताजी भाजी कुठे मिळेल?", en: "Where can I get fresh vegetables?", hi: "ताज़ी सब्ज़ी कहाँ मिलेगी?", ipa: "tājī bhājī kuṭhe miḷel?" }
    ]
  },
  {
    num: 17,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Bargaining Phrases",
    hi: "मोलभाव के वाक्य",
    desc: "Master local bargaining vocabulary and polite haggling phrases.",
    vocab: [
      { mr: "महाग", en: "Expensive", hi: "महँगा", ipa: "mahāg" },
      { mr: "स्वस्त", en: "Cheap", hi: "सस्ता", ipa: "svasta" },
      { mr: "कमी करा", en: "Reduce", hi: "कम करें", ipa: "kamī karā" }
    ],
    phrases: [
      { mr: "थोडे पैसे कमी करा ना.", en: "Please reduce the price a bit.", hi: "थोड़े पैसे कम कीजिए न।", ipa: "thoḍe paise kamī karā nā." }
    ]
  },
  {
    num: 18,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Auto-Rickshaw & Taxi Conversations",
    hi: "ऑटो और टैक्सी संवाद",
    desc: "Communicate directions, destination names, and ask for fares in transit.",
    vocab: [
      { mr: "रिक्षा", en: "Auto-Rickshaw", hi: "ऑटो", ipa: "rikṣā" },
      { mr: "भाडे", en: "Fare", hi: "किराया", ipa: "bhāḍe" },
      { mr: "जा", en: "Go", hi: "जाओ / चलिए", ipa: "jā" },
      { mr: "थांबा", en: "Stop", hi: "रुकिए", ipa: "thāmbā" }
    ],
    phrases: [
      { mr: "दादरला जाणार का?", en: "Will you go to Dadar?", hi: "दादर चलोगे क्या?", ipa: "dādarlā jāṇār kā?" }
    ]
  },
  {
    num: 19,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Bus & Train Travel",
    hi: "बस और ट्रेन यात्रा",
    desc: "Travel vocabulary for tickets, station details, and platform numbers.",
    vocab: [
      { mr: "तिकीट", en: "Ticket", hi: "टिकट", ipa: "tikīṭ" },
      { mr: "गाडी", en: "Train / Vehicle", hi: "ट्रेन / गाड़ी", ipa: "gāḍī" },
      { mr: "फलाट", en: "Platform", hi: "प्लेटफ़ॉर्म / फलाट", ipa: "phalāṭ" }
    ],
    phrases: [
      { mr: "गाडी कधी सुटेल?", en: "When will the train leave?", hi: "ट्रेन कब छूटेगी?", ipa: "gāḍī kadhī suṭel?" }
    ]
  },
  {
    num: 20,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Asking for Directions",
    hi: "रास्ता पूछना",
    desc: "Learn to direct or ask directions using words like left, right, straight.",
    vocab: [
      { mr: "उजवीकडे", en: "Right side", hi: "दाईं ओर", ipa: "ujvīkaḍe" },
      { mr: "डावीकडे", en: "Left side", hi: "बाईं ओर", ipa: "ḍāvīkaḍe" },
      { mr: "सरळ", en: "Straight", hi: "सीधे", ipa: "saraळ" },
      { mr: "जवळ", en: "Near", hi: "पास", ipa: "javaḷ" }
    ],
    phrases: [
      { mr: "उजवीकडे वळा आणि सरळ जा.", en: "Turn right and go straight.", hi: "दाईं ओर मुड़ें और सीधे जाएँ।", ipa: "ujvīkaḍe vaḷā āṇi saraळ jā." }
    ]
  },
  {
    num: 21,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "At a Restaurant / Tapri",
    hi: "होटल / टपरी पर",
    desc: "Order local meals, request bills, and talk to restaurant servers.",
    vocab: [
      { mr: "हॉटेल", en: "Restaurant / Hotel", hi: "होटल", ipa: "hॉṭel" },
      { mr: "बिल", en: "Bill", hi: "बिल", ipa: "bil" },
      { mr: "जेवण", en: "Meal / Food", hi: "भोजन", ipa: "jevaṇ" }
    ],
    phrases: [
      { mr: "एक गरम चहा द्या.", en: "Give one hot tea.", hi: "एक गर्म चाय देना।", ipa: "ek garam chahā dyā." }
    ]
  },
  {
    num: 22,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Street Food Vocabulary",
    hi: "सड़क के किनारे का खाना",
    desc: "Order street treats like Vada Pav and Misal, specifying spicy preferences.",
    vocab: [
      { mr: "वडापाव", en: "Vada Pav", hi: "वड़ापाव", ipa: "vaḍāpāv" },
      { mr: "भेळ", en: "Bhel", hi: "भेल", ipa: "bheḷ" },
      { mr: "तिखट", en: "Spicy", hi: "तीखा", ipa: "tikhaṭ" }
    ],
    phrases: [
      { mr: "मला एक वडापाव द्या.", en: "Give me one vada pav.", hi: "मुझे एक वड़ापाव दो।", ipa: "malā ek vaḍāpāv dyā." }
    ]
  },
  {
    num: 23,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "At the Vegetable/Grocery Shop",
    hi: "सब्ज़ी/किराना दुकान पर",
    desc: "Grocery shop terms, requesting specific weights and quantities.",
    vocab: [
      { mr: "दुकान", en: "Shop", hi: "दुकान", ipa: "dukān" },
      { mr: "किराणा", en: "Grocery", hi: "किराना", ipa: "kirāṇā" },
      { mr: "साखर", en: "Sugar", hi: "चीनी", ipa: "sākhar" },
      { mr: "तेल", en: "Oil", ipa: "tel" }
    ],
    phrases: [
      { mr: "एक किलो साखर द्या.", en: "Give one kilogram of sugar.", hi: "एक किलो चीनी दीजिए।", ipa: "ek kilo sākhar dyā." }
    ]
  },
  {
    num: 24,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Talking to a Watchman/Security Guard",
    hi: "चौकीदार से बातचीत",
    desc: "Inquire about parking, gates, and deliveries in housing societies.",
    vocab: [
      { mr: "चौकीदार", en: "Watchman", hi: "चौकीदार", ipa: "chaukīdār" },
      { mr: "कुलूप", en: "Lock", hi: "ताला", ipa: "kulūp" },
      { mr: "किल्ली", en: "Key", hi: "चाबी", ipa: "killī" }
    ],
    phrases: [
      { mr: "गाडी कुठे पार्क करू?", en: "Where should I park the car?", hi: "गाड़ी कहाँ पार्क करूँ?", ipa: "gāḍī kuṭhe pārk karū?" }
    ]
  },
  {
    num: 25,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Talking to Domestic Help",
    hi: "घरेलू सहायक से बातचीत",
    desc: "Give simple instructions for washing, sweeping, and home upkeep.",
    vocab: [
      { mr: "काम", en: "Work", hi: "काम", ipa: "kām" },
      { mr: "झाडू", en: "Broom / Sweep", hi: "झाड़ू", ipa: "jhāḍū" },
      { mr: "कचरा", en: "Trash / Garbage", hi: "कचरा", ipa: "kachrā" },
      { mr: "भांडी", en: "Dishes", hi: "बर्तन", ipa: "bhāṇḍī" }
    ],
    phrases: [
      { mr: "आज घर स्वच्छ करा.", en: "Clean the house today.", hi: "आज घर साफ़ कीजिए।", ipa: "āj ghar svaccha karā." }
    ]
  },
  {
    num: 26,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Weather & Small Talk",
    hi: "मौसम और गपशप",
    desc: "Basic chit-chat regarding rain, heat, and seasonal weather.",
    vocab: [
      { mr: "पाऊस", en: "Rain", hi: "बारिश", ipa: "pāūs" },
      { mr: "ऊन", en: "Sun / Sunlight", hi: "धूप / गर्मी", ipa: "ūn" },
      { mr: "थंडी", en: "Cold / Winter", hi: "ठंड", ipa: "thaṇḍī" },
      { mr: "हवामान", en: "Weather", hi: "मौसम", ipa: "havāmān" }
    ],
    phrases: [
      { mr: "आज खूप ऊन आहे.", en: "It is very sunny today.", hi: "आज बहुत धूप है।", ipa: "āj khūp ūn āhe." }
    ]
  },
  {
    num: 27,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "At the Doctor / Pharmacy",
    hi: "डॉक्टर / दवाखाने में",
    desc: "Discuss health, explain symptoms, and buy medical supplies.",
    vocab: [
      { mr: "डॉक्टर", en: "Doctor", hi: "डॉक्टर", ipa: "ḍॉktar" },
      { mr: "औषध", en: "Medicine", hi: "दवा", ipa: "auṣadh" },
      { mr: "ताप", en: "Fever", hi: "बुखार", ipa: "tāp" },
      { mr: "खोकला", en: "Cough", hi: "खांसी", ipa: "khoklā" }
    ],
    phrases: [
      { mr: "मला दोन दिवसांपासून ताप आहे.", en: "I have had a fever for two days.", hi: "मुझे दो दिनों से बुखार है।", ipa: "malā don divsāṁpāsūn tāp āhe." }
    ]
  },
  {
    num: 28,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Making Phone Calls",
    hi: "फ़ोन करना",
    desc: "Polite phone call starters, asking if someone is audible, and taking messages.",
    vocab: [
      { mr: "फोन", en: "Phone", hi: "फ़ोन", ipa: "phon" },
      { mr: "आवाज", en: "Voice / Sound", hi: "आवाज़", ipa: "āvāj" },
      { mr: "संपर्क", en: "Contact", hi: "संपर्क", ipa: "sampark" }
    ],
    phrases: [
      { mr: "माझा आवाज येतोय का?", en: "Can you hear my voice?", hi: "क्या मेरी आवाज़ आ रही है?", ipa: "mājhā āvāj yetoy kā?" }
    ]
  },
  {
    num: 29,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Asking for Help / Emergencies",
    hi: "मदद माँगना / आपातकाल",
    desc: "Urgent expressions for emergencies, asking for police, doctor, or safety.",
    vocab: [
      { mr: "मदद", en: "Help", hi: "मदद", ipa: "madad" },
      { mr: "पोलीस", en: "Police", hi: "पुलिस", ipa: "polīs" },
      { mr: "संकट", en: "Danger / Crisis", hi: "संकट", ipa: "saṅkaṭ" }
    ],
    phrases: [
      { mr: "कृपया मला मदत करा.", en: "Please help me.", hi: "कृपया मेरी मदद कीजिए।", ipa: "kr̥payā malā madad karā." }
    ]
  },
  {
    num: 30,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Shopping for Clothes",
    hi: "कपड़ों की खरीदारी",
    desc: "Identify sizes, request colors, try garments, and inquire on costs.",
    vocab: [
      { mr: "कपडे", en: "Clothes", hi: "कपड़े", ipa: "kapaḍe" },
      { mr: "साईझ", en: "Size", hi: "साइज", ipa: "sāījh" },
      { mr: "ट्रायल", en: "Trial", hi: "ट्रायल", ipa: "ṭrāyal" }
    ],
    phrases: [
      { mr: "ही शर्ट दाखवा.", en: "Show this shirt.", hi: "यह शर्ट दिखाइए।", ipa: "hī śarṭ dākhvā." }
    ]
  },
  {
    num: 31,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "At the Bank / Post Office",
    hi: "बैंक / डाकघर में",
    desc: "Vocabulary for depositing, withdrawing money, and mailing letters.",
    vocab: [
      { mr: "बँक", en: "Bank", hi: "बैंक", ipa: "baṅk" },
      { mr: "खाते", en: "Account", hi: "खाता", ipa: "khāte" },
      { mr: "पत्र", en: "Letter / Mail", hi: "पत्र", ipa: "patra" }
    ],
    phrases: [
      { mr: "मला पैसे काढायचे आहेत.", en: "I want to withdraw money.", hi: "मुझे पैसे निकालने हैं।", ipa: "malā paise kāḍhāyace āhet." }
    ]
  },
  {
    num: 32,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Describing Your Day",
    hi: "दिनचर्या का वर्णन",
    desc: "Describe daily routines, habits, wake-up times, and office routines.",
    vocab: [
      { mr: "उठणे", en: "To get up", hi: "उठना", ipa: "uṭhṇe" },
      { mr: "जेवणे", en: "To eat food", hi: "भोजन करना", ipa: "jevaṇe" },
      { mr: "झोपणे", en: "To sleep", hi: "सोना", ipa: "jhopṇe" }
    ],
    phrases: [
      { mr: "मी सकाळी लवकर उठतो.", en: "I get up early in the morning.", hi: "मैं सुबह जल्दी उठता हूँ।", ipa: "mī sakāḷī lavkar uṭhto." }
    ]
  },
  {
    num: 33,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Making Plans & Invitations",
    hi: "योजनाएँ बनाना और निमंत्रण",
    desc: "Invite friends, make weekend plans, and respond to invites.",
    vocab: [
      { mr: "योजना", en: "Plan", hi: "योजना", ipa: "yojanā" },
      { mr: "आमंत्रण", en: "Invitation", hi: "निमंत्रण", ipa: "āmantraṇ" },
      { mr: "पार्टी", en: "Party", hi: "पार्टी", ipa: "pārṭī" }
    ],
    phrases: [
      { mr: "तुम्ही माझ्या घरी या.", en: "You come to my house.", hi: "आप मेरे घर आइए।", ipa: "tumhī mājhyā gharī yā." }
    ]
  },
  {
    num: 34,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Talking About Work/Job",
    hi: "काम / नौकरी के बारे में",
    desc: "Discuss professions, describe tasks, and speak about salaries or workplaces.",
    vocab: [
      { mr: "नोकरी", en: "Job", hi: "नौकरी", ipa: "nokrī" },
      { mr: "कार्यालय", en: "Office", hi: "कार्यालय", ipa: "kāryālay" },
      { mr: "पगार", en: "Salary", hi: "वेतन / पगार", ipa: "pagār" }
    ],
    phrases: [
      { mr: "तुम्ही काय काम करता?", en: "What work do you do?", hi: "आप क्या काम करते हैं?", ipa: "tumhī kāy kām kartā?" }
    ]
  },
  {
    num: 35,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Talking About Family & Home",
    hi: "परिवार और घर के बारे में",
    desc: "Talk in detail about children, extended relatives, and home setup.",
    vocab: [
      { mr: "नातेवाईक", en: "Relatives", hi: "रिश्तेदार", ipa: "nātevāīk" },
      { mr: "आजोबा", en: "Grandfather", hi: "दादाजी / नानाजी", ipa: "ājobā" },
      { mr: "आजी", en: "Grandmother", hi: "दादीजी / नानीजी", ipa: "ājī" }
    ],
    phrases: [
      { mr: "माझे कुटुंब खूप मोठे आहे.", en: "My family is very big.", hi: "मेरा परिवार बहुत बड़ा है।", ipa: "mājhe kuṭumba khūp moṭhe āhe." }
    ]
  },
  {
    num: 36,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Expressing Emotions",
    hi: "भावनाएँ व्यक्त करना",
    desc: "Express happiness, grief, fear, exhaustion, and anger clearly.",
    vocab: [
      { mr: "आनंद", en: "Joy / Happiness", hi: "खुशी / आनंद", ipa: "ānand" },
      { mr: "दुःख", en: "Sadness / Grief", hi: "दुख", ipa: "duḥkha" },
      { mr: "राग", en: "Anger", hi: "गुस्सा", ipa: "rāg" }
    ],
    phrases: [
      { mr: "मला खूप आनंद झाला आहे.", en: "I am very happy.", hi: "मुझे बहुत खुशी हुई है।", ipa: "malā khūp ānand jhālā āhe." }
    ]
  },
  {
    num: 37,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Apologies & Small Conflicts",
    hi: "माफ़ी और छोटे विवाद",
    desc: "Apologize politely, explain small mistakes, and resolve misunderstandings.",
    vocab: [
      { mr: "चूक", en: "Mistake", hi: "गलती", ipa: "chūk" },
      { mr: "माफी", en: "Apology / Forgiveness", hi: "माफ़ी", ipa: "māphī" },
      { mr: "वाद", en: "Argument / Conflict", hi: "विवाद", ipa: "vād" }
    ],
    phrases: [
      { mr: "मला माफ करा, माझी चूक झाली.", en: "Forgive me, it was my mistake.", hi: "मुझे माफ़ कीजिए, मेरी गलती थी।", ipa: "malā māph karā, mājhī chūk jhālी." }
    ]
  },
  {
    num: 38,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Festivals & Celebrations",
    hi: "त्योहार और उत्सव",
    desc: "Greet friends on Marathi festivals like Ganesh Chaturthi, Diwali, Gudi Padwa.",
    vocab: [
      { mr: "सण", en: "Festival", hi: "त्योहार", ipa: "saṇ" },
      { mr: "दिवाळी", en: "Diwali", hi: "दिवाली", ipa: "divāḷī" },
      { mr: "उत्सव", en: "Celebration / Feast", hi: "उत्सव", ipa: "utsav" }
    ],
    phrases: [
      { mr: "गणेशोत्सवाच्या हार्दिक शुभेच्छा!", en: "Hearty wishes for Ganeshotsav!", hi: "गणेशोत्सव की हार्दिक शुभकामनाएँ!", ipa: "gaṇeśotsavācyā hārdik śubhecchā!" }
    ]
  },
  {
    num: 39,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Common Idiom Intros (Light)",
    hi: "सामान्य मुहावरे (हल्के)",
    desc: "Get introduced to basic everyday Marathi sayings and idioms.",
    vocab: [
      { mr: "म्हण", en: "Saying / Idiom", hi: "कहावत / मुहावरा", ipa: "mhaṇ" },
      { mr: "अर्थ", en: "Meaning", hi: "अर्थ", ipa: "arth" },
      { mr: "शहाणपणा", en: "Wisdom", hi: "बुद्धिमानी", ipa: "śahāṇpaṇā" }
    ],
    phrases: [
      { mr: "अति तिथे माती होते.", en: "Excess of anything leads to ruin.", hi: "अति हर चीज़ की बुरी होती है।", ipa: "ati tithe mātī hote." }
    ]
  },
  {
    num: 40,
    stage: "conversational",
    stageTitle: "Conversational",
    stageHindi: "संभाषण",
    en: "Conversational Review & Mini-Test",
    hi: "संभाषण समीक्षा और परीक्षा",
    desc: "Cumulative speaking test for shopping, travel, emergencies, and routines.",
    vocab: [
      { mr: "चाचणी", en: "Test / Quiz", hi: "जाँच / टेस्ट", ipa: "chāchaṇī" },
      { mr: "उत्तर", en: "Answer", hi: "उत्तर", ipa: "uttar" }
    ],
    phrases: [
      { mr: "सर्व प्रश्न सोपे आहेत.", en: "All questions are easy.", hi: "सभी प्रश्न आसान हैं।", ipa: "sarva praśna sope āhet." }
    ]
  },

  // ====================================================
  // TIER 3 — FLUENCY (MODULES 41–60)
  // ====================================================
  {
    num: 41,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Expressing Opinions",
    hi: "विचार व्यक्त करना",
    desc: "Formulate arguments and state opinions using 'mala watla' and 'mazya mate'.",
    vocab: [
      { mr: "मत", en: "Opinion", hi: "राय / मत", ipa: "mat" },
      { mr: "विचार", en: "Thought / Idea", hi: "विचार", ipa: "vichār" },
      { mr: "खात्री", en: "Certainty / Sure", hi: "यकीन", ipa: "khātrī" }
    ],
    phrases: [
      { mr: "माझ्या मते हे बरोबर आहे.", en: "In my opinion, this is correct.", hi: "मेरी राय में यह सही है।", ipa: "mājhyā mate he barobar āhe." }
    ]
  },
  {
    num: 42,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Agreeing & Disagreeing",
    hi: "सहमति और असहमति",
    desc: "Learn polite ways to support arguments or express polite disagreements.",
    vocab: [
      { mr: "सहमती", en: "Agreement", hi: "सहमति", ipa: "sahamatī" },
      { mr: "असहमत", en: "Disagree", hi: "असहमत", ipa: "asahamat" },
      { mr: "चर्चा", en: "Discussion / Debate", hi: "चर्चा", ipa: "charchā" }
    ],
    phrases: [
      { mr: "मी तुमच्याशी सहमत आहे.", en: "I agree with you.", hi: "मैं आपसे सहमत हूँ।", ipa: "mī tumchyāśī sahamat āhe." }
    ]
  },
  {
    num: 43,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Storytelling Basics",
    hi: "कहानी सुनाने के मूल सिद्धांत",
    desc: "Connect simple sentences in past tense to relate short fables or stories.",
    vocab: [
      { mr: "गोष्ट", en: "Story", hi: "कहानी", ipa: "goṣṭa" },
      { mr: "भूतकाळ", en: "Past tense", hi: "भूतकाल", ipa: "bhūtkāḷ" },
      { mr: "राजा", en: "King", hi: "राजा", ipa: "rājā" }
    ],
    phrases: [
      { mr: "एका गावात एक शेतकरी राहत होता.", en: "A farmer lived in a village.", hi: "एक गाँव में एक किसान रहता था।", ipa: "ekā gāvāt ek śetkarī rāhat hotā." }
    ]
  },
  {
    num: 44,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Talking About the Past",
    hi: "अतीत के बारे में बात करना",
    desc: "Practice sharing childhood memories, family history, and past incidents.",
    vocab: [
      { mr: "बालपण", en: "Childhood", hi: "बचपन", ipa: "bālpaṇ" },
      { mr: "आठवण", en: "Memory", hi: "याद", ipa: "āṭhavaṇ" },
      { mr: "अनुभव", en: "Experience", hi: "अनुभव", ipa: "anubhav" }
    ],
    phrases: [
      { mr: "आम्ही लहानपणी खूप खेळायचो.", en: "We used to play a lot in our childhood.", hi: "हम बचपन में बहुत खेलते थे।", ipa: "āmhī lahānpaṇī khūp kheḷāyaco." }
    ]
  },
  {
    num: 45,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Talking About the Future",
    hi: "भविष्य के बारे में बात करना",
    desc: "Discuss future intentions, career plans, hopes, and expectations.",
    vocab: [
      { mr: "भविष्य", en: "Future", hi: "भविष्य", ipa: "bhaviṣya" },
      { mr: "स्वप्न", en: "Dream", hi: "सपना", ipa: "svapna" },
      { mr: "ध्येय", en: "Goal", hi: "लक्ष्य", ipa: "dhyeya" }
    ],
    phrases: [
      { mr: "मी पुढील वर्षी पुणे येथे जाईन.", en: "I will go to Pune next year.", hi: "मैं अगले साल पुणे जाऊँगा।", ipa: "mī puḍhīl varṣī puṇe yethe jāīn." }
    ]
  },
  {
    num: 46,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Giving Advice & Suggestions",
    hi: "सलाह और सुझाव देना",
    desc: "Construct recommendations using Marathi equivalents of should, could, and must.",
    vocab: [
      { mr: "सल्ला", en: "Advice", hi: "सलाह", ipa: "sallā" },
      { mr: "सूचना", en: "Suggestion / Notice", hi: "सुझाव", ipa: "sūcanā" },
      { mr: "गरज", en: "Need / Necessity", hi: "ज़रूरत", ipa: "garaj" }
    ],
    phrases: [
      { mr: "तुम्ही दररोज व्यायाम केला पाहिजे.", en: "You should exercise daily.", hi: "आपको रोज़ाना व्यायाम करना चाहिए।", ipa: "tumhī dararoj vyāyām kelā pāhije." }
    ]
  },
  {
    num: 47,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Formal vs Informal Speech",
    hi: "औपचारिक बनाम अनौपचारिक भाषा",
    desc: "Understand when to use Tu versus Tumhi or Aap-equivalent honorifics.",
    vocab: [
      { mr: "आदर", en: "Respect", hi: "आदर", ipa: "ādar" },
      { mr: "औपचारिक", en: "Formal", hi: "औपचारिक", ipa: "aupacārik" },
      { mr: "अनौपचारिक", en: "Informal", hi: "अनौपचारिक", ipa: "anaupacārik" }
    ],
    phrases: [
      { mr: "आपण येथे बसावे.", en: "You (formal) should sit here.", hi: "आप यहाँ विराजें।", ipa: "āpaṇ yethe basāve." }
    ]
  },
  {
    num: 48,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Workplace Marathi",
    hi: "कार्यस्थल पर मराठी",
    desc: "Professional terms for projects, office meetings, and interacting with colleagues.",
    vocab: [
      { mr: "बैठक", en: "Meeting", hi: "बैठक / मीटिंग", ipa: "baiṭhak" },
      { mr: "अहवाल", en: "Report", hi: "रिपोर्ट / अहवाल", ipa: "ahavāl" },
      { mr: "सहकारी", en: "Colleague", hi: "सहकर्मी", ipa: "sahakārī" }
    ],
    phrases: [
      { mr: "आपण बैठक सुरू करूया.", en: "Let's start the meeting.", hi: "आइए बैठक शुरू करते हैं।", ipa: "āpaṇ baiṭhak surū karūyā." }
    ]
  },
  {
    num: 49,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Negotiating & Persuading",
    hi: "वार्ता और समझाना",
    desc: "Use deeper persuasive structures in business or personal discussions.",
    vocab: [
      { mr: "बोलणी", en: "Negotiations / Talks", hi: "बातचीत", ipa: "bolaṇी" },
      { mr: "तडजोड", en: "Compromise", hi: "समझौता", ipa: "taḍajoḍ" },
      { mr: "फायदा", en: "Benefit / Profit", hi: "फ़ायदा", ipa: "phāydā" }
    ],
    phrases: [
      { mr: "हा करार आपल्या दोघांसाठी चांगला आहे.", en: "This deal is good for both of us.", hi: "यह समझौता हम दोनों के लिए अच्छा है।", ipa: "hā karār āplyā doghānsāṭhī chāṅglā āhe." }
    ]
  },
  {
    num: 50,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Cultural Context — Festivals Deep Dive",
    hi: "सांस्कृतिक संदर्भ — त्योहारों का गहरा विश्लेषण",
    desc: "Explain customs, legends, and typical dishes of Maharashtra's festivals.",
    vocab: [
      { mr: "संस्कृती", en: "Culture", hi: "संस्कृति", ipa: "saṅskr̥tī" },
      { mr: "परंपरा", en: "Tradition", hi: "परंपरा", ipa: "paramparā" },
      { mr: "पूजा", en: "Worship / Ritual", hi: "पूजा", ipa: "pūjā" }
    ],
    phrases: [
      { mr: "महाराष्ट्राची संस्कृती समृद्ध आहे.", en: "Maharashtra's culture is rich.", hi: "महाराष्ट्र की संस्कृति समृद्ध है।", ipa: "mahārāṣṭrācī saṅskr̥tī samr̥ddha āhe." }
    ]
  },
  {
    num: 51,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Cultural Context — Food & Hospitality",
    hi: "सांस्कृतिक संदर्भ — भोजन और आतिथ्य",
    desc: "Learn dining table etiquette, welcoming guests, and offering food.",
    vocab: [
      { mr: "अतिथी", en: "Guest", hi: "अतिथि", ipa: "atithī" },
      { mr: "स्वागत", en: "Welcome", hi: "स्वागत", ipa: "svāgat" },
      { mr: "आदरतिथ्य", en: "Hospitality", hi: "मेहमाननवाज़ी", ipa: "ādarātithya" }
    ],
    phrases: [
      { mr: "अतिथी देवो भव.", en: "The guest is equivalent to God.", hi: "अतिथि देवो भव।", ipa: "atithī devo bhava." }
    ]
  },
  {
    num: 52,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Common Marathi Idioms",
    hi: "आम मराठी मुहावरे",
    desc: "Dive into P. L. Deshpande-style wit and popular local idioms.",
    vocab: [
      { mr: "विनोद", en: "Humor / Joke", hi: "मज़ाक / विनोद", ipa: "vinod" },
      { mr: "शाब्दिक", en: "Literal / Verbal", hi: "शाब्दिक", ipa: "śābdik" }
    ],
    phrases: [
      { mr: "चोराच्या मनात चांदणे.", en: "A thief's mind is always suspicious.", hi: "चोर की दाढ़ी में तिनका।", ipa: "corācyā manāt cāndaṇe." }
    ]
  },
  {
    num: 53,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Humor & Everyday Banter",
    hi: "हास्य और दैनिक नोकझोंक",
    desc: "Learn light teasing, common jokes, and colloquial banter expressions.",
    vocab: [
      { mr: "थट्टा", en: "Teasing / Fun", hi: "मज़ाक", ipa: "thaṭṭā" },
      { mr: "मस्करी", en: "Joking", hi: "ठिठोली / मस्करी", ipa: "maskarī" },
      { mr: "हसणे", en: "To laugh", hi: "हँसना", ipa: "hasaṇe" }
    ],
    phrases: [
      { mr: "तुम्ही खूप विनोद करता!", en: "You make a lot of jokes!", hi: "आप बहुत मज़ाक करते हैं!", ipa: "tumhī khūp vinod kartā!" }
    ]
  },
  {
    num: 54,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Reading Signs & Notices",
    hi: "संकेत और सूचनाएँ पढ़ना",
    desc: "Practical reading comprehension of public signboards, alerts, and instructions.",
    vocab: [
      { mr: "पाटी", en: "Signboard", hi: "तख्ती / बोर्ड", ipa: "pāṭī" },
      { mr: "प्रवेश", en: "Entry", hi: "प्रवेश", ipa: "praveś" },
      { mr: "बंदी", en: "Prohibition / Ban", hi: "निषेध", ipa: "bandī" }
    ],
    phrases: [
      { mr: "येथे कचरा टाकू नये.", en: "Do not dump trash here.", hi: "यहाँ कचरा न फेंकें।", ipa: "yethe kacarā ṭākū naye." }
    ]
  },
  {
    num: 55,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Understanding Fast/Natural Speech",
    hi: "तेज़/स्वाभाविक भाषण को समझना",
    desc: "Tips and drills for listening to native-speed Marathi audio clips.",
    vocab: [
      { mr: "वेग", en: "Speed", hi: "गति / रफ़्तार", ipa: "veg" },
      { mr: "उच्चारण", en: "Pronunciation", hi: "उच्चारण", ipa: "uccāraṇ" },
      { mr: "ऐकणे", en: "To listen", hi: "सुनना", ipa: "aikaṇe" }
    ],
    phrases: [
      { mr: "मराठी लोक खूप वेगाने बोलतात.", en: "Marathi people speak very fast.", hi: "मराठी लोग बहुत तेज़ बोलते हैं।", ipa: "marāṭhī lok khūp vegāne boltāt." }
    ]
  },
  {
    num: 56,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Regional Accent Awareness",
    hi: "क्षेत्रीय लहजे की जागरूकता",
    desc: "Compare Pune vs Mumbai vs Vidarbha/rural variations in speech accents.",
    vocab: [
      { mr: "बोली", en: "Dialect", hi: "बोली", ipa: "bolī" },
      { mr: "उच्चार", en: "Accent", hi: "उच्चारण / लहजा", ipa: "uccār" },
      { mr: "वैविध्य", en: "Diversity", hi: "विविधता", ipa: "vaividhya" }
    ],
    phrases: [
      { mr: "कोल्हापुरी भाषा खूप भारदस्त आहे.", en: "Kolhapuri dialect is very heavy/powerful.", hi: "कोल्हापुरी भाषा बहुत दमदार है।", ipa: "kolhāpurī bhāṣā khūp bhāradasta āhe." }
    ]
  },
  {
    num: 57,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Long-form Conversation Practice",
    hi: "लंबी बातचीत का अभ्यास",
    desc: "Conduct multi-turn dialogue practices on complex day-to-day topics.",
    vocab: [
      { mr: "संवाद", en: "Dialogue / Conversation", hi: "संवाद", ipa: "saṁvād" },
      { mr: "दीर्घ", en: "Long", hi: "दीर्घ / लंबा", ipa: "dīrgha" },
      { mr: "सविस्तर", en: "In detail", hi: "विस्तृत", ipa: "savistar" }
    ],
    phrases: [
      { mr: "आपण या विषयावर सविस्तर बोलू.", en: "We will talk in detail on this topic.", hi: "हम इस विषय पर विस्तार से बात करेंगे।", ipa: "āpaṇ yā viṣayār savistar bolū." }
    ]
  },
  {
    num: 58,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Debating Simple Topics",
    hi: "सरल विषयों पर बहस",
    desc: "Learn to build an opinion and politely formulate rebuttals during debates.",
    vocab: [
      { mr: "वादविवाद", en: "Debate", hi: "वादविवाद", ipa: "vādavivād" },
      { mr: "बाजू", en: "Side / Stance", hi: "पक्ष", ipa: "bājū" },
      { mr: "युक्तिवाद", en: "Argumentation", hi: "तर्क", ipa: "yuktivād" }
    ],
    phrases: [
      { mr: "मी या विषयावर माझे मुद्दे मांडतो.", en: "I present my points on this topic.", hi: "मैं इस विषय पर अपने मुद्दे रखता हूँ।", ipa: "mī yā viṣayār mājhe mudde māṇḍto." }
    ]
  },
  {
    num: 59,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Full Conversation Simulation",
    hi: "पूर्ण बातचीत का अनुकरण",
    desc: "End-to-end situational roleplay of complex everyday scenarios.",
    vocab: [
      { mr: "आभासी", en: "Virtual / Simulation", hi: "आभासी", ipa: "ābhāsī" },
      { mr: "परिस्थिती", en: "Situation", hi: "स्थिति", ipa: "paristhitī" }
    ],
    phrases: [
      { mr: "चला, आपण एक भूमिका करूया.", en: "Come, let's do a roleplay.", hi: "चलो, हम एक रोलप्ले करते हैं।", ipa: "calā, āpaṇ ek bhūmikā karūyā." }
    ]
  },
  {
    num: 60,
    stage: "fluency",
    stageTitle: "Fluency",
    stageHindi: "प्रवाह",
    en: "Final Fluency Test & Certificate",
    hi: "अंतिम प्रवाह परीक्षा और प्रमाणन",
    desc: "Pass the comprehensive exam to get your graduation certificate.",
    vocab: [
      { mr: "प्रमाणपत्र", en: "Certificate", hi: "प्रमाणपत्र", ipa: "pramāṇapatra" },
      { mr: "उत्तीर्ण", en: "Passed", hi: "उत्तीर्ण", ipa: "uttīrṇa" }
    ],
    phrases: [
      { mr: "अभिनंदन! तुम्ही यशस्वीरित्या अभ्यासक्रम पूर्ण केला.", en: "Congratulations! You successfully completed the course.", hi: "बधाई हो! आपने सफलतापूर्वक पाठ्यक्रम पूरा कर लिया।", ipa: "abhinandan! tumhī yaśasvīrityā abhyāsakram pūrṇa kelā." }
    ]
  }
];

// Helper to convert raw module definition into complete JourneyModule
export const journeyModulesData: JourneyModule[] = RAW_MODULES.map((item) => {
  const isUnlocked = item.num <= 3; // First 3 modules unlocked by default
  const isCompleted = item.num === 1; // First module marked completed

  return {
    id: `mod_${item.num}`,
    moduleNumber: item.num,
    stageId: item.stage,
    stageTitle: item.stageTitle,
    stageHindi: item.stageHindi,
    titleEn: item.en,
    titleHindi: item.hi,
    descriptionEn: item.desc,
    learningObjective: `Master ${item.en} (${item.hi})`,
    xp: 50,
    isUnlocked,
    isCompleted,
    vocabulary: item.vocab,
    phrases: item.phrases,
    estimatedMinutes: item.estimatedMinutes || 60,
    conversationScenario: [
      {
        speaker: "Meera Tutor",
        textMr: item.phrases[0]?.mr || "नमस्कार!",
        textEn: item.phrases[0]?.en || "Hello!",
        textHi: item.phrases[0]?.hi || "नमस्ते!"
      }
    ]
  };
});

// Stage grouping for Duolingo-style sections (3 collapsible tiers)
export const journeyStagesData: JourneyStage[] = [
  {
    id: "foundation",
    title: "Foundation",
    hindiTitle: "आधारशिला (स्वर, शब्द और मूल ज्ञान)",
    description: "Modules 1–15: Alphabet, tricky sounds, family, numbers, yes/no & simple questions.",
    startModule: 1,
    endModule: 15,
    colorTone: "from-amber-500 to-orange-500",
    modules: journeyModulesData.slice(0, 15)
  },
  {
    id: "conversational",
    title: "Conversational",
    hindiTitle: "प्रारंभिक बातचीत (दैनिक व्यवहार)",
    description: "Modules 16–40: Market, bargaining, rickshaws, weather, medical, bank, work & festivals.",
    startModule: 16,
    endModule: 40,
    colorTone: "from-emerald-500 to-teal-500",
    modules: journeyModulesData.slice(15, 40)
  },
  {
    id: "fluency",
    title: "Fluency",
    hindiTitle: "उच्च स्तर (औपचारिक, साहित्य और धाराप्रवाह)",
    description: "Modules 41–60: Opinions, past & future narrations, idioms, signs, accents & debate.",
    startModule: 41,
    endModule: 60,
    colorTone: "from-purple-500 to-pink-500",
    modules: journeyModulesData.slice(40, 60)
  }
];

// Helper to find module by ID or number
export function getJourneyModule(idOrNum: string | number): JourneyModule | null {
  if (typeof idOrNum === "number") {
    return journeyModulesData.find((m) => m.moduleNumber === idOrNum) || null;
  }
  const cleanId = String(idOrNum).toLowerCase();
  return (
    journeyModulesData.find(
      (m) => m.id.toLowerCase() === cleanId || String(m.moduleNumber) === cleanId
    ) || null
  );
}
