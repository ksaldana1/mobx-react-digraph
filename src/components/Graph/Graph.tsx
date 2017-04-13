import * as React from 'react';

import GraphView from './view';
import GraphConfig from './shapes'; // Configures node/edge types
// import StatusService from '../data/StatusService.js';
import { observer } from 'mobx-react';
import GraphStore from '../../stores/graph';

const styles = {
  graph: {
    height: '100%',
    width: '100%'
  }
};

let INCREMENTING_ID = 6;

const NODE_KEY = 'id'; // Key used to identify nodes

// These keys are arbitrary (but must match the config)
// However, GraphView renders text differently for empty types
// so this has to be passed in if that behavior is desired.
const EMPTY_TYPE = 'empty'; // Empty node type
const SPECIAL_TYPE = 'special';
const EMPTY_EDGE_TYPE = 'emptyEdge';
const SPECIAL_EDGE_TYPE = 'specialEdge';

interface GraphProps {
  graphStore: GraphStore;
}

@observer
export default class Graph extends React.Component<GraphProps, any> {
  store: GraphStore;

  constructor(props) {
    super(props);

    this.store = this.props.graphStore;
  }

  getNodeIndex(searchNode) {
    return this.store.graph.nodes.findIndex((node) => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  getEdgeIndex(searchEdge) {
    return this.store.graph.edges.findIndex((edge) => {
      return edge.source === searchEdge.source &&
        edge.target === searchEdge.target;
    });
  }

  getViewNode = (nodeKey) => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.store.graph.nodes[i];
  }

  onUpdateNode = (viewNode) => {
    const graph = this.store.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
  }

  onSelectNode = (viewNode) => {
    // Deselect events will send Null viewNode
    this.store.selected = viewNode ? viewNode : {};
  }

  onSelectEdge = (viewEdge) => {
    this.store.selected = viewEdge;
  }

  onCreateNode = (x, y) => {
    const statusName = window.prompt('New status name:');

    const domainStatus = {
      stubName: statusName.toLowerCase(),
      name: statusName,
      isIncident: false,
      isClosed: false
    };
    const graph = this.store.graph;
    const type = EMPTY_TYPE;

    const viewNode = {
      id: INCREMENTING_ID++,
      title: statusName,
      type: type,
      x: x,
      y: y
    };

    graph.nodes.push(viewNode);
  }

  onDeleteNode = (viewNode) => {
    const graph = this.store.graph;
    const i = this.getNodeIndex(viewNode);
    graph.nodes.splice(i, 1);

    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return edge.source !== viewNode[NODE_KEY] &&
        edge.target !== viewNode[NODE_KEY];
    });

    graph.edges = newEdges;
    this.store.selected = {};
  }

  onCreateEdge = (sourceViewNode, targetViewNode) => {
    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: EMPTY_EDGE_TYPE
    };

    this.store.createEdge(viewEdge);
  }

  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    const graph = this.store.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = graph.edges[i];

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
  }

  onDeleteEdge = (viewEdge) => {
    const graph = this.store.graph;
    const i = this.getEdgeIndex(viewEdge);
    graph.edges.splice(i, 1);
    this.store.selected = {};
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
          nodes={this.store.graph.nodes}
          edges={this.store.graph.edges}
          selected={this.store.selected}
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

