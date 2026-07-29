"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "./constants";

const CUSTOMER_AUTH_KEY = "sadaar_customer_auth";

function getSavedCustomerAuth() {
  try {
    const raw = localStorage.getItem(CUSTOMER_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCustomerAuth(token, customer) {
  try {
    if (token && customer) localStorage.setItem(CUSTOMER_AUTH_KEY, JSON.stringify({ token, customer }));
    else localStorage.removeItem(CUSTOMER_AUTH_KEY);
  } catch {}
}

const CustomerAuthContext = createContext({
  customerToken: null,
  customerInfo: null,
  loginCustomer: () => {},
  logoutCustomer: () => {},
});

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}

export function CustomerAuthProvider({ children }) {
  const [customerToken, setCustomerToken] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Read localStorage only after mount — this runs client-only, after the
  // server-rendered HTML is already in the DOM, avoiding any server/client
  // markup mismatch (the server has no way to know this before the request).
  useEffect(() => {
    const saved = getSavedCustomerAuth();
    if (saved) {
      setCustomerToken(saved.token);
      setCustomerInfo(saved.customer);
    }
    setHydrated(true);
  }, []);

  const loginCustomer = useCallback((token, customer) => {
    setCustomerToken(token);
    setCustomerInfo(customer);
    saveCustomerAuth(token, customer);
  }, []);

  const logoutCustomer = useCallback(() => {
    setCustomerToken(null);
    setCustomerInfo(null);
    saveCustomerAuth(null, null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customerToken, customerInfo, loginCustomer, logoutCustomer, hydrated }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
