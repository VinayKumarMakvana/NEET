const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom ID instead of _id if needed
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  pin: { type: String, required: true },
  role: { type: String, default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

const questionSchema = new mongoose.Schema({
  internal_id: { type: String, required: true, unique: true },
  subject: { type: String },
  subjectCode: { type: String },
  chapter: { type: String },
  questionType: { type: String },
  question: { type: String },
  questionHi: { type: String },
  optionA: { type: String },
  optionB: { type: String },
  optionC: { type: String },
  optionD: { type: String },
  optionA_hi: { type: String },
  optionB_hi: { type: String },
  optionC_hi: { type: String },
  optionD_hi: { type: String },
  correctIndex: { type: Number },
  explanation: { type: String },
  explanationHi: { type: String },
  ncertRef: { type: String },
  pyqRepeat: { type: Number }
});

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  appState: { type: mongoose.Schema.Types.Mixed, default: {} },
  lastUpdated: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  utr: { type: String, unique: true },
  amount: { type: Number },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);
const Progress = mongoose.model('Progress', progressSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { User, Question, Progress, Transaction };
