import { createContext, useState, useContext } from "react";
import { mockUsers, currentUser as initialCurrentUser } from "../mockData";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

  const switchUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        switchUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
