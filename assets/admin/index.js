function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$2() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$2;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X$1 = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X$1, e = Xj;
      X$1 = null;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Xj;
      X$1 = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X$1 = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X$1) throw Error(p(160));
      Zj(f2, g, e);
      X$1 = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Activity = createLucideIcon("Activity", [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownUp = createLucideIcon("ArrowDownUp", [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["path", { d: "m21 8-4-4-4 4", key: "1c9v7m" }],
  ["path", { d: "M17 4v16", key: "7dpous" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRightLeft = createLucideIcon("ArrowRightLeft", [
  ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
  ["path", { d: "M20 7H4", key: "zbl0bi" }],
  ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
  ["path", { d: "M4 17h16", key: "g4d7ey" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ban = createLucideIcon("Ban", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNoAxesColumn = createLucideIcon("ChartNoAxesColumn", [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronUp = createLucideIcon("ChevronUp", [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copy = createLucideIcon("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eraser = createLucideIcon("Eraser", [
  [
    "path",
    {
      d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
      key: "182aya"
    }
  ],
  ["path", { d: "M22 21H7", key: "t4ddhn" }],
  ["path", { d: "m5 11 9 9", key: "1mo9qw" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ExternalLink = createLucideIcon("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderTree = createLucideIcon("FolderTree", [
  [
    "path",
    {
      d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
      key: "hod4my"
    }
  ],
  [
    "path",
    {
      d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
      key: "w4yl2u"
    }
  ],
  ["path", { d: "M3 5a2 2 0 0 0 2 2h3", key: "f2jnh7" }],
  ["path", { d: "M3 3v13a2 2 0 0 0 2 2h3", key: "k8epm1" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Globe = createLucideIcon("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GripVertical = createLucideIcon("GripVertical", [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Layers = createLucideIcon("Layers", [
  [
    "path",
    {
      d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
      key: "8b97xw"
    }
  ],
  ["path", { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", key: "dd6zsq" }],
  ["path", { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65", key: "ep9fru" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Link = createLucideIcon("Link", [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LoaderCircle = createLucideIcon("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelsTopLeft = createLucideIcon("PanelsTopLeft", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pencil = createLucideIcon("Pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Percent = createLucideIcon("Percent", [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19", key: "1x9vlm" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5", key: "4mh3h7" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5", key: "1mdrzq" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCcw = createLucideIcon("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Save = createLucideIcon("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shield = createLucideIcon("Shield", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Smartphone = createLucideIcon("Smartphone", [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tag = createLucideIcon("Tag", [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WandSparkles = createLucideIcon("WandSparkles", [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const TYPE_ORDER = ["Page", "Post Category", "Post", "Product Category", "Product"];
const getTypeLabel = (type) => {
  if (type === "Page") return "Pages";
  if (type === "Post Category") return "Post Categories";
  if (type === "Post") return "Posts";
  if (type === "Product Category") return "Product Categories";
  if (type === "Product") return "Products";
  return type;
};
const formatTagLabel = (nickname, domain, affiliateId, index) => {
  const parts = [];
  if (nickname) parts.push(nickname);
  if (domain) parts.push(domain);
  if (affiliateId) parts.push(affiliateId);
  return parts.length > 0 ? parts.join(" | ") : `Tag #${index}`;
};
const amazonDomains = [
  { value: "amazon.com", label: "amazon.com (USA)" },
  { value: "amazon.co.uk", label: "amazon.co.uk (UK)" },
  { value: "amazon.de", label: "amazon.de (Germany)" },
  { value: "amazon.fr", label: "amazon.fr (France)" },
  { value: "amazon.co.jp", label: "amazon.co.jp (Japan)" },
  { value: "amazon.ca", label: "amazon.ca (Canada)" },
  { value: "amazon.it", label: "amazon.it (Italy)" },
  { value: "amazon.es", label: "amazon.es (Spain)" },
  { value: "amazon.in", label: "amazon.in (India)" },
  { value: "amazon.com.au", label: "amazon.com.au (Australia)" },
  { value: "amazon.com.br", label: "amazon.com.br (Brazil)" },
  { value: "amazon.com.mx", label: "amazon.com.mx (Mexico)" },
  { value: "amazon.nl", label: "amazon.nl (Netherlands)" },
  { value: "amazon.sg", label: "amazon.sg (Singapore)" },
  { value: "amazon.ae", label: "amazon.ae (UAE)" },
  { value: "amazon.sa", label: "amazon.sa (Saudi Arabia)" },
  { value: "amazon.se", label: "amazon.se (Sweden)" },
  { value: "amazon.pl", label: "amazon.pl (Poland)" },
  { value: "amazon.com.tr", label: "amazon.com.tr (Turkey)" },
  { value: "amazon.eg", label: "amazon.eg (Egypt)" },
  { value: "amazon.com.be", label: "amazon.com.be (Belgium)" },
  { value: "amazon.co.za", label: "amazon.co.za (South Africa)" }
];
let targetOptions = [
  // Pages (1)
  { type: "Page", value: "page:home", label: "Home Page", link: "https://yourwebsite.com/", linkCount: 2 },
  { type: "Page", value: "page:about", label: "About Us", link: "https://yourwebsite.com/about", linkCount: 1 },
  { type: "Page", value: "page:contact", label: "Contact Us", link: "https://yourwebsite.com/contact", linkCount: 0 },
  // Post Categories (2)
  { type: "Post Category", value: "post_cat:tech", label: "Tech News", link: "https://yourwebsite.com/category/tech", linkCount: 47, childCount: 12, childLabel: "Posts" },
  { type: "Post Category", value: "post_cat:hardware", label: "Hardware & Gear", link: "https://yourwebsite.com/category/tech/hardware", parentCategory: "post_cat:tech", linkCount: 15, childCount: 4, childLabel: "Posts" },
  { type: "Post Category", value: "post_cat:laptops", label: "Laptops", link: "https://yourwebsite.com/category/tech/hardware/laptops", parentCategory: "post_cat:hardware", linkCount: 8, childCount: 2, childLabel: "Posts" },
  { type: "Post Category", value: "post_cat:reviews", label: "Product Reviews", link: "https://yourwebsite.com/category/reviews", linkCount: 89, childCount: 24, childLabel: "Posts" },
  // Posts (3)
  { type: "Post", value: "post:1", label: "Top 10 Wireless Headphones 2024", link: "https://yourwebsite.com/blog/top-10-headphones", parentCategory: "post_cat:hardware", linkCount: 12 },
  { type: "Post", value: "post:2", label: "Ultimate Guide to Smart Home Devices", link: "https://yourwebsite.com/blog/smart-home-guide", parentCategory: "post_cat:tech", linkCount: 34 },
  { type: "Post", value: "post:3", label: "Best Summer Reads for 2024", link: "https://yourwebsite.com/blog/summer-reads", parentCategory: "post_cat:reviews", linkCount: 5 },
  { type: "Post", value: "post:macbook", label: "Apple M3 MacBook Air Review", link: "https://yourwebsite.com/blog/m3-macbook", parentCategory: "post_cat:laptops", linkCount: 5 },
  { type: "Post", value: "post:dell", label: "Dell XPS 15 Deep Dive", link: "https://yourwebsite.com/blog/dell-xps-15", parentCategory: "post_cat:laptops", linkCount: 3 },
  // Product Categories (4)
  { type: "Product Category", value: "cat:electronics", label: "Electronics", link: "https://yourwebsite.com/category/electronics", linkCount: 120, childCount: 56, childLabel: "Products" },
  { type: "Product Category", value: "cat:audio", label: "Audio Equipment", link: "https://yourwebsite.com/category/electronics/audio", parentCategory: "cat:electronics", linkCount: 45, childCount: 18, childLabel: "Products" },
  { type: "Product Category", value: "cat:home", label: "Home & Kitchen", link: "https://yourwebsite.com/category/home-kitchen", linkCount: 67, childCount: 31, childLabel: "Products" },
  // Products (5)
  { type: "Product", value: "prod:p1", label: "Sony WH-1000XM5 Headphones", link: "https://yourwebsite.com/product/sony-headphones", parentCategory: "cat:audio", linkCount: 1 },
  { type: "Product", value: "prod:p2", label: "Amazon Kindle Paperwhite", link: "https://yourwebsite.com/product/kindle-paperwhite", parentCategory: "cat:electronics", linkCount: 1 },
  { type: "Product", value: "prod:p3", label: "Samsung Galaxy S24 Ultra", link: "https://yourwebsite.com/product/samsung-s24", parentCategory: "cat:electronics", linkCount: 1 },
  { type: "Product", value: "prod:p4", label: "Dyson V15 Detect Vacuum", link: "https://yourwebsite.com/product/dyson-v15", parentCategory: "cat:home", linkCount: 1 }
].filter((o) => (o.linkCount || 0) > 0);
const getOptionData = (val) => targetOptions.find((opt) => opt.value === val);
const getLinkForValue = (val) => {
  var _a;
  return ((_a = getOptionData(val)) == null ? void 0 : _a.link) || "#";
};
const cacheItems = (items) => {
  if (!Array.isArray(items) || !items.length) return;
  const seen = new Set(targetOptions.map((o) => o.value));
  const add = items.filter((o) => o && o.value && !seen.has(o.value));
  if (add.length) targetOptions = targetOptions.concat(add);
};
const ruleValuesToRules = (vals = []) => {
  const out = { posts: [], pages: [], post_cats: [] };
  vals.forEach((v2) => {
    const idx = String(v2).indexOf(":");
    if (idx < 0) return;
    const kind = v2.slice(0, idx);
    const id2 = parseInt(v2.slice(idx + 1), 10);
    if (!id2) return;
    if (kind === "post") out.posts.push(id2);
    else if (kind === "page") out.pages.push(id2);
    else if (kind === "post_cat") out.post_cats.push(id2);
  });
  return out;
};
const rulesToRuleValues = (rules = {}) => [
  ...(rules.posts || []).map((i) => `post:${i}`),
  ...(rules.pages || []).map((i) => `page:${i}`),
  ...(rules.post_cats || []).map((i) => `post_cat:${i}`)
];
const splitVal = (v2) => {
  const i = String(v2).indexOf(":");
  return i < 0 ? [null, 0] : [v2.slice(0, i), parseInt(v2.slice(i + 1), 10) || 0];
};
const exclusionsToBackend = (excl = [], trees = [], exc = []) => {
  const out = { posts: [], pages: [], cats: [], except_posts: [], except_pages: [] };
  excl.forEach((v2) => {
    const [k2, id2] = splitVal(v2);
    if (!id2) return;
    if (k2 === "post") out.posts.push(id2);
    else if (k2 === "page") out.pages.push(id2);
    else if (k2 === "post_cat") out.cats.push(id2);
  });
  trees.forEach((v2) => {
    const [k2, id2] = splitVal(v2);
    if (id2 && k2 === "post_cat") out.cats.push(id2);
  });
  exc.forEach((v2) => {
    const [k2, id2] = splitVal(v2);
    if (!id2) return;
    if (k2 === "post") out.except_posts.push(id2);
    else if (k2 === "page") out.except_pages.push(id2);
  });
  out.cats = Array.from(new Set(out.cats));
  return out;
};
const backendToExclusions = (ex = {}) => ({
  globalExclusions: [...(ex.posts || []).map((i) => `post:${i}`), ...(ex.pages || []).map((i) => `page:${i}`)],
  globalExcludedTrees: (ex.cats || []).map((i) => `post_cat:${i}`),
  globalExceptions: [...(ex.except_posts || []).map((i) => `post:${i}`), ...(ex.except_pages || []).map((i) => `page:${i}`)]
});
const getFilteredData = (optionsToSearch, search, filterType) => {
  const lowerSearch = search.toLowerCase();
  const matched = optionsToSearch.filter((o) => !search || o.label.toLowerCase().includes(lowerSearch) || o.link && o.link.toLowerCase().includes(lowerSearch));
  if (filterType === "All") return matched;
  return matched.filter((o) => o.type === filterType);
};
const getTabCounts = (optionsToSearch) => {
  let pageCount = 0, postCount = 0, postCatCount = 0, productCount = 0, productCatCount = 0;
  optionsToSearch.forEach((opt) => {
    if (opt.type === "Page") pageCount++;
    if (opt.type === "Post Category") postCatCount++;
    if (opt.type === "Post") postCount++;
    if (opt.type === "Product Category") productCatCount++;
    if (opt.type === "Product") productCount++;
  });
  return {
    "All": optionsToSearch.length,
    "Page": pageCount,
    "Post Category": postCatCount,
    "Post": postCount,
    "Product Category": productCatCount,
    "Product": productCount
  };
};
const Section = React.memo(({ title, icon: Icon2, action, children, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-6 ${className}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 pb-2 mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      Icon2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "w-5 h-5 text-indigo-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-800", children: title })
    ] }),
    action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: action })
  ] }),
  children
] }));
const Hint = React.memo(({ text, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-start gap-2 mt-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-xs border border-blue-100 w-fit max-w-full ${className}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-5", children: text })
] }));
const InfoTooltip = React.memo(({ text, alignment = "center", direction = "top", className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `group/tooltip relative flex items-center ${className}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 14, className: "text-indigo-400 hover:text-indigo-600 transition-colors cursor-help" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute ${direction === "top" ? "bottom-full mb-2" : "top-full mt-2"} w-max max-w-[260px] p-3 bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-[9999] text-center font-normal leading-relaxed invisible group-hover/tooltip:visible whitespace-normal text-balance ${alignment === "right" ? "right-[-4px]" : alignment === "left" ? "left-[-4px]" : "left-1/2 -translate-x-1/2"}`, children: [
    text,
    direction === "top" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-full w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-indigo-100 ${alignment === "right" ? "right-[8px]" : alignment === "left" ? "left-[8px]" : "left-1/2 -translate-x-1/2"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-full -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-indigo-50 ${alignment === "right" ? "right-[8px]" : alignment === "left" ? "left-[8px]" : "left-1/2 -translate-x-1/2"}` })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-indigo-100 ${alignment === "right" ? "right-[8px]" : alignment === "left" ? "left-[8px]" : "left-1/2 -translate-x-1/2"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute bottom-full -mb-[1px] w-0 h-0 border-x-4 border-x-transparent border-b-[6px] border-b-indigo-50 ${alignment === "right" ? "right-[8px]" : alignment === "left" ? "left-[8px]" : "left-1/2 -translate-x-1/2"}` })
    ] })
  ] })
] }));
const SettingRow = React.memo(({ label, tooltip, hint, children, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `grid grid-cols-[210px_1fr] gap-6 items-start border-b border-gray-50 pb-5 mb-5 last:border-0 last:pb-0 last:mb-0 animate-in fade-in slide-in-from-top-2 duration-300 ${className}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-bold text-gray-600 pt-2.5 flex items-center gap-1.5", children: [
    label,
    tooltip && !hint && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: tooltip })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    children,
    hint && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-gray-500 flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hint }),
      tooltip && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: tooltip })
    ] })
  ] })
] }));
const SimpleCheckbox = React.memo(({ name, checked, onChange, label, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center cursor-pointer min-h-[40px] ${className}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name, checked, onChange, className: "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-sm font-semibold text-gray-700", children: label })
] }));
const CheckboxDropdown = React.memo(({ label, icon: Icon2, children, tooltip, compact, scrollable = true }) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [openUpwards, setOpenUpwards] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 280 && rect.top > spaceBelow) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(!isOpen),
        className: `flex items-center gap-1.5 px-2.5 py-1 bg-white border rounded-md text-[11px] font-bold transition-colors shadow-sm h-7 ${isOpen ? "border-indigo-400 ring-1 ring-indigo-500/20 text-indigo-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`,
        title: tooltip,
        children: [
          Icon2 && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 12, className: isOpen ? "text-indigo-500" : "text-gray-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, className: `text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}` })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute ${openUpwards ? "bottom-[calc(100%+4px)] mb-1 origin-bottom" : "top-[calc(100%+4px)] mt-1 origin-top"} right-0 ${compact ? "w-max min-w-0" : "min-w-[320px] sm:min-w-[400px]"} bg-white border border-gray-200 shadow-xl rounded-lg p-1.5 z-[999] animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-0.5 ${scrollable ? "max-h-[60vh] overflow-y-auto custom-scrollbar" : ""}`, children })
  ] });
});
const RadioGroup = React.memo(({ title, name, options, value, onChange }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
  title && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600 block mb-4", children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group select-none w-max", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name, value: option.value, checked: value === option.value, onChange: (e) => onChange(name, e.target.value), className: "w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-50 cursor-pointer flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors", children: option.label })
      ] }),
      option.hint && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: option.hint, alignment: "center" })
    ] }),
    option.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 mt-1 text-xs text-gray-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12, className: "mt-0.5 text-indigo-400 flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: option.description })
    ] })
  ] }, option.value)) })
] }));
const StyledInput = React.memo((props) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, className: `w-full px-3 py-1.5 h-[34px] bg-white border border-gray-400 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow text-gray-700 disabled:bg-gray-50 disabled:text-gray-500 ${props.className || ""}` }));
const NumberInput = React.memo(({ value, onChange, min, max, placeholder, className }) => {
  const handleInput = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = "";
    else if (val > max) val = max;
    else if (val < min) val = min;
    onChange(val);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "number",
      value,
      onChange: (e) => onChange(e.target.value),
      onBlur: handleInput,
      placeholder,
      min,
      max,
      className: `text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm text-gray-900 ${className}`
    }
  );
});
const StyledSelect = React.memo(({ children, name, value, onChange, placeholder, className = "", wrapperClassName = "", truncate = true }) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const options = React.Children.toArray(children).reduce((acc, child) => {
    if (child.type === "option") {
      const optionValue = child.props.value !== void 0 ? child.props.value : child.props.children;
      acc.push({ value: optionValue, label: child.props.children });
    }
    return acc;
  }, []);
  const selectedOption = options.find((opt) => opt.value === value);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current) return;
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      if (path.includes(containerRef.current) || containerRef.current.contains(e.target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative w-full ${wrapperClassName}`, ref: containerRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => setIsOpen(!isOpen),
        className: `flex items-center justify-between w-full px-3 py-1.5 h-[34px] bg-white border border-gray-400 rounded-lg text-[13px] font-semibold cursor-pointer transition-all shadow text-gray-700 select-none ${isOpen ? "ring-2 ring-indigo-500/20 border-indigo-500" : ""} ${className}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${truncate ? "truncate" : "whitespace-nowrap"} ${!selectedOption ? "text-gray-400" : ""}`, children: selectedOption ? selectedOption.label : placeholder || "Select option" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `w-4 h-4 text-gray-500 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[calc(100%+4px)] left-0 min-w-full w-max bg-white border border-gray-200 rounded-lg shadow-xl z-[999] flex flex-col animate-in fade-in zoom-in-95 duration-100 py-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[220px] overflow-y-auto custom-scrollbar", children: options.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
      onChange({ target: { name, value: item.value } });
      setIsOpen(false);
    }, className: `px-3 py-1.5 transition-colors cursor-pointer text-[13px] font-semibold flex items-center justify-between gap-4 ${truncate ? "" : "whitespace-nowrap"} ${item.value === value ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: truncate ? "truncate pr-2" : "", children: item.label }),
      item.value === value && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "text-indigo-600 shrink-0", strokeWidth: 3 })
    ] }, item.value)) }) })
  ] });
});
const KeywordTokenInput = React.memo(({ value, onChange, placeholder, className }) => {
  const [inputValue, setInputValue] = reactExports.useState("");
  const keywords = value ? value.split(",").map((k2) => k2.trim()).filter(Boolean) : [];
  const addKeyword = reactExports.useCallback((keyword) => {
    const newKeywords = keyword.split(",").map((k2) => k2.trim()).filter(Boolean);
    const uniqueNew = newKeywords.filter((k2) => !keywords.includes(k2));
    if (uniqueNew.length > 0) {
      onChange([...keywords, ...uniqueNew].join(", "));
    }
    setInputValue("");
  }, [keywords, onChange]);
  const removeKeyword = reactExports.useCallback((keywordToRemove) => {
    onChange(keywords.filter((k2) => k2 !== keywordToRemove).join(", "));
  }, [keywords, onChange]);
  const handleKeyDown = reactExports.useCallback((e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  }, [inputValue, keywords, addKeyword, removeKeyword]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-colors shadow-sm min-h-[34px] h-auto ${className}`, children: [
    keywords.map((kw, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold border border-indigo-100", children: [
      kw,
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeKeyword(kw), className: "text-indigo-400 hover:text-indigo-600 focus:outline-none ml-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12, strokeWidth: 3 }) })
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
        onKeyDown: handleKeyDown,
        onBlur: () => addKeyword(inputValue),
        placeholder: keywords.length === 0 ? placeholder : "",
        className: "flex-1 min-w-[120px] w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 px-1 py-0.5"
      }
    )
  ] });
});
const AutoResizeTextarea = React.memo(({ value, onChange, placeholder, className, rows = 1 }) => {
  const textareaRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(34, scrollHeight)}px`;
    }
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      ref: textareaRef,
      value,
      onChange,
      placeholder,
      rows,
      className: `resize-none overflow-hidden ${className}`
    }
  );
});
const MatchTypeDropdown = React.memo(({ value, onChange }) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [openUpwards, setOpenUpwards] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 150 && rect.top > spaceBelow) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "flex items-center justify-between gap-2 px-2.5 py-1 bg-white border border-gray-300 rounded-md text-[11px] font-bold shadow-sm h-7 text-gray-700 min-w-[110px] hover:border-gray-400 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: value === "exact" ? "Exact Match" : "Broad Match" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, className: `text-gray-400 transition-transform ${isOpen ? "rotate-180 text-indigo-500" : ""}` })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute right-0 ${openUpwards ? "bottom-[calc(100%+4px)] origin-bottom" : "top-[calc(100%+4px)] origin-top"} bg-white border border-gray-200 shadow-xl rounded-lg p-1.5 z-[999] w-max min-w-[150px] flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
        onChange("exact");
        setIsOpen(false);
      }, className: `px-2.5 py-2 rounded cursor-pointer transition-colors flex items-center justify-between gap-3 ${value === "exact" ? "bg-indigo-50 border-indigo-200" : "hover:bg-gray-50 border border-transparent"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-bold ${value === "exact" ? "text-indigo-800" : "text-gray-800"}`, children: "Exact Match" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: `Links only this exact word (e.g. "Nike shoe" won't match "Nike shoes")`, alignment: "center" })
        ] }),
        value === "exact" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13, className: "text-indigo-600" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
        onChange("broad");
        setIsOpen(false);
      }, className: `px-2.5 py-2 rounded cursor-pointer transition-colors flex items-center justify-between gap-3 ${value === "broad" ? "bg-indigo-50 border-indigo-200" : "hover:bg-gray-50 border border-transparent"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-bold ${value === "broad" ? "text-indigo-800" : "text-gray-800"}`, children: "Broad Match" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: 'Links similar words and plurals too (e.g. "Nike shoe" also matches "Nike shoes")', alignment: "center" })
        ] }),
        value === "broad" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13, className: "text-indigo-600" })
      ] })
    ] })
  ] });
});
const ActionGroup = React.memo(({ item, isSelected, isCurrentInherited, isUsedElsewhere, isCategoryMatch, fallsBackToSitewide, usageInfo, sitewideInfo, currentRuleId, currentRuleIndex, onTransfer, onRemove, onRemoveFromOther, allRules, isOpen, setIsOpen }) => {
  var _a;
  const ref = reactExports.useRef(null);
  const [openUpwards, setOpenUpwards] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 200 && rect.top > spaceBelow) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  const currentSelectedId = isSelected || isCurrentInherited ? currentRuleId : isUsedElsewhere ? usageInfo.ruleId : fallsBackToSitewide ? sitewideInfo.ruleId : "";
  const handleRemoveAssignment = (e) => {
    e.stopPropagation();
    if (isSelected) onRemove(item.value);
    else if (isCurrentInherited) onRemove(item.parentCategory);
    else if (isCategoryMatch) onRemoveFromOther(item.parentCategory, usageInfo.ruleId);
    else onRemoveFromOther(item.value, usageInfo.ruleId);
    setIsOpen(false);
  };
  const getRuleTooltip = (ruleId) => {
    const rule = allRules.find((r2) => r2.id === ruleId);
    if (!rule) return "Move to tag";
    return formatTagLabel(rule.nickname, rule.domain, rule.affiliateId, rule.index);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 h-full", onClick: (e) => e.stopPropagation(), children: [
    currentSelectedId !== currentRuleId && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      onTransfer(item.value, currentSelectedId, currentRuleId);
      setIsOpen(false);
    }, className: "text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-1.5 rounded shadow-sm hover:bg-indigo-100 hover:text-indigo-800 transition-colors flex items-center gap-1.5", title: `Move instantly to ${getRuleTooltip(currentRuleId)}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 10, strokeWidth: 3 }),
      " Tag #",
      currentRuleIndex
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center rounded-md border border-gray-300 shadow-sm bg-white transition-all opacity-95 hover:opacity-100 h-[26px]", ref, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 hover:bg-gray-50 cursor-pointer pl-2.5 pr-2 h-full text-gray-700 text-[11px] font-bold", onClick: () => setIsOpen(!isOpen), title: currentSelectedId ? getRuleTooltip(currentSelectedId) : "Move to another tag", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Tag #",
          ((_a = allRules.find((r2) => r2.id === currentSelectedId)) == null ? void 0 : _a.index) || "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 15, className: `text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-500" : ""}`, strokeWidth: 2.5 })
      ] }),
      isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute right-0 ${openUpwards ? "bottom-[calc(100%+6px)] origin-bottom" : "top-[calc(100%+6px)] origin-top"} bg-white border border-gray-200 shadow-2xl rounded-xl p-2 z-[999] min-w-max max-w-[calc(100vw-32px)] overflow-x-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1 border-b border-gray-100 pb-1.5 sticky left-0", children: "Move to Tag..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateRows: `repeat(${Math.min(10, allRules.length)}, minmax(0, 1fr))`, gridAutoFlow: "column", gap: "2px 6px" }, children: allRules.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          if (r2.id !== currentSelectedId) onTransfer(item.value, currentSelectedId, r2.id);
          setIsOpen(false);
        }, title: formatTagLabel(r2.nickname, r2.domain, r2.affiliateId, r2.index), className: `text-left text-[10px] font-bold px-2 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${r2.id === currentSelectedId ? "bg-indigo-50 text-indigo-700 cursor-default ring-1 ring-indigo-200 inset-ring" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`, children: [
          r2.id === currentSelectedId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, strokeWidth: 3 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12, className: "opacity-40" }),
          " Tag #",
          r2.index
        ] }, r2.id)) })
      ] }),
      !fallsBackToSitewide && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRemoveAssignment, className: "px-2 border-l border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center focus:outline-none h-full", title: "Remove assignment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, strokeWidth: 2.5 }) })
    ] })
  ] });
});
const AutoLinkTagDropdown = React.memo(({ value, onChange, allRules }) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [openUpwards, setOpenUpwards] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 250 && rect.top > spaceBelow) {
          setOpenUpwards(true);
        } else {
          setOpenUpwards(false);
        }
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  const currentRule = allRules.find((r2) => `tag-${r2.id}` === value) || allRules[0];
  if (!currentRule) return null;
  const tooltip = formatTagLabel(currentRule.nickname, currentRule.domain, currentRule.affiliateId, currentRule.index);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center rounded-md border border-gray-300 shadow-sm bg-white transition-all hover:border-indigo-400 min-h-[34px] w-full", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full hover:bg-gray-50 cursor-pointer pl-3 pr-2.5 h-full text-gray-700 text-[12px] font-bold rounded-md", onClick: () => setIsOpen(!isOpen), title: tooltip, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
        "Tag #",
        currentRule.index
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: `text-gray-400 transition-transform duration-200 shrink-0 ml-1 ${isOpen ? "rotate-180 text-indigo-500" : ""}`, strokeWidth: 2.5 })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute right-0 ${openUpwards ? "bottom-[calc(100%+6px)] origin-bottom" : "top-[calc(100%+6px)] origin-top"} bg-white border border-gray-200 shadow-2xl rounded-xl p-2 z-[999] min-w-[100px] max-w-[calc(100vw-32px)] overflow-x-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1 border-b border-gray-100 pb-1.5 sticky left-0", children: "Select Tag" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar", children: allRules.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        onChange(`tag-${r2.id}`);
        setIsOpen(false);
      }, title: formatTagLabel(r2.nickname, r2.domain, r2.affiliateId, r2.index), className: `text-left text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-2 ${r2.id === currentRule.id ? "bg-indigo-50 text-indigo-700 cursor-default ring-1 ring-indigo-200 inset-ring" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`, children: [
        r2.id === currentRule.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, strokeWidth: 3 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 14, className: "opacity-40" }),
        " Tag #",
        r2.index,
        " ",
        r2.nickname ? `(${r2.nickname})` : ""
      ] }, r2.id)) })
    ] })
  ] });
});
const SearchableDropdown = React.memo(({ options, onSelect, onBulkSelect, onBulkRemove, onTransfer, onRemove, onRemoveFromOther, onRestoreExcluded, placeholder = "Search...", selectedValues = [], usedElsewhere = {}, currentInherited = [], currentRuleIndex, currentRuleId, currentRuleMode, currentRuleNickname, currentRuleDomain, currentRuleAffiliateId, allRules, sitewideInfo, globalExclusions = [], globalExcludedTrees = [], globalExceptions = [] }) => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [activeFilter, setActiveFilter] = reactExports.useState("All");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [itemsPerPage, setItemsPerPage] = reactExports.useState(50);
  const [bulkSelected, setBulkSelected] = reactExports.useState([]);
  const [openActionId, setOpenActionId] = reactExports.useState(null);
  const containerRef = reactExports.useRef(null);
  const scrollContainerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setBulkSelected([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  reactExports.useEffect(() => {
    if (isOpen && containerRef.current) {
      setTimeout(() => {
        const ruleCard = containerRef.current.closest('[id^="tag-rule-"], [id^="autolink-rule-"]');
        if (ruleCard) {
          const y2 = ruleCard.getBoundingClientRect().top + window.scrollY - 24;
          window.scrollTo({ top: y2, behavior: "smooth" });
        } else {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [isOpen]);
  const isWP = typeof window !== "undefined" && !!window.DEVDAFFI_ADMIN;
  const SERVER_PER = 50;
  const [srv, setSrv] = reactExports.useState({ items: [], counts: {}, total: 0, loading: false });
  reactExports.useEffect(() => {
    if (!isWP) return;
    const cfg = window.DEVDAFFI_ADMIN;
    const ctrl = new AbortController();
    setSrv((s) => ({ ...s, loading: true }));
    const h = setTimeout(() => {
      const url = `${cfg.rest}content?q=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(activeFilter)}&page=${currentPage}`;
      fetch(url, { headers: { "X-WP-Nonce": cfg.nonce }, signal: ctrl.signal }).then((r2) => r2.json()).then((d) => {
        if (!d || !Array.isArray(d.items)) return;
        cacheItems(d.items);
        setSrv({ items: d.items, counts: d.counts || {}, total: d.total || d.items.length, loading: false });
      }).catch(() => {
      });
    }, 250);
    return () => {
      clearTimeout(h);
      ctrl.abort();
    };
  }, [isWP, searchTerm, activeFilter, currentPage]);
  const { currentItems, tabCounts } = reactExports.useMemo(() => {
    if (isWP) {
      const c = srv.counts || {};
      return {
        currentItems: srv.items,
        tabCounts: { "All": c.All || 0, "Page": c.Page || 0, "Post Category": c["Post Category"] || 0, "Post": c.Post || 0, "Product Category": 0, "Product": 0 }
      };
    }
    const matched = getFilteredData(options, searchTerm, activeFilter);
    const allMatched = getFilteredData(options, searchTerm, "All");
    return { currentItems: matched, tabCounts: getTabCounts(allMatched) };
  }, [isWP, srv, options, searchTerm, activeFilter]);
  const perPage = isWP ? SERVER_PER : itemsPerPage;
  const totalItems = isWP ? srv.total : currentItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * perPage;
  const endIndex = isWP ? Math.min(startIndex + currentItems.length, totalItems) : Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = isWP ? currentItems : currentItems.slice(startIndex, endIndex);
  reactExports.useEffect(() => {
    setCurrentPage(1);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [searchTerm, activeFilter]);
  const handleSelect = reactExports.useCallback((value, isSelected, isUsedElsewhere, isCategoryMatch, isEffectivelyExcluded) => {
    if (isEffectivelyExcluded) return;
    if (!isSelected && (!isUsedElsewhere || isCategoryMatch)) {
      onSelect(value);
      setSearchTerm("");
    }
  }, [onSelect]);
  const handleBulkToggle = reactExports.useCallback((e, item) => {
    e.stopPropagation();
    setBulkSelected((prev) => {
      const isSelected = prev.includes(item.value);
      let newSet = new Set(prev);
      if (isSelected) newSet.delete(item.value);
      else newSet.add(item.value);
      return Array.from(newSet);
    });
  }, []);
  const renderDropdownItem = (item) => {
    var _a;
    const isExplicitlyExcluded = globalExclusions.includes(item.value);
    const isTreeExcluded = globalExcludedTrees.includes(item.value);
    const isParentTreeExcluded = item.parentCategory && globalExcludedTrees.includes(item.parentCategory);
    const isException = globalExceptions.includes(item.value);
    const isEffectivelyExcluded = isExplicitlyExcluded || (isTreeExcluded || isParentTreeExcluded) && !isException;
    const isSelected = selectedValues.includes(item.value);
    const isCurrentInherited = currentInherited.includes(item.value);
    const usageInfo = usedElsewhere[item.value];
    const isUsedElsewhere = !!usageInfo;
    const isCategoryMatch = isUsedElsewhere && usageInfo.isCategory;
    const isTakenOrSelected = isSelected || isCurrentInherited || isUsedElsewhere;
    const fallsBackToSitewide = !isTakenOrSelected && !!sitewideInfo;
    const explicitlyAssignedToSitewide = isUsedElsewhere && usageInfo.mode === "sitewide" || (isSelected || isCurrentInherited) && currentRuleMode === "sitewide";
    const showAsSitewide = fallsBackToSitewide || explicitlyAssignedToSitewide;
    const activeSitewideNickname = explicitlyAssignedToSitewide ? isUsedElsewhere ? usageInfo.nickname : currentRuleNickname : sitewideInfo == null ? void 0 : sitewideInfo.nickname;
    const activeSitewideDomain = explicitlyAssignedToSitewide ? isUsedElsewhere ? usageInfo.domain : currentRuleDomain : sitewideInfo == null ? void 0 : sitewideInfo.domain;
    const activeSitewideAffiliateId = explicitlyAssignedToSitewide ? isUsedElsewhere ? usageInfo.affiliateId : currentRuleAffiliateId : sitewideInfo == null ? void 0 : sitewideInfo.affiliateId;
    const activeSitewideIndex = explicitlyAssignedToSitewide ? isUsedElsewhere ? usageInfo.ruleIndex : currentRuleIndex : sitewideInfo == null ? void 0 : sitewideInfo.ruleIndex;
    const isActionOpen = openActionId === item.value;
    const isBulkChecked = bulkSelected.includes(item.value);
    let rowClass = isEffectivelyExcluded ? "bg-gray-50/80 cursor-default hover:bg-gray-100" : isBulkChecked ? "bg-indigo-50/80 cursor-pointer" : showAsSitewide ? "bg-sky-50 text-sky-900 hover:bg-sky-100 cursor-pointer" : isSelected || isCurrentInherited ? "bg-green-50 text-green-900 cursor-default" : isUsedElsewhere ? "bg-amber-50 text-amber-900 cursor-default" : "bg-white hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer";
    const showActionGroup = isTakenOrSelected || fallsBackToSitewide;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => {
      if (isEffectivelyExcluded) return;
      if (bulkSelected.length > 0) {
        handleBulkToggle({ stopPropagation: () => {
        } }, item);
        return;
      }
      if (!showActionGroup) handleSelect(item.value, isSelected, isUsedElsewhere, isCategoryMatch, isEffectivelyExcluded);
    }, className: `relative px-4 py-2.5 transition-colors border-b border-gray-100/70 last:border-0 flex items-start justify-between group ${rowClass} ${isActionOpen ? "z-[100]" : "hover:z-50 focus-within:z-50"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0 pr-3 relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-[5px] shrink-0", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", disabled: isEffectivelyExcluded || isCurrentInherited, checked: isBulkChecked, onChange: (e) => handleBulkToggle(e, item), className: "w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 cursor-pointer shadow-sm disabled:opacity-50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0 w-full pt-[2px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-semibold truncate ${isBulkChecked ? "text-indigo-900" : ""} ${isEffectivelyExcluded ? "text-gray-500/80" : ""}`, children: item.label }),
            isTreeExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700", title: "This entire category is globally excluded.", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { size: 10, strokeWidth: 3 }),
              " Category Excluded"
            ] }),
            isExplicitlyExcluded && !isTreeExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700", title: "This specific URL is globally excluded.", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 10, strokeWidth: 3 }),
              " URL Excluded"
            ] }),
            isParentTreeExcluded && !isException && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-amber-100 text-amber-700", title: "Excluded because its parent category is excluded.", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 10, strokeWidth: 3 }),
              " Excluded (Via ",
              ((_a = targetOptions.find((t2) => t2.value === item.parentCategory)) == null ? void 0 : _a.label) || "Category",
              " Category)"
            ] }),
            item.childCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded shadow-sm border border-sky-100", title: `${item.childCount} ${item.childLabel} inside this category`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 10 }),
              " ",
              item.childCount,
              " ",
              item.childLabel
            ] }),
            item.linkCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shadow-sm border border-indigo-100", title: `${item.linkCount} Amazon links found in this`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { size: 10 }),
              " ",
              item.linkCount,
              " Amazon Links"
            ] }),
            (isSelected || isCurrentInherited) && !showAsSitewide && !isEffectivelyExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] bg-green-200 text-green-900 px-1.5 py-0.5 rounded font-bold tracking-wide", title: formatTagLabel(currentRuleNickname, currentRuleDomain, currentRuleAffiliateId, currentRuleIndex), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 10, strokeWidth: 3 }),
              " Tag #",
              currentRuleIndex,
              " ",
              currentRuleNickname ? `(${currentRuleNickname})` : "",
              " ",
              isCurrentInherited ? "• Inherited" : ""
            ] }),
            !isSelected && !isCurrentInherited && isUsedElsewhere && !showAsSitewide && !isEffectivelyExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-amber-200 text-amber-900", title: `Allocated to ${formatTagLabel(usageInfo.nickname, usageInfo.domain, usageInfo.affiliateId, usageInfo.ruleIndex)}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 10 }),
              " Tag #",
              usageInfo.ruleIndex,
              " ",
              usageInfo.nickname ? `(${usageInfo.nickname})` : "",
              " ",
              usageInfo.isCategory ? "• Inherited" : ""
            ] }),
            showAsSitewide && !isEffectivelyExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-sky-200 text-sky-900", title: `${formatTagLabel(activeSitewideNickname, activeSitewideDomain, activeSitewideAffiliateId, activeSitewideIndex)} (Sitewide)`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 10 }),
              " Tag #",
              activeSitewideIndex,
              " ",
              activeSitewideNickname ? `(${activeSitewideNickname})` : "",
              " (Sitewide)"
            ] })
          ] }),
          item.link && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[12px] font-medium font-mono break-all line-clamp-2 leading-snug ${isEffectivelyExcluded ? "text-gray-400/70" : "text-gray-500"}`, children: item.link }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: `${isEffectivelyExcluded ? "text-gray-300 hover:text-gray-400" : "text-gray-400 hover:text-blue-600"} transition-colors shrink-0 mt-0.5`, title: "Open in new window", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-shrink-0 pt-[5px] relative z-10", onClick: (e) => e.stopPropagation(), children: bulkSelected.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        !showActionGroup && !isEffectivelyExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "text-[11px] font-bold bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors flex items-center gap-1.5", title: "Add to current tag", onClick: (e) => {
          e.stopPropagation();
          handleSelect(item.value, isSelected, isUsedElsewhere, isCategoryMatch, isEffectivelyExcluded);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, strokeWidth: 3 }),
          " Add"
        ] }),
        showActionGroup && !isEffectivelyExcluded && /* @__PURE__ */ jsxRuntimeExports.jsx(ActionGroup, { item, isSelected, isCurrentInherited, isUsedElsewhere, isCategoryMatch, fallsBackToSitewide, usageInfo, sitewideInfo, currentRuleId, currentRuleIndex, onTransfer, onRemove, onRemoveFromOther, allRules, isOpen: isActionOpen, setIsOpen: (val) => setOpenActionId(val ? item.value : null) })
      ] }) })
    ] }, item.value);
  };
  const groupedDisplayItems = reactExports.useMemo(() => {
    return paginatedItems.reduce((acc, opt) => {
      if (!acc[opt.type]) acc[opt.type] = [];
      acc[opt.type].push(opt);
      return acc;
    }, {});
  }, [paginatedItems]);
  const displayRootTypes = Object.keys(groupedDisplayItems).sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", ref: containerRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 bg-white rounded-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onFocus: () => setIsOpen(true), onClick: () => setIsOpen(true), placeholder, className: "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm text-gray-700 placeholder:text-gray-400 relative z-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-2.5 text-gray-400 z-20 pointer-events-none", size: 16 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-gray-600 z-20", onClick: () => setIsOpen(!isOpen), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `transition-transform duration-200 ${isOpen ? "rotate-180" : ""}` }) })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-[calc(100%-4px)] left-0 w-full pt-2 bg-white border border-gray-200 rounded-b-lg shadow-xl z-[150] flex flex-col animate-in fade-in duration-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-nowrap gap-2 p-2 bg-slate-50 border-b border-gray-200 overflow-x-auto relative z-20 shadow-sm custom-scrollbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-gray-600 pl-1 pr-1.5 whitespace-nowrap flex items-center gap-1", children: [
          "Filters:",
          /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: `Showing ${options.length} of 500 total pages that include Amazon links.`, alignment: "left", direction: "bottom", className: "z-[80]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setActiveFilter("All");
        }, className: `px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "All" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`, children: [
          "All (",
          tabCounts["All"],
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setActiveFilter("Page");
        }, className: `px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Page" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`, children: [
          "Pages (",
          tabCounts["Page"],
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setActiveFilter("Post Category");
        }, className: `px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Post Category" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`, children: [
          "Post Categories (",
          tabCounts["Post Category"],
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setActiveFilter("Post");
        }, className: `px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Post" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`, children: [
          "Posts (",
          tabCounts["Post"],
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setActiveFilter("Product Category");
        }, className: `px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Product Category" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`, children: [
          "Product Categories (",
          tabCounts["Product Category"],
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: (e) => {
          e.stopPropagation();
          setActiveFilter("Product");
        }, className: `px-2.5 py-1 text-[11px] font-bold border rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0 ${activeFilter === "Product" ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`, children: [
          "Products (",
          tabCounts["Product"],
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollContainerRef, className: "max-h-[380px] min-h-[120px] resize-y overflow-y-auto custom-scrollbar bg-white flex-1", children: paginatedItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-8 text-sm text-gray-500 text-center italic bg-gray-50/50 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 24, className: "text-gray-300 mb-2" }),
          'No matches found for "',
          searchTerm,
          '".'
        ] }) : displayRootTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 bg-gray-100/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-t first:border-t-0 sticky top-0 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]", children: getTypeLabel(type) }),
          groupedDisplayItems[type].map((item) => renderDropdownItem(item))
        ] }, type)) }),
        totalItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 rounded-b-lg gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-semibold text-gray-500", children: [
            "Showing ",
            startIndex + 1,
            "-",
            endIndex,
            " of ",
            totalItems,
            " items"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
              e.stopPropagation();
              setCurrentPage((p2) => Math.max(1, p2 - 1));
            }, disabled: safePage === 1, className: "px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-colors", children: "Prev" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-gray-600 px-2", children: [
              "Page ",
              safePage,
              " of ",
              totalPages
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
              e.stopPropagation();
              setCurrentPage((p2) => Math.min(totalPages, p2 + 1));
            }, disabled: safePage === totalPages, className: "px-2 py-1 text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-50 shadow-sm transition-colors", children: "Next" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "items-center gap-1.5 border-l border-gray-200 pl-3 hidden sm:flex ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-500", children: "Show" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: itemsPerPage, onChange: (e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0) {
                  setItemsPerPage(val);
                  setCurrentPage(1);
                } else if (e.target.value === "") setItemsPerPage("");
              }, onBlur: (e) => {
                if (e.target.value === "" || parseInt(e.target.value, 10) < 1) {
                  setItemsPerPage(50);
                  setCurrentPage(1);
                }
              }, className: "w-10 py-0.5 px-1 border border-gray-300 rounded text-[10px] font-bold focus:border-indigo-500 outline-none text-center shadow-sm text-gray-900", min: "1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-600", children: "per page" })
            ] })
          ] })
        ] })
      ] }),
      bulkSelected.length > 0 && (() => {
        const adding = bulkSelected.filter((v2) => !selectedValues.includes(v2));
        const removing = bulkSelected.filter((v2) => selectedValues.includes(v2));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-[44px] right-4 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3 z-[120] animate-in slide-in-from-bottom-2 duration-200 border border-gray-700/50 w-max justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center justify-center bg-indigo-500 text-white w-5 h-5 rounded-full text-[10px] font-bold", children: bulkSelected.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-200 whitespace-nowrap hidden sm:block", children: "Selected" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-700 shrink-0" }),
          adding.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            onBulkSelect(adding);
            setBulkSelected((prev) => prev.filter((v2) => !adding.includes(v2)));
          }, className: "text-[11px] sm:text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, strokeWidth: 3 }),
            " Add to Tag #",
            currentRuleIndex
          ] }),
          removing.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            onBulkRemove(removing);
            setBulkSelected((prev) => prev.filter((v2) => !removing.includes(v2)));
          }, className: "text-[11px] sm:text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14, strokeWidth: 3 }),
            " Remove from Tag #",
            currentRuleIndex
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-700 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setBulkSelected([]), className: "text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
        ] });
      })()
    ] })
  ] });
});
function App({ suiteMode = false } = {}) {
  var _a, _b, _c, _d, _e, _f;
  const [bottomTarget, setBottomTarget] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!suiteMode) return;
    const setup = () => {
      const slot = document.getElementById("am-link-control-host-bottom");
      if (!slot) return null;
      if (slot.dataset.amBottomReady && slot.shadowRoot) {
        return slot.shadowRoot.querySelector(".am-bottom-root");
      }
      try {
        const shadow = slot.shadowRoot || slot.attachShadow({ mode: "open" });
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        for (const l2 of links) {
          if (l2.href && /\/devdome-affiliate-manager\/assets\/admin\/index\.css/.test(l2.href)) {
            const c = document.createElement("link");
            c.rel = "stylesheet";
            c.href = l2.href;
            shadow.appendChild(c);
            break;
          }
        }
        const root = document.createElement("div");
        root.className = "am-bottom-root";
        shadow.appendChild(root);
        slot.dataset.amBottomReady = "1";
        return root;
      } catch (e) {
        return null;
      }
    };
    let target = setup();
    if (target) {
      setBottomTarget(target);
      return;
    }
    const obs = new MutationObserver(() => {
      target = setup();
      if (target) {
        setBottomTarget(target);
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => obs.disconnect(), 1e4);
    return () => {
      obs.disconnect();
      clearTimeout(timeout);
    };
  }, [suiteMode]);
  const [btn1Editing, setBtn1Editing] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    btn1Text: "Check Price On Amazon",
    btn1LinkMode: "generated",
    btn1Link: "",
    btn1GeneratedDomain: "amazon.com",
    btn1SkipTag: false,
    btn1FollowMode: "nofollow",
    btn1OpenInNewTab: true,
    btn1Sponsored: true,
    btn1AffiliateRules: [],
    globalExclusions: [],
    globalExcludedTrees: [],
    globalExceptions: [],
    geoEnabled: false,
    enabled: false,
    androidMode: "browser",
    iosOpenInSafari: false,
    blockBots: true,
    redirectMethod: "js_302",
    scanFrequency: "7",
    scanFrequencyUnit: "days",
    scanAuto: false,
    monitorOosToSearch: false,
    monitorDeadToSearch: false,
    monitorOosMode: "replacement",
    monitorDeadMode: "replacement",
    autoLinkerEnabled: false,
    autoLinkerLimit: 2,
    autoLinkerApplyPosts: true,
    autoLinkerApplyPages: true,
    autoLinkerApplyProducts: true,
    autoLinkerSkipHeadings: true,
    autoLinkerSkipLinks: true,
    autoLinkerSkipCode: true,
    autoLinkerSkipFirstParagraph: false,
    autoLinkerSkipBlockquotes: true,
    autoLinkerRules: []
  });
  const [exclusionModalType, setExclusionModalType] = reactExports.useState(null);
  const [exclusionTab, setExclusionTab] = reactExports.useState("all");
  const [exclusionSearch, setExclusionSearch] = reactExports.useState("");
  const [showExclusionSearch, setShowExclusionSearch] = reactExports.useState(false);
  const [exclusionCurrentPage, setExclusionCurrentPage] = reactExports.useState(1);
  const [exclusionItemsPerPage, setExclusionItemsPerPage] = reactExports.useState(50);
  const [exclusionTypeFilter, setExclusionTypeFilter] = reactExports.useState("All");
  const [exclusionSelectedItems, setExclusionSelectedItems] = reactExports.useState([]);
  const [exclusionLastSelected, setExclusionLastSelected] = reactExports.useState(null);
  const addRuleButtonRef = reactExports.useRef(null);
  const [tagsExpanded, setTagsExpanded] = reactExports.useState(true);
  const [editingNicknames, setEditingNicknames] = reactExports.useState({});
  const [collapsedAssignedLists, setCollapsedAssignedLists] = reactExports.useState({});
  const [showTagSearch, setShowTagSearch] = reactExports.useState(false);
  const [tagSearchQuery, setTagSearchQuery] = reactExports.useState("");
  const [dragEnabledId, setDragEnabledId] = reactExports.useState(null);
  const [draggedRuleIdx, setDraggedRuleIdx] = reactExports.useState(null);
  const [dragOverRuleIdx, setDragOverRuleIdx] = reactExports.useState(null);
  const [tagSortOrder, setTagSortOrder] = reactExports.useState(0);
  const [hasScannedSite, setHasScannedSite] = reactExports.useState(false);
  const [amazonLinksFound, setAmazonLinksFound] = reactExports.useState(0);
  const [scanPages, setScanPages] = reactExports.useState(0);
  const [scanState, setScanState] = reactExports.useState("idle");
  const [monitorSummary, setMonitorSummary] = reactExports.useState({ total: 0, checked: 0, ok: 0, oos: 0, dead: 0, unchecked: 0 });
  const [svcUsage, setSvcUsage] = reactExports.useState(null);
  const [monitorProblems, setMonitorProblems] = reactExports.useState([]);
  const [monitorState, setMonitorState] = reactExports.useState("idle");
  const [monitorRefresh, setMonitorRefresh] = reactExports.useState(null);
  const [expandedProblems, setExpandedProblems] = reactExports.useState({});
  const [listOpen, setListOpen] = reactExports.useState(() => {
    try {
      const s = localStorage.getItem("devdaffi_link_health_open");
      if (s) return JSON.parse(s);
    } catch (e) {
    }
    return { dead: false, oos: false, ok: false };
  });
  const [liveState, setLiveState] = reactExports.useState({ items: [], loading: false, offset: 0, hasMore: false, loaded: false });
  const [monitorSearch, setMonitorSearch] = reactExports.useState({});
  const [monitorPage, setMonitorPage] = reactExports.useState({});
  const [monitorPerPage, setMonitorPerPage] = reactExports.useState(10);
  const [pagesPage, setPagesPage] = reactExports.useState({});
  const MON_PER_PAGE_OPTIONS = [10, 25, 50, 100];
  reactExports.useEffect(() => {
    try {
      localStorage.setItem("devdaffi_link_health_open", JSON.stringify(listOpen));
    } catch (e) {
    }
  }, [listOpen]);
  const [replaceVal, setReplaceVal] = reactExports.useState({});
  const [replaceBusy, setReplaceBusy] = reactExports.useState(null);
  const [botsBlocked, setBotsBlocked] = reactExports.useState(0);
  const globalTagSearchRef = reactExports.useRef(null);
  const exclusionSearchRef = reactExports.useRef(null);
  const [autoLinkerExpanded, setAutoLinkerExpanded] = reactExports.useState(false);
  const [showAutoLinkerGlobalSettings, setShowAutoLinkerGlobalSettings] = reactExports.useState(false);
  const [showAutoLinkerSearch, setShowAutoLinkerSearch] = reactExports.useState(false);
  const [autoLinkerSearchQuery, setAutoLinkerSearchQuery] = reactExports.useState("");
  const [autoLinkerDragEnabledId, setAutoLinkerDragEnabledId] = reactExports.useState(null);
  const [autoLinkerDraggedRuleIdx, setAutoLinkerDraggedRuleIdx] = reactExports.useState(null);
  const [autoLinkerDragOverRuleIdx, setAutoLinkerDragOverRuleIdx] = reactExports.useState(null);
  const [expandedAutoLinkSettings, setExpandedAutoLinkSettings] = reactExports.useState({});
  const [autoLinkerSortOrder, setAutoLinkerSortOrder] = reactExports.useState(0);
  const globalAutoLinkerSearchRef = reactExports.useRef(null);
  const modalScrollRef = reactExports.useRef(null);
  const savedDefaultTag = reactExports.useRef("");
  const [saveState, setSaveState] = reactExports.useState("idle");
  const [loaded, setLoaded] = reactExports.useState(false);
  const [, setContentReady] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg) {
      setLoaded(true);
      return;
    }
    const headers = { "X-WP-Nonce": cfg.nonce };
    targetOptions = [];
    fetch(cfg.rest + "settings", { headers }).then((r2) => r2.json()).then((data) => {
      if (!data || typeof data !== "object") return;
      savedDefaultTag.current = data.default_tag || "";
      const lo = data.link_options || {};
      const tags = Array.isArray(data.tags) ? data.tags : [];
      const exc = backendToExclusions(data.exclusions || {});
      const b = data.button || {};
      const clicksMap = data.clicks || {};
      const al2 = data.auto_linker || {};
      const ap = al2.apply || {};
      const sk2 = al2.skip || {};
      const scan = data.scan || {};
      const ma2 = data.mobile_app || {};
      const cp = data.click_protection || {};
      setBotsBlocked(data.bots_blocked || 0);
      setFormData((prev) => ({
        ...prev,
        btn1Text: b.text || prev.btn1Text,
        btn1LinkMode: b.link_mode === "custom" ? "custom" : "generated",
        btn1Link: b.custom_link || "",
        btn1GeneratedDomain: b.generated_domain || prev.btn1GeneratedDomain,
        btn1SkipTag: !!b.skip_tag,
        btn1AffiliateRules: tags.length ? tags.map((t2, i) => ({
          id: t2.id || i + 1,
          affiliateId: t2.affiliate_id || "",
          domain: t2.domain || "amazon.com",
          mode: t2.mode === "rules" ? "rules" : "sitewide",
          enabled: t2.enabled !== false,
          nickname: t2.nickname || "",
          ruleValues: rulesToRuleValues(t2.rules),
          clicks: clicksMap[t2.affiliate_id] || 0
        })) : prev.btn1AffiliateRules,
        geoEnabled: !!data.geo_enabled,
        btn1FollowMode: lo.rel === "follow" ? "follow" : "nofollow",
        btn1OpenInNewTab: !!lo.new_tab,
        btn1Sponsored: "sponsored" in lo ? !!lo.sponsored : prev.btn1Sponsored,
        globalExclusions: exc.globalExclusions,
        globalExcludedTrees: exc.globalExcludedTrees,
        globalExceptions: exc.globalExceptions,
        autoLinkerEnabled: !!al2.enabled,
        autoLinkerLimit: al2.limit || 2,
        autoLinkerApplyPosts: ap.posts !== false,
        autoLinkerApplyPages: ap.pages !== false,
        autoLinkerApplyProducts: ap.products !== false,
        autoLinkerSkipHeadings: sk2.headings !== false,
        autoLinkerSkipLinks: sk2.links !== false,
        autoLinkerSkipCode: sk2.code !== false,
        autoLinkerSkipFirstParagraph: !!sk2.first_paragraph,
        autoLinkerSkipBlockquotes: sk2.blockquotes !== false,
        scanFrequency: String(data.scan_frequency || 7),
        scanFrequencyUnit: data.scan_frequency_unit === "hours" ? "hours" : "days",
        scanAuto: !!data.scan_auto,
        monitorOosToSearch: !!(data.monitor && data.monitor.oos_to_search),
        monitorDeadToSearch: !!(data.monitor && data.monitor.dead_to_search),
        monitorOosMode: data.monitor && data.monitor.oos_mode === "search" ? "search" : "replacement",
        monitorDeadMode: data.monitor && data.monitor.dead_mode === "search" ? "search" : "replacement",
        enabled: !!ma2.enabled,
        iosOpenInSafari: ma2.ios_safari_button !== false,
        androidMode: ma2.android_mode === "intent" ? "intent" : "browser",
        blockBots: cp.block_bots !== false,
        redirectMethod: ["js_302", "js", "302"].includes(cp.redirect_method) ? cp.redirect_method : "js_302",
        autoLinkerRules: Array.isArray(al2.rules) ? al2.rules.map((r2, i) => ({
          id: r2.id || i + 1,
          nickname: r2.nickname || "",
          keywords: r2.keywords || "",
          link: r2.link || "",
          tag: r2.tag || "",
          matchType: r2.match_type === "broad" ? "broad" : "exact",
          caseSensitive: !!r2.case_sensitive,
          maxLinks: r2.max_links ? String(r2.max_links) : "",
          firstMatchOnly: !!r2.first_match_only,
          enabled: r2.enabled !== false,
          clicks: clicksMap["__rule__" + (r2.id || "")] || 0,
          isBroken: false
        })) : prev.autoLinkerRules
      }));
      setLoaded(true);
      if ((scan.links || 0) > 0) {
        setHasScannedSite(true);
        setAmazonLinksFound(scan.links);
        setScanPages(scan.pages || 0);
        setScanState("done");
      }
      if (data.monitor_summary) setMonitorSummary(data.monitor_summary);
      const selected = [...exc.globalExclusions, ...exc.globalExcludedTrees, ...exc.globalExceptions];
      tags.forEach((t2) => selected.push(...rulesToRuleValues(t2.rules)));
      if (selected.length) {
        fetch(`${cfg.rest}content/resolve?ids=${encodeURIComponent(selected.join(","))}`, { headers }).then((r2) => r2.json()).then((d) => {
          if (d && Array.isArray(d.items)) {
            cacheItems(d.items);
            setContentReady((c) => c + 1);
          }
        }).catch(() => {
        });
      }
    }).catch(() => {
    });
    fetch(cfg.rest + "monitor", { headers }).then((r2) => r2.json()).then((d) => {
      if (d && d.summary) {
        setMonitorSummary(d.summary);
        setMonitorProblems(d.problems || []);
      }
    }).catch(() => {
    });
    fetch(cfg.rest + "usage", { headers }).then((r2) => r2.json()).then((d) => {
      if (d && d.state) setSvcUsage(d);
    }).catch(() => {
    });
  }, []);
  const handleSave = reactExports.useCallback(() => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg || !loaded) return;
    setSaveState("saving");
    const payload = {
      tags: formData.btn1AffiliateRules.map((r2) => ({
        id: String(r2.id),
        nickname: r2.nickname || "",
        affiliate_id: r2.affiliateId || "",
        domain: r2.domain,
        enabled: r2.enabled !== false,
        mode: r2.mode === "rules" ? "rules" : "sitewide",
        rules: ruleValuesToRules(r2.ruleValues)
      })),
      link_options: {
        rel: formData.btn1FollowMode === "follow" ? "follow" : "nofollow",
        sponsored: !!formData.btn1Sponsored,
        new_tab: !!formData.btn1OpenInNewTab
      },
      default_tag: savedDefaultTag.current,
      geo_enabled: !!formData.geoEnabled,
      exclusions: exclusionsToBackend(formData.globalExclusions, formData.globalExcludedTrees, formData.globalExceptions),
      button: {
        text: formData.btn1Text,
        link_mode: formData.btn1LinkMode === "custom" ? "custom" : "generated",
        custom_link: formData.btn1Link,
        generated_domain: formData.btn1GeneratedDomain,
        skip_tag: !!formData.btn1SkipTag
      },
      auto_linker: {
        enabled: !!formData.autoLinkerEnabled,
        limit: parseInt(formData.autoLinkerLimit, 10) || 2,
        apply: {
          posts: !!formData.autoLinkerApplyPosts,
          pages: !!formData.autoLinkerApplyPages,
          products: !!formData.autoLinkerApplyProducts
        },
        skip: {
          headings: !!formData.autoLinkerSkipHeadings,
          links: !!formData.autoLinkerSkipLinks,
          code: !!formData.autoLinkerSkipCode,
          first_paragraph: !!formData.autoLinkerSkipFirstParagraph,
          blockquotes: !!formData.autoLinkerSkipBlockquotes
        },
        rules: formData.autoLinkerRules.map((r2) => ({
          id: String(r2.id),
          nickname: r2.nickname || "",
          keywords: r2.keywords || "",
          link: r2.link || "",
          tag: r2.tag || "",
          match_type: r2.matchType === "broad" ? "broad" : "exact",
          case_sensitive: !!r2.caseSensitive,
          max_links: r2.maxLinks === "" || r2.maxLinks == null ? 0 : parseInt(r2.maxLinks, 10) || 0,
          first_match_only: !!r2.firstMatchOnly,
          enabled: r2.enabled !== false
        }))
      },
      scan_frequency: parseInt(formData.scanFrequency, 10) || 7,
      scan_frequency_unit: formData.scanFrequencyUnit === "hours" ? "hours" : "days",
      scan_auto: !!formData.scanAuto,
      monitor: {
        oos_to_search: !!formData.monitorOosToSearch,
        dead_to_search: !!formData.monitorDeadToSearch,
        oos_mode: formData.monitorOosMode === "search" ? "search" : "replacement",
        dead_mode: formData.monitorDeadMode === "search" ? "search" : "replacement"
      },
      mobile_app: {
        enabled: !!formData.enabled,
        ios_safari_button: !!formData.iosOpenInSafari,
        android_mode: formData.androidMode === "intent" ? "intent" : "browser"
      },
      click_protection: {
        block_bots: !!formData.blockBots,
        redirect_method: ["js_302", "js", "302"].includes(formData.redirectMethod) ? formData.redirectMethod : "js_302"
      }
    };
    fetch(cfg.rest + "settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-WP-Nonce": cfg.nonce },
      body: JSON.stringify(payload)
    }).then((r2) => {
      if (!r2.ok) throw new Error("save failed");
      return r2.json();
    }).then(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2e3);
    }).catch(() => {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3e3);
    });
  }, [formData, loaded]);
  reactExports.useEffect(() => {
    if (!suiteMode) return;
    const handler = () => handleSave();
    window.addEventListener("devdome-suite-save", handler);
    return () => window.removeEventListener("devdome-suite-save", handler);
  }, [suiteMode, handleSave]);
  const autoLinkerImportRef = reactExports.useRef(null);
  const handleExportRules = reactExports.useCallback(() => {
    const data = formData.autoLinkerRules.map(({ id: id2, clicks, isBroken, ...r2 }) => r2);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auto-linker-rules.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [formData.autoLinkerRules]);
  const handleImportRules = reactExports.useCallback((e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) return;
        const rules = parsed.map((r2, i) => ({
          id: Date.now() + i,
          nickname: r2.nickname || "",
          keywords: r2.keywords || "",
          link: r2.link || "",
          tag: r2.tag || "",
          matchType: r2.matchType === "broad" ? "broad" : "exact",
          caseSensitive: !!r2.caseSensitive,
          maxLinks: r2.maxLinks || "",
          firstMatchOnly: !!r2.firstMatchOnly,
          enabled: r2.enabled !== false,
          clicks: 0,
          isBroken: false
        }));
        if (rules.length) setFormData((prev) => ({ ...prev, autoLinkerRules: rules }));
      } catch (err) {
      }
    };
    reader.readAsText(file);
  }, []);
  reactExports.useEffect(() => {
    if (showTagSearch && globalTagSearchRef.current) globalTagSearchRef.current.focus();
  }, [showTagSearch]);
  reactExports.useEffect(() => {
    if (showAutoLinkerSearch && globalAutoLinkerSearchRef.current) globalAutoLinkerSearchRef.current.focus();
  }, [showAutoLinkerSearch]);
  reactExports.useEffect(() => {
    if (showExclusionSearch && exclusionSearchRef.current) exclusionSearchRef.current.focus();
  }, [showExclusionSearch]);
  reactExports.useEffect(() => {
    if (exclusionModalType) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [exclusionModalType]);
  const handleCloseModal = reactExports.useCallback(() => {
    setExclusionModalType(null);
    setExclusionSelectedItems([]);
    setExclusionSearch("");
    setShowExclusionSearch(false);
    setExclusionCurrentPage(1);
    setExclusionTypeFilter("All");
    setExclusionLastSelected(null);
  }, []);
  const handleScanSite = reactExports.useCallback(() => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg) return;
    setScanState("scanning");
    fetch(cfg.rest + "scan", { method: "POST", headers: { "X-WP-Nonce": cfg.nonce } }).then((r2) => r2.json()).then((d) => {
      if (d && typeof d === "object") {
        setAmazonLinksFound(d.links || 0);
        setScanPages(d.pages || 0);
        setHasScannedSite(true);
        setScanState("done");
      } else {
        setScanState("idle");
      }
    }).catch(() => setScanState("idle"));
  }, []);
  const handleResetBots = reactExports.useCallback(() => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg) return;
    setBotsBlocked(0);
    fetch(cfg.rest + "reset-bots", { method: "POST", headers: { "X-WP-Nonce": cfg.nonce } }).then((r2) => r2.json()).then((d) => {
      if (d && typeof d.bots_blocked === "number") setBotsBlocked(d.bots_blocked);
    }).catch(() => {
    });
  }, []);
  const handleReplace = reactExports.useCallback((oldAsin) => {
    const cfg = window.DEVDAFFI_ADMIN;
    const next = (replaceVal[oldAsin] || "").trim().toUpperCase();
    if (!cfg || next.length !== 10 || next === oldAsin) return;
    setReplaceBusy(oldAsin);
    fetch(cfg.rest + "replace", { method: "POST", headers: { "Content-Type": "application/json", "X-WP-Nonce": cfg.nonce }, body: JSON.stringify({ old: oldAsin, new: next }) }).then((r2) => r2.ok ? r2.json() : Promise.reject()).then((d) => {
      if (d && d.summary) {
        setMonitorSummary(d.summary);
        setMonitorProblems(d.problems || []);
      }
      setReplaceVal((v2) => {
        const c = { ...v2 };
        delete c[oldAsin];
        return c;
      });
    }).catch(() => {
    }).finally(() => setReplaceBusy(null));
  }, [replaceVal]);
  const loadLive = reactExports.useCallback((append) => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg) return;
    setLiveState((s) => {
      const offset = append ? s.offset : 0;
      fetch(cfg.rest + "monitor/by-status?status=ok&limit=50&offset=" + offset, { headers: { "X-WP-Nonce": cfg.nonce } }).then((r2) => r2.json()).then((d) => {
        const newItems = d && d.items || [];
        setLiveState((prev) => ({
          items: append ? [...prev.items, ...newItems] : newItems,
          loading: false,
          offset: offset + newItems.length,
          hasMore: !!(d && d.has_more),
          loaded: true
        }));
      }).catch(() => setLiveState((prev) => ({ ...prev, loading: false })));
      return { ...s, loading: true };
    });
  }, []);
  const runMonitor = reactExports.useCallback((status) => {
    const cfg = window.DEVDAFFI_ADMIN;
    if (!cfg) return;
    const isStatus = status === "oos" || status === "dead";
    if (isStatus) setMonitorRefresh(status);
    else setMonitorState("checking");
    const url = cfg.rest + "monitor" + (isStatus ? "?status=" + status : "");
    fetch(url, { method: "POST", headers: { "X-WP-Nonce": cfg.nonce } }).then((r2) => r2.json()).then((d) => {
      if (d && d.summary) {
        setMonitorSummary(d.summary);
        setMonitorProblems(d.problems || []);
      }
    }).catch(() => {
    }).finally(() => {
      if (isStatus) setMonitorRefresh(null);
      else setMonitorState("idle");
    });
  }, []);
  const handleAddAutoLinkRule = reactExports.useCallback(() => {
    const newId = Date.now();
    setFormData((prev) => {
      const defaultTagId = prev.btn1AffiliateRules.length > 0 ? prev.btn1AffiliateRules[0].id : "";
      return {
        ...prev,
        autoLinkerRules: [...prev.autoLinkerRules, { id: newId, keywords: "", link: "", enabled: true, tag: `tag-${defaultTagId}`, nickname: "", clicks: 0, isBroken: false, matchType: "exact", caseSensitive: false, maxLinks: "", firstMatchOnly: false }]
      };
    });
    setTimeout(() => {
      const newEl = document.getElementById(`autolink-rule-${newId}`);
      if (newEl) newEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);
  const handleRemoveAutoLinkRule = reactExports.useCallback((id2, e) => {
    var _a2;
    const btnRect = (_a2 = e == null ? void 0 : e.currentTarget) == null ? void 0 : _a2.getBoundingClientRect();
    const targetY = btnRect ? btnRect.top : null;
    setFormData((prev) => {
      const rules = prev.autoLinkerRules;
      const idx = rules.findIndex((r2) => r2.id === id2);
      if (idx === -1) return prev;
      const targetRule = rules[idx + 1] || rules[idx - 1];
      if (targetY !== null && targetRule) {
        setTimeout(() => {
          const newBtn = document.querySelector(`#autolink-rule-${targetRule.id} button[title="Delete Rule"]`);
          if (newBtn) {
            const scrollDiff = newBtn.getBoundingClientRect().top - targetY;
            if (scrollDiff !== 0) window.scrollBy({ top: scrollDiff, behavior: "instant" });
          }
        }, 10);
      }
      return { ...prev, autoLinkerRules: rules.filter((rule) => rule.id !== id2) };
    });
  }, []);
  const handleAutoLinkerDragStart = reactExports.useCallback((e, index) => {
    setAutoLinkerDraggedRuleIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.4";
  }, []);
  const handleAutoLinkerDragEnter = reactExports.useCallback((e, index) => {
    e.preventDefault();
    setAutoLinkerDragOverRuleIdx((prev) => prev !== index ? index : prev);
  }, []);
  const handleAutoLinkerDragEnd = reactExports.useCallback((e) => {
    e.currentTarget.style.opacity = "1";
    setAutoLinkerDraggedRuleIdx(null);
    setAutoLinkerDragOverRuleIdx(null);
    setAutoLinkerDragEnabledId(null);
  }, []);
  const handleAutoLinkerDrop = reactExports.useCallback((e, dropIndex) => {
    e.preventDefault();
    setAutoLinkerDraggedRuleIdx((draggedIdx) => {
      if (draggedIdx === null || draggedIdx === dropIndex) return null;
      setFormData((prev) => {
        const newRules = [...prev.autoLinkerRules];
        const draggedItem = newRules[draggedIdx];
        newRules.splice(draggedIdx, 1);
        newRules.splice(dropIndex, 0, draggedItem);
        return { ...prev, autoLinkerRules: newRules };
      });
      return null;
    });
    setAutoLinkerDragOverRuleIdx(null);
    setAutoLinkerDragEnabledId(null);
  }, []);
  const handleAutoLinkRuleChange = reactExports.useCallback((id2, field, value) => {
    setFormData((prev) => ({
      ...prev,
      autoLinkerRules: prev.autoLinkerRules.map((rule) => rule.id === id2 ? { ...rule, [field]: value } : rule)
    }));
  }, []);
  const handleDuplicateAutoLinkRule = reactExports.useCallback((id2) => {
    const newId = Date.now();
    setFormData((prev) => {
      const ruleIndex = prev.autoLinkerRules.findIndex((r2) => r2.id === id2);
      if (ruleIndex === -1) return prev;
      const newRule = { ...prev.autoLinkerRules[ruleIndex], id: newId };
      const newRules = [...prev.autoLinkerRules];
      newRules.splice(ruleIndex + 1, 0, newRule);
      return { ...prev, autoLinkerRules: newRules };
    });
    setTimeout(() => {
      const newEl = document.getElementById(`autolink-rule-${newId}`);
      if (newEl) newEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);
  const handleAddRule = reactExports.useCallback((btnNumber) => {
    const field = `btn${btnNumber}AffiliateRules`;
    const newRuleId = Date.now();
    setFormData((prev) => {
      const rules = prev[field];
      const lastDomain = rules.length > 0 ? rules[rules.length - 1].domain : "amazon.com";
      const hasSitewide = rules.some((r2) => r2.domain === lastDomain && r2.mode === "sitewide");
      return { ...prev, [field]: [...rules, { id: newRuleId, affiliateId: "", domain: lastDomain, mode: hasSitewide ? "rules" : "sitewide", enabled: true, nickname: "", ruleValues: [], clicks: 0 }] };
    });
    setTimeout(() => {
      const newTagElement = document.getElementById(`tag-rule-${newRuleId}`);
      if (newTagElement) newTagElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);
  const handleRemoveRule = reactExports.useCallback((btnNumber, id2, e) => {
    var _a2;
    const btnRect = (_a2 = e == null ? void 0 : e.currentTarget) == null ? void 0 : _a2.getBoundingClientRect();
    const targetY = btnRect ? btnRect.top : null;
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => {
      const rules = prev[field];
      const idx = rules.findIndex((r2) => r2.id === id2);
      if (idx === -1) return prev;
      const targetRule = rules[idx + 1] || rules[idx - 1];
      if (targetY !== null && targetRule) {
        setTimeout(() => {
          const newBtn = document.querySelector(`#tag-rule-${targetRule.id} button[title="Delete Tag"]`);
          if (newBtn) {
            const scrollDiff = newBtn.getBoundingClientRect().top - targetY;
            if (scrollDiff !== 0) window.scrollBy({ top: scrollDiff, behavior: "instant" });
          }
        }, 10);
      }
      return { ...prev, [field]: rules.filter((rule) => rule.id !== id2) };
    });
  }, []);
  const handleDragStart = reactExports.useCallback((e, index) => {
    setDraggedRuleIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.opacity = "0.4";
  }, []);
  const handleDragEnter = reactExports.useCallback((e, index) => {
    e.preventDefault();
    setDragOverRuleIdx((prev) => prev !== index ? index : prev);
  }, []);
  const handleDragEnd = reactExports.useCallback((e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedRuleIdx(null);
    setDragOverRuleIdx(null);
    setDragEnabledId(null);
  }, []);
  const handleDrop = reactExports.useCallback((e, dropIndex) => {
    e.preventDefault();
    setDraggedRuleIdx((draggedIdx) => {
      if (draggedIdx === null || draggedIdx === dropIndex) return null;
      setFormData((prev) => {
        const field = "btn1AffiliateRules";
        const newRules = [...prev[field]];
        const draggedItem = newRules[draggedIdx];
        newRules.splice(draggedIdx, 1);
        newRules.splice(dropIndex, 0, draggedItem);
        return { ...prev, [field]: newRules };
      });
      return null;
    });
    setDragOverRuleIdx(null);
    setDragEnabledId(null);
  }, []);
  const handleRuleChange = reactExports.useCallback((btnNumber, id2, key, value) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => {
      let updatedRules = prev[field].map((rule) => rule.id === id2 ? { ...rule, [key]: value } : rule);
      if (key === "domain") {
        const hasSitewide = updatedRules.some((r2) => r2.id !== id2 && r2.domain === value && r2.mode === "sitewide");
        updatedRules = updatedRules.map((rule) => rule.id === id2 ? { ...rule, mode: hasSitewide ? "rules" : "sitewide" } : rule);
      } else if (key === "mode" && value === "sitewide") {
        const modifiedRule = updatedRules.find((r2) => r2.id === id2);
        if (modifiedRule) updatedRules = updatedRules.map((rule) => rule.id !== id2 && rule.domain === modifiedRule.domain && rule.mode === "sitewide" ? { ...rule, mode: "rules" } : rule);
      }
      return { ...prev, [field]: updatedRules };
    });
  }, []);
  const toggleExclusion = reactExports.useCallback((item, mode = "url") => {
    setFormData((prev) => {
      let exclusions = [...prev.globalExclusions || []];
      let excludedTrees = [...prev.globalExcludedTrees || []];
      let exceptions = [...prev.globalExceptions || []];
      let rules = [...prev.btn1AffiliateRules];
      if (mode === "tree") {
        if (excludedTrees.includes(item.value)) {
          excludedTrees = excludedTrees.filter((v2) => v2 !== item.value);
          exclusions = exclusions.filter((v2) => v2 !== item.value);
          exceptions = exceptions.filter((v2) => v2 !== item.value);
          const children = targetOptions.filter((t2) => t2.parentCategory === item.value).map((t2) => t2.value);
          exceptions = exceptions.filter((v2) => !children.includes(v2));
        } else {
          excludedTrees.push(item.value);
          if (!exclusions.includes(item.value)) exclusions.push(item.value);
          const children = targetOptions.filter((t2) => t2.parentCategory === item.value).map((t2) => t2.value);
          exceptions = exceptions.filter((v2) => !children.includes(v2));
          rules = rules.map((r2) => ({ ...r2, ruleValues: (r2.ruleValues || []).filter((v2) => v2 !== item.value && !children.includes(v2)) }));
        }
      } else if (mode === "url") {
        if (exclusions.includes(item.value)) {
          exclusions = exclusions.filter((v2) => v2 !== item.value);
          if (excludedTrees.includes(item.value) || item.parentCategory && excludedTrees.includes(item.parentCategory)) {
            if (!exceptions.includes(item.value)) exceptions.push(item.value);
          }
        } else {
          exclusions.push(item.value);
          exceptions = exceptions.filter((v2) => v2 !== item.value);
          rules = rules.map((r2) => ({ ...r2, ruleValues: (r2.ruleValues || []).filter((v2) => v2 !== item.value) }));
        }
      } else if (mode === "exception") {
        if (exceptions.includes(item.value)) {
          exceptions = exceptions.filter((v2) => v2 !== item.value);
          rules = rules.map((r2) => ({ ...r2, ruleValues: (r2.ruleValues || []).filter((v2) => v2 !== item.value) }));
        } else {
          exceptions.push(item.value);
        }
      } else if (mode === "exception_tree") {
        const children = targetOptions.filter((t2) => t2.parentCategory === item.value).map((t2) => t2.value);
        const allVals = [item.value, ...children];
        const allExceptions = allVals.every((v2) => exceptions.includes(v2));
        if (allExceptions) {
          exceptions = exceptions.filter((v2) => !allVals.includes(v2));
          rules = rules.map((r2) => ({ ...r2, ruleValues: (r2.ruleValues || []).filter((v2) => !allVals.includes(v2)) }));
        } else {
          allVals.forEach((v2) => {
            if (!exceptions.includes(v2)) exceptions.push(v2);
          });
        }
      }
      return { ...prev, globalExclusions: exclusions, globalExcludedTrees: excludedTrees, globalExceptions: exceptions, btn1AffiliateRules: rules };
    });
  }, []);
  const handleRestoreExcluded = reactExports.useCallback((val, mode) => {
    setFormData((prev) => {
      var _a2;
      const exclusions = new Set(prev.globalExclusions || []);
      const excludedTrees = new Set(prev.globalExcludedTrees || []);
      const exceptions = new Set(prev.globalExceptions || []);
      if (mode === "tree") {
        excludedTrees.delete(val);
        exclusions.delete(val);
        exceptions.delete(val);
        const children = targetOptions.filter((t2) => t2.parentCategory === val).map((t2) => t2.value);
        children.forEach((child) => exceptions.delete(child));
      } else if (mode === "url") {
        exclusions.delete(val);
        if (excludedTrees.has(val) || ((_a2 = targetOptions.find((t2) => t2.value === val)) == null ? void 0 : _a2.parentCategory) && excludedTrees.has(targetOptions.find((t2) => t2.value === val).parentCategory)) {
          exceptions.add(val);
        }
      } else if (mode === "exception") {
        exceptions.add(val);
      } else if (mode === "exception_tree") {
        exceptions.add(val);
        targetOptions.filter((t2) => t2.parentCategory === val).forEach((child) => exceptions.add(child.value));
      }
      return { ...prev, globalExclusions: [...exclusions], globalExcludedTrees: [...excludedTrees], globalExceptions: [...exceptions] };
    });
  }, []);
  const handleRuleTargetAdd = reactExports.useCallback((btnNumber, ruleId, value) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => ({ ...prev, [field]: prev[field].map((rule) => rule.id === ruleId ? { ...rule, ruleValues: Array.from(/* @__PURE__ */ new Set([...rule.ruleValues || [], value])) } : rule) }));
  }, []);
  const handleRuleTargetBulkAdd = reactExports.useCallback((btnNumber, ruleId, values) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => ({ ...prev, [field]: prev[field].map((rule) => rule.id === ruleId ? { ...rule, ruleValues: Array.from(/* @__PURE__ */ new Set([...rule.ruleValues || [], ...values])) } : rule) }));
  }, []);
  const handleRuleTargetRemove = reactExports.useCallback((btnNumber, ruleId, valueToRemove) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => ({ ...prev, [field]: prev[field].map((rule) => rule.id === ruleId ? { ...rule, ruleValues: rule.ruleValues.filter((v2) => v2 !== valueToRemove) } : rule) }));
  }, []);
  const handleRuleTargetClearAll = reactExports.useCallback((btnNumber, ruleId) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => ({ ...prev, [field]: prev[field].map((rule) => rule.id === ruleId ? { ...rule, ruleValues: [] } : rule) }));
  }, []);
  const handleRuleTargetBulkRemove = reactExports.useCallback((btnNumber, ruleId, valuesToRemove) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => ({ ...prev, [field]: prev[field].map((rule) => rule.id === ruleId ? { ...rule, ruleValues: rule.ruleValues.filter((v2) => !valuesToRemove.includes(v2)) } : rule) }));
  }, []);
  const handleTransferRuleTarget = reactExports.useCallback((btnNumber, value, fromRuleId, toRuleId) => {
    const field = `btn${btnNumber}AffiliateRules`;
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((rule) => {
        if (rule.id === fromRuleId) return { ...rule, ruleValues: rule.ruleValues.filter((v2) => v2 !== value) };
        if (rule.id === toRuleId) return { ...rule, ruleValues: Array.from(/* @__PURE__ */ new Set([...rule.ruleValues || [], value])) };
        return rule;
      })
    }));
  }, []);
  const [modalSrv, setModalSrv] = reactExports.useState({ items: [], counts: {}, total: 0 });
  reactExports.useEffect(() => {
    const cfg = typeof window !== "undefined" && window.DEVDAFFI_ADMIN;
    if (!cfg || !exclusionModalType || exclusionTab === "excluded") return;
    const ctrl = new AbortController();
    const h = setTimeout(() => {
      const url = `${cfg.rest}content?q=${encodeURIComponent(exclusionSearch)}&type=${encodeURIComponent(exclusionTypeFilter)}&page=${exclusionCurrentPage}`;
      fetch(url, { headers: { "X-WP-Nonce": cfg.nonce }, signal: ctrl.signal }).then((r2) => r2.json()).then((d) => {
        if (!d || !Array.isArray(d.items)) return;
        cacheItems(d.items);
        setModalSrv({ items: d.items, counts: d.counts || {}, total: d.total || d.items.length });
      }).catch(() => {
      });
    }, 250);
    return () => {
      clearTimeout(h);
      ctrl.abort();
    };
  }, [exclusionModalType, exclusionTab, exclusionSearch, exclusionTypeFilter, exclusionCurrentPage]);
  const modalData = reactExports.useMemo(() => {
    const isWP = typeof window !== "undefined" && !!window.DEVDAFFI_ADMIN;
    const SERVER_PER = 50;
    if (isWP && exclusionTab !== "excluded") {
      const c = modalSrv.counts || {};
      const tabCounts2 = { "All": c.All || 0, "Page": c.Page || 0, "Post Category": c["Post Category"] || 0, "Post": c.Post || 0, "Product Category": 0, "Product": 0 };
      const totalItems2 = modalSrv.total;
      const totalPages2 = Math.max(1, Math.ceil(totalItems2 / SERVER_PER));
      const safePage2 = Math.min(Math.max(1, exclusionCurrentPage), totalPages2);
      const startIndex2 = (safePage2 - 1) * SERVER_PER;
      const endIndex2 = Math.min(startIndex2 + modalSrv.items.length, totalItems2);
      return { currentItems: modalSrv.items, tabCounts: tabCounts2, totalItems: totalItems2, totalPages: totalPages2, safePage: safePage2, startIndex: startIndex2, endIndex: endIndex2, hasMatches: modalSrv.items.length > 0 };
    }
    const baseOptions = exclusionTab === "excluded" ? targetOptions.filter(
      (opt) => (formData.globalExclusions || []).includes(opt.value) || (formData.globalExcludedTrees || []).includes(opt.value) || opt.parentCategory && (formData.globalExcludedTrees || []).includes(opt.parentCategory) && !(formData.globalExceptions || []).includes(opt.value)
    ) : targetOptions;
    const matchedItems = getFilteredData(baseOptions, exclusionSearch, exclusionTypeFilter);
    const allMatched = getFilteredData(baseOptions, exclusionSearch, "All");
    const tabCounts = getTabCounts(allMatched);
    const totalItems = matchedItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / exclusionItemsPerPage));
    const safePage = Math.min(Math.max(1, exclusionCurrentPage), totalPages);
    const startIndex = (safePage - 1) * exclusionItemsPerPage;
    const endIndex = Math.min(startIndex + exclusionItemsPerPage, totalItems);
    const currentItems = matchedItems.slice(startIndex, endIndex);
    return { currentItems, tabCounts, totalItems, totalPages, safePage, startIndex, endIndex, hasMatches: matchedItems.length > 0 };
  }, [modalSrv, exclusionSearch, exclusionTab, exclusionTypeFilter, formData.globalExclusions, formData.globalExcludedTrees, formData.globalExceptions, exclusionCurrentPage, exclusionItemsPerPage]);
  const { grouped, sortedTypes } = reactExports.useMemo(() => {
    const grp = modalData.currentItems.reduce((acc, opt) => {
      if (!acc[opt.type]) acc[opt.type] = [];
      acc[opt.type].push(opt);
      return acc;
    }, {});
    const sorted = Object.keys(grp).sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b));
    return { grouped: grp, sortedTypes: sorted };
  }, [modalData.currentItems]);
  const handleRadioChange = reactExports.useCallback((name, value) => setFormData((prev) => ({ ...prev, [name]: value })), []);
  const handleCheckboxChange = reactExports.useCallback((e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked })), []);
  const handleChange = reactExports.useCallback((e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })), []);
  const applyToCount = (formData.autoLinkerApplyPosts ? 1 : 0) + (formData.autoLinkerApplyPages ? 1 : 0) + (formData.autoLinkerApplyProducts ? 1 : 0);
  const skipRulesCount = (formData.autoLinkerSkipHeadings ? 1 : 0) + (formData.autoLinkerSkipLinks ? 1 : 0) + (formData.autoLinkerSkipCode ? 1 : 0) + (formData.autoLinkerSkipFirstParagraph ? 1 : 0) + (formData.autoLinkerSkipBlockquotes ? 1 : 0);
  const displayedAutoLinkerRules = reactExports.useMemo(() => {
    const rules = formData.autoLinkerRules.map((r2, i) => ({ ...r2, _origIdx: i }));
    if (autoLinkerSortOrder === 1) rules.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    if (autoLinkerSortOrder === 2) rules.sort((a, b) => (a.clicks || 0) - (b.clicks || 0));
    return rules;
  }, [formData.autoLinkerRules, autoLinkerSortOrder]);
  const displayedTags = reactExports.useMemo(() => {
    const rules = formData.btn1AffiliateRules.map((r2, i) => ({ ...r2, _origIdx: i }));
    if (tagSortOrder === 1) rules.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    if (tagSortOrder === 2) rules.sort((a, b) => (a.clicks || 0) - (b.clicks || 0));
    return rules;
  }, [formData.btn1AffiliateRules, tagSortOrder]);
  const globalAllRulesList = reactExports.useMemo(() => {
    return formData.btn1AffiliateRules.map((r2, i) => ({ id: r2.id, index: i + 1, nickname: r2.nickname, domain: r2.domain, affiliateId: r2.affiliateId }));
  }, [formData.btn1AffiliateRules]);
  if (!loaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "flex items-center justify-center min-h-[200px] font-sans" : "min-h-screen flex items-center justify-center bg-gray-50 font-sans", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-[3px] border-gray-200 border-t-indigo-600 rounded-full animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: suiteMode ? "font-sans" : "min-h-screen bg-gray-50 font-sans", children: [
    !suiteMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border-b border-gray-200 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl px-6 py-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded text-white inline-flex items-center justify-center", style: { background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-gray-800 m-0", children: "DevDome Affiliate Manager" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: window.DEVDAFFI_ADMIN && window.DEVDAFFI_ADMIN.bug || "https://devdome.com/report-bug?plugin=devdome-affiliate-manager",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Report a bug",
          className: "ml-auto w-9 h-9 rounded-full border border-gray-300 bg-white grid place-items-center text-gray-500 hover:text-blue-700 hover:border-blue-600 transition-colors no-underline",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m8 2 1.88 1.88" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14.12 3.88 16 2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 20v-9" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 13H2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 13h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" })
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: suiteMode ? "w-full" : "max-w-5xl px-6 pt-3 pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { dangerouslySetInnerHTML: { __html: `
          .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        ` } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: suiteMode ? "divide-y divide-gray-100" : "", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "" : "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Link Setup", icon: Link, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-gray-800 flex items-center gap-2", children: [
                  "Affiliate Tags",
                  tagsExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[18px] h-[18px]", children: formData.btn1AffiliateRules.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Only full Amazon domain links are supported (e.g. amazon.com, amazon.de). Shortened links like amzn.to or a.co are not supported. You can add up to 100 Amazon tags." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-start sm:items-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-end", children: [
                showTagSearch ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-in fade-in zoom-in-95 duration-200 flex items-center shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: globalTagSearchRef,
                      type: "text",
                      value: tagSearchQuery,
                      onChange: (e) => setTagSearchQuery(e.target.value),
                      placeholder: "Search tags...",
                      className: "pl-7 pr-7 py-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[130px] h-8"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, className: "absolute left-2.5 top-2.5 text-indigo-400 pointer-events-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                    setShowTagSearch(false);
                    setTagSearchQuery("");
                  }, className: "absolute right-2 top-2.5 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowTagSearch(true);
                      setTagsExpanded(true);
                    },
                    className: "flex items-center justify-center p-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm h-8",
                    title: "Search Tags",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "text-indigo-500" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setTagSortOrder((prev) => (prev + 1) % 3),
                    className: `flex items-center justify-center p-1.5 bg-white border rounded-md transition-colors shadow-sm shrink-0 h-8 ${tagSortOrder !== 0 ? "border-indigo-400 text-indigo-600" : "border-gray-200 text-indigo-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"}`,
                    title: tagSortOrder === 0 ? "Sort by clicks (default)" : tagSortOrder === 1 ? "Sorting by clicks (highest first)" : "Sorting by clicks (lowest first)",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { size: 14, className: tagSortOrder === 2 ? "rotate-180 transition-transform" : "transition-transform" }),
                      tagSortOrder !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold ml-1", children: tagSortOrder === 1 ? "High" : "Low" })
                    ]
                  }
                ),
                !hasScannedSite ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleScanSite, className: "flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold hover:bg-indigo-100 hover:border-indigo-200 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8", title: "Scan site for Amazon links", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
                  " Scan Site For Amazon Links"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap shrink-0 h-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { size: 13, className: "text-indigo-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    amazonLinksFound,
                    " Amazon Links Found"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-indigo-200 mx-0.5", children: "|" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleScanSite, className: "hover:text-indigo-900 transition-colors focus:outline-none underline", children: "Re-Scan Site" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                  setExclusionModalType("tags");
                  setExclusionTab("all");
                }, className: "flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 13, className: "text-indigo-500" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Excluded URLs" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Exclusions" }),
                  (formData.globalExclusions.length > 0 || formData.globalExcludedTrees.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[16px] h-[16px]", children: formData.globalExclusions.length + formData.globalExcludedTrees.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTagsExpanded(!tagsExpanded), className: "flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap h-8", children: [
                  tagsExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13, className: "text-gray-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 13, className: "text-indigo-500" }),
                  tagsExpanded ? "Collapse" : "Expand Tags",
                  !tagsExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[18px] h-[18px]", children: formData.btn1AffiliateRules.length })
                ] })
              ] }) })
            ] }),
            tagsExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-2 duration-200", children: [
              displayedTags.map((rule) => {
                const ruleIdx = rule._origIdx;
                if (tagSearchQuery) {
                  const q2 = tagSearchQuery.toLowerCase();
                  const matches = (rule.nickname || "").toLowerCase().includes(q2) || (rule.affiliateId || "").toLowerCase().includes(q2);
                  if (!matches) return null;
                }
                const domainSitewideRule = formData.btn1AffiliateRules.find((r2) => r2.domain === rule.domain && r2.mode === "sitewide");
                const sitewideInfo = domainSitewideRule ? { ruleId: domainSitewideRule.id, ruleIndex: formData.btn1AffiliateRules.findIndex((r2) => r2.id === domainSitewideRule.id) + 1, nickname: domainSitewideRule.nickname, domain: domainSitewideRule.domain, affiliateId: domainSitewideRule.affiliateId } : null;
                const usedElsewhere = {};
                formData.btn1AffiliateRules.forEach((otherRule, otherIdx) => {
                  if (otherRule.id !== rule.id && otherRule.ruleValues) {
                    otherRule.ruleValues.forEach((val) => {
                      usedElsewhere[val] = { ruleId: otherRule.id, ruleIndex: otherIdx + 1, nickname: otherRule.nickname, affiliateId: otherRule.affiliateId || "Unknown", domain: otherRule.domain, isCategory: false, mode: otherRule.mode };
                      targetOptions.filter((t2) => t2.parentCategory === val).forEach((childProd) => {
                        if (!usedElsewhere[childProd.value]) usedElsewhere[childProd.value] = { ruleId: otherRule.id, ruleIndex: otherIdx + 1, nickname: otherRule.nickname, affiliateId: otherRule.affiliateId, domain: otherRule.domain, isCategory: true, mode: otherRule.mode };
                      });
                    });
                  }
                });
                const currentInherited = [];
                if (rule.ruleValues) {
                  rule.ruleValues.forEach((val) => {
                    targetOptions.filter((t2) => t2.parentCategory === val).forEach((childProd) => {
                      currentInherited.push(childProd.value);
                    });
                  });
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    id: `tag-rule-${rule.id}`,
                    draggable: !tagSearchQuery && tagSortOrder === 0 && (dragEnabledId === rule.id || draggedRuleIdx === ruleIdx),
                    onDragStart: (e) => handleDragStart(e, ruleIdx),
                    onDragEnter: (e) => handleDragEnter(e, ruleIdx),
                    onDragOver: (e) => e.preventDefault(),
                    onDragEnd: handleDragEnd,
                    onDrop: (e) => handleDrop(e, ruleIdx),
                    style: { zIndex: dragOverRuleIdx === ruleIdx || collapsedAssignedLists[rule.id] ? 60 : 50 - ruleIdx },
                    className: `relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mt-4 transition-all group hover:z-[60] ${rule.enabled === false ? "opacity-60 grayscale-[0.3]" : "bg-white"} ${dragOverRuleIdx === ruleIdx ? "border-indigo-500 shadow-md scale-[1.01] ring-2 ring-indigo-500/20" : "hover:shadow-md"} ${draggedRuleIdx === ruleIdx ? "border-dashed border-gray-400" : ""}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 -left-3 z-20 flex items-center max-w-[calc(100%-80px)] w-max pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-white text-[11px] font-bold pl-1.5 pr-2.5 py-1 rounded shadow-sm transition-colors flex items-center gap-1.5 w-full pointer-events-auto ${rule.enabled === false ? "bg-gray-400" : "bg-indigo-600"}`, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleRuleChange(1, rule.id, "enabled", !rule.enabled),
                            className: `relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled !== false ? "bg-indigo-400 hover:bg-indigo-300" : "bg-gray-500 hover:bg-gray-600"}`,
                            title: rule.enabled !== false ? "Turn off tag" : "Turn on tag",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: `pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${rule.enabled !== false ? "translate-x-3" : "translate-x-0"}` })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3.5 bg-white/40 shrink-0 mr-0.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "cursor-default flex items-center shrink-0", children: [
                          "Tag #",
                          ruleIdx + 1,
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30 mx-1.5 font-normal", children: "|" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 11, className: "mr-1 mb-[1px]", strokeWidth: 2.5 }),
                          rule.clicks || 0,
                          " Clicks"
                        ] }),
                        rule.clicks > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: (e) => {
                              e.stopPropagation();
                              handleRuleChange(1, rule.id, "clicks", 0);
                            },
                            className: "text-white/70 hover:text-white ml-0.5 shrink-0 flex items-center transition-colors focus:outline-none",
                            title: "Reset clicks",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 10, strokeWidth: 2.5 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center min-w-0 flex-1", children: editingNicknames[`tag-${rule.id}`] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            autoFocus: true,
                            value: rule.nickname || "",
                            onChange: (e) => handleRuleChange(1, rule.id, "nickname", e.target.value),
                            onBlur: () => setEditingNicknames((prev) => ({ ...prev, [`tag-${rule.id}`]: false })),
                            onKeyDown: (e) => e.key === "Enter" && setEditingNicknames((prev) => ({ ...prev, [`tag-${rule.id}`]: false })),
                            className: "text-gray-900 bg-white px-1.5 py-0.5 text-[10px] rounded outline-none font-semibold placeholder:text-gray-400 shadow-inner ml-1 w-full min-w-[100px]",
                            placeholder: "Tag Name"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          rule.nickname && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white border-l border-white/40 pl-1.5 ml-0.5 truncate block", children: rule.nickname }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => e.preventDefault(), onClick: () => setEditingNicknames((prev) => ({ ...prev, [`tag-${rule.id}`]: true })), className: "bg-white/20 hover:bg-white/30 text-white p-0.5 rounded transition-all focus:outline-none shadow-sm flex items-center justify-center ml-0.5 shrink-0", title: "Edit Tag Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 11, strokeWidth: 2.5 }) })
                        ] }) })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-2.5 -right-2.5 flex items-center gap-1.5 z-30", children: [
                        formData.btn1AffiliateRules.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => handleRemoveRule(1, rule.id, e), className: "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full p-1.5 shadow-sm transition-all pointer-events-auto", title: "Delete tag", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, strokeWidth: 2.5 }) }),
                        !tagSearchQuery && tagSortOrder === 0 && formData.btn1AffiliateRules.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            onMouseEnter: () => setDragEnabledId(rule.id),
                            onMouseLeave: () => {
                              if (draggedRuleIdx === null) setDragEnabledId(null);
                            },
                            className: "bg-white text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full p-1.5 shadow-sm transition-all cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-auto",
                            title: "Drag to reorder",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 13, strokeWidth: 2.5 })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 pt-6 w-full flex flex-col gap-4 transition-all duration-300 ${rule.enabled === false ? "opacity-40 pointer-events-none select-none grayscale-[0.3]" : ""}`, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap sm:flex-nowrap items-start gap-4 w-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[110px] shrink-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-600 mb-1 block", children: "Apply to" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(StyledSelect, { value: rule.mode, onChange: (e) => handleRuleChange(1, rule.id, "mode", e.target.value), wrapperClassName: "w-full shadow-sm", className: "!py-1.5 !px-3 text-[13px] font-semibold h-[34px] text-gray-700", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sitewide", children: "Sitewide" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rules", children: "Set Rules" })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px h-[34px] bg-gray-200 shrink-0 mx-1 mt-[18px]" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[150px]", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-600 mb-1 block", children: "Affiliate ID" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(StyledInput, { type: "text", placeholder: "tag-20", value: rule.affiliateId, onChange: (e) => handleRuleChange(1, rule.id, "affiliateId", e.target.value), className: "!py-1.5 !px-3 text-[13px] font-semibold text-gray-700 h-[34px] w-full shadow-inner" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[170px] shrink-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-bold text-gray-600 mb-1 block", children: "Amazon domain" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(StyledSelect, { value: rule.domain, onChange: (e) => handleRuleChange(1, rule.id, "domain", e.target.value), wrapperClassName: "w-full shadow-sm", className: "!py-1.5 !px-3 text-[13px] font-semibold h-[34px] text-gray-700", children: amazonDomains.map((domain) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: domain.value, children: domain.label }, domain.value)) })
                          ] })
                        ] }),
                        rule.mode === "rules" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-in fade-in slide-in-from-top-1 bg-gray-50/80 p-3 pt-1 rounded-lg relative z-[100] border border-gray-100 mt-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SearchableDropdown,
                            {
                              options: targetOptions,
                              selectedValues: rule.ruleValues || [],
                              currentInherited,
                              usedElsewhere,
                              currentRuleIndex: ruleIdx + 1,
                              currentRuleId: rule.id,
                              currentRuleMode: rule.mode,
                              currentRuleNickname: rule.nickname,
                              currentRuleDomain: rule.domain,
                              currentRuleAffiliateId: rule.affiliateId,
                              allRules: globalAllRulesList,
                              sitewideInfo,
                              globalExclusions: formData.globalExclusions,
                              globalExcludedTrees: formData.globalExcludedTrees,
                              globalExceptions: formData.globalExceptions,
                              onSelect: (val) => handleRuleTargetAdd(1, rule.id, val),
                              onBulkSelect: (values) => handleRuleTargetBulkAdd(1, rule.id, values),
                              onBulkRemove: (values) => handleRuleTargetBulkRemove(1, rule.id, values),
                              onTransfer: (val, fromRuleId, toRuleId) => handleTransferRuleTarget(1, val, fromRuleId, toRuleId),
                              onRemove: (val) => handleRuleTargetRemove(1, rule.id, val),
                              onRemoveFromOther: (val, fromRuleId) => handleRuleTargetRemove(1, fromRuleId, val),
                              onRestoreExcluded: handleRestoreExcluded,
                              placeholder: "Search master list of pages, categories, and products..."
                            }
                          ),
                          rule.ruleValues && rule.ruleValues.length > 0 && (() => {
                            const isExpanded = collapsedAssignedLists[rule.id] === true;
                            const toggleCollapse = () => setCollapsedAssignedLists((prev) => ({ ...prev, [rule.id]: !isExpanded }));
                            const assignedItems = rule.ruleValues.map((val) => {
                              const optData = getOptionData(val);
                              return { val, type: (optData == null ? void 0 : optData.type) || "Unknown", label: (optData == null ? void 0 : optData.label) || val, link: getLinkForValue(val), childCount: optData == null ? void 0 : optData.childCount, childLabel: optData == null ? void 0 : optData.childLabel, linkCount: optData == null ? void 0 : optData.linkCount };
                            });
                            const groupedAssigned = assignedItems.reduce((acc, item) => {
                              if (!acc[item.type]) acc[item.type] = [];
                              acc[item.type].push(item);
                              return acc;
                            }, {});
                            const sortedAssignedTypes = Object.keys(groupedAssigned).sort((a, b) => {
                              const indexA = TYPE_ORDER.indexOf(a);
                              const indexB = TYPE_ORDER.indexOf(b);
                              return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
                            });
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 border border-gray-200 rounded-lg bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-300", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50/80 px-3 py-2 border-b border-gray-200 flex justify-between items-center select-none rounded-t-lg group cursor-pointer", onClick: toggleCollapse, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-700 transition-colors", title: isExpanded ? "Collapse assigned items" : "Expand assigned items", children: [
                                    "TAG #",
                                    ruleIdx + 1,
                                    " ",
                                    rule.nickname ? `(${rule.nickname}) ` : "",
                                    "USED ",
                                    rule.ruleValues.length,
                                    " ",
                                    rule.ruleValues.length === 1 ? "TIME" : "TIMES"
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
                                    e.stopPropagation();
                                    handleRuleTargetClearAll(1, rule.id);
                                  }, className: "text-[9px] font-bold bg-white text-gray-400 border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-2 py-0.5 rounded shadow-sm transition-colors", title: "Clear all assigned items", children: "Clear All" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-gray-400 group-hover:text-indigo-600 transition-colors", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold", children: isExpanded ? "HIDE" : "SHOW" }),
                                  isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 })
                                ] })
                              ] }),
                              isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col rounded-b-lg", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[170px] min-h-[120px] max-h-[60vh] resize-y overflow-y-auto custom-scrollbar bg-white flex flex-col rounded-b-lg", children: sortedAssignedTypes.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1.5 bg-gray-100/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-t first:border-t-0 sticky top-0 z-10 shadow-[0_2px_4px_rgba(0,0,0,0.02)]", children: getTypeLabel(type) }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-100/70", children: groupedAssigned[type].map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 hover:bg-indigo-50/30 transition-colors group", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pr-3", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] font-semibold text-gray-800 truncate", children: item.label }),
                                        item.childCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded shadow-sm border border-sky-100", title: `${item.childCount} ${item.childLabel} inside this category`, children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 10 }),
                                          " ",
                                          item.childCount,
                                          " ",
                                          item.childLabel
                                        ] }),
                                        item.linkCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shadow-sm border border-indigo-100", title: `${item.linkCount} Amazon links found in this ${item.type.toLowerCase()}`, children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { size: 10 }),
                                          " ",
                                          item.linkCount,
                                          " Amazon Links"
                                        ] })
                                      ] }),
                                      item.link && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-gray-500 font-mono truncate", children: item.link }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", className: "text-gray-400 hover:text-indigo-600 transition-colors shrink-0", title: "Open link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 15 }) })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleRuleTargetRemove(1, rule.id, item.val), className: "text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 border border-transparent hover:border-red-100 transition-all focus:outline-none shrink-0", title: "Remove assignment", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, strokeWidth: 2.5 }) })
                                  ] }, idx)) })
                                ] }, type)) }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0.5 right-0.5 pointer-events-none text-indigo-400 z-50 opacity-80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15", y1: "6", x2: "6", y2: "15" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15", y1: "11", x2: "11", y2: "15" })
                                ] }) })
                              ] })
                            ] });
                          })()
                        ] })
                      ] })
                    ]
                  },
                  rule.id
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2 px-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { ref: addRuleButtonRef, type: "button", onClick: () => handleAddRule(1), className: "flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors focus:outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, strokeWidth: 2.5 }),
                " Add Tag"
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            svcUsage && !svcUsage.usage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: svcUsage.connect_url, target: "_top", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "14px", fontWeight: 600, borderRadius: "8px", padding: "10px 20px", textDecoration: "none", cursor: "pointer", lineHeight: 1, whiteSpace: "nowrap", transition: ".12s", color: "#fff", background: "#2563eb", border: "1px solid #2563eb", boxShadow: "0 4px 10px -3px rgba(37,99,235,.5)" }, onMouseEnter: (e) => {
                e.currentTarget.style.background = "#1d4ed8";
                e.currentTarget.style.borderColor = "#1d4ed8";
              }, onMouseLeave: (e) => {
                e.currentTarget.style.background = "#2563eb";
                e.currentTarget.style.borderColor = "#2563eb";
              }, children: "Connect your DevDome account" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-500", children: "Store routing runs on DevDome servers. Requires a DevDome account." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: svcUsage && !svcUsage.usage ? "opacity-50 pointer-events-none" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "OneLink Alternative", hint: "Visitors land on their local Amazon store with your tag for it.", tooltip: "Visitors from a country where you have a regional tag are sent to that store (with the matching product when it exists, otherwise its search page). Everyone else keeps the original link, so a commission is never lost.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "geoEnabled", checked: formData.geoEnabled, onChange: handleCheckboxChange, label: "Auto-redirect visitors to their local Amazon store" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 pb-3 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800", children: "Link Options" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "SEO Attributes", hint: "nofollow and sponsored are what Amazon expects on affiliate links.", tooltip: "Amazon Associates asks for rel=nofollow sponsored on affiliate links. Open in new tab keeps your page open while the visitor shops.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-6 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "btn1FollowMode", value: "nofollow", checked: formData.btn1FollowMode === "nofollow", onChange: handleChange, className: "mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-indigo-600 transition-colors", children: "No Follow" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "btn1FollowMode", value: "follow", checked: formData.btn1FollowMode === "follow", onChange: handleChange, className: "mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-indigo-600 transition-colors", children: "Follow" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-300 hidden sm:block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "btn1OpenInNewTab", checked: formData.btn1OpenInNewTab, onChange: handleChange, className: "mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-indigo-600 transition-colors", children: "Open in New Tab" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-300 hidden sm:block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center text-sm font-semibold text-gray-700 cursor-pointer select-none group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "btn1Sponsored", checked: formData.btn1Sponsored, onChange: handleChange, className: "mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-indigo-600 transition-colors", children: "Sponsored" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Adding the 'sponsored' attribute helps search engines identify affiliate links correctly and avoids SEO penalties for undisclosed commercial relationships." })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-gray-100 pb-3 mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800", children: "Button Display" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Controls the [devdaffi_button] shortcode: a styled button you can place in any post, page, or product. It links to a product (from its ASIN) or a custom URL and is automatically affiliate-tagged." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Button Text", hint: "Shown on every generated Amazon button.", tooltip: "Change it site wide here. A single button can override it in its shortcode.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StyledInput, { type: "text", name: "btn1Text", value: formData.btn1Text, onChange: handleChange, placeholder: "Check Price On Amazon" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Button Link", hint: "Generated links carry your tag automatically.", tooltip: "The button will automatically link to the Amazon product page using your affiliate settings.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              formData.btn1LinkMode === "generated" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: btn1Editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: formData.btn1GeneratedDomain, onChange: (e) => setFormData((prev) => ({ ...prev, btn1GeneratedDomain: e.target.value })), className: "flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm text-gray-700", children: amazonDomains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d.value, children: d.label }, d.value)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setBtn1Editing(false), className: "shrink-0 px-3 py-2 bg-indigo-600 text-white rounded-lg text-[12px] font-bold hover:bg-indigo-700 shadow-sm flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
                  " Done"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StyledInput, { type: "text", value: `https://www.${formData.btn1GeneratedDomain}/dp/{ASIN}${formData.btn1SkipTag ? "" : "?tag={your-tag}"}`, disabled: true, className: "!pr-[155px]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-y-0 right-2 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setBtn1Editing(true), title: "Change Amazon marketplace (.com, .co.uk, …)", className: "px-2 py-1 bg-white border border-gray-300 rounded-md text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 shadow-sm flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 12 }),
                    " Edit"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                    setFormData((prev) => ({ ...prev, btn1GeneratedDomain: "amazon.com" }));
                    setBtn1Editing(false);
                  }, title: "Reset to amazon.com", className: "px-2 py-1 bg-white border border-gray-300 rounded-md text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:border-indigo-300 shadow-sm flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 12 }),
                    " Regenerate"
                  ] })
                ] })
              ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StyledInput, { type: "text", name: "btn1Link", value: formData.btn1Link, onChange: handleChange, placeholder: "https://your-site.com/dp/{ASIN}" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 items-center flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group select-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "btn1LinkMode", value: "generated", checked: formData.btn1LinkMode === "generated", onChange: handleChange, className: "w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors", children: "Use Generated Link" })
                ] }),
                formData.btn1LinkMode === "generated" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group select-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: "btn1SkipTag", checked: formData.btn1SkipTag, onChange: handleChange, className: "w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors", children: "Don't add tag" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Build the Amazon link from the ASIN but leave off your ?tag= affiliate ID." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group select-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "btn1LinkMode", value: "custom", checked: formData.btn1LinkMode === "custom", onChange: handleChange, className: "w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors", children: "Use Custom Link" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Custom links to non-Amazon sites won't receive your affiliate tag. Use {ASIN} in the URL and it'll be replaced with the product's ASIN at render." })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Shortcode", hint: "Paste it into any post or page.", tooltip: "Paste this into any post or page to render the button. In generated mode, replace YOUR_ASIN with the product's Amazon ASIN.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 px-3 py-2 bg-gray-900 text-emerald-300 rounded-lg text-[13px] font-mono select-all break-all", children: formData.btn1LinkMode === "custom" && !/\{ASIN\}/i.test(formData.btn1Link || "") ? "[devdaffi_button]" : '[devdaffi_button asin="YOUR_ASIN"]' }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                if (navigator.clipboard) navigator.clipboard.writeText(formData.btn1LinkMode === "custom" && !/\{ASIN\}/i.test(formData.btn1Link || "") ? "[devdaffi_button]" : '[devdaffi_button asin="YOUR_ASIN"]');
              }, className: "shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }),
                " Copy"
              ] })
            ] }) })
          ] })
        ] }) }) }) }),
        (() => {
          const bottomSections = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "mt-8" : "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Section,
              {
                title: "Keyword Auto-Linker",
                icon: WandSparkles,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-in fade-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-wrap xl:flex-nowrap items-center justify-between gap-2 ${autoLinkerExpanded || showAutoLinkerGlobalSettings ? "border-b border-gray-100 pb-4 mb-4" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-base font-bold text-gray-800 whitespace-nowrap flex items-center gap-1.5", children: [
                        "Keyword Rules",
                        autoLinkerExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[18px] h-[18px]", children: formData.autoLinkerRules.length }),
                        autoLinkerExpanded && formData.autoLinkerRules.some((r2) => r2.isBroken) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-red-50 border border-red-200 text-red-600 px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[18px] h-[18px] font-bold", title: `${formData.autoLinkerRules.filter((r2) => r2.isBroken).length} broken links`, children: formData.autoLinkerRules.filter((r2) => r2.isBroken).length }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Turn the auto-linking engine on or off globally. When enabled, it will scan your page content and automatically convert specified keywords into Amazon links. Rules are processed top-to-bottom. Drag to set priority.", alignment: "left", direction: "bottom" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block w-px h-5 bg-gray-200 mx-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-2 px-2.5 py-1 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors h-8",
                          onClick: () => {
                            const next = !formData.autoLinkerEnabled;
                            setFormData((prev) => ({ ...prev, autoLinkerEnabled: next }));
                            if (next) setAutoLinkerExpanded(true);
                          },
                          title: formData.autoLinkerEnabled ? "Turn Off" : "Turn On",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `relative inline-flex h-4 w-7 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.autoLinkerEnabled ? "bg-indigo-600" : "bg-gray-300"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: `pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.autoLinkerEnabled ? "translate-x-3" : "translate-x-0"}` }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-bold uppercase tracking-wider ${formData.autoLinkerEnabled ? "text-indigo-700" : "text-gray-500"}`, children: formData.autoLinkerEnabled ? "Enabled" : "Disabled" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 flex-wrap justify-end relative z-[70]", children: [
                      showAutoLinkerSearch ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-in fade-in zoom-in-95 duration-200 flex items-center shrink-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            ref: globalAutoLinkerSearchRef,
                            type: "text",
                            value: autoLinkerSearchQuery,
                            onChange: (e) => setAutoLinkerSearchQuery(e.target.value),
                            placeholder: "Search rules...",
                            className: "pl-7 pr-7 py-1 text-xs font-semibold text-gray-700 border border-gray-200 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[130px] h-8"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, className: "absolute left-2.5 top-2.5 text-indigo-400 pointer-events-none" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                          setShowAutoLinkerSearch(false);
                          setAutoLinkerSearchQuery("");
                        }, className: "absolute right-2 top-2.5 text-gray-400 hover:text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }) })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setShowAutoLinkerSearch(true);
                            setAutoLinkerExpanded(true);
                          },
                          className: "flex items-center justify-center p-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0 h-8",
                          title: "Search Rules",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "text-indigo-500" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setAutoLinkerSortOrder((prev) => (prev + 1) % 3),
                          className: `flex items-center justify-center p-1.5 bg-white border rounded-md transition-colors shadow-sm shrink-0 h-8 ${autoLinkerSortOrder !== 0 ? "border-indigo-400 text-indigo-600" : "border-gray-200 text-indigo-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"}`,
                          title: autoLinkerSortOrder === 0 ? "Sort by clicks (default)" : autoLinkerSortOrder === 1 ? "Sorting by clicks (highest first)" : "Sorting by clicks (lowest first)",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { size: 14, className: autoLinkerSortOrder === 2 ? "rotate-180 transition-transform" : "transition-transform" }),
                            autoLinkerSortOrder !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold ml-1", children: autoLinkerSortOrder === 1 ? "High" : "Low" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
                        setExclusionModalType("autolinker");
                        setExclusionTab("all");
                      }, className: "flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 13, className: "text-indigo-500" }),
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Excluded URLs" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Exclusions" }),
                        (formData.globalExclusions.length > 0 || formData.globalExcludedTrees.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[16px] h-[16px]", children: formData.globalExclusions.length + formData.globalExcludedTrees.length })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setShowAutoLinkerGlobalSettings(!showAutoLinkerGlobalSettings), className: `flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border rounded-md text-[11px] font-bold transition-colors shadow-sm whitespace-nowrap shrink-0 h-8 ${showAutoLinkerGlobalSettings ? "border-indigo-400 text-indigo-700 ring-1 ring-indigo-500/20" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 13, className: "text-indigo-500" }),
                        "Global Settings",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 13, className: `text-gray-400 transition-transform ${showAutoLinkerGlobalSettings ? "rotate-180 text-indigo-500" : ""}` })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAutoLinkerExpanded(!autoLinkerExpanded), className: "flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[11px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm whitespace-nowrap shrink-0 h-8", children: [
                        autoLinkerExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 13, className: "text-gray-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 13, className: "text-indigo-500" }),
                        autoLinkerExpanded ? "Collapse" : "Expand Keywords",
                        !autoLinkerExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] ml-0.5 leading-none flex items-center justify-center min-w-[16px] h-[16px]", children: formData.autoLinkerRules.length })
                      ] })
                    ] })
                  ] }),
                  showAutoLinkerGlobalSettings && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-wrap items-center justify-end gap-3 bg-gray-50/80 px-4 py-2.5 rounded-lg border border-gray-200 mb-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2 relative z-[120] ${!formData.autoLinkerEnabled ? "grayscale" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600", children: "Max links/page" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Global limit. We strongly advise keeping this limit at 1 or 2. Adding too many automated affiliate links to a single page can harm your website's SEO rankings and create a spammy user experience." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: formData.autoLinkerLimit, onChange: (val) => handleRadioChange("autoLinkerLimit", val), min: 1, max: 99, className: "w-12 h-7 py-1 px-1 text-[12px] font-bold" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0 ml-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600 mr-0.5", children: "Show In:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxDropdown, { label: `${applyToCount} Selected`, icon: PanelsTopLeft, compact: true, scrollable: false, children: [
                        { name: "autoLinkerApplyPosts", label: "Posts" },
                        { name: "autoLinkerApplyPages", label: "Pages" },
                        { name: "autoLinkerApplyProducts", label: "Products", hint: "WooCommerce" }
                      ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer group gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: opt.name, checked: formData[opt.name], onChange: handleChange, className: "h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-bold text-gray-700 group-hover:text-indigo-700 whitespace-nowrap", children: opt.label })
                        ] }),
                        opt.hint && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: opt.hint, alignment: "right" })
                      ] }, opt.name)) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0 ml-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600 mr-0.5", children: "Skip:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxDropdown, { label: `${skipRulesCount} Selected`, icon: Shield, compact: true, scrollable: false, children: [
                        { name: "autoLinkerSkipHeadings", label: "Skip headings H1–H6", hint: "Won't turn keywords inside titles and headings into links" },
                        { name: "autoLinkerSkipLinks", label: "Skip existing links", hint: "Won't put a link inside another link, prevents broken HTML" },
                        { name: "autoLinkerSkipCode", label: "Skip code and pre blocks", hint: "Won't turn keywords inside code snippets into links" },
                        { name: "autoLinkerSkipFirstParagraph", label: "Skip first paragraph", hint: "The first paragraph of your post won't get any auto-links. Some people prefer a clean intro before affiliate links start appearing." },
                        { name: "autoLinkerSkipBlockquotes", label: "Skip blockquotes", hint: "Won't add links inside quoted text, keeps quotes clean and unaltered." }
                      ].map((skip) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer group gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", name: skip.name, checked: formData[skip.name], onChange: handleChange, className: "h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-bold text-gray-700 group-hover:text-indigo-700 whitespace-nowrap", children: skip.label })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: skip.hint, alignment: "right" })
                      ] }, skip.name)) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 ml-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: autoLinkerImportRef, type: "file", accept: "application/json,.json", onChange: handleImportRules, className: "hidden" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => autoLinkerImportRef.current && autoLinkerImportRef.current.click(), className: "px-2.5 py-1 bg-white border border-gray-200 text-indigo-600 text-[11px] font-bold rounded-md shadow-sm hover:bg-indigo-50 transition-colors h-7", children: "Import Rules" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleExportRules, className: "px-2.5 py-1 bg-white border border-gray-200 text-indigo-600 text-[11px] font-bold rounded-md shadow-sm hover:bg-indigo-50 transition-colors h-7", children: "Export Rules" })
                    ] })
                  ] }),
                  autoLinkerExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-2 duration-200", children: [
                    displayedAutoLinkerRules.map((rule) => {
                      const ruleIdx = rule._origIdx;
                      if (autoLinkerSearchQuery) {
                        const q2 = autoLinkerSearchQuery.toLowerCase();
                        const matches = (rule.keywords || "").toLowerCase().includes(q2) || (rule.link || "").toLowerCase().includes(q2);
                        if (!matches) return null;
                      }
                      formData.btn1AffiliateRules.map((r2, i) => ({ id: r2.id, index: i + 1, nickname: r2.nickname, domain: r2.domain, affiliateId: r2.affiliateId }));
                      const isShortlink = /amzn\.to|a\.co|amzn\.eu/i.test(rule.link || "");
                      const isInvalidFormat = (rule.link || "").length > 0 && !isShortlink && !(/^[a-zA-Z0-9]{10}$/.test((rule.link || "").trim()) || /amazon\./i.test(rule.link));
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          id: `autolink-rule-${rule.id}`,
                          draggable: !autoLinkerSearchQuery && autoLinkerSortOrder === 0 && (autoLinkerDragEnabledId === rule.id || autoLinkerDraggedRuleIdx === ruleIdx),
                          onDragStart: (e) => handleAutoLinkerDragStart(e, ruleIdx),
                          onDragEnter: (e) => handleAutoLinkerDragEnter(e, ruleIdx),
                          onDragOver: (e) => e.preventDefault(),
                          onDragEnd: handleAutoLinkerDragEnd,
                          onDrop: (e) => handleAutoLinkerDrop(e, ruleIdx),
                          style: { zIndex: autoLinkerDragOverRuleIdx === ruleIdx || expandedAutoLinkSettings[rule.id] ? 100 : 50 - ruleIdx },
                          className: `relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mt-4 transition-all group hover:z-[100]
                                            ${rule.enabled === false || !formData.autoLinkerEnabled ? "opacity-70 grayscale-[0.2]" : "bg-white"}
                                            ${autoLinkerDragOverRuleIdx === ruleIdx ? "border-indigo-500 shadow-md scale-[1.01] ring-2 ring-indigo-500/20" : "hover:shadow-md"}
                                            ${autoLinkerDraggedRuleIdx === ruleIdx ? "border-dashed border-gray-400" : ""}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 -left-3 z-20 flex items-center max-w-[calc(100%-80px)] w-max pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-white text-[11px] font-bold pl-1.5 pr-2.5 py-1 rounded shadow-sm transition-colors flex items-center gap-1.5 w-full pointer-events-auto ${rule.enabled === false ? "bg-gray-400" : "bg-indigo-600"}`, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => handleAutoLinkRuleChange(rule.id, "enabled", !rule.enabled),
                                  className: `relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled !== false ? "bg-indigo-400 hover:bg-indigo-300" : "bg-gray-500 hover:bg-gray-600"}`,
                                  title: rule.enabled !== false ? "Turn off rule" : "Turn on rule",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: `pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${rule.enabled !== false ? "translate-x-3" : "translate-x-0"}` })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3.5 bg-white/40 shrink-0 mr-0.5" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "cursor-default flex items-center shrink-0", children: [
                                "Rule #",
                                ruleIdx + 1,
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30 mx-1.5 font-normal", children: "|" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 11, className: "mr-1 mb-[1px]", strokeWidth: 2.5 }),
                                rule.clicks || 0,
                                " Clicks"
                              ] }),
                              rule.clicks > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: (e) => {
                                    e.stopPropagation();
                                    handleAutoLinkRuleChange(rule.id, "clicks", 0);
                                  },
                                  className: "text-white/70 hover:text-white ml-0.5 shrink-0 flex items-center transition-colors focus:outline-none",
                                  title: "Reset clicks",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 10, strokeWidth: 2.5 })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center min-w-0 flex-1", children: editingNicknames[`al-${rule.id}`] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "text",
                                  autoFocus: true,
                                  value: rule.nickname || "",
                                  onChange: (e) => handleAutoLinkRuleChange(rule.id, "nickname", e.target.value),
                                  onBlur: () => setEditingNicknames((prev) => ({ ...prev, [`al-${rule.id}`]: false })),
                                  onKeyDown: (e) => e.key === "Enter" && setEditingNicknames((prev) => ({ ...prev, [`al-${rule.id}`]: false })),
                                  className: "text-gray-900 bg-white px-1.5 py-0.5 text-[10px] rounded outline-none font-semibold placeholder:text-gray-400 shadow-inner ml-1 w-full min-w-[100px]",
                                  placeholder: "Rule Name"
                                }
                              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                                rule.nickname && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white border-l border-white/40 pl-1.5 ml-0.5 truncate block", children: rule.nickname }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onMouseDown: (e) => e.preventDefault(), onClick: () => setEditingNicknames((prev) => ({ ...prev, [`al-${rule.id}`]: true })), className: "bg-white/20 hover:bg-white/30 text-white p-0.5 rounded transition-all focus:outline-none shadow-sm flex items-center justify-center ml-0.5 shrink-0", title: "Edit nickname", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 11, strokeWidth: 2.5 }) })
                              ] }) })
                            ] }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-2.5 -right-2.5 flex items-center gap-1.5 z-30", children: [
                              formData.autoLinkerRules.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => handleRemoveAutoLinkRule(rule.id, e), className: "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full p-1.5 shadow-sm transition-all pointer-events-auto", title: "Delete rule", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, strokeWidth: 2.5 }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  onClick: () => setExpandedAutoLinkSettings((prev) => ({ ...prev, [rule.id]: !prev[rule.id] })),
                                  className: `bg-white rounded-full p-1.5 shadow-sm transition-all border pointer-events-auto ${expandedAutoLinkSettings[rule.id] ? "border-indigo-300 text-indigo-600 ring-1 ring-indigo-500/20" : "border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50"}`,
                                  title: "Rule settings",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 13, strokeWidth: 2.5 })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => handleDuplicateAutoLinkRule(rule.id), className: "bg-white text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full p-1.5 shadow-sm transition-all pointer-events-auto", title: "Duplicate rule", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13, strokeWidth: 2.5 }) }),
                              !autoLinkerSearchQuery && autoLinkerSortOrder === 0 && formData.autoLinkerRules.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  onMouseEnter: () => setAutoLinkerDragEnabledId(rule.id),
                                  onMouseLeave: () => {
                                    if (autoLinkerDraggedRuleIdx === null) setAutoLinkerDragEnabledId(null);
                                  },
                                  className: "bg-white text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full p-1.5 shadow-sm transition-all cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-auto",
                                  title: "Drag to reorder",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 13, strokeWidth: 2.5 })
                                }
                              )
                            ] }),
                            expandedAutoLinkSettings[rule.id] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-gray-100 px-4 py-3 bg-gray-50/80 shadow-inner animate-in fade-in zoom-in-95 duration-200 flex flex-wrap items-center justify-end gap-4 relative z-[100] mt-4 mx-0.5 rounded-t-md", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600", children: "Max links/page" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Rule limit. We strongly advise keeping this limit low. Linking the same keyword too many times can harm SEO.", direction: "bottom", alignment: "center", className: "z-[9999]" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(NumberInput, { value: rule.maxLinks, onChange: (val) => handleAutoLinkRuleChange(rule.id, "maxLinks", val), min: 1, max: 99, placeholder: "2", className: "w-10 h-7 py-1 px-1.5 text-[12px] font-bold" })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 ml-2 border-l border-gray-200 pl-3", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600 flex items-center gap-1", children: "Match type" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(MatchTypeDropdown, { value: rule.matchType || "exact", onChange: (val) => handleAutoLinkRuleChange(rule.id, "matchType", val) })
                              ] }),
                              (!rule.matchType || rule.matchType === "exact") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 animate-in fade-in zoom-in-95 duration-200 ml-2 border-l border-gray-200 pl-3", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group select-none", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: rule.caseSensitive || false, onChange: (e) => handleAutoLinkRuleChange(rule.id, "caseSensitive", e.target.checked), className: "h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 flex-shrink-0 shadow-sm" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors", children: "Case sensitive" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: 'When enabled: "Nike" and "nike" are different keywords, only "Nike" gets linked. When disabled: both get linked.', direction: "bottom", alignment: "center", className: "z-[9999]" })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 ml-2 border-l border-gray-200 pl-3", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group select-none", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: rule.firstMatchOnly || false, onChange: (e) => handleAutoLinkRuleChange(rule.id, "firstMatchOnly", e.target.checked), className: "h-3.5 w-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 flex-shrink-0 shadow-sm" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors", children: "Only link first match" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Skip all other occurrences after the first link appears", direction: "bottom", alignment: "right", className: "z-[9999]" })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 ${expandedAutoLinkSettings[rule.id] ? "pt-4" : "pt-6"} w-full flex flex-col gap-3 transition-all duration-300 relative z-10`, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] font-bold text-gray-600 mb-1 flex items-center", children: [
                                  "Keywords ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lowercase font-normal text-gray-400 ml-1 truncate", children: "(Type and press Enter or Comma)" })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  KeywordTokenInput,
                                  {
                                    value: rule.keywords,
                                    onChange: (val) => handleAutoLinkRuleChange(rule.id, "keywords", val),
                                    placeholder: "e.g. sony headphones, WH-1000XM5"
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 w-full", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-[3] min-w-[200px] w-full", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1.5", children: [
                                    "Target link / ASIN",
                                    rule.isBroken && !isInvalidFormat && !isShortlink && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-red-500 bg-red-50 px-1.5 rounded border border-red-100", title: "Broken link detected! The destination URL returned a 404 error.", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 10, strokeWidth: 3 }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold tracking-wide", children: "ASIN 404" })
                                    ] }),
                                    isShortlink && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 rounded border border-amber-200", title: "Amazon shorteners not supported.", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 10, strokeWidth: 3 }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold tracking-wide", children: "Shortlink" })
                                    ] }),
                                    isInvalidFormat && !isShortlink && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-orange-500 bg-orange-50 px-1.5 rounded border border-orange-100", title: "Does not look like a valid Amazon link or ASIN.", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 10, strokeWidth: 3 }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold tracking-wide", children: "Invalid Format" })
                                    ] })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    AutoResizeTextarea,
                                    {
                                      value: rule.link,
                                      onChange: (e) => handleAutoLinkRuleChange(rule.id, "link", e.target.value),
                                      placeholder: "https://... or ASIN",
                                      className: `w-full text-sm font-medium font-mono break-all rounded-lg focus:outline-none focus:ring-2 py-1.5 px-3 placeholder:text-gray-400 min-h-[34px] transition-colors shadow-sm leading-relaxed ${isShortlink ? "bg-amber-50/30 border border-amber-300 focus:ring-amber-500/20 focus:border-amber-500 text-amber-900" : isInvalidFormat ? "bg-orange-50/30 border border-orange-300 focus:ring-orange-500/20 focus:border-orange-500 text-orange-900" : rule.isBroken ? "bg-red-50/30 border border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-900" : "bg-white border border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-700"}`
                                    }
                                  )
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[100px] shrink-0 mt-[18px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  AutoLinkTagDropdown,
                                  {
                                    value: rule.tag,
                                    onChange: (newTagId) => handleAutoLinkRuleChange(rule.id, "tag", newTagId),
                                    allRules: globalAllRulesList
                                  }
                                ) })
                              ] })
                            ] })
                          ]
                        },
                        rule.id
                      );
                    }),
                    formData.autoLinkerRules.length === 0 && !autoLinkerSearchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-sm text-gray-500 bg-white rounded-lg border border-dashed border-gray-200", children: "No keyword rules yet. Click below to start auto-linking." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start mt-2 px-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleAddAutoLinkRule, className: "flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors focus:outline-none", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, strokeWidth: 2.5 }),
                      " Add Rule"
                    ] }) })
                  ] })
                ] }) }) })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "mt-8" : "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Link Radar", icon: Activity, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 pb-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800", children: "Link Scanner" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Status", hint: "Last scan result. Scan again after adding new Amazon links.", tooltip: "The scanner reads posts, pages and WooCommerce external products for Amazon links. A scan changes nothing, it only builds the list the monitor checks.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  scanState === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleScanSite, className: "flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-sm font-bold hover:bg-indigo-100 hover:border-indigo-200 transition-colors shadow-sm whitespace-nowrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16 }),
                    " Scan Site For Amazon Links"
                  ] }),
                  scanState === "scanning" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-indigo-700 font-bold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
                    " Scanning…"
                  ] }),
                  scanState === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center px-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-700", children: "Current State:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 font-bold text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "stroke-[3]" }),
                        " ",
                        amazonLinksFound,
                        " Links Around ",
                        scanPages,
                        " Pages"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-gray-500", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleScanSite, className: "text-indigo-600 hover:text-indigo-800 transition-colors font-bold cursor-pointer bg-transparent border-none p-0", children: "Scan Again" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { text: "Links are found automatically in the background. Use this manual rescan only if something breaks or you migrated content from another plugin.", alignment: "right" })
                    ] })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Auto Re-Scan", hint: "Keeps the link list current without manual scans.", tooltip: "How often the plugin automatically re-scans your content for Amazon links. Manual scans are always available above.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "scanAuto", checked: formData.scanAuto, onChange: handleCheckboxChange, label: "Automatically re-scan on a schedule" }) }),
                formData.scanAuto && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Scan every", hint: "7 days suits most sites.", tooltip: "Shorter intervals only help if you publish Amazon links daily. A re-scan reads your content on your own server and uses no link checks.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-1 duration-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      name: "scanFrequency",
                      value: formData.scanFrequency,
                      onChange: handleChange,
                      onBlur: (e) => {
                        const n2 = parseInt(e.target.value, 10);
                        setFormData((p2) => ({ ...p2, scanFrequency: String(n2 >= 1 ? Math.min(n2, 365) : 7) }));
                      },
                      min: "1",
                      max: "365",
                      className: "w-16 h-[34px] px-2 py-1.5 bg-white border border-gray-400 rounded-lg text-center text-[13px] font-semibold text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-28", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        name: "scanFrequencyUnit",
                        value: formData.scanFrequencyUnit,
                        onChange: handleChange,
                        className: "appearance-none w-full h-[34px] pl-3 pr-8 bg-white border border-gray-400 rounded-lg text-[13px] font-semibold text-gray-700 shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hours", children: "Hours" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "days", children: "Days" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: "text-gray-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-100 pb-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800", children: "Stock & 404 Monitor" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-6", children: [
                  [
                    { key: "ok", label: "Live", badge: "text-emerald-700 bg-emerald-50 border-emerald-200", iconColor: "text-emerald-600", hoverBtn: "text-emerald-600 hover:text-emerald-900", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16, className: "stroke-[3]" }) },
                    { key: "oos", label: "Out of Stock", badge: "text-amber-700 bg-amber-50 border-amber-200", iconColor: "text-amber-600", hoverBtn: "text-amber-600 hover:text-amber-900", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16 }), refreshable: true },
                    { key: "dead", label: "404", badge: "text-red-700 bg-red-50 border-red-200", iconColor: "text-red-600", hoverBtn: "text-red-600 hover:text-red-900", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, strokeWidth: 3 }), refreshable: true }
                  ].map((grp) => {
                    const isLive = grp.key === "ok";
                    const items = isLive ? liveState.items : monitorProblems.filter((p2) => p2.status === grp.key);
                    const count = isLive ? monitorSummary.ok : grp.key === "oos" ? monitorSummary.oos : monitorSummary.dead;
                    const open = listOpen[grp.key] === true;
                    const q2 = (monitorSearch[grp.key] || "").trim().toLowerCase();
                    const shown = q2 ? items.filter((p2) => (p2.asin || "").toLowerCase().includes(q2)) : items;
                    const mTotalPages = Math.max(1, Math.ceil(shown.length / monitorPerPage));
                    const mPage = Math.min(monitorPage[grp.key] || 1, mTotalPages);
                    const mStart = (mPage - 1) * monitorPerPage;
                    const mPaged = shown.slice(mStart, mStart + monitorPerPage);
                    const mShowingFrom = shown.length ? mStart + 1 : 0;
                    const mShowingTo = Math.min(mStart + monitorPerPage, shown.length);
                    const setMPage = (n2) => setMonitorPage((s) => ({ ...s, [grp.key]: n2 }));
                    const mPageItems = (() => {
                      const out = [];
                      const lo = Math.max(1, mPage - 1), hi2 = Math.min(mTotalPages, mPage + 1);
                      if (lo > 1) {
                        out.push(1);
                        if (lo > 2) out.push("…");
                      }
                      for (let i = lo; i <= hi2; i++) out.push(i);
                      if (hi2 < mTotalPages) {
                        if (hi2 < mTotalPages - 1) out.push("…");
                        out.push(mTotalPages);
                      }
                      return out;
                    })();
                    const toggle = () => {
                      const willOpen = !open;
                      setListOpen((s) => ({ ...s, [grp.key]: willOpen }));
                      if (willOpen && isLive && !liveState.loaded) loadLive(false);
                    };
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50/80", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: toggle, className: "flex items-center gap-3 min-w-0 text-left hover:opacity-90 transition-opacity", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center ${grp.iconColor}`, children: grp.icon }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-md border whitespace-nowrap ${grp.badge}`, children: [
                            count,
                            " ASIN's ",
                            grp.label
                          ] }),
                          grp.refreshable && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "button", tabIndex: 0, onClick: (e) => {
                            e.stopPropagation();
                            if (count) runMonitor(grp.key);
                          }, onKeyDown: (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              e.preventDefault();
                              if (count) runMonitor(grp.key);
                            }
                          }, title: `Re-check ${grp.label} links. Fixed ones return to Live`, className: `inline-flex items-center ${grp.hoverBtn} ${monitorRefresh === grp.key || !count || svcUsage && svcUsage.state === "connect" ? "opacity-40 pointer-events-none" : "cursor-pointer"}`, children: monitorRefresh === grp.key ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 14 }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                          open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  const t2 = shown.map((p2) => p2.asin).join("\n");
                                  if (t2 && navigator.clipboard) navigator.clipboard.writeText(t2);
                                },
                                className: "text-[11px] font-medium flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-100 px-2.5 py-1.5 rounded-md shadow-sm transition-colors",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 12 }),
                                  " Copy ASINs"
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "text",
                                placeholder: "Search ASIN...",
                                value: monitorSearch[grp.key] || "",
                                onClick: (e) => e.stopPropagation(),
                                onChange: (e) => {
                                  setMonitorSearch((s) => ({ ...s, [grp.key]: e.target.value }));
                                  setMPage(1);
                                },
                                className: "h-[30px] w-36 px-2.5 text-xs bg-white border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: toggle, className: "inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors", title: open ? "Collapse" : "Expand", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `shrink-0 transition-transform ${open ? "rotate-180" : ""}` }) })
                        ] })
                      ] }),
                      open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-100", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[460px] overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left whitespace-nowrap", children: "ASIN" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-left whitespace-nowrap", children: "Store" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-left whitespace-nowrap", children: "Pages" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left w-full", children: "Product" })
                          ] }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 bg-white", children: [
                            isLive && liveState.loading && shown.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "4", className: "px-4 py-4 text-sm text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                              " Loading…"
                            ] }) }) }),
                            shown.length === 0 && !(isLive && liveState.loading) && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "4", className: "px-4 py-6 text-center text-slate-400 italic", children: q2 ? "No matching ASINs." : "ASIN List Empty" }) }),
                            mPaged.map((p2) => {
                              const ex = !!expandedProblems[p2.asin];
                              const store = p2.domain ? p2.domain.replace(/^amazon/i, "Amazon") : "Amazon.com";
                              const pages = p2.pages || [];
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 transition-colors cursor-pointer", onClick: () => setExpandedProblems((s) => ({ ...s, [p2.asin]: !s[p2.asin] })), children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[13px] font-bold text-gray-900 select-all cursor-text", onClick: (e) => e.stopPropagation(), children: p2.asin }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: (e) => {
                                      e.stopPropagation();
                                      if (navigator.clipboard) navigator.clipboard.writeText(p2.asin);
                                    }, title: "Copy ASIN", className: "text-gray-400 hover:text-indigo-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }) }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: p2.amazon_url, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), title: "Open on Amazon", className: "text-gray-400 hover:text-indigo-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 }) })
                                  ] }) }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-[13px] font-semibold text-gray-800 whitespace-nowrap", children: store }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-[13px] font-semibold text-gray-800 whitespace-nowrap tabular-nums", children: pages.length }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[13px] truncate ${p2.title ? "text-gray-700" : "text-gray-400 italic"}`, title: p2.title || "", children: p2.title || "title not available" }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: `shrink-0 text-gray-400 transition-transform ${ex ? "rotate-180" : ""}` })
                                  ] }) })
                                ] }),
                                ex && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-gray-50/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "4", className: "px-4 py-3 border-t border-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] space-y-3 animate-in fade-in duration-150", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-gray-500 mb-1.5", children: [
                                      "Replace this ASIN everywhere (",
                                      pages.length,
                                      " page",
                                      pages.length === 1 ? "" : "s",
                                      "):"
                                    ] }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "input",
                                        {
                                          type: "text",
                                          maxLength: 10,
                                          placeholder: "New ASIN",
                                          value: replaceVal[p2.asin] || "",
                                          onChange: (e) => {
                                            const v2 = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                                            setReplaceVal((s) => ({ ...s, [p2.asin]: v2 }));
                                          },
                                          className: "w-40 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg font-mono text-[12px] text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        }
                                      ),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: () => handleReplace(p2.asin),
                                          disabled: replaceBusy === p2.asin || (replaceVal[p2.asin] || "").length !== 10 || (replaceVal[p2.asin] || "") === p2.asin || svcUsage && svcUsage.state === "connect",
                                          className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed",
                                          children: replaceBusy === p2.asin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 13, className: "animate-spin" }),
                                            " Replacing…"
                                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 13 }),
                                            " Replace on ",
                                            pages.length,
                                            " page",
                                            pages.length === 1 ? "" : "s"
                                          ] })
                                        }
                                      )
                                    ] })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: (() => {
                                    const pp = monitorPerPage;
                                    const tp = Math.max(1, Math.ceil(pages.length / pp));
                                    const cp = Math.min(pagesPage[p2.asin] || 1, tp);
                                    const st = (cp - 1) * pp;
                                    const pagedPages = pages.slice(st, st + pp);
                                    const setPP = (n2) => setPagesPage((s) => ({ ...s, [p2.asin]: n2 }));
                                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-gray-500 mb-1", children: [
                                        "Used on ",
                                        pages.length,
                                        " page",
                                        pages.length === 1 ? "" : "s",
                                        tp > 1 ? ` (showing ${st + 1}-${Math.min(st + pp, pages.length)})` : "",
                                        ":"
                                      ] }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 pr-1", children: pagedPages.map((pg2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-md px-2.5 py-1.5", children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: pg2.permalink, target: "_blank", rel: "noopener noreferrer", className: "text-gray-700 hover:text-indigo-700 truncate", children: pg2.title || "(untitled)" }),
                                        pg2.edit_link && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: pg2.edit_link, target: "_blank", rel: "noopener noreferrer", className: "shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800", children: [
                                          "Edit ",
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 })
                                        ] })
                                      ] }, pg2.post_id)) }),
                                      tp > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 mt-2", children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPP(Math.max(1, cp - 1)), disabled: cp <= 1, className: "px-2 py-0.5 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed", children: "Prev" }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-500 px-1", children: [
                                          "Page ",
                                          cp,
                                          " / ",
                                          tp
                                        ] }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPP(Math.min(tp, cp + 1)), disabled: cp >= tp, className: "px-2 py-0.5 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed", children: "Next" })
                                      ] })
                                    ] });
                                  })() })
                                ] }) }) })
                              ] }, p2.asin);
                            })
                          ] })
                        ] }) }),
                        shown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 border-t border-slate-200 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2 text-xs text-gray-500", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "Showing ",
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-gray-700", children: [
                              mShowingFrom,
                              mShowingTo > mShowingFrom ? "-" + mShowingTo : ""
                            ] }),
                            " of ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-700", children: shown.length }),
                            isLive && liveState.hasMore ? "+" : ""
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                            isLive && liveState.hasMore && mPage >= mTotalPages && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => loadLive(true), disabled: liveState.loading, className: "inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50", children: [
                              liveState.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12 }),
                              " Load more"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 items-center", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMPage(Math.max(1, mPage - 1)), disabled: mPage <= 1, className: "px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed", children: "Prev" }),
                              mPageItems.map((it, idx) => it === "…" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 text-slate-400", children: "…" }, "e" + idx) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMPage(it), className: `px-2 py-1 rounded border font-medium ${it === mPage ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-300 bg-white hover:bg-slate-100"}`, children: it }, it)),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMPage(Math.min(mTotalPages, mPage + 1)), disabled: mPage >= mTotalPages, className: "px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed", children: "Next" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 border-l border-slate-300 pl-3", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Show" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: monitorPerPage, onChange: (e) => {
                                setMonitorPerPage(Number(e.target.value));
                                setMonitorPage({});
                              }, className: "p-1 border border-slate-300 rounded bg-white outline-none focus:border-indigo-500 cursor-pointer", children: MON_PER_PAGE_OPTIONS.map((n2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n2, children: n2 }, n2)) })
                            ] })
                          ] })
                        ] })
                      ] })
                    ] }, grp.key);
                  }),
                  monitorSummary.checked === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Hint, { text: "No links checked yet. The scheduled scan verifies links in the background; counts will appear above once checks run." })
                ] }),
                svcUsage && !svcUsage.usage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: svcUsage.connect_url, target: "_top", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "14px", fontWeight: 600, borderRadius: "8px", padding: "10px 20px", textDecoration: "none", cursor: "pointer", lineHeight: 1, whiteSpace: "nowrap", transition: ".12s", color: "#fff", background: "#2563eb", border: "1px solid #2563eb", boxShadow: "0 4px 10px -3px rgba(37,99,235,.5)" }, onMouseEnter: (e) => {
                    e.currentTarget.style.background = "#1d4ed8";
                    e.currentTarget.style.borderColor = "#1d4ed8";
                  }, onMouseLeave: (e) => {
                    e.currentTarget.style.background = "#2563eb";
                    e.currentTarget.style.borderColor = "#2563eb";
                  }, children: "Connect your DevDome account" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-500", children: "Live checks run on DevDome servers. Requires a DevDome account." })
                ] }),
                svcUsage && svcUsage.usage && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: `${svcUsage.usage.plan.charAt(0).toUpperCase() + svcUsage.usage.plan.slice(1)} Plan`, hint: "Link checks used this month on your DevDome account.", tooltip: "The free plan includes 500 checks and searches per month, paid plans raise the limit. When the limit is reached, link statuses stay unchanged until next month, nothing on your site breaks.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-gray-900", children: [
                    svcUsage.usage.used.toLocaleString(),
                    " / ",
                    svcUsage.usage.limit.toLocaleString()
                  ] }),
                  svcUsage.state === "quota" || svcUsage.usage.remaining === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://devdome.com/pricing", target: "_blank", rel: "noopener noreferrer", className: "text-sm font-bold text-red-600 hover:text-red-800", children: "Limit reached. Upgrade for more" }) : svcUsage.usage.plan === "free" && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://devdome.com/pricing", target: "_blank", rel: "noopener noreferrer", className: "text-xs font-bold text-indigo-600 hover:text-indigo-800", children: "Need more? See plans" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: svcUsage && !svcUsage.usage ? "opacity-50 pointer-events-none" : "", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Out of Stock Redirect", hint: "Send clicks on out of stock products somewhere useful.", tooltip: "When a product is out of stock, send the click to a fallback so the visit still has a chance to convert.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "monitorOosToSearch", checked: formData.monitorOosToSearch, onChange: handleCheckboxChange, label: "Enable" }),
                    formData.monitorOosToSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { name: "monitorOosMode", value: formData.monitorOosMode, onChange: handleRadioChange, options: [
                      { label: "Best replacement product", value: "replacement", hint: "Send the click to the closest live product (falls back to the search page if none found)." },
                      { label: "Search page", value: "search", hint: "Send the click to Amazon search results for the product." }
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "404 ASIN Redirect", hint: "Send clicks on removed products somewhere useful.", tooltip: "When a product page is gone (404), send the click to a fallback so the visit still has a chance to convert.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "monitorDeadToSearch", checked: formData.monitorDeadToSearch, onChange: handleCheckboxChange, label: "Enable" }),
                    formData.monitorDeadToSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { name: "monitorDeadMode", value: formData.monitorDeadMode, onChange: handleRadioChange, options: [
                      { label: "Best replacement product", value: "replacement", hint: "Send the click to the closest live product (falls back to the search page if none found)." },
                      { label: "Search page", value: "search", hint: "Send the click to Amazon search results for the product." }
                    ] })
                  ] }) })
                ] })
              ] })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "mt-8" : "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Section,
              {
                title: "Click Protection",
                icon: Shield,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Bot Protection", hint: "Keeps bot clicks out of your affiliate links and stats.", tooltip: "Basic protection: blocks known bots (Cloudflare verified-bot list) from triggering your affiliate links and inflating your click stats. For advanced, site-wide protection (datacenter & flagged-IP traffic, scanners and fake visits) install the DevDome Bot Protection plugin.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "blockBots", checked: formData.blockBots, onChange: handleCheckboxChange, label: "Block Bot Clicks" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Bots Blocked", hint: "Bot clicks stopped so far.", tooltip: "Total bot clicks stopped before they reached your affiliate links. Resets only when you clear it.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 font-bold text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15, className: "stroke-[2.5]" }),
                      " ",
                      botsBlocked.toLocaleString(),
                      " blocked"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleResetBots, disabled: !botsBlocked, className: "flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 13 }),
                      " Reset Count"
                    ] })
                  ] }) }),
                  formData.blockBots && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Redirect Method", hint: "How protected clicks reach Amazon.", tooltip: "JavaScript 302 keeps the referrer and works with caching plugins. Server side redirects are faster but some caches store them. Change it only if clicks are not being tracked.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroup,
                    {
                      name: "redirectMethod",
                      value: formData.redirectMethod,
                      onChange: handleRadioChange,
                      options: [
                        { label: "JavaScript + 302 (Recommended)", value: "js_302", hint: "Fast for visitors. Acts as a second line of defense to catch unknown bots that slip past the main blocklist." },
                        { label: "JavaScript Only", value: "js", hint: "Aggressively filters out stealthy and unknown bots, but results in a slightly slower redirect for visitors." },
                        { label: "302 Redirect Only", value: "302", hint: "Fastest redirect. Relies solely on your main bot blocklist and skips the extra JavaScript filter." }
                      ]
                    }
                  ) })
                ] })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: suiteMode ? "mt-8" : "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Mobile App", icon: Smartphone, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Enable Opener", hint: "Opens the Amazon app on phones when possible.", tooltip: "Automatically launches the Amazon app on mobile devices when possible to bypass browser login walls and increase sales", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "enabled", checked: formData.enabled, onChange: handleCheckboxChange, label: "Open Amazon links in the Amazon app (mobile)" }) }) }),
              formData.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "iOS (iPhone/iPad)", hint: "Shows an Open in Safari button inside in-app browsers.", tooltip: "If someone opens your site inside an in-app browser on iPhone (Reddit/Instagram/TikTok and similar), those browsers can block Amazon links. Turn this on to show a big Open in Safari button only in that situation. In normal Safari, links open normally with no extra step.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimpleCheckbox, { name: "iosOpenInSafari", checked: formData.iosOpenInSafari, onChange: handleCheckboxChange, label: "On iPhone/iPad: show an “Open in Safari” button inside in-app browsers" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { label: "Android", hint: "How Android visitors reach Amazon.", tooltip: "Browser keeps the click in the visitor's browser. App tries the Amazon app first and falls back to the browser.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RadioGroup,
                  {
                    name: "androidMode",
                    value: formData.androidMode,
                    onChange: handleRadioChange,
                    options: [
                      { label: "Web Only (Recommended)", value: "browser", hint: "Open the Amazon link normally (no forced app-open). If the Amazon app opens by itself on the user’s device, that’s fine. This is the smoothest and most reliable option." },
                      { label: "Force Amazon App (Intent)", value: "intent", hint: "Try to open the Amazon app first (if it’s installed). If the app doesn’t open, it automatically falls back to the Amazon page in the browser." }
                    ]
                  }
                ) })
              ] })
            ] }) }) })
          ] });
          return suiteMode && bottomTarget ? reactDomExports.createPortal(bottomSections, bottomTarget) : bottomSections;
        })(),
        !suiteMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky bottom-0 z-[150] bg-white/95 backdrop-blur-md px-8 py-2 flex flex-col sm:flex-row justify-start items-center border-t border-gray-200 gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-b-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleSave, disabled: saveState === "saving" || !loaded, className: "flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 active:translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
          " ",
          saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved ✓" : saveState === "error" ? "Save failed. Retry" : !loaded ? "Loading…" : "Save Settings"
        ] }) })
      ] }) })
    ] }) }),
    exclusionModalType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm", onClick: handleCloseModal }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-[95%] max-w-5xl flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 h-[85vh] min-h-[600px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white relative z-40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-indigo-50 p-2 rounded-lg text-indigo-600 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 18, strokeWidth: 2.5 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-gray-900 leading-tight", children: exclusionModalType === "tags" ? "Affiliate Tag Excluded URLs" : "Auto-Linker Excluded URLs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoTooltip, { alignment: "left", direction: "bottom", text: "URLs excluded here are strictly exact-match blocks. Select any specific URL or category page to block it universally." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setFormData((prev) => ({ ...prev, globalExclusions: [], globalExcludedTrees: [], globalExceptions: [] }));
            setExclusionSelectedItems([]);
          }, className: "flex items-center gap-1.5 text-[13px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors focus:outline-none hidden sm:flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { size: 16, strokeWidth: 2.5 }),
            " Clear All Exclusions"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/80 gap-4 relative z-30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4 w-full sm:w-auto flex-wrap pb-1 sm:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-gray-200/60 p-1 rounded-lg shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setExclusionTab("all");
                setExclusionCurrentPage(1);
                setExclusionTypeFilter("All");
                setExclusionSelectedItems([]);
                setExclusionLastSelected(null);
              }, className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${exclusionTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`, children: [
                "All URLs ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${exclusionTab === "all" ? "bg-indigo-100 text-indigo-700" : "bg-indigo-50 text-indigo-500"}`, children: targetOptions.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setExclusionTab("excluded");
                setExclusionCurrentPage(1);
                setExclusionTypeFilter("All");
                setExclusionSelectedItems([]);
                setExclusionLastSelected(null);
              }, className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${exclusionTab === "excluded" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`, children: [
                "Excluded URLs ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${exclusionTab === "excluded" ? "bg-red-100 text-red-700" : "bg-red-50 text-red-500"}`, children: targetOptions.filter((opt) => (formData.globalExclusions || []).includes(opt.value) || (formData.globalExcludedTrees || []).includes(opt.value) || opt.parentCategory && (formData.globalExcludedTrees || []).includes(opt.parentCategory) && !(formData.globalExceptions || []).includes(opt.value)).length })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-6 bg-gray-300 hidden sm:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider", children: "Filter:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(StyledSelect, { name: "exclusionTypeFilter", value: exclusionTypeFilter, onChange: (e) => {
                setExclusionTypeFilter(e.target.value);
                setExclusionCurrentPage(1);
                setExclusionSelectedItems([]);
                setExclusionLastSelected(null);
              }, wrapperClassName: "min-w-max shrink-0", className: "!py-1.5 !px-2.5 text-xs font-bold h-8 bg-white border border-gray-300 shadow-sm hover:border-indigo-400", truncate: false, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "All", children: [
                  "All (",
                  ((_a = modalData == null ? void 0 : modalData.tabCounts) == null ? void 0 : _a["All"]) || 0,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "Page", children: [
                  "Pages (",
                  ((_b = modalData == null ? void 0 : modalData.tabCounts) == null ? void 0 : _b["Page"]) || 0,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "Post Category", children: [
                  "Post Categories (",
                  ((_c = modalData == null ? void 0 : modalData.tabCounts) == null ? void 0 : _c["Post Category"]) || 0,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "Post", children: [
                  "Posts (",
                  ((_d = modalData == null ? void 0 : modalData.tabCounts) == null ? void 0 : _d["Post"]) || 0,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "Product Category", children: [
                  "Product Categories (",
                  ((_e = modalData == null ? void 0 : modalData.tabCounts) == null ? void 0 : _e["Product Category"]) || 0,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "Product", children: [
                  "Products (",
                  ((_f = modalData == null ? void 0 : modalData.tabCounts) == null ? void 0 : _f["Product"]) || 0,
                  ")"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end w-full sm:w-auto flex-1 shrink-0 ml-auto", children: showExclusionSearch ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative animate-in fade-in zoom-in-95 duration-200 flex items-center w-full sm:max-w-[320px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: exclusionSearchRef,
                type: "text",
                value: exclusionSearch,
                onChange: (e) => {
                  setExclusionSearch(e.target.value);
                  setExclusionCurrentPage(1);
                  setExclusionSelectedItems([]);
                  setExclusionLastSelected(null);
                },
                placeholder: "Search pages, posts, products...",
                className: "w-full pl-8 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-gray-700 outline-none h-8"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 text-gray-400 pointer-events-none", size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              setShowExclusionSearch(false);
              setExclusionSearch("");
              setExclusionCurrentPage(1);
              setExclusionSelectedItems([]);
              setExclusionLastSelected(null);
            }, className: "absolute right-2 top-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowExclusionSearch(true),
              className: "flex items-center justify-center p-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm shrink-0 h-8 w-8",
              title: "Search exclusions",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "text-indigo-500" })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar p-0 relative", ref: modalScrollRef, children: (() => {
          if (!modalData.hasMatches || modalData.totalItems === 0) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 px-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 36, className: "text-gray-300 mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-700", children: exclusionTab === "excluded" && exclusionSearch === "" && exclusionTypeFilter === "All" ? "No exclusions yet." : "No items found." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1.5 max-w-xs mb-6 leading-relaxed", children: exclusionTab === "excluded" && exclusionSearch === "" && exclusionTypeFilter === "All" ? "Search and exclude URLs in the 'All URLs' tab." : "Try adjusting your search terms or filters." }),
            (exclusionSearch || exclusionTypeFilter !== "All") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setExclusionSearch("");
              setExclusionTypeFilter("All");
              setExclusionCurrentPage(1);
              setExclusionSelectedItems([]);
              setExclusionLastSelected(null);
            }, className: "px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 text-xs font-bold rounded-lg transition-colors border border-indigo-200 shadow-sm", children: "Clear Search & Filters" })
          ] });
          const renderModalItem = (item) => {
            var _a2;
            const isExplicitlyExcluded = (formData.globalExclusions || []).includes(item.value);
            const isTreeExcluded = (formData.globalExcludedTrees || []).includes(item.value);
            const isParentTreeExcluded = item.parentCategory && (formData.globalExcludedTrees || []).includes(item.parentCategory);
            const isException = (formData.globalExceptions || []).includes(item.value);
            const isEffectivelyExcluded = isExplicitlyExcluded || (isTreeExcluded || isParentTreeExcluded) && !isException;
            const isSelected = exclusionSelectedItems.includes(item.value);
            const assignedRuleIndex = formData.btn1AffiliateRules.findIndex((r2) => r2.ruleValues && r2.ruleValues.includes(item.value));
            const rowBg = isSelected ? "bg-indigo-50/60" : isException ? "bg-emerald-50/20 hover:bg-emerald-50/40" : isParentTreeExcluded || isTreeExcluded ? "bg-amber-50/20" : isExplicitlyExcluded ? "bg-red-50/30" : "bg-white hover:bg-gray-50";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative px-4 py-2.5 transition-colors border-b border-gray-100/70 last:border-0 flex flex-col sm:flex-row items-start justify-between group gap-3 sm:gap-4 ${rowBg}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0 pr-4 relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-[5px] shrink-0", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: (e) => {
                  if (e.nativeEvent.shiftKey && exclusionLastSelected) {
                    const currentIndex = modalData.currentItems.findIndex((i) => i.value === item.value);
                    const lastIndex = modalData.currentItems.findIndex((i) => i.value === exclusionLastSelected);
                    if (currentIndex !== -1 && lastIndex !== -1) {
                      const itemsInRange = modalData.currentItems.slice(Math.min(currentIndex, lastIndex), Math.max(currentIndex, lastIndex) + 1).map((i) => i.value);
                      setExclusionSelectedItems((prev) => {
                        const newSet2 = new Set(prev);
                        isSelected ? itemsInRange.forEach((val) => newSet2.delete(val)) : itemsInRange.forEach((val) => newSet2.add(val));
                        return Array.from(newSet2);
                      });
                      setExclusionLastSelected(item.value);
                      return;
                    }
                  }
                  let newSet = new Set(exclusionSelectedItems);
                  if (isSelected) {
                    newSet.delete(item.value);
                  } else {
                    newSet.add(item.value);
                  }
                  setExclusionSelectedItems(Array.from(newSet));
                  setExclusionLastSelected(item.value);
                }, className: "w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 cursor-pointer shadow-sm" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pt-[2px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-semibold truncate transition-all ${isEffectivelyExcluded ? "text-gray-500/80" : "text-gray-900"}`, children: item.label }),
                    isTreeExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700", title: "This entire category is globally excluded.", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { size: 10, strokeWidth: 3 }),
                      " Category Excluded"
                    ] }),
                    isExplicitlyExcluded && !isTreeExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-red-100 text-red-700", title: "This specific URL is globally excluded.", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 10, strokeWidth: 3 }),
                      " URL Excluded"
                    ] }),
                    isParentTreeExcluded && !isException && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide bg-amber-100 text-amber-700", title: "Excluded because its parent category is excluded.", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 10, strokeWidth: 3 }),
                      " Excluded (Via ",
                      ((_a2 = targetOptions.find((t2) => t2.value === item.parentCategory)) == null ? void 0 : _a2.label) || "Category",
                      ")"
                    ] }),
                    item.childCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border ${isEffectivelyExcluded ? "text-gray-400 bg-gray-50 border-gray-200" : "text-sky-600 bg-sky-50 border-sky-100"}`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 10 }),
                      " ",
                      item.childCount,
                      " ",
                      item.childLabel
                    ] }),
                    item.linkCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shadow-sm border border-indigo-100", title: `${item.linkCount} Amazon links found in this`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { size: 10 }),
                      " ",
                      item.linkCount,
                      " Amazon Links"
                    ] }),
                    isException && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200/50 shrink-0 shadow-sm", children: "Exception" }),
                    assignedRuleIndex !== -1 && !isEffectivelyExcluded && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200/50 shrink-0 shadow-sm flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 9 }),
                      " Assigned to Tag #",
                      assignedRuleIndex + 1
                    ] })
                  ] }),
                  item.link && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[12px] font-medium font-mono truncate transition-all ${isEffectivelyExcluded ? "text-gray-400/70" : "text-gray-500"}`, children: item.link }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: `hover:text-blue-600 transition-colors shrink-0 ${isEffectivelyExcluded ? "text-gray-300" : "text-gray-400"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 }) })
                  ] })
                ] })
              ] }),
              exclusionSelectedItems.length === 0 && (item.type.includes("Category") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0 relative z-10 ml-[28px] sm:ml-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      toggleExclusion(item, isParentTreeExcluded && !isException && !isExplicitlyExcluded ? "exception" : "url");
                    },
                    className: `px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors border shadow-sm ${isExplicitlyExcluded || isParentTreeExcluded && !isException ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" : "bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200"}`,
                    children: isExplicitlyExcluded || isParentTreeExcluded && !isException ? "Restore Category URL" : "Exclude Category URL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      toggleExclusion(item, isParentTreeExcluded && !isTreeExcluded ? "exception_tree" : "tree");
                    },
                    className: `px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors border shadow-sm ${isTreeExcluded || isParentTreeExcluded && !isException ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" : "bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200"}`,
                    children: isTreeExcluded || isParentTreeExcluded && !isException ? "Restore Entire Category" : "Exclude Entire Category"
                  }
                )
              ] }) : isParentTreeExcluded ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                e.stopPropagation();
                toggleExclusion(item, "exception");
              }, className: `shrink-0 mt-1 sm:mt-0 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors border shadow-sm relative z-10 ml-[28px] sm:ml-0 ${isException ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" : "bg-white border-gray-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"}`, children: isException ? "Remove Exception" : "Add Exception" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                e.stopPropagation();
                toggleExclusion(item, "url");
              }, className: `shrink-0 mt-1 sm:mt-0 px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors border shadow-sm relative z-10 ml-[28px] sm:ml-0 ${isExplicitlyExcluded ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" : "bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700"}`, children: isExplicitlyExcluded ? "Restore URL" : "Exclude URL" }))
            ] }, item.value);
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: exclusionSelectedItems.length > 0 ? "pb-24" : "", children: sortedTypes.map((type) => {
            const groupItems = grouped[type];
            const selectableGroupValues = groupItems.map((i) => i.value);
            const isAllSelected = selectableGroupValues.length > 0 && selectableGroupValues.every((v2) => exclusionSelectedItems.includes(v2));
            const isSomeSelected = selectableGroupValues.some((v2) => exclusionSelectedItems.includes(v2)) && !isAllSelected;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-1.5 bg-gray-100/95 backdrop-blur-sm text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 border-t first:border-t-0 sticky top-0 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isAllSelected, ref: (el2) => {
                  if (el2) el2.indeterminate = isSomeSelected;
                }, onChange: () => {
                  if (isAllSelected) setExclusionSelectedItems((prev) => prev.filter((v2) => !selectableGroupValues.includes(v2)));
                  else setExclusionSelectedItems((prev) => [.../* @__PURE__ */ new Set([...prev, ...selectableGroupValues])]);
                }, className: "w-3.5 h-3.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-50 cursor-pointer shadow-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getTypeLabel(type) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col bg-white", children: groupItems.map(renderModalItem) })
            ] }, type);
          }) });
        })() }),
        exclusionSelectedItems.length > 0 && (() => {
          const canExcludeUrlsBtn = exclusionSelectedItems.some((val) => !formData.globalExclusions.includes(val));
          const canRestoreUrlsBtn = exclusionSelectedItems.some((val) => formData.globalExclusions.includes(val));
          const selectedCategories = exclusionSelectedItems.filter((val) => {
            var _a2;
            return (_a2 = getOptionData(val)) == null ? void 0 : _a2.type.includes("Category");
          });
          const canExcludeCategoriesBtn = selectedCategories.some((val) => !formData.globalExcludedTrees.includes(val));
          const canRestoreCategoriesBtn = selectedCategories.some((val) => formData.globalExcludedTrees.includes(val));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-[80px] right-6 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-wrap items-center gap-3 sm:gap-4 z-[120] animate-in slide-in-from-bottom-6 duration-300 border border-gray-700/50 w-[90%] sm:w-auto sm:max-w-2xl justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center justify-center bg-indigo-500 text-white w-5 h-5 rounded-full text-[10px] font-bold", children: exclusionSelectedItems.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-200 whitespace-nowrap hidden sm:block", children: "Selected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-center", children: [
              canExcludeUrlsBtn && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setFormData((prev) => {
                  const exclusions = new Set(prev.globalExclusions || []);
                  const exceptions = new Set(prev.globalExceptions || []);
                  let rules = [...prev.btn1AffiliateRules];
                  exclusionSelectedItems.forEach((val) => {
                    exclusions.add(val);
                    exceptions.delete(val);
                    rules = rules.map((r2) => ({ ...r2, ruleValues: (r2.ruleValues || []).filter((v2) => v2 !== val) }));
                  });
                  return { ...prev, globalExclusions: [...exclusions], globalExceptions: [...exceptions], btn1AffiliateRules: rules };
                });
                setExclusionSelectedItems([]);
              }, className: "text-[11px] sm:text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 14 }),
                " Exclude URLs"
              ] }),
              canExcludeCategoriesBtn && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setFormData((prev) => {
                  const excludedTrees = new Set(prev.globalExcludedTrees || []);
                  const exclusions = new Set(prev.globalExclusions || []);
                  let exceptions = [...prev.globalExceptions || []];
                  let rules = [...prev.btn1AffiliateRules];
                  exclusionSelectedItems.forEach((val) => {
                    var _a2;
                    if ((_a2 = getOptionData(val)) == null ? void 0 : _a2.type.includes("Category")) {
                      excludedTrees.add(val);
                      exclusions.delete(val);
                      const children = targetOptions.filter((t2) => t2.parentCategory === val).map((t2) => t2.value);
                      exceptions = exceptions.filter((v2) => !children.includes(v2));
                      rules = rules.map((r2) => ({ ...r2, ruleValues: (r2.ruleValues || []).filter((v2) => v2 !== val && !children.includes(v2)) }));
                    }
                  });
                  return { ...prev, globalExcludedTrees: [...excludedTrees], globalExclusions: [...exclusions], globalExceptions: exceptions, btn1AffiliateRules: rules };
                });
                setExclusionSelectedItems([]);
              }, className: "text-[11px] sm:text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors whitespace-nowrap flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { size: 14 }),
                " Exclude Categories"
              ] }),
              canRestoreUrlsBtn && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setFormData((prev) => {
                  const exclusions = new Set(prev.globalExclusions || []);
                  const excludedTrees = new Set(prev.globalExcludedTrees || []);
                  const exceptions = new Set(prev.globalExceptions || []);
                  exclusionSelectedItems.forEach((val) => {
                    var _a2;
                    exclusions.delete(val);
                    if (excludedTrees.has(val) || ((_a2 = targetOptions.find((t2) => t2.value === val)) == null ? void 0 : _a2.parentCategory) && excludedTrees.has(targetOptions.find((t2) => t2.value === val).parentCategory)) {
                      exceptions.add(val);
                    }
                  });
                  return { ...prev, globalExclusions: [...exclusions], globalExceptions: [...exceptions] };
                });
                setExclusionSelectedItems([]);
              }, className: "text-[11px] sm:text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 14 }),
                " Restore URLs"
              ] }),
              canRestoreCategoriesBtn && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                setFormData((prev) => {
                  const excludedTrees = new Set(prev.globalExcludedTrees || []);
                  const exclusions = new Set(prev.globalExclusions || []);
                  const exceptions = new Set(prev.globalExceptions || []);
                  exclusionSelectedItems.forEach((val) => {
                    var _a2;
                    if ((_a2 = getOptionData(val)) == null ? void 0 : _a2.type.includes("Category")) {
                      excludedTrees.delete(val);
                      exclusions.delete(val);
                      exceptions.delete(val);
                      const children = targetOptions.filter((t2) => t2.parentCategory === val).map((t2) => t2.value);
                      children.forEach((child) => exceptions.delete(child));
                    }
                  });
                  return { ...prev, globalExcludedTrees: [...excludedTrees], globalExclusions: [...exclusions], globalExceptions: [...exceptions] };
                });
                setExclusionSelectedItems([]);
              }, className: "text-[11px] sm:text-[12px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 14 }),
                " Restore Categories"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExclusionSelectedItems([]), className: "text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white px-5 py-4 border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full gap-4 flex-wrap sm:flex-nowrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[13px] text-gray-600 whitespace-nowrap", children: [
              "Showing ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900", children: modalData.totalItems > 0 ? `${modalData.startIndex + 1}-${modalData.endIndex}` : "0" }),
              " of ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900", children: modalData.totalItems }),
              " items"
            ] }),
            modalData.totalItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-gray-200 hidden sm:block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  setExclusionCurrentPage((p2) => Math.max(1, p2 - 1));
                  setExclusionLastSelected(null);
                }, disabled: modalData.safePage === 1, className: "px-3 py-1 text-[13px] rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Prev" }),
                (() => {
                  const pages = [];
                  let startPage = Math.max(1, modalData.safePage - 2), endPage = Math.min(modalData.totalPages, startPage + 4);
                  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
                  for (let i = startPage; i <= endPage; i++) pages.push(i);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    startPage > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-400 px-1 hidden sm:inline", children: "..." }),
                    pages.map((pageNum) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                      setExclusionCurrentPage(pageNum);
                      setExclusionLastSelected(null);
                    }, className: `px-3 py-1 text-[13px] rounded-md border font-medium transition-colors ${pageNum === modalData.safePage ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 hover:bg-gray-50 text-gray-700"}`, children: pageNum }, pageNum)),
                    endPage < modalData.totalPages && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-400 px-1 hidden sm:inline", children: "..." })
                  ] });
                })(),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                  setExclusionCurrentPage((p2) => Math.min(modalData.totalPages, p2 + 1));
                  setExclusionLastSelected(null);
                }, disabled: modalData.safePage === modalData.totalPages, className: "px-3 py-1 text-[13px] rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Next" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "items-center gap-2 border-l border-gray-200 pl-4 hidden sm:flex", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-600", children: "Show" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: exclusionItemsPerPage, onChange: (e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    setExclusionItemsPerPage(val);
                    setExclusionCurrentPage(1);
                    setExclusionLastSelected(null);
                  } else if (e.target.value === "") setExclusionItemsPerPage("");
                }, onBlur: (e) => {
                  if (e.target.value === "" || parseInt(e.target.value, 10) < 1) {
                    setExclusionItemsPerPage(50);
                    setExclusionCurrentPage(1);
                    setExclusionLastSelected(null);
                  }
                }, className: "w-12 py-1 px-1.5 border border-gray-300 rounded-md text-[13px] focus:border-indigo-500 outline-none text-center", min: "1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-gray-600", children: "per page" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-400", children: "Changes saved automatically" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCloseModal, className: "px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm", children: "Close" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
const mount = (el2, suiteMode = false) => {
  createRoot(el2).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, { suiteMode }) })
  );
};
const findAmCssLink = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  for (const l2 of links) {
    if (l2.href && /\/devdome-affiliate-manager\/assets\/admin\/index\.css/.test(l2.href)) {
      return l2.href;
    }
  }
  return null;
};
const standalone = document.getElementById("devdaffi-root");
if (standalone) {
  mount(standalone, false);
} else if (typeof window !== "undefined" && window.PI_CONFIG && window.PI_CONFIG.affiliateManagerActive) {
  const trySuiteSlot = () => {
    const slot = document.getElementById("am-link-control-host-top");
    if (!slot || slot.dataset.amMounted) {
      return;
    }
    slot.dataset.amMounted = "1";
    let host = slot;
    let reactRoot;
    try {
      const shadow = slot.attachShadow({ mode: "open" });
      const cssHref = findAmCssLink();
      if (cssHref) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssHref;
        shadow.appendChild(link);
      }
      reactRoot = document.createElement("div");
      reactRoot.style.minHeight = "100px";
      shadow.appendChild(reactRoot);
    } catch (e) {
      reactRoot = host;
    }
    mount(reactRoot, true);
  };
  trySuiteSlot();
  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      trySuiteSlot();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
