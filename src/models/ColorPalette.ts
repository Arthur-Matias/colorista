import Color from "./Color";

export enum ColorType {
  rgb,
  hsl,
  hcl
}

export default class ColorPalette {
  palette: Color[] = [];
  minColor: number = 0;
  maxColor: number = 0;

  constructor() {
    this.generateNewColor()
  }
  getPaleteArr(colorType: ColorType): number[][] {
    let paletteArray: number[][] = [];

    switch (colorType) {
      case ColorType.rgb:
        this.palette.map(color => {
          paletteArray.push(color.rgb)
        })
        break;
      case ColorType.hsl:
        this.palette.map(color => {
          paletteArray.push(color.hsl)
        })
        break;
      case ColorType.hcl:
        this.palette.map(color => {
          paletteArray.push(color.hcl)
        })
        break;
    }
    return paletteArray;
  }
  generateNewColor(id?: string, before: boolean = false): Color {

    let newColor: Color;
    let index = this.palette.indexOf(this.palette.filter(e=>e.id===id)[0]);
    console.log("id: " + id)
    console.log("before " + before)

    if(index !== 0 && index !== this.palette.length-1){
      if(before){
        newColor = Color.getRandomColor({from: this.palette[index-1], to: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index)
      }else{
        newColor = Color.getRandomColor({from: this.palette[index], to: this.palette[index-1], palette: this.palette})
        this.insertNewColor(newColor, index+1)
      }
      return newColor
    }else if(index === 0 && index !== this.palette.length-1){
      if(before){
        newColor = Color.getRandomColor({to: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index)
      }else{
        newColor = Color.getRandomColor({from: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index+1)
      } 
      return newColor
    }else if(index !== 0 && index === this.palette.length-1){
      if(before){
        newColor = Color.getRandomColor({from: this.palette[index-1],to: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index)
      }else{
        newColor = Color.getRandomColor({from: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index+1)
      }
      return newColor
    }else{
      if(before){
        newColor = Color.getRandomColor({to: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index)
      }else{
        newColor = Color.getRandomColor({from: this.palette[index], palette: this.palette})
        this.insertNewColor(newColor, index+1)
      }
      return newColor
    }    
  }
  insertNewColor(color: Color, index?: number) {
    if (index !== undefined) {
      this.palette.splice(index, 0, color); // Ensuring index is not undefined or null
    } else {
      this.palette.push(color);
    }
  }
  removeColor(colorID: string){
    let removed = false;
    this.palette.forEach((c,i)=>{
      if(c.id === colorID){
        if(this.palette.length > 1){
          this.palette.splice(i, 1)
          removed = true
        }
      }
    })
    return removed
  }
  changeNonLocked() {
    if(this.palette.length > 2){
      this.palette.map(color => {
        color.change({palette: this.palette});
      })
    }else{
      this.palette.map(color => {
        color.change();
      })
    }
  }
  changeColor(id: string, color: Color) {
    this.palette.forEach(e => {
      if (e.id === id) {
        e.change(color);
      }
    })
  }
  updatePalette(el: HTMLElement) {
    let elementArr:string[] = [];
    el.innerHTML = "";
    this.palette.forEach(color => {
      elementArr.push(color.Element.outerHTML)
    })
    elementArr.map(e=>{
      el.innerHTML += e;
    })
  }
  lockColor(id: string){
    this.palette.forEach(color=>{
      if(color.id === id) {
        color.toggleLocked()
        // console.log(color)
      }
    })
    // console.log(this.palette)
  }
  getGradientFrom(id: string): HTMLElement{
    let currentColor: Color = new Color("#FFF");
    let gradientArray: Color[] = [];
    this.palette.map(e=>{
      if(e.id === id) currentColor = e
    })
    if(currentColor){
      gradientArray = Color.getGradientPalette(currentColor)
    }
    // console.log(gradientArray)

    const gradientListElement = document.createElement("div");
  
    gradientArray.map(color=>{
      let gradientItem = document.createElement("div");
      gradientItem.classList.add("gradient-item")
      if(id === color.id){
        gradientItem.classList.add("current")
      }
      gradientItem.innerHTML = `<p>#${color.hex}</p>`;
      gradientItem.style.setProperty("--background-color", "#" + color.hex);
      gradientItem.style.setProperty("--accent-color", "#" + Color.hslToHEX(Color.changeLightness(color.hsl)));
      gradientListElement.append(gradientItem);
    })
  
    gradientListElement.id = "gradient-list"
  
    return gradientListElement;
  }
}