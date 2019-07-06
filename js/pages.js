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

var pages = pages || {
    REVISION: '0.1.0'
};

pages.controller = function(options) {
    options = options || {};
    map_type = options.map_type || '#map-type';
    // Initialization map
    $('#map-2D').hide();
    $('#map-3D').show();
    // Controller map button
    $(map_type).click(function() {
        console.log("Show map " + $(map_type).text());
        // Switch to 2D or 3D mode
        switch($(map_type).text()) {
            case '2D':
                $(map_type).text('3D');
                // Hide 3D map and show 2D map
                $('#map-2D').hide();
                $('#map-3D').show();
                break;
            case '3D':
                // Change text in 3D
                $(map_type).text('2D');
                // Hide 3D map and show 2D map
                $('#map-3D').hide();
                $('#map-2D').show();
                break;
        }
    });
}

pages.json = function() {
    json = {}
    for (var i = 0; i < localStorage.length; i++){
        var key = localStorage.key(i);
        json[key] = JSON.parse(localStorage.getItem(key));
    }
    return json;
}

pages.configuration = function(options) {
    options = options || {};
    var page = options.page || '#config';
    var area = options.area || '#config-area';
    var save = options.save || '#config-save';

    // Update configuration only the page is selected
    $(document).on( "pagebeforeshow", page, function( event ) {
        // Load json configuration
        json = pages.json();
        // Export json in text file
        var config_text = JSON.stringify(json, null, 4);
        $(area).text(config_text);
    });
    
    // Single initialization maps
    $(document).ready(function () {
        // Click button
        $('a[href="' + save + '"]').click(function() {
            $("<a />", {
                "download": "config.json",
                "href" : "data:application/json," + encodeURIComponent(JSON.stringify(pages.json()))
            }).appendTo("body")
            .click(function() {
                $(this).remove()
            })[0].click()
        });
    });
}

pages.size = function() {
    // Evaluate content size
    // Reference:
    // https://stackoverflow.com/questions/21552308/set-content-height-100-jquery-mobile
	var screen = $.mobile.getScreenHeight();
    var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
    var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
    /* content div has padding of 1em = 16px (32px top+bottom). This step
       can be skipped by subtracting 32px from content var directly. */
    var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
    var width = $(".ui-content").outerWidth() - 32;
    var height = screen - header - footer - contentCurrent - 6;
    return {'width': width, 'height': height};
}
