import fetch from "node-fetch";
import fs from "fs";
import FormData from 'form-data';
import { tunnelmole } from "../../src";
import { URLSearchParams } from "url";
import { app } from "./test-server/app";

describe("Tunnelmole integration tests", () => {
    // Initialise connection
    const port = 3000;
    let url: string;

    beforeAll(async () => {
         // Start Tunnelmole, the URL will tunnel to `localhost:${port}`
        url = await tunnelmole({
            port
        });

         // Start the test express app listening on `localhost{$port}` 
        await new Promise((resolve, reject) => {
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
            //@ts-ignore
            body
        });

        const responseData = await response.json();
        expect(responseData.firstName).toEqual("John");
    });

    it("Upload binary photo", async() => {
        const image : Buffer = fs.readFileSync(__dirname + '/files/img/test-image.png');

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
        const image : Buffer = fs.readFileSync(__dirname + '/files/img/test-image.png');

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