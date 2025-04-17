import axios from "axios";

/**
 * Registers a new user with the provided information
 * using the JAX-RS API at /users/register
 *
 * @param {string} username - The user's full name
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - The user object returned from backend
 * @throws {Error} - If registration fails
 */
export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post("http://localhost:8080/api/users/register", {
      username,
      email,
      password,
    });

    console.log("Registration successful:", response.data);
    return response.data;
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
};