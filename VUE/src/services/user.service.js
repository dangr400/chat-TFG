import axios from "../http-common";
import authHeader from './auth-header';

const API_URL = '/usuarios/';

class UserService {
  getContactos() {
    return axios.get(API_URL + 'contactos' , { headers: authHeader() });
  }

  eliminarContacto(usuario) {
    return axios.delete(API_URL + 'contactos/eliminarContacto' , {headers: authHeader() , data: {usuario} });
  }

  getContactoPorNombre(nombre) {
    return axios.get(API_URL + `contactos/${nombre}` , {headers: authHeader() });
  }

  getPeticionesEnviadas() {
    return axios.get(API_URL + 'verMisPeticiones' , { headers: authHeader() });
  }

  getPeticionesPendientes() {
    return axios.get(API_URL + 'verPeticionesPendientes' , { headers: authHeader() });
  }

  enviarPeticionContacto(usuario) {
    return axios.post(API_URL + 'enviarPeticion', usuario, { headers: authHeader() });
  }

  aceptarPeticion(peticion) {
    return axios.post(API_URL + 'aceptarPeticion', peticion, { headers: authHeader() });
  }

  cancelarPeticion(peticion) {
    return axios.delete(API_URL + 'cancelarPeticion', { headers: authHeader() , data: {peticion} });
  }

  getUsuario() {
    return axios.get(API_URL + '/', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();