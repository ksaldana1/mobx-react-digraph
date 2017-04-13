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
  from: Status['stubName'];
  to: Status['stubName'];
}

export default class StatusService {
  async createStatus(node: Node) {
    try {
      const status = this.nodeToStatus(node);
      const response = await axios.post('/api/statuses', status);
      return response.data;
    } catch (e) {
      console.error('Error creating status', e);
    }
  }

  async deleteStatus(stubName: string) {
    try {
      const response = await axios.delete(`/api/statuses/${stubName}`);
      return response.data;
    } catch (e) {
      console.error('Error deleting status', e);
    }
  }

  async createTransition(edge: Edge) {
    try {
      const transition = this.edgeToTransition(edge);
      const response = await axios.post('/api/transitions', transition);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  };

  async deleteTransition(edge: Edge) {
    try {
      const response = await axios.delete(`/api/transitions/${edge.id}`);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  };

  async swapTransition(edge: Edge) {
    try {
      const transition = this.edgeToTransition(edge);
      const response = await axios.post('/api/transitions', transition);
      return response.data;
    } catch (e) {
      console.error(e);
    }
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
}
