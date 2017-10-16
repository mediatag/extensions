/* GLOBALS START */
var MT = {};
MT['routes'] = {};
MT['globals'] = {};
window['MT'] = MT;
MT['Manager'] = {};
MT['routes']['extension_imports_image_path'] = '/extension/imports/image';
MT['routes']['extension_imports_medium_path'] = '/extension/imports/medium';
MT['routes']['extension_imports_webpage_path'] = '/extension/imports/webpage';
MT['globals']['IFRAME_CONTAINER_CLASS'] = 'mediatag_iframe_container_class_for_import_from_extension';
MT['globals']['SCREENSHOT_ELEMENT_DATA_CONTAINER_CLASS'] = 'mediatag_screenshot_element_data_container';
window.environment='production';
window.server_url='https://mediatag.io';
window.extension_browser='chrome';
window.extension_os='desktop';
window.full_permissions=true;
window.tags_display_allowed=true;
/* GLOBALS END */
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
(function() {
  var slice = [].slice;

  this.namespace = function(target, name, block) {
    var i, item, len, ref, ref1, top;
    if (arguments.length < 3) {
      ref = [(typeof exports !== 'undefined' ? exports : window)].concat(slice.call(arguments)), target = ref[0], name = ref[1], block = ref[2];
    }
    top = target;
    ref1 = name.split('.');
    for (i = 0, len = ref1.length; i < len; i++) {
      item = ref1[i];
      target = target[item] != null ? target[item] : target[item] = {};
    }
    return block(target, top);
  };

}).call(this);
(function() {
  var Capturer;

  Capturer = (function() {
    function Capturer() {}

    Capturer.prototype.get_image_datauri_from_url = function(url, callback) {
      var c, image, self, timeout_delay;
      image = new Image();
      timeout_delay = 1000;
      this.image_loaded = false;
      this.delay_ellapsed = false;
      c = (function(_this) {
        return function() {
          if (!_this.image_loaded) {
            console.log("timeout ellapsed to load " + url);
            _this.delay_ellapsed = true;
            return callback();
          }
        };
      })(this);
      setTimeout(c, timeout_delay);
      self = this;
      image.onload = function() {
        var canvas, datauri, e;
        self.image_loaded = true;
        datauri = null;
        try {
          canvas = document.createElement('canvas');
          canvas.width = this.naturalWidth;
          canvas.height = this.naturalHeight;
          canvas.getContext('2d').drawImage(this, 0, 0);
          datauri = canvas.toDataURL("image/png");
        } catch (error1) {
          e = error1;
          console.log(url + " read datauri failed", e);
          console.log(url);
        }
        if (!self.delay_ellapsed) {
          return callback(datauri, this);
        }
      };
      image.onerror = function() {
        self.image_loaded = true;
        if (!self.delay_ellapsed) {
          console.log(url + " load error");
          console.log(url);
          return callback();
        }
      };
      image.crossOrigin = "anonymous";
      return image.src = url;
    };

    Capturer.prototype.get_stylesheet_content_from_url = function(url, callback) {
      var request;
      request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = (function(_this) {
        return function(event) {
          var response;
          if ((response = request.response) != null) {
            return callback(response);
          } else {
            return console.log("stylesheet " + url + " returned no content");
          }
        };
      })(this);
      request.onerror = (function(_this) {
        return function(error) {
          console.log("error");
          console.log(error);
          return callback();
        };
      })(this);
      return request.send();
    };

    return Capturer;

  })();

  namespace("MT", function(e) {
    return e.Capturer = Capturer;
  });

}).call(this);
(function() {
  var Color;

  Color = (function() {
    function Color() {}

    Color.html = {
      aliceblue: 'f0f8ff',
      antiquewhite: 'faebd7',
      aqua: '00ffff',
      aquamarine: '7fffd4',
      azure: 'f0ffff',
      beige: 'f5f5dc',
      bisque: 'ffe4c4',
      black: '000000',
      blanchedalmond: 'ffebcd',
      blue: '0000ff',
      blueviolet: '8a2be2',
      brown: 'a52a2a',
      burlywood: 'deb887',
      cadetblue: '5f9ea0',
      chartreuse: '7fff00',
      chocolate: 'd2691e',
      coral: 'ff7f50',
      cornflowerblue: '6495ed',
      cornsilk: 'fff8dc',
      crimson: 'dc143c',
      cyan: '00ffff',
      darkblue: '00008b',
      darkcyan: '008b8b',
      darkgoldenrod: 'b8860b',
      darkgray: 'a9a9a9',
      darkgrey: 'a9a9a9',
      darkgreen: '006400',
      darkkhaki: 'bdb76b',
      darkmagenta: '8b008b',
      darkolivegreen: '556b2f',
      darkorange: 'ff8c00',
      darkorchid: '9932cc',
      darkred: '8b0000',
      darksalmon: 'e9967a',
      darkseagreen: '8fbc8f',
      darkslateblue: '483d8b',
      darkslategray: '2f4f4f',
      darkslategrey: '2f4f4f',
      darkturquoise: '00ced1',
      darkviolet: '9400d3',
      deeppink: 'ff1493',
      deepskyblue: '00bfff',
      dimgray: '696969',
      dimgrey: '696969',
      dodgerblue: '1e90ff',
      firebrick: 'b22222',
      floralwhite: 'fffaf0',
      forestgreen: '228b22',
      fuchsia: 'ff00ff',
      gainsboro: 'dcdcdc',
      ghostwhite: 'f8f8ff',
      gold: 'ffd700',
      goldenrod: 'daa520',
      gray: '808080',
      grey: '808080',
      green: '008000',
      greenyellow: 'adff2f',
      honeydew: 'f0fff0',
      hotpink: 'ff69b4',
      indianred: 'cd5c5c',
      indigo: '4b0082',
      ivory: 'fffff0',
      khaki: 'f0e68c',
      lavender: 'e6e6fa',
      lavenderblush: 'fff0f5',
      lawngreen: '7cfc00',
      lemonchiffon: 'fffacd',
      lightblue: 'add8e6',
      lightcoral: 'f08080',
      lightcyan: 'e0ffff',
      lightgoldenrodyellow: 'fafad2',
      lightgray: 'd3d3d3',
      lightgrey: 'd3d3d3',
      lightgreen: '90ee90',
      lightpink: 'ffb6c1',
      lightsalmon: 'ffa07a',
      lightseagreen: '20b2aa',
      lightskyblue: '87cefa',
      lightslategray: '778899',
      lightslategrey: '778899',
      lightsteelblue: 'b0c4de',
      lightyellow: 'ffffe0',
      lime: '00ff00',
      limegreen: '32cd32',
      linen: 'faf0e6',
      magenta: 'ff00ff',
      maroon: '800000',
      mediumaquamarine: '66cdaa',
      mediumblue: '0000cd',
      mediumorchid: 'ba55d3',
      mediumpurple: '9370db',
      mediumseagreen: '3cb371',
      mediumslateblue: '7b68ee',
      mediumspringgreen: '00fa9a',
      mediumturquoise: '48d1cc',
      mediumvioletred: 'c71585',
      midnightblue: '191970',
      mintcream: 'f5fffa',
      mistyrose: 'ffe4e1',
      moccasin: 'ffe4b5',
      navajowhite: 'ffdead',
      navy: '000080',
      oldlace: 'fdf5e6',
      olive: '808000',
      olivedrab: '6b8e23',
      orange: 'ffa500',
      orangered: 'ff4500',
      orchid: 'da70d6',
      palegoldenrod: 'eee8aa',
      palegreen: '98fb98',
      paleturquoise: 'afeeee',
      palevioletred: 'db7093',
      papayawhip: 'ffefd5',
      peachpuff: 'ffdab9',
      peru: 'cd853f',
      pink: 'ffc0cb',
      plum: 'dda0dd',
      powderblue: 'b0e0e6',
      purple: '800080',
      rebeccapurple: '663399',
      red: 'ff0000',
      rosybrown: 'bc8f8f',
      royalblue: '4169e1',
      saddlebrown: '8b4513',
      salmon: 'fa8072',
      sandybrown: 'f4a460',
      seagreen: '2e8b57',
      seashell: 'fff5ee',
      sienna: 'a0522d',
      silver: 'c0c0c0',
      skyblue: '87ceeb',
      slateblue: '6a5acd',
      slategray: '708090',
      slategrey: '708090',
      snow: 'fffafa',
      springgreen: '00ff7f',
      steelblue: '4682b4',
      tan: 'd2b48c',
      teal: '008080',
      thistle: 'd8bfd8',
      tomato: 'ff6347',
      turquoise: '40e0d0',
      violet: 'ee82ee',
      wheat: 'f5deb3',
      white: 'ffffff',
      whitesmoke: 'f5f5f5',
      yellow: 'ffff00',
      yellowgreen: '9acd32',
      "private": 'cc4b37',
      "public": '66e866',
      youtube: 'ff0000',
      vimeo: '00adef',
      pinterest: 'bd081c',
      'news.ycombinator': 'ff6600'
    };

    Color.hex_to_rgb = function(hex) {
      return _.map([0, 1, 2], function(i) {
        return parseInt(hex.substr(i * 2, 2), 16);
      });
    };

    Color.rgb_to_hsl = function(r, g, b) {
      var d, h, l, max, min, s;
      r /= 255;
      g /= 255;
      b /= 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h = Math.round((h / 6) * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
      }
      return [h, s, l];
    };

    Color.hex_to_hsl = function(hex) {
      var rgb;
      rgb = this.hex_to_rgb(hex);
      return this.rgb_to_hsl(rgb[0], rgb[1], rgb[2]);
    };

    Color.str_to_hue = function(str) {
      var seeds;
      seeds = 0;
      _.each(str.split(''), function(char, i) {
        return seeds += char.charCodeAt(0) * (i * 31);
      });
      return seeds % 360;
    };

    Color.hue_from_name = function(name) {
      var hex;
      hex = this.html[name];
      if (hex != null) {
        return this.hex_to_hsl(hex)[0];
      } else {
        return this.str_to_hue(name);
      }
    };

    Color.hsl_from_name = function(name) {
      var hue, l, s;
      s = 90;
      l = 90;
      switch (name) {
        case 'white':
          s = 99;
          l = 99;
          break;
        case 'black':
          s = 0;
          l = 60;
          break;
        default:
          if (_.includes(name, 'light')) {
            l = 95;
          } else if (_.includes(name, 'dark')) {
            l = 80;
          }
      }
      hue = this.hue_from_name(name);
      return "hsl(" + hue + ", " + s + "%, " + l + "%)";
    };

    return Color;

  })();

  window.Color = Color;

}).call(this);
(function() {
  var DocumentReady, completed;

  DocumentReady = (function() {
    function DocumentReady() {
      this.callbacks = [];
      this.callbacks_executed = false;
    }

    DocumentReady.prototype.on = function(callback) {
      if (this.callbacks_executed) {
        return callback();
      } else {
        return this.callbacks.push(callback);
      }
    };

    DocumentReady.prototype.execute_callbacks = function() {
      var callback, i, len, ref;
      if (this.callbacks_executed) {
        return;
      }
      this.callbacks_executed = true;
      ref = this.callbacks;
      for (i = 0, len = ref.length; i < len; i++) {
        callback = ref[i];
        callback();
      }
      return this.callbacks = [];
    };

    return DocumentReady;

  })();

  namespace("MT", function(e) {
    return e.DocumentReady != null ? e.DocumentReady : e.DocumentReady = new DocumentReady();
  });

  completed = function() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    return MT.DocumentReady.execute_callbacks();
  };

  if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    window.setTimeout(MT.DocumentReady.execute_callbacks());
  } else {
    document.addEventListener("DOMContentLoaded", completed);
    window.addEventListener("load", completed);
  }

}).call(this);
(function() {
  var DomHelper;

  DomHelper = (function() {
    function DomHelper() {}

    DomHelper.prototype.insertAfter = function(newNode, referenceNode) {
      return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    DomHelper.prototype.offset = function(el) {
      var obj, rect;
      rect = el.getBoundingClientRect();
      return obj = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    };

    DomHelper.prototype.hasClass = function(el, class_name) {
      var ref;
      return (ref = el.classList) != null ? ref.contains(class_name) : void 0;
    };

    return DomHelper;

  })();

  namespace("MT", function(e) {
    return e.DomHelper != null ? e.DomHelper : e.DomHelper = new DomHelper();
  });

}).call(this);
(function() {
  if (window.MT == null) {
    window.MT = {};
  }

  window.MT.EVENTS = {
    SCREENSHOT_REQUESTED: "SCREENSHOT_REQUESTED",
    SCREENSHOT_COMPLETED: "SCREENSHOT_COMPLETED",
    SCREENSHOT_ERROR: "SCREENSHOT_ERROR",
    REQUEST_PRE_IMPORT_DATA: "REQUEST_PRE_IMPORT_DATA",
    PROCESS_USER_PREFERENCES: "PROCESS_USER_PREFERENCE",
    IMPORT_MEDIUM_OR_WEBPAGE: "IMPORT_MEDIUM_OR_WEBPAGE",
    REQUEST_IMPORT_DATA: "REQUEST_IMPORT_DATA",
    PRE_IMPORT_DATA: "PRE_IMPORT_DATA",
    IMPORT_DATA: "IMPORT_DATA",
    RESIZE_IFRAME: "RESIZE_IFRAME",
    CONFIRM_IFRAME_LOADED: "CONFIRM_IFRAME_LOADED",
    CONFIRM_MEDIUM_LOADED: "CONFIRM_MEDIUM_LOADED",
    MEDIUM_SET_TIME: "MEDIUM_SET_TIME",
    MEDIUM_TIME_UPDATED: "MEDIUM_TIME_UPDATED",
    TEST_IMPORT_IMAGE: "TEST_IMPORT_IMAGE",
    TEST_IMPORT_WEBPAGE: "TEST_IMPORT_WEBPAGE"
  };

}).call(this);
(function() {
  var ImageHandler;

  ImageHandler = (function() {
    function ImageHandler(data1) {
      this.data = data1;
    }

    ImageHandler.prototype.clean = function() {
      var ref, ref1;
      console.log("ImageHandler clean");
      console.log((ref = this.data) != null ? ref.length : void 0);
      delete this.data;
      return console.log((ref1 = this.data) != null ? ref1.length : void 0);
    };

    ImageHandler.prototype.get_cropped_data = function(crop_options, callback) {
      var data;
      if (this.image != null) {
        data = this.image_to_data(crop_options);
        return callback(data);
      } else {
        this.image = new Image();
        this.image.onload = (function(_this) {
          return function() {
            data = _this.image_to_data(crop_options);
            return callback(data);
          };
        })(this);
        return this.image.src = this.data;
      }
    };

    ImageHandler.prototype.resize = function(width, height, callback) {
      var image;
      image = new Image();
      image.onload = function() {
        var canvas;
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        return callback(canvas.toDataURL());
      };
      return image.src = this.data;
    };

    ImageHandler.prototype.image_to_data = function(crop_options) {
      var canvas, context, data, err, height, scale, width, x, y;
      scale = 1;
      data = null;
      try {
        x = crop_options['x'];
        y = crop_options['y'];
        width = crop_options['width'];
        height = crop_options['height'];
        canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        context = canvas.getContext("2d");
        context.drawImage(this.image, x, y, width, height, 0, 0, width * scale, height * scale);
        data = canvas.toDataURL("image/png");
      } catch (error) {
        err = error;
        console.error(err, "error while capturing image");
        console.log(data.length);
        console.log(crop_options);
      }
      return data;
    };

    return ImageHandler;

  })();

  namespace("MT", function(e) {
    return e.ImageHandler = ImageHandler;
  });

}).call(this);
(function() {
  var style;

  style = {
    font: "Source Sans Pro, Arial, sans-serif",
    color: {
      alert: '#cc4b37',
      primary: '#1779ba',
      bg: '#fafcff',
      font: '#111111'
    }
  };

  namespace("MT", function(e) {
    return e.style = style;
  });

}).call(this);
(function() {
  var Url;

  Url = (function() {
    function Url() {}

    Url.prototype.wrap = function(url, params) {
      if (params == null) {
        params = {};
      }
      if ((url != null) && (url[0] != null) && url[0] !== '/') {
        url = "/" + url;
      }
      url = "" + window.server_url + url;
      return url;
    };

    Url.prototype.resolve_url = function(url) {
      if ((url == null) || url.length === 0) {
        return url;
      }
      if (url.slice(0, 4) === 'data') {
        return url;
      }
      if (url.slice(0, 4) === 'http') {
        return url;
      }
      if (url.slice(0, 4) === 'chro') {
        return url;
      }
      if (url.slice(0, 2) === '//') {
        return "" + window.location.protocol + url;
      } else {
        if (url[0] === '/') {
          return "" + location.origin + url;
        } else {
          return location.origin + "/" + url;
        }
      }
    };

    Url.prototype.get_host = function(url) {
      var host, parser;
      parser = document.createElement('a');
      parser.href = url;
      return host = parser.hostname;
    };

    Url.prototype.tag_url = function(tag_name) {
      return this.wrap("/dashboard/tags/" + tag_name);
    };

    return Url;

  })();

  namespace("MT", function(e) {
    return e.Url != null ? e.Url : e.Url = new Url();
  });

}).call(this);
(function() {
  var WindowManager;

  WindowManager = (function() {
    function WindowManager() {
      this.callbacks = {};
      window.onmessage = (function(_this) {
        return function(e) {
          var callback, data;
          data = e.data;
          if ((callback = _this.callbacks[data['response_command']]) != null) {
            return callback.apply(_this, [data]);
          } else {
            return _this.process_message(e.data, e);
          }
        };
      })(this);
      this.onbeforeunload_callbacks = [];
      window.onbeforeunload = (function(_this) {
        return function() {
          var message;
          message = null;
          if (_this.onbeforeunload_callbacks.length > 0) {
            _.each(_this.onbeforeunload_callbacks, function(callback) {
              return message != null ? message : message = callback.call();
            });
          }
          return message;
        };
      })(this);
    }

    WindowManager.prototype.onbeforeunload_message = function() {
      var message;
      message = null;
      if (this.onbeforeunload_callbacks / length > 0) {
        _.each(this.onbeforeunload_callbacks, function(callback) {
          return message != null ? message : message = callback.call();
        });
      }
      return message;
    };

    WindowManager.prototype.post_message = function(iframeobj, message, origin) {
      var target;
      if (origin == null) {
        origin = "*";
      }
      target = iframeobj.contentWindow || iframeobj;
      if ((target != null) && (target.postMessage != null)) {
        return target.postMessage(message, origin);
      } else {
        return console.log("no target to post message to");
      }
    };

    WindowManager.prototype.post_message_to_parent = function(data, callback) {
      var target;
      this.callbacks[data['command']] = callback;
      target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : null);
      if (target != null) {
        return target.postMessage(data, "*");
      } else {
        return console.log("post_message_to_parent: message not posted");
      }
    };

    WindowManager.prototype.set_event_processor = function(callback) {
      return this.event_processor = callback;
    };

    WindowManager.prototype.process_message = function(data, event) {
      if (this.event_processor != null) {
        return this.event_processor(data, event);
      }
    };

    WindowManager.prototype.resize_iframe = function(options) {
      if (options == null) {
        options = {};
      }
      options['command'] = MT.EVENTS.RESIZE_IFRAME;
      options['height'] = document.body.clientHeight;
      return this.post_message_to_parent(options);
    };

    WindowManager.prototype.add_onbeforeunload_callback = function(callback) {
      return this.onbeforeunload_callbacks.push(callback);
    };

    return WindowManager;

  })();

  namespace("MT.Manager", function(e) {
    return e.WindowAbstractClass = WindowManager;
  });

  namespace("MT.Manager", function(e) {
    return e.WindowAbstract != null ? e.WindowAbstract : e.WindowAbstract = new WindowManager();
  });

}).call(this);
(function() {
  var ProgressBar,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ProgressBar = (function() {
    function ProgressBar() {
      this.increase_progress = bind(this.increase_progress, this);
      this.color = MT.style.color.alert;
      this.create_element();
    }

    ProgressBar.prototype.create_element = function() {
      this.progress = 0;
      this.element = document.createElement('div');
      this.element.style.position = 'absolute';
      this.element.style.top = '0';
      this.element.style.left = '0';
      this.element.style.width = '100%';
      this.element.style.height = '0';
      this.element.style.zIndex = '1000';
      this.bar = document.createElement('div');
      this.bar.style.position = 'absolute';
      this.bar.style.height = '2px';
      this.bar.style.backgroundColor = this.color;
      this.element.appendChild(this.bar);
      return this.increase_progress();
    };

    ProgressBar.prototype.increase_progress = function() {
      this.bar.style.width = this.progress + "%";
      this.progress += 1;
      if (this.progress > 100) {
        this.progress = 0;
      }
      return setTimeout(this.increase_progress, 20);
    };

    return ProgressBar;

  })();

  namespace("MT.Widget", function(e) {
    return e.ProgressBar = ProgressBar;
  });

}).call(this);
(function() {
  if (window.background_listener_added == null) {
    window.background_listener_added = true;
    if (typeof chrome !== "undefined" && chrome !== null) {
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.action) {
          case "import_image":
            return new MT.Extension.ContentScript.Importer.Image(request);
          case MT.EVENTS.IMPORT_MEDIUM_OR_WEBPAGE:
            return new MT.Extension.ContentScript.Importer.MediumOrWebpage(request);
        }
      });
    }
  }

}).call(this);
(function() {
  MT.DocumentReady.on(function() {
    var c;
    if (window.window_listener_added == null) {
      window.window_listener_added = true;
      c = (function(_this) {
        return function(event) {
          var data, err;
          if (event.source !== window) {
            return;
          }
          if ((data = event.data) != null) {
            try {
              if (data['type'] === MT.EVENTS.TEST_IMPORT_IMAGE) {
                new MT.Extension.ContentScript.Importer.Image(data);
              }
              if (data['type'] === MT.EVENTS.TEST_IMPORT_WEBPAGE) {
                return new MT.Extension.ContentScript.Importer.Webpage(data).prepare_html_and_build_iframe();
              }
            } catch (error) {
              err = error;
            }
          }
        };
      })(this);
      return window.addEventListener("message", c, false);
    }
  });

}).call(this);
(function() {
  var message_options;

  if (window.extension_browser === 'firefox' && window.extension_os === 'android') {
    message_options = {
      type: "show_page_action"
    };
    if (typeof chrome !== "undefined" && chrome !== null) {
      chrome.runtime.sendMessage(message_options);
    }
  }

}).call(this);
(function() {
  var UserPreferencesController;

  UserPreferencesController = (function() {
    function UserPreferencesController() {}

    UserPreferencesController.prototype.send_request = function(callback) {
      var request, url;
      if (this.hostname() === 'localhost' && environment === 'production') {
        console.log("hostname is localhost, not querying user preferences");
      } else if (this.hostname() === 'mediatag') {
        console.log("hostname is mediatag, not querying user preferences");
      } else {
        console.log("loading user preferences...");
        url = MT.Url.wrap('/api/preference');
        url += "?origin=" + (this.origin());
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = (function(_this) {
          return function(event) {
            var data, response;
            if ((response = request.response) != null) {
              data = JSON.parse(response);
              return callback(data);
            } else {
              return console.log("query_user_preferences returned no content");
            }
          };
        })(this);
        request.onerror = (function(_this) {
          return function(error) {
            console.log("error while querying preferences");
            return console.log(error);
          };
        })(this);
        return request.send();
      }
    };

    UserPreferencesController.prototype.origin = function() {
      return window.location.href;
    };

    UserPreferencesController.prototype.hostname = function() {
      return window.location.hostname;
    };

    return UserPreferencesController;

  })();

  namespace("MT.ContentScript", function(e) {
    return e.UserPreferencesController != null ? e.UserPreferencesController : e.UserPreferencesController = new UserPreferencesController();
  });

}).call(this);
(function() {
  var WindowManager,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  WindowManager = (function(superClass) {
    extend(WindowManager, superClass);

    function WindowManager() {
      this.process_default_events = bind(this.process_default_events, this);
      WindowManager.__super__.constructor.apply(this, arguments);
      this.set_event_processor((function(_this) {
        return function(data, event) {
          return _this.process_default_events(data, event);
        };
      })(this));
    }

    WindowManager.prototype.process_default_events = function(data) {
      var command;
      if (data != null) {
        if ((command = data['command']) != null) {
          switch (command) {
            case MT.EVENTS.SCREENSHOT_REQUESTED:
              return this.process_screenshot(data);
          }
        }
      }
    };

    WindowManager.prototype.process_screenshot = function(data) {
      var screenshot_element;
      screenshot_element = document.getElementsByClassName(MT.globals.SCREENSHOT_ELEMENT_DATA_CONTAINER_CLASS)[0];
      if (screenshot_element != null) {
        if (this.capturer == null) {
          this.capturer = new MT.Extension.ContentScript.Capturer();
        }
        return this.capturer.screenshot_visible_area((function(_this) {
          return function(datauri) {
            var crop_options, handler;
            if (datauri != null) {
              handler = new MT.ImageHandler(datauri);
              crop_options = data;
              return handler.get_cropped_data(crop_options, function(cropped_datauri) {
                return screenshot_element.dataset['datauri'] = cropped_datauri;
              });
            } else {
              return screenshot_element.dataset['error'] = "no datauri";
            }
          };
        })(this));
      }
    };

    return WindowManager;

  })(MT.Manager.WindowAbstractClass);

  namespace("MT.Manager.ContentScript", function(e) {
    return e.Window != null ? e.Window : e.Window = new WindowManager();
  });

}).call(this);
(function() {
  var Capturer;

  Capturer = (function() {
    function Capturer() {
      this.capture_success_count = 0;
      this.capture_error_count = 0;
    }

    Capturer.prototype.clean = function() {
      console.log("capture success: " + this.capture_success_count);
      return console.log("capture error: " + this.capture_error_count);
    };

    Capturer.prototype.screenshot_visible_area = function(callback) {
      var message_options;
      message_options = {
        type: MT.EVENTS.SCREENSHOT_REQUESTED
      };
      if (typeof chrome !== "undefined" && chrome !== null) {
        return chrome.runtime.sendMessage(message_options, (function(_this) {
          return function(data) {
            var datauri;
            if (data != null) {
              datauri = data['data'];
              return callback(datauri);
            } else {
              return callback();
            }
          };
        })(this));
      } else {
        return callback();
      }
    };

    Capturer.prototype.screenshot_element = function(element, callback) {
      return this.screenshot_visible_area((function(_this) {
        return function(datauri) {
          var crop_options, handler, offset;
          if (datauri != null) {
            offset = MT.DomHelper.offset(element);
            crop_options = {
              x: offset['left'],
              y: Math.ceil(offset['top']) - document.body.scrollTop,
              width: element.offsetWidth,
              height: element.offsetHeight
            };
            handler = new MT.ImageHandler(datauri);
            return handler.get_cropped_data(crop_options, function(cropped_datauri) {
              return callback(cropped_datauri);
            });
          } else {
            return callback();
          }
        };
      })(this));
    };

    Capturer.prototype.get_image_datauri_from_url = function(url, callback) {
      var base_capturer;
      base_capturer = new MT.Capturer();
      return base_capturer.get_image_datauri_from_url(url, (function(_this) {
        return function(datauri, image) {
          var message_options;
          if (datauri != null) {
            return callback(datauri, image);
          } else {
            if (typeof chrome === "undefined" || chrome === null) {
              return callback();
            } else {
              message_options = {
                type: "capture_image_from_url",
                url: url
              };
              return chrome.runtime.sendMessage(message_options, function(data) {
                datauri = data['data'];
                if (datauri != null) {
                  _this.capture_success_count += 1;
                } else {
                  _this.capture_error_count += 1;
                }
                return callback(datauri);
              });
            }
          }
        };
      })(this));
    };

    Capturer.prototype.get_stylesheet_content_from_url = function(url, callback) {
      var message_options;
      message_options = {
        type: "capture_stylesheet_from_url",
        url: url
      };
      if (typeof chrome !== "undefined" && chrome !== null) {
        return chrome.runtime.sendMessage(message_options, (function(_this) {
          return function(data) {
            var stylesheet_content;
            stylesheet_content = data['data'];
            return callback(stylesheet_content);
          };
        })(this));
      } else {
        return callback();
      }
    };

    return Capturer;

  })();

  namespace("MT.Extension.ContentScript", function(e) {
    return e.Capturer = Capturer;
  });

}).call(this);
(function() {
  var ServiceFinder;

  ServiceFinder = (function() {
    function ServiceFinder() {}

    ServiceFinder.prototype.regexp_lists = function() {
      return {
        'vimeo': {
          '^https?://(www.)?vimeo.com/(\\d+)(\\?.*)?$': 2,
          '^https?://(www.)?vimeo.com/channels/\\w*/(\\d+)(\\?.*)?$': 2,
          '^https?://(www.)?vimeo.com/groups/\\w*/videos/(\\d+)(\\?.*)?$': 2
        },
        'youtube': {
          '^https?://(www.)?youtube.com/watch\\?v=([\\w-]+)(&.*)?': 2,
          '^https?://(www.)?youtube.com/watch\\?(.*)&v=([\\w-]+)': 3,
          '^https?://(www.)?youtube.com/user/\\w+\\?v=([\\w-]+)(&.*)?': 2,
          '^https?://(www.)?youtube.com/embed/([\\w-]+)?': 2,
          '^https?://(www.)?youtu.be/([\\w-]+)(&.*)?': 2
        }
      };
    };

    ServiceFinder.prototype.is_url_valid = function(url) {
      var h, response;
      h = this.regexp_lists();
      response = null;
      _.each(_.keys(h), (function(_this) {
        return function(service) {
          var list;
          list = h[service];
          return _.each(_.keys(list), function(regexp_str) {
            var expected_result_index, regexp, result, valid;
            expected_result_index = list[regexp_str];
            regexp = new RegExp(regexp_str);
            if ((result = regexp.exec(url)) != null) {
              if (result[expected_result_index] != null) {
                valid = true;
                return response = {
                  valid: true,
                  name: service
                };
              }
            }
          });
        };
      })(this));
      return response;
    };

    return ServiceFinder;

  })();

  namespace("MT", function(e) {
    return e.ServiceFinder = ServiceFinder;
  });

}).call(this);
(function() {
  var BaseImporter;

  BaseImporter = (function() {
    function BaseImporter(data1) {
      this.data = data1;
      this.resize_allowed = false;
      this.is_mounted = true;
    }

    BaseImporter.prototype.container_parent = function() {
      return document.body;
    };

    BaseImporter.prototype.iframe_css_position = function() {
      return 'fixed';
    };

    BaseImporter.prototype.iframe_css_width = function() {
      return "300px";
    };

    BaseImporter.prototype.iframe_css_height = function() {
      return "100%";
    };

    BaseImporter.prototype.build_iframe_container_and_loader = function() {
      var container_parent, image, label, progress_bar, stylesheet;
      stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300';
      document.head.appendChild(stylesheet);
      this.iframe_container = document.createElement('div');
      this.iframe_container.classList.add(MT.globals.IFRAME_CONTAINER_CLASS);
      this.iframe_container.style.position = this.iframe_css_position();
      this.iframe_container.style.zIndex = 1999999999 + 199999;
      this.iframe_container.style.backgroundColor = MT.style.color.bg;
      this.iframe_container.style.color = MT.style.color.font;
      this.iframe_container.style.right = 0;
      this.iframe_container.style.top = 0;
      this.iframe_container.style.width = this.iframe_css_width();
      this.iframe_container.style.maxWidth = "100%";
      this.iframe_container.style.height = this.iframe_css_height();
      this.iframe_container.style.borderLeft = "1px solid lightgray";
      this.iframe_container.style.fontFamily = MT.style.font;
      this.iframe_container.style.textAlign = "center";
      this.iframe_container.style.margin = "auto";
      this.loader_elements_container = document.createElement('div');
      this.loader_elements_container.classList.add("iframe_loader");
      image = document.createElement('img');
      image.style.padding = 10;
      image.style.margin = 'auto';
      image.style.display = "block";
      if (typeof chrome !== "undefined" && chrome !== null) {
        image.src = chrome.extension.getURL("logo/mediatag.32.png");
      }
      label = document.createElement('div');
      label.style.paddingBottom = 10;
      label.style.textAlign = "center";
      label.style.fontSize = "24px";
      label.style.display = "block";
      label.textContent = "loading...";
      progress_bar = new MT.Widget.ProgressBar();
      this.loader_elements_container.appendChild(progress_bar.element);
      this.loader_elements_container.appendChild(image);
      this.loader_elements_container.appendChild(label);
      this.iframe_container.appendChild(this.loader_elements_container);
      container_parent = this.container_parent();
      if (container_parent != null) {
        return container_parent.appendChild(this.iframe_container);
      } else {
        return console.warn("NO CONTAINER PARENT TO ATTACH THE IFRAME");
      }
    };

    BaseImporter.prototype.build_iframe = function() {
      var iframe_class, iframe_parent;
      iframe_class = "mediatag_iframe";
      iframe_parent = document.body;
      this.iframe = document.createElement('iframe');
      this.iframe.frameBorder = 0;
      this.iframe.name = "mediatag_extension";
      this.iframe.crossOrigin = "anonymous";
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.boxShadow = '0px 5px 25px 0px gray';
      this.iframe_container.appendChild(this.iframe);
      if (this.url != null) {
        this.iframe.src = this.url;
        return this.start_timeout_count();
      } else {
        return console.warn("url needs to be overwritten");
      }
    };

    BaseImporter.prototype.start_timeout_count = function() {
      var c, timeout_duration;
      c = (function(_this) {
        return function() {
          if (_this.is_mounted && (_this.loader_elements_container != null)) {
            return _this.load_in_new_tab();
          } else {
            return console.log("it looks like the iframe has loaded fine");
          }
        };
      })(this);
      timeout_duration = (function() {
        switch (window.environment) {
          case 'test':
            return 15000;
          default:
            return 5000;
        }
      })();
      if (window.extension_os === 'android') {
        timeout_duration = 20000;
      }
      return setTimeout(c, timeout_duration);
    };

    BaseImporter.prototype.display_iframe_loading_timeout = function() {
      var close_button, timeout_message, timeout_message_container;
      timeout_message_container = document.createElement('div');
      timeout_message_container.style.padding = '10px';
      timeout_message = document.createElement('div');
      timeout_message.textContent = 'This is taking too long, it might not work well on this site';
      close_button = document.createElement('a');
      close_button.textContent = 'close';
      close_button.href = '#';
      close_button.style.color = MT.style.color.bg;
      close_button.style.padding = '5px 8px';
      close_button.style.backgroundColor = MT.style.color.primary;
      close_button.onclick = (function(_this) {
        return function() {
          return _this.close();
        };
      })(this);
      timeout_message_container.appendChild(timeout_message);
      timeout_message_container.appendChild(close_button);
      return this.loader_elements_container.appendChild(timeout_message_container);
    };

    BaseImporter.prototype.send_to_iframe = function(data) {
      return MT.Manager.ContentScript.Window.post_message(this.iframe, data);
    };

    BaseImporter.prototype.send_to_main_window = function(data) {
      return MT.Manager.ContentScript.Window.post_message(window, data);
    };

    BaseImporter.prototype.init_iframe_message_events = function() {
      return MT.Manager.ContentScript.Window.set_event_processor((function(_this) {
        return function(data, event) {
          return _this.process_iframe_events(data, event);
        };
      })(this));
    };

    BaseImporter.prototype.load_in_new_tab = function() {
      var message;
      message = {
        type: "new_tab_importer",
        "import": {
          url: this.url,
          data: this.import_data()
        }
      };
      chrome.runtime.sendMessage(message);
      return this.close();
    };

    BaseImporter.prototype.process_iframe_events = function(data, event) {
      var command, origin_trusted, trusted_origins;
      origin_trusted = false;
      trusted_origins = [];
      trusted_origins.push('https://localhost:3000');
      trusted_origins.push('http://localhost:5000');
      trusted_origins.push('https://mediatag.io');
      origin_trusted = trusted_origins.indexOf(event.origin) > -1;
      origin_trusted = true;
      if (!origin_trusted) {

      } else {
        if (data != null) {
          if ((command = data['command']) != null) {
            switch (command) {
              case MT.EVENTS.CONFIRM_IFRAME_LOADED:
                return this.handle_iframe_loaded_confirmation();
              case MT.EVENTS.RESIZE_IFRAME:
                if (this.resize_allowed) {
                  console.log("resize: " + data['height']);
                  return this.iframe.style.height = data['height'] + "px";
                }
                break;
              case "close":
                return this.close();
              case "new_tab":
                if (typeof chrome !== "undefined" && chrome !== null) {
                  return chrome.runtime.sendMessage({
                    'type': "new_tab",
                    'url': data['url']
                  });
                }
                break;
              default:
                return this.process_command(command, data);
            }
          }
        }
      }
    };

    BaseImporter.prototype.process_command = function(command, data) {
      return console.log("base importer process command needs to be overwritten in subclasses");
    };

    BaseImporter.prototype.send_import_data_to_iframe = function() {
      return this.send_to_iframe(this.import_data());
    };

    BaseImporter.prototype.close = function() {
      this.is_mounted = false;
      if (this.iframe_container != null) {
        this.iframe_container.remove();
        return this.iframe_container = null;
      }
    };

    BaseImporter.prototype.handle_iframe_loaded_confirmation = function() {
      if (this.loader_elements_container != null) {
        this.loader_elements_container.remove();
        return this.loader_elements_container = null;
      }
    };

    return BaseImporter;

  })();

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Base = BaseImporter;
  });

}).call(this);
(function() {
  var ImageImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ImageImporter = (function(superClass) {
    extend(ImageImporter, superClass);

    function ImageImporter(data1) {
      this.data = data1;
      ImageImporter.__super__.constructor.apply(this, arguments);
      this.src = this.data.src;
      this.origin = this.data.origin;
      this.title = this.data.title;
      this.url = MT.Url.wrap(MT.routes.extension_imports_image_path);
      this.find_image_attributes();
      this.get_datauri((function(_this) {
        return function(datauri) {
          _this.datauri = datauri;
          _this.init_iframe_message_events();
          _this.build_iframe_container_and_loader();
          return _this.build_iframe();
        };
      })(this));
    }

    ImageImporter.prototype.find_image_attributes = function() {
      var elements, truncated_src;
      this.image = this.find_image(this.src);
      if (this.image == null) {
        this.image = this.find_image(this.src.replace(window.location.href, ''));
      }
      if (this.image == null) {
        this.image = this.find_image(this.src.replace(window.location.origin, ''));
      }
      if (this.image == null) {
        elements = this.src.split('/');
        truncated_src = elements[elements.length - 1];
        this.image = this.find_image(truncated_src);
      }
      if (this.image != null) {
        this.image_title = this.image.getAttribute('title');
        return this.image_alt = this.image.getAttribute('alt');
      }
    };

    ImageImporter.prototype.find_image = function(truncated_src) {
      var expr, image;
      expr = "[src$='" + truncated_src + "']";
      return image = document.querySelectorAll(expr)[0];
    };

    ImageImporter.prototype.process_command = function(command, data) {
      switch (command) {
        case MT.EVENTS.REQUEST_IMPORT_DATA:
          return this.send_import_data_to_iframe();
      }
    };

    ImageImporter.prototype.import_data = function() {
      var data;
      return data = {
        'command': MT.EVENTS.IMPORT_DATA,
        'src': this.src,
        'origin': this.origin,
        'title': this.title,
        'datauri': this.datauri,
        'image_title': this.image_title,
        'image_alt': this.image_alt
      };
    };

    ImageImporter.prototype.get_datauri = function(callback) {
      var capturer;
      capturer = new MT.Extension.ContentScript.Capturer();
      return capturer.get_image_datauri_from_url(this.src, (function(_this) {
        return function(datauri_from_src) {
          if (_this.image == null) {
            return callback(datauri_from_src);
          } else {
            return capturer.screenshot_element(_this.image, function(datauri_from_screenshot) {
              var longest_datauri;
              if (datauri_from_src == null) {
                return callback(datauri_from_screenshot);
              } else if (datauri_from_screenshot == null) {
                return callback(null);
              } else {
                longest_datauri = datauri_from_src.length > datauri_from_screenshot.length ? datauri_from_src : datauri_from_screenshot;
                return callback(longest_datauri);
              }
            });
          }
        };
      })(this));
    };

    return ImageImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Image = ImageImporter;
  });

}).call(this);
(function() {
  var MediumImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  MediumImporter = (function(superClass) {
    extend(MediumImporter, superClass);

    function MediumImporter(data1) {
      this.data = data1;
      MediumImporter.__super__.constructor.apply(this, arguments);
      this.resize_allowed = true;
      this.service_name = this.data['service_name'];
      this.medium_url = this.data.tab.url;
      this.url = MT.Url.wrap(MT.routes.extension_imports_medium_path);
      this.init_iframe_message_events();
      this.build_iframe_container_and_loader();
      this.build_iframe();
    }

    MediumImporter.prototype.video_element = function() {
      return document.getElementsByTagName('video')[0];
    };

    MediumImporter.prototype.container_parent = function() {
      return this.container_parent_element != null ? this.container_parent_element : this.container_parent_element = this.create_container_parent_element();
    };

    MediumImporter.prototype.iframe_css_position = function() {
      return 'relative';
    };

    MediumImporter.prototype.iframe_css_width = function() {
      return this.video_element().offsetWidth;
    };

    MediumImporter.prototype.iframe_css_height = function() {
      return "100px";
    };

    MediumImporter.prototype.create_container_parent_element = function() {
      if (this.service_name === 'vimeo') {
        return this.create_vimeo_container_parent();
      } else if (this.service_name === 'youtube') {
        return this.create_youtube_container_parent();
      }
    };

    MediumImporter.prototype.create_vimeo_container_parent = function() {
      var el, sibbling;
      el = document.createElement('div');
      el.style.width = '100%';
      sibbling = document.getElementsByClassName('player_area-wrapper')[0];
      MT.DomHelper.insertAfter(el, sibbling);
      return el;
    };

    MediumImporter.prototype.create_youtube_container_parent = function() {
      var el, sibbling;
      el = document.createElement('div');
      el.style.width = '100%';
      sibbling = document.getElementById('player-container');
      MT.DomHelper.insertAfter(el, sibbling);
      return el;
    };

    MediumImporter.prototype.set_time = function(time) {
      if (time != null) {
        return this.video_element().currentTime = time;
      }
    };

    MediumImporter.prototype.get_time = function() {
      return this.video_element().currentTime;
    };

    MediumImporter.prototype.take_screenshot = function() {
      if (this.capturer == null) {
        this.capturer = new MT.Extension.ContentScript.Capturer();
      }
      return this.capturer.screenshot_element(this.video_element(), (function(_this) {
        return function(cropped_datauri) {
          return _this.send_to_iframe({
            'command': MT.EVENTS.SCREENSHOT_COMPLETED,
            'datauri': cropped_datauri
          });
        };
      })(this));
    };

    MediumImporter.prototype.process_command = function(command, data) {
      switch (command) {
        case MT.EVENTS.REQUEST_IMPORT_DATA:
          return this.send_import_data_to_iframe();
        case MT.EVENTS.CONFIRM_MEDIUM_LOADED:
          return this.monitor_time_update();
        case MT.EVENTS.MEDIUM_SET_TIME:
          return this.set_time(data['time']);
        case MT.EVENTS.SCREENSHOT_REQUESTED:
          return this.take_screenshot();
      }
    };

    MediumImporter.prototype.send_import_data_to_iframe = function() {
      return this.send_to_iframe({
        'command': MT.EVENTS.IMPORT_DATA,
        'url': this.medium_url
      });
    };

    MediumImporter.prototype.monitor_time_update = function() {
      var delta, time;
      if (this.is_mounted) {
        delta = 0.1;
        time = this.get_time();
        if ((this.time == null) || (Math.abs(this.time - time) >= delta)) {
          this.time = time;
          this.send_to_iframe({
            command: MT.EVENTS.MEDIUM_TIME_UPDATED,
            time: this.time
          });
        }
        return setTimeout(((function(_this) {
          return function() {
            return _this.monitor_time_update();
          };
        })(this)), 50);
      }
    };

    return MediumImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Medium = MediumImporter;
  });

}).call(this);
(function() {
  var MediumOrWebpageImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  MediumOrWebpageImporter = (function(superClass) {
    extend(MediumOrWebpageImporter, superClass);

    function MediumOrWebpageImporter(data1) {
      this.data = data1;
      MediumOrWebpageImporter.__super__.constructor.apply(this, arguments);
      this.url = this.data.tab.url;
      this.is_medium_page((function(_this) {
        return function(status, service_name) {
          if (status) {
            _this.data['service_name'] = service_name;
            return new MT.Extension.ContentScript.Importer.Medium(_this.data);
          } else {
            return new MT.Extension.ContentScript.Importer.Webpage(_this.data).prepare_html_and_build_iframe();
          }
        };
      })(this));
    }

    MediumOrWebpageImporter.prototype.is_medium_page = function(callback) {
      var request, response, service_finder, url;
      if (window.environment === 'development' && (this.url.indexOf('tests/extension_import_medium') > 0)) {
        return callback(true);
      } else {
        service_finder = new MT.ServiceFinder();
        if (response = service_finder.is_url_valid(this.url)) {
          return callback(response['valid'], response['name']);
        } else {
          url = MT.Url.wrap("/api/media/is_url_valid?url=" + this.url);
          request = new XMLHttpRequest();
          request.open("get", url, true);
          request.onload = (function(_this) {
            return function(event) {
              var data, service_name, status;
              data = JSON.parse(request.response);
              status = data['valid'];
              service_name = data['service'];
              return callback(data['valid'], service_name);
            };
          })(this);
          return request.send();
        }
      }
    };

    return MediumOrWebpageImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.MediumOrWebpage = MediumOrWebpageImporter;
  });

}).call(this);
(function() {
  var NewTabImporter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NewTabImporter = (function(superClass) {
    extend(NewTabImporter, superClass);

    function NewTabImporter() {
      NewTabImporter.__super__.constructor.apply(this, arguments);
    }

    NewTabImporter.prototype.send_import_data = function() {
      var message_options;
      message_options = {
        type: "request_import_data"
      };
      return chrome.runtime.sendMessage(message_options, (function(_this) {
        return function(data) {
          return _this.send_to_main_window(data);
        };
      })(this));
    };

    return NewTabImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.NewTab = NewTabImporter;
  });

}).call(this);
(function() {
  var WebpageImporter,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  WebpageImporter = (function(superClass) {
    extend(WebpageImporter, superClass);

    function WebpageImporter(data1) {
      this.data = data1;
      this.embed_assets = bind(this.embed_assets, this);
      WebpageImporter.__super__.constructor.apply(this, arguments);
      this.image_handler = new MT.Extension.ContentScript.Importer.Webpage.ImageHandler(this);
      this.elements_with_bg_image_handler = new MT.Extension.ContentScript.Importer.Webpage.ElementsWithBgImageHandler(this);
      this.stylesheet_handler = new MT.Extension.ContentScript.Importer.Webpage.StylesheetHandler(this);
      this.webpage_url = this.data.tab.url;
      this.webpage_title = this.data.tab.title;
      this.favicon_url = this.data.tab.favIconUrl;
      this.url = MT.Url.wrap(MT.routes.extension_imports_webpage_path);
    }

    WebpageImporter.prototype.debug = function(message) {};

    WebpageImporter.prototype.prepare_html = function(callback) {
      return this.screenshot_and_clone_html((function(_this) {
        return function() {
          return _this.embed_assets(function() {
            return callback(_this.export_data);
          });
        };
      })(this));
    };

    WebpageImporter.prototype.embed_assets = function(callback) {
      return this.image_handler.find_images_to_convert_to_datauri((function(_this) {
        return function() {
          return _this.elements_with_bg_image_handler.find_elements_to_convert_to_datauri(function() {
            _this.convert_links();
            _this.remove_script_tags();
            return _this.stylesheet_handler.embed_css(function() {
              var html_el;
              html_el = document.createElement('html');
              html_el.appendChild(_this.head);
              html_el.appendChild(_this.body);
              _this.html_content = html_el.outerHTML;
              _this.export_data = {
                html: _this.html_content,
                meta_data: _this.meta_data
              };
              _this.image_handler.clean();
              if (callback != null) {
                return callback();
              }
            });
          });
        };
      })(this));
    };

    WebpageImporter.prototype.screenshot_and_clone_html = function(callback) {
      return this.image_handler.get_visible_area_datauri((function(_this) {
        return function(datauri_visible_area) {
          var metatags;
          _this.datauri = datauri_visible_area;
          metatags = new MT.Extension.ContentScript.Importer.Webpage.Metatags();
          _this.meta_data = metatags.data();
          _this.clone_html();
          return callback.call();
        };
      })(this));
    };

    WebpageImporter.prototype.prepare_html_and_build_iframe = function() {
      return this.screenshot_and_clone_html((function(_this) {
        return function() {
          _this.init_iframe_message_events();
          _this.build_iframe_container_and_loader();
          return _this.build_iframe();
        };
      })(this));
    };

    WebpageImporter.prototype.pre_import_data = function() {
      var data;
      return data = {
        command: MT.EVENTS.PRE_IMPORT_DATA,
        webpage_url: this.webpage_url
      };
    };

    WebpageImporter.prototype.import_data = function() {
      var data;
      return data = {
        command: MT.EVENTS.IMPORT_DATA,
        webpage_url: this.webpage_url,
        title: this.webpage_title,
        favicon_url: this.favicon_url,
        html: this.html_content,
        meta_data: this.meta_data,
        thumbnail: {
          datauri: this.datauri,
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    };

    WebpageImporter.prototype.process_command = function(command, data) {
      if ((command = data['command']) != null) {
        switch (command) {
          case MT.EVENTS.REQUEST_PRE_IMPORT_DATA:
            return this.send_pre_import_data_to_iframe();
          case MT.EVENTS.PROCESS_USER_PREFERENCES:
            return this.handle_user_preferences(data);
        }
      }
    };

    WebpageImporter.prototype.request_user_preferences = function() {
      return MT.ContentScript.UserPreferencesController.send_request((function(_this) {
        return function(data) {
          return _this.handle_user_preferences(data);
        };
      })(this));
    };

    WebpageImporter.prototype.handle_user_preferences = function(data) {
      var preferences, webpages_archiving;
      console.log(data);
      preferences = data['preferences'];
      webpages_archiving = preferences['webpages_archiving'];
      console.log("preferences: webpages_archiving: " + webpages_archiving);
      if (!webpages_archiving) {
        return this.send_import_data_to_iframe();
      } else {
        return this.embed_assets((function(_this) {
          return function() {
            return _this.send_import_data_to_iframe();
          };
        })(this));
      }
    };

    WebpageImporter.prototype.send_pre_import_data_to_iframe = function() {
      return this.send_to_iframe(this.pre_import_data());
    };

    WebpageImporter.prototype.convert_links = function() {
      var links;
      links = document.body.getElementsByTagName('a');
      return _.each(links, (function(_this) {
        return function(link) {
          var href, new_href;
          if (link != null) {
            if ((href = link.href) != null) {
              if (href.length > 0 && href.slice(0, 4) !== 'http') {
                new_href = MT.Url.resolve_url(href);
                return link.href = new_href;
              }
            }
          }
        };
      })(this));
    };

    WebpageImporter.prototype.remove_script_tags = function() {
      var cmptr, el, list, script_tags_in_body, script_tags_in_head;
      this.debug("remove_script_tags");
      script_tags_in_head = document.head.getElementsByTagName('script');
      script_tags_in_body = document.body.getElementsByTagName('script');
      list = [];
      _.each(script_tags_in_head, (function(_this) {
        return function(script_tag) {
          return list.push(script_tag);
        };
      })(this));
      _.each(script_tags_in_body, (function(_this) {
        return function(script_tag) {
          return list.push(script_tag);
        };
      })(this));
      cmptr = 0;
      while ((el = list.pop())) {
        el.remove();
        cmptr += 1;
      }
      return this.debug("removed " + cmptr + " script tags");
    };

    WebpageImporter.prototype.clone_html = function() {
      this.image_handler.add_data_attributes();
      this.elements_with_bg_image_handler.add_data_attributes();
      this.body = document.body.cloneNode(true);
      this.head = document.head.cloneNode(true);
      this.image_handler.set_body(this.body);
      this.elements_with_bg_image_handler.set_body(this.body);
      return this.stylesheet_handler.set_head(this.head);
    };

    return WebpageImporter;

  })(MT.Extension.ContentScript.Importer.Base);

  namespace("MT.Extension.ContentScript.Importer", function(e) {
    return e.Webpage = WebpageImporter;
  });

}).call(this);
(function() {
  var Metatags;

  Metatags = (function() {
    function Metatags() {}

    Metatags.prototype.data = function() {
      return {
        keywords: this.metatag_value(this.keywords_metatag()),
        author: this.metatag_value(this.author_metatag()),
        image: this.metatag_content(this.image_metatag())
      };
    };

    Metatags.prototype.metatag_attribute_value = function(metatag, attr) {
      var ref;
      return metatag != null ? (ref = metatag.attributes[attr]) != null ? ref.value : void 0 : void 0;
    };

    Metatags.prototype.metatag_content = function(metatag) {
      return this.metatag_attribute_value(metatag, 'content');
    };

    Metatags.prototype.metatag_property = function(metatag) {
      return this.metatag_attribute_value(metatag, 'property');
    };

    Metatags.prototype.metatag_name = function(metatag) {
      return this.metatag_attribute_value(metatag, 'name');
    };

    Metatags.prototype.metatags = function() {
      return this._metatags != null ? this._metatags : this._metatags = document.getElementsByTagName('meta');
    };

    Metatags.prototype.metatag_value = function(metatag) {
      var content, elements;
      if ((content = this.metatag_content(metatag)) != null) {
        elements = content.split(',');
        return _.flatten(_.map(elements, function(element) {
          return element.split(' and ');
        }));
      }
    };

    Metatags.prototype.author_metatag = function() {
      return _.find(this.metatags(), (function(_this) {
        return function(metatag) {
          return _this.metatag_name(metatag) === "author";
        };
      })(this));
    };

    Metatags.prototype.keywords_metatag = function() {
      var metatag, names;
      names = ["news_keywords", "keywords"];
      metatag = null;
      _.each(names, (function(_this) {
        return function(name) {
          return metatag != null ? metatag : metatag = _.find(_this.metatags(), function(metatag) {
            return _this.metatag_name(metatag) === name;
          });
        };
      })(this));
      return metatag;
    };

    Metatags.prototype.image_metatag = function() {
      var metatag, properties;
      properties = ["og:image", "twitter:image"];
      metatag = null;
      _.each(properties, (function(_this) {
        return function(property) {
          return metatag != null ? metatag : metatag = _.find(_this.metatags(), function(metatag) {
            return _this.metatag_property(metatag) === property;
          });
        };
      })(this));
      return metatag;
    };

    return Metatags;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.Metatags = Metatags;
  });

}).call(this);
(function() {
  var ImageHandler,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ImageHandler = (function() {
    function ImageHandler(parent) {
      this.parent = parent;
      this.finalize_src = bind(this.finalize_src, this);
      this.images_without_datauri_by_src = {};
      this.capturer = new MT.Extension.ContentScript.Capturer();
    }

    ImageHandler.prototype.get_visible_area_datauri = function(callback) {
      return this.capturer.screenshot_visible_area((function(_this) {
        return function(datauri_visible_area) {
          return callback(datauri_visible_area);
        };
      })(this));
    };

    ImageHandler.prototype.set_body = function(body) {
      return this.body = body;
    };

    ImageHandler.prototype.find_images_to_convert_to_datauri = function(callback) {
      var all_images, images_found;
      this.debug("==== IMAGES");
      this.images_dimensions_by_data_attr = {};
      all_images = this.body.getElementsByTagName('img');
      this.remove_picture_source_tags();
      _.each(all_images, (function(_this) {
        return function(img) {
          return _this.prepare_image(img);
        };
      })(this));
      images_found = _.flatten(_.values(this.images_without_datauri_by_src));
      this.debug("found " + images_found.length + " images", images_found);
      this.images_datauri_size = 0;
      this.images_src_by_size = {};
      return this.convert_next_image_to_datauri(callback);
    };

    ImageHandler.prototype.prepare_image = function(img) {
      var bg_src, height, min_dim, original_image, src, style, width;
      original_image = this.original_image(img);
      if (original_image == null) {
        return;
      }
      width = Math.floor(original_image.offsetWidth);
      height = Math.floor(original_image.offsetHeight);
      min_dim = 0;
      if (width > min_dim && height > min_dim) {
        src = img.src;
        img.dataset['mediatagWidth'] = width;
        img.dataset['mediatagHeight'] = height;
        if ((src != null) && src.length > 0) {
          if (src.slice(0, 5) !== 'data:') {
            return this.add_image(src, img, width, height);
          } else {

          }
        } else {
          style = img.style;
          img.style.width = width + "px";
          img.style.height = height + "px";
          bg_src = style.backgroundImage;
          if ((bg_src != null) && bg_src.length > 0) {
            if (bg_src.slice(0, 3) === "url") {
              bg_src = bg_src.replace(/url\(|\)|'|"/g, "");
              return this.add_image(bg_src, img, width, height);
            } else {

            }
          }
        }
      } else {

      }
    };

    ImageHandler.prototype.add_image = function(src, img, width, height) {
      var base, data_id;
      if ((base = this.images_without_datauri_by_src)[src] == null) {
        base[src] = [];
      }
      this.images_without_datauri_by_src[src].push(img);
      img.dataset['mediatagOriginalUrl'] = MT.Url.resolve_url(src);
      data_id = this.image_data_id(img);
      return this.images_dimensions_by_data_attr[data_id] = [width, height];
    };

    ImageHandler.prototype.convert_next_image_to_datauri = function(callback) {
      var current_image_size, image_sizes, images, resolved_src, src, src_list;
      src_list = _.keys(this.images_without_datauri_by_src);
      src = src_list[0];
      if (src != null) {
        images = this.images_without_datauri_by_src[src];
        _.each(images, (function(_this) {
          return function(image) {
            return image.removeAttribute('srcset');
          };
        })(this));
        resolved_src = MT.Url.resolve_url(src);
        current_image_size = 0;
        console.log(resolved_src);
        return this.capturer.get_image_datauri_from_url(resolved_src, (function(_this) {
          return function(datauri) {
            if (datauri != null) {
              _this.debug("adding " + datauri.length + " to " + images.length + " images (total: " + (images.length * datauri.length) + ")");
              _.each(images, function(image) {
                image.src = datauri;
                _this.images_datauri_size += datauri.length;
                return current_image_size += datauri.length;
              });
              return _this.finalize_src(src, resolved_src, current_image_size, callback);
            } else {
              _.each(images, function(image) {
                return image.dataset['mediatagUrlToFetch'] = resolved_src;
              });
              return _this.finalize_src(src, resolved_src, current_image_size, callback);
            }
          };
        })(this));
      } else {
        image_sizes = _.sortBy(_.keys(this.images_src_by_size), function(k) {
          return -parseInt(k);
        });
        this.debug("=== DONE IMAGES");
        return callback();
      }
    };

    ImageHandler.prototype.finalize_src = function(src, resolved_src, current_image_size, callback) {
      var base;
      if ((base = this.images_src_by_size)[current_image_size] == null) {
        base[current_image_size] = [];
      }
      this.images_src_by_size[current_image_size].push(resolved_src);
      delete this.images_without_datauri_by_src[src];
      return this.convert_next_image_to_datauri(callback);
    };

    ImageHandler.prototype.remove_picture_source_tags = function() {
      var picture_tags;
      picture_tags = this.body.querySelectorAll('picture');
      return _.each(picture_tags, (function(_this) {
        return function(picture_tag) {
          var source_tags;
          source_tags = picture_tag.querySelectorAll('source');
          return _.each(source_tags, function(source_tag) {
            var current_srcset;
            current_srcset = source_tag.srcset;
            source_tag.dataset['mediatagSrcset'] = current_srcset;
            return source_tag.removeAttribute('srcset');
          });
        };
      })(this));
    };

    ImageHandler.prototype.debug = function(message) {
      return this.parent.debug(message);
    };

    ImageHandler.prototype.clean = function() {
      return this.capturer.clean();
    };

    ImageHandler.prototype.add_data_attributes = function() {
      var images;
      images = document.body.getElementsByTagName('img');
      return _.each(images, function(img, i) {
        return img.dataset['mediatagCopyImageId'] = i;
      });
    };

    ImageHandler.prototype.image_data_id = function(img) {
      var data_id;
      return data_id = img.dataset['mediatagCopyImageId'];
    };

    ImageHandler.prototype.original_image = function(img) {
      var copy_id, original_img, selector;
      copy_id = this.image_data_id(img);
      selector = "img[data-mediatag-copy-image-id='" + copy_id + "']";
      return original_img = document.body.querySelectorAll(selector)[0];
    };

    return ImageHandler;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.ImageHandler = ImageHandler;
  });

}).call(this);
(function() {
  var ElementsWithBgImageHandler,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ElementsWithBgImageHandler = (function() {
    function ElementsWithBgImageHandler(parent1) {
      this.parent = parent1;
      this.finalize_src = bind(this.finalize_src, this);
      this.elements_without_datauri_by_src = {};
      this.capturer = new MT.Extension.ContentScript.Capturer();
    }

    ElementsWithBgImageHandler.prototype.set_body = function(body) {
      return this.body = body;
    };

    ElementsWithBgImageHandler.prototype.find_elements_to_convert_to_datauri = function(callback) {
      var all_elements, elements_found;
      this.debug("==== ELEMENTS WITH BG IMAGES");
      this.elements_dimensions_by_data_attr = {};
      all_elements = this.tagged_elements();
      _.each(all_elements, (function(_this) {
        return function(element) {
          return _this.prepare_element(element);
        };
      })(this));
      elements_found = _.flatten(_.values(this.elements_without_datauri_by_src));
      this.debug("found " + elements_found.length + " elements with bg image", elements_found);
      this.elements_datauri_size = 0;
      this.elements_src_by_size = {};
      return this.convert_next_element_to_datauri(callback);
    };

    ElementsWithBgImageHandler.prototype.prepare_element = function(element) {
      var bg_src, height, min_dim, original_element, style, width;
      original_element = this.original_element(element);
      width = Math.floor(original_element.offsetWidth);
      height = Math.floor(original_element.offsetHeight);
      min_dim = 0;
      if (width > 0 && height > 0) {
        element.dataset['mediatagWidth'] = width;
        element.dataset['mediatagHeight'] = height;
        style = element.style;
        element.style.width = width + "px";
        element.style.height = height + "px";
        bg_src = style.backgroundImage;
        if (bg_src.slice(0, 3) === "url") {
          bg_src = bg_src.replace(/url\(|\)|'|"/g, "");
          return this.add_element(bg_src, element, width, height);
        } else {

        }
      } else {
        return this.debug("element not visible or less than " + min_dim + ", skipped");
      }
    };

    ElementsWithBgImageHandler.prototype.add_element = function(src, element, width, height) {
      var base, data_id;
      if ((base = this.elements_without_datauri_by_src)[src] == null) {
        base[src] = [];
      }
      this.elements_without_datauri_by_src[src].push(element);
      element.dataset['mediatagOriginalBgUrl'] = MT.Url.resolve_url(src);
      data_id = this.element_data_id(element);
      return this.elements_dimensions_by_data_attr[data_id] = [width, height];
    };

    ElementsWithBgImageHandler.prototype.convert_next_element_to_datauri = function(callback) {
      var current_element_size, elements, image_sizes, resolved_src, src, src_list;
      src_list = _.keys(this.elements_without_datauri_by_src);
      src = src_list[0];
      if (src != null) {
        elements = this.elements_without_datauri_by_src[src];
        resolved_src = MT.Url.resolve_url(src);
        this.debug(resolved_src);
        current_element_size = 0;
        return this.capturer.get_image_datauri_from_url(resolved_src, (function(_this) {
          return function(datauri) {
            if (datauri != null) {
              datauri = datauri.replace(/[\n\r]+/g, '');
              datauri = datauri.replace(/\s{2,10}/g, ' ');
              _this.debug("adding " + datauri.length + " to " + elements.length + " images (total: " + (elements.length * datauri.length) + ")");
              _.each(elements, function(element) {
                var wrapped_datauri;
                wrapped_datauri = "url('" + datauri + "')";
                element.style.backgroundImage = wrapped_datauri;
                _this.elements_datauri_size += datauri.length;
                current_element_size += datauri.length;
                return _this.debug(_this.elements_datauri_size);
              });
              return _this.finalize_src(src, resolved_src, current_element_size, callback);
            } else {
              _.each(elements, function(element) {
                return element.dataset['mediatagBgUrlToFetch'] = resolved_src;
              });
              return _this.finalize_src(src, resolved_src, current_element_size, callback);
            }
          };
        })(this));
      } else {
        image_sizes = _.sortBy(_.keys(this.elements_src_by_size), function(k) {
          return -parseInt(k);
        });
        _.each(image_sizes, (function(_this) {
          return function(size) {
            _this.debug(size);
            return _this.debug(size + " - " + _this.elements_src_by_size[size]);
          };
        })(this));
        this.debug("=== DONE IMAGES");
        return callback();
      }
    };

    ElementsWithBgImageHandler.prototype.finalize_src = function(src, resolved_src, current_element_size, callback) {
      var base;
      if ((base = this.elements_src_by_size)[current_element_size] == null) {
        base[current_element_size] = [];
      }
      this.elements_src_by_size[current_element_size].push(resolved_src);
      delete this.elements_without_datauri_by_src[src];
      return this.convert_next_element_to_datauri(callback);
    };

    ElementsWithBgImageHandler.prototype.debug = function(message) {
      return this.parent.debug(message);
    };

    ElementsWithBgImageHandler.prototype.clean = function() {
      return this.capturer.clean();
    };

    ElementsWithBgImageHandler.prototype.elements_with_background_element = function(parent) {
      var elements;
      elements = parent.querySelectorAll("*:not(img)");
      return _.filter(elements, function(e) {
        var bg, bg_val;
        bg_val = window.getComputedStyle ? bg = document.defaultView.getComputedStyle(e, null).getPropertyValue('background-image') : this.currentStyle.backgroundImage;
        return bg_val !== "none";
      });
    };

    ElementsWithBgImageHandler.prototype.add_data_attributes = function() {
      var elements;
      elements = this.elements_with_background_element(document.body);
      return _.each(elements, function(element, i) {
        return element.dataset['mediatagCopyElementWithBgImageId'] = i;
      });
    };

    ElementsWithBgImageHandler.prototype.element_data_id = function(element) {
      var data_id;
      return data_id = element.dataset['mediatagCopyElementWithBgImageId'];
    };

    ElementsWithBgImageHandler.prototype.tagged_elements = function() {
      return this.body.querySelectorAll("[data-mediatag-copy-element-with-bg-image-id]");
    };

    ElementsWithBgImageHandler.prototype.original_element = function(element) {
      var copy_id, original_element, selector;
      copy_id = this.element_data_id(element);
      selector = "[data-mediatag-copy-element-with-bg-image-id='" + copy_id + "']";
      return original_element = document.body.querySelectorAll(selector)[0];
    };

    return ElementsWithBgImageHandler;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.ElementsWithBgImageHandler = ElementsWithBgImageHandler;
  });

}).call(this);
(function() {
  var StylesheetHandler;

  StylesheetHandler = (function() {
    function StylesheetHandler(parent) {
      this.parent = parent;
      this.stylesheet_urls = [];
      this.capturer = new MT.Extension.ContentScript.Capturer();
    }

    StylesheetHandler.prototype.set_head = function(head) {
      return this.head = head;
    };

    StylesheetHandler.prototype.embed_css = function(callback) {
      var body_stylesheets, head_stylesheets, stylesheets, stylesheets_selector;
      this.debug("embed_css START");
      stylesheets_selector = 'link[rel=stylesheet]';
      head_stylesheets = document.head.querySelectorAll(stylesheets_selector);
      body_stylesheets = document.body.querySelectorAll(stylesheets_selector);
      stylesheets = [];
      _.each(head_stylesheets, (function(_this) {
        return function(head_stylesheet) {
          if (head_stylesheet != null) {
            return stylesheets.push(head_stylesheet);
          }
        };
      })(this));
      _.each(body_stylesheets, (function(_this) {
        return function(body_stylesheet) {
          if (body_stylesheet != null) {
            return stylesheets.push(body_stylesheet);
          }
        };
      })(this));
      this.embedded_stylesheet_size_by_urls = {};
      _.each(stylesheets, (function(_this) {
        return function(stylesheet) {
          var url;
          if (stylesheet != null) {
            url = stylesheet.href;
            if (url != null) {
              if (!_.includes(_this.stylesheet_urls, url)) {
                return _this.stylesheet_urls.push(url);
              }
            }
          }
        };
      })(this));
      this.debug("found " + this.stylesheet_urls.length + " main stylesheets");
      this.debug(this.stylesheet_urls);
      return this.embed_next_stylesheet(callback);
    };

    StylesheetHandler.prototype.is_stylesheet_url_valid = function(stylesheet_url) {
      return (stylesheet_url != null) && stylesheet_url.length > 1;
    };

    StylesheetHandler.prototype.embed_next_stylesheet = function(callback) {
      var request, stylesheet_url, urls_sorted_by_size;
      stylesheet_url = this.stylesheet_urls.shift();
      if (stylesheet_url != null) {
        if (this.is_stylesheet_url_valid(stylesheet_url)) {
          stylesheet_url = MT.Url.resolve_url(stylesheet_url);
          request = new XMLHttpRequest();
          request.open('GET', stylesheet_url, true);
          request.onload = (function(_this) {
            return function(event) {
              var response;
              if ((response = request.response) != null) {
                _this.embedded_stylesheet_size_by_urls[stylesheet_url] = response.length;
                _this.process_stylesheet_content(response, stylesheet_url);
              }
              return _this.embed_next_stylesheet(callback);
            };
          })(this);
          request.onerror = (function(_this) {
            return function(error) {
              return _this.capturer.get_stylesheet_content_from_url(stylesheet_url, function(response) {
                var style;
                if (response != null) {
                  _this.embedded_stylesheet_size_by_urls[stylesheet_url] = response.length;
                  _this.process_stylesheet_content(response, stylesheet_url);
                } else {
                  style = document.createElement('style');
                  style.dataset['mediatagUrlToFetch'] = stylesheet_url;
                  _this.head.appendChild(style);
                }
                return _this.embed_next_stylesheet(callback);
              });
            };
          })(this);
          return request.send();
        } else {
          console.log("'" + stylesheet_url + "' NOT VALID");
          return this.embed_next_stylesheet(callback);
        }
      } else {
        this.debug("stylesheet embed DONE");
        urls_sorted_by_size = _.sortBy(_.keys(this.embedded_stylesheet_size_by_urls), (function(_this) {
          return function(url) {
            return _this.embedded_stylesheet_size_by_urls[url];
          };
        })(this));
        _.each(urls_sorted_by_size, (function(_this) {
          return function(url) {
            var size;
            size = _this.embedded_stylesheet_size_by_urls[url];
            return _this.debug(url + " (" + size + ")");
          };
        })(this));
        return callback();
      }
    };

    StylesheetHandler.prototype.process_stylesheet_content = function(stylesheet_content, stylesheet_url) {
      var elements, style;
      elements = stylesheet_content.split(';');
      _.each(elements, (function(_this) {
        return function(element) {
          if (element.indexOf('@import') >= 0) {
            return _this.process_css_import(element);
          }
        };
      })(this));
      style = document.createElement('style');
      style.dataset['mediatagStylesheetContent'] = stylesheet_content;
      return this.head.appendChild(style);
    };

    StylesheetHandler.prototype.process_css_import = function(css_import) {
      var regexp, result, url;
      regexp = new RegExp('.*"(.*)".*');
      result = regexp.exec(css_import);
      if (result != null) {
        url = result[1];
        if (url != null) {
          if (!_.includes(this.stylesheet_urls, url)) {
            return this.stylesheet_urls.push(url);
          }
        }
      }
    };

    StylesheetHandler.prototype.debug = function(message) {
      return this.parent.debug(message);
    };

    return StylesheetHandler;

  })();

  namespace("MT.Extension.ContentScript.Importer.Webpage", function(e) {
    return e.StylesheetHandler = StylesheetHandler;
  });

}).call(this);
(function() {
  var DomController;

  DomController = (function() {
    function DomController(link_class_with_added_tags, link_class_with_considered_url, tag_class, tag_container_class) {
      this.link_class_with_added_tags = link_class_with_added_tags;
      this.link_class_with_considered_url = link_class_with_considered_url;
      this.tag_class = tag_class;
      this.tag_container_class = tag_container_class;
      this.links_by_url = {};
      this.tags_by_urls = {};
      this.processed_state_by_url = {};
      this.find_urls(document.body);
    }

    DomController.prototype.found_urls = function() {
      return _.keys(this.links_by_url);
    };

    DomController.prototype.find_urls = function(parent) {
      var links;
      if (parent.querySelectorAll == null) {
        return;
      }
      links = parent.querySelectorAll('a[href]');
      return _.each(links, (function(_this) {
        return function(link) {
          return _this.add_link_url(link);
        };
      })(this));
    };

    DomController.prototype.set_urls_processed = function(urls) {
      return _.each(urls, (function(_this) {
        return function(url) {
          return _this.processed_state_by_url[url] = true;
        };
      })(this));
    };

    DomController.prototype.unprocessed_urls = function() {
      var urls;
      urls = [];
      return _.select(_.keys(this.processed_state_by_url), (function(_this) {
        return function(url) {
          return _this.processed_state_by_url[url] !== true;
        };
      })(this));
    };

    DomController.prototype.add_link_url = function(link) {
      var base, url;
      if (link.href == null) {
        return;
      }
      if (link.href.length === 0) {
        return;
      }
      if (_.include(link.classList, this.link_class_with_considered_url)) {
        return;
      }
      if (link.querySelectorAll('img').length > 0) {
        return;
      }
      link.classList.add(this.link_class_with_considered_url);
      url = link.href;
      url = MT.Url.resolve_url(url);
      if (this.processed_state_by_url[url] == null) {
        this.processed_state_by_url[url] = false;
        if ((base = this.links_by_url)[url] == null) {
          base[url] = [];
        }
        return this.links_by_url[url].push(link);
      }
    };

    DomController.prototype.add_tags = function(tags_by_url) {
      return _.each(_.keys(tags_by_url), (function(_this) {
        return function(url) {
          var tags;
          tags = tags_by_url[url];
          return _this.add_tags_for_url(url, tags);
        };
      })(this));
    };

    DomController.prototype.add_tags_for_url = function(url, tags) {
      var first_link, links, tag_container, tag_names;
      if (tags == null) {
        return;
      }
      if (tags.length === 0) {
        return;
      }
      tag_names = _.map(tags, function(tag) {
        return tag.name;
      });
      if (tag_names.length === 0) {
        return;
      }
      links = this.links_by_url[url];
      if (links == null) {
        return;
      }
      first_link = null;
      _.each(links, (function(_this) {
        return function(link) {
          if (!MT.DomHelper.hasClass(link, _this.link_class_with_added_tags)) {
            link.classList.add(_this.link_class_with_added_tags);
            return first_link != null ? first_link : first_link = link;
          }
        };
      })(this));
      if (first_link != null) {
        tag_container = this.create_tag_container();
        MT.DomHelper.insertAfter(tag_container, first_link);
        return _.each(tag_names, (function(_this) {
          return function(tag_name) {
            return tag_container.append(_this.create_tag(tag_name));
          };
        })(this));
      }
    };

    DomController.prototype.create_tag_container = function() {
      var tag_container;
      tag_container = document.createElement('span');
      tag_container.classList.add(this.tag_container_class);
      return tag_container;
    };

    DomController.prototype.create_tag = function(name) {
      var tag;
      tag = document.createElement('a');
      tag.classList.add(this.tag_class);
      tag.style.display = 'inline-block inline-flex';
      tag.style.padding = '2px 5px';
      tag.style.marginLeft = '3px';
      tag.style.borderRadius = '3px';
      tag.style.backgroundColor = Color.hsl_from_name(name);
      tag.style.color = '#111';
      tag.textContent = name;
      tag.href = MT.Url.tag_url(name);
      return tag;
    };

    return DomController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.DomController = DomController;
  });

}).call(this);
(function() {
  var EventsController;

  EventsController = (function() {
    function EventsController(classes_to_ignore, callback) {
      this.classes_to_ignore = classes_to_ignore;
      this.callback = callback;
      this.pending_nodes = [];
      this.dirty = false;
      this.set_mutation_events();
    }

    EventsController.prototype.is_dirty = function() {
      return this.dirty;
    };

    EventsController.prototype.get_pending_nodes = function() {
      return _.flatten(this.pending_nodes);
    };

    EventsController.prototype.clean_pending_nodes = function() {
      this.pending_nodes = [];
      return this.dirty = false;
    };

    EventsController.prototype.set_mutation_events = function() {
      var observer;
      if (typeof MutationObserver !== "undefined" && MutationObserver !== null) {
        observer = new MutationObserver((function(_this) {
          return function(mutations) {
            var added_nodes;
            added_nodes = _.uniq(_.flatten(_.map(mutations, function(mutation) {
              return Array.prototype.slice.call(mutation.addedNodes);
            })));
            if (added_nodes.length > 0) {
              added_nodes = _this.filter_added_nodes(added_nodes);
              if (added_nodes.length > 0) {
                _.each(added_nodes, function(added_node) {
                  return _this.pending_nodes.push(added_node);
                });
                _this.dirty = true;
                return _this.callback();
              }
            }
          };
        })(this));
        return observer.observe(document.body, {
          subtree: true,
          childList: true
        });
      } else {
        return console.log("MutationObserver not defined");
      }
    };

    EventsController.prototype.filter_added_nodes = function(added_nodes) {
      return _.filter(added_nodes, (function(_this) {
        return function(added_node) {
          var is_a_tag_added_by_content_script;
          is_a_tag_added_by_content_script = false;
          _.each(_this.classes_to_ignore, function(class_to_ignore) {
            if (MT.DomHelper.hasClass(added_node, class_to_ignore)) {
              return is_a_tag_added_by_content_script = true;
            }
          });
          return !is_a_tag_added_by_content_script;
        };
      })(this));
    };

    return EventsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.EventsController = EventsController;
  });

}).call(this);
(function() {
  var RequestsController;

  RequestsController = (function() {
    function RequestsController() {}

    RequestsController.prototype.contructor = function() {
      return this.request_in_progress = false;
    };

    RequestsController.prototype.in_progress = function() {
      return this.request_in_progress === true;
    };

    RequestsController.prototype.get_available_hosts = function(unfetched_hosts, callback) {
      var data, request, url;
      unfetched_hosts = unfetched_hosts.sort();
      if (unfetched_hosts.length > 0) {
        url = MT.Url.wrap('/api/webpages/tags/hosts');
        this.request_in_progress = true;
        request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = (function(_this) {
          return function(event) {
            var available_hosts, data, response;
            if ((response = request.response) != null) {
              data = JSON.parse(response);
              console.log(data);
              _this.request_in_progress = false;
              available_hosts = data;
              return callback(available_hosts);
            } else {
              return console.log("get_available_hosts returned no content");
            }
          };
        })(this);
        request.onerror = (function(_this) {
          return function(error) {
            _this.request_in_progress = false;
            console.log("error while querying hosts");
            return console.log(error);
          };
        })(this);
        data = {
          origin: this.origin(),
          hosts: unfetched_hosts
        };
        console.log("get_available_hosts");
        return request.send(JSON.stringify(data));
      } else {
        return callback([]);
      }
    };

    RequestsController.prototype.get_urls_tags = function(urls, callback) {
      var data, request, url;
      url = MT.Url.wrap('/api/webpages/tags/tags');
      if (urls.length > 0) {
        this.request_in_progress = true;
        request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = (function(_this) {
          return function(event) {
            var data, response, tags_by_url;
            if ((response = request.response) != null) {
              data = JSON.parse(response);
              console.log(data);
              tags_by_url = data;
              _this.request_in_progress = false;
              return callback(tags_by_url);
            } else {
              return console.log("get_urls_tags returned no content");
            }
          };
        })(this);
        request.onerror = (function(_this) {
          return function(error) {
            _this.request_in_progress = false;
            console.log("error while querying tags");
            return console.log(error);
          };
        })(this);
        data = {
          origin: this.origin(),
          urls: urls
        };
        console.log("get_urls_tags");
        return request.send(JSON.stringify(data));
      } else {
        return callback();
      }
    };

    RequestsController.prototype.query_user_preferences = function(callback) {
      return MT.ContentScript.UserPreferencesController.send_request((function(_this) {
        return function(data) {
          if (data['tags_display'] === true) {
            return callback();
          } else {
            console.log("tags display not allowed");
            return console.log(data);
          }
        };
      })(this));
    };

    RequestsController.prototype.origin = function() {
      return window.location.href;
    };

    return RequestsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.RequestsController = RequestsController;
  });

}).call(this);
(function() {
  var UrlsController;

  UrlsController = (function() {
    function UrlsController() {
      this.availabilities_by_host = {};
      this.tags_by_urls = {};
      this.urls_by_host = {};
      this.hosts_by_url = {};
    }

    UrlsController.prototype.add_urls = function(urls) {
      return _.each(urls, (function(_this) {
        return function(url) {
          var base, host;
          if (_this.hosts_by_url[url] == null) {
            host = MT.Url.get_host(url);
            _this.hosts_by_url[url] = host;
            if ((base = _this.urls_by_host)[host] == null) {
              base[host] = [];
            }
            return _this.urls_by_host[host].push(url);
          }
        };
      })(this));
    };

    UrlsController.prototype.add_tags_for_url = function(url, tags) {
      return this.tags_by_urls[url] = tags;
    };

    UrlsController.prototype.get_tags_by_url = function() {
      return this.tags_by_urls;
    };

    UrlsController.prototype.unfetched_urls = function(urls) {
      if (urls.length === 0) {
        return;
      }
      urls = _.filter(urls, (function(_this) {
        return function(url) {
          return _this.tags_by_urls[url] == null;
        };
      })(this));
      if (urls.length === 0) {
        return;
      }
      return urls = _.uniq(urls.sort());
    };

    UrlsController.prototype.unfetched_and_available_urls = function() {
      var hosts, list;
      list = [];
      hosts = _.keys(this.urls_by_host);
      _.each(hosts, (function(_this) {
        return function(host) {
          var host_urls;
          host_urls = _this.urls_by_host[host];
          if (_this.is_host_unfetched(host)) {
            return list.push(host_urls);
          } else {
            if (_this.is_host_available(host)) {
              return _.each(host_urls, function(url) {
                if (_this.is_url_unfetched(url)) {
                  return list.push(url);
                }
              });
            }
          }
        };
      })(this));
      return list;
    };

    UrlsController.prototype.unfetched_hosts = function() {
      var hosts;
      hosts = _.keys(this.urls_by_host);
      return _.filter(hosts, (function(_this) {
        return function(host) {
          return _this.is_host_unfetched(host);
        };
      })(this));
    };

    UrlsController.prototype.set_hosts_availability = function(host, available) {
      return this.availabilities_by_host[host] = available;
    };

    UrlsController.prototype.is_host_unfetched = function(host) {
      return this.availabilities_by_host[host] == null;
    };

    UrlsController.prototype.is_host_available = function(host) {
      return this.availabilities_by_host[host] === true;
    };

    UrlsController.prototype.is_url_unfetched = function(url) {
      return this.tags_by_urls[url] == null;
    };

    UrlsController.prototype.is_url_host_available = function(url) {
      var host;
      host = this.hosts_by_url[url] || MT.Url.get_host(url);
      return this.is_host_available(host);
    };

    return UrlsController;

  })();

  namespace("MT.Manager.ContentScript.Tags", function(e) {
    return e.UrlsController = UrlsController;
  });

}).call(this);
(function() {
  var Displayer;

  Displayer = (function() {
    function Displayer() {
      var classes_to_ignore, link_class_with_added_tags, link_class_with_considered_url, tag_class, tag_container_class;
      link_class_with_added_tags = 'mediatag_tag_link_with_added_tags';
      link_class_with_considered_url = 'mediatag_tag_link_from_content_script';
      tag_class = 'mediatag_tag_class';
      tag_container_class = 'mediatag_tag_container_class';
      this.display_tags_user_allowed = false;
      this.requests_controller = new MT.Manager.ContentScript.Tags.RequestsController();
      this.dom_controller = new MT.Manager.ContentScript.Tags.DomController(link_class_with_added_tags, link_class_with_considered_url, tag_class, tag_container_class);
      this.urls_controller = new MT.Manager.ContentScript.Tags.UrlsController();
      classes_to_ignore = [tag_container_class, tag_class];
      this.events_controller = new MT.Manager.ContentScript.Tags.EventsController(classes_to_ignore, (function(_this) {
        return function() {
          return _this.check_pending_nodes();
        };
      })(this));
      this.init();
    }

    Displayer.prototype.init = function() {
      this.tags_by_urls = {};
      this.availabilities_by_host = {};
      return this.requests_controller.query_user_preferences((function(_this) {
        return function() {
          _this.display_tags_user_allowed = true;
          return _this.perform();
        };
      })(this));
    };

    Displayer.prototype.perform = function() {
      if (this.display_tags_user_allowed === false) {
        return;
      }
      return this.query_hosts();
    };

    Displayer.prototype.query_hosts = function() {
      var unfetched_hosts, urls;
      urls = this.dom_controller.unprocessed_urls();
      this.dom_controller.set_urls_processed(urls);
      this.urls_controller.add_urls(urls);
      unfetched_hosts = this.urls_controller.unfetched_hosts();
      if (unfetched_hosts.length > 0) {
        return this.requests_controller.get_available_hosts(unfetched_hosts, (function(_this) {
          return function(available_hosts) {
            _this.process_available_hosts(unfetched_hosts, available_hosts);
            return _this.query_tags();
          };
        })(this));
      } else {
        return this.query_tags();
      }
    };

    Displayer.prototype.query_tags = function() {
      var unfetched_urls;
      unfetched_urls = this.urls_controller.unfetched_and_available_urls();
      return this.requests_controller.get_urls_tags(unfetched_urls, (function(_this) {
        return function(tags_by_url) {
          _.each(_.keys(tags_by_url), function(url) {
            var tags;
            tags = tags_by_url[url];
            return _this.urls_controller.add_tags_for_url(url, tags);
          });
          _this.dom_controller.add_tags(_this.urls_controller.get_tags_by_url());
          return _this.check_pending_nodes();
        };
      })(this));
    };

    Displayer.prototype.process_available_hosts = function(unfetched_hosts, available_hosts) {
      return _.each(unfetched_hosts, (function(_this) {
        return function(host) {
          var available;
          available = _.includes(available_hosts, host);
          return _this.urls_controller.set_hosts_availability(host, available);
        };
      })(this));
    };

    Displayer.prototype.check_pending_nodes = function() {
      var pending_nodes;
      if (this.display_tags_user_allowed === false) {
        return;
      }
      if (this.requests_controller.in_progress()) {
        return;
      }
      pending_nodes = this.events_controller.get_pending_nodes();
      if (pending_nodes.length > 0) {
        this.events_controller.clean_pending_nodes();
        _.each(pending_nodes, (function(_this) {
          return function(pending_node) {
            return _this.dom_controller.find_urls(pending_node);
          };
        })(this));
        if (this.dom_controller.unprocessed_urls().length > 0) {
          return this.query_hosts();
        }
      }
    };

    return Displayer;

  })();

  console.log("window.tags_display_allowed: " + window.tags_display_allowed);

  if (window.tags_display_allowed === true) {
    MT.DocumentReady.on(function() {
      return window.tags_displayer != null ? window.tags_displayer : window.tags_displayer = new Displayer();
    });
  }

}).call(this);















































