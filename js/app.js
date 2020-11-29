'use strict';

const field = document.querySelector('.field');
const tapContainer = document.querySelector('.tap');
const pauseBtn = document.querySelector('#pause');
const continueBtn = document.querySelector('#continue');
const beep = new Audio('./audio/beep.wav');

const sizeTile = 100;
let tapCounter = 1;
let pause = false;
let timeMinute = 0;
let timeSecond = 0;

let emptyPos = {
    x: 0,
    y: 0
};

const numbers = [...Array(15).keys()]
    .sort(() => Math.random() - 0.5);

const time = () => {
    console.log('done')
    const timeBlock = document.querySelector('.time');
    let minute = timeMinute;
    let second = timeSecond;

    const timer = setInterval(() => {
        if (timeSecond > 59) {
            minute++;
            second = 0;
        }
        timeBlock.textContent = `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second++ : second++}`;
        timeMinute = minute;
        timeSecond = second;
    }, 1000);

    return timer;
};

const move = (tile) => {

    const savePosY = tile.top;
    const savePosX = tile.left;
    const diffX = Math.abs(savePosX - emptyPos.x);
    const diffY = Math.abs(savePosY - emptyPos.y);


    if (diffY + diffX > 100) {
        return;
    } else {
        tile.style.top = emptyPos.y + 'px';
        tile.style.left = emptyPos.x + 'px';

        tile.top = emptyPos.y;
        tile.left = emptyPos.x;

        emptyPos.y = savePosY;
        emptyPos.x = savePosX;
        tapContainer.textContent = tapCounter++;
        beep.play();
    }
};

const render = (num) => {
    const color = randomColor({
        format: 'rgba',
        alpha: 0.9
    });

    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.innerHTML = `
            <div class="tile-item" style="background-color:${color};">${numbers[num - 1] + 1}</div>
        `;
    field.append(tile);

    const posX = num % 4;
    const posY = (num - posX) / 4;

    tile.style.top = `${posY * sizeTile}px`;
    tile.style.left = `${posX * sizeTile}px`;

    tile.top = posY * sizeTile;
    tile.left = posX * sizeTile;

    return tile;
};

window.onload = () => {
    document.querySelector('#startGame').addEventListener('click', () => {
        document.querySelector('.start-game').style.display = 'none';
        document.querySelector('.screen-game').style.display = 'block';

        for (let i = 1; i <= 15; i++) {
            const tile = render(i);
            tile.addEventListener('click', () => {
                move(tile)
            });
        }
        
        let timer = time();

        pauseBtn.addEventListener('click', () => {
            if (!pause) {
                document.querySelector('.popup').style.height = '100%';
                document.querySelector('.popup-pause').style.display = 'block';
                pause = true;
                clearInterval(timer);
            }
        });
        
        continueBtn.addEventListener('click', () => {
            if (pause) {
                document.querySelector('.popup').style.height = '0%';
                document.querySelector('.popup-pause').style.display = 'none';
                timer = time();
                pause = false;
            }
        });
    })
}