// Questions du test MWMS (Multidimensional Work Motivation Scale)
export const MWMS_QUESTIONS = [
  {
    id: 'IM1',
    question: 'Parce que le travail que je fais est intéressant intellectuellement.',
    category: 'intrinsicMotivation',
    dimension: 'autonomousMotivation'
  },
  {
    id: 'IM2',
    question: 'Parce que ce que je fais dans mon travail est stimulant.',
    category: 'intrinsicMotivation',
    dimension: 'autonomousMotivation'
  },
  {
    id: 'IM3',
    question: 'Parce que je prends du plaisir à faire mon travail.',
    category: 'intrinsicMotivation',
    dimension: 'autonomousMotivation'
  },
  {
    id: 'ID1',
    question: 'Parce que m\'investir dans ce travail est en accord avec mes valeurs personnelles.',
    category: 'identifiedRegulation',
    dimension: 'autonomousMotivation'
  },
  {
    id: 'ID3',
    question: 'Parce que m\'investir dans une activité qui a du sens pour moi est important.',
    category: 'identifiedRegulation',
    dimension: 'autonomousMotivation'
  },
  {
    id: 'INTRO3',
    question: 'Parce que sinon, j\'aurais l\'impression de ne pas être à la hauteur.',
    category: 'introjectedRegulation',
    dimension: 'introjectedRegulation'
  },
  {
    id: 'INTRO4',
    question: 'Parce que sinon, j\'aurais le sentiment d\'échouer.',
    category: 'introjectedRegulation',
    dimension: 'introjectedRegulation'
  },
  {
    id: 'EXS1',
    question: 'Pour obtenir l\'approbation des autres (ex. manager, collègues, famille, clients…).',
    category: 'externalSocialRegulation',
    dimension: 'externalRegulation'
  },
  {
    id: 'EXS2',
    question: 'Pour éviter d\'être critiqué par les autres (ex. manager, collègues, famille, clients…).',
    category: 'externalSocialRegulation',
    dimension: 'externalRegulation'
  },
  {
    id: 'EXS3',
    question: 'Parce que les autres me respecteront davantage (ex. manager, collègues, famille, clients…).',
    category: 'externalSocialRegulation',
    dimension: 'externalRegulation'
  },
  {
    id: 'EXM1',
    question: 'Parce que je risque de perdre mon emploi si je ne fournis pas assez d\'efforts.',
    category: 'externalMaterialRegulation',
    dimension: 'externalRegulation'
  },
  {
    id: 'EXM2',
    question: 'Parce que les autres me récompenseront financièrement si je fournis assez d\'efforts dans mon travail (ex. employeur, manager…).',
    category: 'externalMaterialRegulation',
    dimension: 'externalRegulation'
  },
  {
    id: 'EXM3',
    question: 'Parce que les autres me garantissent une sécurité d\'emploi si je fournis assez d\'efforts dans mon travail (ex. employeur, manager…).',
    category: 'externalMaterialRegulation',
    dimension: 'externalRegulation'
  }
];

// Échelle de notation
export const MWMS_SCALE = [
  { value: 1, label: 'Pas du tout pour cette raison' },
  { value: 2, label: 'Un peu pour cette raison' },
  { value: 3, label: 'Plutôt pour cette raison' },
  { value: 4, label: 'Moyennement pour cette raison' },
  { value: 5, label: 'En grande partie pour cette raison' },
  { value: 6, label: 'Beaucoup pour cette raison' },
  { value: 7, label: 'Tout à fait pour cette raison' }
];

// Dimensions principales
export const MWMS_DIMENSIONS = [
  {
    id: 'autonomousMotivation',
    label: 'Motivation autonome',
    description: 'Combine la motivation intrinsèque et la régulation identifiée. Reflète l\'engagement par plaisir et alignement avec les valeurs personnelles.',
    color: '#33A474',
    highScore: 'Engagement fort, plaisir au travail, alignement avec les valeurs',
    lowScore: 'Désengagement, ennui, besoin de redonner du sens'
  },
  {
    id: 'introjectedRegulation',
    label: 'Régulation introjectée',
    description: 'Motivation basée sur l\'évitement de sentiments négatifs comme la culpabilité ou la honte.',
    color: '#4298B4',
    highScore: 'Besoin de reconnaissance, risque de stress, perfectionnisme',
    lowScore: 'Indépendance face aux jugements, ou manque d\'investissement'
  },
  {
    id: 'externalRegulation',
    label: 'Régulation externe',
    description: 'Combine les régulations sociales et matérielles. Motivation par des facteurs externes comme la reconnaissance, le salaire ou la sécurité.',
    color: '#9c27b0',
    highScore: 'Motivation par salaire, statut, validation sociale',
    lowScore: 'Recherche d\'autonomie, ou détachement vis-à-vis du travail'
  }
];

// Sous-dimensions
export const MWMS_SUBDIMENSIONS = [
  {
    id: 'intrinsicMotivation',
    label: 'Motivation intrinsèque',
    parentDimension: 'autonomousMotivation',
    description: 'Motivation par le plaisir et l\'intérêt inhérents à l\'activité elle-même.',
    color: '#2E7D32'
  },
  {
    id: 'identifiedRegulation',
    label: 'Régulation identifiée',
    parentDimension: 'autonomousMotivation',
    description: 'Motivation par l\'alignement avec ses valeurs personnelles et le sens donné à l\'activité.',
    color: '#388E3C'
  },
  {
    id: 'introjectedRegulation',
    label: 'Régulation introjectée',
    parentDimension: 'introjectedRegulation',
    description: 'Motivation par l\'évitement de sentiments négatifs comme la culpabilité ou la honte.',
    color: '#4298B4'
  },
  {
    id: 'externalSocialRegulation',
    label: 'Régulation externe sociale',
    parentDimension: 'externalRegulation',
    description: 'Motivation par la recherche d\'approbation sociale et l\'évitement de critiques.',
    color: '#7B1FA2'
  },
  {
    id: 'externalMaterialRegulation',
    label: 'Régulation externe matérielle',
    parentDimension: 'externalRegulation',
    description: 'Motivation par les récompenses matérielles et la sécurité d\'emploi.',
    color: '#9C27B0'
  }
]; 