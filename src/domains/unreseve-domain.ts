import fetch from "node-fetch";
import config from "../../config.js";
import { getApiKey } from "../identity/api-key-service.js"

interface UnReserveDomainRequest {
   apiKey: string
   subdomain: string
}

const unreserveDomain = async function(subdomain: string): Promise<void> {
   subdomain = subdomain.replace(".tunnelmole.net", "");
   subdomain = subdomain.replace(".tunnelmole.com", "");

   const unreserveDomainEndpoint = `${config.hostip.httpEndpoint}/tunnelmole/unreserve-subdomain`;

   const apiKey = await getApiKey();

   if (apiKey === undefined) {
      console.error("Subdomains are linked to API Keys, so to reserve and unreserve domains you need to set your API key with --set-api-key");
      return Promise.resolve();
   }
   
   const data: UnReserveDomainRequest = {
      apiKey,
      subdomain
   }

   try {
      await fetch(unreserveDomainEndpoint, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
      });
   } catch (error) {
      console.error(`There was an error while trying to unreserve the subdomain ${subdomain}, see below`);
      console.error(error);
   }

   console.info(`If the subdomain ${subdomain} exists and it belongs to your API key, it has been unreserved`);

   return Promise.resolve();
}

export {
   unreserveDomain
}