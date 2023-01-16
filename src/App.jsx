import Konva from 'konva/lib/Core'
import { Line } from 'konva/lib/shapes/Line'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

function App() {
  let containerRef = useRef(null)
  let stage = useRef(null)
  
  const layer = new Konva.Layer(); 
  let isDrawing = false
  let drawingLine
  // const [isDrawing, setIsDrawing] = useState(false)
  // const [drawingLine, setDrawingLine] = useState()

  const startDrawing = useCallback((e) => {
    isDrawing = true
    const position = stage.current.getPointerPosition()
    const line = new Line({
      stroke: '#df4b26',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      points: [position.x, position.y, position.x, position.y],
    })
    layer.add(line)
    drawingLine = line
  },[stage ])

  const notDrawing = useCallback((e) => {
    isDrawing = false
  },[isDrawing, ])

  const drawing = useCallback((e) => {
    // console.log(isDrawing);
    if(!isDrawing){
      return
    }

    e.evt.preventDefault()
    const position = stage.current.getPointerPosition()
    let newPoints = drawingLine.points().concat([position.x, position.y])
    drawingLine.points(newPoints)

  },[stage])

  const loadEvents =useCallback((stage) => {
    stage.on('mousedown touchstart', startDrawing)
    stage.on('mouseup touchend', notDrawing)
    stage.on('mousemove touchmove', drawing)
  },[stage, startDrawing, notDrawing, drawing])

  useLayoutEffect(() => {
    stage.current = new Konva.Stage({
      width: 1000,
      height: 1000,
      container: containerRef.current
    })
    stage.current.add(layer)
    loadEvents(stage.current)
  },[])


  
  
  return (
    <div className="App" ref={containerRef}>
      hola nopm
    </div>
  )
}

export default App
