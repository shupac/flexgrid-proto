define(function(require, exports, module) {
    'use strict';

    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');

    var FlexGrid = require('views/FlexGrid');

    var mainContext = Engine.createContext();

    var flexGrid = new FlexGrid({
        gutter: [20, 50],
        itemSize: [200, 100]
    });

    mainContext.add(flexGrid);

    var surfaces = [];

    for (var i = 0; i < 12; i++) {
        var surface = new Surface({
            size: [200, 100],
            properties: {
                backgroundColor: "hsl(" + (i * 360 / 12) + ", 100%, 50%)"
            }
        });

        surfaces.push(surface);
    }

    flexGrid.sequenceFrom(surfaces);
});
