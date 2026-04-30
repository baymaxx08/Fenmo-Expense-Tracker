import request from 'supertest';
import app from '../src/app.js';
import db from '../src/db.js';
import { v4 as uuidv4 } from 'uuid';

// Clean up database before and after tests
beforeEach(() => {
  db.exec('DELETE FROM expenses');
});

afterAll(() => {
  db.close();
});

describe('POST /expenses', () => {
  test('should create an expense and return 201', async () => {
    const payload = {
      idempotency_key: uuidv4(),
      amount: '150.75',
      category: 'Food',
      description: 'Lunch at restaurant',
      date: '2024-01-15',
    };

    const res = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('idempotency_key', payload.idempotency_key);
    expect(res.body).toHaveProperty('amount', '150.75');
    expect(res.body).toHaveProperty('category', 'Food');
    expect(res.body).toHaveProperty('description', 'Lunch at restaurant');
    expect(res.body).toHaveProperty('date', '2024-01-15');
    expect(res.body).toHaveProperty('created_at');
  });

  test('should return same expense with same idempotency_key', async () => {
    const idempotencyKey = uuidv4();
    const payload = {
      idempotency_key: idempotencyKey,
      amount: '200.00',
      category: 'Transport',
      description: 'Taxi ride',
      date: '2024-01-16',
    };

    // First request
    const res1 = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(201);

    const id1 = res1.body.id;

    // Second request with same idempotency key
    const res2 = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(201);

    const id2 = res2.body.id;

    // Should be same expense
    expect(id1).toBe(id2);
    expect(res2.body.amount).toBe('200.00');
  });

  test('should return 400 for negative amount', async () => {
    const payload = {
      idempotency_key: uuidv4(),
      amount: '-50.00',
      category: 'Food',
      description: 'Refund',
      date: '2024-01-17',
    };

    const res = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('positive');
  });

  test('should return 400 for missing category', async () => {
    const payload = {
      idempotency_key: uuidv4(),
      amount: '100.00',
      description: 'Some expense',
      date: '2024-01-18',
    };

    const res = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('should return 400 for invalid date format', async () => {
    const payload = {
      idempotency_key: uuidv4(),
      amount: '100.00',
      category: 'Food',
      description: 'Some expense',
      date: '15-01-2024',
    };

    const res = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('should return 400 for zero amount', async () => {
    const payload = {
      idempotency_key: uuidv4(),
      amount: '0',
      category: 'Food',
      description: 'Free item',
      date: '2024-01-19',
    };

    const res = await request(app)
      .post('/expenses')
      .send(payload)
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /expenses', () => {
  test('should return empty array when no expenses', async () => {
    const res = await request(app)
      .get('/expenses')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('should return all expenses', async () => {
    const payload1 = {
      idempotency_key: uuidv4(),
      amount: '100.00',
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-15',
    };

    const payload2 = {
      idempotency_key: uuidv4(),
      amount: '50.00',
      category: 'Transport',
      description: 'Bus fare',
      date: '2024-01-16',
    };

    await request(app)
      .post('/expenses')
      .send(payload1)
      .expect(201);

    await request(app)
      .post('/expenses')
      .send(payload2)
      .expect(201);

    const res = await request(app)
      .get('/expenses')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('should filter expenses by category', async () => {
    const foodPayload = {
      idempotency_key: uuidv4(),
      amount: '100.00',
      category: 'Food',
      description: 'Lunch',
      date: '2024-01-15',
    };

    const transportPayload = {
      idempotency_key: uuidv4(),
      amount: '50.00',
      category: 'Transport',
      description: 'Bus fare',
      date: '2024-01-16',
    };

    await request(app)
      .post('/expenses')
      .send(foodPayload)
      .expect(201);

    await request(app)
      .post('/expenses')
      .send(transportPayload)
      .expect(201);

    const res = await request(app)
      .get('/expenses?category=Food')
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('Food');
  });

  test('should return expenses sorted by date (newest first by default)', async () => {
    const olderPayload = {
      idempotency_key: uuidv4(),
      amount: '50.00',
      category: 'Food',
      description: 'Old expense',
      date: '2024-01-01',
    };

    const newerPayload = {
      idempotency_key: uuidv4(),
      amount: '100.00',
      category: 'Food',
      description: 'New expense',
      date: '2024-01-20',
    };

    await request(app)
      .post('/expenses')
      .send(olderPayload);

    await request(app)
      .post('/expenses')
      .send(newerPayload);

    const res = await request(app)
      .get('/expenses')
      .expect(200);

    expect(res.body[0].date).toBe('2024-01-20');
    expect(res.body[1].date).toBe('2024-01-01');
  });

  test('should sort expenses ascending when sort=date_asc', async () => {
    const olderPayload = {
      idempotency_key: uuidv4(),
      amount: '50.00',
      category: 'Food',
      description: 'Old expense',
      date: '2024-01-01',
    };

    const newerPayload = {
      idempotency_key: uuidv4(),
      amount: '100.00',
      category: 'Food',
      description: 'New expense',
      date: '2024-01-20',
    };

    await request(app)
      .post('/expenses')
      .send(olderPayload);

    await request(app)
      .post('/expenses')
      .send(newerPayload);

    const res = await request(app)
      .get('/expenses?sort=date_asc')
      .expect(200);

    expect(res.body[0].date).toBe('2024-01-01');
    expect(res.body[1].date).toBe('2024-01-20');
  });

  test('should return only Food expenses sorted by date descending', async () => {
    const expenses = [
      { idempotency_key: uuidv4(), amount: '100.00', category: 'Food', description: 'Lunch', date: '2024-01-15' },
      { idempotency_key: uuidv4(), amount: '50.00', category: 'Transport', description: 'Bus', date: '2024-01-16' },
      { idempotency_key: uuidv4(), amount: '200.00', category: 'Food', description: 'Dinner', date: '2024-01-20' },
    ];

    for (const expense of expenses) {
      await request(app)
        .post('/expenses')
        .send(expense);
    }

    const res = await request(app)
      .get('/expenses?category=Food&sort=date_desc')
      .expect(200);

    expect(res.body.length).toBe(2);
    expect(res.body[0].date).toBe('2024-01-20');
    expect(res.body[1].date).toBe('2024-01-15');
  });
});
