var resize = function(){
	$('.board').css('font-size', $('.square').height()*1.06)
	$('.square').css('line-height', -0.35+0.85*parseInt($('.board').css('font-size'))+'px')
}

$(window).on('resize', function() {
	resize();
})

$(document).on('ready', function() {
	resize();
});