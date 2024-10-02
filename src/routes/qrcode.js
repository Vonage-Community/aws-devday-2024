import { getSimSwapService } from './../services/SimSwap.js';
import { getVNAService } from './../services/VNA.js';
import { getNumberVerificationService } from './../services/NumberVerification.js';

function createRandomString(length) {
   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";
   for (let i = 0; i < length; i++) {
     result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
 }

export default function(router) {
    router.get('/qr-code', async (req, res) => {
      const vna = getVNAService(
         process.env.API_APPLICATION_ID,
         process.env.PRIVATE_KEY
      );
      const simSwap = getSimSwapService(vna);

      const hasBeenSwapped = await simSwap.hasBeenRecentlySwapped('990123456');
      
      if (hasBeenSwapped) {
         res.render('sim_swap_error.twig');
      } else {
         const stateID = createRandomString(10);
         const numberVerification = getNumberVerificationService(vna);
         const url = numberVerification.getAuthURL(process.env.DOMAIN, '+990123456', stateID);

         res.render('number_verification.twig', { 'verification_url': url, stateID });
      }
    });
    return router;
}
