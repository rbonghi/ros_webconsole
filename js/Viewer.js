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

var Viewer = Viewer || {
    REVISION: '0.0.1'
};

Viewer.Map3D = function(options) {
    options = options || {};
    var divID = options.divID || '#threed-map';
    
    options.pages.register("3Dmap", function() { console.log("TEST")});
};

Viewer.Map3D.prototype.show = function() {
    console.log("Hello");
};
