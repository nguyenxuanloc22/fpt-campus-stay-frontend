import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/app/app.dart';
import 'package:mobile/shared/widgets/app_button.dart';
import 'package:mobile/shared/widgets/status_chip.dart';

void main() {
  testWidgets('CampusStayApp smoke test - renders Dashboard when authenticated', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: CampusStayApp(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Tiện ích sinh viên'), findsOneWidget);
    expect(find.text('Đăng ký KTX'), findsOneWidget);
  });

  testWidgets('AppButton renders label and triggers callback on press', (tester) async {
    bool tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: AppButton(
            label: 'Xác nhận nộp đơn',
            onPressed: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('Xác nhận nộp đơn'), findsOneWidget);
    await tester.tap(find.text('Xác nhận nộp đơn'));
    expect(tapped, isTrue);
  });

  testWidgets('StatusChip renders appropriate label according to status', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Column(
            children: [
              StatusChip(status: 'APPROVED'),
              StatusChip(status: 'PENDING'),
            ],
          ),
        ),
      ),
    );

    expect(find.text('Hoàn thành / Đã duyệt'), findsOneWidget);
    expect(find.text('Đang xử lý / Chờ duyệt'), findsOneWidget);
  });
}
