import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api';
const Aggio_API_URL='https://yggio3-beta.sensative.net/api';

var token:string;

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
  getNodes() {
    return axios.get(Aggio_API_URL+'/iotnodes', {headers: {Authorization:'Bearer ' + token}})
  }
  getAggioToken(){
    axios.get(API_URL+'/devices', { headers: authHeader() }).then(
      response=>{
        token=response.data;
      }
    );
  }

}

export default new UserService();
