const arr = [1, 2, 3];
const add = (x, y) => x + y;
const
    clone = arr => [ ...arr ],
    push = arr => x => [ ...arr, x ],
    pop = arr => arr.slice(0, -1),
    unshift = arr => x => [ x, ...arr ],
    shift = arr => arr.slice(1),
    sort = arr => fn => [ ...arr ].sort(fn),
    remove = arr => i => [ ...arr.slice(0, i), ...arr.slice(i+1) ],
    splice = arr => (s, c, ...x) => [ ...arr.slice(0, s), ...x, ...x.slice(s + c) ]
;


/**
 * Closure (Currying example)
 * When you have a function that needs 2 inputs which you know one of them now but
 * the other will be specified later, you can use closure to remember the first one.
 */
(() => {
  const makeAdder = x => y => add(x, y);
  const addTo10 = makeAdder(10);

  addTo10(4) === makeAdder(10)(4) === add(10, 4);
})();

/**
 * All for one
 * When you need a function that receives a single argument
 */
(() => {
  function unary(fn) {
    return function singleArg(arg) {
      return fn(arg);
    }
  }

  const func = unary( parseInt );

  arr.map( parseInt ); // [1, NaN, NaN]
  arr.map( unary(parseInt) );
  arr.map( func );

  func(1, 4) === unary(parseInt)(1, 7);
})();

/**
 * One on One
 * When you need a function that receives a single argument and returns it.
 */
(() => {
  function identity(arg) {
    return arg;
  }

  const words = "  hi ... how are you  ";
  words.split( /\s|\b/ ).filter( identity ); // the array w/o spaces
})();

/**
 * Some Now, Some Later (Partial)
 * When you need a function that receives multiple arguments,
 * you may want to specify some of those up front and leave the rest to be specified later.
 */
(() => {
  function partial(fn, ...presetArgs) {
    return function partiallyApplied(...laterArgs){
      return fn( ...presetArgs, ...laterArgs );
    };
  }

  function ajax(url, data, callback) { /* ... */ }
  function getPerson(data, cb) {
    ajax( "http://some.api/person", data, cb );
  }
  function getOrder(data, cb) {
    ajax( "http://some.api/order", data, cb );
  }
  function getCurrentUser(cb) {
    getPerson( { user: CURRENT_USER_ID }, cb );
  }

  var getPerson = partial( ajax, "http://some.api/person" );
  var getOrder = partial( ajax, "http://some.api/order" );
  var getCurrentUser = partial( getPerson, { user: CURRENT_USER_ID } );

  [1,2,3,4,5].map( x => add(x, 3) );
  [1,2,3,4,5].map( partial( add, 3 ) );
})();

/**
 * Unary, Binary, N-ary
 */
(() => {
  const unary = fn => arg => fn(arg);
  const binary = fn => (arg1, arg2) => fn(arg1, arg2);
  const reverseArgs = fn => (...args) => fn( args.reverse() );

  function f(...args) {
    console.log( args );
  }
  var g = unary(f);
  var h = binary(f);
  var i = reverseArgs(f);

  g(1,2,3,4); // [1]
  h(1,2,3,4); // [1,2]
  i(1,2,3,4); // [4,3,2,1]
})();

/**
 * Point Free
 */
(() => {
  foo(function(v) {
    return bar(v);
  });
  foo(bar);

  function isOdd(v) {
    return v % 2 === 1;
  }
  function isEven(v) {
    return !isOdd(v);
  }

  function negate(fn) {
    return function negated(...args) {
      return !fn(...args);
    }
  }
  var isEven = negate(isOdd);

  const pluck = key => obj => obj[key];
  const multiply = x => y => x * y;
  const discount = multiply(0.95);
  const tax = multiply(1.1);

  const prices = arr
  	.map( pluck('price') )
  	.map( discount )
  	.map( tax )
  	.map( isOdd );

  console.log( prices );
})();
