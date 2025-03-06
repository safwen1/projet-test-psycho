# Configuration des API d'analyse pour les tests psychométriques

Ce document explique comment configurer et utiliser les API d'analyse (OpenAI et Grok) pour les tests psychométriques.

## Présentation des solutions disponibles

L'application propose deux solutions pour l'analyse des tests psychométriques :

1. **Solution 1 (active) : API OpenAI** - Utilise le modèle GPT-4o pour analyser les résultats des tests
2. **Solution 2 (commentée) : API Grok** - Utilise le modèle Grok-2-latest pour analyser les résultats des tests

Actuellement, la solution OpenAI est active par défaut. Vous pouvez basculer entre les deux solutions en modifiant les contrôleurs.

## Structure des données

L'analyse de l'IA est stockée dans le champ `iaAnalysis` des modèles de données et est renvoyée dans la réponse JSON sous la clé `iaAnalysis`. Ce champ contient l'analyse textuelle générée par l'API sélectionnée (OpenAI ou Grok).

## Configuration des API

### 1. Configuration de l'API OpenAI (solution active)

Pour configurer l'API OpenAI :

1. Créez un compte sur [OpenAI](https://platform.openai.com)
2. Générez une clé API dans votre tableau de bord
3. Assurez-vous d'avoir accès au modèle GPT-4o dans votre compte
4. Configurez cette clé dans votre fichier `.env.local` (voir ci-dessous)

### 2. Configuration de l'API Grok (solution alternative)

Pour configurer l'API Grok :

1. Créez un compte sur [Grok](https://grok.ai) (ou le site officiel de l'API)
2. Générez une clé API dans votre tableau de bord
3. Configurez cette clé dans votre fichier `.env.local` (voir ci-dessous)

### 3. Configurer les clés API dans le fichier .env.local

Ouvrez le fichier `.env.local` dans le répertoire `backend` et ajoutez ou mettez à jour les lignes suivantes :

```
# Configuration OpenAI (solution active)
OPENAI_API_KEY = 'votre_clé_api_openai'

# Configuration Grok (solution alternative)
GROK_API_URL = 'https://api.grok.ai/v1'
GROK_API_KEY = 'votre_clé_api_grok'
```

Remplacez `'votre_clé_api_openai'` et `'votre_clé_api_grok'` par vos clés API respectives.

> **Note** : L'application utilise en priorité les variables définies dans `.env.local`. Si ce fichier n'existe pas, créez-le à partir du modèle `.env`.

## Tester les API

### Tests manuels

Pour tester manuellement les API, vous pouvez utiliser les scripts suivants :

```
node scripts/testOpenAIApi.js
```

Ce script testera l'analyse des tests Big Five et RIASEC avec l'API OpenAI en utilisant le modèle GPT-4o.

```
node scripts/testGrokApi.js
```

Ce script testera l'analyse des tests Big Five avec l'API Grok.

### Tests unitaires

Des tests unitaires sont disponibles pour vérifier le bon fonctionnement des services d'API sans effectuer d'appels réels aux API externes. Pour exécuter ces tests :

```
npm test
```

Pour plus d'informations sur les tests unitaires, consultez le fichier [README_TESTS.md](./README_TESTS.md).

## Basculer entre les solutions

Pour basculer entre les solutions OpenAI et Grok, vous devez modifier les contrôleurs suivants :

1. `backend/controllers/bigFiveController.js`
2. `backend/controllers/riasecController.js`

Dans chaque contrôleur, vous trouverez deux sections commentées :

```javascript
// Solution 1: Appel à l'API OpenAI pour analyse avancée (utilisée actuellement)
const aiAnalysis = await openaiService.analyzeBigFiveResponses({
  // ...
});

/* Solution 2: Appel à l'API Grok pour analyse avancée (commentée)
const grokAnalysis = await grokService.analyzeBigFiveResponses({
  // ...
});
*/
```

Pour basculer vers la solution Grok :
1. Commentez la section OpenAI
2. Décommentez la section Grok

Pour revenir à la solution OpenAI :
1. Décommentez la section OpenAI
2. Commentez la section Grok

## Redémarrer le serveur

Après avoir configuré les clés API ou basculé entre les solutions, redémarrez votre serveur pour que les changements prennent effet :

```
npm run dev
```

## Dépannage

Si vous rencontrez des problèmes après avoir configuré les clés API :

1. Vérifiez que les clés API sont valides et actives
2. Assurez-vous que le format des URL d'API est correct
3. Vérifiez que vous avez accès au modèle GPT-4o dans votre compte OpenAI
4. Vérifiez les logs du serveur pour d'éventuelles erreurs
5. Exécutez les scripts de test pour obtenir plus d'informations sur l'erreur
6. Vérifiez que les variables sont bien définies dans `.env.local` et non seulement dans `.env`

Pour plus d'informations, consultez la documentation officielle des API [OpenAI](https://platform.openai.com/docs) et [Grok](https://grok.ai). 