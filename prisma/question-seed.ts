import { prisma } from "@/lib/prisma";
import { QuestionType } from "@/generated/prisma/enums";

type QuestionSeed = {
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  solution: string;
};

const questions: QuestionSeed[] = [
  // ============================================================
  // QUANTITATIVE APTITUDE - 25
  // ============================================================

  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
    solution: "2 is the smallest prime number.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "Which of the following is an even number?",
    options: ["17", "21", "35", "42"],
    correctAnswer: 3,
    solution: "42 is divisible by 2, so it is an even number.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the value of 15 × 8?",
    options: ["100", "110", "120", "130"],
    correctAnswer: 2,
    solution: "15 × 8 = 120.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "Which number is divisible by 3?",
    options: ["124", "125", "126", "127"],
    correctAnswer: 2,
    solution: "The sum of digits of 126 is 9, which is divisible by 3.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the successor of 999?",
    options: ["998", "999", "1000", "1001"],
    correctAnswer: 2,
    solution: "The successor of a number is obtained by adding 1. 999 + 1 = 1000.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the predecessor of 500?",
    options: ["498", "499", "501", "502"],
    correctAnswer: 1,
    solution: "500 - 1 = 499.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "Which of the following is a perfect square?",
    options: ["36", "40", "45", "50"],
    correctAnswer: 0,
    solution: "36 = 6 × 6, so 36 is a perfect square.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the remainder when 17 is divided by 5?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    solution: "17 = 5 × 3 + 2, so the remainder is 2.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "Which of the following is a composite number?",
    options: ["2", "3", "5", "9"],
    correctAnswer: 3,
    solution: "9 has factors 1, 3 and 9, so it is composite.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the sum of the first five natural numbers?",
    options: ["10", "15", "20", "25"],
    correctAnswer: 1,
    solution: "1 + 2 + 3 + 4 + 5 = 15.",
  },

  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the HCF of 12 and 18?",
    options: ["2", "3", "6", "9"],
    correctAnswer: 2,
    solution: "The highest common factor of 12 and 18 is 6.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the LCM of 4 and 6?",
    options: ["8", "10", "12", "24"],
    correctAnswer: 2,
    solution: "The least common multiple of 4 and 6 is 12.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the HCF of 20 and 30?",
    options: ["5", "10", "15", "20"],
    correctAnswer: 1,
    solution: "The common factors include 1, 2, 5 and 10. Hence HCF = 10.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the LCM of 8 and 12?",
    options: ["16", "20", "24", "36"],
    correctAnswer: 2,
    solution: "The LCM of 8 and 12 is 24.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the HCF of 24 and 36?",
    options: ["6", "8", "12", "18"],
    correctAnswer: 2,
    solution: "The HCF of 24 and 36 is 12.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the LCM of 5 and 7?",
    options: ["12", "25", "30", "35"],
    correctAnswer: 3,
    solution: "Since 5 and 7 are co-prime, their LCM is 5 × 7 = 35.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "The HCF of two co-prime numbers is always:",
    options: ["0", "1", "2", "Their product"],
    correctAnswer: 1,
    solution: "Two co-prime numbers have HCF equal to 1.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "The LCM of two co-prime numbers is equal to:",
    options: [
      "Their sum",
      "Their difference",
      "Their product",
      "Their HCF",
    ],
    correctAnswer: 2,
    solution: "For co-prime numbers, LCM = product of the numbers.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the HCF of 15 and 25?",
    options: ["3", "5", "10", "15"],
    correctAnswer: 1,
    solution: "The highest common factor of 15 and 25 is 5.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "HCF and LCM",
    question: "What is the LCM of 9 and 12?",
    options: ["18", "24", "36", "48"],
    correctAnswer: 2,
    solution: "The LCM of 9 and 12 is 36.",
  },

  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is 25% of 200?",
    options: ["25", "40", "50", "75"],
    correctAnswer: 2,
    solution: "25% of 200 = 25/100 × 200 = 50.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is 2³?",
    options: ["4", "6", "8", "9"],
    correctAnswer: 2,
    solution: "2³ = 2 × 2 × 2 = 8.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "Which of the following is an odd number?",
    options: ["22", "34", "46", "51"],
    correctAnswer: 3,
    solution: "51 is not divisible by 2, so it is odd.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the square of 12?",
    options: ["124", "132", "144", "154"],
    correctAnswer: 2,
    solution: "12 × 12 = 144.",
  },
  {
    subject: "Quantitative Aptitude",
    topic: "Number System",
    question: "What is the cube of 5?",
    options: ["25", "75", "100", "125"],
    correctAnswer: 3,
    solution: "5³ = 5 × 5 × 5 = 125.",
  },

  // ============================================================
  // REASONING - 25
  // ============================================================

  {
    subject: "Reasoning",
    topic: "Analogy",
    question: "Book is related to Reading in the same way as Food is related to:",
    options: ["Cooking", "Eating", "Buying", "Selling"],
    correctAnswer: 1,
    solution: "A book is used for reading, while food is used for eating.",
  },
  {
    subject: "Reasoning",
    topic: "Analogy",
    question: "Doctor is related to Hospital as Teacher is related to:",
    options: ["Office", "School", "Market", "Court"],
    correctAnswer: 1,
    solution: "A doctor works in a hospital and a teacher works in a school.",
  },
  {
    subject: "Reasoning",
    topic: "Analogy",
    question: "Bird is related to Nest as Lion is related to:",
    options: ["Cave", "Den", "Stable", "Kennel"],
    correctAnswer: 1,
    solution: "A bird lives in a nest and a lion lives in a den.",
  },
  {
    subject: "Reasoning",
    topic: "Analogy",
    question: "Pen is related to Write as Knife is related to:",
    options: ["Cut", "Draw", "Read", "Speak"],
    correctAnswer: 0,
    solution: "A pen is used to write and a knife is used to cut.",
  },
  {
    subject: "Reasoning",
    topic: "Analogy",
    question: "Eye is related to See as Ear is related to:",
    options: ["Touch", "Hear", "Walk", "Speak"],
    correctAnswer: 1,
    solution: "Eyes are used for seeing and ears are used for hearing.",
  },
  {
    subject: "Reasoning",
    topic: "Analogy",
    question: "Puppy is related to Dog as Kitten is related to:",
    options: ["Cat", "Cow", "Horse", "Goat"],
    correctAnswer: 0,
    solution: "A puppy is a young dog and a kitten is a young cat.",
  },

  {
    subject: "Reasoning",
    topic: "Classification",
    question: "Find the odd one out.",
    options: ["Apple", "Mango", "Banana", "Carrot"],
    correctAnswer: 3,
    solution: "Carrot is a vegetable; the others are fruits.",
  },
  {
    subject: "Reasoning",
    topic: "Classification",
    question: "Find the odd one out.",
    options: ["Dog", "Cat", "Cow", "Rose"],
    correctAnswer: 3,
    solution: "Rose is a plant; the others are animals.",
  },
  {
    subject: "Reasoning",
    topic: "Classification",
    question: "Find the odd one out.",
    options: ["2", "4", "6", "9"],
    correctAnswer: 3,
    solution: "9 is odd, while 2, 4 and 6 are even.",
  },
  {
    subject: "Reasoning",
    topic: "Classification",
    question: "Find the odd one out.",
    options: ["Monday", "Tuesday", "January", "Friday"],
    correctAnswer: 2,
    solution: "January is a month; the others are days of the week.",
  },
  {
    subject: "Reasoning",
    topic: "Classification",
    question: "Find the odd one out.",
    options: ["Triangle", "Square", "Circle", "Rectangle"],
    correctAnswer: 2,
    solution: "Circle has no straight sides; the others have straight sides.",
  },
  {
    subject: "Reasoning",
    topic: "Classification",
    question: "Find the odd one out.",
    options: ["Red", "Blue", "Green", "Table"],
    correctAnswer: 3,
    solution: "Table is an object; the others are colours.",
  },

  {
    subject: "Reasoning",
    topic: "Number Series",
    question: "Find the next number: 2, 4, 6, 8, ?",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1,
    solution: "Each number increases by 2. The next number is 10.",
  },
  {
    subject: "Reasoning",
    topic: "Number Series",
    question: "Find the next number: 5, 10, 15, 20, ?",
    options: ["22", "24", "25", "30"],
    correctAnswer: 2,
    solution: "Each number increases by 5. The next number is 25.",
  },
  {
    subject: "Reasoning",
    topic: "Number Series",
    question: "Find the next number: 3, 6, 9, 12, ?",
    options: ["14", "15", "16", "18"],
    correctAnswer: 1,
    solution: "Each number increases by 3. The next number is 15.",
  },
  {
    subject: "Reasoning",
    topic: "Number Series",
    question: "Find the next number: 1, 4, 9, 16, ?",
    options: ["20", "24", "25", "36"],
    correctAnswer: 2,
    solution: "These are squares: 1², 2², 3², 4². Next is 5² = 25.",
  },
  {
    subject: "Reasoning",
    topic: "Number Series",
    question: "Find the next number: 10, 20, 30, 40, ?",
    options: ["45", "50", "55", "60"],
    correctAnswer: 1,
    solution: "Each number increases by 10. The next number is 50.",
  },
  {
    subject: "Reasoning",
    topic: "Number Series",
    question: "Find the next number: 2, 6, 12, 20, ?",
    options: ["24", "28", "30", "32"],
    correctAnswer: 2,
    solution: "The pattern is n(n+1): 1×2, 2×3, 3×4, 4×5, so next is 5×6 = 30.",
  },

  {
    subject: "Reasoning",
    topic: "Figure Matrix",
    question: "If a pattern increases by one shape in every step, how many shapes will be present after four steps starting from one?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    solution: "Starting with 1 and increasing by 1 gives 1, 2, 3, 4, 5.",
  },
  {
    subject: "Reasoning",
    topic: "Figure Matrix",
    question: "Which shape has no corners?",
    options: ["Triangle", "Square", "Circle", "Rectangle"],
    correctAnswer: 2,
    solution: "A circle has no corners.",
  },
  {
    subject: "Reasoning",
    topic: "Figure Matrix",
    question: "Which shape has three sides?",
    options: ["Circle", "Triangle", "Square", "Rectangle"],
    correctAnswer: 1,
    solution: "A triangle has three sides.",
  },
  {
    subject: "Reasoning",
    topic: "Figure Matrix",
    question: "Which shape has four equal sides?",
    options: ["Triangle", "Circle", "Square", "Oval"],
    correctAnswer: 2,
    solution: "A square has four equal sides.",
  },
  {
    subject: "Reasoning",
    topic: "Figure Matrix",
    question: "How many sides does a pentagon have?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    solution: "A pentagon has five sides.",
  },
  {
    subject: "Reasoning",
    topic: "Figure Matrix",
    question: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    solution: "A hexagon has six sides.",
  },

  // ============================================================
  // GENERAL AWARENESS - 25
  // ============================================================

  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who was the first Prime Minister of independent India?",
    options: [
      "Mahatma Gandhi",
      "Jawaharlal Nehru",
      "Sardar Patel",
      "Rajendra Prasad",
    ],
    correctAnswer: 1,
    solution: "Jawaharlal Nehru became the first Prime Minister of independent India.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who is known as the Father of the Indian Constitution?",
    options: [
      "Mahatma Gandhi",
      "B. R. Ambedkar",
      "Jawaharlal Nehru",
      "Subhas Chandra Bose",
    ],
    correctAnswer: 1,
    solution: "Dr. B. R. Ambedkar played the leading role in drafting the Constitution of India.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "In which year did India gain independence?",
    options: ["1945", "1946", "1947", "1950"],
    correctAnswer: 2,
    solution: "India became independent on 15 August 1947.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who founded the Maurya Empire?",
    options: [
      "Ashoka",
      "Chandragupta Maurya",
      "Harsha",
      "Samudragupta",
    ],
    correctAnswer: 1,
    solution: "Chandragupta Maurya founded the Maurya Empire.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who was known as the Iron Man of India?",
    options: [
      "Jawaharlal Nehru",
      "Sardar Vallabhbhai Patel",
      "Bhagat Singh",
      "Rajendra Prasad",
    ],
    correctAnswer: 1,
    solution: "Sardar Vallabhbhai Patel is popularly known as the Iron Man of India.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who gave the slogan 'Jai Hind' prominence during India's freedom movement?",
    options: [
      "Subhas Chandra Bose",
      "Mahatma Gandhi",
      "Bal Gangadhar Tilak",
      "Lala Lajpat Rai",
    ],
    correctAnswer: 0,
    solution: "Subhas Chandra Bose prominently used the slogan Jai Hind.",
  },

  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Which civilization is associated with Harappa?",
    options: [
      "Indus Valley Civilization",
      "Roman Civilization",
      "Greek Civilization",
      "Egyptian Civilization",
    ],
    correctAnswer: 0,
    solution: "Harappa was one of the major sites of the Indus Valley Civilization.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Which ancient city is located in present-day Pakistan?",
    options: ["Harappa", "Delhi", "Patna", "Varanasi"],
    correctAnswer: 0,
    solution: "Harappa is an archaeological site in present-day Pakistan.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Who was the famous ruler of the Maurya dynasty who embraced Buddhism?",
    options: ["Ashoka", "Chandragupta", "Bindusara", "Bimbisara"],
    correctAnswer: 0,
    solution: "Emperor Ashoka embraced Buddhism after the Kalinga War.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "The Vedas were composed in which language?",
    options: ["Sanskrit", "Pali", "Persian", "Tamil"],
    correctAnswer: 0,
    solution: "The Vedas were composed in Vedic Sanskrit.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Nalanda was famous as an ancient centre of:",
    options: ["Trade", "Education", "Military", "Mining"],
    correctAnswer: 1,
    solution: "Nalanda was a renowned ancient centre of learning.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "The Great Bath was discovered at:",
    options: ["Harappa", "Mohenjo-daro", "Lothal", "Dholavira"],
    correctAnswer: 1,
    solution: "The Great Bath was discovered at Mohenjo-daro.",
  },

  {
    subject: "General Awareness",
    topic: "Medieval History",
    question: "Who founded the Mughal Empire in India?",
    options: ["Akbar", "Babur", "Humayun", "Shah Jahan"],
    correctAnswer: 1,
    solution: "Babur founded the Mughal Empire after the First Battle of Panipat.",
  },
  {
    subject: "General Awareness",
    topic: "Medieval History",
    question: "Who built the Taj Mahal?",
    options: ["Akbar", "Shah Jahan", "Aurangzeb", "Humayun"],
    correctAnswer: 1,
    solution: "The Taj Mahal was commissioned by Mughal emperor Shah Jahan.",
  },
  {
    subject: "General Awareness",
    topic: "Medieval History",
    question: "Who was the father of Akbar?",
    options: ["Babur", "Humayun", "Shah Jahan", "Jahangir"],
    correctAnswer: 1,
    solution: "Humayun was the father of Akbar.",
  },
  {
    subject: "General Awareness",
    topic: "Medieval History",
    question: "Who founded the Delhi Sultanate's Slave Dynasty?",
    options: [
      "Qutb-ud-din Aibak",
      "Alauddin Khilji",
      "Iltutmish",
      "Balban",
    ],
    correctAnswer: 0,
    solution: "Qutb-ud-din Aibak founded the Slave Dynasty.",
  },
  {
    subject: "General Awareness",
    topic: "Medieval History",
    question: "Who built the Qutub Minar complex's famous tower?",
    options: ["Akbar", "Qutb-ud-din Aibak", "Shah Jahan", "Sher Shah"],
    correctAnswer: 1,
    solution: "Qutb-ud-din Aibak started the construction of Qutub Minar.",
  },
  {
    subject: "General Awareness",
    topic: "Medieval History",
    question: "Who was known as Akbar the Great?",
    options: [
      "Akbar",
      "Babur",
      "Jahangir",
      "Aurangzeb",
    ],
    correctAnswer: 0,
    solution: "Jalal-ud-din Muhammad Akbar is commonly known as Akbar the Great.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who led the Salt March in 1930?",
    options: [
      "Mahatma Gandhi",
      "Subhas Chandra Bose",
      "Bhagat Singh",
      "Sardar Patel",
    ],
    correctAnswer: 0,
    solution: "Mahatma Gandhi led the Dandi March or Salt March in 1930.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "The Quit India Movement was launched in:",
    options: ["1930", "1935", "1942", "1947"],
    correctAnswer: 2,
    solution: "The Quit India Movement was launched in 1942.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who was popularly known as Netaji?",
    options: [
      "Bhagat Singh",
      "Subhas Chandra Bose",
      "Mahatma Gandhi",
      "Rajendra Prasad",
    ],
    correctAnswer: 1,
    solution: "Subhas Chandra Bose was popularly known as Netaji.",
  },
  {
    subject: "General Awareness",
    topic: "Indian History",
    question: "Who wrote the national song 'Vande Mataram'?",
    options: [
      "Rabindranath Tagore",
      "Bankim Chandra Chattopadhyay",
      "Sarojini Naidu",
      "Premchand",
    ],
    correctAnswer: 1,
    solution: "Bankim Chandra Chattopadhyay wrote Vande Mataram.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Which metal was widely used during the later Vedic period?",
    options: ["Iron", "Aluminium", "Titanium", "Platinum"],
    correctAnswer: 0,
    solution: "Iron became widely used during the later Vedic period.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Buddha attained enlightenment at:",
    options: ["Sarnath", "Bodh Gaya", "Kushinagar", "Lumbini"],
    correctAnswer: 1,
    solution: "Gautama Buddha attained enlightenment at Bodh Gaya.",
  },
  {
    subject: "General Awareness",
    topic: "Ancient History",
    question: "Where was Buddha born?",
    options: ["Lumbini", "Sarnath", "Bodh Gaya", "Kushinagar"],
    correctAnswer: 0,
    solution: "Gautama Buddha was born at Lumbini.",
  },

  // ============================================================
  // COMPUTER KNOWLEDGE - 25
  // ============================================================

  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Copy?",
    options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + Z"],
    correctAnswer: 1,
    solution: "Ctrl + C is commonly used to copy selected content.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Paste?",
    options: ["Ctrl + P", "Ctrl + C", "Ctrl + V", "Ctrl + X"],
    correctAnswer: 2,
    solution: "Ctrl + V is used to paste copied or cut content.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Cut?",
    options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + A"],
    correctAnswer: 0,
    solution: "Ctrl + X is used to cut selected content.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Undo?",
    options: ["Ctrl + Y", "Ctrl + Z", "Ctrl + U", "Ctrl + D"],
    correctAnswer: 1,
    solution: "Ctrl + Z is used to undo the previous action.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Select All?",
    options: ["Ctrl + A", "Ctrl + S", "Ctrl + F", "Ctrl + E"],
    correctAnswer: 0,
    solution: "Ctrl + A selects all content.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Save?",
    options: ["Ctrl + S", "Ctrl + P", "Ctrl + D", "Ctrl + W"],
    correctAnswer: 0,
    solution: "Ctrl + S is used to save a document or file.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Shortcut Keys",
    question: "What is the shortcut key for Print?",
    options: ["Ctrl + R", "Ctrl + P", "Ctrl + T", "Ctrl + L"],
    correctAnswer: 1,
    solution: "Ctrl + P opens the print dialog in most applications.",
  },

  {
    subject: "Computer Knowledge",
    topic: "Number System",
    question: "What is the binary representation of decimal 2?",
    options: ["01", "10", "11", "100"],
    correctAnswer: 1,
    solution: "Decimal 2 is represented as binary 10.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Number System",
    question: "What is the binary representation of decimal 5?",
    options: ["101", "110", "111", "100"],
    correctAnswer: 0,
    solution: "Decimal 5 is represented as binary 101.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Number System",
    question: "What is the decimal value of binary 1010?",
    options: ["8", "9", "10", "12"],
    correctAnswer: 2,
    solution: "1010 in binary = 8 + 2 = 10.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Number System",
    question: "Which number system uses digits from 0 to 7?",
    options: ["Binary", "Octal", "Decimal", "Hexadecimal"],
    correctAnswer: 1,
    solution: "The octal number system uses digits 0 through 7.",
  },

  {
    subject: "Computer Knowledge",
    topic: "Programming Basics",
    question: "Which language is commonly used for web page structure?",
    options: ["HTML", "SQL", "Python", "C++"],
    correctAnswer: 0,
    solution: "HTML is used to structure web pages.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Programming Basics",
    question: "Which language is mainly used for styling web pages?",
    options: ["HTML", "CSS", "SQL", "Java"],
    correctAnswer: 1,
    solution: "CSS is used to style web pages.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Programming Basics",
    question: "Which of the following is a programming language?",
    options: ["Python", "HTTP", "HTML", "URL"],
    correctAnswer: 0,
    solution: "Python is a programming language.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Programming Basics",
    question: "What is a variable used for in programming?",
    options: [
      "Store data",
      "Print paper",
      "Connect electricity",
      "Format a disk",
    ],
    correctAnswer: 0,
    solution: "A variable is used to store a value or data.",
  },

  {
    subject: "Computer Knowledge",
    topic: "Computer Abbreviations",
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Processing Utility",
      "Central Program Unit",
      "Computer Primary Unit",
    ],
    correctAnswer: 0,
    solution: "CPU stands for Central Processing Unit.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Abbreviations",
    question: "What does RAM stand for?",
    options: [
      "Read Access Memory",
      "Random Access Memory",
      "Rapid Access Machine",
      "Random Application Memory",
    ],
    correctAnswer: 1,
    solution: "RAM stands for Random Access Memory.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Abbreviations",
    question: "What does ROM stand for?",
    options: [
      "Read Only Memory",
      "Random Only Memory",
      "Read Open Memory",
      "Run Only Memory",
    ],
    correctAnswer: 0,
    solution: "ROM stands for Read Only Memory.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Abbreviations",
    question: "What does USB stand for?",
    options: [
      "Universal Serial Bus",
      "United System Bus",
      "Universal System Board",
      "User Serial Bus",
    ],
    correctAnswer: 0,
    solution: "USB stands for Universal Serial Bus.",
  },

  {
    subject: "Computer Knowledge",
    topic: "Input and Output Devices",
    question: "Which of the following is an input device?",
    options: ["Monitor", "Printer", "Keyboard", "Speaker"],
    correctAnswer: 2,
    solution: "A keyboard is an input device.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Input and Output Devices",
    question: "Which of the following is an output device?",
    options: ["Keyboard", "Mouse", "Scanner", "Monitor"],
    correctAnswer: 3,
    solution: "A monitor is an output device.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Input and Output Devices",
    question: "Which device is used to scan documents?",
    options: ["Printer", "Scanner", "Speaker", "Monitor"],
    correctAnswer: 1,
    solution: "A scanner converts physical documents into digital form.",
  },

  {
    subject: "Computer Knowledge",
    topic: "Memory",
    question: "Which memory is volatile?",
    options: ["ROM", "RAM", "Hard Disk", "SSD"],
    correctAnswer: 1,
    solution: "RAM is volatile memory because its contents are lost when power is removed.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Memory",
    question: "Which memory is generally faster?",
    options: ["Cache", "Hard Disk", "DVD", "Pen Drive"],
    correctAnswer: 0,
    solution: "Cache memory is much faster than secondary storage devices.",
  },

  {
    subject: "Computer Knowledge",
    topic: "Computer Virus",
    question: "What is a computer virus?",
    options: [
      "A hardware component",
      "A type of malicious software",
      "An operating system",
      "A programming language",
    ],
    correctAnswer: 1,
    solution: "A computer virus is malicious software capable of replicating and affecting computer systems.",
  },
  {
    subject: "Computer Knowledge",
    topic: "Computer Virus",
    question: "Which software is commonly used to detect malware?",
    options: ["Antivirus", "Compiler", "Browser", "Editor"],
    correctAnswer: 0,
    solution: "Antivirus software is designed to detect and remove malware.",
  },
];

async function main() {
  console.log("🌱 Starting 100 Questions seed...\n");

  if (questions.length !== 100) {
    throw new Error(
      `Expected 100 questions, but found ${questions.length}.`,
    );
  }

  console.log(`📊 Total questions: ${questions.length}`);

  // ------------------------------------------------------------
  // Optional: remove existing questions
  // ------------------------------------------------------------
  // WARNING:
  // This removes ALL questions and their dependent options/answers.
  // Uncomment only if this seed database is disposable.
  //
  // await prisma.attemptAnswer.deleteMany();
  // await prisma.testQuestion.deleteMany();
  // await prisma.questionOption.deleteMany();
  // await prisma.question.deleteMany();

  let created = 0;

  for (const [index, questionData] of questions.entries()) {
    // ----------------------------------------------------------
    // Find Subject
    // ----------------------------------------------------------
    const subject = await prisma.subject.findUnique({
      where: {
        name: questionData.subject,
      },
    });

    if (!subject) {
      console.warn(
        `⚠️ Subject not found: ${questionData.subject}`,
      );
      continue;
    }

    // ----------------------------------------------------------
    // Find Topic
    // ----------------------------------------------------------
    const topic = await prisma.topic.findUnique({
      where: {
        subjectId_name: {
          subjectId: subject.id,
          name: questionData.topic,
        },
      },
    });

    if (!topic) {
      console.warn(
        `⚠️ Topic not found: ${questionData.subject} -> ${questionData.topic}`,
      );
      continue;
    }

    // ----------------------------------------------------------
    // Create Question + Options
    // ----------------------------------------------------------
    await prisma.question.create({
      data: {
        subjectId: subject.id,
        topicId: topic.id,
        type: QuestionType.SINGLE_CHOICE,

        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: questionData.question,
                },
              ],
            },
          ],
        },

        solution: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: questionData.solution,
                },
              ],
            },
          ],
        },

        options: {
          create: questionData.options.map((option, optionIndex) => ({
            content: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: option,
                    },
                  ],
                },
              ],
            },
            isCorrect: optionIndex === questionData.correctAnswer,
          })),
        },
      },
    });

    created++;

    console.log(
      `✅ ${index + 1}/100 - ${questionData.subject} → ${questionData.topic}`,
    );
  }

  console.log("\n================================");
  console.log(`✅ Questions created: ${created}`);
  console.log("================================");
}

main()
  .catch((error) => {
    console.error("\n❌ Question seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });