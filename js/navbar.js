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

ros_pages.controller = function(options) {
    options = options || {};
    var name = options.name || 'ROS Web console';
    var pages = options.pages || ros_pages.find();
    var footer = (('footer' in options) ? options.footer : true);
    // Make pages
    // ros_pages.make(pages);
    // Make header
    ros_pages.header(name, pages);
    // Add footer
    console.log(options);
    if(footer) {
        ros_pages.footer();
    }
    // Fix header
	$('[data-role="header"], [data-role="footer"]').toolbar({
		position: 'fixed',
		tapToggle: false
	});
	$('[data-role=panel]').panel().enhanceWithin();
	$.mobile.resetActivePageHeight();
	//-------------------------
	// Update the contents of the toolbars
	$(document).on('pageshow', '[data-role="page"]', function() {
	    // Take current value
		var current = '#' + $(this).attr('id');
		var title = $(this).jqmData('title');
		// Add title
		//$('#header-title').text(name + " - " + title);
		// Add active class to current nav button
		$('[data-role="navbar"] a').each(function() {
			if ($(this).attr('href') == current) {
			    //console.log("Add active to: " + current);
				$(current).addClass('ui-btn-active');
				$('#navbar').trigger('page', current);
			} else {
			    $(current).removeClass('ui-btn-active');
			}
		});
	});

}

ros_pages.connect = function(color) {
    $('[data-role="header"]').css('background-color', color);
}

ros_pages.error = function(color) {
    // Change color
    $('[data-role="header"]').css('background-color', color);
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

ros_pages.header = function(name, pages) {
    // Build navbar
    var bar = ros_pages.navbar(pages);
    // Build header
    var header = '<div data-role="header" data-theme="a" data-position="fixed">' +
                 '<h1 id="header-title">' + name + '</h1>' + 
                 '<a href="#configpanel" id="ros-config" class="ui-btn ui-icon-gear ui-btn-icon-notext ui-corner-all">Config</a>' +
                 '<div data-role="navbar" id="menu" data-theme="a" data-iconpos="left">' + bar + '</div>' +
                 '</div>';
    // Append header
    $(header).prependTo('body').enhanceWithin();
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
