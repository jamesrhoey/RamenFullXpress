import 'package:flutter/material.dart';
import 'models/payment_method.dart';

class PaymentmethodPage extends StatefulWidget {
  const PaymentmethodPage({super.key});

  @override
  State<PaymentmethodPage> createState() => _PaymentmethodPageState();
}

class _PaymentmethodPageState extends State<PaymentmethodPage> {
  // Sample payment method data
  final List<PaymentMethod> paymentMethods = [
    PaymentMethod(
      id: '1',
      type: PaymentType.gcash,
      title: 'John Doe',
      accountNumber: '09123456789',
      isDefault: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment Methods'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        centerTitle: true,
      ),
      body: paymentMethods.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.credit_card, size: 80, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text(
                    'No payment methods added yet',
                    style: TextStyle(fontSize: 16, color: Colors.black54),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/edit-payment-method');
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Payment Method'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            )
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: paymentMethods.length,
                    itemBuilder: (context, index) {
                      final paymentMethod = paymentMethods[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: Icon(
                            paymentMethod.icon,
                            color: Colors.orange,
                            size: 32,
                          ),
                          title: Text(
                            paymentMethod.displayName,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          subtitle: Text(paymentMethod.title),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (paymentMethod.isDefault)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Text(
                                    'Default',
                                    style: TextStyle(
                                      color: Colors.orange,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              const SizedBox(width: 8),
                              IconButton(
                                icon: const Icon(Icons.edit, color: Colors.grey),
                                onPressed: () {
                                  Navigator.pushNamed(context, '/edit-payment-method');
                                },
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/edit-payment-method');
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Payment Method'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
