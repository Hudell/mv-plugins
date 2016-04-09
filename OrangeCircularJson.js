/*=============================================================================
 * Orange - CircularJSON
 * By Hudell - www.hudell.com
 * OrangeCircularJSON.js
 * Version: 1.0.1
 * Free for commercial and non commercial use.
 *=============================================================================*/
/*:
 * @plugindesc Fixes Circular References on JSON serialization <OrangeCircularJSON>
 * @author Hudell
 *
 * @help
 * ============================================================================
 * Hudell's Plugins
 * ============================================================================
 * 
 * Check out my website:
 * http://hudell.com
 *
 * This plugin uses the CircularJSON module by WebRelection:
 * https://github.com/WebReflection/circular-json
 * 
 *=============================================================================*/
var Imported = Imported || {};
var Hudell = Hudell || {};
Hudell.OrangeCircularJSON = Hudell.OrangeCircularJSON || {};

(function($) {
  var oldJsonExStringify = JsonEx.stringify;
  var oldJsonExParse = JsonEx.parse;

  //CircularJSON, by WebReflection (https://github.com/WebReflection/circular-json)
  // Modified to include the functionality of JsonEx._encode and JsonEx._decode, from MV's lib.

  /*!
  Copyright (C) 2013 by WebReflection

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

  */
  var CircularJSON = (function(JSON, RegExp){
  var
    // should be a not so common char
    // possibly one JSON does not encode
    // possibly one encodeURIComponent does not encode
    // right now this char is '~' but this might change in the future
    specialChar = '~',
    safeSpecialChar = '\\x' + (
      '0' + specialChar.charCodeAt(0).toString(16)
    ).slice(-2),
    escapedSafeSpecialChar = '\\' + safeSpecialChar,
    specialCharRG = new RegExp(safeSpecialChar, 'g'),
    safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),

    safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),

    indexOf = [].indexOf || function(v){
      for(var i=this.length;i--&&this[i]!==v;);
      return i;
    },
    $String = String  // there's no way to drop warnings in JSHint
                      // about new String ... well, I need that here!
                      // faked, and happy linter!
  ;

  function generateReplacer(value, replacer, resolve) {
    var
      path = [],
      all  = [value],
      seen = [value],
      mapp = [resolve ? specialChar : '[Circular]'],
      last = value,
      lvl  = 1,
      i
    ;
    return function(key, value) {
      // the replacer has rights to decide
      // if a new object should be returned
      // or if there's some key to drop
      // let's call it here rather than "too late"
      if (replacer) value = replacer.call(this, key, value);

      var type = Object.prototype.toString.call(value);
      if (type === '[object Object]' || type === '[object Array]') {
        var constructorName = JsonEx._getConstructorName(value);
        if (constructorName !== 'Object' && constructorName !== 'Array') {
          value['@'] = constructorName;
        }
      }

      // did you know ? Safari passes keys as integers for arrays
      // which means if (key) when key === 0 won't pass the check
      if (key !== '') {
        if (last !== this) {
          i = lvl - indexOf.call(all, this) - 1;
          lvl -= i;
          all.splice(lvl, all.length);
          path.splice(lvl - 1, path.length);
          last = this;
        }
        // console.log(lvl, key, path);
        if (typeof value === 'object' && value) {
        // if object isn't referring to parent object, add to the
          // object path stack. Otherwise it is already there.
          if (indexOf.call(all, value) < 0) {
            all.push(last = value);
          }
          lvl = all.length;
          i = indexOf.call(seen, value);
          if (i < 0) {
            i = seen.push(value) - 1;
            if (resolve) {
              // key cannot contain specialChar but could be not a string
              path.push(('' + key).replace(specialCharRG, safeSpecialChar));
              mapp[i] = specialChar + path.join(specialChar);
            } else {
              mapp[i] = mapp[0];
            }
          } else {
            value = mapp[i];
          }
        } else {
          if (typeof value === 'string' && resolve) {
            // ensure no special char involved on deserialization
            // in this case only first char is important
            // no need to replace all value (better performance)
            value = value .replace(safeSpecialChar, escapedSafeSpecialChar)
                          .replace(specialChar, safeSpecialChar);
          }
        }
      }
      return value;
    };
  }

  function retrieveFromPath(current, keys) {
    for(var i = 0, length = keys.length; i < length; current = current[
      // keys should be normalized back here
      keys[i++].replace(safeSpecialCharRG, specialChar)
    ]);
    return current;
  }

  function generateReviver(reviver) {
    return function(key, value) {
      var isString = typeof value === 'string';
      if (isString && value.charAt(0) === specialChar) {
        return new $String(value.slice(1));
      }
      if (key === '') value = regenerate(value, value, {});
      // again, only one needed, do not use the RegExp for this replacement
      // only keys need the RegExp
      if (isString) value = value .replace(safeStartWithSpecialCharRG, '$1' + specialChar)
                                  .replace(escapedSafeSpecialChar, safeSpecialChar);
      return reviver ? reviver.call(this, key, value) : value;
    };
  }

  function regenerateArray(root, current, retrieve) {
    for (var i = 0, length = current.length; i < length; i++) {
      current[i] = regenerate(root, current[i], retrieve);
    }
    return current;
  }

  function regenerateObject(root, current, retrieve) {
    for (var key in current) {
      if (current.hasOwnProperty(key)) {
        current[key] = regenerate(root, current[key], retrieve);
      }
    }

    var type = Object.prototype.toString.call(current);
    if (type === '[object Object]' || type === '[object Array]') {
      if (current['@']) {
        var constructor = window[current['@']];
        if (constructor) {
          current = JsonEx._resetPrototype(current, constructor.prototype);
        }
      }
    }

    return current;
  }

  function regenerate(root, current, retrieve) {
    return current instanceof Array ?
      // fast Array reconstruction
      regenerateArray(root, current, retrieve) :
      (
        current instanceof $String ?
          (
            // root is an empty string
            current.length ?
              (
                retrieve.hasOwnProperty(current) ?
                  retrieve[current] :
                  retrieve[current] = retrieveFromPath(
                    root, current.split(specialChar)
                  )
              ) :
              root
          ) :
          (
            current instanceof Object ?
              // dedicated Object parser
              regenerateObject(root, current, retrieve) :
              // value as it is
              current
          )
      )
    ;
  }

  function stringifyRecursion(value, replacer, space, doNotResolve) {
    return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
  }

  function parseRecursion(text, reviver) {
    return JSON.parse(text, generateReviver(reviver));
  }

  return {
    stringify: stringifyRecursion,
    parse: parseRecursion
  };
  }(JSON, RegExp));


  JsonEx.stringify = function(object) {
    return CircularJSON.stringify(object);
  };

  JsonEx.parse = function(json) {
    return CircularJSON.parse(json);
  };

  $.oldJsonExParse = oldJsonExParse;
  $.oldJsonExStringify = oldJsonExStringify;
  $.CircularJSON = CircularJSON;
})(Hudell.OrangeCircularJSON);

OrangeCircularJSON = Hudell.OrangeCircularJSON;
Imported.OrangeCircularJSON = 1.0;