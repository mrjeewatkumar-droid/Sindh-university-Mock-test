/* ============================================================
   SINDH UNIVERSITY ENTRY TEST — 100 MCQs (Mock Practice Paper)
   Sections: English 1–30 | GK 31–50 | Math 51–70 | IQ 71–80 |
             Everyday Science & Computer 81–100
   Each question: one option only (index 0..3), no negative marking.
   ============================================================ */

const ANSWER_LETTERS = "ABCD";

const SECTIONS = [
  { id: "english", title: "English",        from: 1,  to: 30  },
  { id: "gk",      title: "General Knowledge & Current Affairs", from: 31, to: 50 },
  { id: "math",    title: "Mathematics",    from: 51, to: 70  },
  { id: "iq",      title: "IQ & Logical Reasoning", from: 71, to: 80 },
  { id: "science", title: "Everyday Science & Computer", from: 81, to: 100 }
];

/* q: [question text, [A, B, C, D], correctIndex] */
const QUESTIONS = [
/* ---------------- SECTION I — ENGLISH (1–30) ---------------- */
["They have completed the assignment.", ["The assignment has completed by them.", "The assignment has been completed by them.", "The assignment was completed by them.", "The assignment had been completed by them."], 1],
["Who wrote this letter?", ["By whom this letter was written?", "By whom was this letter written?", "Who was this letter wrote by?", "By whom did this letter written?"], 1],
["The teacher is explaining the lesson.", ["The lesson was explained by the teacher.", "The lesson has been explained by the teacher.", "The lesson is being explained by the teacher.", "The lesson is explained by the teacher."], 2],
["Open the door.", ["The door is opened.", "Let the door be opened.", "Let the door opened.", "The door has been opened."], 1],
["The police arrested the thief.", ["The thief is arrested by the police.", "The thief had arrested by the police.", "The thief was arrested by the police.", "The thief has been arrested by the police."], 2],
["He said, \u201CI am busy now.\u201D", ["He said that I am busy now.", "He said that he was busy then.", "He told that he is busy now.", "He said that he had been busy tomorrow."], 1],
["She said to me, \u201CWhere do you live?\u201D", ["She asked me where did I live.", "She asked me where I live?", "She asked me where I lived.", "She told me where did I live."], 2],
["The teacher said, \u201CThe Earth revolves around the Sun.\u201D", ["The teacher said that the Earth revolved around the Sun.", "The teacher said that the Earth revolves around the Sun.", "The teacher told that the Earth had revolved around the Sun.", "The teacher said the Earth is revolving around the Sun yesterday."], 1],
["He said to me, \u201CPlease help me.\u201D", ["He ordered me that I help him.", "He requested me to help him.", "He said me to help him.", "He requested that help me."], 1],
["Ali said, \u201CI will visit Karachi tomorrow.\u201D", ["Ali said that he will visit Karachi tomorrow.", "Ali said that he would visit Karachi the next day.", "Ali said that I would visit Karachi the next day.", "Ali told that he would visit Karachi yesterday."], 1],
["Intrepid", ["Fearless", "Careless", "Weak", "Hesitant"], 0],
["Amalgamation", ["Separation", "Combination", "Opposition", "Confusion"], 1],
["Resilient", ["Fragile", "Flexible and able to recover", "Rigid", "Uncertain"], 1],
["Abundant", ["Scarce", "Limited", "Plentiful", "Empty"], 2],
["Diligent", ["Lazy", "Hardworking", "Careless", "Impatient"], 1],
["Choose the correctly spelled word:", ["Accomodation", "Accommodation", "Acommodation", "Accommadation"], 1],
["Choose the correctly spelled word:", ["Priviledge", "Privilege", "Privilage", "Privillage"], 1],
["Choose the correctly spelled word:", ["Conscience", "Concience", "Consciense", "Consience"], 0],
["Choose the correctly spelled word:", ["Exaggerate", "Exagerrate", "Exagerate", "Exaggerete"], 0],
["Choose the correctly spelled word:", ["Bureaucracy", "Beauraucracy", "Bureacracy", "Bureaucrasy"], 0],
["Hypocrisy", ["Pretence", "Sincerity", "Deceit", "Dishonesty"], 1],
["Impartial", ["Fair", "Neutral", "Biased", "Objective"], 2],
["Terminate", ["Finish", "Conclude", "Begin", "End"], 2],
["Scarce", ["Rare", "Abundant", "Insufficient", "Limited"], 1],
["Hostile", ["Aggressive", "Unfriendly", "Friendly", "Violent"], 2],
["She is interested _____ history.", ["At", "On", "In", "For"], 2],
["He was accused _____ theft.", ["With", "Of", "For", "At"], 1],
["Neither of the two candidates _____ selected.", ["Were", "Have", "Was", "Are"], 2],
["If I _____ enough money, I would buy a laptop.", ["Have", "Had", "Will have", "Am having"], 1],
["He has been working here _____ 2020.", ["For", "From", "Since", "By"], 2],

/* ------------- SECTION II — GENERAL KNOWLEDGE (31–50) ------------- */
["What is the capital of Ireland?", ["Edinburgh", "Dublin", "Cardiff", "Belfast"], 1],
["What is the currency of Indonesia?", ["Ringgit", "Baht", "Rupiah", "Riyal"], 2],
["K2 is also known as:", ["Nanga Parbat", "Godwin-Austen", "Broad Peak", "Mount Elbrus"], 1],
["Shah Jahan Mosque is located in which Pakistani city?", ["Hyderabad", "Thatta", "Sukkur", "Larkana"], 1],
["Pakistan became a member of the United Nations in:", ["1945", "1946", "1947", "1948"], 2],
["The headquarters of the United Nations is in:", ["Geneva", "Paris", "New York City", "Vienna"], 2],
["Which is the largest ocean in the world?", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], 3],
["The currency of Japan is:", ["Yuan", "Yen", "Won", "Baht"], 1],
["The Khyber Pass connects Pakistan with:", ["Iran", "China", "Afghanistan", "India"], 2],
["Who wrote Daughter of the East?", ["Fatima Jinnah", "Benazir Bhutto", "Bilquis Edhi", "Malala Yousafzai"], 1],
["Who is the President of Pakistan as of October 2026?", ["Arif Alvi", "Asif Ali Zardari", "Mamnoon Hussain", "Shehbaz Sharif"], 1],
["Who is the Prime Minister of Pakistan as of October 2026?", ["Imran Khan", "Nawaz Sharif", "Shehbaz Sharif", "Bilawal Bhutto Zardari"], 2],
["The 2026 Nobel Peace Prize was awarded to:", ["Malala Yousafzai", "Navi Pillay", "Ant\u00F3nio Guterres", "Greta Thunberg"], 1],
["According to the World Meteorological Organization, 2025 was:", ["The coldest year of the century", "One of the three warmest years on record", "The year without tropical cyclones", "The year global warming ended"], 1],
["COP30, the 2025 UN climate conference, was held in:", ["Brazil", "Japan", "Canada", "Egypt"], 0],
["OPEC stands for:", ["Organization of Petroleum Exporting Countries", "Organisation for Political and Economic Cooperation", "Oil Producers and Energy Council", "Organization of Pacific Economic Countries"], 0],
["Which country is known as the Land of the Rising Sun?", ["China", "Japan", "Thailand", "South Korea"], 1],
["The national flower of Pakistan is:", ["Rose", "Jasmine", "Tulip", "Lily"], 1],
["Which is the largest continent by area?", ["Africa", "Europe", "Asia", "South America"], 2],
["The first Muslim woman ruler of Delhi was:", ["Nur Jahan", "Razia Sultan", "Chand Bibi", "Mumtaz Mahal"], 1],

/* ---------------- SECTION III — MATHEMATICS (51–70) ---------------- */
["If 35% of a number is 84, what is the number?", ["220", "240", "260", "280"], 1],
["A shirt costs Rs. 800 after a 20% discount. What was its original price?", ["Rs. 900", "Rs. 960", "Rs. 1,000", "Rs. 1,200"], 2],
["The average of five numbers is 24. If four numbers are 18, 22, 25 and 30, find the fifth number.", ["20", "23", "25", "28"], 2],
["Two numbers are in the ratio 3:5 and their sum is 96. What is the smaller number?", ["32", "36", "40", "60"], 1],
["Solve: 3x \u2212 7 = 2x + 11", ["4", "11", "18", "21"], 2],
["A shopkeeper buys an item for Rs. 1,200 and sells it for Rs. 1,380. Find the profit percentage.", ["12%", "15%", "18%", "20%"], 1],
["A car travels 180 km in 2.5 hours. What is its average speed?", ["65 km/h", "70 km/h", "72 km/h", "75 km/h"], 2],
["Six workers complete a job in 15 days. At the same rate, how many days will 10 workers take?", ["6 days", "9 days", "10 days", "12 days"], 1],
["Simplify: 2.4 \u00D7 0.5 + 1.2 \u00F7 0.3", ["4.8", "5.0", "5.2", "6.4"], 2],
["If a + b = 14 and a \u2212 b = 4, what is a?", ["5", "7", "9", "10"], 2],
["Find the simple interest on Rs. 5,000 at 8% per annum for 3 years.", ["Rs. 800", "Rs. 1,000", "Rs. 1,200", "Rs. 1,500"], 2],
["A number is increased by 25% and becomes 250. What was the original number?", ["180", "200", "210", "225"], 1],
["Find the LCM of 18, 24 and 30.", ["120", "180", "240", "360"], 3],
["If x\u00B2 \u2212 9 = 0, what are the possible values of x?", ["3 only", "\u22123 only", "\u22123 and 3", "0 and 9"], 2],
["A rectangle has a perimeter of 54 cm and a length of 16 cm. What is its area?", ["160 cm\u00B2", "176 cm\u00B2", "180 cm\u00B2", "192 cm\u00B2"], 1],
["A student scores 72, 68, 85 and 75 in four tests. What score is required in the fifth test to obtain an average of 76?", ["75", "78", "80", "82"], 2],
["A sum of Rs. 840 is divided in the ratio 2:3:7. What is the largest share?", ["Rs. 140", "Rs. 210", "Rs. 420", "Rs. 490"], 2],
["A tank is 3/5 full. After adding 24 litres, it becomes 9/10 full. What is the tank's total capacity?", ["60 litres", "70 litres", "80 litres", "100 litres"], 2],
["Evaluate: 3/4 + 5/6 \u2212 1/3", ["5/4", "7/6", "3/2", "4/3"], 0],
["A number leaves a remainder of 3 when divided by 7. Which of the following could be that number?", ["45", "46", "49", "53"], 0],

/* ------------- SECTION IV — IQ & LOGICAL REASONING (71–80) ------------- */
["Find the next number: 3, 8, 15, 24, 35, ___", ["42", "46", "48", "50"], 2],
["Find the missing number: 2, 6, 18, 54, ___", ["108", "126", "162", "216"], 2],
["Book is to Reading as Fork is to:", ["Drawing", "Eating", "Writing", "Sleeping"], 1],
["Which one is different from the others?", ["Square", "Triangle", "Circle", "Cube"], 3],
["All roses are flowers. Some flowers fade quickly. Which statement must be true?", ["All roses fade quickly.", "No roses fade quickly.", "All roses are flowers.", "All flowers are roses."], 2],
["A person walks 6 km north and then 8 km east. How far is the person from the starting point?", ["8 km", "10 km", "12 km", "14 km"], 1],
["If each letter is replaced by the next letter in the alphabet, CAT becomes DBU. How will DOG be coded?", ["EPH", "EOG", "FPH", "DPH"], 0],
["At a meeting, 8 people each shake hands with every other person exactly once. How many handshakes occur?", ["16", "24", "28", "32"], 2],
["Ali is older than Bilal. Bilal is older than Kamran. Who is the youngest?", ["Ali", "Bilal", "Kamran", "Cannot be determined"], 2],
["Find the missing number: 2, 5, 10, 17, 26, ___", ["35", "36", "37", "39"], 2],

/* ------- SECTION V — EVERYDAY SCIENCE & COMPUTER (81–100) ------- */
["The SI unit of frequency is:", ["Newton", "Joule", "Hertz", "Watt"], 2],
["Light travels fastest in:", ["Water", "Glass", "Vacuum", "Air"], 2],
["Which instrument measures atmospheric pressure?", ["Thermometer", "Barometer", "Hygrometer", "Ammeter"], 1],
["The law of inertia is also known as:", ["Newton's first law", "Newton's second law", "Newton's third law", "Boyle's law"], 0],
["The SI unit of electrical resistance is:", ["Volt", "Ampere", "Ohm", "Coulomb"], 2],
["What is the chemical formula of methane?", ["C\u2082H\u2086", "CH\u2083", "CH\u2084", "CO\u2082"], 2],
["The pH of a neutral aqueous solution at approximately 25\u00B0C is:", ["0", "5", "7", "14"], 2],
["Which gas is commonly used by plants during photosynthesis?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], 1],
["The chemical symbol for potassium is:", ["P", "Po", "K", "Pt"], 2],
["The hardest naturally occurring substance is:", ["Iron", "Quartz", "Diamond", "Graphite"], 2],
["Which blood cells help defend the body against infection?", ["Red blood cells", "White blood cells", "Platelets", "Plasma cells only"], 1],
["Severe vitamin D deficiency in children may cause:", ["Scurvy", "Rickets", "Night blindness", "Anaemia"], 1],
["Which organ produces bile?", ["Kidney", "Pancreas", "Liver", "Stomach"], 2],
["What is the basic structural and functional unit of life?", ["Tissue", "Organ", "Cell", "Molecule"], 2],
["Which planet is commonly called Earth's sister planet because of its similar size?", ["Mars", "Venus", "Jupiter", "Mercury"], 1],
["Which component is commonly called the brain of a computer?", ["Monitor", "CPU", "Keyboard", "Printer"], 1],
["Which of the following is an output device?", ["Keyboard", "Mouse", "Scanner", "Plotter"], 3],
["What does RAM stand for?", ["Read Access Memory", "Random Access Memory", "Rapid Action Machine", "Readable Active Module"], 1],
["Which of the following is an operating system?", ["Microsoft Word", "Google Chrome", "Microsoft Windows", "Adobe Photoshop"], 2],
["Which device can function as both an input and an output device?", ["Keyboard", "Barcode reader", "Touchscreen", "Ordinary speaker"], 2]
];

/* Publisher configuration — change ADMIN_CODE before sharing publicly */
const CONFIG = {
  TIME_LIMIT_MINUTES: 90,
  MAX_TAB_VIOLATIONS: 3,
  ADMIN_CODE: "sindh2026",
  STORAGE_KEY: "su_entry_test_attempts_v1",
  /* Central results dashboard (Google Sheet via Apps Script).
     Paste the Web app URL here once deployed; submissions are then
     logged to the owner's sheet automatically. Leave "" to disable. */
  RESULTS_URL: "",
  RESULTS_SECRET: "6768f152907c8988bb66b9522bb9afd1886fd097740fcef5",
  /* Zero-setup results collector: every submission is POSTed here and an
     hourly job mirrors new results into the repo (results/results.md). */
  COLLECTOR_URL: "https://webhook.site/407f6b18-2aff-4ef6-acef-f773898cb42d",
  /* Test availability window. After this moment no new attempts can start
     and any in-progress test is auto-submitted. ISO 8601 with timezone
     offset; "" disables the closing time. */
  TEST_CLOSE_AT: "2026-10-11T09:00:00+05:00"
};
