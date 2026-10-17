import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../providers/dashboard_provider.dart';

class AssignedRoomCard extends StatelessWidget {
  final DashboardData data;

  const AssignedRoomCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    if (data.assignedRoom == null) return const SizedBox.shrink();

    return Container(
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
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.fptOrangeLight,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.meeting_room, color: AppColors.fptOrange, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Phòng ${data.assignedRoom} - Giường ${data.assignedBed}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimaryLight,
                      ),
                    ),
                    Text(
                      data.buildingName ?? 'KTX FPT Tân Uyên',
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _infoTile('Hợp đồng', data.isContractSigned ? 'Đã ký điện tử' : 'Chưa ký', data.isContractSigned),
              _infoTile('Học phí KTX', data.isInvoicePaid ? 'Đã thanh toán' : 'Chờ nộp', data.isInvoicePaid),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoTile(String label, String value, bool isOk) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isOk ? AppColors.success : AppColors.warning,
          ),
        ),
      ],
    );
  }
}
