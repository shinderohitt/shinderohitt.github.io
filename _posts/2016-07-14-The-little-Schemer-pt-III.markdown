---
layout: post
title: "The little Schemer pt III"
date: "2016-07-14 22:38"
author: "Rohit Shinde"
tags:
- code
- scheme
- functional
- book
---

> Note: If you haven't read the [earlier part](/2016/06/The-little-Schemer-pt-II/), you might want to read that first.

> For most of the part, this is going to contain the Scheme snippets I wrote while reading the book, which may have little explanation going along with it at some points.

> Also, there is some content missing in between this post and the previous one. Unfortunately I lost the notes for that one (which were in my *scratch* buffer of Emacs).


The code below takes a list as an argument and returns `#t` if it's a set (ie. every element in it appears just once), and `#f` otherwise.

``` scheme
;; checks if the items in given list are all unique
(define set?
  (lambda (lat)
    (cond
      ((null? lat) #t)
      ((member (car lat) (cdr lat)) #f)
      (else
        (set? (cdr lat))))))

(set '(aha haha)) ;; #t
(set '(aapple apple banana banana)) ;; #f
```


This one returns a set if given a list of atoms (removes duplicates)

``` scheme
;; makeset using member
(define makeset
  (lambda (lat)
    (cond ((null? lat) lat)
          ((not (member (car lat) (cdr lat)))
           (cons (car lat) (makeset (cdr lat))))
          (else (makeset (cdr lat))))))

(makeset '(apple peach apple apple apple rohit apple))
;; (peach rohit apple)
```


This one is same as above, except it uses `multirember` to make a set.

``` scheme
;; makeset using multirember

(define multirember
  (lambda (a lat)
    (cond
     ((null? lat) '())
     ((eq? (car lat) a)
      (multirember a (cdr lat)))
     (else
      (cons (car lat) (multirember a (cdr lat)))))))


(define makeset
  (lambda (lat)
    (cond ((null? lat) lat)
          (else (cons (car lat)
                      (makeset (multirember (car lat) lat)))))))

(makeset '(apple peach apple apple rohit rohit))
;; (apple peach rohit)
```


Both the definitions for `subset` work the same way (almost). The first one does an unnecessary `and`.

``` scheme
(define subset
  (lambda (s1 s2)
    (cond ((null? s1) #t)
          (else (and
                 (member (car s1) s2)
                 (subset (cdr s1) s2))))))

(define subset
  (lambda (s1 s2)
    (cond ((null? s1) #t)
          ((member (car s1) s2)
           (subset (cdr s1) s2))
          (else #f))))
(subset '(flowers fruits)
    '(popai loves flowers and fruits))
;; #t
```


Checks if both passed in sets are equal (order doesn't matter in sets, so, check if every element from set s1 is present in s2 and vice versa).

``` scheme
(define eqset
  (lambda (s1 s2)
    (cond ((and (null? s1)
                (null? s2)) #t)
          ((member (car s1) s2)
           (eqset (cdr s1)
                  (multirember (car s1) s2)))
          (else #f))))

;; better solution (using subset) below
(define eqset
  (lambda (s1 s2)
    (and (subset s1 s2)
         (subset s2 s1))))
(eqset '(one apple and papaya) '(one papaya and apple))
;; #t
```


`intersect`: Get the common elements to both the sets.

``` scheme
(define intersect
  (lambda (s1 s2)
    (cond ((null? s1) #f)
          (else (or (member (car s1) s2)
                    (intersect (cdr s1) s2))))))
(define intersect
  (lambda (s1 s2)
    (cond ((null? s1) s1)
          ((member (car s1) s2)
           (cons (car s1)
                 (intersect (cdr s1) s2)))
          (else (intersect (cdr s1) s2)))))
(intersect '(macaroni and) '(stewed tomatos macaroni and))
;; (macaroni and)
```


``` scheme
(define union
  (lambda (s1 s2)
    (cond ((null? s1) s2)
          ((member (car s1) s2)
           (union (cdr s1) s2))
          (else
           (cons (car s1) (union (cdr s1) s2))))))
(union '(oranges are orange) '(bananas are yellow))
;; (oranges orange bananas are yellow)
```


``` scheme
(define difference
  (lambda (set1 set2)
    (cond
     ((null? set1) set1)
     ((member (car set1) set2)
      (difference (cdr set1) set2))
     (else (cons (car set1)
                 (difference (cdr set1) set2))))))
(difference '(foo bar baz haha) '(foo bar baz hal))
;; (haha)
```


`intersectall` works with nested lists, and returns a list with a set of common elements to all of them.

``` scheme
(define intersectall
  (lambda (l-set)
    (cond ((null? (cdr l-set)) (car l-set))
          ((null? (car l-set)) (quote ()))
          (else (intersectall
                 (cons (intersect (car l-set)
                                  (car (cdr l-set)))
                       (cdr (cdr l-set))))))))

;; much better solution in the book
(define intersectall
  (lambda (l-set)
    (cond
     ((null? (cdr l-set)) (car l-set))
     (else (intersect (car l-set)
                      (intersectall (cdr l-set)))))))
(intersectall '((a r b) (l k p a) (h j a l) (a)))
;; (a)
```


A `pair` is a list with two elements. `a-pair` checks if given list is a `pair`.

``` scheme
(define a-pair?
  (lambda (lat)
    (cond ((atom? lat) #f)
          ((null? lat) #f)
          ((null? (cdr lat)) #f)
          ((null? (cdr (cdr lat)) #t))
          (else #f))))
(a-pair? '(a b)) ;; #t
(a-pair? 'ezzit?) ;; #f
(a-pair? '((hmm) ((yes) (really!)))) ;; #t
```


`firsts` (from chapter #3), accepts a nested list (list of lists), and returns a list of first element from each nested list (each element list). `fun?` checks if given relation (something like `((8 3) (4 2) (7 6) (6 2) (8 4))`) is a valid relation by checking if the first element from each `pair` element in the given list is unique.

``` scheme
(define firsts
  (lambda (l)
    (cond
     ((null? l) '())
     (else
      (cons (car (car l)) (firsts (cdr l)))))))

(define fun?
  (lambda (lat)
    (set? (firsts lat))))

(fun? '((8 3) (4 2) (7 6) (6 2) (8 4))) ;; #f
(fun? '((8 3) (4 2) (7 6) (6 2) (1 4))) ;; #t
```


`revrel` reverses the positions of all pairs within the given list.

``` scheme
(define first
  (lambda (l)
    (car l)))
(define second
  (lambda (l)
    (car (cdr l))))
(define revpair
  (lambda (p)
    (cons (second p)
          (cons (first p)
                (quote ())))))
(define revrel
  (lambda (lat)
    (cond ((null? lat) lat)
          (else (cons (revpair (car lat))
                      (revrel (cdr lat)))))))

(revrel '((11 22) (12 24) (10 20)))
;; ((22 11) (24 12) (20 10))

```
