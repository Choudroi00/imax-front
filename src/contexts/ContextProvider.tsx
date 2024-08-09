import React, { createContext, useContext, useState } from "react";
import type { CurrentUser, DefaultState } from "../types";
import { Currencies } from "@/types/Dashboard";

const defaultState: DefaultState = {
  currentUser: {},
  setCurrentUser: () => {},
  userToken: null,
  userEmail: null,
  setUserToken: () => {},
  setUserEmail: () => {},
  currency: {name: "usd"},
  setCurrency: () => {},
};

const StateContext = createContext<DefaultState>(defaultState);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, _setCurrentUser] = useState({});

  const cu = {
    name: "dzd",
    value: '200'
  }

  const [currency, setCurrency] = useState<Currencies | undefined>(
    JSON.parse( localStorage.getItem("currency")?? JSON.stringify(cu)) 
  );
  const [userToken, _setUserToken] = useState<string | null>(
    localStorage.getItem("TOKEN") || ""
  );
  const [userEmail, _setUserEmail] = useState<string | null>(
    localStorage.getItem("EMAIL") || ""
  );

  const setUserEmail = (email: string) => {
    if (email) {
      localStorage.setItem("EMAIL", email);
    } else {
      localStorage.removeItem("EMAIL");
    }

    _setUserEmail(email);
  };

  const setUserToken = (token: string) => {
    if (token) {
      localStorage.setItem("TOKEN", token);
    } else {
      localStorage.removeItem("TOKEN");
    }

    _setUserToken(token);
  };

  const setCurrentUser = (user: CurrentUser) => {
    setUserEmail("");
    _setCurrentUser(user);
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
        userEmail,
        setUserEmail,
        setCurrency,
        currency,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
