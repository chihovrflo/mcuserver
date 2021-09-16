function setUpDisplay (data) {
  return {
    type: 'setUpDisplay',
    payload: data
  };
}
function setUpAuto (data) {
  return {
    type: 'setUpAuto',
    payload: data
  };
}
function setUpManual (data) {
  return {
    type: 'setUpManual',
    payload: data
  };
}
function setUpConfig (data) {
  return {
    type: 'setUpConfig',
    payload: data
  };
}

export default function setUp (src) {
  if (src.includes('OK, Now targetTemp is')) return setUpAuto(src);
  else if (src.includes('envTemp')) return setUpDisplay(src);
  else if(src.includes('BTC')) return setUpConfig(src);
  else return setUpManual(src);
}
