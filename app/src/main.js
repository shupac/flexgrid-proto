define(function(require, exports, module) {
    'use strict';

    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Easing = require('famous/transitions/Easing');

    var FlexGrid = require('views/FlexGrid');

    var mainContext = Engine.createContext();

    var flexGrid = new FlexGrid({
        gutter: [20, 50],
        itemSize: [200, 100],
        transition: {
            curve: Easing.outBack,
            duration: 500
        }
    });

    mainContext.add(flexGrid);

    var surfaces = [];

    for (var i = 0; i < 24; i++) {
        var surface = new Surface({
            size: [200, 100],
            properties: {
                backgroundColor: "hsl(" + (i * 360 / 24) + ", 100%, 50%)"
            }
        });

        surfaces.push(surface);
    }

    flexGrid.sequenceFrom(surfaces);
});
