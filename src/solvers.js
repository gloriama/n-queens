/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var board = new Board({ n: n }); //fixme
  for (var i = 0; i < n; i++) {
    board.togglePiece(i, i);
  }
  var solution = board.rows();
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  //var solution = undefined; //fixme

  var factorial = function(n) {
    if (n === 0) {
      return 1;
    }
    return n * factorial(n-1);
  }

  var solutionCount = factorial(n);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({ n: n });

  var solutionBoard = window.helper(board, [0, 0]);
  solutionBoard = solutionBoard || board;
  var solution = solutionBoard.rows(); //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

//takes a partially completed board (that may or may not end up being a valid board) AND a point to start potentially adding queens
//returns either a solution, if it exists, OR undefined if none exists
window.helper = function(board, startPosition){ //r, c is the point where we should start trying to add more queens
  //check num queens
  var rows = board.rows();
  var n = rows.length;
  var numQueens = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (rows[i][j] === 1) {
        numQueens++;
      }
    }
  }
  if(numQueens === n){
    return board;
  }
  
  //ending case: if board has n queens in it, it's a solution
  if (startPosition === null) {
    return null;
  }

  // error checking
  // if (startPosition.length !== 2){
  //   return null;
  // }

  var newBoard = new Board(board.rows()); //create copy of board so we do not modify original board
  var n = newBoard.rows().length;

  //returns next square we should try to add a queen
  //OR null if we're at the end of the board
  var nextSquare = function(position) { //(i, j) is the current square we're at
    if (!position) {
      return null;
    }
    var i = position[0];
    var j = position[1];
    if(i === n-1 && j === n-1){
      return null;
    }
    if(j === n-1){
      return [i+1, 0];
    } 
    return [i, j + 1];
  };

  var currPosition = startPosition.slice();
  while (currPosition) {
    var r = currPosition[0];
    var c = currPosition[1];
    //console.log(r,c);
    newBoard.togglePiece(r,c); //try adding a queen at currPosition

    if (!newBoard.hasAnyQueensConflicts()) { //found valid position for queen
      var potentialSolution = helper(newBoard, nextSquare(currPosition));
      if (potentialSolution) {
        return potentialSolution;
      }
    }

    newBoard.togglePiece(r,c); //remove the queen we just added
    currPosition = nextSquare(currPosition); //increment position
  }  

  return null; //no possible solution
}



//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------


window.ianSolutionCount = 0;

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // var solution = undefined; //fixme

  // if (n === 0) {
  //   return 1;
  // }

  var board = new Board({ n: n });

  window.ianSolutionCount = 0;

  window.helper2(board, [0, 0]);
  
  var solutionCount = window.ianSolutionCount;
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};


var helper2 = function(board, startPosition){ //r, c is the point where we should start trying to add more queens
  //check num queens
  var rows = board.rows();
  var n = rows.length;
  var numQueens = 0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      if (rows[i][j] === 1) {
        numQueens++;
      }
    }
  }
  if(numQueens === n){
    window.ianSolutionCount++; //!!! maybe increment solutionCount instead?
    return;
  }
  
  //ending case: if board has n queens in it, it's a solution
  if (startPosition === null) {
    return null; //???? continue somehow?
  }

  // error checking
  // if (startPosition.length !== 2){
  //   return null;
  // }

  var newBoard = new Board(board.rows()); //create copy of board so we do not modify original board
  var n = newBoard.rows().length;

  //returns next square we should try to add a queen
  //OR null if we're at the end of the board
  var nextSquare = function(position) { //(i, j) is the current square we're at
    if (!position) {
      return null;
    }
    var i = position[0];
    var j = position[1];
    if(i === n-1 && j === n-1){
      return null;
    }
    if(j === n-1){
      return [i+1, 0];
    } 
    return [i, j + 1];
  };

  var currPosition = startPosition.slice();
  while (currPosition) {
    var r = currPosition[0];
    var c = currPosition[1];
    //console.log(r,c);
    newBoard.togglePiece(r,c); //try adding a queen at currPosition

    if (!newBoard.hasAnyQueensConflicts()) { //found valid position for queen
      helper2(newBoard, nextSquare(currPosition));
    //   if (potentialSolution) {
    //     //SOLUTION IS FOUND
    //     console.log("found");
    //     window.ianSolutionCount++; //!!! can't actually access this var, but we'll fix that
    //   }
    }

    newBoard.togglePiece(r,c); //remove the queen we just added
    currPosition = nextSquare(currPosition); //increment position
  }  

  return null; //no possible solution
}