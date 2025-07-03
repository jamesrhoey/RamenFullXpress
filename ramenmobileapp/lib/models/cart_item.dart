import 'menu_item.dart';

class CartItem {
  final MenuItem menuItem;
  final int quantity;
  final List<AddOn> selectedAddOns;

  CartItem({
    required this.menuItem,
    required this.quantity,
    this.selectedAddOns = const [],
  });

  double get totalPrice {
    double basePrice = menuItem.price * quantity;
    double addOnsPrice =
        selectedAddOns.fold(0.0, (sum, addon) => sum + addon.price) * quantity;
    return basePrice + addOnsPrice;
  }

  double get unitPrice {
    return menuItem.price +
        selectedAddOns.fold(0.0, (sum, addon) => sum + addon.price);
  }

  Map<String, dynamic> toJson() {
    return {
      'menuItem': menuItem.toJson(),
      'quantity': quantity,
      'selectedAddOns': selectedAddOns.map((addon) => addon.toJson()).toList(),
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      menuItem: MenuItem.fromJson(json['menuItem']),
      quantity: json['quantity'],
      selectedAddOns:
          (json['selectedAddOns'] as List?)
              ?.map((addon) => AddOn.fromJson(addon))
              .toList() ??
          [],
    );
  }

  CartItem copyWith({
    MenuItem? menuItem,
    int? quantity,
    List<AddOn>? selectedAddOns,
  }) {
    return CartItem(
      menuItem: menuItem ?? this.menuItem,
      quantity: quantity ?? this.quantity,
      selectedAddOns: selectedAddOns ?? this.selectedAddOns,
    );
  }
}
