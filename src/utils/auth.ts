// utils/auth.ts
export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};
