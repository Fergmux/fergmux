<template>
  <div style="display: flex; align-items: center; padding: 50px">
    <canvas id="canvas"></canvas>
      <div style="display: flex; flex-direction: column; margin: 50px;">
      <button  class="button-light" style="margin-bottom: 20px" @click="main">Generate</button>
      Grid size: {{ gridSizeRef }}
      <input type="range" min="10" max="50" v-model="gridSizeRef" />
      
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import grassImg from "@/assets/images/map/grass.png"
import pathImg from "@/assets/images/map/path.png"
import templeImg from "@/assets/images/map/temple.png"
import smallTempleImg from "@/assets/images/map/smalltemple.png"
import house1 from "@/assets/images/map/house1.png"
import house2 from "@/assets/images/map/house2.png"
import house3 from "@/assets/images/map/house3.png"
import house4 from "@/assets/images/map/house4.png"
import house5 from "@/assets/images/map/house5.png"

let ctx
let width
let height
let cellWidth
let cellHeight



const images = {
  grassImg,
  pathImg,
  templeImg,
  smallTempleImg,
  house1,
  house2,
  house3,
  house4,
  house5,
}

// const imageURL = [
//   "images/grass.png",
//   "images/path.png",
//   "images/temple.png",
//   "images/smalltemple.png",
//   "images/house1.png",
//   "images/house2.png",
//   "images/house3.png",
//   "images/house4.png",
//   "images/house5.png",
// ]; // list of image URLs

// const images = []; /// array to hold images.
let imageCount = 0; // number of loaded images;

let canvas

export default {
  setup() {

    const gridSizeRef = ref(20)


    function load() {
      console.log(images)
 ctx = canvas.getContext("2d");
 canvas.height = window.innerHeight - 100
  canvas.width = window.innerHeight - 100
 width = canvas.clientWidth // 1000
 height = canvas.clientHeight // 1000
 



// iterate each image URL, create, load, and add it to the images array
Object.entries(images).forEach(([key, src]) => {  // for each image url
  const image = new Image();
  image.src = src;
  image.onload = ()=>{ 
    imageCount += 1;
    images[key] = image; // add loading image to images array
    if(imageCount === Object.entries(images).length){ // have all loaded????
      console.log(images)
      // console.log(grassImg, pathImg)
      // main(); // call function to start rendering
    }
  }
});

// function load() {
//   const image = new Image();
//   image.src = "images/path.png";
//   image.onload = ()=>{ 
//     pathImg = image
//     const image2 = new Image();
//     image2.src = "images/grass.png";
//     image2.onload = ()=>{ 
//       grassImg = image2
//       main(); // call function to start rendering
//     }
//   }
// }

// load()




ctx.fillStyle = "black";
}

    onMounted(() => {
      canvas = document.getElementById("canvas");
      // canvas = document.getElementById('myCanvas') as HTMLCanvasElement
      // gl = initWebGL()
      // canvas.width = window.innerWidth
      // canvas.height = window.innerHeight
      // reset()
      load()
    })



function main() {
  const gridSize = gridSizeRef.value
  cellWidth = width/gridSize
 cellHeight = height/gridSize

  const cells = []
  const {
    grassImg,
    pathImg,
    templeImg,
    smallTempleImg,
    house1,
    house2,
    house3,
    house4,
    house5
   } = images

  // fill cells with objects
  for (let i = 0; i < gridSize; i++) {
    cells.push([])
    for (let j = 0; j < gridSize; j++) {
      cells[i].push({
        id: `${i}${j}`,
        x: i,
        y: j,
        posx: i * (width/gridSize),
        posy: j * (height/gridSize),
        width: width/gridSize,
        height: height/gridSize,
        color: "white",
        content: `${i},${j}`,
        image: undefined,
        // connections: [false, false, false, false]
      })
    }
  }
  
  const visitedCellIds = []

  // place temple
  function placeTemple(image, size, maxOffset) {
    const templeLocationX = Math.floor(Math.random() * (gridSize - 2*maxOffset)) + maxOffset;
    const templeLocationY = Math.floor(Math.random() * (gridSize - 2*maxOffset)) + maxOffset;

    for (let i = templeLocationX; i < templeLocationX + size; i++) {
      for (let j = templeLocationY; j < templeLocationY + size; j++) {
        if (visitedCellIds.includes(`${i}${j}`)) {
          return placeTemple(image, size, maxOffset)
        }
      }
    }


    ctx.drawImage(image, templeLocationX*cellWidth, templeLocationY*cellHeight, cellWidth* size, cellHeight*size)
    // cells[templeLocationX][templeLocationY].image = image
    // set 3x3 grid cells with temple image
    for (let i = templeLocationX; i < templeLocationX + size; i++) {
      for (let j = templeLocationY; j < templeLocationY + size; j++) {
        const cell = cells[i][j]
        cell.image = image
        visitedCellIds.push(`${cell.x}${cell.y}`)
      }
    }
  }

  // up to 20 1 big
  // up to 40 2 big
  // up to 60 3 big
  const smallTempleRange = Math.floor(gridSize/10)
  // const bigTempleRange = Math.max(Math.round(gridSize/20 - 1), 1)

  // const largeTempleCount = Math.floor(Math.random() * bigTempleRange) + bigTempleRange
    placeTemple(templeImg, 3, 5)

  
  const smallTempleCount = Math.floor(Math.random() * smallTempleRange) + smallTempleRange + 1
  for (let i = 0; i < smallTempleCount; i++) {
    placeTemple(smallTempleImg, 2, 2)
  }



  // a function to set cell images so that the they make a realistic path network

  const cellIsNotCrowded = (cell) => {
    // check if any of the 8 adjacent cells are paths
    let count = 0
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue
        const cellImg = cells[cell.x + i]?.[cell.y + j]?.image
        if (cellImg === pathImg) {
          count++
        }
      }
    }
    console.log(count)
    return count < 3
  }


  function makeConnections(cell, image) {

    // console.log(cell.id)
    
    if (visitedCellIds.includes(cell.id)) {
      return
    }

    visitedCellIds.push(cell.id)

    // randomyl make path
    cell.image = image
    if(cellIsNotCrowded(cell)) {
      ctx.drawImage(cell.image, cell.posx, cell.posy, cellWidth, cellHeight)
    } else {
      cell.image = grassImg
      ctx.drawImage(cell.image, cell.posx, cell.posy, cellWidth, cellHeight)
    
    }

    
    // debugger

    if(image === grassImg) return
    
    // make connections for every adjacent cell
    
    const downCell = cells[cell.x][cell.y + 1]
    const upCell = cells[cell.x][cell.y - 1]
    const rightCell = cells[cell.x + 1]?.[cell.y]
    const leftCell = cells[cell.x - 1]?.[cell.y]
    // neighbour cells array
    const neighbours = [upCell, downCell, leftCell, rightCell]
    const validNeighbours = neighbours.filter(cell => cell && !visitedCellIds.includes(cell.id) && cellIsNotCrowded(cell))
    const validNeighbourCount = validNeighbours.length
    let pathNeighbours = Array.from({length: validNeighbourCount}, () => Math.random() >= 0.5);
    if (!pathNeighbours.includes(true)) {
        pathNeighbours[Math.floor(Math.random() * pathNeighbours.length)] = true;
    }
    // const pathNeighbours = Array.from({length: validNeighbourCount}, () => Math.random() >= 0.5);

    validNeighbours.forEach((cell, index) => 
      makeConnections(cell, pathNeighbours[index] ? pathImg : grassImg)
    )

    

    // get number of valid neighbours
    // randomly pick how many neighbours should be paths
    // randomly pick which neighbours to assign paths to

    // randomly pick which directions to make path in, at least 1, maybe more

    // randomly generate an integer between 0 and 3
    // let boolArray = Array.from({length: 4}, () => Math.random() >= 0.5);

    
    // makeConnections(downCell, boolArray[0] ? pathImg : grassImg)
  }

  makeConnections(cells[0][0], pathImg)


  // draw cell index as text inside cells
  cells.forEach(cellRow => {
    // draw index on each cell
    cellRow.forEach(cell => {
      if (!cell.image) {
        cell.image = grassImg
        ctx.drawImage(cell.image, cell.posx, cell.posy, cellWidth, cellHeight)
      }

      // ctx.font = "16px sans-serif";
      // ctx.fillStyle = "white";
      // ctx.fillText(cell.content, cell.posx + 5, cell.posy + cell.height/2)
    })
  })

  cells.forEach(cellRow => {
    // draw index on each cell
    cellRow.forEach(cell => {
      if (cell.image === grassImg && Math.random() > 0.5){
        const houseImages = [house1, house2, house3, house4, house5]
        let randomInt = Math.floor(Math.random() * 4);
        cell.image = houseImages[randomInt]
        ctx.drawImage(cell.image, cell.posx, cell.posy, cellWidth, cellHeight)
      }
    })
  })

  // for (let i = 0; i <= width; i += cellWidth) {
  //   // draw horzaintal line
  //   ctx.moveTo(0, i);
  //   ctx.lineTo(width, i);
  // }  
  // for (let i = 0; i <= height; i += cellHeight) {
  //   ctx.moveTo(i, 0);
  //   ctx.lineTo(i, height);

  //   ctx.stroke();  
  // }

  console.log(cells)
}




    return { main, gridSizeRef }
  }
}

</script>