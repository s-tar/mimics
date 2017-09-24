import React from 'react';
import PropTypes from 'prop-types';
import { MimicComponent, on } from '../../src/mimics.js';
import { SimpleComponent as Example2Component } from '../2_sending_events/index.jsx';
import { SimpleComponent as Example3Component } from '../3_sending_to_group/index.jsx';


class ListenerDispatcher {
    @on(
        'onIncrement',
        (stream) => stream.filter(({ to: { component } }) =>
            [Example2Component.origin, Example3Component.origin].includes(component)
        )
    )
    static onIncrement(communicator, state, payload) {
        const { message } = payload || {};
        communicator.update({ message });
    }
}


@MimicComponent
class ListenerComponent extends React.Component {
    static dispatcher = ListenerDispatcher;
    static propTypes = {
        message: PropTypes.string,
    };

    static defaultProps = {
        message: null,
    };

    render() {
        return (
            <div>
                {this.props.message ? this.props.message : 'No messages yet'}
            </div>
        );
    }
}


export default function Example3() {
    return (
        <div>
            <div className='header'>Example #4: &quot;onIncrement&quot; event listener</div>
            <ListenerComponent />
        </div>
    );
}
