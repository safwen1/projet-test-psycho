import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useError from '../hooks/useError';

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [test, setTest] = useState(null);
    const [recordID, setRecordID] = useState(null);
    const [name, setName] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [projectTaskId, setProjectTaskId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    
    // Utiliser notre hook de gestion d'erreur
    const { showWarningToast } = useError({
        // Désactiver l'affichage automatique des toasts car on utilise ToastContainer global
        showToast: false
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        let hasUpdated = false;

        const initializeValue = (key, setter) => {
            const valueFromURL = searchParams.get(key);
            if (valueFromURL) {
                setter(valueFromURL);
                localStorage.setItem(key, valueFromURL);
                searchParams.delete(key);
                hasUpdated = true;
            } else {
                const valueFromStorage = localStorage.getItem(key);
                setter(valueFromStorage);
            }
        };

        try {
            initializeValue("user_id", setUserId);
            initializeValue("token", setToken);
            initializeValue("email", setEmail);
            initializeValue("test", setTest);
            initializeValue("project_task_id", setProjectTaskId);
            initializeValue("hs_object_id", setRecordID);
            initializeValue("lastname", setName);
            initializeValue("firstname", setFirstname);

            if (hasUpdated) {
                navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
            }
        } catch (error) {
            console.error("Erreur lors de l'initialisation des données utilisateur:", error);
            showWarningToast("Erreur lors du chargement de vos informations. Certaines fonctionnalités pourraient ne pas être disponibles.");
        }
    }, [location.search, navigate, showWarningToast]);
    
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

    return (
        <UserContext.Provider value={{ 
            userId, 
            recordID, 
            token, 
            email, 
            test, 
            projectTaskId, 
            name, 
            firstname,
            clearUserData
        }}>
            {children}
        </UserContext.Provider>
    );
};
