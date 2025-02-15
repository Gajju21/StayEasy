import axios from "axios";
import { Component } from "react";

const BASE_URL = "http://localhost:8080/auth/";
const OTP_URL = "http://localhost:8080/api/otp/";
const myheader = { "Content-Type": "application/json" };

class HostelService extends Component {
  // Register a new user
  gethostelIds(hostelId) {
    return axios.get("http://localhost:8080/api/hostels/hostelIds/" + hostelId);
  }
}

export default new HostelService();
