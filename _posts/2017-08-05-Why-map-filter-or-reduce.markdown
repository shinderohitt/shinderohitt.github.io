---
layout: post
title: "Why map, filter, or reduce?"
date: "2017-08-05 19:39"
author: "Rohit Shinde"
tags:
- code
- technical
- functional
- programming
- javascript
---

List is probably the most important data structure. It is omnipresent.
Most common way to enumerate over lists is with the help of loops
(eg, for, while, do, etc).
I am going to attempt and show how functinal constructs
(map, filter, reduce) can help us write more readable code compared to
using loops. Also, how they help avoid bugs. Before we get into it,
let's have a small introductory snippets from [MDN](https://developer.mozilla.org/en-US/) giving an idea about
what they are. If you are familiar, you can skip it and
jump down to the [next section](#the-difference-it-makes).

## What is it?

The `map()` method creates a new array with the results of calling
a provided function on every element in the calling array.


``` javascript
var numbers = [1, 5, 10, 15];
var doubles = numbers.map((x) => {
   return x * 2;
});
// doubles is now [2, 10, 20, 30]
// numbers is still [1, 5, 10, 15]

var numbers = [1, 4, 9];
var roots = numbers.map(Math.sqrt);
// roots is now [1, 2, 3]
// numbers is still [1, 4, 9]
```

The `filter()` method creates a new array with all elements that
pass the test implemented by the provided function.

``` javascript
var words = ["spray", "limit", "elite", "exuberant", "destruction", "present"];

var longWords = words.filter(word => word.length > 6);

// Filtered array longWords is ["exuberant", "destruction", "present"]
```

The `reduce()` method applies a function against an accumulator and
each element in the array (from left to right) to reduce it to
a single value.

``` javascript
var total = [0, 1, 2, 3].reduce((sum, value) => {
  return sum + value;
}, 0);
// total is 6

var flattened = [[0, 1], [2, 3], [4, 5]].reduce((a, b) => {
  return a.concat(b);
}, []);
// flattened is [0, 1, 2, 3, 4, 5]
```


## Readibility

Let's just look at an example.

Imagine we have some animals standing in a queue. We don't know their
exact weights, but an estimate (min - max). The objective is to select
only the animals which are lighter than some arbitrary weight and then
measure the total weight of those selected animals.

Let's assume our following array represents this queue of animals.

``` javascript

const animals = [
    {
        kind      : 'dog',
        minWeight : 22, // in kg
        maxWeight : 30
    },
    {
        kind      : 'camel',
        minWeight : 500,
        maxWeight : 600
    },
    {
        kind      : 'horse',
        minWeight : 380,
        maxWeight : 500
    },
    {
        kind      : 'elephant',
        minWeight : 5500,
        maxWeight : 6000
    },
    {
        kind      : 'wolf',
        minWeight : 50,
        maxWeight : 60
    },
    {
        kind      : 'meerkat',
        minWeight : 0.7,
        maxWeight : 0.8
    },
    {
        kind      : 'human',
        minWeight : 70,
        maxWeight : 73
    }
];
```

Let's start with the loops and move towards functional way and reason
about the readability. One way to write it with `for`
loop would look something like this :

``` javascript
let totalWeight = 0;
const weightLimit = 50;
for (let i = 0; i < animals.length; i++) {
    const curr = animals[i];
    const avgWeight = (curr.minWeight + curr.maxWeight) / 2;
    if (avgWeight < 50) {
        totalWeight += 50;
    }
}
```

Looking at the snippet above, one should go through each line, hold
it all in mind and figure out what it does exactly. One way to simplify it is to seperate out each step so it's easier to follow. <span id="buggy-snippet">Following snippet</span> does that.

``` javascript
// Calculate the average weights for each
const withAvgWeights = [];
for (let i = 0; i < animals.length; i++) {
    const curr = animals[i];
    curr.avgWeight = (curr.minWeight + curr.maxWeight) / 2;
    withAvgWeights.push(curr);
}

// Find out animals weighing less than 50 kg
const lessThan50Kg = [];
for (let i = 0; i < withAvgWeights.length; i++) {
    if (withAvgWeights[i].avgWeight < 50) {
        lessThan50Kg.push(animals[i]);
    }
}

// Add up the total weight
let totalWeight = 0;
for (let i = 0; i < lessThan50Kg.length; i++) {
    totalWeight += lessThan50Kg[i].avgWeight;
}

// totalWeight represents our desired result.

```
This may be easier to follow because it's broken in individual steps,
after learning about one, the reader doesn't have to hold it in mind.
She can simply move onto the next one to learn what it does. The
problem, however, as you can tell, we are repeating ourself. There are
two extra loops now. Let's try out `map`, `filter`, and `reduce`.



We know that these are the steps that we need to follow


 1. Add average weights
 2. Select the animals who are lighter than 50 KG
 3. Add up the total weight of selected animals

Let's define functions which perform these steps exactly. One can think
of this as our mini library :

``` javascript
const avgWeight = animal => (animal.minWeight + animal.maxWeight) / 2;
const lessThan50Kg = weight => weight < 50;
const weightAdder = (totalSoFar, curr) => curr + totalSoFar;

```
If we give descriptive names to our functions, the reader won't even
have to look up their bodies. The names themselves should be good enough
to define what the function does. Which turns code into plain english.
Now let's use the little library above to get our desired result :

``` javascript
const totalWeight = animals
      .map(avgWeight)
      .filter(lessThan50Kg)
      .reduce(weightAdder, 0);
```
Given we name our functions well enough and assuming they are simple
enough, we can get away with four lines above for such cases.

If we cannot think of a good name for a function then it's probably not
simple enough (does too much?). We can probably try and break it down
into more parts, simple and small enough that it can be named well
like the ones above (or even better?).

One of my favorite thing about JavaScript is that we can chain multiple
functions together. Which we are doing in the snippet above.
Let's say `addAvgWeight` was not simple enough. We could try and
break it down into two seperate functions which are well defined.
If the other function was `theOtherFunction`, our code might look like this :

``` javascript
const totalWeight = animals
      .map(addAvgWeight)
      .map(theOtherFunction)
      .filter(lessThan50Kg)
      .reduce(weightAdder, 0);
```

## References and bugs
If a snippet like [this one](#buggy-snippet) is used in a real app,
it could introduce a bug in it.
**How?**

We are creating an array called
`withAvgWeights` using the list of objects `animals`. The problem is,
we are modifying the same objects from `animals` and using the **same**
objects in `withAvgWeights` by just using their references. In the
snippet above we are adding an extra property to each object hense it
most likely  won't create an issue but in cases where one modifies
existing property which is being used somewhere else in the app,
it might break that part of the code.

It's hard to keep track of these references. Functional constructs
make it easier to avoid these issues. `addAvgWeight()` above uses
the object, calculates the needed value and returns it. No references.
`map()` creates a new array using the passed in Array.
Same with the `filter()`.
