import axios from 'axios';
import authHeader from './auth-header';

import config from './../config';
const API_URL = config.backend;
class AdminService {
    getYggioAccount() {
        return axios.get(API_URL + '/yggioAccount', { headers: authHeader() });
    }

    createYggioAccount(name: string, password: string, url: string) {
        return axios.post(API_URL + '/yggioAccount', { name: name, password: password, url: url }, { headers: authHeader() });
    }

    deleteYggioAccount(selectedDevices: ReadonlyArray<string>) {
        return axios.delete(API_URL + '/yggioAccount', { data: { selectedGroups: selectedDevices }, headers: authHeader() });
    }

    updateYggioData(id:string, name:string, password:string, url:string,accountSelected:boolean ) {
        return axios.put(API_URL + '/yggioAccount',  { id:id, name:name, password:password, url:url,accountSelected:accountSelected }, {headers: authHeader() });
    }

    getEmailAccount() {
        return axios.get(API_URL + '/emailAccount', { headers: authHeader() });
    }

    createEmailAccount(name: string, password: string, service: string) {
        return axios.post(API_URL + '/emailAccount', { name: name, password: password, service: service }, { headers: authHeader() });
    }

    deleteEmailAccount(selectedDevices: ReadonlyArray<string>) {
        return axios.delete(API_URL + '/emailAccount', { data: { selectedGroups: selectedDevices }, headers: authHeader() });
    }

    updateEmailData(id:string, name:string, password:string, service:string,accountSelected:boolean ) {
        return axios.put(API_URL + '/emailAccount',  { id:id, name:name, password:password, service:service,accountSelected:accountSelected }, {headers: authHeader() });
    }
}

export default new AdminService();
