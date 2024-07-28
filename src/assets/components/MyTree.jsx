import { ReactP5Wrapper } from 'react-p5-wrapper';
import { addCirclesAndStrokesToBinaryTree,getRootFromData} from './Functions';
export const MyTree = ({Rectangles}) => {
  const sketch = (p5) => {
    p5.setup = () =>{
      p5.createCanvas(234*6, 300*2);
      let c = p5.color(255, 255, 255);
        p5.background(c);
      p5.textAlign(p5.CENTER, p5.CENTER);
    }
    p5.draw = () => {
      let Rect = getRootFromData(Rectangles)
      const diam = 20
      addCirclesAndStrokesToBinaryTree(Rectangles,diam,1.55)
      Rect.cirX = 117*6
      Rect.cirY = 20*6
      let c = p5.color(255, 255, 255);
      p5.background(c);
      
      p5.textSize(diam);
      Rectangles.map(Rect=>{
        if(Rect.end !== undefined){
        Rect.end.map(e=>{
          p5.line(Rect.cirX,Rect.cirY,e,Rect.cirY+2*diam)
        })
      }
      })
      Rectangles.map(Rect=>{
        p5.circle(Rect.cirX, Rect.cirY, diam);
        p5.text(Rect.name,Rect.cirX,Rect.cirY+1)
      })
      //p5.noLoop()
    };
  }


  return <ReactP5Wrapper sketch={sketch} />;
}
