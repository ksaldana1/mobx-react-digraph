import { observable } from 'mobx';

const EMPTY_TYPE = 'empty';
const EMPTY_EDGE_TYPE = 'emptyEdge';

export default class GraphStore {
  @observable graph = {
    nodes: [
      {
        'id': 'created',
        'title': 'Created',
        'x': 303.63636779785156,
        'y': 295.54547119140625,
        'type': EMPTY_TYPE
      },
      {
        'id': 'completed',
        'title': 'Completed',
        'x': 300.1515197753906,
        'y': 603.8484497070312,
        'type': EMPTY_TYPE,
      },
      {
        'id': 'incident',
        'title': 'Incident',
        'x': 671.45458984375,
        'y': 301.81817626953125,
        'type': EMPTY_TYPE
      },
      {
        'id': 'mitigated',
        'title': 'Mitigated',
        'x': 1036.7273406982422,
        'y': 307.0605773925781,
        'type': EMPTY_TYPE
      },
      {
        'id': 'resolved',
        'title': 'Resolved',
        'x': 1407.2424621582031,
        'y': 309.7878723144531,
        'type': EMPTY_TYPE
      },
    ],
    edges: [
      {
        'source': 'created',
        'target': 'completed',
        'type': EMPTY_EDGE_TYPE
      },
      {
        'source': 'created',
        'target': 'incident',
        'type': EMPTY_EDGE_TYPE
      },
      {
        'source': 'incident',
        'target': 'mitigated',
        'type': EMPTY_EDGE_TYPE
      },
      {
        'source': 'mitigated',
        'target': 'resolved',
        'type': EMPTY_EDGE_TYPE
      },
    ]
  };

  @observable selected = {};
}
