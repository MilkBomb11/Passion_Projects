local bm = {}

function bm.reset()
  objects.boundaries = {}
end

function bm.draw()
  for i=1,#objects.boundaries do
    objects.boundaries[i]:draw()
  end
end

return bm
