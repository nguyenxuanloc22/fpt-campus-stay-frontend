import { apiClient } from './client';
import type {
  User,
  AuthSession,
  LoginPayload,
  Semester,
  EligibilityResult,
  Building,
  Room,
  RoomDetail,
  Application,
  RoommateGroup,
  Contract,
  Invoice,
  VietQrInfo,
  MaintenanceTicket,
  CheckinAppointment,
  OccupancyReport,
  AuditLog,
} from '@campusstay/types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthSession> => {
    const res = await apiClient.post<AuthSession>('/auth/login', payload);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
};

export const semestersApi = {
  getCurrent: async (): Promise<Semester> => {
    const res = await apiClient.get<Semester>('/semesters/current');
    return res.data;
  },
  checkEligibility: async (): Promise<EligibilityResult> => {
    const res = await apiClient.get<EligibilityResult>('/eligibility/check');
    return res.data;
  },
};

export const roomsApi = {
  getBuildings: async (): Promise<Building[]> => {
    const res = await apiClient.get<Building[]>('/buildings');
    return res.data;
  },
  getRooms: async (params?: Record<string, string>): Promise<Room[]> => {
    const res = await apiClient.get<Room[]>('/rooms', { params });
    return res.data;
  },
  getRoomById: async (id: string): Promise<RoomDetail> => {
    const res = await apiClient.get<RoomDetail>(`/rooms/${id}`);
    return res.data;
  },
};

export const applicationsApi = {
  getMy: async (): Promise<Application> => {
    const res = await apiClient.get<Application>('/applications/my');
    return res.data;
  },
  getAll: async (status?: string): Promise<Application[]> => {
    const res = await apiClient.get<Application[]>('/applications', {
      params: status ? { status } : undefined,
    });
    return res.data;
  },
  submit: async (data: Record<string, unknown>): Promise<Application> => {
    const res = await apiClient.post<Application>('/applications', data);
    return res.data;
  },
  review: async (id: string, data: { action: string; note: string }): Promise<Application> => {
    const res = await apiClient.patch<Application>(`/applications/${id}/review`, data);
    return res.data;
  },
  approveException: async (id: string, data: { approved: boolean; managerNote: string }) => {
    const res = await apiClient.patch<Application>(`/applications/${id}/exception`, data);
    return res.data;
  },
};

export const roommatesApi = {
  getMyGroup: async (): Promise<RoommateGroup> => {
    const res = await apiClient.get<RoommateGroup>('/roommates/groups/my');
    return res.data;
  },
  createGroup: async (groupName: string): Promise<RoommateGroup> => {
    const res = await apiClient.post<RoommateGroup>('/roommates/groups', { groupName });
    return res.data;
  },
  joinByPin: async (inviteCode: string): Promise<RoommateGroup> => {
    const res = await apiClient.post<RoommateGroup>('/roommates/groups/join', { inviteCode });
    return res.data;
  },
};

export const contractsApi = {
  getMy: async (): Promise<Contract> => {
    const res = await apiClient.get<Contract>('/contracts/my');
    return res.data;
  },
  sign: async (id: string): Promise<Contract> => {
    const res = await apiClient.post<Contract>(`/contracts/${id}/sign`);
    return res.data;
  },
};

export const invoicesApi = {
  getAll: async (): Promise<Invoice[]> => {
    const res = await apiClient.get<Invoice[]>('/invoices');
    return res.data;
  },
  getVietQr: async (id: string): Promise<VietQrInfo> => {
    const res = await apiClient.get<VietQrInfo>(`/invoices/${id}/vietqr`);
    return res.data;
  },
};

export const maintenanceApi = {
  getAll: async (): Promise<MaintenanceTicket[]> => {
    const res = await apiClient.get<MaintenanceTicket[]>('/maintenance');
    return res.data;
  },
  create: async (data: Record<string, unknown>): Promise<MaintenanceTicket> => {
    const res = await apiClient.post<MaintenanceTicket>('/maintenance', data);
    return res.data;
  },
  update: async (id: string, data: Record<string, unknown>): Promise<MaintenanceTicket> => {
    const res = await apiClient.patch<MaintenanceTicket>(`/maintenance/${id}`, data);
    return res.data;
  },
};

export const checkinApi = {
  getAppointments: async (): Promise<CheckinAppointment[]> => {
    const res = await apiClient.get<CheckinAppointment[]>('/checkin/appointments');
    return res.data;
  },
  bookAppointment: async (data: Record<string, unknown>): Promise<CheckinAppointment> => {
    const res = await apiClient.post<CheckinAppointment>('/checkin/appointments', data);
    return res.data;
  },
};

export const reportsApi = {
  getOccupancy: async (): Promise<OccupancyReport> => {
    const res = await apiClient.get<OccupancyReport>('/reports/occupancy');
    return res.data;
  },
  applyBatchAllocation: async (): Promise<{ success: boolean; assignedCount: number; message: string }> => {
    const res = await apiClient.post('/allocation/batch-apply');
    return res.data;
  },
};

export const auditApi = {
  getLogs: async (): Promise<AuditLog[]> => {
    const res = await apiClient.get<AuditLog[]>('/admin/audit-logs');
    return res.data;
  },
};
