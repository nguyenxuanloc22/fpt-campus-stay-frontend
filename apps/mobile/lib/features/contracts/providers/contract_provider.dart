import 'package:flutter_riverpod/flutter_riverpod.dart';

class ContractData {
  final String contractNumber;
  final String semester;
  final String roomNumber;
  final String bedNumber;
  final String startDate;
  final String endDate;
  final double roomFee;
  final double depositFee;
  final String status; // 'PENDING_SIGNATURE', 'SIGNED'
  final String? signedAt;
  final List<String> terms;

  const ContractData({
    required this.contractNumber,
    required this.semester,
    required this.roomNumber,
    required this.bedNumber,
    required this.startDate,
    required this.endDate,
    required this.roomFee,
    required this.depositFee,
    required this.status,
    this.signedAt,
    required this.terms,
  });

  ContractData copyWith({
    String? status,
    String? signedAt,
  }) {
    return ContractData(
      contractNumber: contractNumber,
      semester: semester,
      roomNumber: roomNumber,
      bedNumber: bedNumber,
      startDate: startDate,
      endDate: endDate,
      roomFee: roomFee,
      depositFee: depositFee,
      status: status ?? this.status,
      signedAt: signedAt ?? this.signedAt,
      terms: terms,
    );
  }
}

class ContractNotifier extends StateNotifier<AsyncValue<ContractData>> {
  ContractNotifier() : super(const AsyncValue.loading()) {
    _loadContract();
  }

  Future<void> _loadContract() async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    state = const AsyncValue.data(
      ContractData(
        contractNumber: 'HD-2026-FPT-0419',
        semester: 'Fall 2026',
        roomNumber: 'A-304',
        bedNumber: 'B2 (Tầng 1)',
        startDate: '01/09/2026',
        endDate: '31/12/2026',
        roomFee: 4800000,
        depositFee: 1000000,
        status: 'SIGNED',
        signedAt: '18/08/2026 14:32:00',
        terms: [
          'Bên B có nghĩa vụ giữ gìn vệ sinh chung và bảo quản tài sản trong phòng.',
          'Nghiêm cấm nấu ăn bằng bếp gas, sử dụng các thiết bị điện công suất lớn trái quy định.',
          'Tuân thủ giờ giới nghiêm đóng cửa ký túc xá sau 23:00 hàng ngày.',
          'Mọi hư hỏng do lỗi chủ quan sẽ bị trừ vào tiền đặt cọc khi thanh lý hợp đồng.',
        ],
      ),
    );
  }

  Future<void> signContract() async {
    final current = state.value;
    if (current == null) return;

    state = const AsyncValue.loading();
    await Future<void>.delayed(const Duration(milliseconds: 500));
    state = AsyncValue.data(
      current.copyWith(
        status: 'SIGNED',
        signedAt: 'Vừa xong (Ký số điện tử OTP)',
      ),
    );
  }
}

final contractProvider =
    StateNotifierProvider<ContractNotifier, AsyncValue<ContractData>>((ref) {
  return ContractNotifier();
});
