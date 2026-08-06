const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgrespassword',
  database: process.env.DB_NAME || 'nestjs_playground',
});

async function run() {
  console.log('🚀 Starting Benchmark Database Seed Execution...');
  const overallStart = Date.now();

  try {
    await client.connect();

    // 1. Seed Users (10,000,000)
    console.log('📦 1/5. Generating 10,000,000 users in benchmark_users...');
    let start = Date.now();
    await client.query('TRUNCATE TABLE benchmark_users RESTART IDENTITY;');
    await client.query(`
      INSERT INTO benchmark_users (username, email, age, status, created_at)
      SELECT 
        'user_' || g,
        'user_' || g || '@example.com',
        (20 + (g % 40)),
        'ACTIVE',
        NOW() - (g || ' seconds')::interval
      FROM generate_series(1, 10000000) AS g;
    `);
    console.log(`   ✓ 10,000,000 users created in ${((Date.now() - start) / 1000).toFixed(2)}s`);

    // 2. Seed Orders (10,000,000)
    console.log('📦 2/5. Generating 10,000,000 indexing orders & building GIN index...');
    start = Date.now();
    await client.query('TRUNCATE TABLE benchmark_indexing_orders RESTART IDENTITY;');
    await client.query(`
      INSERT INTO benchmark_indexing_orders (user_id, status, total_amount, created_at, metadata)
      SELECT 
        (100 + (g % 1000)),
        (ARRAY['PENDING', 'COMPLETED', 'CANCELLED', 'SHIPPED'])[1 + (g % 4)],
        (10 + (g % 500))::numeric(10,2),
        NOW() - (g || ' seconds')::interval,
        jsonb_build_object(
          'category', (ARRAY['ELECTRONICS', 'CLOTHING', 'BOOKS', 'HOME', 'SPORTS'])[1 + (g % 5)],
          'vendorId', 1000 + (g % 50),
          'isPriority', (g % 5 = 0)
        )
      FROM generate_series(1, 10000000) AS g;
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_orders_meta_gin ON benchmark_indexing_orders USING GIN (metadata);');
    console.log(`   ✓ 10,000,000 orders & GIN Index created in ${((Date.now() - start) / 1000).toFixed(2)}s`);

    // 3. Seed Products (10,000)
    console.log('📦 3/5. Generating 10,000 products in benchmark_products...');
    await client.query('TRUNCATE TABLE benchmark_products RESTART IDENTITY;');
    await client.query(`
      INSERT INTO benchmark_products (id, name, stock, version, updated_at)
      SELECT 
        g,
        'Flash Sale Product #' || g,
        1000,
        1,
        NOW()
      FROM generate_series(1, 10000) AS g;
    `);
    console.log('   ✓ 10,000 products created');

    // 4. Seed Ledger (10,000 Accounts & 100,000 Transactions)
    console.log('📦 4/5. Generating 100,000 ledger transactions with SHA-256 hash chains...');
    await client.query('TRUNCATE TABLE benchmark_ledger_accounts CASCADE;');
    await client.query('TRUNCATE TABLE benchmark_ledger_transactions RESTART IDENTITY;');
    await client.query(`
      INSERT INTO benchmark_ledger_accounts ("accountId", balance, "updatedAt")
      SELECT 
        'ACC_' || (1000 + g),
        (10000 + (g % 50000))::numeric(12,2),
        NOW()
      FROM generate_series(1, 10000) AS g;
    `);
    await client.query(`
      INSERT INTO benchmark_ledger_transactions ("accountId", amount, type, "previousHash", "currentHash", "createdAt")
      SELECT 
        'ACC_' || (1000 + (g % 5000)),
        (10 + (g % 500))::numeric(12,2),
        (ARRAY['CREDIT', 'DEBIT'])[1 + (g % 2)],
        '0000000000000000000000000000000000000000000000000000000000000000',
        md5(g::text || 'hash_chain'),
        NOW() - (g || ' seconds')::interval
      FROM generate_series(1, 100000) AS g;
    `);
    console.log('   ✓ Ledger accounts & transactions created');

    // 5. Seed Outbox (100,000 Orders & Events)
    console.log('📦 5/5. Generating 100,000 transactional outbox events...');
    await client.query('TRUNCATE TABLE benchmark_outbox_orders CASCADE;');
    await client.query('TRUNCATE TABLE benchmark_outbox_events CASCADE;');
    await client.query(`
      INSERT INTO benchmark_outbox_orders (id, "orderNumber", "customerId", amount, status, "createdAt")
      SELECT 
        gen_random_uuid(),
        'ORD_OUTBOX_' || g,
        'CUST_' || (100 + (g % 1000)),
        (50 + (g % 900))::numeric(10,2),
        'CREATED',
        NOW() - (g || ' seconds')::interval
      FROM generate_series(1, 100000) AS g;
    `);
    await client.query(`
      INSERT INTO benchmark_outbox_events (id, "aggregateType", "aggregateId", "eventType", payload, status, "createdAt")
      SELECT 
        gen_random_uuid(),
        'ORDER',
        'ORD_' || g,
        'ORDER_CREATED',
        jsonb_build_object('orderId', 'ORD_' || g, 'amount', 150.00),
        (ARRAY['PENDING', 'PROCESSED'])[1 + (g % 2)],
        NOW() - (g || ' seconds')::interval
      FROM generate_series(1, 100000) AS g;
    `);
    console.log('   ✓ Outbox orders & events created');

    console.log('\n🎉 ALL BENCHMARK TABLES SEEDED SUCCESSFULLY!');
    console.log(`⏱️ Total time elapsed: ${((Date.now() - overallStart) / 1000).toFixed(2)}s`);
  } catch (err) {
    console.error('❌ Error seeding benchmark data:', err);
  } finally {
    await client.end();
  }
}

run();
