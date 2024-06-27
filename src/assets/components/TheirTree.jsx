import { ReactP5Wrapper } from 'react-p5-wrapper';
import React from 'react'
import { getRootFromData,buildTheirTreeFromData,addCirclesAndStrokesToBinaryTree} from './Functions';
export const TheirTree = ({Rectangles}) => {
 // const diam = 10
  const sketch = (p5) => {
    p5.setup = () =>{
      p5.createCanvas(234*4, 300*3);
      let c = p5.color(255, 255, 255);
        p5.background(c);
      p5.textAlign(p5.CENTER, p5.CENTER);
    }
    p5.draw = () => {
      const diam = 20
      let saso = buildTheirTreeFromData(Rectangles)
      let Rect = getRootFromData(saso,'j')
      Rect.cirX = 117*4
      Rect.cirY = 20*6
      addCirclesAndStrokesToBinaryTree(saso, diam, 1.3, '2')
      let c = p5.color(255, 255, 255);
        p5.background(c);
        p5.textSize(diam);
      saso.map(Rect=>{
        if(Rect.end !== undefined){
        Rect.end.map(e=>{
          p5.line(Rect.cirX,Rect.cirY,e,Rect.cirY+2*diam)
        })
      }
      })
      saso.map(Rect=>{
        p5.circle(Rect.cirX, Rect.cirY, diam);
        p5.text(Rect.name,Rect.cirX,Rect.cirY+1)
      })
      //p5.noLoop()
    
    };
  }


  return <ReactP5Wrapper sketch={sketch} />;
}
