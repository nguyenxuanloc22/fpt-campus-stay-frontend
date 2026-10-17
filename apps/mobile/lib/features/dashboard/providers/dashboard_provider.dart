import 'package:flutter_riverpod/flutter_riverpod.dart';

class DashboardData {
  final String currentSemester;
  final String applicationStatus; // 'SUBMITTED', 'APPROVED', 'OCCUPIED'
  final String? assignedRoom;
  final String? assignedBed;
  final String? buildingName;
  final double invoiceAmount;
  final bool isInvoicePaid;
  final bool isContractSigned;
  final int activeTicketsCount;

  const DashboardData({
    required this.currentSemester,
    required this.applicationStatus,
    this.assignedRoom,
    this.assignedBed,
    this.buildingName,
    required this.invoiceAmount,
    required this.isInvoicePaid,
    required this.isContractSigned,
    required this.activeTicketsCount,
  });
}

final dashboardProvider = FutureProvider<DashboardData>((ref) async {
  // Simulate network delay for 4-state verification
  await Future<void>.delayed(const Duration(milliseconds: 300));

  return const DashboardData(
    currentSemester: 'Fall 2026',
    applicationStatus: 'APPROVED',
    assignedRoom: 'A-304',
    assignedBed: 'B2 (Tầng 1)',
    buildingName: 'Tòa A - KTX Tân Uyên',
    invoiceAmount: 4800000,
    isInvoicePaid: false,
    isContractSigned: true,
    activeTicketsCount: 1,
  );
});
