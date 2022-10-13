class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x:0, y:0 } }){ //{ }有學習點 意思應該為沒加{}不能pass跳過任一項屬性，加上{}代表這兩屬性不是"必需"的，且順序不在重要
        this.position = position //位
        this.height = 150
        this.width = 50

        this.image = new Image()
        this.image.src = imageSrc

        //shop
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0 //煙變慢
        this.framesHold = 5   //數字越大越慢 越小越快

        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width) / this.framesMax,
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )

    }

    animateFrames(){
        this.framesElapsed++                              //煙變慢
        if (this.framesElapsed % this.framesHold === 0) { //煙變慢
            if (this.framesCurrent < this.framesMax - 1) { //-1是為了修復背景閃爍
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }


    update() {     //更新的屬性開始移動時這方法
        this.draw()
        this.animateFrames()
    }
}



//////////////////////////////////////
class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red ',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x:0, y:0},
        Sprites,
        attackBox = {offset: {}, width: undefined, height: undefined }
    }) { //{ }有學習點 意思應該為沒加{}不能pass跳過任一項屬性，加上{}代表這兩屬性不是"必需"的，且順序不在重要
            

        super({
            position,                                     //腳色圖片
            imageSrc,
            scale,
            framesMax,
            offset
        })



        this.velocity = velocity //速度
        this.height = 150        //角色高度

        //emeny
        this.lastKey
        //attackBox
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0 //煙變慢
        this.framesHold = 5

        this.Sprites = Sprites

        this.dead = false //死亡後 阻止動畫繼續 

        for (const Sprite in this.Sprites){
            Sprites[Sprite].image = new Image()
            Sprites[Sprite].image.src = Sprites[Sprite].imageSrc
        }
    }
    update() {     //更新的屬性開始移動時這方法
        this.draw()
        if(!this.dead)

        this.animateFrames()

        //attackBox 
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //draw the attack box
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        //加上加速度的y
        this.position.y += this.velocity.y   //this.position.y = this.position.y + 10 ，我們循環的每一偵+10像素 須確保在動畫循環中調用update()
        //加上加速度的x
        this.position.x += this.velocity.x

        //重力方法
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96){ //角色的腳撞到視窗底部 canvas.height是畫布的高度576; -200是讓腳色高一點在圖片上
            this.velocity.y = 0                                                     //讓加速度為0 防止他掉出畫布
            this.position.y = 330
        }else {
            this.velocity.y += gravity                  //重力讓角色掉下來能碰到底，為了解決重力後會一直向下掉 我們不想每一偵都調用它，不然就會往下掉出畫布

            console.log(this.position.y)
        }

    }

    arrack() {
        this.switchSprire('Attack1')
        this.isAttacking = true

    }

    takeHit(){                                              
        this.health -= 20

        if(this.health <=0){
            this.switchSprire('death')
        }else this.switchSprire('takeHit')
    }


    switchSprire(Sprite){
        if(this.image === this.Sprites.death.image) {
            if(this.framesCurrent === this.Sprites.death.framesMax -1)
            this.dead = true
            return} 


        if(this.image === this.Sprites.Attack1.image &&
           this.framesCurrent < this.Sprites.Attack1.framesMax -1)return

        //override when fighter gets hit
        if(this.image === this.Sprites.takeHit.image && this.framesCurrent < this.Sprites.takeHit.framesMax-1)
            return
        

        switch(Sprite){
            //overriding all other animation with the attack animation
            case 'idle':
                if(this.image !== this.Sprites.idle.image){
                    this.image = this.Sprites.idle.image                    //沒按鍵為閒置
                    this.framesMax = this.Sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if(this.image !== this.Sprites.run.image){
                    this.image = this.Sprites.run.image
                    this.framesMax = this.Sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.Sprites.jump.image){
                this.image = this.Sprites.jump.image
                this.framesMax = this.Sprites.jump.framesMax
                this.framesCurrent = 0
            }
                break
            case 'fall':
                if (this.image !== this.Sprites.fall.image){
                this.image = this.Sprites.fall.image
                this.framesMax = this.Sprites.fall.framesMax
                this.framesCurrent = 0
            }
                break
            case 'Attack1':
                    if (this.image !== this.Sprites.Attack1.image){
                    this.image = this.Sprites.Attack1.image
                    this.framesMax = this.Sprites.Attack1.framesMax
                    this.framesCurrent = 0
                }
                    break
            case 'takeHit':
                    if (this.image !== this.Sprites.takeHit.image){
                    this.image = this.Sprites.takeHit.image
                    this.framesMax = this.Sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                    break
            case 'death':
                    if (this.image !== this.Sprites.death.image){
                        this.image = this.Sprites.death.image
                        this.framesMax = this.Sprites.death.framesMax
                        this.framesCurrent = 0
                }
                    break


        }
    }

}
