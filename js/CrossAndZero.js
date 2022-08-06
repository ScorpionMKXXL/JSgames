let CrossAndZero = {
    data(){
        return {
            Field : [],
            html: '',
            BlockHTML : {
                none: '<div class="gameBlock"></div>',
                Cross: '<div class="gameBlock INgameBlock_Cross"></div>',
                Zero: '<div class="gameBlock INgameBlock_Zero"></div>',
            },
            settings: {
                gamemode : 'none',
                inputDisabled : false,
                play : false,
                Playing : '#',
                keyClick : 10
            },
            score : {
                P1 : 0,
                P2 : 0,
                color : '#000'
            },
            border : {
                view   : false,
                top    : 'calc((var(--FieldSize) * -0.5) + 50% - 25px)',
                left   : 'calc(50% - 5px)',
                rotate : 'rotate(0)'
            }
        }
    },
    methods: {
        generateField: function() {             //Создание поля
            for(let Y = 0; Y < 3; Y++) {
                this.Field.push([]);
                for(let X = 0; X < 3; X++) {
                    this.Field[Y].push(0);
                }
            }
        },
        drawCall () {                           //Отрисовка поля в HTML
            let CODE = ''
            for(let Y = 0; Y < 3; Y++) {
                for(let X = 0; X < 3; X++) {
                    if (this.Field[Y][X] == 0) CODE += this.BlockHTML.none
                    if (this.Field[Y][X] == 1) CODE += this.BlockHTML.Cross
                    if (this.Field[Y][X] == 2) CODE += this.BlockHTML.Zero
                }
            }
            this.html = CODE
        },
        clickToAddObj(N) {      // Функция создания элемента на поле
            let P = this.settings.Playing;
            let Analog = {
                7 : [[0],[0]],
                8 : [[0],[1]],
                9 : [[0],[2]],
                4 : [[1],[0]],
                5 : [[1],[1]],
                6 : [[1],[2]],
                1 : [[2],[0]],
                2 : [[2],[1]],
                3 : [[2],[2]]
            }
            if (this.Field[Analog[N][0]][Analog[N][1]] == 0) {
                this.Field[Analog[N][0]][Analog[N][1]] = P
                switch(Number(this.settings.gamemode)) {
                    case 2: this.playing1vs1();
                }
            }
        },
        searchLine() {      // Функция поиска линии пересечения
            
            let FieldOb = this.Field;
            for(let Y = 0; Y < 3; Y++){ /* Поиск по горизонтали */
                if((FieldOb[Y][0] == FieldOb[Y][1]) && (FieldOb[Y][0] == FieldOb[Y][2]) && FieldOb[Y][0] != 0) {
                    return ['X', Y, FieldOb[Y][0]];
                }
            }
            for(let X = 0; X < 3; X++){/* Поиск по вертикали */
                if((FieldOb[0][X] == FieldOb[1][X]) && (FieldOb[0][X] == FieldOb[2][X]) && FieldOb[0][X] != 0) {
                    return ['Y', X, FieldOb[0][X]];
                }
            }                           /* Поиск по диагонали */
            if ((FieldOb[0][0] == FieldOb[1][1]) && (FieldOb[0][0] == FieldOb[2][2]) && FieldOb[0][0] != 0) {
                return ['TLBR', 0, FieldOb[0][0]];
            }                           /* Поиск по диагонали */
            if ((FieldOb[0][2] == FieldOb[1][1]) && (FieldOb[0][2] == FieldOb[2][0]) && FieldOb[0][2] != 0) {
                return ['TRBL', 0, FieldOb[0][2]];
            }
            for(let Y = 0; Y < 3; Y++) {
                for(let X = 0; X < 3; X++){
                    if (FieldOb[Y][X] == 0) return ['No'];
                }
            }
            return ['Draw'];
        },
        setupGamemode() {       // Установки и запуск игры
            if (this.settings.gamemode != 'none') {
                this.settings.play = true;
                this.settings.inputDisabled = true;
                this.settings.Playing = 1;
                this.score.color = '#f00';
            }
        },
        playing1vs1() {         // Режим игры 1 на 1
            let Result = this.searchLine();
            this.borderView(Result);
            if (Result[2] == undefined) {
                if (this.settings.Playing == 1){
                    this.settings.Playing = 2;
                    this.score.color = '#00f';
                }else if (this.settings.Playing == 2){
                    this.settings.Playing = 1;
                    this.score.color = '#f00';
                }
            }else if(Result[2] == 1) {
                this.score.P1++;
            }else if(Result[2] == 2) {
                this.score.P2++;
            }
            if (Result[2] == 1 || Result[2] == 2 || Result[0] == 'Draw') {
                setTimeout(this.clearField, 1000);
            }
            console.log(Result)
        },
        borderView(POS) {       // Отображение зачёркивающей линии
            let positions = {
                Y0 : 'calc(50% - 5px - (var(--FieldSize) * 0.33))',
                Y1 : 'calc(50% - 5px)',
                Y2 : 'calc(50% - 5px + (var(--FieldSize) * 0.33))',
                YR : 'rotate(0deg)',
                X0 : 'calc((var(--FieldSize) * -0.82) + 50% - 25px)',
                X1 : 'calc((var(--FieldSize) * -0.5) + 50% - 25px)',
                X2 : 'calc((var(--FieldSize) * -0.16) + 50% - 25px)',
                XR : 'rotate(90deg)',
                TLBR : 'rotate(-45deg)',
                TRBL : 'rotate(45deg)'
            }
            if (POS[0] == 'Y' || POS[0] == 'X') {
                this.border.view = true;
                this.border.rotate = positions[`${POS[0]}R`];
            }
            if (POS[0] == 'Y') {
                this.border.left = positions[`Y${POS[1]}`];
                this.border.top = positions['X1'];
            }
            if (POS[0] == 'X') {
                this.border.top = positions[`X${POS[1]}`];
                this.border.left = positions['Y1'];
            }
            if (POS[0] == 'TLBR' || POS[0] == 'TRBL') {
                this.border.view = true;
                this.border.left = positions[`Y1`];
                this.border.top = positions[`X1`];

            }
            if (POS[0] == 'TLBR') { this.border.rotate = positions[`TLBR`] }
            if (POS[0] == 'TRBL') { this.border.rotate = positions[`TRBL`] }
        },
        clearField() {      // Очистка Поня
            for(let Y = 0; Y < 3; Y++) {
                for(let X = 0; X < 3; X++) {
                    this.Field[Y][X] = 0;
                }
            }
            this.border.view = false;
            this.drawCall();
        }
    },
    mounted () {    // Выполнение после создания Vue
        var ObjData = this;
        this.generateField();
        this.drawCall();
        this.settings.keyClick,
        document.addEventListener('keydown', function (e) {
            e = e.key
            if (e > 0 && e < 10 && (ObjData.settings.Playing == 1 || ObjData.settings.Playing == 2)) {
                ObjData.settings.keyClick = Number(e)
                ObjData.clickToAddObj(ObjData.settings.keyClick);
                ObjData.drawCall();
            }
        })
        
    }
}



Vue.createApp(CrossAndZero).mount('.wrapperGame') // Подключение Vue*