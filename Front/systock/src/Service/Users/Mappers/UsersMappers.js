import Account from "../../../classes/Account";

export default class UsersMappers {
  toServer(obj = new Account({})) {
    return {
      name: obj.name,
      login: obj.user,
      password: obj.password,
      email: obj.email
    }
  }

  toServerPatch(obj = new Account({})) {
    const nextObj = { id: obj.id };

    if(obj.name !== "") nextObj.name = obj.name;
    if(obj.password !== "") nextObj.password = obj.password;
    if(obj.email !== "") nextObj.email = obj.email;
    return nextObj;
  }

  toServerPreUser(obj = new Account({})) {
    return {
      name: obj.name,
      email: obj.email
    }
  }

  toServerPut(obj = new Account({})) {
    return {
      id: obj.id,
      name: obj.name,
      user_type_id: 1
    }
  }

  toServerPutMail(obj = new Account({})) {
    return {
      id: obj.id,
      novoEmail: obj.email
    }
  }

  toServerPutPassword(obj = new Account({})) {
    return {
      id: obj.id,
      novaPassword: obj.password
    }
  }

  toServerLogin({user, password}) {
    return {
      user_login:user,
      user_password: password
    }
  }

  toInterface({ id, name, login, email, password }) {
    return new Account({ id, name, user: login, email, password });
  }
}