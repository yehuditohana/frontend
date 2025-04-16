// src/api/loginAPI.js
export const loginUser = async (email, password) => {
  const response = await fetch(
    `http://localhost:5000/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json(); // זה יהיה המשתמש עצמו
};
