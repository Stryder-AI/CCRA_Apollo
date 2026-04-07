export function generateFarmBoundary(
  center: [number, number],
  sizeHectares: number
): [number, number][] {
  const radiusKm = Math.sqrt(sizeHectares / 100) * 0.5634
  const radiusDeg = radiusKm / 111
  const numVertices = 7 + Math.floor(Math.random() * 3)
  const points: [number, number][] = []

  for (let i = 0; i < numVertices; i++) {
    const angle = (2 * Math.PI * i) / numVertices
    const jitter = 0.7 + Math.random() * 0.6
    const lat = center[0] + radiusDeg * Math.cos(angle) * jitter
    const lng = center[1] + radiusDeg * Math.sin(angle) * jitter / Math.cos(center[0] * Math.PI / 180)
    points.push([lat, lng])
  }

  points.push(points[0])
  return points
}
