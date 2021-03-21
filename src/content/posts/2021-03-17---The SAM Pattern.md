---
layout: post
title: The SAM pattern
author: [Achim]
date: 2021-03-17T08:00:00.169Z
draft: false
permalink: samp-pattern
category: Coding
tags:
  - TypeScript
  - Architecture
  - Reactive Programming
  - React
excerpt: About asynchronous event handling with JavaScript and TypeScript. I'm showcasing the potential of rxjs with a very first and simple example which implements drag and drop.
image: img/marbles.jpg
---

I discuss here an architecture model which is an alternative to more common models like Redux or MVC. It goes back to [
Jean-Jacques Dubray](https://github.com/jdubray) and his blog post [Why I No Longer Use MVC Frameworks](https://www.infoq.com/articles/no-more-mvc-frameworks/). It is also presented and explained in the last chapter of the book [Front-End Reactive Architectures](https://www.springer.com/de/book/9781484231791).

My interested in this model originates from the search for clean seperation of the business logic from the view. In Redux for example, you can palce some business logic intio the reducer. Indeed, it is recmmended in the redux style guid to place [Put as Much Logic as Possible in Reducers](https://redux.js.org/style-guide/style-guide#put-as-much-logic-as-possible-in-reducers). 

```mermaid
stateDiagram-v2
state DOM {
  UI
}
nap --> dispatch
UI --> dispatch
state Actions {
  dispatch --> action
}
action --> model
state Model {
  model --> 'state
  'state --> nap
}
'state --> stateRepresentation
state View {
  stateRepresentation --> view
  stateRepresentation --> display
}
display --> UI

```

    /*
    
    state --> stateRepresentation
    nap --> dispatch
    stateRepresentation --> view
    stateRepresentation --> display
    display --> UI
    */
