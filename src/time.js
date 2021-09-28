function checkTime(i) {
  return i < 10 ? `0${i}` : i;
}

function startTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();

  // 분과 초가 0보다 작아질 때 앞에 0 붙이기
  h = checkTime(h);
  m = checkTime(m);

  document.querySelector('.container-top--clock').textContent = `${h}:${m}`;
  t = setTimeout(function () {
    startTime();
  }, 1000);
}
startTime();
