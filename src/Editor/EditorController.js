

ROSCONSOLE.initEditor = function(map_editor, button_pos) {
  var editor_buttons = '<div id="editor">' +
      '<div id="editor-map-control" data-role="controlgroup" data-type="horizontal">' +
        '<a href="#undo" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-top">Undo</a>' +
        '<a href="#forward" class="ui-btn ui-corner-all ui-icon-forward ui-btn-icon-top">Redo</a>' +
      '</div>' +
      '<div id="sliders">' +
        '<form>' +
          '<label for="map-editor-thickness">Thickness:</label>' +
          '<input type="range" name="Thickness" class="map-editor-thickness" min="1" max="10" step="0.5" value="' + map_editor.strokeSize + '" data-highlight="true">' +
        '</form>' +
      '</div>' +
      '<form id="TypeControl">' +
        '<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">' +
          '<legend>Type:</legend>' +
          '<input type="radio" name="radio-choice-h-6" id="radio-obstacle" value="on" checked="checked">' +
          '<label for="radio-obstacle">Obstacle</label>' +
          '<input type="radio" name="radio-choice-h-6" id="radio-checked" value="off">' +
          '<label for="radio-checked">Checked</label>' +
          '<input type="radio" name="radio-choice-h-6" id="radio-unknown" value="other">' +
          '<label for="radio-unknown">Unknown</label>' +
        '</fieldset>' +
      '</form>' +
    '</div>';
  /*
  var buttons = '<div data-role="controlgroup" data-type="horizontal" data-mini="true">' +
      '<a href="#" class="ui-btn ui-corner-all ui-icon-forbidden ui-btn-icon-top">Obstacle</a>' +
      '<a href="#" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-top">Checked</a>' +
      '<a href="#" class="ui-btn ui-corner-all ui-icon-action ui-btn-icon-top">Unknown</a>' +
      '</div>';
  */

  $(button_pos).append(editor_buttons).trigger('create');
  $('#editor').hide();

  $('#editor-map-control a').mousedown(function(e) {
      $(this).addClass('ui-btn-active');
      console.log($(e.target).attr('href').replace(/^#/, ''));
      switch($(e.target).attr('href').replace(/^#/, '')){
          case 'undo':
            map_editor.undo();
            break;
          case 'forward':
            map_editor.redo();
            break;
      }
      //actions($(e.target).attr('href').replace(/^#/, ""));
  }).mouseup(function(e) {
      $(this).removeClass('ui-btn-active');
  });

  $( '#TypeControl' ).bind( 'change', function( e ) {
      //console.log("Check:" + e.target.id);
      switch(e.target.id) {
          case 'radio-obstacle':
              map_editor.strokeColor = createjs.Graphics.getRGB(0, 0, 0);
              break;
          case 'radio-checked':
              map_editor.strokeColor = createjs.Graphics.getRGB(255, 255, 255);
              break;
          case 'radio-unknown':
              map_editor.strokeColor = createjs.Graphics.getRGB(127, 127, 127);
              break;
      }
  });

  $('#sliders .map-editor-thickness').on('slidestop', function(event, ui) {
      map_editor.strokeSize = $('#sliders .map-editor-thickness').val();
      //console.log(map_editor.strokeSize);
  });
};
