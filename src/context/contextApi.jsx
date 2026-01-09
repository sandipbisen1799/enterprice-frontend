import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/user.service";
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

  const checkAuth = async () => {
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
  };

  

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Api.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        islogin,
        checkAuth,
        setIsLogin,
      
      }}
    >
      {children}
    </Api.Provider>
  );
}

export const useApi = () => useContext(Api);
export { ApiProvider };
