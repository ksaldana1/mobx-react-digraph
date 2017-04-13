import * as React from 'react';
import { observer } from 'mobx-react';

import Graph from './Graph/Graph';
import GraphStore from '../stores/graph';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <Graph graphStore={GraphStore} />
    );
  }
};

export default observer(App);
