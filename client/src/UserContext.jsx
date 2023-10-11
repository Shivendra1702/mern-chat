import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  useEffect(() => {
    fetch("http://127.0.0.1:4000/api/v1/profile", {
      credentials: "include",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserDetail(data.user);
      });
  }, []);
  return (
    <UserContext.Provider value={userDetail}>{children}</UserContext.Provider>
  );
};
