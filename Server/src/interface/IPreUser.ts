interface InterfacePreUser{
    name: string;
    email: string;
}

class IPreUser{
    id?: number;
    name: string;
    email: string;

    public constructor({
        name, 
        email
    }: InterfacePreUser){
        this.name = name,
        this.email = email
    }
}

export default IPreUser;