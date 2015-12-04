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

//
window._nextSquare = function(position, n, used, queenPlaced) { //(i, j) is the current square we're at
  //one ending case:
  if (!position) {
    return null;
  }

  var r = position[0];
  var c = position[1];
  
  //more ending cases:
  if ((r >= n || c >= n) ||
      (r === n-1 && c === n-1)) {
   return null;
  }

  //make sure we at least increment it one square
  if(queenPlaced || c === n-1){
    r++;
    c = 0;
  } else {
    c++;
  }

  //then additionally jump forward while cols/major/minors invalidate that square
  while(used.cols[c] === true || used.majors[c-r] === true || used.minors[c+r] === true){
    c++;
  }



  if (r >= n || c >= n) {
    return null;
  }

  return [r, c];
};

window._solutionCount = 0;
// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({ n: n });

  _solutionCount = 0;
  var boardArray = board.rows();
  var used = {rows: {}, cols: {}, majors: {}, minors: {}};
  var solution = helper(n, boardArray, [0, 0], 0, true, used);
  solution = solution || (new Board({ n : n})).rows();

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

//input:
  //board: a partially completed board (that may or may not end up being a valid board)
  //startPosition: an array [r,c] that denotes the position to start attempting to add queens
  //numQueens: the number of queens ALREADY in the board
  //findOne: boolean to denote whether to stop after finding only one solution
  //used: an object with four properties (rows, cols, majors, minors)
    //each property is itself an object that contains key: axisIndex, val: true for all used axes
//output:
  //one solution board, if it exists, OR null if none exists
window.helper = function(n, boardArray, startPosition, numQueens, findOne, used){
  //var rows = board.rows();
  //var n = boardArray.length;

  //successful ending case: if board has n queens in it
  if(numQueens === n){
    _solutionCount++;
    return boardArray;
  }
  
  //failed ending case: if we have no more positions allowed to add queens
  if (startPosition === null) {
    return null;
  }
  var currPosition = startPosition.slice(); //create copy of startPosition to prevent mutating input
  
  while (currPosition !== null) {
    var r = currPosition[0];
    var c = currPosition[1];
     
    boardArray[r][c] = 1; //try adding a queen at currPosition
    numQueens++;

    var changed = {row: false, col: false, major: false, minor: false};
    if(used.rows[r] === undefined){
      used.rows[r] = true;
      changed.row = true;
    }
    if(used.cols[c] === undefined){
      used.cols[c] = true;
      changed.col = true;
    }
    if(used.majors[c-r] === undefined){
      used.majors[c-r] = true;
      changed.major = true;
    }
    if(used.minors[c+r] === undefined){
      used.minors[c+r] = true;
      changed.minor = true;
    }

    var next = _nextSquare(currPosition, n, used, true);
    var potentialSolution = helper(n, boardArray, next, numQueens, findOne, used);
    if (findOne && potentialSolution) {
      return potentialSolution;
    }
 
    boardArray[r][c] = 0; //remove the queen we just added
    numQueens--;

    if (changed.row === true) {
      delete used.rows[r];
    }
    if (changed.col === true) {
      delete used.cols[c];  
    }
    if (changed.major === true) {
      delete used.majors[c-r];
    }
    if (changed.minor === true) {
      delete used.minors[c+r];  
    }


    //ending case: if we have completed searching all possible locations where we can put a first queen (i.e. left half of row),
      //double the number of solutions found after left half (NOT INCLUDING middle column for odd n), to utilize symmetry
      //end searching for solutions after left half (INCLUDING middle column for odd n)
    if(numQueens === 0 && findOne === false){
      if (c === Math.floor(n/2)-1)
      {
        _solutionCount *= 2; //double solution count, regardless of even or odd n
        if (n % 2 === 0) { //exit case for even n
          return null;
        }
      }
      if (c === Math.floor(n/2)) { //exit case for odd n
        return null;
      }
    }

    currPosition = _nextSquare(currPosition, n, used); //increment position
  }  

  return null; //no possible solution
}

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var board = new Board({ n: n });
  var boardArray = board.rows();
  _solutionCount = 0;
  var used = {rows: {}, cols: {}, majors: {}, minors: {}};
  helper(n, boardArray, [0, 0], 0, false, used);

  var solutionCount = _solutionCount;
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

//using hasAnyQueensConflicts
  //1145 ms
  //69472

//using hasAnyQueenConflictsOn(r,c)
  //419ms
  //16133ms

//not creating new Boards (since that doesn't deep copy the rows anyway)
  //201ms
  //8010ms

//first queen must be in first row, exit after that
  //?
  //~6 sec

//skipping used rows and cols
  //118ms
  //2323ms

//skipping used rows, cols, majors, and minors
  //43ms
  //492ms

//skipping additional test of num used rows/cols
  //-- (too short to show up in SpecR)
  //349ms

//passed around board rows instead of board
  //--
  //84ms

//quits out if ANY row is skipped without a queen
  //--
  //under 50ms