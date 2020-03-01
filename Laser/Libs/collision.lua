local cl = {}

local function dist(x1, y1, x2, y2)
  return math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))
end

function cl.linePoint(line, point, buffer)
  return dist(line.x1, line.y1, point.x, point.y) + dist(line.x2, line.y2, point.x, point.y)
         < dist(line.x1, line.y1, line.x2, line.y2) + buffer and
         dist(line.x1, line.y1, point.x, point.y) + dist(line.x2, line.y2, point.x, point.y)
         > dist(line.x1, line.y1, line.x2, line.y2) - buffer
end

return cl
