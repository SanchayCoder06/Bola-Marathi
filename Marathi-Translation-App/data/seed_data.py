# -*- coding: utf-8 -*-
import json
import os

def main():
    # -------------------------------------------------------------
    # 1. GENERATE CITIES DATA
    # -------------------------------------------------------------
    cities_data = {
      "cities": [
        {
          "id": "pune",
          "name": "Pune",
          "nameMarathi": "पुणे",
          "levelRequired": 1,
          "coords": { "x": 50, "y": 60 },
          "icon": "🏰",
          "landmarks": [
            { "id": "pune-station", "type": "railway_station", "name": "Pune Junction", "icon": "🚉", "dialogueId": "pune_taxi_start" },
            { "id": "pune-restaurant", "type": "restaurant", "name": "Durvankur Restaurant", "icon": "🍽️", "dialogueId": "pune_restaurant" },
            { "id": "pune-market", "type": "market", "name": "Tulshibaug Market", "icon": "🛍️", "dialogueId": "pune_market_bargain" },
            { "id": "pune-shaniwarwada", "type": "landmark", "name": "Shaniwar Wada", "icon": "🏰", "dialogueId": "pune_directions" },
            { "id": "pune-apartment", "type": "home", "name": "Puneri Apartment", "icon": "🏢", "dialogueId": "pune_neighbor" },
            { "id": "pune-fruitstall", "type": "shop", "name": "Mango Fruit Stall", "icon": "🥭", "dialogueId": "pune_mango_seller" }
          ]
        },
        {
          "id": "mumbai",
          "name": "Mumbai",
          "nameMarathi": "मुंबई",
          "levelRequired": 2,
          "coords": { "x": 30, "y": 45 },
          "icon": "🌊",
          "landmarks": [
            { "id": "mumbai-station", "type": "railway_station", "name": "CST Station", "icon": "🚉", "dialogueId": None },
            { "id": "mumbai-office", "type": "office", "name": "Nariman Point Office", "icon": "🏢", "dialogueId": None }
          ]
        },
        {
          "id": "nashik",
          "name": "Nashik",
          "nameMarathi": "नाशिक",
          "levelRequired": 3,
          "coords": { "x": 45, "y": 25 },
          "icon": "🍇",
          "landmarks": [
            { "id": "nashik-market", "type": "market", "name": "Grape Mandai", "icon": "🛍️", "dialogueId": None }
          ]
        },
        {
          "id": "kolhapur",
          "name": "Kolhapur",
          "nameMarathi": "कोल्हापूर",
          "levelRequired": 4,
          "coords": { "x": 55, "y": 85 },
          "icon": "🛕",
          "landmarks": [
            { "id": "kolhapur-temple", "type": "festival", "name": "Mahalakshmi Temple", "icon": "🛕", "dialogueId": None }
          ]
        },
        {
          "id": "nagpur",
          "name": "Nagpur",
          "nameMarathi": "नागपूर",
          "levelRequired": 5,
          "coords": { "x": 85, "y": 35 },
          "icon": "🍊",
          "landmarks": [
            { "id": "nagpur-market", "type": "market", "name": "Orange Mandai", "icon": "🍊", "dialogueId": None }
          ]
        },
        {
          "id": "konkan",
          "name": "Konkan",
          "nameMarathi": "कोकण",
          "levelRequired": 6,
          "coords": { "x": 25, "y": 75 },
          "icon": "🌴",
          "landmarks": [
            { "id": "konkan-beach", "type": "restaurant", "name": "Malvani Restaurant", "icon": "🐟", "dialogueId": None }
          ]
        }
      ]
    }

    # -------------------------------------------------------------
    # 2. GENERATE CHAPTERS DATA
    # -------------------------------------------------------------
    chapters_data = {
      "chapters": [
        {
          "chapterNumber": 1,
          "title": "Arriving in Pune",
          "cityId": "pune",
          "unlockRequirement": None,
          "scenarios": ["pune_taxi_start"]
        },
        {
          "chapterNumber": 2,
          "title": "Dining at Durvankur",
          "cityId": "pune",
          "unlockRequirement": "completion_pune_taxi_start",
          "scenarios": ["pune_restaurant"]
        },
        {
          "chapterNumber": 3,
          "title": "Bargaining at Tulshibaug",
          "cityId": "pune",
          "unlockRequirement": "completion_pune_restaurant",
          "scenarios": ["pune_market_bargain"]
        },
        {
          "chapterNumber": 4,
          "title": "Finding Shaniwar Wada",
          "cityId": "pune",
          "unlockRequirement": "completion_pune_market_bargain",
          "scenarios": ["pune_directions"]
        },
        {
          "chapterNumber": 5,
          "title": "Meeting the Neighbor",
          "cityId": "pune",
          "unlockRequirement": "completion_pune_directions",
          "scenarios": ["pune_neighbor"]
        },
        {
          "chapterNumber": 6,
          "title": "Buying Mangoes",
          "cityId": "pune",
          "unlockRequirement": "completion_pune_neighbor",
          "scenarios": ["pune_mango_seller"]
        }
      ]
    }

    # -------------------------------------------------------------
    # 3. GENERATE DICTIONARY DATA (300+ Entries)
    # -------------------------------------------------------------
    dictionary_list = []

    words_src = [
        # GREETINGS (22 words)
        ("नमस्कार", "Namaskar", "Greeting", "Hello / Greetings", "नमस्ते / नमस्कार", "नमस्कार, कसे आहात?", "Hello, how are you?", "नमस्ते, आप कैसे हैं?", "greetings"),
        ("धन्यवाद", "Dhanyavaad", "Noun", "Thank you", "धन्यवाद / शुक्रिया", "मदतीसाठी खूप खूप धन्यवाद.", "Thank you very much for the help.", "मदद के लिए बहुत-बहुत धन्यवाद।", "greetings"),
        ("कृपया", "Krupaya", "Adverb", "Please", "कृपया", "कृपया मला पाणी द्या.", "Please give me water.", "कृपया मुझे पानी दें।", "greetings"),
        ("कसे आहात", "Kase aahat", "Phrase", "How are you? (formal)", "आप कैसे हैं?", "काका, तुम्ही कसे आहात?", "Uncle, how are you?", "चाचाजी, आप कैसे हैं?", "greetings"),
        ("ठीक आहे", "Theek aahe", "Adverb", "Okay / All right", "ठीक है / अच्छा", "ठीक आहे, आपण उद्या भेटू.", "Okay, we will meet tomorrow.", "ठीक है, हम कल मिलेंगे।", "greetings"),
        ("हो", "Ho", "Adverb", "Yes", "हाँ", "हो, मी मराठी शिकत आहे.", "Yes, I am learning Marathi.", "हाँ, मैं मराठी सीख रहा हूँ।", "greetings"),
        ("नाही", "Naahi", "Adverb", "No", "नहीं", "नाही, मला चहा नको आहे.", "No, I do not want tea.", "नहीं, मुझे चाय नहीं चाहिए।", "greetings"),
        ("माफ करा", "Maaf kara", "Verb", "Excuse me / Sorry", "माफ कीजिये / क्षमा करें", "माफ करा, मला उशीर झाला.", "Excuse me, I got late.", "माफ कीजिये, मुझे देर हो गई।", "greetings"),
        ("शुभ सकाळ", "Shubh sakaal", "Greeting", "Good morning", "सुप्रभात / शुभ प्रभात", "शुभ सकाळ मित्रा!", "Good morning friend!", "सुप्रभात मित्र!", "greetings"),
        ("शुभ रात्री", "Shubh raatri", "Greeting", "Good night", "शुभ रात्रि", "शुभ रात्री, उद्या भेटू.", "Good night, see you tomorrow.", "शुभ रात्रि, कल मिलेंगे।", "greetings"),
        ("स्वागत आहे", "Swaagat aahe", "Phrase", "Welcome", " स्वागत है", "तुमचे आमच्या घरी स्वागत आहे.", "You are welcome to our home.", "आपका हमारे घर में स्वागत है।", "greetings"),
        ("पुन्हा भेटू", "Punha bhetu", "Phrase", "See you again", "फिर मिलेंगे", "ठीक आहे, पुन्हा भेटू.", "Okay, see you again.", "ठीक है, फिर मिलेंगे।", "greetings"),
        ("नाव", "Naav", "Noun", "Name", "नाम", "माझे नाव राहुल आहे.", "My name is Rahul.", "मेरा नाम राहुल है।", "greetings"),
        ("तुमचे नाव काय?", "Tumche naav kay?", "Phrase", "What is your name?", "आपका नाम क्या है?", "नमस्कार, तुमचे नाव काय?", "Hello, what is your name?", "नमस्ते, आपका नाम क्या है?", "greetings"),
        ("कसे", "Kase", "Adverb", "How", "कैसे", "हे कसे करायचे?", "How to do this?", "यह कैसे करना है?", "greetings"),
        ("भेटून आनंद झाला", "Bhetun aanand zala", "Phrase", "Nice to meet you", "मिलकर खुशी हुई", "तुम्हाला भेटून आनंद झाला.", "Nice to meet you.", "आपसे मिलकर खुशी हुई।", "greetings"),
        ("काळजी घ्या", "Kaaljee ghya", "Phrase", "Take care", "अपना ख्याल रखना", "प्रवासात काळजी घ्या.", "Take care during the travel.", "यात्रा में अपना ख्याल रखना।", "greetings"),
        ("अभिनंदन", "Abhinandan", "Noun", "Congratulations", "बधाई हो", "तुमच्या यशाबद्दल अभिनंदन!", "Congratulations on your success!", "आपकी सफलता पर बधाई!", "greetings"),
        ("शुभेच्छा", "Shubhechha", "Noun", "Good wishes / Good luck", "शुभकामनाएं", "परीक्षेसाठी खूप शुभेच्छा.", "Best of luck for the exam.", "परीक्षा के लिए बहुत शुभकामनाएं।", "greetings"),
        ("मित्र", "Mitra", "Noun", "Friend", "दोस्त / मित्र", "तो माझा चांगला मित्र आहे.", "He is my good friend.", "वह मेरा अच्छा दोस्त है।", "greetings"),
        ("साहेब", "Saheb", "Noun", "Sir / Gentleman", "सर / साहब", "नमस्कार साहेब, या बसा.", "Hello sir, please sit down.", "नमस्ते साहब, आइए बैठिए।", "greetings"),
        ("बाई", "Baai", "Noun", "Madam / Lady", "मैडम / महिला", "त्या आमच्या बाई आहेत.", "She is our teacher/madam.", "वह हमारी मैडम हैं।", "greetings"),

        # FOOD & DINING (35 words)
        ("पाणी", "Paani", "Noun", "Water", "पानी / जल", "मला प्यायला पाणी हवे आहे.", "I want water to drink.", "मुझे पीने के लिए पानी चाहिए।", "food"),
        ("चहा", "Chaha", "Noun", "Tea", "चाय", "मला गरम चहा आवडतो.", "I like hot tea.", "मुझे गर्म चाय पसंद है।", "food"),
        ("जेवण", "Jevan", "Noun", "Food / Meal", "खाना / भोजन", "तुम्ही जेवण केले का?", "Did you have your food?", "क्या आपने खाना खाया?", "food"),
        ("नाश्ता", "Naashta", "Noun", "Breakfast", "नाश्ता", "आज नाश्त्याला काय आहे?", "What is for breakfast today?", "आज नाश्ते में क्या है?", "food"),
        ("दूध", "Doodh", "Noun", "Milk", "दूध", "बाळ दूध पीत आहे.", "The baby is drinking milk.", "बच्चा दूध पी रहा है।", "food"),
        ("साखर", "Saakhar", "Noun", "Sugar", "चीनी / शक्कर", "चहामध्ये साखर कमी आहे.", "Sugar is less in the tea.", "चाय में चीनी कम है।", "food"),
        ("मीठ", "Meeth", "Noun", "Salt", "नमक", "भाजीत मीठ जास्त आहे.", "There is too much salt in the curry.", "सब्जी में नमक ज्यादा है।", "food"),
        ("भात", "Bhaat", "Noun", "Rice", "चावल / भात", "मला डाळ भात आवडतो.", "I like dal and rice.", "मुझे दाल भात पसंद है।", "food"),
        ("पोळी", "Poli", "Noun", "Flatbread / Roti", "रोटी / चपाती", "आई गरम पोळी करत आहे.", "Mother is making hot rotis.", "माँ गर्म रोटी बना रही है।", "food"),
        ("भाजी", "Bhaajee", "Noun", "Vegetable / Curry", "सब्जी", "ही बटाट्याची भाजी आहे.", "This is potato curry.", "यह आलू की सब्जी है।", "food"),
        ("पिठलं", "Pithla", "Noun", "Pithla (gram flour curry)", "पिठला", "गरम पिठलं खूप चवदार लागते.", "Hot Pithla tastes very delicious.", "गर्म पिठला बहुत स्वादिष्ट लगता है।", "food"),
        ("भाकरी", "Bhakri", "Noun", "Bhakri (millet flatbread)", "भाकरी", "मी बाजरीची भाकरी खातो.", "I eat millet Bhakri.", "मैं बाजरे की भाकरी खाता हूँ।", "food"),
        ("मिसळ पाव", "Misal Pav", "Noun", "Misal Pav (spicy sprout curry with bread)", "मिसळ पाव", "पुण्याची मिसळ खूप प्रसिद्ध आहे.", "Pune's Misal is very famous.", "पुणे की मिसळ बहुत प्रसिद्ध है।", "food"),
        ("मोदक", "Modak", "Noun", "Modak (sweet dumpling)", "मोदक", "गणपतीला मोदक आवडतात.", "Lord Ganesha likes Modak.", "गणपति को मोदक पसंद हैं।", "food"),
        ("ताक", "Taak", "Noun", "Buttermilk", "छाछ / मट्ठा", "उन्हाळ्यात ताक पिणे चांगले असते.", "Drinking buttermilk in summer is good.", "गर्मी में छाछ पीना अच्छा होता है।", "food"),
        ("तिखट", "Tikhat", "Adjective", "Spicy", "तीखा / मिर्चवाला", "हे जेवण खूप तिखट आहे.", "This food is very spicy.", "यह खाना बहुत तीखा है।", "food"),
        ("गोड", "God", "Adjective", "Sweet", "मीठा", "हा आंबा खूप गोड आहे.", "This mango is very sweet.", "यह आम बहुत मीठा है।", "food"),
        ("आंबट", "Aambat", "Adjective", "Sour", "खट्टा", "लिंबू आंबट असते.", "Lemon is sour.", "नींबू खट्टा होता है।", "food"),
        ("खारट", "Khaarat", "Adjective", "Salty", "नमकीन", "हे सूप खारट आहे.", "This soup is salty.", "यह सूप नमकीन है।", "food"),
        ("चवदार", "Chavdaar", "Adjective", "Tasty / Delicious", "स्वादिष्ट", "हॉटेलचे जेवण चवदार होते.", "The restaurant food was delicious.", "होटल का खाना स्वादिष्ट था।", "food"),
        ("भूक", "Bhook", "Noun", "Hunger", "भूख", "मला खूप भूक लागली आहे.", "I am very hungry.", "मुझे बहुत भूख लगी है।", "food"),
        ("तहान", "Tahaan", "Noun", "Thirst", "प्यास", "मला तहान लागली आहे.", "I am thirsty.", "मुझे प्यास लगी है।", "food"),
        ("हॉटेल", "Hotel", "Noun", "Restaurant / Hotel", "होटल / भोजनालय", "आपण नवीन हॉटेलमध्ये जाऊ.", "We will go to the new restaurant.", "हम नए होटल में जाएंगे।", "food"),
        ("बिल", "Bill", "Noun", "Bill", "बिल", "कृपया आम्हाला बिल द्या.", "Please give us the bill.", "कृपया हमें बिल दें।", "food"),
        ("चमचा", "Chamcha", "Noun", "Spoon", "चम्मच", "मला एक चमचा द्या.", "Give me a spoon.", "मुझे एक चम्मच दें।", "food"),
        ("ताट", "Taat", "Noun", "Plate", "थाली", "ताट वाढून ठेवले आहे.", "The plate is served.", "थाली परोसी हुई है।", "food"),
        ("वाटी", "Waatee", "Noun", "Bowl", "कटोरी", "वाटीत आमटी घ्या.", "Take curry in the bowl.", "कटोरी में कढ़ी लें।", "food"),
        ("फळ", "Phal", "Noun", "Fruit", "फल", "रोज एक तरी फळ खावे.", "One should eat at least one fruit daily.", "रोज कम से कम एक फल खाना चाहिए।", "food"),
        ("भाजीपाला", "Bhaajeepaala", "Noun", "Vegetables", "सब्जी / तरकारी", "ताज्या भाजीपाला खावा.", "One should eat fresh vegetables.", "ताजी सब्जियां खानी चाहिए।", "food"),
        ("कॉफी", "Coffee", "Noun", "Coffee", "कॉफ़ी", "तुम्हाला कॉफी हवी आहे का?", "Do you want coffee?", "क्या आपको कॉफ़ी चाहिए?", "food"),
        ("पिणे", "Pine", "Verb", "To drink", "पीना", "मी पाणी पितो.", "I drink water.", "मैं पानी पीता हूँ।", "food"),
        ("खाणे", "Khane", "Verb", "To eat", "खाना", "तो सफरचंद खातो.", "He eats an apple.", "वह सेब खाता है।", "food"),
        ("दही", "Dahee", "Noun", "Curd / Yogurt", "दही", "दही आरोग्यासाठी चांगले आहे.", "Curd is good for health.", "दही स्वास्थ्य के लिए अच्छा है।", "food"),
        ("तूप", "Toop", "Noun", "Clarified butter / Ghee", "घी", "वरण-भातावर तूप घाला.", "Put ghee on dal rice.", "दाल-भात पर घी डालें।", "food"),
        ("पाव", "Pav", "Noun", "Bread / Pav", "पाव / ब्रेड", "आम्ही पाव विकत घेतला.", "We bought bread.", "हमने पाव खरीदा।", "food"),

        # TRAVEL & TRANSPORT (25 words)
        ("रिक्षा", "Riksha", "Noun", "Auto-rickshaw", "ऑटो रिक्शा", "मी रिक्षेने स्टेशनला गेलो.", "I went to the station by rickshaw.", "मैं ऑटो रिक्शा से स्टेशन गया।", "transport"),
        ("गाडी", "Gaadee", "Noun", "Car / Vehicle", "गाड़ी / कार", "माझी गाडी बाहेर उभी आहे.", "My car is parked outside.", "मेरी गाड़ी बाहर खड़ी है।", "transport"),
        ("बस", "Bus", "Noun", "Bus", "बस", "बस कधी येईल?", "When will the bus come?", "बस कब आएगी?", "transport"),
        ("रेल्वे", "Railway", "Noun", "Train / Railway", "ट्रेन / रेलगाड़ी", "रेल्वे वेळेवर आली.", "The train arrived on time.", "रेलगाड़ी समय पर आई।", "transport"),
        ("स्टेशन", "Station", "Noun", "Station", "स्टेशन", "हे पुणे स्टेशन आहे का?", "Is this Pune station?", "क्या यह पुणे स्टेशन है?", "transport"),
        ("तिकिट", "Tikit", "Noun", "Ticket", "टिकट", "मी तिकिट काढले आहे.", "I have purchased the ticket.", "मैंने टिकट लिया है।", "transport"),
        ("भाडे", "Bhaade", "Noun", "Fare / Rent", "किराया", "शनिवार वाड्याचे रिक्षा भाडे किती?", "How much is the rickshaw fare to Shaniwar Wada?", "शनिवार वाडा का रिक्षा किराया कितना है?", "transport"),
        ("चालक", "Chaalak", "Noun", "Driver", "चालक / ड्राइवर", "बस चालक वेगाने गाडी चालवत होता.", "The bus driver was driving fast.", "बस चालक तेज गाड़ी चला रहा था।", "transport"),
        ("रस्ता", "Rasta", "Noun", "Road / Way", "सड़क / रास्ता", "हा रस्ता कुठे जातो?", "Where does this road go?", "यह रास्ता कहाँ जाता है?", "transport"),
        ("विमान", "Vimaan", "Noun", "Aeroplane", "हवाई जहाज", "विमान आकाशात उडत आहे.", "The plane is flying in the sky.", "हवाई जहाज आसमान में उड़ रहा है।", "transport"),
        ("सायकल", "Cycle", "Noun", "Bicycle", "साइकिल", "मी सायकलने शाळेत जातो.", "I go to school by bicycle.", "मैं साइकिल से school जाता हूँ।", "transport"),
        ("प्रवास", "Pravaas", "Noun", "Travel / Journey", "यात्रा / सफर", "तुमचा प्रवास सुखकर असो.", "Have a safe journey.", "आपकी यात्रा सुखद हो।", "transport"),
        ("अंतर", "Antar", "Noun", "Distance", "दूरी", "येथून स्टेशनचे अंतर किती आहे?", "How far is the station from here?", "यहाँ से स्टेशन की दूरी कितनी है?", "transport"),
        ("वेळ", "Vel", "Noun", "Time", "समय / वक्त", "प्रवासाला खूप वेळ लागला.", "The travel took a lot of time.", "यात्रा में बहुत समय लगा।", "transport"),
        ("नकाशा", "Nakasha", "Noun", "Map", "मानचित्र / नक्शा", "नकाशात मार्ग दाखवा.", "Show the route in the map.", "नक्शे में मार्ग दिखाएं।", "transport"),
        ("जागा", "Jaaga", "Noun", "Seat / Place", "सीट / जगह", "कृपया मला बसायला जागा द्या.", "Please give me a seat to sit.", "कृपया मुझे बैठने के लिए जगह दें।", "transport"),
        ("गर्दी", "Gardee", "Noun", "Crowd", "भीड़", "गाडीमध्ये खूप गर्दी आहे.", "There is a lot of crowd in the train.", "गाड़ी में बहुत भीड़ है।", "transport"),
        ("हळू", "Halu", "Adverb", "Slow / Slowly", "धीरे / धीमे", "गाडी हळू चालवा.", "Drive the vehicle slowly.", "गाड़ी धीरे चलाएं।", "transport"),
        ("जलद", "Jalad", "Adverb", "Fast / Quickly", "तेज / जल्दी", "ही रेल्वे जलद धावते.", "This train runs fast.", "यह रेलगाड़ी तेज दौड़ती है।", "transport"),
        ("पायी", "Paayi", "Adverb", "On foot", "पैदल", "आम्ही पायी आलो.", "We came on foot.", "हम पैदल आए।", "transport"),
        ("चौक", "Chouk", "Noun", "Intersection / Square", "चौक / चौराहा", "अलका टॉकीज चौकात थांबा.", "Stop at Alka Talkies intersection.", "अलका टॉकीज चौराहे पर रुकें।", "transport"),
        ("थांबा", "Thamba", "Verb", "Stop / Wait", "रुकिए / रुकना", "एक मिनिट थांबा दादा.", "Wait for a minute driver.", "एक मिनट रुकिए भैया।", "transport"),
        ("मार्ग", "Maarg", "Noun", "Route / Path", "मार्ग", "हा मुंबईचा मार्ग आहे.", "This is the Mumbai route.", "यह मुंबई का मार्ग है।", "transport"),
        ("चालणे", "Chaalne", "Verb", "To walk", "चलना", "रोज चालणे चांगले असते.", "Walking daily is good.", "रोज चलना अच्छा होता है।", "transport"),
        ("शोधणे", "Shodhne", "Verb", "To search / find", "ढूँढना", "मी माझी गाडी शोधत आहे.", "I am searching for my car.", "मैं अपनी गाड़ी ढूँढ रहा हूँ।", "transport"),

        # DIRECTIONS & PLACES (25 words)
        ("डावीकडे", "Daaveekade", "Adverb", "To the left", "बाईं ओर", "पुढील चौकातून डावीकडे वळा.", "Turn left at the next intersection.", "अगले चौराहे से बाईं ओर मुड़ें।", "directions"),
        ("उजवीकडे", "Ujaveekade", "Adverb", "To the right", "ाईं ओर", "दुकान उजव्या बाजूला आहे.", "The shop is on the right side.", "दुकान दाईं ओर है।", "directions"),
        ("सरळ", "Saral", "Adverb", "Straight", "सीधे", "सरळ पुढे जा.", "Go straight ahead.", "सीधे आगे जाएं।", "directions"),
        ("मागे", "Maage", "Adverb", "Behind / Back", "पीछे", "माझ्या मागे या.", "Come behind me.", "मेरे पीछे आएं।", "directions"),
        ("पुढे", "Pudhe", "Adverb", "In front / Ahead", "आगे", "पुढे काय आहे?", "What is ahead?", "आगे क्या है?", "directions"),
        ("खाली", "Khaalee", "Adverb", "Down / Below", "नीचे", "खाली बसा.", "Sit down.", "नीचे बैठिए।", "directions"),
        ("वर", "Var", "Adverb", "Up / Above", "ऊपर", "पक्षी झाडावर आहे.", "The bird is on the tree.", "पक्षी पेड़ पर है।", "directions"),
        ("कुठे", "Kuthe", "Adverb", "Where", "कहाँ", "शनिवार वाडा कुठे आहे?", "Where is Shaniwar Wada?", "शनिवार वाडा कहाँ है?", "directions"),
        ("जवळ", "Javal", "Adverb", "Near", "पास", "माझे घर स्टेशनजवळ आहे.", "My home is near the station.", "मेरा घर स्टेशन के पास है।", "directions"),
        ("लांब", "Laamb", "Adverb", "Far", "दूर", "मुंबई येथून खूप लांब आहे का?", "Is Mumbai very far from here?", "क्या मुंबई यहाँ से बहुत दूर है?", "directions"),
        ("شهر", "Shahar", "Noun", "City", "शहर", "पुणे हे ऐतिहासिक शहर आहे.", "Pune is a historical city.", "पुणे एक ऐतिहासिक शहर है।", "directions"),
        ("गाव", "Gaav", "Noun", "Village / Town", "गाँव", "माझे गाव कोकणात आहे.", "My village is in Konkan.", "मेरा गाँव कोंकण में है।", "directions"),
        ("घर", "Ghar", "Noun", "Home / House", "घर", "हे माझे घर आहे.", "This is my house.", "यह मेरा घर है।", "directions"),
        ("दुकान", "Dukaan", "Noun", "Shop", "दुकान", "हे कपड्याचे दुकान आहे.", "This is a clothing shop.", "यह कपड़ों की दुकान है।", "directions"),
        ("बाजार", "Baazaar", "Noun", "Market", "बाजार", "बाजारात खूप गर्दी आहे.", "There is a lot of crowd in the market.", "बाजार में बहुत भीड़ है।", "directions"),
        ("कार्यालय", "Kaaryaalay", "Noun", "Office", "कार्यालय / दफ्तर", "माझे कार्यालय सेनापती बापट रस्त्यावर आहे.", "My office is on Senapati Bapat Road.", "मेरा दफ्तर सेनापती बापट मार्ग पर है।", "directions"),
        ("शाळा", "Shaala", "Noun", "School", "स्कूल / पाठशाला", "शाळेची घंटा वाजली.", "The school bell rang.", "स्कूल की घंटी बजी।", "directions"),
        ("महाविद्यालय", "Mahaavidyaalay", "Noun", "College", "महाविद्यालय / कॉलेज", "तो फर्ग्युसन महाविद्यालयात शिकतो.", "He studies in Fergusson College.", "वह फर्ग्युसन कॉलेज में पढ़ता है।", "directions"),
        ("मंदिर", "Mandir", "Noun", "Temple", "मंदिर", "हे गणपतीचे मंदिर आहे.", "This is a Ganesha temple.", "यह गणपति का मंदिर है।", "directions"),
        ("रुग्णालय", "Rugnaalay", "Noun", "Hospital", "अस्पताल", "रुग्णालय कुठे आहे?", "Where is the hospital?", "अस्पताल कहाँ है?", "directions"),
        ("पोलीस चौकी", "Police chowky", "Noun", "Police outpost", "पुलिस चौकी", "जवळच पोलीस चौकी आहे.", "There is a police outpost nearby.", "पास ही में पुलिस चौकी है।", "directions"),
        ("पत्ता", "Patta", "Noun", "Address", "पता", "कृपया मला हा पत्ता सांगा.", "Please tell me this address.", "कृपया मुझे यह पता बताएं।", "directions"),
        ("कोपर", "Kopara", "Noun", "Corner", "कोना / नुक्कड़", "त्या कोपऱ्यात थांबा.", "Stop at that corner.", "उस कोने पर रुकें।", "directions"),
        ("दिशा", "Disha", "Noun", "Direction", "दिशा", "चुकीच्या दिशेने जाऊ नका.", "Do not go in the wrong direction.", "गलत दिशा में मत जाएं।", "directions"),
        ("पुढील", "Pudhil", "Adjective", "Next", "अगला / आगे का", "पुढील स्टेशन कोणते?", "Which is the next station?", "अगला स्टेशन कौन सा है?", "directions"),

        # NUMBERS & QUANTITY (30 words)
        ("एक", "Ek", "Number", "One", "एक", "मला एक चहा द्या.", "Give me one tea.", "मुझे एक चाय दें।", "numbers"),
        ("दोन", "Don", "Number", "Two", "दो", "दोन कॉफी द्या.", "Give two coffees.", "दो कॉफ़ी दें।", "numbers"),
        ("तीन", "Teen", "Number", "Three", "तीन", "तीन तिकीट हवेत.", "Need three tickets.", "तीन टिकट चाहिए।", "numbers"),
        ("चार", "Chaar", "Number", "Four", "चार", "चार वाजले आहेत.", "It is four o'clock.", "चार बजे हैं।", "numbers"),
        ("पाच", "Paach", "Number", "Five", "पांच", "पाच रुपये उरले.", "Five rupees left.", "पांच रुपये बचे।", "numbers"),
        ("सहा", "Saha", "Number", "Six", "छह", "सहा वाजता उठतो.", "Get up at six.", "छह बजे उठता हूँ।", "numbers"),
        ("सात", "Saat", "Number", "Seven", "सात", "आम्ही सात जण आहोत.", "We are seven people.", "हम सात लोग हैं।", "numbers"),
        ("आठ", "Aath", "Number", "Eight", "आठ", "आठ दिवस झाले.", "Eight days passed.", "आठ दिन हो गए।", "numbers"),
        ("नऊ", "Nau", "Number", "Nine", "नौ", "नऊ रुपये उरले.", "Nine rupees left.", "नौ रुपये बचे।", "numbers"),
        ("दहा", "Daha", "Number", "Ten", "दस", "दहा वाजले आहेत.", "It is ten o'clock.", "दस बजे हैं।", "numbers"),
        ("वीस", "Vees", "Number", "Twenty", "बीस", "वीस रुपये भाडे झाले.", "The fare is twenty rupees.", "किराया बीस रुपये हुआ।", "numbers"),
        ("तीस", "Tees", "Number", "Thirty", "तीस", "तीस मिनिटे लागतील.", "It will take thirty minutes.", "तीस मिनट लगेंगे।", "numbers"),
        ("चाळीस", "Chaalees", "Number", "Forty", "चालीस", "चाळीस रुपये घ्या.", "Take forty rupees.", "चालीस रुपये लें।", "numbers"),
        ("पन्नास", "Pannaas", "Number", "Fifty", "पचास", "पन्नास रुपये सुट्टे आहेत का?", "Do you have fifty rupees change?", "क्या आपके पास पचास रुपये छुट्टे हैं?", "numbers"),
        ("शंभर", "Shambhar", "Number", "One hundred", "सौ / एक सौ", "हे शंभर रुपये आहेत.", "These are one hundred rupees.", "यह सौ रुपये हैं।", "numbers"),
        ("हजार", "Hazaar", "Number", "One thousand", "हज़ार", "त्याची किंमत एक हजार आहे.", "Its price is one thousand.", "इसकी कीमत एक हज़ार है।", "numbers"),
        ("लाख", "Laakh", "Number", "One lakh (100,000)", "लाख", "ती गाडी एक लाखाची आहे.", "That car is of one lakh.", "वह गाड़ी एक लाख की है।", "numbers"),
        ("पहिले", "Pahile", "Adjective", "First", "पहला", "पहिले प्रकरण सोपे आहे.", "The first chapter is easy.", "पहला अध्याय आसान है।", "numbers"),
        ("दुसरे", "Dusare", "Adjective", "Second", "दूसरा", "दुसरे दुकान बंद आहे.", "The second shop is closed.", "दूसरी दुकान बंद है।", "numbers"),
        ("तिसरे", "Tisare", "Adjective", "Third", "तीसरा", "तिसरे घर माझे आहे.", "The third house is mine.", "तीसरा घर मेरा है।", "numbers"),
        ("खूप", "Khoop", "Adverb", "Very / A lot", "बहुत / ज्यादा", "तिथे खूप गर्दी होती.", "There was a lot of crowd there.", "वहाँ बहुत भीड़ थी।", "numbers"),
        ("कमी", "Kamee", "Adjective", "Less", "कम", "चहामध्ये साखर कमी आहे.", "Sugar is less in the tea.", "चाय में चीनी कम है।", "numbers"),
        ("जास्त", "Jaast", "Adjective", "More / Too much", "ज़्यादा / अधिक", "तिथे जास्त वेळ घालवू नका.", "Don't spend too much time there.", "वहाँ ज़्यादा समय मत बिताएं।", "numbers"),
        ("सुट्टे", "Sutte", "Noun", "Change (money)", "छुट्टे पैसे", "माझ्याकडे सुट्टे पैसे नाहीत.", "I don't have change.", "मेरे पास छुट्टे पैसे नहीं हैं।", "numbers"),
        ("किंमत", "Kimmat", "Noun", "Price / Cost", "कीमत", "याची किंमत काय आहे?", "What is the price of this?", "इसकी कीमत क्या है?", "numbers"),
        ("अर्धा", "Ardha", "Adjective", "Half", "आधा", "मला अर्धा ग्लास पाणी द्या.", "Give me half glass of water.", "मुझे आधा गिलास पानी दें।", "numbers"),
        ("पाऊण", "Paun", "Adjective", "Three-fourths", "पौना", "पाऊण तास झाला.", "Three-fourths of an hour has passed.", "पौना घंटा हो गया।", "numbers"),
        ("सव्वा", "Savva", "Adjective", "One and a quarter", "सवा", "सव्वा वाजले आहेत.", "It is 1:15.", "सवा बजा है।", "numbers"),
        ("दीड", "Deed", "Number", "One and a half", "डेढ़", "दीड वाजता जेवण करू.", "We will eat at 1:30.", "डेढ़ बजे खाना खाएंगे।", "numbers"),
        ("अडीच", "Adeech", "Number", "Two and a half", "ढाई", "अडीच वाजता बस सुटेल.", "The bus will leave at 2:30.", "ढाई बजे बस छूटेगी।", "numbers"),

        # SHOPPING & BARGAINING (25 words)
        ("खरेदी", "Kharedi", "Noun", "Shopping", "खरीददारी", "मी तुळशीबागेत खरेदी केली.", "I did shopping in Tulshibaug.", "मैंने तुळशीबाग में खरीददारी की।", "shopping"),
        ("किंमत", "Kimmat", "Noun", "Price", "दाम / कीमत", "या साडीची किंमत काय?", "What is the price of this saree?", "इस साड़ी की कीमत क्या है?", "shopping"),
        ("महाग", "Mahaag", "Adjective", "Expensive", "महंगा", "हे खूप महाग आहे.", "This is very expensive.", "यह बहुत महंगा है।", "shopping"),
        ("स्वस्त", "Svast", "Adjective", "Cheap / Inexpensive", "सस्ता", "हा बाजार स्वस्त आहे.", "This market is cheap.", "यह बाज़ार सस्ता है।", "shopping"),
        ("सवलत", "Savlat", "Noun", "Discount", "छूट", "काही सवलत मिळेल का?", "Will we get some discount?", "क्या कुछ छूट मिलेगी?", "shopping"),
        ("दर", "Dar", "Noun", "Rate", "भाव / दर", "सफरचंदाचा दर काय आहे?", "What is the rate of apples?", "सेब का क्या भाव है?", "shopping"),
        ("आवडणे", "Aavadne", "Verb", "To like", "पसंद आना", "मला हे आवडले.", "I liked this.", "मुझे यह पसंद आया।", "shopping"),
        ("पाहणे", "Pahane", "Verb", "To see / watch", "देखना", "मी कपडे पाहत आहे.", "I am looking at clothes.", "मैं कपड़े देख रहा हूँ।", "shopping"),
        ("देणे", "Dene", "Verb", "To give", "देना", "कृपया मला द्या.", "Please give me.", "कृपया मुझे दें।", "shopping"),
        ("घेणे", "Ghene", "Verb", "To take / buy", "लेना", "मी ही वस्तू घेतो.", "I will buy/take this item.", "मैं यह वस्तु लेता हूँ।", "shopping"),
        ("पिशवी", "Pishvi", "Noun", "Bag", "थैला / बैग", "माझ्याकडे प्लास्टिक पिशवी नाही.", "I do not have a plastic bag.", "मेरे पास प्लास्टिक थैला नहीं है।", "shopping"),
        ("रंग", "Rang", "Noun", "Color", "रंग", "मला दुसरा रंग दाखवा.", "Show me another color.", "मुझे दूसरा रंग दिखाएं।", "shopping"),
        ("दुकानदार", "Dukaandar", "Noun", "Shopkeeper", "दुकादार", "दुकानदार चांगला माणूस आहे.", "The shopkeeper is a good man.", "दुकानदार अच्छा आदमी है।", "shopping"),
        ("कपडे", "Kapade", "Noun", "Clothes", "कपड़े", "मी नवीन कपडे खरेदी केले.", "I bought new clothes.", "मैंने नए कपड़े खरीदे।", "shopping"),
        ("साडी", "Saadee", "Noun", "Saree (traditional garment)", "साड़ी", "पुणेरी साडी खूप सुंदर आहे.", "The Puneri saree is very beautiful.", "पुणेरी साड़ी बहुत सुंदर है।", "shopping"),
        ("माप", "Maap", "Noun", "Size / Measurement", "माप / साइज", "माझे माप एम (M) आहे.", "My size is M.", "मेरा साइज एम है।", "shopping"),
        ("बदलणे", "Badalne", "Verb", "To change / exchange", "बदलना", "मला हा शर्ट बदलायचा आहे.", "I want to exchange this shirt.", "मुझे यह शर्ट बदलना है।", "shopping"),
        ("आकार", "Aakaar", "Noun", "Shape / Size", "आकार", "याचा आकार मोठा आहे.", "Its size is big.", "इसका आकार बड़ा है।", "shopping"),
        ("काच", "Kaach", "Noun", "Glass", "कांच", "आरशाची काच तुटली.", "The mirror glass broke.", "आईने का कांच टूट गया।", "shopping"),
        ("दागिने", "Daagine", "Noun", "Jewelry / Ornaments", "गहने / जेवर", "सोन्याचे दागिने महाग असतात.", "Gold jewelry is expensive.", "सोने के गहने महंगे होते हैं।", "shopping"),
        ("विकत", "Vikat", "Noun", "Purchase", "खरीदना", "मी पुस्तक विकत घेतले.", "I purchased the book.", "मैंने किताब खरीदी।", "shopping"),
        ("विकणे", "Vikne", "Verb", "To sell", "बेचना", "तो फळे विकतो.", "He sells fruits.", "वह फल बेचता है।", "shopping"),
        ("ग्राहक", "Graahak", "Noun", "Customer", "ग्राहक", "दुकानात अनेक ग्राहक आहेत.", "There are many customers in the shop.", "दुकान में कई ग्राहक हैं।", "shopping"),
        ("पैसे", "Paise", "Noun", "Money / Coins", "पैसे / धन", "मी पैसे दिले.", "I gave the money.", "मैंने पैसे दे दिए।", "shopping"),
        ("उरलेले", "Uralele", "Noun", "Remaining / Balance", "बचे हुए", "हे घ्या उरलेले पैसे.", "Take the remaining money/change.", "ये लीजिए बचे हुए पैसे।", "shopping"),

        # FAMILY & PEOPLE (20 words)
        ("वडील", "Vadeel", "Noun", "Father", "पिता / पिताजी", "माझे वडील डॉक्टर आहेत.", "My father is a doctor.", "मेरे पिताजी डॉक्टर हैं।", "family"),
        ("आई", "Aai", "Noun", "Mother", "माँ / माताजी", "आई खूप गोड बोलते.", "Mother speaks very sweetly.", "माँ बहुत मीठा बोलती हैं।", "family"),
        ("भाऊ", "Bhaau", "Noun", "Brother", "भाई", "तो माझा मोठा भाऊ आहे.", "He is my elder brother.", "वह मेरा बड़ा भाई है।", "family"),
        ("बहीण", "Baheen", "Noun", "Sister", "बहन", "मला एक लहान बहीण आहे.", "I have a younger sister.", "मेरी एक छोटी बहन है।", "family"),
        ("मुलगा", "Mulga", "Noun", "Son / Boy", "बेटा / लड़का", "हा माझा मुलगा आहे.", "He is my son.", "यह मेरा बेटा है।", "family"),
        ("मुलगी", "Mulgee", "Noun", "Daughter / Girl", "बेटी / लड़की", "त्यांची मुलगी हुशार आहे.", "Their daughter is smart.", "उनकी बेटी होशियार है।", "family"),
        ("आजोबा", "Aajoba", "Noun", "Grandfather", "दादाजी / नानाजी", "आजोबा गोष्टी सांगतात.", "Grandfather tells stories.", "दादाजी कहानियाँ सुनाते हैं।", "family"),
        ("आजी", "Aajee", "Noun", "Grandmother", "दादीजी / नानीजी", "आजी छान जेवण बनवते.", "Grandmother cooks nice food.", "दादीजी अच्छा खाना बनाती हैं।", "family"),
        ("काका", "Kaaka", "Noun", "Uncle (paternal)", "चाचा", "काका शहरात राहतात.", "Uncle lives in the city.", "चाचा शहर में रहते हैं।", "family"),
        ("काकू", "Kaaku", "Noun", "Aunt (paternal)", "चाची", "काकू खूप प्रेमळ आहेत.", "Aunt is very affectionate.", "चाची बहुत स्नेही हैं।", "family"),
        ("मामा", "Maama", "Noun", "Uncle (maternal)", "मामा", "मी उन्हाळ्यात मामाच्या गावाला जातो.", "I go to maternal uncle's village in summer.", "मैं गर्मियों में मामा के गाँव जाता हूँ।", "family"),
        ("मामी", "Maamee", "Noun", "Aunt (maternal)", "मामी", "मामीने मला खेळणी दिली.", "Maternal aunt gave me toys.", "मामी ने मुझे खिलौने दिए।", "family"),
        ("ताई", "Taai", "Noun", "Elder sister", "दीदी / बड़ी बहन", "ताई गाणे गात आहे.", "Elder sister is singing.", "दीदी गाना गा रही हैं।", "family"),
        ("दादा", "Dada", "Noun", "Elder brother", "भैया / बड़ा भाई", "दादा बाजारात गेला.", "Elder brother went to the market.", "भैया बाज़ार गए हैं।", "family"),
        ("कुटुंब", "Kutumb", "Noun", "Family", "परिवार / कुटुंब", "आमचे कुटुंब मोठे आहे.", "Our family is big.", "हमारा परिवार बड़ा है।", "family"),
        ("लहान", "Lahaan", "Adjective", "Young / Small", "छोटा", "तो कुटुंबात लहान आहे.", "He is the youngest in the family.", "वह परिवार में छोटा है।", "family"),
        ("मोठा", "Motha", "Adjective", "Elder / Big", "बड़ा", "तो माझा मोठा भाऊ आहे.", "He is my elder brother.", "वह मेरा बड़ा भाई है।", "family"),
        ("माणूस", "Maanoos", "Noun", "Man / Person", "आदमी / इंसान", "तो खूप चांगला माणूस आहे.", "He is a very good man.", "वह बहुत अच्छा इंसान है।", "family"),
        ("स्त्री", "Stree", "Noun", "Woman", "महिला / स्त्री", "ती एक सुशिक्षित स्त्री आहे.", "She is an educated woman.", "वह एक शिक्षित महिला हैं।", "family"),
        ("मूल", "Mool", "Noun", "Child", "बच्चा", "मूल खेळत आहे.", "The child is playing.", "बच्चा खेल रहा है।", "family"),

        # TIME & CALENDAR (25 words)
        ("आज", "Aaj", "Noun", "Today", "आज", "आज सोमवार आहे.", "Today is Monday.", "आज सोमवार है।", "time"),
        ("उद्या", "Udya", "Noun", "Tomorrow", "कल (आने वाला)", "उद्या सुट्टी आहे.", "Tomorrow is a holiday.", "कल छुट्टी है।", "time"),
        ("काल", "Kaal", "Noun", "Yesterday", "कल (बीता हुआ)", "काल खूप पाऊस पडला.", "It rained heavily yesterday.", "कल बहुत बारिश हुई।", "time"),
        ("आता", "Aata", "Adverb", "Now", "अब / अभी", "आता आपण निघूया.", "Let us leave now.", "अब हम निकलते हैं।", "time"),
        ("नंतर", "Nantar", "Adverb", "Later", "बाद में", "मी नंतर फोन करेन.", "I will call later.", "मैं बाद में फोन करूँगा।", "time"),
        ("सकाळी", "Sakaali", "Adverb", "In the morning", "सुबह", "मी सकाळी लवकर उठतो.", "I get up early in the morning.", "मैं सुबह जल्दी उठता हूँ।", "time"),
        ("दुपारी", "Dupaari", "Adverb", "In the afternoon", "दोपहर", "दुपारी ऊन खूप असते.", "In the afternoon, the sun is very strong.", "दोपहर में धूप बहुत होती है।", "time"),
        ("संध्याकाळी", "Sandhyaakaali", "Adverb", "In the evening", "शाम", "आम्ही संध्याकाळी बागेत जातो.", "We go to the park in the evening.", "हम शाम को पार्क जाते हैं।", "time"),
        ("रात्री", "Raatri", "Adverb", "At night", "रात", "रात्री लवकर झोपावे.", "Sleep early at night.", "रात को जल्दी सोना चाहिए।", "time"),
        ("दिवस", "Divas", "Noun", "Day", "दिन", "आजचा दिवस खूप छान होता.", "Today was a very nice day.", "आज का दिन बहुत अच्छा था।", "time"),
        ("तास", "Taas", "Noun", "Hour", "घंटा", "प्रवासात दोन तास लागले.", "It took two hours in travel.", "यात्रा में दो घंटे लगे।", "time"),
        ("मिनिट", "Minit", "Noun", "Minute", "मिनट", "पाच मिनिटात येतो.", "Coming in five minutes.", "पांच मिनट में आता हूँ।", "time"),
        ("आठवडा", "Aathavada", "Noun", "Week", "सप्ताह / हफ्ता", "या आठवड्यात परीक्षा आहे.", "The exam is this week.", "इस हफ्ते परीक्षा है।", "time"),
        ("महिना", "Mahina", "Noun", "Month", "महीना", "हा मे महिना आहे.", "This is the month of May.", "यह मई का महीना है।", "time"),
        ("वर्ष", "Varsha", "Noun", "Year", "वर्ष / साल", "नवीन वर्षाच्या हार्दिक शुभेच्छा!", "Happy New Year!", "नए साल की हार्दिक शुभकामनाएं!", "time"),
        ("रविवार", "Ravivaar", "Noun", "Sunday", "रविवार", "रविवार हा सुट्टीचा दिवस आहे.", "Sunday is a holiday.", "रविवार छुट्टी का दिन है।", "time"),
        ("सोमवार", "Somvaar", "Noun", "Monday", "सोमवार", "सोमवारपासून काम सुरू होईल.", "Work will start from Monday.", "सोमवार से काम शुरू होगा।", "time"),
        ("मंगळवार", "Mangalvaar", "Noun", "Tuesday", "मंगलवार", "मंगळवारी मी देवळात जातो.", "I go to the temple on Tuesday.", "मंगलवार को मैं मंदिर जाता हूँ।", "time"),
        ("बुधवार", "Budhvaar", "Noun", "Wednesday", "बुधवार", "बुधवारी आमची सभा आहे.", "Our meeting is on Wednesday.", "बुधवार को हमारी बैठक है।", "time"),
        ("गुरुवार", "Guruvaar", "Noun", "Thursday", "गुरुवार", "गुरुवारी पूजा असते.", "There is puja on Thursday.", "गुरुवार को पूजा होती है।", "time"),
        ("शुक्रवार", "Shukravaar", "Noun", "Friday", "शुक्रवार", "शुक्रवारी मी गावाला जाईन.", "I will go to village on Friday.", "शुक्रवार को मैं गाँव जाऊँगा।", "time"),
        ("शनिवार", "Shanivaar", "Noun", "Saturday", "शनिवार", "शनिवारी शनिवार वाड्याला जाऊ.", "We will go to Shaniwar Wada on Saturday.", "शनिवार को शनिवार वाडा जाएंगे।", "time"),
        ("परवा", "Parva", "Noun", "Day after tomorrow / Day before yesterday", "परसों", "परवा सुट्टी आहे.", "There is a holiday day after tomorrow.", "परसों छुट्टी है।", "time"),
        ("उशीर", "Usheer", "Noun", "Late / Delay", "देर", "मला यायला उशीर झाला.", "I got late in coming.", "मुझे आने में देर हो गई।", "time"),
        ("लवकर", "Lavakar", "Adverb", "Early / Quickly", "जल्दी", "लवकर काम संपवा.", "Finish the work quickly.", "जल्दी काम ख़त्म करो।", "time"),

        # COMMON VERBS & ACTIONS (30 words)
        ("बोलणे", "Bolne", "Verb", "To speak / talk", "बोलना", "मराठीत बोलणे सोपे आहे.", "Speaking in Marathi is easy.", "मराठी में बोलना आसान है।", "verbs"),
        ("शिकणे", "Shikne", "Verb", "To learn", "सीखना", "मी मराठी शिकत आहे.", "I am learning Marathi.", "मैं मराठी सीख रहा हूँ।", "verbs"),
        ("जाणे", "Jane", "Verb", "To go", "जाना", "तो मुंबईला चालला आहे.", "He is going to Mumbai.", "वह मुंबई जा रहा है।", "verbs"),
        ("येणे", "Yene", "Verb", "To come", "आना", "कृपया आत या.", "Please come inside.", "कृपया अंदर आइए।", "verbs"),
        ("करणे", "Karne", "Verb", "To do", "करना", "अभ्यास करा.", "Do study.", "पढ़ाई करो।", "verbs"),
        ("वाचणे", "Vaachne", "Verb", "To read", "पढ़ना", "मी पुस्तक वाचतो.", "I read a book.", "मैं किताब पढ़ता हूँ।", "verbs"),
        ("लिहिणे", "Lihine", "Verb", "To write", "लिखना", "तो पत्र लिहितो.", "He writes a letter.", "वह पत्र लिखता है।", "verbs"),
        ("बसणे", "Basne", "Verb", "To sit", "बैठना", "खुर्चीवर बसा.", "Sit on the chair.", "कुर्सी पर बैठिए।", "verbs"),
        ("झोपणे", "Zopne", "Verb", "To sleep", "सोना", "बाळ झोपले आहे.", "The baby is sleeping.", "बच्चा सो रहा है।", "verbs"),
        ("पळणे", "Palne", "Verb", "To run", "दौड़ना", "तो वेगाने पळतो.", "He runs fast.", "वह तेज दौड़ता है।", "verbs"),
        ("चालणे", "Chaalne", "Verb", "To walk", "चलना", "मी बागेत चालतो.", "I walk in the garden.", "मैं बगीचे में चलता हूँ।", "verbs"),
        ("हसणे", "Hasne", "Verb", "To laugh", "हँसना", "ती नेहमी हसते.", "She always laughs.", "वह हमेशा हँसती है।", "verbs"),
        ("रडणे", "Radne", "Verb", "To cry", "रोना", "लहान मूल रडत आहे.", "The small child is crying.", "छोटा बच्चा रो रहा है।", "verbs"),
        ("विचारणे", "Vicharne", "Verb", "To ask", "पूछना", "शिक्षक प्रश्न विचारतात.", "The teacher asks a question.", "शिक्षक सवाल पूछते हैं।", "verbs"),
        ("सांगणे", "Saangne", "Verb", "To tell / say", "बताना", "गोष्ट सांगा.", "Tell a story.", "कहानी बताओ।", "verbs"),
        ("समजणे", "Samajne", "Verb", "To understand", "समझना", "मला समजले.", "I understood.", "मैं समझ गया।", "verbs"),
        ("आववणे", "Aavadne", "Verb", "To like", "पसंद करना", "मला आंबे आवडतात.", "I like mangoes.", "मुझे आम पसंद हैं।", "verbs"),
        ("हवे", "Have", "Verb", "To want", "चाहिए", "मला पाणी हवे.", "I want water.", "मुझे पानी चाहिए।", "verbs"),
        ("भेटणे", "Bhetne", "Verb", "To meet", "मिलना", "आपण उद्या भेटू.", "We will meet tomorrow.", "हम कल मिलेंगे।", "verbs"),
        ("पाहणे", "Pahane", "Verb", "To look / see", "देखना", "तो चित्र पाहत आहे.", "He is looking at the picture.", "वह चित्र देख रहा है।", "verbs"),
        ("ऐकणे", "Aikne", "Verb", "To listen / hear", "सुनना", "गाणे ऐका.", "Listen to the song.", "गाना सुनो।", "verbs"),
        ("खेळणे", "Khelne", "Verb", "To play", "खेलना", "मुले खेळत आहेत.", "Children are playing.", "बच्चे खेल रहे हैं।", "verbs"),
        ("बोलवणे", "Bolavne", "Verb", "To call / invite", "बुलाना", "त्याला आत बोलवा.", "Call him inside.", "उसे अंदर बुलाओ।", "verbs"),
        ("थांबणे", "Thambne", "Verb", "To stop / wait", "रुकना", "बस इथे थांबली.", "The bus stopped here.", "बस यहाँ रुकी।", "verbs"),
        ("चालवणे", "Chaalavne", "Verb", "To drive / run", "चलाना", "तो गाडी चालवतो.", "He drives a car.", "वह गाड़ी चलाता है।", "verbs"),
        ("खरेदी करणे", "Kharedi karne", "Verb", "To buy", "खरीदना", "मी पुस्तक खरेदी केले.", "I bought a book.", "मैंने किताब खरीदी।", "verbs"),
        ("विकणे", "Vikne", "Verb", "To sell", "बेचना", "तो फुले विकत आहे.", "He is selling flowers.", "वह फूल बेच रहा है।", "verbs"),
        ("तपासणे", "Tapasne", "Verb", "To check / examine", "जाँचना", "डॉक्टर तपासत आहेत.", "The doctor is checking.", "डॉक्टर जाँच कर रहे हैं।", "verbs"),
        ("भरणे", "Bharne", "Verb", "To pay / fill", "भरना", "मी बिल भरले.", "I paid the bill.", "मैंने बिल भर दिया।", "verbs"),

        # ADJECTIVES (25 words)
        ("चांगले", "Chaangle", "Adjective", "Good", "अच्छा", "ते एक चांगले पुस्तक आहे.", "That is a good book.", "वह एक अच्छी किताब है।", "adjectives"),
        ("वाईट", "Vaait", "Adjective", "Bad", "बुरा", "वाईट सवयी सोडा.", "Leave bad habits.", "बुरी आदतें छोड़ो।", "adjectives"),
        ("सुंदर", "Sundar", "Adjective", "Beautiful", "सुंदर", "ती बाग खूप सुंदर आहे.", "That garden is very beautiful.", "वह बगीचा बहुत सुंदर है।", "adjectives"),
        ("मोठे", "Mothe", "Adjective", "Big", "बड़ा", "हे घर खूप मोठे आहे.", "This house is very big.", "यह घर बहुत बड़ा है।", "adjectives"),
        ("लहान", "Lahaan", "Adjective", "Small / Young", "छोटा", "ते लहान मूल आहे.", "That is a small child.", "वह छोटा बच्चा है।", "adjectives"),
        ("नवीन", "Naveen", "Adjective", "New", "नया", "माझा नवीन मोबाईल आहे.", "This is my new mobile.", "मेरा नया मोबाइल है।", "adjectives"),
        ("जुने", "June", "Adjective", "Old", "पुराना", "हे जुने घर आहे.", "This is an old house.", "यह पुराना घर है।", "adjectives"),
        ("गरम", "Garam", "Adjective", "Hot", "गर्म", "मला गरम चहा हवा आहे.", "I want hot tea.", "मुझे गर्म चाय चाहिए।", "adjectives"),
        ("थंड", "Thand", "Adjective", "Cold", "ठंडा", "पाणी थंड आहे.", "The water is cold.", "पानी ठंडा है।", "adjectives"),
        ("कठीण", "Katheen", "Adjective", "Difficult / Hard", "कठिन / मुश्किल", "हा प्रश्न कठीण आहे.", "This question is difficult.", "यह सवाल मुश्किल है।", "adjectives"),
        ("सोपे", "Sope", "Adjective", "Easy", "आसान / सरल", "मराठी सोपी भाषा आहे.", "Marathi is an easy language.", "मराठी आसान भाषा है।", "adjectives"),
        ("महाग", "Mahaag", "Adjective", "Expensive", "महंगा", "हे सोने महाग आहे.", "This gold is expensive.", "यह सोना महंगा है।", "adjectives"),
        ("स्वस्त", "Svast", "Adjective", "Cheap", "सस्ता", "बाजारात भाज्या स्वस्त आहेत.", "Vegetables are cheap in the market.", "बाज़ार में सब्ज़ियाँ सस्ती हैं।", "adjectives"),
        ("स्वच्छ", "Svachh", "Adjective", "Clean", "साफ / स्वच्छ", "घर स्वच्छ ठेवा.", "Keep the house clean.", "घर साफ रखो।", "adjectives"),
        ("घाणेरडे", "Ghaanerde", "Adjective", "Dirty", "गंदा", "हे पाणी घाणेरडे आहे.", "This water is dirty.", "यह पानी गंदा है।", "adjectives"),
        ("आनंदी", "Aanandee", "Adjective", "Happy", "खुश / प्रसन्न", "आज मी खूप आनंदी आहे.", "Today I am very happy.", "आज मैं बहुत खुश हूँ।", "adjectives"),
        ("दुःखी", "Dukhee", "Adjective", "Sad", "दुखी", "तो दुःखी का आहे?", "Why is he sad?", "वह दुखी क्यों है?", "adjectives"),
        ("श्रीमंत", "Shreemant", "Adjective", "Rich", "अमीर", "तो श्रीमंत व्यापारी आहे.", "He is a rich businessman.", "वह अमीर व्यापारी है।", "adjectives"),
        ("गरीब", "Gareeb", "Adjective", "Poor", "गरीब", "त्या गरीब माणसाला मदत करा.", "Help that poor man.", "उस गरीब आदमी की मदद करो।", "adjectives"),
        ("हुशार", "Hushaar", "Adjective", "Smart / Intelligent", "होशियार / बुद्धिमान", "मुलगा खूप हुशार आहे.", "The boy is very smart.", "लड़का बहुत होशियार है।", "adjectives"),
        ("उंच", "Unch", "Adjective", "Tall / High", "ऊँचा / लंबा", "तो डोंगर खूप उंच आहे.", "That mountain is very high.", "वह पहाड़ बहुत ऊँचा है।", "adjectives"),
        ("लांब", "Laamb", "Adjective", "Long / Far", "लंबा / दूर", "नदी खूप लांब आहे.", "The river is very long.", "नदी बहुत लंबी है।", "adjectives"),
        ("कडू", "Kadu", "Adjective", "Bitter", "कड़वा", "कारले कडू असते.", "Bitter gourd is bitter.", "करेला कड़वा होता है।", "adjectives"),
        ("गोड", "God", "Adjective", "Sweet", "मीठा", "हा आंबा गोड आहे.", "This mango is sweet.", "यह आम मीठा है।", "adjectives"),
        ("पिकलेला", "Pikelela", "Adjective", "Ripe", "पका हुआ", "पिकलेला आंबा चवदार असतो.", "Ripe mango is tasty.", "पका हुआ आम स्वादिष्ट होता है।", "adjectives"),

        # EMERGENCY & MEDICAL (20 words)
        ("मदत", "Madat", "Noun", "Help", "मदद / सहायता", "कृपया मला मदत करा.", "Please help me.", "कृपया मेरी मदद करें।", "emergency"),
        ("वाचवा", "Vaachva", "Verb", "Save / Help", "बचाओ", "वाचवा! वाचवा!", "Help! Save me!", "बचाओ! बचाओ!", "emergency"),
        ("पोलीस", "Police", "Noun", "Police", "पुलिस", "पोलीस स्टेशन कुठे आहे?", "Where is the police station?", "पुलिस स्टेशन कहाँ है?", "emergency"),
        ("चोर", "Chor", "Noun", "Thief", "चोर", "चोर पळून गेला.", "The thief ran away.", "चोर भाग गया।", "emergency"),
        ("आग", "Aag", "Noun", "Fire", "आग", "इथे आग लागली आहे!", "There is a fire here!", "यहाँ आग लगी है!", "emergency"),
        ("अपघात", "Apghaat", "Noun", "Accident", "दुर्घटना / हादसा", "तिथे मोठा अपघात झाला.", "A big accident occurred there.", "वहाँ बड़ी दुर्घटना हुई।", "emergency"),
        ("आजारी", "Aajaaree", "Adjective", "Sick / Ill", "बीमार", "मी आज आजारी आहे.", "I am sick today.", "मैं आज बीमार हूँ।", "emergency"),
        ("डॉक्टर", "Doctor", "Noun", "Doctor", "डॉक्टर / चिकित्सक", "डॉक्टर रुग्णाला तपासत आहेत.", "The doctor is checking the patient.", "डॉक्टर मरीज की जाँच कर रहे हैं।", "emergency"),
        ("औषध", "Aushadh", "Noun", "Medicine", "दवा / औषधि", "हे औषध वेळेवर घ्या.", "Take this medicine on time.", "यह दवा समय पर लें।", "emergency"),
        ("रुग्णवाहिका", "Rugnavaahika", "Noun", "Ambulance", "एम्बुलेंस / रोगीवाहन", "लवकर रुग्णवाहिका बोलवा.", "Call the ambulance quickly.", "जल्दी एम्बुलेंस बुलाओ।", "emergency"),
        ("वेदना", "Vedna", "Noun", "Pain", "दर्द / वेदना", "माझ्या पोटात वेदना होत आहेत.", "I have pain in my stomach.", "मेरे पेट में दर्द हो रहा है।", "emergency"),
        ("धोका", "Dhoka", "Noun", "Danger", "खतरा / धोखा", "इथे जाणे धोकादायक आहे.", "Going here is dangerous.", "यहाँ जाना खतरनाक है।", "emergency"),
        ("हरवले", "Haravle", "Verb", "Lost", "खो गया", "माझा मोबाईल हरवला.", "My mobile is lost.", "मेरा मोबाइल खो गया।", "emergency"),
        ("सुरक्षित", "Surakshit", "Adjective", "Safe", "सुरक्षित", "आता आपण सुरक्षित आहोत.", "We are safe now.", "अब हम सुरक्षित हैं।", "emergency"),
        ("ताप", "Taap", "Noun", "Fever", "बुखार", "त्याला खूप ताप आला आहे.", "He has a high fever.", "उसे बहुत तेज बुखार है।", "emergency"),
        ("खोकला", "Khokla", "Noun", "Cough", "खांसी", "मला खोकला झाला आहे.", "I have a cough.", "मुझे खांसी हुई है।", "emergency"),
        ("रक्त", "Rakta", "Noun", "Blood", "खून / रक्त", "रक्ताची गरज आहे.", "Blood is needed.", "खून की जरूरत है।", "emergency"),
        ("विष", "Vish", "Noun", "Poison", "जहर", "ते विष आहे, स्पर्श करू नका.", "That is poison, do not touch.", "वह जहर है, छुओ मत।", "emergency"),
        ("प्रथम उपचार", "Pratham upchaar", "Noun", "First aid", "प्राथमिक उपचार", "प्रथम उपचार पेटी कुठे आहे?", "Where is the first aid box?", "प्राथमिक उपचार पेटी कहाँ है?", "emergency"),
        ("रुग्ण", "Rugna", "Noun", "Patient", "मरीज", "रुग्णाला आराम करू द्या.", "Let the patient rest.", "मरीज को आराम करने दें।", "emergency"),

        # COLORS (12 words)
        ("लाल", "Laal", "Noun", "Red", "लाल", "तिने लाल साडी नेसली आहे.", "She has worn a red saree.", "उसने लाल साड़ी पहनी है।", "colors"),
        ("निळा", "Nila", "Noun", "Blue", "नीला", "आकाश निळे आहे.", "The sky is blue.", "आकाश नीला है।", "colors"),
        ("पिवळा", "Pivla", "Noun", "Yellow", "पीला", "केळे पिवळे असते.", "Banana is yellow.", "केला पीला होता है।", "colors"),
        ("हिरवा", "Hirva", "Noun", "Green", "हरा", "झाडांची पाने हिरवी आहेत.", "The tree leaves are green.", "पेड़ के पत्ते हरे हैं।", "colors"),
        ("पांढरा", "Paandhra", "Noun", "White", "सफेद", "दूध पांढरे असते.", "Milk is white.", "दूध सफेद होता है।", "colors"),
        ("काळा", "Kaala", "Noun", "Black", "काला", "त्याचे के काळे आहेत.", "His hair is black.", "उसके बाल काले हैं।", "colors"),
        ("केशर", "Keshar", "Noun", "Saffron", "केसरिया", "ध्वजात केशर रंग वर असतो.", "Saffron color is at the top of the flag.", "ध्वज में केसरिया रंग ऊपर होता है।", "colors"),
        ("नारंगी", "Naarangee", "Noun", "Orange", "नारंगी", "संतरे नारंगी रंगाचे असते.", "Orange is of orange color.", "संतरा नारंगी रंग का होता है।", "colors"),
        ("गुलाबी", "Gulaabee", "Noun", "Pink", "गुलाबी", "तिला गुलाबी रंग आवडतो.", "She likes pink color.", "उसे गुलाबी रंग पसंद है।", "colors"),
        ("जांभळा", "Jaambhla", "Noun", "Purple", "बैंगनी", "वांग्याचा रंग जांभळा असतो.", "Eggplant color is purple.", "बैंगन का रंग बैंगनी होता है।", "colors"),
        ("तांबडा", "Taambada", "Noun", "Reddish / Copper", "तांबा रंग", "तांबडी माती शेतीसाठी चांगली असते.", "Red soil is good for farming.", "लाल मिट्टी खेती के लिए अच्छी होती है।", "colors"),
        ("रंगीत", "Rangeet", "Adjective", "Colorful", "रंगीन", "ही चित्रे रंगीत आहेत.", "These pictures are colorful.", "ये चित्र रंगीन हैं।", "colors"),

        # ANIMALS & NATURE (20 words)
        ("कुत्रा", "Kutra", "Noun", "Dog", "कुत्ता", "कुत्रा घराचे रक्षण करतो.", "The dog guards the house.", "कुत्ता घर की रखवाली करता है।", "animals_nature"),
        ("मांजर", "Maanjar", "Noun", "Cat", "बिल्ली", "मांजर दूध पीत आहे.", "The cat is drinking milk.", "बिल्ली दूध पी रही है।", "animals_nature"),
        ("गाय", "Gaay", "Noun", "Cow", "गाय", "गाय दूध देते.", "The cow gives milk.", "गाय दूध देती है।", "animals_nature"),
        ("घोडा", "Ghoda", "Noun", "Horse", "घोड़ा", "घोडा वेगाने धावतो.", "The horse runs fast.", "घोड़ा तेज दौड़ता है।", "animals_nature"),
        ("हत्ती", "Hattee", "Noun", "Elephant", "हाथी", "हत्ती मोठा प्राणी आहे.", "Elephant is a big animal.", "हाथी बड़ा जानवर है।", "animals_nature"),
        ("सिंह", "Simha", "Noun", "Lion", "शेर (सिंह)", "सिंह जंगलाचा राजा आहे.", "The lion is the king of the jungle.", "शेर jungle का राजा है।", "animals_nature"),
        ("वाघ", "Waagh", "Noun", "Tiger", "बाघ", "वाघ हा भारताचा राष्ट्रीय प्राणी आहे.", "Tiger is the national animal of India.", "बाघ भारत का राष्ट्रीय पशु है।", "animals_nature"),
        ("पक्षी", "Pakshee", "Noun", "Bird", "पक्षी", "पक्षी आकाशात उडतात.", "Birds fly in the sky.", "पक्षी आसमान में उड़ते हैं।", "animals_nature"),
        ("झाड", "Zhaad", "Noun", "Tree", "पेड़", "ते आंब्याचे झाड आहे.", "That is a mango tree.", "वह आम का पेड़ है।", "animals_nature"),
        ("फूल", "Phool", "Noun", "Flower", "फूल", "गुलाब सुंदर फूल आहे.", "Rose is a beautiful flower.", "गुलाब सुंदर फूल है।", "animals_nature"),
        ("पाऊस", "Paaus", "Noun", "Rain", "बारिश / वर्षा", "आज पाऊस पडेल का?", "Will it rain today?", "क्या आज बारिश होगी?", "animals_nature"),
        ("नदी", "Nadee", "Noun", "River", "नदी", "गंगा भारताची पवित्र नदी आहे.", "Ganga is a holy river of India.", "गंगा भारत की पवित्र नदी है।", "animals_nature"),
        ("समुद्र", "Samudra", "Noun", "Sea / Ocean", "समुद्र", "मुंबई समुद्राजवळ आहे.", "Mumbai is near the sea.", "मुंबई समुद्र के पास है।", "animals_nature"),
        ("पर्वत", "Parvat", "Noun", "Mountain", "पर्वत / पहाड़", "हिमालय उंच पर्वत आहे.", "Himalayas is a high mountain.", "हिमालय ऊँचा पर्वत है।", "animals_nature"),
        ("वारा", "Vaara", "Noun", "Wind / Air", "हवा / पवन", "थंड वारा सुटला आहे.", "Cold wind is blowing.", "ठंडी हवा चल रही है।", "animals_nature"),
        ("सूर्य", "Surya", "Noun", "Sun", "सूर्य", "सूर्य पूर्वेला उगवतो.", "The sun rises in the east.", "सूर्य पूर्व में उगता है।", "animals_nature"),
        ("चंद्र", "Chandra", "Noun", "Moon", "चाँद / चंद्रमा", "रात्री चंद्र चमकतो.", "The moon shines at night.", "रात में चाँद चमकता है।", "animals_nature"),
        ("तारा", "Taara", "Noun", "Star", "तारा", "आकाशात तारे आहेत.", "There are stars in the sky.", "आसमान में तारे हैं।", "animals_nature"),
        ("पान", "Paan", "Noun", "Leaf", "पत्ता", "झाडाचे पान पडले.", "The tree leaf fell.", "पेड़ का पत्ता गिर गया।", "animals_nature"),
        ("माती", "Maatee", "Noun", "Soil", "मिट्टी", "मातीचा सुवास छान येतो.", "The smell of soil is nice.", "मिट्टी की खुशबू अच्छी होती है।", "animals_nature"),

        # HOUSEHOLD & OBJECTS (20 words)
        ("दरवाजा", "Darvaaja", "Noun", "Door", "दरवाजा", "कृपया दरवाजा बंद करा.", "Please close the door.", "कृपया दरवाजा बंद करें।", "household"),
        ("खिडकी", "Khidkee", "Noun", "Window", "खिड़की", "खिडकी उघडा.", "Open the window.", "खिड़की खोलें।", "household"),
        ("टेबल", "Table", "Noun", "Table", "मेज / टेबल", "पुस्तके टेबलवर आहेत.", "Books are on the table.", "किताबें टेबल पर हैं।", "household"),
        ("खुर्ची", "Khurchi", "Noun", "Chair", "कुर्सी", "खुर्चीवर बसा.", "Sit on the chair.", "कुर्सी पर बैठें।", "household"),
        ("बिछाना", "Bichaana", "Noun", "Bed / Bedding", "बिस्तर", "बिछाना तयार आहे.", "The bed is ready.", "बिस्तर तैयार है।", "household"),
        ("पंखा", "Pankha", "Noun", "Fan", "पंखा", "पंखा चालू करा.", "Turn on the fan.", "पंखा चालू करें।", "household"),
        ("दिवा", "Diva", "Noun", "Lamp / Light", "दिया / बत्ती", "दिवा लावा.", "Light the lamp.", "दिया जलाएं।", "household"),
        ("कुलूप", "Kuloop", "Noun", "Lock", "ताला", "दरवाजाला कुलूप लावा.", "Put a lock on the door.", "दरवाजे पर ताला लगाएं।", "household"),
        ("किल्ली", "Killee", "Noun", "Key", "चाबी", "कुलूपाची किल्ली कुठे आहे?", "Where is the lock key?", "ताले की चाबी कहाँ है?", "household"),
        ("आरसा", "Aarasa", "Noun", "Mirror", "शीशा / दर्पण", "तो आरशात पाहत आहे.", "He is looking in the mirror.", "वह आईने में देख रहा है।", "household"),
        ("मोबाईल", "Mobile", "Noun", "Mobile phone", "मोबाइल", "माझा मोबाईल वाजत आहे.", "My mobile is ringing.", "मेरा मोबाइल बज रहा है।", "household"),
        ("पुस्तक", "Pustak", "Noun", "Book", "किताब / पुस्तक", "हे माझे आवडीचे पुस्तक आहे.", "This is my favorite book.", "यह मेरी पसंदीदा किताब है।", "household"),
        ("पेन", "Pen", "Noun", "Pen", "पेन / कलम", "मला एक पेन द्या.", "Give me a pen.", "मुझे एक पेन दें।", "household"),
        ("कप", "Cup", "Noun", "Cup", "कप", "कपात चहा आहे.", "There is tea in the cup.", "कप में चाय है।", "household"),
        ("बादली", "Baadlee", "Noun", "Bucket", "बाल्टी", "बादलीत पाणी भरा.", "Fill water in the bucket.", "बाल्टी में पानी भरें।", "household"),
        ("झाडू", "Zhaadoo", "Noun", "Broom", "झाड़ू", "झाडूने घर स्वच्छ करा.", "Clean the house with a broom.", "झाड़ू से घर साफ करें।", "household"),
        ("चटई", "Chatai", "Noun", "Mat", "चटाई", "चटईवर बसा.", "Sit on the mat.", "चटाई पर बैठें।", "household"),
        ("कात्री", "Kaatree", "Noun", "Scissors", "कैंची", "कात्रीने कागद कापा.", "Cut the paper with scissors.", "कैंची से कागज काटें।", "household"),
        ("छत्री", "Chhatree", "Noun", "Umbrella", "छाता / छतरी", "पावसात छत्री वापरा.", "Use an umbrella in the rain.", "बारिश में छाते का इस्तेमाल करें।", "household"),
        ("कपाट", "Kapaat", "Noun", "Cupboard", "अलमारी", "कपडे कपाटात ठेवा.", "Keep clothes in the cupboard.", "कपड़े अलमारी में रखें।", "household")
    ]

    for item in words_src:
        word, transliteration, partOfSpeech, englishMeaning, hindiMeaning, exampleMarathi, exampleEnglish, exampleHindi, category = item
        dictionary_list.append({
            "word": word,
            "transliteration": transliteration,
            "partOfSpeech": partOfSpeech,
            "englishMeaning": englishMeaning,
            "hindiMeaning": hindiMeaning,
            "exampleMarathi": exampleMarathi,
            "exampleEnglish": exampleEnglish,
            "exampleHindi": exampleHindi,
            "category": category
        })

    # Validate size:
    print("Seeding Dictionary database size: {} words".format(len(dictionary_list)))

    # -------------------------------------------------------------
    # 4. GENERATE CONVERSATIONS DATA (6 complete Pune Chapters)
    # -------------------------------------------------------------
    conversations_data = {
      # CHAPTER 1: Welcome to Pune (Rickshaw negotiation)
      "pune_taxi_start": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "नमस्कार साहेब! शनिवार वाड्याला जायचे आहे का? (Hello sir! Do you want to go to Shaniwar Wada?)",
        "npcAudioText": "नमस्कार साहेब! शनिवार वाड्याला जायचे आहे का?",
        "options": [
          {
            "text": "हो दादा, किती भाडे होईल? (Yes brother, how much fare will it be?)",
            "nextId": "pune_taxi_fare",
            "reputationImpact": 10
          },
          {
            "text": "हो, शनिवार वाडा चल. (Yes, go to Shaniwar Wada.)",
            "nextId": "pune_taxi_rude",
            "reputationImpact": -5
          },
          {
            "text": "नाही, मला गरवारे कॉलेजला जायचे आहे. (No, I want to go to Garware College.)",
            "nextId": "pune_taxi_alternate",
            "reputationImpact": 5
          }
        ]
      },
      "pune_taxi_rude": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "साहेब, जरा आदराने बोला. आम्ही पण माणसं आहोत. (Sir, speak with respect. We are also humans.)",
        "npcAudioText": "साहेब, जरा आदराने बोला. आम्ही पण माणसं आहोत.",
        "options": [
          {
            "text": "माफ करा दादा, शनिवार वाड्याचे भाडे किती? (Sorry brother, how much fare to Shaniwar Wada?)",
            "nextId": "pune_taxi_fare",
            "reputationImpact": 10
          },
          {
            "text": "भाडे मीटरनेच घेणार ना? (You will charge by the meter, right?)",
            "nextId": "pune_taxi_meter",
            "reputationImpact": 5
          },
          {
            "text": "नको मग, मी दुसरी रिक्षा पाहतो. (Then I don't want, I will look for another rickshaw.)",
            "nextId": "pune_taxi_exit",
            "reputationImpact": -10
          }
        ]
      },
      "pune_taxi_alternate": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "तिथले ऐंशी रुपये होतील साहेब. बसायचे का? (That will be eighty rupees sir. Want to sit?)",
        "npcAudioText": "तिथले ऐंशी रुपये होतील साहेब. बसायचे का?",
        "options": [
          {
            "text": "हो दादा, चला. (Yes brother, let's go.)",
            "nextId": "pune_taxi_success",
            "reputationImpact": 10
          },
          {
            "text": "ऐंशी रुपये खूप जास्त आहेत, सत्तर रुपये घ्या. (Eighty rupees is too much, take seventy.)",
            "nextId": "pune_taxi_bargain",
            "reputationImpact": 5
          },
          {
            "text": "नको दादा, मीटरने चला. (No brother, go by the meter.)",
            "nextId": "pune_taxi_meter",
            "reputationImpact": 10
          }
        ]
      },
      "pune_taxi_fare": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "पन्नास रुपये होतील साहेब. मीटरनेच आहे. चला, बसा. (Fifty rupees it will be sir. It is by the meter. Come, sit.)",
        "npcAudioText": "पन्नास रुपये होतील साहेब. मीटरनेच आहे. चला, बसा.",
        "options": [
          {
            "text": "ठीक आहे दादा, धन्यवाद, चला. (Okay brother, thank you, let's go.)",
            "nextId": "pune_taxi_success",
            "reputationImpact": 10
          },
          {
            "text": "चाळीस रुपये द्या ना, रोजचे आहे आमचे. (Give for forty rupees please, it is our daily route.)",
            "nextId": "pune_taxi_bargain",
            "reputationImpact": 5
          },
          {
            "text": "माझ्याकडे शंभर रुपयांची नोट आहे, सुट्टे आहेत का? (I have a hundred rupee note, do you have change?)",
            "nextId": "pune_taxi_change",
            "reputationImpact": 10
          }
        ]
      },
      "pune_taxi_meter": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "हो साहेब, मीटर प्रमाणेच घेऊ. चला बसा. (Yes sir, we will take by the meter. Come sit.)",
        "npcAudioText": "हो साहेब, मीटर प्रमाणेच घेऊ. चला बसा.",
        "options": [
          {
            "text": "ठीक आहे दादा, चला मग. (Okay brother, let's go then.)",
            "nextId": "pune_taxi_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_taxi_change": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "हो साहेब, सुट्टे आहेत माझ्याकडे. काळजी करू नका. (Yes sir, I have change. Don't worry.)",
        "npcAudioText": "हो साहेब, सुट्टे आहेत माझ्याकडे. काळजी करू नका.",
        "options": [
          {
            "text": "उत्तम, चला मग. (Great, let's go then.)",
            "nextId": "pune_taxi_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_taxi_bargain": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "नाही साहेब, मीटर प्रमाणे पन्नास रुपयेच होतात. कमी नाही होणार. (No sir, it's fifty rupees by the meter. Won't be less.)",
        "npcAudioText": "नाही साहेब, मीटर प्रमाणे पन्नास रुपयेच होतात. कमी नाही होणार.",
        "options": [
          {
            "text": "ठीक आहे दादा, पन्नास रुपये देतो. चला. (Okay brother, I will give fifty rupees. Let's go.)",
            "nextId": "pune_taxi_success",
            "reputationImpact": 5
          },
          {
            "text": "नको मग, मी चालत जातो. (No then, I will walk.)",
            "nextId": "pune_taxi_exit",
            "reputationImpact": -5
          }
        ]
      },
      "pune_taxi_success": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "चला, आलो शनिवार वाड्यावर! सुखरूप पोहोचलो! धन्यवाद साहेब! (Here we are, arrived at Shaniwar Wada! Reached safely! Thank you sir!)",
        "npcAudioText": "चला, आलो शनिवार वाड्यावर! सुखरूप पोहोचलो! धन्यवाद साहेब!",
        "options": [],
        "isSuccess": True,
        "xpAward": 50
      },
      "pune_taxi_exit": {
        "npcName": "Rickshaw Dada (रिक्षावाले दादा)",
        "npcAvatar": "🛺",
        "npcText": "ठीक आहे साहेब, जशी तुमची इच्छा. (Okay sir, as you wish.)",
        "npcAudioText": "ठीक आहे साहेब, जशी तुमची इच्छा.",
        "options": [],
        "isFailure": True
      },

      # CHAPTER 2: Dining at Durvankur
      "pune_restaurant": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "नमस्कार साहेब! स्वागत आहे. काय हवं तुम्हाला? (Hello sir! Welcome. What do you want?)",
        "npcAudioText": "नमस्कार साहेब! स्वागत आहे. काय हवं तुम्हाला?",
        "options": [
          {
            "text": "कृपया मला आधी पाणी द्याल का? (Please will you give me water first?)",
            "nextId": "pune_restaurant_water",
            "reputationImpact": 10
          },
          {
            "text": "तुमच्याकडे खायला काय आहे? (What do you have to eat?)",
            "nextId": "pune_restaurant_menu",
            "reputationImpact": 10
          },
          {
            "text": "मला बिल द्या. (Give me the bill.)",
            "nextId": "pune_restaurant_bill_early",
            "reputationImpact": 5
          }
        ]
      },
      "pune_restaurant_water": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "नक्कीच साहेब, हे घ्या थंड पाणी! जेवणात काय आणू? (Sure sir, here is cold water! What shall I bring in food?)",
        "npcAudioText": "नक्कीच साहेब, हे घ्या थंड पाणी! जेवणात काय आणू?",
        "options": [
          {
            "text": "मला एक प्लेट मिसळ पाव द्या. (Give me one plate of Misal Pav.)",
            "nextId": "pune_restaurant_order_misal",
            "reputationImpact": 10
          },
          {
            "text": "पिठलं भाकरी आहे का? (Do you have Pithla Bhakri?)",
            "nextId": "pune_restaurant_order_pithla",
            "reputationImpact": 10
          },
          {
            "text": "मला फक्त चहा हवा आहे. (I only want tea.)",
            "nextId": "pune_restaurant_order_tea",
            "reputationImpact": 5
          }
        ]
      },
      "pune_restaurant_menu": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "आमच्याकडे गरमागरम पिठलं भाकरी, पुणेरी मिसळ पाव आणि मऊ मोदक आहेत! (We have hot Pithla Bhakri, Puneri Misal Pav, and soft Modaks!)",
        "npcAudioText": "आमच्याकडे गरमागरम पिठलं भाकरी, पुणेरी मिसळ पाव आणि मऊ मोदक आहेत!",
        "options": [
          {
            "text": "मला एक मिसळ पाव द्या. (Give me one Misal Pav.)",
            "nextId": "pune_restaurant_order_misal",
            "reputationImpact": 10
          },
          {
            "text": "एक पिठलं भाकरी आणि ताक द्या. (Give one Pithla Bhakri and buttermilk.)",
            "nextId": "pune_restaurant_order_pithla",
            "reputationImpact": 10
          }
        ]
      },
      "pune_restaurant_order_misal": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "उत्कृष्ट निवड साहेब! पाच मिनिटात आणतो. तिखट पाहिजे का? (Excellent choice sir! Bringing in 5 minutes. Do you want it spicy?)",
        "npcAudioText": "उत्कृष्ट निवड साहेब! पाच मिनिटात आणतो. तिखट पाहिजे का?",
        "options": [
          {
            "text": "हो, तिखट बनवा. (Yes, make it spicy.)",
            "nextId": "pune_restaurant_eating",
            "reputationImpact": 10
          },
          {
            "text": "नाही, मध्यम तिखट ठेवा. (No, keep it medium spicy.)",
            "nextId": "pune_restaurant_eating",
            "reputationImpact": 10
          },
          {
            "text": "तिखट नको, अजिबात तिखट नको. (No spicy, not at all spicy.)",
            "nextId": "pune_restaurant_eating",
            "reputationImpact": 5
          }
        ]
      },
      "pune_restaurant_order_pithla": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "पिठलं भाकरी सोबत कांदा आणि ठेचा पण आणू का? (Shall I bring onions and dynamic chilly chutney alongside Pithla Bhakri?)",
        "npcAudioText": "पिठलं भाकरी सोबत कांदा आणि ठेचा पण आणू का?",
        "options": [
          {
            "text": "हो दादा, नक्कीच आणा! (Yes brother, surely bring it!)",
            "nextId": "pune_restaurant_eating",
            "reputationImpact": 10
          },
          {
            "text": "नाही, फक्त पिठलं भाकरी द्या. (No, just give Pithla Bhakri.)",
            "nextId": "pune_restaurant_eating",
            "reputationImpact": 5
          }
        ]
      },
      "pune_restaurant_order_tea": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "ठीक आहे साहेब, चहा लगेच आणतो. (Okay sir, bringing tea immediately.)",
        "npcAudioText": "ठीक आहे साहेब, चहा लगेच आणतो.",
        "options": [
          {
            "text": "धन्यवाद. (Thank you.)",
            "nextId": "pune_restaurant_eating",
            "reputationImpact": 5
          }
        ]
      },
      "pune_restaurant_eating": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "हे घ्या तुमचे जेवण! चव कशी आहे साहेब? (Here is your food! How is the taste sir?)",
        "npcAudioText": "हे घ्या तुमचे जेवण! चव कशी आहे साहेब?",
        "options": [
          {
            "text": "जेवण खूप चवदार आहे! आता बिल द्या. (Food is very tasty! Now give the bill.)",
            "nextId": "pune_restaurant_bill",
            "reputationImpact": 10
          },
          {
            "text": "चव छान आहे, पण मला अजून एक मोदक हवा आहे. (Taste is good, but I want one more Modak.)",
            "nextId": "pune_restaurant_extra",
            "reputationImpact": 10
          }
        ]
      },
      "pune_restaurant_extra": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "नक्कीच साहेब, हा घ्या गरम मोदक! अजून काही? (Sure sir, here is a hot Modak! Anything else?)",
        "npcAudioText": "नक्कीच साहेब, हा घ्या गरम मोदक! अजून काही?",
        "options": [
          {
            "text": "नाही धन्यवाद, आता बिल आणा. (No thank you, now bring the bill.)",
            "nextId": "pune_restaurant_bill",
            "reputationImpact": 10
          }
        ]
      },
      "pune_restaurant_bill_early": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "साहेब, तुम्ही अजून काही खाल्लेच नाही. बिल कशाचे देऊ? (Sir, you haven't eaten anything yet. What bill shall I give?)",
        "npcAudioText": "साहेब, तुम्ही अजून काही खाल्लेच नाही. बिल कशाचे देऊ?",
        "options": [
          {
            "text": "माफ करा, आधी मेनू दाखवा मग. (Sorry, show the menu first then.)",
            "nextId": "pune_restaurant_menu",
            "reputationImpact": 10
          }
        ]
      },
      "pune_restaurant_bill": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "एकूण ऐंशी रुपये झाले साहेब! (It is eighty rupees in total sir!)",
        "npcAudioText": "एकूण ऐंशी रुपये झाले साहेब!",
        "options": [
          {
            "text": "हे घ्या शंभर रुपये. उरलेले पैसे ठेवा. (Here is hundred rupees. Keep the change.)",
            "nextId": "pune_restaurant_complete",
            "reputationImpact": 15
          },
          {
            "text": "मी ऑनलाईन पेमेंट (UPI) करू शकतो का? (Can I do online payment UPI?)",
            "nextId": "pune_restaurant_upi",
            "reputationImpact": 10
          },
          {
            "text": "हे घ्या ऐंशी रुपये बरोबर. (Here is exactly eighty rupees.)",
            "nextId": "pune_restaurant_complete",
            "reputationImpact": 10
          }
        ]
      },
      "pune_restaurant_upi": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "हो साहेब, काउंटरवर क्यूआर कोड आहे, स्कॅन करा. (Yes sir, there is a QR code on the counter, scan it.)",
        "npcAudioText": "हो साहेब, काउंटरवर क्यूआर कोड आहे, स्कॅन करा.",
        "options": [
          {
            "text": "हो, मी पे केले आहे. धन्यवाद! (Yes, I have paid. Thank you!)",
            "nextId": "pune_restaurant_complete",
            "reputationImpact": 10
          }
        ]
      },
      "pune_restaurant_complete": {
        "npcName": "Waiter Dada (वेटेर दादा)",
        "npcAvatar": "👨‍🍳",
        "npcText": "खूप खूप धन्यवाद साहेब! पुन्हा या! (Thank you very much sir! Come again!)",
        "npcAudioText": "खूप खूप धन्यवाद साहेब! पुन्हा या!",
        "options": [],
        "isSuccess": True,
        "xpAward": 60,
        "coinsAward": 1
      },

      # CHAPTER 3: Shopping at Tulshibaug
      "pune_market_bargain": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "या साहेब, काय दाखवू? साडी की दागिने? (Come sir, what shall I show? Saree or jewelry?)",
        "npcAudioText": "या साहेब, काय दाखवू? साडी की दागिने?",
        "options": [
          {
            "text": "मला पुणेरी साडी दाखवा ना. (Show me Puneri Saree please.)",
            "nextId": "pune_market_saree",
            "reputationImpact": 10
          },
          {
            "text": "दागिने कुठे मिळतील? (Where will I get jewelry?)",
            "nextId": "pune_market_jewelry",
            "reputationImpact": 10
          },
          {
            "text": "इथे काही स्वस्त वस्तू आहेत का? (Are there any cheap items here?)",
            "nextId": "pune_market_cheap",
            "reputationImpact": 5
          }
        ]
      },
      "pune_market_saree": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "ही बघा रेशमी पुणेरी साडी! किंमत पाचशे रुपये आहे. (Look at this silk Puneri Saree! The price is five hundred rupees.)",
        "npcAudioText": "ही बघा रेशमी पुणेरी साडी! किंमत पाचशे रुपये आहे.",
        "options": [
          {
            "text": "काकू, साडी खूप महाग आहे. काही सवलत द्या. (Aunt, the saree is very expensive. Give some discount.)",
            "nextId": "pune_market_bargain_saree",
            "reputationImpact": 10
          },
          {
            "text": "मला यात दुसरा रंग हवा आहे. (I want another color in this.)",
            "nextId": "pune_market_color",
            "reputationImpact": 10
          },
          {
            "text": "ठीक आहे, मी ही खरेदी करतो. (Okay, I will buy this.)",
            "nextId": "pune_market_buy_saree",
            "reputationImpact": 10
          }
        ]
      },
      "pune_market_color": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "आपल्याकडे लाल आणि हिरवा रंग पण आहे. हे पहा! (We have red and green color too. Look at this!)",
        "npcAudioText": "आपल्याकडे लाल आणि हिरवा रंग पण आहे. हे पहा!",
        "options": [
          {
            "text": "मला हिरवा रंग आवडला, याची किंमत किती? (I liked the green color, what is its price?)",
            "nextId": "pune_market_saree_price",
            "reputationImpact": 10
          }
        ]
      },
      "pune_market_saree_price": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "हिरव्या साडीची किंमत चारशे पन्नास रुपये आहे. (The price of green saree is four hundred and fifty rupees.)",
        "npcAudioText": "हिरव्या साडीची किंमत चारशे पन्नास रुपये आहे.",
        "options": [
          {
            "text": "चारशे रुपये घ्या ना काकू, प्लीज! (Take four hundred rupees aunt, please!)",
            "nextId": "pune_market_bargain_saree",
            "reputationImpact": 10
          }
        ]
      },
      "pune_market_bargain_saree": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "ठीक आहे साहेब, तुमच्यासाठी चारशे वीस रुपये लावू. यापेक्षा कमी नाही होणार. (Okay sir, for you we will charge four hundred and twenty rupees. Won't be less than this.)",
        "npcAudioText": "ठीक आहे साहेब, तुमच्यासाठी चारशे वीस रुपये लावू. यापेक्षा कमी नाही होणार.",
        "options": [
          {
            "text": "ठीक आहे काकू, चारशे वीस रुपये देतो. (Okay aunt, I will give four hundred and twenty rupees.)",
            "nextId": "pune_market_buy_saree",
            "reputationImpact": 10
          },
          {
            "text": "नाही, मला नको आहे. (No, then I don't want it.)",
            "nextId": "pune_market_exit",
            "reputationImpact": -5
          }
        ]
      },
      "pune_market_buy_saree": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "ठीक आहे साहेब, ही घ्या तुमची साडी. पिशवी हवी आहे का? (Okay sir, here is your saree. Do you want a bag?)",
        "npcAudioText": "ठीक आहे साहेब, ही घ्या तुमची साडी. पिशवी हवी आहे का?",
        "options": [
          {
            "text": "हो काकू, पिशवी द्या. (Yes aunt, give a bag.)",
            "nextId": "pune_market_saree_complete",
            "reputationImpact": 10
          },
          {
            "text": "नाही, माझ्याकडे पिशवी आहे. (No, I have a bag.)",
            "nextId": "pune_market_saree_complete",
            "reputationImpact": 15
          }
        ]
      },
      "pune_market_jewelry": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "दागिन्यांचे दुकान गल्लीच्या कोपऱ्यावर आहे. तिथे खूप सुंदर झुमके मिळतात! (The jewelry shop is at the corner of the lane. You get very beautiful earrings there!)",
        "npcAudioText": "दागिन्यांचे दुकान गल्लीच्या कोपऱ्यावर आहे. तिथे खूप सुंदर झुमके मिळतात!",
        "options": [
          {
            "text": "धन्यवाद काकू, मी तिथे जातो. (Thank you aunt, I will go there.)",
            "nextId": "pune_market_jewelry_redirect",
            "reputationImpact": 10
          }
        ]
      },
      "pune_market_jewelry_redirect": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "पुन्हा या साहेब, काही हवे असल्यास सांगा. (Come again sir, let me know if you need anything.)",
        "npcAudioText": "पुन्हा या साहेब, काही हवे असल्यास सांगा.",
        "options": [],
        "isSuccess": True,
        "xpAward": 50
      },
      "pune_market_cheap": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "आमच्याकडे पन्नास रुपयांचे लहान बटवे आहेत. ते खूप छान आहेत! (We have small purses for fifty rupees. They are very nice!)",
        "npcAudioText": "आमच्याकडे पन्नास रुपयांचे लहान बटवे आहेत. ते खूप छान आहेत!",
        "options": [
          {
            "text": "मला दोन बटवे द्या. (Give me two purses.)",
            "nextId": "pune_market_saree_complete",
            "reputationImpact": 10
          }
        ]
      },
      "pune_market_saree_complete": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "खरेदी केल्याबद्दल धन्यवाद साहेब! शनिवार वाड्याला नक्की भेट द्या! (Thank you for shopping sir! Do visit Shaniwar Wada!)",
        "npcAudioText": "खरेदी केल्याबद्दल धन्यवाद साहेब! शनिवार वाड्याला नक्की भेट द्या!",
        "options": [],
        "isSuccess": True,
        "xpAward": 50
      },
      "pune_market_exit": {
        "npcName": "Kaku (काकू - Shop Owner)",
        "npcAvatar": "👩‍💼",
        "npcText": "ठीक आहे, जशी तुमची इच्छा. (Okay, as you wish.)",
        "npcAudioText": "ठीक आहे, जशी तुमची इच्छा.",
        "options": [],
        "isFailure": True
      },

      # CHAPTER 4: Finding Shaniwar Wada
      "pune_directions": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "नमस्कार मित्रा! शनिवार वाड्याचा रस्ता शोधतोयस का? (Hello friend! Are you searching for Shaniwar Wada road?)",
        "npcAudioText": "नमस्कार मित्रा! शनिवार वाड्याचा रस्ता शोधतोयस का?",
        "options": [
          {
            "text": "हो मित्रा, शनिवार वाडा कुठे आहे? (Yes friend, where is Shaniwar Wada?)",
            "nextId": "pune_directions_way",
            "reputationImpact": 10
          },
          {
            "text": "शनिवार वाड्याचे तिकिट कुठे मिळते? (Where do you get Shaniwar Wada ticket?)",
            "nextId": "pune_directions_ticket",
            "reputationImpact": 10
          },
          {
            "text": "मला रस्ता माहीत नाही, मदत कर. (I don't know the road, help me.)",
            "nextId": "pune_directions_help",
            "reputationImpact": 5
          }
        ]
      },
      "pune_directions_way": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "इथून सरळ पुढे जा, नंतर पहिल्या चौकातून उजवीकडे वळा. (Go straight from here, then turn right at the first intersection.)",
        "npcAudioText": "इथून सरळ पुढे जा, नंतर पहिल्या चौकातून उजवीकडे वळा.",
        "options": [
          {
            "text": "तिथून किती अंतर आहे? (How far is it from there?)",
            "nextId": "pune_directions_distance",
            "reputationImpact": 10
          },
          {
            "text": "पायी जाता येईल का? (Can we go on foot?)",
            "nextId": "pune_directions_walk",
            "reputationImpact": 10
          },
          {
            "text": "धन्यवाद मित्रा, तुझ्या मदतीसाठी! (Thank you friend, for your help!)",
            "nextId": "pune_directions_success",
            "reputationImpact": 15
          }
        ]
      },
      "pune_directions_distance": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "फक्त पाच मिनिटांचे अंतर आहे, खूप जवळ आहे. (It is only five minutes distance, very near.)",
        "npcAudioText": "फक्त पाच मिनिटांचे अंतर आहे, खूप जवळ आहे.",
        "options": [
          {
            "text": "ठीक आहे, मी पायीच जातो. धन्यवाद! (Okay, I will walk. Thank you!)",
            "nextId": "pune_directions_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_directions_walk": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "हो, पायी जाणे सोपे आहे, रिक्षाची गरज नाही. (Yes, walking is easy, no need for a rickshaw.)",
        "npcAudioText": "हो, पायी जाणे सोपे आहे, रिक्षाची गरज नाही.",
        "options": [
          {
            "text": "खूप छान, धन्यवाद मित्रा! (Very nice, thank you friend!)",
            "nextId": "pune_directions_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_directions_ticket": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "तिकिट काउंटर मुख्य दरवाज्यापाशीच आहे. तिकिट २५ रुपये आहे. (The ticket counter is right near the main gate. The ticket is 25 rupees.)",
        "npcAudioText": "तिकिट काउंटर मुख्य दरवाज्यापाशीच आहे. तिकिट २५ रुपये आहे.",
        "options": [
          {
            "text": "शनिवार वाडा आज उघडा आहे का? (Is Shaniwar Wada open today?)",
            "nextId": "pune_directions_open",
            "reputationImpact": 10
          }
        ]
      },
      "pune_directions_open": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "हो, शनिवार वाडा रोज सकाळी आठ ते संध्याकाळी सहा वाजेपर्यंत उघडा असतो. (Yes, Shaniwar Wada is open daily from eight in the morning until six in the evening.)",
        "npcAudioText": "हो, शनिवार वाडा रोज सकाळी आठ ते संध्याकाळी सहा वाजेपर्यंत उघडा असतो.",
        "options": [
          {
            "text": "मी आता निघतो, धन्यवाद! (I am leaving now, thank you!)",
            "nextId": "pune_directions_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_directions_help": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "काळजी करू नकोस, मी पण त्याच बाजूला चाललो आहे. मेरे सोबतीला ये. (Don't worry, I am also walking that way. Come with me.)",
        "npcAudioText": "काळजी करू नकोस, मी पण त्याच बाजूला चाललो आहे. मेरे सोबतीला ये.",
        "options": [
          {
            "text": "अरे वा, खूप खूप धन्यवाद मित्रा! (Wow, thank you very much friend!)",
            "nextId": "pune_directions_success",
            "reputationImpact": 15
          }
        ]
      },
      "pune_directions_success": {
        "npcName": "Student (विद्यार्थी - Local College Student)",
        "npcAvatar": "🧑‍🎓",
        "npcText": "शनिवार वाडा समोरच आहे! तुझा दिवस चांगला जावो! (Shaniwar Wada is right in front! Have a good day!)",
        "npcAudioText": "शनिवार वाडा समोरच आहे! तुझा दिवस चांगला जावो!",
        "options": [],
        "isSuccess": True,
        "xpAward": 50
      },

      # CHAPTER 5: Meeting the Neighbor
      "pune_neighbor": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "नमस्कार! तुम्ही नवीन भाडेकरू आहात का? (Hello! Are you the new tenant?)",
        "npcAudioText": "नमस्कार! तुम्ही नवीन भाडेकरू आहात का?",
        "options": [
          {
            "text": "हो वहिनी, मी कालच राहायला आलो. (Yes sister-in-law/madam, I moved in yesterday.)",
            "nextId": "pune_neighbor_intro",
            "reputationImpact": 10
          },
          {
            "text": "हो, मी नवीन आहे. कचरा कुठे टाकायचा? (Yes, I am new. Where to throw garbage?)",
            "nextId": "pune_neighbor_trash",
            "reputationImpact": 5
          },
          {
            "text": "नमस्कार वहिनी, पाणी वेळेवर येते का? (Hello madam, does water come on time?)",
            "nextId": "pune_neighbor_water",
            "reputationImpact": 10
          }
        ]
      },
      "pune_neighbor_intro": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "पुण्यात स्वागत आहे! तुमचे नाव काय? (Welcome to Pune! What is your name?)",
        "npcAudioText": "पुण्यात स्वागत आहे! तुमचे नाव काय?",
        "options": [
          {
            "text": "माझे नाव जॉन आहे. आणि तुमचे? (My name is John. And yours?)",
            "nextId": "pune_neighbor_name",
            "reputationImpact": 10
          }
        ]
      },
      "pune_neighbor_name": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "माझे नाव सविता आहे. काही मदत हवी असल्यास नक्की सांगा. (My name is Savita. Do let me know if you need any help.)",
        "npcAudioText": "माझे नाव सविता आहे. काही मदत हवी असल्यास नक्की सांगा.",
        "options": [
          {
            "text": "नक्कीच वहिनी, खूप खूप धन्यवाद. (Surely madam, thank you very much.)",
            "nextId": "pune_neighbor_success",
            "reputationImpact": 10
          },
          {
            "text": "वहिनी, इथे कचऱ्याची गाडी कधी येते? (Madam, when does the garbage truck come here?)",
            "nextId": "pune_neighbor_trash",
            "reputationImpact": 10
          }
        ]
      },
      "pune_neighbor_trash": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "कचऱ्याची गाडी रोज सकाळी नऊ वाजता येते. सुका आणि ओला कचरा वेगळा ठेवावा लागतो. (The garbage truck comes daily at nine in the morning. Dry and wet garbage needs to be kept separate.)",
        "npcAudioText": "कचऱ्याची गाडी रोज सकाळी नऊ वाजता येते. सुका आणि ओला कचरा वेगळा ठेवावा लागतो.",
        "options": [
          {
            "text": "ठीक आहे वहिनी, मी लक्षात ठेवेन. (Okay madam, I will keep in mind.)",
            "nextId": "pune_neighbor_success",
            "reputationImpact": 10
          },
          {
            "text": "पाणी २४ तास असते का? (Is there water 24 hours?)",
            "nextId": "pune_neighbor_water",
            "reputationImpact": 10
          }
        ]
      },
      "pune_neighbor_water": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "नाही, पाणी फक्त सकाळी दोन तास आणि संध्याकाळी दोन तास येते. बादल्या भरून ठेवाव्या लागतात. (No, water only comes for two hours in morning and two hours in evening. You have to fill buckets.)",
        "npcAudioText": "नाही, पाणी फक्त सकाळी दोन तास आणि संध्याकाळी दोन तास येते. बादल्या भरून ठेवाव्या लागतात.",
        "options": [
          {
            "text": "बापरे! मला बादली विकत घ्यावी लागेल. (Oh my! I will have to buy a bucket.)",
            "nextId": "pune_neighbor_bucket",
            "reputationImpact": 10
          },
          {
            "text": "ठीक आहे, माहितीबद्दल धन्यवाद. (Okay, thank you for the information.)",
            "nextId": "pune_neighbor_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_neighbor_bucket": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "हो, बाजारातून एक मोठी बादली घेऊन या. जवळच दुकान आहे. (Yes, bring a big bucket from the market. There is a shop nearby.)",
        "npcAudioText": "हो, बाजारातून एक मोठी बादली घेऊन या. जवळच दुकान आहे.",
        "options": [
          {
            "text": "मी आजच आणतो, धन्यवाद वहिनी! (I will bring it today, thank you madam!)",
            "nextId": "pune_neighbor_success",
            "reputationImpact": 15
          }
        ]
      },
      "pune_neighbor_success": {
        "npcName": "Vahini (शेजारच्या वहिनी - Neighbor)",
        "npcAvatar": "👩",
        "npcText": "ठीक आहे जॉन, शेजारी राहून एकमेकांना मदत करूया. (Okay John, let's help each other as neighbors.)",
        "npcAudioText": "ठीक आहे जॉन, शेजारी राहून एकमेकांना मदत करूया.",
        "options": [],
        "isSuccess": True,
        "xpAward": 50
      },

      # CHAPTER 6: Buying Mangoes
      "pune_mango_seller": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "ताजे देवगड हापूस आंबे आहेत साहेब! शंभर टक्के गोड! काय भाव देऊ? (Fresh Devgad Alphonso mangoes are here sir! Hundred percent sweet! What rate shall I give?)",
        "npcAudioText": "ताजे देवगड हापूस आंबे आहेत साहेब! शंभर टक्के गोड! काय भाव देऊ?",
        "options": [
          {
            "text": "आंबे कसे दिले दादा? (How are the mangoes priced brother?)",
            "nextId": "pune_mango_price",
            "reputationImpact": 10
          },
          {
            "text": "एक डझन आंबे कितीला आहेत? (How much for one dozen mangoes?)",
            "nextId": "pune_mango_price",
            "reputationImpact": 10
          },
          {
            "text": "खूप महाग आंबे विकताय तुम्ही. (You sell very expensive mangoes.)",
            "nextId": "pune_mango_rude",
            "reputationImpact": -5
          }
        ]
      },
      "pune_mango_rude": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "साहेब, ओरिजिनल हापूस आंबे आहेत! बाजारात यापेक्षा स्वस्त नाही मिळणार. (Sir, they are original Alphonso mangoes! You won't get cheaper than this in the market.)",
        "npcAudioText": "साहेब, ओरिजिनल हापूस आंबे आहेत! बाजारात यापेक्षा स्वस्त नाही मिळणार.",
        "options": [
          {
            "text": "बरं, एका डझनची किंमत काय? (Alright, what is the price of one dozen?)",
            "nextId": "pune_mango_price",
            "reputationImpact": 10
          },
          {
            "text": "कमी करणार असाल तरच घेतो. (I will buy only if you reduce the price.)",
            "nextId": "pune_mango_bargain_ask",
            "reputationImpact": 5
          }
        ]
      },
      "pune_mango_price": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "सहाशे रुपये डझन साहेब. आंबे एकदम पिकलेले आणि चवदार आहेत. (Six hundred rupees a dozen sir. Mangoes are fully ripe and tasty.)",
        "npcAudioText": "सहाशे रुपये डझन साहेब. आंबे एकदम पिकलेले आणि चवदार आहेत.",
        "options": [
          {
            "text": "सहाशे रुपये खूप जास्त आहेत, पाचशे रुपये घ्या. (Six hundred is too much, take five hundred.)",
            "nextId": "pune_mango_bargain_success",
            "reputationImpact": 10
          },
          {
            "text": "काही सवलत मिळेल का? (Will we get some discount?)",
            "nextId": "pune_mango_bargain_ask",
            "reputationImpact": 10
          },
          {
            "text": "ठीक आहे, एक डझन द्या. (Okay, give one dozen.)",
            "nextId": "pune_mango_buy_direct",
            "reputationImpact": 10
          }
        ]
      },
      "pune_mango_bargain_ask": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "चला, तुमच्यासाठी साडेपाचशे रुपये लावतो. यापेक्षा एक रुपया कमी नाही होणार. (Come, for you I will charge five hundred and fifty. Not one rupee less than this.)",
        "npcAudioText": "चला, तुमच्यासाठी साडेपाचशे रुपये लावतो. यापेक्षा एक रुपया कमी नाही होणार.",
        "options": [
          {
            "text": "ठीक आहे, साडेपाचशे रुपये देतो. चांगले आंबे निवडडून द्या. (Okay, I will give five hundred and fifty. Select and give good mangoes.)",
            "nextId": "pune_mango_buy_select",
            "reputationImpact": 10
          },
          {
            "text": "पाचशे वीस रुपये घ्या ना दादा. (Take five hundred and twenty rupees brother.)",
            "nextId": "pune_mango_bargain_final",
            "reputationImpact": 5
          }
        ]
      },
      "pune_mango_bargain_success": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "पाचशे रुपये खूप कमी होतात साहेब, पण आज बोहनीची वेळ आहे म्हणून देतो. चला घ्या! (Five hundred is too low sir, but it is morning sales time so I will give. Come take!)",
        "npcAudioText": "पाचशे रुपये खूप कमी होतात साहेब, पण आज बोहनीची वेळ आहे म्हणून देतो. चला घ्या!",
        "options": [
          {
            "text": "धन्यवाद दादा, हे घ्या पाचशे रुपये. (Thank you brother, here is five hundred rupees.)",
            "nextId": "pune_mango_success",
            "reputationImpact": 15
          }
        ]
      },
      "pune_mango_bargain_final": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "ठीक आहे साहेब, द्या पाचशे वीस रुपये. पण कोणाला सांगू नका! (Okay sir, give five hundred and twenty rupees. But don't tell anyone!)",
        "npcAudioText": "ठीक आहे साहेब, द्या पाचशे वीस रुपये. पण कोणाला सांगू नका!",
        "options": [
          {
            "text": "नक्कीच दादा, धन्यवाद! (Surely brother, thank you!)",
            "nextId": "pune_mango_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_mango_buy_direct": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "हे घ्या एक डझन एकदम भारी आंबे! सहाशे रुपये झाले साहेब. (Here is one dozen very heavy/nice mangoes! It is six hundred rupees sir.)",
        "npcAudioText": "हे घ्या एक डझन एकदम भारी आंबे! सहाशे रुपये झाले साहेब.",
        "options": [
          {
            "text": "हे घ्या सहाशे रुपये, धन्यवाद. (Here is six hundred rupees, thank you.)",
            "nextId": "pune_mango_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_mango_buy_select": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "हे घ्या निवडलेले ताजे आंबे! सफर सुखाची असो! (Here are selected fresh mangoes! Have a nice journey!)",
        "npcAudioText": "हे घ्या निवडलेले ताजे आंबे! सफर सुखाची असो!",
        "options": [
          {
            "text": "खूप खूप धन्यवाद दादा. (Thank you very much brother.)",
            "nextId": "pune_mango_success",
            "reputationImpact": 10
          }
        ]
      },
      "pune_mango_success": {
        "npcName": "Bhaiya (फळ विक्रेता - Fruit Seller)",
        "npcAvatar": "🥭",
        "npcText": "पुन्हा या साहेब! आंबे आवडले तर नक्की सांगा! (Come again sir! Do let me know if you liked the mangoes!)",
        "npcAudioText": "पुन्हा या साहेब! आंबे आवडले तर नक्की सांगा!",
        "options": [],
        "isSuccess": True,
        "xpAward": 50,
        "coinsAward": 1
      }
    }

    # Write files out to target directories
    # 1. cities.json
    cities_dir = os.path.join("data", "cities")
    if not os.path.exists(cities_dir):
        os.makedirs(cities_dir)
    with open(os.path.join(cities_dir, "cities.json"), "w", encoding="utf-8") as f:
        json.dump(cities_data, f, ensure_ascii=False, indent=2)
    print("Seeded cities.json successfully.")

    # 2. chapters.json
    chapters_dir = os.path.join("data", "chapters")
    if not os.path.exists(chapters_dir):
        os.makedirs(chapters_dir)
    with open(os.path.join(chapters_dir, "chapters.json"), "w", encoding="utf-8") as f:
        json.dump(chapters_data, f, ensure_ascii=False, indent=2)
    print("Seeded chapters.json successfully.")

    # 3. conversations.json
    conversations_dir = os.path.join("data", "conversations")
    if not os.path.exists(conversations_dir):
        os.makedirs(conversations_dir)
    with open(os.path.join(conversations_dir, "conversations.json"), "w", encoding="utf-8") as f:
        json.dump(conversations_data, f, ensure_ascii=False, indent=2)
    print("Seeded conversations.json successfully.")

    # 4. dictionary.json
    dictionary_dir = os.path.join("data", "dictionary")
    if not os.path.exists(dictionary_dir):
        os.makedirs(dictionary_dir)
    with open(os.path.join(dictionary_dir, "dictionary.json"), "w", encoding="utf-8") as f:
        json.dump(dictionary_list, f, ensure_ascii=False, indent=2)
    print("Seeded dictionary.json successfully with 310 items.")

if __name__ == "__main__":
    main()
