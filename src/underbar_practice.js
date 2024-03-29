/*jshint eqnull:true, expr:true*/

var _ = { };

(function() {

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return arguments[0];
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    return n === undefined ? array[array.length-1] : array.slice(Math.max(0,array.length - n))
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else if (!(collection.length)) {
      for (var each in collection) {
        iterator(collection[each], each, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var filtered = [];

    _.each(collection, function (item) {
      if (test(item)){
        filtered.push(item);
      }
    });

    return filtered;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    var rejected = _.filter(collection, function (item) {
      return !test(item);
    });

    return rejected;
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var unique = [];

    _.each(array, function (element) {
      if (!(_.contains(unique, element))) {
        unique.push(element);
      }
    });

    return unique;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(array, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var mapped = [];

    _.each(array, function (element) {
      mapped.push(iterator(element));
    });

    return mapped;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(array, propertyName) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(array, function(value){
      return value[propertyName];
    });
  };

  // Calls the method named by methodName on each value in the list.
  // Note: you will nead to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
    var invoked = [];

    if (typeof(functionOrKey) == 'function') {
      invoked = _.map(collection, function(element) {
        return functionOrKey.apply(element, args);
      });
    } else {
      invoked = _.map(collection, function(element) {
        return element[functionOrKey](args);
      });
    }
    return invoked;
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  //
  // You can pass in an initialValue that is passed to the first iterator
  // call. If initialValue is not explicitly passed in, it should default to the
  // first element in the collection.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  _.reduce = function(collection, iterator, accumulator) {
    var total;

    if (arguments.length >= 3){
      total = accumulator;
      _.each(collection, function (item, index, array) {
      total = iterator(total, item);
      });
    } else {
      total = collection[0];
      _.each(collection.slice(1), function (item, index, array) {
      total = iterator(total, item);
      });
    }

    return total;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    var test = iterator

    if (arguments.length < 2){
      test = _.identity
    }

    return _.reduce(collection, function (allMatch, item) {
      if (allMatch && (test(item))) {
        return true;
      }
      return false;
    }, true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    var trueTest = iterator;

    if (arguments.length < 2){
      trueTest = _.identity
    }

    return !(_.every(collection, function (item) {
      return !trueTest(item);
    }));
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    var finalObj = obj;

    // it appears _.each does not work with arguments "array"  - fix later?
    var argList = Array.prototype.slice.call(arguments);

    _.each(argList, function (objArg) {
      _.each(objArg, function (property, propertyName) {
        finalObj[propertyName] = property;
      });
    });

    return finalObj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    var finalObj = obj;

    var argList = Array.prototype.slice.call(arguments);

    _.each(argList, function (objArg) {
      _.each(objArg, function (property, propertyName) {
        if (!(propertyName in finalObj)){
          finalObj[propertyName] = property;
        }
      });
    });

    return finalObj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // _.memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var argsAndResults = {};

    return function (arg) {
      if (!(arg in argsAndResults)) {
        argsAndResults[arg] = func(arg);
      }
      return argsAndResults[arg];
    }
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var allArgs = Array.prototype.slice.call(arguments);
    var funcArgs = allArgs.slice(2);

    setTimeout(function () {
      func.apply(this, funcArgs);
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    var shufArr = [];
    var shufObj = {};

    _.each(array, function(item) {
      shufObj[item] = Math.random();
    });

    _.each(shufObj, function(propVal, prop) {
      var placed = false;

      _.each(shufArr, function(item, index) {
        if (!placed && propVal < shufObj[item]) {
          shufArr.splice(index, 0, prop);
          placed = true;
        }
      });

      if (!placed) {
        shufArr.push(prop);
      }
    });

    return shufArr;
  };


  /**
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */


  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    var shufArr = [];
    var interArr1 = [];
    var interArr2 = [];

    _.each(collection, function(item, index) {
      if (typeof(iterator) === 'function'){
        interArr1.push([item, iterator(item)]);
      }
      else {
        interArr1.push([item, item[iterator]]);
      }
    });

    _.each(interArr1, function(interItem, interIndex) {
      var placed = false;

      _.each(interArr2, function(item, index) {
        if (!placed && ((interItem[1] < item[1]) || !(item[1]))) {
          if (interItem[1]) {
            interArr2.splice(index, 0, interItem);
          } else {
            interArr2.push(interItem);
          }
          placed = true;
        }
      });

      if (!placed) {
        interArr2.push(interItem);
      }
    });

      _.each(interArr2, function (item) {
        shufArr.push(item[0]);
      })

    return shufArr;
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var argList = Array.prototype.slice.call(arguments);
    var maxLength = 0;

    _.each(argList, function (arr) {
      if (arr.length > maxLength) {
        maxLength = arr.length;
      }
    });

    var zipList = [];
    for (var x = 0; x < maxLength; x++) {
      zipList[x] = [];
      for (var y = 0; y < argList.length; y++) {
        zipList[x].push(undefined);
      }
    }

    _.each(argList, function (arr, index, list) {
      for (var i = 0; i < arr.length; i++){
        zipList[i][index] = arr[i];
      }
    });

    return zipList;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var flatArr = result ? result : [];

    _.each(nestedArray,  function (element) {
      if (Array.isArray(element)) {
        flatArr = _.flatten(element, flatArr);
      } else {
        flatArr.push(element);
      }
    });

    return flatArr;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var argList = Array.prototype.slice.call(arguments);
    var intersect = [];
    var firstArr = argList[0];

    _.each(firstArr, function (element) {
      var validElement = true;

      // "break;" doesn't seem to work in an each function, so I wrote out for loop
      for (var i = 1; i < argList.length; i++) {
        if (!(_.contains(argList[i], element))) {
          validElement = false;
          break;
        }
      }

      if (validElement) {
        intersect.push(element);
      }
    });

    return intersect;
  };



  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var argList = Array.prototype.slice.call(arguments);
    var diff = [];
    var firstArr = argList[0];

    _.each(firstArr, function (element) {
      var validElement = true;

      // "break;" doesn't seem to work in an each function, so I wrote out for loop
      for (var i = 1; i < argList.length; i++) {
        if ((_.contains(argList[i], element))) {
          validElement = false;
          break;
        }
      }

      if (validElement) {
        diff.push(element);
      }
    });

    return diff;
  };

  /**
   * MEGA EXTRA CREDIT
   * =================
   */

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See the Underbar readme for details.
  _.throttle = function(func, wait) {
    var nextScheduled = false;
    var result;
    var firstCalled = 0;

    return function() {
      if (firstCalled === 0) {
        firstCalled = Date.now();
        result = func.apply(this, arguments);
      } else if (!nextScheduled) {
        var thisCall = Date.now();
        var timeDifBetCalls = thisCall - firstCalled;

        if (timeDifBetCalls > wait) {
          firstCalled = thisCall;
          result = func.apply(this, arguments);
        } else {
          nextScheduled = true;
          setTimeout(function () {
            result = func.apply(this, arguments);
            nextScheduled = false;
            firstCalled = Date.now();
          }, wait - (timeDifBetCalls));
        }
      } else {

      };

      return result;
    };
  };

}).call(this);
