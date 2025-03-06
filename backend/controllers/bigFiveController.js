const BigFiveResult = require('../models/BigFiveResult');
const grokService = require('../services/grokService');

// Soumettre un nouveau test Big Five
exports.submitTest = async (req, res) => {
  try {
    const { responses, scores, duration } = req.body;

    // Créer une nouvelle instance de résultat
    const result = new BigFiveResult({
      result: {
        scores: scores,
        userAnswers: responses
      },
      metadata: {
        duration: duration
      }
    });

    // Appel à l'API Grok3 pour analyse avancée
    const grokAnalysis = await grokService.analyzeBigFiveResponses({
      scores: scores,
      responses: responses
    });

    // Ajouter l'analyse Grok au résultat si disponible
    if (grokAnalysis && !grokAnalysis.error) {
      result.result.grokAnalysis = grokAnalysis;
    }

    // Sauvegarder le résultat
    await result.save();

    // Envoyer la réponse
    res.status(201).json({
      success: true,
      result: {
        scores: result.result.scores,
        userAnswers: Object.fromEntries(result.result.userAnswers),
        grokAnalysis: result.result.grokAnalysis || null
      },
      duration: result.metadata.duration
    });
  } catch (error) {
    console.error('Erreur lors de la soumission du test:', error);
    res.status(500).json({
      message: 'Erreur lors de la soumission du test',
      error: error.message
    });
  }
};

// Obtenir des statistiques agrégées
exports.getStatistics = async (req, res) => {
  try {
    const stats = await BigFiveResult.aggregate([
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgDuration: { $avg: '$metadata.duration' },
          avgScores: {
            $avg: {
              extraversion: '$result.scores.extraversion',
              nevrosisme: '$result.scores.nevrosisme',
              agreabilite: '$result.scores.agreabilite',
              conscience: '$result.scores.conscience',
              ouverture: '$result.scores.ouverture'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalTests: 1,
          avgDuration: 1,
          avgScores: 1
        }
      }
    ]);

    res.json(stats[0] || {
      totalTests: 0,
      avgDuration: 0,
      avgScores: {
        extraversion: 0,
        nevrosisme: 0,
        agreabilite: 0,
        conscience: 0,
        ouverture: 0
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
}; 