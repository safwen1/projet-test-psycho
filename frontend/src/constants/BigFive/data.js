export const BIG_FIVE_QUESTIONS = [
  // Extraversion (E)
  { code: 'E1', question: 'Je crée une atmosphère dynamique et engageante au travail.', dimension: 'Extraversion', isReversed: false },
  { code: 'E2', question: 'Je m\'exprime peu en réunion.', dimension: 'Extraversion', isReversed: true },
  { code: 'E3', question: 'Je suis à l\'aise dans les interactions professionnelles.', dimension: 'Extraversion', isReversed: false },
  { code: 'E4', question: 'Je préfère observer plutôt que de prendre la parole en groupe.', dimension: 'Extraversion', isReversed: true },
  { code: 'E5', question: 'Je prends l\'initiative d\'engager des discussions avec mes collègues.', dimension: 'Extraversion', isReversed: false },
  { code: 'E6', question: 'J\'interviens rarement dans les échanges professionnels.', dimension: 'Extraversion', isReversed: true },
  { code: 'E7', question: 'J\'échange facilement avec des collaborateurs de différents services.', dimension: 'Extraversion', isReversed: false },
  { code: 'E8', question: 'Je n\'aime pas me mettre en avant dans un cadre professionnel.', dimension: 'Extraversion', isReversed: true },
  { code: 'E9', question: 'Je suis à l\'aise pour prendre la parole devant un groupe.', dimension: 'Extraversion', isReversed: false },
  { code: 'E10', question: 'Je suis réservé(e) avec les collègues que je connais peu.', dimension: 'Extraversion', isReversed: true },

  // Névrosisme (N)
  { code: 'N1', question: 'Je ressens facilement du stress face aux défis professionnels.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N2', question: 'Je suis généralement calme et serein(e) au travail.', dimension: 'Névrosisme', isReversed: true },
  { code: 'N3', question: 'J\'ai tendance à être préoccupé(e) par le travail.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N4', question: 'J\'ai un bon niveau de motivation et de moral, même face aux défis au travail.', dimension: 'Névrosisme', isReversed: true },
  { code: 'N5', question: 'Je suis facilement déconcentré(e) par les imprévus.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N6', question: 'Je ressens de la frustration face aux difficultés professionnelles.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N7', question: 'Mon état d\'esprit fluctue en fonction des situations de travail.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N8', question: 'J\'éprouve fréquemment des variations d\'humeur dans ma journée de travail.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N9', question: 'Je peux être facilement agacé(e) par certaines situations au travail.', dimension: 'Névrosisme', isReversed: false },
  { code: 'N10', question: 'Il m\'arrive souvent d\'éprouver une baisse d\'énergie ou de moral au travail.', dimension: 'Névrosisme', isReversed: false },

  // Agréabilité (A)
  { code: 'A1', question: 'Je suis peu intéressé(e) par les émotions et les besoins de mes collègues.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A2', question: 'Je m\'intéresse sincèrement aux personnes avec qui je travaille.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A3', question: 'Il m\'arrive de manquer de tact dans mes interactions professionnelles.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A4', question: 'Je prends en compte les émotions et ressentis de mes collègues.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A5', question: 'Je suis peu attentif(ve) aux difficultés que rencontrent mes collègues.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A6', question: 'Je fais preuve de bienveillance dans mes relations professionnelles.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A7', question: 'J\'accorde peu d\'importance aux relations interpersonnelles au travail.', dimension: 'Agréabilité', isReversed: true },
  { code: 'A8', question: 'Je prends le temps d\'aider mes collègues.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A9', question: 'Je perçois facilement l\'ambiance et les émotions au sein de mon équipe.', dimension: 'Agréabilité', isReversed: false },
  { code: 'A10', question: 'Je sais mettre mes collègues à l\'aise dans nos échanges.', dimension: 'Agréabilité', isReversed: false },

  // Conscience professionnelle (C)
  { code: 'C1', question: 'Je prépare mon travail à l\'avance.', dimension: 'Conscience', isReversed: false },
  { code: 'C2', question: 'Je laisse souvent mon espace de travail en désordre.', dimension: 'Conscience', isReversed: true },
  { code: 'C3', question: 'Je suis attentif(ve) aux détails dans mes missions.', dimension: 'Conscience', isReversed: false },
  { code: 'C4', question: 'Mon organisation manque de rigueur.', dimension: 'Conscience', isReversed: true },
  { code: 'C5', question: 'J\'aime accomplir rapidement les tâches qui me sont confiées.', dimension: 'Conscience', isReversed: false },
  { code: 'C6', question: 'J\'ai tendance à ne pas toujours ranger mes outils de travail.', dimension: 'Conscience', isReversed: true },
  { code: 'C7', question: 'J\'apprécie un environnement de travail structuré et organisé.', dimension: 'Conscience', isReversed: false },
  { code: 'C8', question: 'Je prends volontiers des responsabilités dans mon travail.', dimension: 'Conscience', isReversed: false },
  { code: 'C9', question: 'Je respecte un planning et une organisation précise.', dimension: 'Conscience', isReversed: false },
  { code: 'C10', question: 'Je suis rigoureux(se) et appliqué(e) dans mon travail.', dimension: 'Conscience', isReversed: false },

  // Ouverture à l'expérience (O)
  { code: 'O1', question: 'J\'emploie un vocabulaire précis et adapté au contexte professionnel.', dimension: 'Ouverture', isReversed: false },
  { code: 'O2', question: 'J\'ai du mal à comprendre et à manipuler des concepts abstraits.', dimension: 'Ouverture', isReversed: true },
  { code: 'O3', question: 'J\'ai une pensée créative et innovante.', dimension: 'Ouverture', isReversed: false },
  { code: 'O4', question: 'Je préfère m\'appuyer sur des idées concrètes et directement applicables.', dimension: 'Ouverture', isReversed: true },
  { code: 'O5', question: 'Je propose régulièrement des idées innovantes.', dimension: 'Ouverture', isReversed: false },
  { code: 'O6', question: 'Je privilégie les faits et l\'expérience plutôt que l\'imagination.', dimension: 'Ouverture', isReversed: true },
  { code: 'O7', question: 'Je comprends rapidement de nouveaux concepts.', dimension: 'Ouverture', isReversed: false },
  { code: 'O8', question: 'J\'emploie un langage précis et adapté aux exigences techniques de mon travail.', dimension: 'Ouverture', isReversed: false },
  { code: 'O9', question: 'Je prends le temps d\'analyser et de réfléchir avant d\'agir.', dimension: 'Ouverture', isReversed: false },
  { code: 'O10', question: 'Je suis force de proposition dans mon travail.', dimension: 'Ouverture', isReversed: false }
]; 