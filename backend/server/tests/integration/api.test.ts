import { createApp } from '../../app';
import http from 'http';

export async function runApiIntegrationTests() {
  console.log('--- Running API Integration Tests ---');
  const app = await createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Health Check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    if (healthRes.status !== 200 || healthJson.status !== 'ok') {
      throw new Error('Health check API failed');
    }
    console.log('✓ GET /api/health passed');

    // 2. Public Products API
    const productsRes = await fetch(`${baseUrl}/api/v1/products?category=Fashion`);
    const productsJson = await productsRes.json();
    if (!productsJson.success || !Array.isArray(productsJson.data)) {
      throw new Error('Products API failed');
    }
    console.log(`✓ GET /api/v1/products passed (${productsJson.data.length} fashion products returned)`);

    // 3. Categories API
    const catRes = await fetch(`${baseUrl}/api/v1/products/categories`);
    const catJson = await catRes.json();
    if (!catJson.success || catJson.data.length < 5) {
      throw new Error('Categories API failed');
    }
    console.log(`✓ GET /api/v1/products/categories passed (${catJson.data.length} categories)`);

    // 4. Quick Demo Auth API
    const demoRes = await fetch(`${baseUrl}/api/v1/auth/quick-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'customer' }),
    });
    const demoJson = await demoRes.json();
    if (!demoJson.success || !demoJson.data.token) {
      throw new Error('Quick Demo auth API failed');
    }
    const token = demoJson.data.token;
    console.log('✓ POST /api/v1/auth/quick-demo passed');

    // 5. Authenticated Profile /me
    const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meJson = await meRes.json();
    if (!meJson.success || meJson.data.user.role !== 'customer') {
      throw new Error('GET /api/v1/auth/me failed');
    }
    console.log(`✓ GET /api/v1/auth/me passed (Authenticated as: ${meJson.data.user.fullName})`);

    // 6. Cart Management
    const cartAddRes = await fetch(`${baseUrl}/api/v1/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productsJson.data[0].id,
        quantity: 1,
      }),
    });
    const cartAddJson = await cartAddRes.json();
    if (!cartAddJson.success || !cartAddJson.data.items) {
      throw new Error('Cart Add API failed');
    }
    console.log('✓ POST /api/v1/cart/items passed');

    // 7. Role Guard Verification (Customer attempting Admin endpoint should be 403)
    const adminForbiddenRes = await fetch(`${baseUrl}/api/v1/admin/kpis`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (adminForbiddenRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for customer on admin endpoint, got ${adminForbiddenRes.status}`);
    }
    console.log('✓ Role Guard authorization (403 Forbidden on unauthorized role) verified');

    // 8. Admin Auth & KPI
    const adminDemoRes = await fetch(`${baseUrl}/api/v1/auth/quick-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' }),
    });
    const adminToken = (await adminDemoRes.json()).data.token;

    const adminKpiRes = await fetch(`${baseUrl}/api/v1/admin/kpis`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminKpiJson = await adminKpiRes.json();
    if (!adminKpiJson.success || !adminKpiJson.data.platformGMV) {
      throw new Error('Admin KPI API failed');
    }
    console.log(`✓ Admin API verified (Platform GMV: ₹${adminKpiJson.data.platformGMV.toLocaleString('en-IN')})`);

    // 9. AI Assistant Endpoint
    const aiRes = await fetch(`${baseUrl}/api/v1/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Find wireless earbuds' }),
    });
    const aiJson = await aiRes.json();
    if (!aiJson.success || !aiJson.data.reply) {
      throw new Error('Assistant API failed');
    }
    console.log('✓ POST /api/v1/assistant/chat passed');

  } finally {
    server.close();
  }
}
