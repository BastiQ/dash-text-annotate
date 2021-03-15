webpackHotUpdatedash_text_annotate("main",{

/***/ "./src/lib/components/DashTextAnnotate.react.js":
/*!******************************************************!*\
  !*** ./src/lib/components/DashTextAnnotate.react.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DashTextAnnotate; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_text_annotate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-text-annotate */ "./node_modules/react-text-annotate/lib/index.js");
/* harmony import */ var react_text_annotate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_text_annotate__WEBPACK_IMPORTED_MODULE_2__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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




/**
 * Learnings:
 * Don't try to print (<p>..) lists or dictionaries directly
 */

var DashTextAnnotate = /*#__PURE__*/function (_Component) {
  _inherits(DashTextAnnotate, _Component);

  var _super = _createSuper(DashTextAnnotate);

  function DashTextAnnotate(props) {
    var _this;

    _classCallCheck(this, DashTextAnnotate);

    _this = _super.call(this, props);
    _this.state = {
      tag: 'DATE'
    };
    return _this;
  }

  _createClass(DashTextAnnotate, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          id = _this$props.id,
          setProps = _this$props.setProps,
          text = _this$props.text,
          entities = _this$props.entities,
          tag = _this$props.tag,
          tag_color = _this$props.tag_color;
      console.log(entities); //{[{start: 5, end: 10, tag: 'TOPIC', color: 'GREEN'}]}
      // TODO: Remove selector from here and add to Dash as bootstrap component

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, " Annotator Experiments: "), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
        onChange: function onChange(e) {
          return _this2.setState({
            tag: e.target.value
          });
        },
        value: this.state.tag
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: "DATE"
      }, "DATE"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
        value: "HEADER"
      }, "HEADER")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_text_annotate__WEBPACK_IMPORTED_MODULE_2__["TextAnnotator"], _defineProperty({
        style: {
          maxWidth: 500,
          lineHeight: 1.5
        },
        content: text,
        value: text
      }, "value", entities)));
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
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,

  /**
   * The text that should be annotated
   */
  text: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,

  /**
   * The entities that are currently available
   */
  entities: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array,

  /**
   * The currently selected tag (e.g. DATE) with which the selections will be tagged. This must be managed by the Dash App.
   */
  tag: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,

  /**
   * The currently selected tag color (e.g. GREEN) with which the selected tag will be colored. This must be managed by the Dash App.
   */
  tag_color: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXNoX3RleHRfYW5ub3RhdGUvLi9zcmMvbGliL2NvbXBvbmVudHMvRGFzaFRleHRBbm5vdGF0ZS5yZWFjdC5qcyJdLCJuYW1lcyI6WyJEYXNoVGV4dEFubm90YXRlIiwicHJvcHMiLCJzdGF0ZSIsInRhZyIsImlkIiwic2V0UHJvcHMiLCJ0ZXh0IiwiZW50aXRpZXMiLCJ0YWdfY29sb3IiLCJjb25zb2xlIiwibG9nIiwiZSIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJtYXhXaWR0aCIsImxpbmVIZWlnaHQiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJmdW5jIiwiaXNSZXF1aXJlZCIsImFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7SUFDcUJBLGdCOzs7OztBQUVqQiw0QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUNmLDhCQUFNQSxLQUFOO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLFNBQUcsRUFBRTtBQURNLEtBQWI7QUFGZTtBQUtsQjs7OztXQUVELGtCQUFTO0FBQUE7O0FBQUEsd0JBQ2tELEtBQUtGLEtBRHZEO0FBQUEsVUFDRUcsRUFERixlQUNFQSxFQURGO0FBQUEsVUFDTUMsUUFETixlQUNNQSxRQUROO0FBQUEsVUFDZ0JDLElBRGhCLGVBQ2dCQSxJQURoQjtBQUFBLFVBQ3NCQyxRQUR0QixlQUNzQkEsUUFEdEI7QUFBQSxVQUNnQ0osR0FEaEMsZUFDZ0NBLEdBRGhDO0FBQUEsVUFDcUNLLFNBRHJDLGVBQ3FDQSxTQURyQztBQUVMQyxhQUFPLENBQUNDLEdBQVIsQ0FBWUgsUUFBWixFQUZLLENBR0w7QUFDQTs7QUFFQSwwQkFDSTtBQUFLLFVBQUUsRUFBRUg7QUFBVCxzQkFDSSxrR0FESixlQUVJO0FBQ0ksZ0JBQVEsRUFBRSxrQkFBQU8sQ0FBQztBQUFBLGlCQUFJLE1BQUksQ0FBQ0MsUUFBTCxDQUFjO0FBQUVULGVBQUcsRUFBRVEsQ0FBQyxDQUFDRSxNQUFGLENBQVNDO0FBQWhCLFdBQWQsQ0FBSjtBQUFBLFNBRGY7QUFFSSxhQUFLLEVBQUUsS0FBS1osS0FBTCxDQUFXQztBQUZ0QixzQkFJSTtBQUFRLGFBQUssRUFBQztBQUFkLGdCQUpKLGVBS0k7QUFBUSxhQUFLLEVBQUM7QUFBZCxrQkFMSixDQUZKLGVBU0ksMkRBQUMsaUVBQUQ7QUFDSSxhQUFLLEVBQUU7QUFDSFksa0JBQVEsRUFBRSxHQURQO0FBRUhDLG9CQUFVLEVBQUU7QUFGVCxTQURYO0FBS0ksZUFBTyxFQUFFVixJQUxiO0FBTUksYUFBSyxFQUFFQTtBQU5YLGtCQU9XQyxRQVBYLEVBVEosQ0FESjtBQXFCSDs7OztFQXBDeUNVLCtDOzs7QUF1QzlDakIsZ0JBQWdCLENBQUNrQixZQUFqQixHQUFnQyxFQUFoQztBQUVBbEIsZ0JBQWdCLENBQUNtQixTQUFqQixHQUE2QjtBQUN6QjtBQUNKO0FBQ0E7QUFDSWYsSUFBRSxFQUFFZ0IsaURBQVMsQ0FBQ0MsTUFKVzs7QUFNekI7QUFDSjtBQUNBO0FBQ0E7QUFDSWhCLFVBQVEsRUFBRWUsaURBQVMsQ0FBQ0UsSUFWSzs7QUFZekI7QUFDSjtBQUNBO0FBQ0loQixNQUFJLEVBQUVjLGlEQUFTLENBQUNDLE1BQVYsQ0FBaUJFLFVBZkU7O0FBaUJ6QjtBQUNKO0FBQ0E7QUFDSWhCLFVBQVEsRUFBRWEsaURBQVMsQ0FBQ0ksS0FwQks7O0FBc0J6QjtBQUNKO0FBQ0E7QUFDS3JCLEtBQUcsRUFBRWlCLGlEQUFTLENBQUNDLE1BQVYsQ0FBaUJFLFVBekJFOztBQTJCekI7QUFDSjtBQUNBO0FBQ0lmLFdBQVMsRUFBRVksaURBQVMsQ0FBQ0M7QUE5QkksQ0FBN0IsQyIsImZpbGUiOiJjN2NlNzlkLW1haW4td3BzLWhtci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xyXG5pbXBvcnQge1RleHRBbm5vdGF0b3J9IGZyb20gJ3JlYWN0LXRleHQtYW5ub3RhdGUnXHJcblxyXG4vKipcclxuICogTGVhcm5pbmdzOlxyXG4gKiBEb24ndCB0cnkgdG8gcHJpbnQgKDxwPi4uKSBsaXN0cyBvciBkaWN0aW9uYXJpZXMgZGlyZWN0bHlcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhc2hUZXh0QW5ub3RhdGUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICB0YWc6ICdEQVRFJ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7IFxyXG4gICAgICAgIGNvbnN0IHtpZCwgc2V0UHJvcHMsIHRleHQsIGVudGl0aWVzLCB0YWcsIHRhZ19jb2xvcn0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVudGl0aWVzKVxyXG4gICAgICAgIC8ve1t7c3RhcnQ6IDUsIGVuZDogMTAsIHRhZzogJ1RPUElDJywgY29sb3I6ICdHUkVFTid9XX1cclxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgc2VsZWN0b3IgZnJvbSBoZXJlIGFuZCBhZGQgdG8gRGFzaCBhcyBib290c3RyYXAgY29tcG9uZW50XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9e2lkfT5cclxuICAgICAgICAgICAgICAgIDxoMj4gQW5ub3RhdG9yIEV4cGVyaW1lbnRzOiA8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMuc2V0U3RhdGUoeyB0YWc6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnRhZ31cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiREFURVwiPkRBVEU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSEVBREVSXCI+SEVBREVSPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDxUZXh0QW5ub3RhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41LFxyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudD17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZW50aXRpZXN9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5EYXNoVGV4dEFubm90YXRlLmRlZmF1bHRQcm9wcyA9IHt9O1xyXG5cclxuRGFzaFRleHRBbm5vdGF0ZS5wcm9wVHlwZXMgPSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxyXG4gICAgICovXHJcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXHJcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXHJcbiAgICAgKi9cclxuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB0ZXh0IHRoYXQgc2hvdWxkIGJlIGFubm90YXRlZFxyXG4gICAgICovXHJcbiAgICB0ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZW50aXRpZXMgdGhhdCBhcmUgY3VycmVudGx5IGF2YWlsYWJsZVxyXG4gICAgICovXHJcbiAgICBlbnRpdGllczogUHJvcFR5cGVzLmFycmF5LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCB0YWcgKGUuZy4gREFURSkgd2l0aCB3aGljaCB0aGUgc2VsZWN0aW9ucyB3aWxsIGJlIHRhZ2dlZC4gVGhpcyBtdXN0IGJlIG1hbmFnZWQgYnkgdGhlIERhc2ggQXBwLlxyXG4gICAgICovXHJcbiAgICAgdGFnOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHRhZyBjb2xvciAoZS5nLiBHUkVFTikgd2l0aCB3aGljaCB0aGUgc2VsZWN0ZWQgdGFnIHdpbGwgYmUgY29sb3JlZC4gVGhpcyBtdXN0IGJlIG1hbmFnZWQgYnkgdGhlIERhc2ggQXBwLlxyXG4gICAgICovXHJcbiAgICB0YWdfY29sb3I6IFByb3BUeXBlcy5zdHJpbmcsXHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=