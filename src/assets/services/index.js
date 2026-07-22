/**
 * Public service layer over the packing algorithms.
 * Components should prefer these grouped APIs; named re-exports stay for compatibility.
 */

export {
  Rectangle,
  getDimentionsOfData,
  detailsOfRectangle,
  fillDataFromTheirFormat,
  fillDataFromMyFormat,
  readDataFromGrid,
  UserInputs2Darray,
  Rotate,
  dataToMyFormat,
  myFormtToTheirs,
  fillGrid,
  dataToTxt,
  CheckForRecs,
  buildTheirTreeFromTheirFormat,
  getRootFromData,
  addCirclesAndStrokesToBinaryTree,
  buildTheirTreeFromData,
} from './algorithms.js'

export {
  layoutDiagonalAstTree,
  layoutRotatedOrthogonalTree,
} from './treeLayout.js'

import {
  Rectangle,
  getDimentionsOfData,
  detailsOfRectangle,
  fillDataFromTheirFormat,
  fillDataFromMyFormat,
  readDataFromGrid,
  Rotate,
  dataToMyFormat,
  myFormtToTheirs,
  fillGrid,
  dataToTxt,
  CheckForRecs,
  buildTheirTreeFromTheirFormat,
  getRootFromData,
  addCirclesAndStrokesToBinaryTree,
  buildTheirTreeFromData,
} from './algorithms.js'

import {
  layoutDiagonalAstTree,
  layoutRotatedOrthogonalTree,
} from './treeLayout.js'

/** Rectangle model + metrics */
export const ModelService = {
  Rectangle,
  getDimensions: getDimentionsOfData,
  details: detailsOfRectangle,
  getRoot: getRootFromData,
}

/** Import / export string & grid formats */
export const FormatService = {
  fromTheirString: fillDataFromTheirFormat,
  fromMyString: fillDataFromMyFormat,
  toMyFormat: dataToMyFormat,
  toTheirFormat: myFormtToTheirs,
  fromGrid: readDataFromGrid,
  toGrid: dataToTxt,
  fillGrid,
  rotate: Rotate,
}

/** Async packing enumeration */
export const PackingService = {
  solveSubsets: CheckForRecs,
}

/** Tree construction + drawing layout */
export const TreeService = {
  buildTheirFromFormat: buildTheirTreeFromTheirFormat,
  buildTheirFromData: buildTheirTreeFromData,
  layoutLegacy: addCirclesAndStrokesToBinaryTree,
  /** AST-style: 45° diagonals, 90° between sibling edges */
  layoutAst: layoutDiagonalAstTree,
  layoutOrthogonalRotated: layoutRotatedOrthogonalTree,
  getRoot: getRootFromData,
}
