const RiasecResult = require('../models/RiasecResult');
const grokService = require('../services/grokService');

// Soumettre un nouveau test RIASEC
exports.submitTest = async (req, res) => {
  try {
    const { responses, scores, duration } = req.body;

    // Créer une nouvelle instance de résultat
    const result = new RiasecResult({
      result: {
        scores: scores.total,
        themes: scores.themes,
        predominant: scores.predominant,
        userAnswers: responses
      },
      metadata: {
        duration: duration
      }
    });

    // Appel à l'API Grok3 pour analyse avancée
    const grokAnalysis = await grokService.analyzeRiasecResponses({
      scores: scores,
      responses: responses
    });

    // Ajouter l'analyse Grok au résultat si disponible
    if (grokAnalysis && !grokAnalysis.error) {
      // Stocker uniquement l'analyse textuelle, sans le modèle et l'usage
      result.result.grokAnalysis = grokAnalysis.analysis;
      console.log('Analyse Grok ajoutée au résultat');
    } else if (grokAnalysis && grokAnalysis.error) {
      console.error('Erreur lors de l\'analyse Grok:', grokAnalysis.message);
      // On continue sans l'analyse Grok
    } else {
      console.warn('Aucune analyse Grok disponible - vérifiez la configuration de l\'API');
    }

    // Sauvegarder le résultat
    await result.save();

    // Envoyer la réponse
    res.status(201).json({
      success: true,
      result: {
        scores: result.result.scores,
        themes: result.result.themes,
        predominant: result.result.predominant,
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

// Récupérer les résultats d'un utilisateur
exports.getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await RiasecResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!results.length) {
      return res.status(404).json({
        message: 'Aucun résultat trouvé pour cet utilisateur'
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des résultats',
      error: error.message
    });
  }
};

// Récupérer un résultat spécifique
exports.getResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await RiasecResult.findById(resultId);

    if (!result) {
      return res.status(404).json({
        message: 'Résultat non trouvé'
      });
    }

    res.json({
      result: {
        scores: result.result.scores,
        userAnswers: Object.fromEntries(result.result.userAnswers)
      },
      duration: result.metadata.duration
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du résultat:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération du résultat',
      error: error.message
    });
  }
};

// Supprimer un résultat
exports.deleteResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await RiasecResult.findByIdAndDelete(resultId);

    if (!result) {
      return res.status(404).json({
        message: 'Résultat non trouvé'
      });
    }

    res.json({
      message: 'Résultat supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du résultat:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression du résultat',
      error: error.message
    });
  }
};

// Obtenir des statistiques agrégées
exports.getStatistics = async (req, res) => {
  try {
    const stats = await RiasecResult.aggregate([
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgDuration: { $avg: '$metadata.duration' },
          dominantTypes: {
            $push: {
              $arrayElemAt: ['$interpretation.dominantTypes', 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalTests: 1,
          avgDuration: 1,
          dominantTypes: {
            $reduce: {
              input: '$dominantTypes',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $cond: [
                      { $eq: ['$$this', null] },
                      {},
                      {
                        $arrayToObject: [[
                          {
                            k: '$$this',
                            v: { $add: [{ $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] }, 1] }
                          }
                        ]]
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalTests: 0,
      avgDuration: 0,
      dominantTypes: {}
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
}; 