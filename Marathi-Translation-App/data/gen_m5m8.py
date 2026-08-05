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

# ===================== MODULE 5: Food & Dining =====================
modules.append(build_module("m5", "Food & Dining", "जेवण आणि उपाहारगृहे", "Ordering food, specifying tastes, kitchen vocabulary, and paying", "🍲", 5, 2, "intermediate", [
  # L1: Ordering Food
  ("Ordering Food", "जेवणाची ऑर्डर देणे", 
   "Traditional Maharashtrian restaurants serve 'Thali' (meals on a plate). Asking for menus and recommending items.", None, [
    ("मला मेनू कार्ड द्या", "Malaa menu card dyaa", "Please give me the menu card", "intermediate", "At start of dining"),
    ("आज काय विशेष आहे?", "Aaj kaay vishesh aahe?", "What is today's special?", "intermediate", "Asking for recommendations"),
    ("तुम्ही काय सुचवाल?", "Tumhi kaay suchavaal?", "What would you recommend?", "intermediate", "Seeking suggestions"),
    ("एक प्लेट मिसळ पाव द्या", "Ek plate Misal Pav dyaa", "Give me one plate of Misal Pav", "intermediate", "Ordering classic street food"),
    ("मसाला डोसा", "Masaalaa Dosa", "Masala Dosa", "intermediate", "Food item"),
    ("मला पाणी द्या", "Malaa paani dyaa", "Give me water", "intermediate", "Asking for water"),
    ("व्हेज की नॉन-व्हेज?", "Veg kee non-veg?", "Vegetarian or non-vegetarian?", "intermediate", "Common choice query"),
    ("ऑर्डर लिहून घ्या", "Order lihoon ghyaa", "Please take the order", "intermediate", "Calling the waiter")
  ]),
  # L2: Taste & Preferences
  ("Taste & Preferences", "चव आणि पसंती", 
   "Marathi food can range from mild to very spicy. Words like 'tikhat' (spicy) and 'god' (sweet) are essential.", None, [
    ("हे खूप तिखट आहे", "He khoop tikhat aahe", "This is very spicy", "intermediate", "Noting high spice level"),
    ("मला कमी तिखट जेवण हवं आहे", "Malaa kami tikhat jevaN havam aahe", "I want a less spicy meal", "intermediate", "Stating spice preference"),
    ("जेवण खूप चवदार आहे!", "JevaN khoop chavdaar aahe!", "The food is very tasty!", "intermediate", "Complimenting the chef"),
    ("गोड", "God", "Sweet", "intermediate", "Taste descriptor"),
    ("आंबट", "AanbaT", "Sour", "intermediate", "Taste descriptor"),
    ("खारट", "KhaaraT", "Salty", "intermediate", "Taste descriptor"),
    ("कडू", "Kadoo", "Bitter", "intermediate", "Taste descriptor"),
    ("मला मसालेदार जेवण आवडत नाही", "Malaa masaaledaar jevaN aavaDat naahi", "I do not like spicy/greasy food", "intermediate", "Expressing preference")
  ]),
  # L3: Table Requests
  ("Table Requests", "टेबलवरील मागण्या", 
   "Asking for utensils, condiments, or extra servings.", None, [
    ("मला चमचा मिळेल का?", "Malaa chamchaa miLel ka?", "Can I get a spoon?", "intermediate", "Asking for cutlery"),
    ("अजून थोडं पाणी द्या", "Ajoon thodam paani dyaa", "Give some more water", "intermediate", "Refilling water"),
    ("मीठ संपलं आहे", "Meeth sanplam aahe", "Salt is finished / out", "intermediate", "Asking for salt"),
    ("मला टिशू पेपर हवा आहे", "Malaa tissue paper havaa aahe", "I want a tissue paper", "intermediate", "Asking for napkins"),
    ("extra वाटी द्या", "Extra vaaTee dyaa", "Give an extra small bowl", "intermediate", "Asking for dishware"),
    ("हे गरम करून द्याल का?", "He garam karoon dyaal ka?", "Will you heat this up?", "intermediate", "Asking for hot food"),
    ("माझी प्लेट बदला", "Maajhee plate badlaa", "Change my plate", "intermediate", "Table cleanliness request"),
    ("तासभर झाला वाट बघतोय", "Taasbhar jhaalaa vaaT baghatoy", "I've been waiting for an hour", "intermediate", "Expressing delay frustration")
  ]),
  # L4: In the Kitchen
  ("In the Kitchen", "स्वयंपाकघरात", 
   "Understanding cooking verbs and kitchen vocabulary.", None, [
    ("स्वयंपाक करणे", "Swayanpaak karaNe", "To cook food", "intermediate", "Cooking verb"),
    ("भाजी चिरणे", "Bhaajee chiraNe", "To chop vegetables", "intermediate", "Preparation verb"),
    ("चहा बनवणे", "Chahaa banavaNe", "To make tea", "intermediate", "Daily routine kitchen task"),
    ("कढई कुठे आहे?", "KaDhaee kuthe aahe?", "Where is the wok/frying pan?", "intermediate", "Utensil search"),
    ("गॅस पेटवा", "Gas peTvaa", "Light the stove", "intermediate", "Cooking instruction"),
    ("दूध उकळा", "Doodh ukLaa", "Boil the milk", "intermediate", "Kitchen instruction"),
    ("पोळ्या लाटणे", "PoLyaa laaTaNe", "Rolling flatbreads (chapatis)", "intermediate", "Bread preparation"),
    ("भांडी घासणे", "Bhaandee ghaasaNe", "Washing dishes", "intermediate", "Clean up verb")
  ]),
  # L5: Paying the Food Bill
  ("Paying the Food Bill", "जेवणाचे बिल भरणे", 
   "Concluding your dining experience with the bill request and tipping.", None, [
    ("बिल आणा प्लीज", "Bill aaNaa please", "Bring the bill please", "intermediate", "Requesting bill"),
    ("सेवा कर", "Sevaa kar", "Service tax / charges", "intermediate", "Tax vocabulary"),
    ("सगळं बिल एकत्र करा", "SagaLam bill ekatra karaa", "Combine the entire bill", "intermediate", "Paying together"),
    ("आम्ही वेगळं बिल देऊ", "Aamhee vegaLam bill deoo", "We will pay separate bills", "intermediate", "Splitting bill"),
    ("बाकीचे पैसे तुम्ही ठेवा", "Baakeeche paise tumhi Thevaa", "Keep the change (as a tip)", "intermediate", "Tipping waiter"),
    ("माझ्या कार्डने पेमेंट करा", "Maajhyaa card-ne payment karaa", "Make the payment with my card", "intermediate", "Paying by card"),
    ("पेमेंट यशस्वी झाले", "Payment yashasvee jhaale", "Payment was successful", "intermediate", "Transaction confirmation"),
    ("जेवण खूप अप्रतिम होतं, धन्यवाद", "JevaN khoop aprateem hotam, dhanyavaad", "The food was wonderful, thank you", "intermediate", "Final appreciation")
  ])
]))

# ===================== MODULE 6: Directions & Travel =====================
modules.append(build_module("m6", "Directions & Travel", "दिशानिर्देश आणि प्रवास", "Asking directions, taking public transit, buying tickets", "🚗", 5, 2, "intermediate", [
  # L1: Asking Directions
  ("Asking Directions", "दिशा विचारणे", 
   "Finding landmarks in Maharashtra. Marathi addresses often use 'peths' (areas) and landmarks like temples.", None, [
    ("रेल्वे स्टेशन कुठे आहे?", "Railway station kuthe aahe?", "Where is the railway station?", "intermediate", "Transit landmark inquiry"),
    ("कृपया मला नकाशावर दाखवा", "Krupayaa malaa nakaashaavar daakhvaa", "Please show me on the map", "intermediate", "Map direction assistance"),
    ("हे खूप लांब आहे का?", "He khoop laamb aahe ka?", "Is this very far?", "intermediate", "Distance query"),
    ("जवळचा रस्ता कोणता?", "Javalchaa rastaa koNataa?", "Which is the shortcut/nearest route?", "intermediate", "Shortcut inquiry"),
    ("मी रस्ता हरवलो आहे", "Mee rastaa haravalo aahe", "I am lost (male)", "intermediate", "Lost warning"),
    ("मी रस्ता हरवले आहे", "Mee rastaa haravale aahe", "I am lost (female)", "intermediate", "Lost warning"),
    ("पत्ता कुठे आहे?", "Pattaa kuthe aahe?", "Where is the address?", "intermediate", "Address lookup"),
    ("मला मदत करा", "Malaa madat karaa", "Help me", "intermediate", "Assistance request")
  ]),
  # L2: Giving Directions
  ("Giving Directions", "दिशा सांगणे", 
   "Understanding directions given by locals. 'Davi' is left, 'Ujavi' is right.", None, [
    ("सरळ जा", "SaraL jaa", "Go straight", "intermediate", "Direction instruction"),
    ("डावीकडे वळा", "Daaveekade vaLaa", "Turn left", "intermediate", "Direction instruction"),
    ("उजवीकडे वळा", "Ujaveekade vaLaa", "Turn right", "intermediate", "Direction instruction"),
    ("तिथून मागे फिरा", "Tithoon maage phiraa", "Turn back from there", "intermediate", "Direction instruction"),
    ("चौकातून उजवीकडे जा", "Choukaatoon ujaveekade jaa", "Go right from the intersection", "intermediate", "Direction instruction"),
    ("दुकान डाव्या बाजूला आहे", "Dukaan daavyaa baajoolaa aahe", "The shop is on the left side", "intermediate", "Locating object"),
    ("समोर मंदिर दिसेल", "Samor mandir diseel", "You will see a temple in front", "intermediate", "Landmark guidance"),
    ("थांबा", "Thaanbaa", "Stop", "intermediate", "Halting command")
  ]),
  # L3: Buying Tickets
  ("Buying Tickets", "तिकीट खरेदी", 
   "Purchasing transit tickets for local trains (like Mumbai Locals) or state transport (MSRTC) buses.", None, [
    ("मला मुंबईचे तिकीट द्या", "Malaa Mumbaiche tikeet dyaa", "Give me a ticket to Mumbai", "intermediate", "Buying ticket"),
    ("किती तिकीट हवी आहेत?", "Kiti tikeet havee aahet?", "How many tickets do you need?", "intermediate", "Ticket count query"),
    ("दोन तिकीट", "Don tikeet", "Two tickets", "intermediate", "Answering ticket quantity"),
    ("परतीचे तिकीट (Return)", "Parteeche tikeet", "Return ticket", "intermediate", "Two-way ticket"),
    ("एकेरी तिकीट (Single)", "Ekeree tikeet", "One-way ticket", "intermediate", "Single journey ticket"),
    ("तिकीटाचे भाडे किती आहे?", "Tikeetaache bhaade kiti aahe?", "How much is the ticket fare?", "intermediate", "Fare inquiry"),
    ("पास कुठे मिळेल?", "Pass kuthe miLel?", "Where can I get a pass?", "intermediate", "Pass search"),
    ("तिकीट दाखवा", "Tikeet daakhvaa", "Show your ticket", "intermediate", "Ticket inspection context")
  ]),
  # L4: Modes of Transport
  ("Modes of Transport", "वाहतुकीची साधने", 
   "Identifying modes of transportation. 'Auto' or 'Rickshaw' is the most popular for short distances.", None, [
    ("रिक्षा", "Rikshaw", "Auto-rickshaw", "intermediate", "Three-wheeler local transit"),
    ("टॅक्सी", "Taxi", "Taxi", "intermediate", "Cab"),
    ("बस", "Bus", "Bus", "intermediate", "Public bus"),
    ("आगगाडी / रेल्वे", "AaggaaDee / Railway", "Train", "intermediate", "Rail transit"),
    ("विमान", "Vimaan", "Airplane", "intermediate", "Air transit"),
    ("दुचाकी / बाईक", "Duchaakee / Bike", "Two-wheeler / Motorcycle", "intermediate", "Motorbike"),
    ("सायकल", "Cycle", "Bicycle", "intermediate", "Cycle"),
    ("रिक्षा भाड्याने चालते का?", "Rikshaw bhaaDyaane chaalate ka?", "Does the rickshaw run on meter?", "intermediate", "Meter fare query")
  ]),
  # L5: Travel Inquiries
  ("Travel Inquiries", "प्रवासाची चौकशी", 
   "Asking about schedules, delays, and routes.", None, [
    ("पुढची ट्रेन कधी सुटेल?", "PuDhchee train kadhi suTel?", "When will the next train leave?", "intermediate", "Schedule inquiry"),
    ("गाडीला उशीर झाला आहे का?", "GaaDeelaa usheer jhaalaa aahe ka?", "Is the train/bus delayed?", "intermediate", "Delay inquiry"),
    ("ही बस पुण्याला जाते का?", "Hee bus PuNyaalaa jaate ka?", "Does this bus go to Pune?", "intermediate", "Destination confirmation"),
    ("प्लॅटफॉर्म नंबर तीन कुठे आहे?", "Platform number teen kuthe aahe?", "Where is platform number three?", "intermediate", "Platform search"),
    ("प्रवास किती तासांचा आहे?", "Pravaas kiti taasaanchaa aahe?", "How many hours is the journey?", "intermediate", "Duration inquiry"),
    ("इथे सीट रिकामी आहे का?", "Ithe seat rikaamee aahe ka?", "Is this seat vacant/free?", "intermediate", "Checking seat status"),
    ("प्रवास सुखाचा होवो!", "Pravaas sukhaachaa hovo!", "Have a safe/happy journey!", "intermediate", "Travel blessing"),
    ("तिकीट बुकिंग काउंटर", "Tikeet booking counter", "Ticket booking counter", "intermediate", "Station location")
  ])
]))

# ===================== MODULE 7: Daily Routine =====================
modules.append(build_module("m7", "Daily Routine", "दैनंदिन दिनचर्या", "Morning to night habits, chores, work and office routines", "⏰", 5, 2, "intermediate", [
  # L1: Morning Routine
  ("Morning Routine", "सकाळची दिनचर्या", 
   "Describing what you do in the morning. Use present habitual tense.", None, [
    ("मी सकाळी लवकर उठतो", "Mee sakaaLi lavkar uThato", "I wake up early in the morning (male)", "intermediate", "Morning habit"),
    ("मी सकाळी लवकर उठते", "Mee sakaaLi lavkar uThate", "I wake up early in the morning (female)", "intermediate", "Morning habit"),
    ("दात घासणे", "Daat ghaasaNe", "To brush teeth", "intermediate", "Morning task"),
    ("मी चहा पितो", "Mee chahaa pito", "I drink tea (male)", "intermediate", "Morning habit"),
    ("मी चहा पिते", "Mee chahaa pite", "I drink tea (female)", "intermediate", "Morning habit"),
    ("मी व्यायाम करतो", "Mee vyaayaam karto", "I exercise (male)", "intermediate", "Morning habit"),
    ("मी आंघोळ करतो", "Mee aanghoL karto", "I take a bath (male)", "intermediate", "Morning habit"),
    ("मी नाश्ता करतो", "Mee naashtaa karto", "I eat breakfast (male)", "intermediate", "Morning habit")
  ]),
  # L2: Household Chores
  ("Household Chores", "घरातील कामे", 
   "Talking about housekeeping activities around the house.", None, [
    ("घर स्वच्छ करणे", "Ghar svachchha karaNe", "Cleaning the house", "intermediate", "Household task"),
    ("कपडे धुणे", "Kapade dhuNe", "Washing clothes", "intermediate", "Household task"),
    ("झाडू मारणे", "JhaaDoo maaraNe", "Sweeping the floor", "intermediate", "Household task"),
    ("कचरा टाकणे", "Kacharaa taakaNe", "Throwing trash", "intermediate", "Household task"),
    ("भाजी आणणे", "Bhaajee aaNNe", "Fetching vegetables", "intermediate", "Market errand"),
    ("घर आवरणे", "Ghar aavaraNe", "Tidying up the room", "intermediate", "Household task"),
    ("झाडांना पाणी घालणे", "Jhaadaannaa paani ghaalaNe", "Watering plants", "intermediate", "Gardening chore"),
    ("कपड्यांच्या घड्या घालणे", "KapDyaanchyaa ghadyaa ghaalaNe", "Folding clothes", "intermediate", "Laundry chore")
  ]),
  # L3: Evening & Bedtime
  ("Evening & Bedtime", "संध्याकाळ आणि झोप", 
   "Winding down the day and preparing for bed.", None, [
    ("मी घरी परत येतो", "Mee gharee parat yeto", "I return home (male)", "intermediate", "End of workday"),
    ("मी टीव्ही बघतो", "Mee TV baghato", "I watch television (male)", "intermediate", "Relaxation habit"),
    ("आम्ही एकत्र जेवतो", "Aamhee ekatra jevato", "We eat dinner together", "intermediate", "Family routine"),
    ("मी पुस्तक वाचतो", "Mee pustak vaachato", "I read a book (male)", "intermediate", "Night habit"),
    ("मी लवकर झोपतो", "Mee lavkar jhopato", "I sleep early (male)", "intermediate", "Night habit"),
    ("मला गाढ झोप लागली", "Malaa gaaDh jhop laaglee", "I fell into a deep sleep", "intermediate", "Quality of sleep"),
    ("शुभ रात्री", "Shubh raatri", "Good night", "intermediate", "Bedtime farewell"),
    ("स्वप्न", "Svapna", "Dream", "intermediate", "Night descriptor")
  ]),
  # L4: Work & Office Routine
  ("Work & Office Routine", "कामाचे वेळापत्रक", 
   "Describing a typical professional workday.", None, [
    ("माझे ऑफिस नऊ वाजता सुरू होते", "Maajhe office nau vaajataa suroo hote", "My office starts at 9 o'clock", "intermediate", "Office hours"),
    ("मी संगणकावर काम करतो", "Mee sangaNakaavar kaam karto", "I work on the computer (male)", "intermediate", "Work description"),
    ("मी ईमेल पाठवतो", "Mee email paaThavato", "I send emails", "intermediate", "Work communication"),
    ("दुपारची सुट्टी (Lunch break)", "Dupaarchee suTTee", "Lunch break", "intermediate", "Workday pause"),
    ("आज मीटिंग आहे", "Aaj meeting aahe", "Today there is a meeting", "intermediate", "Calendar event"),
    ("माझे काम पूर्ण झाले आहे", "Maajhe kaam poorNa jhaale aahe", "My work is finished", "intermediate", "Completing tasks"),
    ("फायली आवरणे", "Files aavaraNe", "Organizing files", "intermediate", "Administrative task"),
    ("मी पाच वाजता लॉग ऑफ करतो", "Mee paach vaajataa log off karto", "I log off at 5 o'clock (male)", "intermediate", "End of shift")
  ]),
  # L5: Weekend Habits
  ("Weekend Habits", "शनिवार-रविवारच्या सवयी", 
   "What you do during holidays or weekends (weekly off).", None, [
    ("शनिवारी मी उशिरा उठतो", "Shanivaari mee ushiraa uThato", "On Saturdays I wake up late (male)", "intermediate", "Weekend habit"),
    ("रविवारची सुट्टी असते", "Ravivaarchee suTTee aste", "Sunday is a holiday/off-day", "intermediate", "Weekend schedule"),
    ("मी मित्रांना भेटतो", "Mee mitraannaa bheeTato", "I meet friends (male)", "intermediate", "Socializing"),
    ("आम्ही फिरायला जातो", "Aamhee phiraaylaa jaato", "We go for a walk/outing", "intermediate", "Leisure outing"),
    ("मी कपडे धुतो", "Mee kapade dhuto", "I wash clothes (male)", "intermediate", "Weekend chores"),
    ("चित्रपट बघणे", "Chitrapat baghaNe", "Watching a movie", "intermediate", "Entertainment habit"),
    ("हॉटेलमध्ये जेवणे", "Hotel-madhye jevaNe", "Eating out at a restaurant", "intermediate", "Dining leisure"),
    ("आरामदायक रविवार", "Aaraamdaayak Ravivaar", "Relaxing Sunday", "intermediate", "Weekend mood descriptor")
  ])
]))

# ===================== MODULE 8: People & Descriptions =====================
modules.append(build_module("m8", "People & Descriptions", "लोकांचे वर्णन", "Physical attributes, personality, emotions, family and friends", "👥", 5, 2, "intermediate", [
  # L1: Physical Appearance
  ("Physical Appearance", "शारीरिक वर्णन", 
   "Describing what someone looks like. Height, hair, and posture.", None, [
    ("तो उंच आहे", "To unch aahe", "He is tall", "intermediate", "Height descriptor"),
    ("ती लहान आहे", "Tee lahaan aahe", "She is short/small", "intermediate", "Height descriptor"),
    ("तिचे केस लांब आहेत", "Tiche kes laamb aahet", "Her hair is long", "intermediate", "Hair descriptor"),
    ("तो गोरा आहे", "To goraa aahe", "He has fair skin", "intermediate", "Skin tone descriptor"),
    ("तो देखणा आहे", "To dekhNaa aahe", "He is handsome", "intermediate", "Male attractiveness"),
    ("ती सुंदर आहे", "Tee sundar aahe", "She is beautiful", "intermediate", "Female attractiveness"),
    ("चष्मा घातलेला माणूस", "Chashmaa ghaatalelaa maaNoos", "The man wearing glasses", "intermediate", "Visual helper"),
    ("जाड / बारीक", "Jaad / Bareek", "Fat / Thin", "intermediate", "Body type descriptors")
  ]),
  # L2: Describing Personality
  ("Describing Personality", "स्वभाव वर्णन", 
   "Describing inner nature (svabhaav). 'Svabhaav' is a very key cultural word.", None, [
    ("त्याचा स्वभाव चांगला आहे", "Tyaachaa svabhaav chaanglaa aahe", "His nature is good", "intermediate", "General character compliment"),
    ("ती खूप हुशार आहे", "Tee khoop hushaari aahe", "She is very smart/intelligent", "intermediate", "Intelligence compliment"),
    ("तो प्रामाणिक मुलगा आहे", "To praamaaNik mulgaa aahe", "He is an honest boy", "intermediate", "Honesty praise"),
    ("शांत स्वभाव", "Shaant svabhaav", "Calm nature/temperament", "intermediate", "Personality type"),
    ("खोडकर मुलगा", "Khodakar mulgaa", "Naughty boy", "intermediate", "Personality type"),
    ("ती लाजाळू आहे", "Tee laajaaLoo aahe", "She is shy", "intermediate", "Personality type"),
    ("तो तापट आहे", "To taapaT aahe", "He is short-tempered", "intermediate", "Personality flaw warning"),
    ("आनंदी माणूस", "Aanandee maaNoos", "Happy/cheerful person", "intermediate", "Positive trait")
  ]),
  # L3: Expressing Emotions
  ("Expressing Emotions", "भावना व्यक्त करणे", 
   "Saying how you feel. Use present state verbs.", None, [
    ("मला खूप आनंद झाला आहे", "Malaa khoop aanand jhaalaa aahe", "I am very happy", "intermediate", "State of happiness"),
    ("तो दुःखी आहे", "To duhkee aahe", "He is sad", "intermediate", "State of sadness"),
    ("मला राग आला आहे", "Malaa raag aalaa aahe", "I am angry", "intermediate", "State of anger"),
    ("ती घाबरली आहे", "Tee ghaabaralee aahe", "She is scared", "intermediate", "State of fear"),
    ("मला आश्चर्य वाटले", "Malaa aashcharya vaaTale", "I felt surprised", "intermediate", "State of wonder"),
    ("मला कंटाळा आला आहे", "Malaa kanTaaLaa aalaa aahe", "I am bored / tired of this", "intermediate", "State of boredom"),
    ("चिंता करू नका", "Chintaa karoo nakaa", "Don't worry", "intermediate", "Reassurance"),
    ("मला तुमची आठवण येते", "Malaa tumchee aaThavaN yete", "I miss you", "intermediate", "Affectionate statement")
  ]),
  # L4: Relations & Friends
  ("Relations & Friends", "मित्र आणि नातेसंबंध", 
   "Describing family relations and close friends.", None, [
    ("माझा चांगला मित्र", "Maajhaa chaanglaa mitra", "My good friend (male)", "intermediate", "Friendship description"),
    ("माझी मैत्रीण", "Maajhee maitreeN", "My friend (female)", "intermediate", "Friendship description"),
    ("तो माझा भाऊ आहे", "To maajhaa bhaau aahe", "He is my brother", "intermediate", "Family connection"),
    ("ती माझी बहीण आहे", "Tee maajhee baheeN aahe", "She is my sister", "intermediate", "Family connection"),
    ("आम्ही बालमित्र आहोत", "Aamhee baalamitra aahot", "We are childhood friends", "intermediate", "History of friendship"),
    ("नातेवाईक", "NaatevaaeeK", "Relatives / Kin", "intermediate", "Extended family"),
    ("शेजारी", "Shejaaree", "Neighbor", "intermediate", "Community relation"),
    ("त्यांचे लग्न झाले आहे", "Tyaanchan lagna jhaalan aahe", "They are married", "intermediate", "Marital state")
  ]),
  # L5: Comparisons
  ("Comparisons", "तुलना करणे", 
   "Comparing two people or things using 'pekshaa' (compared to).", None, [
    ("तो माझ्यापेक्षा मोठा आहे", "To maajhyaapekshaa moThaa aahe", "He is older/bigger than me", "intermediate", "Age/size comparison"),
    ("ती त्याच्यापेक्षा हुशार आहे", "Tee tyaachyaapekshaa hushaari aahe", "She is smarter than him", "intermediate", "Intelligence comparison"),
    ("हे घर सर्वात सुंदर आहे", "He ghar sarvaat sundar aahe", "This house is the most beautiful", "intermediate", "Superlative comparison"),
    ("दोन्ही सारखेच आहेत", "Donhee saarkhech aahet", "Both are exactly the same", "intermediate", "Stating equality"),
    ("वेगळे आहे", "Vegale aahe", "It is different", "intermediate", "Stating difference"),
    ("हे जास्त चांगलं आहे", "He jaasta chaangalam aahe", "This is much better", "intermediate", "Preference comparison"),
    ("ते सर्वात स्वस्त आहे", "Te sarvaat svast aahe", "That is the cheapest", "intermediate", "Superlative price"),
    ("कमी की जास्त?", "Kami kee jaasta?", "Less or more?", "intermediate", "Quantitative choice")
  ])
]))

# Write output
os.makedirs(r'c:\Translation\data', exist_ok=True)
with open(r'c:\Translation\data\_m5_m8.json','w',encoding='utf-8') as f:
    json.dump(modules, f, ensure_ascii=False, indent=2)
print(f"Written {len(modules)} modules, {sum(len(m['lessons']) for m in modules)} lessons, {sum(sum(len(l['phrases']) for l in m['lessons']) for m in modules)} phrases")
