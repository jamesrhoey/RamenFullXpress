import 'package:flutter/material.dart';

<<<<<<< login
=======
<<<<<<< registration-page
class Homepage extends StatelessWidget {
  const Homepage({Key? key}) : super(key: key);
=======
>>>>>>> week1
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
<<<<<<< login
  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
=======
  String selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();
  String searchQuery = '';

  // Local cart state
  List<Map<String, dynamic>> cartItems = [];
  int cartItemCount = 0;

  final List<Map<String, dynamic>> menuItems = [
    {
      'name': 'Tonkotsu Ramen',
      'price': 210.00,
      'image': 'assets/ramen1.jpg',
      'category': 'Ramen',
    },
    {
      'name': 'Karaage Ramen',
      'price': 210.00,
      'image': 'assets/ramen2.jpg',
      'category': 'Ramen',
    },
    {
      'name': 'Miso Ramen',
      'price': 210.00,
      'image': 'assets/ramen3.jpg',
      'category': 'Ramen',
    },
    {
      'name': 'Shoyu Ramen',
      'price': 210.00,
      'image': 'assets/ramen4.jpg',
      'category': 'Ramen',
    },
    {
      'name': 'Spicy Ramen',
      'price': 210.00,
      'image': 'assets/ramen5.jpg',
      'category': 'Ramen',
    },
  ];

  // Add-ons data
  final Map<String, List<Map<String, dynamic>>> _addOns = {
    'Ramen': [
      {'name': 'Extra Noodles', 'price': 30.0},
      {'name': 'Extra Chashu', 'price': 50.0},
      {'name': 'Extra Egg', 'price': 20.0},
      {'name': 'Extra Vegetables', 'price': 25.0},
    ],
    'Rice Bowls': [
      {'name': 'Extra Rice', 'price': 15.0},
      {'name': 'Extra Meat', 'price': 40.0},
      {'name': 'Extra Egg', 'price': 20.0},
      {'name': 'Extra Sauce', 'price': 10.0},
    ],
    'Sides': [
      {'name': 'Extra Sauce', 'price': 10.0},
      {'name': 'Extra Portion', 'price': 30.0},
    ],
    'Drinks': [
      {'name': 'Extra Ice', 'price': 0.0},
      {'name': 'Extra Shot', 'price': 15.0},
    ],
  };

  List<Map<String, dynamic>> get filteredMenuItems {
    if (selectedCategory == 'All') {
      return menuItems;
    }
    return menuItems.where((item) => item['category'] == selectedCategory).toList();
  }

  void addToCart(Map<String, dynamic> item, List<Map<String, dynamic>> selectedAddOns) {
    setState(() {
      final existingItem = cartItems.firstWhere(
        (cartItem) => cartItem['name'] == item['name'],
        orElse: () => <String, dynamic>{},
      );

      if (existingItem.isNotEmpty) {
        existingItem['quantity'] = (existingItem['quantity'] ?? 1) + 1;
      } else {
        cartItems.add({
          ...item,
          'quantity': 1,
          'addons': selectedAddOns,
        });
      }
      cartItemCount++;
    });
  }

  void _showAddOnsModal(BuildContext context, Map<String, dynamic> item) {
    List<Map<String, dynamic>> selectedAddOns = [];
    double totalPrice = item['price'] as double;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      enableDrag: true,
      isDismissible: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => Container(
          height: MediaQuery.of(context).size.height * 0.7,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD32D43).withAlpha((0.08 * 255).toInt()),
                      spreadRadius: 1,
                      blurRadius: 10,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Customize Your Order',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A1A1A),
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close),
                      color: const Color(0xFF1A1A1A),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Item details
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFD32D43), width: 1),
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.asset(
                                item['image'] ?? 'assets/placeholder.png',
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Container(
                                    width: 80,
                                    height: 80,
                                    color: Colors.grey[200],
                                    child: const Icon(Icons.image_not_supported),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['name'] ?? 'Unknown Item',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Color(0xFF1A1A1A),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '₱${totalPrice.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                      color: Color(0xFF1A1A1A),
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Add-ons section
                      const Text(
                        'Add-ons',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1A1A1A),
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...(_addOns[item['category']] ?? []).map((addOn) {
                        bool isSelected = selectedAddOns.any((a) => a['name'] == addOn['name']);
                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: CheckboxListTile(
                            value: isSelected,
                            onChanged: (bool? value) {
                              setState(() {
                                if (value == true) {
                                  selectedAddOns.add(addOn);
                                  totalPrice += addOn['price'];
                                } else {
                                  selectedAddOns.removeWhere((a) => a['name'] == addOn['name']);
                                  totalPrice -= addOn['price'];
                                }
                              });
                            },
                            title: Text(
                              addOn['name'],
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF1A1A1A),
                              ),
                            ),
                            subtitle: Text(
                              '₱${addOn['price'].toStringAsFixed(2)}',
                              style: const TextStyle(
                                color: Color(0xFF1A1A1A),
                                fontSize: 12,
                              ),
                            ),
                            activeColor: const Color(0xFFD32D43),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        );
                      }).toList(),
                    ],
                  ),
                ),
              ),
              // Bottom action bar
              Container(
                padding: const EdgeInsets.all(16),
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
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Total Price',
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xFF1A1A1A),
                            ),
                          ),
                          Text(
                            '₱${totalPrice.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1A1A1A),
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        addToCart(item, selectedAddOns);
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${item['name']} added to cart'),
                            backgroundColor: const Color(0xFFD32D43),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD32D43),
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Add to Cart',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
>>>>>>> week1

  @override
  Widget build(BuildContext context) {
    return Scaffold(
<<<<<<< registration-page
      appBar: AppBar(title: const Text('Home')),
      body: const Center(child: Text('Welcome to RamenXpress!')),
    );
  }
}
=======
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
                      'RamenXpress',
                      style: TextStyle(
                        color: Color(0xFF1A1A1A),
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    Stack(
                      children: [
                        IconButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/notifications');
                          },
                          icon: const Icon(Icons.notifications_none, color: Color(0xFF1A1A1A)),
                        ),
                        if (cartItemCount > 0)
                          Positioned(
                            right: 8,
                            top: 8,
                            child: Image.asset(
                              'assets/notif.png',
                              width: 24,
                              height: 24,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(width: 8),
                     const CircleAvatar(
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
                  // Search Bar
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search for your favorite ramen...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                    ),
                    onChanged: (value) {
                      setState(() {
                        searchQuery = value;
                      });
                    },
                  ),
                  const SizedBox(height: 24),

                  // Categories
                  const Text(
                    'Categories',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: ['All', 'Ramen', 'Rice Bowls', 'Sides', 'Drinks'].map((category) {
                        bool isSelected = selectedCategory == category;
                        return Padding(
                          padding: const EdgeInsets.only(right: 12),
                          child: FilterChip(
                            label: Text(category),
                            selected: isSelected,
                            onSelected: (selected) {
                              setState(() {
                                selectedCategory = category;
                              });
                            },
                            selectedColor: const Color(0xFFD32D43),
                            checkmarkColor: Colors.white,
                            labelStyle: TextStyle(
                              color: isSelected ? Colors.white : const Color(0xFF1A1A1A),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Menu Items
                  const Text(
                    'Menu',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.8,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: filteredMenuItems.length,
                    itemBuilder: (context, index) {
                      final item = filteredMenuItems[index];
                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(color: Colors.grey[300]!),
                        ),
                        child: InkWell(
                          onTap: () {
                            _showAddOnsModal(context, item);
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                  child: Image.asset(
                                    item['image'],
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item['name'],
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: Color(0xFF1A1A1A),
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '₱${item['price'].toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        color: Color(0xFFD32D43),
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
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
          currentIndex: 0,
          onTap: (index) {
            switch (index) {
              case 0:
                // Already on home page
                break;
              case 1:
                Navigator.pushNamed(context, '/payment');
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
          selectedItemColor: const Color(0xFFD32D43),
          unselectedItemColor: const Color(0xFF1A1A1A),
          showSelectedLabels: false,
          showUnselectedLabels: false,
          backgroundColor: Colors.white,
          type: BottomNavigationBarType.fixed,
        ),
      ),
    );
  }
}
>>>>>>> week1
>>>>>>> week1
