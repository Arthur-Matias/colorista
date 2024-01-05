import Color from "./models/Color";
import ColorPalette from "./models/ColorPalette";
import "./style.css"

// let locked = false;
const paletteElement = document.getElementById("palette") as HTMLDivElement;
const gradientElement = document.getElementById("gradient") as HTMLDivElement;
const palette = new ColorPalette();

window.addEventListener("load", ()=>{
  // console.log(paletteElement)
  // console.log(palette)
  palette.updatePalette(paletteElement)
})
window.addEventListener("keydown", e=>{
  if(e.key === " " || e.key === "Space"){
    e.preventDefault();
    if(!gradientElement.classList.contains("open")){
      palette.changeNonLocked();
      palette.updatePalette(paletteElement);
    }
  }
})
window.addEventListener("click", (e)=>{
  handleClick(e.target as HTMLElement)
})
let timeout: number | undefined = undefined;

window.addEventListener("input", (e) => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    handleInput(e.target as HTMLInputElement);
  }, 2000); // Set delay as 500ms
});

function handleInput(element: HTMLInputElement){
  // console.log(element.id)
  // console.log(element.value)
  const [_, id] = element.id.split("-");
  let newColor: Color;
  try {
    newColor = new Color(element.value);
    palette.changeColor(id, newColor);
    palette.updatePalette(paletteElement);
    // console.log(newColor)
  } catch (error) {
    alert(error)
  }
}
function handleClick(element: HTMLElement){
  const [command, colorID] = element.id.split("-");
  // console.log(command)
  // console.log(colorID)
  let commandList: {[id: string]: (...params:any)=>void} = {
    "addColorAfter": ()=>handleAddColorClick(colorID),
    "addColorBefore": ()=>handleAddColorClick(colorID, true),
    "lockBtn": ()=>palette.lockColor(colorID),
    "delete": ()=>handleDeleteButton(colorID),
    "getGradient": ()=>handleGetGradientClick(colorID),
    "gradient": ()=>handleGradientOff()
  }
  try {
    commandList[command]();
  } catch (error) {
    console.error(error)
  }
  function handleAddColorClick(id:string, before?: boolean){
    palette.generateNewColor(id, before)
    palette.updatePalette(paletteElement)
  }
  function handleDeleteButton(id: string){
    let removed = palette.removeColor(id);
    if(removed){
      palette.updatePalette(paletteElement);
    }
  }
  function handleGetGradientClick(id: string){
    let el = palette.getGradientFrom(id);
    gradientElement.append(el);
    toggleGradientOpen();
  }
}
function toggleGradientOpen(){
  gradientElement.classList.toggle("open")
}
function handleGradientOff(){
  gradientElement.innerHTML = "";
  toggleGradientOpen();
}