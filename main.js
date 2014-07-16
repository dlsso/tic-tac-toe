var ticTacToe = (function() {
	
	//==========================================================//
	//					Setup goes here							//
	//==========================================================//			
	var resize = function() {
		// Set font size to scale with square height
		$('.board').css('font-size', $('.square').height()*1.06)

		// Set line height to scale with font size so centering doesn't break
		$('.square').css('line-height', 0.75*parseInt($('.board').css('font-size'))+'px')
	}

	// Updates readout when passed a string
	var updateReadout = function(string) {
		$('.readout').empty().append(string)
	}

	// Player constructor
	var Player = function(name, type) {
		this.name = name;
		this.type = type;
	}

	var startGame = function(){
		player1 = new Player($('#player1-name').html(), $('#player1').val())
		player2 = new Player($('#player2-name').html(), $('#player2').val())
		// $('#player1-name').attr('contenteditable','false');
		// $('#player2-name').attr('contenteditable','false');
		$('#start').text("New game!")
		cells = [ NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]
		$('.square').empty()
		playerTurn = player1.name
		readout = player1.name + "\'s turn."
		$('.square').on('click', function(){
			placeMarker.call(this)
		})
		updateReadout(readout)
	}

	var checkWin = function() {
		if(														// Check if 3 in a row on:
			   cells[0] === cells[1] && cells[1] === cells[2]	// Top row
			|| cells[3] === cells[4] && cells[4] === cells[5]	// Middle row
			|| cells[6] === cells[7] && cells[7] === cells[8]	// Bottom row
			|| cells[0] === cells[3] && cells[3] === cells[6]	// First column
			|| cells[1] === cells[4] && cells[4] === cells[7]	// Second column
			|| cells[2] === cells[5] && cells[5] === cells[8]	// Third column
			|| cells[0] === cells[4] && cells[4] === cells[8]	// Diagonal down
			|| cells[6] === cells[4] && cells[4] === cells[2]	// Diagonal up
		){
			updateReadout(playerTurn + " wins!")
			return true	
		}
	}

	var checkTie = function() {
		var l = cells.length
		var turnsPlayed = 0
		while(l--){ if(cells[l]){turnsPlayed++}	}
		if(turnsPlayed === 9){
			updateReadout("It's a tie!")
			return true
		}
	}

	var disableBoard = function() {
		$('.square').off('click')
	}

	var playerMove = function(player, nextPlayer, marker) {
		if($(this).html() === ""){
			cells.splice($(this).data('cell'), 1, marker)
			$(this).html(marker)
			
			if(checkWin()){ disableBoard() }
			else if(checkTie()){ disableBoard() }
			else{
				playerTurn = nextPlayer.name
				updateReadout(nextPlayer.name + "\'s turn.")
			}
		}
		else{updateReadout("You can't go there.")}
	}

	var placeMarker = function () {
		if(playerTurn === player1.name){
			playerMove.call(this, player1, player2, "×")
		}

		else if(playerTurn === player2.name){
			playerMove.call(this, player2, player1, "○")
		}

		else{updateReadout("Start a game first!")}
	}


	//	Declare Variables
	//	=================
	var readout = "Set player names and types and press start!"
	var playerTurn = {}
	var player1 = new Player()
	var player2 = new Player()
	var cells = []

	var easyComputer = function() {

	}



	//==========================================================//
	//					Run things in here						//
	//==========================================================//
	var init = function() {
		resize();	// Runs size adjustment when page loads
		$(window).on('resize', resize) // Runs again whenever page is resized
		updateReadout(readout)	//	Loads starting readout

		$('#start').on('click', function(){
			startGame()
		})
	}

	// Allows init to be called from the outside
	return {init: init}
})();


// When the page loads
$(document).on('ready', function() {
	ticTacToe.init();
});