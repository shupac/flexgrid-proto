define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');

    function FlexGrid() {
        View.apply(this, arguments);

        this._cachedWidth;
        this._cachedSpec;

        this.id = Entity.register(this);
    }

    FlexGrid.prototype = Object.create(View.prototype);
    FlexGrid.prototype.constructor = FlexGrid;

    FlexGrid.DEFAULT_OPTIONS = {
        margin: [0, 0],
        gutter: [0, 0],
        itemSize: [0, 0],
        transition: false
    };

    function _reflow(size) {
        var spec = [];

        if (!this._items) return;

        var width = size[0];
        numCols = Math.floor((width - 2 * this.options.margin[0] + this.options.gutter[0])/(this.options.gutter[0] + this.options.itemSize[0]));

        var col = 0;
        var row = 0;
        var xPos;
        var yPos;
        var numCols;

        for (var i = 0; i < this._items.length; i++) {
            xPos = this.options.margin[0] + col * (this.options.gutter[0] + this.options.itemSize[0]);
            yPos = this.options.margin[1] + row * (this.options.gutter[1] + this.options.itemSize[1]);

            spec.push({
                target: this._items[i].render(),
                transform: Transform.translate(xPos, yPos, 0)
            });

            col ++;
            if (col === numCols) {
                row++;
                col = 0;
            }
        }

        this._eventOutput.emit('reflow');
        return spec;
    }

    FlexGrid.prototype.sequenceFrom = function sequenceFrom(items) {
        this._items = items;
    };

    FlexGrid.prototype.render = function render() {
        return this.id;
    };

    FlexGrid.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        if (this._cachedWidth !== size[0]) {
            this._cachedSpec = _reflow.call(this, size);
            this._cachedWidth = size[0];
        }

        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: this._cachedSpec
        };
    };

    module.exports = FlexGrid;
});
