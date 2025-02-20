// Descriptions des dimensions GCBS
export const gcbsDescriptions = {
  RA: {
    title: "Raisonnement Analytique",
    high: "Vous avez une forte tendance à privilégier l'analyse logique et systématique dans votre prise de décision.",
    low: "Vous avez tendance à vous fier davantage à votre intuition et à une approche plus holistique dans votre prise de décision."
  },
  LP: {
    title: "Logique Pratique",
    high: "Vous privilégiez les solutions concrètes et pragmatiques, basées sur l'expérience directe.",
    low: "Vous préférez les approches théoriques et conceptuelles dans la résolution de problèmes."
  },
  MF: {
    title: "Mode de Fonctionnement",
    high: "Vous adoptez une approche méthodique et structurée dans votre façon de travailler.",
    low: "Vous préférez une approche plus flexible et adaptative dans votre manière de fonctionner."
  },
  V: {
    title: "Validation",
    high: "Vous accordez une grande importance à la vérification et à la validation de vos décisions.",
    low: "Vous faites davantage confiance à votre jugement initial sans nécessité de validation extensive."
  }
};

// Questions GCBS
export const gcbsQuestions = [
  // RA (Raisonnement Analytique)
  {
    id: "RA1",
    optionA: "Je préfère analyser tous les aspects d'un problème avant de prendre une décision",
    optionB: "Je me fie à mon instinct pour prendre des décisions rapides",
    dimension: "RA"
  },
  {
    id: "RA2",
    optionA: "J'aime décomposer les problèmes en éléments plus simples",
    optionB: "Je préfère avoir une vue d'ensemble des situations",
    dimension: "RA"
  },
  {
    id: "RA3",
    optionA: "Je prends le temps d'examiner toutes les options disponibles",
    optionB: "Je choisis rapidement l'option qui me semble la plus évidente",
    dimension: "RA"
  },
  {
    id: "RA4",
    optionA: "J'aime utiliser des critères objectifs pour évaluer les situations",
    optionB: "Je me fie à mon ressenti pour évaluer les situations",
    dimension: "RA"
  },
  {
    id: "RA5",
    optionA: "Je préfère avoir des données chiffrées pour prendre une décision",
    optionB: "Je me base sur mon expérience personnelle pour décider",
    dimension: "RA"
  },
  {
    id: "RA6",
    optionA: "J'établis des listes de pour et de contre avant de choisir",
    optionB: "Je sais intuitivement quelle est la meilleure option",
    dimension: "RA"
  },
  {
    id: "RA7",
    optionA: "Je cherche à comprendre les causes profondes d'un problème",
    optionB: "Je préfère trouver rapidement une solution qui fonctionne",
    dimension: "RA"
  },
  {
    id: "RA8",
    optionA: "J'aime créer des modèles ou des schémas pour analyser",
    optionB: "Je préfère me fier à ma compréhension intuitive",
    dimension: "RA"
  },

  // LP (Logique Pratique)
  {
    id: "LP1",
    optionA: "Je privilégie les solutions basées sur l'expérience pratique",
    optionB: "Je préfère explorer de nouvelles approches théoriques",
    dimension: "LP"
  },
  {
    id: "LP2",
    optionA: "Je me base sur ce qui a déjà fait ses preuves",
    optionB: "J'aime expérimenter de nouvelles méthodes",
    dimension: "LP"
  },
  {
    id: "LP3",
    optionA: "Je préfère les solutions simples et directes",
    optionB: "J'apprécie les solutions innovantes et complexes",
    dimension: "LP"
  },
  {
    id: "LP4",
    optionA: "Je m'appuie sur mon expérience concrète",
    optionB: "Je m'inspire de concepts abstraits",
    dimension: "LP"
  },
  {
    id: "LP5",
    optionA: "Je cherche des solutions immédiatement applicables",
    optionB: "Je préfère développer des solutions à long terme",
    dimension: "LP"
  },
  {
    id: "LP6",
    optionA: "Je me concentre sur les aspects concrets d'un problème",
    optionB: "J'explore les implications théoriques",
    dimension: "LP"
  },
  {
    id: "LP7",
    optionA: "Je préfère agir sur base de faits tangibles",
    optionB: "J'aime explorer des possibilités hypothétiques",
    dimension: "LP"
  },
  {
    id: "LP8",
    optionA: "Je choisis des solutions éprouvées et fiables",
    optionB: "Je teste des approches expérimentales",
    dimension: "LP"
  },

  // MF (Mode de Fonctionnement)
  {
    id: "MF1",
    optionA: "Je suis une méthode structurée et planifiée",
    optionB: "Je m'adapte aux circonstances de manière flexible",
    dimension: "MF"
  },
  {
    id: "MF2",
    optionA: "J'aime avoir un plan détaillé avant d'agir",
    optionB: "Je préfère improviser au fur et à mesure",
    dimension: "MF"
  },
  {
    id: "MF3",
    optionA: "Je respecte scrupuleusement les procédures",
    optionB: "J'adapte les règles selon le contexte",
    dimension: "MF"
  },
  {
    id: "MF4",
    optionA: "Je préfère avoir un emploi du temps bien défini",
    optionB: "J'aime garder mes options ouvertes",
    dimension: "MF"
  },
  {
    id: "MF5",
    optionA: "J'organise mon travail de manière systématique",
    optionB: "Je gère mes tâches de façon spontanée",
    dimension: "MF"
  },
  {
    id: "MF6",
    optionA: "Je suis les étapes dans un ordre précis",
    optionB: "Je traite les tâches selon les opportunités",
    dimension: "MF"
  },
  {
    id: "MF7",
    optionA: "J'établis des processus clairs et les suis",
    optionB: "Je m'adapte en fonction des besoins",
    dimension: "MF"
  },
  {
    id: "MF8",
    optionA: "Je préfère avoir des objectifs bien définis",
    optionB: "J'ajuste mes objectifs selon les circonstances",
    dimension: "MF"
  },

  // V (Validation)
  {
    id: "V1",
    optionA: "Je vérifie systématiquement mes décisions avant de les mettre en œuvre",
    optionB: "Je fais confiance à mon jugement initial",
    dimension: "V"
  },
  {
    id: "V2",
    optionA: "Je demande souvent l'avis des autres avant d'agir",
    optionB: "Je préfère me fier à mon propre jugement",
    dimension: "V"
  },
  {
    id: "V3",
    optionA: "Je révise plusieurs fois mes choix avant de les finaliser",
    optionB: "Je maintiens généralement ma première décision",
    dimension: "V"
  },
  {
    id: "V4",
    optionA: "J'aime avoir des confirmations externes de mes choix",
    optionB: "Je suis confiant(e) dans mes décisions personnelles",
    dimension: "V"
  },
  {
    id: "V5",
    optionA: "Je teste mes solutions avant de les appliquer définitivement",
    optionB: "J'applique directement les solutions que je trouve",
    dimension: "V"
  },
  {
    id: "V6",
    optionA: "Je cherche des preuves pour valider mes décisions",
    optionB: "Je me fie à mon instinct pour valider mes choix",
    dimension: "V"
  }
];

// Échelle de réponse GCBS
export const gcbsScale = [
  { value: 1, label: "Forte préférence pour A" },
  { value: 2, label: "Légère préférence pour A" },
  { value: 3, label: "Pas de préférence" },
  { value: 4, label: "Légère préférence pour B" },
  { value: 5, label: "Forte préférence pour B" }
];

// Questions TIPI
export const tipiQuestions = [
  {
    id: 1,
    question: "Je me considère comme extraverti(e), enthousiaste.",
    dimension: "E",
    isReversed: false
  },
  {
    id: 2,
    question: "Je me considère comme critique, querelleur(se).",
    dimension: "A",
    isReversed: true
  },
  {
    id: 3,
    question: "Je me considère comme fiable, discipliné(e).",
    dimension: "C",
    isReversed: false
  },
  {
    id: 4,
    question: "Je me considère comme anxieux(se), facilement contrarié(e).",
    dimension: "S",
    isReversed: true
  },
  {
    id: 5,
    question: "Je me considère comme ouvert(e) aux nouvelles expériences, complexe.",
    dimension: "O",
    isReversed: false
  },
  {
    id: 6,
    question: "Je me considère comme réservé(e), calme.",
    dimension: "E",
    isReversed: true
  },
  {
    id: 7,
    question: "Je me considère comme sympathique, chaleureux(se).",
    dimension: "A",
    isReversed: false
  },
  {
    id: 8,
    question: "Je me considère comme désorganisé(e), négligent(e).",
    dimension: "C",
    isReversed: true
  },
  {
    id: 9,
    question: "Je me considère comme calme, émotionnellement stable.",
    dimension: "S",
    isReversed: false
  },
  {
    id: 10,
    question: "Je me considère comme conventionnel(le), peu créatif(ve).",
    dimension: "O",
    isReversed: true
  }
];

// Échelle de réponse TIPI
export const tipiScale = [
  { value: 1, label: "Tout à fait en désaccord" },
  { value: 2, label: "Plutôt en désaccord" },
  { value: 3, label: "Légèrement en désaccord" },
  { value: 4, label: "Ni d'accord ni en désaccord" },
  { value: 5, label: "Légèrement d'accord" },
  { value: 6, label: "Plutôt d'accord" },
  { value: 7, label: "Tout à fait d'accord" }
]; 