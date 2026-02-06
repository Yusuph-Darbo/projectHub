export async function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  // Converts the token into a boolean
  return !!token;
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
}
