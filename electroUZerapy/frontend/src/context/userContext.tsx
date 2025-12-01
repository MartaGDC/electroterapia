import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, registerUser, verifyTokenUser } from "../api/user";
import { useIonRouter } from "@ionic/react";

type UserContextType = {
  user: any;
  token: any;
  loading: boolean;
  register: (nip: string, password: string) => Promise<any>;
  login: (nip: string, password: string) => Promise<any>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be used within UserProvider");
  else return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useIonRouter();
  
  // usuario logueado en la app
  const [user, setUser] = useState(null);

  // token del usuario logueado
  const [token, setToken] = useState<string | null>(null);

  // loading es true si y solo si se está verificando el usuario
  const [loading, setLoading] = useState(true);

  // Envia a la API la petición de registro de usuario alumno y actualiza el 
  // userContext para poder ser utilizado dentro de la aplicación
  const register = async (nip: string, password: string) => {
    let res = await registerUser({name: nip, password, role: "student"});
    if (res.status !== 200) return res;

    // Guardamos el usuario en el context y localStorage
    setUser(res.data.user);
    localStorage.setItem('user', res.data.user);

    // Guardamos el token en el context y localStorage
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);

    setLoading(false);

    return res;
  };

  // Envia a la API la petición de inicio de sesión y actualiza el userContext 
  // para poder ser utilizado dentro de la aplicación
  const login = async (nip: string, password: string) => {
    let res = await loginUser({name: nip, password});
    if (res.status !== 200) return res;

    // Guardamos el usuario en el context y localStorage
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    // Guardamos el token en el context y localStorage
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);

    setLoading(false);

    return res;
  };

  // Actualiza el userContext para realizar la acción de cierre de sesión
  const logout = async () => {  
    await logoutUser();
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setLoading(false);

    return;
  };

  useEffect(() => {
    const verifyIsLogued = async () => {
      const userStorage = localStorage.getItem('user');
      if (userStorage) setUser(JSON.parse(userStorage));
  
      const tokenStorage = localStorage.getItem('token');
      if (tokenStorage) {
        setToken(tokenStorage);
  
        const res = await verifyTokenUser({ token: tokenStorage });
        if (res.status == 200) {
          setToken(tokenStorage);
          setUser(res.data.user);

          if (window.location.pathname == "") router.push('/app/home');
        } else {
          console.log(res.data.message)
        }
      }

      setLoading(false);
    }

    verifyIsLogued();
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
}