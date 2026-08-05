import json

def rebuild():
    # Define the 32 units, their metadata, and their 6 unique sentences/phrases
    units_data = [
        # ================= LEVEL 1: Sounds & Survival (u1 - u4) =================
        {
            "id": "u1", "level": 1, "levelTitle": "Sounds & Survival", "levelHours": "8 hrs",
            "title": "Marathi sounds & script basics", "titleMarathi": "मराठी ध्वनी आणि अक्षरे",
            "description": "Vowels, key consonants, how Devanagari works — recognition only, not writing", "icon": "🗣️",
            "culturalNote": "This unit focuses on the basic pronunciation of Marathi sounds, especially unique letters like 'ळ' and retroflex consonants.",
            "grammarFocus": "Vowels, retroflex sounds, and Devanagari pronunciation.",
            "phrases": [
                {"marathi": "कमळ चिखलात उगवते.", "transliteration": "Kamal chikhalaat ugavate.", "english": "Lotus grows in mud.", "hindi": "कमल कीचड़ में उगता है."},
                {"marathi": "बाळ खूप गोड हसले.", "transliteration": "Baal khoop god hasale.", "english": "The baby laughed very sweetly.", "hindi": "बच्चा बहुत मीठा हंसा."},
                {"marathi": "पाणी जीवन आहे.", "transliteration": "Paani jeevan aahe.", "english": "Water is life.", "hindi": "पानी जीवन है."},
                {"marathi": "टिळक भारताचे थोर नेते होते.", "transliteration": "Tilak bhaarataache thor nete hote.", "english": "Tilak was a great leader of India.", "hindi": "तिलक भारत के महान नेता थे."},
                {"marathi": "घर स्वच्छ ठेवा.", "transliteration": "Ghar swachha theva.", "english": "Keep the house clean.", "hindi": "घर साफ रखो."},
                {"marathi": "आंबा गोड फळ आहे.", "transliteration": "Aamba god phal aahe.", "english": "Mango is a sweet fruit.", "hindi": "आम मीठा फल है."}
            ]
        },
        {
            "id": "u2", "level": 1, "levelTitle": "Sounds & Survival", "levelHours": "8 hrs",
            "title": "Hello, goodbye, thank you", "titleMarathi": "नमस्कार आणि धन्यवाद",
            "description": "Namaste, namaskar, धन्यवाद, निघतो — first social exchanges", "icon": "👋",
            "culturalNote": "Greeting with folded hands and saying 'Namaskar' is the universal polite gesture in Maharashtra.",
            "grammarFocus": "Formal greetings and expressing basic politeness.",
            "phrases": [
                {"marathi": "नमस्कार, कसे आहात?", "transliteration": "Namaskaar, kase aahaat?", "english": "Hello, how are you?", "hindi": "नमस्कार, आप कैसे हैं?"},
                {"marathi": "मी ठीक आहे, धन्यवाद.", "transliteration": "Mee theek aahe, dhanyavaad.", "english": "I am fine, thank you.", "hindi": "मैं ठीक हूँ, धन्यवाद."},
                {"marathi": "तुम्चे नाव काय आहे?", "transliteration": "Tumche naav kaay aahe?", "english": "What is your name?", "hindi": "आपका नाम क्या है?"},
                {"marathi": "माझे नाव राहुल आहे.", "transliteration": "Maaje naav Rahul aahe.", "english": "My name is Rahul.", "hindi": "मेरा नाम राहुल है."},
                {"marathi": "पुन्हा भेटूया!", "transliteration": "Punhaa bhetooya!", "english": "Meet you again!", "hindi": "फिर मिलेंगे!"},
                {"marathi": "मी निघतो आता, बाय.", "transliteration": "Mee nighto aata, bye.", "english": "I am leaving now, bye.", "hindi": "मैं अब चलता हूँ, बाय."}
            ]
        },
        {
            "id": "u3", "level": 1, "levelTitle": "Sounds & Survival", "levelHours": "8 hrs",
            "title": "Numbers 1-20 & telling time", "titleMarathi": "संख्या आणि वेळ",
            "description": "Counting, basic clock phrases, days of the week", "icon": "⏰",
            "culturalNote": "Time expressions often use 'Vajale' (struck). Sunday is a common holiday across Maharashtra.",
            "grammarFocus": "Numbers 1-20, telling hours, and names of days.",
            "phrases": [
                {"marathi": "एक, दोन, तीन, चार, पाच.", "transliteration": "Ek, don, teen, chaar, paach.", "english": "One, two, three, four, five.", "hindi": "एक, दो, तीन, चार, पांच."},
                {"marathi": "सहा, सात, आठ, नऊ, दहा.", "transliteration": "Saha, saat, aath, nau, daha.", "english": "Six, seven, eight, nine, ten.", "hindi": "छह, सात, आठ, नौ, दस."},
                {"marathi": "आता किती वाजले आहेत?", "transliteration": "Aata kitee vaajale aaheet?", "english": "What time is it now?", "hindi": "अभी कितने बजे हैं?"},
                {"marathi": "दोन वाजून दहा मिनिटे झाली.", "transliteration": "Don vaajoon dahaa minite zalee.", "english": "It is 2:10.", "hindi": "दो बजकर दस मिनट हुए हैं."},
                {"marathi": "आज सोमवार आहे.", "transliteration": "Aaj somvaar aahe.", "english": "Today is Monday.", "hindi": "आज सोमवार है."},
                {"marathi": "उद्या रविवार आहे, सुट्टी आहे.", "transliteration": "Udya ravivaar aahe, suttee aahe.", "english": "Tomorrow is Sunday, a holiday.", "hindi": "कल रविवार है, छुट्टी है."}
            ]
        },
        {
            "id": "u4", "level": 1, "levelTitle": "Sounds & Survival", "levelHours": "8 hrs",
            "title": "Who are you? Introductions", "titleMarathi": "ओळख आणि परिचय",
            "description": "My name is..., I am from..., meeting people", "icon": "👤",
            "culturalNote": "Use 'Tumhi' (you-plural/formal) for showing respect when introducing yourself to strangers or elders.",
            "grammarFocus": "Introducing oneself, asking place of origin, and formal vs informal pronouns.",
            "phrases": [
                {"marathi": "मी अमेरिकेचा आहे.", "transliteration": "Mee amerikecha aahe.", "english": "I am from America.", "hindi": "मैं अमेरिका से हूँ."},
                {"marathi": "तुम्ही कुठे राहता?", "transliteration": "Tumhi kuthe raahata?", "english": "Where do you live?", "hindi": "आप कहाँ रहते हैं?"},
                {"marathi": "मी पुण्यात राहतो.", "transliteration": "Mee punyaat raahato.", "english": "I live in Pune.", "hindi": "मैं पुणे में रहता हूँ."},
                {"marathi": "हे माझे मित्र आहेत.", "transliteration": "He maajhe mitra aaheet.", "english": "These are my friends.", "hindi": "ये मेरे दोस्त हैं."},
                {"marathi": "तुम्हाला भेटून आनंद झाला.", "transliteration": "Tumhaala bhetoon aanand zalaa.", "english": "Nice to meet you.", "hindi": "आपसे मिलकर खुशी हुई."},
                {"marathi": "माझे वय पंचवीस वर्षे आहे.", "transliteration": "Maajhe vay panchvees varshe aahe.", "english": "My age is 25 years.", "hindi": "मेरी उम्र पच्चीस साल है."}
            ]
        },
        # ================= LEVEL 2: Daily Life (u5 - u9) =================
        {
            "id": "u5", "level": 2, "levelTitle": "Daily Life", "levelHours": "10 hrs",
            "title": "Home & family", "titleMarathi": "घर आणि कुटुंब",
            "description": "Rooms, family members, describing your household", "icon": "🏠",
            "culturalNote": "Maharashtrian families often use honorific suffixes like 'Aai' for mother and 'Vadeel' or 'Baba' for father.",
            "grammarFocus": "Genitive case ('maajhe', 'maajhi') and family relationship terms.",
            "phrases": [
                {"marathi": "हे माझे घर आहे.", "transliteration": "He maajhe ghar aahe.", "english": "This is my house.", "hindi": "यह मेरा घर है."},
                {"marathi": "माझ्या कुटुंबात पाच लोक आहेत.", "transliteration": "Maajhya kutumbaat paach lok aaheet.", "english": "There are 5 people in my family.", "hindi": "मेरे परिवार में पांच लोग हैं."},
                {"marathi": "माझी आई शिक्षिका आहे.", "transliteration": "Maajhi aai shikshika aahe.", "english": "My mother is a teacher.", "hindi": "मेरी माँ शिक्षिका हैं."},
                {"marathi": "माझे वडील डॉक्टर आहेत.", "transliteration": "Maajhe vadeel doctor aaheet.", "english": "My father is a doctor.", "hindi": "मेरे पिता डॉक्टर हैं."},
                {"marathi": "मला एक लहान बहीण आहे.", "transliteration": "Malaa ek lahaan baheen aahe.", "english": "I have a younger sister.", "hindi": "मेरी एक छोटी बहन है."},
                {"marathi": "स्वयंपाकघर कुठे आहे?", "transliteration": "Swayampaakghar kuthe aahe?", "english": "Where is the kitchen?", "hindi": "रसोईघर कहाँ है?"}
            ]
        },
        {
            "id": "u6", "level": 2, "levelTitle": "Daily Life", "levelHours": "10 hrs",
            "title": "Food, chai, restaurants", "titleMarathi": "खाद्यसंस्कृती आणि हॉटेल",
            "description": "Ordering food, common dishes, hot/cold/spicy preferences", "icon": "☕",
            "culturalNote": "Hot Chai (tea) is a staple of hospitality. Food is traditionally categorized as 'Tikhat' (spicy) or 'God' (sweet).",
            "grammarFocus": "Verbal suffixes for eating/drinking, ordering politeness.",
            "phrases": [
                {"marathi": "मला खूप भूक लागली आहे.", "transliteration": "Malaa khoop bhook laagalee aahe.", "english": "I am very hungry.", "hindi": "मुझे बहुत भूख लगी है."},
                {"marathi": "तुम्ही काय खाणार?", "transliteration": "Tumhi kaay khaanaar?", "english": "What will you eat?", "hindi": "आप क्या खाएंगे?"},
                {"marathi": "एक कप गरम चहा द्या.", "transliteration": "Ek kap garam chahaa dyaa.", "english": "Give a cup of hot tea.", "hindi": "एक कप गर्म चाय दीजिए."},
                {"marathi": "जेवण खूप चवदार होते!", "transliteration": "Jevan khoop chavdaar hote!", "english": "The food was very tasty!", "hindi": "खाना बहुत स्वादिष्ट था!"},
                {"marathi": "हे पाणी पिण्यायोग्य आहे का?", "transliteration": "He paani pinyaayogya aahe ka?", "english": "Is this water drinkable?", "hindi": "क्या यह पानी पीने योग्य है?"},
                {"marathi": "कृपया बिल घेऊन या.", "transliteration": "Krupayaa bill gheoon yaa.", "english": "Please bring the bill.", "hindi": "कृपया बिल ले आइए."}
            ]
        },
        {
            "id": "u7", "level": 2, "levelTitle": "Daily Life", "levelHours": "10 hrs",
            "title": "Shopping & bargaining", "titleMarathi": "खरेदी आणि घासाघीस",
            "description": "किती आहे? Prices, quantities, accepting/rejecting", "icon": "🛍️",
            "culturalNote": "Bargaining (Ghaasaaghees) is common in local street markets. Use polite questioning to seek lower prices.",
            "grammarFocus": "Interrogative pronoun 'Kitee' (how much) and transactional verbs.",
            "phrases": [
                {"marathi": "या पुस्तकाची किंमत किती आहे?", "transliteration": "Yaa pustakaachee kimmat kitee aahe?", "english": "How much does this book cost?", "hindi": "इस किताब की कीमत कितनी है?"},
                {"marathi": "हे खूप महाग आहे!", "transliteration": "He khoop mahaag aahe!", "english": "This is very expensive!", "hindi": "यह बहुत महंगा है!"},
                {"marathi": "काहीतरी डिस्काउंट द्या ना.", "transliteration": "Kaahitaree discount dyaa naa.", "english": "Give some discount please.", "hindi": "कुछ डिस्काउंट दीजिए ना."},
                {"marathi": "मला हे शर्ट आवडले आहे.", "transliteration": "Malaa he shirt aavadale aahe.", "english": "I like this shirt.", "hindi": "मुझे यह शर्ट पसंद आई है."},
                {"marathi": "तुमच्याकडे दुसरी साईझ आहे का?", "transliteration": "Tumchyaakade doosree size aahe ka?", "english": "Do you have another size?", "hindi": "क्या आपके पास दूसरा साइज है?"},
                {"marathi": "मी गुगल पे करू शकतो का?", "transliteration": "Mee Google Pay karoo shakato ka?", "english": "Can I Google Pay?", "hindi": "क्या मैं गूगल पे कर सकता हूँ?"}
            ]
        },
        {
            "id": "u8", "level": 2, "levelTitle": "Daily Life", "levelHours": "10 hrs",
            "title": "Simple present tense verbs", "titleMarathi": "चालू वर्तमानकाळ",
            "description": "I eat, I go, I want — core verb patterns", "icon": "🔄",
            "culturalNote": "Verbs in Marathi conjugate based on gender and number. E.g., 'jato' (male) vs 'jate' (female) for 'go'.",
            "grammarFocus": "Simple present tense verb endings based on speaker gender.",
            "phrases": [
                {"marathi": "मी रोज सकाळी लवकर उठतो.", "transliteration": "Mee roj sakaalee lavakar uthato.", "english": "I get up early every morning (m).", "hindi": "मैं रोज़ सुबह जल्दी उठता हूँ."},
                {"marathi": "ती खूप सुंदर गाते.", "transliteration": "Tee khoop sundar gaate.", "english": "She sings very beautifully.", "hindi": "वह बहुत सुंदर गाती है."},
                {"marathi": "आम्ही मराठी शिकतो.", "transliteration": "Aamhi marathi shikato.", "english": "We learn Marathi.", "hindi": "हम मराठी सीखते हैं."},
                {"marathi": "तुम्हाला काय पाहिजे?", "transliteration": "Tumhaala kaay paahije?", "english": "What do you want?", "hindi": "आपको क्या चाहिए?"},
                {"marathi": "तो रोज ऑफिसला जातो.", "transliteration": "To roj officela jaato.", "english": "He goes to the office daily.", "hindi": "वह रोज़ ऑफ़िस जाता है."},
                {"marathi": "मुले मैदानावर खेळतात.", "transliteration": "Mule maidaanaavar khelataat.", "english": "Children play on the ground.", "hindi": "बच्चे मैदान पर खेलते हैं."}
            ]
        },
        {
            "id": "u9", "level": 2, "levelTitle": "Daily Life", "levelHours": "10 hrs",
            "title": "Feelings & health basics", "titleMarathi": "भावना आणि आरोग्य",
            "description": "I'm hungry / tired / sick, body parts, pharmacy phrases", "icon": "🤒",
            "culturalNote": "Traditional Marathi medicine and visiting the 'Davaakhaana' (clinic) is common for minor ailments.",
            "grammarFocus": "Expressing bodily sensations using dative subjects ('malaa ...').",
            "phrases": [
                {"marathi": "माझे डोके खूप दुखत आहे.", "transliteration": "Maajhe doke khoop dukhat aahe.", "english": "My head hurts a lot.", "hindi": "मेरा सिर बहुत दुख रहा है."},
                {"marathi": "मला आज ताप आला आहे.", "transliteration": "Mala aaj taap aalaa aahe.", "english": "I have a fever today.", "hindi": "मुझे आज बुखार आया है."},
                {"marathi": "जवळचा दवाखाना कुठे आहे?", "transliteration": "Javalchaa davaakhaana kuthe aahe?", "english": "Where is the nearby clinic?", "hindi": "पास का दवाखाना कहाँ है?"},
                {"marathi": "मला थकल्यासारखे वाटत आहे.", "transliteration": "Malaa thakalyasaarkhe vaatat aahe.", "english": "I feel tired.", "hindi": "मुझे थकावट महसूस हो रही है."},
                {"marathi": "काळजी करू नका, सर्व ठीक होईल.", "transliteration": "Kaalaji karoo nakaa, sarva theek hoeel.", "english": "Don't worry, everything will be fine.", "hindi": "चिंता मत करो, सब ठीक हो जाएगा."},
                {"marathi": "हे औषध जेवणानंतर घ्या.", "transliteration": "He aushadh jevanaanantar ghyaa.", "english": "Take this medicine after meals.", "hindi": "यह दवा खाने के बाद लें."}
            ]
        },
        # ================= LEVEL 3: Getting Around (u10 - u14) =================
        {
            "id": "u10", "level": 3, "levelTitle": "Getting Around", "levelHours": "10 hrs",
            "title": "Directions & places", "titleMarathi": "दिशा आणि ठिकाणे",
            "description": "Left, right, straight, landmarks, asking for the way", "icon": "📍",
            "culturalNote": "Local landmarks like the 'Mandir' (temple) or 'Chauk' (intersection) are widely used for directions.",
            "grammarFocus": "Locative suffixes and directional vocabulary.",
            "phrases": [
                {"marathi": "डावीकडे वळा आणि सरळ जा.", "transliteration": "Daaveekade valaa aani saral jaa.", "english": "Turn left and go straight.", "hindi": "बाईं ओर मुड़ें और सीधे जाएं."},
                {"marathi": "रेल्वे स्टेशन येथून लांब आहे का?", "transliteration": "Railway station yethoon laamb aahe ka?", "english": "Is the railway station far from here?", "hindi": "क्या रेलवे स्टेशन यहाँ से दूर है?"},
                {"marathi": "मंदिर उजव्या बाजूला आहे.", "transliteration": "Mandir ujavyaa baajoolaa aahe.", "english": "The temple is on the right side.", "hindi": "मंदिर दाईं ओर है."},
                {"marathi": "रस्ता पार करताना काळजी घ्या.", "transliteration": "Rastaa paar karataanaa kaalaji ghyaa.", "english": "Take care while crossing the road.", "hindi": "सड़क पार करते समय सावधानी बरतें."},
                {"marathi": "पुलाखालून जावे लागेल का?", "transliteration": "Pulaakhaaloona jaave laagela ka?", "english": "Do we need to go under the bridge?", "hindi": "क्या पुल के नीचे से जाना होगा?"},
                {"marathi": "हे खूप जवळ आहे, चालत जाऊ शकता.", "transliteration": "He khoop javal aahe, chaalat jaaoo shakata. ", "english": "This is very near, you can walk.", "hindi": "यह बहुत पास है, पैदल जा सकते हैं."}
            ]
        },
        {
            "id": "u11", "level": 3, "levelTitle": "Getting Around", "levelHours": "10 hrs",
            "title": "Transport — auto, bus, train", "titleMarathi": "वाहतूक आणि प्रवास",
            "description": "Booking, fares, asking when it arrives", "icon": "🚌",
            "culturalNote": "Three-wheeled Auto-rickshaws are the primary mode of short commute. Fares are usually calculated by meter or fixed routes.",
            "grammarFocus": "Future tense verbs relating to transport timetables.",
            "phrases": [
                {"marathi": "ऑटोचे भाडे किती होईल?", "transliteration": "Autoche bhaade kitee hoeel?", "english": "How much will the auto fare be?", "hindi": "ऑटो का किराया कितना होगा?"},
                {"marathi": "बस कधी सुटणार आहे?", "transliteration": "Bus kadhee sutanaar aahe?", "english": "When will the bus leave?", "hindi": "बस कब छूटेगी?"},
                {"marathi": "मला रेल्वेचे तिकीट पाहिजे.", "transliteration": "Malaa railwayche ticket paahije.", "english": "I want a train ticket.", "hindi": "मुझे रेलवे का टिकट चाहिए."},
                {"marathi": "कृपया गाडी इथे थांबवा.", "transliteration": "Krupayaa gaadee ithe thaambavaa.", "english": "Please stop the vehicle here.", "hindi": "कृपया गाड़ी यहाँ रोकें."},
                {"marathi": "पुण्याची बस कुठून मिळते?", "transliteration": "Punyachee bus kuthoon milate?", "english": "Where do we get the bus to Pune?", "hindi": "पुणे की बस कहाँ से मिलती है?"},
                {"marathi": "या जागेवर कोणी बसले आहे का?", "transliteration": "Yaa jaagevar konee basale aahe ka?", "english": "Is anyone sitting on this seat?", "hindi": "क्या इस सीट पर कोई बैठा है?"}
            ]
        },
        {
            "id": "u12", "level": 3, "levelTitle": "Getting Around", "levelHours": "10 hrs",
            "title": "Past tense — what happened", "titleMarathi": "भूतकाळ आणि प्रसंग",
            "description": "I went, I ate, I saw — narrative past forms", "icon": "📜",
            "culturalNote": "Simple past forms of verbs change based on the gender of the speaker/subject or the object of transitive verbs.",
            "grammarFocus": "Simple past tense verb endings ('gelo/gele', 'kele').",
            "phrases": [
                {"marathi": "मी काल चित्रपट पाहिला.", "transliteration": "Mee kaal chitrapat paahila.", "english": "I watched a movie yesterday.", "hindi": "मैंने कल फिल्म देखी."},
                {"marathi": "त्यांनी खूप छान जेवण केले.", "transliteration": "Tyaanni khoop thaan jevan kele.", "english": "They had a very nice meal.", "hindi": "उन्होंने बहुत अच्छा खाना खाया."},
                {"marathi": "आम्ही मागच्या वर्षी मुंबईला गेलो होतो.", "transliteration": "Aamhi maagchya varshee Mumbaila gelo hoto.", "english": "We went to Mumbai last year.", "hindi": "हम पिछले साल मुंबई गए थे."},
                {"marathi": "तिने पत्र लिहिले का?", "transliteration": "Tine patra lihile ka?", "english": "Did she write a letter?", "hindi": "क्या उसने पत्र लिखा?"},
                {"marathi": "काल रात्री पाऊस पडला.", "transliteration": "Kaal raatri paaoos padla.", "english": "It rained last night.", "hindi": "कल रात बारिश हुई."},
                {"marathi": "तुम्ही त्याला कधी भेटलात?", "transliteration": "Tumhi tyaalaa kadhee bhetalaat?", "english": "When did you meet him?", "hindi": "आप उससे कब मिले?"}
            ]
        },
        {
            "id": "u13", "level": 3, "levelTitle": "Getting Around", "levelHours": "10 hrs",
            "title": "Future plans & intentions", "titleMarathi": "भविष्यकाळ आणि नियोजन",
            "description": "I will go, I want to visit — expressing plans", "icon": "🔮",
            "culturalNote": "Future plans are expressed using future tense verbs (e.g., 'jaaeen' meaning 'will go').",
            "grammarFocus": "Future tense endings and planning verbs.",
            "phrases": [
                {"marathi": "मी उद्या मुंबईला जाईन.", "transliteration": "Mee udya Mumbaila jaaeen.", "english": "I will go to Mumbai tomorrow.", "hindi": "मैं कल मुंबई जाऊँगा."},
                {"marathi": "आम्ही पुढील आठवड्यात भेटूया.", "transliteration": "Aamhi pudheel aathavdyaat bhetooya.", "english": "We will meet next week.", "hindi": "हम अगले हफ्ते मिलेंगे."},
                {"marathi": "तू नवीन गाडी कधी खरेदी करणार?", "transliteration": "Too naveen gaadee kadhee kharedi karanaar?", "english": "When will you buy a new car?", "hindi": "तुम नई गाड़ी कब खरीदोगे?"},
                {"marathi": "तो संध्याकाळी..." , "transliteration": "To sandhyaakaalee phone kareel.", "english": "He will call in the evening.", "hindi": "वह शाम को फ़ोन करेगा."},
                {"marathi": "तो संध्याकाळी फोन करेल.", "transliteration": "To sandhyaakaalee phone kareel.", "english": "He will call in the evening.", "hindi": "वह शाम को फ़ोन करेगा."},
                {"marathi": "तुम्ही रविवारी काय करणार आहात?", "transliteration": "Tumhi ravivaaree kaay karanaar aahaat?", "english": "What are you going to do on Sunday?", "hindi": "आप रविवार को क्या करने वाले हैं?"}
            ]
        },
        {
            "id": "u14", "level": 3, "levelTitle": "Getting Around", "levelHours": "10 hrs",
            "title": "Asking for help politely", "titleMarathi": "नम्रता आणि मदत",
            "description": "मला मदत करा, excuse me, can you repeat?", "icon": "🤝",
            "culturalNote": "Being humble and asking for language help ('haloo bola' - speak slowly) is highly appreciated by native speakers.",
            "grammarFocus": "Request structures and polite adverbs.",
            "phrases": [
                {"marathi": "कृपया मला मदत करा.", "transliteration": "Krupayaa malaa madat kara.", "english": "Please help me.", "hindi": "कृपया मेरी मदद करें."},
                {"marathi": "मला समजत नाही आहे, हळू बोला.", "transliteration": "Malaa samajat naahi aahe, haloo bola.", "english": "I don't understand, speak slowly.", "hindi": "मुझे समझ नहीं आ रहा है, धीरे बोलें."},
                {"marathi": "तुम्ही पुन्हा सांगू शकता का?", "transliteration": "Tumhi punhaa saangoo shakata ka?", "english": "Can you say that again?", "hindi": "क्या आप दोबारा बोल सकते हैं?"},
                {"marathi": "क्षमस्व, मला उशीर झाला.", "transliteration": "Kshamasva, malaa usheer zalaa.", "english": "Sorry, I am late.", "hindi": "माफ़ कीजिये, मुझे देर हो गई."},
                {"marathi": "इंग्रजीत याला काय म्हणतात?", "transliteration": "English-t yaala kaay mhanataat?", "english": "What is this called in English?", "hindi": "अंग्रेजी में इसे क्या कहते हैं?"},
                {"marathi": "माहिती दिल्याबद्दल धन्यवाद.", "transliteration": "Maahitee dilyabaddal dhanyavaad.", "english": "Thank you for the information.", "hindi": "जानकारी देने के लिए धन्यवाद."}
            ]
        },
        # ================= LEVEL 4: Social Conversations (u15 - u20) =================
        {
            "id": "u15", "level": 4, "levelTitle": "Social Conversations", "levelHours": "12 hrs",
            "title": "Festivals & culture", "titleMarathi": "सण आणि संस्कृती",
            "description": "Diwali, Ganesh Chaturthi, Gudi Padwa — greetings and context", "icon": "🎆",
            "culturalNote": "Ganesh Chaturthi is the biggest festival in Maharashtra. Modaks are the sweet food offered to Ganesha.",
            "grammarFocus": "Dative case for blessings/wishes ('diwaleechya shubhechha').",
            "phrases": [
                {"marathi": "दिवाळीच्या हार्दिक शुभेच्छा!", "transliteration": "Diwaleechya haardik shubhechha!", "english": "Warm wishes for Diwali!", "hindi": "दिवाली की हार्दिक शुभकामनाएं!"},
                {"marathi": "गणपती बाप्पा मोरया!", "transliteration": "Ganapati Bappa Morya!", "english": "Glory to Lord Ganesha!", "hindi": "गणपति बाप्पा मोरया!"},
                {"marathi": "आज गुढीपाडवा आहे.", "transliteration": "Aaj Gudipadwa aahe.", "english": "Today is Gudi Padwa.", "hindi": "आज गुड़ी पड़वा है."},
                {"marathi": "महाराष्ट्राची संस्कृती खूप समृद्ध आहे.", "transliteration": "Mahaaraashtraachee sanskrutee khoop samruddha aahe.", "english": "The culture of Maharashtra is very rich.", "hindi": "महाराष्ट्र की संस्कृति बहुत समृद्ध है."},
                {"marathi": "आम्ही मोदक बनवले आहेत.", "transliteration": "Aamhi modak banavle aaheet.", "english": "We have made Modaks.", "hindi": "हमने मोदक बनाए हैं."},
                {"marathi": "पारंपारिक कपडे घालायला आवडतात.", "transliteration": "Paarampareek kapade ghaalaaylaa aavadataat.", "english": "I like to wear traditional clothes.", "hindi": "मुझे पारंपरिक कपड़े पहनना पसंद है."}
            ]
        },
        {
            "id": "u16", "level": 4, "levelTitle": "Social Conversations", "levelHours": "12 hrs",
            "title": "Weather & seasons", "titleMarathi": "हवामान आणि ऋतू",
            "description": "Maharashtra weather, पाऊस (rain), हिवाळा, उन्हाळा", "icon": "☀️",
            "culturalNote": "Maharashtra weather includes hot summers ('Unhaala') and heavy monsoons ('Paavsaala').",
            "grammarFocus": "Adjectival descriptors of weather and seasonal expressions.",
            "phrases": [
                {"marathi": "आज खूप ऊन पडले आहे.", "transliteration": "Aaj khoop oon padale aahe.", "english": "It is very sunny today.", "hindi": "आज बहुत तेज़ धूप है."},
                {"marathi": "पाऊस पडण्याची शक्यता आहे.", "transliteration": "Paaoos padanyachee shakyataa aahe.", "english": "There is a possibility of rain.", "hindi": "बारिश होने की संभावना है."},
                {"marathi": "हिवाळ्यात खूप थंडी असते.", "transliteration": "Hivaalyat khoop thandee asate.", "english": "It is very cold in winter.", "hindi": "सर्दियों में बहुत ठंड होती है."},
                {"marathi": "हवामान खूप छान आहे.", "transliteration": "Havaamaan khoop thaan aahe.", "english": "The weather is very nice.", "hindi": "मौसम बहुत अच्छा है."},
                {"marathi": "आकाशात काळे ढग आले आहेत.", "transliteration": "Aakaashaat kaale dhag aale aaheet.", "english": "Dark clouds have gathered in the sky.", "hindi": "आकाश में काले बादल छाए हैं."},
                {"marathi": "उन्हाळ्यात आंबे खायला मिळतात.", "transliteration": "Unhaalyat aambe khaaylaa milataat.", "english": "We get to eat mangoes in summer.", "hindi": "गर्मियों में आम खाने को मिलते हैं."}
            ]
        },
        {
            "id": "u17", "level": 4, "levelTitle": "Social Conversations", "levelHours": "12 hrs",
            "title": "Work & profession", "titleMarathi": "काम आणि व्यवसाय",
            "description": "What do you do? Office small talk, colleagues", "icon": "💼",
            "culturalNote": "Work environments in Pune/Mumbai are highly professional but warm. Coworkers are called 'Sahakaaree'.",
            "grammarFocus": "Profession names and locative workplace expressions ('officela/kaamaavar').",
            "phrases": [
                {"marathi": "तुम्ही कुठे काम करता?", "transliteration": "Tumhi kuthe kaam karata?", "english": "Where do you work?", "hindi": "आप कहाँ काम करते हैं?"},
                {"marathi": "मी सॉफ्टवेअर इंजिनिअर आहे.", "transliteration": "Mee software engineer aahe.", "english": "I am a software engineer.", "hindi": "मैं सॉफ्टवेयर इंजीनियर हूँ."},
                {"marathi": "आमचे ऑफिस नऊ वाजता सुरू होते.", "transliteration": "Aamche office nau vaajataa surooo hote.", "english": "Our office starts at 9 o'clock.", "hindi": "हमारा ऑफ़िस नौ बजे शुरू होता है."},
                {"marathi": "माझे सहकारी खूप चांगले आहेत.", "transliteration": "Maajhe sahakaaree khoop chaangle aaheet.", "english": "My colleagues are very nice.", "hindi": "मेरे सहकर्मी बहुत अच्छे हैं."},
                {"marathi": "आज महत्त्वाची मिटिंग आहे.", "transliteration": "Aaj mahattvaachee meeting aahe.", "english": "Today is an important meeting.", "hindi": "आज एक महत्वपूर्ण मीटिंग है."},
                {"marathi": "मला सुट्टी हवी आहे.", "transliteration": "Malaa suttee havee aahe.", "english": "I want a holiday.", "hindi": "मुझे छुट्टी चाहिए."}
            ]
        },
        {
            "id": "u18", "level": 4, "levelTitle": "Social Conversations", "levelHours": "12 hrs",
            "title": "Likes, dislikes & opinions", "titleMarathi": "आवड आणि नावड",
            "description": "मला आवडते / आवडत नाही, expressing preferences", "icon": "❤️",
            "culturalNote": "To express likes/dislikes, use the dative pronoun 'malaa' followed by 'aavadate' (like) or 'aavadat naahi' (dislike).",
            "grammarFocus": "Dative constructions ('malaa ... aavadate').",
            "phrases": [
                {"marathi": "मला मराठी संगीत खूप आवडते.", "transliteration": "Malaa marathi sangeet khoop aavadate.", "english": "I like Marathi music very much.", "hindi": "मुझे मराठी संगीत बहुत पसंद है."},
                {"marathi": "मला तिखट जेवण आवडत नाही.", "transliteration": "Malaa tikhat jevan aavadat naahi.", "english": "I do not like spicy food.", "hindi": "मुझे तीखा खाना पसंद नहीं है."},
                {"marathi": "तुम्चे याबद्दल काय मत आहे?", "transliteration": "Tumche yaabaddal kaay mat aahe?", "english": "What is your opinion on this?", "hindi": "इस बारे में आपकी क्या राय है?"},
                {"marathi": "माझ्या मते हा चांगला पर्याय आहे.", "transliteration": "Maajhya mate haa chaanglaa paryaay aahe.", "english": "In my opinion, this is a good option.", "hindi": "मेरी राय में यह एक अच्छा विकल्प है."},
                {"marathi": "तो चित्रपट खूपच कंटाळवाणा होता.", "transliteration": "To chitrapat khoopach kantaalvaana hota.", "english": "That movie was very boring.", "hindi": "वह फिल्म बहुत ही बोरिंग थी."},
                {"marathi": "मला फिरायला जायला आवडते.", "transliteration": "Malaa phiraaylaa jaaylaa aavadate.", "english": "I like to go for travels/walks.", "hindi": "मुझे घूमने जाना पसंद है."}
            ]
        },
        {
            "id": "u19", "level": 4, "levelTitle": "Social Conversations", "levelHours": "12 hrs",
            "title": "Giving & receiving compliments", "titleMarathi": "स्तुती आणि कौतुक",
            "description": "Politeness registers, formal vs. informal speech", "icon": "✨",
            "culturalNote": "Complimenting someone's Marathi skill ('tumche marathi khoop chaangle aahe!') will instantly build friendship.",
            "grammarFocus": "Exclamations and honorific compliments.",
            "phrases": [
                {"marathi": "तुम्ही आज खूप छान दिसत आहात.", "transliteration": "Tumhi aaj khoop thaan disat aahaat.", "english": "You look very nice today.", "hindi": "आप आज बहुत अच्छे लग रहे हैं."},
                {"marathi": "तुम्चे मराठी खूप चांगले आहे!", "transliteration": "Tumche marathi khoop chaangle aahe!", "english": "Your Marathi is very good!", "hindi": "आपकी मराठी बहुत अच्छी है!"},
                {"marathi": "अभिनंदन! मला तुमचा अभिमान वाटतो.", "transliteration": "Abhinandan! Malaa tumchaa abhimaan vaatato.", "english": "Congratulations! I am proud of you.", "hindi": "बधाई हो! मुझे आप पर गर्व है."},
                {"marathi": "तुम्ही खूप कष्टाळू व्यक्ती आहात.", "transliteration": "Tumhi khoop kashtaaloo vyaktee aahaat.", "english": "You are a very hardworking person.", "hindi": "आप बहुत मेहनती व्यक्ति हैं."},
                {"marathi": "कौतुकास्पद कामगिरी केलीत!", "transliteration": "Kautukaaspad kaamgiree keleet!", "english": "You did a praiseworthy job!", "hindi": "प्रशंसनीय काम किया आपने!"},
                {"marathi": "मदत केल्याबद्दल धन्यवाद.", "transliteration": "Madat kelyabaddal dhanyavaad.", "english": "Thank you for helping.", "hindi": "मदद करने के लिए धन्यवाद."}
            ]
        },
        {
            "id": "u20", "level": 4, "levelTitle": "Social Conversations", "levelHours": "12 hrs",
            "title": "Phone calls & messages", "titleMarathi": "फोन आणि संदेश",
            "description": "हॅलो, मी बोलतोय, WhatsApp culture in Marathi", "icon": "📱",
            "culturalNote": "'Hello, Rahul bolatoy' is how you state your name over a phone call in Marathi.",
            "grammarFocus": "Present continuous tense on calls and WhatsApp terms.",
            "phrases": [
                {"marathi": "हॅलो, मी राहुल बोलतोय.", "transliteration": "Hello, mee Rahul bolatoy.", "english": "Hello, I am Rahul speaking.", "hindi": "हेलो, मैं राहुल बोल रहा हूँ."},
                {"marathi": "तुम्चा आवाज येत नाही आहे.", "transliteration": "Tumchaa aavaas yet naahi aahe.", "english": "Your voice is not coming / I can't hear you.", "hindi": "आपकी आवाज़ नहीं आ रही है."},
                {"marathi": "नेटवर्क खराब आहे, नंतर फोन करतो.", "transliteration": "Network kharaab aahe, nantar phone karato.", "english": "The network is bad, I will call later (m).", "hindi": "नेटवर्क खराब है, बाद में फोन करता हूँ."},
                {"marathi": "मला व्हॉट्सॲपवर मेसेज करा.", "transliteration": "Malaa WhatsApp-var message kara.", "english": "Message me on WhatsApp.", "hindi": "मुझे व्हाट्सएप पर मैसेज करें."},
                {"marathi": "माझा फोन सायलेंटवर होता.", "transliteration": "Maajha phone silent-var hota.", "english": "My phone was on silent.", "hindi": "मेरा फोन साइलेंट पर था."},
                {"marathi": "फोन चार्जिंगला लावा.", "transliteration": "Phone charging-la laavaa.", "english": "Put the phone on charging.", "hindi": "फोन चार्जिंग पर लगाओ."}
            ]
        },
        # ================= LEVEL 5: Deeper Fluency (u21 - u26) =================
        {
            "id": "u21", "level": 5, "levelTitle": "Deeper Fluency", "levelHours": "12 hrs",
            "title": "Storytelling & narrating events", "titleMarathi": "गोष्ट सांगणे आणि वर्णन",
            "description": "Connecting sentences, \"and then\", sequencing past events", "icon": "📖",
            "culturalNote": "Marathi literature has a rich storytelling heritage. Connectors like 'tyaanantar' (after that) are vital.",
            "grammarFocus": "Connective adverbs and sequential sentence structures.",
            "phrases": [
                {"marathi": "एकदा एका जंगलात एक सिंह राहत होता.", "transliteration": "Ekda eka jangalaat ek sinh raahat hota.", "english": "Once a lion lived in a forest.", "hindi": "एक बार एक जंगल में एक शेर रहता था."},
                {"marathi": "त्यानंतर काय झाले सांगा?", "transliteration": "Tyaananatar kaay zhale saangaa?", "english": "What happened after that, tell me?", "hindi": "उसके बाद क्या हुआ बताओ?"},
                {"marathi": "अचानक पाऊस सुरू झाला.", "transliteration": "Achanak paaoos surooo zhala.", "english": "Suddenly rain started.", "hindi": "अचानक बारिश शुरू हो गई."},
                {"marathi": "शेवटी सर्व काही ठीक झाले.", "transliteration": "Shevatee sarva kaahi theek zhale.", "english": "In the end, everything became fine.", "hindi": "आखिरकार सब ठीक हो गया."},
                {"marathi": "माझा कालचा अनुभव खूप छान होता.", "transliteration": "Maajha kaalchaa anubhav khoop thaan hota.", "english": "My experience yesterday was very nice.", "hindi": "मेरा कल का अनुभव बहुत अच्छा था."},
                {"marathi": "सुरुवातीला मला खूप भीती वाटत होती.", "transliteration": "Suruvaateelaa malaa khoop bheetee vaatat hotee.", "english": "Initially I felt very scared.", "hindi": "शुरुआत में मुझे बहुत डर लग रहा था."}
            ]
        },
        {
            "id": "u22", "level": 5, "levelTitle": "Deeper Fluency", "levelHours": "12 hrs",
            "title": "Asking questions naturally", "titleMarathi": "प्रश्न विचारण्याची पद्धत",
            "description": "Who, what, where, when, why, how in natural speech", "icon": "❓",
            "culturalNote": "Asking questions politely is structured using direct question words positioned near the verb.",
            "grammarFocus": "Forming complex questions using 'kon', 'kaay', 'kuthe', 'kadhee', 'ka'.",
            "phrases": [
                {"marathi": "तेव्हा काय घडले होते?", "transliteration": "Tevhaa kaay ghadale hote?", "english": "What had happened then?", "hindi": "तब क्या हुआ था?"},
                {"marathi": "कोणाला विचारायचे आहे?", "transliteration": "Konaala vicharaayche aahe?", "english": "Who wants to ask?", "hindi": "किसे पूछना है?"},
                {"marathi": "हा रस्ता कुठे जातो?", "transliteration": "Haa rastaa kuthe jaato?", "english": "Where does this road go?", "hindi": "यह सड़क कहाँ जाती है?"},
                {"marathi": "तुम्ही कधी येणार आहात?", "transliteration": "Tumhi kadhee yenaat aahaat?", "english": "When are you coming?", "hindi": "आप कब आने वाले हैं?"},
                {"marathi": "काही शंका आहे का?", "transliteration": "Kaahi shanka aahe ka?", "english": "Is there any doubt?", "hindi": "क्या कोई शंका है?"},
                {"marathi": "नक्की काय झाले ते सांग.", "transliteration": "Nakki kaay zhale te saang.", "english": "Tell me exactly what happened.", "hindi": "सच-सच बताओ क्या हुआ."}
            ]
        },
        {
            "id": "u23", "level": 5, "levelTitle": "Deeper Fluency", "levelHours": "12 hrs",
            "title": "Marathi idioms & expressions", "titleMarathi": "म्हणी आणि वाक्प्रचार",
            "description": "Common म्हणी (proverbs) and everyday sayings", "icon": "💡",
            "culturalNote": "Marathi 'Mhanee' (proverbs) carry generations of wisdom. They are used daily in local speech.",
            "grammarFocus": "Idiomatic constructions and metaphorical meanings.",
            "phrases": [
                {"marathi": "अति शहाणा त्याचा बैल रिकामा.", "transliteration": "Ati shahaana tyaacha bail rikaama.", "english": "An over-smart person ends up in loss.", "hindi": "अति बुद्धिमान व्यक्ति अंततः नुकसान में रहता है."},
                {"marathi": "उथळ पाण्याला खळखळाट फार.", "transliteration": "Uthal paanyaala khalkhalaat faar.", "english": "Empty vessels make the most noise.", "hindi": "अधजल गगरी छलकत जाए."},
                {"marathi": "पळसाला पाने तीनच.", "transliteration": "Palasaala paane teenach.", "english": "The situation is the same everywhere.", "hindi": "ढाक के तीन पात."},
                {"marathi": "गर्जे तो पडेल काय?", "transliteration": "Garje to padel kaay?", "english": "Those who boast rarely act.", "hindi": "जो गरजते हैं वे बरसते नहीं."},
                {"marathi": "हातच्या कंकणाला आरसा कशाला?", "transliteration": "Haatchya kankanaala aarsaa kashala?", "english": "What is obvious needs no proof.", "hindi": "हाथ कंगन को आरसी क्या."},
                {"marathi": "दुरुन डोंगर साजरे.", "transliteration": "Duroon dongar saajare.", "english": "Distance lends enchantment to the view.", "hindi": "दूर के ढोल सुहावने लगते हैं."}
            ]
        },
        {
            "id": "u24", "level": 5, "levelTitle": "Deeper Fluency", "levelHours": "12 hrs",
            "title": "Disagreeing & negotiating", "titleMarathi": "असहमत आणि घासाघीस",
            "description": "Politely saying no, offering alternatives", "icon": "🗣️",
            "culturalNote": "To politely disagree in Marathi, express respect first ('malya mate' - in my opinion) before presenting your view.",
            "grammarFocus": "Subordinating conjunctions and structures for disagreement.",
            "phrases": [
                {"marathi": "मला हे मान्य नाही.", "transliteration": "Mala he maanya naahi.", "english": "I do not agree with this.", "hindi": "मुझे यह मंजूर नहीं है."},
                {"marathi": "हा दुसरा पर्याय योग्य आहे.", "transliteration": "Haa doosraa paryaay yogya aahe.", "english": "This second option is correct.", "hindi": "यह दूसरा विकल्प सही है."},
                {"marathi": "आपण यावर उद्या चर्चा करूया.", "transliteration": "Aapan yaavar udya charcha karooya.", "english": "We will discuss this tomorrow.", "hindi": "हम इस पर कल चर्चा करेंगे."},
                {"marathi": "तडजोड करणे शक्य आहे का?", "transliteration": "Tadajod karane shakya aahe ka?", "english": "Is it possible to compromise?", "hindi": "क्या समझौता करना संभव है?"},
                {"marathi": "माझ्या मते हे चुकीचे आहे.", "transliteration": "Maajhya mate he chukeeche aahe.", "english": "In my opinion this is wrong.", "hindi": "मेरी राय में यह गलत है."},
                {"marathi": "तुम्हाला काय वाटते सांगा.", "transliteration": "Tumhaala kaay vaatate saangaa.", "english": "Tell me what you think.", "hindi": "बताइए आपको क्या लगता है."}
            ]
        },
        {
            "id": "u25", "level": 5, "levelTitle": "Deeper Fluency", "levelHours": "12 hrs",
            "title": "Mixed Hindi-Marathi register", "titleMarathi": "मिश्र भाषा - मुंबई/पुणे",
            "description": "Code-switching as actually spoken in Mumbai & Pune", "icon": "🔀",
            "culturalNote": "Youth in Mumbai/Pune frequently mix Hindi, English, and Marathi words (e.g. 'load naka gheu' meaning don't stress).",
            "grammarFocus": "Colloquial code-switching and local slang words.",
            "phrases": [
                {"marathi": "काय मग, काय चाललंय दोस्ता?", "transliteration": "Kaay mag, kaay chaalalay dosta?", "english": "What's up, what's going on friend?", "hindi": "और बताओ, क्या चल रहा है दोस्त?"},
                {"marathi": "बिंधास्त जा, काही काळजी नको करू.", "transliteration": "Bindhaast ja, kaahi kaalaji nako karu.", "english": "Go carefree, do not worry about anything.", "hindi": "बिंदास जाओ, कोई चिंता मत करो."},
                {"marathi": "तिथे खूप राडा झाला काल रात्री.", "transliteration": "Tithe khoop raada zala kaal raatri.", "english": "There was a big fight there last night.", "hindi": "वहाँ कल रात बहुत हंगामा हुआ."},
                {"marathi": "लोड नका घेऊ, काम होऊन जाईल.", "transliteration": "Load naka gheu, kaam houn jaail.", "english": "Do not take stress, the work will be done.", "hindi": "तनाव मत लो, काम हो जाएगा."},
                {"marathi": "तू तर एकदम कडक काम केलेस!", "transliteration": "Too tar ekdam kadak kaam keles!", "english": "You did an awesome job!", "hindi": "तुमने तो एकदम कड़क काम किया!"},
                {"marathi": "टेंशन नको घे, सर्व सॉर्ट होईल.", "transliteration": "Tension nako ghe, sarva sort hoeel.", "english": "Don't worry, everything will get sorted.", "hindi": "टेंशन मत लो, सब सॉर्ट हो जाएगा."}
            ]
        },
        {
            "id": "u26", "level": 5, "levelTitle": "Deeper Fluency", "levelHours": "12 hrs",
            "title": "Emotions & deeper conversation", "titleMarathi": "भावना आणि सखोल चर्चा",
            "description": "Empathy, condolence, celebration phrases", "icon": "💖",
            "culturalNote": "Expressing grief uses respectful vocabulary ('nidhan' - demise, 'shraddhaanjali' - tribute).",
            "grammarFocus": "Empathic vocabulary and subjunctive emotional states.",
            "phrases": [
                {"marathi": "मला तुमच्याबद्दल खूप काळजी वाटते.", "transliteration": "Mela tumchyaabaddal khoop kaalajee vaatate.", "english": "I care about you a lot.", "hindi": "मुझे आपकी बहुत चिंता होती है."},
                {"marathi": "कठीण काळात मी तुमच्यासोबत आहे.", "transliteration": "Katheen kaalaat mee tumchyaasobat aahe.", "english": "I am with you in difficult times.", "hindi": "मुश्किल समय में मैं आपके साथ हूँ."},
                {"marathi": "त्यांच्या निधनाचे वृत्त ऐकून खूप दुःख झाले.", "transliteration": "Tyaanchya nidhanaache vrutta aikoon khoop duhkh zhale.", "english": "Very saddened to hear the news of their passing.", "hindi": "उनके निधन की खबर सुनकर बहुत दुख हुआ."},
                {"marathi": "स्वतःवर विश्वास ठेवा, सर्व शक्य आहे.", "transliteration": "Svatavar vishvaas theva, sarva shakya aahe.", "english": "Believe in yourself, everything is possible.", "hindi": "खुद पर विश्वास रखें, सब संभव है."},
                {"marathi": "घाबरू नका, मी इथेच आहे.", "transliteration": "Ghaabaroo nakaa, mee ithech aahe.", "english": "Don't be afraid, I am right here.", "hindi": "डरो मत, मैं यहीं हूँ."},
                {"marathi": "मला तुमचा खूप पाठिंबा मिळाला.", "transliteration": "Malaa tumchaa khoop paathimbaa milaalaa.", "english": "I got a lot of support from you.", "hindi": "मुझे आपका बहुत सहयोग मिला."}
            ]
        },
        # ================= LEVEL 6: Real-World Mastery (u27 - u32) =================
        {
            "id": "u27", "level": 6, "levelTitle": "Real-World Mastery", "levelHours": "8 hrs",
            "title": "Role-play: at the doctor", "titleMarathi": "दवाखान्यात भूमिका अभिनय",
            "description": "Symptoms, prescriptions, hospital phrases — full scenario", "icon": "🩺",
            "culturalNote": "At a clinic, doctors will check you and advise 'Pathya' (dietary guidelines).",
            "grammarFocus": "Expressing symptoms and medical imperative instructions.",
            "phrases": [
                {"marathi": "मला दोन दिवसांपासून ताप आहे.", "transliteration": "Mala don divasaanpaasoon taap aahe.", "english": "I have a fever for two days.", "hindi": "मुझे दो दिनों से बुखार है."},
                {"marathi": "डॉक्टर, औषध कधी घ्यायचे?", "transliteration": "Doctor, aushadh kadhee ghyaayche?", "english": "Doctor, when should I take the medicine?", "hindi": "डॉक्टर, दवा कब लेनी है?"},
                {"marathi": "दिवसातून तीन वेळा हे औषध घ्या.", "transliteration": "Divsaatoon teen velaa he aushadh ghyaa.", "english": "Take this medicine three times a day.", "hindi": "दिन में तीन बार यह दवा लें."},
                {"marathi": "जीभ दाखवा आणि खोल श्वास घ्या.", "transliteration": "Jeebh daakhvaa aani khol shvaas ghyaa.", "english": "Show your tongue and take a deep breath.", "hindi": "जीभ दिखाएं और गहरी सांस लें."},
                {"marathi": "काही पथ्य पाळायचे आहे का?", "transliteration": "Kaahi pathya paalaayche aahe ka?", "english": "Are there any dietary restrictions?", "hindi": "क्या कोई परहेज करना है?"},
                {"marathi": "दोन दिवस विश्रांती घ्या, बरे वाटेल.", "transliteration": "Don divas vishraantee ghyaa, bare vaatel.", "english": "Rest for two days, you will feel better.", "hindi": "दो दिन आराम करें, बेहतर महसूस होगा."}
            ]
        },
        {
            "id": "u28", "level": 6, "levelTitle": "Real-World Mastery", "levelHours": "8 hrs",
            "title": "Role-play: renting a house", "titleMarathi": "घर भाड्याने घेणे",
            "description": "Negotiating rent, asking about society rules", "icon": "🔑",
            "culturalNote": "Renting in big cities requires a standard 'Rent Agreement' (house rental contract).",
            "grammarFocus": "Renting terms, financial conditions, and household questions.",
            "phrases": [
                {"marathi": "या घराचे महिन्याचे भाडे किती आहे?", "transliteration": "Yaa gharaache mahinyaache bhaade kitee aahe?", "english": "How much is the monthly rent of this house?", "hindi": "इस घर का महीने का किराया कितना है?"},
                {"marathi": "डिपॉझिट किती द्यावे लागेल?", "transliteration": "Deposit kitee dyaave laagela?", "english": "How much deposit do I need to pay?", "hindi": "डिपॉजिट कितना देना होगा?"},
                {"marathi": "सोसायटीचे नियम काय आहेत?", "transliteration": "Society-che niyam kaay aaheet?", "english": "What are the society rules?", "hindi": "सोसायटी के क्या नियम हैं?"},
                {"marathi": "पाणी २४ तास उपलब्ध आहे का?", "transliteration": "Paani chovees taas upalabdha aahe ka?", "english": "Is water available 24 hours?", "hindi": "क्या पानी २४ घंटे उपलब्ध है?"},
                {"marathi": "पार्किंगसाठी वेगळी जागा आहे का?", "transliteration": "Parking-saathee vegalee jaagaa aahe ka?", "english": "Is there a separate space for parking?", "hindi": "क्या पार्किंग के लिए अलग जगह है?"},
                {"marathi": "आम्हाला रेंट एग्रीमेंट करावे लागेल.", "transliteration": "Aamhaala rent agreement karaave laagela.", "english": "We will need to make a rent agreement.", "hindi": "हमें रेंट एग्रीमेंट करना होगा."}
            ]
        },
        {
            "id": "u29", "level": 6, "levelTitle": "Real-World Mastery", "levelHours": "8 hrs",
            "title": "Role-play: at a government office", "titleMarathi": "शासकीय कार्यालयात",
            "description": "Formal Marathi, paperwork, polite persistence", "icon": "🏛️",
            "culturalNote": "Formal/written Marathi is used in 'Shaasakeeya Kaaryaalaya' (Government offices). Suffixes like 'Saaheb' are vital.",
            "grammarFocus": "Formal passive structures and administrative terminology.",
            "phrases": [
                {"marathi": "हा फॉर्म कुठे जमा करायचा?", "transliteration": "Haa form kuthe jamaa karaaycha?", "english": "Where should I submit this form?", "hindi": "यह फॉर्म कहाँ जमा करना है?"},
                {"marathi": "या अर्जासोबत कोणती कागदपत्रे लागतील?", "transliteration": "Yaa arjaasobat kontee kaagadpatre laagateel?", "english": "What documents are needed with this application?", "hindi": "इस आवेदन के साथ कौन से दस्तावेज लगेंगे?"},
                {"marathi": "मंजुरी मिळण्यासाठी किती दिवस लागतील?", "transliteration": "Manjooree milanyaasaathee kitee divas laagateel?", "english": "How many days will it take to get approval?", "hindi": "मंजूरी मिलने में कितने दिन लगेंगे?"},
                {"marathi": "कृपया इथे तुमची सही करा.", "transliteration": "Krupayaa ithe tumchee sahee kara.", "english": "Please sign here.", "hindi": "कृपया यहाँ अपने हस्ताक्षर करें."},
                {"marathi": "अधिकारी साहेब केव्हा भेटतील?", "transliteration": "Adhikaaree saaheb kevhaa bhetateel?", "english": "When will the officer meet?", "hindi": "अधिकारी साहब कब मिलेंगे?"},
                {"marathi": "माझा दाखला तयार झाला आहे का?", "transliteration": "Maajha daakhlaa tayaar zhala aahe ka?", "english": "Is my certificate ready?", "hindi": "क्या मेरा प्रमाण पत्र तैयार हो गया है?"}
            ]
        },
        {
            "id": "u30", "level": 6, "levelTitle": "Real-World Mastery", "levelHours": "8 hrs",
            "title": "Role-play: making friends", "titleMarathi": "मित्र बनवणे",
            "description": "Casual conversation, inviting someone out, small talk", "icon": "🍻",
            "culturalNote": "Inviting someone for Chai ('Chalaa aapan chahaa pyaaylaa jaaooya') is the default way to make friends in Maharashtra.",
            "grammarFocus": "Casual cohortative markers ('...ya') and friendly invitations.",
            "phrases": [
                {"marathi": "चला, आपण चहा प्यायला जाऊया.", "transliteration": "Chalaa, aapan chahaa pyaaylaa jaaooya.", "english": "Come, let's go for tea.", "hindi": "चलो, हम चाय पीने चलते हैं."},
                {"marathi": "तुम्ची आवड काय आहे?", "transliteration": "Tumchee aavad kaay aahe?", "english": "What are your hobbies / what do you like?", "hindi": "आपकी पसंद क्या है?"},
                {"marathi": "उद्या संध्याकाळी आपण फिरायला जाऊ.", "transliteration": "Udya sandhyaakaalee aapan phiraaylaa jaaoo.", "english": "We will go for a walk tomorrow evening.", "hindi": "कल शाम हम घूमने चलेंगे."},
                {"marathi": "मला तुमच्याशी गप्पा मारून छान वाटले.", "transliteration": "Malaa tumchyaashee gappa maaroon thaan vaatle.", "english": "I felt good chatting with you.", "hindi": "मुझे आपसे बातें करके बहुत अच्छा लगा."},
                {"marathi": "हा घ्या माझा मोबाईल नंबर.", "transliteration": "Haa ghyaa maajha mobile number.", "english": "Here is my mobile number.", "hindi": "यह लीजिये मेरा मोबाइल नंबर."},
                {"marathi": "कधीतरी आमच्या घरी या नक्की.", "transliteration": "Kadheetaree aamchya gharee yaa nakki.", "english": "Do visit our home sometime.", "hindi": "कभी हमारे घर ज़रूर आइयेगा."}
            ]
        },
        {
            "id": "u31", "level": 6, "levelTitle": "Real-World Mastery", "levelHours": "8 hrs",
            "title": "Listening comprehension sprints", "titleMarathi": "ऐकण्याची चाचणी - वेगवान",
            "description": "Real-speed native audio — no slowing down, no subtitles", "icon": "🏃",
            "culturalNote": "This sprint practices listening to native speakers who talk rapidly, using complex double structures.",
            "grammarFocus": "Advanced subordinate phrases and complex syntax clauses.",
            "phrases": [
                {"marathi": "लवकरात लवकर हे महत्त्वाचे काम संपवून टाक.", "transliteration": "Lavakaraat lavakar he mahattvaache kaam sampavoon taak.", "english": "Finish this important work as soon as possible.", "hindi": "जल्द से जल्द यह महत्वपूर्ण काम खत्म कर दो."},
                {"marathi": "तू उद्या सकाळी नक्की वेळेवर पोहोचू शकशील का?", "transliteration": "Too udya sakaalee nakki velevar pohachoo shakashil ka?", "english": "Will you be able to reach on time tomorrow morning?", "hindi": "क्या तुम कल सुबह निश्चित रूप से समय पर पहुँच सकोगे?"},
                {"marathi": "त्याच्या बोलण्याकडे अजिबात लक्ष देऊ नकोस.", "transliteration": "Tyaachya bolanyaakade ajibaat laksha deu nakos.", "english": "Do not pay attention to what he says at all.", "hindi": "उसकी बातों पर बिल्कुल ध्यान मत देना."},
                {"marathi": "मला तिथे पोहोचायला किमान अर्धा तास लागेल.", "transliteration": "Malaa tithe pohachaaylaa kimaan ardhaa taas lageel.", "english": "It will take me at least half an hour to reach there.", "hindi": "मुझे वहाँ पहुँचने में कम से कम आधा घंटा लगेगा."},
                {"marathi": "तिने सांगितलेली गोष्ट मला नीट आठवत नाही.", "transliteration": "Tine saangitalelee gosht malaa neet aathavat naahi.", "english": "I do not remember the story she told properly.", "hindi": "मुझे उसके द्वारा बताई गई बात ठीक से याद नहीं है."},
                {"marathi": "जर काही अडचण असेल तर मला ताबडतोब सांगा.", "transliteration": "Jar kaahi adchan aseel tar malaa taabadtob saangaa.", "english": "If there is any problem, tell me immediately.", "hindi": "अगर कोई समस्या हो तो मुझे तुरंत बताएं."}
            ]
        },
        {
            "id": "u32", "level": 6, "levelTitle": "Real-World Mastery", "levelHours": "8 hrs",
            "title": "Final conversation simulations", "titleMarathi": "अंतिम संभाषण परीक्षा",
            "description": "Open-ended AI conversation partner — full assessment", "icon": "🎓",
            "culturalNote": "Congratulations on completing all 32 units! You are now prepared to speak basic conversational Marathi in public.",
            "grammarFocus": "Consolidating all speech and conversation styles.",
            "phrases": [
                {"marathi": "अभिनंदन, तुम्ही आता उत्तम मराठी बोलू शकता!", "transliteration": "Abhinandan, tumhi aata uttam marathi bolu shakata!", "english": "Congratulations, you can now speak excellent Marathi!", "hindi": "बधाई हो, अब आप बेहतरीन मराठी बोल सकते हैं!"},
                {"marathi": "मराठी शिकणे हा एक खूप छान प्रवास होता.", "transliteration": "Marathi shikane ha ek khoop thaan pravaas hota.", "english": "Learning Marathi was a very wonderful journey.", "hindi": "मराठी सीखना एक बहुत ही शानदार यात्रा थी."},
                {"marathi": "आता मी आत्मविश्वासाने मराठीत बोलू शकतो.", "transliteration": "Aata mee aatmavishvaasane marathit bolu shakato.", "english": "Now I can speak in Marathi with confidence (m).", "hindi": "अब मैं आत्मविश्वास के साथ मराठी में बोल सकता हूँ."},
                {"marathi": "सतत सराव केल्यामुळे माझी प्रगती झाली.", "transliteration": "Satat saraav kelyamule maajhee pragatee zhalee.", "english": "My progress happened due to continuous practice.", "hindi": "लगातार अभ्यास के कारण मेरी प्रगति हुई."},
                {"marathi": "मराठी भाषेबद्दल मला खूप आदर वाटतो.", "transliteration": "Marathi bhaashebaddal malaa khoop aadar vaatato.", "english": "I feel great respect for the Marathi language.", "hindi": "मुझे मराठी भाषा के प्रति बहुत सम्मान महसूस होता है."},
                {"marathi": "भविष्यात मी आणखी सराव चालू ठेवीन.", "transliteration": "Bhavishyaat mee aankhee saraav chaaloo theveen.", "english": "In the future, I will keep practicing more.", "hindi": "भविष्य में मैं और अभ्यास जारी रखूँगा."}
            ]
        }
    ]

    final_modules = []

    for item in units_data:
        uid = item["id"]
        phrases = item["phrases"]
        
        # Ensure exact IDs for phrases in this unit
        for idx, p in enumerate(phrases):
            p["id"] = f"{uid}-l1-p{idx+1}"

        # Create exactly 1 lesson inside the unit
        lesson = {
            "id": f"{uid}-l1",
            "title": item["title"],
            "titleMarathi": item["titleMarathi"],
            "lessonNumber": 1,
            "culturalNote": item["culturalNote"],
            "grammarFocus": item["grammarFocus"],
            "phrases": phrases,
            "quiz": [
                {
                    "id": f"{uid}-l1-q1",
                    "type": "multiple-choice",
                    "question": f"What is the English meaning of '{phrases[0]['marathi']}'?",
                    "options": [phrases[0]['english'], phrases[1]['english'], phrases[2]['english'], "None of the above"],
                    "answerIndex": 0,
                    "explanation": f"'{phrases[0]['marathi']}' translates to '{phrases[0]['english']}'."
                },
                {
                    "id": f"{uid}-l1-q2",
                    "type": "multiple-choice",
                    "question": f"Which is the correct Marathi translation for '{phrases[1]['english']}'?",
                    "options": [phrases[0]['marathi'], phrases[1]['marathi'], "इतर काहीतरी", "माहित नाही"],
                    "answerIndex": 1,
                    "explanation": f"'{phrases[1]['marathi']}' means '{phrases[1]['english']}'."
                }
            ]
        }

        # Create flashcards (6 phrases front/back)
        flashcards = []
        for p in phrases:
            flashcards.append({
                "id": f"{uid}-fc-{p['id']}",
                "front": p["marathi"],
                "back": p["english"],
                "transliteration": p["transliteration"]
            })

        # Create module test (3 questions)
        moduleTest = {
            "moduleId": uid,
            "passingScore": 70,
            "questions": [
                {
                    "id": f"{uid}-t1",
                    "type": "multiple-choice",
                    "question": f"Translate to Marathi: '{phrases[2]['english']}'",
                    "options": [phrases[0]['marathi'], phrases[1]['marathi'], phrases[2]['marathi'], "चुकीचा पर्याय"],
                    "answerIndex": 2,
                    "explanation": f"'{phrases[2]['marathi']}' means '{phrases[2]['english']}'."
                },
                {
                    "id": f"{uid}-t2",
                    "type": "multiple-choice",
                    "question": f"What is the transliteration of '{phrases[0]['marathi']}'?",
                    "options": [phrases[1]['transliteration'], phrases[0]['transliteration'], "None", "Other"],
                    "answerIndex": 1,
                    "explanation": f"The phonetic spelling is '{phrases[0]['transliteration']}'."
                },
                {
                    "id": f"{uid}-t3",
                    "type": "multiple-choice",
                    "question": f"Translate to English: '{phrases[1]['marathi']}'",
                    "options": [phrases[0]['english'], phrases[1]['english'], "Incorrect translation", "No meaning"],
                    "answerIndex": 1,
                    "explanation": f"'{phrases[1]['marathi']}' translates to '{phrases[1]['english']}'."
                }
            ]
        }

        # Construct module object
        mod = {
            "id": uid,
            "title": item["title"],
            "titleMarathi": item["titleMarathi"],
            "description": item["description"],
            "icon": item["icon"],
            "level": item["level"],
            "levelTitle": item["levelTitle"],
            "levelHours": item["levelHours"],
            "totalLessons": 1,
            "estimatedHours": 2,
            "difficulty": "Beginner" if item["level"] <= 2 else "Intermediate" if item["level"] <= 4 else "Advanced",
            "lessons": [lesson],
            "flashcards": flashcards,
            "moduleTest": moduleTest
        }
        
        final_modules.append(mod)

    # Save to c:\Translation\Translation\data\lessons.json
    output_data = {
        "modules": final_modules
    }
    
    with open(r'c:\Translation\Translation\data\lessons.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully generated new lessons.json with {len(final_modules)} modules!")

    # Build and save assessments.json keyed by u1..u32
    assessments = {
        "moduleAssessments": []
    }
    for m in final_modules:
        assessments["moduleAssessments"].append({
            "moduleId": m["id"],
            "flashcards": m["flashcards"],
            "moduleTest": m["moduleTest"],
            "lessonQuizzes": {
                f"{m['id']}-l1": m["lessons"][0]["quiz"]
            }
        })
        
    with open(r'c:\Translation\Translation\data\assessments.json', 'w', encoding='utf-8') as f:
        json.dump(assessments, f, ensure_ascii=False, indent=2)
        
    print("Successfully generated new assessments.json!")

if __name__ == '__main__':
    rebuild()
