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

pages.controller = function(name, pages) {
    // Initialization map
    $('#map-2D').hide();
    $('#map-3D').show();
    // Controller map button
    $('#map').click(function() {
        console.log("Show map " + $('#map').text());
        // Switch to 2D or 3D mode
        switch($('#map').text()) {
            case '3D':
                $('#map').text('2D');
                // Hide 3D map and show 2D map
                $('#map-2D').hide();
                $('#map-3D').show();
                break;
            case '2D':
                // Change text in 3D
                $('#map').text('3D');
                // Hide 3D map and show 2D map
                $('#map-3D').hide();
                $('#map-2D').show();
                break;
        }
    });
}

pages.loadconfig = function(file, callback) {
    $.getJSON( file ).done(function( json ) {
        console.log(file + ' loaded!');
        callback(json);
    }).fail(function( jqxhr, textStatus, error ) {
        console.log(file + ' does not exist!');
        callback({});
    });
}
