import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api';
const Aggio_API_URL = 'https://yggio3-beta.sensative.net/api';

var token: string;

class UserService {
  getUsers() {
    return axios.get(API_URL + '/users', { headers: authHeader() });
  }
  getNodes() {
    return axios.get(Aggio_API_URL + '/iotnodes', { headers: { Authorization: 'Bearer ' + token } })
  }
  getAggioToken() {
    axios.get(API_URL + '/devices', { headers: authHeader() }).then(
      response => {
        token = response.data;
      }
    );
  }
  deleteUsers(selectedUsers: ReadonlyArray<string>) {
    return axios.delete(API_URL + '/users', { data: { selectedUsers: selectedUsers },headers: authHeader() });
  }
  updateUsers({selectedUsers, field, value}: {selectedUsers: ReadonlyArray<string>, field:string, value:string}) {
    return axios.put(API_URL + '/users', {  selectedUsers: selectedUsers, field:field, value:value },{headers: authHeader() });
  }
}

export default new UserService();
