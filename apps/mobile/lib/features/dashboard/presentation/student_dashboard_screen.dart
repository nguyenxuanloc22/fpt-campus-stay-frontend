import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/error_view.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../../auth/providers/auth_state_provider.dart';
import '../providers/dashboard_provider.dart';
import 'widgets/application_summary_card.dart';
import 'widgets/assigned_room_card.dart';
import 'widgets/quick_actions_grid.dart';

class StudentDashboardScreen extends ConsumerWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider);
    final dashboardAsync = ref.watch(dashboardProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              user.userName.isNotEmpty ? user.userName : 'Sinh viên FPT',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'MSSV: ${user.studentId} • FPT Campus Tân Uyên',
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Đăng xuất',
            onPressed: () {
              ref.read(authProvider.notifier).logout();
              context.go('/login');
            },
          ),
        ],
      ),
      body: dashboardAsync.when(
        loading: () => const LoadingIndicator(message: 'Đang tải thông tin ký túc xá...'),
        error: (err, stack) => ErrorView(
          message: err.toString(),
          onRetry: () => ref.refresh(dashboardProvider),
        ),
        data: (data) => RefreshIndicator(
          onRefresh: () async => ref.refresh(dashboardProvider),
          color: AppColors.fptOrange,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ApplicationSummaryCard(data: data),
                const SizedBox(height: 16),
                AssignedRoomCard(data: data),
                const SizedBox(height: 20),
                const Text(
                  'Tiện ích sinh viên',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.fptNavy,
                  ),
                ),
                const SizedBox(height: 12),
                const QuickActionsGrid(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
