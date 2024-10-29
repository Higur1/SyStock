interface IPreUser{
    name: string;
    email: string;
}

class PreUser{
    id?: number;
    name: string;
    email: string;

    public constructor({
        name, 
        email
    }: IPreUser){
        this.name = name,
        this.email = email
    }
}

export default PreUser;