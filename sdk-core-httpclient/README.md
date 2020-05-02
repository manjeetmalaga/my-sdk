
# **SDK Core Http Client** 

This module is to call external API services. Methods exposed are GET, POST, PUT & DELETE. Outputs are
* When reponse status code is 200, a valid response is provided
* Any otherresponse status code , error is thrown based on how external services responsd
  * error could have valid response
  * error could have blank response
  * error could have html content
  * Typical status codes are 400, 403, 500, 501 etc
* For any other error, error is thrown.

Request can be a JSON object or an XML Object. 
* For XML - "content-type" should be sent in the headers as "text/xml" 
* For JSON - "content-type" should be sent in the headers as "application/json"

# **Pre-requisites** 
Constructor takes a config value in the below format
* [host] - Mandatory - uri to connect to. E.g: api.core.example.com
* [ca] - Optional - Public Certificate to connect to URI. This is needed if the certificate is self signed or from not famous trusted entities
* [headers] - Generic Headers to be sent. Customized headers can be appended to this list in the calling function.
```
"client-gateway": {
    "endpoint": {
        "host": "",
        "ca":""            
    },        
    "headers": {
        "sender": "",
        "x-api-key": "",
        "content-type":  "application/json"
    }
}
```

# **Sample Snippet**


```
const sdkHttpClient = require('sdk-core-httpclient');

async addContact(postObj) {
        try {
            const API_PATH = "/<category>/<version>/<operation>";
            const content = {
                body: {},
                headers: {
                    "requestId": "",
                    "clientAppId": "",
                    "downStreamId": "",
                    "username": ""               
                }
            }
            const restClient = new sdkHttpClient(this.clientGateway);
            let contact = await restClient.POST(API_PATH, content);
            
            return contact;
        } catch (err) {
            throw new Error(err);
        }
    }
```
