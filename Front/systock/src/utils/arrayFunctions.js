export class SuperArray extends Array {
  constructor(...args) {
    // Check if the first argument is an array and spread it if so
    if (args.length === 1 && Array.isArray(args[0])) {
      super(...args[0]);
    } else {
      super(...args);
    }
  }
  removeEquals(comparisonStrategy = null) {
    const nextArr = this.filter((obj, i) => this.findIndex(objFind => (comparisonStrategy === null ? obj : obj[comparisonStrategy]) === (comparisonStrategy === null ? objFind : objFind[comparisonStrategy])) === i);

    return nextArr;
  }
}