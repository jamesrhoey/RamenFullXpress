import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // Sample data for Person 1 - Ramen Restaurant
  
  // Menu Items
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
  final Map<String, List<Map<String, dynamic>>> addOns = {
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

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}