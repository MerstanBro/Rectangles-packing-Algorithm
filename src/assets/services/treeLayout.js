/**
 * Diagonal binary-tree layout matching classic AST diagrams:
 * left child goes down-left at 45°, right child goes down-right at 45°,
 * so the angle between sibling edges is 90°.
 */

function resolveChild(nodes, key, type) {
  if (key === null || key === undefined) return null
  if (type !== 'mine') return nodes.find((n) => n.id === key) ?? null
  return nodes.find((n) => n.name === key) ?? null
}

function nodeId(node, type) {
  return type !== 'mine' ? node.id : node.name
}

function countLeaves(nodes, node, type) {
  if (!node) return 0
  const left = resolveChild(nodes, node.below, type)
  const right = resolveChild(nodes, node.right, type)
  if (!left && !right) return 1
  return Math.max(1, countLeaves(nodes, left, type) + countLeaves(nodes, right, type))
}

/**
 * Place nodes so every parent→child edge is a 45° diagonal.
 * below = left branch (down-left), right = right branch (down-right).
 */
function placeDiagonal(nodes, node, type, x, y, step, positions) {
  if (!node) return
  const id = nodeId(node, type)
  positions.set(id, { node, lx: x, ly: y })

  const left = resolveChild(nodes, node.below, type)
  const right = resolveChild(nodes, node.right, type)

  if (left && right) {
    const leftSpan = Math.max(1, countLeaves(nodes, left, type))
    const rightSpan = Math.max(1, countLeaves(nodes, right, type))
    placeDiagonal(nodes, left, type, x - step * leftSpan, y + step * leftSpan, step, positions)
    placeDiagonal(nodes, right, type, x + step * rightSpan, y + step * rightSpan, step, positions)
  } else if (left) {
    placeDiagonal(nodes, left, type, x - step, y + step, step, positions)
  } else if (right) {
    placeDiagonal(nodes, right, type, x + step, y + step, step, positions)
  }
}

/**
 * @returns {{ nodes: Array<{id,label,x,y}>, edges: Array<{x1,y1,x2,y2}>, root: {x,y}|null }}
 */
export function layoutDiagonalAstTree(nodes, root, options = {}) {
  const {
    type = 'mine',
    step = 52,
    canvasWidth = 760,
    canvasHeight = 560,
    padding = 64,
  } = options

  if (!root || !nodes?.length) {
    return { nodes: [], edges: [], root: null }
  }

  const positions = new Map()
  placeDiagonal(nodes, root, type, 0, 0, step, positions)

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const p of positions.values()) {
    minX = Math.min(minX, p.lx)
    maxX = Math.max(maxX, p.lx)
    minY = Math.min(minY, p.ly)
    maxY = Math.max(maxY, p.ly)
  }

  const availW = canvasWidth - padding * 2
  const availH = canvasHeight - padding * 2
  const spanX = Math.max(1, maxX - minX)
  const spanY = Math.max(1, maxY - minY)
  const scale = Math.min(availW / spanX, availH / spanY, 1.25)

  const offsetX = canvasWidth / 2 - ((minX + maxX) / 2) * scale
  const offsetY = padding + 28 - minY * scale

  const toScreen = (lx, ly) => ({
    x: lx * scale + offsetX,
    y: ly * scale + offsetY,
  })

  const screenNodes = []
  for (const { node, lx, ly } of positions.values()) {
    const s = toScreen(lx, ly)
    screenNodes.push({
      id: nodeId(node, type),
      label: String(node.name),
      x: s.x,
      y: s.y,
    })
  }

  const edges = []
  for (const { node, lx, ly } of positions.values()) {
    const parent = toScreen(lx, ly)
    for (const child of [
      resolveChild(nodes, node.below, type),
      resolveChild(nodes, node.right, type),
    ]) {
      if (!child) continue
      const c = positions.get(nodeId(child, type))
      if (!c) continue
      const end = toScreen(c.lx, c.ly)
      edges.push({ x1: parent.x, y1: parent.y, x2: end.x, y2: end.y })
    }
  }

  const rootPos = positions.get(nodeId(root, type))
  const rootScreen = rootPos ? toScreen(rootPos.lx, rootPos.ly) : null

  return { nodes: screenNodes, edges, root: rootScreen }
}

/** @deprecated use layoutDiagonalAstTree */
export function layoutRotatedOrthogonalTree(nodes, root, options = {}) {
  return layoutDiagonalAstTree(nodes, root, options)
}
