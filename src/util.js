/**
 * 根据弧度和半径获取x轴坐标
 * @param {Number} rad 弧度
 * @param {Number} r 半径
 */
export function getX (rad, r) {
  return Math.cos(rad) * r
}

/**
 * 根据弧度和半径获取y轴坐标
 * @param {Number} rad 弧度
 * @param {Number} r 半径
 */
export function getY (rad, r) {
  return Math.sin(rad) * r
}

/**
 * 继承
 * @param {Object} target 要继承的对象
 * @param {Object} source 要被继承的对象
 */
export function extend (target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key]
    }
  }
  return target
}

/**
 * 绘制扇形的方法
 * @param {CanvasRenderingContext2D} ctx CanvasRenderingContext2D 对象，可以通过 Canvas.getContext('2D') 获得
 * @param {Object} shape
 * {
 *   number 几个扇形可以拼成一个圆
 *   i 当前始第几个扇形
 *   isOne 绘制外圈时，若只有一个，则绘制一个双倍面积的扇形
 *   r 内圈半径
 *   R 外圈半径
 *   cx 绘制原点的x轴
 *   cy 绘制原点的y轴
 * }
 * @param {String || Undefined} type 'angle' 或者 'deviation'或者undefined。通过减少角度或者原点偏移的方法，使绘制环形时，扇形之间出现空隙
 * @param {Number} baseRad 起始的弧度
 */
export function drawSector (ctx, shape, type, baseRad) {
  const { number } = shape
  const { PI } = Math
  let ox = 0
  let oy = 0
  let endRad = 0

  const startRad = baseRad + (shape.i * 2 * PI) / number
  if (shape.isOne) {
    endRad = baseRad + ((shape.i + 2) * 2 * PI) / number
  } else {
    endRad = baseRad + ((shape.i + 1) * 2 * PI) / number
  }

  if (type === 'angle') {
    // TODO 可改成传入
    const tinyRad = PI / 180
    endRad -= tinyRad
  } else if (type === 'deviation') {
    if (shape.isOne) {
      ox = getX(baseRad + ((2 * shape.i + 2) * PI) / number, number / 2)
      oy = getY(baseRad + ((2 * shape.i + 2) * PI) / number, number / 2)
    } else {
      ox = getX(baseRad + ((2 * shape.i + 1) * PI) / number, number / 2)
      oy = getY(baseRad + ((2 * shape.i + 1) * PI) / number, number / 2)
    }
  }

  const Rx = getX(endRad, shape.R)
  const Ry = getY(endRad, shape.R)

  ctx.arc(shape.cx + ox, shape.cy + oy, shape.r, startRad, endRad)
  ctx.lineTo(shape.cx + Rx + ox, shape.cy + Ry + oy)
  ctx.arc(shape.cx + ox, shape.cy + oy, shape.R, endRad, startRad, true)
  ctx.closePath()
}
