// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var matrix = this.rows();
      var rowArray = matrix[rowIndex];
      var numPieces = 0;

      for(var i = 0; i < rowArray.length; i++){
        if(rowArray[i] === 1){
          numPieces++;
        }
        if(numPieces > 1){   //if a row has more than 1 piece, there is a conflict
          return true;
        }
      }

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var matrix = this.rows();
      for(var i = 0; i < matrix.length; i++){
        if(this.hasRowConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var matrix = this.rows();
      var colArray = [];

      //put all the items in specified column in colArray
      for(var i = 0; i < matrix.length; i++){
        colArray.push(matrix[i][colIndex]);
      }

      var numPieces = 0;

      for(var i = 0; i < colArray.length; i++){
        if(colArray[i] === 1){
          numPieces++;
        }
        if(numPieces > 1){ //if a col has more than 1 piece, there is a conflict
          return true;
        }
      }

      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var matrix = this.rows();
      for(var i = 0; i < matrix.length; i++){
        if(this.hasColConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var majorDiagonalArray = [];
      var colIndex = majorDiagonalColumnIndexAtFirstRow;

      for(var row = 0; row < matrix.length; row++){
        colIndex = row+majorDiagonalColumnIndexAtFirstRow;
        if(colIndex<0 || colIndex>=matrix.length){
          majorDiagonalArray.push(0);
        } else {
          majorDiagonalArray.push(matrix[row][colIndex]);
        }
      }

      var numPieces = 0;

      for(var i = 0; i < majorDiagonalArray.length; i++){
        if(majorDiagonalArray[i] === 1){
          numPieces++;
        }
        if(numPieces > 1){ //if a diag has more than 1 piece, there is a conflict
          return true;
        }
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var matrix = this.rows();

      for(var i = -(matrix.length+1); i < matrix.length; i++){
        if(this.hasMajorDiagonalConflictAt(i)){
          return true;
        }
      }

      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var minorDiagonalArray = [];
      var colIndex = minorDiagonalColumnIndexAtFirstRow;

      for(var row = 0; row < matrix.length; row++){
        colIndex = minorDiagonalColumnIndexAtFirstRow-row;
        if(colIndex<0 || colIndex>=matrix.length){
          minorDiagonalArray.push(0);
        } else {
          minorDiagonalArray.push(matrix[row][colIndex]);
        }
      }

      var numPieces = 0;

      for(var i = 0; i < minorDiagonalArray.length; i++){
        if(minorDiagonalArray[i] === 1){
          numPieces++;
        }
        if(numPieces > 1){ //if a diag has more than 1 piece, there is a conflict
          return true;
        }
      }

      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var matrix = this.rows();

      for(var i = 0; i < matrix.length*2; i++){
        if(this.hasMinorDiagonalConflictAt(i)){
          return true;
        }
      }

      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });
}());
