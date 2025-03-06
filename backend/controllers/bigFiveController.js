const BigFiveResult = require('../models/BigFiveResult');
const grokService = require('../services/grokService');
const openaiService = require('../services/openaiService');

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

    // Solution 1: Appel à l'API OpenAI pour analyse avancée (utilisée actuellement)
    const aiAnalysis = await openaiService.analyzeBigFiveResponses({
      scores: scores,
      responses: responses
    });

    // Ajouter l'analyse OpenAI au résultat si disponible
    if (aiAnalysis) {
      result.result.iaAnalysis = aiAnalysis;
      console.log('Analyse OpenAI ajoutée au résultat');
    } else {
      console.warn('Aucune analyse OpenAI disponible - vérifiez la configuration de l\'API');
    }

    /* Solution 2: Appel à l'API Grok pour analyse avancée (commentée)
    const grokAnalysis = await grokService.analyzeBigFiveResponses({
      scores: scores,
      responses: responses
    });

    // Ajouter l'analyse Grok au résultat si disponible
    if (grokAnalysis && !grokAnalysis.error) {
      // Stocker uniquement l'analyse textuelle, sans le modèle et l'usage
      result.result.iaAnalysis = grokAnalysis.analysis;
      console.log('Analyse Grok ajoutée au résultat');
    } else if (grokAnalysis && grokAnalysis.error) {
      console.error('Erreur lors de l\'analyse Grok:', grokAnalysis.message);
      // On continue sans l'analyse Grok
    } else {
      console.warn('Aucune analyse Grok disponible - vérifiez la configuration de l\'API');
    }
    */

    // Sauvegarder le résultat
    await result.save();

    // Envoyer la réponse
    res.status(201).json({
      success: true,
      result: {
        scores: result.result.scores,
        userAnswers: Object.fromEntries(result.result.userAnswers),
        iaAnalysis: result.result.iaAnalysis || null
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