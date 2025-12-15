
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function verifyPhase2() {
    const timestamp = Date.now();
    const testUser = {
        email: `phase2_${timestamp}@test.com`,
        password: 'password123',
        username: `phase2_${timestamp}`,
    };

    // 1. Signup & Login
    await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
    });

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const { access_token: token } = await loginRes.json() as any;
    console.log('Login Token:', token ? 'OK' : 'FAIL');

    // 2. Create Post with Images
    const postRes = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            content: 'Phase 2 Test',
            images: ['http://example.com/1.png', 'http://example.com/2.png']
        }),
    });
    const post = await postRes.json() as any;
    console.log('Created Post:', post._id);
    console.log('Images:', post.images);

    // 3. Like Post
    const likeRes = await fetch(`${BASE_URL}/posts/${post._id}/like`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const likedPost = await likeRes.json() as any;
    console.log('Liked Post Likes Count:', likedPost.likes.length); // Should be 1

    // 4. Unlike Post
    const unlikeRes = await fetch(`${BASE_URL}/posts/${post._id}/like`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const unlikedPost = await unlikeRes.json() as any;
    console.log('Unliked Post Likes Count:', unlikedPost.likes.length); // Should be 0
}

verifyPhase2().catch(console.error);
