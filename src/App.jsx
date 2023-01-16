import Konva from 'konva/lib/Core'
import { Line } from 'konva/lib/shapes/Line'
import { useCallback, useLayoutEffect, useReducer, useRef, useState } from 'react'

const actionTypes = {
  IS_DRAWING: "IS_DRAWING",
  SET_LINE: "SET_LINE"
}

const reducer = (state, action) => {
switch (action.type) {
  case actionTypes.IS_DRAWING:
    console.log("pasamos");
      return {
        ...state, isDrawing: !state.isDrawing
      }
  case actionTypes.SET_LINE:
    return {
      ...state, drawingLine: action.payload
    }

  default:
    state
    break;
}
}

function App() {
  let containerRef = useRef(null)
  let stage = useRef(null)
  
  const layer = new Konva.Layer(); 
  // let isDrawing = false
  // let drawingLine
  // const [isDrawing, setIsDrawing] = useState(false)
  // const [drawingLine, setDrawingLine] = useState()

  const [state, dispatch] = useReducer(reducer, {
    isDrawing: false,
    drawingLine: null
  })

  const startDrawing = (e) => {
    dispatch({ type: actionTypes.IS_DRAWING })
    const position = stage.current.getPointerPosition()
    const line = new Line({
      stroke: '#df4b26',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      points: [position.x, position.y, position.x, position.y],
    })
    layer.add(line)
    dispatch({ type: actionTypes.SET_LINE, payload: line })
  }

  const notDrawing = (e) => {
    dispatch({ type: actionTypes.IS_DRAWING })
  }

  const drawing = (e) => {
    // console.log(isDrawing);
    if(!state.isDrawing){
      return
    }

    e.evt.preventDefault()
    const position = stage.current.getPointerPosition()
    const line = state.drawingLine;
    let newPoints = line.points().concat([position.x, position.y])
    line.points(newPoints)

  }

  const loadEvents = (stage) => {
    stage.on('mousedown touchstart', startDrawing)
    stage.on('mouseup touchend', notDrawing)
    stage.on('mousemove touchmove', drawing)
  }

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
