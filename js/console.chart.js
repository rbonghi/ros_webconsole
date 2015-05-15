/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function dataPlot(dimension) {

    dimension = dimension || 50;
    this.time = [];
    this.data = [];
    this.lastData = 0;

    for (var i = 0; i < dimension; i++) {
        this.time.push(-1);
        this.data.push(0);
    }

    this.updateArray = function(lastData, time) {
        time = time || -1;

        if (this.data.length >= dimension) {
            this.data = this.data.slice(1);
            this.time = this.time.slice(1);
        }
        this.time.push(time);
        this.lastData = lastData;
        this.data.push(lastData);
    };

    this.getLast = function() {
        return this.lastData;
    };

    this.updatePlot = function() {
        var res = [];
        for (var i = 0; i < this.data.length; ++i) {
            if (this.time[i] === -1) {
                res.push([i, this.data[i]]);
            } else {
                res.push([this.time[i], this.data[i]]);
            }
        }
        return res;
    };

};