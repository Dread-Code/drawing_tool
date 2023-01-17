import Konva from 'konva/lib/Core'
import { Line } from 'konva/lib/shapes/Line'
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useRef } from 'react'

const App = observer(() => {
  let containerRef = useRef(null)
  let stage = useRef(null)

  const boardState = useLocalObservable(() => ({
    isDrawing: false,
    drawingLine: null,
    layer: null,
    mode: 'brush',
    drawingToggle(){
      this.isDrawing = !this.isDrawing;
    },
    setDrawingLine(line){
      this.drawingLine = line
    },
    createLayer(){
      this.layer = new Konva.Layer()
      return this.layer
    },
    setMode(mode){
      this.mode = mode
    }
  }))

  const startDrawing = useCallback((e) => {
    console.log(boardState.isDrawing);

    boardState.drawingToggle()
    const position = stage.current.getPointerPosition()
    const line = new Line({
      stroke: '#df4b26',
      strokeWidth: boardState.mode === 'brush' ? 5 : 10,
      lineCap: 'round',
      lineJoin: 'round',
      // la linea necesita un inicio y un fin
      points: [position.x, position.y, position.x, position.y],
      globalCompositeOperation:
      boardState.mode === 'brush' ? 'source-over' : 'destination-out',
    })
    boardState.layer.add(line)
    boardState.setDrawingLine(line)
  },[stage, boardState.setDrawingLine, boardState.drawingToggle])

  const notDrawing = useCallback((e) => {
    boardState.drawingToggle()
  },[boardState.drawingToggle])

  const drawing = useCallback((e) => {
    if(!boardState.isDrawing){
      return
    }
    e.evt.preventDefault()
    const { drawingLine } = boardState
    const position = stage.current.getPointerPosition()
    let newPoints = drawingLine.points().concat([position.x, position.y])
    drawingLine.points(newPoints)
    drawingLine.cache()
  },[stage, boardState.isDrawing, boardState.drawingLine])

  const loadEvents =useCallback((stage) => {
    stage.on('mousedown touchstart', startDrawing)
    stage.on('mouseup touchend', notDrawing)
    stage.on('mousemove touchmove', drawing)
  },[stage, startDrawing, notDrawing, drawing])

  const destroyEvents =useCallback((stage) => {
    stage.off('mousedown touchstart', startDrawing)
    stage.off('mouseup touchend', notDrawing)
    stage.off('mousemove touchmove', drawing)
  },[stage, startDrawing, notDrawing, drawing])

  useLayoutEffect(() => {
    stage.current = new Konva.Stage({
      width: 1000,
      height: 600,
      container: containerRef.current
    })
    stage.current.add(boardState.createLayer())
    loadEvents(stage.current)
  },[])

  const exportCanva = () => {
    console.log(stage.current.toJSON())
  }

  const clear = () => {
    destroyEvents(stage.current)
    stage.current.destroyChildren()
    stage.current.add(boardState.createLayer())
    loadEvents(stage.current)
  }
  
  return (
    <>
    <div className="App" ref={containerRef}>
      hola nopm
    </div>
    <button onClick={exportCanva}>export canva</button>
    <button onClick={clear}>clear</button>
    <button onClick={() => boardState.setMode("brush")}>brush</button>
    <button onClick={() => boardState.setMode("eraser")}>eraser</button>
    </>

  )
})

export default App
