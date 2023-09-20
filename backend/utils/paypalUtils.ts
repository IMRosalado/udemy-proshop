import dotenv from 'dotenv';
dotenv.config();
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

/**
 * Fetches an acess token from PayPal API
 * 
 * @returns { Promise<string> } The access token if request is successful
 * @throws { Error } if reqest is not successful
 */
async function getPayPalAccessToken() {
  //Authorization haeder requires base64 encoding
  const auth = Buffer.from(PAYPAL_CLIENT_ID+":"+PAYPAL_APP_SECRET).toString('base64');

  const url = `${PAYPAL_API_URL}/v1/oauth2/token`;

  const headers = {
    Accept: 'application/json',
    'Accept-Language': 'en_US',
    Authorization: `Basic ${auth}`
  }

  const body = 'grant_type=client_credentials';
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body
  });

  if (!response.ok) throw new Error('Failed to get access token');

  const paypalData = await response.json();

  return paypalData.access_token;
}

/**
 * Check if a PayPal transaction is new by comparing the transaction ID with existing orders in the DB
 * 
 * @param { Mongoose.Model } orderMOdel - The Mongoose model for the orders in the database
 * @param { string } paypalTranasctionId - The PayPal transaction ID to be checked
 * @returns { Promise<boolean> } Returns true if it is a new transaction (i.e. the transaction ID does not exist in the database) false otherwise
 * @throws { Error } If there's an error in querying the database
 * 
 */
export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  try {
    // Find all documents where Order.paymentResult.id is the same as id passed
    const orders = await orderModel.find({'paymentResult.id': paypalTransactionId});

    return orders.length === 0;
  } catch (e:any) {
    console.log(e)
  }
}

/**
 * Verifies a PayPal payment by making a request to the PayPal API
 * 
 * @param { string } paypalTransactionId - The PayPal transaction ID to be verified
 * @returns { Promise<Object> } An Object with properties 'Verified' indicating if the payment
 *  is completed and the 'value' indicating the payment amount
 * @throws { Error } If the request is not successful
 * 
 */
export async function verifyPayPalPayment(paypalTransactionId) {
  const accessToken = await getPayPalAccessToken();
  const paypalResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!paypalResponse.ok) throw new Error('Failed to verify payment')

  const paypalData = await paypalResponse.json();
  return {
    verified: paypalData.status === 'COMPLETED',
    value: paypalData.purchase_units[0].amount.value
  }
}