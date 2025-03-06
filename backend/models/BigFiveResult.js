const mongoose = require('mongoose');

const bigFiveResultSchema = new mongoose.Schema({
  result: {
    scores: {
      extraversion: Number,
      nevrosisme: Number,
      agreabilite: Number,
      conscience: Number,
      ouverture: Number
    },
    userAnswers: {
      type: Map,
      of: {
        content: String,
        response: Number
      }
    },
    grokAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  metadata: {
    duration: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Méthode pour calculer les scores Big Five
bigFiveResultSchema.methods.calculateScores = function() {
  const dimensions = {
    extraversion: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
    nevrosisme: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10'],
    agreabilite: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
    conscience: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
    ouverture: ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10']
  };

  const reversedQuestions = new Set([
    'E2', 'E4', 'E6', 'E8', 'E10',
    'N2', 'N4',
    'A1', 'A3', 'A5', 'A7',
    'C2', 'C4', 'C6', 'C8',
    'O2', 'O4', 'O6'
  ]);

  const scores = {};

  for (const [dimension, questions] of Object.entries(dimensions)) {
    let sum = 0;
    questions.forEach(code => {
      const answer = this.result.userAnswers.get(code);
      if (answer) {
        const score = reversedQuestions.has(code) ? 6 - answer.response : answer.response;
        sum += score;
      }
    });
    scores[dimension] = sum;
  }

  return scores;
};

const BigFiveResult = mongoose.model('BigFiveResult', bigFiveResultSchema);

module.exports = BigFiveResult; 