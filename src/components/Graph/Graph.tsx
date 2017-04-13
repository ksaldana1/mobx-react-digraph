import * as React from 'react';
import { observer } from 'mobx-react';
import GraphView from 'react-digraph';

import GraphConfig from './shapes';
import { GraphStore, Node, Edge } from '../../stores/graphStore';

const styles = {
  graph: {
    height: '100%',
    width: '100%'
  }
};

const NODE_KEY = 'id'; // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
const EMPTY_TYPE = 'empty'; // Empty node type
const SPECIAL_TYPE = 'special';
const EMPTY_EDGE_TYPE = 'emptyEdge';
const SPECIAL_EDGE_TYPE = 'specialEdge';

interface GraphProps {
  store: GraphStore;
}

@observer class Graph extends React.Component<GraphProps, any> {
  store: GraphStore;

  constructor(props) {
    super(props);
  }

  getViewNode = (nodeKey: string): Node => {
    return this.props.store.getNodeByID(nodeKey);
  }

  onSelectNode = (viewNode: Node): void => {
    this.props.store.updateSelected(viewNode);
  }

  onCreateNode = (x: number, y: number): void => {
    const statusName = window.prompt('New status name:');

    const viewNode = {
      id: statusName.toLowerCase(),
      title: statusName,
      type: EMPTY_TYPE,
      x: x,
      y: y
    };

    this.props.store.createNode(viewNode);
  }

  onUpdateNode = (viewNode: Node): void => {
    this.props.store.updateNode(viewNode);
  }

  onDeleteNode = (viewNode: Node): void => {
    this.props.store.deleteNode(viewNode);
  }

  onSelectEdge = (viewEdge: Edge): void => {
    this.props.store.updateSelected(viewEdge);
  }

  onCreateEdge = (sourceViewNode, targetViewNode) => {
    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: EMPTY_EDGE_TYPE
    };

    this.props.store.createEdge(viewEdge);
  }

  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    this.props.store.swapEdges(sourceViewNode, targetViewNode, viewEdge);
  }

  onDeleteEdge = (viewEdge) => {
    this.props.store.deleteEdge(viewEdge);
  }

  render() {
    const NodeTypes = GraphConfig.NodeTypes;
    const NodeSubtypes = GraphConfig.NodeSubtypes;
    const EdgeTypes = GraphConfig.EdgeTypes;

    return (
      <div id='graph' style={styles.graph}>

        <GraphView ref='GraphView'
          nodeKey={NODE_KEY}
          emptyType={EMPTY_TYPE}
          nodes={this.props.store.graph.nodes}
          edges={this.props.store.graph.edges}
          selected={this.props.store.selected}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
          getViewNode={this.getViewNode}
          onSelectNode={this.onSelectNode}
          onCreateNode={this.onCreateNode}
          onUpdateNode={this.onUpdateNode}
          onDeleteNode={this.onDeleteNode}
          onSelectEdge={this.onSelectEdge}
          onCreateEdge={this.onCreateEdge}
          onSwapEdge={this.onSwapEdge}
          onDeleteEdge={this.onDeleteEdge}
        />
      </div>
    );
  }
}

export default Graph;
