const BASE_URL = "http://localhost:8080/users";

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Registration failed");
};

export const loginUser = async (email, password) => {
  const url = `${BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) throw new Error("Login failed");
  return await response.json();
};