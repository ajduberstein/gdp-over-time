let lastKnownPosition = [];
const setMousePosition = (event) => {
  lastKnownPosition = [event.clientX, event.clientY]
};
const getMousePosition = () => lastKnownPosition;
document.addEventListener('click', setMousePosition);
document.addEventListener('mouseover', setMousePosition);


const roundToNearest = (val, round) => {
  return Math.round(1.0 * val / round) * round;
}

export {
  getMousePosition,
  roundToNearest 
}
