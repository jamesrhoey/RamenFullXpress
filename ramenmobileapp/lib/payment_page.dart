import 'package:flutter/material.dart';

class PaymentPage extends StatefulWidget {
  const PaymentPage({super.key});

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  String selectedDeliveryMethod = 'Pick Up';
  Map<String, dynamic>? selectedPaymentMethod;
  Map<String, dynamic>? selectedAddress;
  final TextEditingController _notesController = TextEditingController();

  List<Map<String, dynamic>> cartItems = [
    {
      'name': 'Tonkotsu Ramen',
      'price': 210.00,
      'image': 'assets/ramen1.jpg',
      'quantity': 1,
    },
  ];

  List<Map<String, dynamic>> deliveryAddresses = [
    {
      'id': '1',
      'street': '123 Main Street',
      'barangay': 'Barangay 1',
      'municipality': 'Manila',
      'province': 'Metro Manila',
      'zipCode': '1000',
      'isDefault': true,
    },
  ];

  void updateQuantity(String name, int change) {
    setState(() {
      final item = cartItems.firstWhere((item) => item['name'] == name);
      final newQuantity = item['quantity'] + change;
      if (newQuantity <= 0) {
        cartItems.removeWhere((item) => item['name'] == name);
      } else {
        item['quantity'] = newQuantity;
      }
    });
  }

  void removeItem(String name) {
    setState(() {
      cartItems.removeWhere((item) => item['name'] == name);
    });
  }

  double get subtotal {
    return cartItems.fold(
      0.0,
      (sum, item) => sum + (item['price'] * item['quantity']),
    );
  }

  double get shippingFee => selectedDeliveryMethod == 'Delivery' ? 50.0 : 0.0;
  double get total => subtotal + shippingFee;

  @override
  Widget build(BuildContext context) {
    if (cartItems.isEmpty) {
      return Scaffold(
        bottomNavigationBar: _buildBottomNavBar(),
        body: CustomScrollView(
          slivers: [
            _buildAppBar(),
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/logo.png',
                      height: 100,
                      opacity: const AlwaysStoppedAnimation(0.5),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Your cart is empty',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Looks like you haven\'t added anything to your cart yet',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: () =>
                          Navigator.pushReplacementNamed(context, '/home'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD32D43),
                        padding: const EdgeInsets.symmetric(
                          vertical: 16,
                          horizontal: 32,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Start Shopping'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      bottomNavigationBar: _buildBottomNavBar(),
      body: CustomScrollView(
        slivers: [
          _buildAppBar(),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ...cartItems.map(
                    (item) => _cartItem(
                      item['name'],
                      item['price'],
                      item['image'],
                      item['quantity'].toString(),
                      () => updateQuantity(item['name'], -1),
                      () => updateQuantity(item['name'], 1),
                      () => removeItem(item['name']),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Delivery Method
                  const Text(
                    'Delivery Method',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  SegmentedButton<String>(
                    segments: const [
                      ButtonSegment(
                        value: 'Pick Up',
                        label: Text('Pick Up'),
                        icon: Icon(Icons.store),
                      ),
                      ButtonSegment(
                        value: 'Delivery',
                        label: Text('Delivery'),
                        icon: Icon(Icons.delivery_dining),
                      ),
                    ],
                    selected: {selectedDeliveryMethod},
                    onSelectionChanged: (Set<String> selected) {
                      setState(() => selectedDeliveryMethod = selected.first);
                    },
                  ),
                  const SizedBox(height: 24),

                  if (selectedDeliveryMethod == 'Delivery') ...[
                    const Text(
                      'Delivery Address',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    if (deliveryAddresses.isNotEmpty)
                      ...deliveryAddresses.map(
                        (address) => Card(
                          child: ListTile(
                            title: Text(
                              '${address['street']}, ${address['barangay']}',
                            ),
                            subtitle: Text(
                              '${address['municipality']}, ${address['province']}',
                            ),
                            trailing: address['isDefault'] == true
                                ? const Chip(label: Text('Default'))
                                : null,
                            onTap: () {
                              setState(() {
                                selectedAddress = address;
                              });
                            },
                          ),
                        ),
                      )
                    else
                      const Text('No delivery addresses available'),
                    const SizedBox(height: 24),
                  ],

                  // Payment Method Section
                  const Text(
                    'Payment Method',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: Color(0xFFF6F0EE),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.account_balance_wallet, size: 32),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Gcash ....9933',
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.edit),
                          onPressed: () {
                            // Add edit functionality if needed
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextButton.icon(
                    onPressed: () {
                      // Add new payment method action
                    },
                    icon: const Icon(Icons.add, color: Color(0xFFFF5B24)),
                    label: const Text(
                      'Add New Payment Method',
                      style: TextStyle(color: Color(0xFFFF5B24)),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Order Notes
                  const Text(
                    'Order Notes (optional)',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _notesController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Add a note to your order...',
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 24),

                  // Summary
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Subtotal'),
                      Text('₱${subtotal.toStringAsFixed(2)}'),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Shipping Fee'),
                      Text('₱${shippingFee.toStringAsFixed(2)}'),
                    ],
                  ),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '₱${total.toStringAsFixed(2)}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Proceed Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // Implement checkout logic here
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD32D43),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Proceed to Payment',
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cartItem(
    String name,
    double price,
    String image,
    String quantity,
    VoidCallback onDecrease,
    VoidCallback onIncrease,
    VoidCallback onRemove,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Image.asset(image, width: 50, height: 50, fit: BoxFit.cover),
        title: Text(name),
        subtitle: Text('₱${price.toStringAsFixed(2)}'),
        trailing: SizedBox(
          width: 120,
          child: Row(
            children: [
              IconButton(icon: const Icon(Icons.remove), onPressed: onDecrease),
              Text(quantity),
              IconButton(icon: const Icon(Icons.add), onPressed: onIncrease),
              IconButton(
                icon: const Icon(Icons.delete_outline),
                onPressed: onRemove,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      floating: true,
      pinned: true,
      expandedHeight: 120,
      backgroundColor: Colors.white,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          color: Colors.white,
          padding: const EdgeInsets.only(top: 60, left: 16, right: 16),
          child: Row(
            children: [
              const Text(
                'Your Cart',
                style: TextStyle(
                  color: Color(0xFF1A1A1A),
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              const CircleAvatar(
                backgroundImage: AssetImage('assets/adminPIC.png'),
                radius: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 10,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: 1,
        onTap: (index) {
          switch (index) {
            case 0:
              Navigator.pushNamed(context, '/home');
              break;
            case 1:
              // Already on payment page
              break;
            case 2:
              Navigator.pushNamed(context, '/order-history');
              break;
            case 3:
              Navigator.pushNamed(context, '/profile');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: ''),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart), label: ''),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: ''),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: ''),
        ],
        selectedItemColor: Color(0xFFD32D43),
        unselectedItemColor: Color(0xFF1A1A1A),
        showSelectedLabels: false,
        showUnselectedLabels: false,
        backgroundColor: Colors.white,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
