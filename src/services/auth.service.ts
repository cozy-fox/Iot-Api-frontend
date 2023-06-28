import axios from "axios";
import authHeader from './auth-header';

const API_URL = 'http://192.168.127.74:8080/api';

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "/auth/signin", {
        'username':username,
        "password":password
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
      "username":username,
      "email":email,
      "password":password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }

  modifyProfile(username: string, email: string, password: string) {
    return axios.put(API_URL + '/profile',  {username: username, email: email, password: password},{headers: authHeader() });
  }

  getProfile() {
    return axios.get(API_URL + '/profile',  {headers: authHeader() });
  }
}

export default new AuthService();
