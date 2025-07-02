import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class InvoicePage extends StatefulWidget {
  final Map<String, dynamic> order;
  const InvoicePage({super.key, required this.order});

  @override
  State<InvoicePage> createState() => _InvoicePageState();
}

class _InvoicePageState extends State<InvoicePage> {
  late final Map<String, dynamic> order;
  late final NumberFormat currencyFormat;
  late final DateFormat dateFormat;

  @override
  void initState() {
    super.initState();
    order = widget.order;
    currencyFormat = NumberFormat.currency(symbol: '₱');
    dateFormat = DateFormat('MMM dd, yyyy hh:mm a');
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return const Color.fromARGB(255, 88, 97, 255); // Blue
      case 'preparing':
        return const Color(0xFF1A1A1A); // Black
      case 'ready':
        return const Color.fromARGB(255, 185, 255, 73); // Green
      case 'delivered':
        return const Color.fromARGB(255, 10, 180, 10); // Green
      case 'cancelled':
        return const Color(0xFFD32D43); // Red
      default:
        return const Color.fromARGB(255, 175, 175, 175); // Grey
    }
  }

  Widget _buildStatusBadge(String status) {
    Color color = _getStatusColor(status);
    String label = status.toUpperCase();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E1), // light yellow
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFD54F), width: 2),
      ),
      child: Row(
        children: [
          Icon(Icons.hourglass_empty, color: color, size: 28),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Order Status', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black54)),
              Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 18)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderProgress(String status) {
    final steps = [
      'Pending',
      'Preparing',
      'Ready',
      'Delivered',
      'Cancelled',
    ];
    final descriptions = [
      'Your order has been received',
      'Your food is being prepared',
      'Your order is ready for pickup/delivery',
      'Order completed successfully',
      'Order was cancelled',
    ];
    final statusMap = {
      'pending': 0,
      'preparing': 1,
      'ready': 2,
      'delivered': 3,
      'cancelled': 4,
    };
    int currentStep = statusMap[status.toLowerCase()] ?? 0;
    bool isCancelled = status.toLowerCase() == 'cancelled';
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFD32D43), width: 2),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Order Progress', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            ...List.generate(steps.length, (i) {
              bool isActive = isCancelled ? i == steps.length - 1 : i <= currentStep;
              bool isCurrent = isCancelled ? i == steps.length - 1 : i == currentStep;
              Color stepColor = _getStatusColor(steps[i]);
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 2),
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: isActive ? stepColor : Colors.white,
                      border: Border.all(color: isActive ? stepColor : Colors.grey, width: 2),
                      shape: BoxShape.circle,
                    ),
                    child: isActive
                        ? Icon(Icons.check, color: Colors.white, size: 16)
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          steps[i],
                          style: TextStyle(
                            fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                            color: isCurrent ? stepColor : Colors.black,
                            fontSize: isCurrent ? 16 : 14,
                          ),
                        ),
                        if (isCurrent)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 4.0),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: stepColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text('Current Status', style: TextStyle(color: stepColor, fontSize: 12)),
                            ),
                          ),
                        Text(descriptions[i], style: const TextStyle(fontSize: 12)),
                        if (i < steps.length - 1)
                          Container(
                            margin: const EdgeInsets.symmetric(vertical: 2),
                            width: 2,
                            height: 18,
                            color: Colors.grey[300],
                          ),
                      ],
                    ),
                  ),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderDetails() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Order Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            _buildDetailRow('Order ID', order['id'].toString()),
            _buildDetailRow('Date', dateFormat.format(order['date'])),
            _buildDetailRow('Delivery Method', order['deliveryMethod'] ?? '-'),
            if (order['deliveryAddress'] != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Address', style: TextStyle(fontWeight: FontWeight.normal)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        order['deliveryAddress'],
                        style: const TextStyle(fontSize: 14),
                        softWrap: true,
                        overflow: TextOverflow.visible,
                        textAlign: TextAlign.start,
                      ),
                    ),
                  ],
                ),
              ),
            if (order['notes'] != null)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 2),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Notes', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(
                      order['notes'],
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentDetails() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Payment Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            _buildDetailRow('Payment Method', order['paymentMethod'] ?? '-'),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItems() {
    final items = order['items'] as List<dynamic>? ?? [];
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Order Items', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            ...items.map((item) {
              final name = item['name'] ?? '-';
              final price = item['price'] ?? 0.0;
              final quantity = item['quantity'] ?? 1;
              final addons = item['addons'] as List<dynamic>?;
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('$name', style: const TextStyle(fontWeight: FontWeight.bold)),
                          Text('${currencyFormat.format(price)} x $quantity'),
                          if (addons != null && addons.isNotEmpty)
                            Text('Add-ons: ${addons.join(', ')}', style: const TextStyle(fontSize: 12)),
                        ],
                      ),
                    ),
                    Text(currencyFormat.format(price)),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummary() {
    final subtotal = order['total'] ?? 0.0;
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Order Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            _buildDetailRow('Subtotal', currencyFormat.format(subtotal)),
            const Divider(),
            _buildDetailRow('Total', currencyFormat.format(subtotal), isTotal: true),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontWeight: isTotal ? FontWeight.bold : FontWeight.normal)),
          Flexible(
            child: Text(
              value,
              style: TextStyle(fontWeight: isTotal ? FontWeight.bold : FontWeight.normal, fontSize: isTotal ? 18 : 14),
              overflow: TextOverflow.ellipsis,
              maxLines: 1,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFFD32D43)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Order Invoice', style: TextStyle(color: Color(0xFF1A1A1A), fontWeight: FontWeight.bold)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.green[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text('LIVE', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
                IconButton(
                  icon: const Icon(Icons.share, color: Color(0xFF1A1A1A)),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ],
      ),
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusBadge(order['status'] ?? 'Pending'),
            _buildOrderProgress(order['status'] ?? 'Pending'),
            _buildOrderDetails(),
            _buildPaymentDetails(),
            _buildOrderItems(),
            _buildOrderSummary(),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD32D43),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text('Back to Order History', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}