import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import User from "../models/User";
import user from "../service/UserService";
import PreUser from "../models/PreUser";
import preUser from "../service/PreUserService";
import { error } from "console";

describe("Create user model", () => {
  let userEmail;
  let userLogin;

  beforeAll(() => {
    const genarateUniqueEmail = `Mock UserEmail-${String(Date.now())}`;
    userEmail = genarateUniqueEmail;
    const genarateUniqueLogin = `Mock UserLogin-${String(Date.now())}`;
    userLogin = genarateUniqueLogin;
  });

  it("Dado um usuario X Quando é criado respeitando as regras de negócio Então ele é criado com sucesso", async () => {
    const preUserData: PreUser = {
      name: "Higor",
      email: userEmail,
    };

    const preUserCreated = await preUser.create(preUserData);

    const userData = new User({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });

    const createUser = await user.createEmployee(userData);

    preUserData.id = preUserCreated.preuser?.id;
    await preUser.delete(preUserData);

    expect(createUser).toHaveProperty("user.id");
  });

  it("Dado um usuario X Quando ele já existe e há uma tentativa de criá-lo novamente Então é retornado a seguinte mensagem de erro: 'User alredy exists'", async () => {
    const preUserData: PreUser = {
      name: "Higor",
      email: userEmail,
    };

    await preUser.create(preUserData);

    const userData = new User({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });
    const createUser = await user.createEmployee(userData);

    expect(createUser.message).toBe("User alredy exists");
  });

  it("Dado um novo usuario X - que não exista - Quando o preUser dele não existe Então é retornado a seguinte mensagem de erro: 'preuser don't exists'", async () => {
    const preUserData: PreUser = {
      name: "nomeQNãoExisteNoBD",
      email: userEmail,
    };

    const userData = new User({
      name: "nomeQNãoExisteNoBD",
      login: "usuarioNovo",
      password: "higor",
      email: "usuarioNovo@gmail.com",
    });
    const createUser = await user.createEmployee(userData);

    expect(createUser.message).toBe("preuser don't exists");
  });

  it("Dado um usuário x Quando há um tentativa de excluí-lo Então o status de retorno do método deleteFuncionario(user) deve ser 'true'", async () => {
    const userData = new User({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });

    userData.id = await (await user.findEmail(userData)).user?.id;

    const userExcluded = await user.deleteFuncionario(userData);

    expect(userExcluded.status).toBe(true);
  });

  it("Dado um usuário x Quando é criado com sucesso Então o atributo excludedStatus dele deve ser 'false'", async () => {
    const userData = new User({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });

    const createUser = await user.createEmployee(userData);
    expect(createUser.user?.excludedStatus).toBe(false);
  });

  it("Dado um usuário x Quando alterado seu email Então a alteração deve ser efetivada no BD", async () => {
    const preUserData: PreUser = {
      name: "name",
      email: "email@gmail.com",
    };

    await preUser.create(preUserData);

    //criando objeto usuario
    const userData = new User({
      name: "name",
      login: "login",
      password: "higor",
      email: "email@gmail.com",
    });

    const emailAntigoUsuario = userData.email;

    //adicionando no bando de dados e obtendo o id gerado pelo BD
    userData.id = (await user.createEmployee(userData)).user?.id;

    //alterando objeto
    userData.email = "novoemail@gmail.com";

    const novoEmailUsuario = await (
      await user.updateEmail(userData)
    ).result?.email;

    expect(emailAntigoUsuario).not.toBe(novoEmailUsuario);
  });

  it("Dado um usuário x existente Quando alterado sua senha Então o status do retorno deve ser 'true'", async () => {
    //criando objeto usuario já existente no BD
    const userData = new User({
      name: "name",
      login: "login",
      password: "higor",
      email: "novoemail@gmail.com",
    });

    //obtendo id do usuário
    userData.id = (await user.findEmail(userData)).user?.id;

    //alterando a senha
    userData.password = "novaSenha";

    const userUpdated = await user.updatePassword_editUser(userData.id, userData.password); 

    expect(userUpdated.status).toBe(true);
  });

  it("Dado um usuário x existente Quando alterado seu nome  Então a alteração deve ser efetivada no BD", async () => {
    //criando objeto usuario já existente no BD
    const userData = new User({
      name: "name",
      login: "login",
      password: "higor",
      email: "novoemail@gmail.com",
    });

    //atributo name antes da alteração
    const nomeAntesAlteracao = userData.name

    //obtendo id do usuário
    userData.id = (await user.findEmail(userData)).user?.id;

    //alterando o nome
    userData.name = "novoName";

    const userUpdated = await user.update(userData); 

    //atributo name pós alteração
    const nomePosAlteracao = userUpdated.userUpdated?.name

    expect(nomePosAlteracao).not.toBe(nomeAntesAlteracao);
  });

  it("Dado um usuário x inexistente no BD Quando há uma tentativa de alterá-lo Então o usuário retorna como undefined", async () => {
    //criando objeto usuario não existente no BD
    const userData = new User({
      name: "nomeDeUsuarioInexistente",
      login: "loginDeUsuarioInexistente",
      password: "higor",
      email: "emailInexistente@gmail.com",
    });

    userData.id=40000

    //atributo name antes da alteração
    const nomeAntesAlteracao = userData.name

    //alterando o nome
    userData.name = "novoName";

    const userUpdated = await user.update(userData); 

    expect(userUpdated.userUpdated).toBe(undefined);
  });

  it("Dado um usuário x existente Quando excluido Então o atributo exludedStatus deve se tornar 'true'", async () => {
    //criando objeto usuario já existente no BD
    const userData = new User({
      name: "name",
      login: "login",
      password: "higor",
      email: "novoemail@gmail.com",
    });

    //obtendo id do usuário
    userData.id = (await user.findEmail(userData)).user?.id;

    const userExcluded = await user.deleteFuncionario(userData); 

    expect(userExcluded.status).toBe(true);
  });

  afterAll(async () => {
    await preUser.deleteAll();
    await user.deleteAllEmployees();
  });
});
