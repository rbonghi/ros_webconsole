

ROSCONSOLE.build_navbar = function() {

    // Find pages
    var find_pages = $('div:jqmData(role="page")');
    // Create navbar
    var mini_nav = ROSCONSOLE.isMobile().any() ? 'data-iconpos="left"' : '';
    var html_navbar = '<div data-role="navbar" id="navbar"' + mini_nav + '>' + '<ul>';
    for (var i = 0; i < find_pages.length; i++) {
        html_navbar += '<li>' +
        '<a href="#' + $(find_pages[i]).attr('id') + '" data-icon="' + $(find_pages[i]).jqmData('icon') +
        '" data-transition="fade"' + '>' +
        $(find_pages[i]).jqmData('title') + '</a>' + '</li>';
    }
    html_navbar += '</ul>' + '</div>';
    return html_navbar;
};
