'use strict';

const https = require('https');

module.exports = class SDKHttpClient {
    
    /**
     * REST Client constructor
     * @param {JSON} config Format is {name: "", endpoint: {host: "", port: "" (if neeeded)}, headers :{} (if needed)} 
     */
    constructor(config) {
        this._config = config;
    }

    /**
     * API Request with GET verb
     * @param {String} resourcePath Resource Path of API
     * @param {JSON} content queryStringParameters, Custom Headers can be passed
     */
    async GET(resourcePath, content) {

        const _opt = getOptions(this._config,  "GET", resourcePath, content)

        const resp = await executeHttpsRequest(_opt, content);

        return resp;
    }

    /**
     * API Request with PUT verb
     * @param {String} resourcePath Resource Path of API
     * @param {JSON} content body, Custom Headers can be passed other than headers in config
     */
    async PUT(resourcePath, content) {

        const _opt = getOptions(this._config,  "PUT", resourcePath, content)

        const resp = await executeHttpsRequest(_opt, content);

        return resp;
    }

    /**
     * API Request with POST verb
     * @param {String} resourcePath Resource Path of API
     * @param {JSON} content body, Custom Headers can be passed other than headers in config
     */
    async POST(resourcePath, content) {

        const _opt = getOptions(this._config,  "POST", resourcePath, content)

        const resp = await executeHttpsRequest(_opt, content);

        return resp;
    }

}

/**
 * Internal Function for this class to set options before calling the API
 * @param {JSON} config Config set in the constructor of this REST client. Host, Port, Certificate path would be available
 * @param {String} verb GET, PUT, POST or DELETE
 * @param {String} resourcePath Root resource path. For GET, queryString is appeneded
 * @param {JSON} content Customer Headers (if any)
 */
const getOptions = (config, verb, resourcePath, content) => {

    let fullPath = resourcePath;
    if (content.queryStringParameters) fullPath = `${resourcePath}?${content.queryStringParameters}`;

    const _opt = {
        "method": verb,
        "path": fullPath
    }

    // Append endpoint URL and port (if any)
    Object.assign(_opt, config.endpoint);

    // Append Standard and Custom Headers
    Object.assign(_opt, {            
        headers: Object.assign(content.headers, config.headers)
    });

    // Append ca Certificates
    if (config.endpoint.ca && typeof config.endpoint.ca === "string") {
        const caCertificate = Buffer(config.endpoint.ca);
        Object.assign(_opt, { ca: caCertificate });
    }    

    return _opt;
}

/**
 * Internal Function to call https module's request to get response for REST API's
 * @param {JSON} options Options Value for REST client request
 * @param {JSON} content body for POST and PUT
 */
const executeHttpsRequest = (options, content) => {        
    return new Promise((resolve, reject) => {

        let apiReq = https.request(options, (res) => {
            let _httpsRes = '';
            if(res.statusCode) {
                res.on('data', (chunk) => {
                    _httpsRes += chunk;
                });
               
                res.on('end', () => {
                    if(res.statusCode === 200){  
                        resolve(_httpsRes);  
                    }else{                            
                        reject(_httpsRes)
                    }                    
                })
            }
        });        

        if (content.body && Object.keys(content.body).length > 0) 
            apiReq.write(transformBody(content.body, content.headers));

        apiReq.on('error', (err) => {
            reject(err);
        });

        apiReq.end();
    })
}

/**
 * 
 * @param {JSON/String} body JSON or XML String for POST and PUT verbs
 * @param {JSON} headers JSON Stuff
 */
const transformBody = (body, headers) => {
    
    if (headers && Object.keys(headers).length > 0)  {
        const contentType = headers[Object.keys(headers).find(key => key.toLowerCase() === "content-type".toLowerCase())];

        if (contentType.includes("text/xml")) {
            // No change in body. It is assumed body would be in string.
            return body;
        } else if (contentType.includes("application/json"))  {
            return JSON.stringify(body);
        } else {
            return body;
        }
    } else {
        return body;
    }   
}