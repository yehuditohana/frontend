const BASE_URL = "http://localhost:8080/api/users";

/*export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) throw new Error("Registration failed");

  return await response.json(); //get UserSummaryDTO that contain user_id, email and user name.
};*/

export const loginUser = async (email, password) => {
  const url = `${BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) throw new Error("Login failed");
  return await response.json();
};

export const logoutUser = async (sessionNumber) => {
  const response = await fetch(`http://localhost:8080/api/users/logout?session=${encodeURIComponent(sessionNumber)}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
};