# Mimics

React HOC (Higher-Order Component) which provides easy way to manage state and adds posibility to communicate with other components via RxJS.

# Usage

Let's start with simple Mimic Component:
```js
import { MimicComponent } from 'mimics';

@MimicComponent
class SimpleComponent extends React.Component {
    ...
}
```

Ok, now we have simple `MimicComponent`. But what it gives to us?

It adds `communicator` property and `update` and `send` methods. Let's see what are those:

- `communicator` - instance of `MimicCommunicator` which gives us an access to the world of mimics.
We could send any events to self or to other `MimicComponent`. It has few methods to do that:
  - `update(props)` - rerender mimic component with new props.
  - `send(event, payload)` - send an `event` to current mimic component.
  - `group(groupName)` - set the **group** to which event will be sent.
  - `component(componentClass)` - set the **mimic component** to which event will be sent.
  - `allComponents()` - tells to communicator to send events to all `MimicComponent`.

- `update(props)` - shortcut for `communicator.update(props)`.
- `send(event, payload)` - shortcut for `communicator.send(event, payload)`.

Also it provides `@on(event, streamModifier)` decorator to bind callbacks to our events.
`comunicator`,`currentState` and `payload` will be passed to callback function afted event will be triggered.


So let's make our component a little bit smarter:
```js
import { MimicComponent } from 'mimics';

@MimicComponent
class SimpleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onIncrement = this.onIncrement.bind(this);
    }

    static defaultProps = {
        count: 0,
    }

    onIncrement() {
        this.update({ count: this.props.count + 1 });
    }

    render () {
        <div>
            <div>Count: {this.props.count}</div>
            <button onClick={this.onIncrement}>Increment</button>
        </div>
    }
}
```
Ok, now our component can change own state.


Let's do the same but via events. First we need to create dispatcher:
```js
import { MimicComponent, on } from 'mimics';

class SimpleDispatcher {
    @on('onIncrement')
    static onIncrement(communicator, state, payload) {
        communicator.update({ count: state.count + payload.delta });
    }
}
```

After that we have to tell which dispatcher to use in our component and call `send`:
```js
@MimicComponent
class SimpleComponent extends React.Component {
    static dispatcher = SimpleDispatcher;

    constructor(props) {
        super(props);
        this.onIncrement = this.onIncrement.bind(this);
    }

    static defaultProps = {
        count: 0,
    }

    onIncrement() {
        this.send('onIncrement', { delta: 1 });
    }

    render () {
        <div>
            <div>Count: {this.props.count}</div>
            <button onClick={this.onIncrement}>Increment</button>
        </div>
    }
}
```

# Events sending

By default `communicator.send()` is sending events to the same component where it was called.
But what if we want to say "hello" to others?
Let's take a look on how our `SimpleComponent` can do that:
- `this.communicator.group('friends').send('hello')` - will send event to all `SimpleComponent` in group "**friends**". You could set group by passing property `mimicGroup`.
- `this.communicator.component(SomeOtherComponent).send('hello')` - will send event to all `SomeOtherComponent`.
- `this.communicator.allComponents().send('hello')` - will send event to **all** `MimicComponent`.

Also you could combine those options by chaining:
- `this.communicator.component(SomeOtherComponent).group('friends').send('hello')`
- `this.communicator.group('friends').allComponents().send('hello')`
- etc

# Events listening

We already know that we could listen to events with `on` decorator.
By default we are listening events intended to components of the same class (in our example `SimpleComponent`).

But what to do if we have `SpyComponent` which have to know what `EnemyComponent` is sending?
For that we could pass `streamModifier` function to `on` decorator:

```
@on(
    'message',
    (stream) => strem.filter(({ to: { component }}) => component === SpyComponent.origin)
)
...
```
`stream` is a RxJS stream, which you could modify in different ways. See more in [RxJS Documentation](http://reactivex.io/rxjs/manual/index.html).

Notice that prototype of all mimic components is `MimicComponent`, so to get origin prototype use `origin` property.


### There are few reserved events:
- `init` - is called on component creation.
- `outerUpdate` - is called when parent updates component's props.

# Authors
For the moment there is only one author but who knows, maybe there will be more :)

- [Serj Taran](https://github.com/s-tar)
