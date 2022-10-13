const canvas = document.querySelector('canvas');   //已填充矩形
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) //座標0,0開始繪製,矩形寬度

const gravity = 0.7 //重力

const background = new Sprite({     //背景
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})


const shop = new Sprite({     //背景
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop_anim.png',
    scale: 2.75,
    framesMax: 6 //6張
})




const player = new Fighter({ //對象
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Idle.png',
    framesMax: 8,     //8張
    scale: 2.5,
    offset: {        //因圖片關係做偏移
        x: 215,
        y: 160
    },
    Sprites: {
        idle: {
            imageSrc: './img/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Fall.png',
            framesMax: 2
        },
        Attack1: {
            imageSrc: './img/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,                          //將攻擊框起始位子往前
            y: 50
        },
        width: 160,                          //攻擊框的寬度
        height: 50
    }

})
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },

    imageSrc: './img/Martial Hero 2/Idle.png',
    framesMax: 4,     //4張
    scale: 2.5,
    offset: {        //因圖片關係做偏移
        x: 215,
        y: 167
    },
    Sprites: {
        idle: {
            imageSrc: './img/Martial Hero 2/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/Martial Hero 2/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Martial Hero 2/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Martial Hero 2/Fall.png',
            framesMax: 2
        },
        Attack1: {
            imageSrc: './img/Martial Hero 2/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/Martial Hero 2/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Martial Hero 2/death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,                          //將攻擊框起始位子往前
            y: 50
        },
        width: 160,                          //攻擊框的寬度
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }

}

console.log(player);



decreaseTimer()



function animate() {     //做動畫 
    window.requestAnimationFrame(animate)   //請求動畫偵數循環
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height) //下面Update()行為 會更新但不會清除上一個位子的地方，加上clearRect()
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'        //淡化背景
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()  //確保動畫循環中每一偵都調用
    enemy.update()

    //player movement
    player.velocity.x = 0                                      //確保每次按完後會



    if (keys.a.pressed && player.lastKey === 'a') {            //要動畫每一偵去做改變 所以要放在裡面
        player.velocity.x = -5
        player.switchSprire('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprire('run')
    } else {
        player.switchSprire('idle')
    }

    //jummp
    if (player.velocity.y < 0) {
        player.switchSprire('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprire('fall')
    }

    //enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {            //要動畫每一偵去做改變 所以要放在裡面
        enemy.velocity.x = -5
        enemy.switchSprire('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprire('run')
    } else {
        enemy.switchSprire('idle')
    }
    //enemy 
    if (enemy.velocity.y < 0) {
        enemy.switchSprire('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprire('fall')
    }

    //detect for collrsic &   被打Hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&

        player.isAttacking && player.framesCurrent === 4) {                 // ===4 攻擊圖片到第四偵時 要觸發傷害
        enemy.takeHit()                                                     //
        player.isAttacking = false;
        //console.log('Player attack successful')


        document.querySelector('#RealenemyHealth').style.width = enemy.health + "%"
        

    }

    //if player miss
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }
    //if enemy miss
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //this is where our player gets git
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && player.framesCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false;
        console.log('enemy attack successful')

        document.querySelector('#RealPlayerHealth').style.width = player.health + "%"


    }
    //end 提早結束判斷
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }


}


animate()


//---第三節---//
window.addEventListener('keydown', (event) => {

    if (!player.dead) {



        switch (event.key) {
            case 'a':
                keys.a.pressed = true   //
                player.lastKey = 'a'
                break;
            case 'd':
                keys.d.pressed = true   //
                player.lastKey = 'd'
                break;

            case 'w':
                player.velocity.y = -20
                break;

            case ' ':
                player.arrack()
                break;

        }
    }
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true   //
                enemy.lastKey = 'ArrowLeft'
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true   //

                enemy.lastKey = 'ArrowRight'
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20
                break;
            case 'ArrowDown':
                enemy.arrack()
                break;
        }
    }

})


window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false //
            break;
        case 'd':
            keys.d.pressed = false//
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false //
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false//
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false//
            break;
    }
})


