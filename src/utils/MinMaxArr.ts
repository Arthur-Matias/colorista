export function minArray(matrix: number[][]): number[]{
    // Find the minimum value in each sub-array
    let minValues = matrix.map(function(row) {
        return Math.min.apply(null, row);
    }) as number[];
  
    // Find the minimum value among the minimum values
    let minValue = Math.min.apply(null, minValues);
  
    // Find the sub-array (row in the matrix) that contains the minimum value
    let minArray = matrix.find(function(row) {
        return row.includes(minValue);
    }) as number[];
  
    return minArray;
  }
export function maxArray(matrix: number[][]): number[] {
    // Find the minimum value in each sub-array
    let maxValues = matrix.map(function(row) {
        return Math.max.apply(null, row);
    });
  
    // Find the minimum value among the minimum values
    let maxValue = Math.max.apply(null, maxValues);
  
    // Find the sub-array (row in the matrix) that contains the minimum value
    let minArray = matrix.find(function(row) {
        return row.includes(maxValue);
    });
  
    return minArray as number[];
  }