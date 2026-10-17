import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/error_view.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../../../shared/widgets/status_chip.dart';
import '../providers/contract_provider.dart';
import 'widgets/contract_terms_card.dart';

class ContractViewScreen extends ConsumerWidget {
  const ContractViewScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final contractAsync = ref.watch(contractProvider);
    final notifier = ref.read(contractProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(title: const Text('Hợp đồng Thuê KTX')),
      body: contractAsync.when(
        loading: () => const LoadingIndicator(message: 'Đang tải hợp đồng...'),
        error: (err, stack) => ErrorView(message: err.toString(), onRetry: () => ref.refresh(contractProvider)),
        data: (contract) => SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeaderCard(contract),
              const SizedBox(height: 16),
              _buildDetailsCard(contract),
              const SizedBox(height: 16),
              ContractTermsCard(contract: contract),
              const SizedBox(height: 24),
              if (contract.status != 'SIGNED')
                AppButton(
                  label: 'Ký Hợp đồng Điện tử (E-Sign)',
                  icon: Icons.draw,
                  onPressed: () => notifier.signContract(),
                )
              else
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.successLight,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.success),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.verified, color: AppColors.success),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Hợp đồng đã ký điện tử hợp lệ vào: ${contract.signedAt ?? ""}',
                          style: const TextStyle(fontSize: 12, color: AppColors.success, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderCard(ContractData c) {
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(c.contractNumber, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.fptNavy)),
              StatusChip(status: c.status),
            ],
          ),
          const SizedBox(height: 8),
          Text('Học kỳ: ${c.semester}', style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight)),
          Text('Thời hạn: ${c.startDate} đến ${c.endDate}', style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight)),
        ],
      ),
    );
  }

  Widget _buildDetailsCard(ContractData c) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        children: [
          _row('Phòng & Giường', 'Phòng ${c.roomNumber} - Giường ${c.bedNumber}'),
          const Divider(height: 16),
          _row('Tiền thuê phòng', Formatters.formatCurrency(c.roomFee)),
          const Divider(height: 16),
          _row('Tiền thế chân (Cọc)', Formatters.formatCurrency(c.depositFee)),
          const Divider(height: 16),
          _row('Tổng chi phí', Formatters.formatCurrency(c.roomFee + c.depositFee), isBold: true),
        ],
      ),
    );
  }

  Widget _row(String label, String val, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondaryLight)),
        Text(val, style: TextStyle(fontSize: 13, fontWeight: isBold ? FontWeight.bold : FontWeight.w600, color: isBold ? AppColors.fptOrange : AppColors.fptNavy)),
      ],
    );
  }
}
