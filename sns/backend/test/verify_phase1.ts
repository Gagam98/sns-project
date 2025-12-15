
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import * as path from 'path';

// Note: Ensure standard fetch is available or use node-fetch
const BASE_URL = 'http://localhost:3001';

async function verifyPhase1() {
    const timestamp = Date.now();
    const testUser = {
        email: `test${timestamp}@example.com`,
        password: 'password123',
        username: `user${timestamp}`,
        avatarUrl: 'http://example.com/avatar.png'
    };

    console.log(`1. Signup: ${testUser.email}`);
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
    });

    if (!signupRes.ok) {
        console.error('Signup failed:', await signupRes.text());
        return;
    }
    const signupData = await signupRes.json();
    console.log('Signup success:', signupData);

    console.log(`2. Login`);
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }
    const loginData: any = await loginRes.json();
    console.log('Login success. Token:', loginData.access_token ? 'Received' : 'Missing');
    const token = loginData.access_token;

    console.log(`3. Create Post`);
    const postRes = await fetch(`${BASE_URL}/posts`, { // Renamed from boards
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: 'Hello NestJS Phase 1 with Posts!' }),
    });

    if (!postRes.ok) {
        console.error('Create Post failed:', await postRes.text());
        return;
    }
    const postData = await postRes.json();
    console.log('Create Post success:', postData);

    console.log(`4. Get Posts`);
    const getRes = await fetch(`${BASE_URL}/posts`); // Renamed from boards
    const posts: any[] = await getRes.json() as any[];
    console.log(`Fetched ${posts.length} posts.`);
}

verifyPhase1().catch(console.error);
