const MwmsResult = require('../models/MwmsResult');
const openaiService = require('../services/openaiService');

// Soumettre un nouveau test MWMS
exports.submitTest = async (req, res) => {
  try {
    const { responses, scores, duration, language = 'fr' } = req.body;

    // Créer une nouvelle instance de résultat
    const result = new MwmsResult({
      result: {
        scores: scores.scores,
        dimensions: scores.dimensions,
        userAnswers: responses
      },
      metadata: {
        duration: duration,
        language: language
      }
    });

    // Appel à l'API OpenAI pour analyse avancée
    try {
      const aiAnalysis = await openaiService.analyzeMwmsResponses({
        scores: scores,
        responses: responses,
        language: language
      });

      // Ajouter l'analyse OpenAI au résultat si disponible
      if (aiAnalysis) {
        result.result.iaAnalysis = aiAnalysis;
        console.log('Analyse OpenAI ajoutée au résultat MWMS');
      } else {
        console.warn('Aucune analyse OpenAI disponible pour MWMS - vérifiez la configuration de l\'API');
      }
    } catch (aiError) {
      console.error('Erreur lors de l\'analyse IA des résultats MWMS:', aiError);
      // Continuer sans l'analyse IA
    }

    // Sauvegarder le résultat
    await result.save();

    // Envoyer la réponse
    res.status(201).json({
      success: true,
      result: {
        scores: result.result.scores,
        dimensions: result.result.dimensions,
        iaAnalysis: result.result.iaAnalysis || null
      },
      duration: result.metadata.duration
    });
  } catch (error) {
    console.error('Erreur lors de la soumission du test MWMS:', error);
    res.status(500).json({
      message: 'Erreur lors de la soumission du test MWMS',
      error: error.message
    });
  }
};

// Récupérer un résultat spécifique
exports.getResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await MwmsResult.findById(resultId);

    if (!result) {
      return res.status(404).json({
        message: 'Résultat non trouvé'
      });
    }

    res.json({
      success: true,
      result: {
        scores: result.result.scores,
        dimensions: result.result.dimensions,
        iaAnalysis: result.result.iaAnalysis || null
      },
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du résultat MWMS:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération du résultat',
      error: error.message
    });
  }
};

// Récupérer des statistiques générales
exports.getStatistics = async (req, res) => {
  try {
    const totalTests = await MwmsResult.countDocuments();
    
    // Calculer les moyennes des scores
    const aggregateResult = await MwmsResult.aggregate([
      {
        $group: {
          _id: null,
          avgAutonomousMotivation: { $avg: "$result.scores.autonomousMotivation" },
          avgIntrojectedRegulation: { $avg: "$result.scores.introjectedRegulation" },
          avgExternalRegulation: { $avg: "$result.scores.externalRegulation" },
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = aggregateResult.length > 0 ? aggregateResult[0] : {
      avgAutonomousMotivation: 0,
      avgIntrojectedRegulation: 0,
      avgExternalRegulation: 0,
      count: 0
    };

    res.json({
      success: true,
      statistics: {
        totalTests,
        averageScores: {
          autonomousMotivation: stats.avgAutonomousMotivation,
          introjectedRegulation: stats.avgIntrojectedRegulation,
          externalRegulation: stats.avgExternalRegulation
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques MWMS:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
}; 