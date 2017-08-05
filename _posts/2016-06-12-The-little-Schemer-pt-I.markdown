---
layout: post
title: "The little Schemer pt I"
date: "2016-06-12 19:06"
author: "Rohit Shinde"
tags:
- code
- scheme
- functional
- book
---

#### Why?
I got stuck at an exercise from SICP and couldn't come up with any solution for a long time, mainly because of the way recursive procedures work. They are easy to read, but hard to write. I finally gave up and decided to improve recursive-thinking and come back to SICP later. After doing some search, decided to go with **The little Schemer** as many people seem to recommend it. The problem with *just* reading is that, even if you get an intuitive idea behind things, they tend to get washed away with time. Our brain is like desert - a land of sand, where sandstorms keep coming up now and then. So, you need to keep coming back once in a while and redo the marks you made. Very bad analogy but it will do.

> This is the first post in a short series I am planning to write on this book, these will basically be summarized notes. These will include some code snippets from the book (or some variation of those).

## The little Schemer Pt I

### 1. Toys

This chapter explains the primitive procedures on which later chapters are built upon. Their names, the parameters they expect are given below along with a little description and usage examples.

#### atom?
This checks if the S-expression is a string (and not a list or a tuple), it can be defined as *(snippet from the book)* Note that a string is a sequence of characters, eg. "blah", "123", "$hello", etc.

``` scheme
(define atom?
    (lambda (x)
        (and (not pair? x) (not (null? x)))))
```

You can test this with something like - `(atom? 'rohit)` where `rohit` is a parameter to the procedure `atom?`

 > To tell your Scheme (or Lisp) interpreter not to evaluate a certain part of your expression and pass that as a parameter to a procedure, you can use `(quote ARGUMENT)` but a shorter and better way to do it is to just use a quote - `'`. Same way shown above.

To give a few examples of `atom?`,

``` scheme
(atom? 'mango)
;; should return #t because "mango" is a string and not a list
(atom? '123) ;; should return #t for the same reason
(atom? '()) ;; should return #f because () is an empty list
```

#### Car
This is defined only for the non-empty lists. It takes a non-empty list as a parameter and returns the first element from the given list. Few examples are given below to show how this works.

``` scheme
(car '(mango versus banana)) ;; should return 'mango'
(car '((sweet) little papaya))
;; should return (sweet) which is a list!
;; So the idea is simple - return first expression from the list,
;; we don't care about what it is, simply pick first element
;; and return!
```

#### Cdr
This is pronounced as *could-er* for some weird reasons unknown to me. `cdr` is a primitive procedure which takes a non-empty list as an argument and returns a new list which is a modified version of the old list with its first element removed. That got too wordy, examples are shown below.

``` scheme
(cdr '(potato tomato hotato)) ;; returns - (tomato hotato)
(cdr '(green (red (and (orange))) orange)
;; returns ((red (and (orange))) orange)
;; keep in mind - remove first element of the list,
;; whatever it may be, return whatever is left after that
```

#### Cons
This one takes two arguments, first one being an `atom` (see above), and a `list` and returns a new list with given `atom` as the first element in the given `list`. See examples.

``` scheme
(cons 'banana '(and milk))
;; returns - (banana and milk)
(cons '(milk) '((and) bread))
;; returns - ((milk) (and) bread)
```

#### Null?
This one is defined only for the lists. It takes a list as an argument and checks if that list is empty or not. Returns `#t` (this is the Scheme way of saying `true`) if the list is empty, `#f` otherwise.

``` scheme
(null? '()) ;; returns #t
(null? '(shira)) ;; returns #f
```

#### Eq?
This one takes two non-numeric arguments, and checks if both are equal. Returns `#t` if they are, `#f` otherwise. Internally it checks if the reference to both of its parameters is same but it can be different for different implementations. More about it [here](http://stackoverflow.com/a/17719745/2084082).

`Note`: *I am not clear with the workings of this primitive yet, I may be wrong here*

``` scheme
(eq? 'atom 'atom) ;; returns #t
```

### Let's mix them up


Examples below show how these primitives can be mixed up together to achieve certain things


``` scheme
;; Let's first define some variables
(define fruits '(mango banana apple watermelon grapes))
(define breads '(chapati bhakri roti paratha))

(car (cdr fruits)) ;; banana
(car (cdr (cdr breads))) ;; roti

(cons (car (cdr fruits)) breads)
;; (banana chapati bhakri roti paratha)

(atom? (car fruits)) ;; #t

(null? (cdr '(void))) ;; #t
```


## Do it, Do it Again, and Again, and Again...

This is where the fun begins. This chapter introduces recursion, and starts introducing the so called - `Commandmends` This book is full of _exercises_ and theory is almost none. From now onwards, I will paste in code snippets and try to explain them in my words.

> A list is called a `lat` when every single element of the list is an `atom`. An empty list is also a `lat`.

The procedure is `lat?` which checks if the given list is a `lat` or not, is defined as below

``` scheme
(define lat?
  (lambda (list)
    (cond ((null? list) #t)
          ((atom? (car list)) (lat? (cdr list)))
          (else #f))))
```

The book explains the working of the procedure very nicely as it goes through each line with few examples and shows what will happen.

Let's run this procedure on `(an orange mango)` as `(lat? '(an orange mango))` and see the order in which it will execute.

> Note that, once `lat?` is invoked with the parameter `(an orange mango)`, `list` inside the procedure body will refer to the passed argument.

> `cond` in Scheme is a way of checking for specific conditions and take actions accordingly. It works linearly, and checks every condition from the start until it finds one which results in `#t` (true). If all conditions fail, it ends up running the part after `else`. So, `else` is always true. You can relate this with the `switch` statement found in other programming languages (assuming you are using `break;` on every `case` within it), so `default` can be mapped to the `else` part here.

> The structure of `cond` can be modeled as shown below


``` scheme
 (cond
   ((condition_1) (action_1))
   ((condition_2) (action_2))
   ((condition_3) (action_3))
   (else (default_action)))
```


Below is a step-wise explanation of how the procedure `lat?` above will work out, please refer to that while following up.

1. First we check if the passed in list is null with `(null? list)`. Since our list is `(an orange mango)`, it returns `#f` hense, we move on to check the next condition without going to the action part.
2. `(atom? (car list))` is the next condition. `(car list)` is `an`, and it is an atom, hense we found our first `#t` condition. Now we go forth and run the `action` part from this condition. Which is `(lat? (cdr list))`. Before we make a call to `lat?`, we evaluate `(cdr list)` - which is `(orange mango)`
3. We begin again, with a new list - `(orange mango)`. Check again if `(null? list)` where list is now `(orange mango)`. It is not, since it still has two elements, so we move onto the next condition without doing anything here.
4. Now evaluate `((atom? (car list)) (lat? (cdr list)))` the same way as we did in point `2` above. We end up calling `lat?` again with list as `(mango)`.
5. Try `((null? list) #t)` as described in points `1` and `3` above. Since we still have one element (`(mango)`), we don't go to the action part. We move on to the next condition.
6. This one again turns out to be true (because `mango` is an atom), and now we call `lat?` with an empty list (since `(cdr (list))` is `()` when list is `(mango)`)).
7. Now we ask `(null? list)` where list is `()`. And unlike all previous times, this time it is true. We goto the action part here for the first time, which simply returns `#t`.


Try following up the same procedure for `(why mangos so sweet?)`, and for `((watery) watermelon)`.


There is one more procedure in the same chapter, `member?` which takes two arguments - an atom and a list. It returns `#t` if given atom is present in the given list, else `f`. It can be realized as shown below.

``` scheme
(define member?
  (lambda (a lat)
    (cond ((null? lat) #f)
          ((eq? a (car lat)) #t)
          (else (member? a (cdr lat))))))
```

This procedure is very similar to the one we saw above. This can be put into words as -

> `member?` takes an atom and a list as an argument. It checks if given atom exists in the list by comparing it with the elements in the list one after another. As soon as it finds the atom, it returns true (and skips the comparison with remaining atoms). If it doesn't, it returns false.

Follow the snippet shown above for `(member? 'banana '(watermelon vs mangos vs banana))` and see how it works.

> ## First commandmend: Always ask `null?` as the first question in expressing any function.


This commandmend handles a situation in which the passed in list to the function is empty. If you track our `member?` procedure above, you will notice that, without `null?` in place we will end up using `car` on an empty list which is invalid according to its rules. `car` always needs a non-empty list. Hense the first commandment!

> Note: You can read the next part [here!](/2016/06/The-little-Schemer-pt-II/)
