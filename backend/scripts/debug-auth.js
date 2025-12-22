const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    const timestamp = Date.now();
    const testUser = {
        name: `Test User ${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
        role: 'student',
        university: 'Test University'
    };

    console.log('--- Starting Auth Debug ---');

    // 1. Register
    try {
        console.log('\n1. Testing Registration...');
        const regRes = await axios.post(`${API_URL}/register`, testUser);
        console.log('✅ Registration successful:', regRes.status);
        console.log('Response data:', regRes.data);
    } catch (error) {
        console.error('❌ Registration failed:', error.response ? error.response.data : error.message);
    }

    // 2. Duplicate Registration
    try {
        console.log('\n2. Testing Duplicate Registration...');
        await axios.post(`${API_URL}/register`, testUser);
        console.error('❌ Duplicate registration should have failed but succeeded');
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('✅ Duplicate registration correctly failed with 400:', error.response.data);
        } else {
            console.error('❌ Duplicate registration failed with unexpected error:', error.response ? error.response.data : error.message);
        }
    }

    // 3. Login
    try {
        console.log('\n3. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful:', loginRes.status);
        console.log('User Role:', loginRes.data.role);

        if (loginRes.data.role === 'student') {
            console.log('✅ Role is correct (student)');
        } else {
            console.error('❌ Role is incorrect:', loginRes.data.role);
        }
    } catch (error) {
        console.error('❌ Login failed:', error.response ? error.response.data : error.message);
    }

    console.log('\n--- Auth Debug Finished ---');
};

testAuth();
