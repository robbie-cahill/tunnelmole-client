import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

const app = express();

const upload = multer({dest: '/tmp'});

const rawBodyParser = bodyParser.raw({
  inflate: false,
  type: '*/*'
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

app.post('/api-post', rawBodyParser, returnJsonPayloadHandler);
app.put('/api-put', rawBodyParser, returnJsonPayloadHandler);

app.post('/image-upload', rawBodyParser, (request: Request, response: Response) => {
    const body = request.body;

    // Send the received image back, to be compared with Buffer.compare()
    response.send(body);
});

app.post('/post-submit-form', rawBodyParser, (request: Request, response: Response) => {
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
        filename: request.file.originalname
    });
});

export { app };

