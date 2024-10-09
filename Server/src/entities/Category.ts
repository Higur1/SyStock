interface ICategory{
    name: string
}
class Category{
    id?: number
    name: string

    private constructor({
        name
    }: ICategory){
        this.name = name;
    }

}

export default  Category ;