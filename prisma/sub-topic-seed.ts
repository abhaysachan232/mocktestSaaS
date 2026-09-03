import { prisma } from "@/lib/prisma";

const subjects = [
  {
    name: "Quantitative Aptitude",
    topics: [
      "Number System",
      "HCF and LCM",
      // "Percentage",
      // "Profit and Loss",
      // "Simple Interest",
      // "Compound Interest",
      // "Ratio and Proportion",
      // "Average",
      // "Time and Work",
      // "Time, Speed and Distance",
      // "Problems on Ages",
      // "Partnership",
      // "Mixture and Alligation",
      // "Algebra",
      // "Geometry",
      // "Mensuration",
      // "Trigonometry",
      // "Data Interpretation",
    ],
  },

  {
    name: "Reasoning",
    topics: [
      "Analogy",
      "Classification",
      "Number Series",
      // "Alphabet Series",
      // "Coding Decoding",
      // "Blood Relations",
      // "Direction Sense",
      // "Ranking and Order",
      // "Alphabet Test",
      // "Number Puzzle",
      // "Logical Venn Diagram",
      // "Syllogism",
      // "Statement and Conclusion",
      // "Statement and Assumption",
      // "Seating Arrangement",
      // "Puzzles",
      // "Data Sufficiency",
      // "Non Verbal Reasoning",
      // "Mirror Image",
      // "Water Image",
      // "Paper Folding",
      // "Paper Cutting",
      // "Embedded Figures",
      "Figure Matrix",
    ],
  },

  // {
  //   name: "English",
  //   topics: [
  //     "Reading Comprehension",
  //     "Grammar",
  //     "Vocabulary",
  //     "Synonyms",
  //     "Antonyms",
  //     "One Word Substitution",
  //     "Idioms and Phrases",
  //     "Sentence Improvement",
  //     "Error Detection",
  //     "Fill in the Blanks",
  //     "Cloze Test",
  //     "Para Jumbles",
  //     "Active and Passive Voice",
  //     "Direct and Indirect Speech",
  //     "Sentence Rearrangement",
  //     "Spelling Correction",
  //     "Word Usage",
  //     "Phrase Replacement",
  //   ],
  // },

  {
    name: "General Awareness",
    topics: [
      "Indian History",
      "Ancient History",
      "Medieval History",
    //   "Modern History",
    //   "Indian Geography",
    //   "World Geography",
    //   "Indian Polity",
    //   "Indian Constitution",
    //   "Indian Economy",
    //   "General Science",
    //   "Physics",
    //   "Chemistry",
    //   "Biology",
    //   "Environment",
    //   "Current Affairs",
    //   "Static GK",
    //   "Awards and Honours",
    //   "Books and Authors",
    //   "Important Days",
    //   "Sports",
    //   "Government Schemes",
    //   "International Organizations",
    ],
  },

  {
    name: "Computer Knowledge",
    topics: [
      // "Computer Fundamentals",
      // "Computer Hardware",
      // "Computer Software",
      // "Operating System",
      // "MS Word",
      // "MS Excel",
      // "MS PowerPoint",
      // "Internet",
      // "Networking",
      // "Database",
      // "Cyber Security",
      "Computer Shortcut Keys",
      "Number System",
      "Programming Basics",
      "Computer Abbreviations",
      "Input and Output Devices",
      "Memory",
      "Computer Virus",
    ],
  },
];

async function main() {
  console.log("🌱 Starting Subject & Topic seed...\n");
  for (const subjectData of subjects) {
    // -----------------------------------------
    // Create / Update Subject
    // -----------------------------------------
    const subject = await prisma.subject.upsert({
      where: {
        name: subjectData.name,
      },
      update: {},
      create: {
        name: subjectData.name,
      },
    });
    console.log(`📚 ${subject.name}`);

    // -----------------------------------------
    // Create / Update Topics
    // -----------------------------------------
    for (const topicName of subjectData.topics) {
      await prisma.topic.upsert({
        where: {
          subjectId_name: {
            subjectId: subject.id,
            name: topicName,
          },
        },
        update: {},
        create: {
          subjectId: subject.id,
          name: topicName,
        },
      });
      console.log(`   └── ${topicName}`);
    }
    console.log("");
  }
  console.log("✅ Subject & Topic seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
