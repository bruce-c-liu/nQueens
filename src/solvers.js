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
  var solution;
  var board = new Board({n:n});

  //solution is an empty n x n matrix at this point
  solution = arrayClone(board.rows());

  var recurse = function(currentBoard, currentBoardMatrix, currentNumRooks, currRow, unfilledColsArray){

    if(currentNumRooks === n){
      solution = arrayClone(currentBoardMatrix);
      return solution;
    }

    for(var i = 0; i < unfilledColsArray.length; i++){
      var tempUnfilledColsArray = unfilledColsArray.slice();
      if(tempUnfilledColsArray[i] === 0){ //no rook in column i
        tempUnfilledColsArray[i] = 1;     //mark col as now filled
        var tempBoard = new Board(arrayClone(currentBoardMatrix));
        var tempBoardMatrix = tempBoard.rows();
        tempBoardMatrix[currRow][i] = 1;
        return recurse(tempBoard, tempBoardMatrix, currentNumRooks+1, currRow+1,tempUnfilledColsArray);
      }
    }
  };

  var unfilledColsArray = Array(n).fill(0);
  solution = recurse(board, arrayClone(board.rows()), 0, 0, unfilledColsArray);


  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var unfilledColsArray = Array(n).fill(0);
  var recurse = function(currRow){

    if(currRow === n){
      solutionCount++;
      return;
    }

    for(var i = 0; i < unfilledColsArray.length; i++){
      if(unfilledColsArray[i] === 0){ //no rook in column i
        unfilledColsArray[i] = 1;     //mark col as now filled
        recurse(currRow+1);
        unfilledColsArray[i] = 0;
      }
    }
  };

  recurse(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  //solution is an empty n x n matrix at this point
  var solution = makeEmptyMatrix(n);

  var recurse = function(currentBoardMatrix, currentNumQueens, currRow, unfilledColsArray, major, minor){

    if(currentNumQueens === n){
      solution = arrayClone(currentBoardMatrix);
      return;
    }

    for(var i = 0; i < unfilledColsArray.length; i++){
      if(unfilledColsArray[i] === 0){ //no queen in column i
        if(major[hashMatrix[currRow][i][0]] === 0){//no queen in major diagonal
          if(minor[hashMatrix[currRow][i][1]] === 0){//no queen in minor diagonal
            var tempUnfilledColsArray = unfilledColsArray.slice();
            var tempMajorDiagonalArray = major.slice();
            var tempMinorDiagonalArray = minor.slice();
            tempUnfilledColsArray[i] = 1;     //mark col as now filled
            tempMajorDiagonalArray[hashMatrix[currRow][i][0]] = 1;   //mark major diag as filled
            tempMinorDiagonalArray[hashMatrix[currRow][i][1]] = 1;   //mark minor diag as filled
            var tempBoardMatrix = arrayClone(currentBoardMatrix);
            tempBoardMatrix[currRow][i] = 1;
            recurse(tempBoardMatrix, currentNumQueens+1, currRow+1,tempUnfilledColsArray, tempMajorDiagonalArray, tempMinorDiagonalArray);
          }
        }
      }
    }
  };

  var diagonalIndexTotal = 2*n-1;
  var majorDiagonalArray = Array(diagonalIndexTotal).fill(0);
  var minorDiagonalArray = Array(diagonalIndexTotal).fill(0);
  var unfilledColsArray = Array(n).fill(0);
  var hashMatrix = hash(n);
  recurse(solution, 0, 0, unfilledColsArray, majorDiagonalArray, minorDiagonalArray);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
//Github@bruce-c-liu Notes: This solution uses horizontal symmetry to cut down on the number of iterations by half.
//It also utilizes a hashing function that keeps track of major/minor diagonal availability slots. This algorithm
//can be further optimized with multithreading and applying rotational and other types of symmetry.
window.countNQueensSolutions = function(n) {

  //since this solution uses horizontal symmetry, n===1 would wrongly yield 2 solutions.
  //Therefore, we need a check here.
  if(n === 0 || n === 1){
    console.log('Number of solutions for ' + n + ' queens:', n);
    return n;
  }

  var solutionCount = 0;

  //number of total indices needed to keep track of the major/minors diagonals for a n x n board.
  var diagonalIndexTotal = 2*n-1;

  //creates an array that corresponds to the major diagonals.
  //EX. a 4x4 board would create an unfilledMajorDiagonalArray of [0,0,0,0,0,0,0]
  var unfilledMajorDiagonalArray = Array(diagonalIndexTotal).fill(0);
  var unfilledMinorDiagonalArray = Array(diagonalIndexTotal).fill(0);
  var unfilledColsArray = Array(n).fill(0);
  var hashMatrix = hash(n);
  var rowEndIndex = Math.ceil(n/2);

  if(n%2 === 1){
    unfilledColsArray[rowEndIndex-1] = 1;                                //mark col as now filled
    unfilledMajorDiagonalArray[hashMatrix[0][rowEndIndex-1][0]] = 1;     //mark major diag as filled
    unfilledMinorDiagonalArray[hashMatrix[0][rowEndIndex-1][1]] = 1;     //mark minor diag as filled
    recurse(1,rowEndIndex-1);
    unfilledColsArray[rowEndIndex-1] = 0;                                //reset array to before recurse
    unfilledMajorDiagonalArray[hashMatrix[0][rowEndIndex-1][0]] = 0;     //reset array to before recurse
    unfilledMinorDiagonalArray[hashMatrix[0][rowEndIndex-1][1]] = 0;     //reset array to before recurse
    recurse(0, rowEndIndex-1);
  } else {
    recurse(0, rowEndIndex);
  }


  function recurse(currRow, rowEnd){
    if(currRow == n){
      solutionCount++;
      return;
    }

    for(var currCol = 0; currCol < rowEnd; currCol++){
      if(unfilledColsArray[currCol] == 0){                                       //no queen in current column
        if(unfilledMajorDiagonalArray[hashMatrix[currRow][currCol][0]] == 0){    //no queen in major diagonal
          if(unfilledMinorDiagonalArray[hashMatrix[currRow][currCol][1]] == 0){  //no queen in minor diagonal
            unfilledColsArray[currCol] = 1;                                      //mark col as now filled
            unfilledMajorDiagonalArray[hashMatrix[currRow][currCol][0]] = 1;     //mark major diag as filled
            unfilledMinorDiagonalArray[hashMatrix[currRow][currCol][1]] = 1;     //mark minor diag as filled
            recurse(currRow+1, n);
            unfilledColsArray[currCol] = 0;                                      //reset array to before recurse
            unfilledMajorDiagonalArray[hashMatrix[currRow][currCol][0]] = 0;     //reset array to before recurse
            unfilledMinorDiagonalArray[hashMatrix[currRow][currCol][1]] = 0;     //reset array to before recurse
          }
        }
      }
    }
  };

  console.log('Number of solutions for ' + n + ' queens:', solutionCount*2);
  return solutionCount*2;
};

//given a dimension, return a matrix of [topleft diag index, topright diag index] corresponding to each slot on a board
window.hash = function(dimension){
  var hashMatrix = makeArrayMatrix(dimension);
  var numKeys = dimension*2 - 1;
  //keys for topleft -> bottomright (major diagonal)
  //start at bottom left: hashMatrix[dimension-1][0]
  var keys = _.range(0, numKeys);
  for(var row = dimension-1; row >= 0; row--){
    for(var col = 0; col < dimension; col++){
      var slicedKeys = keys.slice(dimension-row-1, 2*dimension-row-1);
      hashMatrix[row][col].push(slicedKeys[col]);
    }
  }

  //keys for topright -> bottomleft(minor diagonal)
  //hashMatrix[dimension-1][dimension-1]
  for(var i = 0; i < hashMatrix.length; i++){
    var flattenAndReverse = _.flatten(hashMatrix[i]).reverse();
    for(var x = 0; x < dimension; x++){
      hashMatrix[i][x].push(flattenAndReverse[x]);
    }
  }

  return hashMatrix;
};

window.makeEmptyMatrix = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return 0;
    });
  });
};

window.makeArrayMatrix = function(n) {
  return _(_.range(n)).map(function() {
    return _(_.range(n)).map(function() {
      return [];
    });
  });
};

window.arrayClone=function(arr) {
  // return _.map(arr, function(item){
  //   return item;
  // });
    if( _.isArray( arr ) ) {
        return _.map( arr, arrayClone );
    } else {
        return arr;
    }
  }
