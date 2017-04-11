---
title: Apple Pay on the Web
author: shane
layout: post
date: 2016-10-12
categories:
  - All Posts
  - Programming
tags:
  - javascript
  - payments
description: Don't miss out on a sale from iOS in your eCommerce store! Learn how to leverage Apple Pay on the web.
---

Apple Pay is an alternative payment scheme offering an easier and more conventient payment experience for customers with an applicable Apple device, offered in stores, in mobile apps, and now on the web.

Why is this important? Historically, Apple Pay has only been available in stores at point-of-sales with compatible credit card readers and in native iOS apps. If you were an eCommerce store owner without a custom native app, both of those Apple Pay options could have been out of your (and your customer's) reach. Now, with the power of Safari on iOS 10 and macOS Sierra, eCommerce store owners can now join in on the Apple Pay fun, giving their Apple-using customer base another checkout option.

Yet another checkout option? That cannot be good for conversion rates for reasons X, Y, and Z, right?

Not necessarily! For those merchants that are seeing a large percentage of Apple-based customers, this could improve conversion rates as Apple Pay can provide name, phone number, billing and shipping addresses, form of payment, email address, and selected shipping method even for guest checkouts.  Of course, this can vary from merchant to merchant based on their average customer, so make sure it is an appropriate step to take for you or your eCommerce client.

Ignoring the possible business decision that needs to be made, follow along for the technical implementation of Apple Pay on the web.

## Detailed environment setup

Apple hasn't really detailed the end-to-end use of Apple Pay on the web, but one documentated step is that of [configuring your environment](https://developer.apple.com/reference/applepayjs/). Here are the highlights:

- Apple developer account is required
- Server needs to force HTTPS over supported TLS 1.2 ciphers for all pages with Apple Pay
- Merchant ID and Merchant Identity Certificate (aka session certificate) are required to initiate the customer's Apple Pay session
- Payment Processing Certificate is required to decrypt the payment token supplied after the customer authorizes the transaction

During Apple's outlined process for generating everything you need, your payment form's domain will need to be verified. You will want your domain already pointed to your server environment with a valid SSL certificate. Pro tip: don't use a self-signed or Let's Encrypt certificate as Apple doesn't seem to trust those yet.

## Browser test

When it comes to Apple Pay, there is only one browser option for your customers: Safari 10. They will also need a mobile device handy that supports authorizing Apple Pay transactions (an iPhone Apple Watch with a secure element chip). You will want to feature check for Apple Pay:

> Create a button to trigger Apple Pay

```html
<button type="button" id="apple-pay" style="display:none;"></button>
```

> Test if Apple Pay is available in the browser

```javascript
if (window.ApplePaySession) {
  var merchantIdentifier = 'merchant.id';

  ApplePaySession
    .canMakePaymentsWithActiveCard(merchantIdentifier)
    .then(function (canMakePayments) {
      if (canMakePayments) {
        // ApplePay is possible on this browser and is currently activated.
        // Make the button visible!
        document.getElementById('apple-pay').style.display = 'block';
        return;
      }

      // ApplePay is possible on this browser but is not currently activated.
      // Make sure the button remains hidden!
    });
} else {
  // Make sure the button remains hidden!
}
```

`ApplePaySession.canMakePaymentsWithActiveCard` does what you might think given its name. It checks that the current client has Apple Pay capabilities and that the current user of that device has an active credit card configured. An alternative function is `ApplePaySession.canMakePayments` which only checks to see if the current client has Apple Pay capabilities. Both functions will return a promise that can be used to affect your Apple Pay button's visibility.



From here on out, we'll assume `ApplePaySession` is available.

## Styling

Everything in CSS should continue to work as it normally does. (This is HTML, after all!) The only unique bit is that the browser exposes a named Apple Pay brand image that can be used as a background image:

```css
#apple-pay {
  background-image: -webkit-named-image(apple-pay-logo-white);
  /* background-image: -webkit-named-image(apple-pay-logo-black); */
}
```

You should use this at all time to aid in brand recognition and customer brand recall.

## Data

```javascript
var subTotalDescr = 'Test Goodies';
var subTotal = 0.10;
var shippingOptions = [
  {
    label: 'Standard Shipping',
    amount: 0.10,
    detail: '3-5 days',
    identifier: 'domestic_std'
  },
  {
    label: 'Expedited Shipping',
    amount: 0.30,
    detail: '1-3 days',
    identifier: 'domestic_exp'
  }
];
var lineItems = [
  { label: subTotalDescr, amount: subTotal },
  { label: 'P&P', amount: shippingOptions[0].amount }
];
var paymentRequest = {
  currencyCode: 'USD',
  countryCode: 'US',
  requiredShippingContactFields: [ 'postalAddress' ],
  // requiredShippingContactFields: [ 'postalAddress','email', 'name', 'phone' ],
  // requiredBillingContactFields: [ 'postalAddress','email', 'name', 'phone' ],
  shippingMethods: shippingOptions,
  lineItems: lineItems,
  total: { label: 'My Test Shop', subTotal + shippingOptions[0].amount },
  supportedNetworks: [ 'amex', 'masterCard', 'visa', 'discover' ],
  merchantCapabilities: [ 'supports3DS', 'supportsEMV', 'supportsCredit', 'supportsDebit' ]
};
```

> Create a new `ApplePaySession` object

```javascript
var session = new ApplePaySession(1, paymentRequest);
```

> Add necessary event handlers

```javascript
// Merchant validation
session.onvalidatemerchant = function (event) {
  performValidation(event.validationURL)
    .then(function (merchantSession) {
      session.completeMerchantValidation(merchantSession);
    });
}

// User confirms payment with Touch ID
session.onpaymentauthorized = function (event) {
  // This is the first stage when you get the *full shipping address* of the
  // customer, in the event.payment.shippingContact object.

  sendPaymentToken(event.payment.token)
    .then(function (success) {
      var status;
      if (success) {
        status = ApplePaySession.STATUS_SUCCESS;
        document.getElementById('apple-pay').style.display = 'none';
        // Present success messaging to user
      } else {
        status = ApplePaySession.STATUS_FAILURE;
      }

      // This needs to be called to ensure the customer's interface doesn't hang
      session.completePayment(status);
    });
};
```

> Optional Apple Pay session callbacks

```javascript
// Shipping address selected
session.onshippingcontactselected = function (event) {
  // At this stage, Apple only reveals the country, cocality and 4 characters of the
  // postcode to protect the privacy of what is only a *prospective* customer at this
  // point. This is enough for you to determine shipping costs, but not the full
  // address of the customer.

  // session.completeShippingContactSelection(status, newShippingMethods, newTotal, newLineItems);
};

// Shipping method selected
session.onshippingmethodselected = function (event) {
  // session.completeShippingMethodSelection(status, newTotal, newLineItems);
};

// Payment method selected
session.onpaymentmethodselected = function (event) {
  // session.completePaymentMethodSelection(newTotal, newLineItems);
};

session.oncancel = function (event) { };
```

> Allow user interaction to kickstart Apple Pay

```javascript
document.getElementById('apple-pay').onclick = function (evt) {
  session.begin();
};
```

> Helper functions

```javascript
function sendPaymentToken(paymentToken) {
  return new Promise(function (resolve, reject) {
    // This is where you would pass the payment token to your third-party payment provider or
    // decrypt the token yourself to charge the card. Only if your provider tells you the payment
    // was successful should you return a resolve(true) here. Otherwise reject.

    if (debug === true) {
      resolve(true);
    } else {
      reject;
    }
  });
}

function performValidation(valURL) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var data = JSON.parse(this.responseText);
      resolve(data);
    };
    xhr.onerror = reject;
    xhr.open('GET', 'apple-pay-validation.php?u=' + encodeURIComponent(valURL));
    xhr.send();
  });
}
```

> Merchant validation script (`apple-pay-validation.php`)

```php
<?php

//update these with the real location of your two .pem files. keep them above/outside your website's root folder
define('PRODUCTION_CERTIFICATE_KEY', '/path/to/your/merchant.id.key.pem');
define('PRODUCTION_CERTIFICATE_PATH', '/path/to/your/merchant.id.crt.pem');

// This is the password you were asked to create in terminal when you extracted ApplePay.key.pem
define('PRODUCTION_CERTIFICATE_KEY_PASS', 'password');

define('PRODUCTION_MERCHANTIDENTIFIER', openssl_x509_parse(file_get_contents(PRODUCTION_CERTIFICATE_PATH))['subject']['UID']); //e.g. merchant.com.mydomain or merchant.com.mydomain.shop
define('PRODUCTION_DOMAINNAME', $_SERVER['HTTP_HOST']); //e.g. shop.mydomain.com or mydomain.com


$validation_url = $_GET['u'];

if ('https' == parse_url($validation_url, PHP_URL_SCHEME) &&
    substr(parse_url($validation_url, PHP_URL_HOST), -10) === '.apple.com') {

    // create a new cURL resource
    $ch = curl_init();

    $data = [
        'merchantIdentifier' => PRODUCTION_MERCHANTIDENTIFIER,
        'domainName' => PRODUCTION_DOMAINNAME,
        'displayName' => PRODUCTION_DISPLAYNAME,
    ];

    curl_setopt($ch, CURLOPT_URL, $validation_url);
    curl_setopt($ch, CURLOPT_SSLCERT, PRODUCTION_CERTIFICATE_PATH);
    curl_setopt($ch, CURLOPT_SSLKEY, PRODUCTION_CERTIFICATE_KEY);
    curl_setopt($ch, CURLOPT_SSLKEYPASSWD, PRODUCTION_CERTIFICATE_KEY_PASS);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    if (curl_exec($ch) === false) {
        echo json_encode([
            'curlError' => curl_error($ch),
        ]);
    }

    // close cURL resource, and free up system resources
    curl_close($ch);
}
```
