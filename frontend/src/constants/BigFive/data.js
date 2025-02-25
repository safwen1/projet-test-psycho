export const BIG_FIVE_QUESTIONS = [
  // Extraversion (E)
  { code: 'E1', question: 'Je suis l\'âme de la fête.', dimension: 'Extraversion', isReversed: false },
  { code: 'E2', question: 'Je ne parle pas beaucoup.', dimension: 'Extraversion', isReversed: true },
  { code: 'E3', question: 'Je me sens à l\'aise en présence d\'autrui.', dimension: 'Extraversion', isReversed: false },
  { code: 'E4', question: 'Je reste en retrait.', dimension: 'Extraversion', isReversed: true },
  { code: 'E5', question: 'J\'engage la conversation.', dimension: 'Extraversion', isReversed: false },
  { code: 'E6', question: 'J\'ai peu de choses à dire.', dimension: 'Extraversion', isReversed: true },
  { code: 'E7', question: 'Je parle avec beaucoup de personnes différentes lors des fêtes.', dimension: 'Extraversion', isReversed: false },
  { code: 'E8', question: 'Je n\'aime pas attirer l\'attention sur moi.', dimension: 'Extraversion', isReversed: true },
  { code: 'E9', question: 'Cela ne me dérange pas d\'être le centre d\'attention.', dimension: 'Extraversion', isReversed: false },
  { code: 'E10', question: 'Je suis réservé(e) face aux inconnus.', dimension: 'Extraversion', isReversed: true },

  // Névrosisme (N)
  { code: 'N1', question: 'Je me sens facilement stressé(e).', dimension: 'Névrosisme', isReversed: false },
  { code: 'N2', question: 'Je suis généralement détendu(e).', dimension: 'Névrosisme', isReversed: true },
  { code: 'N3', question: 'Je m\'inquiète souvent.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N4', question: 'Je me sens rarement déprimé(e).', dimension: 'Névrosisme', isReversed: true },
  { code: 'N5', question: 'Je suis facilement perturbé(e).', dimension: 'Névrosisme', isReversed: false },
  { code: 'N6', question: 'Je m\'emporte facilement.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N7', question: 'Mon humeur change fréquemment.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N8', question: 'J\'ai souvent des sautes d\'humeur.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N9', question: 'Je m\'irrite rapidement.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N10', question: 'Je me sens souvent mélancolique.', dimension: 'Névrosisme', isReversed: false },

  // Agréabilité (A)
  { code: 'A1', question: 'Je me sens peu concerné(e) par les autres.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A2', question: 'Je m\'intéresse aux personnes.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A3', question: 'J\'insulte les autres.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A4', question: 'Je sympathise avec les sentiments des autres.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A5', question: 'Je ne m\'intéresse pas aux problèmes des autres.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A6', question: 'J\'ai le cœur tendre.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A7', question: 'Je ne suis pas vraiment intéressé(e) par autrui.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A8', question: 'Je prends du temps pour aider les autres.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A9', question: 'Je ressens les émotions des autres.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A10', question: 'Je mets les gens à l\'aise.', dimension: 'Agréabilité', isReversed: false },

  // Conscience professionnelle (C)
  { code: 'C1', question: 'Je suis toujours préparé(e).', dimension: 'Conscience', isReversed: false },
  { code: 'C2', question: 'Je laisse traîner mes affaires.', dimension: 'Conscience', isReversed: true },
  { code: 'C3', question: 'Je fais attention aux détails.', dimension: 'Conscience', isReversed: false },
  { code: 'C4', question: 'Je fais du désordre.', dimension: 'Conscience', isReversed: true },
  { code: 'C5', question: 'Je m\'occupe immédiatement des tâches ménagères.', dimension: 'Conscience', isReversed: false },
  { code: 'C6', question: 'J\'oublie souvent de remettre les choses à leur place.', dimension: 'Conscience', isReversed: true },
  { code: 'C7', question: 'J\'aime l\'ordre.', dimension: 'Conscience', isReversed: false },
  { code: 'C8', question: 'J\'évite mes responsabilités.', dimension: 'Conscience', isReversed: true },
  { code: 'C9', question: 'Je respecte un emploi du temps.', dimension: 'Conscience', isReversed: false },
  { code: 'C10', question: 'Je suis méticuleux(se) dans mon travail.', dimension: 'Conscience', isReversed: false },

  // Ouverture à l'expérience (O)
  { code: 'O1', question: 'J\'ai un vocabulaire riche.', dimension: 'Ouverture', isReversed: false },
  { code: 'O2', question: 'J\'ai des difficultés à comprendre les idées abstraites.', dimension: 'Ouverture', isReversed: true },
  { code: 'O3', question: 'J\'ai une imagination vive.', dimension: 'Ouverture', isReversed: false },
  { code: 'O4', question: 'Je ne m\'intéresse pas aux idées abstraites.', dimension: 'Ouverture', isReversed: true },
  { code: 'O5', question: 'J\'ai d\'excellentes idées.', dimension: 'Ouverture', isReversed: false },
  { code: 'O6', question: 'Je n\'ai pas une bonne imagination.', dimension: 'Ouverture', isReversed: true },
  { code: 'O7', question: 'Je comprends rapidement les choses.', dimension: 'Ouverture', isReversed: false },
  { code: 'O8', question: 'J\'utilise des mots difficiles.', dimension: 'Ouverture', isReversed: false },
  { code: 'O9', question: 'Je consacre du temps à la réflexion.', dimension: 'Ouverture', isReversed: false },
  { code: 'O10', question: 'Je regorge d\'idées.', dimension: 'Ouverture', isReversed: false }
]; 