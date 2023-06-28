import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://192.168.127.74:8080/api';

class UserService {
  getUsers() {
    return axios.get(API_URL + '/users', { headers: authHeader() });
  }

  deleteUsers(selectedUsers: ReadonlyArray<string>) {
    return axios.delete(API_URL + '/users', { data: { selectedUsers: selectedUsers }, headers: authHeader() });
  }

  updateUsers({ selectedUsers, field, value }: { selectedUsers: ReadonlyArray<string>, field: string, value: string }) {
    return axios.put(API_URL + '/users', { selectedUsers: selectedUsers, field: field, value: value }, { headers: authHeader() });
  }

//Group manage
  createUserGroup(name: string) {
    return axios.post(API_URL + '/user_group', { name: name }, { headers: authHeader() })
  }

  getUserGroups() {
    return axios.get(API_URL + '/user_group', { headers: authHeader() })
  }

  deleteUserGroups(selectedUsers: ReadonlyArray<string>) {
    return axios.delete(API_URL + '/user_group', { data: { selectedGroups: selectedUsers }, headers: authHeader() });
  }

  renameGroup({ selectedUsers, newName }: { selectedUsers: ReadonlyArray<string>, newName: string }) {
    return axios.put(API_URL + '/user_group/name',  { selectedGroups: selectedUsers, newName: newName }, {headers: authHeader() });
  }

  updateUserGroups({ selected, field, value, newMember }: { selected:string, field: string,value:string, newMember: string }) {
    return axios.put(API_URL + '/user_group',  { selected:selected, field: field,value:value, newMember: newMember }, {headers: authHeader() });
  }

  //utils
  get4select() {
    return axios.get(API_URL + '/user_4select', { headers: authHeader() });
  }
}

export default new UserService();
