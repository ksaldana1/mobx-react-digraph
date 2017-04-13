import { observable, action } from 'mobx';

const EMPTY_TYPE = 'empty';
const EMPTY_EDGE_TYPE = 'emptyEdge';

export interface Node {
  id: number;
  title: string;
  x: number;
  string: number;
  type: string;
}

export interface Edge {
  source: number;
  target: number;
  type: string;
}

export default class GraphStore {
  @observable graph = {
    nodes: [
      {
        'id': 1,
        'title': 'Created',
        'x': 303.63636779785156,
        'y': 295.54547119140625,
        'type': EMPTY_TYPE
      },
      {
        'id': 2,
        'title': 'Completed',
        'x': 300.1515197753906,
        'y': 603.8484497070312,
        'type': EMPTY_TYPE,
      },
      {
        'id': 3,
        'title': 'Incident',
        'x': 671.45458984375,
        'y': 301.81817626953125,
        'type': EMPTY_TYPE
      },
      {
        'id': 4,
        'title': 'Mitigated',
        'x': 1036.7273406982422,
        'y': 307.0605773925781,
        'type': EMPTY_TYPE
      },
      {
        'id': 5,
        'title': 'Resolved',
        'x': 1407.2424621582031,
        'y': 309.7878723144531,
        'type': EMPTY_TYPE
      },
    ],
    edges: [
      {
        'source': 1,
        'target': 2,
        'type': EMPTY_EDGE_TYPE
      },
      {
        'source': 1,
        'target': 3,
        'type': EMPTY_EDGE_TYPE
      },
      {
        'source': 3,
        'target': 4,
        'type': EMPTY_EDGE_TYPE
      },
      {
        'source': 4,
        'target': 5,
        'type': EMPTY_EDGE_TYPE
      },
    ]
  };

  @observable selected = {};

  @action createEdge(viewEdge: Edge): void {
    this.graph.edges.push(viewEdge);
  }

  // @action updateNode(viewNode: Node): void {

  // }
}
