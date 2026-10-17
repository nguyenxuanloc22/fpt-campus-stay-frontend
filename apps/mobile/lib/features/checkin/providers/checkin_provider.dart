import 'package:flutter_riverpod/flutter_riverpod.dart';

class CheckinAppointmentData {
  final String appointmentType; // 'CHECK_IN' or 'CHECK_OUT'
  final String date;
  final String timeSlot;
  final String passCode; // e.g. 'PASS-FPT-7721'
  final String status; // 'CONFIRMED', 'COMPLETED'
  final List<String> handoverItems;

  const CheckinAppointmentData({
    required this.appointmentType,
    required this.date,
    required this.timeSlot,
    required this.passCode,
    required this.status,
    required this.handoverItems,
  });

  CheckinAppointmentData copyWith({
    String? appointmentType,
    String? date,
    String? timeSlot,
    String? passCode,
    String? status,
  }) {
    return CheckinAppointmentData(
      appointmentType: appointmentType ?? this.appointmentType,
      date: date ?? this.date,
      timeSlot: timeSlot ?? this.timeSlot,
      passCode: passCode ?? this.passCode,
      status: status ?? this.status,
      handoverItems: handoverItems,
    );
  }
}

class CheckinNotifier extends StateNotifier<CheckinAppointmentData> {
  CheckinNotifier()
      : super(const CheckinAppointmentData(
          appointmentType: 'CHECK_IN',
          date: '01/09/2026',
          timeSlot: '08:30 - 10:30 (Buổi Sáng)',
          passCode: 'GATE-FPT-8942',
          status: 'CONFIRMED',
          handoverItems: [
            'Chìa khóa phòng A-304 (01 chiếc)',
            'Thẻ từ thang máy & ra vào KTX Tân Uyên (01 thẻ)',
            'Điều khiển điều hòa nhiệt độ Daikin (01 chiếc)',
            'Nệm và ga trải giường tiêu chuẩn KTX (01 bộ)',
            'Bàn học và ghế gấp cá nhân (01 bộ)',
          ],
        ));

  void updateAppointment(String type, String date, String timeSlot) {
    state = state.copyWith(
      appointmentType: type,
      date: date,
      timeSlot: timeSlot,
      passCode: 'GATE-FPT-${DateTime.now().millisecondsSinceEpoch.toString().substring(9)}',
      status: 'CONFIRMED',
    );
  }
}

final checkinProvider =
    StateNotifierProvider<CheckinNotifier, CheckinAppointmentData>((ref) {
  return CheckinNotifier();
});
