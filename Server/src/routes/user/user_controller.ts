import bcrypt from "bcryptjs";

export function generatorPasswordCrypt(user_password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user_password, salt);
  return hash;
}

export function generatorHATEOAS(user) {
    if(user == undefined){
        user.name = '',
        user.id = 0
    }
  return [
    {
      href: "http://localhost:3333/users",
      method: "GET",
      rel: "list_users",
    },
    {
      href: `http://localhost:3333/user/name/${user.name}`,
      method: "GET",
      rel: "info_user_by_name",
    },
    {
      href: `http://localhost:3333/user/${user.id}`,
      method: "GET",
      rel: "info_user_by_id",
    },
    {
      href: `http://localhost:3333/users/`,
      method: "GET",
      rel: "info_user_by_type",
    },
    {
      href: `http://localhost:3333/user`,
      method: "PUT",
      rel: "update_user",
    },
    {
      href: `http://localhost:3333/user`,
      method: "DELETE",
      rel: "delete_user",
    },
    {
      href: `http://localhost:3333/auth`,
      method: "POST",
      rel: "auth_user",
    },
    {
      href: `http://localhost:3333/recovery`,
      method: "POST",
      rel: "recovery_password",
    },
    {
      href: `http://localhost:3333/reset/password`,
      method: "PUT",
      rel: "reset_password",
    },
  ];
}
