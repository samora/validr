/**
 * Module Dependencies.
 */
var _ = require('lodash'),
  validator = require('validator');

/**
 * Constructor.
 * 
 * @param {object} body
 * @param {object} extend validator
 */
function Validr(body, extendValidator){
  var that = this;
  
  // Verify body is object.
  if (!body || typeof body !== 'object')
    throw new Error('Invalid argument. Pass an object.');
  
  // Setup properties.
  that.body = body;
  that._errors = [];
  that._validators = {};
  that._param = undefined;
  that._value = undefined;
  that._msg = undefined;
  that._doNotValidate = undefined;

  var combinedValidator = _.merge({}, validator, extendValidator);

  // Setup validators.
  Object.keys(combinedValidator).forEach(function (method) {

    // Verify valid validator method.
    var notValdator = (method.slice(0, 2) !== 'is'
      && method !== 'equals'
      && method !== 'contains'
      && method !== 'matches');

    if (notValdator) return;

    // Setup validators.
    that._validators[method] = function () {
      var args, bool, msg;

      args = Array.prototype.slice.call(arguments);
      args.unshift(that._value);

      bool = combinedValidator[method].apply(combinedValidator[method], args);

      // Exit if valid.
      if (bool) return that._validators;

      if (typeof that._msg === 'string')
        msg = that._msg;
      else
        msg = that._msg[method];

      that._errors.push({
        param: that._param,
        msg: msg,
        value: that._value
      });

      return that._validators;
    };
  });
}

/** 
 * Validr object properties.
 */
Validr.prototype.body;
Validr.prototype._errors;
Validr.prototype._param;
Validr.prototype._value;
Validr.prototype._msg;
Validr.prototype._doNotValidate;
Validr.prototype._validators;
Validr.prototype._sanitizers;


/**
 * Setup this._param, this._value and this._msg 
 * with param and msg. Returns this._validators.
 * 
 * @param {string|array} param
 * @param {string|object} msg
 * @return {object} this._validators
 */
Validr.prototype.validate = function (param, msg){
  var value,
    that = this;

  if (!Array.isArray(param) && typeof param !== 'string') {
    throw new Error('Invalid parameter. '
      + 'Parameter must be string or array.')
  }

  if (typeof param === 'string')
    param = param.split('.');

  var value = _.cloneDeep(this.body);
  param.forEach(function (item) {
    if (Object.prototype.toString.call(value) !== '[object Object]') return
    
    value = value[item];
  });

  that._param = param.join('.');
  that._value = value;
  that._msg = msg;

  return that._validators;
};

/**
 * Should return an array/object of errors or null.
 * 
 * @param {boolean} mapped
 * @return {array|object|null}
 */
Validr.prototype.validationErrors = function (mapped) {
  if (this._errors.length === 0) return null;

  if (!mapped) return this._errors;

  var errors = {};
  this._errors.forEach(function (error) {
    errors[error.param] = error;
  });
  
  return errors;
};


// Exports
module.exports = Validr;
