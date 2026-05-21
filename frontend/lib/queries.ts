import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    vehicles {
      id
      status
    }
    zones {
      id
      name
      level
      surface
      vehicleCount
      updatedAt
    }
    incidents {
      id
      type
      status
      location
      createdAt
    }
  }
`;

export const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      licensePlate
      model
      type
      driverName
      zoneName
      status
      lastPositionTime
    }
  }
`;

export const GET_ZONES = gql`
  query GetZones {
    zones {
      id
      name
      level
      surface
      vehicleCount
      updatedAt
    }
  }
`;
