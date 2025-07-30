import 'package:socket_io_client/socket_io_client.dart' as IO;

typedef OrderStatusUpdateCallback = void Function(Map<String, dynamic> data);

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? socket;
  OrderStatusUpdateCallback? onOrderStatusUpdate;

  void connect() {
    if (socket != null && socket!.connected) return;
    
    // Production Socket.IO URL
    const String productionSocketUrl = 'https://ramen-27je.onrender.com';
    const String developmentSocketUrl = 'http://localhost:3000';
    
    // Set this to false for production, true for local development
    const bool useLocalhost = false;
    
    final String socketUrl = useLocalhost ? developmentSocketUrl : productionSocketUrl;
    
    socket = IO.io(socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });

    socket?.on('connect', (_) {
      print('Connected to Socket.IO server at $socketUrl');
    });

    socket?.on('orderStatusUpdate', (data) {
      print('Order status update received: $data');
      if (onOrderStatusUpdate != null) {
        onOrderStatusUpdate!(Map<String, dynamic>.from(data));
      }
    });

    socket?.on('disconnect', (_) => print('Disconnected from Socket.IO server'));
  }

  void disconnect() {
    socket?.disconnect();
  }
} 