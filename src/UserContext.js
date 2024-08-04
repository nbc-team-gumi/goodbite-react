// src/UserContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem('userRole');
    return storedRole && storedRole !== 'null' ? storedRole : null;
  });

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  return (
      <UserContext.Provider value={{ role, setRole }}>
        {children}
      </UserContext.Provider>
  );
};
