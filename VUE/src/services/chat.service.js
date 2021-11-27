import axios from "../http-common";
import authHeader from './auth-header';

const API_URL = '/chat/';

class ChatService {
    iniciarChatGrupo(grupo){
        return axios.post(API_URL + 'initiateGrupos', grupo, {headers: authHeader() });
    }
    iniciarChatUsuarios(usuarios){
        return axios.post(API_URL + 'initiateUsuarios', usuarios, {headers: authHeader() });
    }
    getConversacion(idSala){
        return axios.get(API_URL + idSala, { headers: authHeader() });
    }
    entrarConversacion(idSala){
        return axios.get(API_URL + idSala + '/entrar', { headers: authHeader() });
    }
    salirConversacion(idSala){
        return axios.get(API_URL + idSala + '/salir', {headers: authHeader() });

    }
    // ejemplo delete:
    // return axios.delete(API_URL + 'contactos/eliminarContacto' , {headers: authHeader() , data: {usuario} });
    // return axios.post(API_URL + 'enviarPeticion', datos, { headers: authHeader() });
  }
  
  export default new ChatService();