export function getX (rad, r) {
  return Math.cos(rad) * r
}

export function getY (rad, r) {
  return Math.sin(rad) * r
}

export function extend (target, source) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key]
    }
  }
  return target
}
