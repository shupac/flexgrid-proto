define(function(require, exports, module) {
    var Easing = require('famous/transitions/Easing');

    module.exports = {
        minCol: 2,
        sideMargin: 50,
        topMargin: 50,
        rowGutter: 20,
        colGutter: 40,
        itemSize: [150, 100],
        transition: {
            curve: Easing.outBack,
            duration: 500
        },
        numItems: 24
    };
});
