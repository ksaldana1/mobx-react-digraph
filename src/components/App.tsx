import * as React from 'react';

import Graph from './Graph/Graph';
import GraphStore from '../stores/graphStore';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <Graph store={GraphStore} />
    );
  }
};

export default App;
