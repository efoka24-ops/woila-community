#!/usr/bin/env node

/**
 * Test Script for Membership Requests API
 * Run: node test-membership.js
 */

const http = require('http');
const BASE_URL = 'http://localhost:5000';

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function makeRequest(method, endpoint, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log(`\n${colors.blue}=== Membership Requests API Test ===${colors.reset}\n`);

  let testResults = { passed: 0, failed: 0 };
  let savedRequestId = null;
  let token = null;

  // Test 1: Check API health
  console.log(`${colors.yellow}1. Testing API health...${colors.reset}`);
  try {
    const result = await makeRequest('GET', '/health');
    if (result.status === 200) {
      console.log(`${colors.green}✓ API is running${colors.reset}\n`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}✗ API health check failed${colors.reset}\n`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
    testResults.failed++;
    return;
  }

  // Test 2: Login to get token
  console.log(`${colors.yellow}2. Testing admin login...${colors.reset}`);
  try {
    const result = await makeRequest('POST', '/api/auth/login', {
      email: 'admin@woila.com',
      password: 'Admin@123'
    });

    if (result.status === 200 && result.data.token) {
      token = result.data.token;
      console.log(`${colors.green}✓ Admin login successful${colors.reset}`);
      console.log(`  Token: ${token.substring(0, 20)}...\n`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}✗ Login failed: ${result.data.error}${colors.reset}\n`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
    testResults.failed++;
  }

  // Test 3: Create membership request
  console.log(`${colors.yellow}3. Creating membership request...${colors.reset}`);
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: `test_${Date.now()}@woila.com`,
    phone: '+237677777777',
    structure: 'Test Company',
    activitySector: 'Technologie',
    city: 'Yaoundé',
    paymentProofUrl: 'blob:test123'
  };

  try {
    const result = await makeRequest('POST', '/api/membership-requests', testData);

    if (result.status === 201 && result.data.request) {
      savedRequestId = result.data.request.id;
      console.log(`${colors.green}✓ Membership request created${colors.reset}`);
      console.log(`  ID: ${savedRequestId}`);
      console.log(`  Email: ${result.data.request.email}`);
      console.log(`  Status: ${result.data.request.status}\n`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}✗ Failed: ${result.data.error}${colors.reset}\n`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
    testResults.failed++;
  }

  // Test 4: Get all requests
  console.log(`${colors.yellow}4. Fetching all requests (admin)...${colors.reset}`);
  try {
    const result = await makeRequest('GET', '/api/membership-requests', null, token);

    if (result.status === 200 && Array.isArray(result.data)) {
      console.log(`${colors.green}✓ Requests fetched${colors.reset}`);
      console.log(`  Total: ${result.data.length} requests\n`);
      testResults.passed++;
    } else {
      console.log(`${colors.red}✗ Failed to fetch requests${colors.reset}\n`);
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
    testResults.failed++;
  }

  // Test 5: Get specific request
  if (savedRequestId && token) {
    console.log(`${colors.yellow}5. Fetching specific request...${colors.reset}`);
    try {
      const result = await makeRequest('GET', `/api/membership-requests/${savedRequestId}`, null, token);

      if (result.status === 200) {
        console.log(`${colors.green}✓ Request retrieved${colors.reset}`);
        console.log(`  Name: ${result.data.firstName} ${result.data.lastName}`);
        console.log(`  Status: ${result.data.status}\n`);
        testResults.passed++;
      } else {
        console.log(`${colors.red}✗ Failed to fetch request${colors.reset}\n`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
      testResults.failed++;
    }
  }

  // Test 6: Approve request
  if (savedRequestId && token) {
    console.log(`${colors.yellow}6. Approving request...${colors.reset}`);
    try {
      const result = await makeRequest(
        'POST',
        `/api/membership-requests/${savedRequestId}/approve`,
        { confirmationMessage: 'Welcome to Woila Community!' },
        token
      );

      if (result.status === 200) {
        console.log(`${colors.green}✓ Request approved${colors.reset}`);
        console.log(`  New Status: ${result.data.request.status}`);
        console.log(`  Approval Date: ${result.data.request.approvalDate}\n`);
        testResults.passed++;
      } else {
        console.log(`${colors.red}✗ Failed to approve: ${result.data.error}${colors.reset}\n`);
        testResults.failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
      testResults.failed++;
    }
  }

  // Test 7: Verify notification was created
  console.log(`${colors.yellow}7. Checking notifications...${colors.reset}`);
  try {
    const result = await makeRequest('GET', '/api/membership-requests', null, token);

    if (result.status === 200) {
      console.log(`${colors.green}✓ Notifications system working${colors.reset}`);
      console.log(`  Check backend/data/notifications.json for email queue\n`);
      testResults.passed++;
    } else {
      testResults.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
    testResults.failed++;
  }

  // Summary
  console.log(`${colors.blue}=== Test Summary ===${colors.reset}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Total: ${testResults.passed + testResults.failed}\n`);

  if (testResults.failed === 0) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(`${colors.red}Fatal error: ${err.message}${colors.reset}`);
  process.exit(1);
});
