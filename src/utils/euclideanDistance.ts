export default function euclideanDistance(vector1: number[], vector2: number[]) {
    if (vector1.length !== vector2.length) {
      throw new Error("Vectors must have the same dimensionality");
    }
  
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      sum += Math.pow(vector2[i] - vector1[i], 2);
    }
  
    return Math.sqrt(sum);
  }