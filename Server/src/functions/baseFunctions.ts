export function dateBase() {
  return new Date("2024-01-01T00:00:01.000");
}
export function convertStringToNumber(phase: string) {
  try {
    const convertToNumber = Number(phase);
    if (isNaN(convertToNumber)) {
      throw new Error("Expected a number and received a string");
    }
    return convertToNumber;
  } catch (error) {
    throw error;
  }
}
export function getUserToken(request) {
  const user = {
    id: request.loggedUser.id,
    name: request.loggedUser.name,
  };

  return user;
}
export function dateMask(date: Date) {
    date.setHours(date.getHours()-3)
    return date;
}
