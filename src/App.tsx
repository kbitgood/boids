import { useRef, useEffect } from 'react'
import { Simulation } from './Simulation/Simulation'
import { SimulationControls } from './Components/SimulationControls'
import { WindowCanvas } from './Components/WindowCanvas'

const simulation = new Simulation()

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const offscreenCanvas = offscreenCanvasRef.current!
    const context = canvas.getContext('2d')!
    const offscreenContext = offscreenCanvas.getContext('2d')!

    let animationFrameId: number
    const render = () => {
      offscreenContext.clearRect(
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height
      )
      context.clearRect(0, 0, canvas.width, canvas.height)
      simulation.update()
      simulation.draw(offscreenContext)
      context.drawImage(offscreenCanvas, 0, 0)
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-screen h-screen">
      <WindowCanvas ref={offscreenCanvasRef} className="hidden" />
      <WindowCanvas ref={canvasRef} />
      <SimulationControls simulation={simulation} />
    </div>
  )
}

export default App
