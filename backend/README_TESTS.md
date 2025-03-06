# Tests Unitaires pour les Services API

## Présentation des tests

Ce projet utilise Jest pour implémenter des tests unitaires pour les services d'API (OpenAI et Grok) qui sont utilisés pour l'analyse des tests psychométriques. Les tests sont situés dans le répertoire `services/__tests__/` et couvrent les fonctionnalités principales des services.

Les tests unitaires permettent de vérifier le bon fonctionnement des services sans avoir à effectuer de véritables appels API, ce qui rend les tests plus rapides, plus fiables et indépendants de la disponibilité des API externes.

Les scénarios testés incluent :
- Réponses API réussies
- Gestion des erreurs API
- Comportement lorsque la clé API n'est pas configurée
- Réponses API avec structure invalide
- Tentatives multiples avec différentes URLs (pour le service Grok)

## Prérequis

Avant d'exécuter les tests, assurez-vous d'avoir installé toutes les dépendances du projet :

```bash
npm install
```

## Exécution des tests

### Exécuter tous les tests

Pour exécuter tous les tests :

```bash
npm test
```

### Exécuter des tests spécifiques

Pour exécuter uniquement les tests d'un service spécifique :

```bash
# Pour tester uniquement le service OpenAI
npm test -- openaiService

# Pour tester uniquement le service Grok
npm test -- grokService
```

Pour exécuter un test spécifique par son nom :

```bash
# Pour exécuter uniquement les tests qui contiennent "devrait retourner l'analyse"
npm test -- -t "devrait retourner l'analyse"

# Pour combiner un nom de test et un fichier spécifique
npm test -- -t "devrait retourner l'analyse" openaiService
```

### Autres options d'exécution

Pour exécuter les tests en mode watch (les tests se relancent automatiquement à chaque modification de code) :

```bash
npm run test:watch
```

Pour générer un rapport de couverture de code :

```bash
npm run test:coverage
```

Le rapport de couverture sera généré dans le répertoire `coverage/`.

## Structure des tests

### Tests du service OpenAI (`openaiService.test.js`)

Ces tests vérifient le bon fonctionnement du service OpenAI, notamment :
- La fonction `analyzeBigFiveResponses` pour l'analyse des résultats du test Big Five
- La fonction `analyzeRiasecResponses` pour l'analyse des résultats du test RIASEC

### Tests du service Grok (`grokService.test.js`)

Ces tests vérifient le bon fonctionnement du service Grok, notamment :
- La fonction `analyzeBigFiveResponses` pour l'analyse des résultats du test Big Five
- La fonction `analyzeRiasecResponses` pour l'analyse des résultats du test RIASEC
- La logique de tentatives multiples avec différentes URLs en cas d'échec

## Mocking

Les tests utilisent Jest pour mocker l'API axios afin d'éviter les appels API réels pendant les tests. Voici comment cela fonctionne :

1. Nous utilisons `jest.mock('axios')` pour remplacer le module axios par un mock.
2. Dans chaque test, nous remplaçons l'instance axios du service par notre propre mock :
   ```javascript
   // Configurer le mock pour l'instance axios du service
   service.axiosInstance = {
     post: jest.fn()
   };
   ```
3. Nous configurons ensuite le comportement du mock pour simuler différentes réponses API :
   ```javascript
   // Simuler une réponse réussie
   service.axiosInstance.post.mockResolvedValue(mockResponse);
   
   // Simuler une erreur
   service.axiosInstance.post.mockRejectedValue(mockError);
   ```

## Couverture de code

L'objectif est d'atteindre une couverture de code d'au moins 70% pour les services. Pour vérifier la couverture actuelle, exécutez :

```bash
npm run test:coverage
```

Le rapport de couverture sera généré dans le répertoire `coverage/`.

## Ajout de nouveaux tests

Pour ajouter de nouveaux tests :

1. Créez un nouveau fichier de test dans le répertoire `services/__tests__/` avec le suffixe `.test.js`.
2. Suivez la structure des tests existants pour maintenir la cohérence.
3. Utilisez les fonctions de mock de Jest pour simuler les comportements des dépendances.
4. Exécutez les tests pour vérifier qu'ils passent.

## Dépannage

Si vous rencontrez des problèmes lors de l'exécution des tests :

- Vérifiez que toutes les dépendances sont installées (`npm install`).
- Assurez-vous que Jest est correctement configuré dans `package.json`.
- Vérifiez que les mocks sont correctement configurés pour chaque test.
- Si un test échoue, examinez les messages d'erreur pour comprendre la cause du problème.
- Utilisez `console.log` dans les tests pour déboguer les valeurs problématiques. 