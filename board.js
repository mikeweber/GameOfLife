window.GameOfLifeGrid = (function() {
  var klass = function GameOfLifeGrid(game, canvas, cell_length) {
    this.game          = game
    this.cell_length   = cell_length
    this.determineWidthAndHeight()
    this.canvas        = canvas
    this.ctx           = this.canvas.getContext('2d')
    this.setCanvasWidthAndHeight()
    this.observeClicks()
    this.running       = false
  }

  klass.prototype.run = function() {
    this.running = true
    this.animate()
  }

  klass.prototype.animate = function() {
    this.last_run = new Date()
    var self = this

    function render() {
      var now = new Date()

      if (now - self.last_run >= 100) {
        self.game.step()
        self.render()
        self.last_run = now
      }

      if (self.running) window.requestAnimationFrame(render)
    }

    window.requestAnimationFrame(render)
  }

  klass.prototype.observeClicks = function() {
    var self = this

    this.canvas.addEventListener('click', function(event) {
      if (self.running) return
      var x = event.pageX - self.canvas.offsetLeft,
          y = event.pageY - self.canvas.offsetTop
      self.game.toggleAlive(Math.floor(x / self.cell_length), Math.floor(y / self.cell_length))
      self.render()
    })
  }

  klass.prototype.determineWidthAndHeight = function() {
    if (this.game) {
      this.width  = this.cell_length * this.game.width
      this.height = this.cell_length * this.game.height
    } else {
      this.width  = this.cell_length * 10
      this.height = this.cell_length * 10
    }
  }

  klass.prototype.setCanvasWidthAndHeight = function() {
    this.canvas.width        = this.width
    this.canvas.style.width  = this.width + 'px'
    this.canvas.height       = this.height
    this.canvas.style.height = this.height + 'px'
  }

  klass.prototype.render = function() {
    this.clear()
    this.drawGrid()
    this.drawAliveCells()
  }

  klass.prototype.clear = function() {
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  klass.prototype.drawGrid = function() {
    this.ctx.strokeStyle = '#000000'
    this.ctx.lineWidth = 1

    var curx = 0
    while (curx <= this.width) {
      this.ctx.beginPath()
      this.ctx.moveTo(curx, 0)
      this.ctx.lineTo(curx, this.height)
      this.ctx.stroke()
      curx = curx + this.cell_length
    }

    var cury = 0
    while (cury <= this.height) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, cury)
      this.ctx.lineTo(this.height, cury)
      this.ctx.stroke()
      cury = cury + this.cell_length
    }
  }

  klass.prototype.drawAliveCells = function() {
    var alive_cells = this.getAliveCells()
    for (var i = 0; i < alive_cells.length; i++) {
      this.fillInCellAt(alive_cells[i])
    }
  }

  klass.prototype.getAliveCells = function() {
    return game.getAliveCells()
  }

  klass.prototype.fillInCellAt = function(coord) {
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(coord[0] * this.cell_length, coord[1] * this.cell_length, this.cell_length, this.cell_length)
  }

  return klass
})()

