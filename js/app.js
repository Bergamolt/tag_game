'use strict';

const field = document.querySelector('.field');
const tapContainer = document.querySelector('.tap');
const pauseBtn = document.querySelector('#pause');
const menuBtn = document.querySelector('#menu');
const continueBtn = document.querySelector('#continue');
const continueGameBtn = document.querySelector('#continueGame');
const beep = new Audio('./audio/beep.wav');
const bg = new Image();
bg.src = './img/bg.jpg';

//variables
let tapCounter = 0;
let pauseCheck = false;
let checkSound = true;
let timeMinute = 0;
let timeSecond = 0;
let timer;
let emptyPos = {x: 0, y: 0};

const numbers = [...Array(15).keys()]
    .sort(() => Math.random() - 0.5);

const time = () => {
    const timeBlock = document.querySelector('.time');

    const timer = setInterval(() => {
        let minute = timeMinute < 10 ? '0' + timeMinute : timeMinute;
        let second = timeSecond < 10 ? '0' + ++timeSecond : ++timeSecond;

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

    const savePosY = tile.top;
    const savePosX = tile.left;
    const diffX = Math.abs(savePosX - emptyPos.x);
    const diffY = Math.abs(savePosY - emptyPos.y);

    console.log(diffX, diffY);
    if (diffY + diffX > 25) return;

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
    const isFinishGame = tiles.every(item => {
        return ((item.top * 4) * 4 + (item.left * 4 + 100)) / 100 == item.dataset.tileNumber;
    });

};

const render = (num) => {

    const color = randomColor({
        format: 'rgba',
        alpha: 0.9
    });
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('data-tile-number', numbers[num - 1] + 1);
    tile.innerHTML = `<div class="tile-item" style="background-color:${color};">${numbers[num - 1] + 1}</div>`;
    field.append(tile);

    const posX = (num % 4) * 100 * 0.25;
    const posY = ((num - num % 4) / 4 * 100) * 0.25;
    
    tile.style.top = `${posY}%`;
    tile.style.left = `${posX}%`;

    tile.top = posY;
    tile.left = posX;
    tile.number = numbers[num - 1] + 1;

    return tile;
};

//save game
const saveGame = (elem) => {
    
    const obj = {
        minute: timeMinute,
        second: timeSecond,
        taps: tapCounter,
        elem: elem,    
    }
    console.log(obj)
    const json = JSON.stringify(obj);
    console.log(json)
    localStorage.setItem('save', json);
};
//

const renderContinueGame = (num) => {
    const obj = JSON.parse(localStorage.getItem('save'));
        const pos = obj.elem;
        const color = randomColor({
            format: 'rgba',
            alpha: 0.9
        });
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.setAttribute('data-tile-number', pos[num].number);
        tile.innerHTML = `<div class="tile-item" style="background-color:${color};">${pos[num].number}</div>`;
        field.append(tile);

        tile.style.top = `${pos[num].top}%`;
        tile.style.left = `${pos[num].left}%`;

        tile.top = pos[num].top;
        tile.left = pos[num].left;

        return tile;
}

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

//start game
const start = () => {
    const start = document.querySelector('#startGame');
};
//

bg.onload = () => {
    console.log(bg.src)
    document.querySelector('.container').style.backgroundImage = `url(${bg.src})`;
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.start-game').style.display = 'flex';
    document.querySelector('#startGame').addEventListener('click', () => {
        document.querySelector('.start-game').style.display = 'none';
        document.querySelector('.screen-game').style.display = 'flex';
        //document.querySelector('.screen-game').classList.add('show')

        for (let i = 1; i <= 15; i++) {
            const tile = render(i);
            tile.addEventListener('click', () => {
                move(tile);
            });
        }

        timer = time();
        pause();
        sound();

        //Menu
        menuBtn.addEventListener('click', () => {
            if (!pauseCheck) {
                document.querySelector('.popup').style.height = '100%';
                document.querySelector('.popup-menu').style.display = 'flex';
                pauseCheck = true;
                clearInterval(timer);
                saveGame();
            }
        });
        
        continueGameBtn.addEventListener('click', () => {
            if (pauseCheck) {
                document.querySelector('.popup').style.height = '0%';
                document.querySelector('.popup-menu').style.display = 'none';
                timer = time();
                pauseCheck = false;
            }
        });
    });

    const loadSaveBtn = document.querySelector('#loadSaveBtn');
        loadSaveBtn.addEventListener('click', () => {
            document.querySelector('.start-game').style.display = 'none';
        document.querySelector('.screen-game').style.display = 'flex';
            for (let i = 0; i < 15; i++) {
                renderContinueGame(i);
                // const tile = render(i);
                // tile.addEventListener('click', () => {
                //     move(tile);
                // });
            }
        });
};