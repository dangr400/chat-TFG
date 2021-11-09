import axios from "../http-common";
import authHeader from './auth-header';

const API_URL = '/chat/';

class ChatService {
    iniciarChatGrupo(grupo){
        return axios.post(API_URL + 'initiateGrupos', grupo, {headers: authHeader() });
    }
    iniciarChatUsuarios(usuarios){
        return axios.post(API_URL + 'initiateGrupos', usuarios, {headers: authHeader() });
    }
    getConversacion(idSala){
        return axios.get(API_URL + idSala, {headers: authHeader()});
    }
    // ejemplo delete:
    // return axios.delete(API_URL + 'contactos/eliminarContacto' , {headers: authHeader() , data: {usuario} });
    // ejemplo post: (params no tiene que ser parametro en la URL)
    // return axios.post(API_URL + 'enviarPeticion', params, { headers: authHeader() });
  }
  
  export default new ChatService();