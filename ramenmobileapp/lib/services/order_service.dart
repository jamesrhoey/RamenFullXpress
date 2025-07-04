import 'dart:convert';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/order.dart';
import '../models/cart_item.dart';

class OrderService {
  static const String _ordersKey = 'orders';
  static final OrderService _instance = OrderService._internal();
  
  factory OrderService() {
    return _instance;
  }
  
  OrderService._internal();

  List<Order> _orders = [];

  List<Order> get orders => List.unmodifiable(_orders);

  Future<void> loadOrders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final ordersJson = prefs.getString(_ordersKey);
      if (ordersJson != null) {
        final List<dynamic> ordersList = json.decode(ordersJson);
        _orders = ordersList.map((order) => Order.fromJson(order)).toList();
      }
    } catch (e) {
      print('Error loading orders: $e');
      _orders = [];
    }
  }

  Future<void> saveOrders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final ordersJson = json.encode(
        _orders.map((order) => order.toJson()).toList(),
      );
      await prefs.setString(_ordersKey, ordersJson);
    } catch (e) {
      print('Error saving orders: $e');
    }
  }

  Future<Order> createOrder({
    required List<CartItem> items,
    required String deliveryMethod,
    String? deliveryAddress,
    required String paymentMethod,
    String? notes,
  }) async {
    final orderId = _generateOrderId();
    final invoiceNumber = _generateInvoiceNumber();
    
    final order = Order(
      id: orderId,
      items: items,
      total: items.fold(0.0, (sum, item) => sum + item.totalPrice) + 
             (deliveryMethod == 'Delivery' ? 50.0 : 0.0),
      status: OrderStatus.pending,
      orderDate: DateTime.now(),
      deliveryMethod: deliveryMethod,
      deliveryAddress: deliveryAddress,
      paymentMethod: paymentMethod,
      notes: notes,
      invoiceNumber: invoiceNumber,
    );

    _orders.insert(0, order); // Add to beginning of list
    await saveOrders();
    return order;
  }

  Future<void> updateOrderStatus(String orderId, OrderStatus status) async {
    final index = _orders.indexWhere((order) => order.id == orderId);
    if (index != -1) {
      _orders[index] = _orders[index].copyWith(status: status);
      await saveOrders();
    }
  }

  Order? getOrderById(String orderId) {
    try {
      return _orders.firstWhere((order) => order.id == orderId);
    } catch (e) {
      return null;
    }
  }

  List<Order> getOrdersByStatus(OrderStatus status) {
    return _orders.where((order) => order.status == status).toList();
  }

  String _generateOrderId() {
    final random = Random();
    final orderNumber = random.nextInt(10000); // Generate 0-9999
    return orderNumber.toString().padLeft(4, '0'); // Ensure 4 digits with leading zeros
  }

  String _generateInvoiceNumber() {
    final random = Random();
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final randomNum = random.nextInt(10000);
    return 'INV${timestamp}${randomNum.toString().padLeft(4, '0')}';
  }
}
