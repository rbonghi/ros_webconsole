/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function arrows(keyCode) {
    var key;
    switch (keyCode) {
        case 65://37:    //Left
            key = $(".left-key");
            break;
        case 87://38:    //Up
            key = $(".up-key");
            break;
        case 68://39:    //Right
            key = $(".right-key");
            break;
        case 83://40:    //Down
            key = $(".down-key");
            break;
        case 32:
            key = $(".space-key");
            break;
        default:
            key = null;

    }
    return key;
}

function keyboard() {
    $(document).keydown(function(e) {
        var key = arrows(e.keyCode);
        if (key !== null) {
            key.addClass('ui-btn-active');
            key.trigger("click");
        }
    });
    $(document).keyup(function(e) {
        var key = arrows(e.keyCode);
        if (key !== null) {
            key.removeClass('ui-btn-active');
        }
    });
}
