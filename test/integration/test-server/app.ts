import express, { Request, Response } from 'express';
import getRawBody from 'raw-body';
import multer from 'multer';
import zlib from 'zlib';
import { promisify } from 'util';
import { nanoid } from 'nanoid';
import fs from 'fs';

const gunzip = promisify(zlib.gunzip);

const app = express();

const upload = multer({
    storage: multer.diskStorage({
        destination: '/tmp',
        filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            const randomName = `${nanoid()}.${ext}`;
            cb(null, randomName);
        }
    })
});

// Read raw body bytes without decompression, handles all content types except multipart
// Multipart requests must be skipped so multer can read the stream
app.use(async (req: Request, res: Response, next: any) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.startsWith('multipart/')) {
        return next();
    }

    const body = await getRawBody(req);
    req.body = body;
    next();
});

/**
 * Take the payload given then return it
 * Integration test can then verify its the same as what was sent
 */
const returnJsonPayloadHandler = (request: Request, response: Response) => {
    const payload = JSON.parse(request.body);
    response.send(payload);
}

app.get('/', (request: Request, response: Response) => {
    response.send(`
        <html><head></head><body></body>Expose.sh test site</html>
    `);
});

app.get('/json', (request: Request, response: Response) => {
    const data = {
        "test" : "test"
    };

    response.send(data);
});

app.post('/api-post', returnJsonPayloadHandler);
app.put('/api-put', returnJsonPayloadHandler);

/**
 * Handle gzip-encoded JSON payload
 * Decompresses the body and returns the parsed JSON
 */
app.post('/api-post-gzip', async (request: Request, response: Response) => {
    try {
        const contentEncoding = request.headers['content-encoding'];
        
        if (contentEncoding !== 'gzip') {
            return response.status(400).send({ error: 'Expected gzip content-encoding' });
        }
        
        // Decompress the gzipped body
        const decompressed = await gunzip(request.body);
        const payload = JSON.parse(decompressed.toString());
        
        response.send(payload);
    } catch (error) {
        response.status(500).send({ error: 'Failed to decompress or parse body' });
    }
});

app.post('/image-upload', (request: Request, response: Response) => {
    const body = request.body;

    // Send the received image back, to be compared with Buffer.compare()
    response.send(body);
});

app.post('/post-submit-form', (request: Request, response: Response) => {
    const body : Buffer = request.body;
    const data = new URLSearchParams(body.toString());

    const returnData = {
        firstName: data.get('firstName')
    }

    response.send(returnData);
});

app.post('/post-submit-form-multipart-with-image', upload.single('photo'),  (request: Request, response: Response) => {
    response.send({
        firstName: request.body.firstName,
        filename: request.file.originalname,
        savedPath: request.file.path
    });
});

export { app };

