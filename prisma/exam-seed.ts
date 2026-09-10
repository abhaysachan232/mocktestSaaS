import { prisma } from "@/lib/prisma";

const exams = [
  {
    name: "SSC CGL",
    slug: "ssc-cgl",
    description:
      "Staff Selection Commission Combined Graduate Level examination.",
    subjects: [
      {
        name: "Quantitative Aptitude",
        topics: ["Number System", "HCF and LCM"],
      },
      {
        name: "Reasoning",
        topics: ["Analogy", "Classification", "Number Series", "Figure Matrix"],
      },
      {
        name: "General Awareness",
        topics: ["Indian History", "Ancient History", "Medieval History"],
      },
      {
        name: "Computer Knowledge",
        topics: [
          "Computer Shortcut Keys",
          "Number System",
          "Programming Basics",
          "Computer Abbreviations",
          "Input and Output Devices",
          "Memory",
          "Computer Virus",
        ],
      },
    ],
  },

  {
    name: "SSC CHSL",
    slug: "ssc-chsl",
    description:
      "Staff Selection Commission Combined Higher Secondary Level examination.",
    subjects: [
      {
        name: "Quantitative Aptitude",
        topics: ["Number System", "HCF and LCM"],
      },
      {
        name: "Reasoning",
        topics: ["Analogy", "Classification", "Number Series"],
      },
      {
        name: "General Awareness",
        topics: ["Indian History", "Ancient History", "Medieval History"],
      },
      {
        name: "Computer Knowledge",
        topics: [
          "Computer Shortcut Keys",
          "Computer Abbreviations",
          "Input and Output Devices",
          "Memory",
          "Computer Virus",
        ],
      },
    ],
  },

  {
    name: "SSC MTS",
    slug: "ssc-mts",
    description:
      "Staff Selection Commission Multi Tasking Staff examination.",
    subjects: [
      {
        name: "Quantitative Aptitude",
        topics: ["Number System", "HCF and LCM"],
      },
      {
        name: "Reasoning",
        topics: ["Analogy", "Classification", "Number Series"],
      },
      {
        name: "General Awareness",
        topics: ["Indian History", "Ancient History", "Medieval History"],
      },
      {
        name: "Computer Knowledge",
        topics: [
          "Computer Shortcut Keys",
          "Input and Output Devices",
          "Memory",
          "Computer Virus",
        ],
      },
    ],
  },

  {
    name: "Banking",
    slug: "banking",
    description:
      "Competitive banking examination covering aptitude, reasoning, awareness and computer knowledge.",
    subjects: [
      {
        name: "Quantitative Aptitude",
        topics: ["Number System", "HCF and LCM"],
      },
      {
        name: "Reasoning",
        topics: ["Analogy", "Classification", "Number Series", "Figure Matrix"],
      },
      {
        name: "General Awareness",
        topics: ["Indian History", "Ancient History", "Medieval History"],
      },
      {
        name: "Computer Knowledge",
        topics: [
          "Computer Shortcut Keys",
          "Number System",
          "Programming Basics",
          "Computer Abbreviations",
          "Input and Output Devices",
          "Memory",
          "Computer Virus",
        ],
      },
    ],
  },

  {
    name: "Railway",
    slug: "railway",
    description:
      "Railway recruitment examination covering aptitude, reasoning, awareness and computer knowledge.",
    subjects: [
      {
        name: "Quantitative Aptitude",
        topics: ["Number System", "HCF and LCM"],
      },
      {
        name: "Reasoning",
        topics: ["Analogy", "Classification", "Number Series", "Figure Matrix"],
      },
      {
        name: "General Awareness",
        topics: ["Indian History", "Ancient History", "Medieval History"],
      },
      {
        name: "Computer Knowledge",
        topics: [
          "Computer Shortcut Keys",
          "Number System",
          "Computer Abbreviations",
          "Input and Output Devices",
          "Memory",
          "Computer Virus",
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting Exam seed...\n");

  for (const examData of exams) {
    // -----------------------------------------
    // Create / Update Exam
    // -----------------------------------------
    const exam = await prisma.exam.upsert({
      where: {
        slug: examData.slug,
      },
      update: {
        name: examData.name,
        description: examData.description,
      },
      create: {
        name: examData.name,
        slug: examData.slug,
        description: examData.description,
      },
    });

    console.log(`📝 ${exam.name}`);

    // -----------------------------------------
    // Find subjects and connect them to exam
    // -----------------------------------------
    for (const subjectData of examData.subjects) {
      const subject = await prisma.subject.findUnique({
        where: {
          name: subjectData.name,
        },
      });

      if (!subject) {
        console.warn(
          `   ⚠️ Subject not found: ${subjectData.name}`,
        );
        continue;
      }

      // -----------------------------------------
      // ExamSubject
      // -----------------------------------------
      await prisma.examSubject.upsert({
        where: {
          examId_subjectId: {
            examId: exam.id,
            subjectId: subject.id,
          },
        },
        update: {},
        create: {
          examId: exam.id,
          subjectId: subject.id,
        },
      });

      console.log(`   📚 ${subject.name}`);

      // -----------------------------------------
      // Find topics and connect them to exam
      // -----------------------------------------
      for (const topicName of subjectData.topics) {
        const topic = await prisma.topic.findUnique({
          where: {
            subjectId_name: {
              subjectId: subject.id,
              name: topicName,
            },
          },
        });

        if (!topic) {
          console.warn(
            `      ⚠️ Topic not found: ${topicName}`,
          );
          continue;
        }

        // -----------------------------------------
        // ExamTopic
        // -----------------------------------------
        await prisma.examTopic.upsert({
          where: {
            examId_topicId: {
              examId: exam.id,
              topicId: topic.id,
            },
          },
          update: {},
          create: {
            examId: exam.id,
            subjectId: subject.id,
            topicId: topic.id,
          },
        });

        console.log(`      └── ${topic.name}`);
      }
    }

    console.log("");
  }

  console.log("✅ 5 Exams seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Exam seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });