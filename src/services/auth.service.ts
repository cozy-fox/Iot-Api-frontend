import axios from "axios";
import authHeader from './auth-header';
import config from './../config';
const API_URL = config.backend;

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "/auth/signin", {
        'username': username,
        "password": password
      })
      .then(response => {

        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "/auth/signup", {
      "username": username,
      "email": email,
      "password": password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }

  modifyProfile(username: string, email: string, password: string) {
    return axios.put(API_URL + '/profile', { username: username, email: email, password: password }, { headers: authHeader() });
  }

  getProfile() {
    return axios.get(API_URL + '/profile', { headers: authHeader() });
  }

  forgotPassword(email: string) {
    return axios.put(API_URL + '/forgotPassword', { email: email });
  }

  resetPassword(userId: string|undefined, token: string|undefined, password: string) {
    return axios.put(API_URL + '/resetPassword', { userId: userId, token: token, password: password });
  }
}

export default new AuthService();
