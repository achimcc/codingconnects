---
layout: 'post'
title: Typization of the Redux Store
author: [Achim]
date: '2020-12-23T08:00:00.169Z'
draft: false
permalink: 'testing-redux-components'
category: 'Coding'
tags:
  - 'Coding'
excerpt: 'I pick up the Redux Architecture which I developed in my last two posts and show how to obtain a typization of the Redux hooks. For this, I introduce and explain discriminated union types.'
image: 'img/typization.jpg'
---

####Unit testing of Redux Components and Redux Store

##Klein!

I want to test my Kanban-Board App, which I developed in my previous posts. For unit testing, I render (or mount) one isolated component. But in this App most single components will depend on the global redux store, to which they connect by `useDispatch()` or `useSelect()` hook. Hence, there is no out of the box solution for testing. We can use the full Redux Store and pass it to our component, but then our tests will not only affect our isolated component but also the reducers (and probably also the middleware, I plan to introduce in a later post).

For unit testing, I use [redux-mock-store](https://github.com/reduxjs/redux-mock-store), which provides a simple mock store which does its purpose for integration testing and allows me to keep track of the dispatched actions without involving other parts of the code.

At first I repeat all the steps which I did in [this](testing-a-react-library) post. Then I add `redux-mock-store` to dev dependencies:

```
yarn add -D redux-mock-store
```

In my case, I can configure the mock-store in my test file by:

```
const mockStore = configureMockStore();
```

and initialize it afterwards with:

```
const store = mockStore({});
```

Since I want to keep track of the action which the component is dispatching, I override the default dispatch() function of the store:

```
store.dispatch = jest.fn();
```

Now, after passing the store to the component and mounting it, I can simulate events which are dispatching actions and I can keep track of the and check them by examining `store.dispatch`. Here is the code which handles the unit testing of my submitTask component:

```typescript{numberLines:0}
// /src/components/submitTask/SubmitTask.test.tsx
import SubmitTask from "./SubmitTask";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import { Store } from "redux";
import { act } from "react-dom/test-utils";

const mockStore = configureMockStore();

describe("Task", () => {
  let store: Store;
  let component: any;
  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
    component = mount(
      <Provider store={store}>
        <SubmitTask />
      </Provider>
    );
  });

  it("is truthy and mounted component is visible", () => {
    expect(SubmitTask).toBeTruthy();
    expect(component).toBeVisible;
  });

  it("to match snapshot", () => {
    expect(component).toMatchSnapshot();
  });

  it("is dispatching create action with correct title", () => {
    act(() => {
      const input = component.find("input").at(0);
      input.props().onChange({
        currentTarget: { value: "Test Title" },
      });
    });
    component.find("button").simulate("click");
    expect(store.dispatch).toHaveBeenCalled;
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "CREATE",
        title: "Test Title",
      })
    );
  });
});
```


I use
