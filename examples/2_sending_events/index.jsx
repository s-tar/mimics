import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { MimicComponent, on } from '../../src/mimics.js';


class SimpleDispatcher {
    @on('onIncrement')
    static onIncrement(communicator, state) {
        communicator.update({ count: state.count + 1 });
    }
}


@MimicComponent
export class SimpleComponent extends React.Component {
    static dispatcher = SimpleDispatcher;
    static propTypes = {
        count: PropTypes.number,
        className: PropTypes.string,
    };
    static defaultProps = {
        count: 0,
        className: null,
    };


    @autobind
    onClick() {
        this.send('onIncrement', { message: 'Example #2 SimpleComponent envent triggered' });
        // or
        // this.communicator.send('onIncrement', { message: 'Example #2 SimpleComponent envent triggered' });
    }

    render() {
        return (
            <button className={this.props.className} onClick={this.onClick}>
                <div className='value'>{this.props.count}</div>
            </button>
        );
    }
}

export default function Example2() {
    return (
        <div>
            <div className='header'>Example #2: State management via event</div>
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
        </div>
    );
}
