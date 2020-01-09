function arrayIsEqual(a, b)
{
  let minArray, maxArray;
  if (a.length >= b.length) {minArray = b; maxArray = a;}
  else {minArray = a; maxArray = b;}


  for (var i = 0; i < minArray.length; i++) {
    if (minArray[i] !== maxArray[i])
    {
      return false
    }
  }
  return true
}

function arrItemCount(arr, item)
{
  let count = 0
  if (typeof(item) !== "object")
  {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === item)
      {
        count = count + 1
      }
    }
  }
  else
  {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === item.name && arrayIsEqual(arr[i].parameters, item.parameters))
      {
        count = count + 1
      }
    }
  }
  return count
}

function collapseArr(arr)
{
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    let occurance = arrItemCount(newArr, arr[i])
    if (occurance === 0)
    {
      newArr.push(arr[i])
    }
  }
  return newArr
}
