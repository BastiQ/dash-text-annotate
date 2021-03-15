webpackHotUpdatedash_text_annotate("main",{

/***/ "./src/lib/components/DashTextAnnotate.react.js":
/*!******************************************************!*\
  !*** ./src/lib/components/DashTextAnnotate.react.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_text_annotate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-text-annotate */ "./node_modules/react-text-annotate/lib/index.js");
/* harmony import */ var react_text_annotate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_text_annotate__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */

var DashTextAnnotate = /*#__PURE__*/function (_Component) {
  _inherits(DashTextAnnotate, _Component);

  var _super = _createSuper(DashTextAnnotate);

  function DashTextAnnotate(props) {
    var _this;

    _classCallCheck(this, DashTextAnnotate);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleInputChange", function (e) {
      // get the value from the DOM node
      var newValue = e.target.value; // update the state!

      _this.setState({
        value: newValue
      });
    });

    _this.state = {
      value: 'default'
    };
    return _this;
  }

  _createClass(DashTextAnnotate, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          id = _this$props.id,
          label = _this$props.label,
          setProps = _this$props.setProps,
          value = _this$props.value;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_text_annotate__WEBPACK_IMPORTED_MODULE_2__["TokenAnnotator"], {
        tokens: ['My', 'text', 'needs', 'annotating', 'for', 'NLP', 'training'],
        value: [{
          start: 5,
          end: 6,
          tag: 'TOPIC',
          color: 'BLUE'
        }]
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        value: this.state.value,
        onChange: this.handleInputChange
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, this.state.value));
    }
  }]);

  return DashTextAnnotate;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

DashTextAnnotate.defaultProps = {};
DashTextAnnotate.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * A label that will be printed when this component is rendered.
   */
  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,

  /**
   * The value displayed in the input.
   */
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func
};
/* harmony default export */ __webpack_exports__["default"] = (DashTextAnnotate);

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXNoX3RleHRfYW5ub3RhdGUvLi9zcmMvbGliL2NvbXBvbmVudHMvRGFzaFRleHRBbm5vdGF0ZS5yZWFjdC5qcyJdLCJuYW1lcyI6WyJEYXNoVGV4dEFubm90YXRlIiwicHJvcHMiLCJlIiwibmV3VmFsdWUiLCJ0YXJnZXQiLCJ2YWx1ZSIsInNldFN0YXRlIiwic3RhdGUiLCJpZCIsImxhYmVsIiwic2V0UHJvcHMiLCJzdGFydCIsImVuZCIsInRhZyIsImNvbG9yIiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFDTUEsZ0I7Ozs7O0FBQ0YsNEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDZiw4QkFBTUEsS0FBTjs7QUFEZSx3RUFPQyxVQUFDQyxDQUFELEVBQU87QUFDdkI7QUFDQSxVQUFNQyxRQUFRLEdBQUdELENBQUMsQ0FBQ0UsTUFBRixDQUFTQyxLQUExQixDQUZ1QixDQUd2Qjs7QUFDQSxZQUFLQyxRQUFMLENBQWM7QUFDWkQsYUFBSyxFQUFFRjtBQURLLE9BQWQ7QUFHSCxLQWRrQjs7QUFFZixVQUFLSSxLQUFMLEdBQWE7QUFDWEYsV0FBSyxFQUFFO0FBREksS0FBYjtBQUZlO0FBS2xCOzs7O1dBV0Qsa0JBQVM7QUFBQSx3QkFDZ0MsS0FBS0osS0FEckM7QUFBQSxVQUNFTyxFQURGLGVBQ0VBLEVBREY7QUFBQSxVQUNNQyxLQUROLGVBQ01BLEtBRE47QUFBQSxVQUNhQyxRQURiLGVBQ2FBLFFBRGI7QUFBQSxVQUN1QkwsS0FEdkIsZUFDdUJBLEtBRHZCO0FBRUwsMEJBQ0k7QUFBSyxVQUFFLEVBQUVHO0FBQVQsc0JBQ0ksMkRBQUMsa0VBQUQ7QUFDSSxjQUFNLEVBQUUsQ0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLE9BQWYsRUFBd0IsWUFBeEIsRUFBc0MsS0FBdEMsRUFBNkMsS0FBN0MsRUFBb0QsVUFBcEQsQ0FEWjtBQUVJLGFBQUssRUFBRSxDQUFDO0FBQUNHLGVBQUssRUFBRSxDQUFSO0FBQVdDLGFBQUcsRUFBRSxDQUFoQjtBQUFtQkMsYUFBRyxFQUFFLE9BQXhCO0FBQWlDQyxlQUFLLEVBQUU7QUFBeEMsU0FBRDtBQUZYLFFBREosZUFLSTtBQUFPLGFBQUssRUFBRSxLQUFLUCxLQUFMLENBQVdGLEtBQXpCO0FBQWdDLGdCQUFRLEVBQUUsS0FBS1U7QUFBL0MsUUFMSixlQU1JLHNFQUFJLEtBQUtSLEtBQUwsQ0FBV0YsS0FBZixDQU5KLENBREo7QUFVSDs7OztFQTdCMEJXLCtDOztBQWdDL0JoQixnQkFBZ0IsQ0FBQ2lCLFlBQWpCLEdBQWdDLEVBQWhDO0FBRUFqQixnQkFBZ0IsQ0FBQ2tCLFNBQWpCLEdBQTZCO0FBQ3pCO0FBQ0o7QUFDQTtBQUNJVixJQUFFLEVBQUVXLGlEQUFTLENBQUNDLE1BSlc7O0FBTXpCO0FBQ0o7QUFDQTtBQUNJWCxPQUFLLEVBQUVVLGlEQUFTLENBQUNDLE1BQVYsQ0FBaUJDLFVBVEM7O0FBV3pCO0FBQ0o7QUFDQTtBQUNJaEIsT0FBSyxFQUFFYyxpREFBUyxDQUFDQyxNQWRROztBQWdCekI7QUFDSjtBQUNBO0FBQ0E7QUFDSVYsVUFBUSxFQUFFUyxpREFBUyxDQUFDRztBQXBCSyxDQUE3QjtBQXVCZXRCLCtFQUFmLEUiLCJmaWxlIjoiYmViOTVlYy1tYWluLXdwcy1obXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcclxuaW1wb3J0IHtUb2tlbkFubm90YXRvciwgVGV4dEFubm90YXRvcn0gZnJvbSAncmVhY3QtdGV4dC1hbm5vdGF0ZSdcclxuXHJcbi8qKlxyXG4gKiBFeGFtcGxlQ29tcG9uZW50IGlzIGFuIGV4YW1wbGUgY29tcG9uZW50LlxyXG4gKiBJdCB0YWtlcyBhIHByb3BlcnR5LCBgbGFiZWxgLCBhbmRcclxuICogZGlzcGxheXMgaXQuXHJcbiAqIEl0IHJlbmRlcnMgYW4gaW5wdXQgd2l0aCB0aGUgcHJvcGVydHkgYHZhbHVlYFxyXG4gKiB3aGljaCBpcyBlZGl0YWJsZSBieSB0aGUgdXNlci5cclxuICovXHJcbmNsYXNzIERhc2hUZXh0QW5ub3RhdGUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgIHZhbHVlOiAnZGVmYXVsdCdcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSW5wdXRDaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgICAgIC8vIGdldCB0aGUgdmFsdWUgZnJvbSB0aGUgRE9NIG5vZGVcclxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc3RhdGUhXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICB2YWx1ZTogbmV3VmFsdWVcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3Qge2lkLCBsYWJlbCwgc2V0UHJvcHMsIHZhbHVlfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD17aWR9PlxyXG4gICAgICAgICAgICAgICAgPFRva2VuQW5ub3RhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zPXtbJ015JywgJ3RleHQnLCAnbmVlZHMnLCAnYW5ub3RhdGluZycsICdmb3InLCAnTkxQJywgJ3RyYWluaW5nJ119XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e1t7c3RhcnQ6IDUsIGVuZDogNiwgdGFnOiAnVE9QSUMnLCBjb2xvcjogJ0JMVUUnfV19XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVJbnB1dENoYW5nZX0vPlxyXG4gICAgICAgICAgICAgICAgPHA+e3RoaXMuc3RhdGUudmFsdWV9PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5EYXNoVGV4dEFubm90YXRlLmRlZmF1bHRQcm9wcyA9IHt9O1xyXG5cclxuRGFzaFRleHRBbm5vdGF0ZS5wcm9wVHlwZXMgPSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxyXG4gICAgICovXHJcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgbGFiZWwgdGhhdCB3aWxsIGJlIHByaW50ZWQgd2hlbiB0aGlzIGNvbXBvbmVudCBpcyByZW5kZXJlZC5cclxuICAgICAqL1xyXG4gICAgbGFiZWw6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB2YWx1ZSBkaXNwbGF5ZWQgaW4gdGhlIGlucHV0LlxyXG4gICAgICovXHJcbiAgICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXHJcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXHJcbiAgICAgKi9cclxuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuY1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGFzaFRleHRBbm5vdGF0ZSJdLCJzb3VyY2VSb290IjoiIn0=