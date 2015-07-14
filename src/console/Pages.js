

ROSCONSOLE.pages = function() {

	// Find pages
	var find_pages = $('div:jqmData(role="page")');
	// Create navbar
	var html_navbar = '';
	if (ROSCONSOLE.isMobile().any()) {
		html_navbar = '<ul data-role="listview">';
	} else {
		html_navbar = '<ul>';
	}

	for (var i = 0; i < find_pages.length; i++) {
		html_navbar += '<li>' +
			'<a href="#' + $(find_pages[i]).attr('id') + '" data-icon="' + $(find_pages[i]).jqmData('icon') +
			'" data-transition="fade"' + '>' +
			$(find_pages[i]).jqmData('title') + '</a>' + '</li>';
	}
	html_navbar += '</ul>';
	return html_navbar;
};
