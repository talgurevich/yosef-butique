Introduction
Welcome to the PayPlus Documentation. This comprehensive guide provides the necessary information and resources to effectively utilize and manage your PayPlus services via the API.

Old API

Current API Version: v1.0
Please note that we are continuously working to enhance and update the API for optimal performance and stability. Consequently, there may be occasional updates. To ensure compatibility with these changes, please refer to this guide periodically. In the event of any major changes, our technical team will notify you in advance.

To ensure smooth communication and timely updates, please inform us via email if you plan to integrate with the PayPlus API. This will allow us to keep you informed about significant changes that may affect your integration. We encourage you to consult this documentation regularly to stay up-to-date with the latest developments.

If you have any inquiries or require assistance, please contact our technical support team at tech@payplus.co.il For faster resolution, include a detailed description of your issue. We are here to provide the necessary support.

Thank you for choosing PayPlus. We are committed to delivering a seamless and reliable API experience for your payment processing needs.

Explore and Test Our API Instantly
Real-Time API Explorer Built Into the Docs

🧪 Try the API Directly in the Docs
Our documentation includes a built-in Interactive API Explorer that lets you test our API in real-time—right from your browser.

You don’t need Postman or any external tools. Just:

Navigate to the endpoint you want to test.
Enter your parameters (like headers, body, or query strings).
Click "Try It!" to send a live request.
Instantly view the response from our API—status code, data, and any errors.
✅ What You Can Do:
Use your real API keys to test against staging or production.
Experiment with different request parameters to understand how the API behaves.
View code samples in multiple languages (e.g., cURL, JavaScript, Python).
Debug issues quickly by testing requests in a live environment.
🔐 Secure & Developer-Friendly:
API keys and secrets are handled securely.
You can toggle environments (Staging/Production).
Everything happens within the documentation—no context switching.
 
PayPlus REST API Environment URLs
Our service offers two environments for use: Staging and Production.

When working with the PayPlus API, it's essential to send your requests to the correct environment and use the corresponding credentials. Each function in the documentation includes the relevant URLs for both environments.

Be sure to follow the provided instructions for each API call carefully—this includes using the correct URL and authentication credentials—to ensure smooth and successful interaction with the PayPlus API.

Environment	URL
Staging	https://restapidev.payplus.co.il/api/v1.0/
Production	https://restapi.payplus.co.il/api/v1.0/

Sandbox Credit Card Numbers
Transaction Type	Card Number	Expiration Date	CVV
Successful	5326-1402-8077-9844	05/26	000
Rejected	5326-1402-0001-0120	05/26	000

Validate Requests Received from PayPlus
Why Validation Is Important
Validating incoming requests from PayPlus is a critical security measure. It ensures that the data you receive hasn't been tampered with and that it genuinely originated from PayPlus.

By verifying the hash and user-agent headers using your API secret key, you protect your system from:

Spoofed Requests: Prevent attackers from sending fake data that appears to come from PayPlus.
Data Integrity Issues: Ensure that the payload has not been altered during transmission.
Unauthorized Access: Avoid processing requests that don’t come from a trusted source.
This validation step helps maintain the integrity, security, and trustworthiness of your integration with the PayPlus API.

How to confirm the authenticity of the data:
Here is a sample of the response:

JSON

{  
    "results": {  
        "status": "success",  
        "code": 0,  
        "description": "payment page link has been generated"  
    },  
    "data": {  
        "page_request_uid": "0e8789bf-9eaf-4a07-9c16-0a348a4fd5d9",  
        "payment_page_link": "http://localhost:8000/0e8789bf-9eaf-4a07-9c16-0a348a4fd5d9"  
    }  
}
And headers:

JSON

{
    "hash": "yb4ViUaVO6OFdF9iyISKtCi+cXTvWm0+3e/sQkPsNS0=",
    "user-agent": "PayPlus"
}
Sample function (Node.js) to verify encrypted data:

JSON

resolvePayPlusHash = (response, secret_key) => {
    if (!response) {
        return false;
    }
    if (response.headers['user-agent'] !== 'PayPlus') {
        return false;
    }
    const message = response.body && JSON.stringify(response.body);
    if (!message) {
        return false;
    }
    const hash = response.headers['hash'];
    if (!hash) {
        return false;
    }
    const genHash = crypto.createHmac("sha256", secret_key)
        .update(message)
        .digest("base64");
    return genHash === hash;
}
This function is an example to check the validation of the PayPlus response. This part:

JavaScript

const genHash = crypto.createHmac("sha256", secret_key)
    .update(message)
    .digest("base64");
return genHash === hash;
is verifying the encrypted data.

Website or App
Online Payment Integration for Websites and Applications

Step-by-Step Instructions for Online Payment Processing
1. Navigate to GenerateLink route under API Endpoints > Payment Pages
2. API Credentials
To test the API in Postman or by the Interactive API Explorer, you'll need the following:

payment_page_uid
Under the Headers section, include:
api-key
secret-key
🔒 These credentials are available only to registered users. Register here: Sign Up
For help locating your API credentials, follow this step-by-step guide.

3. Required Parameters
Fill in or copy to Postman the required parameters that can be found under the generateLink route.

4. Callbacks and redirects
To receive transaction updates and redirect users after payment:

Callback URL:
Add refURL_callback to receive server-side updates regarding the transaction.

📌 Successful transaction callbacks are sent automatically when this URL is set. If you want to receive callbacks for failed transactions as well, include the parameter send_failure_callback and set it to true.
Success URL:
Add refURL_success to redirect users to your custom Thank You page after a successful transaction.

📌 When this URL is triggered, your end user will be redirected and transaction data will be sent to the URL as either a GET or POST request—depending on the settings you've configured for your Payment Page in the PayPlus dashboard.
Failure URL:
Add refURL_failure to redirect users to a custom Failure page after a failed transaction.

📌 Just like the refUrl_success, data about the transaction attempt will be included in the request sent to this URL, using either GET or POST, based on your PayPlus page configuration.
Additional Notes
1. Security Requirement – Server-Side Calls Only
All API requests must be made server-side.
Client-side calls (e.g., from browsers or mobile apps) are strictly prohibited to protect sensitive information and prevent unauthorized access.

2. Charge Method Parameter Types
Value	Type                       	Description
0	Card Check (J2)	Verifies that the credit card number, expiration date, and CVV are correct and that the card is active. It doesn't hold any funds, but confirms the card's validity.
1	Charge (J4)	Immediate payment. The customer's card is charged right away. Best for one-time purchases.
2	Approval (J5)	Checks if there are sufficient funds available on the card and secures the amount for a potential purchase.
3	Recurring Payments	Set up automatic recurring billing. Ideal for subscriptions or memberships. (Requires an additional module.)
4	Refund	Immediate refund. The customer's card is refunded right away.
3. Including Extra Information with more_info
To include additional data in your transaction—such as an order number, shipping details, or other custom fields—use the more_info in your API request.

You can specify up to six fields:

more_info
more_info_1
more_info_2
more_info_3
more_info_4
more_info_5
These fields allow you to attach meaningful metadata to the transaction for tracking, reporting, or business logic purposes.

📌 Any more_info values you send will also be returned to your system via all callback and redirect URLs (refURL_callback, refURL_success and refUrl_failure).
📄 4. Enable Invoice Generation (Optional)
If you need to issue invoices:

Subscribe to the invoice module in your PayPlus dashboard.
Set up your invoice numbering preferences.
Once enabled, include this parameter in your request:
initial_invoice: true

Devices
Integration from your software to PayPlus Devices

Step-by-Step Instructions for Clearing Device Payment Processing
1. Navigate to TransactionByDevice under API Endpoints > Devices
2. API Credentials
To test the API in Postman or by the Interactive API Explorer, you'll need the following:

Under the Headers section, include:
api-key
secret-key
For help locating your API credentials, follow this step-by-step guide.

🔒 These credentials are available only to registered users. Register here: Sign Up
To retrieve the device_uid, please follow the below steps:
Log in to your PayPlus account.
Click 'Settings' (top left corner).
On the 'Settings' screen, choose 'Devices List'.
Copy the unique parameter assigned to your terminal device.
3. Required Parameters
Fill in or copy to Postman the required parameters that can be found under the TransactionByDevice route.

4. Callbacks and redirects
Callback URL:
Add refURL_callback to receive server-side updates regarding the transaction.

📌 Successful transaction callbacks are sent automatically when this URL is set. If you want to receive callbacks for failed transactions as well, include the parameter send_failure_callback and set it to true.
Additional Notes
1. Security Requirement – Server-Side Calls Only
All API requests must be made server-side.
Client-side calls (e.g., from browsers or mobile apps) are strictly prohibited to protect sensitive information and prevent unauthorized access.

2. Charge Method Parameter Types
Value	Type	Description
0	Card Check (J2)	Verifies that the credit card number, expiration date, and CVV are correct and that the card is active. It doesn't hold any funds, but confirms the card's validity.
1	Charge (J4)	Immediate payment. The customer's card is charged right away. Best for one-time purchases.
2	Approval (J5)	Checks if there are sufficient funds available on the card and secures the amount for a potential purchase.
4	Refund	Immediate refund. The customer's card is refunded right away.
3. Including Extra Information with extra_info
To include additional data in your transaction—use the extra_info in your API request.

📌 The more_info value you send will also be returned to your system via a callback.
📄 4. Enable Invoice Generation (Optional)
If you need to issue invoices:

Subscribe to the invoice module in your PayPlus dashboard.
Set up your invoice numbering preferences.
Once enabled, include this parameter in your request:
initial_invoice: true

Hosted Fields
Using the hosted fields feature with PayPlus.
PayPlus offers the ability to host your own payment page on your own website without relying on externally hosted payment forms.
This repository contains a simple demo showing how to achieve that.

In order to be able to run this demo, you need:

Test/dev credentials from PayPlus, with API permission.
A server with a domain name, an SSL certificate and support for PHP 7.4 or greater. The PHP part is technically optional because you could write your own code to accomplish this step in any server side language, but this demo only comes with a php file out of the box.
Knowledge of npm package manager, html/javascript and basic php (again, the PHP part can be replaced with any other server-side language provided you can write your own code to create a new payment page link. You could even make this request in Postman and then inject the response into the browser).
The repository generally contains 3 files that are of importance for the demo: payment.php, index.html and script.js

payment.php - this is where the original payment page request is generated. As payment page generation requires secret credentials, it is done on the website's server before this information can be passed on to the browser. This file merely contains the most rudimentary payment page generation request with some sample data. Do note, however, that you need to edit it to enter your own credentials and other information.
PHP

  define('API_KEY', '');
  define('SECRET_KEY', '');
  define('PAYMENT_PAGE_UID', '');
  define('ORIGIN_DOMAIN', 'https://www.example.com');
  define('SUCCESS_URL', 'https://www.example.com/success');
  define('FAILURE_URL', 'https://www.example.com/failure');
  define('CANCEL_URL', 'https://www.example.com/cancel');
As this demo mostly focuses on the hosted fields part, assuming you already know how to generate a payment page, I will leave it at that.
However, there are some more useful comments inside the file itself.
index.html - defines the payment page layout. This demo uses bootstrap for the design, just to make things more aesthetic.
script.js - this is where the magic happens. Here we initialize the hosted fields plugin, map all the required fields, and define callbacks. Most of the demo happens here.
Installation
Download/clone this repository into a working server into whatever directory that is accessible via HTTP.
Modify the file payment.php as explained above.
Run npm i to install dependencies.
At this point, you should be able to navigate to the index of whatever directory you put this demo into. You should see a payment form with some fields, and basic boostrap design.
Overview
In a nutshell, the process starts when the client first makes a request to payment.php where a payment page link will be generated, and returned to the client which will then parse the html file, replace placehodlers with iframes containing actual hosted fields, take control over the rest of the non hosted fields, and will begin listening to the client interaction.
Upon submission, it will pass the information to the hosted field iframe which will, in turn communicate with the PayPlus server to process the transaction, or return error. The client will then receive a response from the server via the hosted fields iframe, and will determine how to proceed further.

script.js
We start by initializing the hosted fields dom object:

JavaScript

const hf = new PayPlusHostedFieldsDom();
Then, we need to tell the plugin where the relevant fields are on the html page.
This is the part where we tell the plugin about the actual hosted fields. All of these are html tags that will either be replaced by an iframe containing the relevant field, or be hidden if not needed. We define the element selector, and also a wrapper element. This is to allow the plugin to hide the entire block if it needs to be hidden, rather than just the field itself.

Also notice that we use simple CSS selectors. Any valid selector should work, both here and in the next section

JavaScript

hf.SetMainFields({
	cc: {
		elmSelector: "#cc",
		wrapperElmSelector: "#cc-wrapper",
	},
	expiryy: {
		elmSelector: "#expiryy",
		wrapperElmSelector: ".expiry-wrapper",
	},
	expirym: {
		elmSelector: "#expirym",
		wrapperElmSelector: ".expiry-wrapper",
	},
	expiry: {
		elmSelector: "#expiry",
		wrapperElmSelector: ".expiry-wrapper-full",
	},
	cvv: {
		elmSelector: "#cvv",
		wrapperElmSelector: "#cvv-wrapper",
	},
})
Notice that we're defining 5 fields here. The first one is the credit card. Self explanatory.
Second through fourth are for the expiration date. The reason we need to define 3 of them is because PayPlus payment page configuration allows you to split up the expiry field into two fields (one for the month, one for the year). So, the first two are for the two individual fields, and the last one - in case the page is configured to have a single expiry field. This way, if the page is configured to have separate expiry fields, this affords the website developer a more granular control over how the page will look regardless of the page configuration.

A word about the CVV field. This is a pivotal field for the whole process. If the payment page is configured to show it, it'll just show up as a field, otherwise, it will stay hidden but will nonetheless still be there, because this is the one field to rule them all.
This is the field that controls the whole process of communication between the client website - the hosted fields - and the PayPlus server. You don't need to understand it. This is just to give you a bit of a peek into the inner workings of this plugin.

JavaScript

	.AddField("card_holder_id", "#id-number", "#id-number-wrapper")
	.AddField("payments", "#payments", "#payments-wrapper")
	.AddField("card_holder_name", "#card-holder-name", "#card-holder-name")
	.AddField('card_holder_phone', '.card-holder-phone', '.card-holder-phone-wrapper')
	.AddField('card_holder_phone_prefix', '.card-holder-phone-prefix', '.card-holder-phone-prefix-wrapper')
	.AddField("customer_name", "[name=customer_name]", ".customer_name-wrapper")
	.AddField("vat_number", "[name=customer_id]", ".customer_id-wrapper")
	.AddField("phone", "[name=phone]", ".phone-wrapper")
	.AddField("email", "[name=email]", ".email-wrapper")
	.AddField("contact_address", "[name=address]", ".address-wrapper")
	.AddField("contact_country", "[name=country]", ".country-wrapper")
	.AddField("custom_invoice_name", "#invoice-name", "#invoice-name-wrapper")
	.AddField("notes", "[name=notes]", ".notes-wrapper")
	.SetRecaptcha('#recaptcha')
Here, similarly to the previous snippet, we define some more fields. These, unlike the first batch however, will not be replaced by iframes but rather be hosted on under your domain's origin.
We still need to map them for the plugin to be able to interact with them. This is because upon form submission, the information they hold, will also be sent over to the server. The plugin needs to know where these fields are so it can access them. Also, if you choose to disable/hide them via the payment page configuration, the plugin will hide them as well. It is generally a good idea to map as many of these fields as possible. Anything that isn't needed, will not be shown. On the other hand, should you choose to reconfigure the payment page in the future to include some of them, they will already be there. For instance, you may initially decide that you don't need the card_holder_name for now and but then eventually decide that you do want it. If you already mapped it in code, it'll just be a matter enabling it via the payment page configuration page. Otherwise you would need to go back and edit the page source code again to add the missing field before you can actually enable and use it. Best to map them all, just in case.

Also notice the last part:


.SetRecaptcha('#recaptcha')
If your page is configured to be protected by a recaptcha, this command will replace the selected element with an iframe with a recaptcha

JavaScript

$.get("payment.php", async (resp) => {
	if (resp.results.status == "success") {
		try {
			await hf.CreatePaymentPage({
				hosted_fields_uuid: resp.data.hosted_fields_uuid,
				page_request_uid: resp.data.page_request_uid,
				origin: 'https://restapidev.payplus.co.il'
			});
		} catch (error) {
			alert(error);
		}
		hf.InitPaymentPage.then((data) => {
			$("#create-payment-form").hide();
			$("#payment-form").show();
		});
	} else {
		alert(resp.results.message);
	}
});
This part will mostly differ from website to website depending on the framework used. I used simple jQuery for this entire demo as it is the easiest to understand, and most commonly used.
In a nutshell, what this code does is it first makes a GET request to the previously mentioned payment.php. Assuming a successful response, it will return 2 parameters that are needed for the process to start. We need the page_request_uid, and hosted_fields_uuid for the process to initialize.

As can be seen, CreatePaymentPage accepts an object with a third parameter, "origin". Not to be confused with the refURL_origin parameter in payment.php, this one refers to the PayPlus API server and can be either https://restapidev.payplus.co.il or https://restapi.payplus.co.il.
In this case I use https://restapidev.payplus.co.il for dev environment. For prod, replace it with https://restapi.payplus.co.il.

We then subscribe to the hosted field's InitPaymentPage promise, and upon its completion, we can do whatever housekeeping we may need to do (like actually showing the HTML form, hiding irrelevant stuff, whatever is needed by the website)

JavaScript

$("#submit-payment").on("click", () => {
  hf.SubmitPayment();
});
Here I define the submit button. When the button is clicked, hf's SubmitPayment routine will commence.

Lastly, we define some events

JavaScript

hf.Upon("pp_pageExpired", (e) => {
	$("#submit-payment").prop("disabled", true);
	$("#status").val("Page Expired");
});

hf.Upon("pp_noAttemptedRemaining", (e) => {
	alert("No more attempts remaining");
});

hf.Upon("pp_responseFromServer", (e) => {
	let r = "";
	try {
		r = JSON.stringify(e.detail, null, 2);
	} catch (error) {
		r = e.detail;
	}
	$("#status").val(r);
});
hf.Upon("pp_submitProcess", (e) => {
	$("#submit-payment").prop("disabled", e.detail);
});
Using hf's method "Upon", we can subscribe to events and define custom behavior for when these events fire.
For the sake of this demo, I chose to use the pp_responseFromServer event to display whatever information server spits back onto a textarea for debugging purposes. In a real environment, this will probably be used for some sort of event routing like displaying a ThankYou page/popup upon success, or a failure page upon failure.

Fields
As mentioned above, the plugin expects 2 types of fields to be mapped.
Hosted fields require any element, as it will be replaced by an iframe anyway. Here I use a simple span tag. Non hosted fields - actual fields that are entirely hosted on the website. These need to be either inputs or select fields.

Hosted fields:
cc - Credit card field.
cvv - Will naturally hold the field for CVV but is also the main field that controls the entire process.
expiry - a single expiry field expecting the month and year of the credit card.
expiryy/expirym - Expiry year/month fields respectively. Used when configuired to host separate fields for expiry year and month.
Non hosted fields
card_holder_id - ID/ Israeli national ID card number of the card owner
card_holder_name - Name of the card owner
customer_name - customer name, as defined internally on payplus or sent on the initial payment page request.
vat_number - the Israeli ID card number, but similarly to the previous field, as it was submitted during payment page creation.
custom_invoice_name - Alternative name to be used to issue a resulting invoice.
phone - phone number.
email - email address.
contact_address - contact address.
contact_country - contact country.
notes - textual notes to be sent along with the transaction.
Note: you may be wondering why there are two fields for the customer's name and their Israeli ID number. The first two fields strictly refer to the card holder information, whereas the next two refer to the customer. The two don't strictly have to be the same (think friend paying for another friend's bill ...etc.)

Note: there's more. PayPlus allows you to define any additional custom fields to be displayed on the payment page. The hosted fields plugin supports this functionality as well.
You can use the AddField method to add any other field, provided it was defined in the payment page settings. So, for instance, if your payment page has a custom field called "Code", you may add your own html field for it, and then simply map it, as you normally would, any other predefined hosted field:

JavaScript

.AddField('Code', '#code-fld', '#code-fld-wrapper')
The hosted fields plugin will hide any mapped fields that aren't defined so feel free to define any possible fields, and they will only appear if/when configured.
This will also handle their required/optional setting.

Events
As mentioned above, the plugin exposes a number of events that will fire during various situations throughout the process.
To subscribe to an event, the plugin provides the function Upon:

JavaScript

hf.Upon("pp_noAttemptedRemaining", (e) => {
	alert("No more attempts remaining");
});
2 parameters. Event name, and a callback with the event's data as a callback's sole parameter.

Available events:
pp_responseFromServer - perhaps the most important one. Whenever there's a response from the server, this event will fire and will include its content in the callback's parameter. This is where you can ultimately check for errors returned by the server, or whether the request was successful.
pp_noAttemptedRemaining - fires when the customer exceeds the number of available attempts.
pp_pageExpired - when the payment page expires.
pp_paymentPageKilled - when the payment page is invalidated. It fires along with the two events above
pp_submitProcess - fires when information is submitted to the server for processing, and again when processing is over, indicating the status with either value true or false. Thus, when fired with "true", and until it fires again with "false", it can be assumed that the submit process is ongoing. Useful when you want to display a loader for the user, indicating that the request is still being processed. For instance, in this example I use it to disable the submit button while processing, and reenable it when done.
pp_ccTypeChange - when the customer enters their credit card number, and enough digits have been entered, the system is able to guess the brand of the credit card. For instance, if the digits 53 have been entered, the system assumes that it will be a Mastercard. This event fires whenever such detection occurs, usually when the customer entered the first two digits, but may happen multiple times if the customer clears the credit card field and types again. This is useful if you wish to display the credit card brand's logo as soon as it can be inferred.
Important update from 2024-08-12 - Card holder's phone number and name
As of 2024-08-12, 3dSecure transactions now REQUIRE the card holder's phone number and name.
Therefore, we have updated the plugin to:

Require the card_holder_name field in case of a 3dsecure transaction regardless of the payment page configuration.
Added the card_holder_phone field which is also mandatory for 3dsecure transactions.
We've updated the sample index.html file and script.js to reflect that.

The new fields are:
card_holder_phone - as described above, this is the field that holds the card holder's phone number similar to card_holder_name or card_holder_id.
card_holder_phone_prefix - this field allows the developer to add a dedicated field for the country code in order to ensure that the phone number is in proper form.
Secure3d transactions require the phone number to be in a proper format: country code + phone number, without the leading zero or plus sign, eg: israeli phone number 052-123456 will be sent as: 97252123456.

In the demo we've added a select field for the country codes and mapped it to card_holder_phone_prefix, followed by a simple input field for the phone number and then mapped it to card_holder_phone allowing the customer to select their country code and then type their actual phone number.
The card_holder_phone_prefix field is not required. You may elect to omit it if you can ensure that the customer will fill in their phone number in a proper format. The final implementation is up to the website developer.

If your plugin version is below 1.2.0, you MUST update to the latest version to take advantage of these changes

Payment Methods
Google Pay™

Introduction

Google Pay™ is a secure digital card wallet offered by Google, providing users with a convenient and streamlined payment experience. With Google Pay™, shoppers can make purchases using major credit cards, including Mastercard, Visa, American Express, and Discover, that are securely stored in their Google Account.By leveraging Google Pay™, customers can enjoy a hassle-free payment process, with the assurance of robust security measures implemented by Google. It offers a seamless and efficient way to complete transactions, enhancing the overall shopping experience for users.Please note that the availability and specific features of Google Pay™ may vary based on the user's location and device compatibility.

Implementing Google Pay™ on your website

Implementing Google Pay™ on your websiteWhen customers utilize Google Pay™ on your website, they can easily select the desired item(s) for purchase. Through the integration of PayPlus Hosted Payment Pages, your shoppers will have the option to choose Google Pay™ as their preferred payment method, streamlining the checkout process with just a few clicks.To obtain more information about incorporating Google Pay™ into PayPlus hosted payment pages, please visit the PayPlus Google Pay™ website at PayPlus Google Pay™ .


Benefits of Google Pay™


Enhanced Payment Experience:Google Pay™ offers a faster and highly secure method of payment, leveraging the payment methods stored in customers' Google Accounts. This streamlines the checkout process, providing a more convenient and efficient payment experience for users.

Wide Acceptance:Google Pay™ is accepted at millions of locations worldwide. It is available across various platforms, including Android, iOS, and desktop, and can be utilized with popular browsers such as Chrome, Firefox, and Safari. This widespread availability ensures that customers can use Google Pay™ seamlessly in numerous online environments.

Improved Conversion Rates:By offering Google Pay™ as a payment option, merchants can enhance their conversion rates. The seamless and secure payment process encourages customers to complete their purchases, reducing cart abandonment and increasing overall sales.

Enhanced Security:Google Pay™ prioritizes the security of payment information by implementing multiple layers of protection, including card network tokenization. This advanced security measure safeguards sensitive data, providing customers with peace of mind during transactions.


Getting started

Google Pay™ is seamlessly integrated into the secure hosted payment pages of PayPlus, eliminating the need for you to handle any coding on your end. Getting started with Google Pay™ is simple:

Open a PayPlus Account:

Easily open a PayPlus account by completing the signup form found at PayPlus Signup Form. The process can be completed in just a few clicks.

Set up Your PayPlus Account:

Once you have submitted the signup form, our dedicated agents will promptly reach out to you to assist with setting up and activating your PayPlus account. They will guide you through the necessary steps to ensure your account is up and running smoothly.

Request Google Pay™ as a Payment Method:

With your operational PayPlus account, you can easily add Google Pay™ as a payment method within the secure payment pages of PayPlus. Simply navigate to the Settings -> Alternative Payment Methods section and follow the instructions to integrate Google Pay™. By following these steps, you can swiftly enable Google Pay™ as an additional payment method in your PayPlus checkout process, providing your customers with a seamless and secure payment option.

Supported merchant countries

Before getting started, we kindly request that you carefully review and accept Google's Acceptable Use Policy and Google Pay API Terms of Service. It is essential to familiarize yourself with these policies to ensure compliance and a smooth integration process.To enable Google Pay™ acceptance for your PayPlus secured hosted checkout page, please contact PayPlus Support. Our support team will be happy to assist you and enable Google Pay™ functionality for your PayPlus account.


Add
post
https://restapi.payplus.co.il/api/v1.0/Customers/Add
This endpoint allows you to create a new customer in the system.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
email
string
required
Customer email address.

customer_name
string
required
Customer name.

paying_vat
boolean
Defaults to true
Let's the system know if the customer is paying VAT or not.


vat_number
integer
Customer or Company VAT number.

customer_number
string
Internal customer number in the system.

notes
string
Notes, comments, or additional information about the customer.

phone
string
Customer phone number.

contacts
array of objects
Contact details associated with the customer.


ADD object
business_address
string
Business address of the customer.

business_city
string
Business city.

business_postal_code
string
Business postal code.

business_country_iso
string
Defaults to IL
Business country code.

subject_code
string
External customer number in other ERP or other systems.

communication_email
string
Email for communication purposes.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Response

200
200

Update
post
https://restapi.payplus.co.il/api/v1.0/Customers/Update/{uid}
This endpoint allows you to update an existing customer in the system. You can modify various attributes of the customer.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
uid
string
required
Customer unique identifier.

Body Params
email
string
Customer email address.

customer_name
string
Customer name.

paying_vat
boolean
Defaults to true
Let's the system know if the customer is paying VAT or not.


vat_number
string
Customer or Company VAT number.

customer_number
string
Internal customer number in the system.

notes
string
Notes, comments, or additional information about the customer.

phone
string
Customer phone number.

contacts
array of objects
Contact details associated with the customer.


ADD object
business_address
string
Business address of the customer.

business_city
string
Business city.

business_postal_code
string
Business postal code.

business_country_iso
string
Defaults to IL
Business country code.

subject_code
string
External customer number in other ERP or other systems.

communication_email
string
Email for communication purposes.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

View
get
https://restapi.payplus.co.il/api/v1.0/Customers/View
This endpoint allows you to view a list of customers in the system. You can filter the results based on various parameters.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Query Params
uuid
string
Customer unique identifier.

vat_number
string
Customer or Company VAT number.

email
string
Customer email address.

skip
string
Optional Query variable, From where you want to start take records.

take
string
Optional Query variable required if skip have some value. Max 500. This means that you want take 5 records.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Remove
post
https://restapi.payplus.co.il/api/v1.0/Customers/Remove/{customer_uid}
This endpoint allows you to remove a customer from the system.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
customer_uid
string
required
Customer unique identifier.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Add
post
https://restapi.payplus.co.il/api/v1.0/Banks/CreateCustomerBankAccount
This endpoint allows you to create a new bank account associated with a specific customer.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
customer_uid
string
required
This parameter is required so the system can associate the customer with their specific bank details.

bank_code
integer
required
Bank code based on the banks codes dictionary.

branch_code
integer
required
Bank ranch code.

account_number
string
required
Customer account number.

account_name
string
required
Customer account name as registered in the bank.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Update
post
https://restapi.payplus.co.il/api/v1.0/Banks/UpdateCustomerBankAccount/{uid}
This endpoint allows you to update an existing bank account associated with a specific customer.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
uid
string
required
Bank Account UID

Body Params
bank_code
integer
required
Bank code based on the banks codes dictionary

branch_code
integer
required
Bank ranch Code

account_number
integer
required
Customer account number

account_name
string
required
Customer account name as registered in the bank

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Remove
post
https://restapi.payplus.co.il/api/v1.0/Banks/RemoveCustomerBankAccount/{bank_account_uid}
This endpoint allows you to remove a bank account associated with a specific customer.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
bank_account_uid
string
required
Bank Account UID

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

View
get
https://restapi.payplus.co.il/api/v1.0/Banks/CustomerBankAccounts/{customer_uid}
This endpoint allows you to retrieve a list of bank accounts associated with a specific customer.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
customer_uid
string
required
Customer unique identifier

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Company Bank Accounts
get
https://restapi.payplus.co.il/api/v1.0/Banks/CompanyBankAccounts
Log in to see full request history
time	status	user agent	
Make a request to see history.

Query Params
payment_method
string
Filter by payment method

with_reject
boolean
Include rejected records


true
Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Create
post
https://restapi.payplus.co.il/api/v1.0/Categories/Add
This endpoint allows you to create a new product category.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
name
string
required
Category name

valid
boolean
required
Affects category status


true
Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400
Update
post
https://restapi.payplus.co.il/api/v1.0/Categories/Update/{uid}
This endpoint allows you to update an existing product category.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
uid
string
required
Categogry UID

Body Params
name
string
required
Category name

valid
boolean
required
Affects category status


true
Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

View
get
https://restapi.payplus.co.il/api/v1.0/Categories/View
This endpoint allows you to retrieve a list of product categories. If you want to view a specific category, you can use the 'uid' query parameter.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Query Params
uid
string
Category UID

skip
string
Optional Query variable, From where you want to start take records.

take
string
Optional Query variable required if skip have some value. Max 500. This means that you want take 5 records.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Add
post
https://restapi.payplus.co.il/api/v1.0/Products/Add
This endpoint allows you to create products. You can specify details such as category, name, price, currency, VAT type, and additional product information. The product will be added to your catalog and can be used in transactions, recurring payments, Invoice+, etc.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
category_uids
array of strings
Array of strings, each string is a different category_uid. This allows you to assign your product to multiple categories. If not set, the product will be assigned to system's default category.


ADD string
name
string
required
Product name. This is a required field and should be unique for each product for better identification.

valid
boolean
Defaults to true
Sets if the product is valid or not. If set to false, the product will not be available accross the system.


price
integer
required
Sell price

currency_code
string
enum
required

ILS
Allowed:

ILS

USD

EUR

GPB
vat_type
integer
enum
required
0 - VAT Included 1 - VAT Not Included 2 - VAT Exempt


0
Allowed:

0

1

2
barcode
string
Barcode of the product. This is an optional field, but it can be used to identify the product in a more convenient way.

value
string
Cost price

description
string
Product description, can be used for additional information about the product.

fixed_amount_discount
integer
Fixed amount discount for the product. This is a discount that will be applied to the product price.

percentage_discount
integer
Percentage discount for the product. This is a discount that will be applied to the product price as a percentage.

guide_document_url
string
Mostly used for invoies to send manual docmentation of a product when customer buying product

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Add
post
https://restapi.payplus.co.il/api/v1.0/Token/Add
This endpoint allows you to create a token for a credit card.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
terminal_uid
string
required
Terminal unique identifier

customer_uid
string
required
Customer unique identifier, required because a token is associated with a customer.

card_date_mmyy
string
required
MM/YY (MM = month, YY = year) format for the card expiration date.

credit_card_number
string
required
Full credit card number, excluding spaces or dashes.

identification_number
string
Card holder identification number

previous_uid
string
If you provide another UID and it does not exist in the PayPlus system, we will save this parameter. If it already exists, a new one will be created.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Add
post
https://restapi.payplus.co.il/api/v1.0/RecurringPayments/Add
This endpoint allows you to create a recurring payment.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Delete Recurring
post
https://restapi.payplus.co.il/api/v1.0/RecurringPayments/DeleteRecurring/{uid}
This endpoint allows you to delete a recurring payment.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
uid
string
required
Recurring Payment unique identifier

Body Params
terminal_uid
string
required
Terminal unique identifier

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Add Recurring Charge
post
https://restapi.payplus.co.il/api/v1.0/RecurringPayments/AddRecurringCharge/{uid}
Add Recurring Charge

Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
uid
string
required
Recurring payment uid

Body Params
terminal_uid
string
required
Unique identifier for terminal

card_token
string
required
This field is not required if it's bank recurring order

cvv
string
In case the terminal is opened as recurring, this field is mandatory for initialization transactions when a new recurring order is created.

bank_account_uid
string
Customer bank account uid. This field is required in case this is bank masav order.

company_bank_account_uid
string
This field is required in case this is bank masav order.

charge_date
string
required
Example: 2020-12-16

valid
boolean
required
Defaults to true
Affects recurring Charge status


true
items
array of objects
required

ADD object
extra_info
string
Extra Info

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Charged
get
https://restapi.payplus.co.il/api/v1.0/RecurringPaymentsReports/Charged
Log in to see full request history
time	status	user agent	
Make a request to see history.

Charge Transaction (J4)
post
https://restapi.payplus.co.il/api/v1.0/Transactions/Charge
Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
terminal_uid
string
required
Unique identifier for terminal

cashier_uid
string
required
Unique identifier for cashier

amount
number
required
currency_code
string
required
Defaults to ILS
ILS
credit_terms
integer
enum
required
Defaults to 1
1-regular OR 6-credit OR 8-payment


1
Allowed:

1

6

8
use_token
boolean
required
Defaults to false
If true , token is required


false
token
string
Required only if use_token is true

initial_invoice
boolean
Defaults to true
If sent the transactions will consider if to initial invoice or not, if not sent then will take the default setting


customer_name_invoice
string
Required only if customer_uid is null and have integrated invoice system

create_token
boolean
Defaults to false
nullable (In case you have tokenization permission, you can decide if you would like to return the token of the customer for future charges)


add_data
string
SHOULD BE SENT JUST IF YOUR CREDIT CARD COMPANY OPENED THIS OPTION !!!

deferMonths
integer
Defaults to 0
nullable (If you are using Club Codes [Kod Moadon] send the code in this field)

original_terminal_uid
string
In case you charging J5 transaction in another terminal, provide the original terminal of the original J5 tranasaction.

customer_uid
string
Mandatory if use_token is true, customer object can be used instead

id
string
Payer credit card holder identification number

customer
object

customer object
products
array of objects
Optional ,Array of objects


ADD object
credit_card
object
Required if use token is false


credit_card object
payments
object
Optional


payments object
extra_info
string
more_info_1
string
nullable (Additional Information)

more_info_2
string
nullable (Additional Information)

more_info_3
string
nullable (Additional Information)

more_info_4
string
nullable (Additional Information)

more_info_5
string
nullable (Additional Information)

self_secure_3ds
object

self_secure_3ds object
Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Transactions History
post
https://restapi.payplus.co.il/api/v1.0/TransactionReports/TransactionsHistory
Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
terminal_uid
string
required
Unique identifier for terminal

filter
object
required

filter object
skip
string
Defaults to 0
From where you want to start take records.in this example you start from the first record

take
string
Defaults to 5
required if skip have some value. max 500 This means that you want take 5 records.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Payment Pages
A dedicated web or app interfaces where customers securely enter their payment information to complete an online transaction. They're the final, crucial step in the purchasing process, designed to facilitate the collection of sensitive financial data and ensure a smooth, secure checkout experience.

Key Usages of Payment Pages
Collecting diverse payment methods: Payment pages allow customers to pay using various methods like credit/debit cards, digital wallets (Apple Pay, Google Pay), bank transfers, etc.
Ensuring security: They're built with robust security features, including encryption technologies (like SSL/TLS) and PCI DSS compliance, to protect sensitive customer data from fraud and breaches. For merchants, using a hosted payment page often reduces their PCI compliance burden.
Streamlining the checkout process: A well-designed payment page aims to minimize friction and simplify data entry, leading to higher conversion rates and reduced cart abandonment. This includes features like autofill options, real-time validation, and a clear, intuitive layout.
Supporting various business models: Payment pages are used across a wide range of businesses, from e-commerce stores selling physical products to service providers collecting fees, non-profits accepting donations, and event organizers selling tickets.
Facilitating different transaction types: They can handle one-time payments, recurring subscriptions, and even pre-authorized payments.
Please read this full guide for step-by-step instructions on integrating the PayPlus Payment Page API into your website or application.

Payment Pages List
get
https://restapi.payplus.co.il/api/v1.0/PaymentPages/list/
Log in to see full request history
time	status	user agent	
Make a request to see history.

Query Params
terminal_uid
string
required
Your terminal UID.

skip
string
Optional Query variable, From where you want to start take records.in this example you start from the first record

take
string
Optional Query variable required if skip have some value. max 500. This means that you want take 5 records.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
Successful response


400
Bad Request

Available Charge Methods
get
https://restapi.payplus.co.il/api/v1.0/PaymentPages/ChargeMethods
Log in to see full request history
time	status	user agent	
Make a request to see history.

Query Params
payment_page_uid
string
Your payment page uid in order to receive available payment

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Generate Payment Link
post
https://restapi.payplus.co.il/api/v1.0/PaymentPages/generateLink
The PaymentPages/GenerateLink endpoint allows you to generate a payment link for processing transactions. You can configure options like charge methods, amount, and success/failure callbacks.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
payment_page_uid
string
required
Defaults to 7a0bc4d4-f35f-4301-a945-926378a2416d
UID of the Payment Page

7a0bc4d4-f35f-4301-a945-926378a2416d
charge_method
integer
enum
Defaults to 1
0 - Check (J2) 1 - Charge (J4) 2 - Approval (J5) 3 - Recurring Payments 4 - Refund (J4) 5 - Token (J2)

If not set, default value - what is set in the payment page settings.

Allowed:

0

1

2

3

4

5
charge_default
string
enum
Defaults to nullable
Options: credit-card, bit, multipass, paypal, praxell, valuecard, verifone. If your payment page includes multiple options, you can select which tab will be opened by default when the user lands on the payment page.


Allowed:

nullable

credit-card

bit

multipass

paypal
hide_other_charge_methods
boolean
Defaults to false
If you have multiple payment methods in your page with this option you will be able to hide other payment methods and manage the selection in your website


language_code
string
Defaults to he
(Transfer the language code that displayed in your page, by default will take the general setting of the page)

amount
number
required
Amount of the page

non_voucher_minimum_amount
integer
Defaults to 0
Minimum amount of required payment for Credit Card transactions (Apple Pay, Google Pay, Bit, PayPal)

currency_code
string
required
Defaults to ILS
Currency of the page

ILS
sendEmailApproval
boolean
required
Defaults to true
Send email for successful transaction


true
sendEmailFailure
boolean
required
Defaults to false
Send email for failed transaction


false
expiry_datetime
string
Defaults to 30
number, minutes until page expired (if sent we will use it instead of payment page settings)

refURL_success
string
Defaults to https://www.domain.com/success/
nullable (if sent we will use it instead of payment page settings)

refURL_failure
string
Defaults to https://www.domain.com/failure/
nullable (if sent we will use it instead of payment page settings)

refURL_cancel
string
Defaults to https://www.domain.com/cancel/
nullable (if sent we show "Return To Site" and linked to the url provided instead of payment page settings)

refURL_callback
string
Defaults to https://www.domain.com/callback/
nullable (if sent we will use it instead of payment page settings)

send_failure_callback
boolean
Defaults to false
(In case you would like to receive the callback also in failure transaction)


custom_invoice_name
string
Defaults to Customer Name
nullable (In case you have integrated invoice company you can decide if the invoice customer name will be different then the "customer_name" parameter in customer object)

create_token
boolean
Defaults to false
nullable (In case you have tokenization permission, you can decide if you would like to return the token of the customer for future charges)


initial_invoice
boolean
Defaults to true
nullable (In case you have invoice company and it's activated in your payment page, you can decide if for spesfic transaction invoice will be initial or not, to use default please don't send this parameter at all)


invoice_language
boolean
Defaults to false
nullable (In this field you can send the language of the invoice you would like us to send to your invoice company. In case this field will not be sent, language will be default setting)


paying_vat
boolean
Defaults to true
nullable (In case you would like that tax document will be include VAT or not included VAT, This parameter is not required)


hide_payments_field
boolean
Defaults to false
nullable (Option to hide payments field for foreign transactions that acquires are not supported)


payments
integer
Defaults to 5
nullable (if sent this will be the amount of installments for the payment)

payments_credit
boolean
Defaults to false
nullable (Option to make credit transaction, number of payments will be minimum 3 and maximum based on payments value)


payments_selected
integer
Defaults to 1
nullable (if sent then the number of the payments will be as selected in the payment page)

payments_first_amount
integer
Defaults to 5
nullable (Works only if sending "payments_selected" and payplus will calculated other installments. First installment amount can be changed due to other payments)

hide_identification_id
boolean
Defaults to false
nullable (Option to hide identification id field for foreign transactions)


send_customer_success_sms
boolean
Defaults to false
If SMS package purchased the system will notify your customer by SMS


customer_failure_sms
boolean
Defaults to false
If SMS package purchased the system will notify your customer by SMS


add_user_information
boolean
Defaults to false
In case you would like to control the customer details form


allowed_cards
array of strings
Defaults to mastercard,visa
In case you would like to proceed just specific card brands (ex. ["mastercard","visa"])


ADD string
allowed_bins
array of integers
In case you would like to proceed just specific BINs in the specific transaction (6 or 8 digits).


ADD integer
allowed_charge_methods
array of strings
Defaults to credit-card,google-pay
In case you would like to show specific payment methods options in the payment page (ex. ["credit-card","google-pay"])


ADD string
more_info
string
nullable (Additional Information)

more_info_2
string
nullable (Additional Information)

more_info_3
string
nullable (Additional Information)

more_info_4
string
nullable (Additional Information)

more_info_5
string
nullable (Additional Information)

create_hash
string
Defaults to false
nullable (Encrypt using Base64 the customer details object in the redirect back to your website and callback)

show_more_info
string
Defaults to false
nullable (Show general information of the more_info's on the payment page if they sent)

support_track2
boolean
Defaults to false
nullable (Support track2 in payment pages)


close_doc
string
In case you would like to close document in invoice+ by payment confirmation.

customer
object

customer object
items
array of objects
nullable if send in item "product_uid" we will use this product or send error, if send "name" and not "product_uid" we will create new product with this name. more option to send if ("name" && !product_uid): vat_type, barcode, value,price.last option we will use default product.


ADD object
recurring_settings
object
nullable To use this setting recurring payments should be turn on and charge_method value should be 3


recurring_settings object
secure3d
object
nullable To use default settings of the customer don't send this object, or if you would like to active or disable for this specific transaction


secure3d object
allowed_issuers
array of strings

ADD string
invoice_integration_uid
string
cashier_uid
string
Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Disable Payment Link Request
post
https://restapi.payplus.co.il/api/v1.0/PaymentPages/Disable/{page_request_uid}
Log in to see full request history
time	status	user agent	
Make a request to see history.

Path Params
page_request_uid
string
required
Payment Request UID you would like to disable

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

IPN
post
https://restapi.payplus.co.il/api/v1.0/PaymentPages/ipn
Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
payment_request_uid
string
required if transaction uid without value

transaction_uid
string
required if payment request uid without value.

related_transaction
boolean
by default false, to receive all the related transactions for every transaction send true


approval_num
string
Receive transaction by approval number, This number can be repeated in other previous of your transaction and therefore search by this field will draw the latest transaction

voucher_num
string
Receive transaction by approval number, This number can be repeated in other previous of your transaction and therefore search by this field will draw the latest transaction

more_info
string
Search by transaction more info in case you sent

IPN FULL
post
https://restapi.payplus.co.il/api/v1.0/PaymentPages/ipn-full
Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
payment_request_uid
string
required if transaction uid without value

transaction_uid
string
required if payment request uid without value.

related_transaction
boolean
by default false, to receive all the related transactions for every transaction send true


approval_num
string
Receive transaction by approval number, This number can be repeated in other previous of your transaction and therefore search by this field will draw the latest transaction

voucher_num
string
Receive transaction by approval number, This number can be repeated in other previous of your transaction and therefore search by this field will draw the latest transaction

more_info
string
Search by transaction more info in case you sent

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

Successful Redirect Response
get
https://restapi.payplus.co.il/api/v1.0/successful-redirect-response
To receive a callback with complete details of a successfully processed transaction when accessing the payment page (Generate payment link), you must enter the URL where you would like to receive all the return information in the refURL_success field.

Log in to see full request history
time	status	user agent	
Make a request to see history.

Response

200
Transaction details retrieved successfully.

Failure Redirect Response
get
https://restapi.payplus.co.il/api/v1.0/failure-redirect-response
Log in to see full request history
time	status	user agent	
Make a request to see history.

Response

ListGroup
get
https://restapi.payplus.co.il/api/v1.0/Coupons/ListGroup
Log in to see full request history
time	status	user agent	
Make a request to see history.

Add
post
https://restapi.payplus.co.il/api/v1.0/Cashiers/Add
The Add endpoint allows interaction with the Add resource.

Devices
Access the full guide by clicking here for step-by-step instructions on integrating the PayPlus API for executing transactions from external software to a PayPlus device, including parameter setup, callback configuration, and example requests.List
get
https://restapi.payplus.co.il/api/v1.0/Deposit/list
Log in to see full request history
time	status	user agent	
Make a request to see history.

Query Params
terminal_uid
string
required
Required Query variable. Example: 84aa6e4e-fe42-4d5f-b9cd-59dbc3817f10.

fromDate
string
required
Required Query variable. Example: 2020-01-01.

untilDate
string
required
Required Query variable. Example: 2020-12-12.

currency_code
string
Optional Query variable. Example: ILS.

deposit_uid
string
Optional Query variable. Example: 84aa6e4e-fe42-4d5f-b9cd-59dbc3817c34.

skip
string
Optional Query variable, From where you want to start take records.in this example you start from the first record Example: 0.

take
string
take required if skip have some value. max 500. default 25 This means that you want take 5 records. Example: 5.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

CreateContact
post
https://restapi.payplus.co.il/api/v1.0/SMS/CreateContact
Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
first_name
string
last_name
string
phone
string
required
Example: 9725346587912

customer_uid
string
birthday
string
Example: 24-02-1987

language_code
string
Example: HE

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

CreateGroup
post
https://restapi.payplus.co.il/api/v1.0/SMS/CreateGroup
Log in to see full request history
time	status	user agent	
Make a request to see history.

MessagesList
get
https://restapi.payplus.co.il/api/v1.0/SMS/MessagesList
Send OTP Through SMS
post
https://restapi.payplus.co.il/api/v1.0/Otp/Send
Log in to see full request history
time	status	user agent	
Make a request to see history.

Body Params
phone
string
required
The cellular number you would like to send OTP

content
string
required
sms_sender_uid
string
required
expiry_minutes
integer
The expiry minutes the code will expired.

length
integer
The length of the code you would like us to send, 6 is the default.

Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Create a new customer
post
https://restapi.payplus.co.il/api/v1.0/books/customers
Log in to see full request history
time	status	user agent	
Make a request to see history.

Submit new expense record/file
post
https://restapi.payplus.co.il/api/v1.0/expenses
Create a new expense record with a file attachment.

Create new document
post
https://restapi.payplus.co.il/api/v1.0/books/docs/new/{docType}
Path Params
docType
string
enum
required
Type of document to create


inv_tax_receipt

inv_tax_receipt

inv_tax

inv_receipt

inv_proforma

inv_refund

crt_delivery

crt_return

order_purchaseBody Params
doc_date
string
string Document issue date. Format: YYYY-MM-DD. Defaults to current da

brand_uuid
string
If multiple brands exist, specify brand uuid to create document associated with a specific brand. If none provided, the default brand

preview
boolean
Get a preview of the document. No document will be generated if set to true


hide_base_currency
boolean
Whether or not to hide the base currency (usually ILS) in a foreign currency document.


draft
boolean
Create a draft document. No actual document will be generated if set to true


more_info
string
nullable Optional identifier. Will appear at the bottom of the document

close_doc
string
UUID of a previously created document. If supplied, the new document will also close the document indicated by the UUID

cancel_doc
string
UUID of a previously created document. If supplied, the new document will also cancel the document indicated by the UUID

transaction_uuid
string
UUID of a PayPlus transaction

send_document_email
boolean
Send email upon document creation. Will override the whatever's defined in your account


send_document_sms
boolean
send_document_sms


callback_url
string
If valid url is specified, payplus will send a notification to the specified URL upon successful document creation

vatType
string
enum
If omitted, configuration values will be used instead


Allowed:

vat-type-included

vat-type-not-included

vat-type-exempt
vat_percentage
integer
Vat percentage to use for calculations. If omitted, configuration values will be used instead

language
string
enum

Allowed:

he

en
currency_code
string
conversion_rate
float
If document currency specified is not ILS, this value will be used as the conversion rate for all the prices into the base currency.

autocalculate_rate
boolean
If the conversion rate parameter is omitted, determine conversion rate automatically


prevent_email
boolean
If true, will not send


unique_identifier
string
Arbitrary, unique string. If supplied, the system will refuse further creation attempts if it finds a duplicate, ensuring that this value will always be unique per document.

customer
object

customer object
tags
array of strings
Array of arbitrary strings used to catalogue/ tag documents


ADD string
payments
array of objects

ADD object
totalAmount
integer
Total sum of the document.

items
array of objects

ADD object
Headers
api-key
string
required
API Key

secret-key
string
required
Secret Key

Responses

200
200


400
400

