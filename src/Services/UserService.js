import axios from "axios";
import { Component } from "react";

const BASE_URL = "http://localhost:8080/auth/";
const OTP_URL = "http://localhost:8080/api/otp/";
const myheader = { "Content-Type": "application/json" };

class UserService extends Component {
  // Register a new user
  getuser(id) {
    return axios.get(BASE_URL + "getuser/" + id);
  }
  postuser(user) {
    return axios
      .post(BASE_URL + "signup", user, {
        headers: myheader,
        withCredentials: true, // Keeping credentials for authentication
      })
      .then((response) => {
        sessionStorage.setItem("user_id", response.data.user_id);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("token", response.data.token);
        console.log(response.data.user_id + " is user id");
        console.log("token = " + response.data.token);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Login user
  loginuser(user) {
    return axios.post(BASE_URL + "login", user, { headers: myheader });
  }

  // Delete user by ID
  deleteuser(id) {
    return axios.delete(BASE_URL + "user/" + id);
  }

  // Update user details
  updateeuser(user) {
    return axios.put(
      BASE_URL + "update/" + sessionStorage.getItem("user_id"),
      user,
      {
        headers: myheader,
      }
    );
  }

  // Send OTP
  async sendOtp(email) {
    try {
      const response = await axios.post(OTP_URL + "send", null, {
        headers: myheader,
        params: { email },
        withCredentials: true,
      });
      if (response.status !== 200) {
        throw new Error("Failed to send OTP"); // Explicitly throw an error
      }
      return response.data; // Return response if successful
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error; // Re-throw the error so the caller can handle it
    }
  }

  // Verify OTP
  async verifyOtp(email, otp) {
    try {
      const response = await axios.post(
        OTP_URL + "verify",
        {},
        {
          headers: myheader,
          params: { email, otp },
          withCredentials: true,
        }
      );

      console.log("Response Data:", response.data); // Check full response
      alert(response.data);

      // Ensure proper checking of the response
      if (
        typeof response.data === "string" &&
        response.data.includes("successfully")
      ) {
        return true;
      }

      alert("Invalid OTP"); // This only runs if the response is unexpected
      return false;
    } catch (error) {
      alert("Invalid OTP");
      console.error(error);
      return false;
    }
  }
}

export default new UserService();
