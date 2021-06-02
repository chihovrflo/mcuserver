export function setUpDisplay (data) {
  return JSON.stringify({
    type: 'setUpDisplay',
    payload: data
  });
}
export function setUpAuto (data) {
  return JSON.stringify({
    type: 'setUpAuto',
    payload: data
  });
}
export function setUpManual (data) {
  return JSON.stringify({
    type: 'setUpManual',
    payload: data
  });
}
