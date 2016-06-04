---
layout: post
title: "SICP solution to Exercise 1.17"
date: "2016-06-04 16:00"
author: "Rohitt Shinde"
tags:
- code
- algorithms
- problem
- sicp
---


### The Problem
We are given a procedure to multiply two numbers which runs with O(n) complexity (add 4 to itself 5 times to multiply 4 and 5). We are supposed to write a procedure that runs with O(log n) complexity. Here we are allowed use `halve` and `double` procedures (doing the same work as the name suggests) to achieve the task.

The snippet that works with linear time is given in the book

```scheme
(define (* a b)
  (if (= b 0)
      0
      (+ a (* a (- b 1)))))
```

If we call it with `(* 4 5)`, we can illustrate how it would work with the substitution method

```
(* 4 5)
(+ 4 (* 4 4))
(+ 4 (+ 4 (* 4 3)))
(+ 4 (+ 4 (+ 4 (* 4 2))))
(+ 4 (+ 4 (+ 4 (+ 4 (* 4 1)))))
(+ 4 (+ 4 (+ 4 (+ 4 (+ 4 (* 4 0))))))
(+ 4 (+ 4 (+ 4 (+ 4 (+ 4 0)))))
(+ 4 (+ 4 (+ 4 (+ 4 4))))
(+ 4 (+ 4 (+ 4 8)))
(+ 4 (+ 4 12))
(+ 4 16)
20
```


***


### A solution


This is a linear time procedure because the number of steps we need to take to get to the answer grows linearly with the input. For instance, instead of `4 * 5` if we do `4 * 10` that would exactly be `5` more additions than before. Now we are supposed to write a procedure that runs with logarithmic time. That is, it should need **only one** extra computation when we **double** the input!

The solution is given in the question itself. So, instead of adding `4` to itself `5` times, we double `4` every time and halve `5` to cut the number of additions by half every time. There is a case we need to take care of though. We should make sure the second input here is an even number or it runs into fractions. A simple way to handle it is to check if the number is even, if it is, use the method given above, if not, use the new method of halving and doubling.

I could come up with the solution given below


``` scheme
(define (halve n)
  (/ n 2))
(define (double n)
  (+ n n))

(define (* a b)
  (+ a (mult a b)))

(define (mult a b)
  (if (= b 1)
      0
      (+ a
         (if (even? b)
               (mult (double a) (halve b))
               (mult a (- b 1))))))
```


The first thing I do after solving an exercise is look up for solutions given by others and I found a better one given below. From [this page](http://www.billthelizard.com/2010/01/sicp-exercise-117-multiplication-by.html).



```scheme

(define (double x)
   (+ x x))

(define (halve x)
   (/ x 2))

(define (fast-mult a b)
   (cond ((= b 0) 0)
         ((= b 1) a)
         ((even? b) (double (fast-mult a (halve b))))
         (else (+ a (fast-mult a (- b 1))))))

```
