---
layout: post
title: "The maximum mediators problem"
date: "2016-02-13 16:00"
author: "Rohitt Shinde"
tags:
- code
- algorithms
- problem
---

### Problem Statement

There are some team owners who want to communicate with other team owners(C) through some mediators(D) regarding player transfer mechanism. A team owner has to consult atleast 1 mediator in order to communicate with some other team owner. Each mediator can have maximum of 2 mediators under it and a mediator which has no mediator under it will have at least one team owner and at max 2 team owners under it. A mediator which has at least one mediator under it will not have any team owner under it. Your task is to find the maximum number of mediators between the conversations of any two team owners.

This is visualized as a tree below


---

#### Inputs
Input is an array representation of the tree. Which uses Eytzinger's method to represent the tree. In this, the nodes of the tree are laid out in breadth first manner. The root is located at location 1 in the array. To get the left child of any node, we multiply the index of the node by 2. To get the right child, we multiply node's index by 2 and add 1. 

To generalize

  >* To get the right child: `N x 2` where N is the index of the parent node
  >* To get the left child:  `(N x 2) + 1` where N is the index of the parent node
  >* To get the parent: `floor(N/2)` where N is the index of the child

---

The idea is visualized in the figure shown below
![alt binary-tree](/assets/images/max-mediators-0.png "Array representation of a tree")

---

We are given a tree in form of an array and we are supposed to find the maximum number of mediators that can be present in any given two owners. A problem can have multiple solutions but the one I could come up with is below.
