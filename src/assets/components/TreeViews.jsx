import { useMemo } from 'react'
import { ReactP5Wrapper } from 'react-p5-wrapper'
import { useColorMode } from '@chakra-ui/react'
import {
  TreeService,
  getRootFromData,
  buildTheirTreeFromData,
} from '../services'

function createTreeSketch({ kind }) {
  return (p5) => {
    let rects = null
    let colorMode = 'light'

    p5.setup = () => {
      p5.createCanvas(760, 560)
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.textFont('IBM Plex Mono')
    }

    p5.updateWithProps = (props) => {
      if (props.Rectangles !== undefined) rects = props.Rectangles
      if (props.colorMode) colorMode = props.colorMode
      p5.loop()
    }

    p5.draw = () => {
      const isDark = colorMode === 'dark'
      p5.background(isDark ? 14 : 255, isDark ? 21 : 255, isDark ? 19 : 255)

      if (!rects?.length) {
        p5.noLoop()
        return
      }

      let treeNodes = rects
      let root
      let type = 'mine'

      if (kind === 'their') {
        treeNodes = buildTheirTreeFromData(rects)
        root = getRootFromData(treeNodes, 'j')
        type = 'j'
      } else {
        root = getRootFromData(rects)
      }

      if (!root) {
        p5.noLoop()
        return
      }

      const layout = TreeService.layoutOrthogonalRotated(treeNodes, root, {
        type,
        canvasWidth: p5.width,
        canvasHeight: p5.height,
        step: 56,
        padding: 72,
      })

      // Straight 45° edges (90° between siblings) — AST textbook style
      p5.stroke(isDark ? 210 : 20)
      p5.strokeWeight(1.5)
      for (const e of layout.edges) {
        p5.line(e.x1, e.y1, e.x2, e.y2)
      }

      // Soft root marker (like the reference arrow tip)
      if (layout.root) {
        p5.noStroke()
        p5.fill(isDark ? 120 : 160, isDark ? 190 : 200, isDark ? 220 : 230, 180)
        const ax = layout.root.x
        const ay = layout.root.y - 28
        p5.triangle(ax, ay + 14, ax - 7, ay, ax + 7, ay)
      }

      // Plain text labels (no circles) with a tiny halo so lines don't cut glyphs
      p5.textSize(15)
      p5.textStyle(p5.BOLD)
      for (const n of layout.nodes) {
        p5.noStroke()
        p5.fill(isDark ? 14 : 255, isDark ? 21 : 255, isDark ? 19 : 255, 220)
        const tw = Math.max(18, p5.textWidth(n.label) + 8)
        p5.rect(n.x - tw / 2, n.y - 10, tw, 18, 3)

        p5.fill(isDark ? 236 : 18)
        p5.text(n.label, n.x, n.y + 1)
      }

      p5.noLoop()
    }
  }
}

export const MyTree = ({ Rectangles }) => {
  const { colorMode } = useColorMode()
  const sketch = useMemo(() => createTreeSketch({ kind: 'mine' }), [])

  return (
    <ReactP5Wrapper
      sketch={sketch}
      Rectangles={Rectangles}
      colorMode={colorMode}
    />
  )
}

export const TheirTree = ({ Rectangles }) => {
  const { colorMode } = useColorMode()
  const sketch = useMemo(() => createTreeSketch({ kind: 'their' }), [])

  return (
    <ReactP5Wrapper
      sketch={sketch}
      Rectangles={Rectangles}
      colorMode={colorMode}
    />
  )
}
