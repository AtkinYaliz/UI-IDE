const arr = [1, 2, 3], users = [];
const add = (x, y) => x + y;
const
    clone = arr => [ ...arr ],
    push = arr => x => [ ...arr, x ],
    pop = arr => arr.slice(0, -1),
    unshift = arr => x => [ x, ...arr ],
    shift = arr => arr.slice(1),
    sort = arr => fn => [ ...arr ].sort(fn),
    remove = arr => i => [ ...arr.slice(0, i), ...arr.slice(i+1) ],
    splice = arr => (s, c, ...x) => [ ...arr.slice(0, s), ...x, ...x.slice(s + c) ],
    unique = [...new Set(arr)]
;

(() => {
  const has = prop => obj => obj.hasOwnProperty(prop);
  const sortBy = prop => (x, y) => x[prop] > y[prop];
  const is = prop => val => obj => obj.hasOwnProperty(prop) && obj[prop] === val;

  const results1 = users
    .filter( x => x.hasOwnProperty('pets') )
    .sort( (x, y) => x.age > y.age );

  const results2 = users
    .filter( has('cars') )
    .filter( has('pets') )
    .sort( sortBy('age') )
    .sort( negate(sortBy('age')) );

  const hasCars = has('cars');
  const hasPets = has('pets');
  const isStudent = is('title')('student');
  const sortByAge = sortBy('age');

  const results3 = users
    .filter( hasCars )
    .filter( hasPets )
    .filter( isStudent )
    .sort( sortByAge )
    .sort( negate(sortByAge) );
})();

/**
 * CURRYING - Closure
 * When you have a function that needs 2 inputs which you know one of them now but
 * the other will be specified later, you can use closure to remember the first one.
 */
(() => {
  const makeAdder = x => y => add(x, y);
  const addTo10 = makeAdder(10);

  addTo10(4) === makeAdder(10)(4) === add(10, 4);
})();

/**
 * All for one (Unary, Binary, N-ary)
 * When you need a function that receives a single argument
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
  Math.max(...arr); //=> 3
  binary(Math.max)(...arr);  //=> 2
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
 * PARTIAL - Some Now, Some Later
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
 * Point Free
 */
(() => {
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
  const plucks = keys => obj => {
    const res = {};
    keys.forEach(k => { res[k] = obj[k] });
    return res;
};
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

/**
 * COMPOSE & PIPE
 * Result of the first function will be input for the second function.
 * Execution order: Compose: Right -> Left, Pipe: Left -> Right
 */
(() => {
  // first params can be more than 1.
  // The rest will be 1 input -> 1 output.
  function compose(...fns) {
    return function composed(...params) {
      var list = [...fns];
      var result = list.pop()( ...params );

      while(list.length > 0) {
        result = list.pop()( result );
      }

      return result;
    }
  }
  function pipe(...fns) {
    return function piped(...params) {
      var list = [...fns];
      var result = list.shift()( ...params );

      while(list.length > 0) {
        result = list.shift()( result );
      }

      return result;
    }
}

  const result = fn3(fn2(fn1( val1, val2 )));
  const result = compose(fn3, fn2, fn1)( val1, val2 );
})();

=========================================================

/*
 * OO vs FP
 *
 * */

class Invoice {
   constructor(id) {
      this.id = id;
      this.items = [];
   }
   addItem(id, quantity, price) {
      this.items.push({
         id,
         quantity,
         price
      });
   }
   calculateSum() {
      return this.items.reduce((acc, item) => {
         return acc + (item.quantity * item.price);
      }, 0);
   }
}

const invoice1 = new Invoice(1);
invoice1.addItem(23, 1, 34);
invoice1.addItem(88, 2, 10);
invoice1.calculateSum();



function createInvoice(id) {
   return {
      id,
      items: []
   };
}
function addItem(invoice, id, quantity, price) {
   const newInvoice = clone(invoice);
   return newInvoice.items.push({
      id,
      quantity,
      price
   });
}
function calculateSum(invoice) {
   return invoice.items.reduce((acc, item) => {
      return acc + (item.quantity * item.price);
   }, 0);
}

const invoice2 = createInvoice(1);
const invoice2a = addItem(invoice2, 23, 1, 34);
const invoice2b = addItem(invoice2a, 88, 2, 10);
calculateSum(invoice2b);
