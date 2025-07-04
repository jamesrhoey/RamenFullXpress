import '../models/menu_item.dart';

class MenuService {
  // Example categories
  List<String> categories = ['All', 'Ramen', 'Rice Bowl', 'Sides', 'Drinks'];

  // Sample menu items
  final List<MenuItem> _menuItems = [
    MenuItem(
      name: 'Classic Ramen',
      price: 199.0,
      image: 'assets/ramen1.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Egg', price: 20.0),
        AddOn(name: 'Extra Noodles', price: 30.0),
      ],
    ),
    MenuItem(
      name: 'Spicy Ramen',
      price: 219.0,
      image: 'assets/ramen2.jpg',
      category: 'Ramen',
      availableAddOns: [
        AddOn(name: 'Egg', price: 20.0),
        AddOn(name: 'Extra Spicy', price: 15.0),
      ],
    ),
    MenuItem(
      name: 'Chicken Rice Bowl',
      price: 149.0,
      image: 'assets/ricebowl.jpg',
      category: 'Rice Bowl',
      availableAddOns: [
        AddOn(name: 'Extra Chicken', price: 40.0),
      ],
    ),
    MenuItem(
      name: 'Gyoza',
      price: 99.0,
      image: 'assets/side1.jpg',
      category: 'Sides',
      availableAddOns: [
        AddOn(name: 'Extra Sauce', price: 10.0),
      ],
    ),
    MenuItem(
      name: 'Coke',
      price: 49.0,
      image: 'assets/coke.webp',
      category: 'Drinks',
      availableAddOns: [],
    ),
  ];

  List<MenuItem> getMenuItemsByCategory(String category) {
    if (category == 'All') {
      return List<MenuItem>.from(_menuItems);
    }
    return _menuItems.where((item) => item.category == category).toList();
  }

  List<MenuItem> searchMenuItems(String query) {
    return _menuItems
        .where((item) => item.name.toLowerCase().contains(query.toLowerCase()))
        .toList();
  }
}
