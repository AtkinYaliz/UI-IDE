
### Presentational vs. Container Components (@Dan Abramov) ###
My presentational components:
- Are concerned with how things look.
- May contain both presentational and container components** inside, and usually have some DOM markup and styles of their own.
- Often allow containment via this.props.children.
- Have no dependencies on the rest of the app, such as Flux actions or stores.
- Don’t specify how the data is loaded or mutated.
- Receive data and callbacks exclusively via props.
- Rarely have their own state (when they do, it’s UI state rather than data).
- Are written as functional components unless they need state, lifecycle hooks, or performance optimizations.
Examples: Page, Sidebar, Story, UserInfo, List.
My container components:
- Are concerned with how things work.
- May contain both presentational and container components** inside but usually don’t have any DOM markup of their own except for some wrapping divs, and never have any styles.
- Provide the data and behavior to presentational or other container components.
- Call Flux/Redux actions and provide these as callbacks to the presentational components.
- Are often stateful, as they tend to serve as data sources.
- Are usually generated using higher order components such as connect() from React Redux, createContainer() from Relay, or Container.create() from Flux Utils, rather than written by hand.
Examples: UserPage, FollowersSidebar, StoryContainer, FollowedUserList.

I put them in different folders to make this distinction clear.

---

### Component vs. PureComponent: ###
React.PureComponent is exactly like React.Component, but implements <i>shouldComponentUpdate()</i> with a shallow comparison on both state and props (when state or props changes). Component on the other hand won’t compare current props and state to next out of the box. Thus, the component will re-render by default whenever shouldComponentUpdate is called.  
```javascript
class Component {             |   class PureComponent extends Component {
  shouldComponentUpdate() {   |     shouldComponentUpdate() {
    return true;              |       /* Shallow Comparison for state & props */
  }                           |     }
}                             |   }
```
--- Shallow Comparison 101:  
When comparing previous props and state to next, a shallow comparison will check that primitives have the same value (eg, 1 equals 1 or that true equals true) and that the references are the same between more complex javascript values like objects and arrays.
In JS there are 6 primitive types: String, Number, Boolean, null, undefined and Symbol. The rest are Objets (Object, Array, Function, Date and RegExp).

 Never MUTATE  
You’ve probably been hearing not to mutate objects and arrays in props and state. If you were to mutate objects in a parent component, your “pure” child components wouldn’t update. Although the values have changed upstream, the child would be comparing the reference to the previous props and not detect a difference.
Instead, return new objects when you make a change by either leveraging ES6 for object and array spreading or using a library to enforce immutability.

---

### Virtual DOM ###
DOM stands for Document Object Model and is an abstraction of a structured text.  
For web developers, this text is an HTML code, and the DOM is simply called HTML DOM.  
Elements of HTML become nodes in the DOM.  
So, while HTML is a text, the DOM is an in-memory representation of this text.  

The HTML DOM provides an interface (API) to traverse and modify the nodes. It contains methods like getElementById or removeChild. We usually use JavaScript language to work with the DOM.  

The HTML DOM is always tree-structured - which is allowed by the structure of HTML document. This is cool because we can traverse trees fairly easily. Unfortunately, easily doesn’t mean quickly here.  

A typical jQuery-like event handler looks like this:  
- find every node interested on an event
- update it if necessary
Problems with this approach:  
1. Hard to manage => Instead of low-level techniques like traversing the DOM tree manually, you simple declare how a component should look like. React does the low-level job for you - the HTML DOM API methods are called under the hood. React doesn’t want you to worry about it - eventually, the component will look like it should.
2. Inefficient => 

The Virtual DOM is an abstraction of the HTML DOM. It is lightweight and detached from the browser-specific implementation details. Since the DOM itself was already an abstraction, the virtual DOM is, in fact, an abstraction of an abstraction.
Perhaps it’s better to think of the virtual DOM as React’s local and simplified copy of the HTML DOM. It allows React to do its computations within this abstract world and skip the “real” DOM operations, often slow and browser-specific.  

ReactElement:  
A ReactElement is a light, stateless, immutable, virtual representation of a DOM Element. ReactElements lives in the virtual DOM. They make the basic nodes here. Their immutability makes them easy and fast to compare and update. This is the reason of great React performance. Almost every HTML tag - div, table, strong.. can be a ReactElement.
Once defined, ReactElements can be render into the “real” DOM. This is the moment when React ceases to control the elements. They become slow, boring DOM nodes:

ReactComponent:  
- What differs ReactComponent from ReactElement is - ReactComponents are stateful. Whenever the state changes, the component is re-rendered.
- ReactComponents turned out to be a great tool for designing dynamic HTML. They don’t have the access to the virtual DOM, but they can be easily converted to ReactElements.
- ReactComponents are great, we would love to have plenty of them since they are easy to manage. But they have no access to the virtual DOM - and we would like to do as much as possible there.
- Whenever a ReactComponent is changing the state, we want to make as little changes to the “real” DOM as possible. So this is how React deals with it. The ReactComponent is converted to the ReactElement. Now the ReactElement can be inserted to the virtual DOM, compared and updated fast and easily. How exactly - well, that’s the job of the diff algorithm. The point is - it’s done faster than it would be in the “regular” DOM.
- When React knows the diff - it’s converted to the low-level (HTML DOM) code, which is executed in the DOM. This code is optimised per browser.

SUMMARY:  
- I believe that before updating the virtual DOM, a snapshot is taken of the existing virtual DOM , then the virtual DOM gets updated and is compared with the snapshot to be able to see what is actually changed.
- Yep this is correct. By comparing the new virtual DOM with a pre-update version, React figures out exactly which virtual DOM objects have changed. This process is called "diffing."  

---

### Controlled Components ###
A controlled component has two aspects:  
1. Controlled components have functions to govern the data going into them on every onChange event, rather than grabbing the data only once, e.g. when a user clicks a submit button. This 'governed' data is then saved to state (in this case, the parent/container component's state).  
2. Data displayed by a controlled component is received through props passed down from it's parent/container component.  

This is a one-way loop – from (1) child component input (2) to parent component state and (3) back down to the child component via props – is what is meant by unidirectional data flow in React.js application architecture.

---

### Higher-Order Components (HOCs) ###

Concretely, a higher-order component is a function that takes a component and returns a new component.
```javascript
const addAndLog = (x, y) => {       |   const multiplyAndLog = (x, y) => {
  let result = x + y;               |     let result = x * y;
  console.log('result:', result);   |     console.log('result:', result);
  return result;                    |     return result;
};                                  |   };

addAndLog(1,2);
multiplyAndLog(4,5);
```
Let’s say that we want to extract the logging logic out of these functions without changing their signatures. How can we do this? With a Higher-Order function, that is, a function that takes a function as an argument and returns a function.
```javascript
const add = (x, y) => {     |   const multiply = (x, y) => {
  return x + y;             |     return x * y;
};                          |   };

const withLogging = (wrappedFunction) => {
  return (x, y) => {
    let result = wrappedFunction(x, y);
    console.log('result:', result);
    return result;
  };
};

// Equivalent to writing addAndLog by hand:
const addAndLog2 = withLogging(add);

// Equivalent to writing multiplyAndLog by hand:
const multiplyAndLog2 = withLogging(multiply);

addAndLog2(1,2);
multiplyAndLog2(4,5);
```
---
---
# INTERVIEW Q.

### this.setState
setState is async. You can also use this.setState((prevState, props) => {}) w/ a callback func.

## Higher Order Components: What is it, Where do we use it and Why do we use it
## Key in React:
## Pure Function
## What is selector in Redux
