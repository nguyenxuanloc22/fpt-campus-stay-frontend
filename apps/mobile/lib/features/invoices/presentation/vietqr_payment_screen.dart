import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/error_view.dart';
import '../../../shared/widgets/loading_indicator.dart';
import '../../../shared/widgets/status_chip.dart';
import '../providers/invoice_provider.dart';

class VietQrPaymentScreen extends ConsumerWidget {
  const VietQrPaymentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final invoiceAsync = ref.watch(invoiceProvider);
    final notifier = ref.read(invoiceProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(title: const Text('Thanh toán VietQR KTX')),
      body: invoiceAsync.when(
        loading: () => const LoadingIndicator(message: 'Đang tải hóa đơn & VietQR...'),
        error: (err, stack) => ErrorView(message: err.toString(), onRetry: () => ref.refresh(invoiceProvider)),
        data: (inv) => SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildStatusHeader(inv),
              const SizedBox(height: 16),
              _buildQrCodeCard(inv),
              const SizedBox(height: 16),
              _buildBankDetailsCard(context, inv),
              const SizedBox(height: 24),
              if (inv.status != 'PAID')
                AppButton(
                  label: 'Giả lập đã chuyển khoản VietQR (Demo)',
                  icon: Icons.check_circle_outline,
                  onPressed: () => notifier.simulatePayment(),
                )
              else
                const Text(
                  'Hóa đơn đã được quyết toán thành công.',
                  style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.success),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusHeader(InvoiceData inv) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(inv.invoiceNumber, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.fptNavy)),
            Text('Kỳ: ${inv.semester}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
          ],
        ),
        StatusChip(status: inv.status),
      ],
    );
  }

  Widget _buildQrCodeCard(InvoiceData inv) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        children: [
          Container(
            width: 180,
            height: 180,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.borderLight),
            ),
            child: const Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.qr_code_2, size: 120, color: AppColors.fptNavy),
                Text(
                  'VietQR NapAS 247',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.fptOrangeDark),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(
            Formatters.formatCurrency(inv.amount),
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.fptOrange),
          ),
          const SizedBox(height: 4),
          const Text('Quét mã qua app ngân hàng bất kỳ để thanh toán tự động', style: TextStyle(fontSize: 11, color: AppColors.textSecondaryLight)),
        ],
      ),
    );
  }

  Widget _buildBankDetailsCard(BuildContext context, InvoiceData inv) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        children: [
          _bankRow('Ngân hàng', inv.bankName),
          const Divider(height: 16),
          _bankRow('Số tài khoản', inv.accountNumber),
          const Divider(height: 16),
          _bankRow('Chủ tài khoản', inv.accountHolder),
          const Divider(height: 16),
          _bankRow('Nội dung CK', inv.transferContent, highlight: true),
        ],
      ),
    );
  }

  Widget _bankRow(String label, String value, {bool highlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondaryLight)),
        Text(
          value,
          style: TextStyle(
            fontSize: 12,
            fontWeight: highlight ? FontWeight.bold : FontWeight.w600,
            color: highlight ? AppColors.fptOrange : AppColors.fptNavy,
          ),
        ),
      ],
    );
  }
}
