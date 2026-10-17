import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/app_button.dart';
import '../providers/auth_state_provider.dart';

class RoleNoticeScreen extends ConsumerWidget {
  const RoleNoticeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: const BoxDecoration(
                  color: AppColors.warningLight,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.laptop_chromebook, size: 56, color: AppColors.warning),
              ),
              const SizedBox(height: 24),
              const Text(
                'Ứng dụng dành riêng cho Sinh viên',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
              ),
              const SizedBox(height: 12),
              Text(
                'Tài khoản hiện tại (${user.userName} - ${user.role}) thuộc bộ phận quản lý/vận hành.\n'
                'Vui lòng đăng nhập trên trình duyệt Web để sử dụng đầy đủ các chức năng quản trị nghiệp vụ.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14, color: AppColors.textSecondaryLight, height: 1.5),
              ),
              const SizedBox(height: 32),
              AppButton(
                label: 'Chuyển sang Sinh viên (Demo)',
                icon: Icons.school,
                onPressed: () {
                  ref.read(authProvider.notifier).loginAsStudent();
                  context.go('/home');
                },
              ),
              const SizedBox(height: 12),
              AppButton(
                label: 'Đăng xuất',
                variant: AppButtonVariant.outline,
                onPressed: () {
                  ref.read(authProvider.notifier).logout();
                  context.go('/login');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
