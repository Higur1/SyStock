interface IPreUser{
    name: string;
    email: string;
}

class PreUser{
    id?: number;
    name: string;
    email: string;

    private constructor({
        name, 
        email
    }: IPreUser){
        this.name = name,
        this.email = email
    }
}

export default PreUser;