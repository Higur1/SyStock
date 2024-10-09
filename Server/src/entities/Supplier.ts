interface ISupplier{
    name: string;
    phone: string;
    email: string;
    excludedStatus: false;
};

class Supplier{
    id?: Number;
    name: string;
    phone: string;
    email: string;
    excludedStatus: false;

    private constructor({
        name, 
        phone, 
        email, 
        excludedStatus
    }: ISupplier){
        this.name = name,
        this.phone = phone;
        this.email = email;
        this.excludedStatus = excludedStatus;
    };
};

export default Supplier;

