import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import IUser from "../interface/IUser";
import UserService from "../service/UserService";
import IPreUser from "../interface/IPreUser";
import PreUserService from "../service/PreUserService";
import {prisma} from "../config/prisma" 

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
    const preUserData: IPreUser = {
      name: "Higor",
      email: userEmail,
    };

    const preUserCreated = await PreUserService.create(preUserData);

    const userData = new IUser({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });

    const createUser = await UserService.create(userData);

    preUserData.id = preUserCreated.preuser?.id;
    await PreUserService.delete(preUserData);

    expect(createUser).toHaveProperty("user.id");
  });

  it("Dado um usuario X Quando o email já existe e há uma tentativa de criá-lo novamente Então é retornado a seguinte mensagem de erro: 'Email already used'", async () => {
    const preUserData: IPreUser = {
      name: "Higor",
      email: userEmail,
    };

    await PreUserService.create(preUserData);

    const userData = new IUser({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });
    const createUser = await UserService.create(userData);
    //tratar isso
    expect(createUser.error).toBe("Email already used");
  });

  it("Dado um novo usuario X - que não exista - Quando o preUser dele não existe Então é retornado a seguinte mensagem de erro: 'preuser don't exists'", async () => {
    const preUserData: IPreUser = {
      name: "nomeQNãoExisteNoBD",
      email: userEmail,
    };

    const userData = new IUser({
      name: "nomeQNãoExisteNoBD",
      login: "usuarioNovo",
      password: "higor",
      email: "usuarioNovo@gmail.com",
    });
    const createUser = await UserService.create(userData);

    expect(createUser.error).toBe("preuser don't exists");
  });

  it("Dado um usuário x Quando há um tentativa de excluí-lo Então o status de retorno do método deleteFuncionario(user) deve ser 'true'", async () => {
    const userData = new IUser({
      name: "Higor",
      login: userLogin,
      password: "higor",
      email: userEmail,
    });

    userData.id = await (await UserService.findByEmail(userData)).user?.id;

    const userExcluded = await UserService.delete(userData);

    expect(userExcluded.status).toBe(true);
  });

  it("Dado um usuário x Quando alterado seu email Então a alteração deve ser efetivada no BD", async () => {
    const preUserData: IPreUser = {
      name: "name",
      email: "email@gmail.com",
    };

    await PreUserService.create(preUserData);

    //criando objeto usuario
    const userData = new IUser({
      name: "name",
      login: "login",
      password: "higor",
      email: "email@gmail.com",
    });

    const emailAntigoUsuario = userData.email;

    //adicionando no bando de dados e obtendo o id gerado pelo BD
    userData.id = (await UserService.create(userData)).user?.id;

    //alterando objeto
    userData.email = "novoemail@gmail.com";

    const usuario = await (
      await UserService.update(userData)
    ).user;

    const novoEmailUsuario = usuario?.email;

    expect(emailAntigoUsuario).not.toBe(novoEmailUsuario);
  });

  it("Dado um usuário x existente Quando alterado sua senha Então o status do retorno deve ser 'true'", async () => {
    //criando objeto usuario já existente no BD
    const userData = new IUser({
      name: "name",
      login: "login",
      password: "higor",
      email: "novoemail@gmail.com",
    });

    //obtendo id do usuário
    userData.id = (await UserService.findByEmail(userData)).user?.id;

    //alterando a senha
    userData.password = "novaSenha";

    const userUpdated = await UserService.editPassword(userData); 

    expect(userUpdated.status).toBe(true);
  });

  it("Dado um usuário x existente Quando alterado seu nome  Então a alteração deve ser efetivada no BD", async () => {
    //criando objeto usuario já existente no BD
    const userData = new IUser({
      name: "name",
      login: "login",
      password: "higor",
      email: "novoemail@gmail.com",
    });

    //atributo name antes da alteração
    const nomeAntesAlteracao = userData.name

    //obtendo id do usuário
    userData.id = (await UserService.findByEmail(userData)).user?.id;

    //alterando o nome
    userData.name = "novoName";

    const userUpdated = await UserService.update(userData); 

    //atributo name pós alteração
    const nomePosAlteracao = userUpdated.user?.name

    expect(nomePosAlteracao).not.toBe(nomeAntesAlteracao);
  });

  it("Dado um usuário x inexistente no BD Quando há uma tentativa de alterá-lo Então o usuário retorna como undefined", async () => {
    //criando objeto usuario não existente no BD
    const userData = new IUser({
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

    const userUpdated = await UserService.update(userData); 

    expect(userUpdated).toBe(undefined);
  });

  it("Dado um usuário x existente Quando excluido Então o atributo exludedStatus deve se tornar 'true'", async () => {
    //criando objeto usuario já existente no BD
    const userData = new IUser({
      name: "name",
      login: "login",
      password: "higor",
      email: "novoemail@gmail.com",
    });

    //obtendo id do usuário
    userData.id = (await UserService.findByEmail(userData)).user?.id;

    const userExcluded = await UserService.delete(userData); 

    expect(userExcluded.status).toBe(true);
  });

  afterAll(async () => {
    await prisma.pre_User.deleteMany({});
    await prisma.user.deleteMany({});
  });
});
