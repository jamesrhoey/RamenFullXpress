import 'package:flutter/material.dart';
import '../models/payment_method.dart';

class PaymentmethodPage extends StatefulWidget {
  const PaymentmethodPage({super.key});

  @override
  State<PaymentmethodPage> createState() => _PaymentmethodPageState();
}

class _PaymentmethodPageState extends State<PaymentmethodPage> {
  late List<PaymentMethod> paymentMethods;
  late PaymentMethod defaultMethod;

  @override
  void initState() {
    super.initState();
    paymentMethods = [
      PaymentMethod(
        id: '1',
        type: PaymentType.gcash,
        title: 'Carla Ramos',
        accountNumber: '09171234567',
        isDefault: true,
      ),
      PaymentMethod(
        id: '2',
        type: PaymentType.gcash,
        title: 'Kyla Cabungcal',
        accountNumber: '09179876543',
      ),
      PaymentMethod(
        id: '3',
        type: PaymentType.maya,
        title: 'James Rhoey De Castro',
        accountNumber: '09175551234',
      ),
      PaymentMethod(
        id: '4',
        type: PaymentType.gcash,
        title: 'Thirdy Ornales',
        accountNumber: '09176667777',
      ),
      PaymentMethod(
        id: '5',
        type: PaymentType.maya,
        title: 'Maybel Pesigan',
        accountNumber: '09179998888',
      ),
    ];
    defaultMethod = paymentMethods.firstWhere((m) => m.isDefault, orElse: () => paymentMethods[0]);
  }

  void setDefaultMethod(PaymentMethod method) {
    setState(() {
      paymentMethods = paymentMethods.map((m) {
        if (m.id == method.id) {
          return PaymentMethod(
            id: m.id,
            type: m.type,
            title: m.title,
            accountNumber: m.accountNumber,
            isDefault: true,
          );
        } else {
          return PaymentMethod(
            id: m.id,
            type: m.type,
            title: m.title,
            accountNumber: m.accountNumber,
            isDefault: false,
          );
        }
      }).toList();
      defaultMethod = method;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment Methods'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
      ),

      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: paymentMethods.length,
              itemBuilder: (context, index) {
                final method = paymentMethods[index];
                final isDefault = method.isDefault;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ListTile(
                    leading: Icon(
                      method.icon,
                      color: Colors.orange,
                      size: 32,
                    ),
                    title: Row(
                      children: [
                        Text(
                          method.displayName,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        if (isDefault)
                          Container(
                            margin: const EdgeInsets.only(left: 8),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.orange[100],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'Default',
                              style: TextStyle(
                                color: Colors.orange,
                                fontSize: 12,
                              ),
                            ),
                          ),
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(method.title),
                        Text(
                          method.accountNumber,
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.edit, color: Colors.grey),
                      onPressed: () {
                        // Edit logic here
                      },
                    ),
                    onTap: () {
                      setDefaultMethod(method);
                    },
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () async {
                  final result = await Navigator.pushNamed(
                    context,
                    '/edit-payment-method',
                  );
                  if (result != null && result is Map<String, dynamic>) {
                    setState(() {
                      // If set as default, unset all others
                      if (result['isDefault'] == true) {
                        paymentMethods = paymentMethods.map((m) => PaymentMethod(
                          id: m.id,
                          type: m.type,
                          title: m.title,
                          accountNumber: m.accountNumber,
                          isDefault: false,
                        )).toList();
                      }
                      final newMethod = PaymentMethod(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        type: result['type'],
                        title: result['title'],
                        accountNumber: result['accountNumber'],
                        isDefault: result['isDefault'] ?? false,
                      );
                      paymentMethods.add(newMethod);
                      if (newMethod.isDefault) {
                        defaultMethod = newMethod;
                      }
                    });
                  }
                },
                icon: const Icon(Icons.add),
                label: const Text('Add Payment Method'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                   borderRadius: BorderRadius.circular(12),

                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
