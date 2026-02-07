import React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/user.service";
// eslint-disable-next-line react-refresh/only-export-components
export const Api = createContext();

function ApiProvider({ children }) {

  const [user, setUser] = useState({
  id: null,
  userName: '',
  email: '',
  accountType: 'null',
  isverified : ''
  
});
  const [loading, setLoading] = useState(true);

  const [islogin ,setIsLogin] = useState(false)

  const checkAuth = useCallback(async () => {
    try {
      const res = await authAPI();

      setUser(res?.data?.user);
  console.log(user)
  if(user){
    setIsLogin(true)
  }
    } catch (error) {
      console.error("Auth failed:", error);


    } finally {
      setLoading(false);
    }
  }, []);

  

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Api.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        islogin,
        setIsLogin,
        checkAuth,
          
      
      }}
    >
      {children}
    </Api.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => useContext(Api);
export { ApiProvider };
