define(function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var EventHandler = require('famous/core/EventHandler');
    var Modifier = require('famous/core/Modifier');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var View = require('famous/core/View');

    function FlexGrid() {
        View.apply(this, arguments);

        this._width;
        this._modifiers = [];
        this._states = [];
        this._numCols;
        this._activeCount = 0;

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
        console.log('reflow')
        var spec = [];

        if (!this._items) return;

        var width = size[0];
        this._numCols = Math.floor((width - 2 * this.options.margin[0] + this.options.gutter[0])/(this.options.gutter[0] + this.options.itemSize[0]));

        var col = 0;
        var row = 0;
        var xPos;
        var yPos;

        for (var i = 0; i < this._items.length; i++) {
            xPos = this.options.margin[0] + col * (this.options.gutter[0] + this.options.itemSize[0]);
            yPos = this.options.margin[1] + row * (this.options.gutter[1] + this.options.itemSize[1]);

            spec.push({
                target: this._items[i].render(),
                transform: Transform.translate(xPos, yPos, 0)
            });

            col ++;
            if (col === this._numCols) {
                row++;
                col = 0;
            }
        }

        this._specs = spec;
        this._eventOutput.emit('reflow');
    }

    FlexGrid.prototype.render = function render() {
        return this.id;
    };

    FlexGrid.prototype.sequenceFrom = function sequenceFrom(items) {
        this._items = items;
    };

    FlexGrid.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        if (this._width !== size[0]) {
            _reflow.call(this, size);
            this._width = size[0];
        }

        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: this._specs
        };
    };

    module.exports = FlexGrid;
});
