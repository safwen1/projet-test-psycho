const ResultsPersonalityTest = require('../models/ResultsPersonalityTest');
const OpenAI = require('openai');
const { ValidationError, ExternalServiceError, InternalError } = require('../config/error');
const logger = require('../utils/logger');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const axios = require('axios');
const CallModjo = require('../models/CallModjo');
const {launch} = require("puppeteer");
const fs = require("fs");
const path = require('path');

exports.saveHubspotTest = async (req, res, next) => {
    try {
        const { body } = req;

        logger.info('Réception d\'une requête pour sauvegarder un test', { route: 'saveHubspotTest' });
        
        if (!body) {
            logger.warn('Requête reçue sans corps', { route: 'saveHubspotTest' });
            throw new ValidationError('Aucun corps de requête fourni.');
        }

        try {
            const response = await axios.post('https://hooks.zapier.com/hooks/catch/11072818/2saof9s/', body, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            logger.info('Test envoyé avec succès à HubSpot', { route: 'saveHubspotTest' });
            res.status(200).json({ status: 'success' });
        } catch (error) {
            logger.error('Erreur lors de l\'envoi à HubSpot', {
                route: 'saveHubspotTest',
                errorMessage: error.message,
                statusCode: error.response?.status
            });
            
            // Erreur spécifique pour les problèmes avec le service externe
            throw new ExternalServiceError('Erreur lors de l\'envoi à HubSpot', {
                originalError: error.message,
                statusCode: error.response?.status,
                requestData: body
            });
        }
    } catch (error) {
        // Passer l'erreur au middleware de gestion d'erreur
        next(error);
    }
}

async function generatePDF(templatePath, replacements, pdfName) {
    try {
        const browser = await launch();
        const page = await browser.newPage();

        let template = fs.readFileSync(templatePath, 'utf8');
        for (const key in replacements) {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
        }

        await page.setContent(template, { waitUntil: 'networkidle0' });

        const pdfPath = path.join(__dirname, '../pdf', pdfName);
        await page.pdf({ path: pdfPath, format: 'A4' });

        await browser.close();
        return pdfPath;
    } catch (error) {
        logger.error('Erreur lors de la génération du PDF', {
            templatePath,
            pdfName,
            errorMessage: error.message
        });
        throw new InternalError('Impossible de générer le PDF', {
            originalError: error.message
        });
    }
}

exports.savePersonalityTestResult = async (req, res) => {
    try {
        const { score, userAnswers, hs_object_id, name, firstname, email } = req.body;

        if (!score || !userAnswers || !hs_object_id) {
            return res.status(400).json({ error: 'Veuillez fournir toutes les informations.' });
        }

        let modjoCallData;
        try {
            modjoCallData = await CallModjo.findOne({ hs_object_id });
        } catch (error) {
            console.error('Erreur lors de la récupération des données Modjo:', error);
            return res.status(500).json({ error: 'Erreur lors de la récupération des données Modjo.', details: error.message });
        }

        const getLettersDescription = (letter) => {
            switch (letter) {
                case 'A':
                    return `Vous avez une personnalité de type A. Vous semblez prédisposé à avoir les capacité de gestion et de contrôle.
        Vos forces sont votre ténacité, votre confiance et votre pragmatisme.
        Vos faiblesses peuvent être l'écoute, un manque de discipline et d'attention aux détails.`;
                case 'B':
                    return `Vous avez une personnalité de type B. Vous aimez être entouré de gens.
        Vos forces sont votre empathie, votre enthousiasme et votre spontanéité.
        Vos faiblesses peuvent être manque de patience, d'attention et de confiance.`;
                case 'C':
                    return `Vous avez une personnalité de type C. Vous aimez réfléchir avant d'agir.
        Vos forces sont votre rationalité, votre objectivité et votre originalité.
        Vos faiblesses peuvent être manque de spontanéité, de pragmatisme et d'empathie.`;
                case 'D':
                    return `Vous avez une personnalité de type D. Vous aimez vous sentir en sécurité dans la vie.
        Vos forces sont votre organisation, votre compassion et votre patience.
        Vos faiblesses potentielles sont un manque d'ambition, d'adaptabilité et d'affirmation.`;
                default:
                    return 'Description non disponible.';
            }
        };

        const getColorsDescription = (color) => {
            switch (color) {
                case 'Bleu':
                    return `Vous êtes un Relateur. Vous aimez discuter, les relations humaines et passer du temps avec les autres.
        Vous êtes une personne empathique qui a tendance à placer les besoins des autres au-dessus des siens.
        Vos forces sont votre sympathie, votre ouverture et votre conscience de vos propres émotions.
        Vos faiblesses peuvent votre subjectivité, votre souplesse et votre susceptibilité à être manipulé.`;
                case 'Rouge':
                    return `Vous êtes un Aventurier. Vous aimez l'action, l'excitation et le drame.
        Vous acceptez facilement le changement et êtes spontané.
        Vos forces sont votre ténacité, votre audace et votre adaptabilité.
        Vos faiblesses peuvent être votre insouciance et votre manque de concentration.`;
                case 'Vert':
                    return `Vous êtes un Planificateur. Vous aimez rêver, planifier et innover.
        Vous avez tendance à passer beaucoup de temps à penser.
        Vos forces sont votre vision, votre objectivité et votre attention aux détails.
        Vos faiblesses peuvent être une difficulté à vous immerger dans le moment présent.`;
                case 'Marron':
                    return `Vous êtes un Constructeur. Vous aimez diriger, créer et travailler dur.
        Vous êtes une personne traditionnelle avec du respect pour l'autorité.
        Vos forces sont votre diligence, votre franchise et votre pragmatisme.
        Vos faiblesses peuvent être un manque de tact, de patience et de facilité avec les abstractions.`;
                default:
                    return 'Description non disponible.';
            }
        };

        function cleanAndStructureHTML(text, analysisType, firstname, name) {
            const headerTitle = analysisType === "color"
                ? `<h1>Analyse de votre profil - Résultat Couleur<br>${firstname} ${name}</h1>`
                : `<h1>Analyse de votre profil - Résultat Lettre<br>${firstname} ${name}</h1>`;

            const subTitle = analysisType === "color"
                ? `<h2>Découvrez vos atouts et pistes professionnelles</h2>`
                : `<h2>Comprenez votre potentiel et projetez-vous dans l'avenir</h2>`;

            // Remove existing titles and subtitles from text to avoid duplication
            text = text
                .replace(/# Analyse de votre profil - Résultat (Couleur|Lettre)/g, '')
                .replace(/## (Découvrez vos atouts et pistes professionnelles|Comprenez votre potentiel et projetez-vous dans l'avenir)/g, '')
                .replace(/\*\*/g, '') // Remove markdown bold
                .replace(/\d+\.\s/g, '') // Remove numbered lists
                .trim();

            const sections = text.split('\n\n');

            let htmlContent = `${headerTitle}
            ${subTitle}`;

            sections.forEach((section) => {
                htmlContent += `<p>${section.trim()}</p>`;
            });

            return htmlContent;
        }

        const promptPhaseFinal = `
            Objectif : Susciter l'intérêt du candidat en valorisant subtilement ses forces tout en le projetant dans un contexte professionnel motivant.

            Vous êtes une IA générant un rapport psychométrique personnalisé basé sur le test MBTI. Ce rapport est destiné à un candidat dans le cadre d'un processus commercial. Il vise à valoriser ses résultats de couleur et à renforcer son intérêt pour un accompagnement professionnel (bilan de compétences). Respectez strictement les consignes suivantes :  
            
            1. **Page de Titre :**  
               - Titre principal : "Analyse de votre profil - Résultat Couleur".  
               - Sous-titre : "Découvrez vos atouts et pistes professionnelles".  
               - N'incluez aucun autre contenu sur cette page.
            
            2. **Introduction :**  
               - Expliquez brièvement l'objectif du rapport sans jugement ni superlatifs.  
               - Exemple :  
                 *"Ce rapport présente une analyse de votre profil à travers la couleur obtenue lors du test. Il met en lumière vos forces et propose des pistes pour explorer votre potentiel dans un contexte professionnel adapté."*
            
            3. **Analyse de la Couleur :**  
               - Présentez la couleur obtenue et deux adjectifs clés issus de sa description.  
                 Exemple : "Votre couleur, bleu, reflète une personnalité empathique et ouverte."  
               - **Forces principales :** Mettez en avant 2-3 forces clés liées à cette couleur.  
                 Exemple : *"Vous excellez dans [force 1] et votre aptitude à [force 2] est particulièrement précieuse dans des environnements exigeants."*  
               - **Faiblesses potentielles :** Mentionnez 1-2 faiblesses potentielles de manière constructive, tout en les positionnant comme des opportunités d'amélioration grâce à un accompagnement.  
                 Exemple : *"Ces aspects pourraient être des axes à développer pour renforcer votre impact professionnel."*
            
            4. **Contexte Professionnel Propice :**  
               - Décrivez des environnements où ce profil peut exceller, en lien avec les résultats.  
               - Donnez des exemples concrets de rôles professionnels.  
                 Exemple : *"Vous pourriez vous épanouir dans des rôles nécessitant [compétence clé], comme [rôle 1] ou [rôle 2]."*
            
            5. **Synthèse et Appel à l'Action :**  
               - Résumez les points clés et concluez avec un appel à l'action engageant :  
                 Exemple :  
                 *"Votre profil met en avant un potentiel riche et prometteur. Un bilan de compétences approfondi vous permettrait de transformer ces qualités en opportunités concrètes pour atteindre vos objectifs professionnels."*  
               - Ajoutez un disclaimer neutre :  
                 *"Ces résultats peuvent être utilisés pour une analyse approfondie dans un cadre personnalisé."*
            
            **Variables à intégrer :**
            - Couleur : ${JSON.stringify(score.color)}  
            - Description de la couleur : ${getColorsDescription(score.color)}  
            - Transcriptions (informations à utiliser subtilement) : ${modjoCallData}
            
            **Instructions supplémentaires :**
            - Rédigez des paragraphes fluides et engageants.  
            - Excluez toute mention explicite des transcriptions ou d'intelligence artificielle.
        `;

        const responsePhaseFinal = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: promptPhaseFinal }],
        });

        const bilanColor = responsePhaseFinal.choices[0].message.content;

        const promptPhaseIntegration = `
            Objectif : Renforcer l'envie du candidat en liant les résultats de la lettre avec l'analyse de la couleur pour donner une vision globale de son potentiel et des actions possibles.

            Vous êtes une IA générant un rapport psychométrique personnalisé basé sur le test MBTI. Ce rapport est destiné à un candidat dans le cadre d'un processus commercial. Il vise à valoriser ses résultats de lettre en les liant subtilement à son analyse de couleur, tout en renforçant son intérêt pour un bilan de compétences. Respectez strictement les consignes suivantes :  
            
            1. **Page de Titre :**  
               - Titre principal : "Analyse de votre profil - Résultat Lettre".  
               - Sous-titre : "Comprenez votre potentiel et projetez-vous dans l'avenir".  
               - N'incluez aucun autre contenu sur cette page.
            
            2. **Introduction :**  
               - Présentez la lettre comme un complément essentiel à l'analyse de la couleur.  
               - Exemple :  
                 *"Ce rapport explore votre résultat de lettre, un élément clé pour comprendre votre manière d'interagir avec les environnements professionnels. Associée à votre analyse couleur, elle permet d'obtenir une vision globale et équilibrée de votre profil."*
            
            3. **Analyse de la Lettre :**  
               - Présentez la lettre obtenue et deux adjectifs clés issus de sa description.  
                 Exemple : "Votre lettre, A, reflète une personnalité confiante et pragmatique."  
               - **Forces principales :** Détaillez 2-3 forces clés issues de la description.  
                 Exemple : *"Vous êtes reconnu(e) pour votre aptitude à [force 1], et votre capacité à [force 2] est un véritable atout dans des environnements exigeants."*  
               - **Faiblesses potentielles :** Mentionnez 1-2 faiblesses de manière constructive, en proposant l'accompagnement comme une solution.  
            
            4. **Contexte Professionnel Propice :**  
               - Décrivez des environnements où ce profil peut exceller, en lien avec la lettre.  
               - Donnez des exemples concrets de rôles professionnels.  
                 Exemple : *"Ce profil est souvent valorisé dans des rôles comme [rôle 1] ou [rôle 2], qui nécessitent [compétence clé]."*  
            
            5. **Lien avec l'Analyse de la Couleur :**  
               - Expliquez comment la lettre et la couleur se complètent pour offrir une vision globale, en se servant de l'analyse ${bilanColor}  
                 Exemple :  
                 *"Associée à votre couleur (${score.color}), votre lettre (${score.letters}) met en lumière une combinaison unique de qualités qui vous positionne idéalement pour des opportunités professionnelles alignées avec vos ambitions."*
            
            6. **Synthèse et Appel à l'Action :**  
               - Résumez les points clés et concluez avec un appel à l'action engageant :  
                 Exemple :  
                 *"Ce rapport met en avant vos atouts et ouvre des perspectives passionnantes. Un bilan de compétences approfondi vous permettrait d'aligner vos qualités sur des objectifs professionnels concrets et réalisables."*  
               - Ajoutez un disclaimer neutre :  
                 *"Ces résultats constituent une base pour une réflexion approfondie et peuvent être utilisés dans un cadre personnalisé."*
            
            **Variables à intégrer :**
            - Lettre : ${JSON.stringify(score.letters)}  
            - Description de la lettre : ${getLettersDescription(score.letters)}  
            - Description de la couleur : ${getColorsDescription(score.color)}  
            - Transcriptions (informations à utiliser subtilement) : ${modjoCallData}
            
            **Instructions supplémentaires :**
            - Rédigez des paragraphes fluides et engageants.  
            - Excluez toute mention explicite des transcriptions ou d'intelligence artificielle.
        `;

        const responsePhaseIntegration = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: promptPhaseIntegration }],
        });

        const bilanLetter = responsePhaseIntegration.choices[0].message.content;

        const bilanLetterHTML = cleanAndStructureHTML(bilanLetter, 'letter', firstname, name);
        const bilanColorHTML = cleanAndStructureHTML(bilanColor, 'color', firstname, name);

        const templatePath = path.join(__dirname, '../pdf/pdfTemplate.html');

        const pdfLetterPath = await generatePDF(templatePath, {
            color: score.color,
            text_rapport: bilanLetterHTML,
            title: "pdf analyse de la lettre du candidat",
        }, 'rapport_letter.pdf');

        const pdfColorPath = await generatePDF(templatePath, {
            color: score.color,
            text_rapport: bilanColorHTML,
            title: "pdf analyse de la couleur du candidat",
        }, 'rapport_color.pdf');

        const newResult = new ResultsPersonalityTest({
            hs_object_id,
            letter : score.letters,
            email,
            color : score.color
        });

        await newResult.save();

        res.status(201).json({
            message: 'Résultat sauvegardé avec succès.',
            data: newResult,
            bilanLetter,
            bilanColor,
            pdfColor: fs.readFileSync(pdfColorPath, { encoding: 'base64' }),
            pdfLetter: fs.readFileSync(pdfLetterPath, { encoding: 'base64' }),
            modjoCallData
        });
    } catch (err) {
        console.error("Error saving result:", err);
        res.status(500).json({ error: "Error saving result", details: err.message });
    }
};

exports.checkHsObjectId = async (req, res, next) => {
    try {
        const { hs_object_id } = req.params;
        
        logger.info('Vérification du hs_object_id', { hs_object_id });

        if (!hs_object_id) {
            logger.warn('hs_object_id manquant', { route: 'checkHsObjectId' });
            throw new ValidationError('hs_object_id manquant.');
        }

        const recordID = parseInt(hs_object_id, 10);
        if (isNaN(recordID)) {
            logger.warn('hs_object_id invalide', { hs_object_id, route: 'checkHsObjectId' });
            throw new ValidationError('hs_object_id doit être un entier.');
        }

        try {
            const result = await ResultsPersonalityTest.findOne({ hs_object_id: recordID });
            
            const exists = result !== null;
            
            logger.info('Résultat de la vérification', { 
                hs_object_id, 
                exists,
                route: 'checkHsObjectId'
            });

            return res.status(200).json({
                success: true,
                data: {
                    exists,
                    message: exists 
                        ? 'Un test existe déjà pour cet utilisateur.' 
                        : 'Aucun test trouvé pour cet utilisateur.'
                }
            });
        } catch (dbError) {
            logger.error('Erreur lors de la recherche dans la base de données', {
                hs_object_id,
                error: dbError.message,
                route: 'checkHsObjectId'
            });
            
            throw new ExternalServiceError('Erreur lors de la vérification dans la base de données.', {
                originalError: dbError.message
            });
        }
    } catch (error) {
        // Passer l'erreur au middleware de gestion d'erreur
        next(error);
    }
};
