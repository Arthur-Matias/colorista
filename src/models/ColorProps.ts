import euclideanDistance from "../utils/euclideanDistance";
import map from "../utils/map";
import { SimplexNoise } from "../utils/simplex-noise";
import Color from "./Color";

export default abstract class ColorProps {
    static  simplex: SimplexNoise = new SimplexNoise(0.1);

    static checkIfValidHEX(color: string): string {
        let colorString = color.replace(/[^a-fA-F0-9]/g, '');
        let colorArr = colorString.split("")
        let newColorArr: string[] = [];
        if (colorArr.length === 3) {
            newColorArr = [colorArr[0], colorArr[0], colorArr[1], colorArr[1], colorArr[2], colorArr[2]];
        } else if (colorArr.length === 6) {
            newColorArr = colorArr;
        } else if (colorArr.length === 2) {
            newColorArr = Array(6).fill(colorArr[0]);
        } else if (colorArr.length === 4) {
            newColorArr = [colorArr[0], colorArr[0], colorArr[1], colorArr[1], colorArr[2], colorArr[2], colorArr[3], colorArr[3]];
        } else {
            throw new Error(`The color: ${color} is not a valid hexadecimal color`);
        }
        return newColorArr.join("");
    }
    
    static hexToRGB(color: string): number[] {
        let hex = color.split("");
        let R = [hex[0], hex[1]].join("");
        let G = [hex[2], hex[3]].join("");
        let B = [hex[4], hex[5]].join("");
        return [parseInt(R, 16), parseInt(G, 16), parseInt(B, 16)]
    }
    static rgbToHSL([R, G, B]: number[]): number[] {
        R /= 255, G /= 255, B /= 255;
        let max = Math.max(R, G, B), min = Math.min(R, G, B);
        let h: number = 0, s: number = 0, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case R: h = (G - B) / d + (G < B ? 6 : 0); break;
                case G: h = (B - R) / d + 2; break;
                case B: h = (R - G) / d + 4; break;
            }
            h /= 6;
        }

        return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
    }
    static hslToRGB([H, S, L]: number[]): number[] {
        S /= 100;
        L /= 100;
    
        const C = (1 - Math.abs(2 * L - 1)) * S;
        const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
        const m = L - C / 2;
    
        let R = 0, G = 0, B = 0;
    
        if (0 <= H && H < 60) {
            R = C; G = X; B = 0;
        } else if (60 <= H && H < 120) {
            R = X; G = C; B = 0;
        } else if (120 <= H && H < 180) {
            R = 0; G = C; B = X;
        } else if (180 <= H && H < 240) {
            R = 0; G = X; B = C;
        } else if (240 <= H && H < 300) {
            R = X; G = 0; B = C;
        } else if (300 <= H && H < 360) {
            R = C; G = 0; B = X;
        }
    
        R = Math.round((R + m) * 255);
        G = Math.round((G + m) * 255);
        B = Math.round((B + m) * 255);
    
        return [R, G, B];
    }
    static hslToHCL([H, S, L]: number[]): number[] {
        const Lightness = (L + 100) / 2;
        const maxChroma = L < 50 ? L : 100 - L;
        const Chroma = (maxChroma / 100) * S;
        // const C = s * (1 - Math.abs(2 * L - 1)) / 100;
        const Hue = H;

        const wrappedC = (Chroma + 100) % 100;
        const wrappedL = (Lightness + 100) % 100;

        return [Math.floor(Hue), Math.floor(wrappedC), Math.floor(wrappedL)];
    }
    static hclToHSL([H, C, L]: number[]): number[] {
        const h = H;
        const s = ((C / (1 - Math.abs(2 * L - 1))) * 100 + 100) % 100;
        const l = ((L * 2) - 100 + 100) % 100;

        return [Math.floor(h), Math.floor(s), Math.floor(l)];
    }
    static hclToHEX([H, C, L]: number[]): string {
        return ColorProps.hslToHEX(ColorProps.hclToHSL([H, C, L]))
    }
    static rgbToHEX([R, G, B]: number[]): string {
        const red = R.toString(16).length >= 2 ? R.toString(16) : "0" + R.toString(16)
        const green = G.toString(16).length >= 2 ? G.toString(16) : "0" + G.toString(16)
        const blue = B.toString(16).length >= 2 ? B.toString(16) : "0" + B.toString(16)

        return red + green + blue;
    }
    static hslToHEX([H, S, L]: number[]): string {
        return ColorProps.rgbToHEX(ColorProps.hslToRGB([H, S, L]))
    }
    static hexToHSL(hex: string): number[] {
        return ColorProps.rgbToHSL(ColorProps.hexToRGB(ColorProps.checkIfValidHEX(hex)))
    }
    static getRandomColor(opt?: {from?: Color, to?: Color, palette?: Color[]}, maxLevel: number = 50, level: number = 0): Color {
        
        let startColor: number[] = [0, 0, 0];
        let endColor: number[] = [360, 100, 100];
        if(opt){
            if (opt?.from) {
                startColor = opt.from.hcl;
            }
            if (opt?.to) {
                endColor = opt.to.hcl;
            }
        }
    
        let randSeedHue: number = Math.random();
        let randSeedChroma: number = Math.random();
        let randSeedLightness: number = Math.random();
    
        let newHue = map(randSeedHue, 0, 1, startColor[0], endColor[0]);
        let newChroma = map(randSeedChroma, 0, 1, startColor[1], endColor[1]);
        let newLightness = map(randSeedLightness, 0, 1, startColor[2], endColor[2]);
        
        let newColor: Color;        
        newColor = new Color(this.hclToHEX([Math.floor(newHue), Math.floor(newChroma), Math.floor(newLightness)]))
        
        if (opt?.palette) {
            if(!this.colorMatchPalette(newColor, opt.palette)){
                if(level <= maxLevel){
                    return this.getRandomColor(opt, maxLevel, ++level)
                }else{
                    alert("Could not find another color that match with the selected colors")
                    throw new Error("Could not find a color that match with the selected colors")
                }
            }
            
        }
        
        return newColor;
    }
    
    
    static colorMatchPalette(color: Color, palette: Color[]): boolean{
        let threshold = 100;
        if ((palette.includes(color))) {
            // console.log("Color already exists in the palette");
            return false
        }
        for (let c of palette) {   
            if(c.isLocked){
                if (!this.colorsMatch(color, c, threshold)) {
                    // console.log("Color does not match with the palette");
                    return false
                }
            }
        }
        return true;
    }
    static colorsMatch(color1: Color, color2: Color, threshold: number): boolean {  
        
        let hcl1 = color1.hcl;
        let hcl2 = color2.hcl;
        let distance = euclideanDistance(hcl1, hcl2);
        return distance < threshold;
    }
    
    static rotateHue([hue, saturation, lightness]: number[], angle: number = 0) {
        const newHue = (hue + angle) % 360;
        const normalizedHue = newHue < 0 ? newHue + 360 : newHue;
    
        return [normalizedHue, saturation, lightness];
    }
    static changeSaturation([H, S, L]: number[], by?: number): number[] {
        let newSaturation = S;
        if (by) {
            newSaturation += by;
        } else {
            newSaturation += newSaturation > 50 ? -(Math.random() * S) : (Math.random() * S);
        }

        while (newSaturation > 100) {
            newSaturation -= 100;
        }
        while (newSaturation < 0) {
            newSaturation += 100;
        }

        return [H, newSaturation, L]
    }
    static changeLightness([H, S, L]: number[], by?: number): number[] {
        let newLightness = L;

        if (by) {
            newLightness += by;
        }else{
            let diff = 100 - L;
    
            if(diff>50){
                newLightness += 50
            }else{
                newLightness -= 50
            }
    
        }
        while (newLightness > 100) {
            newLightness -= 100;
        }
        while (newLightness < 0) {
            newLightness += 100;
        }

        return [H, S, newLightness]
    }
    static getComplementary([H, S, L]: number[]): number[] {
        return this.rotateHue([H, S, L], 180)
    }
    static getGradientPalette(color: Color){
        const totalColors = 10;
        const gradientPalette: number[] = [];
    
        const lightness = color.hsl[2];
        
        const beforeColors: number[] = []
        const afterColors: number[] = []
    
        for (let i = Math.ceil(lightness / totalColors) * totalColors; i <= 100; i += totalColors) {
            afterColors.push(i);
        }
        
        for (let i = Math.floor(lightness / totalColors) * totalColors; i >= 0; i -= totalColors) {
            beforeColors.unshift(i)
        }
        gradientPalette.push(0);
        beforeColors.map(e=>{
            gradientPalette.push(e)
        })
        gradientPalette.push(color.hsl[2]);
        afterColors.map(e=>{
            gradientPalette.push(e)
        })
        gradientPalette.push(100);
        const gradientWithoutDuplicates = [...new Set(gradientPalette)];
        const gradient = gradientWithoutDuplicates.map(e=>{
            if(e === color.hsl[2]){
                return color
            }else{
                return new Color(Color.hslToHEX([color.hsl[0], color.hsl[1], e]))
            }
        })
        // console.log(color)
        // console.log(gradient)
        
        return gradient;
    }
}