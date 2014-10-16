define(function(require, exports, module) {
    var Easing = require('famous/transitions/Easing');

    module.exports = {
        flexGutter: true,
        minCol: 3,
        sideMargin: 0,
        topMargin: 0,
        rowGutter: 0,
        colGutter: 20,
        itemSize: [200, 400],
        transition: {
            curve: Easing.outBack,
            duration: 500
        },
        numItems: 3
    };
});
