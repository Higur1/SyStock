import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";

export function generatorPasswordCrypt(user_password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user_password, salt);
  return hash;
}
export function generatorHATEOAS(user) {
  if (user == undefined) {
    (user.user_name = " "), (user.user_id = 0);
  }
  return [
    {
      href: "http://localhost:3333/users",
      method: "GET",
      rel: "list_users",
    },
    {
      href: `http://localhost:3333/user/name/${user.user_name}`,
      method: "GET",
      rel: "info_user_by_name",
    },
    {
      href: `http://localhost:3333/user/${user.user_id}`,
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
async function verifyTypeOfPlan(company_id) {
  return prisma.company.findFirst({
    where: {
      id: company_id,
    },
    select: {
      subscription_plans: true,
    },
  });
}
function selectedQuantityOfUsers(plan_id) {
  var quantityOfAdminUsers = 0;
  var quantityOfSupervisorUsers = 0;
  var quantityOfCommonUsers = 0;

  switch (plan_id) {
    case 1:
      quantityOfAdminUsers = 1;
      quantityOfSupervisorUsers = 0;
      quantityOfCommonUsers = 0;
      break;
    case 2:
      quantityOfAdminUsers = 1;
      quantityOfSupervisorUsers = 1;
      quantityOfCommonUsers = 1;
      break;
    case 3:
      quantityOfAdminUsers = 1;
      quantityOfSupervisorUsers = 2;
      quantityOfCommonUsers = 2;
      break;
    default:
      quantityOfAdminUsers = 1;
      quantityOfSupervisorUsers = 0;
      quantityOfCommonUsers = 0;
  }

  return {
    Admin: quantityOfAdminUsers,
    Supervisor: quantityOfSupervisorUsers,
    Common: quantityOfCommonUsers,
  };
}
export async function LimitOfUsers(company_id, user_type_id){
  try {
    const plan = await verifyTypeOfPlan(company_id)
    const quantityOfUserForPlan = selectedQuantityOfUsers(plan?.subscription_plans)
  
    const userList = await prisma.user.findMany({
      where:{
        company_id: company_id,
        user_type_id: user_type_id
      },
    })
    //check in which position the user will be created ("Admin", "Supervisor", "Common")
    var parameterOfQuantityUsers = (Object.values(quantityOfUserForPlan)[user_type_id-1])

    if(parameterOfQuantityUsers == userList.length){
      return false;
    }else{
      return true;
    }
  } catch (error) {
    console.log(error)
  }
}
export function verifyTokenCompany(token){
  const header = JSON.parse(atob(token.split('.')[1]));
  const parseToken = Object.values(header)[2]
  return parseToken;
}
export function genericError(error){
  return (error.issues.map(i => i.message));
}