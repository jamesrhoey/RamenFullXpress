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
    return cartItems.fold(0.0, (sum, item) => sum + (item['price'] * item['quantity']));
  }

  double get shippingFee => selectedDeliveryMethod == 'Delivery' ? 50.0 : 0.0;
  double get total => subtotal + shippingFee;

  Widget build(BuildContext context) {
    if (cartItems.isEmpty) {
      return Scaffold(
        body: CustomScrollView(
          slivers: [
            SliverAppBar(
              floating: true,
              pinned: true,
              expandedHeight: 120,
              backgroundColor: Colors.white,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  color: Colors.white,
                  padding: const EdgeInsets.only(top: 60, left: 16, right: 16),
                  child: const Row(
                    children: [
                      Text(
                        'Your Cart',
                        style: TextStyle(
                          color: Color(0xFF1A1A1A),
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Spacer(),
                      CircleAvatar(
                        backgroundImage: AssetImage('assets/adminPIC.png'),
                        radius: 20,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            SliverFillRemaining(
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
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Looks like you haven\'t added anything to your cart yet',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF1A1A1A),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacementNamed(context, '/home');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD32D43),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.shopping_bag_outlined),
                          SizedBox(width: 8),
                          Text(
                            'Start Shopping',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
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
                    CircleAvatar(
                      backgroundImage: AssetImage('assets/adminPIC.png'),
                      radius: 20,
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ...cartItems.map((item) {
                    return _cartItem(
                      item['name'],
                      item['price'],
                      item['image'],
                      item['quantity'].toString(),
                      () => updateQuantity(item['name'], -1),
                      () => updateQuantity(item['name'], 1),
                      () => removeItem(item['name']),
                    );
                  }).toList(),
                  const SizedBox(height: 24),
  }
}
