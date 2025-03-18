const mongoose = require('mongoose');

const mwmsResultSchema = new mongoose.Schema({
  result: {
    scores: {
      autonomousMotivation: Number,
      introjectedRegulation: Number,
      externalRegulation: Number
    },
    dimensions: {
      intrinsicMotivation: Number,
      identifiedRegulation: Number,
      introjectedRegulation: Number,
      externalSocialRegulation: Number,
      externalMaterialRegulation: Number
    },
    userAnswers: {
      type: Map,
      of: Number
    },
    iaAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  metadata: {
    duration: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ['fr', 'en'],
      default: 'fr'
    }
  }
}, {
  timestamps: true
});

// Méthode pour calculer les scores MWMS
mwmsResultSchema.methods.calculateScores = function() {
  const answers = this.result.userAnswers;
  
  // Calcul des dimensions détaillées
  const intrinsicMotivation = (
    (answers.get('IM1') || 0) + 
    (answers.get('IM2') || 0) + 
    (answers.get('IM3') || 0)
  ) / 3;
  
  const identifiedRegulation = (
    (answers.get('ID1') || 0) + 
    (answers.get('ID3') || 0)
  ) / 2;
  
  const introjectedRegulation = (
    (answers.get('INTRO3') || 0) + 
    (answers.get('INTRO4') || 0)
  ) / 2;
  
  const externalSocialRegulation = (
    (answers.get('EXS1') || 0) + 
    (answers.get('EXS2') || 0) + 
    (answers.get('EXS3') || 0)
  ) / 3;
  
  const externalMaterialRegulation = (
    (answers.get('EXM1') || 0) + 
    (answers.get('EXM2') || 0) + 
    (answers.get('EXM3') || 0)
  ) / 3;
  
  // Calcul des scores principaux
  const autonomousMotivation = (intrinsicMotivation + identifiedRegulation) / 2;
  const externalRegulation = (externalSocialRegulation + externalMaterialRegulation) / 2;
  
  return {
    scores: {
      autonomousMotivation,
      introjectedRegulation,
      externalRegulation
    },
    dimensions: {
      intrinsicMotivation,
      identifiedRegulation,
      introjectedRegulation,
      externalSocialRegulation,
      externalMaterialRegulation
    }
  };
};

const MwmsResult = mongoose.model('MwmsResult', mwmsResultSchema);

module.exports = MwmsResult; 