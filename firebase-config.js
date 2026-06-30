// ============================================================
// ST. MICHAEL'S HIGH SCHOOL — Firebase Configuration
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBwyWsFfMqVOkGgkWc8ZXoqEuLwKkt9FOk",
  authDomain: "st-michael-aa033.firebaseapp.com",
  projectId: "st-michael-aa033",
  storageBucket: "st-michael-aa033.firebasestorage.app",
  messagingSenderId: "518881592117",
  appId: "1:518881592117:web:4299511cafe5185fdb827c",
  measurementId: "G-7TP929Z3LN"
};

// Initialize Firebase using compat SDK (loaded globally)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Default data — used if Firestore has no data yet
const DEFAULTS = {
  news: [
    { id: 1, text: "ADMISSION NOTICE 2026–27: Prospectus & Registration Form for Admission in Montessori & for few seats in upper classes available at School Counter at Rs 700/-." },
    { id: 2, text: "Last Date for submission of duly filled form along with required documents: 18th February 2026 (Wed)." },
    { id: 3, text: "Form Verification/Interview: 21st Feb 2026 (Sat)." },
    { id: 4, text: "PRINCIPAL can be contacted at 9431454365 only between 10:00 AM to 1:00 PM on working days." },
    { id: 5, text: "Send email at: info@stmichaeljamalpur.org" }
  ],
  admission: {
    title: "ADMISSION NOTIFICATION 2026-27",
    documents: [
      "Birth Certificate of Municipal Corporation or equivalent authority.",
      "Candidate's Aadhaar Card",
      "Parents (Mother & Father) Aadhaar Card",
      "Residential proof of Parents",
      "Caste Certificate if SC/ST/OBC/EBC",
      "Two passport size photographs of the Candidate",
      "For Mont./LKG/UKG: two photographs of child with Parents",
      "Transfer Certificate of the last School with PEN (at time of Admission)"
    ]
  },
  toppers: [
    { id: 1, rank: "1st", name: "Outstanding Student", class: "X", score: "Top Rank" },
    { id: 2, rank: "2nd", name: "Meritorious Scholar", class: "X", score: "2nd Rank" },
    { id: 3, rank: "3rd", name: "Academic Excellence", class: "X", score: "3rd Rank" },
    { id: 4, rank: "4th", name: "High Achiever", class: "VIII", score: "Top Rank" },
    { id: 5, rank: "5th", name: "Star Performer", class: "VIII", score: "2nd Rank" }
  ],
  gallery: [
    { id: 1, url: "https://stmichaeljamalpur.org/images/bg_1.jpg", caption: "School Campus 1", category: "campus" },
    { id: 2, url: "https://stmichaeljamalpur.org/images/bg_2.jpg", caption: "School Campus 2", category: "campus" },
    { id: 3, url: "https://stmichaeljamalpur.org/images/bg_3.jpg", caption: "School Campus 3", category: "campus" },
    { id: 4, url: "https://stmichaeljamalpur.org/images/bg_4.jpg", caption: "School Campus 4", category: "campus" },
    { id: 5, url: "https://stmichaeljamalpur.org/images/bg_5.jpg", caption: "School Campus 5", category: "campus" },
    { id: 6, url: "https://stmichaeljamalpur.org/images/acad1.jpg", caption: "Academic Activity 1", category: "academic" },
    { id: 7, url: "https://stmichaeljamalpur.org/images/acad2.jpg", caption: "Academic Activity 2", category: "academic" },
    { id: 8, url: "https://stmichaeljamalpur.org/images/acad3.jpg", caption: "Academic Activity 3", category: "academic" },
    { id: 9, url: "https://stmichaeljamalpur.org/images/fac1.jpg", caption: "School Facility 1", category: "campus" },
    { id: 10, url: "https://stmichaeljamalpur.org/images/fac2.jpg", caption: "School Facility 2", category: "campus" },
    { id: 11, url: "https://stmichaeljamalpur.org/images/fac3.jpg", caption: "School Facility 3", category: "campus" },
    { id: 12, url: "https://stmichaeljamalpur.org/images/alum1.jpg", caption: "Alumni Gathering 1", category: "alumni" },
    { id: 13, url: "https://stmichaeljamalpur.org/images/alum2.jpg", caption: "Alumni Gathering 2", category: "alumni" },
    { id: 14, url: "https://stmichaeljamalpur.org/images/alum3.jpg", caption: "Alumni Gathering 3", category: "alumni" }
  ],
  hours: {
    regularWeekday: "7:45 AM – 1:40 PM",
    regularSaturday: "7:45 AM – 10:35 AM",
    summerWeekday: "6:45 AM – 12:00 PM",
    summerSaturday: "6:45 AM – 9:30 AM",
    officeWeekday: "8:00 AM – 1:30 PM",
    officeSaturday: "8:00 AM – 10:30 AM"
  },
  contact: {
    phone: "+91-6344-241029",
    principal: "9431454365",
    juniorSection: "7667390821",
    seniorSection: "9065757950",
    email: "info@stmichaeljamalpur.org",
    adminEmail: "admin@stmichaeljamalpur.org",
    address: "Walipur Road, Jamalpur – 811214, Munger, Bihar"
  },
  faculty: [
    { id: 1, name: "Mathematics Department", designation: "HOD", department: "Mathematics" },
    { id: 2, name: "Science Department", designation: "Teacher", department: "Science & Biology" },
    { id: 3, name: "English Department", designation: "Teacher", department: "English & Literature" },
    { id: 4, name: "Hindi Department", designation: "Teacher", department: "Hindi Language" },
    { id: 5, name: "Physics Department", designation: "Teacher", department: "Physics" },
    { id: 6, name: "Chemistry Department", designation: "Teacher", department: "Chemistry" },
    { id: 7, name: "Social Science Dept.", designation: "Teacher", department: "Social Science" },
    { id: 8, name: "Sports Department", designation: "Coach", department: "Physical Education" },
    { id: 9, name: "Computer Department", designation: "Teacher", department: "Computer Science" },
    { id: 10, name: "Arts Department", designation: "Teacher", department: "Fine Arts & Music" },
    { id: 11, name: "History & Civics", designation: "Teacher", department: "History & Civics" },
    { id: 12, name: "Montessori Department", designation: "Teacher", department: "Early Childhood" }
  ],
  principal: {
    name: "Xavier Chandan Michael",
    title: "Principal",
    photoUrl: "https://stmichaeljamalpur.org/images/chandm.jpg",
    messageTitle: "NEP 2020 Will Bring the Desired Changes in Education",
    message: `Revolution is a much-needed impetus for the growth of the human society. Reforms are needed in each and every field especially in the field of education. The latest revolution in the system of Indian education has come with the origin of National Education Policy (NEP) 2020.\n\nLearning is the process whereby knowledge is created through the transformation of experience. The NEP 2020 focuses on experiential learning, equity and discovery-based teaching learning methods. Toys are a vital component of learning. Implementing the NEP, the students are taught in an interactive manner with the use of toys.\n\nUnder the guidance of the NEP, the schools will focus on skill-enhancement of the students. Efforts will be made to eliminate rote-learning and emphasis will be laid on experiential learning, including critical thinking, problem-solving, creativity and digital literacy. Integration of technology will be done to improve classroom processes and schools will achieve their academic goals with ICT classrooms.\n\nEventually, we are gearing up for implementing the vision of the NEP, which came after 34 years. The NEP will certainly encompass the needs of the students making them skilful learners who are competent to face real time challenges. Schools must train the faculty and provide inclusive curriculum to promote inclusion and equity in education for the holistic development of the students. The NEP is going to benefit the new generation for dominating the global education and help bring about the revolution for a new India.\n\nHappy Learning!`
  }
};

// ── Firestore Helpers ─────────────────────────────────────────
window.DEFAULTS = DEFAULTS;

window.getData = async function(section) {
  try {
    const ref = db.collection("siteData").doc(section);
    const snap = await ref.get();
    if (snap.exists) return snap.data();
    return null;
  } catch (e) {
    console.warn("Firestore read failed, using defaults:", e.message);
    return null;
  }
};

window.setData = async function(section, data) {
  const ref = db.collection("siteData").doc(section);
  await ref.set(data);
};
