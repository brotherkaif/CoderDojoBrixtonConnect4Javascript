var counterWidth;    
var counterRadius;
var xoffset;
var yoffset;
var xpos;
var ypos;
var theCanvas;
var drawingContext;
var canvasWidth;
var player;
var gridPositionY;
var gridPositionX;
var gridWidth;
var gridHeight;
var duringDrop;
var myGrid;

function init()
{
    counterWidth = 50, counterRadius = counterWidth / 2;
    gridWidth = 7;
    gridHeight = 6;
    xoffset = 20, yoffset = 20;
    xpos = 0, ypos = 0;
    theCanvas = document.getElementById( 'canvas' );
    drawingContext = theCanvas.getContext( '2d' );
    canvasWidth = theCanvas.width;
    player = 1;
    gridPositionY, gridPositionX, duringDrop = false;
    myGrid = new Array( gridWidth );
    for( var i = 0; i < gridWidth; i++ )
    {
	myGrid[i] = new Array( gridHeight );
	for( var j = 0; j < gridHeight; j++ )
	{
	    myGrid[i][j] = 0;
	}
    }
    initGrid();
}

/**
 * clears the drawing canvas
 */
function clear()
{
    drawingContext.clearRect( 0, yoffset, canvasWidth, counterWidth );
}

/**
 * checks to see if somebody has won the game
 */
function checkGrid()
{
    // if all grid full and no match then draw!

    if( checkForVerticalWin() || checkForHorizontalWin() || checkDiagonalWin() )
    {
	doWin();
	return true;
    }

    return false;
}

function doWin()
{
    alert( 'player ' + player + ' won' );
    initGrid();
}

/**
 * Checks to see if there is a diagonal win starting from x,y
 * 
 * @param x
 * @param y
 */
function checkDiagonalWinFrom( x, y )
{
    var temp = '';
    if( x <= gridWidth - 4 && y <= gridHeight - 4 )
    {
	// search forwards
	for( var xPosition = x, yPosition = y, count = 0; count < 4
		&& xPosition < x + 4 && yPosition < gridHeight; xPosition++, yPosition++, count++ )
	{
	    temp += myGrid[xPosition][yPosition];
	}
    }
    temp += '\r\n';
    if( x >= 4 && y <= gridHeight - 4 )
    {
	// search backwards
	for( var xPosition = x, yPosition = y, count = 0; count < 4
		&& xPosition >= 0; xPosition--, yPosition++, count++ )
	{
	    temp += myGrid[xPosition][yPosition];
	}
	temp += '\r\n';
    }
    if( temp.search( player + '' + player + '' + player + '' + player ) > -1 )
    {
	return true;

    }
    return false;
}

/**
 * checks to see if someone has one on a diagonal
 */
function checkDiagonalWin()
{
    for( var xPosition = 0; xPosition < gridWidth; xPosition++ )
    {
	for( var yPosition = 0; yPosition < gridHeight; yPosition++ )
	{
	    if( checkDiagonalWinFrom( xPosition, yPosition ) )
	    {
		return true;
	    }
	}

    }
    return false;
}

/**
 * checks to see if someone has won on a horizontal
 */
function checkForHorizontalWin()
{
    var temp = '';
    for( var j = 0; j < gridHeight; j++ )
    {
	// check horizontal counters
	for( var i = 0; i < gridWidth; i++ )
	{
	    if( (i % gridWidth) == 0 )
		temp += '\r\n';
	    temp += myGrid[i][j];
	}
    }
    if( temp.search( player + '' + player + '' + player + '' + player ) > -1 )
    {

	return true;

    }

}

/**
 * checks to see of someone has won on a vertical
 * 
 * @returns {Boolean}
 */
function checkForVerticalWin()
{
    var temp = '';
    for( var i = 0; i < gridWidth; i++ ) // check vertical counters
    {
	temp = myGrid[i].join();
	if( temp.search( player + ',' + player + ',' + player + ',' + player ) > 0 )
	{
	    return true;
	}

    }
    return false;
}

/**
 * Gets the colour associated with the current player
 */
function getColor()
{
    if( player == 1 )
    {
	return 'yellow';
    }
    else
    {

	return 'red';
    }
}

/**
 * Draws a falling counter
 */
function dropCounter()
{
    // if column full, don't just move to next players turn
    // create counter function with color/radius parameter or a circle function

    if( mousePositionInsideGrid() )
    {
	if( gridPositionX == 0 && gridPositionY == 0 )
	    gridPositionX = getGridPositionX();

	if( gridPositionIsValid() )
	{
	    duringDrop = true;
	    clear();
	    if( gridPositionY > 0 )
	    {
		drawEmptyCell( gridPositionX, gridPositionY );
	    }

	    drawPlayerColourCounter( getColor(), gridPositionX, gridPositionY );

	    gridPositionY++;

	    if( nextRowDownIsEmpty() )
	    {
		dropTicker = setTimeout( "dropCounter()", 50 );
	    }
	    else
	    {
		gridPositionY -= 2;
		if( myGrid[gridPositionX][gridPositionY] == 0 )
		    myGrid[gridPositionX][gridPositionY] = player;
		clearTimeout( dropTicker );
		if( !checkGrid()
			&& myGrid[gridPositionX][gridPositionY] == player )
		{
		    player == 1 ? player = 2 : player = 1;
		}

		gridPositionY = 0;
		gridPositionX = 0;
		duringDrop = false;
	    }
	}
    }
}

/**
 * checks to see if the grid position is within the bounds of the grid
 * 
 * @returns {Boolean}
 */
function gridPositionIsValid()
{
    return gridPositionX > -1 && gridPositionX < gridWidth;
}

/**
 * checks to see if the row beneath is empty.
 * 
 * @returns {Boolean}
 */
function nextRowDownIsEmpty()
{
    return(gridPositionY <= gridHeight && myGrid[gridPositionX][gridPositionY - 1] < 1);
}

/**
 * returns the grid position for the current mouse position in the window
 * 
 * @returns {Number}
 */
function getGridPositionX()
{
    return(Math.round( (xpos - xoffset / gridWidth) / 50 ) - 1);
}

/**
 * draws a player counter in the current player's colour
 */
function drawPlayerColourCounter( colour, gridX, gridY )
{
    drawingContext.fillStyle = colour;
    drawingContext.beginPath();
    drawingContext.arc( counterRadius + gridX * counterWidth + xoffset,
	    (counterRadius + 50) + (gridY * 50) - 50 + yoffset,
	    counterRadius - 5, 0, Math.PI * 2, true );
    drawingContext.closePath();
    drawingContext.fill();
    drawingContext.stroke();

    drawingContext.beginPath();
    drawingContext.arc( counterRadius + gridX * counterWidth + xoffset,
	    (counterRadius + 50) + (gridY * 50) - 50 + yoffset,
	    counterRadius - 13, 0, Math.PI * 2, true );
    drawingContext.closePath();
    drawingContext.fill();
    drawingContext.stroke();
}

/**
 * draws an empty cell
 */
function drawEmptyCell( gridX, gridY )
{
    drawingContext.fillStyle = 'white';
    drawingContext.beginPath();
    drawingContext
	    .arc( counterRadius + gridX * counterWidth + xoffset,
		    ((counterRadius + 50) + (gridY * 50) - 50 + yoffset)
			    - counterWidth, counterRadius - 5, 0, Math.PI * 2,
		    true );
    drawingContext.closePath();
    drawingContext.fill();
}

/**
 * checks to see if the mouse position is within the grid
 * 
 * @returns {Boolean}
 */
function mousePositionInsideGrid()
{
    return xpos > xoffset + counterRadius
	    && xpos < (counterRadius + counterWidth * gridWidth) - (xoffset);
}

/**
 * draws the counter as the player moves the mouse
 * 
 * @param e
 */
function drawCounter( e )
{
    if( !duringDrop )
    {

	drawPlayerTurn();
	xpos = e.pageX;
	ypos = e.pageY;
	if( e.pageX > xoffset + counterRadius + 10
		&& e.pageX < (counterRadius + counterWidth * gridWidth)
			- (xoffset) )
	{
	    clear();
	    drawCounterOnCanvas( e, getColor() );
	}
    }
}

/**
 * draws some text showing who the current player is
 */
function drawPlayerTurn()
{
    drawingContext.fillStyle = "rgba(255,150,255,1)";
    drawingContext.fillRect( xoffset - 8, counterWidth * (gridHeight + 2),
	    counterWidth * 2, counterWidth );
    drawingContext.stroke();
    drawingContext.fillStyle = "rgba(0,0,0,1)";
    drawingContext.font = "bold 16px sans-serif";
    drawingContext.fillText( 'player ' + player, xoffset - 8, counterWidth
	    * (gridHeight + 2) + yoffset );
}

/**
 * draws a player counter on the canvas
 * 
 * @param e
 * @param colour
 */
function drawCounterOnCanvas( e, colour )
{
    drawingContext.fillStyle = colour;
    drawingContext.beginPath();
    drawingContext.arc( e.pageX - 10, (counterRadius) + yoffset,
	    counterRadius - 5, 0, Math.PI * 2, true );
    drawingContext.closePath();
    drawingContext.fill();
    drawingContext.stroke();

    drawingContext.beginPath();
    drawingContext.arc( e.pageX - 10, (counterRadius) + yoffset,
	    counterRadius - 13, 0, Math.PI * 2, true );
    drawingContext.closePath();
    drawingContext.fill();
    drawingContext.stroke();
}

function showGrid()
{
    var mytest = '';

    for( var j = 0; j < gridHeight; j++ )
    {
	for( var i = 0; i < gridWidth; i++ )
	{
	    if( (i % gridWidth) == 0 )
		mytest += '\r\n';
	    mytest += myGrid[i][j];
	}
    }
    alert( mytest );
}

/**
 * sets the model grid so that all spaces are cleared
 */
function clearGrid()
{
    for( var j = 0; j < gridHeight; j++ )
	for( var i = 0; i < gridWidth; i++ )
	    myGrid[i][j] = 0;
}

/**
 * initialises the canvas
 */
function initGrid()
{

    gridPositionX = 0;
    gridPositionY = 0;
    clearGrid();
    drawTitleText();

    for( var j = 1; j <= gridHeight; j++ )
    {
	for( var i = 0; i < gridWidth; i++ )
	{
	    drawCell( j, i );
	}
    }
    drawBottom();

    document.onmousemove = drawCounter;
    document.onclick = dropCounter;
}

/**
 * draws the solid areas at the bottom of the grid
 */
function drawBottom()
{
    drawingContext.fillStyle = "rgba(0,0,255,1)";
    drawingContext.fillRect( xoffset - 8, counterWidth * (gridHeight + 1)
	    + yoffset, counterWidth * gridWidth + 16, 20 );
    drawingContext.strokeRect( xoffset - 8, counterWidth * (gridHeight + 1)
	    + yoffset, counterWidth * gridWidth + 16, 20 );
}

/**
 * draws the text showing the game title
 */
function drawTitleText()
{
    drawingContext.fillStyle = "rgba(0,0,0,1)";
    drawingContext.font = "bold 20px sans-serif";
    drawingContext.fillText( "Coder Dojo Brixton Connect 4", 10, 20 );
}

/**
 * draws an empty cell in the grid
 * 
 * @param j
 * @param i
 */
function drawCell( j, i )
{
    drawingContext.fillStyle = "rgba(0,0,255,1)";
    drawingContext.fillRect( 0 + i * counterWidth + xoffset, counterWidth * j
	    + yoffset, counterWidth, counterWidth );
    drawingContext.strokeRect( 0 + i * counterWidth + xoffset, counterWidth * j
	    + yoffset, counterWidth, counterWidth );
    drawingContext.fillStyle = "rgba(255,255,255,1)";
    drawingContext.beginPath();
    drawingContext.arc( counterRadius + i * counterWidth + xoffset,
	    (counterRadius + 50) + (j * 50) - 50 + yoffset, counterRadius - 5,
	    0, Math.PI * 2, true );
    drawingContext.closePath();
    drawingContext.fill();
    drawingContext.stroke();
}
