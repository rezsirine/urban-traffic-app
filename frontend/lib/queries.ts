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
      densityLevel
      createdAt
    }
    incidents {
      id
      type
      status
      description
      createdAt
    }
  }
`;

export const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles {
      id
      licensePlate
      type
      status
    }
  }
`;

export const ADD_VEHICLE = gql`
  mutation AddVehicle($input: AddVehicleInput!) {
    addVehicle(input: $input) {
      id
      licensePlate
      type
      status
    }
  }
`;

export const GET_VEHICLE = gql`
  query GetVehicle($id: String!) {
    vehicle(id: $id) {
      id
      licensePlate
      type
      status
      createdAt
    }
  }
`;

export const GET_VEHICLE_HISTORY = gql`
  query GetVehicleHistory($vehicleId: String!) {
    vehicleHistory(vehicleId: $vehicleId) {
      id
      lat
      lng
      timestamp
    }
  }
`;

export const GET_ZONES = gql`
  query GetZones {
    zones {
      id
      name
      bounds
      densityLevel
      createdAt
    }
  }
`;

export const GET_INCIDENTS = gql`
  query GetIncidents {
    incidents {
      id
      description
      type
      status
      lat
      lng
      reportedBy
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INCIDENT_STATUS = gql`
  mutation UpdateIncidentStatus($id: String!, $status: IncidentStatus!) {
    updateIncidentStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const DECLARE_INCIDENT = gql`
  mutation DeclareIncident($input: DeclareIncidentInput!) {
    declareIncident(input: $input) {
      id
      type
      status
      description
      lat
      lng
      reportedBy
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: String!) {
    notifications(userId: $userId) {
      id
      title
      message
      isRead
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      id
      isRead
    }
  }
`;

export const SEND_NOTIFICATION = gql`
  mutation SendNotification($input: SendNotificationInput!) {
    sendNotification(input: $input) {
      id
      title
      message
      userId
      isRead
      createdAt
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;
