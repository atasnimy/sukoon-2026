import { CaregiverProfile } from "../types";

export const sampleCaregivers: CaregiverProfile[] = [
  {
    id: "cg_1",
    name: "Sister Aisha Malik, BSN RN",
    title: "Pediatric Nurse & Special Needs Caregiver",
    avatarInitials: "AM",
    bgGradient: "from-[#00897B] to-[#00695C]",
    location: "Greater Metro Area (Chicago, IL)",
    city: "Chicago",
    zipCode: "60611",
    distanceMiles: 2.8,
    yearsExperience: 7,
    hourlyRateMin: 28,
    hourlyRateMax: 28,
    rating: 4.9,
    reviewCount: 32,
    shortBio: "Pediatric nurse with 7+ years specialized experience supporting neurodivergent children. Dedicated to providing respectful, sensory-conscious care rooted in Islamic warmth.",
    aboutMe: "Assalamu Alaikum! I am a registered pediatric nurse with BSN certification and over 7 years of specialized experience with neurodivergent children. My passion is providing gentle, dignity-centered care for Muslim families.",
    experienceDetails: "• 7+ years pediatric nursing & special education care.\n• Expert in Autism spectrum care, medication administration, and sensory regulation.\n• CPR & First Aid certified, verified background check, and masjid recommended.",
    gender: "Female",
    mode: "Both",
    disabilitiesSupported: [
      "Autism",
      "ADHD",
      "Sensory Processing Disorder",
      "Intellectual Disability"
    ],
    servicesProvided: [
      "Respite Care",
      "Personal Care",
      "Babysitting",
      "Behavioral Support"
    ],
    languagesSpoken: ["English", "Arabic"],
    availableDays: ["Weekdays", "Weekends", "Mornings", "Flexible"],
    badges: [
      "✓ Experience with Autism",
      "✓ CPR Certified",
      "✓ Background Check Verified",
      "✓ Recommended by Local Masjid",
      "✓ Special Needs Trained",
      "✓ Arabic Speaker",
      "✓ Available Today"
    ],
    certifications: [
      "BSN Registered Nurse",
      "Pediatric CPR & First Aid Certified",
      "Sensory Integration & Behavior Support"
    ],
    phoneContact: "(312) 555-0192",
    emailContact: "aisha.malik@example.com",
    availabilityGrid: [
      { day: "Monday", slots: ["8:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
      { day: "Tuesday", slots: ["8:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM - 4:00 PM"] }
    ],
    reviews: [
      {
        id: "rev_1",
        reviewerName: "Fatima K. (Mother of 8yo with Autism)",
        date: "2 weeks ago",
        rating: 5,
        comment: "Sister Aisha has been an absolute blessing for our family. She understood my son's sensory triggers immediately and gently guided him through Wudu and Salah routines.",
        isVerifiedFamily: true
      }
    ]
  },
  {
    id: "cg_2",
    name: "Sister Salma Al-Mansoor",
    title: "Special Education Assistant & AAC Specialist",
    avatarInitials: "SM",
    bgGradient: "from-[#DF5D15] to-[#C84B08]",
    location: "Oak Brook Area",
    city: "Oak Brook",
    zipCode: "60523",
    distanceMiles: 5.2,
    yearsExperience: 5,
    hourlyRateMin: 24,
    hourlyRateMax: 24,
    rating: 4.8,
    reviewCount: 24,
    shortBio: "Special education teacher assistant specializing in Speech & AAC tools, Down Syndrome, and physical assistance. Fluent in Arabic & English.",
    aboutMe: "Assalamu Alaikum! I am a special education teacher assistant with 5 years experience supporting children with Down Syndrome, non-verbal communication boards, and physical mobility needs.",
    experienceDetails: "• 5 years in special education classrooms.\n• Expert in AAC devices, picture exchange systems, and physical support.\n• Bilingual in Arabic and English.",
    gender: "Female",
    mode: "In-Person",
    disabilitiesSupported: [
      "Down Syndrome",
      "Autism",
      "Physical Disability",
      "Cerebral Palsy"
    ],
    servicesProvided: [
      "Personal Care",
      "Respite Care",
      "Homework Help",
      "Babysitting"
    ],
    languagesSpoken: ["English", "Arabic"],
    availableDays: ["Weekdays", "Mornings", "Evenings"],
    badges: [
      "✓ Experience with Autism",
      "✓ CPR Certified",
      "✓ Background Check Verified",
      "✓ Special Needs Trained",
      "✓ Arabic Speaker",
      "✓ Available Today"
    ],
    certifications: [
      "Special Education Paraprofessional",
      "AAC & Speech Device Specialist",
      "Pediatric CPR Certified"
    ],
    phoneContact: "(630) 555-0842",
    emailContact: "salma.almansoor@example.com",
    availabilityGrid: [
      { day: "Monday", slots: ["9:00 AM - 5:00 PM"] },
      { day: "Thursday", slots: ["1:00 PM - 7:00 PM"] }
    ],
    reviews: [
      {
        id: "rev_2",
        reviewerName: "Tariq S. (Father)",
        date: "1 month ago",
        rating: 5,
        comment: "Sister Salma is dependable, punctual, and highly professional. Her patience with speech tools is inspiring.",
        isVerifiedFamily: true
      }
    ]
  },
  {
    id: "cg_3",
    name: "Brother Bilal Hamdan",
    title: "Behavioral Specialist & Youth Mentor",
    avatarInitials: "BH",
    bgGradient: "from-[#1565C0] to-[#0D47A1]",
    location: "Naperville / Suburbs",
    city: "Naperville",
    zipCode: "60540",
    distanceMiles: 8.4,
    yearsExperience: 6,
    hourlyRateMin: 26,
    hourlyRateMax: 26,
    rating: 5.0,
    reviewCount: 19,
    shortBio: "Behavioral specialist & youth mentor focusing on boys with Autism, ADHD, and physical disabilities. Great for active outdoor supervision & sports adaptation.",
    aboutMe: "Assalamu Alaikum! I am a youth mentor and behavioral aide passionate about encouraging young neurodivergent boys through adaptive sports, martial arts, and structured daily routines.",
    experienceDetails: "• 6 years experience in youth mentoring and adaptive recreation.\n• Certified in De-escalation & CPR.\n• Active in local masjid youth programs.",
    gender: "Male",
    mode: "In-Person",
    disabilitiesSupported: [
      "Autism",
      "ADHD",
      "Physical Disability",
      "Cerebral Palsy"
    ],
    servicesProvided: [
      "Behavioral Support",
      "Respite Care",
      "Transportation",
      "Overnight Care"
    ],
    languagesSpoken: ["English", "Urdu"],
    availableDays: ["Weekends", "Evenings", "Overnight"],
    badges: [
      "✓ Experience with Autism",
      "✓ CPR Certified",
      "✓ Background Check Verified",
      "✓ Special Needs Trained",
      "✓ Urdu Speaker",
      "✓ Available Today"
    ],
    certifications: [
      "B.S. Kinesiology",
      "Behavioral Intervention Specialist",
      "Pediatric First Aid & CPR"
    ],
    phoneContact: "(630) 555-9123",
    emailContact: "bilal.hamdan@example.com",
    availabilityGrid: [
      { day: "Friday", slots: ["4:00 PM - 10:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM - 9:00 PM"] }
    ],
    reviews: [
      {
        id: "rev_3",
        reviewerName: "Sobia M. (Mother)",
        date: "3 weeks ago",
        rating: 5,
        comment: "Brother Bilal is wonderful with my son. He takes him to the local masjid for Maghrib prayer with great care.",
        isVerifiedFamily: true
      }
    ]
  },
  {
    id: "cg_4",
    name: "Maryam Farah",
    title: "Special Education Assistant & Early Interventionist",
    avatarInitials: "MF",
    bgGradient: "from-[#3E6B5C] to-[#2B4C41]",
    location: "Bridgeview, IL (Near Mosque Foundation)",
    city: "Bridgeview",
    zipCode: "60455",
    distanceMiles: 4.5,
    yearsExperience: 4,
    hourlyRateMin: 20,
    hourlyRateMax: 25,
    rating: 4.91,
    reviewCount: 19,
    shortBio: "Warm and attentive caregiver with deep roots in the local Muslim community. Experienced with ADHD, Autism, and sensory support.",
    aboutMe: "Assalamu Alaikum! I work as a paraprofessional in a local public school district's special education classroom. I love engaging children with hands-on arts, sensory sand play, and Quranic stories.",
    experienceDetails: "• 4 years classroom assistant in K-5 special needs rooms.\n• Somali & Arabic bilingual caregiver.\n• Active volunteer with local youth sisters circle and masjid Sunday school.",
    gender: "Female",
    mode: "In-Person",
    disabilitiesSupported: [
      "ADHD",
      "Autism",
      "Sensory Processing Disorder",
      "Other"
    ],
    servicesProvided: [
      "Babysitting",
      "Respite Care",
      "Homework Help",
      "Transportation"
    ],
    languagesSpoken: ["English", "Somali", "Arabic"],
    availableDays: ["Weekdays", "Evenings", "Weekends"],
    badges: [
      "✓ Experience with Autism",
      "✓ CPR Certified",
      "✓ Background Check Verified",
      "✓ Recommended by Local Masjid",
      "✓ Somali Speaker",
      "✓ Arabic Speaker"
    ],
    certifications: [
      "Paraprofessional Educator License",
      "First Aid & Pediatric CPR",
      "De-escalation & Positive Behavior Intervention"
    ],
    phoneContact: "(708) 555-3310",
    emailContact: "maryam.farah@example.com",
    availabilityGrid: [
      { day: "Monday", slots: ["3:30 PM - 8:30 PM"] },
      { day: "Tuesday", slots: ["3:30 PM - 8:30 PM"] },
      { day: "Wednesday", slots: ["3:30 PM - 8:30 PM"] },
      { day: "Friday", slots: ["2:00 PM - 9:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM - 6:00 PM"] }
    ],
    reviews: [
      {
        id: "rev_5",
        reviewerName: "Ayan A. (Mother)",
        date: "3 weeks ago",
        rating: 5,
        comment: "Maryam is fantastic! She speaks Somali and English seamlessly with my twin boys with ADHD and kept them happy and engaged all evening.",
        isVerifiedFamily: true
      }
    ]
  },
  {
    id: "cg_5",
    name: "Dr. Rashid Hossain",
    title: "Special Needs Mentor & Adaptive Learning Specialist",
    avatarInitials: "RH",
    bgGradient: "from-[#413C58] to-[#A3C4BC]",
    location: "Skokie, IL",
    city: "Skokie",
    zipCode: "60077",
    distanceMiles: 8.9,
    yearsExperience: 8,
    hourlyRateMin: 28,
    hourlyRateMax: 35,
    rating: 4.97,
    reviewCount: 29,
    shortBio: "Educational psychologist focusing on academic coaching, executive dysfunction support (ADHD), and non-verbal speech tools.",
    aboutMe: "Assalamu Alaikum. I am an educator specializing in cognitive learning strategies for neurodivergent boys and young adults. I offer structured homework support, executive function coaching, and life skills mentoring.",
    experienceDetails: "• 8 years mentoring children with ADHD, Autism, and Intellectual Disabilities.\n• Bengali & English fluency.\n• Experienced with adaptive speech software and tablet-based learning apps.",
    gender: "Male",
    mode: "Both",
    disabilitiesSupported: [
      "ADHD",
      "Autism",
      "Intellectual Disability",
      "Sensory Processing Disorder"
    ],
    servicesProvided: [
      "Homework Help",
      "Behavioral Support",
      "Respite Care",
      "Transportation"
    ],
    languagesSpoken: ["English", "Bengali"],
    availableDays: ["Weekdays", "Weekends", "Mornings", "Evenings"],
    badges: [
      "✓ CPR Certified",
      "✓ Background Check Verified",
      "✓ Recommended by Local Masjid",
      "✓ Special Needs Trained",
      "✓ Bengali Speaker"
    ],
    certifications: [
      "Ph.D. Educational Psychology",
      "Certified Academic Life Coach",
      "Youth Mental Health First Aid"
    ],
    phoneContact: "(847) 555-7721",
    emailContact: "rashid.hossain@example.com",
    availabilityGrid: [
      { day: "Tuesday", slots: ["10:00 AM - 6:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM - 6:00 PM"] },
      { day: "Sunday", slots: ["1:00 PM - 7:00 PM"] }
    ],
    reviews: [
      {
        id: "rev_6",
        reviewerName: "Monir H. (Father)",
        date: "2 months ago",
        rating: 5,
        comment: "Dr. Rashid helped my son with ADHD finish his schoolwork without frustration. Extremely patient and respectful.",
        isVerifiedFamily: true
      }
    ]
  },
  {
    id: "cg_6",
    name: "Yasmin Yilmaz",
    title: "Nurse Assistant & Pediatric Care Giver",
    avatarInitials: "YY",
    bgGradient: "from-[#8C4843] to-[#EE6C4D]",
    location: "Schaumburg, IL",
    city: "Schaumburg",
    zipCode: "60173",
    distanceMiles: 15.2,
    yearsExperience: 6,
    hourlyRateMin: 24,
    hourlyRateMax: 30,
    rating: 4.89,
    reviewCount: 16,
    shortBio: "CNA certified caregiver providing personal care, medication assistance, and overnight respite care for special needs children.",
    aboutMe: "Selamlar! I am a Certified Nursing Assistant with extensive hospital and home health care experience. I provide attentive care for children requiring tube feeding support, seizure protocol monitoring, or overnight assistance.",
    experienceDetails: "• 6 years pediatric CNA experience.\n• Skilled in seizure monitoring, G-tube care, and mobility assistance.\n• Fluent in Turkish and English.",
    gender: "Female",
    mode: "In-Person",
    disabilitiesSupported: [
      "Physical Disability",
      "Cerebral Palsy",
      "Intellectual Disability",
      "Down Syndrome",
      "Other"
    ],
    servicesProvided: [
      "Personal Care",
      "Overnight Care",
      "Respite Care",
      "Babysitting"
    ],
    languagesSpoken: ["English", "Turkish"],
    availableDays: ["Weekends", "Overnight", "Flexible"],
    badges: [
      "✓ CPR Certified",
      "✓ Background Check Verified",
      "✓ Special Needs Trained",
      "✓ Turkish Speaker",
      "✓ Available Today"
    ],
    certifications: [
      "Certified Nursing Assistant (CNA)",
      "Pediatric Advanced Life Support (PALS)",
      "Medication Administration Certified"
    ],
    phoneContact: "(847) 555-8833",
    emailContact: "yasmin.yilmaz@example.com",
    availabilityGrid: [
      { day: "Friday", slots: ["Overnight (8:00 PM - 8:00 AM)"] },
      { day: "Saturday", slots: ["Overnight (8:00 PM - 8:00 AM)"] },
      { day: "Sunday", slots: ["8:00 AM - 4:00 PM"] }
    ],
    reviews: [
      {
        id: "rev_7",
        reviewerName: "Emre T. (Father)",
        date: "1 month ago",
        rating: 5,
        comment: "Yasmin provided overnight care for our daughter so my wife and I could catch up on sleep. Gentle, trustworthy, and very skilled.",
        isVerifiedFamily: true
      }
    ]
  }
];
