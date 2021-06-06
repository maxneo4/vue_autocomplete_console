export function getNextUpPosition(currentPos, array) {
  var result = -1;
  if (currentPos < 0){
    result = array.length - 1;
  }
  else if (currentPos > 0) {
      result = currentPos - 1;
  }
  return result;
}

export function getNextDownPosition(currentPos, array) {
  var result = -1;
  if (currentPos < array.length - 1) {
        result = currentPos + 1;
  }
  return result;
}
