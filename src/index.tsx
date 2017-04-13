import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
