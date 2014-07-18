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

	// Don't allow user to select another computer if one has been selected already
	var disableMultipleComputers = function() {
		$('select').on('change', function(){
			if($('#player1').find(':selected')[0].text !== "Human"){
				$('#player2 option:not(:first-child)').prop("disabled",true)
			}
			else{
				$('#player2 option').prop("disabled",false)
			}
			if($('#player2').find(':selected')[0].text !== "Human"){
				$('#player1 option:not(:first-child)').prop("disabled",true)
			}
			else{
				$('#player1 option').prop("disabled",false)
			}
		})
	}

	// Updates readout when passed a string
	var updateReadout = function(string) {
		$('.readout').empty().append(string)
	}

	// Player constructor
	var Player = function(name, type, ai, marker) {
		this.name = name
		this.type = type
		this.marker = marker
		if(ai === "easyComputer"){
			this.ai = easyComputer
		}
		else if(ai === "hardComputer"){
			this.ai = hardComputer
		}
	}

	//	AI constructor
	//	================
	var Computer = function() {

	}
	Computer.prototype.markChoice = function(choice, marker){
		cells.splice( choice, 1, marker )
		$('.square[data-cell='+choice+']').html(marker)
	}
	Computer.prototype.move = function(board, marker, nextPlayer, nextPlayerMarker){
		this.markChoice(this.choose(board, marker, nextPlayerMarker), marker)
		if(checkWin()){ disableBoard() }
		else if(checkTie()){ disableBoard() }
		else{
			playerTurn = nextPlayer.name
			updateReadout(playerTurn + "\'s turn.")
		}
	}


	//	Easy AI
	//	================
	var EasyComputer = function(){

		// Easy computer choosing method
		this.choose = function() {
			var choiceOrder = [4, 0, 8, 2, 6, 1, 5, 3, 7]
			for (var i = 0; i < choiceOrder.length; i++) {
				if(!cells[choiceOrder[i]]){ return choiceOrder[i]}
			}
		}
	}
	EasyComputer.prototype = new Computer()
	EasyComputer.prototype.constructor = EasyComputer


	//	Hard AI
	//	================
	var HardComputer = function(){

		var minimax = function(depth, player, board, aiMarker, oppMarker) {	// the value passed for player is the marker
			var nextMoves = findMoves(board)					// Gets availible moves
			if(player === aiMarker){ var bestScore = -5000}
			else{ var bestScore = 5000}
			var bestMove = -1

			if(nextMoves.length === 0 || depth === 0){
				bestScore = boardScore(board, aiMarker, oppMarker)
			}
			else{
				for (var i = 0; i < nextMoves.length; i++) {	// For each move in nextMoves I want to put player marker in board
					board.splice( nextMoves[i], 1, player )		// This is currently splicing x into list of possible choices
					if(player === aiMarker) {	// Computer will be maximizing
						currentScore = minimax(depth - 1, oppMarker, board, aiMarker, oppMarker)[0]		//minimax[0] is the return value bestScore of minimax
						if(currentScore > bestScore) {
							bestScore = currentScore
							bestMove = nextMoves[i]
						}
					}
					else {	// Opponent is minimizing player
						currentScore = minimax(depth -1, aiMarker, board, aiMarker, oppMarker)[0]
						if(currentScore < bestScore) {
							bestScore = currentScore
							bestMove = nextMoves[i]
						}
					}
					board.splice( nextMoves[i], 1, NaN )	// Undoes move
				}
			}
			return [bestScore, bestMove]
		}

		var findMoves = function(board) {
			var nextMoves = []
			if(checkWin()) { return nextMoves}
			for (var i = 0; i < board.length; i++) {
				if(!board[i]) {
					nextMoves.push(i)
				}
			}
			return nextMoves
		}


		var boardScore = function(board, aiMarker, oppMarker) {
			var score = 0
			score += lineScore([cells[0], cells[1], cells[2]], aiMarker, oppMarker)	// Get score of row 1
			score += lineScore([cells[3], cells[4], cells[5]], aiMarker, oppMarker)	// Get score of row 2
			score += lineScore([cells[6], cells[7], cells[8]], aiMarker, oppMarker)	// Get score of row 3
			score += lineScore([cells[0], cells[3], cells[6]], aiMarker, oppMarker)	// Get score of column 1
			score += lineScore([cells[1], cells[4], cells[7]], aiMarker, oppMarker)	// Get score of column 2
			score += lineScore([cells[2], cells[5], cells[8]], aiMarker, oppMarker)	// Get score of column 3
			score += lineScore([cells[0], cells[4], cells[8]], aiMarker, oppMarker)	// Get score of diagonal down
			score += lineScore([cells[6], cells[4], cells[2]], aiMarker, oppMarker)	// Get score of diagonal up
			return score
		}
		var lineScore = function(line, aiMarker, oppMarker) {
			var aiCount = 0
			var oppCount = 0
			var score = 0

			// Get the number of AI markers and opponent markers in the line
			for (var i = 0; i < line.length; i++) {
				if(line[i] === aiMarker){aiCount++}
				if(line[i] === oppMarker){oppCount++}
			};
			// Assign points on lines that only one player has played on
			if(oppCount === 0 && aiCount > 0){
				if(aiCount === 1){score = 1}
				if(aiCount === 2){score = 20}
				if(aiCount === 3){score = 1000}
			}
			if(aiCount === 0 && oppCount > 0){
				if(oppCount === 1){score = -1}
				if(oppCount === 2){score = -20}
				if(oppCount === 3){score = -1000}
			}
			return score
		}

		this.choose = function(board, aiMarker, oppMarker) {
			if(board.indexOf("×") === -1){
				var choice = 0
				var corner = Math.floor(Math.random() * 4) + 1
				if(corner === 1){ choice = 0}
				else if(corner === 2){ choice = 2}
				else if(corner === 3){ choice = 6}
				else if(corner === 4){ choice = 8}
				return choice
			}
			return minimax(4, aiMarker, board, aiMarker, oppMarker)[1]
		}
	}
	HardComputer.prototype = new Computer()
	HardComputer.prototype.constructor = HardComputer


	// Starts a new name: gets player name and type, resets board, attaches click handler
	var startGame = function(){
		disableBoard()
		player1 = new Player($('#player1-name').html(), $('#player1').val(), $('#player1').find(':selected').data('ai'), "×")
		player2 = new Player($('#player2-name').html(), $('#player2').val(), $('#player2').find(':selected').data('ai'), "○")
		$('#start').text("New game!")
		cells = [ NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]
		$('.square').empty()
		playerTurn = player1.name
		readout = player1.name + "\'s turn."
		if(player1.type !== "Human"){
			player1.ai.move(cells, player1.marker, player2, player2.marker)
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

	// better if "this" was passed as a varible all the way back from the click
	var playerMove = function(player, nextPlayer, playerMarker, nextPlayerMarker) {
		if($(this).html() === ""){
			cells.splice($(this).data('cell'), 1, playerMarker)
			$(this).html(playerMarker)
			if(checkWin()){ disableBoard() }
			else if(checkTie()){ disableBoard() }
			else{
				playerTurn = nextPlayer.name
				updateReadout(nextPlayer.name + "\'s turn.")
				if(nextPlayer.type !== "Human"){ nextPlayer.ai.move(cells, nextPlayer.marker, player, player.marker) }
			}
		}
		else{updateReadout("You can't go there.")}
	}
	
	var placeMarker = function () {
		if(playerTurn === player1.name){
			playerMove.call(this, player1, player2, player1.marker, player2.marker)
		}

		else if(playerTurn === player2.name){
			playerMove.call(this, player2, player1, player2.marker, player1.marker)
		}

		else{ console.log("Error: playerTurn not set properly.") }
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
		disableMultipleComputers()

	}

	// Allows init and start to be called from the outside
	return {
		init: init,
		start: startGame
	}
})();


// When the page loads
$(document).on('ready', function() {
	ticTacToe.init();
	$('#start').on('click', function(){
		ticTacToe.start()
	})
});

//===============================================================
//	Potential additions:
//	Add random corner selection for hard AI 	--DONE--
//	Disable user select of board 				--DONE--
//	Make it prettier
//	Add medium AI
//	Pass Computer cells[], assign to instance (via this.cells), then refer to this.cells
//	Move all methods to prototypes
//	Frenzy mode: 9 games at once, 30 seconds per turn
//