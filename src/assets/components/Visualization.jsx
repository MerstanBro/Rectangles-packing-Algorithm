import { ReactP5Wrapper } from 'react-p5-wrapper';
import { getDimentionsOfData , getRootFromData } from './Functions';
export const Visualization = ({ Rectangles }) => {
  //const colors = ['red', 'green', 'blue', 'orange', 'purple', 'cyan', 'magenta'];
  const sketch = (p5) => {
      p5.setup = () => {
        p5.createCanvas(234*2, 234*2+90);
        let c = p5.color(255, 255, 255);
        p5.background(c);
        p5.textAlign(p5.CENTER, p5.CENTER);
      };
  
      p5.draw = () => {
        let c = p5.color(255, 255, 255);
        let r = getRootFromData(Rectangles)
        //console.log(r)
        const d = getDimentionsOfData(r,Rectangles)
        const multiplier = Math.min(224/d.length,215*2/d.width)
        const stX = 117*2 - (d.width*multiplier)/2
        const stY = 217 - (d.length*multiplier)/2
        p5.background(c); // Clear the canvas each frame
        Rectangles.forEach((rect) => {
         //p5.fill(colors[index % colors.length]); // Cycle through the colors 
         p5.rect((rect.x*multiplier + stX), (rect.y*multiplier+ stY), rect.width * multiplier, rect.length * multiplier);
          //p5.fill(0); // Set fill color to black for text
          p5.text(rect.name, (rect.x + rect.width / 2) * multiplier+ stX, (rect.y + rect.length / 2) * multiplier+ stY);
        });
      p5.noLoop()
      };
    };
  
    return <ReactP5Wrapper sketch={sketch} />;
  };

  // Visualization.propTypes = {
  //   Rectangles: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       length: PropTypes.number.isRequired,
  //       width: PropTypes.number.isRequired,
  //       x: PropTypes.number.isRequired,
  //       y: PropTypes.number.isRequired,
  //     })
  //   ).isRequired,
  // };
  