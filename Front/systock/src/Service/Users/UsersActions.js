
import Account from "../../classes/Account";
import HTTPClient from "../../utils/HTTPClient";
import UsersMappers from "./Mappers/UsersMappers";

export default class UsersActions {
  mapper = new UsersMappers();

  async getAll() {
    const ClientUsers = new HTTPClient("/users");

    return ClientUsers.get()
      .then(dataObj => {
        return dataObj.users.map(this.mapper.toInterface);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        throw error;  // Propagate the error so it can be handled by the caller
      });
  }

  async post(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.post(this.mapper.toServer(user)).then(this.mapper.toInterface);
  }

  async put(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.put(this.mapper.toServerPut(user))
      .then(response => this.mapper.toInterface(response.user));
  }

  async putMail(user = new Account({})) {
    const Client = new HTTPClient("/user/editEmail");

    return Client.patch(this.mapper.toServerPutMail(user));
  }

  async putPassword(user = new Account({})) {
    const Client = new HTTPClient("/user/editPassword");

    return Client.patch(this.mapper.toServerPutMail(user));
  }

  async delete(id) {
    const Client = new HTTPClient("/funcionario");

    return Client.delete({id});
  }

  async login(obj) {
    const Client = new HTTPClient("/auth");

    return Client.post(obj);
  }

  async recovery(obj) {
    const Client = new HTTPClient("/recovery");

    return Client.post(obj);
  }
}