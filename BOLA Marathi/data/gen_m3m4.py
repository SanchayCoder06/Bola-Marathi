import json, os

def build_module(mid, title, titleM, desc, icon, total, hours, diff, lessons_raw):
    lessons = []
    for ln, (lt, ltm, cn, gf, phr) in enumerate(lessons_raw, 1):
        phrases = []
        for pi, (m, t, e, d, u) in enumerate(phr, 1):
            phrases.append({"id":f"{mid}-l{ln}-p{pi}","marathi":m,"transliteration":t,"english":e,"difficulty":d,"usage":u})
        lessons.append({"id":f"{mid}-l{ln}","title":lt,"titleMarathi":ltm,"lessonNumber":ln,"culturalNote":cn,"grammarFocus":gf,"phrases":phrases})
    return {"id":mid,"title":title,"titleMarathi":titleM,"description":desc,"icon":icon,"totalLessons":total,"estimatedHours":hours,"difficulty":diff,"lessons":lessons}

modules = []

# ===================== MODULE 3: Numbers & Time =====================
modules.append(build_module("m3", "Numbers & Time", "संख्या आणि वेळ", "Master counting, dates, telling time, and schedules", "⏰", 15, 5, "beginner", [
  # L1: Numbers 1-10
  ("Numbers 1-10", "संख्या १ ते १०", 
   "Counting in Marathi uses unique Devanagari numerals. Standard counting is used for items, money, and time.", None, [
    ("एक", "Ek", "One", "beginner", "Counting 1"),
    ("दोन", "Don", "Two", "beginner", "Counting 2"),
    ("तीन", "Teen", "Three", "beginner", "Counting 3"),
    ("चार", "Chaar", "Four", "beginner", "Counting 4"),
    ("पाच", "Paach", "Five", "beginner", "Counting 5"),
    ("सहा", "Sahaa", "Six", "beginner", "Counting 6"),
    ("सात", "Saat", "Seven", "beginner", "Counting 7"),
    ("आठ", "Aath", "Eight", "beginner", "Counting 8"),
    ("नऊ", "Nau", "Nine", "beginner", "Counting 9"),
    ("दहा", "Dahaa", "Ten", "beginner", "Counting 10")
  ]),
  # L2: Numbers 11-20
  ("Numbers 11-20", "संख्या ११ ते २०", 
   "Numbers from 11 to 20 have unique names in Marathi. Practicing these is essential for transactions and telephone numbers.", None, [
    ("अकरा", "Akaraa", "Eleven", "beginner", "Counting 11"),
    ("बारा", "Baaraa", "Twelve", "beginner", "Counting 12"),
    ("तेरा", "Teraa", "Thirteen", "beginner", "Counting 13"),
    ("चौदा", "Chaudaa", "Fourteen", "beginner", "Counting 14"),
    ("पंधरा", "Pandharaa", "Fifteen", "beginner", "Counting 15"),
    ("सोळा", "SoLaa", "Sixteen", "beginner", "Counting 16"),
    ("सतरा", "Sataraa", "Seventeen", "beginner", "Counting 17"),
    ("अठरा", "Atharaa", "Eighteen", "beginner", "Counting 18"),
    ("एकोणीस", "EkoNees", "Nineteen", "beginner", "Counting 19"),
    ("वीस", "Vees", "Twenty", "beginner", "Counting 20")
  ]),
  # L3: Tens & 100
  ("Tens & 100", "दशकांचे गट आणि १००", 
   "Counting in tens (30, 40, 50...) is crucial for prices and counting larger quantities. 'Shambhar' is 100.", None, [
    ("तीस", "Tees", "Thirty", "beginner", "Counting 30"),
    ("चाळीस", "ChaaLees", "Forty", "beginner", "Counting 40"),
    ("पन्नास", "Pannaas", "Fifty", "beginner", "Counting 50"),
    ("साठ", "Saath", "Sixty", "beginner", "Counting 60"),
    ("सत्तर", "Sattar", "Seventy", "beginner", "Counting 70"),
    ("ऐंशी", "Ainshee", "Eighty", "beginner", "Counting 80"),
    ("नव्वद", "Navvad", "Ninety", "beginner", "Counting 90"),
    ("शंभर", "Shambhar", "One Hundred", "beginner", "Counting 100")
  ]),
  # L4: Ordinals & Fractions
  ("Ordinals & Fractions", "क्रमवाचक आणि अपूर्णांक", 
   "Fractions like 'Paav' (quarter), 'Ardhaa' (half), and 'Paun' (three-quarters) are heavily used in vegetable markets.", None, [
    ("पहिला", "Pahilaa", "First", "beginner", "Order - 1st"),
    ("दुसरा", "Dusraa", "Second", "beginner", "Order - 2nd"),
    ("तिसरा", "Tisraa", "Third", "beginner", "Order - 3rd"),
    ("पाव", "Paav", "Quarter (1/4)", "beginner", "Fraction - 250g or 0.25"),
    ("अर्धा", "Ardhaa", "Half (1/2)", "beginner", "Fraction - 500g or 0.5"),
    ("पाऊण", "PauN", "Three-quarters (3/4)", "beginner", "Fraction - 750g or 0.75"),
    ("सव्वा", "Savvaa", "One and a quarter (1.25)", "beginner", "Fraction - 1.25"),
    ("दीड", "Deed", "One and a half (1.5)", "beginner", "Fraction - 1.5"),
    ("अडीच", "Adeech", "Two and a half (2.5)", "beginner", "Fraction - 2.5")
  ]),
  # L5: Asking the Time
  ("Asking the Time", "वेळ विचारणे", 
   "Asking the time is usually polite. Use 'kiti' (how many/much) and 'vaajle' (struck/sounded).", None, [
    ("किती वाजले?", "Kiti vaajale?", "What time is it?", "beginner", "Common time inquiry"),
    ("वेळ काय झाली आहे?", "VeL kaay jhaali aahe?", "What is the time?", "beginner", "Alternative time inquiry"),
    ("तुमच्या घड्याळात किती वाजलेत?", "Tumchyaa ghaDyaaLaat kiti vaajalet?", "What is the time by your watch?", "beginner", "Polite watch inquiry"),
    ("बस कधी सुटणार आहे?", "Bus kadhi suTNaar aahe?", "When will the bus leave?", "beginner", "Transport timing inquiry"),
    ("दुकानाची वेळ काय आहे?", "Dukaanachee veL kaay aahe?", "What are the shop timings?", "beginner", "Business hours inquiry"),
    ("किती वेळ लागेल?", "Kiti veL laagel?", "How much time will it take?", "beginner", "Duration inquiry"),
    ("कार्यक्रम कधी सुरू होईल?", "Kaaryakram kadhi suroo hoeel?", "When will the program start?", "beginner", "Event schedule inquiry"),
    ("तुमच्याकडे वेळ आहे का?", "Tumchyaakade veL aahe ka?", "Do you have time?", "beginner", "Asking for someone's time")
  ]),
  # L6: Telling the Time
  ("Telling the Time", "वेळ सांगणे", 
   "Marathi uses 'vaajle' to say it is X o'clock. For half past, use 'saaDe'. For quarter past, 'savvaa'. For quarter to, 'pauNe'.", None, [
    ("एक वाजला आहे", "Ek vaajalaa aahe", "It is one o'clock", "beginner", "Telling 1:00"),
    ("दोन वाजले आहेत", "Don vaajale aahet", "It is two o'clock", "beginner", "Telling 2:00"),
    ("सव्वा तीन वाजलेत", "Savvaa teen vaajalet", "It is quarter past three", "beginner", "Telling 3:15"),
    ("साडे चार वाजलेत", "SaaDe chaar vaajalet", "It is half past four", "beginner", "Telling 4:30"),
    ("पावणे पाच वाजलेत", "PauNe paach vaajalet", "It is quarter to five", "beginner", "Telling 4:45"),
    ("दीड वाजला आहे", "Deed vaajalaa aahe", "It is one-thirty (1:30)", "beginner", "Telling 1:30"),
    ("अडीच वाजले आहेत", "Adeech vaajale aahet", "It is two-thirty (2:30)", "beginner", "Telling 2:30"),
    ("बारा वाजले आहेत", "Baaraa vaajale aahet", "It is twelve o'clock (noon/night)", "beginner", "Telling 12:00")
  ]),
  # L7: Parts of the Day
  ("Parts of the Day", "दिवसाचे भाग", 
   "Understanding parts of the day helps in setting appointments and planning routines.", None, [
    ("सकाळ", "SakaaL", "Morning", "beginner", "Morning time"),
    ("दुपार", "Dupaar", "Afternoon / Noon", "beginner", "Midday time"),
    ("संध्याकाळ", "SandhyaakaaL", "Evening", "beginner", "Evening time"),
    ("रात्र", "Raatra", "Night", "beginner", "Night time"),
    ("पहाट", "PahaaT", "Dawn / Early Morning", "beginner", "Predawn hours (3 AM - 5 AM)"),
    ("मध्यरात्र", "Madhyaraatra", "Midnight", "beginner", "12 AM"),
    ("आज सकाळी", "Aaj sakaaLi", "Today morning", "beginner", "Earlier today"),
    ("आज रात्री", "Aaj raatri", "Tonight", "beginner", "Later tonight")
  ]),
  # L8: Days of the Week
  ("Days of the Week", "आठवड्याचे दिवस", 
   "Days of the week end in '-vaar'. Knowing them is vital for plans and schedules.", None, [
    ("सोमवार", "Somvaar", "Monday", "beginner", "First day of workweek"),
    ("मंगळवार", "MangaLvaar", "Tuesday", "beginner", "Day 2"),
    ("बुधवार", "Budhvaar", "Wednesday", "beginner", "Day 3"),
    ("गुरुवार", "Guruvaar", "Thursday", "beginner", "Day 4"),
    ("शुक्रवार", "Shukravaar", "Friday", "beginner", "Day 5"),
    ("शनिवार", "Shanivaar", "Saturday", "beginner", "Weekend day"),
    ("रविवार", "Ravivaar", "Sunday", "beginner", "Holiday / Weekend day"),
    ("आठवडा", "Aathavadaa", "Week", "beginner", "7-day period")
  ]),
  # L9: Months & Seasons
  ("Months & Seasons", "महिने आणि ऋतू", 
   "Maharashtra has three primary seasons: UnhaLaa (summer), Pausaala (monsoon), and Hivaala (winter).", None, [
    ("महिना", "Mahinaa", "Month", "beginner", "Calendar month"),
    ("वर्ष", "Varsha", "Year", "beginner", "Calendar year"),
    ("उन्हाळा", "UnhaaLaa", "Summer", "beginner", "Hot season (March-May)"),
    ("पावसाळा", "PaousaaLaa", "Monsoon / Rainy Season", "beginner", "Rainy season (June-September)"),
    ("हिवाळा", "HivaaLaa", "Winter", "beginner", "Cold season (October-February)"),
    ("जानेवारी", "Jaanevaari", "January", "beginner", "Calendar month 1"),
    ("दिवाळी ऑक्टोबर किंवा नोव्हेंबरमध्ये असते", "DivaaLi October kimvaa November-madhye aste", "Diwali is in October or November", "beginner", "Season reference"),
    ("पावसाळा जूनमध्ये सुरू होतो", "PaousaaLaa June-madhye suroo hoto", "Monsoon starts in June", "beginner", "Season start reference")
  ]),
  # L10: Relative Time
  ("Relative Time", "सापेक्ष वेळ", 
   "Terms like 'today', 'tomorrow', 'yesterday' are essential for basic storytelling and scheduling.", None, [
    ("आज", "Aaj", "Today", "beginner", "Current day"),
    ("उद्या", "Udyaa", "Tomorrow", "beginner", "Next day"),
    ("काल", "Kaal", "Yesterday", "beginner", "Previous day"),
    ("परवा", "Parvaa", "Day before yesterday / Day after tomorrow", "beginner", "Context decides past or future (2 days away)"),
    ("आता", "Aataa", "Now", "beginner", "Immediately"),
    ("नंतर", "Nantar", "Later", "beginner", "In the future"),
    ("आधी", "Aadhi", "Before / Earlier", "beginner", "In the past"),
    ("लवकरच", "Lavkarach", "Soon", "beginner", "Shortly")
  ]),
  # L11: Frequency Adverbs
  ("Frequency Adverbs", "वारंवारता दर्शक शब्द", 
   "Adverbs like 'always' and 'never' clarify your habits and preferences.", None, [
    ("नेहमी", "Nehmi", "Always", "beginner", "100% frequency"),
    ("कधीकधी", "Kadhikadhi", "Sometimes", "beginner", "Partial frequency"),
    ("कधीच नाही", "Kadhich naahi", "Never", "beginner", "0% frequency"),
    ("रोज", "Roj", "Daily / Every day", "beginner", "Daily habit"),
    ("दर आठवड्याला", "Dar aathavDyaalaa", "Every week", "beginner", "Weekly frequency"),
    ("पुन्हा पुन्हा", "Punhaa punhaa", "Repeatedly / Again and again", "beginner", "Repetition"),
    ("अधूनमधून", "Adhoon-madhoon", "Occasionally", "beginner", "Spontaneous frequency"),
    ("सहसा", "Sahasaa", "Usually / Generally", "beginner", "Habitual frequency")
  ]),
  # L12: Duration
  ("Duration", "कालावधी", 
   "Units of time like minutes and hours are useful for quantifying waiting times.", None, [
    ("सेकंद", "Second", "Second", "beginner", "Time unit"),
    ("मिनिट", "Minit", "Minute", "beginner", "Time unit"),
    ("तास", "Taas", "Hour", "beginner", "Time unit"),
    ("दिवस", "Divas", "Day", "beginner", "Time unit"),
    ("दहा मिनिटे थांबा", "Dahaa minite thaanbaa", "Wait for ten minutes", "beginner", "Instruction to wait"),
    ("मला दोन तास लागतील", "Malaa don taas laageetil", "It will take me two hours", "beginner", "Estimating time"),
    ("तो तीन दिवस सुट्टीवर आहे", "To teen divas suTTeevar aahe", "He is on leave for three days", "beginner", "Duration of absence"),
    ("अर्धा तास", "Ardhaa taas", "Half an hour", "beginner", "30 minutes")
  ]),
  # L13: Timelines & Schedules
  ("Timelines & Schedules", "वेळापत्रक आणि वेळमर्यादा", 
   "Talking about when things start, end, or when you are free.", None, [
    ("कधी सुरू होणार?", "Kadhi suroo hoNaar?", "When will it start?", "beginner", "Starting time inquiry"),
    ("कधी संपणार?", "Kadhi sanpNaar?", "When will it end?", "beginner", "Ending time inquiry"),
    ("वेळेवर या", "VeLevar yaa", "Come on time", "beginner", "Admonition for punctuality"),
    ("मला उशीर झाला आहे", "Malaa usheer jhaalaa aahe", "I am late", "beginner", "Apologizing for lateness"),
    ("वेळ संपली", "VeL sanplee", "Time is up", "beginner", "Deadline notification"),
    ("माझ्याकडे वेळ नाही", "Maajhyaakade veL naahi", "I don't have time", "beginner", "Expressing busyness"),
    ("मी मोकळा आहे", "Mee mokaLaa aahe", "I am free (male)", "beginner", "Expressing availability"),
    ("मी मोकळी आहे", "Mee mokaLee aahe", "I am free (female)", "beginner", "Expressing availability")
  ]),
  # L14: Date & Year
  ("Date & Year", "दिनांक आणि वर्ष", 
   "Asking for or stating specific calendar dates.", None, [
    ("आजची तारीख काय आहे?", "Aajchee taareekh kaay aahe?", "What is today's date?", "beginner", "Date inquiry"),
    ("आज चौदा तारीख आहे", "Aaj chaudaa taareekh aahe", "Today is the 14th", "beginner", "Stating date"),
    ("तुमचा वाढदिवस कधी असतो?", "Tumchaa vaadhdivas kadhi asto?", "When is your birthday?", "beginner", "Birthday inquiry"),
    ("नवीन वर्ष", "Naveen varsha", "New Year", "beginner", "Festive greeting context"),
    ("या वर्षात", "Yaa varshaat", "In this year", "beginner", "Yearly timeline"),
    ("पुढच्या महिन्यात", "PuDhchyaa mahinyaat", "Next month", "beginner", "Monthly timeline"),
    ("मागील वर्षी", "Maageel varshi", "Last year", "beginner", "Past timeline"),
    ("तारीख बदलली आहे", "Taareekh badallee aahe", "The date has changed", "beginner", "Schedule adjustment")
  ]),
  # L15: Age & Milestones
  ("Age & Milestones", "वय आणि टप्पे", 
   "Discussing age, longevity, and key life milestones.", None, [
    ("तुमचं वय किती आहे?", "Tumcham vay kiti aahe?", "How old are you?", "beginner", "Age inquiry"),
    ("मी पंचवीस वर्षांचा आहे", "Mee panchvees varshaanchaa aahe", "I am 25 years old (male)", "beginner", "Stating age"),
    ("मी पंचवीस वर्षांची आहे", "Mee panchvees varshaanchee aahe", "I am 25 years old (female)", "beginner", "Stating age"),
    ("माझा मुलगा दहा वर्षांचा आहे", "Maajhaa mulgaa dahaa varshaanchaa aahe", "My son is ten years old", "beginner", "Talking about child's age"),
    ("लहान बाळ", "Lahaan baaL", "Small baby", "beginner", "Infancy descriptor"),
    ("तरुण", "TarooN", "Young / Youth", "beginner", "Adulthood descriptor"),
    ("वृद्ध / वयस्कर", "Vruddha / Vayaskar", "Elderly / Old", "beginner", "Old age descriptor"),
    ("दीर्घायुषी व्हा", "Deerghaayushi vhaa", "May you live long", "beginner", "Traditional blessing")
  ])
]))

# ===================== MODULE 4: At the Market =====================
modules.append(build_module("m4", "At the Market", "बाजारात", "Shop for groceries, vegetables, bargaining and paying", "🛍️", 15, 5, "beginner", [
  # L1: Finding a Shop
  ("Finding a Shop", "दुकान शोधणे", 
   "Asking where to buy daily necessities. 'Kuthe' is the keyword for 'where'.", None, [
    ("बाजार कुठे आहे?", "Baajaar kuthe aahe?", "Where is the market?", "beginner", "General market direction"),
    ("किराणा दुकान कुठे आहे?", "KiraaNaa dukaan kuthe aahe?", "Where is the grocery store?", "beginner", "Grocery search"),
    ("भाजीचे दुकान कुठे आहे?", "Bhaajeechen dukaan kuthe aahe?", "Where is the vegetable shop?", "beginner", "Vegetable shop search"),
    ("जवळच सुपरमार्केट आहे ka?", "JavaLach supermarket aahe ka?", "Is there a supermarket nearby?", "beginner", "Supermarket search"),
    ("कपड्यांचे दुकान", "KapDyaanche dukaan", "Clothing store", "beginner", "Shopping location"),
    ("औषधांचे दुकान", "Aushadhaanche dukaan", "Pharmacy", "beginner", "Medical shop search"),
    ("हे दुकान कधी उघडतं?", "He dukaan kadhi ughaDatan?", "When does this shop open?", "beginner", "Inquiring shop hours"),
    ("हे दुकान कधी बंद होतं?", "He dukaan kadhi band hotan?", "When does this shop close?", "beginner", "Inquiring closing hours")
  ]),
  # L2: Shop Greetings
  ("Shop Greetings", "दुकानदाराशी संभाषण", 
   "Starting a friendly exchange with a shopkeeper (dukaandaar).", None, [
    ("नमस्कार काका", "Namaskaar kaakaa", "Hello Uncle", "beginner", "Friendly respect to male shopkeeper"),
    ("मला मदत हवी आहे", "Malaa madat havee aahe", "I need help", "beginner", "Seeking assistance"),
    ("तुमच्याकडे ... आहे का?", "Tumchyaakade ... aahe ka?", "Do you have ...?", "beginner", "Checking stock"),
    ("मला ... दाखवा", "Malaa ... daakhvaa", "Please show me ...", "beginner", "Asking to view items"),
    ("हे काय आहे?", "He kaay aahe?", "What is this?", "beginner", "Asking about unidentified item"),
    ("ते काय आहे?", "Te kaay aahe?", "What is that?", "beginner", "Asking about distant item"),
    ("मला दुसरं काहीतरी दाखवा", "Malaa dusaram kaahitari daakhvaa", "Show me something else", "beginner", "Asking for alternatives"),
    ("हे नवीन आहे का?", "He naveen aahe ka?", "Is this new?", "beginner", "Checking freshness/arrival")
  ]),
  # L3: Asking for Prices
  ("Asking for Prices", "किंमत विचारणे", 
   "The most fundamental market phrase. 'Kiti' means how much.", None, [
    ("याची किंमत काय आहे?", "Yaachee kinmat kaay aahe?", "What is its price?", "beginner", "Asking price of single item"),
    ("हे कितीला दिले?", "He kiteelaa dile?", "How much for this?", "beginner", "Very common informal price inquiry"),
    ("एक किलोचे किती?", "Ek keeloche kiti?", "How much for one kilogram?", "beginner", "Rate per kilogram"),
    ("डझनचे किती?", "Dazanche kiti?", "How much for a dozen?", "beginner", "Rate per dozen (usually bananas/mangoes)"),
    ("फार महाग आहे!", "Phaar mahaag aahe!", "It is very expensive!", "beginner", "Expressing shock at price"),
    ("स्वस्त आहे", "Svast aahe", "It is cheap / reasonable", "beginner", "Agreeing on price"),
    ("एकूण किती झाले?", "EkooN kiti jhaale?", "How much is the total?", "beginner", "Asking for final bill"),
    ("सुट्टे पैसे आहेत का?", "SuTTe paise aahet ka?", "Do you have change?", "beginner", "Change inquiry")
  ]),
  # L4: Bargaining
  ("Bargaining", "भाव करणे", 
   "Bargaining is common in street markets in Maharashtra. Be polite but firm. Use 'thodaa' (a little) and 'kami karaa' (reduce).", None, [
    ("थोडं कमी करा ना", "Thodam kami karaa naa", "Please reduce the price a little", "beginner", "Polite request to lower price"),
    ("योग्य भाव लावा", "Yogya bhaav laavaa", "Charge a fair price", "beginner", "Asking for reasonable rate"),
    ("मी नेहमी येतो इथे", "Mee nehmi yeto ithe", "I come here regularly (male)", "beginner", "Building rapport to bargain"),
    ("मी नेहमी येते इथे", "Mee nehmi yete ithe", "I come here regularly (female)", "beginner", "Building rapport to bargain"),
    ("नाही, हे खूप जास्त आहे", "Naahi, he khoop jaasta aahe", "No, this is too much", "beginner", "Refusing high price"),
    ("पन्नास रुपयाला द्याल का?", "Pannaas rupayaalaa dyaal ka?", "Will you give it for 50 rupees?", "beginner", "Offering a specific price"),
    ("शेवटचा भाव सांगा", "ShevaTchaa bhaav saangaa", "Tell me your final price", "beginner", "Ending the negotiation"),
    ("ठीक आहे, पॅक करा", "Theek aahe, pack karaa", "Okay, pack it", "beginner", "Agreeing to buy")
  ]),
  # L5: Quantities & Weights
  ("Quantities & Weights", "प्रमाण आणि वजन", 
   "Ordering vegetables by weight: 'Kilo' and 'Gram' are standard.", None, [
    ("मला अर्धा किलो द्या", "Malaa ardhaa keelo dyaa", "Give me half a kilo", "beginner", "Ordering 500g"),
    ("पाव किलो", "Paav keelo", "Quarter kilo (250 grams)", "beginner", "Ordering 250g"),
    ("एक किलो बटाटे द्या", "Ek keelo baTaate dyaa", "Give me one kilo of potatoes", "beginner", "Vegetable order"),
    ("दोनशे पन्नास ग्रॅम", "Donshe pannaas gram", "250 grams", "beginner", "Specific weight metric"),
    ("थोडे जास्त द्या", "Thode jaasta dyaa", "Give a little more", "beginner", "Asking to top up"),
    ("कमी करा", "Kami karaa", "Reduce the weight / quantity", "beginner", "Adjusting amount"),
    ("एक जुडी कोथिंबीर", "Ek judee kothimbeer", "One bunch of coriander", "beginner", "Bunch-based quantity"),
    ("अजून एक द्या", "Ajoon ek dyaa", "Give one more", "beginner", "Adding one item")
  ]),
  # L6: Fruits & Vegetables
  ("Fruits & Vegetables", "फळे आणि भाज्या", 
   "Common produce terms in Maharashtra. Mangoes (Haapoos) are highly celebrated.", None, [
    ("कांदा", "Kaandaa", "Onion", "beginner", "Essential vegetable"),
    ("बटाटा", "BaTaaTaa", "Potato", "beginner", "Common vegetable"),
    ("टोमॅटो", "Tomato", "Tomato", "beginner", "Common vegetable"),
    ("आंबा", "Aanbaa", "Mango", "beginner", "Fruit"),
    ("केळी", "KeLee", "Bananas", "beginner", "Fruit"),
    ("सफरचंद", "Safarachand", "Apple", "beginner", "Fruit"),
    ("भाजी ताजी आहे का?", "Bhaajee taajee aahe ka?", "Is the vegetable fresh?", "beginner", "Checking quality"),
    ("हे आंबे गोड आहेत का?", "He aanbe god aahet ka?", "Are these mangoes sweet?", "beginner", "Checking fruit taste")
  ]),
  # L7: Groceries & Staples
  ("Groceries & Staples", "किराणा आणि धान्य", 
   "Common ingredients in Maharashtrian kitchens: rice, oil, wheat flour.", None, [
    ("तांदूळ", "TaandooL", "Rice", "beginner", "Staple"),
    ("गहू", "Gahoo", "Wheat", "beginner", "Staple"),
    ("तेल", "Tel", "Oil (Cooking oil)", "beginner", "Cooking ingredient"),
    ("साखर", "Saakhar", "Sugar", "beginner", "Ingredient"),
    ("मीठ", "Meeth", "Salt", "beginner", "Ingredient"),
    ("दूध", "Doodh", "Milk", "beginner", "Dairy"),
    ("चहापत्ती", "Chahaapattee", "Tea leaves", "beginner", "Daily essential"),
    ("मसाले", "Masaale", "Spices", "beginner", "Flavorings")
  ]),
  # L8: Clothes Shopping
  ("Clothes Shopping", "कपड्यांची खरेदी", 
   "Shopping for traditional wear like Sarees or Kurta, or modern wear.", None, [
    ("मला कुर्ता दाखवा", "Malaa kurta daakhvaa", "Please show me a Kurta", "beginner", "Traditional wear search"),
    ("मला साडी खरेदी करायची आहे", "Malaa saadee kharedi karaaychee aahe", "I want to buy a saree", "beginner", "Saree shopping"),
    ("कापड चांगलं आहे का?", "Kaapad chaangalam aahe ka?", "Is the fabric good?", "beginner", "Checking fabric quality"),
    ("सुती कपडे", "Sutee kapade", "Cotton clothes", "beginner", "Material preference"),
    ("रेशमी कापड", "Reshmee kaapad", "Silk fabric", "beginner", "Material preference"),
    ("हे धुवून आकुंचन पावेल का?", "He dhuvoon aakunchan paavel ka?", "Will this shrink after washing?", "beginner", "Care inquiry"),
    ("नवीन फॅशन", "Naveen fashion", "Latest fashion", "beginner", "Trend inquiry"),
    ("साधे कपडे", "Saadhe kapade", "Simple clothes", "beginner", "Style preference")
  ]),
  # L9: Colors & Sizes
  ("Colors & Sizes", "रंग आणि आकार", 
   "Specifying what style, color, or fit you want.", None, [
    ("मला लाल रंगात दाखवा", "Malaa laal rangaat daakhvaa", "Show it to me in red", "beginner", "Color preference"),
    ("पांढरा रंग", "Paandhraa rang", "White color", "beginner", "Color choice"),
    ("काळा रंग", "KaaLaa rang", "Black color", "beginner", "Color choice"),
    ("हिरवा रंग", "Hirvaa rang", "Green color", "beginner", "Color choice"),
    ("हा आकार लहान आहे", "Haa aakaar lahaan aahe", "This size is small", "beginner", "Size fit descriptor"),
    ("मला मोठा आकार हवा आहे", "Malaa moThaa aakaar havaa aahe", "I want a larger size", "beginner", "Asking for bigger fit"),
    ("माप बरोबर आहे", "Maap barobar aahe", "The fit is correct", "beginner", "Good size fit"),
    ("ट्रायल रूम कुठे आहे?", "Trial room kuthe aahe?", "Where is the trial room?", "beginner", "Fitting room inquiry")
  ]),
  # L10: Quality & Condition
  ("Quality & Condition", "दर्जा आणि स्थिती", 
   "Inspecting items for defects or ensuring high quality.", None, [
    ("हे जुनं वाटतंय", "He junam vaTatay", "This looks old", "beginner", "Noting wear"),
    ("यात काही दोष आहे का?", "Yaat kaahi dosh aahe ka?", "Is there any defect in this?", "beginner", "Checking for damage"),
    ("हे खराब आहे", "He kharaab aahe", "This is bad / spoiled", "beginner", "Rejecting item"),
    ("खूप उत्तम दर्जा आहे", "Khoop uttam darjaa aahe", "The quality is excellent", "beginner", "Praising quality"),
    ("टिकाऊ आहे का?", "Tikaau aahe ka?", "Is it durable?", "beginner", "Checking longevity"),
    ("हे ओरिजिनल आहे का?", "He original aahe ka?", "Is this original/genuine?", "beginner", "Checking authenticity"),
    ("स्वदेशी", "Swadeshi", "Locally made / Indian", "beginner", "Local origin preference"),
    ("पक्की खात्री", "Pakkee khaatree", "Guaranteed", "beginner", "Confirming warranty/assurance")
  ]),
  # L11: Paying / Cash / Card
  ("Paying / Cash / Card", "पैसे देणे आणि पेमेंट", 
   "Handling transaction methods. Digital payments (UPI / GPay) are highly prevalent in India now.", None, [
    ("पैसे कसे द्यायचे?", "Paise kase dyaayache?", "How do I pay?", "beginner", "Payment method inquiry"),
    ("मी गुगल पे करू का?", "Mee Google Pay karoo ka?", "Can I pay via Google Pay (UPI)?", "beginner", "Common mobile payment inquiry"),
    ("कार्ड चालेल का?", "Card chaalel ka?", "Will a card work?", "beginner", "Credit/debit card inquiry"),
    ("फक्त रोख पैसे", "Fakta rokh paise", "Cash only", "beginner", "Cash warning"),
    ("हे घ्या पैसे", "He ghyaa paise", "Here is the money", "beginner", "Handing over payment"),
    ("बाकीचे पैसे द्या", "Baakeeche paise dyaa", "Give back the change", "beginner", "Asking for balance due"),
    ("पावती मिळेल का?", "Paavatee miLel ka?", "Can I get a receipt/bill?", "beginner", "Asking for invoice"),
    ("मी ऑनलाईन पैसे पाठवलेत", "Mee online paise paaThavalet", "I have sent the money online", "beginner", "Confirming digital transfer")
  ]),
  # L12: Carrying / Bags
  ("Carrying / Bags", "पिशवी आणि वाहून नेणे", 
   "Carrying items. Plastic bags are banned/restricted in Maharashtra; cloth bags (kaaPdee pishvee) are preferred.", None, [
    ("पिशवी मिळेल का?", "Pishvee miLel ka?", "Can I get a bag?", "beginner", "Asking for carry bag"),
    ("माझ्याकडे स्वतःची पिशवी आहे", "Maajhyaakade svataahchee pishvee aahe", "I have my own bag", "beginner", "Refusing shop bag"),
    ("कापडी पिशवी", "Kaapdee pishvee", "Cloth bag", "beginner", "Eco-friendly option"),
    ("प्लास्टिक पिशवी नका देऊ", "Plastic pishvee nakaa deoo", "Please do not give a plastic bag", "beginner", "Refusing plastic"),
    ("हे सामान खूप जड आहे", "He saamaan khoop jaD aahe", "This luggage/groceries is very heavy", "beginner", "Stating weight challenge"),
    ("मला गाडीपर्यंत न्यायला मदत करा", "Malaa gaDee-paryant nyaaylaa madat karaa", "Help me carry this to the vehicle", "beginner", "Asking for delivery help"),
    ("यात पॅक करा", "Yaat pack karaa", "Pack it in this", "beginner", "Packaging direction"),
    ("हे सुरक्षित बांधा", "He surakshit baandhaa", "Tie this securely", "beginner", "Securing items")
  ]),
  # L13: Returning & Exchanging
  ("Returning & Exchanging", "परत करणे आणि बदलणे", 
   "Dealing with product returns or exchange conditions.", None, [
    ("हे मला बदलायचे आहे", "He malaa badlaayache aahe", "I want to exchange this", "beginner", "Requesting exchange"),
    ("रिफंड मिळेल का?", "Refund miLel ka?", "Can I get a refund?", "beginner", "Asking for money back"),
    ("माझ्याकडे बिल आहे", "Maajhyaakade bill aahe", "I have the bill", "beginner", "Proving purchase"),
    ("हे घरी गेल्यावर आवडलं नाही", "He gharee gelyaavar aavaDala naahi", "I didn't like this after going home", "beginner", "Reason for return"),
    ("दुसरं काही निवडा", "Dusaram kaahi nivDaa", "Select something else", "beginner", "Shopkeeper suggestion to swap"),
    ("नियम काय आहेत?", "Niyam kaay aahet?", "What are the rules/policies?", "beginner", "Return policy inquiry"),
    ("बदलून मिळणे शक्य आहे का?", "Badaloon miLNe shakya aahe ka?", "Is an exchange possible?", "beginner", "Exchange possibility inquiry"),
    ("यावर सूट आहे का?", "Yaavar sooT aahe ka?", "Is there a discount on this?", "beginner", "Discount inquiry")
  ]),
  # L14: Street Vendors
  ("Street Vendors", "फेरीवाले आणि हातगाडी", 
   "Interacting with roadside carts ('haatgaadee') and vendors.", None, [
    ("भाऊ, हे काय भाव दिले?", "Bhaau, he kaay bhaav dile?", "Brother, what's the rate?", "beginner", "Friendly inquiry to street vendor"),
    ("ताजे आहेत का?", "Taaje aahet ka?", "Are they fresh?", "beginner", "Checking fresh produce"),
    ("तोलून द्या", "Toloon dyaa", "Weigh it properly", "beginner", "Ensuring correct measure"),
    ("वजन काटा बरोबर आहे का?", "Vajan kaaTaa barobar aahe ka?", "Is the weighing scale correct?", "beginner", "Checking scale honesty"),
    ("इथे गाडी लावू नका", "Ithe gaDee laavoo nakaa", "Don't park the cart here", "beginner", "Space request"),
    ("आताचे काढलेले आहेत", "Aataache kaaDhalela aahet", "These were harvested/made just now", "beginner", "Vendor reassurance of freshness"),
    ("रस्त्यावरची खरेदी", "Rastyaavarchee kharedi", "Street shopping", "beginner", "Shopping context descriptor"),
    ("मावशी, कोथिंबीर द्या", "Maavshee, kothimbeer dyaa", "Auntie, give me coriander", "beginner", "Polite address to elderly female vendor")
  ]),
  # L15: Shopping Complete
  ("Shopping Complete", "खरेदी पूर्ण", 
   "Concluding your shopping trip with polite thanks.", None, [
    ("खरेदी झाली!", "Kharedi jhaalee!", "Shopping is done!", "beginner", "Expressing completion"),
    ("खूप छान अनुभव होता", "Khoop chhaan anubhav hota", "It was a very nice experience", "beginner", "Complimenting shopkeeper"),
    ("मी पुन्हा येईन", "Mee punhaa yeeen", "I will come again", "beginner", "Expressing intent to return"),
    ("खूप धन्यवाद काका", "Khoop dhanyavaad kaakaa", "Thank you very much Uncle", "beginner", "Respectful closing thanks"),
    ("घरपोच मिळेल का?", "Gharpoch miLel ka?", "Is home delivery available?", "beginner", "Home delivery inquiry"),
    ("माझा पत्ता घ्या", "Maajhaa pattaa ghyaa", "Take my address", "beginner", "Giving location details"),
    ("निरोप घेतो", "Nirop gheto", "Goodbye (male)", "beginner", "Leaving the shop"),
    ("निरोप घेते", "Nirop ghete", "Goodbye (female)", "beginner", "Leaving the shop")
  ])
]))

# Write output
os.makedirs(r'c:\Translation\data', exist_ok=True)
with open(r'c:\Translation\data\_m3_m4.json','w',encoding='utf-8') as f:
    json.dump(modules, f, ensure_ascii=False, indent=2)
print(f"Written {len(modules)} modules, {sum(len(m['lessons']) for m in modules)} lessons, {sum(sum(len(l['phrases']) for l in m['lessons']) for m in modules)} phrases")
