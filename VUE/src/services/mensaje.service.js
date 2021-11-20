import axios from "../http-common";
import authHeader from './auth-header';

const API_URL = '/api/chat/';

class MensajeService {
  introducirMensaje(sala, mensaje) {
    return axios.post(API_URL + '/' +  salaId + '/mensaje', mensaje, { headers: authHeader() });
  }

  BorrarMensaje() {
    return axios.delete(API_URL + 'gruposPertenecientes' , { headers: authHeader() });
  }


}

export default new MensajeService();