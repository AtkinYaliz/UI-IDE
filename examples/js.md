# JavaScript

_Prototype-based Language_: There are no classes. Objects are created using a cloning process.  
_Dynamic Language_: properties can be added or removed from an object after instantiation.  
_Coercion_ is converting a value from one type to another (ex: console.log(1 + 'london')).  
_Decleration_: When it is executed it doesn't do anything.  
_Expression_: A unit of code that results a value.

### FUNCTIONS

- Functions are objects {name, code, call(), apply(), bind(), prototype}. Name is optional (anonymous functions). Bind returns a function. Protototype is used only by the _new_ operator.
- _Invocation_ is running a function by ().
- A function that is the property of an object is called its _method_.
- _First Class Function_: You can use functions like strings, numbers etc. (ie. assign as a value to a variable, passed as an argument to other function or return by another function).
- To create a function we can use: - _Function Declaration_: Can only exist as a _statement_ and should start with the keyword. When it is executed it doesn't do anything. They are _hoisted_.  
  `function func() { ... }`  
   - _Function Expression_: When it is executed it returns an object, as other expressions. They are _not hoisted_ but their variables are hoisted.  
  `var func = function() { ... };`
- The function has full access to the outer variable. It can modify it as well.  
  If a same-named variable is declared inside the function then it _shadows_ the outer one.
- Values passed to a function as parameters are copied to its local variables (pass-by-value). If the parameter is an object, you can update its properties.
  - `.bind(thisArg, p1, p2, p3 ...)`: creates a new function that, when called, has its _this_ keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
  - `.call(thisArg, p1, p2, p3 ...)`: calls a function with a given _this_ value and arguments provided individually.
  - `.apply(thisArg, [p1, p2, p3 ...])`: calls a function with a given _this_ value, and arguments provided as an array (or an array-like object).

```javascript
// function statement
function greet() {
  console.log("hi");
}
greet();

// function expression
var greetMe = function () {
  console.log("hi tony");
};
greetMe();

// functions are first-class
function logGreeting(fn) {
  fn();
}
logGreeting(greet);
logGreeting(greetMe);

// use a function expression on the fly
logGreeting(function () {
  console.log("hello tony");
});
```

```javascript
function func(p1, p2) {
  console.log(this.name);
}
var obj = { name: "abc" };

var funcDel = func.bind(obj);
funcDel("aa", 123); // "abc"
func.call(obj, "aa", 123);
func.apply(obj, ["aa", 123]);
```

### SCOPE

- A compile time process. The scope of a variable are the locations where it is accessible.
- Variables in JavaScript are lexically scoped, so the static structure of a program determines the scope of a variable.
- There is only _functional scope_. The only block-scope is catch(e) {...}

```javascript
function f() {
  test1 = 111; // creates in global
  var test2 = "222";
}
f();
clog(test1); // 111
clog(test2); // test2 is not defined
```

```javascript
for (var i = 0; i < 10; i++) {
  // ...
}
alert(i); // 10
```

IIFE:
An IIFE enables you to attach private data to a function

```javascript
(function f() {
  var tmp = "...";
})();
clog(tmp); // tmp is not defined
```

### HOISTING

JS engine sets up memory space for variable and function declerations (it moves the declerations to the beginning of their direct scopes).  
In JS, declerations (variable and function) are hoisted but assignment are not.

### CLOSURE

- The name comes from the fact that a closure `closes over` the _free variables_ of a function. A variable is free if it is not declared within the function—that is, if it comes `from outside`.
- A _closure_ is the combination of a `function` and the `lexical environment` within that function was **created**.

```javascript
// Module pattern
var testModule = (function () {
  var counter = 0;
  return {
    incrementCounter: function () {
      return counter++;
    },
    resetCounter: function () {
      console.log("counter value prior to reset: " + counter);
      counter = 0;
    },
  };
})();
```

### PROTOTYPE

- _Inheritance_: One object gets access to the properties and methods of another object.
- _Prototype chain_: This is an extremely common JavaScript interview question. All JavaScript objects have a prototype property, that is a reference to another object. When a property is accessed on an object and if the property is not found on that object, the JavaScript engine looks at the object's prototype, and the prototype's prototype and so on, until it finds the property defined on one of the prototypes or until it reaches the end of the prototype chain, _Object.prototype_.
  All JS objects (Date, Array, Function, RegExp, ...) inherit from the Object.prototype.
- **_.prototype_**: Is an object property that is automatically created for to only _functions_. It is used to build _\_\_proto\_\__ when the function happens to be used as a function constructor with the _new_ keyword. There will be only one prototype for each object that is created from same function.  
  Prototype property of the function is not the prototype of the function. It is the prototype of the objects created by function contructor.
- _**.\_\_proto\_\_**_: Is the actual object that is used in the lookup chain to resolve methods. It is a property that all objects have. This is the property which is used by the JS engine for inheritance.
  _Why prototype_: Because functions are objects if we define getFullname() in Person every object will have it and this means more memory space. We don't need this for methods. But if we use it in prototype there will be only one definition.
- There are pre-defined functions named _Function_, _Object_, _Array_, _String_, _Number_ and _Date_.

```javascript
function Person(fname, lname) {
  this.fname = fname;
  this.lname = lnamae;
}
Person.prototype.getFullname = function () {
  return this.fname + " " + this.lname;
};
var john = new Person("John", "Doe");
console.log(john.getFullname());
```

```javascript
var a = [];             var a2 = new Array();
var f = function() {};  var f2 = new Function();
var o = {};             var o2 = new Object();
var s = 'asd';          var s2 = new String();
var n = 123;            var n2 = new Number();
var d = new Date();
var p = new Person();

a.__proto__ = a2.__proto__ = Array.prototype
f.__proto__ = f2.__proto__ = Function.prototype
o.__proto__ = o2.__proto__ = Object.prototype
s.__proto__ = s2.__proto__ = String.prototype
n.__proto__ = n2.__proto__ = Number.prototype
d.__proto__ = Date.prototype
p.__proto__ = Person.prototype

a.__proto__.__proto__ \
f.__proto__.__proto__ \
o.__proto__.__proto__ \
s.__proto__.__proto__ - === Object.prototype
n.__proto__.__proto__ /
d.__proto__.__proto__ /
p.__proto__.__proto__ /
```

```javascript
var a = new Number(3);
var b = Number(4);
console.log( a );   // Number {[[PrimitiveValue]]: 3}
console.log( b );   // 4
Number.prototype will be common for all Number objects.
```

![alt text](../images/prototype_inheritance.svg)

### Explain how `this` works in JavaScript

There's no simple explanation for `this`; it is one of the most confusing concepts in JavaScript. A hand-wavey explanation is that the value of `this` depends on how the function is called. I have read many explanations on `this` online, and I found [Arnav Aggrawal](https://medium.com/@arnav_aggarwal)'s explanation to be the clearest. The following rules are applied:

1. If the `new` keyword is used when calling the function, `this` inside the function is a brand new object.
2. If `apply`, `call`, or `bind` are used to call/create a function, `this` inside the function is the object that is passed in as the argument.
3. If a function is called as a method, such as `obj.method()` — `this` is the object that the function is a property of.
4. If a function is invoked as a free function invocation, meaning it was invoked without any of the conditions present above, `this` is the global object. In a browser, it is the `window` object. If in strict mode (`'use strict'`), `this` will be `undefined` instead of the global object.
5. If multiple of the above rules apply, the rule that is higher wins and will set the `this` value.
6. If the function is an ES2015 arrow function, it ignores all the rules above and receives the `this` value of its surrounding scope at the time it is created.

For an in-depth explanation, do check out his [article on Medium](https://codeburst.io/the-simple-rules-to-this-in-javascript-35d97f31bde3).

### BUILDING OBJECT

_Function constructor_: They are just functions. They are used to construct objects when the function is used by _new_ operator.  
_Constructor_: A normal function that is used to construct objects.  
_new_ operator:

- JS engine creates a new empty object.
- It invokes the function.
- When function is called Exec.Context creates a variable _this_.  
  It changes what the 'this' variable points to. 'this' variable points to that new empty object.
- JS engine will return that object at the end of the function.

```javascript
function Person() {
  console.log(this);
  this.fname = "fname";
  this.lname = "lname";
}

var glob = Person(); //-> window object
var ali = new Person(); //-> {}
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

### JS ENGINE

- Google's V8 engine is used in Chrome and Node.js. The engine consists of two main components:
  - _Memory Heap_: this is where memory allocation happens.
  - _Call Stack_: this is where your stack frames are, as your code executes.

DOM****\_****\  
AJAX****\_****- Web APIs which are provided by browsers, not by the Engine.  
setTimeout\_\_/

- _Call Stack_ is a data structure which records basically where in the program we are.
- JS is a _single-threaded_ programming language, which means it has a single Call Stack. Therefore it can do one thing at a time.
- _Heap_: used for memory allocation.
- _Stack Frame_: every entry in the Call Stack.
- _Event Loop_: It pushes the first item in the queue into the stack if the stack is empty.

```javascript
 _HEAP__      _STACK_        _WebAPIs_
|       |    |       |      |         |
|       |    |       |      |         |
|       |    |       |      |         |
 -------      -------        ---------

                 Task    ----------
                 Queue  |          |
                         ----------

                   -> --
      Event Loop  |     |
                   -----
```

### EXECUTION STACK

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

alert(pow(2, 3));
```

Execution Stack will be like:

| Exe. Context pow(2,1) [x=2, n=1] |
| -------------------------------- |
| Exe. Context pow(2,2) [x=2, n=2] |
| Exe. Context pow(2,3) [x=2, n=3] |

### PROMISES & CALLBACK FUNCTIONs

---

---

# NODE

- _Microprocessor_: A tiny machine that takes instructions (in its own language ie: IA-32, x86-64, ARM, MIPS).
- _Machine Code (language)_: Programming languages spoken by computer processors.
  Every program you run on your computer is converted (compiled) into a machine code.
- _EcmaScript_: The standard that JS is based on. If you want to write your own JS engine you have to make js code to match these specifications.
- _JS Engine_: A program that converts JS code into something the computer processor can understand.

## V8 JavaScript Engine

- Written in C++ and used in Google Chrome.
- Converts JS into machine code.
- Implements ES5.
- Can run standalone or can be embedded into **any** C++ application (ie: NodeJs).
- Has folders for different type of compilation languages. ie: ia32/, mips/, x64/
- Has files like: date.cc, dateparser.cc. These files read js text and convert into machine code.
- Write your own C++ application (like Node.Js):

```
#include <include/v8.h>

global -> Set(
  v8::String::NewFromUtf8(isolate, "print",
    v8::NewStringType::kNormal)
      .ToLocalChecked(),
  v8::FunctionTemplate::New(isolate, Print));

void Print(const v8::FunctionCallbackInfo<v8::Value>& args) {
  bool first = true;
  for(int i =0; i < args.Length(); i++) {
    // ...
  }
}
```

## Node.Js

- A C++ program with V8 embedded that is added extra features that make it suitable to be a great server technology.

---

---

# FUNCTIONAL PROGRAMMING

- _Imperative Paradigm_ (HOW) -> _Declerative Paradigm_ (WHAT)
- _Immutable Data_:
  - Data cannot be changed after it's created (return a new copy: .map(), .filter())
- _First Class Function_:
  - Use functions as arguments.
  - Functions can be assigned as variables.
- _Pure Function_:
  - With same inputs you always get same outputs.
  - Doesn't depend on any data other than what is passed.
  - Doesn't modify any data other than what they return.
- _Side Effect_:
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
var sum1 = 0,
  numbers2 = JSON.parse(JSON.stringify(numbers));
for (let i = 0; i < numbers2.length; i++) {
  numbers2[i] = numbers2[i] - 1;
  if (numbers2[i] % 3 === 0) {
    sum1 += numbers2[i];
  }
}

// Solution #2
const reduced = numbers.map((n) => n - 1);
const divisible = reduced.filter((n) => n % 3 === 0);
const sum2 = divisible.reduce((acc, n) => acc + n, 0);

// Solution #3
const sum3 = numbers
  .map((n) => n - 1)
  .filter((n) => n % 3 === 0)
  .reduce((acc, n) => acc + n, 0);

// Solution #4
const subtractOne = (n) => n - 1;
const isDivisibleBy3 = (n) => n % 3 === 0;
const add = (acc, n) => acc + n;
const sum4 = numbers.map(subtractOne).filter(isDivisibleBy3).reduce(add, 0);
```

```javascript
/*
 * Task: find the user by id=2
 * */

// Solution 1
const user1 = users.find((u) => u.id === 2);

// Solution 2
const byId2 = (u) => u.id === 2;
const user2 = users(byId2);

// Solution 3
const byId3 = (user, id) => user.id === id;
const user3 = users.find((u) => byId3(u, 2));

// Solution 4: HOF + Currying
const byId4 = (id) => (user) => user.id === id;
const user4 = users.find(byId4(2));
```

---

---

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
