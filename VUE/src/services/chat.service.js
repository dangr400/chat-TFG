import axios from "../http-common";
import authHeader from './auth-header';

const API_URL = '/chat/';

class ChatService {
    seleccionarGrupo(grupo){
        localStorage.setItem('grupo', JSON.stringify(grupo));
    }
  }
  
  export default new ChatService();