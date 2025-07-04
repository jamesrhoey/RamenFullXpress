import '../models/menu_item.dart';

class MenuService {
  static final MenuService _instance = MenuService._internal();
  
  factory MenuService() {
    return _instance;
  }
  
  MenuService._internal();

  final List<MenuItem> _menuItems = [
    MenuItem(
      name: 'Tonkotsu Ramen',
      price: 210.00,
      image: 'assets/ramen1.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Extra Noodles', price: 30.0),
        AddOn(name: 'Extra Chashu', price: 50.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Vegetables', price: 25.0),
      ],
    ),
    MenuItem(
      name: 'Karaage Ramen',
      price: 210.00,
      image: 'assets/ramen2.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Extra Noodles', price: 30.0),
        AddOn(name: 'Extra Chashu', price: 50.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Vegetables', price: 25.0),
      ],
    ),
    MenuItem(
      name: 'Miso Ramen',
      price: 210.00,
      image: 'assets/ramen3.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Extra Noodles', price: 30.0),
        AddOn(name: 'Extra Chashu', price: 50.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Vegetables', price: 25.0),
      ],
    ),
    MenuItem(
      name: 'Shoyu Ramen',
      price: 210.00,
      image: 'assets/ramen4.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Extra Noodles', price: 30.0),
        AddOn(name: 'Extra Chashu', price: 50.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Vegetables', price: 25.0),
      ],
    ),
    MenuItem(
      name: 'Spicy Ramen',
      price: 210.00,
      image: 'assets/ramen5.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Extra Noodles', price: 30.0),
        AddOn(name: 'Extra Chashu', price: 50.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Vegetables', price: 25.0),
      ],
    ),
    MenuItem(
      name: 'Vegetarian Ramen',
      price: 210.00,
      image: 'assets/ramen6.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Extra Noodles', price: 30.0),
        AddOn(name: 'Extra Vegetables', price: 25.0),
        AddOn(name: 'Extra Tofu', price: 30.0),
      ],
    ),
    MenuItem(
      name: 'Chicken Karaage',
      price: 160.00,
      image: 'assets/ricebowl.jpg',
      category: 'Rice Bowls',
      availableAddOns: [
        AddOn(name: 'Extra Rice', price: 15.0),
        AddOn(name: 'Extra Meat', price: 40.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Sauce', price: 10.0),
      ],
    ),
    MenuItem(
      name: 'Chashu Don',
      price: 150.00,
      image: 'assets/ricebowl2.jpg',
      category: 'Rice Bowls',
      availableAddOns: [
        AddOn(name: 'Extra Rice', price: 15.0),
        AddOn(name: 'Extra Meat', price: 40.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Sauce', price: 10.0),
      ],
    ),
    MenuItem(
      name: 'Tonkatsu',
      price: 170.00,
      image: 'assets/ricebowl3.jpg',
      category: 'Rice Bowls',
      availableAddOns: [
        AddOn(name: 'Extra Rice', price: 15.0),
        AddOn(name: 'Extra Meat', price: 40.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Sauce', price: 10.0),
      ],
    ),
    MenuItem(
      name: 'Katsu Curry',
      price: 180.00,
      image: 'assets/ricebowl4.jpg',
      category: 'Rice Bowls',
      availableAddOns: [
        AddOn(name: 'Extra Rice', price: 15.0),
        AddOn(name: 'Extra Meat', price: 40.0),
        AddOn(name: 'Extra Egg', price: 20.0),
        AddOn(name: 'Extra Sauce', price: 10.0),
      ],
    ),
    MenuItem(
      name: 'Gyoza (4 pcs)',
      price: 80.00,
      image: 'assets/side1.jpg',
      category: 'Sides',
      availableAddOns: [
        AddOn(name: 'Extra Sauce', price: 10.0),
        AddOn(name: 'Extra Portion', price: 30.0),
      ],
    ),
    MenuItem(
      name: 'Tempura (4 pcs)',
      price: 150.00,
      image: 'assets/side2.jpg',
      category: 'Sides',
      availableAddOns: [
        AddOn(name: 'Extra Sauce', price: 10.0),
        AddOn(name: 'Extra Portion', price: 30.0),
      ],
    ),
    MenuItem(
      name: 'Fried Tofu (8 pcs)',
      price: 75.00,
      image: 'assets/side3.jpg',
      category: 'Sides',
      availableAddOns: [
        AddOn(name: 'Extra Sauce', price: 10.0),
        AddOn(name: 'Extra Portion', price: 30.0),
      ],
    ),
    MenuItem(
      name: 'Karaage Chicken',
      price: 145.00,
      image: 'assets/side4.jpg',
      category: 'Sides',
      availableAddOns: [
        AddOn(name: 'Extra Sauce', price: 10.0),
        AddOn(name: 'Extra Portion', price: 30.0),
      ],
    ),
    MenuItem(
      name: 'Coke',
      price: 20.00,
      image: 'assets/coke.webp',
      category: 'Drinks',
      availableAddOns: [
        AddOn(name: 'Extra Ice', price: 0.0),
        AddOn(name: 'Extra Shot', price: 15.0),
      ],
    ),
  ];

  List<MenuItem> get menuItems => List.unmodifiable(_menuItems);

  List<MenuItem> getMenuItemsByCategory(String category) {
    if (category == 'All') {
      return menuItems;
    }
    return menuItems.where((item) => item.category == category).toList();
  }

  List<MenuItem> searchMenuItems(String query) {
    if (query.isEmpty) {
      return menuItems;
    }
    return menuItems
        .where((item) =>
            item.name.toLowerCase().contains(query.toLowerCase()) ||
            item.category.toLowerCase().contains(query.toLowerCase()))
        .toList();
  }

  List<String> get categories {
    final categories = menuItems.map((item) => item.category).toSet().toList();
    categories.insert(0, 'All');
    return categories;
  }

  MenuItem? getMenuItemByName(String name) {
    try {
      return menuItems.firstWhere((item) => item.name == name);
    } catch (e) {
      return null;
    }
  }
} 