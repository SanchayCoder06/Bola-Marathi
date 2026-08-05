import { journeyModulesData } from './journeyData';
import { SEED_MODULES } from './generalCourseSeedData';

export interface CourseModel {
  id: string;
  title: string;
  type: 'general' | 'situational';
  description: string;
  total_hours: number;
  icon: string;
}

export interface ModuleModel {
  id: string;
  courseId: string;
  moduleNumber: number;
  titleEn: string;
  titleHindi: string;
  descriptionEn: string;
  learningObjective: string;
  xp: number;
  estimatedMinutes: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface SentenceModel {
  id: string;
  moduleId: string;
  marathi_text: string;
  transliteration: string;
  english_meaning: string;
  audio_url?: string;
  usage_note?: string;
}

export const SITUATIONAL_COURSES: CourseModel[] = [
  {
    id: 'general',
    title: 'General Conversational Marathi',
    type: 'general',
    description: 'Full 60-Module Marathi Path from absolute beginner to conversational fluency.',
    total_hours: 60,
    icon: 'BookOpen'
  },
  {
    id: 'travel',
    title: 'Travelling & Railway Station Marathi',
    type: 'situational',
    description: 'Hyper-practical Marathi for navigating stations, buying tickets, finding seats, and asking directions.',
    total_hours: 8,
    icon: 'Compass'
  },
  {
    id: 'rickshaw',
    title: 'Auto-Rickshaw Driver Marathi',
    type: 'situational',
    description: 'Master negotiation, fare inquiries, direction commands, and payments with local auto-rickshaw drivers.',
    total_hours: 6,
    icon: 'MessageSquare'
  },
  {
    id: 'watchman',
    title: 'Watchman / Security Guard Marathi',
    type: 'situational',
    description: 'Essential gate-entry conversation, visitor verification, courier handling, and safety commands.',
    total_hours: 8,
    icon: 'Lock'
  },
  {
    id: 'office',
    title: 'Government Office Marathi',
    type: 'situational',
    description: 'Navigate paperwork, counters, officer meetings, document verification, and queue inquiries.',
    total_hours: 10,
    icon: 'FileText'
  }
];

// Seed Sentences for Lesson 1 of Situational Courses
const SITUATIONAL_L1_SENTENCES: Record<string, { mr: string; tr: string; en: string }[]> = {
  travel: [
    { mr: "मला तिकीट पाहिजे", tr: "Mala tikit pahije", en: "I need a ticket" },
    { mr: "ही गाडी कुठे जाते?", tr: "Hi gaadi kuthe jaate?", en: "Where does this train go?" },
    { mr: "प्लॅटफॉर्म नंबर किती आहे?", tr: "Platform number kiti aahe?", en: "What is the platform number?" },
    { mr: "गाडी किती वाजता येईल?", tr: "Gaadi kiti vajta yeil?", en: "What time will the train arrive?" },
    { mr: "ही सीट रिकामी आहे का?", tr: "Hi seat rikaami aahe ka?", en: "Is this seat empty?" },
    { mr: "मला मदत करा", tr: "Mala madat kara", en: "Help me" },
    { mr: "पुढचं स्टेशन कोणतं?", tr: "Pudhcha station kontha?", en: "What is the next station?" },
    { mr: "माझी बॅग हरवली", tr: "Mazi bag haravli", en: "My bag is lost" },
    { mr: "तिकीट खिडकी कुठे आहे?", tr: "Tikit khidki kuthe aahe?", en: "Where is the ticket window?" },
    { mr: "धन्यवाद", tr: "Dhanyavaad", en: "Thank you" }
  ],
  rickshaw: [
    { mr: "मीटरने चला", tr: "Meter ne chala", en: "Go by meter" },
    { mr: "किती भाडं होईल?", tr: "Kiti bhaadam hoil?", en: "How much will the fare be?" },
    { mr: "सरळ जा", tr: "Saral ja", en: "Go straight" },
    { mr: "उजवीकडे वळा", tr: "Ujavikade vala", en: "Turn right" },
    { mr: "डावीकडे वळा", tr: "Davikade vala", en: "Turn left" },
    { mr: "इथे थांबा", tr: "Ithe thamba", en: "Stop here" },
    { mr: "थोडं पुढे जा", tr: "Thoda pudhe ja", en: "Go a little further" },
    { mr: "घाई करा, उशीर होतोय", tr: "Ghaai kara, usheer hotoy", en: "Hurry, I'm getting late" },
    { mr: "सुट्टे पैसे आहेत का?", tr: "Sutte paise aahet ka?", en: "Do you have change?" },
    { mr: "किती वेळ लागेल?", tr: "Kiti vel laagel", en: "How much time will it take?" }
  ],
  watchman: [
    { mr: "कोण आहे?", tr: "Kon aahe?", en: "Who is it?" },
    { mr: "आत या", tr: "Aat ya", en: "Come inside" },
    { mr: "नाव सांगा", tr: "Naav sanga", en: "Tell me your name" },
    { mr: "कोणाला भेटायचं आहे?", tr: "Konala bhetaycha aahe?", en: "Whom do you want to meet?" },
    { mr: "इथे पार्किंग नाही", tr: "Ithe parking nahi", en: "No parking here" },
    { mr: "गाडी बाजूला लावा", tr: "Gaadi bajula lava", en: "Park the vehicle to the side" },
    { mr: "ओळखपत्र दाखवा", tr: "Olakhpatra dakhava", en: "Show your ID card" },
    { mr: "वेळ झाली, बंद करायचं आहे", tr: "Vel jhali, band karaycha aahe", en: "Time's up, need to close" },
    { mr: "सगळं ठीक आहे", tr: "Sagla theek aahe", en: "Everything is fine" },
    { mr: "काळजी घ्या", tr: "Kaalji ghya", en: "Take care" }
  ],
  office: [
    { mr: "मला हा अर्ज भरायचा आहे", tr: "Mala haa arj bharaycha aahe", en: "I need to fill this form" },
    { mr: "कोणत्या खिडकीवर जायचं?", tr: "Konatya khidkivar jaycha?", en: "Which window should I go to?" },
    { mr: "ही कागदपत्रं बरोबर आहेत का?", tr: "Hi kagadpatra barobar aahet ka?", en: "Are these documents correct?" },
    { mr: "किती दिवस लागतील?", tr: "Kiti divas laagtil?", en: "How many days will it take?" },
    { mr: "सही इथे करा", tr: "Sahi ithe kara", en: "Sign here" },
    { mr: "फी किती आहे?", tr: "Fee kiti aahe?", en: "What is the fee?" },
    { mr: "साहेब कुठे आहेत?", tr: "Saheb kuthe aahet?", en: "Where is the officer?" },
    { mr: "पावती द्या", tr: "Paavati dya", en: "Give me the receipt" },
    { mr: "पुन्हा कधी यायचं?", tr: "Punha kadhi yaayacha?", en: "When should I come again?" },
    { mr: "रांगेत उभे रहा", tr: "Rangeत ubhe raha", en: "Stand in the queue" }
  ]
};

// Generates situational modules and sentences programmatically to build out modules 2 to 8.
export function generateSituationalModulesAndSentences() {
  const modules: ModuleModel[] = [];
  const sentences: SentenceModel[] = [];

  const courses = ['travel', 'rickshaw', 'watchman', 'office'];

  courses.forEach((cId) => {
    const totalModules = 8;
    const courseTitle = SITUATIONAL_COURSES.find(c => c.id === cId)?.title || cId;

    // Define titles for the modules based on the course
    let titlesEn: string[] = [];
    let titlesHindi: string[] = [];
    let descriptions: string[] = [];
    let sentenceTemplates: { mr: string; tr: string; en: string; u: string }[][] = [];

    if (cId === 'travel') {
      titlesEn = [
        "Ticket Counter & Inquiries",
        "Platform & Delay Status",
        "Boarding & Coach Finding",
        "Luggage & Coolie Negotiations",
        "Train Catering & Food",
        "Co-passenger Conversations",
        "Railway Exit & Taxi Stands",
        "Station Emergencies & Complaints"
      ];
      titlesHindi = [
        "टिकट काउंटर और पूछताछ",
        "प्लेटफ़ॉर्म और विलंब स्थिति",
        "ट्रेन बोर्डिंग और सीट खोजना",
        "सामान और कुली मोलभाव",
        "ट्रेन खान-पान और भोजन",
        "सह-यात्रियों से बातचीत",
        "रेलवे निकास और टैक्सी स्टैंड",
        "स्टेशन आपातकाल और शिकायतें"
      ];
      descriptions = [
        "Learn to buy tickets and ask basic routing questions.",
        "Query platform numbers and train delay durations.",
        "Locate your carriage, coach number, and find your berth.",
        "Talk to porters, agree on rates, and protect your luggage.",
        "Order meals and purchase bottled water on the train.",
        "Make polite conversation with passengers sitting nearby.",
        "Navigate exit gates and locate bus or prepaid taxi stands.",
        "Report lost bags, speak to railway police, or seek help."
      ];
      // Core sentences for lessons 2-8
      sentenceTemplates = [
        [], // Seeded L1
        [
          { mr: "गाडी किती वेळ उशिरा आहे?", tr: "Gaadi kiti vel ushira aahe?", en: "How much time is the train delayed?", u: "Checking train delay status" },
          { mr: "पुण्याची गाडी कोणत्या प्लॅटफॉर्मवर येईल?", tr: "Punyachi gaadi konatya platformvar yeil?", en: "On which platform will the Pune train arrive?", u: "Inquiring platform number" },
          { mr: "ही गाडी थेट मुंबईला जाते का?", tr: "Hi gaadi thet Mumbaila jaate ka?", en: "Does this train go straight to Mumbai?", u: "Asking about direct train route" },
          { mr: "चौकशी खिडकी कुठे आहे?", tr: "Choukashi khidki kuthe aahe?", en: "Where is the inquiry window?", u: "Locating help desk counter" },
          { mr: "गाडी दोन नंबर प्लॅटफॉर्मवर उभी आहे.", tr: "Gaadi don number platformvar ubhi aahe.", en: "The train is standing on platform number two.", u: "Stating train platform position" },
          { mr: "माझी गाडी सुटली.", tr: "Mazi gaadi sutli.", en: "I missed my train.", u: "Reporting missed train" },
          { mr: "तिकीट तपासा.", tr: "Tikit tapasa.", en: "Check the ticket.", u: "Asking for ticket verification" },
          { mr: "पुढील गाडी दोन तासांनी आहे.", tr: "Pudhil gaadi don taasanni aahe.", en: "The next train is in two hours.", u: "Stating next train arrival" },
          { mr: "रेल्वेचे वेळापत्रक कुठे आहे?", tr: "Railway-che velapatrak kuthe aahe?", en: "Where is the railway timetable?", u: "Asking for scheduling chart" },
          { mr: "हा रेल्वेचा पास आहे.", tr: "Ha railway-cha pass aahe.", en: "This is a railway pass.", u: "Showing transit pass" }
        ],
        [
          { mr: "माझा डबा कुठे आहे?", tr: "Maza daba kuthe aahe?", en: "Where is my coach?", u: "Locating coach category" },
          { mr: "माझा बर्थ वरचा आहे.", tr: "Maza berth varcha aahe.", en: "My berth is the upper one.", u: "Stating upper berth location" },
          { mr: "सामान सीटच्या खाली ठेवा.", tr: "Saman seat-chya khali theva.", en: "Keep the luggage under the seat.", u: "Instructing luggage storage" },
          { mr: "कृपया फॅन चालू करा.", tr: "Krupaya fan chalu kara.", en: "Please turn on the fan.", u: "Asking to turn on ventilation" },
          { mr: "कृपया मला खिडकीची सीट द्या.", tr: "Krupaya mala khidkichya seat dya.", en: "Please give me the window seat.", u: "Requesting window seating preference" },
          { mr: "ही माझी आरक्षित सीट आहे.", tr: "Hi mazi aarakshit seat aahe.", en: "This is my reserved seat.", u: "Stating seat ownership" },
          { mr: "टीटीई कधी येतील?", tr: "TTE kadhi yetil?", en: "When will the TTE arrive?", u: "Inquiring about ticket inspector" },
          { mr: "इथे चार्जिंग पॉईंट चालू आहे का?", tr: "Ithe charging point chalu aahe ka?", en: "Is the charging point working here?", u: "Checking charging socket status" },
          { mr: "कृपया खिडकी बंद करा.", tr: "Krupaya khidki band kara.", en: "Please close the window.", u: "Asking to shut the window window" },
          { mr: "प्रवास सुखाचा होवो!", tr: "Pravas sukhacha hovo!", en: "Have a happy journey!", u: "Wishing a safe trip" }
        ],
        [
          { mr: "कुली, हे सामान गाडीत ठेवा.", tr: "Coolie, he saman gaadit theva.", en: "Porter, put this luggage in the train.", u: "Ordering luggage loading" },
          { mr: "सामान वाहून नेण्याचे किती पैसे घेणार?", tr: "Saman vahun neyanyache kiti paise ghenar?", en: "How much money will you charge for carrying luggage?", u: "Negotiating baggage fee" },
          { mr: "काळजीपूर्वक घ्या, आत काच आहे.", tr: "Kaljipurvak ghya, aat kaach aahe.", en: "Handle carefully, there is glass inside.", u: "Warning of fragile objects" },
          { mr: "माझ्याकडे तीन मोठे बॉक्स आहेत.", tr: "Mazyakade teen mothe box aahet.", en: "I have three large boxes.", u: "Specifying cargo quantities" },
          { mr: "सामान खूप जड आहे.", tr: "Saman khup jad aahe.", en: "The luggage is very heavy.", u: "Describing luggage load weight" },
          { mr: "हे सामान माझे नाही.", tr: "He saman maze nahi.", en: "This luggage is not mine.", u: "Rejecting wrong luggage" },
          { mr: "रेल्वे क्लॉक रूम कुठे आहे?", tr: "Railway cloak room kuthe aahe?", en: "Where is the railway cloak room?", u: "Locating left luggage office" },
          { mr: "मला पावती द्या.", tr: "Mala pavati dya.", en: "Give me a receipt.", u: "Requesting payment slip" },
          { mr: "ठीक आहे, पन्नास रुपये घ्या.", tr: "Theek aahe, pannas rupaye ghya.", en: "Okay, take fifty rupees.", u: "Closing price deal" },
          { mr: "सामान ट्रॉलीवर ठेवा.", tr: "Saman trolleyvar theva.", en: "Keep the luggage on the trolley.", u: "Directing luggage arrangement" }
        ],
        [
          { mr: "गाडीत जेवण मिळेल का?", tr: "Gaadit jevan milel ka?", en: "Will I get food in the train?", u: "Checking food availability" },
          { mr: "मला एक पाण्याच्या बाटलीची गरज आहे.", tr: "Mala ek panyachya batlichi garaj aahe.", en: "I need one water bottle.", u: "Requesting drinking water bottle" },
          { mr: "चहा किती रुपयांना आहे?", tr: "Chaha kiti rupayanna aahe?", en: "How much is the tea for?", u: "Inquiring price of hot tea" },
          { mr: "मला शाकाहारी थाळी पाहिजे.", tr: "Mala shakahari thali pahije.", en: "I want a vegetarian thali.", u: "Requesting vegetarian food plate" },
          { mr: "जेवण कधी गरम मिळेल?", tr: "Jevan kadhi garam milel?", en: "When will hot food be served?", u: "Checking meal temperature options" },
          { mr: "एक कॉफी आणून द्या.", tr: "Ek coffee aanun dya.", en: "Bring one coffee.", u: "Ordering coffee beverage" },
          { mr: "पॅन्ट्री कार कुठे आहे?", tr: "Pantry car kuthe aahe?", en: "Where is the pantry car?", u: "Locating catering compartment" },
          { mr: "हे बिल चुकीचे आहे.", tr: "He bill chukiche aahe.", en: "This bill is incorrect.", u: "Disputing check receipt charge" },
          { mr: "चहा खूप गोड आहे.", tr: "Chaha khup god aahe.", en: "The tea is very sweet.", u: "Describing tea taste" },
          { mr: "स्वच्छता राखा.", tr: "Swachhata rakha.", en: "Maintain hygiene/cleanliness.", u: "Stating standard rule" }
        ],
        [
          { mr: "तुम्ही कुठे चालला आहात?", tr: "Tumhi kuthe challa aahat?", en: "Where are you going?", u: "Initiating co-passenger talk" },
          { mr: "मी कामानिमित्त पुणे येथे चाललो आहे.", tr: "Mi kamanimitta Pune yethe challo aahe.", en: "I am going to Pune for work.", u: "Stating journey purpose" },
          { mr: "तुमचे गाव कोणते आहे?", tr: "Tumche gaav konte aahe?", en: "Which is your hometown?", u: "Asking hometown details" },
          { mr: "माझे नाव अमोल आहे.", tr: "Maze naav Amol aahe.", en: "My name is Amol.", u: "Introducing oneself" },
          { mr: "हा खूप सुंदर प्रवास आहे.", tr: "Ha khup sundar pravas aahe.", en: "This is a very beautiful journey.", u: "Making friendly talk" },
          { mr: "माझा फोन नंबर नोंदवून घ्या.", tr: "Maza phone number nondvun ghya.", en: "Please note down my phone number.", u: "Exchanging phone contact numbers" },
          { mr: "तुम्हाला मराठी पुस्तके आवडतात का?", tr: "Tumhala Marathi pustake aavadtat ka?", en: "Do you like Marathi books?", u: "Sharing hobby interests" },
          { mr: "भेटून आनंद झाला.", tr: "Bhetun anand jhala.", en: "Nice to meet you.", u: "Closing polite chat" },
          { mr: "काळजी घ्या, शुभ रात्री!", tr: "Kalji ghya, shubh ratri!", en: "Take care, good night!", u: "Wishing night wishes" },
          { mr: "तुमचा प्रवास सुखकर जावो.", tr: "Tumcha pravas sukhakar javo.", en: "May your trip go well.", u: "Wishing a safe route" }
        ],
        [
          { mr: "बाहेर पडण्याचा मार्ग कुठे आहे?", tr: "Baher padnyacha marg kuthe aahe?", en: "Where is the exit path?", u: "Asking exit routes" },
          { mr: "इथे प्रीपेड टॅक्सी काउंटर आहे का?", tr: "Ithe prepaid taxi counter aahe ka?", en: "Is there a prepaid taxi counter here?", u: "Locating prepaid taxi desk" },
          { mr: "मला रेल्वे बस स्टँडला जायचे आहे.", tr: "Mala railway bus standla jayache aahe.", en: "I want to go to the railway bus stand.", u: "Stating bus depot destination" },
          { mr: "डेक्कन जिमखान्यासाठी किती भाडे होईल?", tr: "Deccan Gymkhanasathi kiti bhade hoil?", en: "How much fare to Deccan Gymkhana?", u: "Asking fare estimation" },
          { mr: "ऑटो कुठे उभी आहे?", tr: "Auto kuthe ubhi aahe?", en: "Where is the auto standing?", u: "Locating auto stand rank" },
          { mr: "रस्ता ओलांडताना काळजी घ्या.", tr: "Rasta olandtana kalji ghya.", en: "Take care while crossing the road.", u: "Warning of road safety" },
          { mr: "चला, गाडीत सामान लोड करा.", tr: "Chala, gaadit saman load kara.", en: "Come, load luggage in the car.", u: "Directing taxi driver" },
          { mr: "इथून स्टेशन किती जवळ आहे?", tr: "Ithun station kiti javal aahe?", en: "How close is the station from here?", u: "Asking distance check" },
          { mr: "हा मुख्य रस्ता आहे.", tr: "Ha mukhya rasta aahe.", en: "This is the main road.", u: "Stating pathway landmarks" },
          { mr: "मी डावीकडे वळतो.", tr: "Mi davikade valto.", en: "I will turn left.", u: "Stating self actions" }
        ],
        [
          { mr: "माझी लाल रंगाची बॅग हरवली आहे.", tr: "Mazi lal rangachi bag haravli aahe.", en: "My red color bag is lost.", u: "Reporting lost bag detail" },
          { mr: "रेल्वे पोलीस ठाणे कुठे आहे?", tr: "Railway police thane kuthe aahe?", en: "Where is the railway police station?", u: "Locating security authority" },
          { mr: "मला चोरीची तक्रार नोंदवायची आहे.", tr: "Mala chorichi takrar nondvaychi aahe.", en: "I want to register a theft complaint.", u: "Filing official complaint form" },
          { mr: "इथे रेल्वे दवाखाना किंवा डॉक्टर आहेत का?", tr: "Ithe railway davakhana kiva doctor aahet ka?", en: "Are there railway clinics or doctors here?", u: "Asking medical assistance" },
          { mr: "मदत केंद्राचा क्रमांक काय आहे?", tr: "Madat kendracha kramank kay aahe?", en: "What is the help desk number?", u: "Requesting helpline contact info" },
          { mr: "माझा मोबाईल सापडला नाही.", tr: "Maza mobile sapadla nahi.", en: "I could not find my mobile phone.", u: "Reporting missing device" },
          { mr: "रेल्वे स्थानकावर आणीबाणी आहे.", tr: "Railway sthanakavar aanibani aahe.", en: "There is an emergency at the railway station.", u: "Declaring critical alert" },
          { mr: "मला डॉक्टरकडे न्या.", tr: "Mala doctorkade nya.", en: "Take me to the doctor.", u: "Requesting immediate care" },
          { mr: "सर्व काही सुरक्षित होईल.", tr: "Sarva kahi surakshit hoil.", en: "Everything will be secure.", u: "Consoling co-passengers" },
          { mr: "मदतीसाठी खूप आभार.", tr: "Madatisathi khup aabhar.", en: "Many thanks for the assistance.", u: "Expressing heartfelt thanks" }
        ]
      ];
    } else if (cId === 'rickshaw') {
      titlesEn = [
        "Hailing & Auto Inquiries",
        "Direction Instructions",
        "Fare & Meter Dialogs",
        "Traffic & Landmark Shortcuts",
        "Shared Rickshaw Etiquette",
        "Breakdowns & Fuel Stops",
        "Digital & Cash Payments",
        "Night Fare Adjustments"
      ];
      titlesHindi = [
        "ऑटो रोकना और पूछताछ",
        "दिशा निर्देश",
        "किराया और मीटर संवाद",
        "यातायात और लैंडमार्क शॉर्टकट",
        "शेयरिंग ऑटो शिष्टाचार",
        "ब्रेकडाउन और फ्यूल स्टॉप",
        "डिजिटल और नकद भुगतान",
        "रात के किराए का समायोजन"
      ];
      descriptions = [
        "Learn to stop an auto and ask if they are ready to go.",
        "Give specific path directions like left, right, or slow down.",
        "Agree on meter fares and understand standard charges.",
        "Communicate shortcuts, bypass routes, and key locations.",
        "Interact politely in shared ride auto settings.",
        "Respond when a rickshaw breaks down or needs refueling.",
        "Handle online scanning (UPI) or cash change settlements.",
        "Understand late night double rates or extra pricing laws."
      ];
      sentenceTemplates = [
        [], // Seeded L1
        [
          { mr: "पुढून डावीकडे वळा.", tr: "Pudhun davikade vala.", en: "Turn left from ahead.", u: "Giving left direction command" },
          { mr: "सिग्नलला उजवीकडे घ्या.", tr: "Signal-la ujavikade ghya.", en: "Take a right at the signal.", u: "Directing right turn at signal" },
          { mr: "गाडी हळू चालवा.", tr: "Gaadi halu chalva.", en: "Drive the vehicle slowly.", u: "Commanding speed control" },
          { mr: "तिथून सरळ जा.", tr: "Tithun saral ja.", en: "Go straight from there.", u: "Commanding straight direction" },
          { mr: "इथे बाजूला थांबा.", tr: "Ithe bajula thamba.", en: "Stop here by the side.", u: "Asking to pull over" },
          { mr: "शॉर्टकटने चला, मला घाई आहे.", tr: "Shortcut-ne chala, mala ghai aahe.", en: "Go by shortcut, I am in a hurry.", u: "Requesting quickest pathway" },
          { mr: "हा रस्ता वन-वे आहे का?", tr: "Ha rasta one-way aahe ka?", en: "Is this road one-way?", u: "Checking traffic rules" },
          { mr: "पुढील चौकात थांबा.", tr: "Pudhil choukat thamba.", en: "Stop at the next intersection.", u: "Directing stop point" },
          { mr: "इथे यू-टर्न घ्या.", tr: "Ithe U-turn ghya.", en: "Take a U-turn here.", u: "Directing U-turn" },
          { mr: "गाडी जपून चालवा, रस्ता खराब आहे.", tr: "Gaadi japun chalva, rasta kharab aahe.", en: "Drive carefully, the road is bad.", u: "Warning of bumpy road" }
        ],
        [
          { mr: "ऑटोचे मीटर चालू करा.", tr: "Autoche meter chalu kara.", en: "Turn on the auto meter.", u: "Asking to start fare meter" },
          { mr: "पन्नास रुपये जादा कशाचे?", tr: "Pannas rupaye jada kashache?", en: "What is the extra fifty rupees for?", u: "Questioning surcharges" },
          { mr: "मीटरचे भाडे किती झाले?", tr: "Meterche bhade kiti jhale?", en: "How much is the meter fare?", u: "Asking final fare check" },
          { mr: "रेल्वे स्टेशनचे दीडशे रुपये बरोबर आहेत का?", tr: "Railway station-che didshe rupaye barobar aahet ka?", en: "Is one hundred fifty rupees for railway station correct?", u: "Verifying standard quote" },
          { mr: "खूप जास्त भाडे सांगत आहात.", tr: "Khup jasta bhade sangat aahat.", en: "You are quoting a very high fare.", u: "Protesting expensive quote" },
          { mr: "कार्ड किंवा ऑनलाईन पेमेंट चालेल का?", tr: "Card kiva online payment chalel ka?", en: "Will card or online payment work?", u: "Checking cashless options" },
          { mr: "भाडे पत्रक दाखवा.", tr: "Bhade patrak dakhava.", en: "Show the rate card chart.", u: "Requesting tariff card verification" },
          { mr: "इतके जास्त पैसे मी देणार नाही.", tr: "Itke jasta paise mi denar nahi.", en: "I will not pay this much money.", u: "Refusing extra charges" },
          { mr: "मीटर कार्ड दाखवा, मगच पैसे देईन.", tr: "Meter card dakhava, magach paise dein.", en: "Show meter card, only then I will pay.", u: "Demanding fare validation" },
          { mr: "भाडे दीडपट होईल का?", tr: "Bhade didpat hoil ka?", en: "Will the fare be one and a half times?", u: "Inquiring about late night multiplier" }
        ],
        [
          { mr: "डेक्कन जिमखान्याकडे चला.", tr: "Deccan Gymkhanya-kade chala.", en: "Go towards Deccan Gymkhana.", u: "Directing auto to a key area" },
          { mr: "स्वारगेट सिग्नलला ट्रॅफिक असेल.", tr: "Swargate signal-la traffic asel.", en: "There will be traffic at Swargate signal.", u: "Warning driver of traffic choke point" },
          { mr: "हायवेने जा, वेळेची बचत होईल.", tr: "Highway-ne ja, velechi bachat hoil.", en: "Go by highway, it will save time.", u: "Suggesting highway bypass" },
          { mr: "पुढील पेट्रोल पंपावर थांबा.", tr: "Pudhil petrol pump-var thamba.", en: "Stop at the next petrol pump.", u: "Directing stop for gas" },
          { mr: "कोरेगाव पार्क मधील मुख्य रस्ता बंद आहे का?", tr: "Koregaon Park madhil mukhya rasta band aahe ka?", en: "Is the main road in Koregaon Park closed?", u: "Checking road blockages" },
          { mr: "बिल्डिंगच्या गेटजवळ थांबा.", tr: "Building-chya gate-javal thamba.", en: "Stop near the building gate.", u: "Pinpointing drop destination" },
          { mr: "इथून शॉर्टकट रस्ता आहे.", tr: "Ithun shortcut rasta aahe.", en: "There is a shortcut road from here.", u: "Directing through shortcuts" },
          { mr: "त्या मंदिराच्या जवळ थांबवा.", tr: "Tya mandirachya javal thambva.", en: "Stop near that temple.", u: "Using religious landmarks for dropping" },
          { mr: "हा रस्ता खूप अरुंद आहे.", tr: "Ha rasta khup arund aahe.", en: "This road is very narrow.", u: "Warning of narrow path" },
          { mr: "पुढे मोठा चौक आहे.", tr: "Pudhe motha chouk aahe.", en: "There is a large junction ahead.", u: "Announcing landmark crossing" }
        ],
        [
          { mr: "शेअरिंग ऑटोमध्ये अजून जागा आहे का?", tr: "Sharing auto-madhe ajun jaga aahe ka?", en: "Is there space left in the sharing auto?", u: "Inquiring share auto occupancy" },
          { mr: "तिसऱ्या सीटवर बसा.", tr: "Tisrya seat-var basa.", en: "Sit on the third seat.", u: "Instructing co-passenger seat allocation" },
          { mr: "तिकीट किंवा सीटचे भाडे किती रुपये आहे?", tr: "Tikit kiva seat-che bhade kiti rupaye aahe?", en: "How many rupees is the ticket or seat fare?", u: "Asking split seat price" },
          { mr: "कृपया थोडे सरका, जागा द्या.", tr: "Krupaya thode sarka, jaga dya.", en: "Please shift a little, give space.", u: "Asking passenger to squeeze" },
          { mr: "भाडे वाटून देऊया.", tr: "Bhade vatun deuya.", en: "Let's split the fare.", u: "Proposing fare split" },
          { mr: "माझे सामान पाठीमागे ठेवा.", tr: "Maze saman pathimage theva.", en: "Keep my luggage at the back.", u: "Asking to load bag in trunk" },
          { mr: "या सीटवर चार जण बसले आहेत.", tr: "Ya seat-var char jan basle aahet.", en: "Four people are sitting on this seat.", u: "Complaining of overcrowding" },
          { mr: "पैसे सुट्टे देऊन भाडे द्या.", tr: "Paise sutte deun bhade dya.", en: "Give the fare with change.", u: "Directing split collection" },
          { mr: "तिकडे गर्दी आहे.", tr: "Tikade gardi aahe.", en: "It is crowded over there.", u: "Stating crowding alerts" },
          { mr: "माझे स्टॉप पुढील चौकात आहे.", tr: "Maze stop pudhil choukat aahe.", en: "My stop is at the next junction.", u: "Announcing drop destination" }
        ],
        [
          { mr: "गाडीत काही बिघाड झाला आहे का?", tr: "Gaadit kahi bighad jhala aahe ka?", en: "Is there some fault in the vehicle?", u: "Checking breakdown details" },
          { mr: "टायर पंक्चर झाला आहे.", tr: "Tyre puncture jhala aahe.", en: "The tire has gone flat.", u: "Reporting flat tyre status" },
          { mr: "दुसरी रिक्षा करावी लागेल का?", tr: "Dusri riksha karavi lagel ka?", en: "Will we need to hire another rickshaw?", u: "Asking alternative transport" },
          { mr: "रिक्षा सुरू होत नाहीये.", tr: "Riksha suru hot nahiye.", en: "The rickshaw is not starting.", u: "Describing start failure" },
          { mr: "मला गॅस भरायचा आहे, दोन मिनिटे थांबा.", tr: "Mula gas bharaycha aahe, don minute thamba.", en: "I need to fill gas, please wait two minutes.", u: "Driver requesting refueling stop" },
          { mr: "सीएनजी पंप कुठे आहे?", tr: "CNG pump kuthe aahe?", en: "Where is the CNG pump?", u: "Locating gas station" },
          { mr: "इथे मेकॅनिक मिळेल का?", tr: "Ithe mechanic milel ka?", en: "Will we get a mechanic here?", u: "Locating garage help" },
          { mr: "मला उशीर होत आहे, मी दुसरी रिक्षा करतो.", tr: "Mala usheer hot aahe, mi dusri riksha karto.", en: "I am getting late, I will hire another rickshaw.", u: "Informing driver of cancellation" },
          { mr: "गाडी बाजूला ढकला.", tr: "Gaadi bajula dhakla.", en: "Push the vehicle to the side.", u: "Asking to push auto off road" },
          { mr: "मदतीसाठी दुसरा ड्रायव्हर बोलावा.", tr: "Madatisathi dusra driver bolava.", en: "Call another driver for help.", u: "Seeking external help" }
        ],
        [
          { mr: "मी गुगल पे करू का?", tr: "Mi Google Pay karu ka?", en: "Should I do Google Pay?", u: "Checking UPI payment option" },
          { mr: "क्युआर कोड दाखवा, मी स्कॅन करतो.", tr: "QR code dakhava, mi scan karto.", en: "Show the QR code, I will scan it.", u: "Asking to scan QR tag" },
          { mr: "माझ्याकडे पाचशे रुपयांची नोट आहे.", tr: "Mazyakade pahanshe rupayanchi note aahe.", en: "I have a five hundred rupee note.", u: "Stating large bill warning" },
          { mr: "सुट्टे शंभर रुपये द्या.", tr: "Sutte shambhar rupaye dya.", en: "Give one hundred rupees change.", u: "Requesting specific change" },
          { mr: "ऑनलाईन पेमेंट यशस्वी झाले.", tr: "Online payment yashasvi jhale.", en: "The online payment was successful.", u: "Confirming transaction success" },
          { mr: "पैसे आले का बघा.", tr: "Paise aale ka bagha.", en: "Check if the money has arrived.", u: "Asking driver to verify receipt" },
          { mr: "माझ्याकडे सुट्टे पैसे नाहीत.", tr: "Mazyakade sutte paise nahit.", en: "I do not have change.", u: "Warning of lack of change" },
          { mr: "उरलेले पैसे तुमच्याकडेच ठेवा.", tr: "Uralele paise tumchyakadech theva.", en: "Keep the change with you.", u: "Offering tip to driver" },
          { mr: "नेटवर्क नाहीये, पेमेंट थांबले आहे.", tr: "Network nahiye, payment thamble aahe.", en: "There is no network, payment is stuck.", u: "Reporting network transaction issues" },
          { mr: "मी रोख पैसे देतो.", tr: "Mi rokh paise deto.", en: "I will pay cash.", u: "Settling in paper bills" }
        ],
        [
          { mr: "रात्रीचे भाडे दीडपट होईल का?", tr: "Ratriche bhade didpat hoil ka?", en: "Will the night fare be one and a half times?", u: "Verifying night rate multipier" },
          { mr: "रात्री अकरा नंतर जादा भाडे लागते.", tr: "Ratri akra nantar jada bhade lagte.", en: "Extra fare applies after eleven at night.", u: "Explaining late night rules" },
          { mr: "खूप रात्र झाली आहे, रिक्षा मिळेल का?", tr: "Khup ratra jhali aahe, riksha milel ka?", en: "It is very late night, will I get a rickshaw?", u: "Checking late transit" },
          { mr: "माझे संरक्षण महत्त्वाचे आहे.", tr: "Maze sanrakshan mahattvache aahe.", en: "My safety/protection is important.", u: "Stating safety priority" },
          { mr: "रात्रीचे ऑटोचे मीटर वेगळे असते का?", tr: "Ratriche autoche meter vegale aste ka?", en: "Is the auto meter different at night?", u: "Checking night meter rules" },
          { mr: "जास्त भाडे मागू नका, नियम पाळा.", tr: "Jasta bhade magu naka, niyam pala.", en: "Do not ask for excessive fare, follow rules.", u: "Insisting on legal tariffs" },
          { mr: "पोलीस चौकी जवळ आहे का?", tr: "Police chowki javal aahe ka?", en: "Is the police post nearby?", u: "Asking police locations at night" },
          { mr: "रात्रीचे भाडे शंभर रुपये वाढले आहे.", tr: "Ratriche bhade shambhar rupaye vadhle aahe.", en: "The night fare is increased by one hundred rupees.", u: "Explaining fixed night markup" },
          { mr: "सुरक्षित घरी पोहोचलो.", tr: "Surakshit ghari pohochlo.", en: "Reached home safely.", u: "Reporting safe return" },
          { mr: "रात्रीच्या सेवेसाठी धन्यवाद.", tr: "Ratrichya sevesathi धन्यवाद.", en: "Thank you for the night service.", u: "Polite night sign-off" }
        ]
      ];
    } else if (cId === 'watchman') {
      titlesEn = [
        "Visitor Check & ID",
        "Delivery & Package Drops",
        "Parking & Vehicle Bounds",
        "Emergency Commands",
        "Flat Intercom Conversations",
        "Shift Handovers & Locking",
        "Maintenance & Plumber Access",
        "Society Events & Guest Lists"
      ];
      titlesHindi = [
        "आगंतुक जाँच और पहचान पत्र",
        "डिलीवरी और पार्सल ड्रॉप",
        "पार्किंग और वाहन सीमाएँ",
        "आपातकालीन आदेश",
        "फ्लैट इंटरकॉम बातचीत",
        "शिफ्ट हैंडओवर और लॉकिंग",
        "रखरखाव और प्लंबर पहुंच",
        "सोसाइटी इवेंट और अतिथि सूची"
      ];
      descriptions = [
        "Learn to request name and ID validation from visitors.",
        "Direct delivery executives where to drop off packages.",
        "Guide parking spots and ask to clear double park lanes.",
        "Alert residents during fire, theft, or suspicious actions.",
        "Confirm entries by calling flat intercom lines.",
        "Perform shift changes, lock entry gates, and secure key safes.",
        "Manage entry of maintenance workers and service personnel.",
        "Coordinate guest arrivals during society parties or meetings."
      ];
      sentenceTemplates = [
        [], // Seeded L1
        [
          { mr: "पार्सल गेटवर ठेवा.", tr: "Parcel gate-var theva.", en: "Keep the parcel at the gate.", u: "Directing package drop" },
          { mr: "डिलीवरी बॉयचे नाव काय आहे?", tr: "Delivery boy-che naav kay aahe?", en: "What is the delivery boy's name?", u: "Inquiring delivery details" },
          { mr: "कृपया ओटीपी सांगा.", tr: "Krupaya OTP sanga.", en: "Please tell the OTP.", u: "Requesting package verification code" },
          { mr: "फ्लॅट नंबर चारशे दोन मध्ये जा.", tr: "Flat number charshe don madhe ja.", en: "Go to flat number four hundred two.", u: "Directing to target flat" },
          { mr: "रजिस्टरमध्ये सही करा.", tr: "Register-madhe sahi kara.", en: "Sign in the register.", u: "Demanding signature entry" },
          { mr: "सामान सुरक्षेसाठी स्कॅन करा.", tr: "Saman surakshesathi scan kara.", en: "Scan the luggage for security.", u: "Requesting baggage check" },
          { mr: "बिल्डिंग क्रमांक सी मध्ये लिफ्ट चालू आहे.", tr: "Building kramank C madhe lift chalu aahe.", en: "The lift is working in building C.", u: "Confirming elevator status" },
          { mr: "कुरिअर बॉक्स तिथे ठेवा.", tr: "Courier box tithe theva.", en: "Keep the courier box there.", u: "Directing box drop location" },
          { mr: "कचरा बाहेर टाका.", tr: "Kachra baher taka.", en: "Throw the trash outside.", u: "Sanitation instructions" },
          { mr: "पॅकेज स्वीकारले आहे.", tr: "Package swikarle aahe.", en: "The package has been accepted.", u: "Confirming receipt" }
        ],
        [
          { mr: "इथे गाडी लावण्यास सक्त मनाई आहे.", tr: "Ithe gaadi lavnyas sakta manai aahe.", en: "Parking vehicle here is strictly prohibited.", u: "Stating parking ban rule" },
          { mr: "गाडी बाजूला घ्या, रस्ता अडवला आहे.", tr: "Gaadi bajula ghya, rasta adavla aahe.", en: "Move the vehicle aside, the road is blocked.", u: "Directing clearance of lane" },
          { mr: "टू-व्हीलर डाव्या बाजूला पार्क करा.", tr: "Two-wheeler davya bajula park kara.", en: "Park two-wheelers on the left side.", u: "Directing two-wheeler bay" },
          { mr: "माझे पार्किंगचे आरक्षित स्थान कुठे आहे?", tr: "Maze parking-che aarakshit sthan kuthe aahe?", en: "Where is my reserved parking spot?", u: "Resident asking for parking slot" },
          { mr: "इथे नो-पार्किंग बोर्ड लावला आहे.", tr: "Ithe no-parking board lavla aahe.", en: "No-parking board is placed here.", u: "Highlighting restriction signs" },
          { mr: "गाडीचा नंबर काय आहे?", tr: "Gaadicha number kay aahe?", en: "What is the vehicle number?", u: "Asking license number check" },
          { mr: "गेटजवळ गाडी लावू नका.", tr: "Gate-javal gaadi lavu naka.", en: "Do not park the vehicle near the gate.", u: "Asking to keep entry clear" },
          { mr: "ही पाहुण्यांची पार्किंग आहे.", tr: "Hi pahunyanchi parking aahe.", en: "This is visitors' parking.", u: "Directing guest parking area" },
          { mr: "गाडी लॉक केली आहे का?", tr: "Gaadi lock keli aahe ka?", en: "Is the vehicle locked?", u: "Checking vehicle lock security" },
          { mr: "कृपया चावी जमा करा.", tr: "Krupaya chavi jama kara.", en: "Please deposit the key.", u: "Asking to submit ignition keys" }
        ],
        [
          { mr: "सुरक्षा अलार्म वाजत आहे, बाहेर या.", tr: "Suraksha alarm vajat aahe, baher ya.", en: "The security alarm is ringing, come out.", u: "Urging evacuation during alarm" },
          { mr: "इथे आग लागली आहे, अग्निशामक दलाला बोलवा.", tr: "Ithe aag lagli aahe, agnishamak dalala bolava.", en: "Fire has broken out here, call the fire brigade.", u: "Calling fire services" },
          { mr: "गेट ताबडतोब बंद करा.", tr: "Gate tabadtob band kara.", en: "Close the gate immediately.", u: "Ordering lockdown" },
          { mr: "पोलीसांना फोन करा, चोरी झाली आहे.", tr: "Policanna phone kara, chori jhali aahe.", en: "Call the police, a theft has occurred.", u: "Asking to call police" },
          { mr: "काहीतरी संशयास्पद आहे.", tr: "Kahitari sanshayaspad aahe.", en: "Something is suspicious.", u: "Warning of suspicious activity" },
          { mr: "काळजी घ्या, गेट लॉक आहे.", tr: "Kalji ghya, gate lock aahe.", en: "Take care, the gate is locked.", u: "Reassuring residents" },
          { mr: "बाहेर पडण्याचा मार्ग रिकामा करा.", tr: "Baher padnyacha marg rikama kara.", en: "Clear the emergency exit pathway.", u: "Commanding exit clearance" },
          { mr: "लवकर चला, संकट आहे.", tr: "Lavkar chala, sankat aahe.", en: "Hurry up, there is danger.", u: "Urgent call for action" },
          { mr: "सुरक्षित ठिकाणी थांबा.", tr: "Surakshit thikani thamba.", en: "Stop at a safe place.", u: "Directing to safety zone" },
          { mr: "अनोळखी व्यक्तीला प्रवेश देऊ नका.", tr: "Anolkhi vyaktila pravesh deu naka.", en: "Do not give entry to strangers.", u: "Stating security rule" }
        ],
        [
          { mr: "मी फ्लॅटमध्ये इंटरकॉमवर बोलतो.", tr: "Mi flat-madhe intercom-var bolto.", en: "I will speak on the flat intercom.", u: "Resident confirmation process" },
          { mr: "पाहुणे आले आहेत, त्यांचे नाव काय?", tr: "Pahune aale aahet, tyanche naav kay?", en: "Guests have arrived, what is their name?", u: "Inquiring about visitor details" },
          { mr: "फ्लॅट क्रमांक तीनशे एकचे बटन दाबा.", tr: "Flat kramank 301-che button daba.", en: "Press the button for flat 301.", u: "Directing intercom panel use" },
          { mr: "त्यांनी फोन उचलला नाही.", tr: "Tyanni phone uchalla nahi.", en: "They did not pick up the phone.", u: "Reporting call failure" },
          { mr: "प्रवेश मिळाला आहे, तुम्ही जाऊ शकता.", tr: "Pravesh milala aahe, tumhi jau shakta.", en: "Entry is approved, you can go.", u: "Granting visitor access" },
          { mr: "पलीकडच्या बिल्डिंगचा फोन येत आहे.", tr: "Palikadchya building-cha phone yet aahe.", en: "A call is coming from the adjacent building.", u: "Handling intercom call" },
          { mr: "कृपया पाच मिनिटे थांबा, ते खात्री करत आहेत.", tr: "Krupaya pach minute thamba, te khatri karat aahet.", en: "Please wait five minutes, they are verifying.", u: "Asking guest to wait" },
          { mr: "साहेबांनी तुम्हाला नाकारले आहे.", tr: "Sahebanni tumhala nakarle aahe.", en: "The owner has declined you access.", u: "Refusing entry post verification" },
          { mr: "इंटरनेट किंवा फोन लाईन बंद आहे का?", tr: "Internet kiva phone line band aahe ka?", en: "Is the internet or phone line down?", u: "Checking intercom malfunction" },
          { mr: "फ्लॅट मधून होकार आला आहे.", tr: "Flat madhun hokar aala aahe.", en: "Affirmative response received from flat.", u: "Confirming resident approval" }
        ],
        [
          { mr: "माझी शिफ्ट संपली आहे, मी घरी चाललो.", tr: "Mazi shift sampli aahe, mi ghari challo.", en: "My shift is over, I am going home.", u: "Declaring shift end" },
          { mr: "गेटच्या किल्ल्या अलमारीत आहेत.", tr: "Gate-chya killya almarit aahet.", en: "The gate keys are in the cupboard.", u: "Handing over keys to next guard" },
          { mr: "रात्रीच्या राउंडची वेळ झाली आहे.", tr: "Ratrichya round-chi vel jhali aahe.", en: "It is time for the night patrol rounds.", u: "Stating night watch schedule" },
          { mr: "सर्व कुलूपे नीट तपासा.", tr: "Sarva kulupe neet tapasa.", en: "Check all locks properly.", u: "Instructing lock inspections" },
          { mr: "नवीन गार्ड उद्या सकाळी येईल.", tr: "Navin guard udya sakali yeil.", en: "The new guard will arrive tomorrow morning.", u: "Informing shift roster update" },
          { mr: "दुसऱ्या गेटवर कोण उभा आहे?", tr: "Dusrya gate-var kon ubha aahe?", en: "Who is standing at the other gate?", u: "Inquiring about other guard post" },
          { mr: "रात्रीचे रजिस्टर जमा करा.", tr: "Ratriche register jama kara.", en: "Submit the night register books.", u: "Archiving gate entries" },
          { mr: "अकरा वाजता मुख्य गेट बंद करायचे आहे.", tr: "Akra vajta mukhya gate band karayache aahe.", en: "The main gate is to be closed at eleven.", u: "Stating gate closing time" },
          { mr: "सर्व काही व्यवस्थित आहे.", tr: "Sarva kahi vyavasthit aahe.", en: "Everything is in order.", u: "Giving shift status report" },
          { mr: "पुढील शिफ्ट दोन तासांनी सुरू होईल.", tr: "Pudhil shift don taasanni suru hoil.", en: "The next shift starts in two hours.", u: "Stating roster timing" }
        ],
        [
          { mr: "प्लंबर फ्लॅट दोनशे तीन मध्ये चालला आहे.", tr: "Plumber flat 203 madhe challa aahe.", en: "The plumber is going to flat 203.", u: "Announcing technician destination" },
          { mr: "सफाई कामगारांचे कार्ड दाखवा.", tr: "Safai kamgaranche card dakhava.", en: "Show the sweeper's ID card.", u: "Verifying service provider card" },
          { mr: "काम पूर्ण झाले का?", tr: "Kam purna jhale ka?", en: "Is the work completed?", u: "Inquiring task completion" },
          { mr: "इथे कचरा उघड्यावर टाकू नका.", tr: "Ithe kachra ughadyavar taku naka.", en: "Do not throw trash in the open here.", u: "Instructing vendor trash rule" },
          { mr: "त्यांना काम सुरू करू द्या.", tr: "Tyanna kam suru kuru dya.", en: "Let them start the work.", u: "Authorizing work initiation" },
          { mr: "बिल्डिंग मेंटेनन्स भरायचा आहे का?", tr: "Building maintenance bharaycha aahe ka?", en: "Do we need to pay building maintenance?", u: "Inquiring about maintenance dues" },
          { mr: "इलेक्ट्रिशियन गेटवर वाट पाहत आहे.", tr: "Electrician gate-var vaat pahat aahe.", en: "The electrician is waiting at the gate.", u: "Stating vendor arrival alert" },
          { mr: "काम करताना सुरक्षा साधने वापरा.", tr: "Kam kartana suraksha sadhane vapra.", en: "Use safety equipment while working.", u: "Instructing safety norms" },
          { mr: "हे दुरुस्तीचे काम आहे.", tr: "He durustiche kam aahe.", en: "This is a repair job.", u: "Describing work type" },
          { mr: "मेंटेनन्स भरल्याची पावती दाखवा.", tr: "Maintenance bharalyachi pavati dakhava.", en: "Show the maintenance payment receipt.", u: "Demanding receipt proof" }
        ],
        [
          { mr: "आज सोसायटीत गणेशोत्सव साजरा होणार आहे.", tr: "Aaj society-t Ganeshotsav sajra honar aahe.", en: "Today Ganeshotsav will be celebrated in the society.", u: "Announcing community festival" },
          { mr: "पाहुण्यांच्या नावांची यादी कुठे आहे?", tr: "Pahunyanchya navanchi yaadi kuthe aahe?", en: "Where is the list of guest names?", u: "Requesting event invite list" },
          { mr: "पार्किंग पार्किंग झोनमध्येच करा.", tr: "Parking parking zone-madhech kara.", en: "Do parking in the parking zone only.", u: "Instructing event parking directions" },
          { mr: "इथे गेटपास गोळा करा.", tr: "Ithe gatepass gola kara.", en: "Collect the gatepass here.", u: "Managing guest pass returns" },
          { mr: "सोसायटीची बैठक संध्याकाळी आहे.", tr: "Society-chi baithak sandhyakali aahe.", en: "The society meeting is in the evening.", u: "Announcing community meeting" },
          { mr: "पाहुण्यांचे स्वागत करा.", tr: "Pahunyanche svagat kara.", en: "Welcome the guests.", u: "Polite greeting advice" },
          { mr: "रात्री दहा नंतर संगीत बंद करा.", tr: "Ratri daha nantar sangeet band kara.", en: "Turn off the music after ten at night.", u: "Stating noise compliance rules" },
          { mr: "सगळे पाहुणे सुरक्षित पोहोचले.", tr: "Sagale pahune surakshit pohochle.", en: "All guests arrived safely.", u: "Confirming guest logs clear" },
          { mr: "पुढील कार्यक्रमाची तारीख काय आहे?", tr: "Pudhil karyakramachi tarikh kay aahe?", en: "What is the date of the next event?", u: "Asking community event date" },
          { mr: "सहकार्याबद्दल धन्यवाद.", tr: "Sahakaryabaddal धन्यवाद.", en: "Thank you for the cooperation.", u: "Ending polite event log" }
        ]
      ];
    } else if (cId === 'office') {
      titlesEn = [
        "Counters & Forms Inquiries",
        "Document Attestations",
        "Lunch Break & Timings",
        "Application Fees & Challan",
        "Meeting the Desk Officer",
        "File Processing & Delays",
        "Biometric & Digital Services",
        "Approvals & Stamps Obtain"
      ];
      titlesHindi = [
        "काउंटर और फॉर्म पूछताछ",
        "दस्तावेज सत्यापन और सत्यापन",
        "लंच ब्रेक और कार्यालय समय",
        "आवेदन शुल्क और चालान",
        "डेस्क अधिकारी से मुलाकात",
        "फ़ाइल प्रसंस्करण और विलंब",
        "बायोमेट्रिक और डिजिटल सेवाएँ",
        "स्वीकृति और मोहर प्राप्त करना"
      ];
      descriptions = [
        "Learn how to fetch application forms and locate counters.",
        "Request document verification, xerox copies, and signatures.",
        "Navigate lunch hour constraints and inquire on operating hours.",
        "Learn to pay fees at the cash counter and get receipts.",
        "Ask permission to meet the chief officer at the desk.",
        "Handle delays in file clearance and ask follow-up questions.",
        "Register thumbprints and verify digital card scanner inputs.",
        "Secure official signature approvals and seal stamps."
      ];
      sentenceTemplates = [
        [], // Seeded L1
        [
          { mr: "ही कागदपत्रे मूळ प्रतींशी जुळवून घ्या.", tr: "Hi kagadpatre mool pratishi julvun ghya.", en: "Match these documents with the original copies.", u: "Requesting document verification" },
          { mr: "या अर्जासोबत झेरॉक्स प्रत जोडा.", tr: "Ya arjasobat xerox prat joda.", en: "Attach a xerox copy with this application.", u: "Asking for photocopies" },
          { mr: "स्वाक्षरी किंवा सही कुठे करायची?", tr: "Swakshari kiva sahi kuthe karayachi?", en: "Where should I sign or put the signature?", u: "Inquiring signature position" },
          { mr: "माझे आधार कार्ड जोडायचे आहे का?", tr: "Maze Aadhar Card jodayache aahe ka?", en: "Do I need to link my Aadhar Card?", u: "Asking for ID linkage requirement" },
          { mr: "सर्व कागदपत्रे बरोबर आहेत का?", tr: "Sarva kagadpatre barobar aahet ka?", en: "Are all documents correct?", u: "Checking document sufficiency" },
          { mr: "राजपत्रित अधिकाऱ्याची सही पाहिजे.", tr: "Rajpatrit adhikaryachi sahi pahije.", en: "Signature of a gazetted officer is required.", u: "Inquiring about attestation rules" },
          { mr: "माझ्या कागदपत्रांचे प्रमाणीकरण करा.", tr: "Mazya kagadpatranche pramanikaran kara.", en: "Attest/verify my documents.", u: "Asking official verification" },
          { mr: "मूळ कागदपत्रे तिथे दाखवा.", tr: "Mool kagadpatre tithe dakhava.", en: "Show the original documents there.", u: "Directing showing of originals" },
          { mr: "एक कागद कमी आहे.", tr: "Ek kagad kami aahe.", en: "One document is missing.", u: "Reporting document deficiency" },
          { mr: "दस्तावेज जुळले आहेत.", tr: "Dastavej julle aahet.", en: "Documents match correctly.", u: "Confirming documents verify" }
        ],
        [
          { mr: "आता लंच ब्रेक आहे, एक वाजता या.", tr: "Aata lunch break aahe, ek vajta ya.", en: "It is lunch break now, come at one o'clock.", u: "Informing visitor of lunch recess" },
          { mr: "कार्यालय कधी उघडेल?", tr: "Karyalay kadhi ughedel?", en: "When will the office open?", u: "Asking office opening timings" },
          { mr: "शनिवारी आणि रविवारी सुट्टी असते का?", tr: "Shanivari ani ravivari sutti aste ka?", en: "Is there a holiday on Saturday and Sunday?", u: "Checking weekend status" },
          { mr: "कार्यालय बंद होण्याची वेळ काय आहे?", tr: "Karyalay band honyachi vel kay aahe?", en: "What is the closing time of the office?", u: "Inquiring closing time" },
          { mr: "उद्या कार्यालय सुरू राहील का?", tr: "Udya karyalay suru rahil ka?", en: "Will the office remain open tomorrow?", u: "Checking next day operations" },
          { mr: "दुपारची सुट्टी किती वेळ असते?", tr: "Duparchi sutti kiti vel aste?", en: "How long is the afternoon break?", u: "Asking break length" },
          { mr: "मी वेळेवर पोहोचलो.", tr: "Mi velevar pohochlo.", en: "I reached on time.", u: "Informing arrival status" },
          { mr: "कार्यालय आज बंद आहे.", tr: "Karyalay aaj band aahe.", en: "The office is closed today.", u: "Informing office closure today" },
          { mr: "वेळापत्रक तिथे लावले आहे.", tr: "Velapatrak tithe lavle aahe.", en: "The schedule timetable is put up there.", u: "Locating office timings board" },
          { mr: "उद्या सकाळी नऊ वाजता या.", tr: "Udya sakali nau vajta ya.", en: "Come tomorrow morning at nine.", u: "Suggesting morning visit" }
        ],
        [
          { mr: "अर्ज फी कुठे भरायची?", tr: "Arj fee kuthe bharaychi?", en: "Where to pay the application fee?", u: "Locating cash counter" },
          { mr: "मला चलनाची पावती द्या.", tr: "Mala challan-chi pavati dya.", en: "Give me the challan receipt.", u: "Asking for receipt proof" },
          { mr: "फी भरण्याची अंतिम तारीख काय आहे?", tr: "Fee bharnyachi antim tarikh kay aahe?", en: "What is the last date to pay fees?", u: "Inquiring about deadlines" },
          { mr: "एकूण शुल्क किती रुपये होईल?", tr: "Ekun shulka kiti rupaye hoil?", en: "How many rupees is the total fee?", u: "Inquiring about total dues" },
          { mr: "ऑनलाईन चलन भरता येईल का?", tr: "Online challan bharta yeil ka?", en: "Can we pay the challan online?", u: "Asking about e-challan options" },
          { mr: "कॅश काउंटर बंद आहे.", tr: "Cash counter band aahe.", en: "The cash counter is closed.", u: "Stating cash desk closed status" },
          { mr: "ही पावती जपून ठेवा.", tr: "Hi pavati japun theva.", en: "Keep this receipt carefully.", u: "Warning visitor to secure receipt" },
          { mr: "मला परतावा हवा आहे.", tr: "Mala partava hava aahe.", en: "I want a refund.", u: "Requesting refund" },
          { mr: "दुरुस्तीसाठी वेगळी फी लागेल.", tr: "Durustisathi vegali fee lagel.", en: "A separate fee is charged for correction.", u: "Stating extra penalty rates" },
          { mr: "शुल्क यशस्वीरित्या भरले गेले आहे.", tr: "Shulka yashasviritya bharle gele aahe.", en: "The fee has been successfully paid.", u: "Confirming payment check" }
        ],
        [
          { mr: "मी साहेबांना भेटू शकतो का?", tr: "Mi sahebanna bhetu shakto ka?", en: "Can I meet the officer?", u: "Asking permission to enter cabin" },
          { mr: "साहेब बैठकीत व्यग्र आहेत, बाहेर थांबा.", tr: "Saheb baithakit vyagra aahet, baher thamba.", en: "The officer is busy in a meeting, wait outside.", u: "Directing visitor to waiting area" },
          { mr: "माझे नाव अमोल असून मला सही हवी आहे.", tr: "Maze naav Amol asun mala sahi havi aahe.", en: "My name is Amol, and I need a signature.", u: "Stating visit objective" },
          { mr: "साहेबांची सही कधी मिळेल?", tr: "Sahebanchi sahi kadhi milel?", en: "When will the officer's signature be available?", u: "Asking for signature availability" },
          { mr: "आत जाण्याची परवानगी द्या.", tr: "Aat janyachi parvanagi dya.", en: "Give permission to go inside.", u: "Asking permission" },
          { mr: "माझ्या फाईलवर स्वाक्षरी झाली का?", tr: "Mazya file-var swakshari jhali ka?", en: "Is my file signed?", u: "Asking signature updates" },
          { mr: "कृपया शांतता राखा, बाहेर प्रतीक्षा कक्ष आहे.", tr: "Krupaya shantata rakha, baher pratiksha kaksha aahe.", en: "Please keep quiet, there is a waiting room outside.", u: "Commanding silent waiting behavior" },
          { mr: "ते दुपारी दोन वाजता भेटतील.", tr: "Te dupari don vajta bhetatil.", en: "They will meet at two in the afternoon.", u: "Stating meeting hours" },
          { mr: "हे मुख्य टेबल आहे.", tr: "He mukhya table aahe.", en: "This is the main desk table.", u: "Pinpointing principal office spot" },
          { mr: "मला परवानगी मिळाली नाही.", tr: "Mala parvanagi milali nahi.", en: "I did not get permission.", u: "Reporting access rejection" }
        ],
        [
          { mr: "माझी फाईल कुठे अडकली आहे?", tr: "Mazi file kuthe adakli aahe?", en: "Where is my file stuck?", u: "Inquiring about stuck workflow" },
          { mr: "फाईल मंजुरीसाठी पुढे पाठवली आहे.", tr: "File manjurisathi pudhe pathavli aahe.", en: "The file is sent forward for approval.", u: "Stating file transit update" },
          { mr: "काही आठवड्यांचा वेळ लागेल.", tr: "Kahi aathvadyancha vel lagel.", en: "It will take a few weeks.", u: "Stating delayed timeline estimations" },
          { mr: "फाईल नंबर काय आहे?", tr: "File number kay aahe?", en: "What is the file number?", u: "Asking file reference code" },
          { mr: "फाईल हरवली आहे का?", tr: "File haravli aahe ka?", en: "Is the file lost?", u: "Checking lost paperwork status" },
          { mr: "पुढील आठवड्यात सोमवारी या.", tr: "Pudhil aathvadyat Somvari ya.", en: "Come next week on Monday.", u: "Suggesting next week follow up" },
          { mr: "काम लवकर होणे गरजेचे आहे.", tr: "Kam lavkar hone garjeche aahe.", en: "It is necessary to get the work done quickly.", u: "Urging faster progress" },
          { mr: "फाईलवर काम सुरू आहे.", tr: "Filevar kam suru aahe.", en: "Work is ongoing on the file.", u: "Reassuring progress" },
          { mr: "कृपया माझी अडचण समजून घ्या.", tr: "Krupaya mazi adchan samajun ghya.", en: "Please understand my problem.", u: "Asking for human concern" },
          { mr: "प्रक्रिया अजून सुरूच आहे.", tr: "Prakriya ajun suruch aahe.", en: "The process is still ongoing.", u: "Explaining queue delays" }
        ],
        [
          { mr: "बायोमेट्रिक मशीनवर अंगठा ठेवा.", tr: "Biometric machine-var angtha theva.", en: "Put the thumb on the biometric machine.", u: "Directing fingerprint registration" },
          { mr: "ऑनलाईन पोर्टलवर अर्ज भरा.", tr: "Online portal-var arj bhara.", en: "Fill out the application on the online portal.", u: "Asking to use web portal" },
          { mr: "डिजिटल ओळखपत्र स्कॅन करा.", tr: "Digital olakhpatra scan kara.", en: "Scan the digital ID card.", u: "Directing ID scanner validation" },
          { mr: "सर्व्हर डाऊन असल्यामुळे मशीन बंद आहे.", tr: "Server down aslyamule machine band aahe.", en: "The machine is shut due to server down.", u: "Explaining tech breakdown" },
          { mr: "माझे नोंदणीकृत बायोमेट्रिक जुळत नाही.", tr: "Maze nondnigrut biometric julat nahi.", en: "My registered biometrics do not match.", u: "Reporting matching error" },
          { mr: "संगणकावर नोंदणी करा.", tr: "Sanganakavar nondni kara.", en: "Register on the computer.", u: "Directing computer entry" },
          { mr: "माहिती ऑनलाईन सबमिट झाली आहे.", tr: "Mahiti online submit jhali aahe.", en: "Information has been submitted online.", u: "Confirming submit check" },
          { mr: "सिस्टीममध्ये काही तांत्रिक बिघाड आहे.", tr: "System-madhe kahi tantrik bighad aahe.", en: "There is some technical glitch in the system.", u: "Stating software outage" },
          { mr: "तुमचा ईमेल पुन्हा तपासा.", tr: "Tumcha email punha tapasa.", en: "Check your email again.", u: "Suggesting email check" },
          { mr: "बायोमेट्रिक यशस्वी झाले.", tr: "Biometric yashasvi jhale.", en: "Biometrics succeeded.", u: "Confirming identity verify success" }
        ],
        [
          { mr: "फाईलला अंतिम मंजुरी मिळाली आहे.", tr: "File-la antim manjuri milali aahe.", en: "The file has obtained final approval.", u: "Announcing final clearance" },
          { mr: "स्वाक्षरी झाली असून शिक्का मारायचा आहे.", tr: "Swakshari jhali asun shikka maraycha aahe.", en: "Signature is done, seal has to be stamped.", u: "Stating next stamping step" },
          { mr: "या मंजुरीची मुख्य प्रत कुठे आहे?", tr: "Ya manjurichi mukhya prat kuthe aahe?", en: "Where is the main copy of this approval?", u: "Asking original certificate location" },
          { mr: "माझे प्रमाणपत्र तयार आहे का?", tr: "Maze pramanpatra tayar aahe ka?", en: "Is my certificate ready?", u: "Checking document collection status" },
          { mr: "शिक्का मारण्याचे किती पैसे लागतील?", tr: "Shikka maranyache kiti paise lagtil?", en: "How much will it cost to get the stamp?", u: "Checking processing charges" },
          { mr: "यावर गोल शिक्का मारा.", tr: "Yavar gol shikka mara.", en: "Put a round seal stamp on this.", u: "Directing stamp type" },
          { mr: "सर्व सह्या पूर्ण झाल्या आहेत.", tr: "Sarva sahya purna jhala aahet.", en: "All signatures are completed.", u: "Confirming paperwork finality" },
          { mr: "तुमची फाईल मंजूर झाली, अभिनंदन!", tr: "Tumchi file manjur jhali, abhinandan!", en: "Your file is approved, congratulations!", u: "Wishing visitor success" },
          { mr: "काम पूर्ण झाल्याबद्दल खूप आनंद झाला.", tr: "Kam purna jhalyabaddal khup anand jhala.", en: "Very happy that the work is finished.", u: "Expressing mutual relief" },
          { mr: "कार्यालयाचे आभार.", tr: "Karyalayache aabhar.", en: "Thanks to the office.", u: "Polite exit thank you" }
        ]
      ];
    }

    for (let i = 1; i <= totalModules; i++) {
      const moduleId = `mod_${cId}_${i}`;

      modules.push({
        id: moduleId,
        courseId: cId,
        moduleNumber: i,
        titleEn: titlesEn[i - 1],
        titleHindi: titlesHindi[i - 1],
        descriptionEn: descriptions[i - 1],
        learningObjective: `Master ${titlesEn[i - 1]} (${titlesHindi[i - 1]})`,
        xp: 50,
        estimatedMinutes: 60,
        isUnlocked: i === 1, // First module unlocked
        isCompleted: false
      });

      // Fetch sentences
      let modSentences: { mr: string; tr: string; en: string; u?: string }[] = [];
      if (i === 1) {
        modSentences = SITUATIONAL_L1_SENTENCES[cId];
      } else {
        modSentences = sentenceTemplates[i - 1] || [];
      }

      modSentences.forEach((s, idx) => {
        sentences.push({
          id: `sent_${cId}_${i}_${idx}`,
          moduleId,
          marathi_text: s.mr,
          transliteration: s.tr,
          english_meaning: s.en,
          usage_note: s.u || `Key conversational sentence for ${titlesEn[i - 1]}`
        });
      });
    }
  });

  return { modules, sentences };
}

// Combines General and Situational courses
export function generateAllCoursesModulesAndSentences() {
  const { modules: sitModules, sentences: sitSentences } = generateSituationalModulesAndSentences();

  const generalModules: ModuleModel[] = [];
  const generalSentences: SentenceModel[] = [];

  journeyModulesData.forEach((mod) => {
    const moduleId = `mod_general_${mod.moduleNumber}`;

    if (mod.moduleNumber <= 15) {
      const seedMod = SEED_MODULES.find(m => m.id === mod.moduleNumber);
      if (seedMod) {
        generalModules.push({
          id: moduleId,
          courseId: 'general',
          moduleNumber: mod.moduleNumber,
          titleEn: seedMod.title,
          titleHindi: mod.titleHindi,
          descriptionEn: mod.descriptionEn,
          learningObjective: mod.learningObjective,
          xp: mod.xp,
          estimatedMinutes: seedMod.estimated_minutes,
          isUnlocked: mod.moduleNumber <= 3, // First 3 unlocked
          isCompleted: mod.moduleNumber === 1 // First completed
        });

        seedMod.items.forEach((item, idx) => {
          generalSentences.push({
            id: `sent_general_${mod.moduleNumber}_${idx}`,
            moduleId,
            marathi_text: item.marathi_text,
            transliteration: item.transliteration,
            english_meaning: item.english_meaning,
            usage_note: item.usage_note
          });
        });
        return;
      }
    }

    generalModules.push({
      id: moduleId,
      courseId: 'general',
      moduleNumber: mod.moduleNumber,
      titleEn: mod.titleEn,
      titleHindi: mod.titleHindi,
      descriptionEn: mod.descriptionEn,
      learningObjective: mod.learningObjective,
      xp: mod.xp,
      estimatedMinutes: mod.estimatedMinutes,
      isUnlocked: mod.moduleNumber <= 3, // First 3 unlocked
      isCompleted: mod.moduleNumber === 1 // First completed
    });

    // 1. Add phrases from the module
    mod.phrases.forEach((ph, idx) => {
      generalSentences.push({
        id: `sent_general_${mod.moduleNumber}_ph_${idx}`,
        moduleId,
        marathi_text: ph.mr,
        transliteration: ph.ipa || ph.mr,
        english_meaning: ph.en,
        usage_note: `Key conversational phrase for ${mod.titleEn}`
      });
    });

    // 2. Add sentences derived from vocabulary
    mod.vocabulary.forEach((voc, idx) => {
      let marathi = '';
      let english = '';
      let translit = '';
      let usage = `Usage of the word "${voc.en}"`;

      const t = voc.en.toLowerCase();
      const m = voc.mr;

      if (t.includes("vowel") || t.includes("consonant") || t.includes("sound")) {
        marathi = `हा मराठीतील ${m} ध्वनी आहे.`;
        english = `This is the ${voc.en} sound in Marathi.`;
        translit = `Hā marāṭhītīl ${voc.mr} dhvanī āhe.`;
        usage = `Pronunciation of basic alphabet`;
      } else if (t.includes("mother") || t.includes("father") || t.includes("brother") || t.includes("sister") || t.includes("family")) {
        marathi = `ते माझे ${m} आहेत.`;
        english = `They are my ${voc.en}.`;
        translit = `Te mājhe ${voc.mr} āhet.`;
        usage = `Introducing a family member`;
      } else if (t.includes("water")) {
        marathi = `मला पाणी प्यायचे आहे.`;
        english = `I want to drink water.`;
        translit = `Malā pāṇī pyāyace āhe.`;
        usage = `Asking for water`;
      } else if (t.includes("tea")) {
        marathi = `मला गरम चहा आवडतो.`;
        english = `I like hot tea.`;
        translit = `Malā garam cahā āvaḍato.`;
        usage = `Expressing beverage preference`;
      } else if (t.includes("apple") || t.includes("mango") || t.includes("fruit")) {
        marathi = `हा आंबा गोड आहे.`;
        english = `This mango is sweet.`;
        translit = `Hā āmbā goḍ āhe.`;
        usage = `Describing fruit`;
      } else if (t.includes("thank you")) {
        marathi = `तुमच्या मदतीसाठी धन्यवाद.`;
        english = `Thank you for your help.`;
        translit = `Tumcyā madatīsāṭhī dhanyavād.`;
        usage = `Expressing gratitude`;
      } else if (t.includes("hello")) {
        marathi = `नमस्कार! तुमचे स्वागत आहे.`;
        english = `Hello! You are welcome.`;
        translit = `Namaskār! Tumce svāgat āhe.`;
        usage = `Polite greeting`;
      } else {
        marathi = `मला ${m} समजते.`;
        english = `I understand ${voc.en}.`;
        translit = `Malā ${voc.mr} samajate.`;
        usage = `Simple sentence with "${voc.en}"`;
      }

      generalSentences.push({
        id: `sent_general_${mod.moduleNumber}_voc_${idx}`,
        moduleId,
        marathi_text: marathi,
        transliteration: translit,
        english_meaning: english,
        usage_note: usage
      });
    });

    // 3. Add daily conversational fillers to reach 10 sentences
    const fillers = [
      { mr: "मराठी शिकणे सोपे आहे.", en: "Learning Marathi is easy.", tr: "Marāṭhī śikaṇe sope āhe.", u: "Encouraging remark" },
      { mr: "मी दररोज सराव करतो.", en: "I practice every day.", tr: "Mī dararoj sarāv karato.", u: "Stating routine" },
      { mr: "कृपया हळू बोला.", en: "Please speak slowly.", tr: "Kr̥payā haḷū bolā.", u: "Asking for slow speech" },
      { mr: "तुम्ही कसे आहात?", en: "How are you?", tr: "Tumhī kase āhāt?", u: "Asking about well-being" },
      { mr: "मला खूप आनंद झाला.", en: "I am very happy.", tr: "Malā khūp ānand jhālā.", u: "Expressing joy" },
      { mr: "हे घर खूप सुंदर आहे.", en: "This house is very beautiful.", tr: "He ghar khūp sundar āhe.", u: "Appreciating aesthetics" },
      { mr: "आपण पुन्हा भेटूया.", en: "We will meet again.", tr: "Applying polite sign-off" },
      { mr: "मराठी माझी आवडती भाषा आहे.", en: "Marathi is my favorite language.", tr: "Marāṭhī mājhī āvaḍatī bhāṣā āhe.", u: "Sharing preference" },
      { mr: "मला मदत हवी आहे.", en: "I need help.", tr: "Malā madat havī āhe.", u: "Asking for assistance" },
      { mr: "सर्व काही ठीक आहे.", en: "Everything is fine.", tr: "Sarva kahī ṭhīk āhe.", u: "Reassuring sentence" }
    ];

    let fillerIdx = 0;
    while (generalSentences.length < mod.moduleNumber * 10) {
      const filler = fillers[fillerIdx % fillers.length];
      const targetCount = generalSentences.filter(s => s.moduleId === moduleId).length;
      if (targetCount >= 10) break;

      generalSentences.push({
        id: `sent_general_${mod.moduleNumber}_fill_${fillerIdx}`,
        moduleId,
        marathi_text: filler.mr,
        transliteration: filler.tr,
        english_meaning: filler.en,
        usage_note: filler.u
      });
      fillerIdx++;
    }
  });

  return {
    courses: SITUATIONAL_COURSES,
    modules: [...generalModules, ...sitModules],
    sentences: [...generalSentences, ...sitSentences]
  };
}
