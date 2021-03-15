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
          label = _this$props.label,
          setProps = _this$props.setProps,
          value = _this$props.value,
          text = _this$props.text,
          entities = _this$props.entities;
      console.log(entities); //{[{start: 5, end: 10, tag: 'TOPIC', color: 'GREEN'}]}

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, " React Text Annotate Component: "), "Enter field:", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        value: value,
        onChange: function onChange(e) {
          return setProps({
            value: e.target.value
          });
        }
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, " ", this.props.value, " "), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, " Annotator Experiments: "), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("select", {
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
   * The value displayed in the input.
   */
  value: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,

  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,

  /**
   * The text that should be annotated
   */
  text: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  //.isRequired,

  /**
   * The entities that are currently available
   */
  entities: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array //.arrayOf(PropTypes.string).isRequired 

};

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXNoX3RleHRfYW5ub3RhdGUvLi9zcmMvbGliL2NvbXBvbmVudHMvRGFzaFRleHRBbm5vdGF0ZS5yZWFjdC5qcyJdLCJuYW1lcyI6WyJEYXNoVGV4dEFubm90YXRlIiwicHJvcHMiLCJzdGF0ZSIsInRhZyIsImlkIiwibGFiZWwiLCJzZXRQcm9wcyIsInZhbHVlIiwidGV4dCIsImVudGl0aWVzIiwiY29uc29sZSIsImxvZyIsImUiLCJ0YXJnZXQiLCJzZXRTdGF0ZSIsIm1heFdpZHRoIiwibGluZUhlaWdodCIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImZ1bmMiLCJhcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0lBQ3FCQSxnQjs7Ozs7QUFFakIsNEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDZiw4QkFBTUEsS0FBTjtBQUNBLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxTQUFHLEVBQUU7QUFETSxLQUFiO0FBRmU7QUFLbEI7Ozs7V0FFRCxrQkFBUztBQUFBOztBQUFBLHdCQUNnRCxLQUFLRixLQURyRDtBQUFBLFVBQ0VHLEVBREYsZUFDRUEsRUFERjtBQUFBLFVBQ01DLEtBRE4sZUFDTUEsS0FETjtBQUFBLFVBQ2FDLFFBRGIsZUFDYUEsUUFEYjtBQUFBLFVBQ3VCQyxLQUR2QixlQUN1QkEsS0FEdkI7QUFBQSxVQUM4QkMsSUFEOUIsZUFDOEJBLElBRDlCO0FBQUEsVUFDb0NDLFFBRHBDLGVBQ29DQSxRQURwQztBQUVMQyxhQUFPLENBQUNDLEdBQVIsQ0FBWUYsUUFBWixFQUZLLENBR0w7O0FBRUEsMEJBQ0k7QUFBSyxVQUFFLEVBQUVMO0FBQVQsc0JBQ0ksMEdBREosK0JBR0k7QUFDSSxhQUFLLEVBQUVHLEtBRFg7QUFFSSxnQkFBUSxFQUFFLGtCQUFBSyxDQUFDO0FBQUEsaUJBQUlOLFFBQVEsQ0FBQztBQUFFQyxpQkFBSyxFQUFFSyxDQUFDLENBQUNDLE1BQUYsQ0FBU047QUFBbEIsV0FBRCxDQUFaO0FBQUE7QUFGZixRQUhKLGVBT0ksMkVBQUssS0FBS04sS0FBTCxDQUFXTSxLQUFoQixNQVBKLGVBU0ksa0dBVEosZUFVSTtBQUNJLGdCQUFRLEVBQUUsa0JBQUFLLENBQUM7QUFBQSxpQkFBSSxNQUFJLENBQUNFLFFBQUwsQ0FBYztBQUFFWCxlQUFHLEVBQUVTLENBQUMsQ0FBQ0MsTUFBRixDQUFTTjtBQUFoQixXQUFkLENBQUo7QUFBQSxTQURmO0FBRUksYUFBSyxFQUFFLEtBQUtMLEtBQUwsQ0FBV0M7QUFGdEIsc0JBSUk7QUFBUSxhQUFLLEVBQUM7QUFBZCxnQkFKSixlQUtJO0FBQVEsYUFBSyxFQUFDO0FBQWQsa0JBTEosQ0FWSixlQWlCSSwyREFBQyxpRUFBRDtBQUNJLGFBQUssRUFBRTtBQUNIWSxrQkFBUSxFQUFFLEdBRFA7QUFFSEMsb0JBQVUsRUFBRTtBQUZULFNBRFg7QUFLSSxlQUFPLEVBQUVSLElBTGI7QUFNSSxhQUFLLEVBQUVBO0FBTlgsa0JBT1dDLFFBUFgsRUFqQkosQ0FESjtBQTZCSDs7OztFQTNDeUNRLCtDOzs7QUE4QzlDakIsZ0JBQWdCLENBQUNrQixZQUFqQixHQUFnQyxFQUFoQztBQUVBbEIsZ0JBQWdCLENBQUNtQixTQUFqQixHQUE2QjtBQUN6QjtBQUNKO0FBQ0E7QUFDSWYsSUFBRSxFQUFFZ0IsaURBQVMsQ0FBQ0MsTUFKVzs7QUFNekI7QUFDSjtBQUNBO0FBQ0lkLE9BQUssRUFBRWEsaURBQVMsQ0FBQ0MsTUFUUTs7QUFXekI7QUFDSjtBQUNBO0FBQ0E7QUFDSWYsVUFBUSxFQUFFYyxpREFBUyxDQUFDRSxJQWZLOztBQWlCekI7QUFDSjtBQUNBO0FBQ0lkLE1BQUksRUFBRVksaURBQVMsQ0FBQ0MsTUFwQlM7QUFvQkQ7O0FBRXhCO0FBQ0o7QUFDQTtBQUNJWixVQUFRLEVBQUVXLGlEQUFTLENBQUNHLEtBekJLLENBeUJDOztBQXpCRCxDQUE3QixDIiwiZmlsZSI6IjYyNzZjYjktbWFpbi13cHMtaG1yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XHJcbmltcG9ydCB7VGV4dEFubm90YXRvcn0gZnJvbSAncmVhY3QtdGV4dC1hbm5vdGF0ZSdcclxuXHJcbi8qKlxyXG4gKiBMZWFybmluZ3M6XHJcbiAqIERvbid0IHRyeSB0byBwcmludCAoPHA+Li4pIGxpc3RzIG9yIGRpY3Rpb25hcmllcyBkaXJlY3RseVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGFzaFRleHRBbm5vdGF0ZSBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgIHRhZzogJ0RBVEUnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHsgXHJcbiAgICAgICAgY29uc3Qge2lkLCBsYWJlbCwgc2V0UHJvcHMsIHZhbHVlLCB0ZXh0LCBlbnRpdGllc30gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVudGl0aWVzKVxyXG4gICAgICAgIC8ve1t7c3RhcnQ6IDUsIGVuZDogMTAsIHRhZzogJ1RPUElDJywgY29sb3I6ICdHUkVFTid9XX1cclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD17aWR9PlxyXG4gICAgICAgICAgICAgICAgPGgyPiBSZWFjdCBUZXh0IEFubm90YXRlIENvbXBvbmVudDogPC9oMj5cclxuICAgICAgICAgICAgICAgIEVudGVyIGZpZWxkOlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFByb3BzKHsgdmFsdWU6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIDxwPiB7dGhpcy5wcm9wcy52YWx1ZX0gPC9wPlxyXG5cclxuICAgICAgICAgICAgICAgIDxoMj4gQW5ub3RhdG9yIEV4cGVyaW1lbnRzOiA8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMuc2V0U3RhdGUoeyB0YWc6IGUudGFyZ2V0LnZhbHVlIH0pfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnRhZ31cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiREFURVwiPkRBVEU8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSEVBREVSXCI+SEVBREVSPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDxUZXh0QW5ub3RhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41LFxyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudD17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGV4dH1cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17ZW50aXRpZXN9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5EYXNoVGV4dEFubm90YXRlLmRlZmF1bHRQcm9wcyA9IHt9O1xyXG5cclxuRGFzaFRleHRBbm5vdGF0ZS5wcm9wVHlwZXMgPSB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBJRCB1c2VkIHRvIGlkZW50aWZ5IHRoaXMgY29tcG9uZW50IGluIERhc2ggY2FsbGJhY2tzLlxyXG4gICAgICovXHJcbiAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB2YWx1ZSBkaXNwbGF5ZWQgaW4gdGhlIGlucHV0LlxyXG4gICAgICovXHJcbiAgICB2YWx1ZTogUHJvcFR5cGVzLnN0cmluZyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIERhc2gtYXNzaWduZWQgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgY2FsbGVkIHRvIHJlcG9ydCBwcm9wZXJ0eSBjaGFuZ2VzXHJcbiAgICAgKiB0byBEYXNoLCB0byBtYWtlIHRoZW0gYXZhaWxhYmxlIGZvciBjYWxsYmFja3MuXHJcbiAgICAgKi9cclxuICAgIHNldFByb3BzOiBQcm9wVHlwZXMuZnVuYyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSB0ZXh0IHRoYXQgc2hvdWxkIGJlIGFubm90YXRlZFxyXG4gICAgICovXHJcbiAgICB0ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLCAvLy5pc1JlcXVpcmVkLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGVudGl0aWVzIHRoYXQgYXJlIGN1cnJlbnRseSBhdmFpbGFibGVcclxuICAgICAqL1xyXG4gICAgZW50aXRpZXM6IFByb3BUeXBlcy5hcnJheSAvLy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLmlzUmVxdWlyZWQgXHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=