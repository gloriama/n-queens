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

//------------------------------------------------------------------------------------------
// N ROOKS
//------------------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------------------
// N QUEENS
//------------------------------------------------------------------------------------------

//returns next square we should try to add a queen
//OR null if we're at the end of the board
//note: does not modify input
window._nextSquare = function(position, n) { //(i, j) is the current square we're at
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

window._solutionCount = 0;
// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({ n: n });

  _solutionCount = 0;  
  var solutionBoard = helper(board, [0, 0], 0, true);
  solutionBoard = solutionBoard || board;
  var solution = solutionBoard.rows(); //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

//input:
  //board: a partially completed board (that may or may not end up being a valid board)
  //startPosition: an array [r,c] that denotes the position to start attempting to add queens
  //numQueens: the number of queens ALREADY in the board
  //findOne: boolean to denote whether to stop after finding only one solution
//output:
  //one solution board, if it exists, OR null if none exists
window.helper = function(board, startPosition, numQueens, findOne){
  var rows = board.rows();
  var n = rows.length;

  //successful ending case: if board has n queens in it
  if(numQueens === n){
    _solutionCount++;
    return board;
  }
  
  //failed ending case: if we have no more positions allowed to add queens
  if (startPosition === null) {
    return null;
  }
  var currPosition = startPosition.slice(); //create copy of startPosition to prevent mutating input
  
  while (currPosition !== null) {
    var r = currPosition[0];
    var c = currPosition[1];
    
    board.togglePiece(r,c); //try adding a queen at currPosition

    if (!board.hasAnyQueenConflictsOn(r,c)) { //found valid position for queen
      var potentialSolution = helper(board, window._nextSquare(currPosition, n), numQueens+1, findOne);
      if (findOne && potentialSolution) {
        return potentialSolution;
      }
    }

    board.togglePiece(r,c); //remove the queen we just added
    currPosition = window._nextSquare(currPosition, n); //increment position
  }  

  return null; //no possible solution
}

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var board = new Board({ n: n });

  _solutionCount = 0;
  helper(board, [0, 0], 0, false);

  var solutionCount = _solutionCount;
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

//brute force using hasAnyQueensConflicts
  //1145 ms
  //69472

//brute force using hasAnyQueenConflictsOn(r,c)
  //419ms
  //16133ms

//brute force not using new Board (since that doesn't deep copy the rows anyway)
  //201ms
  //8010ms