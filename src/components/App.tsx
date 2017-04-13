import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import { AppState } from '../stores/domain';
import Graph from './Graph/Graph';
import GraphStore from '../stores/ui';

const graphStore = new GraphStore();

class App extends React.Component<{}, {}> {
  render() {
    return (
      <Graph graphStore={graphStore} />
    );
  }
};

export default App;
