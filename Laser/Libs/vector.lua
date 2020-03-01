local v = {}

function v.normal(line)
  local normal = {x = 0, y = 0}
  local dx = line.x2 - line.x1
  local dy = line.y2 - line.y1
  normal.x = -dy
  normal.y = dx
  return normal
end

function v.mag(vec)
  local dist = math.sqrt(vec.x*vec.x + vec.y*vec.y)
  return dist
end

function v.unit(vec)
  local result =
  {
    x = vec.x / v.mag(vec),
    y = vec.y / v.mag(vec)
  }
  return result
end

function v.sub(vec1, vec2)
  local resultant =
  {
    x = vec1.x - vec2.x,
    y = vec1.y - vec2.y
  }
  return resultant
end

function v.dot(vec1, vec2)
  local result = vec1.x*vec2.x + vec1.y*vec2.y
  return result
end

function v.mul(vec, c)
  return {x = vec.x*c, y = vec.y*c}
end

return v
