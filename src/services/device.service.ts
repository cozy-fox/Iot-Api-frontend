import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://192.168.127.74:8080/api';

class DeviceService {

  getDevices4Admin() {
    return axios.get(API_URL + '/devices/admin', { headers: authHeader() });
  }


  deleteDevices(selectedDevices: ReadonlyArray<string>) {
    return axios.delete(API_URL + '/Devices', { data: { selectedDevices: selectedDevices }, headers: authHeader() });
  }

  updateDevices({ selectedDevices, field, value }: { selectedDevices: ReadonlyArray<string>, field: string, value: string }) {
    return axios.put(API_URL + '/Devices', { selectedDevices: selectedDevices, field: field, value: value }, { headers: authHeader() });
  }

//Group manage
  createDeviceGroup(name: string) {
    return axios.post(API_URL + '/device_group', { name: name }, { headers: authHeader() })
  }

  getDeviceGroups() {
    return axios.get(API_URL + '/device_group', { headers: authHeader() })
  }

  deleteGroups(selectedDevices: ReadonlyArray<string>) {
    return axios.delete(API_URL + '/device_group', { data: { selectedGroups: selectedDevices }, headers: authHeader() });
  }

  renameGroup({ selectedDevices, newName }: { selectedDevices: ReadonlyArray<string>, newName: string }) {
    return axios.put(API_URL + '/device_group/name',  { selectedGroups: selectedDevices, newName: newName }, {headers: authHeader() });
  }

  updateDeviceGroups({ selected, field, value, newMember }: { selected:string, field: string,value:string, newMember: string }) {
    return axios.put(API_URL + '/device_group',  { selected:selected, field: field,value:value, newMember: newMember }, {headers: authHeader() });
  }

  //utils
  get4select() {
    return axios.get(API_URL + '/device_4select', { headers: authHeader() });
  }
}

export default new DeviceService();
