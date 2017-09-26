import React from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';


let LAST_ID = 0;
const OmegaStream = new Rx.Subject();

function getNextId() {
    LAST_ID += 1;
    return LAST_ID;
}


class MimicCommunicator {
    constructor(componentId, component, updateFunc) {
        this.update = updateFunc;
        this.protocol = {
            to: {
                id: componentId,
                group: null,
                component,
            },
            from: {
                id: componentId,
                component,
            }
        };
    }

    group(name) {
        this.protocol.to.id = null;
        this.protocol.to.group = name;
        return this;
    }

    allComponents() {
        this.protocol.to.id = null;
        this.protocol.to.component = null;
        return this;
    }

    component(component) {
        this.protocol.to.id = null;
        this.protocol.to.component = component;
        return this;
    }

    send(action, payload) {
        OmegaStream.next({
            action,
            payload,
            ...this.protocol,
        });
    }
}


function MimicComponentDecorator(Component) {
    Object.defineProperty(Component.prototype, 'communicator', {
        get: function communicator() {
            return this.props.mimicCommunicator;
        }
    });

    Component.prototype.send = function send(action, payload) {
        this.communicator.send(action, payload);
    };

    Component.prototype.update = function update(props) {
        this.communicator.update(props);
    };

    return class MimicComponent extends React.Component {
        static origin = Component;
        static propTypes = {
            mimicGroup: PropTypes.string,
        };

        static defaultProps = {
            mimicGroup: null,
        };

        constructor(props, ...args) {
            super(props, ...args);
            const Dispatcher = Component.dispatcher;
            if (Dispatcher) {
                const events = Dispatcher.events || Dispatcher.prototype.events || {};
                Object.keys(events).forEach((key) => {
                    const stream = OmegaStream.filter(({ action }) => action === key);
                    for (const { func, modifier } of events[key]) {
                        let modifiedStream;
                        if (modifier) {
                            modifiedStream = modifier(stream);
                        } else {
                            modifiedStream = stream.filter(
                                ({ to: { id, component, group } }) => (
                                    (group === null || group === this.mimicGroup) &&
                                    (component === null || component === this.origin) &&
                                    (id === null || id === this.mimicId)
                                )
                            );
                        }

                        modifiedStream.subscribe((data) => {
                            func(
                                this.communicator,
                                { ...this.state },
                                data.payload,
                                data
                            );
                        });
                    }
                });
            }
            this.state = { ...Component.defaultProps, ...this.props };
            this.origin = Component;
            this.mimicId = getNextId();
            this.mimicGroup = props.mimicGroup;
            this.communicator = new MimicCommunicator(
                this.mimicId,
                this.origin,
                this.update.bind(this),
            );

            this.communicator.send('init');
        }

        update(props) {
            this.setState(props);
        }

        componentWillReceiveProps(props) {
            this.communicator.send('outerUpdate', props);
        }

        render() {
            return React.createElement(
                Component,
                {
                    mimicCommunicator: this.communicator,
                    mimicGroup: this.mimicGroup,
                    ...this.state
                }
            );
        }
    };
}

function on(event, streamModifier) {
    return (target, property) => {
        target.events = target.events || {};

        target.events[event] = target.events[event] || [];
        target.events[event].push({
            modifier: streamModifier,
            func: target[property],
        });
    };
}

export {
    MimicComponentDecorator as MimicComponent,
    on,
};
