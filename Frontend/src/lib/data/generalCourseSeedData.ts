/**
 * Seed data for General Conversational Marathi course (Modules 1-15)
 * Generated automatically from user request dataset + fallback placeholders.
 */

export interface SeedItem {
  marathi_text: string;
  transliteration: string;
  english_meaning: string;
  usage_note: string;
}

export interface SeedModule {
  id: number;
  title: string;
  type: 'phonetics' | 'sentences';
  estimated_minutes: number;
  items: SeedItem[];
}

export const SEED_MODULES: SeedModule[] = [
  {
    "id": 1,
    "title": "Marathi Sounds & Script Basics",
    "type": "phonetics",
    "estimated_minutes": 90,
    "items": [
      {
        "marathi_text": "अ - अननस",
        "transliteration": "A - Ananas",
        "english_meaning": "A - Pineapple",
        "usage_note": "Short 'a' as in 'up'"
      },
      {
        "marathi_text": "आ - आई",
        "transliteration": "Aa - Aai",
        "english_meaning": "Aa - Mother",
        "usage_note": "Long 'aa' as in 'father'"
      },
      {
        "marathi_text": "इ - इथे",
        "transliteration": "I - Ithe",
        "english_meaning": "I - Here",
        "usage_note": "Short 'i' as in 'sit'"
      },
      {
        "marathi_text": "ई - ईश्वर",
        "transliteration": "Ee - Ishwar",
        "english_meaning": "Ee - God",
        "usage_note": "Long 'ee' as in 'see'"
      },
      {
        "marathi_text": "उ - उन",
        "transliteration": "U - Un",
        "english_meaning": "U - Sunlight/heat",
        "usage_note": "Short 'u' as in 'put'"
      },
      {
        "marathi_text": "ऊ - ऊस",
        "transliteration": "Oo - Us",
        "english_meaning": "Oo - Sugarcane",
        "usage_note": "Long 'oo' as in 'food'"
      },
      {
        "marathi_text": "ऋ - ऋषी",
        "transliteration": "Ri - Rishi",
        "english_meaning": "Ri - Sage",
        "usage_note": "Rare vowel sound, mostly in Sanskrit-origin words"
      },
      {
        "marathi_text": "ए - एक",
        "transliteration": "E - Ek",
        "english_meaning": "E - One",
        "usage_note": "As in 'egg'"
      },
      {
        "marathi_text": "ऐ - ऐट",
        "transliteration": "Ai - Ait",
        "english_meaning": "Ai - Style/attitude",
        "usage_note": "As in 'aisle'"
      },
      {
        "marathi_text": "ओ - ओठ",
        "transliteration": "O - Oth",
        "english_meaning": "O - Lips",
        "usage_note": "As in 'go'"
      },
      {
        "marathi_text": "औ - औषध",
        "transliteration": "Au - Aushadh",
        "english_meaning": "Au - Medicine",
        "usage_note": "As in 'cow'"
      },
      {
        "marathi_text": "अं - अंगण",
        "transliteration": "Am - Angan",
        "english_meaning": "Am - Courtyard",
        "usage_note": "Nasal sound (anuswar)"
      },
      {
        "marathi_text": "क - कमळ",
        "transliteration": "Ka - Kamal",
        "english_meaning": "Ka - Lotus",
        "usage_note": "Hard 'k'"
      },
      {
        "marathi_text": "ख - खरं",
        "transliteration": "Kha - Khara",
        "english_meaning": "Kha - True",
        "usage_note": "Aspirated 'k', more breath"
      },
      {
        "marathi_text": "ग - गाव",
        "transliteration": "Ga - Gaav",
        "english_meaning": "Ga - Village",
        "usage_note": "Hard 'g'"
      },
      {
        "marathi_text": "घ - घर",
        "transliteration": "Gha - Ghar",
        "english_meaning": "Gha - House",
        "usage_note": "Aspirated 'g'"
      },
      {
        "marathi_text": "च - चहा",
        "transliteration": "Cha - Chaha",
        "english_meaning": "Cha - Tea",
        "usage_note": "Soft 'ch'"
      },
      {
        "marathi_text": "छ - छत्री",
        "transliteration": "Chha - Chhatri",
        "english_meaning": "Chha - Umbrella",
        "usage_note": "Aspirated 'ch'"
      },
      {
        "marathi_text": "ज - जल",
        "transliteration": "Ja - Jal",
        "english_meaning": "Ja - Water",
        "usage_note": "As in 'jam'"
      },
      {
        "marathi_text": "झ - झाड",
        "transliteration": "Jha - Jhaad",
        "english_meaning": "Jha - Tree",
        "usage_note": "Aspirated 'j'"
      },
      {
        "marathi_text": "ट - टमाटा",
        "transliteration": "Ta - Tamata",
        "english_meaning": "Ta - Tomato",
        "usage_note": "Retroflex 't', tongue curls back"
      },
      {
        "marathi_text": "ठ - ठिकाण",
        "transliteration": "Tha - Thikaan",
        "english_meaning": "Tha - Place",
        "usage_note": "Aspirated retroflex 't'"
      },
      {
        "marathi_text": "ड - डोंगर",
        "transliteration": "Da - Dongar",
        "english_meaning": "Da - Mountain",
        "usage_note": "Retroflex 'd'"
      },
      {
        "marathi_text": "ढ - ढग",
        "transliteration": "Dha - Dhag",
        "english_meaning": "Dha - Cloud",
        "usage_note": "Aspirated retroflex 'd'"
      },
      {
        "marathi_text": "त - तळे",
        "transliteration": "Ta (dental) - Tale",
        "english_meaning": "Ta - Pond",
        "usage_note": "Softer, dental 't' - tongue touches teeth"
      },
      {
        "marathi_text": "द - दूध",
        "transliteration": "Da (dental) - Doodh",
        "english_meaning": "Da - Milk",
        "usage_note": "Dental 'd'"
      },
      {
        "marathi_text": "न - नदी",
        "transliteration": "Na - Nadi",
        "english_meaning": "Na - River",
        "usage_note": ""
      },
      {
        "marathi_text": "प - पान",
        "transliteration": "Pa - Paan",
        "english_meaning": "Pa - Leaf",
        "usage_note": ""
      },
      {
        "marathi_text": "फ - फूल",
        "transliteration": "Pha - Phool",
        "english_meaning": "Pha - Flower",
        "usage_note": "Aspirated 'p'"
      },
      {
        "marathi_text": "ब - बदल",
        "transliteration": "Ba - Badal",
        "english_meaning": "Ba - Change",
        "usage_note": ""
      },
      {
        "marathi_text": "भ - भाकरी",
        "transliteration": "Bha - Bhaakari",
        "english_meaning": "Bha - Flatbread",
        "usage_note": "Aspirated 'b'"
      },
      {
        "marathi_text": "म - मन",
        "transliteration": "Ma - Man",
        "english_meaning": "Ma - Mind",
        "usage_note": ""
      },
      {
        "marathi_text": "य र ल व श स ह - यश, रस्ता, लाकूड, वारा, शाळा, समुद्र, हवा",
        "transliteration": "Ya, Ra, La, Va, Sha, Sa, Ha - Yash, Rasta, Laakud, Vaara, Shaala, Samudra, Hava",
        "english_meaning": "Success, Road, Wood, Wind, School, Sea, Air",
        "usage_note": "Remaining core consonants with example words"
      }
    ]
  },
  {
    "id": 2,
    "title": "Tricky Sounds & Minimal Pairs",
    "type": "phonetics",
    "estimated_minutes": 90,
    "items": [
      {
        "marathi_text": "फळ",
        "transliteration": "Phal",
        "english_meaning": "Fruit",
        "usage_note": "'ळ' - tongue curls further back than 'l'"
      },
      {
        "marathi_text": "पळ",
        "transliteration": "Pal",
        "english_meaning": "Moment",
        "usage_note": "Practice 'ळ' vs regular 'l'"
      },
      {
        "marathi_text": "गळा",
        "transliteration": "Gala",
        "english_meaning": "Throat",
        "usage_note": "More 'ळ' practice"
      },
      {
        "marathi_text": "बहीण",
        "transliteration": "Bahin",
        "english_meaning": "Sister",
        "usage_note": "'ण' retroflex 'n', tongue tip curls up"
      },
      {
        "marathi_text": "गणपती",
        "transliteration": "Ganpati",
        "english_meaning": "Lord Ganesh",
        "usage_note": "'ण' sound practice"
      },
      {
        "marathi_text": "करण",
        "transliteration": "Karan",
        "english_meaning": "Reason",
        "usage_note": "'ण' vs 'न' contrast"
      },
      {
        "marathi_text": "कमल",
        "transliteration": "Kamal",
        "english_meaning": "Lotus (variant using 'l')",
        "usage_note": "Contrast with 'ळ' words above"
      },
      {
        "marathi_text": "षटकोन",
        "transliteration": "Shatkon",
        "english_meaning": "Hexagon",
        "usage_note": "'ष' harder 'sh' than 'श'"
      },
      {
        "marathi_text": "भाषा",
        "transliteration": "Bhasha",
        "english_meaning": "Language",
        "usage_note": "Common word using 'ष'"
      },
      {
        "marathi_text": "शाळा",
        "transliteration": "Shaala",
        "english_meaning": "School",
        "usage_note": "'श' softer 'sh' - contrast with 'ष'"
      },
      {
        "marathi_text": "क्षमा",
        "transliteration": "Kshama",
        "english_meaning": "Forgiveness",
        "usage_note": "'क्ष' combined 'ksh' sound"
      },
      {
        "marathi_text": "ज्ञान",
        "transliteration": "Dnyaan",
        "english_meaning": "Knowledge",
        "usage_note": "'ज्ञ' sounds like 'dnya' in Marathi, not 'gyan'"
      },
      {
        "marathi_text": "काळ",
        "transliteration": "Kaal",
        "english_meaning": "Time/era",
        "usage_note": "Contrast with 'काल' (yesterday) - vowel length matters"
      },
      {
        "marathi_text": "कल",
        "transliteration": "Kal",
        "english_meaning": "(short vowel drill word)",
        "usage_note": "Minimal pair for vowel length"
      },
      {
        "marathi_text": "कड / खड",
        "transliteration": "Kad / Khad",
        "english_meaning": "Side / Pit",
        "usage_note": "क vs ख aspirated contrast"
      },
      {
        "marathi_text": "गार / घार",
        "transliteration": "Gaar / Ghaar",
        "english_meaning": "Cool / Kite (bird)",
        "usage_note": "ग vs घ aspirated contrast"
      },
      {
        "marathi_text": "टळ / ठळ",
        "transliteration": "Tal / Thal",
        "english_meaning": "Avoid (root) / Prominent (root)",
        "usage_note": "ट vs ठ aspirated contrast"
      },
      {
        "marathi_text": "डाव / ढाव",
        "transliteration": "Daav / Dhaav",
        "english_meaning": "Move (in a game) / (drill word)",
        "usage_note": "ड vs ढ aspirated contrast"
      },
      {
        "marathi_text": "तळ / थळ",
        "transliteration": "Tal / Thal",
        "english_meaning": "Bottom / (drill word)",
        "usage_note": "Dental त vs थ contrast"
      },
      {
        "marathi_text": "दार / धार",
        "transliteration": "Daar / Dhaar",
        "english_meaning": "Door / Edge (of a blade)",
        "usage_note": "द vs ध aspirated contrast"
      },
      {
        "marathi_text": "पर / फर",
        "transliteration": "Par / Phar",
        "english_meaning": "(root: other) / (drill word)",
        "usage_note": "प vs फ aspirated contrast"
      },
      {
        "marathi_text": "बस / भस",
        "transliteration": "Bas / Bhas",
        "english_meaning": "Bus/Sit / Ash (root)",
        "usage_note": "ब vs भ aspirated contrast"
      },
      {
        "marathi_text": "ऱ्हास",
        "transliteration": "Rhaas",
        "english_meaning": "Decline/decay",
        "usage_note": "Eyelash 'ऱ' sound, rare but appears in some words"
      },
      {
        "marathi_text": "कोरडं",
        "transliteration": "Korda",
        "english_meaning": "Dry",
        "usage_note": "Full-word practice mixing ड and र"
      },
      {
        "marathi_text": "ळ vs ल sentence drill: पळा, चला",
        "transliteration": "Pala, Chala",
        "english_meaning": "Run!, Let's go",
        "usage_note": "Practice both sounds inside real commands"
      }
    ]
  },
  {
    "id": 3,
    "title": "Greetings & Politeness",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "नमस्कार",
        "transliteration": "Namaskar",
        "english_meaning": "Hello / Greetings",
        "usage_note": "Universal, respectful in all situations"
      },
      {
        "marathi_text": "शुभ सकाळ",
        "transliteration": "Shubh sakaal",
        "english_meaning": "Good morning",
        "usage_note": ""
      },
      {
        "marathi_text": "शुभ प्रभात",
        "transliteration": "Shubh prabhaat",
        "english_meaning": "Good morning (formal/poetic)",
        "usage_note": ""
      },
      {
        "marathi_text": "शुभ रात्री",
        "transliteration": "Shubh raatri",
        "english_meaning": "Good night",
        "usage_note": ""
      },
      {
        "marathi_text": "कसं आहेस?",
        "transliteration": "Kasa aahes?",
        "english_meaning": "How are you?",
        "usage_note": "Informal, male listener"
      },
      {
        "marathi_text": "कशी आहेस?",
        "transliteration": "Kashi aahes?",
        "english_meaning": "How are you?",
        "usage_note": "Informal, female listener"
      },
      {
        "marathi_text": "कसं चाललंय?",
        "transliteration": "Kasa challa?",
        "english_meaning": "How's it going?",
        "usage_note": "Very casual"
      },
      {
        "marathi_text": "मी ठीक आहे",
        "transliteration": "Mi theek aahe",
        "english_meaning": "I am fine",
        "usage_note": "Standard reply"
      },
      {
        "marathi_text": "मजेत आहे",
        "transliteration": "Majet aahe",
        "english_meaning": "I'm doing great",
        "usage_note": "Cheerful reply"
      },
      {
        "marathi_text": "धन्यवाद",
        "transliteration": "Dhanyavaad",
        "english_meaning": "Thank you",
        "usage_note": "Formal thanks"
      },
      {
        "marathi_text": "आभारी आहे",
        "transliteration": "Aabhari aahe",
        "english_meaning": "I am grateful",
        "usage_note": "More formal/heartfelt thanks"
      },
      {
        "marathi_text": "माफ करा",
        "transliteration": "Maaf kara",
        "english_meaning": "Excuse me / Sorry",
        "usage_note": "Polite, used with strangers"
      },
      {
        "marathi_text": "क्षमस्व",
        "transliteration": "Kshamasva",
        "english_meaning": "I apologize",
        "usage_note": "Formal/literary apology"
      },
      {
        "marathi_text": "कृपया",
        "transliteration": "Krupaya",
        "english_meaning": "Please",
        "usage_note": "Added before a request"
      },
      {
        "marathi_text": "स्वागत आहे",
        "transliteration": "Swagat aahe",
        "english_meaning": "You are welcome",
        "usage_note": ""
      },
      {
        "marathi_text": "आपलं स्वागत आहे",
        "transliteration": "Aaplan swagat aahe",
        "english_meaning": "You're welcome (to a place)",
        "usage_note": "Formal welcome"
      },
      {
        "marathi_text": "चालेल",
        "transliteration": "Chalel",
        "english_meaning": "That works / Okay",
        "usage_note": "Common casual agreement"
      },
      {
        "marathi_text": "ठीक आहे",
        "transliteration": "Theek aahe",
        "english_meaning": "Okay / Alright",
        "usage_note": ""
      },
      {
        "marathi_text": "अभिनंदन",
        "transliteration": "Abhinandan",
        "english_meaning": "Congratulations",
        "usage_note": ""
      },
      {
        "marathi_text": "शुभेच्छा",
        "transliteration": "Shubhechchha",
        "english_meaning": "Best wishes",
        "usage_note": ""
      },
      {
        "marathi_text": "काळजी घ्या",
        "transliteration": "Kaalji ghya",
        "english_meaning": "Take care",
        "usage_note": ""
      },
      {
        "marathi_text": "पुन्हा भेटू",
        "transliteration": "Punha bhetu",
        "english_meaning": "See you again",
        "usage_note": ""
      },
      {
        "marathi_text": "निरोप",
        "transliteration": "Nirop",
        "english_meaning": "Farewell / Message",
        "usage_note": ""
      },
      {
        "marathi_text": "बरं वाटलं भेटून",
        "transliteration": "Baran vaatla bhetun",
        "english_meaning": "Nice meeting you",
        "usage_note": ""
      },
      {
        "marathi_text": "आपलं नाव काय आहे?",
        "transliteration": "Aaplan naav kay aahe?",
        "english_meaning": "What is your name?",
        "usage_note": "Formal/respectful form"
      }
    ]
  },
  {
    "id": 4,
    "title": "Introducing Yourself",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "माझं नाव ... आहे",
        "transliteration": "Majhan naav ... aahe",
        "english_meaning": "My name is ...",
        "usage_note": "Fill in the blank with the name"
      },
      {
        "marathi_text": "मी भारतातून आलो आहे",
        "transliteration": "Mi Bharatatun aalo aahe",
        "english_meaning": "I have come from India",
        "usage_note": "Male speaker; female uses 'aale'"
      },
      {
        "marathi_text": "मी मुंबईत राहतो",
        "transliteration": "Mi Mumbait raahato",
        "english_meaning": "I live in Mumbai",
        "usage_note": "Male speaker; female uses 'raahate'"
      },
      {
        "marathi_text": "मी विद्यार्थी आहे",
        "transliteration": "Mi vidyarthi aahe",
        "english_meaning": "I am a student",
        "usage_note": ""
      },
      {
        "marathi_text": "मी नोकरी करतो",
        "transliteration": "Mi naukri karto",
        "english_meaning": "I have a job / I work",
        "usage_note": "Male speaker; female uses 'karte'"
      },
      {
        "marathi_text": "मी व्यवसाय करतो",
        "transliteration": "Mi vyavasaay karto",
        "english_meaning": "I run a business",
        "usage_note": ""
      },
      {
        "marathi_text": "तुझं नाव काय आहे?",
        "transliteration": "Tujhan naav kay aahe?",
        "english_meaning": "What is your name?",
        "usage_note": "Informal version"
      },
      {
        "marathi_text": "तू कुठून आलास?",
        "transliteration": "Tu kuthun aalas?",
        "english_meaning": "Where have you come from?",
        "usage_note": "Informal, male listener"
      },
      {
        "marathi_text": "तू कुठून आलीस?",
        "transliteration": "Tu kuthun aalis?",
        "english_meaning": "Where have you come from?",
        "usage_note": "Informal, female listener"
      },
      {
        "marathi_text": "मला भेटून आनंद झाला",
        "transliteration": "Mala bhetun aanand jhala",
        "english_meaning": "I am happy to meet you",
        "usage_note": ""
      },
      {
        "marathi_text": "माझं वय ... आहे",
        "transliteration": "Majhan vay ... aahe",
        "english_meaning": "My age is ...",
        "usage_note": "Fill in the blank with age"
      },
      {
        "marathi_text": "मी लग्न झालेलो आहे",
        "transliteration": "Mi lagna jhalelo aahe",
        "english_meaning": "I am married",
        "usage_note": "Male speaker; female uses 'jhaleli'"
      },
      {
        "marathi_text": "मी अविवाहित आहे",
        "transliteration": "Mi avivahit aahe",
        "english_meaning": "I am unmarried",
        "usage_note": ""
      },
      {
        "marathi_text": "माझं शिक्षण ... पर्यंत झालं आहे",
        "transliteration": "Majhan shikshan ... paryant jhala aahe",
        "english_meaning": "My education is up to ...",
        "usage_note": ""
      },
      {
        "marathi_text": "मी हिंदी बोलतो",
        "transliteration": "Mi Hindi bolto",
        "english_meaning": "I speak Hindi",
        "usage_note": ""
      },
      {
        "marathi_text": "मी थोडं मराठी बोलतो",
        "transliteration": "Mi thoda Marathi bolto",
        "english_meaning": "I speak a little Marathi",
        "usage_note": "Very useful early phrase"
      },
      {
        "marathi_text": "मला मराठी समजते पण बोलता येत नाही",
        "transliteration": "Mala Marathi samajte pan bolta yet naahi",
        "english_meaning": "I understand Marathi but can't speak it",
        "usage_note": ""
      },
      {
        "marathi_text": "मी मराठी शिकतोय",
        "transliteration": "Mi Marathi shikatoy",
        "english_meaning": "I am learning Marathi",
        "usage_note": ""
      },
      {
        "marathi_text": "थोडं हळू बोला",
        "transliteration": "Thoda halu bola",
        "english_meaning": "Please speak a little slowly",
        "usage_note": "Useful survival phrase"
      },
      {
        "marathi_text": "पुन्हा सांगाल का?",
        "transliteration": "Punha sangaal ka?",
        "english_meaning": "Could you say that again?",
        "usage_note": ""
      },
      {
        "marathi_text": "ओळख करून द्या",
        "transliteration": "Olakh karun dya",
        "english_meaning": "Please introduce (yourself/someone)",
        "usage_note": ""
      },
      {
        "marathi_text": "हे माझे मित्र आहेत",
        "transliteration": "He maze mitra aahet",
        "english_meaning": "This is my friend",
        "usage_note": ""
      },
      {
        "marathi_text": "मी इथे कामासाठी आलोय",
        "transliteration": "Mi ithe kaamasathi aaloy",
        "english_meaning": "I've come here for work",
        "usage_note": ""
      },
      {
        "marathi_text": "मी फिरायला आलोय",
        "transliteration": "Mi firaayla aaloy",
        "english_meaning": "I've come here to travel/visit",
        "usage_note": ""
      },
      {
        "marathi_text": "आपण भेटलो आहोत का आधी?",
        "transliteration": "Aapan bhetlo aahot ka aadhi?",
        "english_meaning": "Have we met before?",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 5,
    "title": "Numbers 1-100",
    "type": "sentences",
    "estimated_minutes": 90,
    "items": [
      {
        "marathi_text": "एक",
        "transliteration": "Ek",
        "english_meaning": "One (1)",
        "usage_note": ""
      },
      {
        "marathi_text": "दोन",
        "transliteration": "Don",
        "english_meaning": "Two (2)",
        "usage_note": ""
      },
      {
        "marathi_text": "तीन",
        "transliteration": "Teen",
        "english_meaning": "Three (3)",
        "usage_note": ""
      },
      {
        "marathi_text": "चार",
        "transliteration": "Chaar",
        "english_meaning": "Four (4)",
        "usage_note": ""
      },
      {
        "marathi_text": "पाच",
        "transliteration": "Paach",
        "english_meaning": "Five (5)",
        "usage_note": ""
      },
      {
        "marathi_text": "सहा",
        "transliteration": "Saha",
        "english_meaning": "Six (6)",
        "usage_note": ""
      },
      {
        "marathi_text": "सात",
        "transliteration": "Saat",
        "english_meaning": "Seven (7)",
        "usage_note": ""
      },
      {
        "marathi_text": "आठ",
        "transliteration": "Aath",
        "english_meaning": "Eight (8)",
        "usage_note": ""
      },
      {
        "marathi_text": "नऊ",
        "transliteration": "Nau",
        "english_meaning": "Nine (9)",
        "usage_note": ""
      },
      {
        "marathi_text": "दहा",
        "transliteration": "Daha",
        "english_meaning": "Ten (10)",
        "usage_note": ""
      },
      {
        "marathi_text": "अकरा",
        "transliteration": "Akara",
        "english_meaning": "Eleven (11)",
        "usage_note": ""
      },
      {
        "marathi_text": "बारा",
        "transliteration": "Baara",
        "english_meaning": "Twelve (12)",
        "usage_note": ""
      },
      {
        "marathi_text": "तेरा",
        "transliteration": "Tera",
        "english_meaning": "Thirteen (13)",
        "usage_note": ""
      },
      {
        "marathi_text": "चौदा",
        "transliteration": "Chauda",
        "english_meaning": "Fourteen (14)",
        "usage_note": ""
      },
      {
        "marathi_text": "पंधरा",
        "transliteration": "Pandhara",
        "english_meaning": "Fifteen (15)",
        "usage_note": ""
      },
      {
        "marathi_text": "सोळा",
        "transliteration": "Sola",
        "english_meaning": "Sixteen (16)",
        "usage_note": ""
      },
      {
        "marathi_text": "सतरा",
        "transliteration": "Satara",
        "english_meaning": "Seventeen (17)",
        "usage_note": ""
      },
      {
        "marathi_text": "अठरा",
        "transliteration": "Athhara",
        "english_meaning": "Eighteen (18)",
        "usage_note": ""
      },
      {
        "marathi_text": "एकोणीस",
        "transliteration": "Ekonis",
        "english_meaning": "Nineteen (19)",
        "usage_note": ""
      },
      {
        "marathi_text": "वीस",
        "transliteration": "Vees",
        "english_meaning": "Twenty (20)",
        "usage_note": ""
      },
      {
        "marathi_text": "एकवीस",
        "transliteration": "Ekvees",
        "english_meaning": "Twenty-one (21)",
        "usage_note": ""
      },
      {
        "marathi_text": "पंचवीस",
        "transliteration": "Panchvees",
        "english_meaning": "Twenty-five (25)",
        "usage_note": ""
      },
      {
        "marathi_text": "तीस",
        "transliteration": "Trees",
        "english_meaning": "Thirty (30)",
        "usage_note": ""
      },
      {
        "marathi_text": "पस्तीस",
        "transliteration": "Pastees",
        "english_meaning": "Thirty-five (35)",
        "usage_note": ""
      },
      {
        "marathi_text": "चाळीस",
        "transliteration": "Chalis",
        "english_meaning": "Forty (40)",
        "usage_note": ""
      },
      {
        "marathi_text": "पन्नास",
        "transliteration": "Pannas",
        "english_meaning": "Fifty (50)",
        "usage_note": ""
      },
      {
        "marathi_text": "साठ",
        "transliteration": "Saath",
        "english_meaning": "Sixty (60)",
        "usage_note": ""
      },
      {
        "marathi_text": "सत्तर",
        "transliteration": "Sattar",
        "english_meaning": "Seventy (70)",
        "usage_note": ""
      },
      {
        "marathi_text": "ऐंशी",
        "transliteration": "Aishi",
        "english_meaning": "Eighty (80)",
        "usage_note": ""
      },
      {
        "marathi_text": "नव्वद",
        "transliteration": "Navvad",
        "english_meaning": "Ninety (90)",
        "usage_note": ""
      },
      {
        "marathi_text": "शंभर",
        "transliteration": "Shambhar",
        "english_meaning": "Hundred (100)",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 6,
    "title": "Money & Shopping Phrases",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "हे किती रुपये आहे?",
        "transliteration": "He kiti rupaye aahe?",
        "english_meaning": "How many rupees is this?",
        "usage_note": "Common shopping question"
      },
      {
        "marathi_text": "किंमत काय आहे?",
        "transliteration": "Kimmat kay aahe?",
        "english_meaning": "What is the price?",
        "usage_note": ""
      },
      {
        "marathi_text": "थोडं स्वस्त करा",
        "transliteration": "Thoda swasta kara",
        "english_meaning": "Make it a bit cheaper",
        "usage_note": "Bargaining phrase"
      },
      {
        "marathi_text": "आणखी कमी करा",
        "transliteration": "Aanakhi kami kara",
        "english_meaning": "Reduce it further",
        "usage_note": ""
      },
      {
        "marathi_text": "हे महाग आहे",
        "transliteration": "He mahaag aahe",
        "english_meaning": "This is expensive",
        "usage_note": ""
      },
      {
        "marathi_text": "हे स्वस्त आहे",
        "transliteration": "He swasta aahe",
        "english_meaning": "This is cheap",
        "usage_note": ""
      },
      {
        "marathi_text": "सूट आहे का?",
        "transliteration": "Soot aahe ka?",
        "english_meaning": "Is there a discount?",
        "usage_note": ""
      },
      {
        "marathi_text": "बिल द्या",
        "transliteration": "Bill dya",
        "english_meaning": "Give me the bill",
        "usage_note": ""
      },
      {
        "marathi_text": "पावती द्या",
        "transliteration": "Paavati dya",
        "english_meaning": "Give me the receipt",
        "usage_note": ""
      },
      {
        "marathi_text": "सुट्टे पैसे द्या",
        "transliteration": "Sutte paise dya",
        "english_meaning": "Give me change",
        "usage_note": ""
      },
      {
        "marathi_text": "एकूण किती झालं?",
        "transliteration": "Ekun kiti jhala?",
        "english_meaning": "What's the total?",
        "usage_note": ""
      },
      {
        "marathi_text": "माझ्याकडे सुट्टे नाहीत",
        "transliteration": "Majhyakade sutte naahit",
        "english_meaning": "I don't have change",
        "usage_note": ""
      },
      {
        "marathi_text": "कॅश आहे का?",
        "transliteration": "Cash aahe ka?",
        "english_meaning": "Do you have cash?",
        "usage_note": ""
      },
      {
        "marathi_text": "कार्ड चालतं का?",
        "transliteration": "Card chalta ka?",
        "english_meaning": "Does a card work here?",
        "usage_note": ""
      },
      {
        "marathi_text": "मी कार्डने पैसे देतो",
        "transliteration": "Mi card ne paise deto",
        "english_meaning": "I'll pay by card",
        "usage_note": "Male speaker; female uses 'dete'"
      },
      {
        "marathi_text": "यूपीआय चालतं का?",
        "transliteration": "UPI chalta ka?",
        "english_meaning": "Does UPI work here?",
        "usage_note": "Very common in India today"
      },
      {
        "marathi_text": "एवढेच पैसे आहेत माझ्याजवळ",
        "transliteration": "Evadhech paise aahet majhyajaval",
        "english_meaning": "This is all the money I have",
        "usage_note": ""
      },
      {
        "marathi_text": "दोनशे रुपये",
        "transliteration": "Donshe rupaye",
        "english_meaning": "Two hundred rupees",
        "usage_note": ""
      },
      {
        "marathi_text": "पाचशे रुपये",
        "transliteration": "Paachshe rupaye",
        "english_meaning": "Five hundred rupees",
        "usage_note": ""
      },
      {
        "marathi_text": "हजार रुपये",
        "transliteration": "Hazaar rupaye",
        "english_meaning": "One thousand rupees",
        "usage_note": ""
      },
      {
        "marathi_text": "नाणी आहेत का?",
        "transliteration": "Naani aahet ka?",
        "english_meaning": "Do you have coins?",
        "usage_note": ""
      },
      {
        "marathi_text": "नोटा मोडून द्या",
        "transliteration": "Nota modun dya",
        "english_meaning": "Please break this note (into smaller change)",
        "usage_note": ""
      },
      {
        "marathi_text": "फुकट आहे का?",
        "transliteration": "Phukat aahe ka?",
        "english_meaning": "Is it free?",
        "usage_note": ""
      },
      {
        "marathi_text": "मला हे विकत घ्यायचं आहे",
        "transliteration": "Mala he vikat ghyaycha aahe",
        "english_meaning": "I want to buy this",
        "usage_note": ""
      },
      {
        "marathi_text": "फक्त बघतोय, घेणार नाही",
        "transliteration": "Phakt baghtoy, ghenar naahi",
        "english_meaning": "Just looking, not buying",
        "usage_note": "Useful for browsing without pressure"
      }
    ]
  },
  {
    "id": 7,
    "title": "Family Members & Relations",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "आई",
        "transliteration": "Aai",
        "english_meaning": "Mother",
        "usage_note": ""
      },
      {
        "marathi_text": "बाबा",
        "transliteration": "Baba",
        "english_meaning": "Father",
        "usage_note": ""
      },
      {
        "marathi_text": "भाऊ",
        "transliteration": "Bhau",
        "english_meaning": "Brother",
        "usage_note": ""
      },
      {
        "marathi_text": "बहीण",
        "transliteration": "Bahin",
        "english_meaning": "Sister",
        "usage_note": ""
      },
      {
        "marathi_text": "आजोबा",
        "transliteration": "Ajoba",
        "english_meaning": "Grandfather",
        "usage_note": ""
      },
      {
        "marathi_text": "आजी",
        "transliteration": "Aji",
        "english_meaning": "Grandmother",
        "usage_note": ""
      },
      {
        "marathi_text": "नवरा",
        "transliteration": "Navra",
        "english_meaning": "Husband",
        "usage_note": ""
      },
      {
        "marathi_text": "बायको",
        "transliteration": "Bayko",
        "english_meaning": "Wife",
        "usage_note": ""
      },
      {
        "marathi_text": "मुलगा",
        "transliteration": "Mulga",
        "english_meaning": "Son",
        "usage_note": ""
      },
      {
        "marathi_text": "मुलगी",
        "transliteration": "Mulgi",
        "english_meaning": "Daughter",
        "usage_note": ""
      },
      {
        "marathi_text": "काका",
        "transliteration": "Kaka",
        "english_meaning": "Uncle (father's younger brother)",
        "usage_note": ""
      },
      {
        "marathi_text": "काकू",
        "transliteration": "Kaku",
        "english_meaning": "Aunt (uncle's wife)",
        "usage_note": ""
      },
      {
        "marathi_text": "मामा",
        "transliteration": "Mama",
        "english_meaning": "Uncle (mother's brother)",
        "usage_note": ""
      },
      {
        "marathi_text": "मामी",
        "transliteration": "Mami",
        "english_meaning": "Aunt (mama's wife)",
        "usage_note": ""
      },
      {
        "marathi_text": "आत्या",
        "transliteration": "Atya",
        "english_meaning": "Aunt (father's sister)",
        "usage_note": ""
      },
      {
        "marathi_text": "मावशी",
        "transliteration": "Mavshi",
        "english_meaning": "Aunt (mother's sister)",
        "usage_note": ""
      },
      {
        "marathi_text": "सासरे",
        "transliteration": "Sasre",
        "english_meaning": "Father-in-law",
        "usage_note": ""
      },
      {
        "marathi_text": "सासू",
        "transliteration": "Sasu",
        "english_meaning": "Mother-in-law",
        "usage_note": ""
      },
      {
        "marathi_text": "जावई",
        "transliteration": "Javai",
        "english_meaning": "Son-in-law",
        "usage_note": ""
      },
      {
        "marathi_text": "सून",
        "transliteration": "Soon",
        "english_meaning": "Daughter-in-law",
        "usage_note": ""
      },
      {
        "marathi_text": "पुतण्या",
        "transliteration": "Putanya",
        "english_meaning": "Nephew (brother's son)",
        "usage_note": ""
      },
      {
        "marathi_text": "पुतणी",
        "transliteration": "Putani",
        "english_meaning": "Niece (brother's daughter)",
        "usage_note": ""
      },
      {
        "marathi_text": "चुलत भाऊ",
        "transliteration": "Chulat bhau",
        "english_meaning": "Cousin brother (paternal side)",
        "usage_note": ""
      },
      {
        "marathi_text": "चुलत बहीण",
        "transliteration": "Chulat bahin",
        "english_meaning": "Cousin sister (paternal side)",
        "usage_note": ""
      },
      {
        "marathi_text": "मेहुणा",
        "transliteration": "Mehuna",
        "english_meaning": "Brother-in-law (wife's brother)",
        "usage_note": ""
      },
      {
        "marathi_text": "मेहुणी",
        "transliteration": "Mehuni",
        "english_meaning": "Sister-in-law (wife's sister)",
        "usage_note": ""
      },
      {
        "marathi_text": "दीर",
        "transliteration": "Deer",
        "english_meaning": "Brother-in-law (husband's brother)",
        "usage_note": ""
      },
      {
        "marathi_text": "नणंद",
        "transliteration": "Nanand",
        "english_meaning": "Sister-in-law (husband's sister)",
        "usage_note": ""
      },
      {
        "marathi_text": "हे माझं कुटुंब आहे",
        "transliteration": "He majhan kutumb aahe",
        "english_meaning": "This is my family",
        "usage_note": ""
      },
      {
        "marathi_text": "आमच्या घरी किती जण आहेत?",
        "transliteration": "Aamchya ghari kiti jan aahet?",
        "english_meaning": "How many people are in your family?",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 8,
    "title": "Days, Months & Time",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "सोमवार",
        "transliteration": "Somvaar",
        "english_meaning": "Monday",
        "usage_note": ""
      },
      {
        "marathi_text": "मंगळवार",
        "transliteration": "Mangalvaar",
        "english_meaning": "Tuesday",
        "usage_note": ""
      },
      {
        "marathi_text": "बुधवार",
        "transliteration": "Budhvaar",
        "english_meaning": "Wednesday",
        "usage_note": ""
      },
      {
        "marathi_text": "गुरुवार",
        "transliteration": "Guruvaar",
        "english_meaning": "Thursday",
        "usage_note": ""
      },
      {
        "marathi_text": "शुक्रवार",
        "transliteration": "Shukravaar",
        "english_meaning": "Friday",
        "usage_note": ""
      },
      {
        "marathi_text": "शनिवार",
        "transliteration": "Shanivaar",
        "english_meaning": "Saturday",
        "usage_note": ""
      },
      {
        "marathi_text": "रविवार",
        "transliteration": "Ravivaar",
        "english_meaning": "Sunday",
        "usage_note": ""
      },
      {
        "marathi_text": "जानेवारी",
        "transliteration": "Janevari",
        "english_meaning": "January",
        "usage_note": ""
      },
      {
        "marathi_text": "फेब्रुवारी",
        "transliteration": "Februvari",
        "english_meaning": "February",
        "usage_note": ""
      },
      {
        "marathi_text": "मार्च",
        "transliteration": "March",
        "english_meaning": "March",
        "usage_note": ""
      },
      {
        "marathi_text": "एप्रिल",
        "transliteration": "April",
        "english_meaning": "April",
        "usage_note": ""
      },
      {
        "marathi_text": "मे",
        "transliteration": "May",
        "english_meaning": "May",
        "usage_note": ""
      },
      {
        "marathi_text": "जून",
        "transliteration": "June",
        "english_meaning": "June",
        "usage_note": ""
      },
      {
        "marathi_text": "जुलै",
        "transliteration": "Julai",
        "english_meaning": "July",
        "usage_note": ""
      },
      {
        "marathi_text": "ऑगस्ट",
        "transliteration": "August",
        "english_meaning": "August",
        "usage_note": ""
      },
      {
        "marathi_text": "सप्टेंबर",
        "transliteration": "September",
        "english_meaning": "September",
        "usage_note": ""
      },
      {
        "marathi_text": "ऑक्टोबर",
        "transliteration": "October",
        "english_meaning": "October",
        "usage_note": ""
      },
      {
        "marathi_text": "नोव्हेंबर",
        "transliteration": "November",
        "english_meaning": "November",
        "usage_note": ""
      },
      {
        "marathi_text": "डिसेंबर",
        "transliteration": "December",
        "english_meaning": "December",
        "usage_note": ""
      },
      {
        "marathi_text": "पहाट",
        "transliteration": "Pahat",
        "english_meaning": "Dawn",
        "usage_note": ""
      },
      {
        "marathi_text": "सकाळ",
        "transliteration": "Sakaal",
        "english_meaning": "Morning",
        "usage_note": ""
      },
      {
        "marathi_text": "दुपार",
        "transliteration": "Dupaar",
        "english_meaning": "Afternoon",
        "usage_note": ""
      },
      {
        "marathi_text": "संध्याकाळ",
        "transliteration": "Sandhyakaal",
        "english_meaning": "Evening",
        "usage_note": ""
      },
      {
        "marathi_text": "रात्र",
        "transliteration": "Raatra",
        "english_meaning": "Night",
        "usage_note": ""
      },
      {
        "marathi_text": "मध्यरात्र",
        "transliteration": "Madhyaraatra",
        "english_meaning": "Midnight",
        "usage_note": ""
      },
      {
        "marathi_text": "आज",
        "transliteration": "Aaj",
        "english_meaning": "Today",
        "usage_note": ""
      },
      {
        "marathi_text": "उद्या",
        "transliteration": "Udya",
        "english_meaning": "Tomorrow",
        "usage_note": ""
      },
      {
        "marathi_text": "काल",
        "transliteration": "Kaal",
        "english_meaning": "Yesterday",
        "usage_note": "Context decides meaning vs 'time/era'"
      },
      {
        "marathi_text": "आत्ता किती वाजले?",
        "transliteration": "Aatta kiti vajle?",
        "english_meaning": "What time is it now?",
        "usage_note": ""
      },
      {
        "marathi_text": "पुढच्या आठवड्यात",
        "transliteration": "Pudhachya aathavdyat",
        "english_meaning": "Next week",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 9,
    "title": "Common Objects at Home",
    "type": "sentences",
    "estimated_minutes": 90,
    "items": [
      {
        "marathi_text": "घर",
        "transliteration": "Ghar",
        "english_meaning": "House",
        "usage_note": ""
      },
      {
        "marathi_text": "खोली",
        "transliteration": "Kholi",
        "english_meaning": "Room",
        "usage_note": ""
      },
      {
        "marathi_text": "स्वयंपाकघर",
        "transliteration": "Swayampak ghar",
        "english_meaning": "Kitchen",
        "usage_note": ""
      },
      {
        "marathi_text": "बाथरूम",
        "transliteration": "Bathroom",
        "english_meaning": "Bathroom",
        "usage_note": ""
      },
      {
        "marathi_text": "गॅलरी",
        "transliteration": "Gallery",
        "english_meaning": "Balcony",
        "usage_note": ""
      },
      {
        "marathi_text": "खुर्ची",
        "transliteration": "Khurchi",
        "english_meaning": "Chair",
        "usage_note": ""
      },
      {
        "marathi_text": "टेबल",
        "transliteration": "Table",
        "english_meaning": "Table",
        "usage_note": ""
      },
      {
        "marathi_text": "पलंग",
        "transliteration": "Palang",
        "english_meaning": "Bed",
        "usage_note": ""
      },
      {
        "marathi_text": "कपाट",
        "transliteration": "Kapaat",
        "english_meaning": "Cupboard",
        "usage_note": ""
      },
      {
        "marathi_text": "आरसा",
        "transliteration": "Aarsa",
        "english_meaning": "Mirror",
        "usage_note": ""
      },
      {
        "marathi_text": "दार",
        "transliteration": "Daar",
        "english_meaning": "Door",
        "usage_note": ""
      },
      {
        "marathi_text": "खिडकी",
        "transliteration": "Khidki",
        "english_meaning": "Window",
        "usage_note": ""
      },
      {
        "marathi_text": "पंखा",
        "transliteration": "Pankha",
        "english_meaning": "Fan",
        "usage_note": ""
      },
      {
        "marathi_text": "दिवा",
        "transliteration": "Diva",
        "english_meaning": "Light / Lamp",
        "usage_note": ""
      },
      {
        "marathi_text": "ट्यूबलाईट",
        "transliteration": "Tubelight",
        "english_meaning": "Tubelight",
        "usage_note": ""
      },
      {
        "marathi_text": "भांडे",
        "transliteration": "Bhande",
        "english_meaning": "Utensil",
        "usage_note": ""
      },
      {
        "marathi_text": "ताट",
        "transliteration": "Taat",
        "english_meaning": "Plate",
        "usage_note": ""
      },
      {
        "marathi_text": "वाटी",
        "transliteration": "Vaati",
        "english_meaning": "Bowl",
        "usage_note": ""
      },
      {
        "marathi_text": "चमचा",
        "transliteration": "Chamcha",
        "english_meaning": "Spoon",
        "usage_note": ""
      },
      {
        "marathi_text": "ग्लास",
        "transliteration": "Glass",
        "english_meaning": "Glass (drinking)",
        "usage_note": ""
      },
      {
        "marathi_text": "पाणी",
        "transliteration": "Paani",
        "english_meaning": "Water",
        "usage_note": ""
      },
      {
        "marathi_text": "गॅस",
        "transliteration": "Gas",
        "english_meaning": "Gas stove",
        "usage_note": ""
      },
      {
        "marathi_text": "फ्रीज",
        "transliteration": "Fridge",
        "english_meaning": "Refrigerator",
        "usage_note": ""
      },
      {
        "marathi_text": "टीव्ही",
        "transliteration": "TV",
        "english_meaning": "Television",
        "usage_note": ""
      },
      {
        "marathi_text": "मोबाईल",
        "transliteration": "Mobile",
        "english_meaning": "Mobile phone",
        "usage_note": ""
      },
      {
        "marathi_text": "चावी",
        "transliteration": "Chaavi",
        "english_meaning": "Key",
        "usage_note": ""
      },
      {
        "marathi_text": "कुलूप",
        "transliteration": "Kulup",
        "english_meaning": "Lock",
        "usage_note": ""
      },
      {
        "marathi_text": "झाडू",
        "transliteration": "Jhadu",
        "english_meaning": "Broom",
        "usage_note": ""
      },
      {
        "marathi_text": "बादली",
        "transliteration": "Badli",
        "english_meaning": "Bucket",
        "usage_note": ""
      },
      {
        "marathi_text": "टॉवेल",
        "transliteration": "Towel",
        "english_meaning": "Towel",
        "usage_note": ""
      },
      {
        "marathi_text": "साबण",
        "transliteration": "Sabun",
        "english_meaning": "Soap",
        "usage_note": ""
      },
      {
        "marathi_text": "हे कुठे ठेवलं आहे?",
        "transliteration": "He kuthe thevla aahe?",
        "english_meaning": "Where has this been kept?",
        "usage_note": "Practical household question"
      }
    ]
  },
  {
    "id": 10,
    "title": "Colors & Basic Adjectives",
    "type": "sentences",
    "estimated_minutes": 90,
    "items": [
      {
        "marathi_text": "लाल",
        "transliteration": "Laal",
        "english_meaning": "Red",
        "usage_note": ""
      },
      {
        "marathi_text": "निळा",
        "transliteration": "Nila",
        "english_meaning": "Blue",
        "usage_note": ""
      },
      {
        "marathi_text": "पिवळा",
        "transliteration": "Pivla",
        "english_meaning": "Yellow",
        "usage_note": ""
      },
      {
        "marathi_text": "हिरवा",
        "transliteration": "Hirva",
        "english_meaning": "Green",
        "usage_note": ""
      },
      {
        "marathi_text": "काळा",
        "transliteration": "Kaala",
        "english_meaning": "Black",
        "usage_note": ""
      },
      {
        "marathi_text": "पांढरा",
        "transliteration": "Pandhra",
        "english_meaning": "White",
        "usage_note": ""
      },
      {
        "marathi_text": "गुलाबी",
        "transliteration": "Gulabi",
        "english_meaning": "Pink",
        "usage_note": ""
      },
      {
        "marathi_text": "जांभळा",
        "transliteration": "Jambhla",
        "english_meaning": "Purple",
        "usage_note": ""
      },
      {
        "marathi_text": "केशरी",
        "transliteration": "Keshari",
        "english_meaning": "Orange",
        "usage_note": ""
      },
      {
        "marathi_text": "तपकिरी",
        "transliteration": "Tapkiri",
        "english_meaning": "Brown",
        "usage_note": ""
      },
      {
        "marathi_text": "राखाडी",
        "transliteration": "Rakhadi",
        "english_meaning": "Grey",
        "usage_note": ""
      },
      {
        "marathi_text": "सोनेरी",
        "transliteration": "Soneri",
        "english_meaning": "Golden",
        "usage_note": ""
      },
      {
        "marathi_text": "मोठं",
        "transliteration": "Motha",
        "english_meaning": "Big",
        "usage_note": ""
      },
      {
        "marathi_text": "लहान",
        "transliteration": "Lahaan",
        "english_meaning": "Small",
        "usage_note": ""
      },
      {
        "marathi_text": "चांगलं",
        "transliteration": "Changla",
        "english_meaning": "Good",
        "usage_note": ""
      },
      {
        "marathi_text": "वाईट",
        "transliteration": "Vaait",
        "english_meaning": "Bad",
        "usage_note": ""
      },
      {
        "marathi_text": "गरम",
        "transliteration": "Garam",
        "english_meaning": "Hot",
        "usage_note": ""
      },
      {
        "marathi_text": "थंड",
        "transliteration": "Thand",
        "english_meaning": "Cold",
        "usage_note": ""
      },
      {
        "marathi_text": "स्वच्छ",
        "transliteration": "Swachh",
        "english_meaning": "Clean",
        "usage_note": ""
      },
      {
        "marathi_text": "घाणेरडं",
        "transliteration": "Ghanerda",
        "english_meaning": "Dirty",
        "usage_note": ""
      },
      {
        "marathi_text": "जड",
        "transliteration": "Jad",
        "english_meaning": "Heavy",
        "usage_note": ""
      },
      {
        "marathi_text": "हलकं",
        "transliteration": "Halka",
        "english_meaning": "Light (weight)",
        "usage_note": ""
      },
      {
        "marathi_text": "लांब",
        "transliteration": "Laamb",
        "english_meaning": "Long",
        "usage_note": ""
      },
      {
        "marathi_text": "आखूड",
        "transliteration": "Aakhud",
        "english_meaning": "Short",
        "usage_note": ""
      },
      {
        "marathi_text": "रुंद",
        "transliteration": "Rund",
        "english_meaning": "Wide",
        "usage_note": ""
      },
      {
        "marathi_text": "अरुंद",
        "transliteration": "Arund",
        "english_meaning": "Narrow",
        "usage_note": ""
      },
      {
        "marathi_text": "सोपं",
        "transliteration": "Sopa",
        "english_meaning": "Easy",
        "usage_note": ""
      },
      {
        "marathi_text": "अवघड",
        "transliteration": "Avghad",
        "english_meaning": "Difficult",
        "usage_note": ""
      },
      {
        "marathi_text": "नवीन",
        "transliteration": "Naveen",
        "english_meaning": "New",
        "usage_note": ""
      },
      {
        "marathi_text": "जुनं",
        "transliteration": "Juna",
        "english_meaning": "Old",
        "usage_note": ""
      },
      {
        "marathi_text": "सुंदर",
        "transliteration": "Sundar",
        "english_meaning": "Beautiful",
        "usage_note": ""
      },
      {
        "marathi_text": "जलद",
        "transliteration": "Jalad",
        "english_meaning": "Fast",
        "usage_note": ""
      },
      {
        "marathi_text": "हळू",
        "transliteration": "Halu",
        "english_meaning": "Slow",
        "usage_note": ""
      },
      {
        "marathi_text": "शांत",
        "transliteration": "Shaant",
        "english_meaning": "Quiet / Calm",
        "usage_note": ""
      },
      {
        "marathi_text": "हे रंग मला आवडतात",
        "transliteration": "He rang mala aavadtat",
        "english_meaning": "I like these colors",
        "usage_note": "Practice sentence combining vocabulary"
      }
    ]
  },
  {
    "id": 11,
    "title": "Pronouns, Possessives & Simple Sentences",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "मी",
        "transliteration": "Mi",
        "english_meaning": "I",
        "usage_note": ""
      },
      {
        "marathi_text": "तू",
        "transliteration": "Tu",
        "english_meaning": "You",
        "usage_note": "Informal"
      },
      {
        "marathi_text": "तो",
        "transliteration": "To",
        "english_meaning": "He",
        "usage_note": ""
      },
      {
        "marathi_text": "ती",
        "transliteration": "Ti",
        "english_meaning": "She",
        "usage_note": ""
      },
      {
        "marathi_text": "ते",
        "transliteration": "Te",
        "english_meaning": "It / They (neutral)",
        "usage_note": ""
      },
      {
        "marathi_text": "आम्ही",
        "transliteration": "Aamhi",
        "english_meaning": "We",
        "usage_note": ""
      },
      {
        "marathi_text": "तुम्ही",
        "transliteration": "Tumhi",
        "english_meaning": "You",
        "usage_note": "Formal / plural"
      },
      {
        "marathi_text": "माझा / माझी / माझं",
        "transliteration": "Majha / Majhi / Majhan",
        "english_meaning": "My",
        "usage_note": "Changes with gender of the noun owned"
      },
      {
        "marathi_text": "तुझा / तुझी / तुझं",
        "transliteration": "Tujha / Tujhi / Tujhan",
        "english_meaning": "Your (informal)",
        "usage_note": ""
      },
      {
        "marathi_text": "त्याचा / त्याची / त्याचं",
        "transliteration": "Tyacha / Tyachi / Tyachan",
        "english_meaning": "His",
        "usage_note": ""
      },
      {
        "marathi_text": "तिचा / तिची / तिचं",
        "transliteration": "Ticha / Tichi / Tichan",
        "english_meaning": "Her",
        "usage_note": ""
      },
      {
        "marathi_text": "आमचा / आमची / आमचं",
        "transliteration": "Aamcha / Aamchi / Aamchan",
        "english_meaning": "Our",
        "usage_note": ""
      },
      {
        "marathi_text": "तुमचा / तुमची / तुमचं",
        "transliteration": "Tumcha / Tumchi / Tumchan",
        "english_meaning": "Your (formal)",
        "usage_note": ""
      },
      {
        "marathi_text": "त्यांचा / त्यांची / त्यांचं",
        "transliteration": "Tyancha / Tyanchi / Tyanchan",
        "english_meaning": "Their",
        "usage_note": ""
      },
      {
        "marathi_text": "मी जातो",
        "transliteration": "Mi jaato",
        "english_meaning": "I go",
        "usage_note": "Male speaker; female uses 'jaate'"
      },
      {
        "marathi_text": "तू येतोस",
        "transliteration": "Tu yetos",
        "english_meaning": "You come",
        "usage_note": "Male listener; female 'yetes'"
      },
      {
        "marathi_text": "तो बसतो",
        "transliteration": "To basto",
        "english_meaning": "He sits",
        "usage_note": ""
      },
      {
        "marathi_text": "ती उभी आहे",
        "transliteration": "Ti ubhi aahe",
        "english_meaning": "She is standing",
        "usage_note": ""
      },
      {
        "marathi_text": "आम्ही खातो",
        "transliteration": "Aamhi khaato",
        "english_meaning": "We eat",
        "usage_note": ""
      },
      {
        "marathi_text": "तुम्ही बघता",
        "transliteration": "Tumhi baghata",
        "english_meaning": "You see/watch",
        "usage_note": ""
      },
      {
        "marathi_text": "ते बोलतात",
        "transliteration": "Te bolatat",
        "english_meaning": "They speak",
        "usage_note": ""
      },
      {
        "marathi_text": "हे माझं आहे",
        "transliteration": "He majhan aahe",
        "english_meaning": "This is mine",
        "usage_note": ""
      },
      {
        "marathi_text": "ते तुझं आहे",
        "transliteration": "Te tujhan aahe",
        "english_meaning": "That is yours",
        "usage_note": ""
      },
      {
        "marathi_text": "हा माझा भाऊ आहे",
        "transliteration": "Ha majha bhau aahe",
        "english_meaning": "This is my brother",
        "usage_note": "Combines possessive + family word"
      },
      {
        "marathi_text": "ही तुमची बॅग आहे का?",
        "transliteration": "Hi tumchi bag aahe ka?",
        "english_meaning": "Is this your bag?",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 12,
    "title": "Yes/No & Basic Questions",
    "type": "sentences",
    "estimated_minutes": 60,
    "items": [
      {
        "marathi_text": "हो",
        "transliteration": "Ho",
        "english_meaning": "Yes",
        "usage_note": "Standard polite agreement"
      },
      {
        "marathi_text": "नाही",
        "transliteration": "Naahi",
        "english_meaning": "No",
        "usage_note": "Standard negation"
      },
      {
        "marathi_text": "होय, बरोबर आहे",
        "transliteration": "Hoy, barobar aahe",
        "english_meaning": "Yes, that is correct",
        "usage_note": ""
      },
      {
        "marathi_text": "नाही, हे चुकीचे आहे",
        "transliteration": "Naahi, he chukiche aahe",
        "english_meaning": "No, this is incorrect",
        "usage_note": ""
      },
      {
        "marathi_text": "तुम्ही कोण आहात?",
        "transliteration": "Tumhi kon aahat?",
        "english_meaning": "Who are you?",
        "usage_note": "Formal question"
      },
      {
        "marathi_text": "हे काय आहे?",
        "transliteration": "He kay aahe?",
        "english_meaning": "What is this?",
        "usage_note": ""
      },
      {
        "marathi_text": "ते कुठे आहे?",
        "transliteration": "Te kuthe aahe?",
        "english_meaning": "Where is that?",
        "usage_note": ""
      },
      {
        "marathi_text": "तुम्हाला मदत हवी आहे का?",
        "transliteration": "Tumhala madat havi aahe ka?",
        "english_meaning": "Do you need help?",
        "usage_note": ""
      },
      {
        "marathi_text": "तुम्ही कधी येणार?",
        "transliteration": "Tumhi kadhi yenar?",
        "english_meaning": "When will you come?",
        "usage_note": ""
      },
      {
        "marathi_text": "हे किती लांब आहे?",
        "transliteration": "He kiti laamb aahe?",
        "english_meaning": "How far is this?",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 13,
    "title": "Likes, Dislikes & Preferences",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "मला चहा आवडतो",
        "transliteration": "Mala chaha aavadato",
        "english_meaning": "I like tea",
        "usage_note": "Masc/fem object agreement: 'tea' is masculine, so 'aavadato'"
      },
      {
        "marathi_text": "मला कॉफी आवडते",
        "transliteration": "Mala coffee aavadate",
        "english_meaning": "I like coffee",
        "usage_note": "'coffee' is feminine, so 'aavadate'"
      },
      {
        "marathi_text": "मला हे आंबे आवडतात",
        "transliteration": "Mala he aambe aavadtat",
        "english_meaning": "I like these mangoes",
        "usage_note": "Plural object agreement: 'aavadtat'"
      },
      {
        "marathi_text": "मला खोटं बोलणं आवडत नाही",
        "transliteration": "Mala khota bolna aavadat naahi",
        "english_meaning": "I do not like lying",
        "usage_note": "Expressing dislike"
      },
      {
        "marathi_text": "तुम्हाला काय आवडतं?",
        "transliteration": "Tumhala kay aavadta?",
        "english_meaning": "What do you like?",
        "usage_note": "General question"
      },
      {
        "marathi_text": "मला फिरायला जायला आवडतं",
        "transliteration": "Mala firaayla jaayla aavadta",
        "english_meaning": "I like to go for walks/travel",
        "usage_note": ""
      },
      {
        "marathi_text": "मला मसालेदार जेवण आवडत नाही",
        "transliteration": "Mala masaaledaar jevan aavadat naahi",
        "english_meaning": "I do not like spicy food",
        "usage_note": ""
      },
      {
        "marathi_text": "मला शांतता आवडते",
        "transliteration": "Mala shaantata aavadate",
        "english_meaning": "I like quiet/peace",
        "usage_note": ""
      },
      {
        "marathi_text": "मला चित्रपट बघायला आवडतात",
        "transliteration": "Mala chitrapat baghaayla aavadtat",
        "english_meaning": "I like watching movies",
        "usage_note": ""
      },
      {
        "marathi_text": "मला मराठी गाणी खूप आवडतात",
        "transliteration": "Mala Marathi gaani khup aavadtat",
        "english_meaning": "I like Marathi songs a lot",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 14,
    "title": "Everyday Routine Verbs",
    "type": "sentences",
    "estimated_minutes": 75,
    "items": [
      {
        "marathi_text": "मी सकाळी लवकर उठतो",
        "transliteration": "Mi sakali lavkar uthato",
        "english_meaning": "I wake up early in the morning",
        "usage_note": "Male speaker; female uses 'uthathe'"
      },
      {
        "marathi_text": "मी दात घासतो",
        "transliteration": "Mi daat ghaasato",
        "english_meaning": "I brush my teeth",
        "usage_note": "Male speaker; female uses 'ghaasate'"
      },
      {
        "marathi_text": "मी रोज व्यायाम करतो",
        "transliteration": "Mi roj vyaayaam karto",
        "english_meaning": "I exercise daily",
        "usage_note": "Male speaker; female uses 'karte'"
      },
      {
        "marathi_text": "मी स्नान करतो आणि तयार होतो",
        "transliteration": "Mi snaan karto aani tayar hoto",
        "english_meaning": "I take a bath and get ready",
        "usage_note": "Male speaker; female uses 'karte... hote'"
      },
      {
        "marathi_text": "मी नऊ वाजता कामाला जातो",
        "transliteration": "Mi nau vajata kaamala jaato",
        "english_meaning": "I go to work at nine o'clock",
        "usage_note": "Male speaker; female uses 'jaate'"
      },
      {
        "marathi_text": "मी संध्याकाळी घरी परत येतो",
        "transliteration": "Mi sandhyakaali ghari parat yeto",
        "english_meaning": "I return home in the evening",
        "usage_note": "Male speaker; female uses 'yete'"
      },
      {
        "marathi_text": "मी रात्रीचे जेवण खातो",
        "transliteration": "Mi raatriche jevan khaato",
        "english_meaning": "I eat dinner",
        "usage_note": "Male speaker; female uses 'khaate'"
      },
      {
        "marathi_text": "मी अकरा वाजता झोपतो",
        "transliteration": "Mi akara vajata jhopato",
        "english_meaning": "I sleep at eleven o'clock",
        "usage_note": "Male speaker; female uses 'jhopate'"
      },
      {
        "marathi_text": "तो दररोज वर्तमानपत्र वाचतो",
        "transliteration": "To dararoj vartamaanpatra vaachto",
        "english_meaning": "He reads the newspaper daily",
        "usage_note": ""
      },
      {
        "marathi_text": "ती संध्याकाळी स्वयंपाक करते",
        "transliteration": "Ti sandhyakaali swayampaak karte",
        "english_meaning": "She cooks in the evening",
        "usage_note": ""
      }
    ]
  },
  {
    "id": 15,
    "title": "Mixed Cumulative Review",
    "type": "sentences",
    "estimated_minutes": 90,
    "items": [
      {
        "marathi_text": "नमस्कार! कसं आहेस?",
        "transliteration": "Namaskar! Kasa aahes?",
        "english_meaning": "Hello! How are you?",
        "usage_note": "Informal greeting to a male"
      },
      {
        "marathi_text": "मी मुंबईत राहतो",
        "transliteration": "Mi Mumbait raahato",
        "english_meaning": "I live in Mumbai",
        "usage_note": "Male speaker; female uses 'raahate'"
      },
      {
        "marathi_text": "हे किती रुपये आहे?",
        "transliteration": "He kiti rupaye aahe?",
        "english_meaning": "How many rupees is this?",
        "usage_note": "Common shopping question"
      },
      {
        "marathi_text": "माझ्याकडे सुट्टे पैसे नाहीत",
        "transliteration": "Majhyakade sutte paise naahit",
        "english_meaning": "I don't have change",
        "usage_note": ""
      },
      {
        "marathi_text": "तो माझा भाऊ आहे",
        "transliteration": "To majha bhau aahe",
        "english_meaning": "He is my brother",
        "usage_note": ""
      },
      {
        "marathi_text": "आज रविवार आहे आणि उद्या सुट्टी आहे",
        "transliteration": "Aaj ravivaar aahe aani udya sutti aahe",
        "english_meaning": "Today is Sunday and tomorrow is a holiday",
        "usage_note": ""
      },
      {
        "marathi_text": "खोलीत दोन खुर्च्या आहेत",
        "transliteration": "Kholiit don khurchya aahet",
        "english_meaning": "There are two chairs in the room",
        "usage_note": ""
      },
      {
        "marathi_text": "मला लाल रंग आवडतो",
        "transliteration": "Mala laal rang aavadato",
        "english_meaning": "I like red color",
        "usage_note": ""
      },
      {
        "marathi_text": "कृपया थोडे हळू बोला",
        "transliteration": "Krupaya thode halu bola",
        "english_meaning": "Please speak a little slowly",
        "usage_note": ""
      },
      {
        "marathi_text": "काम पूर्ण झालं, धन्यवाद!",
        "transliteration": "Kaam purna jhala, dhanyavaad!",
        "english_meaning": "Work is done, thank you!",
        "usage_note": ""
      }
    ]
  }
];
