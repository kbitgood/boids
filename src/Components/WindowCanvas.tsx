import {
  useRef,
  useEffect,
  ComponentProps,
  forwardRef,
  useImperativeHandle,
} from 'react'

export const WindowCanvas = forwardRef<
  HTMLCanvasElement,
  ComponentProps<'canvas'>
>((props, forwardedRef) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useImperativeHandle(forwardedRef, () => canvasRef.current!)

  useEffect(() => {
    const canvas = canvasRef.current!

    function onResize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <canvas {...props} ref={canvasRef} />
})
