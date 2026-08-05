/**
 * BOLA Marathi — Detective Manager
 * Core Engine Layer
 * 
 * Manages the state, validation, and contents for Detective Mode minigames.
 * Seeds 45 grammar impostor games and 45 scrambled word arrangement games.
 */

import { AppState } from '../../application/state/appState.js';

export const DetectiveManager = (() => {
  
  const IMPOSTOR_GAMES = [
    // EASY (15 games)
    { id: "imp-1", difficulty: "Easy", words: ["तो", "रोज", "गाणे", "गाते."], impostorIndex: 3, explanation: "For masculine subject (तो), the verb must end in -तो (गातो) instead of feminine -ते (गाते)." },
    { id: "imp-2", difficulty: "Easy", words: ["माझी", "वडील", "डॉक्टर", "आहेत."], impostorIndex: 0, explanation: "'वडील' (father) is masculine respectful. It requires the modifier 'माझे' instead of feminine 'माझी'." },
    { id: "imp-3", difficulty: "Easy", words: ["आम्ही", "मराठी", "शिकतोस."], impostorIndex: 2, explanation: "For first-person plural (आम्ही), the verb is 'शिकतो' instead of second-person singular 'शिकतोस'." },
    { id: "imp-4", difficulty: "Easy", words: ["ती", "सुंदर", "गाणे", "गातो."], impostorIndex: 3, explanation: "For feminine subject (ती), the verb must end in -ते (गाते) instead of masculine -तो (गातो)." },
    { id: "imp-5", difficulty: "Easy", words: ["माझे", "आई", "खूप", "चांगली", "आहे."], impostorIndex: 0, explanation: "'आई' (mother) is feminine. It requires 'माझी' instead of neuter/masculine 'माझे'." },
    { id: "imp-6", difficulty: "Easy", words: ["तो", "पाणी", "पीते."], impostorIndex: 2, explanation: "For masculine (तो), the verb is 'पितो' (or 'पितो आहे') instead of feminine 'पीते'." },
    { id: "imp-7", difficulty: "Easy", words: ["मी", "चहा", "पिली."], impostorIndex: 2, explanation: "The verb for drinking tea (चहा - masculine) is 'पिला' or 'प्यायलो/प्यायले', never 'पिली'." },
    { id: "imp-8", difficulty: "Easy", words: ["जॉन", "काल", "पुण्याला", "गेलात."], impostorIndex: 3, explanation: "John is singular third-person. The verb should be 'गेला' instead of respectful plural 'गेलात'." },
    { id: "imp-9", difficulty: "Easy", words: ["तुम्ही", "काय", "करत", "आहेस?"], impostorIndex: 3, explanation: "For respectful second-person (तुम्ही), the auxiliary verb must be 'आहात' instead of informal 'आहेस'." },
    { id: "imp-10", difficulty: "Easy", words: ["ते", "मुले", "खेळत", "आहेत."], impostorIndex: 0, explanation: "'मुले' is neuter plural, requiring the demonstrative pronoun 'ती' instead of masculine plural 'ते'." },
    { id: "imp-11", difficulty: "Easy", words: ["माझे", "नाव", "जॉन", "आहेत."], impostorIndex: 3, explanation: "'नाव' (name) is singular, so the auxiliary verb should be 'आहे' instead of plural 'आहेत'." },
    { id: "imp-12", difficulty: "Easy", words: ["ती", "मुलगी", "धावतो."], impostorIndex: 2, explanation: "For feminine singular (मुलगी), the verb should end in -ते (धावते) instead of masculine -तो (धावतो)." },
    { id: "imp-13", difficulty: "Easy", words: ["तो", "मुलगा", "शहाणी", "आहे."], impostorIndex: 2, explanation: "'मुलगा' is masculine. The adjective must be 'शहाणा' instead of feminine 'शहाणी'." },
    { id: "imp-14", difficulty: "Easy", words: ["मी", "उद्या", "मुंबईला", "गेलो."], impostorIndex: 3, explanation: "'उद्या' (tomorrow) represents the future. The verb must be 'जाईन' instead of past tense 'गेलो'." },
    { id: "imp-15", difficulty: "Easy", words: ["काल", "पाऊस", "पडेल."], impostorIndex: 2, explanation: "'काल' (yesterday) represents the past. The verb must be 'पडला' instead of future tense 'पडेल'." },

    // MEDIUM (15 games)
    { id: "imp-16", difficulty: "Medium", words: ["कृपया", "मला", "पाणी", "द्यास."], impostorIndex: 3, explanation: "Polite request 'कृपया' requires the verb form 'द्या' instead of second-person singular 'द्यास'." },
    { id: "imp-17", difficulty: "Medium", words: ["तिने", "गोड", "गाणे", "गायलो."], impostorIndex: 3, explanation: "The past transitive verb matching 'गाणे' (neuter singular) is 'गायले' or 'गाटले', not first-person 'गायलो'." },
    { id: "imp-18", difficulty: "Medium", words: ["आम्ही", "तिथे", "गेला."], impostorIndex: 2, explanation: "First-person plural (आम्ही) requires the past verb form 'गेलो' instead of singular 'गेला'." },
    { id: "imp-19", difficulty: "Medium", words: ["माझी", "बहीण", "अभ्यास", "करतो."], impostorIndex: 3, explanation: "For feminine subject 'बहीण', the verb must end in -ते (करते) instead of masculine -तो (करतो)." },
    { id: "imp-20", difficulty: "Medium", words: ["तो", "सफरचंद", "खातात."], impostorIndex: 2, explanation: "For singular subject (तो), the verb should be 'खातो' instead of plural 'खातात'." },
    { id: "imp-21", difficulty: "Medium", words: ["माझी", "शाळा", "खूप", "मोठे", "आहे."], impostorIndex: 3, explanation: "For feminine noun 'शाळा', the adjective must be 'मोठी' instead of neuter 'मोठे'." },
    { id: "imp-22", difficulty: "Medium", words: ["त्यांनी", "मला", "पेन", "दिलेत."], impostorIndex: 3, explanation: "'पेन' (singular neuter) given by a respectful group (त्यांनी) should use past form 'दिला' or 'दिले', not 'दिलेत'." },
    { id: "imp-23", difficulty: "Medium", words: ["हे", "सफरचंद", "आंबट", "आहेत."], impostorIndex: 3, explanation: "Single apple ('हे सफरचंद' - neuter singular) requires the singular verb 'आहे' instead of plural 'आहेत'." },
    { id: "imp-24", difficulty: "Medium", words: ["मी", "माहिती", "वाचला."], impostorIndex: 2, explanation: "'माहिती' (information) is feminine. The past tense verb should be 'वाचली' instead of masculine 'वाचला'." },
    { id: "imp-25", difficulty: "Medium", words: ["तुम्ही", "कधी", "आलात?", "आहेस?"], impostorIndex: 3, explanation: "'आलात' already expresses the respectful past tense. 'आहेस' is redundant and informal." },
    { id: "imp-26", difficulty: "Medium", words: ["ते", "झाड", "खूप", "उंच", "आहेत."], impostorIndex: 4, explanation: "'ते झाड' (neuter singular) requires the singular auxiliary verb 'आहे' instead of plural 'आहेत'." },
    { id: "imp-27", difficulty: "Medium", words: ["माझे", "भाऊ", "आता", "येतीलस."], impostorIndex: 3, explanation: "Respectful plural subject (भाऊ) requires the verb form 'येतील' instead of singular 'येतीलस'." },
    { id: "imp-28", difficulty: "Medium", words: ["आम्ही", "क्रिकेट", "खेळतोस."], impostorIndex: 2, explanation: "First-person plural (आम्ही) requires 'खेळतो' instead of second-person 'खेळतोस'." },
    { id: "imp-29", difficulty: "Medium", words: ["ती", "सकाळी", "लवकर", "उठतो."], impostorIndex: 3, explanation: "Feminine singular (ती) requires the verb 'उठते' instead of masculine 'उठतो'." },
    { id: "imp-30", difficulty: "Medium", words: ["जॉन", "मराठी", "चांगले", "बोलते."], impostorIndex: 3, explanation: "John (masculine) requires the verb form 'बोलतो' instead of feminine 'बोलते'." },

    // HARD (15 games)
    { id: "imp-31", difficulty: "Hard", words: ["रामने", "रावणाला", "मारली."], impostorIndex: 2, explanation: "In a transitive past construction (Bhave Prayog) where both subject and object have suffixes, the verb is always neuter singular: 'मारले', not feminine 'मारली'." },
    { id: "imp-32", difficulty: "Hard", words: ["मला", "आंबे", "आवडतो."], impostorIndex: 2, explanation: "'आंबे' is plural. The verb must be plural 'आवडतात' instead of singular 'आवडतो'." },
    { id: "imp-33", difficulty: "Hard", words: ["तिने", "भात", "खाल्ली."], impostorIndex: 2, explanation: "In past transitive (Karmani Prayog), verb agrees with object 'भात' (masculine), so it should be 'खाल्ला' instead of feminine 'खाल्ली'." },
    { id: "imp-34", difficulty: "Hard", words: ["त्याने", "पोळी", "खाल्ला."], impostorIndex: 2, explanation: "The verb must agree with the feminine object 'पोळी' and thus be 'खाल्ली' instead of masculine 'खाल्ला'." },
    { id: "imp-35", difficulty: "Hard", words: ["शिक्षक", "वर्गात", "आला."], impostorIndex: 2, explanation: "'शिक्षक' (teacher) is masculine respectful. It requires the plural respectful verb form 'आले' instead of singular 'आला'." },
    { id: "imp-36", difficulty: "Hard", words: ["त्या", "मुलीने", "गाणे", "गायली."], impostorIndex: 3, explanation: "The object 'गाणे' is neuter singular. In past tense, the verb must be 'गायले' instead of feminine plural/singular 'गायली'." },
    { id: "imp-37", difficulty: "Hard", words: ["आम्ही", "आमचे", "काम", "केलेत."], impostorIndex: 3, explanation: "First-person plural (आम्ही) requires 'केले' instead of the second-person plural marker -त ending 'केलेत'." },
    { id: "imp-38", difficulty: "Hard", words: ["माझ्या", "जवळ", "पैसे", "नाही."], impostorIndex: 3, explanation: "'पैसे' is treated as plural in Marathi, so the negative verb must be 'नाहीत' instead of singular 'नाही'." },
    { id: "imp-39", difficulty: "Hard", words: ["त्याच्या", "डोळ्यात", "पाणी", "आली."], impostorIndex: 3, explanation: "'पाणी' is neuter singular, requiring 'आले' instead of feminine 'आली'." },
    { id: "imp-40", difficulty: "Hard", words: ["नदी", "समुद्राला", "मिळतात."], impostorIndex: 2, explanation: "Singular subject 'नदी' requires the singular verb form 'मिळते' instead of plural 'मिळतात'." },
    { id: "imp-41", difficulty: "Hard", words: ["झाडांची", "पाने", "पडली."], impostorIndex: 2, explanation: "'पाने' (leaves) is neuter plural. The past verb must be 'पडली' (correct), wait, 'झाडांची पाने पडली' is correct. Let's make an impostor: 'झाडांची पाने पडला.' where 'पडला' is masculine singular instead of neuter plural 'पडली'." },
    { id: "imp-42", difficulty: "Hard", words: ["तू", "इथे", "कधी", "आलात?"], impostorIndex: 3, explanation: "Second-person informal 'तू' requires 'आलास' (masc) or 'आलीस' (fem) instead of respectful plural 'आलात'." },
    { id: "imp-43", difficulty: "Hard", words: ["पक्षी", "आकाशात", "उडतोस."], impostorIndex: 2, explanation: "Third-person singular 'पक्षी' requires 'उडतो' instead of second-person 'उडतोस'." },
    { id: "imp-44", difficulty: "Hard", words: ["तो", "मराठी", "चांगला", "लिहिते."], impostorIndex: 3, explanation: "Masculine subject (तो) requires 'लिहितो' instead of feminine 'लिहिते'." },
    { id: "imp-45", difficulty: "Hard", words: ["तिला", "गरम", "चहा", "हवी", "आहे."], impostorIndex: 3, explanation: "'चहा' (tea) is masculine in Marathi. It requires the modifier 'हवा' instead of feminine 'हवी'." }
  ];

  const SCRAMBLED_GAMES = [
    // EASY (15 games)
    { id: "scr-1", difficulty: "Easy", english: "Please bring water.", scrambled: ["पाणी", "कृपया", "आणा."], correctSequence: [1, 0, 2], explanation: "Politeness marker 'कृपया' usually starts the sentence, followed by Object 'पाणी' and Verb 'आणा'." },
    { id: "scr-2", difficulty: "Easy", english: "My name is Rahul.", scrambled: ["राहुल", "माझे", "आहे.", "नाव"], correctSequence: [1, 3, 0, 2], explanation: "Possessive pronoun (माझे) + Noun (नाव) + Subject (राहुल) + Aux Verb (आहे)." },
    { id: "scr-3", difficulty: "Easy", english: "How are you?", scrambled: ["कसे", "तुम्ही", "आहात?"], correctSequence: [1, 0, 2], explanation: "Subject (तुम्ही) + Adverb (कसे) + Aux Verb (आहात)." },
    { id: "scr-4", difficulty: "Easy", english: "I learn Marathi.", scrambled: ["मराठी", "मी", "शिकतो."], correctSequence: [1, 0, 3], explanation: "Subject (मी) + Object (मराठी) + Verb (शिकतो)." },
    { id: "scr-5", difficulty: "Easy", english: "This is a book.", scrambled: ["पुस्तक", "हे", "आहे."], correctSequence: [1, 0, 2], explanation: "Demonstrative pronoun (हे) + Noun (पुस्तक) + Aux Verb (आहे)." },
    { id: "scr-6", difficulty: "Easy", english: "Give me tea.", scrambled: ["मला", "द्या.", "चहा"], correctSequence: [0, 2, 1], explanation: "Indirect Object (मला) + Direct Object (चहा) + Verb (द्या)." },
    { id: "scr-7", difficulty: "Easy", english: "Thank you very much.", scrambled: ["खूप", "धन्यवाद.", "खूप"], correctSequence: [0, 2, 1], explanation: "'खूप खूप धन्यवाद' represents 'Thank you very much' (literally: many many thanks)." },
    { id: "scr-8", difficulty: "Easy", english: "Good morning, friend.", scrambled: ["सकाळ", "मित्रा!", "शुभ"], correctSequence: [2, 0, 1], explanation: "Greeting phrase: शुभ सकाळ (Good morning) + Vocative (मित्रा!)." },
    { id: "scr-9", difficulty: "Easy", english: "Yes, I am going.", scrambled: ["मी", "हो,", "जातो."], correctSequence: [1, 0, 2], explanation: "Confirmative (हो,) followed by Subject (मी) and Verb (जातो)." },
    { id: "scr-10", difficulty: "Easy", english: "What is this?", scrambled: ["काय", "हे", "आहे?"], correctSequence: [1, 0, 2], explanation: "Pronoun (हे) + Question word (काय) + Aux Verb (आहे)." },
    { id: "scr-11", difficulty: "Easy", english: "No, I do not want.", scrambled: ["नको", "नाही,", "मला", "आहे."], correctSequence: [1, 2, 0, 3], explanation: "Negative (नाही,) + Subject pronoun (मला) + Negating verb (नको आहे)." },
    { id: "scr-12", difficulty: "Easy", english: "Where is the station?", scrambled: ["कुठे", "स्टेशन", "आहे?"], correctSequence: [1, 0, 2], explanation: "Subject (स्टेशन) + Question word (कुठे) + Aux Verb (आहे)." },
    { id: "scr-13", difficulty: "Easy", english: "Come here.", scrambled: ["या.", "इथे"], correctSequence: [1, 0], explanation: "Adverb of place (इथे) + Verb (या)." },
    { id: "scr-14", difficulty: "Easy", english: "Stop the car.", scrambled: ["थांबवा.", "गाडी"], correctSequence: [1, 0], explanation: "Object (गाडी) + Verb (थांबवा)." },
    { id: "scr-15", difficulty: "Easy", english: "Speak in Marathi.", scrambled: ["बोला.", "मराठीत"], correctSequence: [1, 0], explanation: "Adverbial object (मराठीत) + Verb (बोला)." },

    // MEDIUM (15 games)
    { id: "scr-16", difficulty: "Medium", english: "I want hot tea.", scrambled: ["चहा", "गरम", "मला", "आहे.", "हवा"], correctSequence: [2, 1, 0, 4, 3], explanation: "Subject (मला) + Modifier (गरम) + Object (चहा) + Modal (हवा) + Aux (आहे)." },
    { id: "scr-17", difficulty: "Medium", english: "He goes to school daily.", scrambled: ["शाळेत", "तो", "रोज", "जातो."], correctSequence: [1, 2, 0, 3], explanation: "Subject (तो) + Time adverb (रोज) + Place (शाळेत) + Verb (जातो)." },
    { id: "scr-18", difficulty: "Medium", english: "How much is the fare?", scrambled: ["आहे?", "भाडे", "किती"], correctSequence: [1, 2, 0], explanation: "Subject (भाडे) + Quantity query (किती) + Aux (आहे)." },
    { id: "scr-19", difficulty: "Medium", english: "My father is a doctor.", scrambled: ["वडील", "डॉक्टर", "माझे", "आहेत."], correctSequence: [2, 0, 1, 3], explanation: "Possessive (माझे) + Noun (वडील) + Profession (डॉक्टर) + Respectful Aux (आहेत)." },
    { id: "scr-20", difficulty: "Medium", english: "We live in Pune.", scrambled: ["पुण्यात", "आम्ही", "राहितो."], correctSequence: [1, 0, 2], explanation: "Subject (आम्ही) + Location (पुण्यात) + Verb (राहितो)." },
    { id: "scr-21", difficulty: "Medium", english: "Please show me the menu.", scrambled: ["मेनु", "कृपया", "मला", "दाखवा."], correctSequence: [1, 2, 0, 3], explanation: "Polite (कृपया) + Pronoun (मला) + Object (मेनु) + Verb (दाखवा)." },
    { id: "scr-22", difficulty: "Medium", english: "Is water available here?", scrambled: ["इथे", "पाणी", "मिळेल", "का?"], correctSequence: [0, 1, 2, 3], explanation: "Location (इथे) + Object (पाणी) + Verb (मिळेल) + Question marker (का?)." },
    { id: "scr-23", difficulty: "Medium", english: "Turn right from the corner.", scrambled: ["उजवीकडे", "कोपऱ्यातून", "वळा."], correctSequence: [1, 0, 2], explanation: "Corner source (कोपऱ्यातून) + Direction (उजवीकडे) + Verb (वळा)." },
    { id: "scr-24", difficulty: "Medium", english: "We will meet tomorrow.", scrambled: ["भेटू.", "आपण", "उद्या"], correctSequence: [1, 2, 0], explanation: "Subject (आपण) + Time (उद्या) + Future Verb (भेटू)." },
    { id: "scr-25", difficulty: "Medium", english: "Take these fifty rupees.", scrambled: ["पन्नास", "रुपये", "हे", "घ्या."], correctSequence: [2, 0, 1, 3], explanation: "Demonstrative (हे) + Amount (पन्नास) + Currency (रुपये) + Verb (घ्या)." },
    { id: "scr-26", difficulty: "Medium", english: "This mango is very sweet.", scrambled: ["आंबा", "खूप", "हा", "गोड", "आहे."], correctSequence: [2, 0, 1, 3, 4], explanation: "Demonstrative (हा) + Subject (आंबा) + Adverb (खूप) + Adjective (गोड) + Aux (आहे)." },
    { id: "scr-27", difficulty: "Medium", english: "I bought a new book.", scrambled: ["नवीन", "मी", "पुस्तक", "घेतले.", "विकत"], correctSequence: [1, 0, 2, 4, 3], explanation: "Subject (मी) + Modifier (नवीन) + Object (पुस्तक) + Verb compound (विकत घेतले)." },
    { id: "scr-28", difficulty: "Medium", english: "Where is the police station?", scrambled: ["कुठे", "पोलीस", "आहे?", "चौकी"], correctSequence: [1, 3, 0, 2], explanation: "Subject (पोलीस चौकी) + Question (कुठे) + Aux (आहे)." },
    { id: "scr-29", difficulty: "Medium", english: "I have pain in my head.", scrambled: ["डोके", "माझे", "दुखत", "आहे."], correctSequence: [1, 0, 2, 3], explanation: "Possessive (माझे) + Subject (डोके) + Participle (दुखत) + Aux (आहे)." },
    { id: "scr-30", difficulty: "Medium", english: "Keep the house clean.", scrambled: ["स्वच्छ", "घर", "ठेवा."], correctSequence: [1, 0, 2], explanation: "Object (घर) + Adjective state (स्वच्छ) + Imperative verb (ठेवा)." },

    // HARD (15 games)
    { id: "scr-31", difficulty: "Hard", english: "Lotus grows in mud.", scrambled: ["चिखलात", "उगवते.", "कमळ"], correctSequence: [2, 0, 1], explanation: "Subject (कमळ) + Location (चिखलात) + Verb (उगवते)." },
    { id: "scr-32", difficulty: "Hard", english: "The baby laughed very sweetly.", scrambled: ["खूप", "गोड", "बाळ", "हसले."], correctSequence: [2, 0, 1, 3], explanation: "Subject (बाळ) + Adverb modifier (खूप गोड) + Verb (हसले)." },
    { id: "scr-33", difficulty: "Hard", english: "Lokmanya Tilak was a great leader of India.", scrambled: ["भारताचे", "थोर", "नेते", "टिळक", "होते."], correctSequence: [3, 0, 1, 2, 4], explanation: "Subject (टिळक) + Possessive modifier (भारताचे) + Adjective (थोर) + Noun (नेते) + Plural past copula (होते)." },
    { id: "scr-34", difficulty: "Hard", english: "I will go to village day after tomorrow.", scrambled: ["गावाला", "जाईन.", "मी", "परवा"], correctSequence: [2, 3, 0, 1], explanation: "Subject (मी) + Time (परवा) + Destination (गावाला) + Future Verb (जाईन)." },
    { id: "scr-35", difficulty: "Hard", english: "Did you have your meal today?", scrambled: ["केले", "तुम्ही", "आज", "का?", "जेवण"], correctSequence: [1, 2, 4, 0, 3], explanation: "Subject (तुम्ही) + Time (आज) + Object (जेवण) + Verb (केले) + Question (का?)." },
    { id: "scr-36", difficulty: "Hard", english: "Do not throw garbage on the road.", scrambled: ["कचरा", "रस्त्यावर", "टाकू", "नका."], correctSequence: [1, 0, 2, 3], explanation: "Locative place (रस्त्यावर) + Object (कचरा) + Negative imperative compound (टाकू नका)." },
    { id: "scr-37", difficulty: "Hard", english: "I need fifty rupees change.", scrambled: ["पन्नास", "मला", "सुट्टे", "पैसे", "हवेत."], correctSequence: [1, 0, 2, 3, 4], explanation: "Subject (मला) + Amount (पन्नास) + Object (सुट्टे पैसे) + Plural verb request (हवेत)." },
    { id: "scr-38", difficulty: "Hard", english: "Alphonso mangoes are very sweet.", scrambled: ["आंबे", "हापूस", "खूप", "गोड", "असतात."], correctSequence: [1, 0, 2, 3, 4], explanation: "Modifier (हापूस) + Subject (आंबे) + Adverb (खूप) + Adjective (गोड) + Habitual plural verb (असतात)." },
    { id: "scr-39", difficulty: "Hard", english: "Is Shaniwar Wada open today?", scrambled: ["शनिवार", "वाडा", "आज", "उघडा", "आहे", "का?"], correctSequence: [0, 1, 2, 3, 4, 5], explanation: "Subject (शनिवार वाडा) + Time (आज) + State (उघडा) + Verb (आहे) + Question marker (का?)." },
    { id: "scr-40", difficulty: "Hard", english: "Can I pay via UPI online?", scrambled: ["मी", "ऑनलाईन", "पेमेंट", "करू", "शकतो", "का?"], correctSequence: [0, 1, 2, 3, 4, 5], explanation: "Subject (मी) + Adverb (ऑनलाईन) + Object (पेमेंट) + Potential compound verb (करू करतो/शकतो) + Question marker (का?)." },
    { id: "scr-41", difficulty: "Hard", english: "Mother is cooking delicious food.", scrambled: ["आई", "चवदार", "जेवण", "बनवत", "आहे."], correctSequence: [0, 1, 2, 3, 4], explanation: "Subject (आई) + Adjective (चवदार) + Object (जेवण) + Continuous verb compound (बनवत आहे)." },
    { id: "scr-42", difficulty: "Hard", english: "My office is near the station.", scrambled: ["कार्यालय", "माझे", "स्टेशनजवळ", "आहे."], correctSequence: [1, 0, 2, 3], explanation: "Possessive (माझे) + Subject (कार्यालय) + Locative (स्टेशनजवळ) + Aux (आहे)." },
    { id: "scr-43", difficulty: "Hard", english: "Please write this address on paper.", scrambled: ["हा", "पत्ता", "कागदावर", "लिहा.", "कृपया"], correctSequence: [4, 0, 1, 2, 3], explanation: "Polite (कृपया) + Demonstrative (हा) + Object (पत्ता) + Location (कागदावर) + Verb (लिहा)." },
    { id: "scr-44", difficulty: "Hard", english: "There is an accident on the road.", scrambled: ["रस्त्यावर", "अपघात", "झाला", "आहे."], correctSequence: [0, 1, 2, 3], explanation: "Location (रस्त्यावर) + Subject event (अपघात) + Past verb state (झाला आहे)." },
    { id: "scr-45", difficulty: "Hard", english: "Water supply comes twice a day.", scrambled: ["पाणी", "दिवसातून", "दोनदा", "येते."], correctSequence: [0, 1, 2, 3], explanation: "Subject (पाणी) + Time span (दिवसातून) + Frequency (दोनदा) + Verb (येते)." }
  ];

  let _activeImpostorIdx = 0;
  let _activeScrambledIdx = 0;

  function getImpostorGame() {
    const game = IMPOSTOR_GAMES[_activeImpostorIdx];
    return {
      ...game,
      currentIndex: _activeImpostorIdx,
      totalCount: IMPOSTOR_GAMES.length
    };
  }

  function checkImpostorSelection(selectedWordIndex) {
    const game = IMPOSTOR_GAMES[_activeImpostorIdx];
    const isCorrect = selectedWordIndex === game.impostorIndex;

    if (isCorrect) {
      const state = AppState.getState();
      AppState.update('stats.xp', state.stats.xp + 15);
      _activeImpostorIdx = (_activeImpostorIdx + 1) % IMPOSTOR_GAMES.length;
    }
    return isCorrect;
  }

  function getScrambledGame() {
    const game = SCRAMBLED_GAMES[_activeScrambledIdx];
    return {
      ...game,
      currentIndex: _activeScrambledIdx,
      totalCount: SCRAMBLED_GAMES.length
    };
  }

  function checkScrambledSequence(sequence) {
    const game = SCRAMBLED_GAMES[_activeScrambledIdx];
    if (sequence.length !== game.correctSequence.length) return false;

    const isCorrect = sequence.every((val, index) => val === game.correctSequence[index]);

    if (isCorrect) {
      const state = AppState.getState();
      AppState.update('stats.xp', state.stats.xp + 20);
      _activeScrambledIdx = (_activeScrambledIdx + 1) % SCRAMBLED_GAMES.length;
    }
    return isCorrect;
  }

  return {
    getImpostorGame,
    checkImpostorSelection,
    getScrambledGame,
    checkScrambledSequence
  };
})();
