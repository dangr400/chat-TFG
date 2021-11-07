import ChatService from '../services/chat.service';

const usuario = JSON.parse(localStorage.getItem('usuario'));
const grupo = JSON.parse(localStorage.getItem('grupo'));
const initialState = { status: { seleccionado: "nada" }, seleccion: null};
  

export const chat = {
  namespaced: true,
  state: initialState,
  actions: {
    seleccionarGrupo({ commit }, grupo) {
        commit('seleccionadoGrupo', grupo);
        
    }
    
    /*  
    register({ commit }, usuario) {
      return AuthService.register(usuario).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }*/
  },
  mutations: {
    seleccionadoGrupo(state, grupo) {
        state.status.seleccionado = "grupo";
        state.status.seleccion = grupo;
    },
  }
};