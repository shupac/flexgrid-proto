define(function(require, exports, module) {
    'use strict';

    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Scrollview = require('famous/views/Scrollview');

    var AppConfig = require('AppConfig');
    var AppConfig = require('AppConfigFlex');

    var FlexGrid = require('views/FlexGrid');

    var mainContext = Engine.createContext();
    var scrollview = new Scrollview();
    var flexGrid = new FlexGrid(AppConfig);

    mainContext.add(scrollview);
    scrollview.sequenceFrom([flexGrid]);
    Engine.pipe(scrollview);

    var surfaces = [];
    var numItems = 3;

    for (var i = 0; i < numItems; i++) {
        var surface = new Surface({
            properties: {
                backgroundColor: "hsl(" + (i * 360 / numItems) + ", 100%, 50%)"
            }
        });

        surfaces.push(surface);
    }

    flexGrid.sequenceFrom(surfaces);
});
