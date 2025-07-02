import 'package:flutter/material.dart';

class PaymentmethodPage extends StatefulWidget {
  const PaymentmethodPage({super.key});

  @override
  State<PaymentmethodPage> createState() => _PaymentmethodPageState();
}

class _PaymentmethodPageState extends State<PaymentmethodPage> {
  String defaultMethod = "GCash - Carla Ramos";

  final List<Map<String, dynamic>> paymentMethods = [
    {
      "name": "GCash",
      "icon": Icons.account_balance_wallet,
      "holder": "Carla Ramos",
    },
    {
      "name": "GCash",
      "icon": Icons.account_balance_wallet,
      "holder": "Kyla Cabungcal",
    },
    {
      "name": "PayMaya",
      "icon": Icons.account_balance,
      "holder": "James Rhoey De Castro",
    },
    {
      "name": "GCash",
      "icon": Icons.account_balance_wallet,
      "holder": "Thirdy Ornales",
    },
    {
      "name": "PayMaya",
      "icon": Icons.account_balance,
      "holder": "Maybel Pesigan",
    },
  ];

  String getDisplayName(Map<String, dynamic> method) {
    return "${method['name']} - ${method['holder']}";
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
                final isDefault = getDisplayName(method) == defaultMethod;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ListTile(
                    leading: Icon(
                      method['icon'],
                      color: Colors.orange,
                      size: 32,
                    ),
                    title: Row(
                      children: [
                        Text(
                          method['name'],
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
                    subtitle: Text(method['holder']),
                    trailing: IconButton(
                      icon: const Icon(Icons.edit, color: Colors.grey),
                      onPressed: () {
                        // Edit logic here
                      },
                    ),
                    onTap: () {
                      setState(() {
                        defaultMethod = getDisplayName(method);
                      });
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
                onPressed: () {
                  // Add payment method logic
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
