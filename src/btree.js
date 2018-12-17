"use strict";
exports.__esModule = true;
var maybe_1 = require("./maybe");
var newNode = function (key, value, left, right) {
    return {
        key: key,
        value: value,
        left: left,
        right: right
    };
};
exports.empty = function () { return maybe_1.None(); };
exports.singleton = function (key) { return function (value) { return maybe_1.Some(newNode(key, value, maybe_1.None(), maybe_1.None())); }; };
exports.insert = function (k) { return function (v) { return function (t) {
    if (maybe_1.isNone(t)) {
        return maybe_1.Some(newNode(k, v, maybe_1.None(), maybe_1.None()));
    }
    var node = maybe_1.unwrap(t);
    if (k < node.key) {
        return maybe_1.Some(newNode(node.key, node.value, exports.insert(k)(v)(node.left), node.right));
    }
    if (k > node.key) {
        return maybe_1.Some(newNode(node.key, node.value, node.left, exports.insert(k)(v)(node.left)));
    }
    return t;
}; }; };
exports.get = function (k) { return maybe_1.andThen(_get(k)); };
var _get = function (k) { return function (n) {
    if (k < n.key) {
        return exports.get(k)(n.left);
    }
    if (k > n.key) {
        return exports.get(k)(n.right);
    }
    return maybe_1.Some(n.value);
}; };
exports.remove = function (k) { return function (t) {
    if (maybe_1.isNone(t)) {
        return t;
    }
    var node = maybe_1.unwrap(t);
    if (k < node.key) {
        return maybe_1.Some(newNode(node.key, node.value, exports.remove(k)(node.left), node.right));
    }
    if (k > node.key) {
        return maybe_1.Some(newNode(node.key, node.value, node.left, exports.remove(k)(node.left)));
    }
    return maybe_1.None();
}; };
