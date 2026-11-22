/**
 * Run once to populate the questions collection:
 *   node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [
  {
    text: 'What does HTTP stand for?',
    options: ['HyperText Transfer Protocol', 'High Text Transfer Protocol', 'HyperText Transmission Process', 'Hyperlink Transfer Protocol'],
    correctIndex: 0,
    subject: 'Web',
  },
  {
    text: 'Which data structure uses LIFO order?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctIndex: 1,
    subject: 'Data Structures',
  },
  {
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    correctIndex: 2,
    subject: 'Algorithms',
  },
  {
    text: 'Which keyword is used to declare a constant in JavaScript?',
    options: ['var', 'let', 'const', 'static'],
    correctIndex: 2,
    subject: 'JavaScript',
  },
  {
    text: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Logic', 'Standard Query List', 'Sequential Query Language'],
    correctIndex: 0,
    subject: 'Databases',
  },
  {
    text: 'Which HTTP method is used to update a resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctIndex: 2,
    subject: 'Web',
  },
  {
    text: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
    correctIndex: 1,
    subject: 'Web',
  },
  {
    text: 'Which of the following is NOT a JavaScript primitive type?',
    options: ['String', 'Boolean', 'Object', 'Number'],
    correctIndex: 2,
    subject: 'JavaScript',
  },
  {
    text: 'What does RAM stand for?',
    options: ['Read Access Memory', 'Random Access Memory', 'Rapid Action Module', 'Read And Modify'],
    correctIndex: 1,
    subject: 'Computer Science',
  },
  {
    text: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
    correctIndex: 2,
    subject: 'Algorithms',
  },
  {
    text: 'What symbol is used for single-line comments in JavaScript?',
    options: ['#', '/* */', '//', '--'],
    correctIndex: 2,
    subject: 'JavaScript',
  },
  {
    text: 'Which protocol is used to send emails?',
    options: ['FTP', 'SMTP', 'HTTP', 'SSH'],
    correctIndex: 1,
    subject: 'Networking',
  },
  {
    text: 'What is the default port for HTTPS?',
    options: ['80', '21', '443', '8080'],
    correctIndex: 2,
    subject: 'Networking',
  },
  {
    text: 'Which of these is a NoSQL database?',
    options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
    correctIndex: 2,
    subject: 'Databases',
  },
  {
    text: 'What does API stand for?',
    options: ['Application Programming Interface', 'Applied Process Integration', 'Automated Program Interaction', 'Application Process Input'],
    correctIndex: 0,
    subject: 'Web',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log(`Seeded ${questions.length} questions.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
