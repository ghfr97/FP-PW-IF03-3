const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = 'super_secret_access_key_123';
const token = jwt.sign({ id: 1, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1h' });

async function testAddService() {
    try {
        const response = await axios.post('http://localhost:5005/api/services', {
            name: "Layanan Test",
            description: "Test description",
            price: 5000,
            unit: "/kg"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Success:", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Failed with status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testAddService();
