import axios from 'axios';
import { Node, Edge } from '../stores/graphStore';

interface Status {
  stubName: string;
  name: string;
  isIncident: boolean;
  isClosed: boolean;
}

interface Transition {
  id: string;
  from: string;
  to: string;
}

const EMPTY_TYPE = 'empty';
const EMPTY_EDGE_TYPE = 'emptyEdge';

export default class StatusService {
  async createStatus(node: Node) {
    try {
      const status = this.nodeToStatus(node);
      const response = await axios.post('/api/statuses', status);
      return response.data;
    } catch (e) {
      console.error('Error creating status', e);
      throw e;
    }
  }

  async getAllData() {
    try {
      const [statuses, transitions] = await Promise.all([axios.get('/api/statuses'), axios.get('/api/transitions')]);
      return [statuses.data.map(this.statusToNode), transitions.data.map(this.transitionToEdge)];
    } catch (e) {
      console.error('Error seeding initial data');
      throw e;
    }
  };

  async deleteStatus(stubName: string) {
    try {
      const response = await axios.delete(`/api/statuses/${stubName}`);
      return response.data;
    } catch (e) {
      console.error('Error deleting status', e);
      throw e;
    }
  }

  async createTransition(edge: Edge) {
    try {
      const transition = this.edgeToTransition(edge);
      const response = await axios.post('/api/transitions', transition);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  async deleteTransition(edge: Edge) {
    try {
      const response = await axios.delete(`/api/transitions/${edge.id}`);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  async swapTransition(edge: Edge) {
    try {
      const transition = this.edgeToTransition(edge);
      const response = await axios.post('/api/transitions', transition);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  nodeToStatus(node: Node): Status {
    return {
      stubName: node.id,
      name: node.title,
      isIncident: false,
      isClosed: false
    };
  }

  edgeToTransition(edge: Edge): Transition {
    return {
      id: edge.id,
      from: edge.source,
      to: edge.target,
    };
  }

  statusToNode = (status: Status): Node => {
    return {
      id: status.stubName,
      title: status.name,
      x: this.getRandomArbitrary(100, 300),
      y: this.getRandomArbitrary(50, 500),
      type: EMPTY_TYPE
    };
  }

  transitionToEdge(transition: Transition): Edge {
    return {
      id: transition.id,
      source: transition.from,
      target: transition.to,
      type: EMPTY_EDGE_TYPE
    };
  }
}
