async function testAPIs() {
  try {
    // Test Register
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }),
    });
    console.log('Register Response:', await registerResponse.json());

    // Test Login
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });
    console.log('Login Response:', await loginResponse.json());

    // Test Booking
    const bookingResponse = await fetch('http://localhost:3000/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceType: 'Oil Change',
        date: new Date().toISOString()
      }),
    });
    console.log('Booking Response:', await bookingResponse.json());

    // Test Chat
    const chatResponse = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, I need help with my car'
      }),
    });
    console.log('Chat Response:', await chatResponse.json());

  } catch (error) {
    console.error('Error testing APIs:', error);
  }
}

testAPIs(); 