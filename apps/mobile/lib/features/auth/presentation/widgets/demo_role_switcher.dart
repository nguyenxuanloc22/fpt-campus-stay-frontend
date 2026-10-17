import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../providers/auth_state_provider.dart';

class DemoRoleSwitcher extends ConsumerWidget {
  const DemoRoleSwitcher({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.fptOrangeLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.fptOrange.withAlpha(70)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Hội đồng Chấm: Thử nghiệm phân quyền',
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.fptOrangeDark),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              _roleButton(context, ref, 'STUDENT', 'Sinh viên'),
              _roleButton(context, ref, 'STAFF', 'Cán bộ QL'),
              _roleButton(context, ref, 'MANAGER', 'Trưởng ban'),
              _roleButton(context, ref, 'ADMIN', 'Admin'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _roleButton(BuildContext context, WidgetRef ref, String role, String label) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 11)),
      onPressed: () {
        ref.read(authProvider.notifier).switchRoleForGradingDemo(role);
        if (role != 'STUDENT') {
          context.go('/notice');
        } else {
          context.go('/home');
        }
      },
    );
  }
}
