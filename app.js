const fileInput = document.getElementById("fileInput")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const zoomContainer = document.getElementById("zooms")

fileInput.addEventListener("change", async e => {

 const file = e.target.files[0]

 const img = new Image()
 img.src = URL.createObjectURL(file)

 img.onload = async () => {

  canvas.width = img.width
  canvas.height = img.height

  ctx.drawImage(img,0,0)

  detectBarcodes()

 }

})

async function detectBarcodes(){

 const codeReader = new ZXingBrowser.BrowserMultiFormatReader()

 try{

 const result = await codeReader.decodeFromCanvas(canvas)

 drawResult(result)

 }catch(e){

 console.log("no barcode")

 }

}

function drawResult(result){

 const points = result.resultPoints

 ctx.strokeStyle = "red"
 ctx.lineWidth = 4

 const minX = Math.min(...points.map(p=>p.x))
 const maxX = Math.max(...points.map(p=>p.x))
 const minY = Math.min(...points.map(p=>p.y))
 const maxY = Math.max(...points.map(p=>p.y))

 ctx.strokeRect(minX,minY,maxX-minX,maxY-minY)

 console.log(result.text)

 createZoom(minX,minY,maxX-minX,maxY-minY)

}

function createZoom(x,y,w,h){

 const zoomCanvas = document.createElement("canvas")
 zoomCanvas.width = w
 zoomCanvas.height = h

 const zctx = zoomCanvas.getContext("2d")

 zctx.drawImage(canvas,x,y,w,h,0,0,w,h)

 zoomCanvas.className="zoom"

 zoomContainer.appendChild(zoomCanvas)

}
