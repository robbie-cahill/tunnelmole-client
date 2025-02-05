import fetch from "node-fetch";
import fs from "fs";
import FormData from 'form-data';
import { tunnelmole } from "../../src";
import { URLSearchParams } from "url";
import { app } from "./test-server/app";
import config from "../../config.js";
import detectPort from 'detect-port';
import { ROOT_DIR } from "../../src/filesystem/constants";


describe("Tunnelmole integration tests", () => {
    // Initialise connection
    const port = 3001;
    let url: string;

    beforeAll(async () => {
        // Start Tunnelmole, the URL will tunnel to `localhost:${port}`
        const isLocal = config.hostip.endpoint === 'ws://localhost:8081';

        // Set domain for local testing to avoid the need to pause and set the hostname in /etc/hosts each time
        const domain = isLocal ? 'testsite.localhost' : undefined;

        const availablePort = await detectPort(port);
        if (availablePort !== port) {
            console.log(`Port 3001 is already in use. Tests require this port, so exiting tests. Free up this port before running the tests again`);
            process.exit(1);
        }

        url = await tunnelmole({
            port,
            domain
        });
     
        // Rewrite the URL for local testing to be plain http and include the default port
        if (isLocal) {
            url = 'http://testsite.localhost:8001'
        }

         // Start the test express app listening on `localhost{$port}` 
        await new Promise((resolve) => {
            app.listen(port, () => {
                resolve(true);            
            }); 
        }); 
    })

    it("GET HTML document", async () => {
        const response = await fetch(url);
        const text = await response.text();
        expect(text).toContain('<html>');
    });

    it("GET JSON", async() => {
        const response = await fetch(url + '/json')
        const json = await response.json();
        expect(json.test).toEqual('test');
    });

    it("API style POST with JSON request/response", async() => {
        const response = await fetch(url + '/api-post', {
            method: "POST",
            body: JSON.stringify({
                test: "test"
            })
        });

        // This route will the payload sent to it
        const json = await response.json();
        expect(json.test).toEqual('test');
    });

    it("API style PUT with JSON request/response", async() => {
        const response = await fetch(url + '/api-put', {
            method: "PUT",
            body: JSON.stringify({
                test: "test"
            })
        });

        // This route will the payload sent to it
        const json = await response.json();
        expect(json.test).toEqual('test');
    });

    it("HTML form submission style POST", async() => {
        const body = new URLSearchParams();
        body.append("firstName", "John");
        body.append("lastName", "Smith");
        body.append("email", "john.smith@expose.sh");

        const response = await fetch(url + '/post-submit-form', {
            method: "POST",
            body
        });

        const responseData = await response.json();
        expect(responseData.firstName).toEqual("John");
    });

    it("Upload binary photo", async() => {
        const image : Buffer = fs.readFileSync(`${ROOT_DIR}/test/integration/files/img/test-image.png`);

        const response = await fetch(url + '/image-upload', {
            method: "POST",
            body: image
        });

        const responseBodyArrayBuffer = await response.arrayBuffer();
        const responseBuffer = Buffer.from(responseBodyArrayBuffer);

        const equal = Buffer.compare(image, responseBuffer);

        expect(equal).toBe(1);
    });

    it("Submit multipart/form-data with image and text field as POST", async() => {
        const image : Buffer = fs.readFileSync(`${ROOT_DIR}/test/integration/files/img/test-image.png`);

        const form = new FormData();
        form.append('firstName', 'John');
        form.append('photo', image, {
            contentType: "image/png",
            filename: "test-image.png"
        });

        const response = await fetch(url + '/post-submit-form-multipart-with-image', {
            method: "POST",
            body: form
        });

        const responseData = await response.json();
        expect(responseData.firstName).toEqual("John");
        expect(responseData.filename).toEqual('test-image.png');
    });
})