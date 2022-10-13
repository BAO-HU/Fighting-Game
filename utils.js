function rectangularCollision({ rectangle1, rectangle2 }) {

    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height

    )
}


function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#result').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#result').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#result').innerHTML = 'player1 Wins!'
    } else if (player.health < enemy.health) {
        document.querySelector('#result').innerHTML = 'player2 Wins!'
    }
}
/*TIMER */
let timer = 10
let timerId                         //用來做參數 判斷有一方血量為0 倒數時間會暫停
function decreaseTimer() {
    
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}