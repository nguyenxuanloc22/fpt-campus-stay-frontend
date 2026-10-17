import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../shared/widgets/status_chip.dart';
import '../../providers/dashboard_provider.dart';

class ApplicationSummaryCard extends StatelessWidget {
  final DashboardData data;

  const ApplicationSummaryCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.fptNavyDark, AppColors.fptNavy],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.fptNavy.withAlpha(40),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Học kỳ: ${data.currentSemester}',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
              StatusChip(status: data.applicationStatus),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Đơn đăng ký Ký túc xá',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            data.isInvoicePaid
                ? 'Hợp đồng & thanh toán đã hoàn tất. Chúc bạn kỳ học vui vẻ!'
                : 'Đơn đã được phê duyệt. Vui lòng ký hợp đồng và thanh toán VietQR.',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }
}
