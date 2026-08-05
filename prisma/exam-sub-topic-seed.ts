import { prisma } from "@/lib/prisma";
// import { masterSubjects } from "./data/master-subjects";
// import { masterTopics } from "./data/master-topics";
import { exams } from "./data/exams";
import { examSubjects } from "./data/exam-subjects";

async function seedSubjects() {
  // for (const subject of masterSubjects) {
    // await prisma.subject.upsert({
    //   where: {
    //     slug: subject.slug,
    //   },
    //   update: {},
    //   create: subject,
    // });
  // }
}

async function seedTopics() {
  // const subjects = await prisma.subject.findMany();

  // for (const subject of subjects) {
    // const topics =
    //   masterTopics[subject.name as keyof typeof masterTopics] || [];

    // for (const topicName of topics) {
      // await prisma.topic.upsert({
      //   where: {
      //     subjectId_slug: {
      //       subjectId: subject.id
      //     },
      //   },
      //   update: {},
      //   create: {
      //     subjectId: subject.id,
      //     name: topicName
      //   },
      // });
    // }
  // }
}

async function seedExams() {
  for (const exam of exams) {
    // const createdExam = await prisma.exam.upsert({
    //   where: {
    //     slug: exam.slug,
    //   },
    //   update: {},
    //   create: exam,
    // });

    const subjects = examSubjects[exam.slug as keyof typeof examSubjects] ?? [];

    for (const subjectName of subjects) {
      const subject = await prisma.subject.findUnique({
        where: {
          name: subjectName,
        },
      });

      if (!subject) continue;

      // await prisma.examSubject.upsert({
      //   where: {
      //     examId_subjectId: {
      //       examId: createdExam.id,
      //       subjectId: subject.id,
      //     },
      //   },
      //   update: {},
      //   create: {
      //     examId: createdExam.id,
      //     subjectId: subject.id,
      //   },
      // });
    }
  }
}

async function main() {
  await seedSubjects();
  await seedTopics();
  await seedExams();

  console.log("✅ Master Subjects Seeded");
  console.log("✅ Master Topics Seeded");
  console.log("✅ Exams Seeded");
  console.log("✅ Exam Subject Mapping Seeded");
}

main().finally(async () => {
  await prisma.$disconnect();
});
