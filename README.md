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

Also it provides `@on(event, filterFn)` decorator to bind callbacks to our events.
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

    defaultProps = {
        counter: 0,
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
    static onIncrement(communicator, state) {
        communicator.update({ count: state.count + 1 });
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

    defaultProps = {
        counter: 0,
    }

    onIncrement() {
        this.send('onIncrement');
    }

    render () {
        <div>
            <div>Count: {this.props.count}</div>
            <button onClick={this.onIncrement}>Increment</button>
        </div>
    }
}
```


# Authors
For the moment there is only one author but who knows, maybe there will be more :)

- [Serj Taran](https://github.com/s-tar)