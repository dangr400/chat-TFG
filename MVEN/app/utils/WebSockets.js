class WebSockets {
    usuarios = [];
    connection(client) {
      // evento ejecutado cuando la sala se desonecta
      client.on("disconnect", () => {
        this.usuarios = this.usuarios.filter((user) => user.socketId !== client.id);
      });
      // añadir identidad del usuario mapeado al socket id
      client.on("identity", (userId) => {
        this.usuarios.push({
          socketId: client.id,
          userId: userId,
        });
      });
      // suscribir persona al chat y a otro usuario también
      client.on("subscribe", (sala, otherUserId = "") => {
        this.subscribeOtherUser(sala, otherUserId);
        client.join(sala);
      });
      // silenciar (o abandonar) una sala
      client.on("unsubscribe", (sala) => {
        client.leave(sala);
      });
    }
    // método para agregar un usuario a la sala
    subscribeOtherUser(sala, otherUserId) {
      const userSockets = this.usuarios.filter(
        (user) => user.userId === otherUserId
      );
      userSockets.map((userInfo) => {
        const socketConn = global.io.sockets.connected(userInfo.socketId);
        if (socketConn) {
          socketConn.join(sala);
        }
      });
    }
  }

module.exports = new WebSockets;