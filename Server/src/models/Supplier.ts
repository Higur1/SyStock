interface ISupplier{
    name: string;
    phone: string;
    email: string;
    excludedStatus?: false;
};

class Supplier{
    id?: number;
    name: string;
    phone: string;
    email: string;
    excludedStatus?: boolean;

    public constructor({
        name, 
        phone, 
        email, 
    }: ISupplier){
        this.name = name,
        this.phone = phone;
        this.email = email;
        this.excludedStatus = false;
    };
};

export default Supplier;

