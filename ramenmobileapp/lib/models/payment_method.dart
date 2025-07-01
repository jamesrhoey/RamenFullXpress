import 'package:flutter/material.dart';

enum PaymentType {
  gcash,
  maya,
}

class PaymentMethod {
  final String id;
  final PaymentType type;
  final String title;
  final String accountNumber;
  final bool isDefault;

  PaymentMethod({
    required this.id,
    required this.type,
    required this.title,
    required this.accountNumber,
    this.isDefault = false,
  });

  String get displayName {
    switch (type) {
      case PaymentType.gcash:
        return 'GCash •••• ${accountNumber.substring(accountNumber.length - 4)}';
      case PaymentType.maya:
        return 'Maya •••• ${accountNumber.substring(accountNumber.length - 4)}';
    }
  }

  IconData get icon {
    switch (type) {
      case PaymentType.gcash:
        return Icons.account_balance_wallet;
      case PaymentType.maya:
        return Icons.account_balance;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type.toString(),
      'title': title,
      'accountNumber': accountNumber,
      'isDefault': isDefault,
    };
  }

  factory PaymentMethod.fromJson(Map<String, dynamic> json) {
    return PaymentMethod(
      id: json['id'],
      type: PaymentType.values.firstWhere(
        (e) => e.toString() == json['type'],
      ),
      title: json['title'],
      accountNumber: json['accountNumber'],
      isDefault: json['isDefault'] ?? false,
    );
  }
} 