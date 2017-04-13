import * as React from 'react';
import { v4 } from 'uuid';
import { observer } from 'mobx-react';
import GraphView from 'react-digraph';

import GraphConfig from './config';
import { GraphStore, Node, Edge } from '../../stores/graphStore';

const NODE_KEY = 'id';

const EMPTY_TYPE = 'empty';
const EMPTY_EDGE_TYPE = 'emptyEdge';

@observer class Graph extends React.Component<{ store: GraphStore }, {}> {
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

  onCreateEdge = (sourceViewNode: Node, targetViewNode: Node) => {
    if (sourceViewNode.id === targetViewNode.id) {
      return;
    }

    this.props.store.createEdge(
      {
        id: v4(),
        source: sourceViewNode[NODE_KEY],
        target: targetViewNode[NODE_KEY],
        type: EMPTY_EDGE_TYPE
      }
    );
  }

  onSwapEdge = (sourceViewNode: Node, targetViewNode: Node, viewEdge: Edge) => {
    this.props.store.swapEdges(sourceViewNode, targetViewNode, viewEdge);
  }

  onDeleteEdge = (viewEdge: Edge) => {
    this.props.store.deleteEdge(viewEdge);
  }

  render() {
    const NodeTypes = GraphConfig.NodeTypes;
    const NodeSubtypes = GraphConfig.NodeSubtypes;
    const EdgeTypes = GraphConfig.EdgeTypes;
    if (this.props.store.loading) {
      return <div>Loading</div>
    }
    return (
      <div id='graph' style={{ height: '100%', width: '100%' }}>
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
