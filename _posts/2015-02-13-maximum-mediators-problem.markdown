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

<img src="/assets/images/max-mediators-1.png" width="193px">

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




	def maxMediators(input1):
	    
	    # The order does not matter, so the line below
	    # is actually unnecessary but it was used for
	    # debugging purposes, it's easier to track ordered
	    # list than one which is in random order. 
	    childNodesOrder = [ch for ch in input1 if ch.startswith('C')]
	    
	    # Now we also need to know the locations of each of
	    # these 'C's in the graph. Then only we will be able
	    # to know who their parent/childs are. 
	    childNodesIndex = {ch: index for index, ch in enumerate(input1)
	    						if ch.startswith('C')}
	    
	    # The maximum number of mediators that can be present
	    # at any given time, or for any given input
	    # (assuming there are at least 2 owners)
	    totalMediatorsMax = 1

	    # To avoid recalculation of the length,
	    # since we're using its length twice
	    totalChilds = len(childNodesIndex)

	    # We iterate over the list of childs using two pointers.
	    # Using two loops we can scroll over all the possible
	    # combinations of any two elements in the array. Quite useful.
	    for i in range(totalChilds):

	        # This is our "from" child. Means we will now
	        # try to check the number of mediators between
	        # this and every other element
	        fromChild = childNodesOrder[i]

	        for j in range(i+1, totalChilds):
	            # ToChild. This is our target node.
	            toChild = childNodesOrder[j]

	            # Get the indexes of both the nodes.
	            fromChildIndex = childNodesIndex[fromChild]
	            toChildIndex = childNodesIndex[toChild]

	            # Now we want to calculate the number of
	            # mediators between `fromChild` and 
	            # `toChild` nodes, we count those in
	            # `currentMediators`
	            currentMediators = 0

	            # This is to know when our time comes
	            # to get out of the while loop
	            keepLooking = True
	            while keepLooking:

	                # The strategy is to travel from child
	                # nodes to parent nodes until both travellers
	                # meet at one place
	            	fromParent = fromChildIndex / 2
	            	toParent = toChildIndex / 2

	            	# check if there's a parentChild relation
	            	pc = True if (toParent/2==fromParent)\
	            			or (fromParent/2==toParent) else False

	                # If both the pointers match up, they match up on
	                # 1 mediator, so add 1 and break out.
	            	if fromParent == toParent:
	            		currentMediators += 1
	            		keepLooking = False
	            	elif pc:
	            		currentMediators += 2
	            		keepLooking = False
	            	else:
	                    # if both of the pointers have different values,
	                    # they both have seen 1 mediator each,
	                    # so add 2 and continu.
	            		currentMediators += 2
		            	fromChildIndex = fromParent
		            	toChildIndex = toParent

	            # If the number of mediators seen in current
	            # two childs/owners is greater than all seen so far,
	            # update the value.
	           	if currentMediators > totalMediatorsMax:
	           		totalMediatorsMax = currentMediators

	    return totalMediatorsMax