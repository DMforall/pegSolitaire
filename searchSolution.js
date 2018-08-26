/*
 * searchSolution.js file
 */

self.addEventListener('message', function(e) {
  let solution = new searchSolution(JSON.parse(e.data));
  let bestSolution = solution.treeSearch();
  self.postMessage(bestSolution);
});

class searchSolution {
  constructor(soloTestObj) {
    this.testObj = soloTestObj;
  }

  findHoles(state) {
    let holes = [];
    const length_i = state.length;
    for (let i = 0; i < length_i; i++) {
      const length_j = state[i].length;
      for (let j = 0; j < length_j; j++)
        state[i][j] && holes.push([i,j]);
    }
    return holes;
  }

  copyArray2d(arr2d) {
    return arr2d.map(function(arr) {
      return arr.slice();
    });
  }

  turnArray2d(arr2d) {
    return arr2d.map(function(arr) {
      return arr.slice().reverse();
    });
  }

  pickMove(state, y, x) {
    let childList = [];
    let tmpState = [];

    /* Check out of border "undefined" values */
    // Jump to right
    if ((state[y][x-1] == 0) && (state[y][x-2] == 0)) {
      tmpState = this.copyArray2d(state);
      tmpState[y][x-2] = 1;
      tmpState[y][x-1] = 1;
      tmpState[y][x] = 0;
      childList.push(tmpState);
    }

    // Jump to left
    if ((state[y][x+1] == 0) && (state[y][x+2] == 0)) {
      tmpState = this.copyArray2d(state);
      tmpState[y][x+2] = 1;
      tmpState[y][x+1] = 1;
      tmpState[y][x] = 0;
      childList.push(tmpState);
    }

    // Jump up
    if (y == 0) {
      if ((state[1][x] == 0) && (state[2][x+2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[2][x+2] = 1;
        tmpState[1][x] = 1;
        tmpState[0][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 1) {
      if ((state[2][x+2] == 0) && (state[3][x+2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[3][x+2] = 1;
        tmpState[2][x+2] = 1;
        tmpState[1][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 2) {
      if ((state[3][x] == 0) && (state[4][x] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[4][x] = 1;
        tmpState[3][x] = 1;
        tmpState[2][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 3) {
      if ((state[4][x] == 0) && (state[5][x-2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[5][x-2] = 1;
        tmpState[4][x] = 1;
        tmpState[3][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 4) {
      if ((state[5][x-2] == 0) && (state[6][x-2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[6][x-2] = 1;
        tmpState[5][x-2] = 1;
        tmpState[4][x] = 0;
        childList.push(tmpState);
      }
    }

    // Jump down
    if (y == 2) {
      if ((state[1][x-2] == 0) && (state[0][x-2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[0][x-2] = 1;
        tmpState[1][x-2] = 1;
        tmpState[2][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 3) {
      if ((state[2][x] == 0) && (state[1][x-2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[1][x-2] = 1;
        tmpState[2][x] = 1;
        tmpState[3][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 4) {
      if ((state[3][x] == 0) && (state[2][x] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[2][x] = 1;
        tmpState[3][x] = 1;
        tmpState[4][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 5) {
      if ((state[4][x+2] == 0) && (state[3][x+2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[3][x+2] = 1;
        tmpState[4][x+2] = 1;
        tmpState[5][x] = 0;
        childList.push(tmpState);
      }
    } else if (y == 6) {
      if ((state[5][x] == 0) && (state[4][x+2] == 0)) {
        tmpState = this.copyArray2d(state);
        tmpState[4][x+2] = 1;
        tmpState[5][x] = 1;
        tmpState[6][x] = 0;
        childList.push(tmpState);
      }
    }
    return childList;
  }

  generateNextStates(node, holes) {
    let tmpList = [];
    let ret = []
    let c = new Array(2);
    while (holes.length > 0) {
        c = holes.pop();
        ret = this.pickMove(node, c[0], c[1]);
        tmpList = ret.length > 0 ? tmpList.concat(ret) : tmpList;
    }
    return tmpList;
  }

  treeSearch() {
    // Array for fringe nodes
    let fringeList = [];
    // The first node is the current state
    const root = this.testObj.testState;
    fringeList.push(root);

    let NewNode = (testState, holes) => ({
      nodeState: this.copyArray2d(testState),
      holeCount: holes.length
    });

    let bestNode = NewNode(root, this.findHoles(root));
    let visitedList = [];
    let tmpNode = [];
    let nextStates = [];
    while (fringeList.length > 0) {
      // A New node for expanding
      tmpNode = fringeList.pop();
      // Check if it is visited
      if (visitedList.hasOwnProperty(JSON.stringify(tmpNode)))
        continue;
      else {
        visitedList[JSON.stringify(tmpNode)] = 1;
        let tmpNode_r = this.turnArray2d(tmpNode);
        visitedList[JSON.stringify(tmpNode_r)] = 1;
        visitedList[JSON.stringify(tmpNode_r.reverse())] = 1;
        tmpNode_r = this.copyArray2d(tmpNode);
        visitedList[JSON.stringify(tmpNode_r.reverse())] = 1;
      }

      const holes = this.findHoles(tmpNode);
      // Check if the node is better than the best solution
      if (holes.length > bestNode.holeCount)
        bestNode = NewNode(tmpNode, holes);
      // Generate child nodes
      nextStates = this.generateNextStates(tmpNode, holes);
      fringeList = nextStates.length > 0 ?
        fringeList.concat(nextStates) : fringeList;

      if (bestNode.holeCount == 32) break;
    }
    return bestNode.nodeState;
  }
}
