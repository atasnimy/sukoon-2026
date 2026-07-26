import { 
  MatchedFamily, 
  CommunityCircle, 
  FAQItem, 
  HopeReminder, 
  FamilyProfile 
} from "../types";

export const initialUserProfile: FamilyProfile = {
  id: "user_001",
  parentName: "Mariam & Yusuf",
  childAge: "6-9",
  supportNeeds: ["Autism", "Sensory Sensitivity", "Non-verbal"],
  languages: ["English", "Arabic"],
  commMode: "Chat",
  nearbyMosque: "Masjid Al-Noor",
  interests: ["Sensory-friendly events", "Quran classes", "Playgroups"],
  isLocationPrivate: true,
  cityRegion: "Greater Metro Area",
  bio: "Parents of 7-year-old Zayd. Seeking like-minded families for quiet weekend playgroups and supportive masjid outings.",
  avatarBg: "bg-teal-100 text-teal-800"
};

export const sampleMatchedFamilies: MatchedFamily[] = [
  {
    id: "fam_1",
    familyTitle: "The Rahmani Family",
    parentNames: "Amina & Tariq",
    childAge: "6-9 (Age 7)",
    nearbyMosque: "Masjid Al-Noor",
    distance: "1.2 miles away",
    supportNeeds: ["Autism", "Sensory Sensitivity"],
    interests: ["Sensory-friendly events", "Quran classes", "Playgroups"],
    languages: ["English", "Urdu"],
    preferredMode: "Chat",
    matchScore: 96,
    matchingCriteria: [
      "Attends Masjid Al-Noor",
      "Child in 6-9 age range",
      "Shared support needs: Autism & Sensory Sensitivity",
      "Matches 3 of your preferred interests"
    ],
    bio: "Blessed parents of Bilal (7) who loves train sets and visual schedules. We host calm backyard weekend playdates with noise-canceling headphones ready!",
    avatarInitials: "RF",
    bgGradient: "from-emerald-500 to-teal-600"
  },
  {
    id: "fam_2",
    familyTitle: "The Siddiqui Family",
    parentNames: "Fatima & Bilal",
    childAge: "6-9 (Age 8)",
    nearbyMosque: "Islamic Center of Peace",
    distance: "3.5 miles away",
    supportNeeds: ["Autism", "Non-verbal", "ADHD"],
    interests: ["Playgroups", "Caregiver Meetups", "Sensory-friendly events"],
    languages: ["English", "Arabic"],
    preferredMode: "Chat",
    matchScore: 89,
    matchingCriteria: [
      "Child in 6-9 age range",
      "Shared support needs: Autism & Non-verbal",
      "Both speak English & Arabic",
      "Prefers Chat communication"
    ],
    bio: "Parents of Maryam (8). We use AAC devices and picture communication cards. Passionate about creating sensory-friendly halal social spaces.",
    avatarInitials: "SF",
    bgGradient: "from-sky-500 to-blue-600"
  },
  {
    id: "fam_3",
    familyTitle: "The Khan Family",
    parentNames: "Zainab & Ibrahim",
    childAge: "3-5 (Age 5)",
    nearbyMosque: "Masjid Al-Noor",
    distance: "2.0 miles away",
    supportNeeds: ["Sensory Sensitivity", "ADHD"],
    interests: ["Quran classes", "Sensory-friendly events", "Sports & Fitness"],
    languages: ["English"],
    preferredMode: "Video",
    matchScore: 84,
    matchingCriteria: [
      "Attends Masjid Al-Noor",
      "Shared interest: Sensory-friendly events & Quran classes",
      "Shared support needs: Sensory Sensitivity"
    ],
    bio: "Parents of Rayan (5). Constantly finding new ways to keep Salah engaging and tactile at home. Looking for playground buddies during quiet morning hours.",
    avatarInitials: "KF",
    bgGradient: "from-amber-500 to-orange-600"
  },
  {
    id: "fam_4",
    familyTitle: "The Hassan Family",
    parentNames: "Khadija & Omar",
    childAge: "10-13 (Age 11)",
    nearbyMosque: "Al-Rahman Mosque",
    distance: "4.8 miles away",
    supportNeeds: ["Down Syndrome", "Sensory Sensitivity"],
    interests: ["Quran classes", "Caregiver Meetups"],
    languages: ["English", "Somali"],
    preferredMode: "Email",
    matchScore: 78,
    matchingCriteria: [
      "Shared interest: Quran classes",
      "Shared support needs: Sensory Sensitivity"
    ],
    bio: "Parents of Hamza (11). Loves rhythm, nasheeds, and helping during family meal prep. Eager to connect with fellow special needs parents for mutual support.",
    avatarInitials: "HF",
    bgGradient: "from-indigo-500 to-purple-600"
  }
];

export const sampleCommunityCircles: CommunityCircle[] = [
  {
    id: "circle_1",
    title: "Autism & Salah",
    category: "Worship & Accommodations",
    description: "Practical strategies, visual schedules, and scholar-approved accommodations for teaching Salah and managing mosque visits calmly.",
    memberCount: 184,
    iconName: "Compass",
    tags: ["Autism", "Salah", "Visual Cards", "Patience"],
    meetingSchedule: "Wednesdays at 8:00 PM EST (Virtual)",
    isJoined: true,
    pinnedTip: "💡 Tip: Try using a designated visual tactile prayer mat at home before introducing mosque carpet textures.",
    recentMessages: [
      {
        sender: "Sister Amina",
        time: "10 mins ago",
        text: "Using a weighted lap pad during the final Tashahhud helped my son stay calm through 4 rak'ahs today, Alhamdulillah!",
        avatar: "A"
      },
      {
        sender: "Brother Tariq",
        time: "1 hour ago",
        text: "Sharing our updated visual Salah step-by-step PDF in the group files if anyone needs it!",
        avatar: "T"
      }
    ]
  },
  {
    id: "circle_2",
    title: "First Ramadan with Autism",
    category: "Seasonal Support",
    description: "Guidance for parents navigating Suhoor routines, sensory fasting adaptations, noise at Taraweeh, and managing expectations with grace.",
    memberCount: 142,
    iconName: "Moon",
    tags: ["Ramadan", "Fasting Exemptions", "Sensory Tools"],
    meetingSchedule: "Sundays at 2:00 PM EST",
    isJoined: false,
    pinnedTip: "🌙 Reminder: Your caregiving and comforting of your child during Taraweeh is an act of high worship equal in reward.",
    recentMessages: [
      {
        sender: "Mariam H.",
        time: "Yesterday",
        text: "Has anyone set up a quiet sensory tent in their local masjid during Taraweeh? We're presenting a proposal to our board tomorrow.",
        avatar: "M"
      }
    ]
  },
  {
    id: "circle_3",
    title: "Muslim Moms Support Circle",
    category: "Parent Care",
    description: "A safe, confidential space for Muslim mothers of special needs children to share reflections, combat burnout, and renew spiritual energy.",
    memberCount: 256,
    iconName: "HeartHandshake",
    tags: ["Mothers", "Self-Care", "Dua", "Peer Support"],
    meetingSchedule: "Bi-weekly Tuesdays at 9:00 PM EST",
    isJoined: true,
    pinnedTip: "🌸 Note: You cannot pour from an empty cup. Taking 15 quiet minutes for your own mental peace is a duty, not selfishness.",
    recentMessages: [
      {
        sender: "Fatima K.",
        time: "3 hours ago",
        text: "Thank you all for the duas yesterday. The quiet tea time helped me reset after a long meltdowns morning.",
        avatar: "F"
      }
    ]
  },
  {
    id: "circle_4",
    title: "Muslim Dads Support Circle",
    category: "Parent Care",
    description: "Brotherhood, active advocacy, and practical guidance for Muslim fathers navigating special needs diagnoses and family leadership.",
    memberCount: 118,
    iconName: "ShieldCheck",
    tags: ["Fathers", "Brotherhood", "Advocacy", "Masjid Inclusion"],
    meetingSchedule: "Thursdays at 8:30 PM EST",
    isJoined: false,
    pinnedTip: "🛡️ Fatherhood Note: True qawwamah includes defending your child's right to feel welcomed in Allah's house without judgment.",
    recentMessages: [
      {
        sender: "Yusuf R.",
        time: "2 days ago",
        text: "Spoke with the Imam about noise-canceling headphones in the youth library during Jumuah. He was super supportive!",
        avatar: "Y"
      }
    ]
  },
  {
    id: "circle_5",
    title: "Teen Autism & Transitions",
    category: "Age Specific",
    description: "Addressing puberty, social skills, independence, and spiritual identity for autistic Muslim adolescents and young adults.",
    memberCount: 95,
    iconName: "UserCheck",
    tags: ["Teens", "Puberty", "Independence", "Social Skills"],
    meetingSchedule: "Mondays at 7:30 PM EST",
    isJoined: false,
    pinnedTip: "🌱 Focus: Building visual routines for ghusl and hygiene tailored to teens with sensory sensitivities.",
    recentMessages: [
      {
        sender: "Khadija S.",
        time: "5 hours ago",
        text: "We found scent-free soap bars that made the ghusl routine much smoother for my teen daughter.",
        avatar: "K"
      }
    ]
  },
  {
    id: "circle_6",
    title: "Inclusive Masjid Families",
    category: "Advocacy & Community",
    description: "Parent advocates working with local mosque boards to build ramp access, sensory quiet rooms, and disability awareness Khutbahs.",
    memberCount: 210,
    iconName: "Building2",
    tags: ["Masjid Accessibility", "Advocacy", "Sensory Rooms", "Khutbah"],
    meetingSchedule: "Monthly 1st Saturday at 11:00 AM EST",
    isJoined: false,
    pinnedTip: "🕌 Action Item: Download our free 5-page Masjid Sensory Inclusion Toolkit to share with your local board.",
    recentMessages: [
      {
        sender: "Brother Ibrahim",
        time: "4 hours ago",
        text: "Three masjids in our state just agreed to host Khutbahs dedicated to Special Needs Acceptance this Friday!",
        avatar: "I"
      }
    ]
  },
  {
    id: "circle_7",
    title: "Homeschooling Special Needs",
    category: "Education",
    description: "Curriculum modifications, multi-sensory Quran learning, and tailored IEP goals infused with Islamic values.",
    memberCount: 167,
    iconName: "BookOpen",
    tags: ["Homeschool", "Sensory Quran", "Adapted IEP", "Learning"],
    meetingSchedule: "Fridays at 1:00 PM EST",
    isJoined: false,
    pinnedTip: "📚 Idea: Tactile clay letters and audio repetition work wonders for non-verbal children learning Arabic letters.",
    recentMessages: [
      {
        sender: "Sister Zainab",
        time: "Yesterday",
        text: "Shared a new visual Quran tracker tailored for children with short attention spans in the group drive!",
        avatar: "Z"
      }
    ]
  }
];

export const sampleFAQItems: FAQItem[] = [
  {
    id: "faq_1",
    category: "Salah Accommodations",
    question: "My child makes loud vocalizations or moves constantly during congregational prayer. Is it permissible for me to pray while holding them or sitting with them?",
    answer: "Yes, absolutely. Islamic jurisprudence emphasizes ease and mercy. The Prophet Muhammad (peace be upon him) set the precedent by holding his granddaughter Umamah bint Zainab while leading the companions in prayer—stepping down while in sujud and picking her up when standing. Furthermore, he explicitly shortened his prayer upon hearing a child crying to relieve the mother's anxiety. You are permitted to pray seated, hold your child, or break congregational alignment if necessary to care for your child's safety or comfort.",
    scholarlyBasis: "Sahih al-Bukhari (5996) & Sahih Muslim (543) - Rulings of Islamic Fiqh Academy on Accommodations in Ibadaat.",
    keyTakeaway: "Holding or comforting a child during Salah is an authentic Sunnah, not a deficiency in worship.",
    tags: ["Salah", "Vocalizations", "Sunnah", "Holding Child"],
    helpfulCount: 342
  },
  {
    id: "faq_2",
    category: "Salah Accommodations",
    question: "Can I pray at home if bringing my child to Jumu'ah (Friday prayer) or the masjid causes them severe sensory distress?",
    answer: "Yes. While Jumu'ah is an emphasized obligation for adult men under normal circumstances, severe hardship, caregiving necessity, and fear of harm or severe distress serve as valid legal excuses (Udh'r Shar'i) exempting one from congregational attendance. A parent caring for a child with severe sensory sensitivity or medical needs prays Dhuhr 4 rak'ahs at home, receiving the full intention and reward of Jumu'ah due to their noble duty.",
    scholarlyBasis: "Majmoo' al-Fatawa (Ibn Taymiyyah) & Contemporary Fiqh Consensus on Caregiving Exemptions.",
    keyTakeaway: "Caring for a vulnerable soul at home is a continuous form of ibadah equal in virtue to masjid attendance.",
    tags: ["Jumu'ah", "Home Prayer", "Exemption", "Sensory Distress"],
    helpfulCount: 289
  },
  {
    id: "faq_3",
    category: "Sensory Overload in Crowds",
    question: "Is it acceptable to wear noise-canceling headphones or use sensory compression vests inside the prayer hall?",
    answer: "Yes, completely permissible without any dislike (Karaha). Sensory tools like noise-canceling headphones, weighted lap pads, compression garments, or visual earplugs are medical and sensory aids (Adawat al-Hajah). Just as a person uses eyeglasses or a wheelchair, these tools enable the individual to experience peace (Sukoon) in the house of Allah.",
    scholarlyBasis: "Prinicple of Fiqh: 'Necessities and Need permit appropriate accommodations' (Al-Hajah tanzil manzilat al-Darurah).",
    keyTakeaway: "Sensory tools are valid accessibility aids that honor the sanctity of worship.",
    tags: ["Headphones", "Sensory Aids", "Masjid Etiquette", "Inclusion"],
    helpfulCount: 412
  },
  {
    id: "faq_4",
    category: "Sensory Overload in Crowds",
    question: "How should our family respond if community members make insensitive comments about our child's meltdowns during Eid or Jumu'ah?",
    answer: "Respond with dignified patience and gentle education, knowing Allah's pleasure is with you. The Prophet (pbuh) never reprimanded children or individuals with neurodivergent behaviors in the masjid. When Bedouins or companions acted outside social norms in the mosque, the Prophet responded with softness, correcting onlookers instead of the vulnerable individual. You may politely inform community members: 'Allah has honored our child with special needs, and the Prophet taught us that Allah's mercy descends upon those who show kindness to the vulnerable.'",
    scholarlyBasis: "Sahih Muslim (537) - Hadith of Mu'awiyah ibn al-Hakam regarding gentle education in the mosque.",
    keyTakeaway: "The mosque belongs to Allah, and all His servants are welcome. Educate with gentleness, hold your head high.",
    tags: ["Community Stigma", "Mosque Etiquette", "Patience", "Advocacy"],
    helpfulCount: 521
  },
  {
    id: "faq_5",
    category: "Religious Exemptions (Fasting/Congregation)",
    question: "What are the rulings for individuals with intellectual disabilities or severe non-verbal conditions regarding religious obligations?",
    answer: "In Islamic law, accountability (Takleef) is tied directly to cognitive capacity and discernment (Aql and Tamyeez). The Prophet (pbuh) explicitly declared: 'The pen is lifted from three: from the child until puberty, from the sleeping person until they awaken, and from the one who lacks capacity until they regain it.' Individuals with severe intellectual or developmental disabilities are completely free from sin or religious obligation, and they enter Paradise by Allah's infinite mercy without accounting. Parents are rewarded for every act of goodness taught or shared with them.",
    scholarlyBasis: "Sunan Abu Dawud (4400) & Consensus (Ijma') of Classical and Modern Jurists.",
    keyTakeaway: "They are under Allah's special protection and grace ('Ahl Allah') with zero religious liability.",
    tags: ["Takleef", "Pen Lifted", "Intellectual Disability", "Paradise"],
    helpfulCount: 610
  },
  {
    id: "faq_6",
    category: "Religious Exemptions (Fasting/Congregation)",
    question: "I am an exhausted parent caregiver. Am I allowed to break my fast in Ramadan if caregiving demands make fasting unsafe or unmanageable?",
    answer: "Yes. Islamic law grants fasting exemptions (Rukhsah) not only for the sick and traveler, but also for those facing severe physical or mental exhaustion that impairs safety or caregiving ability (e.g., nursing mothers, pregnant women, and intensive full-time caregivers under severe strain). If fasting causes extreme fatigue that prevents you from safely supervising a high-needs child, you may break your fast and make up the days later when able, or pay Fidya (feeding a needy person per day) if chronic.",
    scholarlyBasis: "Surah Al-Baqarah (2:185) & Fatawa of Contemporary Scholars on Heavy Caregiver Strain.",
    keyTakeaway: "Allah loves for His servant to utilize His exemptions (Rukhsah) just as He loves for them to perform obligations.",
    tags: ["Ramadan", "Fasting Exemption", "Caregiver Strain", "Rukhsah"],
    helpfulCount: 378
  },
  {
    id: "faq_7",
    category: "Caregiving in Islam",
    question: "What spiritual status and reward does Islam accord to parents raising a child with physical, developmental, or sensory challenges?",
    answer: "The status of a special-needs caregiver in Islam is among the highest spiritual stations attainable. Scholars note that trial (Bala') paired with patience (Sabr) and contentment (Rida) elevates a believer to degrees in Jannah that their voluntary prayers alone could never reach. The Prophet (pbuh) taught: 'Great reward comes with great trials. When Allah loves a people, He tests them.' Every diaper changed, meltdowns calmed, therapy session attended, and sleepless night endured is recorded as continuous charity (Sadaqah) and expiation of sins.",
    scholarlyBasis: "Sunan at-Tirmidhi (2396) & Sahih al-Bukhari (5641).",
    keyTakeaway: "You are not burdened because Allah is angry with you; you are chosen because Allah trusts your heart with a heavenly trust.",
    tags: ["Spiritual Reward", "Caregiver Status", "Sabr", "Jannah"],
    helpfulCount: 780
  },
  {
    id: "faq_8",
    category: "Caregiving in Islam",
    question: "How can I deal with feelings of parental guilt when I feel burned out or wish my circumstances were easier?",
    answer: "Feeling natural exhaustion, grief, or wishing for relief is a human emotional state, not a sign of weak faith (Eman). Prophet Ya'qub (Jacob) wept until his sight diminished and said: 'I only complain of my suffering and my grief to Allah' (12:86). Seeking emotional support, therapy, respite care, and crying in dua are all righteous acts. Allah created us as emotional beings, and He looks at your striving, not perfection.",
    scholarlyBasis: "Surah Yusuf (12:86) & Spiritual Counseling Principles from Classical Scholars.",
    keyTakeaway: "Guilt is a trick of Shaitan. Your weariness is seen by Allah, and He calls you beloved.",
    tags: ["Burnout", "Parental Guilt", "Mental Health", "Empathy"],
    helpfulCount: 512
  }
];

export const sampleHopeReminders: HopeReminder[] = [
  {
    id: "hope_1",
    type: "Quran",
    arabicText: "يُرِيدُ ٱللَّهُ بِكُمُ ٱلْيُسْرَ وَلَا يُرِيدُ بِكُمُ ٱلْعُسْرَ",
    translation: "Allah intends for you ease and does not intend for you hardship.",
    source: "Surah Al-Baqarah 2:185",
    context: "The foundational Quranic principle establishing that religious laws and daily worship accommodate human vulnerability and difficulty.",
    isBookmarked: true
  },
  {
    id: "hope_2",
    type: "Hadith",
    arabicText: "مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ وَلاَ هَمٍّ وَلاَ حَزَنٍ وَلاَ أَذًى وَلاَ غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلاَّ كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ",
    translation: "No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim—even if it were the prick he receives from a thorn—but that Allah expiates some of his sins for it.",
    source: "Sahih al-Bukhari 5641",
    context: "A profound reminder that every moment of physical or emotional effort exerted by a caregiver earns forgiveness and divine light.",
    isBookmarked: false
  },
  {
    id: "hope_3",
    type: "Hadith",
    arabicText: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَى الرِّفْقِ مَا لاَ يُعْطِي عَلَى الْعُنْفِ",
    translation: "Verily, Allah is Gentle and loves gentleness. He bestows upon gentleness that which He does not bestow upon harshness.",
    source: "Sahih Muslim 2593",
    context: "Guidance for parents and communities to approach children with sensory or neurodivergent needs with tenderness, patience, and warmth.",
    isBookmarked: true
  },
  {
    id: "hope_4",
    type: "Quran",
    arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا • إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: "For truly, with hardship comes ease. Truly, with hardship comes ease.",
    source: "Surah Ash-Sharh 94:5-6",
    context: "Divine assurance that ease is wrapped inside the hardship itself, guaranteeing spiritual expansion after tight trials.",
    isBookmarked: false
  }
];

export const preprogrammedFallbackAnswers: Record<string, string> = {
  salah: `**Bismillah Ar-Rahman Ar-Rahim.**

Peace and blessings be upon you and your family.

Regarding **Salah Accommodations for special needs children and caregivers**:

1. **Holding or Comforting Your Child in Prayer**:
The Prophet Muhammad (pbuh) prayed while holding his granddaughter Umamah. When he went into prostration (sujud), he placed her down gently, and when he stood up, he lifted her again (Sahih al-Bukhari 5996). You may hold, gently rock, or stay seated near your child while praying.

2. **Vocalizations or Movement**:
Your child making sounds or moving during prayer does not invalidate your prayer, nor does it disrupt Allah's pleasure. In fact, when the Prophet (pbuh) heard a child crying during congregational prayer, he intentionally shortened the prayer out of mercy for the mother.

3. **Praying at Home**:
If attending the masjid causes your child severe sensory distress or safety risks, praying at home carries the full reward of congregational worship due to your noble caregiving intention.

*Dua for your family*: May Allah grant your child peace (Sukoon), fill your heart with stillness, and make your home an abode of divine light. Aameen.`,

  fasting: `**Bismillah Ar-Rahman Ar-Rahim.**

Regarding **Ramadan Fasting Exemptions for Caregivers**:

1. **Principle of Ease (Rukhsah)**:
Allah explicitly states in Surah Al-Baqarah (2:185): *"Allah intends for you ease and does not intend for you hardship."* 

2. **Caregiver Exhaustion**:
If full-time caregiving for your child creates intense physical or mental strain such that fasting endangers your health or impairs your ability to safely care for your child, you are granted a legal exemption (*Rukhsah*).

3. **How to Fulfill**:
- You may postpone fasting and make up the days when circumstances are calmer.
- If caregiving is a continuous, long-term demanding state without respite, scholars permit paying *Fidya* (feeding one person per missed day) after consulting a trusted scholar or physician.

Never feel guilt for accepting an exemption provided by Allah. Accepting His mercy is an act of obedience in itself.`,

  masjid: `**Bismillah Ar-Rahman Ar-Rahim.**

Regarding **Mosque Etiquette, Sensory Overload, & Community Stigma**:

1. **Sensory Aids in the Prayer Hall**:
Using noise-canceling headphones, weighted lap blankets, or tactile sensory toys during Jumu'ah or Eid is fully permissible. These are accessibility tools that allow your child to feel safe in the house of Allah.

2. **Handling Uninformed Stares or Comments**:
Remember that the Prophet (pbuh) responded to companion errors in the masjid with gentle teaching, never with harshness. If a congregant makes an insensitive remark, remember that Allah's House belongs to Him, not critics. 

3. **Building Inclusion**:
You can invite your local Imam to share a short reminder about compassion toward special needs families, or join our "Inclusive Masjid Families" Circle on Tab 1 to download our free advocacy template!

*Dua*: May Allah open the hearts of your community to surround your family with love, dignity, and active support.`,

  stigma: `**Bismillah Ar-Rahman Ar-Rahim.**

Regarding **Overcoming Guilt & Community Stigma**:

1. **Your Child is a Blessing, Not a Punishment**:
In Islam, disability or neurodivergence is never a punishment or curse. It is simply a variation of human creation designed by Allah. Individuals with severe intellectual or communication differences are considered *Ahl Allah* (people under Allah's special care) and are guaranteed Paradise without reckoning.

2. **Your Elevated Rank as a Caregiver**:
The Prophet (pbuh) said: *"Great reward comes with great trials."* Every diaper changed, therapy appointment attended, and sleepless night spent comforting your child is recorded as a continuous form of *Sadaqah* (charity) and purification.

3. **Protecting Your Peace**:
Filter out unsolicited cultural advice or spiritual shaming. Turn your heart directly to Al-Mujib (The Answerer of Prayers), knowing He sees every hidden tear.`,

  general: `**Bismillah Ar-Rahman Ar-Rahim.**

Thank you for reaching out to the Sukoon Community AI Companion. 

As a caregiver of a special-needs child, please remember that Allah selected your heart specifically for this noble trust (*Amanah*). Islam is a faith built upon *Yusr* (ease), *Rahmah* (mercy), and *Rukhsah* (scholarly accommodations).

**Core Guidance Principles**:
• **Worship Accommodations**: Praying seated, holding your child, or using sensory tools (headphones, visual schedule cards) are all authentic and permissible.
• **Caregiver Rank**: Your daily efforts in feeding, comforting, and advocating for your child carry rewards equal to continuous voluntary prayer and fasting.
• **Community Dignity**: Your child belongs in the Muslim community without apology or shame.

*May Allah grant your home tranquility (Sukoon), grant your child healing and joy, and reward your steadfast patience with the highest stations of Jannah. Aameen.*`
};
