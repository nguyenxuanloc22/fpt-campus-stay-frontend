import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';

class QuickActionsGrid extends StatelessWidget {
  const QuickActionsGrid({super.key});

  @override
  Widget build(BuildContext context) {
    const actions = [
      _ActionItem(Icons.how_to_reg_outlined, 'Đăng ký KTX', '/registration', AppColors.fptOrange),
      _ActionItem(Icons.hotel_outlined, 'Tra cứu phòng', '/rooms', AppColors.info),
      _ActionItem(Icons.group_outlined, 'Bạn cùng phòng', '/roommates', AppColors.success),
      _ActionItem(Icons.history_edu_outlined, 'Hợp đồng điện tử', '/contract', AppColors.fptNavy),
      _ActionItem(Icons.qr_code_2_outlined, 'Thanh toán VietQR', '/payment', AppColors.warning),
      _ActionItem(Icons.build_outlined, 'Báo cáo sự cố', '/maintenance', AppColors.error),
      _ActionItem(Icons.luggage_outlined, 'Lịch Check-in/out', '/checkin', AppColors.fptOrangeDark),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: actions.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 2.2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemBuilder: (context, index) {
        final item = actions[index];
        return InkWell(
          onTap: () => context.push(item.route),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: item.color.withAlpha(25),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(item.icon, color: item.color, size: 20),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    item.label,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimaryLight,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ActionItem {
  final IconData icon;
  final String label;
  final String route;
  final Color color;

  const _ActionItem(this.icon, this.label, this.route, this.color);
}
