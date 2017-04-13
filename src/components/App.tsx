import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import Graph from './Graph/Graph';
import GraphStore from '../stores/graph';

const graphStore = new GraphStore();

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Graph graphStore={graphStore} />
        <DevTools />
      </div>
    );
  }
};

export default App;
