define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Entity = require('famous/core/Entity');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    function FlexGrid() {
        View.apply(this, arguments);

        this._cachedWidth = null;
        this._height = null;
        this._modifiers = [];
        this._states = [];

        this.id = Entity.register(this);
    }

    FlexGrid.prototype = Object.create(View.prototype);
    FlexGrid.prototype.constructor = FlexGrid;

    FlexGrid.DEFAULT_OPTIONS = {
        flexGutter: false,
        minCol: 2,
        topMargin: 0,
        sideMargin: 0,
        colGutter: 0,
        rowGutter: 0,
        itemSize: [0, 0],
        transition: false
    };

    function _reflow(width) {
        if (!this._items) return;

        var states = this.options.flexGutter ?
            _calcFlexSpacing.call(this, width) :
            _calcSpacing.call(this, width);
        _animate.call(this, states);

        this._eventOutput.emit('reflow');
    }

    function _calcSpacing(width) {
        var colGutter = this.options.colGutter;
        var itemSize = this.options.itemSize;
        var ySpacing = colGutter + itemSize[0];

        var numCols = Math.min(Math.floor((width - 2 * this.options.sideMargin + colGutter)/(ySpacing)), this._items.length);
        var sideMargin = Math.max(this.options.sideMargin, (width - numCols * ySpacing + colGutter)/2);

        return _calcStates.call(this, numCols, ySpacing, sideMargin, width);
    }

    function _calcFlexSpacing(width) {
        var colGutter = this.options.colGutter;
        var itemSize = this.options.itemSize;
        var sideMargin = this.options.sideMargin;

        var numCols = Math.min(Math.floor((width - 2 * sideMargin + colGutter)/(colGutter + itemSize[0])), this._items.length);
        colGutter = numCols > 1 ? Math.round((width - 2 * sideMargin - numCols * itemSize[0])/(numCols - 1)) : 0;
        var ySpacing = itemSize[0] + colGutter;

        return _calcStates.call(this, numCols, ySpacing, sideMargin, width);
    }

    function _calcStates(numCols, ySpacing, sideMargin, width) {
        var positions = [];
        var size = this.options.itemSize;
        var col = 0;
        var row = 0;
        var xPos;
        var yPos;

        if (numCols < this.options.minCol) {
            numCols = 1;
            sideMargin = 0;
            size = [width, this.options.itemSize[1]];
        }

        for (var i = 0; i < this._items.length; i++) {
            xPos = sideMargin + col * ySpacing;
            yPos = this.options.topMargin + row * (this.options.rowGutter + this.options.itemSize[1]);

            positions.push([xPos, yPos]);

            col ++;
            if (col === numCols) {
                row++;
                col = 0;
            }

            this._height = yPos
        }

        this._height += this.options.itemSize[1] + this.options.topMargin;

        return {
            positions: positions,
            size: size
        };
    }

    function _animate(states) {
        var size = states.size;
        for (var i = 0; i < states.positions.length; i++) {
            var position = states.positions[i];

            if (this._modifiers[i] === undefined) _createModifier.call(this, i, position, size);
            else _animateModifier.call(this, i, position, size);
        }
    }

    function _createModifier(index, position, size) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.translate.apply(null, position)),
            size: new Transitionable((size || this.options.itemSize))
        }

        var modifier = new Modifier({
            transform: transitionItem.transform,
            size: transitionItem.size
        });

        this._states[index] = transitionItem;
        this._modifiers[index] = modifier;
    }

    function _animateModifier(index, position, size) {
        var transformTransitionable = this._states[index].transform;
        var sizeTransitionable = this._states[index].size;
        transformTransitionable.halt();
        sizeTransitionable.halt();
        transformTransitionable.setTranslate(position, this.options.transition);
        sizeTransitionable.set(size, this.options.transition);
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

    FlexGrid.prototype.getSize = function getSize() {
        if (!this._height) return;
        return [this._cachedWidth, this._height];
    };

    module.exports = FlexGrid;
});
