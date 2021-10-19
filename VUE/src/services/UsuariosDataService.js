/**
 * @file Documento para responder a las peticiones HTTP
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
import http from "../http-common";

class UsuariosDataService {
  getAll() {
    return http.get("/usuarios");
  }

  get(id) {
    return http.get(`/usuarios/${id}`);
  }

  create(data) {
    return http.post("/usuarios", data);
  }

  update(id, data) {
    return http.put(`/usuarios/${id}`, data);
  }

  delete(id) {
    return http.delete(`/usuarios/${id}`);
  }

  deleteAll() {
    return http.delete(`/usuarios`);
  }

  findByName(nombre) {
    return http.get(`/usuarios?nombre=${nombre}`);
  }
}

export default new UsuariosDataService();