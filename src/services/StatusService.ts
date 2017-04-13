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
    const status = this.nodeToStatus(node);
    try {
      const data = await axios({
        method: 'POST',
        url: 'http://localhost:4000/api/statuses',
        data: status
      });

      return data;
    } catch (e) {
      console.error('Error creating status', e);
    }
  }

  async deleteStatus(stubName: string) {
    try {
      const data = await axios({
        method: 'DELETE',
        url: `http://localhost:4000/api/statuses/${stubName}`
      });

      return data;
    } catch (e) {
      console.error('Error deleting status', e);
    }
  }

  async createTransition(edge: Edge) {
    const transition = this.edgeToTransition(edge);
    try {
      const data = await axios({
        method: 'POST',
        url: 'http://localhost:4000/api/transitions',
        data: transition
      });

      return data;
    } catch (e) {
      console.error(e);
    }
  };

  async deleteTransition(edge: Edge) {
    try {
      const data = await axios({
        method: 'DELETE',
        url: `http://localhost:4000/api/transitions/${edge.id}`
      });

      return data;
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
