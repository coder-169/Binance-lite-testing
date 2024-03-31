'use client'
import { useRouter } from "next/navigation";
import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AppContext = createContext();

// eslint-disable-next-line react/prop-types
const AppProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState()
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false)
    const getUserInfo = async () => {
        if (user?.kuCoinSubscribed)
            return
        if (!localStorage.getItem('auth-token'))
            return
        setLoading(true)
        try {
            const response = await fetch(
                `/api/auth/me`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "token": localStorage.getItem("auth-token"),
                    },
                }
            );
            const data = await response.json();
                console.log(data)
            if (response.status === 404) {
                localStorage.removeItem('auth-token')
                router.push('/login')
                setLoading(false)
                return toast.error('session expired in login again')
            }
            if (data.message === 'jwt malformed' || data.message === 'jwt expired') {
                localStorage.removeItem('auth-token')
                router.push('/login')
                setLoading(false)
                return toast.error('session expired in login again')
            }
            if (data.success) {
                setUser(data.user)
                setIsAuthenticated(true)
            } else {
                toast.error(data.message);
                setIsAuthenticated(false)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    };
    const router = useRouter()
    const logOutUser = async () => {
        localStorage.removeItem('auth-token')
        setIsAuthenticated(false)
        setUser([])
        toast.success('Logout Successful')
        router.push('/login')
    };
    useEffect(() => {
        getUserInfo()
        // console.log(loading)
    }, [])
    // CRUD OPERATIONS for course @params id
    return (
        <AppContext.Provider
            value={{
                setIsAuthenticated, getUserInfo,
                isAuthenticated, loading, setLoading,
                user, setUser,
                logOutUser
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export default AppProvider;
