import { observable, action } from 'mobx';

import StatusService from '../services/StatusService';

const EMPTY_TYPE = 'empty';
const EMPTY_EDGE_TYPE = 'emptyEdge';

export interface Node {
  id: string;
  title: string;
  x: number;
  y: number;
  type: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export class GraphStore {
  statusService: StatusService;

  constructor(statusService) {
    this.statusService = statusService;

    this.setInitialData()
      .then(() => this.loading = false);
  }

  @observable loading = true;

  @observable graph = {
    nodes: [
      {
        id: 'created',
        title: 'Created',
        x: 303.63636779785156,
        y: 295.54547119140625,
        type: EMPTY_TYPE
      },
      {
        id: 'completed',
        title: 'Completed',
        x: 300.1515197753906,
        y: 603.8484497070312,
        type: EMPTY_TYPE,
      },
      {
        id: 'incident',
        title: 'Incident',
        x: 671.45458984375,
        y: 301.81817626953125,
        type: EMPTY_TYPE
      },
      {
        id: 'mitigated',
        title: 'Mitigated',
        x: 1036.7273406982422,
        y: 307.0605773925781,
        type: EMPTY_TYPE
      },
      {
        id: 'resolved',
        title: 'Resolved',
        x: 1407.2424621582031,
        y: 309.7878723144531,
        type: EMPTY_TYPE
      },
    ],
    edges: [
      {
        id: '8176e41a-117f-4b98-ab30-fda9a0e9e8d4',
        source: 'created',
        target: 'completed',
        type: EMPTY_EDGE_TYPE
      },
      {
        id: '16151077-7a67-4bc3-97da-3e24220a37f0',
        source: 'created',
        target: 'incident',
        type: EMPTY_EDGE_TYPE
      },
      {
        id: 'a6d40e9f-cc41-4538-a99d-049f937da64c',
        source: 'incident',
        target: 'mitigated',
        type: EMPTY_EDGE_TYPE
      },
      {
        id: 'f4e555d8-5788-4749-9a13-6dc8d8ce8f97',
        source: 'mitigated',
        target: 'resolved',
        type: EMPTY_EDGE_TYPE
      },
    ]
  };

  @observable selected = {};

  // Actions/Mutations
  @action createNode = async (viewNode: Node): Promise<any> => {
    // don't create duplicate id nodes
    if (this.graph.nodes.find(node => node.id === viewNode.id)) {
      return;
    }
    try {
      await this.statusService.createStatus(viewNode);
      this.graph.nodes.push(viewNode);
    } catch (e) {
      console.error(e);
    }
  }

  @action updateNode = (viewNode: Node) => {
    const i = this.getNodeIndex(viewNode);
    this.graph.nodes[i] = viewNode;
  }

  @action deleteNode = async (viewNode: Node): Promise<any> => {
    try {
      await this.statusService.deleteStatus(viewNode.id);
      const i = this.getNodeIndex(viewNode);
      this.graph.nodes.splice(i, 1);

      // Delete any connected edges
      const newEdges = this.graph.edges.filter((edge, i) => {
        return edge.source !== viewNode.id &&
          edge.target !== viewNode.id;
      });
      this.graph.edges = newEdges;
      this.selected = {};
    } catch (e) {
      console.error(e);
    }
  }

  @action createEdge = async (viewEdge: Edge): Promise<any> => {
    // if this edge already exists, return early
    if (this.isDuplicateEdge(viewEdge)) {
      return;
    }
    try {
      await this.statusService.createTransition(viewEdge);
      this.graph.edges.push(viewEdge);
    } catch (e) {
      console.error(e);
    }
  }

  @action swapEdges = async (sourceViewNode: Node, targetViewNode: Node, viewEdge: Edge): Promise<any> => {
    try {
      const updatedEdge = {
        id: viewEdge.id,
        source: sourceViewNode.id,
        target: targetViewNode.id,
        type: EMPTY_EDGE_TYPE
      };
      await this.statusService.swapTransition(updatedEdge);
      const i = this.getEdgeIndex(viewEdge);
      this.graph.edges[i] = updatedEdge;
    } catch (e) {
      console.error(e);
    }
  }

  @action deleteEdge = async (viewEdge: Edge): Promise<any> => {
    try {
      await this.statusService.deleteTransition(viewEdge);
      const i = this.getEdgeIndex(viewEdge);
      this.graph.edges.splice(i, 1);
      this.selected = {};
    } catch (e) {
      console.error(e);
    }
  }

  @action updateSelected = (selected: Edge | Node): void => {
    this.selected = selected ? selected : {};
  }

  @action setGraph = (nodes, edges): void => {
    this.graph.nodes = nodes;
    this.graph.edges = edges;
  }

  // Helpers
  async setInitialData() {
    try {
      const [nodes, edges] = await this.statusService.getAllData();
      this.setGraph(nodes, edges);
    } catch (e) {
      console.error(e);
    }
  }

  getEdgeIndex(searchEdge: Edge) {
    return this.graph.edges.findIndex((edge) => {
      return edge.source === searchEdge.source &&
        edge.target === searchEdge.target;
    });
  }

  getNodeIndex(searchNode: Node) {
    return this.graph.nodes.findIndex((node) => {
      return node.id === searchNode.id;
    });
  }

  getNodeByID(id: string): Node {
    return this.graph.nodes.find((node) => {
      return node.id === id;
    });
  }

  isDuplicateEdge(searchEdge: Edge) {
    const reverseEdge = {
      id: searchEdge.id,
      type: 'emptyEdge',
      source: searchEdge.target,
      target: searchEdge.source
    };

    return (this.getEdgeIndex(searchEdge) !== -1 || this.getEdgeIndex(reverseEdge) !== -1);
  }
}

const singleton = new GraphStore(new StatusService());
export default singleton;
