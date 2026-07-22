import { ReactP5Wrapper } from 'react-p5-wrapper'
import { useColorMode } from '@chakra-ui/react'
import { ModelService } from '../services'

const PALETTE_LIGHT = [
  [132, 180, 25],
  [66, 88, 78],
  [191, 229, 93],
  [45, 59, 54],
  [163, 211, 47],
  [111, 138, 124],
  [54, 74, 65],
  [217, 241, 154],
]

const PALETTE_DARK = [
  [163, 211, 47],
  [191, 229, 93],
  [111, 138, 124],
  [217, 241, 154],
  [132, 180, 25],
  [180, 200, 160],
  [100, 140, 110],
  [200, 230, 120],
]

export const Visualization = ({ Rectangles }) => {
  const { colorMode } = useColorMode()

  const sketch = (p5) => {
    let rects = Rectangles
    let mode = colorMode

    p5.setup = () => {
      p5.createCanvas(520, 520)
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.textFont('IBM Plex Mono')
    }

    p5.updateWithProps = (props) => {
      if (props.Rectangles) rects = props.Rectangles
      if (props.colorMode) mode = props.colorMode
      p5.loop()
    }

    p5.draw = () => {
      const isDark = mode === 'dark'
      p5.background(isDark ? 14 : 255, isDark ? 21 : 255, isDark ? 19 : 255)
      if (!rects?.length) {
        p5.noLoop()
        return
      }

      const root = ModelService.getRoot(rects)
      const d = ModelService.getDimensions(root, rects)
      const pad = 28
      const multiplier = Math.min(
        (p5.width - pad * 2) / d.width,
        (p5.height - pad * 2) / d.length,
      )
      const stX = (p5.width - d.width * multiplier) / 2
      const stY = (p5.height - d.length * multiplier) / 2

      p5.noStroke()
      p5.fill(isDark ? 45 : 243, isDark ? 59 : 246, isDark ? 54 : 244)
      p5.rect(stX - 8, stY - 8, d.width * multiplier + 16, d.length * multiplier + 16, 8)

      const palette = isDark ? PALETTE_DARK : PALETTE_LIGHT
      rects.forEach((rect, index) => {
        const [r, g, b] = palette[index % palette.length]
        p5.fill(r, g, b, isDark ? 230 : 210)
        p5.stroke(isDark ? 230 : 26, isDark ? 235 : 36, isDark ? 220 : 33, 140)
        p5.strokeWeight(1.25)
        p5.rect(
          rect.x * multiplier + stX,
          rect.y * multiplier + stY,
          rect.width * multiplier,
          rect.length * multiplier,
          4,
        )
        p5.fill(isDark ? 14 : 14, isDark ? 21 : 21, isDark ? 19 : 19)
        p5.noStroke()
        p5.textSize(Math.max(11, Math.min(18, multiplier * 0.9)))
        p5.text(
          rect.name,
          (rect.x + rect.width / 2) * multiplier + stX,
          (rect.y + rect.length / 2) * multiplier + stY,
        )
      })

      p5.noLoop()
    }
  }

  return (
    <ReactP5Wrapper
      sketch={sketch}
      Rectangles={Rectangles}
      colorMode={colorMode}
    />
  )
}
