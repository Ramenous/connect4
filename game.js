const HORIZONTAL_SLOTS=7;
const VERTICAL_SLOTS=6;
const SLOT_SPACE=40;
const SLOT_SIZE=70;
const ROW="row";
const COL="col";
const DELIM="-";
const P1COLOR="blue";
const P2COLOR="red";

var playerTurn=true;
var boardArray=[];

function occupy(x,y){
  boardArray[x][y].player=playerTurn;
  document.getElementById(x+DELIM+y).style.backgroundColor=(playerTurn) ? P1COLOR : P2COLOR;
  playerTurn=!playerTurn;
}

initializeBoard=function(){
  console.log("Initializing game board...");
  var board= document.getElementById("gameBoard");
  for(var i=0; i<VERTICAL_SLOTS; i++){
    var row=board.insertRow(i);
    row.className=ROW+DELIM+i;
    var rowArray=[];
    for(var j=0; j<HORIZONTAL_SLOTS; j++){
        var cell=row.insertCell(j);
        cell.className=COL+DELIM+j;
        cell.id=i+DELIM+j;
        console.log(cell.id);
        rowArray.push(new Slot(cell.id));
    }
    console.log(rowArray);
    boardArray.push(rowArray);
    console.log(boardArray);
  }
  var spots=document.getElementById("gameBoard").getElementsByTagName("td");
  console.log(spots);
  console.log(spots[2]);
  for(var i=0; i<spots.length; i++){
    spots[i].onclick=function(){
      var position=(this.id).split(DELIM);
      console.log(position);
      var col=parseInt(position[1]);
      var row=getNearestVacantSpot(col);
      console.log("rowwie:"+row);
      boardArray[row][col].player=playerTurn;
      console.log(boardArray[row][col].player);
      document.getElementById(row+DELIM+col).style.backgroundColor=(playerTurn) ? P1COLOR : P2COLOR;
      if(negativeDiagonalWin(playerTurn,row,col)||positiveDiagonalWin(playerTurn,row,col) || verticalWin(playerTurn,row,col) || horizontalWin(playerTurn,row,col)){
        alert((playerTurn)?"player1 won":"player2 won");
      }else{
        console.log(negativeDiagonalWin(playerTurn,row,col),positiveDiagonalWin(playerTurn,row,col));
      }
      playerTurn=!playerTurn;
    };
  }
  console.log("Done! game board initialized");
}

function getNearestVacantSpot(col){
  for(var i=0; i<VERTICAL_SLOTS; i++){
    console.log("row:"+i, "col:"+col);
    console.log(boardArray[i][col].player);
    if(boardArray[i][col].player!=null){
      return i-1;
    }
  }
  return VERTICAL_SLOTS-1;
}

function outOfBottomBound(row, col){
  return (row>5) || (col>5);
}

function outOfTopBound(row,col){
  return (row<0) || (col<0);
}

function recurseSlots(playerTurn, row, col, rowModifier, colModifier){
  if(stopCount(playerTurn, row, col)) return 0;
  return recurseSlots(playerTurn, row+rowModifier, col+colModifier, rowModifier, colModifier) + 1;
}

function stopCount(playerTurn, row, col){
  if(outOfBottomBound(row,col) || outOfTopBound(row,col)){
    return true;
  }
  return (boardArray[row][col].player==null) ? true : boardArray[row][col].player!=playerTurn;
}

function positiveDiagonalWin(playerTurn, row,col){
  return (recurseSlots(playerTurn, row+1, col-1, 1, -1) + 1 + recurseSlots(playerTurn, row-1, col+1, -1, 1)==4) ? true: false;
}

function negativeDiagonalWin(playerTurn, row, col){
  return ((recurseSlots(playerTurn, row+1, col+1, 1, 1)+1+recurseSlots(playerTurn, row-1, col-1, -1, -1))==4) ? true: false;
}

function verticalWin(playerTurn, row, col){
  return ((recurseSlots(playerTurn, row-1, col, -1, 0)+1+recurseSlots(playerTurn, row+1, col, 1, 0))==4) ? true: false;
}

function horizontalWin(playerTurn, row, col){
  return ((recurseSlots(playerTurn, row, col+1, 0, 1)+1+recurseSlots(playerTurn, row, col-1, 0, -1))==4) ? true: false;
}

Slot=function(pos){
  this.player=null;
  this.pos=pos;
}

newGame=function(){
  initializeBoard();
}

newGame();
