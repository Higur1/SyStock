interface IUser{
    name: string;
    login: string;
    password: string;
    email: string;
    excludedStatus: boolean;
}
class User{
    id?: number
    name: string
    login: string
    password: string
    email: string
    excludedStatus: boolean

    private constructor({
        name, 
        login, 
        password, 
        email, 
        excludedStatus
    }: IUser){
        this.name = name;
        this.login = login;
        this.password = password;
        this.email = email;
        this.excludedStatus = excludedStatus;    
    }
}

export default User;