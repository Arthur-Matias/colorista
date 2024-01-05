import { maxArray, minArray } from "../utils/MinMaxArr";
// import { SimplexNoise } from "../utils/simplex-noise";
// import ColorPalette, { ColorType } from "./ColorPalette";
import ColorProps from "./ColorProps";


export interface IColor {
  rgb: number[];
  hsl: number[];
  hex: string;
  hcl: number[];
}

export interface ColorChangeOptions {
  hex?: string;
  palette?: Color[];
}

export default class Color extends ColorProps implements IColor {
  public id!: string;
  public rgb!: number[];
  public hex!: string;
  public hsl!: number[];
  public hcl!: number[];
  private locked: boolean = false;

  constructor(hex: string) {
    super();
    this.hex = Color.checkIfValidHEX(hex);
    let timestamp: string = Date.now().toString();

    this.id = this.hex + timestamp;
    this.rgb = Color.hexToRGB(this.hex);
    this.hsl = Color.rgbToHSL(this.rgb);
    this.hcl = Color.hslToHCL(this.hsl);
  }
  change(options: ColorChangeOptions = {}) {

    let newColor: Color;
    let { hex, palette } = options;

    if (hex) {
      newColor = new Color(hex);
      this.updateValuesWith(newColor);
    }
    if (!this.isLocked) {
      if (!!palette) {
        let lockedColors: Color[] = palette.filter(e => e.locked);
        if(lockedColors.length > 2){
          let coinFlip = Math.random();
          let secondCoinFlip = Math.random();
          let colorArray: number[][] = []
          let minColor: number[] = []
          let maxColor: number[] = []
          lockedColors.map(color=>{colorArray.push(color.rgb)})
          minColor = minArray(colorArray);
          maxColor = maxArray(colorArray);

          if(coinFlip < 0.5){
            if(secondCoinFlip < 0.5){
              newColor = Color.getRandomColor({from: new Color(Color.rgbToHEX(maxColor)), to: new Color(Color.rgbToHEX(minColor)) , palette: lockedColors })
              this.updateValuesWith(newColor);
            }else{
              newColor = Color.getRandomColor({from: new Color(Color.rgbToHEX(minColor)), to: new Color(Color.rgbToHEX(maxColor)), palette: lockedColors })
              this.updateValuesWith(newColor);
            }
          }else{
            if(secondCoinFlip < 0.5){
              newColor = Color.getRandomColor({from: new Color(Color.rgbToHEX(minColor)), palette: lockedColors })
              this.updateValuesWith(newColor);
            }else {
              newColor = Color.getRandomColor({to: new Color(Color.rgbToHEX(maxColor)), palette: lockedColors })
              this.updateValuesWith(newColor);
            }
          }
        }else{
          newColor = Color.getRandomColor({ palette: lockedColors })
          this.updateValuesWith(newColor);

        }
      } else {
        newColor = Color.getRandomColor();
        this.updateValuesWith(newColor);
      }
    }
  }
  private updateValuesWith(color: Color) {
    this.hex = color.hex
    this.id = color.id
    this.hcl = color.hcl
    this.hsl = color.hsl
    this.rgb = color.rgb
  }
  toggleLocked() {
    this.locked = !this.locked;
    document.getElementById(`lockBtn-${this.id}`)?.classList.toggle("active")
  }
  public get Element(): HTMLElement {
    const element = `
        <div id="addColorBefore-${this.id}" role="button" class="before">
          <div class="icon-wrapper ${this.locked ? "active" : ""}">
            <i class="fa-solid fa-plus"></i>
          </div>
        </div>
        <input type="text" id="input-${this.id}" class="title" placeholder="#${this.hex}" value="#${this.hex}">
        <div>
          <div id="lockBtn-${this.id}" role="button" class="icon-wrapper ${this.locked ? "active" : ""}">
            <i class="fa-solid fa-lock"></i>
          </div>
          <div id="getGradient-${this.id}" role="button" class="icon-wrapper">
            <i class="fa-solid fa-palette"></i>
          </div>
          <div id="delete-${this.id}" role="button" class="icon-wrapper">
            <i class="fa-solid fa-x"></i>
          </div>
        </div>
        <div id="addColorAfter-${this.id}" role="button" class="after">
          <div class="icon-wrapper">
            <i class="fa-solid fa-plus"></i>
          </div>
        </div>
      `;
    const newEl = document.createElement("div") as HTMLDivElement;
    newEl.innerHTML = element;
    newEl.classList.add("color-container")
    newEl.id = this.id;
    newEl.style.setProperty("--background-color", "#" + this.hex);
    newEl.style.setProperty("--accent-color", "#" + Color.hslToHEX(Color.changeLightness(Color.rotateHue(Color.changeSaturation(this.hsl)))));
    return newEl;
  }
  public get isLocked(): boolean {
    return this.locked;
  }
}