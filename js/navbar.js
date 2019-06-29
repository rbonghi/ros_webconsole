/* 
 * This file is part of the ros_webconsole package (https://github.com/rbonghi/ros_webconsole or http://rnext.it).
 * Copyright (c) 2019 Raffaello Bonghi.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

var ros_pages = ros_pages || {
    REVISION: '0.0.1'
};

ros_pages.find = function() {
	// Find pages
	var find_pages = $('div:jqmData(role="page")');
	var pages = []
	// Load all informations
	for (var i = 0; i < find_pages.length; i++) {
	    var page = {'name': $(find_pages[i]).jqmData('title'),
	                'icon': $(find_pages[i]).jqmData('icon'),
	                'id': $(find_pages[i]).attr('id')};
	    pages.push(page);
	}
    return pages;
}

ros_pages.connect = function(e) {
    console.log("Connect: " + e);
    //$( '#ros-config' ).hide();
}

ros_pages.error = function(e) {
    console.log("Error: " + e);
    //$( '#ros-config' ).show();
}

ros_pages.controller = function(name, pages) {
    // Make pages
    // ros_pages.make(pages);
    // Make header
    ros_pages.header(name, pages);
    // Add footer
    ros_pages.footer();

    // Fix header
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
}

ros_pages.isMobile = function() {
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};
	return isMobile;
}

ros_pages.navbar = function(pages) {
    var bar = "";
    // Make menu
    if (pages.length > 0) {
        bar += '<ul>';
        for(var i = 0; i < pages.length; i++) {
            // Extract properties
            var id = pages[i].id;
            var name = pages[i].name;
            var icon = pages[i].icon;
            // Add element
            var element = '<li><a href="#' + id + '" data-icon="' + icon + '" data-transition="fade">' + name + '</a></li>';
            // add in string
            bar += element;
        }
        bar += '</ul>';
    }
    return bar;
}

ros_pages.header = function(name, pages) {
    // Build navbar
    var bar = ros_pages.navbar(pages);
    // Build header
    var header = '<div data-role="header" data-theme="a" data-position="fixed">' +
                 '<h1>' + name + '</h1>' + 
                 '<a href="#configpanel" id="ros-config" class="ui-btn ui-icon-gear ui-btn-icon-notext ui-corner-all">Config</a>' +
                 '<div data-role="navbar" id="menu">' + bar + '</div>' +
                 '</div>';
    // Append header
    $(header).prependTo('body').enhanceWithin();
}

ros_pages.footer = function() {
    var footer = '<div data-role="footer" data-theme="a">' +
                    '<p>RB</p>' +
                 '</div>';
    $(footer).prependTo('body').enhanceWithin();
}

ros_pages.make = function(pages) {
    newPages = '';
    for(var i = 0; i < pages.length; i++) {
        var name = pages[i].name;
        newPages += '<div data-role="page" id="' + name + '" data-title="' + name +'" data-icon="navigation">' + 
                        '<h1>' + name + '</h1>' +
                    '</div>';
    }
    // Append header
    $(newPages).prependTo('body').enhanceWithin();
}
