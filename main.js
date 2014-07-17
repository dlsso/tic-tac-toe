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
	var Player = function(name, type, ai, marker) {
		this.name = name
		this.type = type

		if(ai === "easyComputer"){
			this.ai = easyComputer
		}

		if(ai === "hardComputer"){
			this.ai = hardComputer
		}

		this.marker = marker
	}

	//	AI constructor
	//	================
	var Computer = function() {

		this.markChoice = function(choice, marker){
			console.log("choice was "+choice)
			cells.splice( choice, 1, marker )
			console.log(cells)

			$('.square[data-cell='+choice+']').html(marker)
		}

		this.move = function(board, marker, nextPlayer){
			
			this.markChoice(this.choose(), marker)
			if(checkWin()){ disableBoard() }
			else if(checkTie()){ disableBoard() }
			else{
				playerTurn = nextPlayer.name
				updateReadout(playerTurn + "\'s turn.")
			}
		}
	}


	//	Easy AI
	//	================
	var EasyComputer = function(){

		// Easy computer logic
		this.choose = function(board) {
			var choiceOrder = [4, 0, 8, 2, 6, 1, 5, 3, 7]
			for (var i = 0; i < choiceOrder.length; i++) {
				console.log(choiceOrder[i])
				if(!cells[choiceOrder[i]]){ return choiceOrder[i]}
			}
		}
	}
	EasyComputer.prototype = new Computer()
	EasyComputer.prototype.constructor = EasyComputer


	//	Hard AI
	//	================
	var HardComputer = function(){

		// Hard computer logic
		this.choose = function() {
			
		}
	}
	HardComputer.prototype = new Computer()
	HardComputer.prototype.constructor = HardComputer


	// Starts a new name: gets player name and type, resets board, attaches click handler
	var startGame = function(){
		player1 = new Player($('#player1-name').html(), $('#player1').val(), $('#player1').find(':selected').data('ai'), "×")
		player2 = new Player($('#player2-name').html(), $('#player2').val(), $('#player2').find(':selected').data('ai'), "○")
		// $('#player1-name').attr('contenteditable','false');
		// $('#player2-name').attr('contenteditable','false');
		$('#start').text("New game!")
		cells = [ NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]
		$('.square').empty()
		playerTurn = player1.name
		readout = player1.name + "\'s turn."
		if(player1.type !== "Human"){
			player1.ai.move(cells, player1.marker, player2)
		}
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

	var playerMove = function(player, nextPlayer, playerMarker) {
		if($(this).html() === ""){
			cells.splice($(this).data('cell'), 1, playerMarker)
			$(this).html(playerMarker)
			console.log(cells)
			
			if(checkWin()){ disableBoard() }
			else if(checkTie()){ disableBoard() }
			else{
				playerTurn = nextPlayer.name
				updateReadout(nextPlayer.name + "\'s turn.")
				if(nextPlayer.type !== "Human"){ nextPlayer.ai.move(cells, nextPlayer.marker, player) }
			}
		}
		else{updateReadout("You can't go there.")}
	}

	var placeMarker = function () {
		if(playerTurn === player1.name){
			playerMove.call(this, player1, player2, player1.marker)
		}

		else if(playerTurn === player2.name){
			playerMove.call(this, player2, player1, player2.marker)
		}

		else{updateReadout("Start a game first!")}
	}


	//	Declare Variables
	//	=================
	var readout = "Set player names and types and press start!"
	var playerTurn = {}
	var player1 = new Player()
	var player2 = new Player()
	var easyComputer = new EasyComputer()
	var hardComputer = new HardComputer()
	var cells = []


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