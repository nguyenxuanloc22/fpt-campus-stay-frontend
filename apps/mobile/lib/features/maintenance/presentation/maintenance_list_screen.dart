import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/empty_view.dart';
import '../../../shared/widgets/error_view.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../../../shared/widgets/status_chip.dart';
import '../providers/maintenance_provider.dart';

class MaintenanceListScreen extends ConsumerWidget {
  const MaintenanceListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ticketsAsync = ref.watch(maintenanceProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(title: const Text('Báo cáo Sự cố & Sửa chữa')),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.fptOrange,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Tạo báo cáo', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () => context.push('/maintenance/new'),
      ),
      body: ticketsAsync.when(
        loading: () => const LoadingIndicator(message: 'Đang tải danh sách sự cố...'),
        error: (err, stack) => ErrorView(message: err.toString(), onRetry: () => ref.refresh(maintenanceProvider)),
        data: (tickets) {
          if (tickets.isEmpty) {
            return EmptyView(
              title: 'Không có sự cố nào',
              message: 'Phòng của bạn hiện tại hoạt động bình thường, không có yêu cầu sửa chữa.',
              icon: Icons.build_circle_outlined,
              actionLabel: 'Gửi báo cáo mới',
              onAction: () => context.push('/maintenance/new'),
            );
          }

          return RefreshIndicator(
            onRefresh: () async => ref.refresh(maintenanceProvider),
            color: AppColors.fptOrange,
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: tickets.length,
              itemBuilder: (context, index) => _buildTicketCard(tickets[index]),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTicketCard(MaintenanceTicket t) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(t.id, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.fptNavy)),
              StatusChip(status: t.status),
            ],
          ),
          const SizedBox(height: 8),
          Text(t.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimaryLight)),
          const SizedBox(height: 6),
          Text(t.description, style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight)),
          const Divider(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('KTV: ${t.assignedStaff ?? "Chưa phân công"}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
              Text('Ngày gửi: ${t.createdAt}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
            ],
          ),
        ],
      ),
    );
  }
}
