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

# ===================== MODULE 9: Health & Emergencies =====================
modules.append(build_module("m9", "Health & Emergencies", "आरोग्य आणि आणीबाणी", "Describing illness, doctor visits, buying medicines, asking for help", "🚑", 5, 2, "intermediate", [
  # L1: Feeling Unwell
  ("Feeling Unwell", "तब्बेत बरी नसणे", 
   "Describing general physical discomfort. In Marathi, body conditions are often described with 'malaa... hotay' (to me... is happening).", None, [
    ("माझी तब्येत बरी नाही", "Maajhee tabyet baree naahi", "I am not feeling well", "intermediate", "Stating sickness"),
    ("मला ताप आला आहे", "Malaa taap aalaa aahe", "I have a fever", "intermediate", "Stating fever"),
    ("माझे डोके दुखत आहे", "Maajhe doke dukhat aahe", "My head is hurting", "intermediate", "Headache description"),
    ("मला चक्कर येत आहे", "Malaa chakkar yet aahe", "I feel dizzy", "intermediate", "Dizziness description"),
    ("मला खोकला आहे", "Malaa khoklaa aahe", "I have a cough", "intermediate", "Cough description"),
    ("माझे पोट दुखत आहे", "Maajhe poT dukhat aahe", "My stomach is hurting", "intermediate", "Stomach ache"),
    ("मला थंडी वाजत आहे", "Malaa thandee vaajat aahe", "I feel cold / shivering", "intermediate", "Cold symptom"),
    ("आराम करा", "Aaraam karaa", "Take rest / recover", "intermediate", "Caring advice")
  ]),
  # L2: At the Doctor
  ("At the Doctor", "डॉक्टरांकडे", 
   "Interacting with medical professionals. Explaining pain and symptoms.", None, [
    ("मला डॉक्टरांना भेटायचे आहे", "Malaa doctor-annaa bheTaayache aahe", "I want to see the doctor", "intermediate", "Requesting appointment"),
    ("कुठे दुखत आहे?", "Kuthe dukhat aahe?", "Where does it hurt?", "intermediate", "Doctor's inquiry"),
    ("इथे दुखत आहे", "Ithe dukhat aahe", "It hurts here", "intermediate", "Pointing out pain location"),
    ("हे औषध दिवसातून तीन वेळा घ्या", "He aushadh divasaatoon teen veLaa ghyaa", "Take this medicine three times a day", "intermediate", "Prescription directions"),
    ("मला इंजेक्शनची भीती वाटते", "Malaa injection-chee bheetee vaaTate", "I am scared of injections", "intermediate", "Expressing fear"),
    ("लवकर बरे व्हा", "Lavkar bare vhaa", "Get well soon", "intermediate", "Warm wish"),
    ("पल्स तपासा", "Pulse tapaasaa", "Check the pulse", "intermediate", "Medical command"),
    ("खोल श्वास घ्या", "Khol shvaas ghyaa", "Take a deep breath", "intermediate", "Doctor's direction")
  ]),
  # L3: At the Pharmacy
  ("At the Pharmacy", "औषधांच्या दुकानात", 
   "Buying medicines (aushadh) and understanding dosage instructions.", None, [
    ("हे प्रिस्क्रिप्शन घ्या", "He prescription ghyaa", "Take this prescription", "intermediate", "Handing over slip"),
    ("तुमच्याकडे हे औषध आहे का?", "Tumchyaakade he aushadh aahe ka?", "Do you have this medicine?", "intermediate", "Stock inquiry"),
    ("या औषधाची एक्सपायरी काय आहे?", "Yaa aushadhaachee expiry kaay aahe?", "What is the expiry date of this medicine?", "intermediate", "Safety check"),
    ("जेवणानंतर घ्या", "JevaNaanantar ghyaa", "Take after meals", "intermediate", "Dosage direction"),
    ("उपाशी पोटी घ्या", "Upaashee poTee ghyaa", "Take on an empty stomach", "intermediate", "Dosage direction"),
    ("पेनकिलर", "Painkiller", "Painkiller / Pain reliever", "intermediate", "Medicine type"),
    ("पट्टी / बँडेज", "Pattee / Bandage", "Bandage / Dressing", "intermediate", "First aid item"),
    ("मलम", "Malam", "Ointment / Cream", "intermediate", "First aid item")
  ]),
  # L4: Emergencies & Accidents
  ("Emergencies & Accidents", "आणीबाणी आणि अपघात", 
   "Calling emergency services or dealing with roadside accidents.", None, [
    ("अपघात झाला आहे!", "Apaghaat jhaalaa aahe!", "An accident has occurred!", "intermediate", "Alerting onlookers"),
    ("ॲम्ब्युलन्स बोलवा!", "Ambulance bolvaa!", "Call an ambulance!", "intermediate", "Emergency request"),
    ("पोलिसांना फोन करा!", "Police-annaa phone karaa!", "Phone the police!", "intermediate", "Emergency request"),
    ("इथे आग लागली आहे!", "Ithe aag laaglee aahe!", "There is a fire here!", "intermediate", "Fire warning"),
    ("धोका आहे!", "Dhokaa aahe!", "It is dangerous!", "intermediate", "Danger warning"),
    ("तो बेशुद्ध पडला आहे", "To beshuddha padlaa aahe", "He has fainted/is unconscious", "intermediate", "Medical status reporting"),
    ("रक्तस्त्राव होत आहे", "Raktasraav hot aahe", "Bleeding is occurring", "intermediate", "Medical status reporting"),
    ("हॉस्पिटल जवळ आहे का?", "Hospital javal aahe ka?", "Is the hospital nearby?", "intermediate", "Hospital search")
  ]),
  # L5: Asking for Help
  ("Asking for Help", "तात्काळ मदत मागणे", 
   "Shouting for help or seeking assistance from passersby.", None, [
    ("वाचवा! वाचवा!", "Vaachvaa! Vaachvaa!", "Help! Save me!", "intermediate", "Shouting for rescue"),
    ("मला मदत करा", "Malaa madat karaa", "Help me please", "intermediate", "Seeking aid"),
    ("माझा फोन हरवला आहे", "Maajhaa phone haravlaa aahe", "My phone is lost", "intermediate", "Emergency status"),
    ("तुमचा फोन वापरू का?", "Tumchaa phone vaaparoo ka?", "Can I use your phone?", "intermediate", "Requesting call help"),
    ("पैसे चोरीला गेलेत", "Paise choreelaa gelet", "The money has been stolen", "intermediate", "Reporting theft"),
    ("चोर! चोर!", "Chor! Chor!", "Thief! Thief!", "intermediate", "Shouting alert"),
    ("मला रस्ता दाखवा", "Malaa rastaa daakhvaa", "Guide me the way", "intermediate", "Seeking path help"),
    ("काळजी करू नका, मी मदत करतो", "KaaLji karoo nakaa, mee madat karto", "Don't worry, I will help (male)", "intermediate", "Helper's reassurance")
  ])
]))

# ===================== MODULE 10: Social Conversations =====================
modules.append(build_module("m10", "Social Conversations", "सामाजिक संभाषण", "Weather talks, hobbies, inviting friends, small talk", "💬", 5, 2, "intermediate", [
  # L1: Weather & Climate
  ("Weather & Climate", "हवामान", 
   "Weather is a popular small talk topic. Maharashtra experiences heavy rains (monsoon) and scorching summers.", None, [
    ("आज खूप उष्णता आहे", "Aaj khoop ushNataa aahe", "It is very hot today", "intermediate", "Summer talk"),
    ("आज थंडी आहे", "Aaj thandee aahe", "It is cold today", "intermediate", "Winter talk"),
    ("पाऊस पडत आहे", "Paous padat aahe", "It is raining", "intermediate", "Monsoon talk"),
    ("आकाशात ढग आलेत", "Aakaashaat Dhag aalet", "Clouds have gathered in the sky", "intermediate", "Cloudy sky"),
    ("वारा सुटला आहे", "Vaaraa suTlaa aahe", "The wind is blowing / breezy", "intermediate", "Breezy weather"),
    ("आज हवामान कसं आहे?", "Aaj havaamaan kasan aahe?", "How is the weather today?", "intermediate", "Weather inquiry"),
    ("चिखल झाला आहे", "Chikhal jhaalaa aahe", "It has become muddy", "intermediate", "Monsoon side-effect"),
    ("छत्री सोबत घ्या", "Chhatree sobat ghyaa", "Take an umbrella with you", "intermediate", "Monsoon precaution")
  ]),
  # L2: Hobbies & Free Time
  ("Hobbies & Free Time", "छंद आणि मोकळा वेळ", 
   "Sharing what you love to do in your leisure hours.", None, [
    ("तुमचे छंद काय आहेत?", "Tumche chhand kaay aahet?", "What are your hobbies?", "intermediate", "Hobbie inquiry"),
    ("मला वाचायला आवडतं", "Malaa vaachaaylaa aavaDtan", "I like to read", "intermediate", "Stating hobby"),
    ("मला गाणी ऐकायला आवडतात", "Malaa gaNee aikaaylaa aavaDtaat", "I like to listen to songs", "intermediate", "Stating hobby"),
    ("मला स्वयंपाक करायला आवडतो", "Malaa swayanpaak karaaylaa aavaDto", "I like to cook", "intermediate", "Stating hobby"),
    ("मी क्रिकेट खेळतो", "Mee cricket kheLto", "I play cricket (male)", "intermediate", "Stating sport hobby"),
    ("मला चित्र काढायला आवडतं", "Malaa chitra kaaDhaaylaa aavaDtan", "I like to draw/paint", "intermediate", "Stating hobby"),
    ("मोकळ्या वेळेत", "MokaLyaa veLet", "In free time", "intermediate", "Time description"),
    ("नृत्य करणे", "Nrutya karaNe", "To dance", "intermediate", "Stating hobby")
  ]),
  # L3: Likes & Dislikes
  ("Likes & Dislikes", "आवड-नावड", 
   "Expressing preferences using 'aavaDtan' (liked) and 'aavaDat naahi' (disliked).", None, [
    ("मला हे आवडले", "Malaa he aavaDale", "I liked this", "intermediate", "Expressing approval"),
    ("मला हे आवडत नाही", "Malaa he aavaDat naahi", "I don't like this", "intermediate", "Expressing disapproval"),
    ("तुमचा आवडता चित्रपट कोणता?", "Tumchaa aavaDtaa chitrapat koNataa?", "Which is your favorite movie?", "intermediate", "Favorite query"),
    ("मला पुरणपोळी खूप आवडते", "Malaa Puranpoli khoop aavaDte", "I like Puranpoli (sweet flatbread) very much", "intermediate", "Expressing food love"),
    ("नको, मला हे नको आहे", "Noko, malaa he noko aahe", "No, I don't want this", "intermediate", "Refusal"),
    ("आवड निवड", "AavaD nivaD", "Choice / Likes & dislikes", "intermediate", "Concept descriptor"),
    ("मला प्रवास करायला आवडतो", "Malaa pravaas karaaylaa aavaDto", "I like to travel", "intermediate", "Expressing interest"),
    ("मला गर्दी आवडत नाही", "Malaa gardee aavaDat naahi", "I do not like crowds", "intermediate", "Expressing dislike")
  ]),
  # L4: Inviting Friends
  ("Inviting Friends", "आमंत्रण देणे", 
   "Inviting someone to your home or for an event. Hospitalities are key.", None, [
    ("माझ्या घरी या", "Maajhyaa gharee yaa", "Come to my house", "intermediate", "Friendly invitation"),
    ("चहा पिण्यासाठी या", "Chahaa piNyaasaaTee yaa", "Come over for tea", "intermediate", "Common invite format"),
    ("रविवारी आम्ही पार्टी करत आहोत", "Ravivaari aamhee party karat aahot", "We are hosting a party on Sunday", "intermediate", "Event invitation"),
    ("तुम्ही नक्की या", "Tumhi nakkee yaa", "You must definitely come", "intermediate", "Urgent warm invite"),
    ("कधी येऊ?", "Kadhi yeoo?", "When should I come?", "intermediate", "Accepting invitation query"),
    ("पुढच्या आठवड्यात भेटू", "PuDhchyaa aathavDyaat bheeToo", "Let's meet next week", "intermediate", "Planning meeting"),
    ("निमंत्रण दिल्याबद्दल धन्यवाद", "NimantraN dilyabaddal dhanyavaad", "Thank you for the invitation", "intermediate", "Expressing thanks for invite"),
    ("मी येईन", "Mee yeeen", "I will come", "intermediate", "Confirming attendance")
  ]),
  # L5: Polite Small Talk
  ("Polite Small Talk", "गप्पागोष्टी", 
   "Essential phrases for maintaining a casual, polite conversation.", None, [
    ("अजून काय चालू आहे?", "Ajoon kaay chaaloo aahe?", "What else is going on?", "intermediate", "Casual conversational starter"),
    ("विशेष काही नाही", "Vishesh kaahi naahi", "Nothing special", "intermediate", "Typical response"),
    ("बरं चाललंय", "Baram chaallay", "Things are going well", "intermediate", "Casual status reporting"),
    ("तुमचं कुटुंब कसं आहे?", "Tumcham kuTumba kasan aahe?", "How is your family?", "intermediate", "Family well-being inquiry"),
    ("सगळे मजेत आहेत", "Sagale majet aahet", "Everyone is doing great/happy", "intermediate", "Typical response"),
    ("मला तुमची गप्पा मारून आनंद झाला", "Malaa tumchee gappaa maaroon aanand jhaalaa", "I enjoyed talking to you", "intermediate", "Polite wrap-up"),
    ("पुन्हा भेटूया", "Punhaa bheeTooyaa", "Let's meet again", "intermediate", "Friendly farewell"),
    ("काळजी घ्या", "KaaLji ghyaa", "Take care", "intermediate", "Farewell well-wish")
  ])
]))

# ===================== MODULE 11: Work & Business =====================
modules.append(build_module("m11", "Work & Business", "काम आणि व्यवसाय", "Office communication, phone calls, meetings, appointments", "🏢", 5, 2, "intermediate", [
  # L1: In the Office
  ("In the Office", "ऑफिसमध्ये संभाषण", 
   "Typical workspace interactions and basic administrative needs.", None, [
    ("व्यवस्थापक (Manager)", "Vyavasthaapak", "Manager / Boss", "intermediate", "Job title"),
    ("सहकारी (Colleague)", "Sahakaaree", "Colleague / Coworker", "intermediate", "Job title"),
    ("फाइल कुठे आहे?", "File kuthe aahe?", "Where is the file?", "intermediate", "Office item search"),
    ("प्रिंटर चालू नाही", "Printer chaaloo naahi", "The printer is not working", "intermediate", "Tech challenge reporting"),
    ("मला सुट्टी हवी आहे", "Malaa suTTee havee aahe", "I need a leave/holiday", "intermediate", "Leave request"),
    ("आज काम खूप आहे", "Aaj kaam khoop aahe", "There is a lot of work today", "intermediate", "Expressing workload"),
    ("हे काम वेळेवर पूर्ण करा", "He kaam veLevar poorNa karaa", "Complete this work on time", "intermediate", "Instruction to subordinate"),
    ("मी मदत करू शकतो का?", "Mee madat karoo shakato ka?", "Can I help?", "intermediate", "Offering help")
  ]),
  # L2: Professional Introductions
  ("Professional Introductions", "व्यावसायिक ओळख", 
   "Introducing yourself in formal corporate or professional settings.", None, [
    ("मी या कंपनीत काम करतो", "Mee yaa companyt kaam karto", "I work in this company (male)", "intermediate", "Job description"),
    ("माझे पद व्यवस्थापक आहे", "Maajhe pad vyavasthaapak aahe", "My position is Manager", "intermediate", "Stating designation"),
    ("हे आमचे नवीन संचालक आहेत", "He aamche naveen sanchaalak aahet", "He/She is our new Director (respectful)", "intermediate", "Introducing senior"),
    ("भेटून आनंद झाला", "BheToon aanand jhaalaa", "Pleasure to meet you", "intermediate", "Formal greetings"),
    ("माझे स्वतःचे कार्यालय आहे", "Maajhe svataahche kaaryaalaya aahe", "I have my own office", "intermediate", "Entrepreneurial introduction"),
    ("मी सॉफ्टवेअर इंजिनिअर आहे", "Mee software engineer aahe", "I am a software engineer", "intermediate", "Stating profession"),
    ("आमची कंपनी पुण्यात आहे", "Aamchee company PuNyat aahe", "Our company is in Pune", "intermediate", "Stating corporate location"),
    ("कार्ड घ्या", "Card ghyaa", "Please take my business card", "intermediate", "Handing over card")
  ]),
  # L3: Phone Conversations
  ("Phone Conversations", "फोनवर बोलणे", 
   "Answering calls, verifying caller identity, and taking messages.", None, [
    ("हॅलो, कोण बोलतंय?", "Hello, koN bolaTay?", "Hello, who is speaking?", "intermediate", "Answering phone"),
    ("मी अमित बोलतोय", "Mee Amit bolatoy", "I am Amit speaking", "intermediate", "Identifying speaker"),
    ("माझा आवाज येतोय का?", "Maajhaa aavaaj yetoy ka?", "Can you hear my voice?", "intermediate", "Checking connectivity"),
    ("कृपया थोडं जोरात बोला", "Krupayaa thodam joraat bolaa", "Please speak a bit louder", "intermediate", "Audio adjustment request"),
    ("तो सध्या व्यस्त आहे", "To sadhya vyasta aahe", "He is busy right now", "intermediate", "Explaining unavailability"),
    ("नंतर फोन करा", "Nantar phone karaa", "Call later", "intermediate", "Rescheduling call"),
    ("रोप लाईनवर रहा", "Hold line-var rahaa", "Please hold on the line", "intermediate", "Call holding request"),
    ("निरोप सांगा", "Nirop saangaa", "Tell him the message", "intermediate", "Leaving message")
  ]),
  # L4: Meetings & Discussions
  ("Meetings & Discussions", "सभेतील संभाषण", 
   "Common corporate vocabulary for meetings and presentations.", None, [
    ("चला मीटिंग सुरू करूया", "Chalaa meeting suroo karooyaa", "Let's start the meeting", "intermediate", "Opening meeting"),
    ("तुमचे मत काय आहे?", "Tumche mat kaay aahe?", "What is your opinion?", "intermediate", "Seeking feedback"),
    ("मी सहमत आहे", "Mee sahamat aahe", "I agree", "intermediate", "Expressing agreement"),
    ("मी सहमत नाही", "Mee sahamat naahi", "I do not agree", "intermediate", "Expressing disagreement"),
    ("पुढचा मुद्दा कोणता?", "PuDhchaa muddaa koNataa?", "What is the next point?", "intermediate", "Facilitating agenda"),
    ("सादरीकरण (Presentation)", "SaadareekaraN", "Presentation", "intermediate", "Agenda item"),
    ("निर्णय घेणे", "NirNay gheNe", "To make a decision", "intermediate", "Meeting outcome"),
    ("मी उद्या सादरीकरण करेन", "Mee udyaa saadareekaraN karen", "I will present tomorrow (male/female)", "intermediate", "Stating commitment")
  ]),
  # L5: Making Appointments
  ("Making Appointments", "भेटीची वेळ ठरवणे", 
   "Scheduling business or formal meetings.", None, [
    ("मला भेटीची वेळ हवी आहे", "Malaa bheTeechee veL havee aahe", "I want an appointment", "intermediate", "Scheduling request"),
    ("उद्या दुपारी दोन वाजता चालेल का?", "Udyaa dupaari don vaajataa chaalel ka?", "Will tomorrow afternoon at 2 PM work?", "intermediate", "Proposing slot"),
    ("हो, ती वेळ चालेल", "Ho, tee veL chaalel", "Yes, that time works", "intermediate", "Confirming slot"),
    ("मला आज वेळ नाही", "Malaa aaj veL naahi", "I don't have time today", "intermediate", "Declining slot"),
    ("अपॉइंटमेंट रद्द झाली आहे", "Appointment radda jhaalee aahe", "The appointment is cancelled", "intermediate", "Cancellation notification"),
    ("कृपया वेळ बदला", "Krupayaa veL badlaa", "Please change/reschedule the time", "intermediate", "Rescheduling request"),
    ("आम्ही वेळेवर पोहोचू", "Aamhee veLevar pohochaoo", "We will arrive on time", "intermediate", "Confirming punctuality"),
    ("थोड्या वेळात", "ThoDyaa veLaat", "In a little while", "intermediate", "Time description")
  ])
]))

# ===================== MODULE 12: Culture & Celebration =====================
modules.append(build_module("m12", "Culture & Celebration", "संस्कृती आणि सण", "Festivals, blessings, hospitality customs, popular idioms", "🎉", 5, 2, "intermediate", [
  # L1: Traditional Festivals
  ("Traditional Festivals", "पारंपरिक सण", 
   "Maharashtra celebrates Ganesh Utsav (Ganeshotsav) with massive grandeur. Diwali and Gudhi Padwa are also major.", None, [
    ("गणपती बाप्पा मोरया!", "Ganapati Bappa Morya!", "Glory to Lord Ganesha!", "intermediate", "Iconic festival chant"),
    ("गुढी पाडव्याच्या शुभेच्छा", "Gudhi Padvyachya shubhechhaa", "Happy Gudhi Padwa (Marathi New Year)", "intermediate", "New Year wishes"),
    ("दिवाळीची रोषणाई", "DivaaLeechee roshNaaee", "Diwali lights/illumination", "intermediate", "Festival description"),
    ("प्रसाद घ्या", "Prasaad ghyaa", "Have some holy offering/sweet", "intermediate", "Religious custom offering"),
    ("आरती सुरू झाली आहे", "Aartee suroo jhaalee aahe", "The prayer song (Aarti) has started", "intermediate", "Festival event status"),
    ("नवीन कपडे", "Naveen kapade", "New clothes", "intermediate", "Festival custom"),
    ("गोड फराळ", "God pharaaL", "Diwali snacks/sweets", "intermediate", "Festival custom"),
    ("सण आणि उत्सव", "SaN aaNi utsav", "Festivals and celebrations", "intermediate", "General concept descriptor")
  ]),
  # L2: Offering Blessings
  ("Offering Blessings", "शुभेच्छा आणि आशीर्वाद", 
   "Giving well-wishes or elder blessings, highly valued in Marathi homes.", None, [
    ("खूप मोठे व्हा!", "Khoop moThe vhaa!", "Grow very big! (May you achieve success!)", "intermediate", "Traditional elder blessing to kids"),
    ("यशस्वी व्हा", "Yashasvee vhaa", "Be successful", "intermediate", "Blessing"),
    ("वाढदिवसाच्या हार्दिक शुभेच्छा", "Vaadhdivasaachyaa haardik shubhechhaa", "Warmest birthday wishes", "intermediate", "Birthday greeting"),
    ("नवीन वर्षाच्या शुभेच्छा", "Naveen varshaachyaa shubhechhaa", "Happy New Year", "intermediate", "New Year greeting"),
    ("आनंदी राहा", "Aanandee raahaa", "Stay happy", "intermediate", "Blessing / Wish"),
    ("सदा सुखी रहा", "Sadaa sukhee rahaa", "Stay always happy", "intermediate", "Traditional elder blessing"),
    ("सर्व काही चांगले होईल", "Sarva kaahi chaangle hoeel", "Everything will be fine", "intermediate", "Reassuring statement"),
    ("प्रयत्नांना यश मिळो", "Prayatnaannaa yash miLo", "May your efforts yield success", "intermediate", "Blessing for endeavors")
  ]),
  # L3: Hospitality Customs
  ("Hospitality Customs", "पाहुणचार आणि आदरातिथ्य", 
   "Maharashtrian guest etiquette: offering tea, sitting respectfully.", None, [
    ("पाहुणे घरी आलेत", "Paahune gharee aalet", "Guests have come home", "intermediate", "Reporting arrivals"),
    ("बसा ना, चहा घेणार का?", "Basaa naa, chahaa gheNaar ka?", "Please sit, will you have some tea?", "intermediate", "Warm hospitality invite"),
    ("जेवल्याशिवाय जाऊ नका", "Jevalyaashivaay jaaoo nakaa", "Don't leave without eating a meal", "intermediate", "Hospitable insistence"),
    ("आमच्या घरी नक्की या", "Aamchyaa gharee nakkee yaa", "Do come to our home for sure", "intermediate", "Formal invite"),
    ("पाहुणचार खूप छान होता", "PaahuNchaar khoop chhaan hotaa", "The hospitality was wonderful", "intermediate", "Complimenting host"),
    ("पुन्हा कधी भेटणार?", "Punhaa kadhi bheTNaar?", "When will we meet again?", "intermediate", "Friendly parting inquiry"),
    ("घरी गेल्यावर फोन करा", "Gharee gelyaavar phone karaa", "Phone us once you reach home", "intermediate", "Parting concern"),
    ("येतो आम्ही / येते आम्ही", "Yeto aamhee / Yete aamhee", "We are leaving (common plural farewell)", "intermediate", "Leaving host's home")
  ]),
  # L4: Idioms & Cultural Sayings
  ("Idioms & Cultural Sayings", "मराठी म्हणी", 
   "Marathi is rich in 'mhani' (sayings/idioms) reflecting rustic wisdom and humor.", None, [
    ("अती तिथे माती", "Atee tithe maatee", "Excess of anything leads to ruin (lit: excess leads to soil/dust)", "intermediate", "Cautionary idiom"),
    ("इकडे आड तिकडे विहीर", "Ikade aaD tikade viheer", "Between the devil and the deep blue sea (lit: ditch on one side, well on other)", "intermediate", "Situation descriptor"),
    ("करावे तसे भरावे", "Karaave tase bharaave", "As you sow, so shall you reap", "intermediate", "Moral idiom"),
    ("हातच्या कंकणाला आरसा कशाला?", "Haatachyaa kankaNaalaa aarsaa kashalaa?", "Truth needs no proof (lit: why a mirror for a bangle on the hand?)", "intermediate", "Argumentative idiom"),
    ("गरज सरो वैद्य मरो", "Garaj saro vaidya maro", "Forgetting the benefactor once the need is met (lit: once need ends, doctor dies)", "intermediate", "Cynical idiom"),
    ("मूर्ती लहान पण कीर्ती महान", "Moortee lahaan paN keertee mahaan", "Small body but grand fame", "intermediate", "Praising someone's impact"),
    ("उंटावरचा शहाणा", "UnTaavarchaa shahaaNaa", "A foolish adviser (lit: wise man sitting on a camel)", "intermediate", "Sarcastic descriptor"),
    ("दुरुन डोंगर साजिरे", "Duroon dongar saajire", "Distance lends enchantment to the view (lit: hills look beautiful from afar)", "intermediate", "Philosophical saying")
  ]),
  # L5: Congratulations
  ("Congratulations", "अभिनंदन", 
   "Celebrating achievements, promotions, or winning scores.", None, [
    ("हार्दिक अभिनंदन!", "Haardik abhinandan!", "Heartfelt congratulations!", "intermediate", "Standard formal congrats"),
    ("तुमचा अभिमान वाटतो", "Tumchaa abhimaan vaaTato", "I feel proud of you", "intermediate", "Expressing pride"),
    ("खूप उत्तम काम केलेत!", "Khoop uttam kaam kelet!", "You did excellent work!", "intermediate", "Performance compliment"),
    ("गोड तोंड करा", "God tond karaa", "Sweeten your mouth (eat sweets to celebrate)", "intermediate", "Celebration custom phrase"),
    ("पदोन्नतीबद्दल अभिनंदन (Promotion)", "Padonnatteebaddal abhinandan", "Congrats on your promotion", "intermediate", "Corporate congrats"),
    ("तुम्ही हे करून दाखवलं!", "Tumhi he karoon daakhaavalam!", "You did it! / You proved it!", "intermediate", "Excited compliment"),
    ("यशाचे शिखर गाठणे", "Yashaache shikhar gaaThaNe", "To reach the peak of success", "intermediate", "Literary compliment"),
    ("पार्टी कधी आहे?", "Party kadhi aahe?", "When is the party?", "intermediate", "Casual celebration inquiry")
  ])
]))

# Write output
os.makedirs(r'c:\Translation\data', exist_ok=True)
with open(r'c:\Translation\data\_m9_m12.json','w',encoding='utf-8') as f:
    json.dump(modules, f, ensure_ascii=False, indent=2)
print(f"Written {len(modules)} modules, {sum(len(m['lessons']) for m in modules)} lessons, {sum(sum(len(l['phrases']) for l in m['lessons']) for m in modules)} phrases")
