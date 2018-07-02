*Prototype-based Language*: There are no classes. Objects are created using a cloning process.  
*Dynamic Language*: properties can be added or removed from an object after instantiation.  
*Coercion* is converting a value from one type to another (ex: console.log(1 + 'ankara')).  
*Expression*: A unit of code that results a value.  
*Decleration*: When it is executed it doesn't do anything.  

### FUNCTIONS ###
- Functions are objects {name, code, call(), apply(), bind(), prototype}. Name is optional (anonymous functions). Bind returns a function. Protototype is used only by the *new* operator.  
- *Invocation* is running a function by ().
- A function that is the property of an object is called its *method*.
- *First Class Function*: You can use functions like strings, numbers etc. (ie. assign as a value to a variable, passed as an argument to other function or return by another function).
- To create a function we can use:
    - *Function Declaration*: Can only exist as a *statement* and should start with the keyword. When it is executed it doesn't do anything. They are *hoisted*.  
`function func() { ... }`  
    - *Function Expression*: When it is executed it returns an object, as other expressions. They are *not hoisted* but their variables are hoisted.  
`var func = function() { ... };`  
- The function has full access to the outer variable. It can modify it as well.  
If a same-named variable is declared inside the function then it *shadows* the outer one.  
- Values passed to a function as parameters are copied to its local variables (pass-by-value). If the parameter is an object, you can update its properties.  
    - `.bind(thisArg, p1, p2, p3 ...)`: creates a new function that, when called, has its *this* keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
    - `.call(thisArg, p1, p2, p3 ...)`: calls a function with a given *this* value and arguments provided individually.
    - `.apply(thisArg, [p1, p2, p3 ...])`: calls a function with a given *this* value, and arguments provided as an array (or an array-like object).

```javascript
// function statement
function greet() {
   console.log( 'hi' );
}
greet();

// functions are first-class
function logGreeting(fn) {
   fn();
}
logGreeting( greet );

// function expression
var greetMe = function() {
    console.log( 'hi tony' );
};
greetMe();

// it's first-class.
logGreeting( greetMe );

// use a function expression on the fly
logGreeting(function() {
   console.log('hello tony');
});
```

```javascript
function func(val1, val2) { console.log(this.name); }
var obj = { name: 'abc' };

var funcDel = func.bind( obj );
funcDel('aa', 123);
func.call( obj, 'aa', 123 );
func.apply( obj, ['aa', 123] );
```

### SCOPE ###
- A compile time process. The scope of a variable are the locations where it is accessible.
- Variables in JavaScript are lexically scoped, so the static structure of a program determines the scope of a variable.
- There is only *functional scope*. The only block-scope is catch(e) {...}

```javascript
if (true) {
    var test = true; // use "var" instead of "let"
}
alert(test);   // true
```
```javascript
for (var i = 0; i < 10; i++) {
    // ...
}
alert(i);   // 10
```

IIFE:
An IIFE enables you to attach private data to a function
```javascript
function f() {
    if (condition) {
        var tmp = "...";
    }
    // tmp still exists here
}
```

### HOISTING ###

JS engine sets up memory space for variable and function declerations (it moves the declerations to the beginning of their direct scopes).  
In JS, declerations (variable and function) are hoisted but assignment are not.  

### CLOSURE ###

- A *closure* is the combination of a `function` and the `lexical environment` within that function was **created**.  
- The name comes from the fact that a closure `closes over` the free variables of a function. A variable is free if it is not declared within the function—that is, if it comes `from outside`.  

```javascript
// Module pattern
var testModule = (function () {
  var counter = 0;
  return {
    incrementCounter: function () {
      return counter++;
    },
    resetCounter: function () {
      console.log( "counter value prior to reset: " + counter );
      counter = 0;
    }
  };
})();
```

### JS ENGINE ###

- Google's V8 engine is used in Chrome and Node.js.  The engine consists of two main components:
  - *Memory Heap*: this is where memory allocation happens.
  - *Call Stack*: this is where your stack frames are, as your code executes.  

DOM_________\  
AJAX_________- Web APIs which are provided by browsers, not by the Engine.  
setTimeout__/  

- *Call Stack* is a data structure which records basically where in the program we are. 
- JS is a *single-threaded* programming language, which means it has a single Call Stack. Therefore it can do one thing at a time.
- *Heap*: used for memory allocation.
- *Stack Frame*: every entry in the Call Stack.
- *Event Loop*: It pushes the first item in the queue into the stack if the stack is empty.

```javascript
 _HEAP__      _STACK_        _WebAPIs_
|       |    |       |      |         |
|       |    |       |      |         |
|       |    |       |      |         |
 -------      -------        ---------
 
                   -> -- 
      Event Loop  |     |
                   -----

 Task    ----------
 Queue  |          |
         ----------
```


### EXECUTION STACK ###

The information about a function run is stored in its Execution Context (EC).  
One function call has exactly one EC associated with it.  

```javascript
function pow(x, n) {
   if (n == 1) {
      return x;
   } else {
      return x * pow(x, n - 1);
   }
}

alert( pow(2, 3) );
```

Execution Stack will be like:

| Exe. Context pow(2,1) [x=2, n=1] |  
|----------------------------------|  
| Exe. Context pow(2,2) [x=2, n=2] |   
| Exe. Context pow(2,3) [x=2, n=3] | 


### PROTOTYPE ###

- *Inheritance*: One object gets access to the properties and methods of another object.  
- *Prototype chain*: This is an extremely common JavaScript interview question. All JavaScript objects have a prototype property, that is a reference to another object. When a property is accessed on an object and if the property is not found on that object, the JavaScript engine looks at the object's prototype, and the prototype's prototype and so on, until it finds the property defined on one of the prototypes or until it reaches the end of the prototype chain, *Object.prototype*.
All JS objects (Date, Array, Function, RegExp, ...) inherit from the Object.prototype.  
- ***.prototype***: Is an object property that is automatically created for to only *functions*. It is used to build *\_\_proto\_\_* when the function happens to be used as a function constructor with the *new* keyword. There will be only one prototype for each object that is created from same function.  
Prototype property of the function is not the prototype of the function. It is the prototype of the objects created by function contructor.  
- *__.\_\_proto\_\___*: Is the actual object that is used in the lookup chain to resolve methods. It is a property that all objects have. This is the property which is used by the JS engine for inheritance. 
*Why prototype*: Because functions are objects if we define getFullname() in Person every object will have it and this means more memory space. We don't need this for methods. But if we use it in prototype there will be only one definition.   

 

```javascript
function Person(fname, lname) {
   this.fname = fname;
   this.lname = lnamae;
}
Person.prototype.getFullname = function() {
   return this.fname + ' ' + this.lname;
}
var john = new Person('John', 'Doe');
console.log( john.getFullname() );
```

```javascript
var a = {};
var b = function() {};
var c = [];
var d = new Date();

a.__proto__ = Object.prototype
b.__proto__ = Function.prototype
c.__proto__ = Array.prototype
d.__proto__ = Date.prototype

b.__proto__.__proto__ \
c.__proto__.__proto__ -  === Object.prototype
d.__proto__.__proto__ /
```

```javascript
var a = new Number(3);
var b = Number(4);
console.log( a );   // Number {[[PrimitiveValue]]: 3}
console.log( b );   // 4
Number.prototype will be common for all Number objects.
```

### BUILDING OBJECT ###

*Function constructor*: They are just functions. They are used to construct objects when the function is used by *new* operator.  
*Constructor*: A normal function that is used to construct objects.  
*new* operator: 
- JS engine creates a new empty object.
- It invokes the function.
- When function is called Exec.Context creates a variable *this*.  
It changes what the 'this' variable points to. 'this' variable points to that new empty object.
- JS engine will return that object at the end of the function.

```javascript
function Person() {
   console.log( this );
   this.fname = 'fname';
   this.lname = 'lname';
}

var glob = Person();        //-> window object
var ali = new Person();     //-> {}
```
```javascript
function Shape() {
   this.name = 'Shape 1';
}
Shape.prototype.getName = function() {
   return this.name;
}
var o = new Shape();
var o2 = Object.create( o );
var o3 = Object.create( {} );

console.log( o );       //-> Shape { name:'Shape 1', __proto__: Object }
console.log( o2 );      //-> Shape { __proto__: Shape }
console.log( o3 );      //-> { __proto__: Object }

var person = {
    fname: 'default';
};
var john = Object.create( person );     //-> john.__proto__ === person
person.city = 'london';                 //-> john.city === 'london'

// polyfill for Obj.create
if(!Object.create) {
   Object.create = function(o) {
      function F() {}
      F.prototype = o;
      return new F();
   }
}
```

- - - -
- - - -

# FUNCTIONAL PROGRAMMING #

- *Imperative Paradigm* (HOW) -> *Declerative Paradigm* (WHAT)  
- *Immutable Data*: 
   - Data cannot be changed after it's created (return a new copy: .map(), .filter())
- *First Class Function*:
   - Use functions as arguments.
   - Functions can be assigned as variables.
- *Pure Function*:
   - With same inputs you always get same outputs.
   - Doesn't depend on any data other than what is passed.
   - Doesn't modify any data other than what they return.
- *Side Effect*:
   - If it modifies any data outside it's scope (api call, file system, )

```javascript
// Imperative (HOW)                  |  // Declerative (WHAT)
for(var i=0; i<users.length; i++) {  |  users.map(u => {  
  users[i].city = 'london';          |    u.city = 'london';  
}                                    |    return u;
                                     |  });
```

```javascript
/*
 * Task: Reduce every item by 1 and then
 * sum all the values divisible by 3
 * */
const numbers = [2, 4, 6, 10, 16];

// Solution #1 (AML)
var sum1=0, numbers2=JSON.parse(JSON.stringify(numbers));
for(let i=0; i<numbers2.length; i++) {
   numbers2[i] = numbers2[i]-1;
   if(numbers2[i] % 3 === 0) {
      sum1 += numbers2[i];
   }
}

// Solution #2
const reduced = numbers.map(n => n-1);
const divisible = reduced.filter(n => n%3 === 0);
const sum2 = divisible.reduce((acc, n) => acc+n, 0);

// Solution #3
const sum3 = numbers
   .map(n => n-1)
   .filter(n => n%3 === 0)
   .reduce((acc, n) => acc+n, 0);

// Solution #4
const subtractOne = n => n-1;
const isDivisibleBy3 = n => n%3 === 0;
const add = (acc, n) => acc+n;
const sum4 = numbers
   .map(subtractOne)
   .filter(isDivisibleBy3)
   .reduce(add, 0);
```

```javascript
/*
 * Task: find the user by id=2
 * */

// Solution 1
const user1 = users.find(u => u.id === 2);

// Solution 2
const byId2 = u => u.id ===2;
const user2 = users( byId2 );

// Solution 3
const byId3 = (user, id) => user.id === id;
const user3 = users.find(u => byId3(u, 2));

// Solution 4: HOF + Currying
const byId4 = id => user => user.id === id;
const user4 = users.find( byId4(2) );
```

- - - -
- - - -
  
  
```javascript
// CommonJS -------------------------------------------------------------------
// testA.js                         |   // testB.js
exports.funcA = () => {             |   module.exports = () => {
    console.log('--------');        |       console.log('--------');
};                                  |   };
// app.js                           |   // app.js
const testA = require('./testA');   |   const testB = require('./testB');
testA.funcA();                      |   testB();
```
console.clear();

const arr = [23, 55, 644, 234],
    obj = { a: 123, b: 'anka', c: ['z43', 'ant'], d: {d1: 12, d2: 'ist'} };

let [o1, , o3] = arr;
let { c: [, y1], d: {d2: y2} } = obj;

console.log(o1, o3);
console.log(y1, y2);
