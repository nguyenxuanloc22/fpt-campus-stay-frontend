import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

class StatusChip extends StatelessWidget {
  final String status;
  final String? customLabel;

  const StatusChip({
    super.key,
    required this.status,
    this.customLabel,
  });

  @override
  Widget build(BuildContext context) {
    final config = _resolveConfig(status.toUpperCase());

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: config.bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: config.borderColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(config.icon, size: 13, color: config.textColor),
          const SizedBox(width: 4),
          Text(
            customLabel ?? config.label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: config.textColor,
            ),
          ),
        ],
      ),
    );
  }

  _StatusConfig _resolveConfig(String s) {
    switch (s) {
      case 'APPROVED':
      case 'PAID':
      case 'SIGNED':
      case 'RESOLVED':
      case 'OCCUPIED':
      case 'ACTIVE':
        return const _StatusConfig(
          label: 'Hoàn thành / Đã duyệt',
          bgColor: AppColors.successLight,
          textColor: AppColors.success,
          borderColor: AppColors.success,
          icon: Icons.check_circle_outline,
        );
      case 'PENDING':
      case 'SUBMITTED':
      case 'WAITING_PAYMENT':
      case 'UNDER_REVIEW':
        return const _StatusConfig(
          label: 'Đang xử lý / Chờ duyệt',
          bgColor: AppColors.warningLight,
          textColor: AppColors.warning,
          borderColor: AppColors.warning,
          icon: Icons.access_time,
        );
      case 'REJECTED':
      case 'CANCELLED':
      case 'FAILED':
      case 'OVERDUE':
        return const _StatusConfig(
          label: 'Từ chối / Đã hủy',
          bgColor: AppColors.errorLight,
          textColor: AppColors.error,
          borderColor: AppColors.error,
          icon: Icons.highlight_off,
        );
      case 'IN_PROGRESS':
      case 'ASSIGNED':
      default:
        return const _StatusConfig(
          label: 'Đang tiến hành',
          bgColor: AppColors.infoLight,
          textColor: AppColors.info,
          borderColor: AppColors.info,
          icon: Icons.info_outline,
        );
    }
  }
}

class _StatusConfig {
  final String label;
  final Color bgColor;
  final Color textColor;
  final Color borderColor;
  final IconData icon;

  const _StatusConfig({
    required this.label,
    required this.bgColor,
    required this.textColor,
    required this.borderColor,
    required this.icon,
  });
}
