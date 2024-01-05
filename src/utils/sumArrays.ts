function sumArrays(arr1: number[], arr2: number[]) {
    if (arr1.length !== arr2.length) {
      throw new Error("Arrays must have the same length for element-wise addition");
    }
  
    return arr1.map((value, index) => value + arr2[index]);
}