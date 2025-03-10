import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useError from '../hooks/useError';

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => localStorage.getItem("user_id") || null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [email, setEmail] = useState(() => localStorage.getItem("email") || null);
    const [test, setTest] = useState(() => localStorage.getItem("test") || null);
    const [recordID, setRecordID] = useState(() => localStorage.getItem("hs_object_id") || null);
    const [name, setName] = useState(() => localStorage.getItem("lastname") || null);
    const [firstname, setFirstname] = useState(() => localStorage.getItem("firstname") || null);
    const [projectTaskId, setProjectTaskId] = useState(() => localStorage.getItem("project_task_id") || null);

    const location = useLocation();
    const navigate = useNavigate();
    
    // Utiliser notre hook de gestion d'erreur
    const { showWarningToast } = useError({
        // Désactiver l'affichage automatique des toasts car on utilise ToastContainer global
        showToast: false
    });

    // Fonction pour mettre à jour une valeur dans le state et le localStorage
    const updateValue = (key, value, setter) => {
        setter(value);
        if (value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    };

    // Effet pour synchroniser les paramètres d'URL avec le state et le localStorage
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let hasUpdated = false;

        try {
            // Vérifier et mettre à jour les paramètres depuis l'URL
            const checkAndUpdateFromURL = (paramName, stateKey, setter) => {
                const valueFromURL = searchParams.get(paramName);
                if (valueFromURL) {
                    updateValue(stateKey, valueFromURL, setter);
                    searchParams.delete(paramName);
                    hasUpdated = true;
                }
            };

            // Vérifier tous les paramètres possibles dans l'URL
            checkAndUpdateFromURL("user_id", "user_id", setUserId);
            checkAndUpdateFromURL("token", "token", setToken);
            checkAndUpdateFromURL("email", "email", setEmail);
            checkAndUpdateFromURL("test", "test", setTest);
            checkAndUpdateFromURL("project_task_id", "project_task_id", setProjectTaskId);
            checkAndUpdateFromURL("hs_object_id", "hs_object_id", setRecordID);
            checkAndUpdateFromURL("lastname", "lastname", setName);
            checkAndUpdateFromURL("firstname", "firstname", setFirstname);

            // Si l'URL a été mise à jour, mettre à jour l'historique de navigation
            if (hasUpdated) {
                navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
            }
        } catch (error) {
            console.error("Erreur lors de l'initialisation des données utilisateur:", error);
            showWarningToast("Erreur lors du chargement de vos informations. Certaines fonctionnalités pourraient ne pas être disponibles.");
        }
    }, [location.search, navigate, showWarningToast]);

    // Effet pour écouter les changements dans le localStorage (pour la synchronisation entre onglets)
    useEffect(() => {
        const handleStorageChange = (event) => {
            // Mettre à jour le state si une valeur change dans le localStorage
            switch (event.key) {
                case "user_id":
                    setUserId(event.newValue || null);
                    break;
                case "token":
                    setToken(event.newValue || null);
                    break;
                case "email":
                    setEmail(event.newValue || null);
                    break;
                case "test":
                    setTest(event.newValue || null);
                    break;
                case "project_task_id":
                    setProjectTaskId(event.newValue || null);
                    break;
                case "hs_object_id":
                    setRecordID(event.newValue || null);
                    break;
                case "lastname":
                    setName(event.newValue || null);
                    break;
                case "firstname":
                    setFirstname(event.newValue || null);
                    break;
                default:
                    break;
            }
        };

        // Ajouter l'écouteur d'événement pour le localStorage
        window.addEventListener('storage', handleStorageChange);

        // Nettoyer l'écouteur d'événement lors du démontage du composant
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    // Fonction pour effacer les données de l'utilisateur
    const clearUserData = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("test");
        localStorage.removeItem("project_task_id");
        localStorage.removeItem("hs_object_id");
        localStorage.removeItem("lastname");
        localStorage.removeItem("firstname");
        
        setUserId(null);
        setToken(null);
        setEmail(null);
        setTest(null);
        setRecordID(null);
        setName(null);
        setFirstname(null);
        setProjectTaskId(null);
    };

    // Fonction pour forcer la récupération des données depuis le localStorage
    const refreshFromLocalStorage = () => {
        const userId = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const test = localStorage.getItem("test");
        const recordID = localStorage.getItem("hs_object_id");
        const name = localStorage.getItem("lastname");
        const firstname = localStorage.getItem("firstname");
        const projectTaskId = localStorage.getItem("project_task_id");

        if (userId) setUserId(userId);
        if (token) setToken(token);
        if (email) setEmail(email);
        if (test) setTest(test);
        if (recordID) setRecordID(recordID);
        if (name) setName(name);
        if (firstname) setFirstname(firstname);
        if (projectTaskId) setProjectTaskId(projectTaskId);

        return {
            userId, token, email, test, recordID, name, firstname, projectTaskId
        };
    };

    // Valeurs à exposer dans le contexte
    const contextValue = {
        userId, 
        recordID, 
        token, 
        email, 
        test, 
        projectTaskId, 
        name, 
        firstname,
        // Fonctions pour mettre à jour les valeurs
        setUserId: (value) => updateValue("user_id", value, setUserId),
        setToken: (value) => updateValue("token", value, setToken),
        setEmail: (value) => updateValue("email", value, setEmail),
        setTest: (value) => updateValue("test", value, setTest),
        setRecordID: (value) => updateValue("hs_object_id", value, setRecordID),
        setName: (value) => updateValue("lastname", value, setName),
        setFirstname: (value) => updateValue("firstname", value, setFirstname),
        setProjectTaskId: (value) => updateValue("project_task_id", value, setProjectTaskId),
        clearUserData,
        refreshFromLocalStorage
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
