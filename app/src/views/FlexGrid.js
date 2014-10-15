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

        this._cachedWidth;
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

    function _reflow(width) {
        if (!this._items) return;

        var positions = _calcPositions.call(this, width);
        _animate.call(this, positions);

        this._eventOutput.emit('reflow');
    }

    function _calcPositions(width) {
        var positions = [];

        this._numCols = Math.floor((width - 2 * this.options.margin[0] + this.options.gutter[0])/(this.options.gutter[0] + this.options.itemSize[0]));

        var col = 0;
        var row = 0;
        var xPos;
        var yPos;

        for (var i = 0; i < this._items.length; i++) {
            xPos = this.options.margin[0] + col * (this.options.gutter[0] + this.options.itemSize[0]);
            yPos = this.options.margin[1] + row * (this.options.gutter[1] + this.options.itemSize[1]);

            positions.push([xPos, yPos]);

            col ++;
            if (col === this._numCols) {
                row++;
                col = 0;
            }
        }

        return positions;
    }

    function _animate(positions) {
        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            if (this._modifiers[i] === undefined) _createModifier.call(this, i, position);
            else _animateModifier.call(this, i, position);
        }
    }

    function _createModifier(index, position, opacity) {
        var transform = new TransitionableTransform(Transform.translate.apply(null, position));

        var modifier = new Modifier({
            transform: transform,
            size: this.options.itemSize
        });

        this._states[index] = transform;
        this._modifiers[index] = modifier;
    }

    function _animateModifier(index, position, opacity) {
        var transform = this._states[index];
        transform.halt();
        transform.setTranslate(position, this.options.transition);
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
        var width = size[0];

        var specs = [];

        if (this._cachedWidth !== width) {
            _reflow.call(this, width);
            this._cachedWidth = width;
        }

        for (var i = 0; i < this._modifiers.length; i++) {
            var item = this._items[i];
            var spec = this._modifiers[i].modify({
                target: item.render()
            });
            specs.push(spec);
        }

        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: specs
        };
    };

    module.exports = FlexGrid;
});
