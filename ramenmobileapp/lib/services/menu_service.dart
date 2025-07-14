import '../models/menu_item.dart';
import 'api_service.dart';

class MenuService {
  final ApiService _apiService = ApiService();
  
  // Example categories
  List<String> categories = ['All', 'Ramen', 'Rice Bowl', 'Sides', 'Drinks'];

  // Fallback menu items if API fails
  final List<MenuItem> _fallbackMenuItems = [
    MenuItem(
      id: '1',
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
      id: '2',
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
      id: '3',
      name: 'Chicken Rice Bowl',
      price: 149.0,
      image: 'assets/ricebowl.jpg',
      category: 'Rice Bowl',
      availableAddOns: [
        AddOn(name: 'Extra Chicken', price: 40.0),
      ],
    ),
    MenuItem(
      id: '4',
      name: 'Gyoza',
      price: 99.0,
      image: 'assets/side1.jpg',
      category: 'Sides',
      availableAddOns: [
        AddOn(name: 'Extra Sauce', price: 10.0),
      ],
    ),
    MenuItem(
      id: '5',
      name: 'Coke',
      price: 49.0,
      image: 'assets/coke.webp',
      category: 'Drinks',
      availableAddOns: [],
    ),
  ];

  Future<List<MenuItem>> getMenuItemsByCategory(String category) async {
    try {
      if (category == 'All') {
        return await _apiService.getMenuItems();
      }
      return await _apiService.getMenuItemsByCategory(category);
    } catch (e) {
      print('Error fetching menu items: $e');
      // Return fallback data if API fails
    if (category == 'All') {
        return _fallbackMenuItems;
    }
      return _fallbackMenuItems.where((item) => item.category == category).toList();
  }
  }

  Future<List<MenuItem>> searchMenuItems(String query) async {
    try {
      final allItems = await _apiService.getMenuItems();
      return allItems
          .where((item) => item.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    } catch (e) {
      print('Error searching menu items: $e');
      // Return fallback data if API fails
      return _fallbackMenuItems
        .where((item) => item.name.toLowerCase().contains(query.toLowerCase()))
        .toList();
    }
  }
}
