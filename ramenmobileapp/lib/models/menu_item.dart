class MenuItem {
  final String name;
  final double price;
  final String image;
  final String category;
  final List<AddOn> availableAddOns;

  MenuItem({
    required this.name,
    required this.price,
    required this.image,
    required this.category,
    this.availableAddOns = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'price': price,
      'image': image,
      'category': category,
      'availableAddOns': availableAddOns.map((addon) => addon.toJson()).toList(),
    };
  }

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      name: json['name'],
      price: json['price'].toDouble(),
      image: json['image'],
      category: json['category'],
      availableAddOns: (json['availableAddOns'] as List?)
          ?.map((addon) => AddOn.fromJson(addon))
          .toList() ?? [],
    );
  }
}

class AddOn {
  final String name;
  final double price;

  AddOn({
    required this.name,
    required this.price,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'price': price,
    };
  }

  factory AddOn.fromJson(Map<String, dynamic> json) {
    return AddOn(
      name: json['name'],
      price: json['price'].toDouble(),
    );
  }
} 