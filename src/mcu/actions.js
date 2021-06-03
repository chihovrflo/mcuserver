function setUpDisplay (data) {
  return JSON.stringify({
    type: 'setUpDisplay',
    payload: data
  });
}
function setUpAuto (data) {
  return JSON.stringify({
    type: 'setUpAuto',
    payload: data
  });
}
function setUpManual (data) {
  return JSON.stringify({
    type: 'setUpManual',
    payload: data
  });
}

export default function setUp (src) {
  if (src.includes('OK, Now targetTemp is')) return setUpAuto(src);
  else if (src.includes('envTemp')) return setUpDisplay(src);
  else return setUpManual(src);
}
