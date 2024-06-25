// import {
//   ReactNode,
//   createContext,
//   useCallback,
//   useEffect,
//   useReducer,
// } from "react";
// import {
//   IAuthContext,
//   IAuthContextAction,
//   IAuthContextActionTypes,
//   IAuthContextState,
//   ILoginResponseDto,
// } from "../models/Auth";

// import { getSession, setSession } from "./auth.utils";
// import axiosInstance from "../api/axiosInstance";
// import {
//   LOGIN_URL,
//   ME_URL,
//   // PATH_AFTER_LOGIN,
//   PATH_AFTER_LOGOUT,
//   PATH_AFTER_REGISTER,
//   REGISTER_URL,
// } from "../api/globalConfig";
// import { useNavigation } from "@react-navigation/native";
// import { Alert } from "react-native";
// // import toast from "react-hot-toast";
// // import { PATH_DASHBOARD } from "../router/Routes";
// // We need a reducer function for useReducer hook
// const authReducer = (state: IAuthContextState, action: IAuthContextAction) => {
//   if (action.type === IAuthContextActionTypes.LOGIN) {
//     return {
//       ...state,
//       isAuthenticated: true,
//       isAuthLoading: false,
//       user: action.payload,
//     };
//   }
//   if (action.type === IAuthContextActionTypes.LOGOUT) {
//     return {
//       ...state,
//       isAuthenticated: false,
//       isAuthLoading: false,
//       user: undefined,
//     };
//   }
//   return state;
// };

// // We need an initial state object for useReducer hook
// const initialAuthState: IAuthContextState = {
//   isAuthenticated: false,
//   isAuthLoading: true,
//   user: undefined,
// };

// // We create our context here and export it
// export const AuthContext = createContext<IAuthContext | null>(null);

// // We need an interface for our context props
// interface IProps {
//   children: ReactNode;
// }

// // We create a component to manage all auth functionalities and export it and use it
// const AuthContextProvider = ({ children }: IProps) => {
//   const [state, dispatch] = useReducer(authReducer, initialAuthState);
//   const navigate = useNavigation();

//   // Initialize Method
//   const initializeAuthContext = useCallback(async () => {
//     try {
//       const token = getSession();
//       if (token) {
//         // validate accessToken by calling backend
//         const response = await axiosInstance.post<ILoginResponseDto>(ME_URL, {
//           token,
//         });
//         // In response, we receive jwt token and user data
//         const { newToken, userInfo } = response.data;
//         setSession(newToken);
//         dispatch({
//           type: IAuthContextActionTypes.LOGIN,
//           payload: userInfo,
//         });
//       } else {
//         setSession(null);
//         dispatch({
//           type: IAuthContextActionTypes.LOGOUT,
//         });
//       }
//     } catch (error) {
//       setSession(null);
//       dispatch({
//         type: IAuthContextActionTypes.LOGOUT,
//       });
//     }
//   }, []);

//   // In start of Application, We call initializeAuthContext to be sure about authentication status
//   useEffect(() => {
//     console.log("AuthContext Initialization start");
//     initializeAuthContext()
//       .then(() => console.log("initializeAuthContext was successfull"))
//       .catch((error) => console.log(error));
//   }, []);

//   // Register Method
//   const register = useCallback(
//     async (
//       firstName: string,
//       lastName: string,
//       userName: string,
//       email: string,
//       password: string,
//       address: string
//     ) => {
//       const response = await axiosInstance.post(REGISTER_URL, {
//         firstName,
//         lastName,
//         userName,
//         email,
//         password,
//         address,
//       });
//       console.log("Register Result:", response);
//       Alert.alert("Register Was Successfull. Please Login.");

//       navigate.navigate("LoginScreen");
//     },
//     []
//   );

//   // Login Method
//   const login = useCallback(async (userName: string, password: string) => {
//     const response = await axiosInstance.post<ILoginResponseDto>(LOGIN_URL, {
//       userName,
//       password,
//     });
//     Alert.alert("Login Was Successful");
//     // In response, we receive jwt token and user data
//     const { newToken, userInfo } = response.data;
//     setSession(newToken);
//     dispatch({
//       type: IAuthContextActionTypes.LOGIN,
//       payload: userInfo,
//     });

//     // if (userInfo?.roles && userInfo.roles.includes("ADMIN")) {
//     //   navigate.navigate(PATH_DASHBOARD.usersManagement);
//     // } else {
//     //   navigate.navigate(PATH_DASHBOARD.dashboard);
//     // }
//   }, []);

//   // Logout Method
//   const logout = useCallback(() => {
//     setSession(null);
//     dispatch({
//       type: IAuthContextActionTypes.LOGOUT,
//     });
//     navigate.navigate("Home");
//   }, []);

//   // We create an object for values of context provider
//   // This will keep our codes more readable
//   const valuesObject = {
//     isAuthenticated: state.isAuthenticated,
//     isAuthLoading: state.isAuthLoading,
//     user: state.user,
//     register,
//     login,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={valuesObject}>{children}</AuthContext.Provider>
//   );
// };

// export default AuthContextProvider;

import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../api/axiosInstance";
import {
  IAuthContext,
  IAuthContextAction,
  IAuthContextActionTypes,
  IAuthContextState,
  ILoginResponseDto,
} from "../models/Auth";
import { getSession, setSession } from "./auth.utils";
import { LOGIN_URL, ME_URL, REGISTER_URL } from "../api/globalConfig";

// Define the initial state and the reducer function
const initialAuthState: IAuthContextState = {
  isAuthenticated: false,
  isAuthLoading: true,
  user: undefined,
};

const authReducer = (
  state: IAuthContextState,
  action: IAuthContextAction
): IAuthContextState => {
  switch (action.type) {
    case IAuthContextActionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        isAuthLoading: false,
        user: action.payload,
      };
    case IAuthContextActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isAuthLoading: false,
        user: undefined,
      };
    default:
      return state;
  }
};

// Create the AuthContext
export const AuthContext = createContext<IAuthContext | null>(null);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigation();

  const initializeAuthContext = useCallback(async () => {
    try {
      const token = getSession();
      if (token) {
        const response = await axiosInstance.post<ILoginResponseDto>(ME_URL, {
          token,
        });
        const { newToken, userInfo } = response.data;
        setSession(newToken);
        dispatch({ type: IAuthContextActionTypes.LOGIN, payload: userInfo });
      } else {
        setSession(null);
        dispatch({ type: IAuthContextActionTypes.LOGOUT });
      }
    } catch (error) {
      setSession(null);
      dispatch({ type: IAuthContextActionTypes.LOGOUT });
    }
  }, []);

  useEffect(() => {
    initializeAuthContext()
      .then(() => console.log("AuthContext initialized successfully"))
      .catch((error) => console.log("Error initializing AuthContext:", error));
  }, []);

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      userName: string,
      email: string,
      password: string,
      address: string
    ) => {
      try {
        const response = await axiosInstance.post(REGISTER_URL, {
          firstName,
          lastName,
          userName,
          email,
          password,
          address,
        });
        console.log("Register Result:", response);
        Alert.alert("Register Was Successful. Please Login.");
        navigate.navigate("Login");
      } catch (error) {
        console.error("Error registering:", error);
      }
    },
    [navigate]
  );

  const login = useCallback(async (userName: string, password: string) => {
    const response = await axiosInstance.post<ILoginResponseDto>(LOGIN_URL, {
      userName,
      password,
    });
    // In response, we receive jwt token and user data
    const { newToken, userInfo } = response.data;
    setSession(newToken);
    dispatch({
      type: IAuthContextActionTypes.LOGIN,
      payload: userInfo,
    });
    Alert.alert("Login Was Successful");

    if (userInfo?.roles && userInfo.roles.includes("ADMIN")) {
      navigate.navigate("WelcomeAdmin");
    } else {
      navigate.navigate("Welcome");
    }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: IAuthContextActionTypes.LOGOUT });
    navigate.navigate("Home");
  }, [navigate]);

  const authContextValue: IAuthContext = {
    isAuthenticated: state.isAuthenticated,
    isAuthLoading: state.isAuthLoading,
    user: state.user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
