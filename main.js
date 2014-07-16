var ticTacToe = (function() {
	
	//					//
	// Setup goes here	//
	//					//					
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
		$('.square').empty()
		playerTurn = player1.name
		readout = player1.name + "\'s turn."
		updateReadout(readout)
	}

	var placeMarker = function () {
		if(playerTurn === player1.name){
			if($(this).html() === ""){
				cells.splice($(this).data('cell'), 1, "×")
				$(this).html("×")
				playerTurn = player2.name
				updateReadout(player2.name + "\'s turn.")
			}
			else{
				updateReadout("You can't go there.")
			}
		}
		else if(playerTurn === player2.name){
			if($(this).html() === ""){
				cells.splice($(this).data('cell'), 1, "○")
				$(this).html("○")
				playerTurn = player1.name
				updateReadout(player1.name + "\'s turn.")
			}
			else{updateReadout("You can't go there.")}
		}
		else{updateReadout("Start a game first!")}
	}

	var readout = "Set player names and types and press start!"
	var playerTurn = {}
	var player1 = new Player()
	var player2 = new Player()
	var cells = [ NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN ]




	//====================
	// Run things in here
	//====================
	var init = function() {
		resize();	// Runs size adjustment when page loads
		$(window).on('resize', resize) // Runs again whenever page is resized
		updateReadout(readout)	//	Loads starting readout

		$('#start').on('click', function(){
			startGame()
		})

		// Want to pull this out to "placeMarker"
		$('.square').on('click', function(){
			placeMarker.call(this)
		})
	}

	// Allows init to be called from the outside
	return {init: init}
})();


// When the page loads
$(document).on('ready', function() {
	ticTacToe.init();
});