var countW;
var xoffset;
var yoffset;
var xpos = 0;
var ypos = 0;
var theCanvas;
var cxt;
var canW;
var playerColor;
var player;
var pos;
var gridpos;
var won;
var duringDrop;
var myGrid;

function init()
{
    countW = 50, countR = countW / 2;
    xoffset = 20, yoffset = 20;
    xpos = 0, ypos = 0;
    theCanvas = document.getElementById( 'canvas' );
    cxt = theCanvas.getContext( '2d' );
    canW = document.getElementById( 'canvas' ).width;
    playerColor = '', player = 1;
    pos, gridpos, won, duringDrop = false;
    myGrid = new Array( 7 );
    for( var i = 0; i < 7; i++ ) {
	myGrid[i] = [ 0, 0, 0, 0, 0, 0 ];
    }
    initGrid();
}

function clear()
{
    cxt.clearRect( 0, yoffset, canW, countW );
}

function checkGrid()
{
    // if all grid full and no match then draw!
    var temp = '';
    for( i = 0; i <= 6; i++ ) // check vertical counters
    {
	temp = myGrid[i].join();
	if( temp.search( player + ',' + player + ',' + player + ',' + player ) > 0 )
	    won = true;
    }

    temp = '';

    for( j = 0; j < 6; j++ )
	// check horizontal counters
	for( i = 0; i < 7; i++ ) {
	    if( (i % 7) == 0 )
		temp += '\r\n';
	    temp += myGrid[i][j];
	}
    if( temp.search( player + '' + player + '' + player + '' + player ) > -1 )
	won = true;

    temp = '';

    for( i = 1; i <= 4; i++ )
	// check diagonal counters
	temp += myGrid[i - 1][i + 1];

    temp += '\r\n';

    for( i = 1; i <= 4; i++ )
	temp += myGrid[i + 2][i - 1];

    temp += '\r\n';

    for( i = 1; i <= 5; i++ )
	temp += myGrid[i - 1][i];

    temp += '\r\n';

    for( i = 1; i <= 6; i++ )
	temp += myGrid[i - 1][i - 1];

    temp += '\r\n';

    for( i = 1; i <= 6; i++ )
	temp += myGrid[i][i - 1];

    temp += '\r\n';

    for( i = 1; i <= 5; i++ )
	temp += myGrid[i + 1][i - 1];

    temp += '\r\n';

    for( i = 0; i <= 3; i++ )
	temp += myGrid[i][Math.abs( i - 3 )]

    temp += '\r\n';

    for( i = 0; i <= 4; i++ )
	temp += myGrid[i][Math.abs( i - 3 )];

    temp += '\r\n';

    for( i = 0; i <= 4; i++ )
	temp += myGrid[i][Math.abs( i - 4 )];

    temp += '\r\n';

    for( i = 0; i <= 5; i++ )
	temp += myGrid[i][Math.abs( i - 5 )];

    temp += '\r\n';

    for( i = 0; i <= 5; i++ )
	temp += myGrid[i + 1][Math.abs( i - 5 )];

    temp += '\r\n';

    for( i = 0; i <= 4; i++ )
	temp += myGrid[i + 2][Math.abs( i - 5 )];

    temp += '\r\n';

    for( i = 0; i <= 3; i++ )
	temp += myGrid[i + 3][Math.abs( i - 5 )];

    if( temp.search( player + '' + player + '' + player + '' + player ) > -1 )
	won = true;

    if( won ) {
	alert( 'player ' + player + ' won' );
	initGrid();
    }
}

function getColor()
{
    player == 1 ? playerColor = 'yellow' : playerColor = 'red';
}

function dropCounter()
{
    // if column full, don't just move to next players turn
    // create counter function with color/radius parameter or a circle function
    getColor();
    if( xpos > xoffset + countR && xpos < (countR + countW * 7) - (xoffset) ) {
	if( gridpos == 0 && pos == 0 )
	    gridpos = (Math.round( (xpos - xoffset / 7) / 50 ) - 1);

	if( gridpos > -1 && gridpos < 7 ) {
	    duringDrop = true;
	    clear();
	    if( pos > 0 ) {
		cxt.fillStyle = 'white';
		cxt.beginPath();
		cxt.arc( countR + gridpos * countW + xoffset, ((countR + 50)
			+ (pos * 50) - 50 + yoffset)
			- countW, countR - 5, 0, Math.PI * 2, true );
		cxt.closePath();
		cxt.fill();
	    }

	    cxt.fillStyle = playerColor;
	    cxt.beginPath();
	    cxt.arc( countR + gridpos * countW + xoffset, (countR + 50)
		    + (pos * 50) - 50 + yoffset, countR - 5, 0, Math.PI * 2,
		    true );
	    cxt.closePath();
	    cxt.fill();
	    cxt.stroke();

	    cxt.beginPath();
	    cxt.arc( countR + gridpos * countW + xoffset, (countR + 50)
		    + (pos * 50) - 50 + yoffset, countR - 13, 0, Math.PI * 2,
		    true );
	    cxt.closePath();
	    cxt.fill();
	    cxt.stroke();

	    pos++;

	    if( (pos != 7 && myGrid[gridpos][pos - 1] < 1) )
		dropTicker = setTimeout( "dropCounter()", 50 );
	    else {
		pos -= 2;
		if( myGrid[gridpos][pos] == 0 )
		    myGrid[gridpos][pos] = player;
		clearTimeout( dropTicker );
		checkGrid();
		if( !won && myGrid[gridpos][pos] == player )
		    player == 1 ? player++ : player = 1;
		pos = 0;
		gridpos = 0;
		duringDrop = false;
	    }
	}
    }
}

function drawCounter( e )
{
    if( !duringDrop ) {
	getColor();
	xpos = e.pageX;
	ypos = e.pageY;
	cxt.fillStyle = "rgba(255,255,255,1)";
	cxt.fillRect( 10, 401, 200, 200 );
	cxt.stroke();
	cxt.fillStyle = "rgba(0,0,0,1)";
	cxt.font = "bold 16px sans-serif";
	cxt.fillText( 'player ' + player, 10, 416 );

	if( e.pageX > xoffset + countR + 10
		&& e.pageX < (countR + countW * 7) - (xoffset) ) {
	    clear();
	    cxt.fillStyle = playerColor;
	    cxt.beginPath();
	    cxt.arc( e.pageX - 10, (countR) + yoffset, countR - 5, 0,
		    Math.PI * 2, true );
	    cxt.closePath();
	    cxt.fill();
	    cxt.stroke();

	    cxt.beginPath();
	    cxt.arc( e.pageX - 10, (countR) + yoffset, countR - 13, 0,
		    Math.PI * 2, true );
	    cxt.closePath();
	    cxt.fill();
	    cxt.stroke();
	}
    }
}

function showGrid()
{
    var mytest = '';

    for( j = 0; j < 6; j++ )
	for( i = 0; i < 7; i++ ) {
	    if( (i % 7) == 0 )
		mytest += '\r\n';
	    mytest += myGrid[i][j];
	}
    alert( mytest );
}

function clearGrid()
{
    for( j = 0; j < 6; j++ )
	for( i = 0; i < 7; i++ )
	    myGrid[i][j] = 0;
}

function initGrid()
{
    won = false;
    gridpos = 0;
    pos = 0;
    clearGrid();
    cxt.fillStyle = "rgba(0,0,0,1)";
    cxt.font = "bold 20px sans-serif";
    cxt.fillText( "Original connect 4", 10, 20 );

    for( j = 1; j <= 6; j++ )
	for( i = 0; i < 7; i++ ) {
	    cxt.fillStyle = "rgba(0,0,255,1)";
	    cxt.fillRect( 0 + i * countW + xoffset, countW * j + yoffset,
		    countW, countW );
	    cxt.strokeRect( 0 + i * countW + xoffset, countW * j + yoffset,
		    countW, countW );
	    cxt.fillStyle = "rgba(255,255,255,1)";
	    cxt.beginPath();
	    cxt.arc( countR + i * countW + xoffset, (countR + 50) + (j * 50)
		    - 50 + yoffset, countR - 5, 0, Math.PI * 2, true );
	    cxt.closePath();
	    cxt.fill();
	    cxt.stroke();
	}
    cxt.fillStyle = "rgba(0,0,255,1)";
    cxt.fillRect( xoffset - 8, countW * 7 + yoffset, countW * 7 + 16, 20 );
    cxt.strokeRect( xoffset - 8, countW * 7 + yoffset, countW * 7 + 16, 20 );

    document.onmousemove = drawCounter;
    document.onclick = dropCounter;
}

