/* Системные переменные */

const PlayField = document.querySelector('.PlayField');
const HeadPlayer = document.querySelector('.BlockOnFlayField');
let PlayFieldDigital = [];
let directionOftravel = {
    buttonClicked: '',
    headDirection: 'UP'
};
let Score = 0;
let GAMEOVER = 0;

/* Настройки */

const BlockOnPlayFieldSize = {
    height: parseInt(getComputedStyle(HeadPlayer).height),
    width: parseInt(getComputedStyle(HeadPlayer).width)
};

// Код выполняемый при загрузке страницы
let PlayFieldHeight = parseInt(getComputedStyle(PlayField).height);
let PlayFieldWidth = parseInt(getComputedStyle(PlayField).width);
for (let H = 0; H < (PlayFieldHeight / BlockOnPlayFieldSize.height); H++) {
    PlayFieldDigital[H] = [];
    for (let W = 0; W < (PlayFieldWidth / BlockOnPlayFieldSize.width); W++) {
        PlayFieldDigital[H].push({'type': 'field'});
        /*
            Типы:           Свойства
                            
            field - поле    Нет
            tail - хвост    Value - через сколько исчезн.
            head - голова   Direction - направление движения
            food - еда      нет
        */
    }
}
const setScore = () => {                //Отсчёт отчков
    Score++
    document.querySelector('.score_number').textContent = Score;
    RandomGenerated('food');
}
const RandomGenerated = (objectPlayField) => {      //Функция создания объектов
    let coordinate = {
        'H': 0,
        'W': 0
    }
    if (objectPlayField == 'food') {
        for(i = 0; i != 1;) {
            coordinate['H'] = Math.floor(Math.random() * (PlayFieldDigital.length - 1));
            coordinate['W'] = Math.floor(Math.random() * (PlayFieldDigital[0].length - 1));
                if (PlayFieldDigital[coordinate['H']][coordinate['W']].type == 'field') {
                    PlayFieldDigital[coordinate['H']][coordinate['W']].type = 'food';
                    i++;
                }
        }
    }
    if (objectPlayField == 'head') {
        coordinate['H'] = Math.floor(Math.random() * (PlayFieldDigital.length - 1));
        coordinate['W'] = Math.floor(Math.random() * (PlayFieldDigital[0].length - 1));
        PlayFieldDigital[coordinate['H']][coordinate['W']].type = 'head';
    }
}
const DrawCall = () => {                //Вызов на отрисовку в поле HTML
    let html = '';
    for (let H = 0; H < (PlayFieldHeight / BlockOnPlayFieldSize.height); H++) {
        for (let W = 0; W < (PlayFieldWidth / BlockOnPlayFieldSize.width); W++) {
            if (PlayFieldDigital[H][W].type == 'field') { html += `<div class="BlockOnFlayField blockPlayField"></div>`; }
            if (PlayFieldDigital[H][W].type == 'head') { html += `<div class="BlockOnFlayField blockSnakeHead"></div>`; }
            if (PlayFieldDigital[H][W].type == 'tail') { html += `<div class="BlockOnFlayField blockSnakeTail"></div>`; }
            if (PlayFieldDigital[H][W].type == 'food') { html += `<div class="BlockOnFlayField blockFood"></div>`; }
        }
    }
    PlayField.innerHTML = html;
}
const SearchPlayer = () => {            // Поиск змейки
    let coordinate = 'not found';
    for (H = 0; H < PlayFieldDigital.length; H++) {
        for (W = 0; W < PlayFieldDigital[H].length; W++) {
            if (PlayFieldDigital[H][W].type == 'head') coordinate = {H, W, 'Direction': PlayFieldDigital[H][W].Direction}
        }
    }
    return coordinate;
}
const SearchTail = (Action) => {
    for (H = 0; H < PlayFieldDigital.length; H++) {
        for (W = 0; W < PlayFieldDigital[H].length; W++) {
            if (Action == '-') {
                if (PlayFieldDigital[H][W].type == 'tail') PlayFieldDigital[H][W].value -= 1;
                if (PlayFieldDigital[H][W].type == 'tail' && PlayFieldDigital[H][W].value == 0) PlayFieldDigital[H][W] = {'type': 'field'};
            }
        }
    }
}
const MovingToLeft = () => {            // Перемещение влево
    let POS = SearchPlayer();
    if (POS['W'] > 0) {
        if (PlayFieldDigital[POS['H']][POS['W'] - 1].type == 'food') {
            PlayFieldDigital[POS['H']][POS['W'] - 1] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[POS['H']][POS['W'] - 1].type == 'field')
                    {
                        PlayFieldDigital[POS['H']][POS['W'] - 1] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][POS['W']] = {'type': 'field'}; }
    }
    if (POS['W'] == 0) {
        if (PlayFieldDigital[POS['H']][PlayFieldDigital[POS['H']].length - 1].type == 'food') {
            PlayFieldDigital[POS['H']][PlayFieldDigital[POS['H']].length - 1] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[POS['H']][PlayFieldDigital[POS['H']].length - 1].type == 'field') 
                    {
                        PlayFieldDigital[POS['H']][PlayFieldDigital[POS['H']].length - 1] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][0] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][0] = {'type': 'field'}; }
    }
}
const MovingToRight = () => {           // Перемещение вправо
    let POS = SearchPlayer();
    if (POS['W'] < PlayFieldDigital[POS['H']].length - 1) {
        if (PlayFieldDigital[POS['H']][POS['W'] + 1].type == 'food') {
            PlayFieldDigital[POS['H']][POS['W'] + 1] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[POS['H']][POS['W'] + 1].type == 'field')
                    {
                        PlayFieldDigital[POS['H']][POS['W'] + 1] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][POS['W']] = {'type': 'field'}; }
    }
    if (POS['W'] == PlayFieldDigital[POS['H']].length - 1) {
        if (PlayFieldDigital[POS['H']][0].type == 'food') {
            PlayFieldDigital[POS['H']][0] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[POS['H']][0].type == 'field')
                    {
                        PlayFieldDigital[POS['H']][0] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][POS['W']] = {'type': 'field'}; }
    }
}
const MovingToUP = () => {              // Перемещение вверх
    let POS = SearchPlayer();
    if (POS['H'] == 0) {
        if (PlayFieldDigital[PlayFieldDigital.length - 1][POS['W']].type == 'food') {
            PlayFieldDigital[PlayFieldDigital.length - 1][POS['W']] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[PlayFieldDigital.length - 1][POS['W']].type == 'field')
                    {
                        PlayFieldDigital[PlayFieldDigital.length - 1][POS['W']] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[0][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[0][POS['W']] = {'type': 'field'}; }
    }
    if (POS['H'] > 0) {
        if (PlayFieldDigital[POS['H'] - 1][POS['W']].type == 'food') {
            PlayFieldDigital[POS['H'] - 1][POS['W']] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[POS['H'] - 1][POS['W']].type == 'field')
                    {
                        PlayFieldDigital[POS['H'] - 1][POS['W']] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][POS['W']] = {'type': 'field'}; }
    }
    
}
const MovingToDown = () => {            // Перемещение вниз
    let POS = SearchPlayer();
    if (POS['H'] < PlayFieldDigital.length - 1) {
        if (PlayFieldDigital[POS['H'] + 1][POS['W']].type == 'food') {
            PlayFieldDigital[POS['H'] + 1][POS['W']] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[POS['H'] + 1][POS['W']].type == 'field')
                    {
                        PlayFieldDigital[POS['H'] + 1][POS['W']] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][POS['W']] = {'type': 'field'}; }
    }
    if (POS['H'] == PlayFieldDigital.length - 1) {
        if (PlayFieldDigital[0][POS['W']].type == 'food') {
            PlayFieldDigital[0][POS['W']] = {'type': 'head'};
            setScore();
        }else if (PlayFieldDigital[0][POS['W']].type == 'field')
                    {
                        PlayFieldDigital[0][POS['W']] = {'type': 'head'};
                        SearchTail('-');
                    } else {return 'Breack'}
        if (Score > 0) { PlayFieldDigital[POS['H']][POS['W']] = {'type': 'tail', 'value': Score};}
            else{ PlayFieldDigital[POS['H']][POS['W']] = {'type': 'field'}; }
    }
}
const STARTGAME = () => {
    document.addEventListener('keydown', function(event){
        if (event.key == 'ArrowUp' || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight") 
              {directionOftravel.buttonClicked = event.key;}
    }, false);
    if (directionOftravel.buttonClicked == 'ArrowUp' && (directionOftravel.headDirection != 'DOWN' || Score == 0)) directionOftravel.headDirection = 'UP';
    if (directionOftravel.buttonClicked == 'ArrowDown' && (directionOftravel.headDirection != 'UP' || Score == 0)) directionOftravel.headDirection = 'DOWN';
    if (directionOftravel.buttonClicked == 'ArrowLeft' && (directionOftravel.headDirection != 'RIGHT' || Score == 0)) directionOftravel.headDirection = 'LEFT';
    if (directionOftravel.buttonClicked == 'ArrowRight' && (directionOftravel.headDirection != 'LEFT' || Score == 0)) directionOftravel.headDirection = 'RIGHT';
    if (GAMEOVER == 0) {
        if (directionOftravel.headDirection == "UP"){ MovingToUP () == 'Breack' && GAMEOVER++ }
        if (directionOftravel.headDirection == "DOWN"){ MovingToDown () == 'Breack' && GAMEOVER++ }
        if (directionOftravel.headDirection == "LEFT"){ MovingToLeft () == 'Breack' && GAMEOVER++ }
        if (directionOftravel.headDirection == "RIGHT"){ MovingToRight () == 'Breack' && GAMEOVER++ }
        DrawCall();
        setTimeout(STARTGAME, 100);
    }else{
        document.querySelector('.gameOverScreen').style.display = 'block';
        document.querySelector('.GameOverScore').textContent = `Ваш счёт: ${Score}`;
    }
}
RandomGenerated('head');
RandomGenerated('food');
STARTGAME();