'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _requestAnimationFrame_ = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : function (cb) {
    return cb();
};
var _cancelAnimationFrame_ = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : function (cb) {
    return cb();
};

var Clamp = function (_React$Component) {
    _inherits(Clamp, _React$Component);

    function Clamp(props) {
        _classCallCheck(this, Clamp);

        var _this = _possibleConstructorReturn(this, (Clamp.__proto__ || Object.getPrototypeOf(Clamp)).call(this, props));

        _this.adjustIntervalHandler = null;
        _this.requestAnimationFrameHandler = null;
        _this.rawContextText = null;
        _this.autoAdjustInterval = 300;

        if (Number.isInteger(_this.props.autoAdjustInterval)) _this.autoAdjustInterval = Math.abs(_this.props.autoAdjustInterval);
        return _this;
    }

    _createClass(Clamp, [{
        key: '_getWrapRect_',
        value: function _getWrapRect_() {
            return this.refs.wrap.getBoundingClientRect();
        }
    }, {
        key: '_getContextRect_',
        value: function _getContextRect_() {
            return this.refs.context.getBoundingClientRect();
        }
    }, {
        key: 'adjustContext',
        value: function adjustContext(callback) {
            var _this2 = this;

            this.refs.context.innerHTML = this.rawContextText;

            var heightOfWrap = this._getWrapRect_().height;
            var heightOfContext = this._getContextRect_().height;

            if (heightOfContext > heightOfWrap) {
                var text = this.rawContextText;
                var ellipsis = this.props.ellipsis || '';

                var low = 0,
                    high = text.length,
                    mid = void 0;
                var count = 0;

                var clamp = function clamp() {
                    if (count > 100) return;
                    count++;

                    mid = (low + high) / 2 | 0;
                    var _text = text.slice(0, mid);
                    _this2.refs.context.innerHTML = _text + ellipsis;

                    var contextHeight = _this2._getContextRect_().height;
                    var wrapHeight = _this2._getWrapRect_().height;

                    if (contextHeight > wrapHeight) {
                        high = mid - 1;
                    } else {
                        low = mid + 1;
                    }

                    if (low <= high) {
                        _this2.requestAnimationFrameHandler = _requestAnimationFrame_(clamp);
                    } else {
                        _this2.refs.context.innerHTML = _text.slice(0, mid - 1) + ellipsis;
                        typeof callback === 'function' && callback();
                    }
                };

                clamp();
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            this.rawContextText = this.refs.context.innerText;
            this.adjustContext();

            if (this.autoAdjustInterval > 0) {
                var prevWidthOfWrap = null;
                var prevHeightOfWrap = null;
                this.adjustIntervalHandler = setInterval(function () {
                    var widthOfWrap = _this3._getWrapRect_().width;
                    var heightOfWrap = _this3._getWrapRect_().height;

                    if (prevWidthOfWrap !== widthOfWrap || prevHeightOfWrap !== heightOfWrap) {
                        _this3.adjustContext(function () {
                            prevWidthOfWrap = widthOfWrap;
                            prevHeightOfWrap = heightOfWrap;
                        });
                    }
                }, this.autoAdjustInterval);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.adjustIntervalHandler);
            _cancelAnimationFrame_(this.requestAnimationFrameHandler);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: this.props.className, ref: 'wrap', style: this.props.style },
                _react2.default.createElement(
                    'div',
                    { ref: 'context', className: this.props.innerClassName, style: this.props.innerStyle,
                        dangerouslySetInnerHTML: this.props.dangerouslySetInnerHTML },
                    this.props.children
                )
            );
        }
    }]);

    return Clamp;
}(_react2.default.Component);

exports.default = Clamp;