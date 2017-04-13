import * as React from 'react';

import GraphView from './view';
import GraphConfig from './shapes'; // Configures node/edge types
import baseData from '../../stores/ui';
// import StatusService from '../data/StatusService.js';
import { observer } from 'mobx-react';
import GraphStore from '../../stores/ui';

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
  graphStore: GraphStore;
}

@observer
export default class Graph extends React.Component<GraphProps, any> {
  store: GraphStore;

  constructor(props) {
    super(props);

    this.store = this.props.graphStore;
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode) {
    return this.store.graph.nodes.findIndex((node) => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge) {
    return this.store.graph.edges.findIndex((edge) => {
      return edge.source === searchEdge.source &&
        edge.target === searchEdge.target;
    });
  }

  // Given a nodeKey, return the corresponding node
  getViewNode = (nodeKey) => {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.store.graph.nodes[i];
  }

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc.. 
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode) => {
    const graph = this.store.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
  }

  // Node 'mouseUp' handler
  onSelectNode = (viewNode) => {
    // Deselect events will send Null viewNode
    this.store.selected = viewNode ? viewNode : {};
  }

  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge) => {
    this.store.selected = viewEdge;
  }

  // Updates the graph with a new node
  onCreateNode = (x, y) => {
    const statusName = window.prompt('New status name:');
    const isIncident = !!window.prompt('isIncident');
    const isClosed = !!window.prompt('isClosed');
    const domainStatus = {
      stubName: statusName.toLowerCase(),
      name: statusName,
      isIncident,
      isClosed
    };
    const graph = this.store.graph;

    // This is just an example - any sort of logic 
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
    const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;

    const viewNode = {
      id: statusName.toLowerCase(),
      title: statusName,
      type: type,
      x: x,
      y: y
    };

    graph.nodes.push(viewNode);
  }

  // Deletes a node from the graph
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

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode, targetViewNode) => {
    const graph = this.store.graph;
    // StatusService.createTransition(sourceViewNode, targetViewNode);
    // This is just an example - any sort of logic 
    // could be used here to determine edge type
    const type = sourceViewNode.type === SPECIAL_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: type
    };
    graph.edges.push(viewEdge);
    this.setState({ graph: graph });
  }

  // Called when an edge is reattached to a different target.
  onSwapEdge = (sourceViewNode, targetViewNode, viewEdge) => {
    const graph = this.store.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;

    this.setState({ graph: graph });
  }

  // Called when an edge is deleted
  onDeleteEdge = (viewEdge) => {
    const graph = this.store.graph;
    const i = this.getEdgeIndex(viewEdge);
    graph.edges.splice(i, 1);
    this.setState({ graph: graph, selected: {} });
  }

  /*
   * Render
   */

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

