import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [mail_consultant, setMailConsultant] = useState(null);
    const [email, setEmail] = useState(null);
    const [test, setTest] = useState(null);
    const [recordID, setRecordID] = useState(null);
    const [name, setName] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [projectTaskId, setProjectTaskId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

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

        initializeValue("user_id", setUserId);
        initializeValue("token", setToken);
        initializeValue("mail_consultant", setMailConsultant);
        initializeValue("email", setEmail);
        initializeValue("test", setTest);
        initializeValue("project_task_id", setProjectTaskId);
        initializeValue("hs_object_id", setRecordID);
        initializeValue("lastname", setName);
        initializeValue("firstname", setFirstname);

        if (hasUpdated) {
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        }
    }, [location.search, navigate]);

    return (
        <UserContext.Provider value={{ userId, recordID, token, mail_consultant, email, test, projectTaskId, name, firstname }}>
            {children}
        </UserContext.Provider>
    );
};
