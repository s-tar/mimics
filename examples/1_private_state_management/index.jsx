import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { MimicComponent } from '../../src/mimics.js';


@MimicComponent
class SimpleComponent extends React.Component {
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
        this.communicator.update({ count: this.props.count + 1 });
        // or
        // this.update({ count: this.props.count + 1 });
    }

    render() {
        return (
            <button className={this.props.className} onClick={this.onClick}>
                <div className='value'>{this.props.count}</div>
            </button>
        );
    }
}


export default function Example1() {
    return (
        <div>
            <div className='header'>Example #1: State Management</div>
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
            <SimpleComponent className='counter' />
        </div>
    );
}
