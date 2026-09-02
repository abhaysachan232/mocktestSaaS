# MockTest SaaS

A full-stack **online examination and coaching management platform** built with Next.js, TypeScript, Prisma, PostgreSQL, React Hook Form and Zod.

The platform is designed for **Admin, Coaching and Student** users and supports the complete workflow from question-bank management to mock-test creation, student examination, result evaluation and performance analytics.

---

## 🚀 Features

### Admin

- Manage Students
- Manage Coaching Institutes
- Manage Exams
- Manage Subjects
- Manage Topics
- Manage Questions
- Manage Question Options
- Manage Mock Tests
- Publish / Archive Tests
- View Student/Test statistics
- View Coaching statistics
- Dashboard analytics

### Coaching

- Coaching dashboard
- View registered students
- Monitor student test attempts
- Monitor completed/in-progress tests
- View student performance
- View test results
- View accuracy and percentage statistics

### Student

- Student dashboard
- View available tests
- Start mock tests
- Save answers
- Navigate between questions
- Submit test
- Automatic evaluation
- View detailed result
- View correct/incorrect/skipped questions
- View marks and percentage
- View accuracy
- View rank and percentile
- Continue in-progress tests
- View previous results
- View performance history
- Leaderboard support

---

# 🛠️ Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- App Router
- React Server Components
- Tailwind CSS
- React Hook Form
- Zod

## Backend

- Next.js Server Actions
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Neon Database

## Authentication

- NextAuth.js v5
- Credentials Authentication
- Role Based Access Control

## Development

- Turbopack
- ESLint
- TypeScript
- Git

---

# 📁 Project Structure

```text
mocktestSaaS/
│
├── actions/
│   ├── dashboard.actions.ts
│   ├── exam.actions.ts
│   ├── question.actions.ts
│   ├── test.actions.ts
│   ├── test-attempt.actions.ts
│   └── test-result.actions.ts
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (protected)/
│   │   ├── dashboard/
│   │   ├── exams/
│   │   ├── questions/
│   │   ├── tests/
│   │   └── student/
│   │
│   └── api/
│
├── components/
│   ├── dashboard/
│   ├── exams/
│   ├── questions/
│   ├── tests/
│   └── test-engine/
│
├── generated/
│   └── prisma/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── validations/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
│
├── types/
│
├── .env
├── next.config.ts
├── prisma.config.ts
├── package.json
└── README.md
```

---

# 👥 User Roles

The application supports the following roles:

```text
STUDENT
COACHING
SALES
MAINTINANCE
ADMIN
```

### ADMIN

Full access to the platform.

### COACHING

Manages and monitors students associated with a coaching institute.

### STUDENT

Attempts tests and views performance/results.

### SALES

Reserved for sales-related functionality.

### MAINTINANCE

Reserved for platform maintenance functionality.

---

# 🗄️ Database Architecture

The application uses:

```text
Next.js
   │
   ▼
Server Actions
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL / Neon
```

---

# 📊 Main Database Models

## User

Stores authentication and role information.

```text
User
 ├── Student
 ├── Coaching
 ├── Exam
 ├── Question
 └── TestAttempt
```

Important fields:

```text
id
email
password
role
isActive
createdAt
updatedAt
```

---

## Student

Stores student-specific information.

```text
Student
 ├── name
 ├── dob
 ├── mobile
 └── user
```

---

## Coaching

Stores coaching institute information.

```text
Coaching
 ├── code
 ├── coachingName
 ├── mobile
 ├── logo
 ├── address
 ├── ownerName
 ├── idProof
 └── idNumber
```

---

## Exam

Represents an examination such as:

```text
SSC CGL
SSC CHSL
RRB NTPC
RRB Group D
IBPS
UP Police
TET
CET
```

An Exam can contain:

```text
Subjects
Topics
Tests
```

---

## Subject

Example:

```text
Mathematics
Reasoning
English
General Awareness
General Science
```

---

## Topic

Topics belong to a Subject.

Example:

```text
Mathematics
 ├── Algebra
 ├── Geometry
 ├── Percentage
 ├── Profit & Loss
 └── Time & Work
```

---

# ❓ Question Management

Supported question types:

```text
SINGLE_CHOICE
MULTIPLE_CHOICE
```

Each question contains:

```text
Question
 ├── Content
 ├── Solution
 ├── Subject
 ├── Topic
 └── Options
```

Question content and solutions are stored as JSON to support rich content.

The editor supports rich question content and images.

---

# 📝 Test System

Supported test types:

```text
PRACTICE
MOCK
FULL_LENGTH
SUBJECT_WISE
TOPIC_WISE
```

Test statuses:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Each test contains:

```text
name
slug
description
testType
status
exam
duration
totalMarks
totalQuestions
negativeMarking
negativeMarks
publishedAt
```

---

# 🧪 Student Test Engine

The student test engine supports:

1. Start Test
2. Create Test Attempt
3. Load Questions
4. Select Answer
5. Save Answer
6. Navigate Questions
7. Track Attempted Questions
8. Track Skipped Questions
9. Submit Test
10. Evaluate Test
11. Generate Result
12. Calculate Rank
13. Calculate Percentile

---

# 🔄 Test Attempt Flow

```text
Student
   │
   ▼
Published Test
   │
   ▼
Start Test
   │
   ▼
TestAttempt
   │
   ▼
Answer Questions
   │
   ▼
Save Answers
   │
   ▼
Submit
   │
   ▼
Server-side Evaluation
   │
   ▼
Result
   │
   ├── Marks
   ├── Percentage
   ├── Accuracy
   ├── Correct
   ├── Incorrect
   ├── Skipped
   ├── Rank
   └── Percentile
```

---

# 📈 Scoring System

The application calculates marks on the server.

### Marks Per Question

```text
marksPerQuestion =
totalMarks / totalQuestions
```

### Positive Marks

```text
positiveMarks =
correct × marksPerQuestion
```

### Negative Marks

If negative marking is enabled:

```text
negativeMarks =
incorrect × configuredNegativeMarks
```

### Final Marks

```text
marksObtained =
positiveMarks - negativeMarks
```

### Percentage

```text
percentage =
(marksObtained / totalMarks) × 100
```

### Accuracy

```text
accuracy =
(correct / attempted) × 100
```

If no question is attempted:

```text
accuracy = 0
```

---

# 🏆 Rank & Percentile

Rank calculation is performed only for:

```text
SUBMITTED
EXPIRED
```

attempts.

Ranking order:

```text
1. marksObtained DESC
2. createdAt ASC
```

Competition ranking is used:

```text
1
1
3
4
4
6
```

Percentile:

```text
percentile =
((totalParticipants - rank) / totalParticipants) × 100
```

The percentile is stored up to two decimal places.

Rank calculation failure does not fail the test submission.

---

# 📊 Dashboard Architecture

## Admin Dashboard

Admin dashboard provides:

```text
Total Students
Total Coachings
Total Tests
Total Questions
Published Tests
Recent Students
Recent Coachings
```

It also provides student and coaching data.

---

## Coaching Dashboard

Coaching dashboard provides:

```text
Total Students
Total Attempts
Completed Attempts
In-Progress Attempts
Average Percentage
Average Accuracy
```

It also provides:

```text
Student List
Test Attempts
Results
Recent Results
Published Tests
```

---

## Student Dashboard

Student dashboard provides:

```text
Available Tests
In-Progress Tests
Completed Tests
Previous Results
Average Score
Best Score
Average Percentage
Average Accuracy
Rank
Percentile
```

---

# 🔐 Authentication

Authentication is implemented using NextAuth.js.

Basic authentication flow:

```text
Login
  │
  ▼
Credentials Validation
  │
  ▼
Password Verification
  │
  ▼
Session Creation
  │
  ▼
Role Check
  │
  ▼
Dashboard
```

Passwords should never be stored as plain text.

Use password hashing such as bcrypt.

---

# 🔒 Role Based Access Control

Application routes and functionality should be protected according to user role.

Example:

```text
ADMIN
 ├── Admin Dashboard
 ├── Students
 ├── Coachings
 ├── Exams
 ├── Questions
 └── Tests

COACHING
 ├── Coaching Dashboard
 ├── Students
 ├── Attempts
 └── Results

STUDENT
 ├── Student Dashboard
 ├── Tests
 ├── Test Engine
 └── Results
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="your-neon-postgresql-url"

AUTH_SECRET="your-auth-secret"

NEXTAUTH_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Never commit `.env` to Git.

Add:

```text
.env
.env.local
```

to `.gitignore`.

---

# 📦 Installation

Clone the project and install dependencies:

```bash
npm install
```

---

# 🗄️ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Check migration status:

```bash
npx prisma migrate status
```

Run development migration:

```bash
npx prisma migrate dev
```

---

# 🌱 Database Seed

Run seed:

```bash
npm run seed
```

If a seed script is not configured, run the appropriate Prisma seed command configured in the project.

---

# ▶️ Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Run:

```bash
npm run build
```

Then:

```bash
npm start
```

---

# 🔍 Type Checking

Run TypeScript checking:

```bash
npx tsc --noEmit
```

---

# 🧹 Linting

Run:

```bash
npm run lint
```

---

# 🧪 Development Workflow

Recommended workflow:

```text
1. Update Prisma schema
        ↓
2. Run migration
        ↓
3. Generate Prisma Client
        ↓
4. Create/update Server Action
        ↓
5. Add validation
        ↓
6. Build UI
        ↓
7. Test functionality
        ↓
8. Run TypeScript check
        ↓
9. Run production build
```

---

# 📌 Development Rules

## Server-side Database Access

Prisma database operations should be performed on the server.

Use:

```text
Server Actions
Server Components
API Routes
```

Do not expose direct Prisma access to client components.

---

## Validation

Use Zod for validating:

```text
Forms
Server Actions
User Input
API Payloads
```

Client-side validation improves UX, but important validation must also happen server-side.

---

## Security

Never trust:

```text
userId
role
coachingId
attemptId
```

coming directly from a client request.

Important authorization checks should be performed server-side.

---

# 📚 Project Development Phases

## Phase 1 — Master Subjects

- Subject CRUD
- Subject listing
- Subject validation

**Status: Completed**

---

## Phase 2 — Master Topics

- Topic CRUD
- Subject ↔ Topic relationship
- Topic listing

**Status: Completed**

---

## Phase 3 — Exams

- Exam CRUD
- Exam ↔ Subject mapping
- Exam ↔ Topic mapping

**Status: Completed**

---

## Phase 4 — Questions

- Question CRUD
- Question options
- Single choice
- Multiple choice
- Rich text content
- Solution
- Image support
- Subject mapping
- Topic mapping

**Status: Completed**

---

## Phase 5 — Mock Tests

- Test creation
- Test configuration
- Question selection
- Test status
- Test publishing
- Negative marking

**Status: Completed**

---

## Phase 6 — Test Assignment

- Test assignment workflow
- Student/coaching test access

**Status: Completed**

---

## Phase 7 — Student Exam Engine

- Test start
- Question navigation
- Answer selection
- Answer saving
- Timer
- Test submission

**Status: Completed**

---

## Phase 8 — Results

### 8.1 Result Schema

Completed.

### 8.2 Start Attempt

Completed.

### 8.3 Save Answers

Completed.

### 8.4 Submit & Evaluate

Completed.

### 8.5 Result Page

Completed.

### 8.6 Rank & Percentile

Completed.

---

# 🚧 Phase 9 — Dashboards

Current dashboard phase includes:

### Admin

- Admin dashboard
- Student statistics
- Coaching statistics
- Test statistics
- Question statistics

### Coaching

- Coaching dashboard
- Student statistics
- Attempt statistics
- Result statistics

### Student

- Student dashboard
- Available tests
- Continue tests
- Test history
- Results
- Performance statistics
- Rank
- Percentile
- Leaderboard

**Status: In Development**

---

# 🧠 Architecture Overview

```text
                         ┌──────────────────┐
                         │      Next.js     │
                         │     App Router   │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
           Server Actions    Server Components   API Routes
                 │
                 ▼
          ┌───────────────┐
          │     Prisma    │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ PostgreSQL    │
          │    / Neon     │
          └───────────────┘
```

---

# 🧩 Core Relationships

```text
User
 │
 ├────────────── Student
 │
 ├────────────── Coaching
 │
 ├────────────── Exam
 │
 ├────────────── Question
 │
 └────────────── TestAttempt


Exam
 │
 ├── ExamSubject ── Subject
 │
 └── ExamTopic ──── Topic


Subject
 │
 └── Topic
      │
      └── Question


Test
 │
 ├── Exam
 ├── TestQuestion
 │       │
 │       └── Question
 │
 └── TestAttempt
          │
          ├── AttemptAnswer
          │
          └── Result
```

---

# 📝 Important Database Design Notes

The current `Student` model does not contain:

```text
createdAt
updatedAt
```

Therefore, student queries should use the related `User.createdAt` when chronological ordering is required:

```ts
orderBy: {
  user: {
    createdAt: "desc",
  },
}
```

Similarly, the current `Coaching` model does not contain `createdAt`.

For coaching sorting, use an existing field such as:

```ts
orderBy: {
  coachingName: "asc",
}
```

If true "recent coaching" functionality is required later, `createdAt` and `updatedAt` can be added to the `Coaching` model.

---

# 🐛 Troubleshooting

## Prisma Client Validation Error

If Prisma reports:

```text
Unknown argument `createdAt`
```

check whether the field actually exists in the queried Prisma model.

For example:

```ts
prisma.student.findMany();
```

can only directly order by Student fields or supported relation ordering.

---

## Prisma Client Out of Date

Run:

```bash
npx prisma generate
```

Then restart the Next.js development server.

---

## Migration Problems

Check:

```bash
npx prisma migrate status
```

If the database schema is different from the Prisma schema, resolve the migration/drift issue before continuing development.

---

## Next.js Build Error

Run:

```bash
npx tsc --noEmit
```

Then:

```bash
npm run build
```

Fix TypeScript errors before deployment.

---

# 🚀 Future Enhancements

Potential future modules:

- Payment Gateway
- Subscription Plans
- Coupons
- Course Management
- Batch Management
- Student Enrollment
- Test Assignment Rules
- Advanced Leaderboards
- Question Import from Excel/CSV
- PDF Question Import
- OCR
- AI Question Generation
- AI Question Validation
- Question Duplicate Detection
- Question Version History
- Audit Logs
- Advanced Analytics
- Performance Charts
- Coaching Reports
- Student Performance Reports
- Notifications
- Email/SMS Integration

---

# 📄 License

This project is currently intended for private development and testing.

Add an appropriate open-source or commercial license before public distribution.

---

# 👨‍💻 Development

Built using:

```text
Next.js
React
TypeScript
Prisma
PostgreSQL
Tailwind CSS
NextAuth
React Hook Form
Zod
```

**MockTest SaaS — Online Examination & Coaching Platform**
