
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch'; // Assumption: node-fetch is available or we use native fetch if node 18+
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyFlow = async () => {
    try {
        // 0. Create a dummy file
        const dummyFilePath = path.join(__dirname, 'dummy.png');
        fs.writeFileSync(dummyFilePath, 'dummy content');

        // 1. Upload File
        const formData = new FormData();
        formData.append('file', fs.createReadStream(dummyFilePath));

        console.log("Uploading file...");
        const uploadRes = await fetch('http://localhost:3001/uploads', {
            method: 'POST',
            body: formData as any,
        });

        if (!uploadRes.ok) {
            console.error("Upload failed:", uploadRes.status, await uploadRes.text());
            return;
        }

        const uploadData: any = await uploadRes.json();
        console.log("Upload success:", uploadData);
        const imageUrl = uploadData.url;

        // 2. Create Post
        const payload = {
            userId: "507f1f77bcf86cd799439011",
            username: "testuser",
            userAvatar: imageUrl, // reuse for avatar
            imageUrls: [imageUrl],
            caption: "Hello World! This is a test post with local upload.",
        };

        console.log("Creating post with payload:", payload);
        const postRes = await fetch('http://localhost:3001/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!postRes.ok) {
            console.log("Create Post Error status:", postRes.status);
            console.log("Create Post Error body:", await postRes.text());
        } else {
            console.log("Create Post Success:", await postRes.json());
        }

        // Cleanup
        fs.unlinkSync(dummyFilePath);

    } catch (e) {
        console.error("Error:", e);
    }
};

verifyFlow();
