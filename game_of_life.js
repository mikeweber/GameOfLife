window.GameOfLife = (function() {
  var klass = function GameOfLife(width, height) {
    this.width         = width
    this.height        = height
    this.clear()
  }

  klass.prototype.clear = function() {
    this.current_board = this.buildBoard()
    this.next_board    = this.buildBoard()
  }

  klass.prototype.seed = function(seed) {
    for (var i = 0; i < seed.length; i++) {
      this.setAlive(seed[i][0], seed[i][1])
    }
    this.swapBoards()
  }

  klass.prototype.step = function() {
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        if (this.isAlive(i, j)) {
          this.canStayAlive(i, j) ? this.setAlive(i, j) : this.kill(i, j)
        } else {
          this.canComeToLife(i, j) ? this.setAlive(i, j) : this.kill(i, j)
        }
      }
    }
    this.swapBoards()
  }

  klass.prototype.canStayAlive = function(x, y) {
    var count = this.getAliveNeighborCount(x, y)
    return 1 < count && count < 4
  }

  klass.prototype.canComeToLife = function(x, y) {
    return this.getAliveNeighborCount(x, y) == 3
  }

  klass.prototype.getAliveNeighborCount = function(x, y) {
    var offsets = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]],
        alive_count = 0
    for (var i = 0; i < offsets.length; i++) {
      var nx = x + offsets[i][0],
          ny = y + offsets[i][1]
      if (this.inbounds(nx, ny) && this.isAlive(nx, ny)) alive_count++
    }

    return alive_count
  }

  klass.prototype.inbounds = function(x, y) {
    return 0 <= x && x < this.width && 0 <= y && y < this.height
  }

  klass.prototype.toggleAlive = function(x, y) {
    this.current_board[x][y] = !this.current_board[x][y]
  }

  klass.prototype.setAlive = function(x, y) {
    this.next_board[x][y] = true
  }

  klass.prototype.kill = function(x, y) {
    this.next_board[x][y] = false
  }

  klass.prototype.swapBoards = function() {
    var temp = this.current_board
    this.current_board = this.next_board
    this.next_board = temp
  }

  klass.prototype.buildBoard = function() {
    var board = []
    for (var i = 0; i < this.width; i++) {
      var arr = []
      for (var j = 0; j < this.height; j++) {
        arr.push(false)
      }
      board.push(arr)
    }

    return board
  }

  klass.prototype.getAliveCells = function() {
    var cell_locations = []
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        if (this.isAlive(i, j)) cell_locations.push([i, j])
      }
    }

    return cell_locations
  }

  klass.prototype.isAlive = function(x, y) {
    return !!this.current_board[x][y]
  }

  return klass
})()

