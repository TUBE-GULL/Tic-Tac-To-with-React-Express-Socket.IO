// "use strict";

// Object.defineProperty(exports, "__esModule", {
//   value: true
// });
// exports["default"] = void 0;
// var _react = _interopRequireDefault(require("react"));
// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// var GamePage = function GamePage() {
//   return /*#__PURE__*/
// };
// var _default = exports["default"] = GamePage;


"use strict";

import React from 'react';

const GamePage = () => {
  return (
    <body>
      {_react["default"].createElement("body", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "content"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "inform"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "timers"
      }, /*#__PURE__*/_react["default"].createElement("h1", null, "Timer"), /*#__PURE__*/_react["default"].createElement("p", {
        id: "timer"
      }, "00:00:00")), /*#__PURE__*/_react["default"].createElement("div", {
        className: "inform_user"
      }, /*#__PURE__*/_react["default"].createElement("h2", {
        id: "user"
      }, "name"))), /*#__PURE__*/_react["default"].createElement("table", {
        className: "table"
      }, /*#__PURE__*/_react["default"].createElement("tbody", {
        className: "tbody"
      }, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "stroke"
      }, /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }), /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }), /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      })), /*#__PURE__*/_react["default"].createElement("tr", {
        className: "stroke"
      }, /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }), /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }), /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      })), /*#__PURE__*/_react["default"].createElement("tr", {
        className: "stroke"
      }, /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }), /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }), /*#__PURE__*/_react["default"].createElement("th", {
        className: "cell"
      }))))))}
    </body>
  );
};

export default GamePage;