export default function meanMatrix(matrix: number[][]): number[]{
    let result:number[] = [0,0,0];
    for (let i = 0; i < matrix.length; i++) {
        const element = matrix[i];
        result = [result[0] + element[0], result[1] + element[1], result[2] + element[2]]
    }

    return [result[0]/matrix.length, result[1]/matrix.length, result[2]/matrix.length]
} 