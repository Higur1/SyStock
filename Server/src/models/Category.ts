interface ICategory {
  name: string;
  excludedStatus?: boolean;
}
class Category {
  id?: number;
  name: string;
  excludedStatus ?: boolean;

  public constructor({ name }: ICategory) {
    this.name = name;
  }
}

export default Category;
