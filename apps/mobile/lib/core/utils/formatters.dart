import 'package:intl/intl.dart';

class Formatters {
  Formatters._();

  static String formatCurrency(num amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  static String formatDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return '--';
    try {
      final dateTime = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yyyy').format(dateTime);
    } catch (_) {
      return dateStr;
    }
  }

  static String formatDateTime(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return '--';
    try {
      final dateTime = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yyyy HH:mm').format(dateTime);
    } catch (_) {
      return dateStr;
    }
  }
}
