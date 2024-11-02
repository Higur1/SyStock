interface InterfaceCategory {
    id: number;
    name: string;
    excludedStatus?: boolean;
  }
  class ICategory {
    id: number;
    name: string;
    excludedStatus ?: boolean;
  
    public constructor({ name, id }: InterfaceCategory) {
        this.id = id;
      this.name = name;
    }
  }
  
  export default ICategory;
  