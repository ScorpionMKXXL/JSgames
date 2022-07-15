const wrapperGame = document.querySelector('.wrapperGame'); //Получение игрового поля
const playerSize = document.querySelector('.diceOnThePlayingField'); // Получение игрока
let wrapperGameHeight = parseInt(getComputedStyle(wrapperGame).getPropertyValue('height')); //Получение высоты игрового поля
let wrapperGameWidth = parseInt(getComputedStyle(wrapperGame).getPropertyValue('width')); //Получение ширины игрового поля
let playerSizePx = parseInt(getComputedStyle(playerSize).getPropertyValue('height')); //Получение размера игрока

/////////// Настройка игры ///////////

let speedGameFixedValue = 100;    //Скорость игры по умолчанию в ms
let startFoodGeneration = 0.1; // Количество еды на старте (1 = 100%, 0.5 = 50%)
let randomlySpawnedFoodWhileMoving = 0.05; // Вероятность появление новой еды
let randomlySpawnedFoodWhileMovingMax = 10; // Максимальное количество созданной еды
let levelsSpeed = 0; // Количество уровней скорости
let upLevelSpeed = 50; // На сколько ms увеличивать скорость в новом уровне
let scoreToUpLevel = 5; // Сколько очков нужно для нового уровня скорости

//////////////////////////////////////
let scoreUpObject = {
   scoreNextLevel: scoreToUpLevel,
   thisLevel: 0
}
let arrPlayingField = [];
let directionOftravel = '';
let scorePlayer = 0;    //Счёт игрока
let speedGame = speedGameFixedValue;
let amountOfFoodCreated = 0; // Количество созданной еды во всермя игры
let diceOnThePlayingField = `<div class="diceOnThePlayingField Field"></div>`;    //Объект поля
let diceOnThePlayingFieldFood = `<div class="diceOnThePlayingField Food"></div>`;   //Объект Еда
let diceOnThePlayingFieldPlayer = `<div class="diceOnThePlayingField Player"></div>`;  //Объект Игрок

for (let H = 0; H < (wrapperGameHeight / playerSizePx); H++) {        //Создание игрового поля в массив arrPlayingField
   arrPlayingField[H] = [];
   for (let W = 0; W < (wrapperGameWidth / playerSizePx); W++) { arrPlayingField[H][W] = 0; }
}

arrPlayingField[Math.round(wrapperGameHeight / playerSizePx / 2)][Math.round(wrapperGameWidth / playerSizePx / 2)] = 2; //Создание игрока
if (scoreUpObject.thisLevel < levelsSpeed) document.querySelector('.gameplaySidebar_levelSpeedUp').textContent = `До повышения скорости: ${scoreUpObject.scoreNextLevel}`;
if (scoreUpObject.thisLevel >= levelsSpeed) document.querySelector('.gameplaySidebar_levelSpeedUp').textContent = `Макс. скорость`;


/////////// Набор функций ///////////
function drawCall () {        //Функция на вызов отрисовки поля
   let  PLAYFIELD = ``;
   for (let H = 0; H < arrPlayingField.length; H++) {
      for (let W = 0; W < arrPlayingField[H].length; W++) {
         if (arrPlayingField[H][W] == 0) PLAYFIELD += diceOnThePlayingField;
         if (arrPlayingField[H][W] == 1) PLAYFIELD += diceOnThePlayingFieldFood;
         if (arrPlayingField[H][W] == 2) PLAYFIELD += diceOnThePlayingFieldPlayer;
      }
   }
   wrapperGame.innerHTML = PLAYFIELD;
}

function randomGenerateFood (number) {   //Создание новой еды
   let [newGeneratedPositionFood, i] = [[1, 1], 1];
   if (number != undefined) {i = number}
   while (i > 0) {
      newGeneratedPositionFood = [Math.floor(Math.random() * wrapperGameHeight / playerSizePx), Math.floor(Math.random() * wrapperGameWidth / playerSizePx)];
      if (!(arrPlayingField[newGeneratedPositionFood[0]][newGeneratedPositionFood[1]] == 2)
         && !(arrPlayingField[newGeneratedPositionFood[0]][newGeneratedPositionFood[1]] == 1)) {
            arrPlayingField[newGeneratedPositionFood[0]][newGeneratedPositionFood[1]] = 1;
            amountOfFoodCreated++;
            i--;
         }
   }
}

function playerSearch () {    //Поиск игрока на игровом поле
   let posX, posY;
   for (let H = 0; H < arrPlayingField.length; H++) {
      for (let W = 0; W < arrPlayingField[H].length; W++) {
         if (arrPlayingField[H][W] == 2) {
            posY = H;
            posX = W;
         }
      }
   }
   return {posY, posX};
}

function playerMovementUp () {                     //Функция перемещения игрока вверх
   let position = playerSearch();
   if (position.posY > 0 && arrPlayingField[position.posY - 1][position.posX] == 0) {
      arrPlayingField[position.posY][position.posX] = 0;
      arrPlayingField[position.posY - 1][position.posX] = 2;
   }else
      if (position.posY > 0 && arrPlayingField[position.posY - 1][position.posX] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[position.posY][position.posX] = 0;
         arrPlayingField[position.posY - 1][position.posX] = 2;
      }
   if (position.posY == 0 && arrPlayingField[arrPlayingField.length - 1][position.posX] == 0) {
      arrPlayingField[0][position.posX] = 0;
      arrPlayingField[arrPlayingField.length - 1][position.posX] = 2;
   }else
      if (position.posY == 0 && arrPlayingField[arrPlayingField.length - 1][position.posX] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[0][position.posX] = 0;
         arrPlayingField[arrPlayingField.length - 1][position.posX] = 2;
      }
}

function playerMovementDown () {                   //Функция перемещения игрока вниз
   let position = playerSearch();
   if (position.posY < (arrPlayingField.length - 1) && arrPlayingField[position.posY + 1][position.posX] == 0) {
      arrPlayingField[position.posY][position.posX] = 0;
      arrPlayingField[position.posY + 1][position.posX] = 2;
   }else
      if (position.posY < (arrPlayingField.length - 1) && arrPlayingField[position.posY + 1][position.posX] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[position.posY][position.posX] = 0;
         arrPlayingField[position.posY + 1][position.posX] = 2;
      }
   if (position.posY == (arrPlayingField.length - 1) && arrPlayingField[0][position.posX] == 0) {
      arrPlayingField[arrPlayingField.length - 1][position.posX] = 0;
      arrPlayingField[0][position.posX] = 2;
   }else
      if (position.posY == (arrPlayingField.length - 1) && arrPlayingField[0][position.posX] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[arrPlayingField.length - 1][position.posX] = 0;
         arrPlayingField[0][position.posX] = 2;
      }
}

function playerMovementLeft () {                     //Функция перемещения игрока влево
   let position = playerSearch();
   if (position.posX > 0 && arrPlayingField[position.posY][position.posX - 1] == 0) {
      arrPlayingField[position.posY][position.posX] = 0;
      arrPlayingField[position.posY][position.posX - 1] = 2;
   }else
      if (position.posX > 0 && arrPlayingField[position.posY][position.posX - 1] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[position.posY][position.posX] = 0;
         arrPlayingField[position.posY][position.posX - 1] = 2;
      }
   if (position.posX == 0 && arrPlayingField[position.posY][arrPlayingField[0].length - 1] == 0) {
      arrPlayingField[position.posY][0] = 0;
      arrPlayingField[position.posY][arrPlayingField[position.posY].length - 1] = 2;
   }else
      if (position.posX == 0 && arrPlayingField[position.posY][arrPlayingField[0].length - 1] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[position.posY][0] = 0;
         arrPlayingField[position.posY][arrPlayingField[position.posY].length - 1] = 2;
      }
}

function playerMovementRight () {                     //Функция перемещения игрока вправо
   let position = playerSearch();
   if (position.posX < (arrPlayingField[0].length - 1) && arrPlayingField[position.posY][position.posX + 1] == 0) {
      arrPlayingField[position.posY][position.posX] = 0;
      arrPlayingField[position.posY][position.posX + 1] = 2;
   }else
      if (position.posX < (arrPlayingField[0].length - 1) && arrPlayingField[position.posY][position.posX + 1] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[position.posY][position.posX] = 0;
         arrPlayingField[position.posY][position.posX + 1] = 2;
      }
   if (position.posX == (arrPlayingField[0].length - 1) && arrPlayingField[position.posY][0] == 0) {
         arrPlayingField[position.posY][position.posX] = 0;
         arrPlayingField[position.posY][0] = 2;
   }else
      if (position.posX == (arrPlayingField[0].length - 1) && arrPlayingField[position.posY][0] == 1) {
         gameplaySidebarLogic ();
         arrPlayingField[position.posY][position.posX] = 0;
         arrPlayingField[position.posY][0] = 2;
      }
}
function gameplaySidebarLogic () {     //Функция отрисовки боковой панели и генерации новой еды
   if (scoreUpObject.thisLevel >= levelsSpeed) {
      document.querySelector('.gameplaySidebar_levelSpeedUp').textContent = `Макс. скорость`;
   }else
      if (scoreUpObject.thisLevel < levelsSpeed && scoreUpObject.scoreNextLevel > 1) {
         scoreUpObject.scoreNextLevel--;
         document.querySelector('.gameplaySidebar_levelSpeedUp').textContent = `До повышения скорости: ${scoreUpObject.scoreNextLevel}`;
   }else
      if (scoreUpObject.thisLevel < levelsSpeed && scoreUpObject.scoreNextLevel < 2) {
         scoreUpObject.scoreNextLevel = scoreToUpLevel;
         scoreUpObject.thisLevel++;
         speedGame -= upLevelSpeed;
         if (scoreUpObject.thisLevel < levelsSpeed)
            {document.querySelector('.gameplaySidebar_levelSpeedUp').textContent = `До повышения скорости: ${scoreUpObject.scoreNextLevel}`;}else
         {document.querySelector('.gameplaySidebar_levelSpeedUp').textContent = `Макс. скорость`;}
   }
   scorePlayer++;
      // Вероятность регенерации новой еды
   if (Math.random() < randomlySpawnedFoodWhileMoving) {
      randomGenerateFood(Math.floor(Math.random() * randomlySpawnedFoodWhileMovingMax));
   }
}

randomGenerateFood (Math.floor((arrPlayingField.length * arrPlayingField[0].length - 1) * startFoodGeneration));

function playerMovement () {     //Функция перемещения игрока и логика игры
   
   document.addEventListener('keydown', function(event){
      if (event.key == 'ArrowUp' || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight") 
            {directionOftravel = event;}
   }, false);

   if (directionOftravel.key == "ArrowUp"){ playerMovementUp (); }
   if (directionOftravel.key == "ArrowDown"){ playerMovementDown (); }
   if (directionOftravel.key == "ArrowLeft"){ playerMovementLeft (); }
   if (directionOftravel.key == "ArrowRight"){ playerMovementRight (); }

   document.querySelector('.gameplaySidebar_counter').textContent = `Счёт: ${scorePlayer}`;
   document.querySelector('.gameplaySidebar_speed').textContent = `Скорость: ${Math.round((1000 / speedGame)*10)/10}`;
   drawCall ();
   if (amountOfFoodCreated > scorePlayer) {
      setTimeout(playerMovement, speedGame);
   }else {
      document.querySelector('.gameoverScreen').style.display = 'flex';
      document.querySelector('.GameOverScore').textContent = scorePlayer;
   }
}
/////////////////////////////////////
playerMovement ();