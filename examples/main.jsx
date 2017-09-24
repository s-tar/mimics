import React from 'react';
import ReactDOM from 'react-dom';
import Example1 from './1_private_state_management/index.jsx';
import Example2 from './2_sending_events/index.jsx';
import Example3 from './3_sending_to_group/index.jsx';
import Example4 from './4_listening_events/index.jsx';


ReactDOM.render(
    <Example1 />,
    document.getElementById('example_1'),
);


ReactDOM.render(
    <Example2 />,
    document.getElementById('example_2'),
);


ReactDOM.render(
    <Example3 />,
    document.getElementById('example_3'),
);

ReactDOM.render(
    <Example4 />,
    document.getElementById('example_4'),
);

