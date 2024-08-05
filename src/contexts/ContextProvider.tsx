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
  currency: { name: "usd" }, // default to "usd"
  setCurrency: () => {},
};

const StateContext = createContext<DefaultState>(defaultState);

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, _setCurrentUser] = useState({});
  const defaultCurrency = { name: 'usd' }; // default to "usd"

  let storedCurrency;
  try {
    const currencyFromStorage = localStorage.getItem("currency");
    storedCurrency = currencyFromStorage ? JSON.parse(currencyFromStorage) : defaultCurrency;
  } catch (error) {
    console.error("Invalid JSON in local storage for 'currency'. Using default value.", error);
    storedCurrency = defaultCurrency;
  }

  const [currency, _setCurrency] = useState<Currencies | undefined>(storedCurrency);
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

  const setCurrency = (value: React.SetStateAction<Currencies | undefined>) => {
    const newCurrency = typeof value === 'function' ? value(currency) : value;
    _setCurrency(newCurrency);
    localStorage.setItem("currency", JSON.stringify(newCurrency));
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
