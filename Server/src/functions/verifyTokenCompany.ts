export function verifyTokenCompany(token){
    const headers = JSON.parse(atob(token.split(".")[1]));
    const parseToken = Object.values(headers)[2];
    return parseToken;
}