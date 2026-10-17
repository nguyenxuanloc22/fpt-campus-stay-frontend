import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../providers/contract_provider.dart';

class ContractTermsCard extends StatelessWidget {
  final ContractData contract;

  const ContractTermsCard({super.key, required this.contract});

  @override
  Widget build(BuildContext context) {
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
          const Text(
            'Điều khoản & Quy định KTX',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.fptNavy),
          ),
          const SizedBox(height: 10),
          ...contract.terms.asMap().entries.map((entry) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${entry.key + 1}. ',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.fptOrange),
                  ),
                  Expanded(
                    child: Text(
                      entry.value,
                      style: const TextStyle(fontSize: 12, color: AppColors.textPrimaryLight, height: 1.4),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
