

ROSCONSOLE.RadioController = function(divID, nav) {

	var that = this;
  this.divID = divID;
	this.controllers = [];
/*
  var radio_controller = '<form id="nav-controller">' +
    '<fieldset id="map2d-controller" data-role="controlgroup">' +
    '<legend>Vertical:</legend>' +
    '<input type="radio" name="radio-choice-v-2" id="radio-position" value="on" checked="checked">' +
    '<label for="radio-position">Set robot position</label>' +
    '<input type="radio" name="radio-choice-v-2" id="radio-map-editor" value="off">' +
    '<label for="radio-map-editor">Map editor</label>' +
    '</fieldset>' +
    '</form>';
    */
		this.controllers.push({
      radio_name: 'zoom',
			name: 'Zoom',
			func_run: function (e) {
				nav.setControlType('scroll');
			},
			func_stop: function (e) {
				nav.setControlType('disable');
			}
		});
		this.controllers.push({
      radio_name: 'goal',
			name: 'Set goal',
			func_run: function (e) {
				nav.setControlType('goal');
			},
			func_stop: function (e) {
				nav.setControlType('disable');
			}
		});
		// Launch all function
    $( divID  ).bind( 'change', function( e ) {
			var name = e.target.id.replace(/^radio-map-/, '');
			var i = 0;
			for(i = 0; i < that.controllers.length; i++) {
				if (typeof that.controllers[i].func_stop !== null) {
					that.controllers[i].func_stop.call(this, e);
				}
			}
			for(i = 0; i < that.controllers.length; i++) {
				if(that.controllers[i].radio_name === name) {
					that.controllers[i].func_run.call(this, e);
					return;
				}
			}
    });
};


ROSCONSOLE.RadioController.prototype.addController = function(options) {
	options = options || {};
	var radio_name = options.radio_name;
	var name = options.name;
	this.controllers.push({
		radio_name: radio_name,
		name: name,
		func_run: options.func_run || null,
		func_stop: options.func_stop || null
		});
  var controller =  '<input type="radio" name="radio-choice-v-2" id="radio-map-' + radio_name + '" value="off">' +
    '<label for="radio-map-' + radio_name + '">' + name + '</label>';

   $( this.divID + ' fieldset' ).append(controller).trigger('create');
};
