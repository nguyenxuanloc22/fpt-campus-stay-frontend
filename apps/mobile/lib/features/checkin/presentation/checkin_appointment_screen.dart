import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/widgets/status_chip.dart';
import '../providers/checkin_provider.dart';

class CheckinAppointmentScreen extends ConsumerWidget {
  const CheckinAppointmentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appointment = ref.watch(checkinProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(title: const Text('Lịch Check-in / Check-out')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildGatePassCard(appointment),
            const SizedBox(height: 16),
            _buildAppointmentDetails(appointment),
            const SizedBox(height: 16),
            _buildHandoverCard(appointment),
          ],
        ),
      ),
    );
  }

  Widget _buildGatePassCard(CheckinAppointmentData data) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.fptOrangeLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.fptOrange.withAlpha(80)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Thẻ thông hành qua Cổng KTX', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.fptOrangeDark)),
              StatusChip(status: data.status),
            ],
          ),
          const SizedBox(height: 16),
          const Icon(Icons.qr_code, size: 90, color: AppColors.fptNavy),
          const SizedBox(height: 8),
          Text(
            data.passCode,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 2, color: AppColors.fptOrange),
          ),
          const SizedBox(height: 4),
          const Text('Xuất trình mã này cho Cán bộ Quản lý KTX & Bảo vệ tại sảnh tòa nhà', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: AppColors.textSecondaryLight)),
        ],
      ),
    );
  }

  Widget _buildAppointmentDetails(CheckinAppointmentData data) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        children: [
          _row('Loại thủ tục', data.appointmentType == 'CHECK_IN' ? 'Nhận phòng (Check-in)' : 'Trả phòng (Check-out)'),
          const Divider(height: 16),
          _row('Ngày hẹn', data.date),
          const Divider(height: 16),
          _row('Khung giờ', data.timeSlot),
        ],
      ),
    );
  }

  Widget _buildHandoverCard(CheckinAppointmentData data) {
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
          const Text('Danh mục Biên bản Bàn giao Cơ sở vật chất', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.fptNavy)),
          const SizedBox(height: 12),
          ...data.handoverItems.map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  const Icon(Icons.check_box_outlined, size: 18, color: AppColors.success),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(item, style: const TextStyle(fontSize: 12, color: AppColors.textPrimaryLight)),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _row(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight)),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.fptNavy)),
      ],
    );
  }
}
