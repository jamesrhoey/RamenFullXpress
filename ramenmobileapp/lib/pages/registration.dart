import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Container(
            margin: EdgeInsets.fromLTRB(0, 30, 0, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                BackButton(),
                Container(
                  margin: EdgeInsets.only(top: 20, left: 16),
                  child: Text(
                    "Create Account",
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
                Container(
                  padding: EdgeInsets.all(1),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        margin: EdgeInsets.only(top: 10, left: 16),
                        child: Text(
                          'Join us and start ordering delicious ramen!',
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  margin: EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              decoration: InputDecoration(
                                border: OutlineInputBorder(),
                                hintText: 'First Name',
                                prefixIcon: Icon(
                                  Icons.person,
                                  color: const Color.fromARGB(255, 0, 0, 0),
                                ),
                                labelText: 'First Name',
                              ),
                            ),
                          ),
                          SizedBox(width: 16),
                          Expanded(
                            child: TextField(
                              decoration: InputDecoration(
                                border: OutlineInputBorder(),
                                hintText: 'Last Name',
                                prefixIcon: Icon(
                                  Icons.person,
                                  color: const Color.fromARGB(255, 0, 0, 0),
                                ),
                                labelText: 'Last Name',
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      TextField(
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'Enter your email',
                          prefixIcon: Icon(
                            Icons.email,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                          labelText: 'Email',
                        ),
                      ),
                      SizedBox(height: 16),
                      TextField(
                        keyboardType: TextInputType.number,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'Enter your number',
                          prefixIcon: Icon(
                            Icons.phone,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                          labelText: 'Phone Number',
                        ),
                      ),
                      SizedBox(height: 16),
                      TextField(
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'Enter your password',
                          prefixIcon: Icon(
                            Icons.lock,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                          labelText: 'Password',
                          suffixIcon: Icon(
                            Icons.visibility_off,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 16),
                      TextField(
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                          hintText: 'Confirm Password',
                          prefixIcon: Icon(
                            Icons.lock,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                          labelText: 'Confirm Password',
                          suffixIcon: Icon(
                            Icons.visibility_off,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {},
                          child: Text('Sign Up'),
                        ),
                      ),
                      SizedBox(height: 30), // Add some bottom padding
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
