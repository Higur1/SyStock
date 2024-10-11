
import Account from "../../classes/Account";
import HTTPClient from "../../utils/HTTPClient";
import UsersMappers from "./Mappers/UsersMappers";

export default class UsersActions {
  static mapper = new UsersMappers();

  static async getAll() {
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

  static async create(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.post(this.mapper.toServer(user)).then(this.mapper.toInterface);
  }

  static async update(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.put(this.mapper.toServerPut(user))
      .then(response => this.mapper.toInterface(response.user));
  }

  static async updateMail(user = new Account({})) {
    const Client = new HTTPClient("/user/editEmail");

    return Client.patch(this.mapper.toServerPutMail(user));
  }

  static async updatePassword(user = new Account({})) {
    const Client = new HTTPClient("/user/editPassword");

    return Client.patch(this.mapper.toServerPutMail(user));
  }

  static async delete(id) {
    const Client = new HTTPClient("/funcionario");

    return Client.delete({id});
  }

  static async login(obj) {
    const Client = new HTTPClient("/auth");

    return Client.post(obj).then(response => response.token);
  }

  static async recovery(obj) {
    const Client = new HTTPClient("/recovery");

    return Client.post(obj);
  }
  
  static async resetPassword(obj) {
    const Client = new HTTPClient("/reset/password");

    return Client.put(obj)
  }
}