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
    socket = IO.io('http://localhost:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
    });

    socket?.on('connect', (_) {
      print('Connected to Socket.IO server');
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