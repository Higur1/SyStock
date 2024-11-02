interface InterfaceUser{
    name: string;
    login: string;
    password: string;
    email: string;
    excludedStatus?: boolean;
}
class IUser{
    id?: number
    name: string
    login: string
    password: string
    email: string
    excludedStatus?: boolean

    public constructor({
        name, 
        login, 
        password, 
        email, 
    }: InterfaceUser){
        this.name = name;
        this.login = login;
        this.password = password;
        this.email = email;
        this.excludedStatus = false;    
    }
}

export default IUser;