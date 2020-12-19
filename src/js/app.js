'use strict';

const popup = document.querySelector('.popup');
const gameOver = document.querySelector('.gameover');
const field = document.querySelector('.field');
const tapContainer = document.querySelector('.tap');
const timeBlock = document.querySelector('.time');
const pauseBtn = document.querySelector('#pause');
const newGameBtn = document.querySelectorAll('#newGame');
const continueBtn = document.querySelector('#continue');

const beep = new Audio('./src/audio/beep.wav');
const bg = new Image();
bg.src = './src/img/bg.jpg';

let tapCounter = 0;
let pauseCheck = false;
let checkSound = true;
let timeMinute = 0;
let timeSecond = 0;
let timer;
let emptyPos = {
  x: 0,
  y: 0,
};

const numbers = [...Array(15).keys()].sort(() => Math.random() - 0.5);

const time = () => {
  const timer = setInterval(() => {
    const minute = timeMinute < 10 ? '0' + timeMinute : timeMinute;
    const second = timeSecond < 9 ? '0' + ++timeSecond : ++timeSecond;

    if (timeSecond > 59) {
      ++timeMinute;
      timeSecond = 0;
    }

    timeBlock.textContent = `${minute}:${second}`;
  }, 1000);

  return timer;
};

const sound = () => {
  const btnSound = document.querySelector('#sound');

  btnSound.addEventListener('click', () => {
    checkSound = !checkSound;
    btnSound.textContent = !checkSound ? 'Включить звук' : 'Выключить звук';
  });
};

const move = (tile) => {
  const savePosY = tile.style.top.replace(/\%/g, '');
  const savePosX = tile.style.left.replace(/\%/g, '');
  const diffX = Math.abs(savePosX - emptyPos.x);
  const diffY = Math.abs(savePosY - emptyPos.y);

  if (diffY + diffX > 25) {
    return;
  }

  tile.style.top = emptyPos.y + '%';
  tile.style.left = emptyPos.x + '%';
  tile.top = emptyPos.y;
  tile.left = emptyPos.x;
  emptyPos.y = savePosY;
  emptyPos.x = savePosX;

  tapContainer.textContent = ++tapCounter;

  if (checkSound) beep.play();

  const tiles = [...document.querySelectorAll('.tile')];
  saveGame(tiles);

  const isFinishGame = tiles.every((item) => {
    return (
      (item.top * 4 * 4 + (item.left * 4 + 100)) / 100 ==
      item.dataset.tileNumber
    );
  });

  if (isFinishGame) {
    const timeEnd = document.querySelector('.time-end');
    const tapEnd = document.querySelector('.tap-end');
    const minute = timeMinute < 10 ? '0' + timeMinute : timeMinute;
    const second = timeSecond < 9 ? '0' + ++timeSecond : ++timeSecond;
    popup.style.height = '100%';
    gameOver.style.display = 'flex';
    clearInterval(timer);
    timeEnd.textContent = `${minute}:${second}`;
    tapEnd.textContent = `${tapCounter}`;

    if (localStorage.getItem('record') === null) {
      const recordJson = JSON.stringify({
        time: +(timeMinute * 60 + timeSecond),
        tap: tapCounter,
      });
      localStorage.setItem('record', recordJson);
    } else {
      const prevRecord = JSON.parse(localStorage.getItem('record'));
      const time = +(timeMinute * 60 + timeSecond);
      prevRecord.time = prevRecord.time > time ? time : prevRecord.time;
      prevRecord.tap =
        prevRecord.tap > tapCounter ? tapCounter : prevRecord.tap;
      const newRecord = JSON.stringify(prevRecord);
      localStorage.setItem('record', newRecord);
    }
  }
};

const render = (num) => {
  const color = randomColor({
    luminosity: 'dark',
    format: 'rgba',
    alpha: 0.9,
  });
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.setAttribute('data-tile-number', numbers[num - 1] + 1);
  tile.innerHTML = `<div class="tile-item" style="background-color:${color};">${
    numbers[num - 1] + 1
  }</div>`;
  field.append(tile);

  const posX = (num % 4) * 100 * 0.25;
  const posY = ((num - (num % 4)) / 4) * 100 * 0.25;

  tile.style.top = `${posY}%`;
  tile.style.left = `${posX}%`;

  tile.top = posY;
  tile.left = posX;
  tile.number = numbers[num - 1] + 1;

  return tile;
};

const saveGame = (elem) => {
  const obj = {
    minute: timeMinute,
    second: timeSecond,
    taps: tapCounter,
    elem: elem,
  };

  const json = JSON.stringify(obj);
  localStorage.setItem('save', json);
};

const renderContinueGame = (num) => {
  const obj = JSON.parse(localStorage.getItem('save'));
  const pos = obj.elem;
  timeMinute = obj.minute;
  timeSecond = obj.second;
  const color = randomColor({
    format: 'rgba',
    alpha: 0.9,
  });
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.setAttribute('data-tile-number', pos[num].number);
  tile.innerHTML = `<div class="tile-item" style="background-color:${color};">${pos[num].number}</div>`;
  tile.style.top = `${pos[num].top}%`;
  tile.style.left = `${pos[num].left}%`;
  field.append(tile);

  tile.top = pos[num].top;
  tile.left = pos[num].left;

  return tile;
};

const pause = () => {
  const popUp = document.querySelector('.popup');
  const popUpPauseScreen = document.querySelector('.popup-pause');

  pauseBtn.addEventListener('click', () => {
    if (!pauseCheck) {
      popUp.style.height = '100%';
      popUpPauseScreen.style.display = 'flex';
      pauseCheck = true;
      clearInterval(timer);
    }
  });

  continueBtn.addEventListener('click', () => {
    if (pauseCheck) {
      popUp.style.height = '0%';
      popUpPauseScreen.style.display = 'none';
      timer = time();
      pauseCheck = false;
    }
  });
};

const menu = () => {
  const popUpMenu = document.querySelector('.popup-menu');
  const menuBtn = document.querySelector('#menu');
  const continueGameBtn = document.querySelector('#continueGame');

  menuBtn.addEventListener('click', () => {
    if (!pauseCheck) {
      popup.style.height = '100%';
      popUpMenu.style.display = 'flex';
      pauseCheck = true;
      clearInterval(timer);
    }
  });

  continueGameBtn.addEventListener('click', () => {
    if (pauseCheck) {
      popup.style.height = '0%';
      popUpMenu.style.display = 'none';
      timer = time();
      pauseCheck = false;
    }
  });
};

const record = () => {
  const popUpRecordScreen = document.querySelector('.record');
  const time = document.querySelector('.time-record');
  const tap = document.querySelector('.tap-record');
  const record = JSON.parse(localStorage.getItem('record'));

  popup.style.height = '100%';
  popUpRecordScreen.style.display = 'flex';

  if (record) {
    tap.textContent = record.tap;
    const minute =
      Math.floor(record.time / 60) < 10
        ? `0${Math.floor(record.time / 60)}`
        : Math.floor(record.time / 60);

    const second =
      record.time - Math.floor(record.time / 60) * 60 < 10
        ? `0${record.time - Math.floor(record.time / 60) * 60}`
        : record.time - Math.floor(record.time / 60) * 60;
    time.textContent = `${minute}:${second}`;
  }
};

const start = () => {
  document.querySelector('.start-game').style.display = 'none';
  document.querySelector('.screen-game').style.display = 'flex';

  for (let i = 1; i <= 15; i++) {
    const tile = render(i);
    tile.addEventListener('click', () => {
      move(tile);
    });
  }

  const tiles = document.querySelectorAll('.tile');
  setTimeout(() => {
    for (let i = 0; i < tiles.length - 1; i++) {
      const top = tiles[i].top;
      const left = tiles[i].left;
      tiles[i].style.top = tiles[tiles.length - 1 - i].top + '%';
      tiles[i].style.left = tiles[tiles.length - 1 - i].left + '%';
      tiles[tiles.length - 1 - i].style.top = top + '%';
      tiles[tiles.length - 1 - i].style.left = left + '%';
    }
  }, 500);

  timer = time();
  pause();
  menu();
  sound();
};

const newGame = () => {
  popup.style.height = '0%';
  document.querySelector('.popup-menu').style.display = 'none';
  gameOver.style.display = 'none';
  field.innerHTML = '';
  emptyPos.x = 0;
  emptyPos.y = 0;
  numbers.sort(() => Math.random() - 0.5);
  pauseCheck = false;
  clearInterval(timer);
  timeBlock.textContent = '00:00';
  timeMinute = 0;
  timeSecond = 0;
  tapCounter = 0;
  tapContainer.textContent = '0';
  start();
};

bg.onload = () => {
  document.querySelector('.container').style.backgroundImage = `url(${bg.src})`;
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.start-game').style.display = 'flex';
  const btnsRecord = document.querySelectorAll('#recordBtn');
  const btnCloseRecord = document.querySelector('#closeRecord');

  document.querySelector('#startGame').addEventListener('click', () => {
    start();
  });

  newGameBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
      newGame();
    });
  });

  btnsRecord.forEach((btn) => {
    btn.addEventListener('click', () => {
      record();
      document.querySelector('.popup-menu').style.display = 'none';
    });
  });

  btnCloseRecord.addEventListener('click', () => {
    if (document.querySelector('.screen-game').style.display === 'flex') {
      document.querySelector('.record').style.display = 'none';
      document.querySelector('.popup-menu').style.display = 'flex';
    } else {
      popup.style.height = '0%';
      document.querySelector('.record').style.display = 'none';
    }
  });

  const loadSaveBtn = document.querySelector('#loadSaveBtn');
  loadSaveBtn.addEventListener('click', () => {
    document.querySelector('.start-game').style.display = 'none';
    document.querySelector('.screen-game').style.display = 'flex';
    for (let i = 0; i < 15; i++) {
      const tile = renderContinueGame(i);
      tile.addEventListener('click', () => {
        move(tile);
      });
    }
    timer = time();
    pause();
    menu();
    sound();
  });
};
