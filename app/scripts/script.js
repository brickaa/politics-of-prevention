$(function () {
	var $window = $(window),
		$stickyEl = $('.sticky'),
		$wrapperEl = $('.nav-images'),
		elTop = $wrapperEl.offset().top;
	$window.scroll(function () {
		$stickyEl.toggleClass('nav-hide', $window.scrollTop() < elTop);
	});

});

$(document).ready(function() {
	$(".story-wrapper").fitVids();
	$('.flexslider').flexslider({
		slideshow: false,
		prevText: " ",
		nextText: " "
	});
    $('.flexslider').fitVids();
    $('.read-more').addClass('hide');

	// Set up the toggle.
	$('.read-more-toggle').on('click', function() {
	  $('.read-more').toggleClass('hide');
	  $('.read-more-toggle').toggleClass('hide');
	});
});
