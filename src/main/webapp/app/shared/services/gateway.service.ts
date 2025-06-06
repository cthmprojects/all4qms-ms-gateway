import axios from 'axios';

export interface RouteVM {
  path: string;
  serviceId: string;
  serviceInstances: Array<{
    instanceInfo: {
      status: string;
    };
    uri: string;
    metadata: any;
  }>;
}

export const getActiveRoutes = async (): Promise<RouteVM[]> => {
  const response = await axios.get<RouteVM[]>('api/gateway/routes');
  return response.data;
};
