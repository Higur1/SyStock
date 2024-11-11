
import Account from "../../classes/Account";
import HTTPClient from "../../utils/HTTPClient";
import UsersMappers from "./Mappers/UsersMappers";

export default class UsersActions {
  static mapper = new UsersMappers();

  static async getAll() {
    const ClientUsers = new HTTPClient("/users");

    return ClientUsers.get()
      .then(dataObj => {
        return dataObj.Users.map(this.mapper.toInterface);
      })
  }

  static async create(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.post(this.mapper.toServer(user)).then(result => this.mapper.toInterface(result.User));
  }

  static async createPreUser(user = new Account({})) {
    const ClientUser = new HTTPClient("/preuser");

    return ClientUser.post(this.mapper.toServerPreUser(user));
  }

  static async update(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.put(this.mapper.toServerPut(user))
      .then(response => this.mapper.toInterface(response.User));
  }

  static async updatePatch(user = new Account({})) {
    const ClientUser = new HTTPClient("/user");

    return ClientUser.patch(this.mapper.toServerPatch(user))
      .then(response => this.mapper.toInterface(response.User));
  }

  static async updateMail(user = new Account({})) {
    const Client = new HTTPClient("/user/editEmail");

    return Client.patch(this.mapper.toServerPutMail(user)).then(() => user);
  }

  static async updatePassword(user = new Account({})) {
    const Client = new HTTPClient("/user/editPassword");

    return Client.patch(this.mapper.toServerPutMail(user)).then(() => user);
  }

  static async delete(id) {
    const Client = new HTTPClient("/user");

    return Client.delete({}, `/${id}`);
  }

  static async login(obj = new Account()) {
    const postObject = this.mapper.toServerLogin(obj);
    const Client = new HTTPClient("/auth");

    return Client.post(postObject).then(response => response.token);
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