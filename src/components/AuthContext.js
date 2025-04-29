// AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Example only

    const logout = () => {
        localStorage.removeItem("userData");
    };

    const login = (email) => {
        const userData = {
            email: email,
            questionsRead: [],
            topicsRead: [],
        }
        localStorage.setItem("userData", JSON.stringify(userData))
    }

    return (
        <AuthContext.Provider value={{ login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
