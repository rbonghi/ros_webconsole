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

/**
 * Reference:
 * https://remysharp.com/2007/04/12/how-to-detect-when-an-external-library-has-loaded
 */
function loadExtScript(src, test, callback) {
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    head.appendChild(s);

    var callbackTimer = setInterval(function() {
        var call = false;
        try {
            call = test.call();
        } catch (e) {}

        if (call) {
            clearInterval(callbackTimer);
            callback.call();
        }
    }, 100);
}

function loadExtLink(src) {
    var head = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href =  src;
    link.media = 'all';
    head.appendChild(link);
}

function loadcenter(callback) {
    // Init counter
    var counter = 0;
	var scripts = [{'type': 'script', 'src': 'https://code.jquery.com/jquery-2.1.1.min.js',
	                'test': function() {return (window.jQuery)} },
				   {'type': 'script', 'src': 'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js',
				    'test': function() {return ($.mobile)} },
				   {'type': 'link', 'src': 'http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css'},
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/EventEmitter2/current/eventemitter2.min.js',
				    'test': function() {return true } },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/roslibjs/current/roslib.min.js',
				    'test': function() {return (ROSLIB.REVISION)} },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/EaselJS/current/easeljs.min.js',
				    'test': function() {return true } },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/ros2djs/current/ros2d.min.js',
				    'test': function() {return true } },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/threejs/current/three.min.js',
				    'test': function() {return true } },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/threejs/current/STLLoader.js',
				    'test': function() {return true } },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/threejs/current/ColladaLoader.js',
				    'test': function() {return true } },
				   {'type': 'script', 'src': 'https://static.robotwebtools.org/ros3djs/current/ros3d.js',
				    'test': function() {return true } },
			        ];
    if(!window.jQuery) {
        // Load all scripts
        for(let s of scripts) {
	        // Load scripts
	        switch(s.type) {
	            case 'script':
	                loadExtScript(s.src, s.test, function() {
		                counter += 1;
		                if(counter == scripts.length) { callback.call() }
	                })
	                break;
	            case 'link':
        	        loadExtLink(s.src);
                    counter += 1;
                    if(counter == scripts.length) { callback.call() }
        	        break;
	        }
        }
    } else {
        callback.call()
    }
}
