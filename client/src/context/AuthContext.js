import { createContext, useReducer, useEffect } from "react"
import AuthReducer from "./AuthReducers"

const INITIAL_SATTE = {

    user: JSON.parse(localStorage.getItem("user")),
    isFetching: false,
    varification:false,
    error: false
}

export const AuthContext = createContext(INITIAL_SATTE)

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, INITIAL_SATTE)

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))

    }, [state.user])

    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            varification:state.varification,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}