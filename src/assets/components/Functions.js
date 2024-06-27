/* eslint-disable no-unused-vars */
import Queue from "queue";
let NodeIDProv = 0
class Node {
  constructor(name, id) {
    this.name = name;
    this.id = NodeIDProv++
    this.right = null
    this.below = null;
  }
}
export class Rectangle {
  constructor(name, length, width, x, y) {
    this.name = name;
    this.length = length;
    this.width = width;
    this.x = x;
    this.y = y;
    this.below = null; // Initialize below as null
    this.right = null; // Initialize right as null
  }
  // Method to calculate the area of the rectangle
  calculateArea() {
    return this.length * this.width;
  }
  addRight(rectangle) {
    this.right = rectangle.name;
  }
  addBelow(rectangle) {
    this.below = rectangle.name;
  }
  rightSon() {
    return this.right;
  }
  belowSon() {
    return this.below;
  }
  getName() {
    return this.name;
  }
  hasSons() {
    return this.below !== null || this.right !== null;
  }
  hasRightSon() {
    return this.right !== null;
  }
  hasBelowSon() {
    return this.below !== null;
  }
  static getRectangleByName(name, Rectangles) {
    if (!Rectangles) {
      return null; // Return null if there are no instances yet
    }
    return Rectangles.find((rect) => rect.name === name);
  }
}

function gcd(a, b) {
  if (a === 0) return b;
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * this function takes the root rectangle and returns the length and width of the txt that should be generatd by it
 */
export function getDimentionsOfData(
  rectangle,
  Rectangles,
  lengthScale = 1,
  widthScale = 1,
) {
  let length = rectangle.length;
  let width = rectangle.width;
  let RectB = rectangle.below
  let RectR = rectangle.right
  while (RectB !== null) {
    let Rect = Rectangle.getRectangleByName(RectB, Rectangles)
    length += Rect.length
    RectB = Rect.below
  }
  
  while (RectR !== null) {
    let Rect = Rectangle.getRectangleByName(RectR, Rectangles)
    width += Rect.width
    RectR = Rect.right
  }
    return {
    width: width / widthScale,
    length: length / lengthScale,
  };
}



//return the new string after insertion
//useful for inserting from user input
function insertRectangleInMyFormat(
  addedRectangle,
  myFormat,
  fatherRectangle,
  left = false,
  right = false,
) {
  let start = myFormat.indexOf(fatherRectangle);
  let end;
  for (end = start; (end != myFormat[end]) != "]"; end++) {
    continue;
  }
  // i is the ending of the father rec
  let part1 = myFormat.substring(0, start);
  let part2 = myFormat.substring(start, end + 1);
  let part3 = myFormat.substring(end + 1, myFormat.length);
  if (left) {
    return `${part1}(${addedRectangle.name}[${addedRectangle.length},${addedRectangle.width}])${part2}${part3}`;
  } else {
    return `${part1}${part2}(${addedRectangle.name}[${addedRectangle.length},${addedRectangle.width}])${part3}`;
  }
}

/**takes string with this format name[length,width] and returns them as an object to instantly read from */
function stringToProperties(string) {
  let name = true;
  let nameIs = "";
  let info = "";
  for (let i = 0; i < string.length - 1; i++) {
    if (string[i] === "[") {
      name = false;
    } else if (name) {
      nameIs += string[i];
    } else {
      info += string[i];
    }
  }
  let infoInt = convertStringToIntArray(info);
  return {
    name: nameIs,
    length: infoInt[0],
    width: infoInt[1],
  };
}

/** takes all of the inctances of the rectangles and retuns details regarding their possible formations
 * their maximum and minimum width and length
 * and their drawing scale
 * possibilites have this formation
 * [a,b], [a2,b2]
 *  where a and a2 are the width
 *  and b and b2 are the length
 */
export function detailsOfRectangle(instances) {
  //let string222 = "A[20,10] B[20,10] C[30,10]";
  let size = 0;
  let maximumWidth = -1;
  let maximumHeight = -1;
  let minWidth = 0;
  let minHeight = 0;
  let lengthScale = 0;
  let widthScale = 0;
  let possibilites = [];
  instances.map((rectangle) => {
    widthScale = gcd(widthScale, rectangle.width);
    lengthScale = gcd(lengthScale, rectangle.length);
    size += rectangle.width * rectangle.length;
    minHeight = Math.max(minHeight, rectangle.length);
    minWidth = Math.max(minWidth, rectangle.width);
  });


  // fix the data to match the length and width scale
  size = size / (lengthScale * widthScale);
  minWidth /= widthScale;
  minHeight /= lengthScale;

  //try all 
  for (let width = 1; width <= Math.sqrt(size); width++) {
    if (size % width === 0) {
      let length = size / width;
      if (width >= minWidth && length >= minHeight) {
        possibilites.push([width, length]);
      }
      if (length >= minWidth && width >= minHeight && length !== width) {
        possibilites.push([length, width]);
      }
    }
  }

  return {
    possibilites: possibilites,
    minHeight: minHeight,
    minWidth: minWidth,
    maximumHeight: maximumHeight,
    maximumWidth: maximumWidth,
    widthScale: widthScale,
    lengthScale: lengthScale,
  };
}

/**
 * takes string that has this format (a)b(c)
 * and returns if the string is a leaf or no (leaf means it has no sons)
 */
function isLeaf(string) {
  let numberOfNodes = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === "[") {
      numberOfNodes++;
      if (numberOfNodes > 1) {
        return false;
      }
    }
  }
  return true;
}

function isAlphabetic(char) {
  return /[a-zA-Z]/.test(char);
}

/**takes string with this format length,width and return them as an object to instantly read from */
function convertStringToIntArray(inputString) {
  let stringArray = inputString.split(",");
  let intArray = stringArray.map((s) => parseInt(s));
  return intArray.reverse();
}

/**this function takes a string of their format and returns an Array of Rectangles*/
export function fillDataFromTheirFormat(string) {
  string = string.replace(/\s/g, "");
  let returnedRectangles = [];
  const queue = new Queue();
  let temp = null;
  let tempPlace = null;
  let Root = null;
  for (let i = 0; i < string.length; i++) {
    if (string[i] === "|" || string[i] === "-") {
      temp = string[i];
      tempPlace = i;
    } else if (isAlphabetic(string[i])) {
      let rectangle = ""; //name[h,w]
      let info = ""; //h,w
      let name = ""; //name
      let start = false;
      for (let j = i; string[j] !== "]"; j++) {
        rectangle += string[j];
        if (string[j] === "[") {
          start = true;
        } else if (start === true) {
          info += string[j];
        } else {
          name += string[j];
        }
      }
      rectangle += "]";
      if (temp !== null) {
        temp += rectangle;
        // (|name[h,w]) or (-name[h,w])
        queue.push({
          id: temp,
          index: tempPlace,
        });
      } else {
        //first rectangle
        let intInfo = convertStringToIntArray(info);
        Root = new Rectangle(name, intInfo[0], intInfo[1], 0, 0);
        returnedRectangles.push(Root);
        //console.log(Root)
      }
    }
  }
  //console.log(queue)
  while (queue.length > 0) {
    let item = queue.shift();
    //console.log(item)
    let answer = "";
    if (string[item.index - 1] === "]") {
      //directly connected
      let i;
      for (i = item.index - 1; string[i] !== "["; i--) {
        answer += string[i];
      }
      answer += "[" + string[i - 1];
      answer = answer.split("").slice().reverse().join("");
      answer += item.id;
    } else {
      //need to call rec
      let char = item.id[0];
      let counter = 1;
      let i;
      for (i = item.index - 2; counter != 0; i--) {
        if (string[i] === ")") counter++;
        else if (string[i] === "(") counter--;
      }
      let updatedStr = string.substring(i + 2, item.index - 1);
      answer = fatherRectangle(updatedStr, char) + item.id;
    }
    //answer has this format rectangle1[height,width] (-/|) rectangle2[height, width]
    //logically the rectangle on the left has already been created and is already an object
    console.log(answer);
    let it =
      answer.indexOf("|") === -1 ? answer.indexOf("-") : answer.indexOf("|");
    //answer.substring(0, it) + answer[it] + answer.substring(it + 1, answer.length)
    // () | ()
    let rec1 = Rectangle.getRectangleByName(
      stringToProperties(answer.substring(0, it)).name,
      returnedRectangles,
    );
    let char = answer[it];
    let rec2 = stringToProperties(answer.substring(it + 1, answer.length));
    if (char === "|") {
      rec2 = new Rectangle(
        rec2.name,
        rec2.length,
        rec2.width,
        rec1.x + rec1.width,
        rec1.y,
      );
      returnedRectangles.push(rec2);
      rec1.addRight(rec2);
    } else {
      rec2 = new Rectangle(
        rec2.name,
        rec2.length,
        rec2.width,
        rec1.x,
        rec1.y + rec1.length,
      );
      returnedRectangles.push(rec2);
      rec1.addBelow(rec2);
    }
  }
  return returnedRectangles;
}

export function fillDataFromMyFormat(myFormat, x = 0, y = 0) {
  //console.log(`checking ${myFormat}`);
  let answer = [];
  let c = 0;
  for (let i = 0; i < myFormat.length; i++) {
    if (myFormat[i] === "(") {
      c++;
    } else if (myFormat[i] === ")") {
      c--;
    } else if (isAlphabetic(myFormat[i]) && c === 0) {
      //console.log("entered " + i);
      let start = i;
      let end;
      for (end = start; myFormat[end] !== "]" && end < myFormat.length; end++) {
        //   console.log('a')
      }
      // i is the ending of the father rec
      let part1 = myFormat.substring(1, start - 1);
      let part2 = myFormat.substring(start, end + 1);
      let part3 = myFormat.substring(end + 2, myFormat.length - 1);
      let info = stringToProperties(part2);
      let rec = new Rectangle(info.name, info.length, info.width, x, y);
      if (part1.length > 1) {
        let leftDetails = fillDataFromMyFormat(part1, x, y + rec.length);
        rec.belowSon = leftDetails.root;
        answer.push(leftDetails.answer);
      }
      if (part3.length > 1) {
        let rightDetails = fillDataFromMyFormat(part3, x + rec.width, y);
        rec.rightSon = rightDetails.root;
        answer.push(rightDetails.answer);
      }
      answer.push(rec);
      return {
        root: rec.name,
        answer: answer,
      };
    }
  }
}

function addRectangleToGrid(Rectangle, x, y, Grid, lengthScale, widthScale) {
  //intitial grid looks like this
  //xxxxxx
  //xxxxxx
  let newGrid = [];
  let overLap = false;
  //i > y && i < (y + Rectangle.length / lengthScale)
  //i > x && i < (x + Rectangle.width / widthScale)
  for (let i = 0; i < Grid.length; i++) {
    let temp = [];
    for (let j = 0; j < Grid[i].length; j++) {
      if (
        i >= y &&
        i < y + Rectangle.length / lengthScale &&
        j >= x &&
        j < x + Rectangle.width / widthScale
      ) {
        if (Grid[i][j] === "x") {
          temp.push(Rectangle.name[0]);
        } else {
          overLap = true;
          return { overLap: true };
        }
      } else {
        temp.push(Grid[i][j]);
      }
    }
    newGrid.push(temp);
  }
  return {
    overLap: false,
    Grid: newGrid,
  };
}

/**
 *
 * @param {*} arr the unfiltered 2d array taken from TxT
 * @param {*} condition filter based on whehter it is Alphabatic or not
 * @returns the 2d array but filtered out of any extra data like '|' or '-' or ' '..etc
 */
function filter2DArray(arr, condition = isAlphabetic) {
  // Initialize an empty array to hold the filtered results
  const filteredArray = [];

  // Iterate through the rows of the 2D array
  for (let i = 0; i < arr.length; i++) {
    // Initialize an empty array for the current row
    const filteredRow = [];

    // Iterate through the columns of the current row
    for (let j = 0; j < arr[i].length; j++) {
      // Apply the filter condition
      if (condition(arr[i][j])) {
        // If the element meets the condition, add it to the filtered row
        filteredRow.push(arr[i][j]);
      }
    }

    // Add the filtered row to the filteredArray
    filteredArray.push(filteredRow);
  }

  // Return the filtered 2D array
  return filteredArray;
}

/*
this function takes a grid of this shape
 AABBCC
 AABBCC
 DDDDDD
 and breaks theam down to data
*/
export function readDataFromGrid(
  Grid,
  length,
  width,
  lengthScale = 1,
  widthScale = 1,
) {
  let Rectangles = [];
  let taken = [Grid[0][0]];
  for (let i = 0; i < length; i++) {
    for (let j = width - 1; j >= 0; j--) {
      let r = Rectangles.find(r => r.name === Grid[i][j])
      if (r === undefined) {
        r = new Rectangle(Grid[i][j], lengthScale, widthScale, j * widthScale, i * lengthScale)
        if (j !== width - 1) {
          if (taken.indexOf(Grid[i][j + 1]) === -1) {
            r.right = Grid[i][j + 1]
            taken.push(Grid[i][j + 1])
          }

        }
        Rectangles.push(r)
      }
      else {
        r.width += widthScale
        r.x = j * widthScale
      }
    }
  }
  let afasd = Rectangles.filter(r => !taken.includes(r.name))
  afasd.map(r => {
    let add = Rectangles.find(rr => rr.name === Grid[(r.y) / lengthScale - 1][(r.x) / widthScale])
    add.below = r.name
  })
  Rectangles.map(r => {
    let i
    for (i = (r.x) / widthScale; Grid[(r.y) / lengthScale][i] === r.name; i++) {
      //
    }
    let w = (i - (r.x) / widthScale) * widthScale
    r.length = (r.width / w) * lengthScale
    r.width = w
  })
  //console.log(afasd)
  //console.log(Rectangles)
  return Rectangles;
}
export function UserInputs2Darray(Grid) {
  let g = structuredClone(Grid);
  g = filter2DArray(g);
  let Rectagnles = readDataFromGrid(g, g.length, g[0].length);
  // let details = detailsOfRectangle(Rectagnles)
  // let Dimentions = getDimentionsOfData(Rectagnles.find(r => r.name === Grid[0][0]), Rectagnles, details.lengthScale, details.widthScale)
  // let myFormt = dataToMyFormat(Rectagnles)
  // let theirFormat = myFormtToTheirs(myFormt)
  // let ScaledGrid = initializeGrid(Dimentions)
  // ScaledGrid = fillGrid(Rectagnles, ScaledGrid, details.widthScale, details.lengthScale)
  return Rectagnles;
  // {
  // Grid: ScaledGrid,
  // widthScale : details.widthScale,
  // lengthScale : details.lengthScale,
  // theirFormat : theirFormat,
  // myFormt : myFormt,
  // Rectangles : Rectagnles
  // }
}
let i = 0;
let answer;
/**takes Rectangles instances and retrun either false or the grid that is possible */
function fillRectangles(
  Rectangles,
  Lefts = new Queue(),
  Right,
  Grid,
  widthScale,
  lengthScale,
  maximumWidth,
  maximumHeight,
) {
  //console.log(`----------------------------------`)
  let pLefts = structuredClone(Lefts);
  let pRight = structuredClone(Right);
  let pRectangles = structuredClone(Rectangles);
  //console.log(`${i}. callback to function`)
  let number = structuredClone(i);
  i += 1;
  // console.log(`there are ${pRectangles.length} rectangles left`)
  // console.log(`there are ${pLefts.length} possibilites for left insertion`)
  // console.assert(pLefts.length === Lefts.length, 'copying failed')
  // console.log(`pRight is`)
  // console.log(pRight)
  // console.log(`pLeft is`)
  // console.log(pLefts)
  // console.log(`the grid is :`)
  // console.table(Grid)
  if (Rectangles.length === 0) {
    answer = Grid;
    //console.log("answer found");
    return;
  }
  if (pRight === null && pLefts.length > 0 && answer === false) {
    // console.log('need to try lefts')
    // //need to try lefts
    // console.log('lefts are')
    // console.log(pLefts)
    while (pLefts.length > 0) {
      let Left = pLefts.pop();
      for (let i = 0; i < Rectangles.length && answer === false; i++) {
        let rectangle = Rectangles[i];
        //console.log(`l trying rectangle ${rectangle.name} at callback ${number} at  (${Left.x},${Left.y})`)
        let endX = Left.x + rectangle.width / widthScale - 1;
        let endY = Left.y + rectangle.length / lengthScale - 1;

        if (endX < maximumWidth && endY < maximumHeight) {
          let UpdatedGrid = addRectangleToGrid(
            rectangle,
            Left.x,
            Left.y,
            Grid,
            lengthScale,
            widthScale,
          );
          if (UpdatedGrid.overLap === false) {
            let retLefts = structuredClone(pLefts);
            let retRight;
            //console.log(`x: ${Left.x}-> ${endX}`)
            //console.log(`y: ${Left.y}-> ${endY}`)
            if (endX !== maximumWidth - 1) {
              if (UpdatedGrid.Grid[Left.y][endX + 1] === "x") {
                retRight = { x: endX + 1, y: Left.y };
              } else {
                retRight = null;
              }
            } else {
              retRight = null;
            }
            if (endY !== maximumHeight - 1) {
              if (UpdatedGrid.Grid[endY + 1][Left.x] === "x") {
                retLefts.push({ x: Left.x, y: endY + 1 });
              }
            }
            // console.log(`removed ${rectangle.name}`)
            // console.log(`old size is ${Rectangles.length}`)
            // console.log(`new size is ${Rectangles.filter(r => r !== rectangle).length}`)
            fillRectangles(
              pRectangles.filter((r) => r.name !== rectangle.name),
              retLefts,
              retRight,
              UpdatedGrid.Grid,
              widthScale,
              lengthScale,
              maximumWidth,
              maximumHeight,
            );
          }
        }
      }
    }
  } else if (pRight !== null && answer === false) {
    //need to insert  at pRight
    // console.log('need to insert  at pRight')
    // console.log(pLefts)
    // console.log(pRight)
    for (let i = 0; i < Rectangles.length && answer === false; i++) {
      let rectangle = Rectangles[i];
      // console.log(`r trying rectangle ${rectangle.name} at callback ${number} at (${pRight.x},${pRight.y})`)
      let endX = pRight.x + rectangle.width / widthScale - 1;
      let endY = pRight.y + rectangle.length / lengthScale - 1;
      //console.log(`x: ${pRight.x}-> ${endX}`)
      //console.log(`y: ${pRight.y}-> ${endY}`)
      if (endX < maximumWidth && endY < maximumHeight) {
        let retLefts = structuredClone(pLefts);
        let retRight = null;
        let UpdatedGrid = addRectangleToGrid(
          rectangle,
          pRight.x,
          pRight.y,
          Grid,
          lengthScale,
          widthScale,
        );
        // console.log(`overlap = ${UpdatedGrid.overLap}`)
        if (UpdatedGrid.overLap === false) {
          // console.log(`x: ${pRight.x}-> ${endX}`)
          // console.log(`y: ${pRight.y}-> ${endY}`)

          //console.table(UpdatedGrid.Grid)
          if (endY !== maximumHeight - 1) {
            //check if there is a place to insert a rectangle below me
            if (UpdatedGrid.Grid[endY + 1][pRight.x] === "x") {
              retLefts.push({ x: pRight.x, y: endY + 1 });
            }
          }
          if (endX !== maximumWidth - 1) {
            //check if there is a place to insert a rectangle right of me

            if (UpdatedGrid.Grid[pRight.y][endX + 1] === "x")
              retRight = { x: endX + 1, y: pRight.y };
            else {
              retRight = null;
            }
          } else {
            retRight = null;
          }

          fillRectangles(
            pRectangles.filter((r) => r.name !== rectangle.name),
            retLefts,
            retRight,
            UpdatedGrid.Grid,
            widthScale,
            lengthScale,
            maximumWidth,
            maximumHeight,
          );
        }
      }
    }
  }
  //answer is false or Grid
  return;
}

/**this function returns the rectangle that the rectangle in question is connected to
 * it returns it in this string format
 * name[length,height]
 */
function fatherRectangle(string, char) {
  let i;
  let counter = 0;
  for (i = 0; i < string.length; i++) {
    if (string[i] === "(") {
      counter++;
    } else if (string[i] === ")") {
      counter--;
    } else if ((string[i] === "|" || string[i] === "-") && counter === 0) {
      if (string[i] === char) {
        //go to right substring
        if (isAlphabetic(string[i + 1])) {
          //found
          let answer = "";
          for (let j = i + 1; string[j] !== "]"; j++) {
            answer += string[j];
          }
          answer += "]";
          return answer;
        } else {
          //keep looking
          return fatherRectangle(
            string.substring(i + 2, string.length - 1),
            char,
          );
        }
      } else {
        //go to left substring
        if (isAlphabetic(string[0])) {
          //found
          let answer = "";
          for (let j = 0; string[j] !== "]"; j++) {
            answer += string[j];
          }
          answer += "]";
          return answer;
        } else {
          //keep looking
          return fatherRectangle(string.substring(1, i - 1), char);
        }
      }
    }
  }
}

export function Rotate(Rectagnles) {
  let answer = [];
  Rectagnles.map((rect) => {
    let ans = new Rectangle(rect.name, rect.width, rect.length, rect.y, rect.x);
    ans.right = rect.below;
    ans.below = rect.right;
    //console.log("ans is");
    //console.log(ans);
    answer.push(ans);
  });
  return answer;
}

/** this function takes the root rectangle and the rectagnles array of data and returns a string that is my format */
export function dataToMyFormat(rectangle, Rectangles) {
  let answer = "";
  //console.log(rectangle)
  if (rectangle.below !== null) {
    answer += "(" +
      dataToMyFormat(
        Rectangles.find((rec) => rec.name === rectangle.below),
        Rectangles,
      ) +
      ")";
  }
  answer += rectangle.name + "[" + rectangle.width + "," + rectangle.length + "]";
  if (rectangle.right !== null) {
    answer +=
      "(" +
      dataToMyFormat(
        Rectangles.find((rec) => rec.name === rectangle.right),
        Rectangles,
      ) +
      ")";
  }
  return answer;
}
function TryAllPossibilites(possibilites, Rectagnles, widthScale, lengthScale) {
  let ans = [];
  possibilites.map((pos) => {
    //pos[0] is the width
    //pos[1] is the length
    let grid = initializeGrid({ width: pos[0], length: pos[1] }, false);
    //console.log(`trying width: ${pos[0]}, length: ${pos[1]}`);
    answer = false;
    fillRectangles(
      Rectagnles,
      [],
      { x: 0, y: 0 },
      grid,
      widthScale,
      lengthScale,
      pos[0],
      pos[1],
      answer,
    );
    if (answer === false) {
      //console.log("no answer found");
    } else {

      //PrintGrid(answer, { width: pos[0], length: pos[1] }, false)
      //console.table(answer)
      let reccs = readDataFromGrid(
        answer,
        pos[1],
        pos[0],
        lengthScale,
        widthScale,
      );

      let gr = initializeGrid({ width: pos[0], length: pos[1] })
      gr = fillGrid(reccs, gr, widthScale, lengthScale)
      PrintGrid(gr, { width: pos[0], length: pos[1] })

      ans.push({
        Rectangles: reccs,
        Format:
          dataToMyFormat(
            reccs.find((r) => r.name === answer[0][0]),
            reccs,
          ),
        width: pos[0],
        length: pos[1],
      });
      //return readDataFromGrid(answer,pos[1],pos[0],lengthScale,widthScale)
    }
  });
  return ans
}
/**
 * takes a string and turns it from my format to theirs
 */
export function myFormtToTheirs(string) {
  let n = 0;
  let i = -1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    i++;
    if (string[i] === "(") {
      n += 1;
    } else if (string[i] === ")") {
      n -= 1;
    } else if (n === 0 && isAlphabetic(string[i])) {
      //father node
      // i is PN. start
      let startOfPnInfo = i;
      let j;
      for (j = i; string[j] !== "]"; j++) {
        if (string[j] === "[") {
          startOfPnInfo = j;
        }
      }
      //when the for loop ends j would be pointing towards '']''
      // startOfPnInfo would be pointing towards ''[''
      //i would be pointing towards the start of the name of the rectangle
      const substring = string.substring(startOfPnInfo + 1, j);
      const nodeInfo = convertStringToIntArray(substring);

      let numberOfSons = (j < string.length - 1 ? 1 : 0) + (i > 0 ? 1 : 0);
      switch (numberOfSons) {
        case 2: {
          let child1 = string.substring(i, string.length);
          let child2 = string.substring(1, i - 1);
          //we have 2 sons so we will call theirFormatToMine on " child1 " and on " child2 "
          let aa = isLeaf(child2)
            ? child2
            : "(" + myFormtToTheirs(child2) + ")";
          let answer = "(" + myFormtToTheirs(child1) + ")-" + aa;
          return answer;
        }
        case 1: {
          //console.log("when checking " + string + " it has one son")
          if (j < string.length - 1) {
            let child = string.substring(j + 2, string.length - 1);
            //console.log("it's on its right and it's " + child)
            let aa = isLeaf(child) ? child : "(" + myFormtToTheirs(child) + ")";
            let answer = string.substring(0, j + 1) + "|" + aa;
            return answer;
          } else {
            let child = string.substring(1, i - 1);
            //console.log("it's on its left and it's " + child)
            let aa = isLeaf(child) ? child : "(" + myFormtToTheirs(child) + ")";
            let answer = string.substring(i, string.length) + "-" + aa;
            return answer;
          }
        }
        case 0: {
          return string;
        }
      }
      break;
    }
  }
}
//done
function fill(src, data) {
  let ans;
  switch (src) {
    case "x": {
      ans = data;
      break;
    }
    case "█": {
      ans = src;
      break;
    }
    case "┏": {
      if (data === "┏") {
        ans = "┏";
      } else if (data === "┓") {
        ans = "┳";
      } else if (data === "┗") {
        ans = "┣";
      } else if (data === "┛") {
        ans = "╋";
      } else if (data === "━") {
        ans = "┳";
      } else if (data === "┃") {
        ans = "┣";
      } else if (data === " ") {
        ans = "┏";
      } else {
        ans = "┏";
      }
      break;
    }
    case "┓": {
      if (data === "┏") {
        ans = "┳";
      } else if (data === "┓") {
        ans = "┓";
      } else if (data === "┗") {
        ans = "╋";
      } else if (data === "┛") {
        ans = "┫";
      } else if (data === "━") {
        ans = "┳";
      } else if (data === "┃") {
        ans = "┫";
      } else if (data === " ") {
        ans = "┓";
      } else {
        ans = "┓";
      }
      break;
    }
    case "┗": {
      if (data === "┏") {
        ans = "┣";
      } else if (data === "┓") {
        ans = "╋";
      } else if (data === "┗") {
        ans = "┗";
      } else if (data === "┛") {
        ans = "┻";
      } else if (data === "━") {
        ans = "┻";
      } else if (data === "┃") {
        ans = "┣";
      } else if (data === " ") {
        ans = "┗";
      } else {
        ans = "┗";
      }
      break;
    }
    case "┛": {
      if (data === "┏") {
        ans = "╋";
      } else if (data === "┓") {
        ans = "┫";
      } else if (data === "┗") {
        ans = "┻";
      } else if (data === "┛") {
        ans = "┛";
      } else if (data === "━") {
        ans = "┻";
      } else if (data === "┃") {
        ans = "┫";
      } else if (data === " ") {
        ans = "┛";
      } else {
        ans = "┛";
      }
      break;
    }
    case "╋": {
      if (data === "┏") {
        ans = "╋";
      } else if (data === "┓") {
        ans = "╋";
      } else if (data === "┗") {
        ans = "╋";
      } else if (data === "┛") {
        ans = "╋";
      } else if (data === "━") {
        ans = "╋";
      } else if (data === "┃") {
        ans = "╋";
      } else if (data === " ") {
        ans = "╋";
      } else {
        ans = "╋";
      }
      break;
    }
    case "┫": {
      if (data === "┏") {
        ans = "╋";
      } else if (data === "┓") {
        ans = "┫";
      } else if (data === "┗") {
        ans = "╋";
      } else if (data === "┛") {
        ans = "┫";
      } else if (data === "━") {
        ans = "╋";
      } else if (data === "┃") {
        ans = "┫";
      } else if (data === " ") {
        ans = "┫";
      } else {
        ans = "┫";
      }
      break;
    }
    case "┻": {
      if (data === "┏") {
        ans = "╋";
      } else if (data === "┓") {
        ans = "╋";
      } else if (data === "┗") {
        ans = "┻";
      } else if (data === "┛") {
        ans = "┻";
      } else if (data === "━") {
        ans = "┻";
      } else if (data === "┃") {
        ans = "╋";
      } else if (data === " ") {
        ans = "┻";
      } else {
        ans = "┻";
      }
      break;
    }
    case "┣": {
      if (data === "┏") {
        ans = "┣";
      } else if (data === "┓") {
        ans = "╋";
      } else if (data === "┗") {
        ans = "┣";
      } else if (data === "┛") {
        ans = "╋";
      } else if (data === "━") {
        ans = "╋";
      } else if (data === "┃") {
        ans = "┣";
      } else if (data === " ") {
        ans = "┣";
      } else {
        ans = "┣";
      }
      break;
    }
    case "┳": {
      if (data === "┏") {
        ans = "┳";
      } else if (data === "┓") {
        ans = "┳";
      } else if (data === "┗") {
        ans = "╋";
      } else if (data === "┛") {
        ans = "╋";
      } else if (data === "━") {
        ans = "┳";
      } else if (data === "┃") {
        ans = "╋";
      } else if (data === " ") {
        ans = "┳";
      } else {
        ans = "┳";
      }
      break;
    }
    case "━": {
      if (data === "┏") {
        ans = "┳";
      } else if (data === "┓") {
        ans = "┳";
      } else if (data === "┗") {
        ans = "┻";
      } else if (data === "┛") {
        ans = "┻";
      } else if (data === "━") {
        ans = "━";
      } else if (data === "┃") {
        ans = "╋";
      } else if (data === " ") {
        ans = "━";
      } else {
        ans = "━";
      }
      break;
    }
    case "┃": {
      if (data === "┏") {
        ans = "┣";
      } else if (data === "┓") {
        ans = "┫";
      } else if (data === "┗") {
        ans = "┣";
      } else if (data === "┛") {
        ans = "┫";
      } else if (data === "━") {
        ans = "╋";
      } else if (data === "┃") {
        ans = "┃";
      } else if (data === " ") {
        ans = "┃";
      } else {
        ans = "┃";
      }
      break;
    }
    case " ": {
      if (data === "┏") {
        ans = "┏";
      } else if (data === "┓") {
        ans = "┓";
      } else if (data === "┗") {
        ans = "┗";
      } else if (data === "┛") {
        ans = "┛";
      } else if (data === "━") {
        ans = "━";
      } else if (data === "┃") {
        ans = "┃";
      } else if (data === " ") {
        ans = "█";
      } else {
        ans = "█";
      }
      break;
    }
    //alphabetic
    default: {
      if (data === "┏") {
        ans = "┏";
      } else if (data === "┓") {
        ans = "┓";
      } else if (data === "┗") {
        ans = "┗";
      } else if (data === "┛") {
        ans = "┛";
      } else if (data === "━") {
        ans = "━";
      } else if (data === "┃") {
        ans = "┃";
      } else if (data === " ") {
        ans = "█";
      } else {
        ans = "█";
      }
      break;
    }
  }
  return ans;
}
/**
 takes an object with width and length values and initialized a grid that has double the width and length inculuding the 0 index
 to draw over
 so a 1x1 grid will look like this
 xxx
 xxx
 xxx
 to fill out this rectangle
 ┏━┓
 ┃A┃
 ┗━┛
 */
function initializeGrid({ width, length }, drawOver = true) {
  let grid = [];
  if (drawOver) {
    for (let i = 0; i <= length * 2; i++) {
      let row = [];
      for (let j = 0; j <= width * 2; j++) {
        row.push("x");
      }
      grid.push(row);
    }
  } else {
    for (let i = 0; i < length; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push("x");
      }
      grid.push(row);
    }
  }
  return grid;
}
/*takes the grid and its scale and draws the rectangles inside it*/
export function fillGrid(Rectangles, grid, widthScale, lengthScale) {
  // ┏━┓
  // ┃A┃
  // ┗━┛
  Rectangles.map((Rectangle) => {
    console.table(grid)
    console.log(Rectangle)
    let Xbegin = (Rectangle.x * 2) / widthScale;
    let Ybegin = (Rectangle.y * 2) / lengthScale;
    let Xend = Xbegin + (Rectangle.width * 2) / widthScale;
    let Yend = Ybegin + (Rectangle.length * 2) / lengthScale;
    console.log(`${Rectangle.name[0]}(X: ${Xbegin} -> ${Xend}, Y: ${Ybegin} -> ${Yend})`);
    for (let i = Ybegin; i <= Yend; i++) {
      for (let j = Xbegin; j <= Xend; j++) {
        let answer;
        if (i % 2 === 1 && j % 2 === 1) {
          answer = Rectangle.name[0];
        } else if (j === Xbegin && i === Ybegin) {
          answer = "┏";
        } else if (j === Xend && i === Ybegin) {
          answer = "┓";
        } else if (j === Xend && i === Yend) {
          answer = "┛";
        } else if (j === Xbegin && i === Yend) {
          answer = "┗";
        } else if (j === Xbegin || j === Xend) {
          answer = "┃";
        } else if (i === Ybegin || i === Yend) {
          answer = "━";
        } else {
          answer = " ";
        }
        // console.log(i,j, answer)
        grid[i][j] = fill(grid[i][j], answer);
      }
    }
  });
  return grid;
}
function PrintGrid(Grid, Dimentions, unfiltered = true) {
  let le = Dimentions.length;
  let we = Dimentions.width;
  if (unfiltered) {
    le = le * 2 + 1;
    we = we * 2 + 1;
  }
  for (let i = 0; i < le; i++) {
    let temp = "";
    for (let j = 0; j < we; j++) {
      temp += Grid[i][j];
    }
    //console.log(temp);
  }
}
function TakeItOrLeaveIt(Rectangles, TakenRectangles = [], str = '', visited = [], Answers = []) {
  let numberOfAns = 0
  let TakenR = structuredClone(TakenRectangles)
  if (TakenR === null || TakenR === undefined) {
    TakenR = []
  }
  let Str = structuredClone(str)
  let Recs = structuredClone(Rectangles)
  if (TakenR.length !== 0 && visited[Str] === undefined && Str !== '') {
    //console.log(Str)
    let details = detailsOfRectangle(TakenR);
    visited[Str] = true;
    let lalo = TryAllPossibilites(
      details.possibilites,
      TakenR,
      details.widthScale,
      details.lengthScale,
    );
    //console.log(details)
    lalo.map(item => {
      //console.log(`added`)
      //console.log(item.Format)
      Answers.push(item.Rectangles)
    })
    numberOfAns += lalo.length
  }
  Rectangles.map(rect => {
    //console.log(`take or leave ${rect.name}`)
    Recs = Recs.filter((r) => r.name !== rect.name)
    let leaveIt = TakeItOrLeaveIt(Recs, TakenR, str, visited, Answers)
    // leaveIt.Answers.map(item => {
    //   Answers.push(item)
    // })
    numberOfAns += leaveIt.numberOfAns
    TakenR.push(rect)
    Str += rect.name
    let takeIt = TakeItOrLeaveIt(Recs, TakenR, Str, visited, Answers)
    // takeIt.Answers.map(item => {
    //   Answers.push(item)
    // })
    numberOfAns += takeIt.numberOfAns
  })
  return {
    numberOfAns: numberOfAns,
    Answers: Answers
  }
}
export function dataToTxt(conRectangles) {
  if (conRectangles === null || conRectangles === undefined) {
    return [['N', 'a', 'N'], [], []]
  }
  let details = detailsOfRectangle(conRectangles);
  let root = getRootFromData(conRectangles)
  let Dimentions = getDimentionsOfData(
    root,
    conRectangles,
    details.lengthScale,
    details.widthScale,
  );
  let grid = initializeGrid(Dimentions);
  grid = fillGrid(
    conRectangles,
    grid,
    details.widthScale,
    details.lengthScale,
  );
  return grid

}
function solve(string = new String()) {
  //filter the spaces out
  string = string.replace(/\s/g, "");
  console.log(string)
  let TheirTreeData = []
  let TheirTree = buildTheirTreeFromTheirFormat(string, TheirTreeData)
  console.log('Data To Construct the Tree in the PDF')
  console.log(TheirTreeData)
  console.log('')
  console.log('Queries to construct My Data Structure')
  let connectecdRectangles = fillDataFromTheirFormat(string);
  let details = detailsOfRectangle(connectecdRectangles);
  let Dimentions = getDimentionsOfData(
    connectecdRectangles[0],
    connectecdRectangles,
    details.lengthScale,
    details.widthScale,
  );

  console.log('')
  console.log(`Dimentions for the Data are [${Dimentions.width},${Dimentions.length}]`);

  console.log('')
  console.log('The Format Inserted drawing + every X and Y',)
  let grid = initializeGrid(Dimentions);
  console.table(grid)
  grid = fillGrid(
    connectecdRectangles,
    grid,
    details.widthScale,
    details.lengthScale,
  );

  PrintGrid(grid, Dimentions);

  let RotatedRectangles = Rotate(connectecdRectangles);
  //console.log(RotatedRectangles[0]);
  // console.log(RotatedRectangles);
  let RotationDimentions = getDimentionsOfData(
    RotatedRectangles[0],
    RotatedRectangles,
    details.widthScale,
    details.lengthScale,
  );
  console.log('')
  console.log("Rotated Grid is");
  let rGrid = initializeGrid(RotationDimentions);
  rGrid = fillGrid(
    RotatedRectangles,
    rGrid,
    details.lengthScale,
    details.widthScale,
  );

  PrintGrid(rGrid, RotationDimentions);
  console.log('asda')
  connectecdRectangles[0].cirX = 100
  connectecdRectangles[0].cirY = 0
  dfs(connectecdRectangles, 10, connectecdRectangles[0])
  addCircles(connectecdRectangles, connectecdRectangles[0], 10)
  console.log('')
  console.log('Data :')
  console.log(connectecdRectangles);
  let myFormat = dataToMyFormat(connectecdRectangles[0], connectecdRectangles);
  console.log('')
  console.log(`data to my format is ${myFormat}`);
  console.log('')
  console.log("my format to theirs is " + myFormtToTheirs(myFormat));
  console.log('')
  console.log(`the root is ${connectecdRectangles[0].name}`);
  console.log('')
  console.log('------------')
  console.log('restructring the Data')
  console.log('we will treat the data as if it was inserted as Indivdiual Rectangles which means no two Rectangels are Connected')
  console.log('------------')
  console.log('')
  console.log(`details are`);
  console.log(details);
  let acceptedFormations = TryAllPossibilites(
    details.possibilites,
    connectecdRectangles,
    details.widthScale,
    details.lengthScale,
  );
  let asda
  console.log('------------')
  asda = TakeItOrLeaveIt(connectecdRectangles)
  console.log(`number of possible rectangles are ${asda}`)
  // console.log(details.maximumHeight)
  // console.log(details.maximumWidth)
  // console.log(details.lengthScale)
  // console.log(details.widthScale)
  //console.log(Rectangle.instances[0])
  //console.log(Rectangle.instances)
  //console.log(myFormtToTheirs(dataToMyFormat(Rectangle.instances[0])))
  //console.log(fillDataFromMyFormat(myFormat))
  //let answer = "(D[4,4]((F[6,6])E[5,5]))A[1,1](B[2,2](C[3,3]))"
}
export function CheckForRecs(Rectagnles) {
  let aaa = TakeItOrLeaveIt(Rectagnles)
  // console.log(aaa.Answers)
  return aaa;
}
export function buildTheirTreeFromTheirFormat(Str = new String, Data, id = -1) {
  let counter = 0
  id = id + 1
  let retNode = null
  let ans = null
  for (let i = 0; i < Str.length; i++) {
    if (Str[i] === '(') {
      counter++
    }
    else if (Str[i] === ')') {
      counter--
    }
    else if (counter === 0 && (Str[i] === '|' || Str[i] === '-')) {
      ans = i
      break
    }
  }
  if (ans) {
    //string has this format something | something
    retNode = new Node(Str[ans], id)
    if (Str[ans - 1] === ')') {
      retNode.below = buildTheirTreeFromTheirFormat(Str.substring(1, ans - 1), Data, id).id
    }
    else {
      retNode.below = buildTheirTreeFromTheirFormat(Str.substring(0, ans), Data, id).id
    }
    if (Str[ans + 1] === '(') {
      retNode.right = buildTheirTreeFromTheirFormat(Str.substring(ans + 2), Data, id).id
    }
    else {
      retNode.right = buildTheirTreeFromTheirFormat(Str.substring(ans + 1), Data, id).id
    }
  }
  else {
    //String has this format N[W,L]
    retNode = new Node(Str[0], id)
  }
  Data.push(retNode)
  return retNode
}
export function getRootFromData(Rectangles, type = 'mine') {
  let vis = []
  Rectangles.map(r => {
    if (r.right !== null) {
      vis[r.right] = true
    }
    if (r.below !== null) {
      vis[r.below] = true
    }
  }
  )
  let angalo
  if (type !== 'mine') {
    angalo = Rectangles.find(r => vis[r.id] === undefined)
  }
  else {
    angalo = Rectangles.find(r => vis[r.name] === undefined)
  }
  return angalo
}

function dfs(Rectangles, leng, Rect, mult, type = 'mine') {
  let Rrec, Lrec
  let b = 0, r = 0
  if (Rect.below !== null) {
    let angalo
    if (type !== 'mine') {
      angalo = Rectangles.find(r => r.id === Rect.below)
    }
    else {
      angalo = Rectangles.find(r => r.name === Rect.below)
    }
    Lrec = angalo
    b = dfs(Rectangles, leng, Lrec, mult, type) + 1
  }
  if (Rect.right !== null) {
    let angalo
    if (type !== 'mine') {
      angalo = Rectangles.find(r => r.id === Rect.right)
    }
    else {
      angalo = Rectangles.find(r => r.name === Rect.right)
    }
    Rrec = angalo
    r = dfs(Rectangles, leng, Rrec, mult, type) + 1
  }
  let a = Math.max(b, r)
  Rect.vr = (Math.pow(mult, a) - 1) * leng
  return a
}
function addCircles(Rectangels, Rect, leng, type = 'mine') {
  let angalo
  if (type !== 'mine') {
    angalo = Rectangels.find(r => r.id === Rect.right)
  }
  else {
    angalo = Rectangels.find(r => r.name === Rect.right)
  }
  let bangalo
  if (type !== 'mine') {
    bangalo = Rectangels.find(r => r.id === Rect.below)
  }
  else {
    bangalo = Rectangels.find(r => r.name === Rect.below)
  }

  let Rrec = angalo
  let Lrec = bangalo
  let end = []
  if (Lrec !== undefined) {
    Lrec.cirX = Rect.cirX - Rect.vr
    Lrec.cirY = Rect.cirY + leng * 2
    end.push(Lrec.cirX)
  }
  if (Rrec !== undefined) {
    Rrec.cirX = Rect.cirX + Rect.vr
    Rrec.cirY = (Rect.cirY + leng * 2)
    end.push(Rrec.cirX)
  }
  Rect.end = end
  if (Lrec !== undefined) {
    addCircles(Rectangels, Lrec, leng, type)
  }
  if (Rrec !== undefined) {
    addCircles(Rectangels, Rrec, leng, type)
  }
}
export function addCirclesAndStrokesToBinaryTree(Rectangels, length, mult = 1.3, type = 'mine') {
  let Root = getRootFromData(Rectangels, type)
  dfs(Rectangels, length, Root, mult, type)
  addCircles(Rectangels, Root, length, type)
  return Rectangels
}
export function buildTheirTreeFromData(Rectangels) {
  NodeIDProv = 0
  let data = []
  let root = getRootFromData(Rectangels)
  let myF = dataToMyFormat(root, Rectangels)
  buildTheirTreeFromTheirFormat(myFormtToTheirs(myF), data)
  //console.log(data)
  return data
}
let string = "(A[30,20]|(B[20,20]|C[20,20]))-(D[30,40]|(E[40,20]-F[40,20]))";
let string222 = "(A[20,10]|(B[20,10]|C[30,10]))-(D[30,50]|(E[40,30]-F[40,20]))";
let ansString =
  "(A[20,10] | (B[20,10]|C[30,10])) - (D[30,50]|(E[40,30]-F[40,20]))";
let string2 =
  "((A[2,1]-Z[3,3])-((B[2,2]|C[3,3])-Y[3,3]))-(X[7,7]-(D[4,4]|(E[5,5]-F[6,6])))";
let string3 = "((A[10,10]|B[10,10])-C[10,20])";
let string433 = "(A[1,1]-C[4,1])|B[2,3]";
let string4 = "((((((A[20,10]-C[10,20])|B[10,10])|D[10,30])|E[20,10])|F[10,20])|G[20,10])|H[20,10]";
let stringassss = '((C[10,30]|(D[20,10]-E[20,20]))-B[30,40])|(F[40,70])'
let dingomango = '(A[10,30]|(B[10,10]|C[10,30]))  -  ( (I[10,20]|(F[10,30]-(L[10,10]|E[10,20])))  -  ((J[20,10]|K[10,10])-D[30,10]) )'
//console.log(CheckForRecs(fillDataFromTheirFormat(string3)).numberOfAns)
//solve(dingomango);
