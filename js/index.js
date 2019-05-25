const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')

const FPS = 60

let keyMap = {}

// Sprites
let player1
let player2
let ball
let text
let border

names = [
  'govind',
  'vincent'
]


let name

class Ball {
  constructor (name, reset) {
    this.width = 80
    this.height = 80

    this.img = new Image()
    this.img.src = `assets/${name}/image.png`

    this.x = (Math.random() * (0.33 * canvas.width)) + (0.33 * canvas.width)
    this.y = (Math.random() * (0.33 * canvas.height)) + (0.33 * canvas.height)
    this.velX = 5
    this.velY = 5

    if (Math.random() < 0.50) this.velX *= -1
    if (Math.random() < 0.50) this.velY *= -1

    this.reset = reset
  }


  draw () {
    ctx.drawImage(this.img, this.x, this.y, 100, 100)

    this.x += this.velX
    this.y += this.velY

    this.checkRebound(player1, player2)
  }

  playEffect () {
    const index = ~~(Math.random() * 3) + 1

    const audio = new Audio(`assets/govind/effect${index}.mp3`)
    audio.play()
  }

  checkRebound (p1, p2) {
    const xLeft = this.x
    const xRight = this.x + this.width
    const yTop = this.y
    const yBottom = this.y + this.height
    const yMid = this.y + (this.height / 2)

    if (yTop <= 0 || yBottom>= canvas.height) this.velY *= -1
    else if (xLeft <= (p1.x + p1.width) && yMid >= p1.y && yMid <= (p1.y + p1.height)) {
      this.velX *= -1
      this.velX *= 1.30
      this.velY *= 1.30
    } else if (xRight >= p2.x && yMid >= p2.y && yMid <= (p2.y + p2.height)) {
      this.velX *= -1
      this.velX *= 1.30
      this.velY *= 1.30
    } else if (xLeft <= 0) {
      p2.score++

      border.trigger(0.5 * FPS)
      this.playEffect()
      this.reset()
    } else if (xRight >= canvas.width) {
      p1.score++

      border.trigger(0.5 * FPS)
      this.playEffect()
      this.reset()
    }
  }
}

class Player {
  constructor (x, y) {
    this.x = x
    this.y = y

    this.width = 10
    this.height = 160

    this.score = 0
  }

  draw () {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  up () {
    if (this.y - 5 < 0) return
    this.y -= 5
  }

  down () {
    if (this.y + 5 + this.height > canvas.height) return
    this.y += 5
  }
}

class Text {
  constructor () {
    this.scrambleFrames = 0
  }

  scramble (len) {
    const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ$&'
    let res = ''

    for (let i = 0; i < len; i++) {
      res += ALPHA[~~(Math.random() * ALPHA.length)]
    }

    return res
  }

  setName (name) {
    this.title = name.substring(0, 1).toUpperCase() + 'ONG'
    this.subtitle = `(${name} but it's pong)`
    this.scrambleFrames = FPS * 0.5
  }

  draw () {
    let title = this.title
    let subtitle = this.subtitle
    let scoreColor = 'grey'

    if (this.scrambleFrames) {
      title = this.scramble(title.length)
      subtitle = this.scramble(subtitle.length)
      scoreColor = '#CCCCCC'

      this.scrambleFrames--
    }

    ctx.font = '84px Inconsolata'
    ctx.fillText(title, canvas.width / 2, 120)

    ctx.font = '24px Inconsolata'
    ctx.fillStyle = 'grey'
    ctx.fillText(subtitle, canvas.width / 2, 180)

    ctx.font = '72px Inconsolata'
    ctx.fillStyle = scoreColor
    ctx.fillText(player1.score, canvas.width * 0.33, canvas.height / 2)
    ctx.fillText(player2.score, canvas.width * 0.66, canvas.height / 2)
  }
}

class Border {
  constructor () {
    this.size = 5
    this.triggerFrames = 0
    this.triggerColor = '#835eff'
    this.color = '#666666'
  }

  trigger (time) {
    this.triggerFrames = time
  }

  draw () {
    let size = this.size
    let color = this.color

    if (this.triggerFrames != 0) {
      color = this.triggerColor
      this.triggerFrames--;
    }

    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.strokeRect(size / 2, size / 2, canvas.width - size, canvas.height - size)
  }
}

setInterval(() => {
  if (keyMap['KeyW']) player1.up()
  else if (keyMap['KeyS']) player1.down()

  if (keyMap['ArrowUp']) player2.up()
  else if (keyMap['ArrowDown']) player2.down()
}, 1000 / (FPS * 4))

function main () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  border.draw()
  text.draw()
  ball.draw()
  player1.draw()
  player2.draw()
}

function reset () {
  name = names[~~(Math.random() * names.length)]
  ball = new Ball(name, reset)
  text.setName(name)
}

function setup () {
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false)

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()

  border = new Border()
  text = new Text()
  player1 = new Player(30, canvas.height / 2)
  player2 = new Player(canvas.width - 40, canvas.height / 2)
  reset()

  ctx.textAlign = 'center'
}

document.body.onkeydown = (e) => {
  keyMap[e.code] = e.type == 'keydown'
}

document.body.onkeyup = (e) => {
  keyMap[e.code] = e.type == 'keydown'
}



setup()



setInterval(main, 1000 / FPS)