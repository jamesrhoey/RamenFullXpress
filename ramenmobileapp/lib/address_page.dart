import 'package:flutter/material.dart';
import 'models/delivery_address.dart';

class AddressPage extends StatefulWidget {
  const AddressPage({super.key});

  @override
  State<AddressPage> createState() => _AddressPageState();
}

class _AddressPageState extends State<AddressPage> {
  // Sample delivery address data
  final List<DeliveryAddress> _addresses = [
    DeliveryAddress(
      id: '1',
      street: '#123 Marasigan St.',
      barangay: 'Barangay Poblacion 5',
      municipality: 'Calaca City',
      province: 'Batangas',
      zipCode: '4208',
      isDefault: true,
    ),
  ];

  Future<void> _addAddress() async {
    final newAddress = await Navigator.of(context).push<DeliveryAddress>(
      MaterialPageRoute(builder: (context) => const AddAddressPage()),
    );
    if (newAddress != null) {
      setState(() {
        _addresses.add(newAddress);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pushNamedAndRemoveUntil(
            context,
            '/profile',
            (route) => false,
          ),
        ),
        title: const Text(
          'Delivery Addresses',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: _addresses.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.visibility_off,
                    size: 80,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'No delivery addresses yet',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Add a delivery address to get started',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.black54,
                    ),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _addresses.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final address = _addresses[index];
                return Card(
                  elevation: 3,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          Icons.location_on,
                          color: Colors.red,
                          size: 32,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  if (address.isDefault)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 4,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color.fromARGB(255, 255, 235, 235),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: const Text(
                                        'Default',
                                        style: TextStyle(
                                          color: Colors.red,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  const SizedBox(width: 8),
                                  const Text(
                                    'Home',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                address.fullAddress,
                                style: const TextStyle(fontSize: 15),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, color: Colors.grey),
                              onPressed: () {}, // Edit action placeholder
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.grey),
                              onPressed: () {}, // Delete action placeholder
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addAddress,
        backgroundColor: Colors.red,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      backgroundColor: Colors.white,
    );
  }
}

class AddAddressPage extends StatefulWidget {
  const AddAddressPage({super.key});

  @override
  State<AddAddressPage> createState() => _AddAddressPageState();
}

class _AddAddressPageState extends State<AddAddressPage> {
  final _formKey = GlobalKey<FormState>();
  final fullNameController = TextEditingController();
  final mobileController = TextEditingController();
  final houseStreetController = TextEditingController();
  final barangayController = TextEditingController();
  final cityController = TextEditingController();
  final provinceController = TextEditingController();
  final zipController = TextEditingController();
  final instructionsController = TextEditingController();
  String label = 'Home';
  bool saveForFuture = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Delivery Address'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Address Label / Type', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    ChoiceChip(
                      label: const Text('Home'),
                      selected: label == 'Home',
                      onSelected: (selected) => setState(() => label = 'Home'),
                      selectedColor: Colors.red.shade100,
                      labelStyle: TextStyle(color: label == 'Home' ? Colors.red : Colors.black),
                    ),
                    const SizedBox(width: 8),
                    ChoiceChip(
                      label: const Text('Work'),
                      selected: label == 'Work',
                      onSelected: (selected) => setState(() => label = 'Work'),
                      selectedColor: Colors.red.shade100,
                      labelStyle: TextStyle(color: label == 'Work' ? Colors.red : Colors.black),
                    ),
                    const SizedBox(width: 8),
                    ChoiceChip(
                      label: const Text('Other'),
                      selected: label == 'Other',
                      onSelected: (selected) => setState(() => label = 'Other'),
                      selectedColor: Colors.red.shade100,
                      labelStyle: TextStyle(color: label == 'Other' ? Colors.red : Colors.black),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Full Name
                TextFormField(
                  controller: fullNameController,
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Full Name is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // Mobile Number
                TextFormField(
                  controller: mobileController,
                  decoration: InputDecoration(
                    labelText: 'Mobile Number',
                    hintText: 'For contact in case of issues or confirmation',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  keyboardType: TextInputType.phone,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Mobile Number is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // House/Building Number & Street Name
                TextFormField(
                  controller: houseStreetController,
                  decoration: InputDecoration(
                    labelText: 'House/Building Number & Street Name',
                    hintText: '#123 Marasigan St.',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'House/Building & Street is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // Barangay/Subdivision
                TextFormField(
                  controller: barangayController,
                  decoration: InputDecoration(
                    labelText: 'Barangay/Subdivision',
                    hintText: 'Barangay Poblacion 5',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Barangay/Subdivision is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // City/Municipality
                TextFormField(
                  controller: cityController,
                  decoration: InputDecoration(
                    labelText: 'City/Municipality',
                    hintText: 'Calaca City',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'City/Municipality is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // Province
                TextFormField(
                  controller: provinceController,
                  decoration: InputDecoration(
                    labelText: 'Province',
                    hintText: 'Batangas',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Province is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // ZIP/Postal Code
                TextFormField(
                  controller: zipController,
                  decoration: InputDecoration(
                    labelText: 'ZIP/Postal Code',
                    hintText: 'e.g., 4208',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'ZIP/Postal Code is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 14),

                // Delivery Instructions (Optional)
                TextFormField(
                  controller: instructionsController,
                  decoration: InputDecoration(
                    labelText: 'Delivery Instructions (Optional)',
                    hintText: 'e.g., 3rd floor, blue gate, ring the bell twice',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    filled: true,
                    fillColor: Colors.grey[100],
                  ),
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Switch(
                      value: saveForFuture,
                      onChanged: (val) => setState(() => saveForFuture = val),
                      activeColor: Colors.red,
                    ),
                    const Text('Enable auto-save'),
                  ],
                ),
                const SizedBox(height: 20),

                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        // final newAddress = DeliveryAddress(
                        //   fullName: fullNameController.text.trim(),
                        //   mobileNumber: mobileController.text.trim(),
                        //   houseStreet: houseStreetController.text.trim(),
                        //   barangay: barangayController.text.trim(),
                        //   city: cityController.text.trim(),
                        //   province: provinceController.text.trim(),
                        //   zipCode: zipController.text.trim(),
                        //   instructions: instructionsController.text.trim(),
                        //   label: label,
                        //   saveForFuture: saveForFuture,
                        // );
                        // Navigator.of(context).pop(newAddress);

                        // Show a message instead
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('bukas pa pagaganahin ang save'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    },
                    child: const Text('Save', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      backgroundColor: Colors.white,
    );
  }
}
