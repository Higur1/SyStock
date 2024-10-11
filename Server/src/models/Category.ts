interface ICategory {
  name: string;
}
class Category {
  id?: number;
  name: string;

  public constructor({ name }: ICategory) {
    this.name = name;
  }
}

export default Category;
