import axios from "../http-common";
import authHeader from './auth-header';

const API_URL = '/api/grupos/';

class GruposService {
  getPublicContent() {
    return axios.get(API_URL + 'gruposPublicos');
  }

  getGrupoPorId(grupoId) {
    return axios.get(API_URL + grupoId, { headers: authHeader() });
  }

  getGrupos() {
    return axios.get(API_URL + 'gruposPertenecientes' , { headers: authHeader() });
  }

  permisosGrupo(grupo) {
    return axios.get(API_URL + 'permisosGrupo/' + grupo, {headers: authHeader() });
  }

  nuevoGrupo(grupo) {
    return axios.post(API_URL + 'nuevoGrupo', grupo, { headers: authHeader() });
  }

  añadirModeradores(grupoId, listaMods) {
    return axios.put(API_URL + grupoId + '/addModeradores', listaMods, { headers: authHeader() });
  }

  añadirIntegrantes(grupoId, listaContactos) {
    return axios.put(API_URL + grupoId + '/addIntegrantes', listaContactos, { headers: authHeader() });
  }

  borrarGrupo(grupo) {
    return axios.delete(API_URL + 'borrarGrupo', { headers: authHeader(), data: grupo });
  }
}

export default new GruposService();