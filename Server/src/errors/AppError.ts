class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}
class CategoryAlreadyExsits extends AppError{

}