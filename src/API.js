import axios from "axios";

const BACKURL = "http://localhost:5000";

export const handleLogin = async (username, password, navigate) => {
  console.log("Logging in with username:", username, "and password:", password);
  try {
    const response = await axios.post(
      BACKURL + "/user/login",
      { username, password },
      { withCredentials: true }
    );
    console.log("Login successful:", response.data);
    sessionStorage.setItem("loggedIn", "true");
    navigate("/");
    return response.status;
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.status : error);
  }
};

export const handleRegister = async (username, password, navigate) => {
  try {
    const response = await axios.post(
      BACKURL + "/user/register",
      { username, password },
      { withCredentials: true }
    );
    console.log("Registration successful:", response.data);
    sessionStorage.setItem("loggedIn", "true");
    navigate("/");
    return response.status;
  } catch (error) {
    console.error("Registration failed:", error.response ? error.response.status : error);
  }
};

export const handleLogout = async () => {
  console.log("Logging out...");
  try {
    const response = await axios.post(BACKURL + "/user/logout", {}, { withCredentials: true });
    console.log("Logout successful.", response.data);
    sessionStorage.setItem("loggedIn", "false");
    return response.status;
  } catch (error) {
    console.error("Logout failed:", error.response ? error.response.status : error);
  }
};


export const handleRefresh = async () => {
  console.log("Refreshing access token...");
  try {
    const response = await axios.get(BACKURL + "/user/refresh", { withCredentials: true });
    console.log("Refresh successful.", response.data);
    sessionStorage.setItem("loggedIn", "true");
    return response.status;
  } catch (error) {
    console.error("Refresh failed:", error.response ? error.response.status : error);
    sessionStorage.setItem("loggedIn", "false");
  }
};
