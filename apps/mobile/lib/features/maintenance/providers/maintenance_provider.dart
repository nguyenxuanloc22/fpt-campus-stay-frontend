import 'package:flutter_riverpod/flutter_riverpod.dart';

class MaintenanceTicket {
  final String id;
  final String title;
  final String category; // 'ELECTRICITY', 'PLUMBING', 'AIR_CONDITIONER', 'DOOR_LOCK', 'OTHER'
  final String description;
  final String status; // 'NEW', 'IN_PROGRESS', 'RESOLVED'
  final String createdAt;
  final String? assignedStaff;

  const MaintenanceTicket({
    required this.id,
    required this.title,
    required this.category,
    required this.description,
    required this.status,
    required this.createdAt,
    this.assignedStaff,
  });
}

class MaintenanceNotifier extends StateNotifier<AsyncValue<List<MaintenanceTicket>>> {
  MaintenanceNotifier() : super(const AsyncValue.loading()) {
    _loadTickets();
  }

  Future<void> _loadTickets() async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    state = const AsyncValue.data([
      MaintenanceTicket(
        id: 'TCK-2026-081',
        title: 'Điều hòa phòng A-304 không mát, kêu to',
        category: 'AIR_CONDITIONER',
        description: 'Bật 16 độ nhưng chỉ có gió nhẹ và phát ra tiếng rè lớn.',
        status: 'IN_PROGRESS',
        createdAt: '17/08/2026',
        assignedStaff: 'KTV. Hoàng Minh',
      ),
      MaintenanceTicket(
        id: 'TCK-2026-042',
        title: 'Bóng đèn tuýp bàn học số 2 bị chập chờn',
        category: 'ELECTRICITY',
        description: 'Đèn nhấp nháy liên tục khi bật công tắc.',
        status: 'RESOLVED',
        createdAt: '12/08/2026',
        assignedStaff: 'KTV. Trần Văn Đức',
      ),
    ]);
  }

  Future<void> addTicket(String category, String title, String desc) async {
    final current = state.value ?? [];
    final newTicket = MaintenanceTicket(
      id: 'TCK-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
      title: title,
      category: category,
      description: desc,
      status: 'NEW',
      createdAt: 'Hôm nay',
      assignedStaff: 'Đang điều phối KTV',
    );
    state = AsyncValue.data([newTicket, ...current]);
  }
}

final maintenanceProvider =
    StateNotifierProvider<MaintenanceNotifier, AsyncValue<List<MaintenanceTicket>>>((ref) {
  return MaintenanceNotifier();
});
