
ROSCONSOLE.WindowController = function(name_page) {
	// Create header
	var html_header = '<div data-role="header" data-theme="a" data-position="fixed">';
	html_header += '<h1>' + name_page + '</h1>';

	if (ROSCONSOLE.isMobile().any()) {
		html_header += '<a href="#menu" class="ui-btn ui-icon-bars ui-btn-icon-notext ui-corner-all">No text</a>';
	}
	/// Added a Codiad button
	html_header += '<a href="/Codiad" class="ui-btn ui-icon-edit ui-btn-right ui-btn-icon-notext ui-corner-all" target="_blank">No text</a>';
	html_header += '</div>';

	$(html_header).prependTo('body').enhanceWithin();

	// Add menu
	ROSCONSOLE.build_menu();

	//$( "[data-role='navbar']" ).navbar();
	$('[data-role="header"], [data-role="footer"]').toolbar({
		position: 'fixed',
		tapToggle: false
	});
	$('[data-role=panel]').panel().enhanceWithin();
	$.mobile.resetActivePageHeight();

	//-------------------------
	// Update the contents of the toolbars
	$('[data-role="navbar"] a:first').addClass('ui-btn-active');
	$(document).on('pageshow', '[data-role="page"]', function() {
		// Each of the four pages in this demo has a data-title attribute
		// which value is equal to the text of the nav button
		// For example, on first page: <div data-role="page" data-title="Info">
		var current = $(this).jqmData('title');
		// Change the heading
		// Remove active class from nav buttons
		$('[data-role="navbar"] a.ui-btn-active').removeClass('ui-btn-active');
		// Add active class to current nav button
		$('[data-role="navbar"] a').each(function() {
			if ($(this).text() === current) {
				$(this).addClass('ui-btn-active');
				$('#navbar').trigger('page', current);
			}
		});
	});
};

ROSCONSOLE.build_menu = function() {

	if (ROSCONSOLE.isMobile().any()) {
		$('body').append('<div data-role="panel" id="menu" data-theme="b" data-display="push"></div>');
	} else {
		$('[data-role="header"]').append('<div data-role="navbar" id="menu"></div>');
	}

	$('#menu').append(ROSCONSOLE.pages());
};
