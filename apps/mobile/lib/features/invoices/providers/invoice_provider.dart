import 'package:flutter_riverpod/flutter_riverpod.dart';

class InvoiceData {
  final String invoiceNumber;
  final String semester;
  final double amount;
  final String status; // 'UNPAID', 'PAID'
  final String bankName;
  final String accountNumber;
  final String accountHolder;
  final String transferContent;
  final String qrPayload;

  const InvoiceData({
    required this.invoiceNumber,
    required this.semester,
    required this.amount,
    required this.status,
    required this.bankName,
    required this.accountNumber,
    required this.accountHolder,
    required this.transferContent,
    required this.qrPayload,
  });

  InvoiceData copyWith({String? status}) {
    return InvoiceData(
      invoiceNumber: invoiceNumber,
      semester: semester,
      amount: amount,
      status: status ?? this.status,
      bankName: bankName,
      accountNumber: accountNumber,
      accountHolder: accountHolder,
      transferContent: transferContent,
      qrPayload: qrPayload,
    );
  }
}

class InvoiceNotifier extends StateNotifier<AsyncValue<InvoiceData>> {
  InvoiceNotifier() : super(const AsyncValue.loading()) {
    _loadInvoice();
  }

  Future<void> _loadInvoice() async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    state = const AsyncValue.data(
      InvoiceData(
        invoiceNumber: 'INV-2026-FPT-8891',
        semester: 'Fall 2026',
        amount: 4800000,
        status: 'UNPAID',
        bankName: 'TPBank (Ngân hàng Tiên Phong)',
        accountNumber: '0987654321',
        accountHolder: 'TRUONG DAI HOC FPT - KTX TAN UYEN',
        transferContent: 'CAMPUSSTAY SE170123 HP',
        qrPayload: 'https://img.vietqr.io/image/TPB-0987654321-compact2.png?amount=4800000&addInfo=CAMPUSSTAY%20SE170123%20HP',
      ),
    );
  }

  Future<void> simulatePayment() async {
    final current = state.value;
    if (current == null) return;

    state = const AsyncValue.loading();
    await Future<void>.delayed(const Duration(milliseconds: 500));
    state = AsyncValue.data(current.copyWith(status: 'PAID'));
  }
}

final invoiceProvider =
    StateNotifierProvider<InvoiceNotifier, AsyncValue<InvoiceData>>((ref) {
  return InvoiceNotifier();
});
