---
layout: 'post'
title: Typization of the Redux Store
author: [Achim]
date: 2020-12-23T08:00:00.169Z
draft: false
permalink: 'typization-of-redux-actions'
category: 'Coding'
tags:
  - 'TypeScript'
  - 'React'
  - 'Discriminant Union Types'
  - 'Cathegory Theory'
excerpt: 'I pick up the Redux Architecture which I developed in my last two posts and show how to obtain a typization of the Redux hooks. For this, I introduce and explain discriminated union types.'
image: 'img/typization.jpg'
---

I focus in this article on one unsatisfying detail of the Redux setup of the last two posts. There we were dispatching actions to the store, whose types were defined as:

```javascript
// /src/type.d.ts:
...
type TaskAction = {
  type: TaskActions;
  payload: any;
};
...
```

Here the `payload: any` typization is unsatisfying, but seems to be necessary, since different actions carry different data, depending on the type of store update. As long as we dispatch actions by using action creators, this is less problematic as it seems. On the other hand, more complex action creators might become problematic. And, with a concept of strong typization of the actions them self, we can completely drop the action creators.

What I use to obtain a strong typization of the redux actions together with the useDispatch and useSelector hooks is the concept of singletons and discriminant union types, which I want to introduce now.

### Singletons and Union Types

A [Singleton](<https://en.wikipedia.org/wiki/Singleton_(mathematics)>) in mathematics, is a [set](<https://en.wikipedia.org/wiki/Set_(mathematics)>) which contains exactly one element. In TypeScript, if we understand a set as all existing elements of a specific type, the type of objects(elements) is defining the sets containing all the possible objects of the specific type. Here a singleton type is a type, whose only possible object's value is identical with the object's type. While we can see "Cat" as an object of type string, we can also understand it as the only object type "Cat".

Hence, constants can be understood as Singletons:

```javascript
const x = 'hello';
const y = 10;
```

Here `x` and `y` are our Singletons. We can make this more explicit by using the type declaration:

```javascript
type x = 'hello';
type y = 10;
```

We can use the Singletons to build Union Types:

```javascript
type cat = 'cat';
type dog = 'dog';
type bird = 'bird';
type animal = cat | dog | bird;
```

A very simple example for this is the variable of type Boolean, which is of type `"true" || "false"`.

In practice, Union Types don't seem to provide a big advantage, compared to the usage of Enums. This changes with Discriminant Union Types:

### Discriminant Union Types

We can define a type by combining different interfaces which share some but not all of their properties:

```javascript
interface Bike = {
  type: "bike";
  wheels: 2;
}

interface Car = {
  type: "car";
  wheels: number;
  fuel: string;
}

type Vehicle = Bike | Car;
```

We have a new type which either has the Properties defined in `Car` or the properties defined in `Bike`, but it will always have the properties which are in the intersection of properties of both of them, these are the properties `type` and wheels!

We can define a function which receives a vehicle as input:

```javascript
function printVehicle(vehicle: Vehicle) {
  console.log(`This vehicle hast ${vehicle.wheels} wheels`);
}
```

Which works fine. But when we define:

```javascript
function printVehicle(vehicle: Vehicle) {
  console.log(`This vehicle hast ${vehicle.wheels} wheels`);
  console.log(`This vehicle needs ${vehicle.fuel}`);
}
```

The TypeScript compiler will even fail to compile. This is since the property `vehicle.fuel`doesn't exists on the `vehicle` of sub-type `bike`! What we can do, to fix this, is called type-guarding:

```javascript
function printVehicle(vehicle: Vehicle) {
  console.log(`This vehicle hast ${vehicle.wheels} wheels`);
  switch (vehicle.type) {
    case 'car':
      console.log(`This vehicle needs ${vehicle.fuel}`);
      break;
    default:
      console.log(`This vehicle doesn't need any fuel`);
  }
  console.log(`This vehicle hast ${vehicle.wheels} wheels`);
}
```

Here, the patterns and structures already show some similarity to Actions and Reducers.

### Typization of Actions and Reducers with Discriminant Union Types

I redefine the type and interface by using discriminant union types:

```javascript
// /src/type.d.ts

interface Task {
  id: number;
  title: string;
  status: import("./common").TaskStatus;
}

type Actions = "CREATE" | "SET_STATUS" | "DELETE";

interface ActionCreate {
  type: "CREATE";
  title: string;
  id: number;
}

interface ActionSetStatus {
  type: "SET_STATUS";
  id: number;
  status: import("./common").TaskStatus;
}

interface ActionDelete {
  type: "DELETE";
  id: number;
}

type TaskAction = ActionCreate | ActionSetStatus | ActionDelete;

type TasksState = {
  tasks: {
    byIds: Object<ITask>;
    allIds: Array<number>;
  };
};

type UIState = {
  taskStatus: Object<Array<number>>;
};

interface RootState {
  data: TasksState;
  ui: UISTate;
}

type DispatchType = (args: TaskAction) => TaskAction;
```

We implement the new typization in our reducers, the `taskReducer`:

```javascript
// /src/store/taskReducer.ts:

import { produce } from 'immer';

const initialState: TasksState = {
  tasks: {
    byIds: {
      1: {
        title: 'item 1',
      },
      2: {
        title: 'item 2',
      },
      3: {
        title: 'item 3',
      },
    },
    allIds: [1, 2, 3],
  },
};

const tasksReducer = (state: TasksState = initialState, action: TaskAction): TasksState =>
  produce(state, (draft: TasksState) => {
    switch (action.type) {
      case 'CREATE': {
        const { title, id } = action;
        draft.tasks.byIds[id] = { id, title };
        draft.tasks.allIds.push(id);
        break;
      }
      case 'DELETE':
        const { id: idToDelete } = action;
        delete draft.tasks.byIds[idToDelete];
        draft.tasks.allIds = draft.tasks.allIds.filter(id => id !== idToDelete);
        break;
    }
  });

export default tasksReducer;
```

And the `uiReducer`:

```javascript
// /src/store/uiReducer.ts:

import { TaskStatus } from '../../common';
import { produce } from 'immer';

const initialState: UIState = {
  taskStatus: {
    [TaskStatus.ToDo]: [1],
    [TaskStatus.Doing]: [2],
    [TaskStatus.Done]: [3],
  },
};

const uiReducer = (state: UIState = initialState, action: TaskAction): UIState =>
  produce(state, (draft: UIState) => {
    switch (action.type) {
      case 'CREATE': {
        const { id } = action;
        draft.taskStatus[TaskStatus.ToDo].push(id);
        break;
      }
      case 'SET_STATUS': {
        const { status: taskStatus, id: idToUpdate } = action;
        Object.values(TaskStatus).forEach(status => {
          if (taskStatus === status) draft.taskStatus[status].push(idToUpdate);
          else
            draft.taskStatus[status] = draft.taskStatus[status].filter(
              (id: number) => id !== idToUpdate,
            );
        });
        break;
      }
      case 'DELETE': {
        const { id: idToDelete } = action;
        Object.values(TaskStatus).forEach(
          status =>
            (draft.taskStatus[status] = draft.taskStatus[status].filter(
              (id: number) => id !== idToDelete,
            )),
        );
        break;
      }
    }
  });

export default uiReducer;
```

I needed to replace the ActionType Enums by string to discriminate over the type property. But this is unproblematic, since every non-existing string literal (singleton) which is used somewhere in the app will throw a compile-time error.

### Typization of useDispatch and useSelector

We've achieved a typed version of our actions and reducers. Up to now, the dispatch function that is initiated by the `useDispatch` hook is still accepting an arbitrary action object as input which might throw errors in the reducer at runtime. We can solve this problem by defining our own custom `useDispatch` hook (and later on, our own `useSelector` hook).

I define the hook together with the store in `/src/store.index.ts`:

```javascript
// /src/store.index.ts:
import { useDispatch as _useDispatch } from "react-redux";
...

...

function useDispatch(): DispatchType {
  const dispatch = _useDispatch();
  return (action: TaskAction) => dispatch(action);
}

export { store, useDispatch };
```

This is already a typed version of the `useDispatch` hook. If we import our custom `useDispatch` hook from `/src/store.index.ts` instead of `react-redux` everywhere in the project, this already guarantees type safety for our dispatcher!

For the `useSelector` hook, the implementation is a bit more tricky: the hook receives the store as input and produces an output, which is defined by the selector. But by using TypeScript [Generics](https://www.typescriptlang.org/docs/handbook/generics.html) we can achieve a typization:

```javascript
// /src/store.index.ts:
import { createSelectorHook, useDispatch as _useDispatch } from "react-redux";

...

const _useSelector = createSelectorHook<RootState>();

function useSelector<T>(fn: (store: RootState) => T): T {
  return fn(_useSelector((x) => x));
}

export { store, useDispatch, useSelector };
```

Here our `useSelector` hook receives the selector function as input and declares its return type by determining the selector's return type `T` (from a mathematician's perspective, in terms of [category theory](https://en.wikipedia.org/wiki/Category_theory), we apply a [contravariant functor](https://en.wikipedia.org/wiki/Functor) to the `useSelector` hook, while the transformation of the `useDispatch` hook is covariant).

Here is the full final implementation of `/src/store/index.ts`:

```javascript
// /src/store/index.ts:

import { createSelectorHook, useDispatch as _useDispatch } from "react-redux";
import { combineReducers, createStore } from "redux";
import tasksReducer from "./tasks/tasksReducer";
import uiReducer from "./ui/uiReducer";

const store = createStore<IRootState, any, any, any>(
  combineReducers({
    data: tasksReducer,
    ui: uiReducer,
  })
);

function useDispatch(): DispatchType {
  const dispatch = _useDispatch();
  return (action: TaskAction) => dispatch(action);
}

const _useSelector = createSelectorHook<RootState>();

function useSelector<T>(fn: (store: RootState) => T): T {
  return fn(_useSelector((x) => x));
}

export { store, useDispatch, useSelector };
```

And that's it. We achieved a typed version of our Kanban-Board. You can review the full source code on the [#typization branch](https://github.com/achimcc/kanban-board/tree/typization) of the Kanban-Board GitHub Repo.
