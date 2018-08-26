/*
 * soloTestClass.js file
 */

class gameClass {
  constructor(canvasElem) {
    this.greenSpace = gameClass.greenSpace;
    this.clickState = false;
    this.sPeg = {x: -1, y: -1};
    this.moveCount = 0;
    this.ctx = canvasElem.getContext("2d");

    // Functions
    const makeCalcHolesX = (greenSpace) =>
      (x, y) => ((y < 2) || (y > 4)) ? greenSpace + ((x+2) * 90) :
                                       greenSpace + (x * 90);
    this.coordinateCalcHolesX = makeCalcHolesX(this.greenSpace);

    const makeCalcHolesY = (greenSpace) =>
      (x, y) => greenSpace + (y * 90);
    this.coordinateCalcHolesY = makeCalcHolesY(this.greenSpace);
  }

  // Empty space
  static get greenSpace() {
    return 80;
  }

  drawCanvas() {
    // Main circle
    this.ctx.beginPath();
    this.ctx.arc(350, 350, 350, 0, 2 * Math.PI);
    this.ctx.fillStyle = "green";
    this.ctx.fill();

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(350, 350, 335, 0, 2 * Math.PI);
    this.ctx.clip();

    // Corners
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = "1";
    this.ctx.rect(10, 10, 220, 220);
    this.ctx.rect(5, 5, 220, 220);

    this.ctx.rect(10, 470, 220, 220);
    this.ctx.rect(5, 475, 220, 220);

    this.ctx.rect(470, 10, 220, 220);
    this.ctx.rect(475, 5, 220, 220);

    this.ctx.rect(470, 470, 220, 220);
    this.ctx.rect(475, 475, 220, 220);
    this.ctx.stroke();
    this.ctx.restore();

    // Holes
    let k = 3;
    for (let j = 0; j < 7; j++) {
      if ((j > 1) && (j < 5)) k = 7;
      else k = 3;
      for (var i = 0; i < k; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.coordinateCalcHolesX(i,j),
                     this.coordinateCalcHolesY(i,j), 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
      }
    }

    // Text
    this.ctx.save();
    this.ctx.translate(350, 350);
    this.ctx.font = "60px Arial";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = "1";
    this.ctx.rotate(Math.PI / 4);
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowColor = "rgba(0,0,0,0.3)";
    this.ctx.shadowBlur = 4;
    for (i = 0; i < 2; i++) {
      this.ctx.strokeText("Solo", -320, 20);
      this.ctx.rotate(Math.PI / 2);
    }
    for (i = 0; i < 2; i++) {
      this.ctx.strokeText("Test", -320, 20);
      this.ctx.rotate(Math.PI / 2);
    }
    this.ctx.restore();
  }

  paintHoles(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(this.coordinateCalcHolesX(x,y),
                 this.coordinateCalcHolesY(x,y), 15, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#1C1C1C";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.coordinateCalcHolesX(x,y),
                 this.coordinateCalcHolesY(x,y), 8, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#151515";
    this.ctx.fill();
  }

  newGame(std) {
    let testState = new Array(7);
    for (var i = 0; i < 7; i++)
      testState[i] = ((i > 1) & (i < 5)) ? new Array(7).fill(0) :
                                           new Array(3).fill(0);
    this.testState = testState;

    if (std === true) this.testState[3][3] = 1;
    else {
      let rand = Math.ceil(Math.random() * 33);
      for (var i = 0; i < 7; i++) {
        if (this.testState[i].length < rand)
          rand -= this.testState[i].length;
        else {
          this.testState[i][rand-1] = 1;
          break;
        }
      }
    }

    // Paint filled holes
    let k = 3;
    for (let j = 0; j < 7; j++) {
      if ((j > 1) && (j < 5)) k = 7;
      else k = 3;
      for (var i = 0; i < k; i++) {
        if (this.testState[j][i] === 1) continue;
        this.paintHoles(i,j);
      }
    }
  }

  // The clearFlag must be set if the peg is unselected
  selectPeg(x, y, clearFlag = false) {
    if (this.testState[y][x] === 1)
      return false;

    if (clearFlag === false) {
      this.ctx.beginPath();
      this.ctx.arc(this.coordinateCalcHolesX(x,y),
                   this.coordinateCalcHolesY(x,y), 16, 0, 2 * Math.PI);
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = "orange";
      this.ctx.stroke();
      this.sPeg = {x: x, y: y};
    } else if (clearFlag === true) {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(this.coordinateCalcHolesX(x,y) - 20,
                        this.coordinateCalcHolesY(x,y) - 20, 40, 40);
      this.sPeg = {x: -1, y: -1};
    }

    return true;
  }

  deletePeg(x, y) {
    if ((this.sPeg.x === x) && (this.sPeg.y === y)) this.selectPeg(x, y, true);
    this.testState[y][x] = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.coordinateCalcHolesX(x,y),
                 this.coordinateCalcHolesY(x,y), 15, 0, 2 * Math.PI);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  addPeg(x, y) {
    this.paintHoles(x,y);
    this.testState[y][x] = 0;
  }

  jump2right(x, y) {
    if (!this.testState[this.sPeg.y][this.sPeg.x+1]) {
      if ((this.sPeg.x+2 === x) && (this.sPeg.y === y)) {
        this.deletePeg(this.sPeg.x+1, this.sPeg.y);
        this.deletePeg(this.sPeg.x, this.sPeg.y);
        this.addPeg(x,y);
        return true;
      }
    }
    return false;
  }

  jump2left(x, y) {
    if (!this.testState[this.sPeg.y][this.sPeg.x-1]) {
      if ((this.sPeg.x-2 === x) && (this.sPeg.y === y)) {
        this.deletePeg(this.sPeg.x-1, this.sPeg.y);
        this.deletePeg(this.sPeg.x, this.sPeg.y);
        this.addPeg(x,y);
        return true;
      }
    }
    return false;
  }

  jumpDown(x, y) {
    if ((this.sPeg.y === 1) || (this.sPeg.y === 5)) {
      if (!this.testState[this.sPeg.y+1][this.sPeg.x+2]) {
        if ((this.sPeg.x+2 === x) && (this.sPeg.y+2 === y)) {
          this.deletePeg(this.sPeg.x+2, this.sPeg.y+1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    } else if (this.sPeg.y === 0) {
      if (!this.testState[1][this.sPeg.x]) {
        if ((this.sPeg.x+2 === x) && (2 === y)) {
          this.deletePeg(this.sPeg.x, 1);
          this.deletePeg(this.sPeg.x, 0);
          this.addPeg(x,y);
          return true;
        }
      }
    } else if ((y === 1) || (y === 5)) {
      if (this.testState[this.sPeg.y+1][this.sPeg.x] === 0) {
        if ((this.sPeg.x-2 === x) && (this.sPeg.y+2 === y)) {
          this.deletePeg(this.sPeg.x, this.sPeg.y+1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    } else if (y === 6) {
      if (!this.testState[this.sPeg.y+1][this.sPeg.x-2]) {
        if ((this.sPeg.x-2 === x) && (this.sPeg.y+2 === 6)) {
          this.deletePeg(this.sPeg.x-2, this.sPeg.y+1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    } else {
      if (!this.testState[this.sPeg.y+1][this.sPeg.x]) {
        if ((this.sPeg.x === x) && (this.sPeg.y+2 === y)) {
          this.deletePeg(this.sPeg.x, this.sPeg.y+1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    }
    return false;
  }

  jumpUp(x, y) {
    if ((this.sPeg.y === 1) || (this.sPeg.y === 5)) {
      if (this.testState[this.sPeg.y-1][this.sPeg.x+2] === 0) {
        if ((this.sPeg.x+2 === x) && (this.sPeg.y-2 === y)) {
          this.deletePeg(this.sPeg.x+2, this.sPeg.y-1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    } else if (this.sPeg.y === 6) {
      if (!this.testState[5][this.sPeg.x]) {
        if ((this.sPeg.x+2 === x) && (4 === y)) {
          this.deletePeg(this.sPeg.x, 5);
          this.deletePeg(this.sPeg.x, 6);
          this.addPeg(x,y);
          return true;
        }
      }
    } else if ((y === 1) || (y === 5)) {
      if (!this.testState[this.sPeg.y-1][this.sPeg.x]) {
        if ((this.sPeg.x-2 === x) && (this.sPeg.y-2 === y)) {
          this.deletePeg(this.sPeg.x, this.sPeg.y-1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    } else if (y === 0) {
      if (!this.testState[this.sPeg.y-1][this.sPeg.x-2]) {
        if ((this.sPeg.x-2 === x) && (this.sPeg.y-2 === 0)) {
          this.deletePeg(this.sPeg.x-2, this.sPeg.y-1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    } else {
      if (this.testState[this.sPeg.y-1][this.sPeg.x] === 0) {
        if ((this.sPeg.x === x) && (this.sPeg.y-2 === y)) {
          this.deletePeg(this.sPeg.x, this.sPeg.y-1);
          this.deletePeg(this.sPeg.x, this.sPeg.y);
          this.addPeg(x,y);
          return true;
        }
      }
    }
    return false;
  }

  // Wrapper for all move functions
  move(x, y) {
    let ret = false;
    if (this.sPeg.y < y) ret = this.jumpDown(x,y);
    else if (this.sPeg.y > y) ret = this.jumpUp(x,y);
    else if ((this.sPeg.y === y) && (this.sPeg.x < x))
      ret = this.jump2right(x,y);
    else if ((this.sPeg.y === y) && (this.sPeg.x > x))
      ret = this.jump2left(x,y);
    else return false;
    if (ret) {
      this.moveCount++;
      return true;
    }
    return false;
  }

  isEmpty(x, y) {
    return (this.testState[y][x] === 1);
  }
}

class soloTestClass extends gameClass {
  constructor(canvas) {
    super(canvas);
    this.pegSelected = false;
    this.canvas = canvas;
    this.pegCount = 0;
    this.moveCount = 0;

    // Functions
    this.countFilledHoles = (gameMat) =>
      gameMat.reduce(
        (count, e) =>
        count += e.filter(i => i === 0).length, 0
      );

    const px2Peg = (px) => Math.round((px-this.greenSpace) / 90);
    this.findClosestPeg = (x,y) => {
        let xNum = px2Peg(x);
        let yNum = px2Peg(y);
        return [xNum -= (yNum < 2) || (yNum > 4) ? 2 : 0, yNum];
    }
  }

  deselectCurrentPeg() {
    let x = this.sPeg.x;
    let y = this.sPeg.y;
    this.selectPeg(this.sPeg.x,this.sPeg.y,true);
    this.addPeg(x, y);
  }

  clickHandler(event) {
    let y = event.pageY;
    let x = event.pageX;
    [x, y] = this.findClosestPeg(x,y);

    if (typeof this.testState[y][x] === "undefined")
      return;

    if (this.pegSelected) {
      // The user trying to make a move
      if (this.isEmpty(x,y)) {
        this.pegSelected = !this.move(x,y);
        this.checkIfGameFinished();
      }
      else if ((this.sPeg.x === x) && (this.sPeg.y === y)) {
        // If it is already selected
        this.deselectCurrentPeg();
        this.pegSelected = false;
      } else {
        // Select a new peg
        let tmpPeg = this.sPeg;
        this.deselectCurrentPeg();
        if (!this.selectPeg(x,y))
          this.selectPeg(tmpPeg.x,tmpPeg.y);
      }
    } else {
      // Select first time or after a successful move
      if (this.selectPeg(x,y)) {
        this.deselectCurrentPeg();
        this.selectPeg(x,y);
        this.pegSelected = true;
      }
    }
    this.drawScoreBoard();
  }

  checkIfGameFinished() {
    let finished = 1;
    const i_length = this.testState.length;
    for (let i = 0; i < i_length; i++) {
      for (let j = 0; j < this.testState[i].length; j++) {
        if (this.testState[i][j] === 1)
          continue;
        if ((this.testState[i][j-1] === 0) &&
          (this.testState[i][j-2] === 1))
          finished = 0;
        else if ((this.testState[i][j+1] === 0) &&
          (this.testState[i][j+2] === 1))
          finished = 0;
        else {
          if (i === 0) {
            if ((this.testState[i+1][j] === 0) &&
              (this.testState[i+2][j+2] === 1))
              finished = 0;
          } else if (i === 1) {
            if ((this.testState[i+1][j+2] === 0) &&
              (this.testState[i+2][j+2] === 1))
              finished = 0;
          } else if (i === 2) {
            if ((this.testState[i+1][j] === 0) &&
              (this.testState[i+2][j] === 1))
              finished = 0;
            else if ((this.testState[i-1][j-2] === 0) &&
              (this.testState[i-2][j-2] === 1))
              finished = 0;
          } else if (i === 3) {
            if ((this.testState[i+1][j] === 0) &&
              (this.testState[i+2][j-2] === 1))
              finished = 0;
            else if ((this.testState[i-1][j] === 0) &&
              (this.testState[i-2][j-2] === 1))
              finished = 0;
          } else if (i === 4) {
            if ((this.testState[i+1][j-2] === 0) &&
              (this.testState[i+2][j-2] === 1))
              finished = 0;
            else if ((this.testState[i-1][j] === 0) &&
              (this.testState[i-2][j] === 1))
              finished = 0;
          } else if (i === 5) {
            if ((this.testState[i-1][j+2] === 0) &&
              (this.testState[i-2][j+2] === 1))
              finished = 0;
          } else {
            if ((this.testState[i-1][j] === 0) &&
              (this.testState[i-2][j+2] === 1))
              finished = 0;
          }
        }
      }
      if (!finished) break;
    }
    if (finished) {
      $(this.canvas).off('click');
      this.drawScoreBoard();
      window.alert("Game over: "+this.countFilledHoles(this.testState)+
        " peg left");
    }
  }

  drawScoreBoard() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.clearRect(710, 120, 205, 105);

    this.ctx.font = "30px Times New Roman";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Score: ", 725, 160);
    this.ctx.fillText("Peg Count: ", 725, 200);
    this.ctx.font = "27px Arial Black";
    this.ctx.fillText(this.moveCount, 807, 160);
    this.ctx.fillText(this.pegCount-this.moveCount, 865, 200);
    this.ctx.restore();
  }

  startGame(centeredHole) {
    this.drawCanvas();
    this.newGame(centeredHole);
    this.pegCount = this.countFilledHoles(this.testState);
    this.drawScoreBoard();
    // Click handler
    $(this.canvas).off('click').click(this.clickHandler.bind(this));
  }
}

function drawOnConsole(nodeState) {
  console.clear();
  let tmpLine = [];
  const length_i = nodeState.length;
  for (let i = 0; i < length_i; i++) {
    const length_j = nodeState[i].length;
    tmpLine = "";
    if ((i < 2) || (i > 4))
      tmpLine += "    ";
    for (let j = 0; j < length_j; j++) {
      tmpLine += " " + nodeState[i][j];
    }
    console.log(tmpLine);
  }
}
