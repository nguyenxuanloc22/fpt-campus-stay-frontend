import type {
  ApplicationStatus,
  BedStatus,
  ContractStatus,
  InvoiceStatus,
  MaintenanceStatus,
} from '@campusstay/constants';

export interface Semester {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  registrationOpen: boolean;
  deadline?: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  priorityScore: number;
  reasons: string[];
}

export interface Building {
  id: string;
  code: string;
  name: string;
  genderAllowed?: 'MALE' | 'FEMALE';
  totalRooms: number;
  availableBeds: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  roomType: 'STANDARD_4' | 'STANDARD_6' | 'PREMIUM_AIRCON_4';
  capacity: number;
  occupiedBeds: number;
  pricePerMonth: number;
  hasAirConditioner: boolean;
}

export interface Bed {
  id: string;
  bedNumber: string;
  status: BedStatus;
  occupantName?: string;
}

export interface RoomDetail extends Room {
  beds: Bed[];
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  semesterId: string;
  semesterName: string;
  roomTypePreferred: string;
  buildingPreferred?: string;
  status: ApplicationStatus;
  assignedRoom?: string;
  assignedBed?: string;
  priorityScore?: number;
  reviewNote?: string;
  createdAt: string;
}

export interface RoommateMember {
  studentId: string;
  name: string;
  isLeader: boolean;
}

export interface RoommateGroup {
  id: string;
  groupName: string;
  inviteCode: string;
  maxMembers: number;
  members: RoommateMember[];
}

export interface Contract {
  id: string;
  contractNumber: string;
  studentId: string;
  studentName: string;
  roomName: string;
  bedName: string;
  monthlyPrice: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  signedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceCode: string;
  title: string;
  amount: number;
  deposit?: number;
  totalPayable: number;
  status: InvoiceStatus;
  dueDate: string;
}

export interface VietQrInfo {
  qrImageUrl: string;
  bankId: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  amount: number;
  description: string;
}

export interface MaintenanceTicket {
  id: string;
  title: string;
  roomNumber: string;
  category: 'AIR_CONDITIONER' | 'ELECTRICITY' | 'PLUMBING' | 'FURNITURE' | 'OTHER';
  description: string;
  status: MaintenanceStatus;
  technicianName?: string;
  createdAt: string;
}

export interface CheckinAppointment {
  id: string;
  studentId: string;
  roomNumber: string;
  scheduledTime: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface OccupancyReport {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  occupancyRate: number;
  estimatedRevenue: number;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress?: string;
  timestamp: string;
}
