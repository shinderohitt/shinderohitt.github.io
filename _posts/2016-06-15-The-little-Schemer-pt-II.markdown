---
layout: post
title: "The little Schemer pt II"
date: "2016-06-15 19:55"
author: "Rohitt Shinde"
tags:
- code
- scheme
- functional
- book
---

> Note: If you haven't read the [earlier part](/2016/06/The-little-Schemer-pt-I), you might want to read that first.

### Cons the Magnificent
We are going to start off with a snippet from the book and explain below what happens for an example. The procedure given below is defined with name `rember`. The name can be meaningful if seen as - `remove a member`.

It takes two arguments - an atom and a list. If the given atom is present in the list, it removes the first occurance of that atom from the list and returns it.

``` scheme
(define rember
  (lambda (a seq)
    (cond ((null? seq) (quote ())) ;; remember the first commandment?
          ((eq? a (car seq)) (cdr seq))
          (else (cons (car seq)
                      (rember a (cdr seq)))))))

(rember 'rice '(poori and rice chole))
;; returns - (poori and chole)
```

---

Let's try to visualise how the example above will work with `rember`! Below, we follow the code and try to evaluate it manually and keep track of variables and how their values change from one call to another. Since this is a recursive procedure, we break down the process in separate calls as they would be made with the given example. Starting below with the `first call`.


    
first call | a = rice | seq = (poori and rice chole)
    
We check each condition from `cond` until we find one that
results in `true` (Remember: `else` is always true)


1. (null? seq)  => False. Because seq = `(poori and rice chole)`
2. (eq? a (car seq))  => False. `rice` is not the same as `poori`, is it?
3. (else ( ... )) => True. `else` is always true.
    
Now we go to the action part where we are making a new call to the same function. Note that we are recurring here by calling the same function within `else`.
We make a new call to the same function with **new arguments**. Also, we are not simply calling the function for the second time, but we are `cons`ing the first element of `seq` on whatever the second call returns! Let's make a note of that below, and move on to the next call!

> (cons 'poori '(`returned list from second call`))
    
second call | a = rice | seq = (and rice chole)
    
Note that the value of `seq` has changed now, because when this second call was made from `else` part, we passed `cdr` of original `seq`. Which is a new list with first element removed.

1. (null? seq)  => False. Because seq = (and rice chole)
2. (eq? a (car seq))  => False. `rice` is not the same as `and`, right?
3. (else ( ... )) => True. `else` is always true.

Ha! Seems like our work is not done, and we need to call `rember` again. Like before, let's make a note that we have to `cons` the `car` of `seq` on whatever is returned from the next call! Also, remember that the next call will have `seq` set to `(rice chole)`.

> (cons 'and '(`returned list from third call`))

third call | a = rice | seq = (rice chole)

Let's begin with the questions.

1. (null? seq)  => False. Because seq = (rice chole)
2. (eq? a (car seq))  => True. `rice` is same as the `rice`. Awesome!

It's over, no need to call `rember` again! Let's see what happens now. The whole `cond` line for this condition looks like - `((eq? a (car seq)) (cdr seq))`. The second (action) part says, return whatever's there in the list except the first element. This call returns the value of `(cdr seq)` (which is `(chole)` in this case) to its callee (which is `second call` above!).

This is where "reductions" starts. We start collecting the values and keep going back to where we came from. The flow of how calls appeared can be depicted as shwon below.

```
              
            +--> (first call)
            |        |        (a = rice, seq = (poori and rice chole))
             \       |
              \     \|/
        +--->  (second call)
      /              |        (a = rice, seq = (and rice chole))
     /               |
    /               \|/
   |            (third call)
   |                 |        (a = rice, seq = (rice chole))
   |                 |        This is where `(eq? rice (car seq))`
    \               /         becomes true, and we start returning
     \ _ _ _ _ _ _ /          values, travelling towards the callers.
       returning
       (chole)

```

The calls happen the way they are shown in the diagram above. Let's look at the `else` part one more time.

``` scheme
(else (cons (car seq)
            (rember a (cdr seq))))
```
Note that we are doing a `cons` of the first element of `seq` on whatever's returned from a new call to `rember`. Now check out the textual figure above again. We are returning from `third call` to `second call`. We have kept track of what `second call` is going to `cons` over `third call`s returned list. It is an `and`.

`(second call)`s final value after `cons` within `else` then becomes `(and chole)`. This will again be returned to the `first call`.

`(first call)`s `else` part looks something like: `(cons poori (value returned from second call))`. (see above). We are getting `(and chole)` from the second call. Hense, `first call` finally returns `(poori and chole)`.

---

> ## The Second Commandmend
> Use `cons` to build lists.

---

Let's see more functions like the `rember` above. Only code snippets for the functions and what to expect for some inputs is given.

#### `firsts`
Accepts a list of lists, and returns a list with all first elements from each element (which is a list) of given list.

``` scheme
(define firsts
  (lambda (l)
    (cond
     ((null? l) (quote ()))
     (else
      (cons (car (car l))
            (firsts (cdr l)))))))
;; Examples
(firsts '((1 2)
          (3 4)
          (5 6)) )
;; returns (1 3 5)

(firsts '((a b c)
          (d e f)) )
;; returns  (a d)

```

#### `insertR`
Expects three arguments, `new`, `old` and `lat`. First two are atoms, and third is a list. It compares each element one after another from the list with `old` and if found, it inserts `new` to the right side of `old` and returns this new list.

``` scheme
(define insertR
  (lambda (new old lat)
    (cond ((null? lat) (quote ()))
          ((eq? old (car lat))
           (cons old
                 (cons new (cdr lat))))
          (else (cons (car lat)
                      (insertR new old (cdr lat)))))))
;; Example
(insertR 'e
         'd
         '(a b c d f g))
;; returns
(a b c d e f g)
```

#### `insertL`
Exactly same as above, but instead of inserting the new element to the right of old element, this one inserts it to the left of it.

``` scheme
(define insertL
  (lambda (new old lat)
    (cond ((null? lat) (quote ()))
          ((eq? old (car lat))
           (cons new lat))
          (else (cons (car lat)
                      (insertL new
                               old
                               (cdr lat)))))))
(insertL 'e
         'd
         '(a b c d f g))
;; returns
(a b c e d f g)
```

#### `subst`
As the name suggests (`subst` does not suggest anything. `substitute` does.), we replace one element with other from given list. To put its workings in words - `subst` takes three parameters - `new`, `old` and `lat`. `old` being the existing element from `lat`, and `new` the one which will take place of `old` in `lat` - which is a list. `subst` compares elements of `lat` from start one after another till it finds an occurance of `old` upon which it replaces it with `new` and returns the remaining list as is. English is tricksy. Code isn't. Check below.

``` scheme
(define subst
  (lambda (new old lat)
    (cond ((null? lat) (quote ()))
          ((eq? old (car lat)) (cons new (cdr lat)))
          (else (cons (car lat)
                      (subst new old
                             (cdr lat)))) )))
(subst 'e
       'd
       '(a b c d f g))
;; returns
(a b c e f g)

```

#### `subst2`
This is a variation of function above. This takes one more "`old`" parameter. That way it will receive two `old` params. It will replace `new` with the `old` which occures the first time, and returns the new list.

``` scheme
(define subst2
  (lambda (new ol1 ol2 lat)
    (cond ((null? lat) (quote ()))
          ((eq? ol1 (car lat))
           (cons new (cdr lat)))
          ((eq? ol2 (car lat))
           (cons new (cdr lat)))
          (else (cons (car lat)
                      (subst2 new ol1 ol2
                              (cdr lat)))))))
(subst2 'blah
        'banana
        'mango
        '(I like mango and banana))
;; returns
(i like blah and banana)
```

#### `multirember`
Removes all occurances of given atom from the given list.

``` scheme
(define multirember
  (lambda (a lat)
    (cond ((null? lat) (quote ()))
          ((eq? a (car lat)) (multirember a (cdr lat)))
          (else (cons (car lat)
                      (multirember a (cdr lat)))))))
(multirember 'a
             '(b a c d a f))
;; returns (b c d f)
```

#### `multiInsertR`
Inserts `new` to the right of every occurance of `old` in given list `lat`.

``` scheme
(define multiInsertR
  (lambda (new old lat)
    (cond ((null? lat) (quote ()))
          ((eq? old (car lat))
           (cons old (cons new (multiInsertR new old (cdr lat)))))
          (else (cons (car lat)
                      (multiInsertR new old (cdr lat)))))))
(multiInsertR 'konkani
              'mango
              '(mango is sweet as sugar. mango is the best))
              
;; returns
;; (mango konkani is sweet as sugar. mango konkani is the best)
```

#### `multiInsertL`
Same as above; but we put in the `new` atom to the left of `old`.

``` scheme
(define multiInsertL
  (lambda (new old lat)
    (cond ((null? lat) (quote ()))
          ((eq? old (car lat))
           (cons new (cons old (multiInsertL new old (cdr lat)))))
          (else (cons (car lat)
                      (multiInsertL new old (cdr lat)))))))
```

#### `multisubst`
Changes every occurance of `old` by `new` in given list `lat`.

``` scheme
(define multisubst
  (lambda (new old lat)
    (cond ((null? lat) (quote ()))
          ((eq? old (car lat))
           (cons new (multisubst new old (cdr lat))))
          (else (cons (car lat)
                      (multisubst new old (cdr lat)))))))
(multisubst 'watermelon
            'mango
            '(mango is the king of the fruits))
;; returns (watermelon is the king of the fruits)
```


Meanwhile, somewhere in between explaining all those methods above, the book mentions next Commandmends.

---

> ## The Third Commandmend
> When building a list, describe the first typical element, and then `cons` it onto the natural recursion.

---

This one refers the `firsts` procedure shown above, as to build the resultant list, we take the first element (typical element) from a list (which is an element of the original list) and `cons` it onto the resultant list (which is a result of the natural recursion)

---

> ## The Fourth Commandmend
> Always change at least one argument while recurring. It must be changed to be closer to termination. The changing argument must be tested in the termination condition: when using `cdr`, test termination with `null?`.

---

In recursive procedures, there is always a danger of them running for infinite amount of time - which means, it will keep on running without ever stopping. Whenever the function makes a new call to itself, it needs extra resources to run the same code again with new parameters. Given that our computers have limited resources -- in such scenarios, we quickly run out of memory. Fortunately, the Interpreters have a recursion depth limit set in so it won't eat up all of your memory and stop after some time with an error. This commandmend prevents this but also reminds us to - keep dividing the problem to get closer to the solution.
