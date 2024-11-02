interface InterfaceSupplier{
    name: string;
    phone: string;
    email: string;
    excludedStatus?: false;
};

class ISupplier{
    id?: number;
    name: string;
    phone: string;
    email: string;
    excludedStatus?: boolean;

    public constructor({
        name, 
        phone, 
        email, 
    }: InterfaceSupplier){
        this.name = name,
        this.phone = phone;
        this.email = email;
        this.excludedStatus = false;
    };
};

export default ISupplier;

