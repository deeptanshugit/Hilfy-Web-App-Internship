var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var firebase = require("firebase");
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const PDFDocument = require('pdfkit');
var schedule = require('node-schedule');
const rp = require('request-promise');


admin.initializeApp(functions.config().firebase);

var db = admin.firestore();
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDb7onj65ISpKs6vtt2h4agZcamVCurUPU",
    authDomain: "diet-calendar-b3d5a.firebaseapp.com",
    databaseURL: "https://diet-calendar-b3d5a.firebaseio.com",
    projectId: "diet-calendar-b3d5a",
    storageBucket: "diet-calendar-b3d5a.appspot.com",
    messagingSenderId: "357932927864"
};
firebase.initializeApp(config);

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'support@modernmonk.in',
        pass: 'ModernMonk@19'
    }
}));

async function send_sms(message, to) {
    //Old API: `http://bulksms.vision360solutions.in/api/sendhttp.php?authkey=50680AasqOBThBIp5c18fda7&mobiles=${to}&message=${message}&sender=MDMONK&route=4&country=0`
    await rp(`http://otpsms.vision360solutions.in/api/sendhttp.php?authkey=323530AZOj3fvU5e6f5395P1&mobiles=7376191262&message=${message}&sender=MDMONK&route=4&country=91`).then(sms_res => {
        console.info('success response from send_sms: ', sms_res);
    }).catch(sms_fail => {
        console.error('error message for send_sms: ', sms_fail);
    });
}


function mail_template_header() {
    return `
    <div style="
    max-width: 500px;
    margin: auto;">
        <center>
            <img width="100" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="">
        </center>

        <br>
    `;
}

function mail_template_book_vihara_class(name) {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!-->
<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml">
<!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width">
    <style type="text/css">
        @media only screen and (min-width: 620px) {
            .wrapper {
                min-width: 600px !important
            }

                .wrapper h1 {
                }

                .wrapper h1 {
                    font-size: 44px !important;
                    line-height: 50px !important
                }

                .wrapper h2 {
                }

                .wrapper h2 {
                    font-size: 64px !important;
                    line-height: 63px !important
                }

                .wrapper h3 {
                }

                .wrapper h3 {
                    font-size: 26px !important;
                    line-height: 34px !important
                }

            .column {
            }

            .column {
                font-size: 18px !important;
                line-height: 26px !important
            }

            .wrapper .size-8 {
                font-size: 8px !important;
                line-height: 14px !important
            }

            .wrapper .size-9 {
                font-size: 9px !important;
                line-height: 16px !important
            }

            .wrapper .size-10 {
                font-size: 10px !important;
                line-height: 18px !important
            }

            .wrapper .size-11 {
                font-size: 11px !important;
                line-height: 19px !important
            }

            .wrapper .size-12 {
                font-size: 12px !important;
                line-height: 19px !important
            }

            .wrapper .size-13 {
                font-size: 13px !important;
                line-height: 21px !important
            }

            .wrapper .size-14 {
                font-size: 14px !important;
                line-height: 21px !important
            }

            .wrapper
            .size-15 {
                font-size: 15px !important;
                line-height: 23px !important
            }

            .wrapper .size-16 {
                font-size: 16px !important;
                line-height: 24px !important
            }

            .wrapper .size-17 {
                font-size: 17px !important;
                line-height: 26px !important
            }

            .wrapper .size-18 {
                font-size: 18px !important;
                line-height: 26px !important
            }

            .wrapper .size-20 {
                font-size: 20px !important;
                line-height: 28px !important
            }

            .wrapper .size-22 {
                font-size: 22px !important;
                line-height: 31px !important
            }

            .wrapper .size-24 {
                font-size: 24px !important;
                line-height: 32px !important
            }

            .wrapper .size-26 {
                font-size: 26px !important;
                line-height: 34px !important
            }

            .wrapper .size-28 {
                font-size: 28px !important;
                line-height: 36px !important
            }

            .wrapper .size-30 {
                font-size: 30px !important;
                line-height: 38px !important
            }

            .wrapper .size-32 {
                font-size: 32px !important;
                line-height: 40px !important
            }

            .wrapper .size-34 {
                font-size: 34px !important;
                line-height: 43px !important
            }

            .wrapper .size-36 {
                font-size: 36px !important;
                line-height: 43px !important
            }

            .wrapper .size-40 {
                font-size: 40px !important;
                line-height: 47px !important
            }

            .wrapper .size-44 {
                font-size: 44px !important;
                line-height: 50px !important
            }

            .wrapper .size-48 {
                font-size: 48px !important;
                line-height: 54px !important
            }

            .wrapper .size-56 {
                font-size: 56px !important;
                line-height: 60px !important
            }

            .wrapper .size-64 {
                font-size: 64px !important;
                line-height: 63px !important
            }
        }
    </style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            table-layout: fixed;
        }

        * {
            line-height: inherit;
        }

        [x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
        }

        .wrapper .footer__share-button a:hover,
        .wrapper .footer__share-button a:focus {
            color: #ffffff !important;
        }

        .btn a:hover,
        .btn a:focus,
        .footer__share-button a:hover,
        .footer__share-button a:focus,
        .email-footer__links a:hover,
        .email-footer__links a:focus {
            opacity: 0.8;
        }

        .preheader,
        .header,
        .layout,
        .column {
            transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
        }

            .preheader td {
                padding-bottom: 8px;
            }

        .layout,
        div.header {
            max-width: 400px !important;
            -fallback-width: 95% !important;
            width: calc(100% - 20px) !important;
        }

        div.preheader {
            max-width: 360px !important;
            -fallback-width: 90% !important;
            width: calc(100% - 60px) !important;
        }

        .snippet,
        .webversion {
            Float: none !important;
        }

        .stack .column {
            max-width: 400px !important;
            width: 100% !important;
        }

        .fixed-width.has-border {
            max-width: 402px !important;
        }

            .fixed-width.has-border .layout__inner {
                box-sizing: border-box;
            }

        .snippet,
        .webversion {
            width: 50% !important;
        }

        .ie .btn {
            width: 100%;
        }

        .ie .stack .column,
        .ie .stack .gutter {
            display: table-cell;
            float: none !important;
        }

        .ie div.preheader,
        .ie .email-footer {
            max-width: 560px !important;
            width: 560px !important;
        }

        .ie .snippet,
        .ie .webversion {
            width: 280px !important;
        }

        .ie div.header,
        .ie .layout {
            max-width: 600px !important;
            width: 600px !important;
        }

        .ie .two-col .column {
            max-width: 300px !important;
            width: 300px !important;
        }

        .ie .three-col .column,
        .ie .narrow {
            max-width: 200px !important;
            width: 200px !important;
        }

        .ie .wide {
            width: 400px !important;
        }

        .ie .stack.fixed-width.has-border,
        .ie .stack.has-gutter.has-border {
            max-width: 602px !important;
            width: 602px !important;
        }

        .ie .stack.two-col.has-gutter .column {
            max-width: 290px !important;
            width: 290px !important;
        }

        .ie .stack.three-col.has-gutter .column,
        .ie .stack.has-gutter .narrow {
            max-width: 188px !important;
            width: 188px !important;
        }

        .ie .stack.has-gutter .wide {
            max-width: 394px !important;
            width: 394px !important;
        }

        .ie .stack.two-col.has-gutter.has-border .column {
            max-width: 292px !important;
            width: 292px !important;
        }

        .ie .stack.three-col.has-gutter.has-border .column,
        .ie .stack.has-gutter.has-border .narrow {
            max-width: 190px !important;
            width: 190px !important;
        }

        .ie .stack.has-gutter.has-border .wide {
            max-width: 396px !important;
            width: 396px !important;
        }

        .ie .fixed-width .layout__inner {
            border-left: 0 none white !important;
            border-right: 0 none white !important;
        }

        .ie .layout__edges {
            display: none;
        }

        .mso .layout__edges {
            font-size: 0;
        }

        .layout-fixed-width,
        .mso .layout-full-width {
            background-color: #ffffff;
        }

        @media only screen and (min-width: 620px) {
            .column,
            .gutter {
                display: table-cell;
                Float: none !important;
                vertical-align: top;
            }

            div.preheader,
            .email-footer {
                max-width: 560px !important;
                width: 560px !important;
            }

            .snippet,
            .webversion {
                width: 280px !important;
            }

            div.header,
            .layout,
            .one-col .column {
                max-width: 600px !important;
                width: 600px !important;
            }

            .fixed-width.has-border,
            .fixed-width.x_has-border,
            .has-gutter.has-border,
            .has-gutter.x_has-border {
                max-width: 602px !important;
                width: 602px !important;
            }

            .two-col .column {
                max-width: 300px !important;
                width: 300px !important;
            }

            .three-col .column,
            .column.narrow,
            .column.x_narrow {
                max-width: 200px !important;
                width: 200px !important;
            }

            .column.wide,
            .column.x_wide {
                width: 400px !important;
            }

            .two-col.has-gutter .column,
            .two-col.x_has-gutter .column {
                max-width: 290px !important;
                width: 290px !important;
            }

            .three-col.has-gutter .column,
            .three-col.x_has-gutter .column,
            .has-gutter .narrow {
                max-width: 188px !important;
                width: 188px !important;
            }

            .has-gutter .wide {
                max-width: 394px !important;
                width: 394px !important;
            }

            .two-col.has-gutter.has-border .column,
            .two-col.x_has-gutter.x_has-border .column {
                max-width: 292px !important;
                width: 292px !important;
            }

            .three-col.has-gutter.has-border .column,
            .three-col.x_has-gutter.x_has-border .column,
            .has-gutter.has-border .narrow,
            .has-gutter.x_has-border .narrow {
                max-width: 190px !important;
                width: 190px !important;
            }

            .has-gutter.has-border .wide,
            .has-gutter.x_has-border .wide {
                max-width: 396px !important;
                width: 396px !important;
            }
        }

        @supports (display: flex) {
            @media only screen and (min-width: 620px) {
                .fixed-width.has-border .layout__inner {
                    display: flex !important;
                }
            }
        }

        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
            .fblike {
                background-image: url(https://i7.createsend1.com/static/eb/beta/13-the-blueprint-3/images/fblike@2x.png) !important;
            }

            .tweet {
                background-image: url(https://i8.createsend1.com/static/eb/beta/13-the-blueprint-3/images/tweet@2x.png) !important;
            }

            .linkedinshare {
                background-image: url(https://i10.createsend1.com/static/eb/beta/13-the-blueprint-3/images/lishare@2x.png) !important;
            }

            .forwardtoafriend {
                background-image: url(https://i9.createsend1.com/static/eb/beta/13-the-blueprint-3/images/forward@2x.png) !important;
            }
        }

        @media (max-width: 321px) {
            .fixed-width.has-border .layout__inner {
                border-width: 1px 0 !important;
            }

            .layout,
            .stack .column {
                min-width: 320px !important;
                width: 320px !important;
            }

            .border {
                display: none;
            }

            .has-gutter .border {
                display: table-cell;
            }
        }

        .mso div {
            border: 0 none white !important;
        }

        .mso .w560 .divider {
            Margin-left: 260px !important;
            Margin-right: 260px !important;
        }

        .mso .w360 .divider {
            Margin-left: 160px !important;
            Margin-right: 160px !important;
        }

        .mso .w260 .divider {
            Margin-left: 110px !important;
            Margin-right: 110px !important;
        }

        .mso .w160 .divider {
            Margin-left: 60px !important;
            Margin-right: 60px !important;
        }

        .mso .w354 .divider {
            Margin-left: 157px !important;
            Margin-right: 157px !important;
        }

        .mso .w250 .divider {
            Margin-left: 105px !important;
            Margin-right: 105px !important;
        }

        .mso .w148 .divider {
            Margin-left: 54px !important;
            Margin-right: 54px !important;
        }

        .mso .size-8,
        .ie .size-8 {
            font-size: 8px !important;
            line-height: 14px !important;
        }

        .mso .size-9,
        .ie .size-9 {
            font-size: 9px !important;
            line-height: 16px !important;
        }

        .mso .size-10,
        .ie .size-10 {
            font-size: 10px !important;
            line-height: 18px !important;
        }

        .mso .size-11,
        .ie .size-11 {
            font-size: 11px !important;
            line-height: 19px !important;
        }

        .mso .size-12,
        .ie .size-12 {
            font-size: 12px !important;
            line-height: 19px !important;
        }

        .mso .size-13,
        .ie .size-13 {
            font-size: 13px !important;
            line-height: 21px !important;
        }

        .mso .size-14,
        .ie .size-14 {
            font-size: 14px !important;
            line-height: 21px !important;
        }

        .mso .size-15,
        .ie .size-15 {
            font-size: 15px !important;
            line-height: 23px !important;
        }

        .mso .size-16,
        .ie .size-16 {
            font-size: 16px !important;
            line-height: 24px !important;
        }

        .mso .size-17,
        .ie .size-17 {
            font-size: 17px !important;
            line-height: 26px !important;
        }

        .mso .size-18,
        .ie .size-18 {
            font-size: 18px !important;
            line-height: 26px !important;
        }

        .mso .size-20,
        .ie .size-20 {
            font-size: 20px !important;
            line-height: 28px !important;
        }

        .mso .size-22,
        .ie .size-22 {
            font-size: 22px !important;
            line-height: 31px !important;
        }

        .mso .size-24,
        .ie .size-24 {
            font-size: 24px !important;
            line-height: 32px !important;
        }

        .mso .size-26,
        .ie .size-26 {
            font-size: 26px !important;
            line-height: 34px !important;
        }

        .mso .size-28,
        .ie .size-28 {
            font-size: 28px !important;
            line-height: 36px !important;
        }

        .mso .size-30,
        .ie .size-30 {
            font-size: 30px !important;
            line-height: 38px !important;
        }

        .mso .size-32,
        .ie .size-32 {
            font-size: 32px !important;
            line-height: 40px !important;
        }

        .mso .size-34,
        .ie .size-34 {
            font-size: 34px !important;
            line-height: 43px !important;
        }

        .mso .size-36,
        .ie .size-36 {
            font-size: 36px !important;
            line-height: 43px !important;
        }

        .mso .size-40,
        .ie .size-40 {
            font-size: 40px !important;
            line-height: 47px !important;
        }

        .mso .size-44,
        .ie .size-44 {
            font-size: 44px !important;
            line-height: 50px !important;
        }

        .mso .size-48,
        .ie .size-48 {
            font-size: 48px !important;
            line-height: 54px !important;
        }

        .mso .size-56,
        .ie .size-56 {
            font-size: 56px !important;
            line-height: 60px !important;
        }

        .mso .size-64,
        .ie .size-64 {
            font-size: 64px !important;
            line-height: 63px !important;
        }
    </style>

    <!--[if !mso]><!-->
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic);
    </style>
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic" rel="stylesheet" type="text/css"><!--<![endif]-->
    <style type="text/css">
        body {
            background-color: #fff
        }

        .logo a:hover, .logo a:focus {
            color: #1e2e3b !important
        }

        .mso .layout-has-border {
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc
        }

        .mso .layout-has-bottom-border {
            border-bottom: 1px solid #ccc
        }

        .mso .border, .ie .border {
            background-color: #ccc
        }

        .mso h1, .ie h1 {
        }

        .mso h1, .ie h1 {
            font-size: 44px !important;
            line-height: 50px !important
        }

        .mso h2, .ie h2 {
        }

        .mso h2, .ie h2 {
            font-size: 64px !important;
            line-height: 63px !important
        }

        .mso h3, .ie h3 {
        }

        .mso h3, .ie h3 {
            font-size: 26px !important;
            line-height: 34px !important
        }

        .mso .layout__inner, .ie .layout__inner {
        }

        .mso .layout__inner, .ie .layout__inner {
            font-size: 18px !important;
            line-height: 26px !important
        }

        .mso .footer__share-button p {
        }

        .mso .footer__share-button p {
            font-family: Roboto,Tahoma,sans-serif
        }
    </style>
    <meta name="robots" content="noindex,nofollow"></meta>
    <meta property="og:title" content="PCOS - Consultation booked"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
<body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
    <!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation">
        <tbody>
            <tr>
                <td>
                    <div role="banner">
                        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
                            <div style="border-collapse: collapse;display: table;width: 100%;">
                                <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
                                <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #999;font-family: Roboto,Tahoma,sans-serif;">

                                </div>
                                <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
                                <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #999;font-family: Roboto,Tahoma,sans-serif;">
                                    <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #999;" href="https://modernmonk.createsend1.com/t/t-e-ndylylt-l-n/">Click here</a></p>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </div>
                        </div>
                        <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
                            <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
                            <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
                                <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 160px;" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="Modern Monk" width="160"></div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                        </div>
                    </div>
                    <div>
                        <div style="background-color: #f6f4f0;background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
                                            <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_108res_ms_05-9900000000079e3c.png">
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #f6f4f0;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                                                <h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #673147;font-size: 34px;line-height: 43px;font-family: Playfair Display,Didot,Bodoni MT,Times New Roman,serif;"><em><strong>Your Vihara Class will be booked shortly...</strong></em></h1>
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #673147;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 29px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                                                <p style="Margin-top: 0;Margin-bottom: 0;">Dear ${name},</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thank you for booking a demo Vihara Class. We will soon get in touch with you to help find you a class that suits your timings.</p><p style="Margin-top: 20px;Margin-bottom: 20px;">But just in case you want to reach us earlier, please feel free to do so.</p>
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 13px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: center;">
                                                <![if !mso]><a style="border-radius: 0;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #333333 !important;background-color: #f6f4f0;font-family: Roboto, Tahoma, sans-serif;" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20to%20know%20more%20about%20Vihara.">WhatsApp Us</a><![endif]>
                                                <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:rect xmlns:v="urn:schemas-microsoft-com:vml" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20to%20know%20more%20about%20Vihara." style="width:132px" fillcolor="#F6F4F0" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,12px,0px,12px"><center style="font-size:14px;line-height:24px;color:#333333;font-family:Roboto,Tahoma,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">WhatsApp Us</center></v:textbox></v:rect><![endif]-->
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                                                <p style="Margin-top: 0;Margin-bottom: 0;">In the meantime, join our <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #f6f4f0;" href="https://www.facebook.com/groups/modernmonk/">Facebook Community</a>&nbsp;to get free advice from experts on all your health and wellness related queries anytime.</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thanks,</p><p style="Margin-top: 20px;Margin-bottom: 20px;">Modern Monk</p>
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 3px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #673147;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
                                            <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i2.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_108res_ms_1322-9900000000079e3c.png">
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>


                        <div role="contentinfo">
                            <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
                                    <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                                            <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links>
                                                <tbody>
                                                    <tr role="navigation">
                                                        <td style="padding: 0;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
                                                                <img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
                                                                <img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
                                                                <img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
                                                                <img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
                                                                <img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
                                                                <img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                                                <div>Modern Monk Healthcare Pvt Ltd</div>
                                            </div>
                                            <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">

                                            </div>
                                            <!--[if mso]>&nbsp;<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
                                    <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">

                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                </div>
                            </div>
                            <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;">
                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                                            <div style="font-size: 12px;line-height: 19px;">

                                            </div>
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="line-height:40px;font-size:40px;">&nbsp;</div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
    <script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
    <script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body>
</html>`;
}

function mail_template_stay_at_home(name) {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!-->
<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml">
<!--<![endif]-->
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width">
    <style type="text/css">
        @media only screen and (min-width: 620px) {
            .wrapper {
                min-width: 600px !important
            }

                .wrapper h1 {
                }

                .wrapper h1 {
                    font-size: 44px !important;
                    line-height: 50px !important
                }

                .wrapper h2 {
                }

                .wrapper h2 {
                    font-size: 64px !important;
                    line-height: 63px !important
                }

                .wrapper h3 {
                }

                .wrapper h3 {
                    font-size: 26px !important;
                    line-height: 34px !important
                }

            .column {
            }

            .column {
                font-size: 18px !important;
                line-height: 26px !important
            }

            .wrapper .size-8 {
                font-size: 8px !important;
                line-height: 14px !important
            }

            .wrapper .size-9 {
                font-size: 9px !important;
                line-height: 16px !important
            }

            .wrapper .size-10 {
                font-size: 10px !important;
                line-height: 18px !important
            }

            .wrapper .size-11 {
                font-size: 11px !important;
                line-height: 19px !important
            }

            .wrapper .size-12 {
                font-size: 12px !important;
                line-height: 19px !important
            }

            .wrapper .size-13 {
                font-size: 13px !important;
                line-height: 21px !important
            }

            .wrapper .size-14 {
                font-size: 14px !important;
                line-height: 21px !important
            }

            .wrapper
            .size-15 {
                font-size: 15px !important;
                line-height: 23px !important
            }

            .wrapper .size-16 {
                font-size: 16px !important;
                line-height: 24px !important
            }

            .wrapper .size-17 {
                font-size: 17px !important;
                line-height: 26px !important
            }

            .wrapper .size-18 {
                font-size: 18px !important;
                line-height: 26px !important
            }

            .wrapper .size-20 {
                font-size: 20px !important;
                line-height: 28px !important
            }

            .wrapper .size-22 {
                font-size: 22px !important;
                line-height: 31px !important
            }

            .wrapper .size-24 {
                font-size: 24px !important;
                line-height: 32px !important
            }

            .wrapper .size-26 {
                font-size: 26px !important;
                line-height: 34px !important
            }

            .wrapper .size-28 {
                font-size: 28px !important;
                line-height: 36px !important
            }

            .wrapper .size-30 {
                font-size: 30px !important;
                line-height: 38px !important
            }

            .wrapper .size-32 {
                font-size: 32px !important;
                line-height: 40px !important
            }

            .wrapper .size-34 {
                font-size: 34px !important;
                line-height: 43px !important
            }

            .wrapper .size-36 {
                font-size: 36px !important;
                line-height: 43px !important
            }

            .wrapper .size-40 {
                font-size: 40px !important;
                line-height: 47px !important
            }

            .wrapper .size-44 {
                font-size: 44px !important;
                line-height: 50px !important
            }

            .wrapper .size-48 {
                font-size: 48px !important;
                line-height: 54px !important
            }

            .wrapper .size-56 {
                font-size: 56px !important;
                line-height: 60px !important
            }

            .wrapper .size-64 {
                font-size: 64px !important;
                line-height: 63px !important
            }
        }
    </style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            table-layout: fixed;
        }

        * {
            line-height: inherit;
        }

        [x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
        }

        .wrapper .footer__share-button a:hover,
        .wrapper .footer__share-button a:focus {
            color: #ffffff !important;
        }

        .btn a:hover,
        .btn a:focus,
        .footer__share-button a:hover,
        .footer__share-button a:focus,
        .email-footer__links a:hover,
        .email-footer__links a:focus {
            opacity: 0.8;
        }

        .preheader,
        .header,
        .layout,
        .column {
            transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
        }

            .preheader td {
                padding-bottom: 8px;
            }

        .layout,
        div.header {
            max-width: 400px !important;
            -fallback-width: 95% !important;
            width: calc(100% - 20px) !important;
        }

        div.preheader {
            max-width: 360px !important;
            -fallback-width: 90% !important;
            width: calc(100% - 60px) !important;
        }

        .snippet,
        .webversion {
            Float: none !important;
        }

        .stack .column {
            max-width: 400px !important;
            width: 100% !important;
        }

        .fixed-width.has-border {
            max-width: 402px !important;
        }

            .fixed-width.has-border .layout__inner {
                box-sizing: border-box;
            }

        .snippet,
        .webversion {
            width: 50% !important;
        }

        .ie .btn {
            width: 100%;
        }

        .ie .stack .column,
        .ie .stack .gutter {
            display: table-cell;
            float: none !important;
        }

        .ie div.preheader,
        .ie .email-footer {
            max-width: 560px !important;
            width: 560px !important;
        }

        .ie .snippet,
        .ie .webversion {
            width: 280px !important;
        }

        .ie div.header,
        .ie .layout {
            max-width: 600px !important;
            width: 600px !important;
        }

        .ie .two-col .column {
            max-width: 300px !important;
            width: 300px !important;
        }

        .ie .three-col .column,
        .ie .narrow {
            max-width: 200px !important;
            width: 200px !important;
        }

        .ie .wide {
            width: 400px !important;
        }

        .ie .stack.fixed-width.has-border,
        .ie .stack.has-gutter.has-border {
            max-width: 602px !important;
            width: 602px !important;
        }

        .ie .stack.two-col.has-gutter .column {
            max-width: 290px !important;
            width: 290px !important;
        }

        .ie .stack.three-col.has-gutter .column,
        .ie .stack.has-gutter .narrow {
            max-width: 188px !important;
            width: 188px !important;
        }

        .ie .stack.has-gutter .wide {
            max-width: 394px !important;
            width: 394px !important;
        }

        .ie .stack.two-col.has-gutter.has-border .column {
            max-width: 292px !important;
            width: 292px !important;
        }

        .ie .stack.three-col.has-gutter.has-border .column,
        .ie .stack.has-gutter.has-border .narrow {
            max-width: 190px !important;
            width: 190px !important;
        }

        .ie .stack.has-gutter.has-border .wide {
            max-width: 396px !important;
            width: 396px !important;
        }

        .ie .fixed-width .layout__inner {
            border-left: 0 none white !important;
            border-right: 0 none white !important;
        }

        .ie .layout__edges {
            display: none;
        }

        .mso .layout__edges {
            font-size: 0;
        }

        .layout-fixed-width,
        .mso .layout-full-width {
            background-color: #ffffff;
        }

        @media only screen and (min-width: 620px) {
            .column,
            .gutter {
                display: table-cell;
                Float: none !important;
                vertical-align: top;
            }

            div.preheader,
            .email-footer {
                max-width: 560px !important;
                width: 560px !important;
            }

            .snippet,
            .webversion {
                width: 280px !important;
            }

            div.header,
            .layout,
            .one-col .column {
                max-width: 600px !important;
                width: 600px !important;
            }

            .fixed-width.has-border,
            .fixed-width.x_has-border,
            .has-gutter.has-border,
            .has-gutter.x_has-border {
                max-width: 602px !important;
                width: 602px !important;
            }

            .two-col .column {
                max-width: 300px !important;
                width: 300px !important;
            }

            .three-col .column,
            .column.narrow,
            .column.x_narrow {
                max-width: 200px !important;
                width: 200px !important;
            }

            .column.wide,
            .column.x_wide {
                width: 400px !important;
            }

            .two-col.has-gutter .column,
            .two-col.x_has-gutter .column {
                max-width: 290px !important;
                width: 290px !important;
            }

            .three-col.has-gutter .column,
            .three-col.x_has-gutter .column,
            .has-gutter .narrow {
                max-width: 188px !important;
                width: 188px !important;
            }

            .has-gutter .wide {
                max-width: 394px !important;
                width: 394px !important;
            }

            .two-col.has-gutter.has-border .column,
            .two-col.x_has-gutter.x_has-border .column {
                max-width: 292px !important;
                width: 292px !important;
            }

            .three-col.has-gutter.has-border .column,
            .three-col.x_has-gutter.x_has-border .column,
            .has-gutter.has-border .narrow,
            .has-gutter.x_has-border .narrow {
                max-width: 190px !important;
                width: 190px !important;
            }

            .has-gutter.has-border .wide,
            .has-gutter.x_has-border .wide {
                max-width: 396px !important;
                width: 396px !important;
            }
        }

        @supports (display: flex) {
            @media only screen and (min-width: 620px) {
                .fixed-width.has-border .layout__inner {
                    display: flex !important;
                }
            }
        }

        @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
            .fblike {
                background-image: url(https://i7.createsend1.com/static/eb/beta/13-the-blueprint-3/images/fblike@2x.png) !important;
            }

            .tweet {
                background-image: url(https://i8.createsend1.com/static/eb/beta/13-the-blueprint-3/images/tweet@2x.png) !important;
            }

            .linkedinshare {
                background-image: url(https://i10.createsend1.com/static/eb/beta/13-the-blueprint-3/images/lishare@2x.png) !important;
            }

            .forwardtoafriend {
                background-image: url(https://i9.createsend1.com/static/eb/beta/13-the-blueprint-3/images/forward@2x.png) !important;
            }
        }

        @media (max-width: 321px) {
            .fixed-width.has-border .layout__inner {
                border-width: 1px 0 !important;
            }

            .layout,
            .stack .column {
                min-width: 320px !important;
                width: 320px !important;
            }

            .border {
                display: none;
            }

            .has-gutter .border {
                display: table-cell;
            }
        }

        .mso div {
            border: 0 none white !important;
        }

        .mso .w560 .divider {
            Margin-left: 260px !important;
            Margin-right: 260px !important;
        }

        .mso .w360 .divider {
            Margin-left: 160px !important;
            Margin-right: 160px !important;
        }

        .mso .w260 .divider {
            Margin-left: 110px !important;
            Margin-right: 110px !important;
        }

        .mso .w160 .divider {
            Margin-left: 60px !important;
            Margin-right: 60px !important;
        }

        .mso .w354 .divider {
            Margin-left: 157px !important;
            Margin-right: 157px !important;
        }

        .mso .w250 .divider {
            Margin-left: 105px !important;
            Margin-right: 105px !important;
        }

        .mso .w148 .divider {
            Margin-left: 54px !important;
            Margin-right: 54px !important;
        }

        .mso .size-8,
        .ie .size-8 {
            font-size: 8px !important;
            line-height: 14px !important;
        }

        .mso .size-9,
        .ie .size-9 {
            font-size: 9px !important;
            line-height: 16px !important;
        }

        .mso .size-10,
        .ie .size-10 {
            font-size: 10px !important;
            line-height: 18px !important;
        }

        .mso .size-11,
        .ie .size-11 {
            font-size: 11px !important;
            line-height: 19px !important;
        }

        .mso .size-12,
        .ie .size-12 {
            font-size: 12px !important;
            line-height: 19px !important;
        }

        .mso .size-13,
        .ie .size-13 {
            font-size: 13px !important;
            line-height: 21px !important;
        }

        .mso .size-14,
        .ie .size-14 {
            font-size: 14px !important;
            line-height: 21px !important;
        }

        .mso .size-15,
        .ie .size-15 {
            font-size: 15px !important;
            line-height: 23px !important;
        }

        .mso .size-16,
        .ie .size-16 {
            font-size: 16px !important;
            line-height: 24px !important;
        }

        .mso .size-17,
        .ie .size-17 {
            font-size: 17px !important;
            line-height: 26px !important;
        }

        .mso .size-18,
        .ie .size-18 {
            font-size: 18px !important;
            line-height: 26px !important;
        }

        .mso .size-20,
        .ie .size-20 {
            font-size: 20px !important;
            line-height: 28px !important;
        }

        .mso .size-22,
        .ie .size-22 {
            font-size: 22px !important;
            line-height: 31px !important;
        }

        .mso .size-24,
        .ie .size-24 {
            font-size: 24px !important;
            line-height: 32px !important;
        }

        .mso .size-26,
        .ie .size-26 {
            font-size: 26px !important;
            line-height: 34px !important;
        }

        .mso .size-28,
        .ie .size-28 {
            font-size: 28px !important;
            line-height: 36px !important;
        }

        .mso .size-30,
        .ie .size-30 {
            font-size: 30px !important;
            line-height: 38px !important;
        }

        .mso .size-32,
        .ie .size-32 {
            font-size: 32px !important;
            line-height: 40px !important;
        }

        .mso .size-34,
        .ie .size-34 {
            font-size: 34px !important;
            line-height: 43px !important;
        }

        .mso .size-36,
        .ie .size-36 {
            font-size: 36px !important;
            line-height: 43px !important;
        }

        .mso .size-40,
        .ie .size-40 {
            font-size: 40px !important;
            line-height: 47px !important;
        }

        .mso .size-44,
        .ie .size-44 {
            font-size: 44px !important;
            line-height: 50px !important;
        }

        .mso .size-48,
        .ie .size-48 {
            font-size: 48px !important;
            line-height: 54px !important;
        }

        .mso .size-56,
        .ie .size-56 {
            font-size: 56px !important;
            line-height: 60px !important;
        }

        .mso .size-64,
        .ie .size-64 {
            font-size: 64px !important;
            line-height: 63px !important;
        }
    </style>

    <!--[if !mso]><!-->
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic);
    </style>
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic" rel="stylesheet" type="text/css"><!--<![endif]-->
    <style type="text/css">
        body {
            background-color: #fff
        }

        .logo a:hover, .logo a:focus {
            color: #1e2e3b !important
        }

        .mso .layout-has-border {
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc
        }

        .mso .layout-has-bottom-border {
            border-bottom: 1px solid #ccc
        }

        .mso .border, .ie .border {
            background-color: #ccc
        }

        .mso h1, .ie h1 {
        }

        .mso h1, .ie h1 {
            font-size: 44px !important;
            line-height: 50px !important
        }

        .mso h2, .ie h2 {
        }

        .mso h2, .ie h2 {
            font-size: 64px !important;
            line-height: 63px !important
        }

        .mso h3, .ie h3 {
        }

        .mso h3, .ie h3 {
            font-size: 26px !important;
            line-height: 34px !important
        }

        .mso .layout__inner, .ie .layout__inner {
        }

        .mso .layout__inner, .ie .layout__inner {
            font-size: 18px !important;
            line-height: 26px !important
        }

        .mso .footer__share-button p {
        }

        .mso .footer__share-button p {
            font-family: Roboto,Tahoma,sans-serif
        }
    </style>
    <meta name="robots" content="noindex,nofollow"></meta>
    <meta property="og:title" content="PCOS - Consultation booked"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
<body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
    <!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation">
        <tbody>
            <tr>
                <td>
                    <div role="banner">
                        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
                            <div style="border-collapse: collapse;display: table;width: 100%;">
                                <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
                                <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #999;font-family: Roboto,Tahoma,sans-serif;">

                                </div>
                                <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
                                <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #999;font-family: Roboto,Tahoma,sans-serif;">
                                    <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #999;" href="https://modernmonk.createsend1.com/t/t-e-ndylylt-l-n/">Click here</a></p>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </div>
                        </div>
                        <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
                            <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
                            <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
                                <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 160px;" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="Modern Monk" width="160"></div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                        </div>
                    </div>
                    <div>
                        <div style="background-color: #f6f4f0;background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
                                            <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_108res_ms_05-9900000000079e3c.png">
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #f6f4f0;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                                                <h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #673147;font-size: 34px;line-height: 43px;font-family: Playfair Display,Didot,Bodoni MT,Times New Roman,serif;"><em><strong>Your Consultation is booked...</strong></em></h1>
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #673147;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 29px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                                                <p style="Margin-top: 0;Margin-bottom: 0;">Dear ${name},</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thank you for booking a consultation with us. We will soon get in touch with you.</p><p style="Margin-top: 20px;Margin-bottom: 20px;">But just in case you want to reach us earlier, please feel free to do so.</p>
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 13px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: center;">
                                                <![if !mso]><a style="border-radius: 0;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #333333 !important;background-color: #f6f4f0;font-family: Roboto, Tahoma, sans-serif;" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20to%20know%20more%20about%20the%20Stay-At-Home%20Immunity%20Program.">WhatsApp Us</a><![endif]>
                                                <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:rect xmlns:v="urn:schemas-microsoft-com:vml" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20to%20know%20more%20about%20the%20Stay-At-Home%20Immunity%20Program." style="width:132px" fillcolor="#F6F4F0" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,12px,0px,12px"><center style="font-size:14px;line-height:24px;color:#333333;font-family:Roboto,Tahoma,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">WhatsApp Us</center></v:textbox></v:rect><![endif]-->
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;">
                                            <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
                                                <p style="Margin-top: 0;Margin-bottom: 0;">In the meantime, join our <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #f6f4f0;" href="https://www.facebook.com/groups/modernmonk/">Facebook Community</a>&nbsp;to get free advice from experts on all your health and wellness related queries anytime.</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thanks,</p><p style="Margin-top: 20px;Margin-bottom: 20px;">Modern Monk</p>
                                            </div>
                                        </div>

                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
                                            <div style="mso-line-height-rule: exactly;line-height: 3px;font-size: 1px;">&nbsp;</div>
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #673147;">
                            <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">

                                        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
                                            <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i2.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_108res_ms_1322-9900000000079e3c.png">
                                        </div>

                                    </div>
                                    <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>

                        <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>


                        <div role="contentinfo">
                            <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
                                    <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                                            <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links>
                                                <tbody>
                                                    <tr role="navigation">
                                                        <td style="padding: 0;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
                                                                <img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
                                                                <img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
                                                                <img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
                                                                <img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
                                                                <img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
                                                            </a>
                                                        </td>
                                                        <td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
                                                            <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
                                                                <img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                                                <div>Modern Monk Healthcare Pvt Ltd</div>
                                            </div>
                                            <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">

                                            </div>
                                            <!--[if mso]>&nbsp;<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
                                    <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">

                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                </div>
                            </div>
                            <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
                                <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
                                    <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
                                    <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;">
                                        <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                                            <div style="font-size: 12px;line-height: 19px;">

                                            </div>
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <div style="line-height:40px;font-size:40px;">&nbsp;</div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
    <script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
    <script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body>
</html>`;
}

function mail_template_book_pcos_consultation(name) {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width"><style type="text/css">
@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:44px !important;line-height:50px !important}.wrapper h2{}.wrapper h2{font-size:64px !important;line-height:63px !important}.wrapper h3{}.wrapper h3{font-size:26px !important;line-height:34px !important}.column{}.column{font-size:18px !important;line-height:26px !important}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper 
.size-15{font-size:15px !important;line-height:23px !important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px 
!important;line-height:43px !important}.wrapper .size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
</style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
body {
  margin: 0;
  padding: 0;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
* {
  line-height: inherit;
}
[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
}
.wrapper .footer__share-button a:hover,
.wrapper .footer__share-button a:focus {
  color: #ffffff !important;
}
.btn a:hover,
.btn a:focus,
.footer__share-button a:hover,
.footer__share-button a:focus,
.email-footer__links a:hover,
.email-footer__links a:focus {
  opacity: 0.8;
}
.preheader,
.header,
.layout,
.column {
  transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
}
.preheader td {
  padding-bottom: 8px;
}
.layout,
div.header {
  max-width: 400px !important;
  -fallback-width: 95% !important;
  width: calc(100% - 20px) !important;
}
div.preheader {
  max-width: 360px !important;
  -fallback-width: 90% !important;
  width: calc(100% - 60px) !important;
}
.snippet,
.webversion {
  Float: none !important;
}
.stack .column {
  max-width: 400px !important;
  width: 100% !important;
}
.fixed-width.has-border {
  max-width: 402px !important;
}
.fixed-width.has-border .layout__inner {
  box-sizing: border-box;
}
.snippet,
.webversion {
  width: 50% !important;
}
.ie .btn {
  width: 100%;
}
.ie .stack .column,
.ie .stack .gutter {
  display: table-cell;
  float: none !important;
}
.ie div.preheader,
.ie .email-footer {
  max-width: 560px !important;
  width: 560px !important;
}
.ie .snippet,
.ie .webversion {
  width: 280px !important;
}
.ie div.header,
.ie .layout {
  max-width: 600px !important;
  width: 600px !important;
}
.ie .two-col .column {
  max-width: 300px !important;
  width: 300px !important;
}
.ie .three-col .column,
.ie .narrow {
  max-width: 200px !important;
  width: 200px !important;
}
.ie .wide {
  width: 400px !important;
}
.ie .stack.fixed-width.has-border,
.ie .stack.has-gutter.has-border {
  max-width: 602px !important;
  width: 602px !important;
}
.ie .stack.two-col.has-gutter .column {
  max-width: 290px !important;
  width: 290px !important;
}
.ie .stack.three-col.has-gutter .column,
.ie .stack.has-gutter .narrow {
  max-width: 188px !important;
  width: 188px !important;
}
.ie .stack.has-gutter .wide {
  max-width: 394px !important;
  width: 394px !important;
}
.ie .stack.two-col.has-gutter.has-border .column {
  max-width: 292px !important;
  width: 292px !important;
}
.ie .stack.three-col.has-gutter.has-border .column,
.ie .stack.has-gutter.has-border .narrow {
  max-width: 190px !important;
  width: 190px !important;
}
.ie .stack.has-gutter.has-border .wide {
  max-width: 396px !important;
  width: 396px !important;
}
.ie .fixed-width .layout__inner {
  border-left: 0 none white !important;
  border-right: 0 none white !important;
}
.ie .layout__edges {
  display: none;
}
.mso .layout__edges {
  font-size: 0;
}
.layout-fixed-width,
.mso .layout-full-width {
  background-color: #ffffff;
}
@media only screen and (min-width: 620px) {
  .column,
  .gutter {
    display: table-cell;
    Float: none !important;
    vertical-align: top;
  }
  div.preheader,
  .email-footer {
    max-width: 560px !important;
    width: 560px !important;
  }
  .snippet,
  .webversion {
    width: 280px !important;
  }
  div.header,
  .layout,
  .one-col .column {
    max-width: 600px !important;
    width: 600px !important;
  }
  .fixed-width.has-border,
  .fixed-width.x_has-border,
  .has-gutter.has-border,
  .has-gutter.x_has-border {
    max-width: 602px !important;
    width: 602px !important;
  }
  .two-col .column {
    max-width: 300px !important;
    width: 300px !important;
  }
  .three-col .column,
  .column.narrow,
  .column.x_narrow {
    max-width: 200px !important;
    width: 200px !important;
  }
  .column.wide,
  .column.x_wide {
    width: 400px !important;
  }
  .two-col.has-gutter .column,
  .two-col.x_has-gutter .column {
    max-width: 290px !important;
    width: 290px !important;
  }
  .three-col.has-gutter .column,
  .three-col.x_has-gutter .column,
  .has-gutter .narrow {
    max-width: 188px !important;
    width: 188px !important;
  }
  .has-gutter .wide {
    max-width: 394px !important;
    width: 394px !important;
  }
  .two-col.has-gutter.has-border .column,
  .two-col.x_has-gutter.x_has-border .column {
    max-width: 292px !important;
    width: 292px !important;
  }
  .three-col.has-gutter.has-border .column,
  .three-col.x_has-gutter.x_has-border .column,
  .has-gutter.has-border .narrow,
  .has-gutter.x_has-border .narrow {
    max-width: 190px !important;
    width: 190px !important;
  }
  .has-gutter.has-border .wide,
  .has-gutter.x_has-border .wide {
    max-width: 396px !important;
    width: 396px !important;
  }
}
@supports (display: flex) {
  @media only screen and (min-width: 620px) {
    .fixed-width.has-border .layout__inner {
      display: flex !important;
    }
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
  .fblike {
    background-image: url(https://i7.createsend1.com/static/eb/beta/13-the-blueprint-3/images/fblike@2x.png) !important;
  }
  .tweet {
    background-image: url(https://i8.createsend1.com/static/eb/beta/13-the-blueprint-3/images/tweet@2x.png) !important;
  }
  .linkedinshare {
    background-image: url(https://i10.createsend1.com/static/eb/beta/13-the-blueprint-3/images/lishare@2x.png) !important;
  }
  .forwardtoafriend {
    background-image: url(https://i9.createsend1.com/static/eb/beta/13-the-blueprint-3/images/forward@2x.png) !important;
  }
}
@media (max-width: 321px) {
  .fixed-width.has-border .layout__inner {
    border-width: 1px 0 !important;
  }
  .layout,
  .stack .column {
    min-width: 320px !important;
    width: 320px !important;
  }
  .border {
    display: none;
  }
  .has-gutter .border {
    display: table-cell;
  }
}
.mso div {
  border: 0 none white !important;
}
.mso .w560 .divider {
  Margin-left: 260px !important;
  Margin-right: 260px !important;
}
.mso .w360 .divider {
  Margin-left: 160px !important;
  Margin-right: 160px !important;
}
.mso .w260 .divider {
  Margin-left: 110px !important;
  Margin-right: 110px !important;
}
.mso .w160 .divider {
  Margin-left: 60px !important;
  Margin-right: 60px !important;
}
.mso .w354 .divider {
  Margin-left: 157px !important;
  Margin-right: 157px !important;
}
.mso .w250 .divider {
  Margin-left: 105px !important;
  Margin-right: 105px !important;
}
.mso .w148 .divider {
  Margin-left: 54px !important;
  Margin-right: 54px !important;
}
.mso .size-8,
.ie .size-8 {
  font-size: 8px !important;
  line-height: 14px !important;
}
.mso .size-9,
.ie .size-9 {
  font-size: 9px !important;
  line-height: 16px !important;
}
.mso .size-10,
.ie .size-10 {
  font-size: 10px !important;
  line-height: 18px !important;
}
.mso .size-11,
.ie .size-11 {
  font-size: 11px !important;
  line-height: 19px !important;
}
.mso .size-12,
.ie .size-12 {
  font-size: 12px !important;
  line-height: 19px !important;
}
.mso .size-13,
.ie .size-13 {
  font-size: 13px !important;
  line-height: 21px !important;
}
.mso .size-14,
.ie .size-14 {
  font-size: 14px !important;
  line-height: 21px !important;
}
.mso .size-15,
.ie .size-15 {
  font-size: 15px !important;
  line-height: 23px !important;
}
.mso .size-16,
.ie .size-16 {
  font-size: 16px !important;
  line-height: 24px !important;
}
.mso .size-17,
.ie .size-17 {
  font-size: 17px !important;
  line-height: 26px !important;
}
.mso .size-18,
.ie .size-18 {
  font-size: 18px !important;
  line-height: 26px !important;
}
.mso .size-20,
.ie .size-20 {
  font-size: 20px !important;
  line-height: 28px !important;
}
.mso .size-22,
.ie .size-22 {
  font-size: 22px !important;
  line-height: 31px !important;
}
.mso .size-24,
.ie .size-24 {
  font-size: 24px !important;
  line-height: 32px !important;
}
.mso .size-26,
.ie .size-26 {
  font-size: 26px !important;
  line-height: 34px !important;
}
.mso .size-28,
.ie .size-28 {
  font-size: 28px !important;
  line-height: 36px !important;
}
.mso .size-30,
.ie .size-30 {
  font-size: 30px !important;
  line-height: 38px !important;
}
.mso .size-32,
.ie .size-32 {
  font-size: 32px !important;
  line-height: 40px !important;
}
.mso .size-34,
.ie .size-34 {
  font-size: 34px !important;
  line-height: 43px !important;
}
.mso .size-36,
.ie .size-36 {
  font-size: 36px !important;
  line-height: 43px !important;
}
.mso .size-40,
.ie .size-40 {
  font-size: 40px !important;
  line-height: 47px !important;
}
.mso .size-44,
.ie .size-44 {
  font-size: 44px !important;
  line-height: 50px !important;
}
.mso .size-48,
.ie .size-48 {
  font-size: 48px !important;
  line-height: 54px !important;
}
.mso .size-56,
.ie .size-56 {
  font-size: 56px !important;
  line-height: 60px !important;
}
.mso .size-64,
.ie .size-64 {
  font-size: 64px !important;
  line-height: 63px !important;
}
</style>
    
  <!--[if !mso]><!--><style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic);
</style><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic" rel="stylesheet" type="text/css"><!--<![endif]--><style type="text/css">
body{background-color:#fff}.logo a:hover,.logo a:focus{color:#1e2e3b !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:44px !important;line-height:50px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:64px !important;line-height:63px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:26px !important;line-height:34px !important}.mso .layout__inner,.ie .layout__inner{}.mso .layout__inner,.ie .layout__inner{font-size:18px !important;line-height:26px !important}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Roboto,Tahoma,sans-serif}
</style><meta name="robots" content="noindex,nofollow"></meta>
<meta property="og:title" content="PCOS - Consultation booked"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
  <body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
<!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
      <div role="banner">
        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
          <div style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
            <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #999;font-family: Roboto,Tahoma,sans-serif;">
              
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
            <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #999;font-family: Roboto,Tahoma,sans-serif;">
              <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #999;" href="https://modernmonk.createsend1.com/t/t-e-ndylylt-l-n/">Click here</a></p>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
        <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
          <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
            <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 160px;" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="Modern Monk" width="160"></div>
          </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </div>
      </div>
      <div>
      <div style="background-color: #f6f4f0;background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i1.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_108res_ms_05-9900000000079e3c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #f6f4f0;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #673147;font-size: 34px;line-height: 43px;font-family: Playfair Display,Didot,Bodoni MT,Times New Roman,serif;"><em><strong>Your PCOS Consultation is booked...</strong></em></h1>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #673147;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 29px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <p style="Margin-top: 0;Margin-bottom: 0;">Dear ${name},</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thank you for booking a consultation with us for PCOS. We will soon get in touch with you.</p><p style="Margin-top: 20px;Margin-bottom: 20px;">But just in case you want to reach us earlier, please feel free to do so.</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 13px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: center;">
        <![if !mso]><a style="border-radius: 0;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #333333 !important;background-color: #f6f4f0;font-family: Roboto, Tahoma, sans-serif;" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20to%20talk%20about%20PCOS.">WhatsApp Us</a><![endif]>
      <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:rect xmlns:v="urn:schemas-microsoft-com:vml" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20to%20talk%20about%20PCOS." style="width:132px" fillcolor="#F6F4F0" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,12px,0px,12px"><center style="font-size:14px;line-height:24px;color:#333333;font-family:Roboto,Tahoma,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">WhatsApp Us</center></v:textbox></v:rect><![endif]--></div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <p style="Margin-top: 0;Margin-bottom: 0;">Join our <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #f6f4f0;" href="https://www.facebook.com/groups/modernmonk/">Facebook Community</a>&nbsp;to get free advice from experts on all your health and wellness related queries anytime.</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thanks,</p><p style="Margin-top: 20px;Margin-bottom: 20px;">Modern Monk</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 3px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #673147;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i2.createsend1.com/ei/t/1A/419/CCB/180232/csfinal/CMRetention2_108res_ms_1322-9900000000079e3c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
  
      
      <div role="contentinfo">
        <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
                <td style="padding: 0;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
		<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
		<img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
		<img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
		<img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
		<img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
		<img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
	</a>
</td>
                </tr></tbody></table>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                  <div>Modern Monk Healthcare Pvt Ltd</div>
                </div>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                  
                </div>
                <!--[if mso]>&nbsp;<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
            <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <div style="font-size: 12px;line-height: 19px;">
                  
                </div>
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="line-height:40px;font-size:40px;">&nbsp;</div>
    </div></td></tr></tbody></table>
  
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body></html>
`;
}

function mail_template_Kaphaj(name) {
    return `
    

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width"><style type="text/css">
@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:40px !important;line-height:47px !important}.wrapper h2{}.wrapper h2{font-size:24px !important;line-height:32px !important}.wrapper h3{}.wrapper h3{font-size:20px !important;line-height:28px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px 
!important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper 
.size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
</style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
body {
  margin: 0;
  padding: 0;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
* {
  line-height: inherit;
}
[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
}
.wrapper .footer__share-button a:hover,
.wrapper .footer__share-button a:focus {
  color: #ffffff !important;
}
.btn a:hover,
.btn a:focus,
.footer__share-button a:hover,
.footer__share-button a:focus,
.email-footer__links a:hover,
.email-footer__links a:focus {
  opacity: 0.8;
}
.preheader,
.header,
.layout,
.column {
  transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
}
.preheader td {
  padding-bottom: 8px;
}
.layout,
div.header {
  max-width: 400px !important;
  -fallback-width: 95% !important;
  width: calc(100% - 20px) !important;
}
div.preheader {
  max-width: 360px !important;
  -fallback-width: 90% !important;
  width: calc(100% - 60px) !important;
}
.snippet,
.webversion {
  Float: none !important;
}
.stack .column {
  max-width: 400px !important;
  width: 100% !important;
}
.fixed-width.has-border {
  max-width: 402px !important;
}
.fixed-width.has-border .layout__inner {
  box-sizing: border-box;
}
.snippet,
.webversion {
  width: 50% !important;
}
.ie .btn {
  width: 100%;
}
.ie .stack .column,
.ie .stack .gutter {
  display: table-cell;
  float: none !important;
}
.ie div.preheader,
.ie .email-footer {
  max-width: 560px !important;
  width: 560px !important;
}
.ie .snippet,
.ie .webversion {
  width: 280px !important;
}
.ie div.header,
.ie .layout {
  max-width: 600px !important;
  width: 600px !important;
}
.ie .two-col .column {
  max-width: 300px !important;
  width: 300px !important;
}
.ie .three-col .column,
.ie .narrow {
  max-width: 200px !important;
  width: 200px !important;
}
.ie .wide {
  width: 400px !important;
}
.ie .stack.fixed-width.has-border,
.ie .stack.has-gutter.has-border {
  max-width: 602px !important;
  width: 602px !important;
}
.ie .stack.two-col.has-gutter .column {
  max-width: 290px !important;
  width: 290px !important;
}
.ie .stack.three-col.has-gutter .column,
.ie .stack.has-gutter .narrow {
  max-width: 188px !important;
  width: 188px !important;
}
.ie .stack.has-gutter .wide {
  max-width: 394px !important;
  width: 394px !important;
}
.ie .stack.two-col.has-gutter.has-border .column {
  max-width: 292px !important;
  width: 292px !important;
}
.ie .stack.three-col.has-gutter.has-border .column,
.ie .stack.has-gutter.has-border .narrow {
  max-width: 190px !important;
  width: 190px !important;
}
.ie .stack.has-gutter.has-border .wide {
  max-width: 396px !important;
  width: 396px !important;
}
.ie .fixed-width .layout__inner {
  border-left: 0 none white !important;
  border-right: 0 none white !important;
}
.ie .layout__edges {
  display: none;
}
.mso .layout__edges {
  font-size: 0;
}
.layout-fixed-width,
.mso .layout-full-width {
  background-color: #ffffff;
}
@media only screen and (min-width: 620px) {
  .column,
  .gutter {
    display: table-cell;
    Float: none !important;
    vertical-align: top;
  }
  div.preheader,
  .email-footer {
    max-width: 560px !important;
    width: 560px !important;
  }
  .snippet,
  .webversion {
    width: 280px !important;
  }
  div.header,
  .layout,
  .one-col .column {
    max-width: 600px !important;
    width: 600px !important;
  }
  .fixed-width.has-border,
  .fixed-width.x_has-border,
  .has-gutter.has-border,
  .has-gutter.x_has-border {
    max-width: 602px !important;
    width: 602px !important;
  }
  .two-col .column {
    max-width: 300px !important;
    width: 300px !important;
  }
  .three-col .column,
  .column.narrow,
  .column.x_narrow {
    max-width: 200px !important;
    width: 200px !important;
  }
  .column.wide,
  .column.x_wide {
    width: 400px !important;
  }
  .two-col.has-gutter .column,
  .two-col.x_has-gutter .column {
    max-width: 290px !important;
    width: 290px !important;
  }
  .three-col.has-gutter .column,
  .three-col.x_has-gutter .column,
  .has-gutter .narrow {
    max-width: 188px !important;
    width: 188px !important;
  }
  .has-gutter .wide {
    max-width: 394px !important;
    width: 394px !important;
  }
  .two-col.has-gutter.has-border .column,
  .two-col.x_has-gutter.x_has-border .column {
    max-width: 292px !important;
    width: 292px !important;
  }
  .three-col.has-gutter.has-border .column,
  .three-col.x_has-gutter.x_has-border .column,
  .has-gutter.has-border .narrow,
  .has-gutter.x_has-border .narrow {
    max-width: 190px !important;
    width: 190px !important;
  }
  .has-gutter.has-border .wide,
  .has-gutter.x_has-border .wide {
    max-width: 396px !important;
    width: 396px !important;
  }
}
@supports (display: flex) {
  @media only screen and (min-width: 620px) {
    .fixed-width.has-border .layout__inner {
      display: flex !important;
    }
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
  .fblike {
    background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;
  }
  .tweet {
    background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;
  }
  .linkedinshare {
    background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;
  }
  .forwardtoafriend {
    background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;
  }
}
@media (max-width: 321px) {
  .fixed-width.has-border .layout__inner {
    border-width: 1px 0 !important;
  }
  .layout,
  .stack .column {
    min-width: 320px !important;
    width: 320px !important;
  }
  .border {
    display: none;
  }
  .has-gutter .border {
    display: table-cell;
  }
}
.mso div {
  border: 0 none white !important;
}
.mso .w560 .divider {
  Margin-left: 260px !important;
  Margin-right: 260px !important;
}
.mso .w360 .divider {
  Margin-left: 160px !important;
  Margin-right: 160px !important;
}
.mso .w260 .divider {
  Margin-left: 110px !important;
  Margin-right: 110px !important;
}
.mso .w160 .divider {
  Margin-left: 60px !important;
  Margin-right: 60px !important;
}
.mso .w354 .divider {
  Margin-left: 157px !important;
  Margin-right: 157px !important;
}
.mso .w250 .divider {
  Margin-left: 105px !important;
  Margin-right: 105px !important;
}
.mso .w148 .divider {
  Margin-left: 54px !important;
  Margin-right: 54px !important;
}
.mso .size-8,
.ie .size-8 {
  font-size: 8px !important;
  line-height: 14px !important;
}
.mso .size-9,
.ie .size-9 {
  font-size: 9px !important;
  line-height: 16px !important;
}
.mso .size-10,
.ie .size-10 {
  font-size: 10px !important;
  line-height: 18px !important;
}
.mso .size-11,
.ie .size-11 {
  font-size: 11px !important;
  line-height: 19px !important;
}
.mso .size-12,
.ie .size-12 {
  font-size: 12px !important;
  line-height: 19px !important;
}
.mso .size-13,
.ie .size-13 {
  font-size: 13px !important;
  line-height: 21px !important;
}
.mso .size-14,
.ie .size-14 {
  font-size: 14px !important;
  line-height: 21px !important;
}
.mso .size-15,
.ie .size-15 {
  font-size: 15px !important;
  line-height: 23px !important;
}
.mso .size-16,
.ie .size-16 {
  font-size: 16px !important;
  line-height: 24px !important;
}
.mso .size-17,
.ie .size-17 {
  font-size: 17px !important;
  line-height: 26px !important;
}
.mso .size-18,
.ie .size-18 {
  font-size: 18px !important;
  line-height: 26px !important;
}
.mso .size-20,
.ie .size-20 {
  font-size: 20px !important;
  line-height: 28px !important;
}
.mso .size-22,
.ie .size-22 {
  font-size: 22px !important;
  line-height: 31px !important;
}
.mso .size-24,
.ie .size-24 {
  font-size: 24px !important;
  line-height: 32px !important;
}
.mso .size-26,
.ie .size-26 {
  font-size: 26px !important;
  line-height: 34px !important;
}
.mso .size-28,
.ie .size-28 {
  font-size: 28px !important;
  line-height: 36px !important;
}
.mso .size-30,
.ie .size-30 {
  font-size: 30px !important;
  line-height: 38px !important;
}
.mso .size-32,
.ie .size-32 {
  font-size: 32px !important;
  line-height: 40px !important;
}
.mso .size-34,
.ie .size-34 {
  font-size: 34px !important;
  line-height: 43px !important;
}
.mso .size-36,
.ie .size-36 {
  font-size: 36px !important;
  line-height: 43px !important;
}
.mso .size-40,
.ie .size-40 {
  font-size: 40px !important;
  line-height: 47px !important;
}
.mso .size-44,
.ie .size-44 {
  font-size: 44px !important;
  line-height: 50px !important;
}
.mso .size-48,
.ie .size-48 {
  font-size: 48px !important;
  line-height: 54px !important;
}
.mso .size-56,
.ie .size-56 {
  font-size: 56px !important;
  line-height: 60px !important;
}
.mso .size-64,
.ie .size-64 {
  font-size: 64px !important;
  line-height: 63px !important;
}
</style>
    
  <!--[if !mso]><!--><style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Karla:400,700,400italic,700italic|Montserrat:400,700,400italic);
</style><link href="https://fonts.googleapis.com/css?family=Karla:400,700,400italic,700italic|Montserrat:400,700,400italic" rel="stylesheet" type="text/css"><!--<![endif]--><style type="text/css">
body{background-color:#fff}.logo a:hover,.logo a:focus{color:#1e2e3b !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:40px !important;line-height:47px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:24px !important;line-height:32px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:20px !important;line-height:28px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Karla,Calibri,Geneva,sans-serif}
</style><meta name="robots" content="noindex,nofollow"></meta>
<meta property="og:title" content="Prakriti Email Kaphaj"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
  <body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
<!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
      <div role="banner">
        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
          <div style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
            <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;">
              <div style="mso-hide:all;position:fixed;height:0;max-height:0;overflow:hidden;font-size:0;">Your Prakriti is...</div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
            <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;">
              <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #363f48;" href="https://modernmonk.createsend1.com/t/t-e-njdihtl-l-u/">Click here</a></p>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        
      </div>
      <div>
      <div style="background-color: #ffffff;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ffffff;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;">
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img style="border: 0;display: block;height: auto;width: 100%;max-width: 297px;" alt="" width="297" src="https://i1.createsend1.com/ei/t/B7/3E6/2AB/034806/csfinal/images-9906db0b6d028a3c.png">
        </div>
      
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #363f48;font-size: 20px;line-height: 28px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;text-align: center;"><span style="color:#363f48"><strong>Your <em>Prakriti</em> is <em>KAPHAJ</em></strong></span></h2><p style="Margin-top: 16px;Margin-bottom: 0;"><span style="color:#363f48">Dear ${name},</span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#363f48">Before you start wondering what that&nbsp;difficult sounding word means, let me tell you that I am going to walk you through this. </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#363f48">So Ayurveda tells us that every person has a <em>Prakriti</em>&nbsp;or a Psychosomatic Constitution. It is quite like your horoscope, just more scientific and useful.&nbsp;</span></p><p 
style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#363f48">Knowing your&nbsp;<em>Prakriti</em>&nbsp;can help you know what kind of diseases you are naturally prone to and what precautions you can take to prevent the same.</span></p><p style="Margin-top: 20px;Margin-bottom: 20px;">So let's get started!</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 1px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #000000;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #000000;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i2.createsend1.com/ei/t/B7/3E6/2AB/034806/csfinal/personality-990000000001453c.png">
        </div>
      </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#ffffff">Your Personality Traits</span></strong></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;"><span class="font-montserrat"><span style="color:#ffffff">Sweet and Loving</span></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><span style="color:#ffffff">Possessive</span></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><span style="color:#ffffff">Sentimental</span></span></li></ul>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #f05225;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f05225;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 25px;font-size: 1px;">&nbsp;</div>
    </div>
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i3.createsend1.com/ei/t/B7/3E6/2AB/034806/csfinal/bacteria-990000000001453c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><span style="color:#000000"><strong>Health Problems You Are Prone to</strong></span></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 20px;Margin-left: 24px;padding: 0;list-style-type: disc;"><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Obesity</span></li><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Diabetes</span></li><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Atherosclerosis</span></li></ul>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 1px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #000000;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #000000;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;Margin-bottom: 20px;" align="center">
          <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i4.createsend1.com/ei/t/B7/3E6/2AB/034806/csfinal/healthy-990000000001453c.png">
        </div>
      </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 1px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#ffffff">Lifestyle&nbsp;You Should Embrace</span></strong></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style='Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat, "dejavu sans", verdana, sans-serif;'><span class="font-montserrat"><span style="color:#ffffff">Eat whole freshly cooked food</span></span></li><li style='Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat, "dejavu sans", verdana, sans-serif;text-align: left;'><span class="font-montserrat"><span style="color:#ffffff">Take all your meals on time</span></span></li><li style='Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat, "dejavu sans", verdana, sans-serif;text-align: left;'><span class="font-montserrat"><span style="color:#ffffff">Eat your meals in a peaceful environment</span></span></li></ul>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #f05225;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f05225;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 13px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i5.createsend1.com/ei/t/B7/3E6/2AB/034806/csfinal/49-512-990000000001453c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#000000">Lifestyle You Should Denounce</span></strong></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><p class="size-18" style="Margin-top: 0;Margin-bottom: 0;font-size: 17px;line-height: 26px;" lang="x-size-18"><span style="color:#000000">Eating heavy and oily foods</span></p></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><span style="color:#000000">Cold or carbonated drinks</span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><span style="color:#000000">Alcohol, except for an occasional glass of dry red or white wine.</span></li></ul>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
        <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
        <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
          <div class="column" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;">
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 60px;font-size: 1px;">&nbsp;</div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #363f48;font-size: 32px;line-height: 40px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;text-align: center;"><span style="color:#363f48"><strong>Do you want to know more?</strong></span></h1><p style="Margin-top: 20px;Margin-bottom: 20px;text-align: center;"><span style="color:#363f48">Read more about your Prakriti and how it can help you lead a healthier life by clicking on the link below! You can also<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #4c4dc3;" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20more%20information%20about%20Prakriti."> get in touch with our experts</a> for further assistance.</span></p>
      </div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div class="btn btn--flat fullwidth btn--large" style="Margin-bottom: 20px;text-align: center;">
        <![if !mso]><a style="border-radius: 4px;display: block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: #f05225;font-family: Karla, Calibri, Geneva, sans-serif;" href="https://modernmonk.in/meaning-of-prakriti-vikriti/">GET MORE INFO ON YOUR PRAKRITI</a><![endif]>
      <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://modernmonk.createsend1.com/t/t-l-njdihtl-l-y/" style="width:560px" arcsize="9%" fillcolor="#F05225" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Karla,Calibri,Geneva,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">GET MORE INFO ON YOUR PRAKRITI</center></v:textbox></v:roundrect><![endif]--></div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
        
          </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </div>
      </div>
  
      <div style="mso-line-height-rule: exactly;line-height: 17px;font-size: 17px;">&nbsp;</div>
  
      
      <div role="contentinfo">
        <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
                <td style="padding: 0;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
		<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
		<img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
		<img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
		<img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
		<img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
		<img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
	</a>
</td>
                </tr></tbody></table>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                  <div>Modern Monk Healthcare Pvt Ltd<br>
Koregaon Park, Pune</div>
                </div>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                  <div>You are receiving this email because you took Prakriti Quiz on Modern Monk.</div>
                </div>
                <!--[if mso]>&nbsp;<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
            <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <div style="font-size: 12px;line-height: 19px;">
                  <span><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #363f48;" href="https://modernmonk.updatemyprofile.com/t-l-2AD73FFF-l-o" lang="en">Preferences</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #363f48;" href="https://modernmonk.createsend1.com/t/t-u-njdihtl-l-x/">Unsubscribe</a>
                </div>
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="line-height:40px;font-size:40px;">&nbsp;</div>
    </div></td></tr></tbody></table>
  
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body></html>


    `;
}

function mail_template_pittaj(name) {
    return `
    

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width"><style type="text/css">
@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:40px !important;line-height:47px !important}.wrapper h2{}.wrapper h2{font-size:24px !important;line-height:32px !important}.wrapper h3{}.wrapper h3{font-size:20px !important;line-height:28px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px 
!important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper 
.size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
</style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
body {
  margin: 0;
  padding: 0;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
* {
  line-height: inherit;
}
[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
}
.wrapper .footer__share-button a:hover,
.wrapper .footer__share-button a:focus {
  color: #ffffff !important;
}
.btn a:hover,
.btn a:focus,
.footer__share-button a:hover,
.footer__share-button a:focus,
.email-footer__links a:hover,
.email-footer__links a:focus {
  opacity: 0.8;
}
.preheader,
.header,
.layout,
.column {
  transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
}
.preheader td {
  padding-bottom: 8px;
}
.layout,
div.header {
  max-width: 400px !important;
  -fallback-width: 95% !important;
  width: calc(100% - 20px) !important;
}
div.preheader {
  max-width: 360px !important;
  -fallback-width: 90% !important;
  width: calc(100% - 60px) !important;
}
.snippet,
.webversion {
  Float: none !important;
}
.stack .column {
  max-width: 400px !important;
  width: 100% !important;
}
.fixed-width.has-border {
  max-width: 402px !important;
}
.fixed-width.has-border .layout__inner {
  box-sizing: border-box;
}
.snippet,
.webversion {
  width: 50% !important;
}
.ie .btn {
  width: 100%;
}
.ie .stack .column,
.ie .stack .gutter {
  display: table-cell;
  float: none !important;
}
.ie div.preheader,
.ie .email-footer {
  max-width: 560px !important;
  width: 560px !important;
}
.ie .snippet,
.ie .webversion {
  width: 280px !important;
}
.ie div.header,
.ie .layout {
  max-width: 600px !important;
  width: 600px !important;
}
.ie .two-col .column {
  max-width: 300px !important;
  width: 300px !important;
}
.ie .three-col .column,
.ie .narrow {
  max-width: 200px !important;
  width: 200px !important;
}
.ie .wide {
  width: 400px !important;
}
.ie .stack.fixed-width.has-border,
.ie .stack.has-gutter.has-border {
  max-width: 602px !important;
  width: 602px !important;
}
.ie .stack.two-col.has-gutter .column {
  max-width: 290px !important;
  width: 290px !important;
}
.ie .stack.three-col.has-gutter .column,
.ie .stack.has-gutter .narrow {
  max-width: 188px !important;
  width: 188px !important;
}
.ie .stack.has-gutter .wide {
  max-width: 394px !important;
  width: 394px !important;
}
.ie .stack.two-col.has-gutter.has-border .column {
  max-width: 292px !important;
  width: 292px !important;
}
.ie .stack.three-col.has-gutter.has-border .column,
.ie .stack.has-gutter.has-border .narrow {
  max-width: 190px !important;
  width: 190px !important;
}
.ie .stack.has-gutter.has-border .wide {
  max-width: 396px !important;
  width: 396px !important;
}
.ie .fixed-width .layout__inner {
  border-left: 0 none white !important;
  border-right: 0 none white !important;
}
.ie .layout__edges {
  display: none;
}
.mso .layout__edges {
  font-size: 0;
}
.layout-fixed-width,
.mso .layout-full-width {
  background-color: #ffffff;
}
@media only screen and (min-width: 620px) {
  .column,
  .gutter {
    display: table-cell;
    Float: none !important;
    vertical-align: top;
  }
  div.preheader,
  .email-footer {
    max-width: 560px !important;
    width: 560px !important;
  }
  .snippet,
  .webversion {
    width: 280px !important;
  }
  div.header,
  .layout,
  .one-col .column {
    max-width: 600px !important;
    width: 600px !important;
  }
  .fixed-width.has-border,
  .fixed-width.x_has-border,
  .has-gutter.has-border,
  .has-gutter.x_has-border {
    max-width: 602px !important;
    width: 602px !important;
  }
  .two-col .column {
    max-width: 300px !important;
    width: 300px !important;
  }
  .three-col .column,
  .column.narrow,
  .column.x_narrow {
    max-width: 200px !important;
    width: 200px !important;
  }
  .column.wide,
  .column.x_wide {
    width: 400px !important;
  }
  .two-col.has-gutter .column,
  .two-col.x_has-gutter .column {
    max-width: 290px !important;
    width: 290px !important;
  }
  .three-col.has-gutter .column,
  .three-col.x_has-gutter .column,
  .has-gutter .narrow {
    max-width: 188px !important;
    width: 188px !important;
  }
  .has-gutter .wide {
    max-width: 394px !important;
    width: 394px !important;
  }
  .two-col.has-gutter.has-border .column,
  .two-col.x_has-gutter.x_has-border .column {
    max-width: 292px !important;
    width: 292px !important;
  }
  .three-col.has-gutter.has-border .column,
  .three-col.x_has-gutter.x_has-border .column,
  .has-gutter.has-border .narrow,
  .has-gutter.x_has-border .narrow {
    max-width: 190px !important;
    width: 190px !important;
  }
  .has-gutter.has-border .wide,
  .has-gutter.x_has-border .wide {
    max-width: 396px !important;
    width: 396px !important;
  }
}
@supports (display: flex) {
  @media only screen and (min-width: 620px) {
    .fixed-width.has-border .layout__inner {
      display: flex !important;
    }
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
  .fblike {
    background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;
  }
  .tweet {
    background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;
  }
  .linkedinshare {
    background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;
  }
  .forwardtoafriend {
    background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;
  }
}
@media (max-width: 321px) {
  .fixed-width.has-border .layout__inner {
    border-width: 1px 0 !important;
  }
  .layout,
  .stack .column {
    min-width: 320px !important;
    width: 320px !important;
  }
  .border {
    display: none;
  }
  .has-gutter .border {
    display: table-cell;
  }
}
.mso div {
  border: 0 none white !important;
}
.mso .w560 .divider {
  Margin-left: 260px !important;
  Margin-right: 260px !important;
}
.mso .w360 .divider {
  Margin-left: 160px !important;
  Margin-right: 160px !important;
}
.mso .w260 .divider {
  Margin-left: 110px !important;
  Margin-right: 110px !important;
}
.mso .w160 .divider {
  Margin-left: 60px !important;
  Margin-right: 60px !important;
}
.mso .w354 .divider {
  Margin-left: 157px !important;
  Margin-right: 157px !important;
}
.mso .w250 .divider {
  Margin-left: 105px !important;
  Margin-right: 105px !important;
}
.mso .w148 .divider {
  Margin-left: 54px !important;
  Margin-right: 54px !important;
}
.mso .size-8,
.ie .size-8 {
  font-size: 8px !important;
  line-height: 14px !important;
}
.mso .size-9,
.ie .size-9 {
  font-size: 9px !important;
  line-height: 16px !important;
}
.mso .size-10,
.ie .size-10 {
  font-size: 10px !important;
  line-height: 18px !important;
}
.mso .size-11,
.ie .size-11 {
  font-size: 11px !important;
  line-height: 19px !important;
}
.mso .size-12,
.ie .size-12 {
  font-size: 12px !important;
  line-height: 19px !important;
}
.mso .size-13,
.ie .size-13 {
  font-size: 13px !important;
  line-height: 21px !important;
}
.mso .size-14,
.ie .size-14 {
  font-size: 14px !important;
  line-height: 21px !important;
}
.mso .size-15,
.ie .size-15 {
  font-size: 15px !important;
  line-height: 23px !important;
}
.mso .size-16,
.ie .size-16 {
  font-size: 16px !important;
  line-height: 24px !important;
}
.mso .size-17,
.ie .size-17 {
  font-size: 17px !important;
  line-height: 26px !important;
}
.mso .size-18,
.ie .size-18 {
  font-size: 18px !important;
  line-height: 26px !important;
}
.mso .size-20,
.ie .size-20 {
  font-size: 20px !important;
  line-height: 28px !important;
}
.mso .size-22,
.ie .size-22 {
  font-size: 22px !important;
  line-height: 31px !important;
}
.mso .size-24,
.ie .size-24 {
  font-size: 24px !important;
  line-height: 32px !important;
}
.mso .size-26,
.ie .size-26 {
  font-size: 26px !important;
  line-height: 34px !important;
}
.mso .size-28,
.ie .size-28 {
  font-size: 28px !important;
  line-height: 36px !important;
}
.mso .size-30,
.ie .size-30 {
  font-size: 30px !important;
  line-height: 38px !important;
}
.mso .size-32,
.ie .size-32 {
  font-size: 32px !important;
  line-height: 40px !important;
}
.mso .size-34,
.ie .size-34 {
  font-size: 34px !important;
  line-height: 43px !important;
}
.mso .size-36,
.ie .size-36 {
  font-size: 36px !important;
  line-height: 43px !important;
}
.mso .size-40,
.ie .size-40 {
  font-size: 40px !important;
  line-height: 47px !important;
}
.mso .size-44,
.ie .size-44 {
  font-size: 44px !important;
  line-height: 50px !important;
}
.mso .size-48,
.ie .size-48 {
  font-size: 48px !important;
  line-height: 54px !important;
}
.mso .size-56,
.ie .size-56 {
  font-size: 56px !important;
  line-height: 60px !important;
}
.mso .size-64,
.ie .size-64 {
  font-size: 64px !important;
  line-height: 63px !important;
}
</style>
    
  <!--[if !mso]><!--><style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Karla:400,700,400italic,700italic|Montserrat:400,700,400italic);
</style><link href="https://fonts.googleapis.com/css?family=Karla:400,700,400italic,700italic|Montserrat:400,700,400italic" rel="stylesheet" type="text/css"><!--<![endif]--><style type="text/css">
body{background-color:#fff}.logo a:hover,.logo a:focus{color:#1e2e3b !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:40px !important;line-height:47px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:24px !important;line-height:32px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:20px !important;line-height:28px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Karla,Calibri,Geneva,sans-serif}
</style><meta name="robots" content="noindex,nofollow"></meta>
<meta property="og:title" content="Prakriti email Pittaj"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
  <body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
<!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
      <div role="banner">
        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
          <div style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
            <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;">
              <div style="mso-hide:all;position:fixed;height:0;max-height:0;overflow:hidden;font-size:0;">Your Prakriti is...</div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
            <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;">
              <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #363f48;" href="https://modernmonk.createsend1.com/t/t-e-njkyuyk-l-u/">Click here</a></p>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        
      </div>
      <div>
      <div style="background-color: #ffffff;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ffffff;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;">
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top" style="border: 0;display: block;height: auto;width: 100%;max-width: 625px;" alt="" width="600" src="https://i1.createsend1.com/ei/t/F2/B3C/06C/033702/csfinal/Pittaj-38cbbb22ca07047f.jpg">
        </div>
      
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #363f48;font-size: 20px;line-height: 28px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;text-align: center;"><span style="color:#363f48"><strong>Your <em>Prakriti</em> is <em>PITTAJ</em></strong></span></h2><p style="Margin-top: 16px;Margin-bottom: 0;"><span style="color:#363f48">Dear ${name},</span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#363f48">Before you start wondering what that&nbsp;difficult sounding word means, let me tell you that I am going to walk you through this. </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#363f48">So Ayurveda tells us that every person has a <em>Prakriti</em>&nbsp;or a Psychosomatic Constitution. It is quite like your horoscope, just more scientific and useful.&nbsp;</span></p><p 
style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#363f48">Knowing your&nbsp;<em>Prakriti</em>&nbsp;can help you know what kind of diseases you are naturally prone to and what precautions you can take to prevent the same.</span></p><p style="Margin-top: 20px;Margin-bottom: 20px;">So let's get started!</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 1px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #363f48;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #363f48;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 27px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;Margin-bottom: 20px;" align="center">
          <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i2.createsend1.com/ei/t/F2/B3C/06C/033702/csfinal/personality-990000000001453c.png">
        </div>
      </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#ffffff">Your Personality Traits</span></strong></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;"><span class="font-montserrat"><span style="color:#ffffff">Intelligent</span></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><span style="color:#ffffff">Impulsive</span></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><span style="color:#ffffff">Judgemental</span></span></li></ul>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #f05225;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f05225;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i3.createsend1.com/ei/t/F2/B3C/06C/033702/csfinal/bacteria-990000000001453c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><span style="color:#000000"><strong>Health Problems You Are Prone to</strong></span></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><p class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Crohn's disease</span></p></li><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">High Blood Pressure</span></li><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Heart disease</span></li></ul>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #363f48;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #363f48;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 75px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i4.createsend1.com/ei/t/F2/B3C/06C/033702/csfinal/healthy-990000000001453c.png">
        </div>
      </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#ffffff">Lifestyle&nbsp;You Should Embrace</span></strong></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ol style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: decimal;"><li style='Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat, "dejavu sans", verdana, sans-serif;text-align: left;'><span class="font-montserrat"><p style="Margin-top: 0;Margin-bottom: 0;"><span style="color:#ffffff">Eat foods that are naturally sweet, bitter and astringent.</span></p></span></li><li style='Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat, "dejavu sans", verdana, sans-serif;text-align: left;'><span class="font-montserrat"><p style="Margin-top: 0;Margin-bottom: 0;">&nbsp;</p></span></li><li style='Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat, "dejavu sans", verdana, sans-serif;text-align: left;'><span class="font-montserrat"><p style="Margin-top: 0;Margin-bottom: 0;"><span style="color:#ffffff">Follow a 
moderate exercise routine that&nbsp; &nbsp; includes&nbsp;yoga, swimming or biking five&nbsp; &nbsp; times a week</span></p></span></li></ol>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #f05225;">
        <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f05225;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 32px;font-size: 1px;">&nbsp;</div>
    </div>
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i5.createsend1.com/ei/t/F2/B3C/06C/033702/csfinal/49-512-990000000001453c.png">
        </div>
      
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 5px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#000000">Lifestyle You Should Denounce</span></strong></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><p class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Caffeine, nicotine, and other stimulants.</span></p></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><span style="color:#000000">Highly processed foods like canned or frozen foods.</span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><span style="color:#000000">Alcohol, except for an occasional beer or white wine.</span></li></ul>
      </div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
        <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">
        <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]-->
          <div class="column" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;">
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 1px;">&nbsp;</div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #363f48;font-size: 32px;line-height: 40px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;text-align: center;"><span style="color:#363f48"><strong>Do you want to know more?</strong></span></h1><p style="Margin-top: 20px;Margin-bottom: 20px;text-align: center;"><span style="color:#363f48">Read more about your Prakriti and how it can help you lead a healthier life by clicking on the link below! You can also <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #4c4dc3;" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20more%20information%20about%20Prakriti.">get in touch with our experts</a> for further assistance.</span></p>
      </div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div class="btn btn--flat fullwidth btn--large" style="Margin-bottom: 20px;text-align: center;">
        <![if !mso]><a style="border-radius: 4px;display: block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: #f05225;font-family: Karla, Calibri, Geneva, sans-serif;" href="https://modernmonk.in/meaning-of-prakriti-vikriti/">GET MORE INFO ON YOUR PRAKRITI</a><![endif]>
      <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://modernmonk.createsend1.com/t/t-l-njkyuyk-l-y/" style="width:560px" arcsize="9%" fillcolor="#F05225" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Karla,Calibri,Geneva,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">GET MORE INFO ON YOUR PRAKRITI</center></v:textbox></v:roundrect><![endif]--></div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 3px;font-size: 1px;">&nbsp;</div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
        
          </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </div>
      </div>
  
      <div style="mso-line-height-rule: exactly;line-height: 17px;font-size: 17px;">&nbsp;</div>
  
      
      <div role="contentinfo">
        <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
                <td style="padding: 0;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
		<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
		<img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
		<img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
		<img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
		<img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
		<img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
	</a>
</td>
                </tr></tbody></table>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                  <div>Modern Monk Healthcare Pvt Ltd<br>
Koregaon Park, Pune</div>
                </div>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                  <div>You are receiving this email because you took Prakriti Quiz on Modern Monk.</div>
                </div>
                <!--[if mso]>&nbsp;<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
            <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #363f48;font-family: Karla,Calibri,Geneva,sans-serif;">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <div style="font-size: 12px;line-height: 19px;">
                  <span><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #363f48;" href="https://modernmonk.updatemyprofile.com/t-l-2AD73FFF-l-o" lang="en">Preferences</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #363f48;" href="https://modernmonk.createsend1.com/t/t-u-njkyuyk-l-x/">Unsubscribe</a>
                </div>
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="line-height:40px;font-size:40px;">&nbsp;</div>
    </div></td></tr></tbody></table>
  
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body></html>

   `;
}

function mail_template_vaataj(name) {
    return `

    
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title></title>
<!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
<meta name="viewport" content="width=device-width"><style type="text/css">
@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:40px !important;line-height:47px !important}.wrapper h2{}.wrapper h2{font-size:24px !important;line-height:32px !important}.wrapper h3{}.wrapper h3{font-size:20px !important;line-height:28px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px 
!important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper 
.size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
</style>
<meta name="x-apple-disable-message-reformatting">
<style type="text/css">
body {
margin: 0;
padding: 0;
}
table {
border-collapse: collapse;
table-layout: fixed;
}
* {
line-height: inherit;
}
[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
}
.wrapper .footer__share-button a:hover,
.wrapper .footer__share-button a:focus {
color: #ffffff !important;
}
.btn a:hover,
.btn a:focus,
.footer__share-button a:hover,
.footer__share-button a:focus,
.email-footer__links a:hover,
.email-footer__links a:focus {
opacity: 0.8;
}
.preheader,
.header,
.layout,
.column {
transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
}
.preheader td {
padding-bottom: 8px;
}
.layout,
div.header {
max-width: 400px !important;
-fallback-width: 95% !important;
width: calc(100% - 20px) !important;
}
div.preheader {
max-width: 360px !important;
-fallback-width: 90% !important;
width: calc(100% - 60px) !important;
}
.snippet,
.webversion {
Float: none !important;
}
.stack .column {
max-width: 400px !important;
width: 100% !important;
}
.fixed-width.has-border {
max-width: 402px !important;
}
.fixed-width.has-border .layout__inner {
box-sizing: border-box;
}
.snippet,
.webversion {
width: 50% !important;
}
.ie .btn {
width: 100%;
}
.ie .stack .column,
.ie .stack .gutter {
display: table-cell;
float: none !important;
}
.ie div.preheader,
.ie .email-footer {
max-width: 560px !important;
width: 560px !important;
}
.ie .snippet,
.ie .webversion {
width: 280px !important;
}
.ie div.header,
.ie .layout {
max-width: 600px !important;
width: 600px !important;
}
.ie .two-col .column {
max-width: 300px !important;
width: 300px !important;
}
.ie .three-col .column,
.ie .narrow {
max-width: 200px !important;
width: 200px !important;
}
.ie .wide {
width: 400px !important;
}
.ie .stack.fixed-width.has-border,
.ie .stack.has-gutter.has-border {
max-width: 602px !important;
width: 602px !important;
}
.ie .stack.two-col.has-gutter .column {
max-width: 290px !important;
width: 290px !important;
}
.ie .stack.three-col.has-gutter .column,
.ie .stack.has-gutter .narrow {
max-width: 188px !important;
width: 188px !important;
}
.ie .stack.has-gutter .wide {
max-width: 394px !important;
width: 394px !important;
}
.ie .stack.two-col.has-gutter.has-border .column {
max-width: 292px !important;
width: 292px !important;
}
.ie .stack.three-col.has-gutter.has-border .column,
.ie .stack.has-gutter.has-border .narrow {
max-width: 190px !important;
width: 190px !important;
}
.ie .stack.has-gutter.has-border .wide {
max-width: 396px !important;
width: 396px !important;
}
.ie .fixed-width .layout__inner {
border-left: 0 none white !important;
border-right: 0 none white !important;
}
.ie .layout__edges {
display: none;
}
.mso .layout__edges {
font-size: 0;
}
.layout-fixed-width,
.mso .layout-full-width {
background-color: #ffffff;
}
@media only screen and (min-width: 620px) {
.column,
.gutter {
display: table-cell;
Float: none !important;
vertical-align: top;
}
div.preheader,
.email-footer {
max-width: 560px !important;
width: 560px !important;
}
.snippet,
.webversion {
width: 280px !important;
}
div.header,
.layout,
.one-col .column {
max-width: 600px !important;
width: 600px !important;
}
.fixed-width.has-border,
.fixed-width.x_has-border,
.has-gutter.has-border,
.has-gutter.x_has-border {
max-width: 602px !important;
width: 602px !important;
}
.two-col .column {
max-width: 300px !important;
width: 300px !important;
}
.three-col .column,
.column.narrow,
.column.x_narrow {
max-width: 200px !important;
width: 200px !important;
}
.column.wide,
.column.x_wide {
width: 400px !important;
}
.two-col.has-gutter .column,
.two-col.x_has-gutter .column {
max-width: 290px !important;
width: 290px !important;
}
.three-col.has-gutter .column,
.three-col.x_has-gutter .column,
.has-gutter .narrow {
max-width: 188px !important;
width: 188px !important;
}
.has-gutter .wide {
max-width: 394px !important;
width: 394px !important;
}
.two-col.has-gutter.has-border .column,
.two-col.x_has-gutter.x_has-border .column {
max-width: 292px !important;
width: 292px !important;
}
.three-col.has-gutter.has-border .column,
.three-col.x_has-gutter.x_has-border .column,
.has-gutter.has-border .narrow,
.has-gutter.x_has-border .narrow {
max-width: 190px !important;
width: 190px !important;
}
.has-gutter.has-border .wide,
.has-gutter.x_has-border .wide {
max-width: 396px !important;
width: 396px !important;
}
}
@supports (display: flex) {
@media only screen and (min-width: 620px) {
.fixed-width.has-border .layout__inner {
  display: flex !important;
}
}
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
.fblike {
background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;
}
.tweet {
background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;
}
.linkedinshare {
background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;
}
.forwardtoafriend {
background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;
}
}
@media (max-width: 321px) {
.fixed-width.has-border .layout__inner {
border-width: 1px 0 !important;
}
.layout,
.stack .column {
min-width: 320px !important;
width: 320px !important;
}
.border {
display: none;
}
.has-gutter .border {
display: table-cell;
}
}
.mso div {
border: 0 none white !important;
}
.mso .w560 .divider {
Margin-left: 260px !important;
Margin-right: 260px !important;
}
.mso .w360 .divider {
Margin-left: 160px !important;
Margin-right: 160px !important;
}
.mso .w260 .divider {
Margin-left: 110px !important;
Margin-right: 110px !important;
}
.mso .w160 .divider {
Margin-left: 60px !important;
Margin-right: 60px !important;
}
.mso .w354 .divider {
Margin-left: 157px !important;
Margin-right: 157px !important;
}
.mso .w250 .divider {
Margin-left: 105px !important;
Margin-right: 105px !important;
}
.mso .w148 .divider {
Margin-left: 54px !important;
Margin-right: 54px !important;
}
.mso .size-8,
.ie .size-8 {
font-size: 8px !important;
line-height: 14px !important;
}
.mso .size-9,
.ie .size-9 {
font-size: 9px !important;
line-height: 16px !important;
}
.mso .size-10,
.ie .size-10 {
font-size: 10px !important;
line-height: 18px !important;
}
.mso .size-11,
.ie .size-11 {
font-size: 11px !important;
line-height: 19px !important;
}
.mso .size-12,
.ie .size-12 {
font-size: 12px !important;
line-height: 19px !important;
}
.mso .size-13,
.ie .size-13 {
font-size: 13px !important;
line-height: 21px !important;
}
.mso .size-14,
.ie .size-14 {
font-size: 14px !important;
line-height: 21px !important;
}
.mso .size-15,
.ie .size-15 {
font-size: 15px !important;
line-height: 23px !important;
}
.mso .size-16,
.ie .size-16 {
font-size: 16px !important;
line-height: 24px !important;
}
.mso .size-17,
.ie .size-17 {
font-size: 17px !important;
line-height: 26px !important;
}
.mso .size-18,
.ie .size-18 {
font-size: 18px !important;
line-height: 26px !important;
}
.mso .size-20,
.ie .size-20 {
font-size: 20px !important;
line-height: 28px !important;
}
.mso .size-22,
.ie .size-22 {
font-size: 22px !important;
line-height: 31px !important;
}
.mso .size-24,
.ie .size-24 {
font-size: 24px !important;
line-height: 32px !important;
}
.mso .size-26,
.ie .size-26 {
font-size: 26px !important;
line-height: 34px !important;
}
.mso .size-28,
.ie .size-28 {
font-size: 28px !important;
line-height: 36px !important;
}
.mso .size-30,
.ie .size-30 {
font-size: 30px !important;
line-height: 38px !important;
}
.mso .size-32,
.ie .size-32 {
font-size: 32px !important;
line-height: 40px !important;
}
.mso .size-34,
.ie .size-34 {
font-size: 34px !important;
line-height: 43px !important;
}
.mso .size-36,
.ie .size-36 {
font-size: 36px !important;
line-height: 43px !important;
}
.mso .size-40,
.ie .size-40 {
font-size: 40px !important;
line-height: 47px !important;
}
.mso .size-44,
.ie .size-44 {
font-size: 44px !important;
line-height: 50px !important;
}
.mso .size-48,
.ie .size-48 {
font-size: 48px !important;
line-height: 54px !important;
}
.mso .size-56,
.ie .size-56 {
font-size: 56px !important;
line-height: 60px !important;
}
.mso .size-64,
.ie .size-64 {
font-size: 64px !important;
line-height: 63px !important;
}
</style>

<!--[if !mso]><!--><style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Karla:400,700,400italic,700italic|Montserrat:400,700,400italic);
</style><link href="https://fonts.googleapis.com/css?family=Karla:400,700,400italic,700italic|Montserrat:400,700,400italic" rel="stylesheet" type="text/css"><!--<![endif]--><style type="text/css">
body{background-color:#363f48}.logo a:hover,.logo a:focus{color:#7096b5 !important}.mso .layout-has-border{border-top:1px solid #0a0c0e;border-bottom:1px solid #0a0c0e}.mso .layout-has-bottom-border{border-bottom:1px solid #0a0c0e}.mso .border,.ie .border{background-color:#0a0c0e}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:40px !important;line-height:47px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:24px !important;line-height:32px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:20px !important;line-height:28px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Karla,Calibri,Geneva,sans-serif}
</style><meta name="robots" content="noindex,nofollow"></meta>
<meta property="og:title" content="Vatta Email"></meta>
</head>
<!--[if mso]>
<body class="mso">
<![endif]-->
<!--[if !mso]><!-->
<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
<!--<![endif]-->
<table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #363f48;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
  <div role="banner">
    <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
      <div style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
        <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #fff;font-family: Karla,Calibri,Geneva,sans-serif;">
          <div style="mso-hide:all;position:fixed;height:0;max-height:0;overflow:hidden;font-size:0;">Your Prakriti is...</div>
        </div>
      <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
        <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #fff;font-family: Karla,Calibri,Geneva,sans-serif;">
          <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.createsend1.com/t/t-e-ntljdiy-l-u/">Click here</a></p>
        </div>
      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
      </div>
    </div>
    
  </div>
  <div>
  <div style="background-color: #363f48;">
    <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #363f48;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
        <div class="column" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;">
        
    <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
      <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i1.createsend1.com/ei/t/F0/4FA/5C2/030806/csfinal/Vataj-9900000000079e3c.jpg">
    </div>
  
          <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <h2 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #363f48;font-size: 20px;line-height: 28px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;text-align: center;"><span style="color:#ffffff"><strong>Your <em>Prakriti</em> is <em>VATTAJ</em></strong></span></h2><p style="Margin-top: 16px;Margin-bottom: 0;"><span style="color:#ffffff">Dear ${name},</span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#ffffff">Before you start wondering what that&nbsp;difficult sounding word means, let me tell you that I am going to walk you through this. </span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#ffffff">So Ayurveda tells us that every person has a <em>Prakriti</em>&nbsp;or a Psychosomatic Constitution. It is quite like your horoscope, just more scientific and 
useful.&nbsp;</span></p><p style="Margin-top: 20px;Margin-bottom: 0;"><span style="color:#ffffff">Knowing your&nbsp;<em>Prakriti</em>&nbsp;can help you know what kind of diseases you are naturally prone to and what precautions you can take to prevent the same.</span></p><p style="Margin-top: 20px;Margin-bottom: 20px;"><span style="color:#ffffff">So let's get started!</span></p>
  </div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 1px;font-size: 1px;">&nbsp;</div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
      </div>
    </div>
  </div>

  <div style="background-color: #363f48;">
    <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #363f48;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
        <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 27px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
    <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;Margin-bottom: 20px;" align="center">
      <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i2.createsend1.com/ei/t/F0/4FA/5C2/030806/csfinal/personality-990000000001453c.png">
    </div>
  </div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
        <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#ffffff">Your Personality Traits</span></strong></h3>
  </div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;"><span class="font-montserrat"><span style="color:#ffffff">Creative</span></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><span style="color:#ffffff">Energetic</span></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><span style="color:#ffffff">Quick to anger</span></span></li></ul>
  </div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
      </div>
    </div>
  </div>

  <div style="background-color: #f05225;">
    <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f05225;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
        <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 32px;font-size: 1px;">&nbsp;</div>
</div>
        
    <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
      <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i3.createsend1.com/ei/t/F0/4FA/5C2/030806/csfinal/bacteria-990000000001453c.png">
    </div>
  
          <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
        <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><span style="color:#000000"><strong>Health Problems You Are Prone to</strong></span></h3>
  </div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><p class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Arthritis</span></p></li><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Migrane</span></li><li class="size-16" style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Fibermeralsia</span></li></ul>
  </div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
      </div>
    </div>
  </div>

  <div style="background-color: #363f48;">
    <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #363f48;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
        <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 47px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
    <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
      <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i4.createsend1.com/ei/t/F0/4FA/5C2/030806/csfinal/healthy-990000000001453c.png">
    </div>
  </div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
        <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#ffffff">Lifestyle&nbsp;You Should Embrace</span></strong></h3>
  </div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <ul style="Margin-top: 0;Margin-bottom: 20px;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><p style="Margin-top: 0;Margin-bottom: 20px;"><span style="color:#ffffff">Always eat your food warm</span></p></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><p style="Margin-top: 0;Margin-bottom: 20px;"><span style="color:#ffffff">Give yourself relaxing warm&nbsp;massage&nbsp;regularly</span></p></span></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;font-family: montserrat,dejavu sans,verdana,sans-serif;text-align: left;"><span class="font-montserrat"><p style="Margin-top: 0;Margin-bottom: 
20px;"><span style="color:#ffffff">Take 30 minutes nap during the day</span></p></span></li></ul>
  </div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 7px;font-size: 1px;">&nbsp;</div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
      </div>
    </div>
  </div>

  <div style="background-color: #f05225;">
    <div class="layout stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f05225;"><td class="layout__edges">&nbsp;</td><td style="width: 200px" valign="top" class="w160"><![endif]-->
        <div class="column narrow" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 19px;font-size: 1px;">&nbsp;</div>
</div>
        
    <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
      <img style="border: 0;display: block;height: auto;width: 100%;max-width: 100px;" alt="" width="100" src="https://i5.createsend1.com/ei/t/F0/4FA/5C2/030806/csfinal/49-5121-990000000001453c.png">
    </div>
  
          <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 5px;font-size: 1px;">&nbsp;</div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td style="width: 400px" valign="top" class="w360"><![endif]-->
        <div class="column wide" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #363f48;font-size: 17px;line-height: 26px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;"><strong><span style="color:#000000">Lifestyle You Should Denounce</span></strong></h3>
  </div>
</div>
        
          <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <ul style="Margin-top: 0;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><p class="size-16" style="Margin-top: 0;Margin-bottom: 0;font-size: 16px;line-height: 24px;" lang="x-size-16"><span style="color:#000000">Overeating - Eat larger quantities but do not overeat</span></p></li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><span style="color:#000000">Sweeteners - Keep sweets to a minimum and use low-fat dairy products</span></li></ul>
  </div>
</div>
        
        </div>
      <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
      </div>
    </div>
  </div>

  <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
    <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #363f48;">
    <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #363f48;"><td style="width: 600px" class="w560"><![endif]-->
      <div class="column" style="text-align: left;color: #363f48;font-size: 16px;line-height: 24px;font-family: Karla,Calibri,Geneva,sans-serif;">
    
        <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 1px;">&nbsp;</div>
</div>
    
        <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
    <h1 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #363f48;font-size: 32px;line-height: 40px;font-family: Montserrat,DejaVu Sans,Verdana,sans-serif;text-align: center;"><span style="color:#ffffff"><strong>Do you want to know more?</strong></span></h1><p style="Margin-top: 20px;Margin-bottom: 20px;text-align: center;"><span style="color:#ffffff">Read more about your Prakriti and how it can help you lead a healthier life by clicking on the link below! You can also <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #f05225;" href="https://api.whatsapp.com/send?phone=919730024284&text=Hi%20there!%20I%20want%20more%20information%20about%20Prakriti.">get in touch with our experts</a> for further assistance.</span></p>
  </div>
</div>
    
        <div style="Margin-left: 20px;Margin-right: 20px;">
  <div class="btn btn--flat fullwidth btn--large" style="Margin-bottom: 20px;text-align: center;">
    <![if !mso]><a style="border-radius: 4px;display: block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: #f05225;font-family: Karla, Calibri, Geneva, sans-serif;" href="https://modernmonk.in/meaning-of-prakriti-vikriti/">GET MORE INFO ON YOUR PRAKRITI</a><![endif]>
  <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://modernmonk.createsend1.com/t/t-l-ntljdiy-l-y/" style="width:560px" arcsize="9%" fillcolor="#F05225" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Karla,Calibri,Geneva,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">GET MORE INFO ON YOUR PRAKRITI</center></v:textbox></v:roundrect><![endif]--></div>
</div>
    
        <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 3px;font-size: 1px;">&nbsp;</div>
</div>
    
        <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
    
        <div style="Margin-left: 20px;Margin-right: 20px;">
  <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
</div>
    
      </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </div>
  </div>

  <div style="mso-line-height-rule: exactly;line-height: 17px;font-size: 17px;">&nbsp;</div>

  
  <div role="contentinfo">
    <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
        <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #fff;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
          <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
            <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
            <td style="padding: 0;width: 26px;" emb-web-links>
<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
    <img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
    <img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
    <img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
    <img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
    <img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
    <img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
</a>
</td>
            </tr></tbody></table>
            <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
              <div>Modern Monk Healthcare Pvt Ltd<br>
Koregaon Park, Pune</div>
            </div>
            <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
              <div>You are receiving this email because you took Prakriti Quiz on Modern Monk.</div>
            </div>
            <!--[if mso]>&nbsp;<![endif]-->
          </div>
        </div>
      <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
        <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #fff;font-family: Karla,Calibri,Geneva,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
          <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
            
          </div>
        </div>
      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
      </div>
    </div>
    <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
      <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
      <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
        <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #fff;font-family: Karla,Calibri,Geneva,sans-serif;">
          <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
            <div style="font-size: 12px;line-height: 19px;">
              <span><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.updatemyprofile.com/t-l-2AD73FFF-l-o" lang="en">Preferences</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.createsend1.com/t/t-u-ntljdiy-l-x/">Unsubscribe</a>
            </div>
          </div>
        </div>
      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
      </div>
    </div>
  </div>
  <div style="line-height:40px;font-size:40px;">&nbsp;</div>
</div></td></tr></tbody></table>

<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body></html>

`
}

function mail_template_footer() {
    return `
    <hr style="width: 50%">
        <center>
            <img width="200" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="">
        </center>

        <div class="vc_column-inner ">
            <div class="wpb_wrapper">
                <div class="wpb_text_column wpb_content_element ">
                    <div class="wpb_wrapper">
                        <p style="text-align: center;"><strong>Phone:</strong><a style="color: #898989;" href="tel:+91 97300 24284">+91 97300 24284</a></p>
                        <p style="text-align: center;"><strong>Email ID:</strong><a style="color: #898989;" href="mailto:support@modernmonk.in">
                                support@modernmonk.in
                            </a>
                        </p>

                    </div>
                </div>
            </div>
        </div>
        <div class="vc_row wpb_row vc_inner vc_row-fluid">
            <div class="wpb_column vc_column_container vc_col-sm-12">
                <div class="vc_column-inner ">
                    <div class="wpb_wrapper">
                        <div class="wpb_text_column wpb_content_element ">
                            <div class="wpb_wrapper">
                                <p style="text-align: center;">
                                    <a href="https://www.facebook.com/modern.monk.hq/" target="_blank" rel="noopener">
                                        <img class="alignnone wp-image-11610 size-full" style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://modernmonk.in/wp-content/uploads/2019/09/Facebook.png"
                                            alt="" width="30" height="30" />
                                    </a>
                                    <a href="https://twitter.com/modernmonk_hq" target="_blank" rel="noopener">
                                        <img style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://modernmonk.in/wp-content/uploads/2019/09/Twitter.png" alt=""
                                            width="30" height="30" />
                                    </a>
                                    <a href="https://www.instagram.com/modern_monk_hq/" target="_blank" rel="noopener">
                                        <img class="wp-image-11611 size-full alignnone" style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://modernmonk.in/wp-content/uploads/2019/09/Instagram.jpg"
                                            alt="" width="30" height="30" />
                                    </a>
                                    <a href="https://www.linkedin.com/company/modernmonk/" target="_blank" rel="noopener">
                                        <img class="alignnone wp-image-11612 size-full" style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://modernmonk.in/wp-content/uploads/2019/09/Linkedin.png"
                                            alt="" width="30" height="30" />
                                    </a>
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `;
}

function mail_template_consultation_booking(lead, coach) {
    var html_lead = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width"><style type="text/css">
@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:44px !important;line-height:50px !important}.wrapper h2{}.wrapper h2{font-size:64px !important;line-height:63px !important}.wrapper h3{}.wrapper h3{font-size:26px !important;line-height:34px !important}.column{}.column{font-size:18px !important;line-height:26px !important}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper 
.size-15{font-size:15px !important;line-height:23px !important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px 
!important;line-height:43px !important}.wrapper .size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
</style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
body {
  margin: 0;
  padding: 0;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
* {
  line-height: inherit;
}
[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
}
.wrapper .footer__share-button a:hover,
.wrapper .footer__share-button a:focus {
  color: #ffffff !important;
}
.btn a:hover,
.btn a:focus,
.footer__share-button a:hover,
.footer__share-button a:focus,
.email-footer__links a:hover,
.email-footer__links a:focus {
  opacity: 0.8;
}
.preheader,
.header,
.layout,
.column {
  transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
}
.preheader td {
  padding-bottom: 8px;
}
.layout,
div.header {
  max-width: 400px !important;
  -fallback-width: 95% !important;
  width: calc(100% - 20px) !important;
}
div.preheader {
  max-width: 360px !important;
  -fallback-width: 90% !important;
  width: calc(100% - 60px) !important;
}
.snippet,
.webversion {
  Float: none !important;
}
.stack .column {
  max-width: 400px !important;
  width: 100% !important;
}
.fixed-width.has-border {
  max-width: 402px !important;
}
.fixed-width.has-border .layout__inner {
  box-sizing: border-box;
}
.snippet,
.webversion {
  width: 50% !important;
}
.ie .btn {
  width: 100%;
}
.ie .stack .column,
.ie .stack .gutter {
  display: table-cell;
  float: none !important;
}
.ie div.preheader,
.ie .email-footer {
  max-width: 560px !important;
  width: 560px !important;
}
.ie .snippet,
.ie .webversion {
  width: 280px !important;
}
.ie div.header,
.ie .layout {
  max-width: 600px !important;
  width: 600px !important;
}
.ie .two-col .column {
  max-width: 300px !important;
  width: 300px !important;
}
.ie .three-col .column,
.ie .narrow {
  max-width: 200px !important;
  width: 200px !important;
}
.ie .wide {
  width: 400px !important;
}
.ie .stack.fixed-width.has-border,
.ie .stack.has-gutter.has-border {
  max-width: 602px !important;
  width: 602px !important;
}
.ie .stack.two-col.has-gutter .column {
  max-width: 290px !important;
  width: 290px !important;
}
.ie .stack.three-col.has-gutter .column,
.ie .stack.has-gutter .narrow {
  max-width: 188px !important;
  width: 188px !important;
}
.ie .stack.has-gutter .wide {
  max-width: 394px !important;
  width: 394px !important;
}
.ie .stack.two-col.has-gutter.has-border .column {
  max-width: 292px !important;
  width: 292px !important;
}
.ie .stack.three-col.has-gutter.has-border .column,
.ie .stack.has-gutter.has-border .narrow {
  max-width: 190px !important;
  width: 190px !important;
}
.ie .stack.has-gutter.has-border .wide {
  max-width: 396px !important;
  width: 396px !important;
}
.ie .fixed-width .layout__inner {
  border-left: 0 none white !important;
  border-right: 0 none white !important;
}
.ie .layout__edges {
  display: none;
}
.mso .layout__edges {
  font-size: 0;
}
.layout-fixed-width,
.mso .layout-full-width {
  background-color: #ffffff;
}
@media only screen and (min-width: 620px) {
  .column,
  .gutter {
    display: table-cell;
    Float: none !important;
    vertical-align: top;
  }
  div.preheader,
  .email-footer {
    max-width: 560px !important;
    width: 560px !important;
  }
  .snippet,
  .webversion {
    width: 280px !important;
  }
  div.header,
  .layout,
  .one-col .column {
    max-width: 600px !important;
    width: 600px !important;
  }
  .fixed-width.has-border,
  .fixed-width.x_has-border,
  .has-gutter.has-border,
  .has-gutter.x_has-border {
    max-width: 602px !important;
    width: 602px !important;
  }
  .two-col .column {
    max-width: 300px !important;
    width: 300px !important;
  }
  .three-col .column,
  .column.narrow,
  .column.x_narrow {
    max-width: 200px !important;
    width: 200px !important;
  }
  .column.wide,
  .column.x_wide {
    width: 400px !important;
  }
  .two-col.has-gutter .column,
  .two-col.x_has-gutter .column {
    max-width: 290px !important;
    width: 290px !important;
  }
  .three-col.has-gutter .column,
  .three-col.x_has-gutter .column,
  .has-gutter .narrow {
    max-width: 188px !important;
    width: 188px !important;
  }
  .has-gutter .wide {
    max-width: 394px !important;
    width: 394px !important;
  }
  .two-col.has-gutter.has-border .column,
  .two-col.x_has-gutter.x_has-border .column {
    max-width: 292px !important;
    width: 292px !important;
  }
  .three-col.has-gutter.has-border .column,
  .three-col.x_has-gutter.x_has-border .column,
  .has-gutter.has-border .narrow,
  .has-gutter.x_has-border .narrow {
    max-width: 190px !important;
    width: 190px !important;
  }
  .has-gutter.has-border .wide,
  .has-gutter.x_has-border .wide {
    max-width: 396px !important;
    width: 396px !important;
  }
}
@supports (display: flex) {
  @media only screen and (min-width: 620px) {
    .fixed-width.has-border .layout__inner {
      display: flex !important;
    }
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
  .fblike {
    background-image: url(https://i7.createsend1.com/static/eb/beta/13-the-blueprint-3/images/fblike@2x.png) !important;
  }
  .tweet {
    background-image: url(https://i8.createsend1.com/static/eb/beta/13-the-blueprint-3/images/tweet@2x.png) !important;
  }
  .linkedinshare {
    background-image: url(https://i10.createsend1.com/static/eb/beta/13-the-blueprint-3/images/lishare@2x.png) !important;
  }
  .forwardtoafriend {
    background-image: url(https://i9.createsend1.com/static/eb/beta/13-the-blueprint-3/images/forward@2x.png) !important;
  }
}
@media (max-width: 321px) {
  .fixed-width.has-border .layout__inner {
    border-width: 1px 0 !important;
  }
  .layout,
  .stack .column {
    min-width: 320px !important;
    width: 320px !important;
  }
  .border {
    display: none;
  }
  .has-gutter .border {
    display: table-cell;
  }
}
.mso div {
  border: 0 none white !important;
}
.mso .w560 .divider {
  Margin-left: 260px !important;
  Margin-right: 260px !important;
}
.mso .w360 .divider {
  Margin-left: 160px !important;
  Margin-right: 160px !important;
}
.mso .w260 .divider {
  Margin-left: 110px !important;
  Margin-right: 110px !important;
}
.mso .w160 .divider {
  Margin-left: 60px !important;
  Margin-right: 60px !important;
}
.mso .w354 .divider {
  Margin-left: 157px !important;
  Margin-right: 157px !important;
}
.mso .w250 .divider {
  Margin-left: 105px !important;
  Margin-right: 105px !important;
}
.mso .w148 .divider {
  Margin-left: 54px !important;
  Margin-right: 54px !important;
}
.mso .size-8,
.ie .size-8 {
  font-size: 8px !important;
  line-height: 14px !important;
}
.mso .size-9,
.ie .size-9 {
  font-size: 9px !important;
  line-height: 16px !important;
}
.mso .size-10,
.ie .size-10 {
  font-size: 10px !important;
  line-height: 18px !important;
}
.mso .size-11,
.ie .size-11 {
  font-size: 11px !important;
  line-height: 19px !important;
}
.mso .size-12,
.ie .size-12 {
  font-size: 12px !important;
  line-height: 19px !important;
}
.mso .size-13,
.ie .size-13 {
  font-size: 13px !important;
  line-height: 21px !important;
}
.mso .size-14,
.ie .size-14 {
  font-size: 14px !important;
  line-height: 21px !important;
}
.mso .size-15,
.ie .size-15 {
  font-size: 15px !important;
  line-height: 23px !important;
}
.mso .size-16,
.ie .size-16 {
  font-size: 16px !important;
  line-height: 24px !important;
}
.mso .size-17,
.ie .size-17 {
  font-size: 17px !important;
  line-height: 26px !important;
}
.mso .size-18,
.ie .size-18 {
  font-size: 18px !important;
  line-height: 26px !important;
}
.mso .size-20,
.ie .size-20 {
  font-size: 20px !important;
  line-height: 28px !important;
}
.mso .size-22,
.ie .size-22 {
  font-size: 22px !important;
  line-height: 31px !important;
}
.mso .size-24,
.ie .size-24 {
  font-size: 24px !important;
  line-height: 32px !important;
}
.mso .size-26,
.ie .size-26 {
  font-size: 26px !important;
  line-height: 34px !important;
}
.mso .size-28,
.ie .size-28 {
  font-size: 28px !important;
  line-height: 36px !important;
}
.mso .size-30,
.ie .size-30 {
  font-size: 30px !important;
  line-height: 38px !important;
}
.mso .size-32,
.ie .size-32 {
  font-size: 32px !important;
  line-height: 40px !important;
}
.mso .size-34,
.ie .size-34 {
  font-size: 34px !important;
  line-height: 43px !important;
}
.mso .size-36,
.ie .size-36 {
  font-size: 36px !important;
  line-height: 43px !important;
}
.mso .size-40,
.ie .size-40 {
  font-size: 40px !important;
  line-height: 47px !important;
}
.mso .size-44,
.ie .size-44 {
  font-size: 44px !important;
  line-height: 50px !important;
}
.mso .size-48,
.ie .size-48 {
  font-size: 48px !important;
  line-height: 54px !important;
}
.mso .size-56,
.ie .size-56 {
  font-size: 56px !important;
  line-height: 60px !important;
}
.mso .size-64,
.ie .size-64 {
  font-size: 64px !important;
  line-height: 63px !important;
}
</style>
    
  <!--[if !mso]><!--><style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic);
</style><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700italic|Roboto:400,700,400italic,700italic" rel="stylesheet" type="text/css"><!--<![endif]--><style type="text/css">
body{background-color:#fff}.logo a:hover,.logo a:focus{color:#1e2e3b !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:44px !important;line-height:50px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:64px !important;line-height:63px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:26px !important;line-height:34px !important}.mso .layout__inner,.ie .layout__inner{}.mso .layout__inner,.ie .layout__inner{font-size:18px !important;line-height:26px !important}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Roboto,Tahoma,sans-serif}
</style><meta name="robots" content="noindex,nofollow"></meta>
<meta property="og:title" content="Appointment Scheduled"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
  <body class="full-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
<!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
      <div role="banner">
        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
          <div style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
            <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #999;font-family: Roboto,Tahoma,sans-serif;">
              
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
            <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #999;font-family: Roboto,Tahoma,sans-serif;">
              <p style="Margin-top: 0;Margin-bottom: 0;">No images? <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #999;" href="https://modernmonk.createsend1.com/t/t-e-ndkhkyk-l-k/">Click here</a></p>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
        <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
          <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #41637e;font-family: Avenir,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
            <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 160px;" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="" width="160"></div>
          </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </div>
      </div>
      <div>
      <div style="background-color: #f6f4f0;background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/A3/C27/441/015859/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/A3/C27/441/015859/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 0px 0px/auto auto repeat url(https://i1.createsend1.com/ei/t/A3/C27/441/015859/csfinal/CMRetention2_ms_03.png) #f6f4f0;background-position: 0px 0px;background-image: url(https://i1.createsend1.com/ei/t/A3/C27/441/015859/csfinal/CMRetention2_ms_03.png);background-repeat: repeat;background-size: auto auto;background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i1.createsend1.com/ei/t/A3/C27/441/015859/csfinal/CMRetention2_108res_ms_05-9900000000079e3c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #f6f4f0;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #f6f4f0;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #673147;font-size: 34px;line-height: 43px;font-family: Playfair Display,Didot,Bodoni MT,Times New Roman,serif;"><em><strong>Your appointment is scheduled...</strong></em></h1>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 15px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #673147;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 29px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">

        <p style="Margin-top: 0;Margin-bottom: 0;">Dear ${lead.name},</p><p style="Margin-top: 20px;Margin-bottom: 0;">An appointment for you has been booked.</p><p style="Margin-top: 20px;Margin-bottom: 0;">Please find the details below:</p><ul style="Margin-top: 20px;Margin-bottom: 0;Margin-left: 24px;padding: 0;list-style-type: disc;"><li style="Margin-top: 20px;Margin-bottom: 0;Margin-left: 0;">`;
    if (!(lead.consultation.with == "Anjali Thakur" || lead.consultation.with == "Nikita Barve"))
        html_lead += `<strong>Type</strong>: ${lead.consultation.type}</li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;">`;

    html_lead += `<strong>With</strong>: ${lead.consultation.with}</li>`;
    if (lead.consultation.date)
        html_lead += `<li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><strong>Date</strong>: ${lead.consultation.date}</li>`;

    if (lead.consultation.time)
        html_lead += `<li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><strong>Time</strong>: ${lead.consultation.time}</li>`;

    html_lead += `<li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><strong>Mode</strong>: ${lead.consultation.mode}</li>`;

    if (lead.consultation.mode == 'In-Person') {
        html_lead += `<li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><strong>Address</strong>: ${coach.address}</li><li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><strong>Google Maps</strong>: ${coach.location}</li>`;
    }

    if (lead.consultation.payment_options) {
        if (lead.consultation.payment_options == "To be paid")
            html_lead += `<li style="Margin-top: 0;Margin-bottom: 0;Margin-left: 0;"><strong>Amount to be Paid</strong>: "Rs" + ${lead.consultation.charges}</li>`;
    }
    html_lead += `</ul><p style="Margin-top: 20px;Margin-bottom: 20px;">Kindly be available at the chosen date and time.</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 13px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <p style="Margin-top: 0;Margin-bottom: 0;">Join our <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #f6f4f0;" href="https://www.facebook.com/groups/modernmonk/">Facebook Community</a>&nbsp;to get free advice from experts on all your health and wellness related queries anytime.</p><p style="Margin-top: 20px;Margin-bottom: 0;">Thanks,</p><p style="Margin-top: 20px;Margin-bottom: 20px;">Modern Monk</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 3px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="background-color: #673147;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #673147;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #f6f4f0;font-size: 17px;line-height: 26px;font-family: Roboto,Tahoma,sans-serif;">
            
        <div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="center">
          <img class="gnd-corner-image gnd-corner-image-center gnd-corner-image-top gnd-corner-image-bottom" style="border: 0;display: block;height: auto;width: 100%;max-width: 900px;" alt="" width="600" src="https://i2.createsend1.com/ei/t/A3/C27/441/015859/csfinal/CMRetention2_108res_ms_1322-9900000000079e3c.png">
        </div>
      
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>
  
      
      <div role="contentinfo">
        <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
                <td style="padding: 0;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
		<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
		<img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
		<img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
		<img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
		<img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
		<img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
	</a>
</td>
                </tr></tbody></table>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                  <div>Modern Monk Healthcare Pvt Ltd<br>
9730024284</div>
                </div>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                  
                </div>
                <!--[if mso]>&nbsp;<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
            <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #999;font-family: Roboto,Tahoma,sans-serif;">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <div style="font-size: 12px;line-height: 19px;">
                  <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #999;" href="https://modernmonk.createsend1.com/t/t-u-ndkhkyk-l-u/">Unsubscribe</a>
                </div>
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="line-height:40px;font-size:40px;">&nbsp;</div>
    </div></td></tr></tbody></table>
  
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body></html>`;
    return html_lead;
}

function mail_template_pcos(name, risk_score) {
    var risk_factor;
    if (parseInt(risk_score) < 25) {
        risk_factor = "low";
    }
    else if (parseInt(risk_score) >= 25 && parseInt(risk_score) <= 50) {
        risk_factor = "medium";
    }
    else if (parseInt(risk_score) > 50) {
        risk_factor = "high";
    }

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title></title>
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <meta name="viewport" content="width=device-width"><style type="text/css">
@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:26px !important;line-height:34px !important}.wrapper h2{}.wrapper h2{font-size:20px !important;line-height:28px !important}.wrapper h3{}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px !important}.wrapper .size-16{font-size:16px !important;line-height:24px 
!important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper .size-40{font-size:40px !important;line-height:47px !important}.wrapper 
.size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}
</style>
    <meta name="x-apple-disable-message-reformatting">
    <style type="text/css">
body {
  margin: 0;
  padding: 0;
}
table {
  border-collapse: collapse;
  table-layout: fixed;
}
* {
  line-height: inherit;
}
[x-apple-data-detectors] {
  color: inherit !important;
  text-decoration: none !important;
}
.wrapper .footer__share-button a:hover,
.wrapper .footer__share-button a:focus {
  color: #ffffff !important;
}
.btn a:hover,
.btn a:focus,
.footer__share-button a:hover,
.footer__share-button a:focus,
.email-footer__links a:hover,
.email-footer__links a:focus {
  opacity: 0.8;
}
.preheader,
.header,
.layout,
.column {
  transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;
}
.preheader td {
  padding-bottom: 8px;
}
.layout,
div.header {
  max-width: 400px !important;
  -fallback-width: 95% !important;
  width: calc(100% - 20px) !important;
}
div.preheader {
  max-width: 360px !important;
  -fallback-width: 90% !important;
  width: calc(100% - 60px) !important;
}
.snippet,
.webversion {
  Float: none !important;
}
.stack .column {
  max-width: 400px !important;
  width: 100% !important;
}
.fixed-width.has-border {
  max-width: 402px !important;
}
.fixed-width.has-border .layout__inner {
  box-sizing: border-box;
}
.snippet,
.webversion {
  width: 50% !important;
}
.ie .btn {
  width: 100%;
}
.ie .stack .column,
.ie .stack .gutter {
  display: table-cell;
  float: none !important;
}
.ie div.preheader,
.ie .email-footer {
  max-width: 560px !important;
  width: 560px !important;
}
.ie .snippet,
.ie .webversion {
  width: 280px !important;
}
.ie div.header,
.ie .layout {
  max-width: 600px !important;
  width: 600px !important;
}
.ie .two-col .column {
  max-width: 300px !important;
  width: 300px !important;
}
.ie .three-col .column,
.ie .narrow {
  max-width: 200px !important;
  width: 200px !important;
}
.ie .wide {
  width: 400px !important;
}
.ie .stack.fixed-width.has-border,
.ie .stack.has-gutter.has-border {
  max-width: 602px !important;
  width: 602px !important;
}
.ie .stack.two-col.has-gutter .column {
  max-width: 290px !important;
  width: 290px !important;
}
.ie .stack.three-col.has-gutter .column,
.ie .stack.has-gutter .narrow {
  max-width: 188px !important;
  width: 188px !important;
}
.ie .stack.has-gutter .wide {
  max-width: 394px !important;
  width: 394px !important;
}
.ie .stack.two-col.has-gutter.has-border .column {
  max-width: 292px !important;
  width: 292px !important;
}
.ie .stack.three-col.has-gutter.has-border .column,
.ie .stack.has-gutter.has-border .narrow {
  max-width: 190px !important;
  width: 190px !important;
}
.ie .stack.has-gutter.has-border .wide {
  max-width: 396px !important;
  width: 396px !important;
}
.ie .fixed-width .layout__inner {
  border-left: 0 none white !important;
  border-right: 0 none white !important;
}
.ie .layout__edges {
  display: none;
}
.mso .layout__edges {
  font-size: 0;
}
.layout-fixed-width,
.mso .layout-full-width {
  background-color: #ffffff;
}
@media only screen and (min-width: 620px) {
  .column,
  .gutter {
    display: table-cell;
    Float: none !important;
    vertical-align: top;
  }
  div.preheader,
  .email-footer {
    max-width: 560px !important;
    width: 560px !important;
  }
  .snippet,
  .webversion {
    width: 280px !important;
  }
  div.header,
  .layout,
  .one-col .column {
    max-width: 600px !important;
    width: 600px !important;
  }
  .fixed-width.has-border,
  .fixed-width.x_has-border,
  .has-gutter.has-border,
  .has-gutter.x_has-border {
    max-width: 602px !important;
    width: 602px !important;
  }
  .two-col .column {
    max-width: 300px !important;
    width: 300px !important;
  }
  .three-col .column,
  .column.narrow,
  .column.x_narrow {
    max-width: 200px !important;
    width: 200px !important;
  }
  .column.wide,
  .column.x_wide {
    width: 400px !important;
  }
  .two-col.has-gutter .column,
  .two-col.x_has-gutter .column {
    max-width: 290px !important;
    width: 290px !important;
  }
  .three-col.has-gutter .column,
  .three-col.x_has-gutter .column,
  .has-gutter .narrow {
    max-width: 188px !important;
    width: 188px !important;
  }
  .has-gutter .wide {
    max-width: 394px !important;
    width: 394px !important;
  }
  .two-col.has-gutter.has-border .column,
  .two-col.x_has-gutter.x_has-border .column {
    max-width: 292px !important;
    width: 292px !important;
  }
  .three-col.has-gutter.has-border .column,
  .three-col.x_has-gutter.x_has-border .column,
  .has-gutter.has-border .narrow,
  .has-gutter.x_has-border .narrow {
    max-width: 190px !important;
    width: 190px !important;
  }
  .has-gutter.has-border .wide,
  .has-gutter.x_has-border .wide {
    max-width: 396px !important;
    width: 396px !important;
  }
}
@supports (display: flex) {
  @media only screen and (min-width: 620px) {
    .fixed-width.has-border .layout__inner {
      display: flex !important;
    }
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {
  .fblike {
    background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;
  }
  .tweet {
    background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;
  }
  .linkedinshare {
    background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;
  }
  .forwardtoafriend {
    background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;
  }
}
@media (max-width: 321px) {
  .fixed-width.has-border .layout__inner {
    border-width: 1px 0 !important;
  }
  .layout,
  .stack .column {
    min-width: 320px !important;
    width: 320px !important;
  }
  .border {
    display: none;
  }
  .has-gutter .border {
    display: table-cell;
  }
}
.mso div {
  border: 0 none white !important;
}
.mso .w560 .divider {
  Margin-left: 260px !important;
  Margin-right: 260px !important;
}
.mso .w360 .divider {
  Margin-left: 160px !important;
  Margin-right: 160px !important;
}
.mso .w260 .divider {
  Margin-left: 110px !important;
  Margin-right: 110px !important;
}
.mso .w160 .divider {
  Margin-left: 60px !important;
  Margin-right: 60px !important;
}
.mso .w354 .divider {
  Margin-left: 157px !important;
  Margin-right: 157px !important;
}
.mso .w250 .divider {
  Margin-left: 105px !important;
  Margin-right: 105px !important;
}
.mso .w148 .divider {
  Margin-left: 54px !important;
  Margin-right: 54px !important;
}
.mso .size-8,
.ie .size-8 {
  font-size: 8px !important;
  line-height: 14px !important;
}
.mso .size-9,
.ie .size-9 {
  font-size: 9px !important;
  line-height: 16px !important;
}
.mso .size-10,
.ie .size-10 {
  font-size: 10px !important;
  line-height: 18px !important;
}
.mso .size-11,
.ie .size-11 {
  font-size: 11px !important;
  line-height: 19px !important;
}
.mso .size-12,
.ie .size-12 {
  font-size: 12px !important;
  line-height: 19px !important;
}
.mso .size-13,
.ie .size-13 {
  font-size: 13px !important;
  line-height: 21px !important;
}
.mso .size-14,
.ie .size-14 {
  font-size: 14px !important;
  line-height: 21px !important;
}
.mso .size-15,
.ie .size-15 {
  font-size: 15px !important;
  line-height: 23px !important;
}
.mso .size-16,
.ie .size-16 {
  font-size: 16px !important;
  line-height: 24px !important;
}
.mso .size-17,
.ie .size-17 {
  font-size: 17px !important;
  line-height: 26px !important;
}
.mso .size-18,
.ie .size-18 {
  font-size: 18px !important;
  line-height: 26px !important;
}
.mso .size-20,
.ie .size-20 {
  font-size: 20px !important;
  line-height: 28px !important;
}
.mso .size-22,
.ie .size-22 {
  font-size: 22px !important;
  line-height: 31px !important;
}
.mso .size-24,
.ie .size-24 {
  font-size: 24px !important;
  line-height: 32px !important;
}
.mso .size-26,
.ie .size-26 {
  font-size: 26px !important;
  line-height: 34px !important;
}
.mso .size-28,
.ie .size-28 {
  font-size: 28px !important;
  line-height: 36px !important;
}
.mso .size-30,
.ie .size-30 {
  font-size: 30px !important;
  line-height: 38px !important;
}
.mso .size-32,
.ie .size-32 {
  font-size: 32px !important;
  line-height: 40px !important;
}
.mso .size-34,
.ie .size-34 {
  font-size: 34px !important;
  line-height: 43px !important;
}
.mso .size-36,
.ie .size-36 {
  font-size: 36px !important;
  line-height: 43px !important;
}
.mso .size-40,
.ie .size-40 {
  font-size: 40px !important;
  line-height: 47px !important;
}
.mso .size-44,
.ie .size-44 {
  font-size: 44px !important;
  line-height: 50px !important;
}
.mso .size-48,
.ie .size-48 {
  font-size: 48px !important;
  line-height: 54px !important;
}
.mso .size-56,
.ie .size-56 {
  font-size: 56px !important;
  line-height: 60px !important;
}
.mso .size-64,
.ie .size-64 {
  font-size: 64px !important;
  line-height: 63px !important;
}
</style>
    
  <!--[if !mso]><!--><style type="text/css">
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400);
</style><link href="https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400" rel="stylesheet" type="text/css"><!--<![endif]--><style type="text/css">
body{background-color:#eff0ed}.logo a:hover,.logo a:focus{color:#859bb1 !important}.mso .layout-has-border{border-top:1px solid #bec2b5;border-bottom:1px solid #bec2b5}.mso .layout-has-bottom-border{border-bottom:1px solid #bec2b5}.mso .border,.ie .border{background-color:#bec2b5}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:26px !important;line-height:34px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:20px !important;line-height:28px !important}.mso h3,.ie h3{}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Open Sans,sans-serif}
</style><meta name="robots" content="noindex,nofollow"></meta>
<meta property="og:title" content="PCOS Quiz"></meta>
</head>
<!--[if mso]>
  <body class="mso">
<![endif]-->
<!--[if !mso]><!-->
  <body class="half-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">
<!--<![endif]-->
    <table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #eff0ed;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>
      <div role="banner">
        <div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">
          <div style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]-->
            <div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #968f8b;font-family: Open Sans,sans-serif;">
              
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 280px" valign="top"><![endif]-->
            <div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #968f8b;font-family: Open Sans,sans-serif;">
              
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">
        <!--[if (mso)|(IE)]><table align="center" class="header" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 600px"><![endif]-->
          <div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">
            <div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 134px;" src="https://modernmonk.in/wp-content/uploads/2019/07/Monk.png" alt="Modern Monk" width="134"></div>
          </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </div>
      </div>
      <div>
      <div style="background-color: #ffffff;">
        <div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background-color: #ffffff;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]-->
            <div class="column" style="text-align: left;color: #808285;font-size: 14px;line-height: 21px;font-family: Open Sans,sans-serif;">
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 12px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <h3 style="Margin-top: 0;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #808285;font-size: 16px;line-height: 24px;">Dear ${name},</h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 1px;font-size: 1px;">&nbsp;</div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <h3 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #808285;font-size: 16px;line-height: 24px;font-family: open sans,sans-serif;text-align: left;"><span class="font-open-sans"><strong>Congratulations on taking the first powerful action step towards understanding your health!</strong></span></h3><p style="Margin-top: 12px;Margin-bottom: 0;">Your PCOS assessment score is <strong>${risk_score}/100</strong>. This means&nbsp;you may be at ${risk_factor} risk for one or more symptoms of PCOS. &nbsp;</p><p style="Margin-top: 20px;Margin-bottom: 20px;">Watch this video to understand what it means.</p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div class="video" style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;Margin-bottom: 20px;">
        <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #00afd1;" href="https://www.youtube.com/watch?v=gDAfurW_O34"><img style="display: block;height: auto;width: 100%;border: 0;" src="https://i.vimeocdn.com/filter/overlay?src=http://img.youtube.com/vi/gDAfurW_O34/0.jpg&src=https://integrationstore-b0c3f53658fe7a75.microservice.createsend.com/files/9392B9D9-F380-42FC-9571-7E109B7A1C26/youtube-play-button-overlay.png" alt="" width="560"></a>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <p style="Margin-top: 0;Margin-bottom: 0;font-family: open sans,sans-serif;"><span class="font-open-sans">If this is your first time learning about PCOS, you probably feel scared or worried by your results. I totally understand. But, trust me, you can heal and reverse your symptoms, naturally and permanently. <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #00afd1;" href="http://modernmonk.in/pcos
">Click here to learn more</a>.</span></p><p style="Margin-top: 20px;Margin-bottom: 0;font-family: open sans,sans-serif;"><span class="font-open-sans">The first step in treating any health issue is to find out the root cause.</span></p><h3 style="Margin-top: 20px;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #808285;font-size: 16px;line-height: 24px;"><span 
style="color:#808285"><strong>Now that you understand the cause of your symptoms...you are <em>finally</em> empowered to treat them! &nbsp;</strong></span></h3><p style="Margin-top: 12px;Margin-bottom: 0;font-family: open sans,sans-serif;"><span class="font-open-sans">TAKE EXPERT HELP to heal your symptoms.</span></p><h3 style="Margin-top: 20px;Margin-bottom: 12px;font-style: normal;font-weight: normal;color: #808285;font-size: 16px;line-height: 24px;"><span style="color:#808285"><strong>Book a FREE consultation with us to get started on your healing path.&nbsp;</strong></span></h3>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: center;">
        <![if !mso]><a style="border-radius: 4px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: #f05225;font-family: Open Sans, sans-serif;" href="https://modernmonk.in/book-pcos-consultation/">Book Free Consultation</a><![endif]>
      <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="https://modernmonk.in/book-pcos-consultation/" style="width:211px" arcsize="9%" fillcolor="#F05225" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,11px,0px,11px"><center style="font-size:14px;line-height:24px;color:#FFFFFF;font-family:Open Sans,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">Book Free Consultation</center></v:textbox></v:roundrect><![endif]--></div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;">
        <p style="Margin-top: 0;Margin-bottom: 0;font-family: open sans,sans-serif;"><span class="font-open-sans">Join our <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #00afd1;" href="https://www.facebook.com/groups/modernmonk/">Facebook community</a> to connect with like-minded women interested in natural PCOS health solutions, ask questions and support each other.</span></p><p style="Margin-top: 20px;Margin-bottom: 0;font-family: open sans,sans-serif;"><span class="font-open-sans">Take back the power over your health!</span></p><p style="Margin-top: 20px;Margin-bottom: 0;font-family: open sans,sans-serif;"><span class="font-open-sans">Love,</span></p><p style="Margin-top: 20px;Margin-bottom: 20px;font-family: open sans,sans-serif;"><span class="font-open-sans">Anjali Thakur</span></p>
      </div>
    </div>
            
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 12px;">
      <div style="mso-line-height-rule: exactly;line-height: 5px;font-size: 1px;">&nbsp;</div>
    </div>
            
            </div>
          <!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]-->
          </div>
        </div>
      </div>
  
      <div style="mso-line-height-rule: exactly;line-height: 30px;font-size: 30px;">&nbsp;</div>
  
      
      <div role="contentinfo">
        <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #968f8b;font-family: Open Sans,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation">
                <td style="padding: 0;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.facebook.com/modern.monk.hq">
		<img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://twitter.com/modernmonk_hq">
		<img style="border: 0;" src="https://i3.createsend1.com/static/eb/master/13-the-blueprint-3/images/twitter.png" width="26" height="26" alt="Twitter">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.youtube.com/channel/UCHaUIiaUplHcxqxpipo8LaA">
		<img style="border: 0;" src="https://i4.createsend1.com/static/eb/master/13-the-blueprint-3/images/youtube.png" width="26" height="26" alt="YouTube">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.instagram.com/be_a_modern_monk/">
		<img style="border: 0;" src="https://i5.createsend1.com/static/eb/master/13-the-blueprint-3/images/instagram.png" width="26" height="26" alt="Instagram">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://www.linkedin.com/company/modernmonk/">
		<img style="border: 0;" src="https://i6.createsend1.com/static/eb/master/13-the-blueprint-3/images/linkedin.png" width="26" height="26" alt="LinkedIn">
	</a>
</td>
<td style="padding: 0 0 0 3px;width: 26px;" emb-web-links>
	<a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #fff;" href="https://modernmonk.in">
		<img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website">
	</a>
</td>
                </tr></tbody></table>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">
                  <div>Modern Monk Healthcare Pvt Ltd<br>
Koregaon Park, Pune</div>
                </div>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                  <div>You are receiving this email because you took a quiz on modernmonk.in</div>
                </div>
                <!--[if mso]>&nbsp;<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #968f8b;font-family: Open Sans,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
            <div class="column" style="text-align: left;font-size: 12px;line-height: 19px;color: #968f8b;font-family: Open Sans,sans-serif;">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                <div style="font-size: 12px;line-height: 19px;">
                  <a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #968f8b;" href="https://modernmonk.createsend1.com/t/t-u-niyhtx-l-b/">Unsubscribe</a>
                </div>
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="line-height:40px;font-size:40px;">&nbsp;</div>
    </div></td></tr></tbody></table>
  
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/global/polyfill/polyfill.min.js?h=F945BCD820191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/tsb.min.js?h=354E27EC20191204125554"></script>
<script type="text/javascript" src="https://js.createsend1.com/js/compiled/app/content/emailPreview-iframe.min.js?h=B3949D4520191204125554" data-model='{"Scrollbars":true}'></script>
</body></html>`;
}

function resetToWeekday(date_str) {
    var date = new Date(date_str);
    var day = date.getDay();

    if (day == 0)
        date_str = incr_date(date_str, 1);
    else if (day == 6)
        date_str = incr_date(date_str, -1);

    return date_str;
}

function jumpToMonday(date_str) {
    var date = new Date(date_str);
    var day = date.getDay();

    if (day == 0)
        date_str = incr_date(date_str, 1);
    else if (day == 6)
        date_str = incr_date(date_str, 2);

    return date_str;
}


/*Test Section*/
app.get('/viharasessionstest', urlencodedParser, function (req, res) {
    var names = [
        { name: "Reetu shrivastav", phone: "9950032671" },
{ name: "Akash	", phone: "9427483070" },
{ name: "Vikramjit Mitra	", phone: "8013196517" },
{ name: "Rushita	", phone: "9833246005" },
{ name: "Charu Sahu	", phone: "8349795477" },
{ name: "Priyanka	", phone: "6394883916" },
{ name: "Sareeta	", phone: "8872467766" },
{ name: "Satish samanta	", phone: "8249003143" },
{ name: "Sneha aggarwal	", phone: "9882095400" },
{ name: "Arvind	", phone: "8319980249" },
{ name: "Vinita	", phone: "8896667969" },
{ name: "Jayshree Thakkar	", phone: "9898652837" },
{ name: "Meenakshi	", phone: "9625628564" },
{ name: "Sobha	", phone: "8917268911" },
{ name: "Swati	", phone: "9822353325" }
];

    var names1 = [
        { name: "    Rahul Mistry", phone: "9714025998" },
        { name: "Prajwala zalaki	", phone: "8095173176" },
        { name: "Neetu	", phone: "7011359259" },
        { name: "Shweta	", phone: "7387994972" },
        { name: "Yanshika	", phone: "9729732430" },
        { name: "Jisha das	", phone: "9875300927" },
        { name: "Sapna	", phone: "7977783623" },
        { name: "Hasmukh	", phone: "7095230004" },
        { name: "xyz	", phone: "8999642358" },
        { name: "Deepthi	", phone: "9650256680" }
    ];

    var names2 = [
        { name: "shradha gandhi	", phone: "7588359039" },
        { name: "Jyoti Kshatriya	", phone: "7588379104" },
        { name: "Prajwala zalaki	", phone: "8095173176" },
        { name: "Ghalia ali	", phone: "9177787675" },
        { name: "Rajakishore Sahoo	", phone: "6360702749" },
        { name: "Srija	", phone: "7010432228" },
        { name: "Rakhi	", phone: "8871175825" },
        { name: "Tania Kapahi	", phone: "9682599040" },
        { name: "Jia Jethwani	", phone: "8769639188" },
        { name: "Megha	", phone: "8805019600" },
        { name: "Shalini	", phone: "8430430222" },
        { name: "vinita Keshri	", phone: "9334440990" },
        { name: "Bindiya	", phone: "7408978646" },
        { name: "Savita	", phone: "9935594357" },
        { name: "Rimi Mukherjee	", phone: "7980156170" },
        { name: "Priya jain	", phone: "7000839630" },
        { name: "Megha	", phone: "9875391596" },
        { name: "Suhaani	", phone: "7974164384" }
    ];

    var names3 = [
        { name: "Varsha	", phone: "8076351830" },
        { name: "Anshuka Anand	", phone: "7489121269" },
        { name: "Sonam	", phone: "9899479281" },
        { name: "Minakshi	", phone: "9439395228" },
        { name: "Shalu	", phone: "7976599760" },
        { name: "Money Bhalla	", phone: "8826847119" },
        { name: "Maitri	", phone: "9033980241" },
        { name: "Charitha	", phone: "9449424204" },
        { name: "Jaspreet	", phone: "7773000322" },
        { name: "Kavya	", phone: "9740382683" },
        { name: "Sameena	", phone: "9841665490" },
        { name: "Shivani	", phone: "9812752011" },
        { name: "Minakshi Acharya	", phone: "7828428080" },
        { name: "Misti	", phone: "6207874719" },
        { name: "Gayatri	", phone: "9440881289" },
        { name: "odagaon taekwondo academy dibya ranjan barad	", phone: "7978504365" },
        { name: "Aadarsha	", phone: "8495047995" },
        { name: "Simmy	", phone: "7015139768" },
        { name: "Piu bag	", phone: "8597322061" },
        { name: "Latika	", phone: "9953867457" },
        { name: "tenzin choedon	", phone: "9307860080" },
        { name: "Thamarai	", phone: "8248425373" },
        { name: "Renuka	", phone: "8879391341" },
        { name: "Amita ohri	", phone: "9815958552" },
        { name: "Priya jain	", phone: "7000839630" },
        { name: "Ritu	", phone: "9311336652" },
        { name: "pratibha	", phone: "9990233357" }
    ];

    //8-9
    for (var i = 0; i < names.length; i++) {
        //Message 2
        var d = new Date();
        d.setHours(7, 30);

        schedule.scheduleJob(d, function () {
            var message = "Dear " + names[i].name + ", your Vihara class with Raro George starts in 30 minutes. Link to join: https://zoom.us/j/92460594661";
                message += ". BTW, we hope you've taken your pre-workout!";

            send_sms(message, names[i].phone);
                })

        //Message 3
        d = new Date();
        d.setHours(7, 54);

        schedule.scheduleJob(d, function () {
            var message = "Dear " + names[i].name + ", your Vihara class with Raro George starts in 5 minutes. Link to join: https://zoom.us/j/92460594661";
            message += ". PS. If you're joining from mobile, do download the Zoom app!";

            send_sms(message, names[i].phone);
        })
    }

    //11-12
    for (var i = 0; i < names1.length; i++) {
        //Message 1
        var d = new Date();
        d.setHours(9);
        schedule.scheduleJob(d, function () {
            var message = "Dear " + names1[i].name + ", your Vihara class with Raro George starts in 2 hours. Join our WA Group for more info: https://chat.whatsapp.com/FBjpQc8Jvku5ngGpQufjnu";
            send_sms(message, names1[i].phone);
        })


        //Message 2
        d.setHours(10, 30);
        schedule.scheduleJob(d, function () {
            var message = "Dear " + names1[i].name + ", your Vihara class with Raro George starts in 30 minutes. Link to join: https://zoom.us/j/94318966289";
            message += ". BTW, we hope you've taken your pre-workout!";

            send_sms(message, names1[i].phone);
        })

        //Message 3
        d = new Date();
        d.setHours(10, 54);

        schedule.scheduleJob(d, function () {
            var message = "Dear " + names1[i].name + ", your Vihara class with Raro George starts in 5 minutes. Link to join: https://zoom.us/j/94318966289";
            message += ". PS. If you're joining from mobile, do download the Zoom app!";

            send_sms(message, names1[i].phone);
        })
    }

    //16-17
    for (var i = 0; i < names2.length; i++) {
        //Message 2
        var d = new Date();
        d.setHours(14);
        schedule.scheduleJob(d, function () {
            var message = "Dear " + names2[i].name + ", your Vihara class with Raro George starts in 2 hours. Join our WA Group for more info: https://chat.whatsapp.com/DbPyfrZ9CKvExAVUmCXNUs";
            send_sms(message, names2[i].phone);
        })


        d.setHours(15, 30);
        schedule.scheduleJob(d, function () {
            var message = "Dear " + names2[i].name + ", your Vihara class with Raro George starts in 30 minutes. Link to join: https://zoom.us/j/95152185589";
            message += ". BTW, we hope you've taken your pre-workout!";

            send_sms(message, names2[i].phone);
        })

        //Message 3
        d = new Date();
        d.setHours(15, 54);

        schedule.scheduleJob(d, function () {
            var message = "Dear " + names2[i].name + ", your Vihara class with Raro George starts in 5 minutes. Link to join: https://zoom.us/j/95152185589";
            message += ". PS. If you're joining from mobile, do download the Zoom app!";

            send_sms(message, names2[i].phone);
        })
    }

    //17-18
    for (var i = 0; i < names3.length; i++) {
        //Message 2
        var d = new Date();
        d.setHours(15);
        schedule.scheduleJob(d, function () {
            var message = "Dear " + names3[i].name + ", your Vihara class with Raro George starts in 2 hours. Join our WA Group for more info: https://chat.whatsapp.com/DbPyfrZ9CKvExAVUmCXNUs";
            send_sms(message, names3[i].phone);
        })


  d.setHours(16, 30);
        schedule.scheduleJob(d, function () {
            var message = "Dear " + names3[i].name + ", your Vihara class with Raro George starts in 30 minutes. Link to join: https://zoom.us/j/91122052255";
            message += ". BTW, we hope you've taken your pre-workout!";

            send_sms(message, names3[i].phone);
        })

        //Message 3
        d = new Date();
        d.setHours(16, 54);

        schedule.scheduleJob(d, function () {
            var message = "Dear " + names3[i].name + ", your Vihara class with Raro George starts in 5 minutes. Link to join: https://zoom.us/j/91122052255";
            message += ". PS. If you're joining from mobile, do download the Zoom app!";

            send_sms(message, names3[i].phone);
        })
    }

    res.send("scheduled");
})

app.get('/viharatest', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/test/add_plan.html");
    //send_sms("Hey", 7376191262);
})

//Desc: This URL shows how to fetch an HTML kept in another folder.
//To figure out: How to pass on the variables from here so that we can get the final HTML that we can directly use.
app.get('/test_appointment', urlencodedParser, function (req, res) {
    const user = require('./html/user');
    res.send(user.getHTML());
})

app.get('/test', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/test.html");
})

app.get('/test_test', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "reschedule_test.html");
})





function _scheduleViharaReminders(date, phone, coachName, timeLeft, joinURL) {
    schedule.scheduleJob(date, function () {
        console.log("Executing SMS Reminder for " + phone);

        var leadRef = db.collection('leads').doc(phone);
        var getDoc = leadRef.get()
            .then(doc => {
                if (!doc.exists) { }
                else {
                    var message = "";
                    if (timeLeft == "morning") {
                        message = "Dear " + doc.data().name + ", remember, you have a morning 7am Vihara class with " + coachName + ". Don't forget to set 3 alarms. Link to join: " + joinURL;
                    }
                    else {
                        message = "Dear " + doc.data().name + ", your Vihara class with " + coachName + " starts in " + timeLeft + ". Link to join: " + joinURL;
                    }

                    //Pre workout reminder
                    if (timeLeft == "30 minutes")
                        message += ". BTW, we hope you've taken your pre-workout!"
                    else if (timeLeft == "5 minutes")
                        message += ". PS. If you're joining from mobile, do download the Zoom app!";

                    send_sms(message, phone);
                }
            })
    })
}

function scheduleViharaReminders(phone, classType, coachName, joinURL, classDate) {
    var date = new Date();
    var classTime = classDate.getHours();

    //Schedule Reminder 1
    //1 Night before
    if (classTime == 7) {
        date.setHours(classTime - 9, 0, 0, 0);
        _scheduleViharaReminders(date, phone, coachName, "morning", joinURL);
    }
    //2 hours before the session
    else {
    date.setHours(classTime - 2, 0, 0, 0);
    _scheduleViharaReminders(date, phone, coachName,"2 hours", joinURL);
    }

    //Schedule Reminder 2 - 30 minutes before the session
    date.setHours(classTime - 1, 30, 0, 0);
    _scheduleViharaReminders(date, phone, coachName, "30 minutes", joinURL);

    //Schedule Reminder 3 - 5 minutes before the session
    date.setHours(classTime - 1, 55, 0, 0);
    _scheduleViharaReminders(date, phone, coachName, "5 minutes", joinURL);
}

function scheduleReminder(lead, coach) {
    var date_parts = lead.consultation.date.split("-");

    var date = new Date(                // For appointment at 9 o'clock
        parseInt(date_parts[0], 10),      // year
        parseInt(date_parts[1], 10) - 1,  // month (starts with 0)
        parseInt(date_parts[2], 10),      // date
        09,                               // hour
        00,                               // minute
        00                                // seconds
    );

    if (lead.consultation.time) {
        var time_parts = lead.consultation.time.split(":");

        date = new Date(
            parseInt(date_parts[0], 10),      // year
            parseInt(date_parts[1], 10) - 1,  // month (starts with 0)
            parseInt(date_parts[2], 10),      // date
            parseInt(time_parts[0], 10) - 1,      // hour
            parseInt(time_parts[1], 10),      // minute
            00                                // seconds
        );
    }

    //Schedule a mail to be sent on the date of the appointment
    schedule.scheduleJob(date, function () {
        if (lead.consultation.date) {
            var html_lead = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${lead.name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;`;

            html_lead += `Your consultation is scheduled for today.
<br>
Kindly be available at the chosen date and time.
<br><br>
Cheers,<br>
Modern Monk
`;

            var coachName = coach.coach_name ? coach.coach_name : coach.name;

            var html_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${coachName},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;`;

            html_coach += `A consultation with you is scheduled for today</b>.
<br>
Kindly be available at the chosen date and time.
<br><br>
Cheers,<br>
Modern Monk
`;

            var mailOptions_lead = {
                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                to: lead.email,
                subject: 'Your Appointment Today | Modern Monk',
                html: html_lead
            }

            var mailOptions_coach = {
                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                to: coach.email,
                subject: 'Appointment Today | Modern Monk',
                html: html_coach
            }

            //Send SMS
            var message = "Dear " + lead.name + ", your consultation with " +
                coachName + " is scheduled for today. Kindly be available at the chosen time.";
                      
            //Prepare alternative set of variables in case the time is there
            if (lead.consultation.time) {
                html_lead = ``;
                html_lead += `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${lead.name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;`;

                html_lead += `Your consultation is scheduled in one hour from now</b>.
<br>
Kindly be available for the same.
<br><br>
Cheers,<br>
Modern Monk
`;

                html_coach = ``;
                html_coach += `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${coachName},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;`;

                html_coach += `A consultation with you is scheduled in one hour from now</b>.
<br>
Kindly be available for the same.
<br><br>
Cheers,<br>
Modern Monk
`;

                mailOptions_lead.subject = '1 Hour to go for Your Appointment';
                mailOptions_coach.subject = '1 Hour to go for Your Appointment';

                message = "Dear " + lead.name + ", your consultation with " +
                    coachName + " is scheduled for today at " + lead.consultation.time;
                message += ". Kindly be available.";

            }

            transporter.sendMail(mailOptions_lead, (err, info) => {
                transporter.close();
                if (err) {
                    console.log(err);
                } else {
                    console.log('Reminder sent to Lead: ' + info.response);
                }
            });

            send_sms(message, lead.phone);

            transporter.sendMail(mailOptions_coach, (err, info) => {
                transporter.close();
                if (err) {
                    console.log(err);
                } else {
                    console.log('Reminder sent to Coach: ' + info.response);
                }
            });
        }
    })
}

//Find the nearest day ahead of the date. 
//For example, if date == 29th Mar(Sunday) and day == 2, nearest Tuesday = 31st Mar
function nextDayOfTheWeek(date, day) {
    //Find how far ahead is day of date
    var diff = date.getDay() - day;

    if (diff < 0) {
        diff = diff + 7;
    }

    var newDate = incr_date(changeTimestampToString(date), diff);
    //Check if new Date(newDate) works, otherwise we'll have to create the new date object the way it's done in incr_date() and then return it
    return new Date(newDate);
}

function incr_date(date_str, to_add) {
    var parts = date_str.split("-");
    var dt = new Date(
        parseInt(parts[0], 10),      // year
        parseInt(parts[1], 10) - 1,  // month (starts with 0)
        parseInt(parts[2], 10)       // date
    );
    dt.setDate(dt.getDate() + to_add);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
        parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
        parts[2] = "0" + parts[2];
    }
    return parts.join("-");
}

function changeTimestampToString(today) {
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;

    return today;
}

//Home
app.get('/operations', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/operations/" + "operations.html");
})

app.get('/sales', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales/" + "sales.html");
})

app.get('/support', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "support.html");
})




//Coaches->Achara Coaches->Vanditha Mohanan
app.get('/vandithamohanan', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "vandithamohanan.html");
})

app.get('/vandithamohanan/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "plans.html");
})

app.get('/vandithamohanan/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "calls.html");
})

app.get('/vandithamohanan/mypoints', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "points.html");
})

app.get('/vandithamohanan/points_history', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "points_history.html");
})

app.get('/vandithamohanan/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "submit_review.html");
})

app.get('/vandithamohanan/mass_mail', function (req, res) {
    res.sendFile(__dirname + "/coaches/vanditha_mohanan/" + "mass_mail.html");
})


//Coaches->Achara Coaches->Vanditha Mohanan
app.get('/tanveejadhav', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "tanveejadhav.html");
})

app.get('/tanveejadhav/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "plans.html");
})

app.get('/tanveejadhav/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "calls.html");
})

app.get('/tanveejadhav/mypoints', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "points.html");
})

app.get('/tanveejadhav/points_history', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "points_history.html");
})

app.get('/tanveejadhav/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "submit_review.html");
})

app.get('/tanveejadhav/mass_mail', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "mass_mail.html");
})

app.get('/tanveejadhav/active_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "active_users.html");
})

app.get('/tanveejadhav/historical_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/tanvee_jadhav/" + "historical_users.html");
})




//Coaches->Achara Coaches->Shalini Kaushik
app.get('/shalini_kaushik', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "shalini_kaushik.html");
})

app.get('/shalini_kaushik/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "plans.html");
})

app.get('/shalini_kaushik/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "calls.html");
})

app.get('/shalini_kaushik/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "submit_review.html");
})

app.get('/shalini_kaushik/mass_mail', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "mass_mail.html");
})

app.get('/shalini_kaushik/active_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "active_users.html");
})

app.get('/shalini_kaushik/historical_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "historical_users.html");
})

app.get('/shalini_kaushik/send_prescription', function (req, res) {
    res.sendFile(__dirname + "/coaches/shalini_kaushik/" + "send_prescription.html");
})

app.post('/shalini_kaushik/send_prescription', function (req, res) {
    const doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream('output.pdf'));

    // Embed a font, set the font size, and render some text
    doc.font(__dirname + "\\fonts\\montserrat\\Montserrat-Black.otf")
        .fontSize(25)
        .text('Some text with an embedded font!', 100, 100);

    // Add an image, constrain it to a given size, and center it vertically and horizontally
    doc.image(__dirname + "\\images\\Monk.png", {
        fit: [250, 300],
        align: 'center',
        valign: 'center'
    });

    // Add another page
    doc.addPage()
        .fontSize(25)
        .text('Here is some vector graphics...', 100, 100);

    // Draw a triangle
    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300");

    // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    doc.scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

    // Add some text with annotations
    doc.addPage()
        .fillColor("blue")
        .text('Here is a link!', 100, 100)
        .underline(100, 100, 160, 27, { color: "#0000FF" })
        .link(100, 100, 160, 27, 'http://google.com/');

    // Finalize PDF file
    doc.end();

})




//Coaches->Achara Coaches->Dr. Nimarjeet
app.get('/dr_nimarjeet', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "dr_nimarjeet.html");
})

app.get('/dr_nimarjeet/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "plans.html");
})

app.get('/dr_nimarjeet/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "calls.html");
})

app.get('/dr_nimarjeet/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "submit_review.html");
})

app.get('/dr_nimarjeet/mass_mail', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "mass_mail.html");
})

app.get('/dr_nimarjeet/active_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "active_users.html");
})

app.get('/dr_nimarjeet/historical_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "historical_users.html");
})

app.get('/dr_nimarjeet/send_prescription', function (req, res) {
    res.sendFile(__dirname + "/coaches/dr_nimarjeet/" + "send_prescription.html");
})




//Coaches->Vihara Coaches->Munira Sabuwala
app.get('/munira_sabuwala', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "munira_sabuwala.html");
})

app.get('/munira_sabuwala/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "woplan.html");
})

app.get('/munira_sabuwala/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "wocall.html");
})

app.get('/munira_sabuwala/mypoints', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "points.html");
})

app.get('/munira_sabuwala/points_history', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "points_history.html");
})

app.get('/munira_sabuwala/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "submit_review.html");
})

app.get('/munira_sabuwala/active_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "active_users.html");
})

app.get('/munira_sabuwala/historical_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/munira_sabuwala/" + "historical_users.html");
})


//Coaches->Vihara Coaches->Raro George
app.get('/raro_george', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "raro_george.html");
})

app.get('/raro_george/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "wocall.html");
})

app.get('/raro_george/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "woplan.html");
})

app.get('/raro_george/mypoints', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "points.html");
})

app.get('/raro_george/points_history', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "points_history.html");
})

app.get('/raro_george/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "submit_review.html");
})

app.get('/raro_george/active_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "active_users.html");
})

app.get('/raro_george/historical_users', function (req, res) {
    res.sendFile(__dirname + "/coaches/raro_george/" + "historical_users.html");
})



//Coaches->Vihara Coaches->Nikita Barve
app.get('/nikita_barve/sessions', function (req, res) {
    res.sendFile(__dirname + "/coaches/nikita_barve/" + "calls.html");
})

//Coaches->Vihara Coaches->Rutu
app.get('/rutu/sessions', function (req, res) {
    res.sendFile(__dirname + "/coaches/rutu/" + "calls.html");
})

//Coaches->Vihara Coaches->Vishal Singh
app.get('/vishal_singh/sessions', function (req, res) {
    res.sendFile(__dirname + "/coaches/vishal_singh/" + "calls.html");
})




//Coaches->Achara Coaches
app.get('/prescribe_aushadhis', function (req, res) {
    res.sendFile(__dirname + "/" + "prescribe_aushadhis.html");
})

//Coaches->Update Dates
app.get('/nextdietplandate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextdietplandate.html");
})

app.get('/nextdietcalldate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextdietcalldate.html");
})

app.get('/nextworkoutcalldate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextworkoutcalldate.html");
})

app.get('/nextacharaplandate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextacharaplandate.html");
})

app.get('/nextacharacalldate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextacharacalldate.html");
})

app.get('/nextvicharaplandate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextvicharaplandate.html");
})

app.get('/nextvicharacalldate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextvicharacalldate.html");
})



//Coaches->Review
app.get('/review_status', function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "review_status.html");
})


app.get('/remove_user', function (_req, res) {
    res.sendFile(__dirname + "/support/" + "remove_user.html");
})

app.get('/listUsers', function (req, res) {
    res.sendFile(__dirname + "/support/" + "activeusers.html");
})

app.get('/listUsers_historic', function (req, res) {
    res.sendFile(__dirname + "/support/" + "historic_users.html");
})

app.get('/support/vihara_leads', function (req, res) {
    res.sendFile(__dirname + "/support/" + "vihara_leads.html");
})



//Operations->BCAs
app.get('/todays_bca', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/operations/" + "todaysbca.html");
})

//Operations->Sakhi Challenge
app.get('/sakhi_pairing', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/operations/" + "sakhi_pairing.html");
})



//Sales
app.get('/sales/talk_to_users', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "talk_to_users.html");
})

app.get('/sales/upload_report', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "upload_report.html");
})

app.get('/sales/users_by_end_date', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "users_by_plan_end_month.html");
})

app.get('/sales/pre-consultation-list', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "pre-consultation.html");
})

app.get('/sales/consultation-list', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "consultation.html");
})

app.get('/sales/post-consultation-list', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "post-consultation.html");
})

app.get('/sales/analytics', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "analytics.html");
})

app.get('/sales/add_lead', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "add_lead.html");
})

app.get('/sales/add_user', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "adduser.html");
})

app.get('/sales/view_leads', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "view_leads.html");
})

app.get('/sales/help', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales/help" + "/" + "help.html");
})

app.get('/sales/help/how_to_use_hilfy', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales/help" + "/" + "how_to_use_hilfy.html");
})

app.get('/sales/help/add_new_question', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales/help" + "/" + "add_new_question.html");
})



//Support->Coaches
app.get('/add_coach', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "add_coach.html");
})

app.get('/view_coaches', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "view_coaches.html");
})

app.get('/remove_coach', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "remove_coach.html");
})

app.get('/change_coach_single', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "change_coach_single.html");
})

app.get('/change_coach', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "change_coach.html");
})

app.get('/approve_review', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "approve_review.html");
})

app.get('/five_star_ratings', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "five_star_ratings.html");
})

app.get('/sales_count', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "sales_count.html");
})

app.get('/points_table', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "points_table.html");
})


//Support->Plans
app.get('/add_plan', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "add_plan.html");
})

app.get('/view_plans', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "view_plans.html");
})


app.post('/add_new_sales_question', urlencodedParser, function (req, res) {
    var new_question = {
        question: req.body.question,
        answer: req.body.answer,
        category: req.body.category
    }
    var setDoc = db.collection("salesQuestions").add(new_question);
    res.send("Added Successfully|");
})

app.post('/send_consultation_done_email', urlencodedParser, function (req, res) {
//    var leadRef = db.collection('leads').doc(req.body.phone);
//    var getDoc = leadRef.get()
//        .then(doc => {
//            if (!doc.exists)
//                res.send('No such lead!');
//            else {
//                //Store the lead data in a variable
//                var lead = doc.data();
//                var doctor;
//                var coach;

//                if (lead.consultation.type == 'Doctor') {
//                    var docRef = db.collection('doctors').doc(lead.consultation.with);
//                    var getDoc = docRef.get().then(doc => {
//                        if (doc.exists) {

//                            doctor = doc.data();
//                            //Prepare html for the Lead
//                            if (lead.email) {
//                                var html_lead = mail_template_consultation_booking(lead, doc.data());

//                                //Send SMS
//                                var message = "Dear " + lead.name + ", your consultation with " +
//                                    doc.data().name + " is scheduled";
//                                if (lead.consultation.date) {
//                                    message += " for " + lead.consultation.date;

//                                    if (lead.consultation.time) {
//                                        message += " at " + lead.consultation.time;
//                                    }
//                                }
//                                message += ". Kindly be available at the chosen date and time.";

//                                send_sms(message, lead.phone);

//                                var mailOptions_lead = {
//                                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                                    to: lead.email,
//                                    subject: 'Appointment Scheduled | Modern Monk',
//                                    html: html_lead
//                                }

//                                transporter.sendMail(mailOptions_lead, (err, info) => {
//                                    transporter.close();
//                                    if (err) {
//                                        console.log(err);
//                                    } else {
//                                        console.log('Email sent to ' + lead.name + ': ' + info.response);
//                                    }
//                                });
//                            }

//                            //Prepare html for the Doctor
//                            var html_doc = `
//    ${mail_template_header()}
//        <p style="color: grey">
//            Dear ${doc.data().name},
//        </p>
//        <p style="color: grey">
//            &nbsp;&nbsp;&nbsp;&nbsp;
//An appointment for you has been booked.
//<br>
//Here are the appointment details:
//<br>
//<ul>
//<li><b>With</b>: ${lead.name}`;
//                            if (lead.consultation.date)
//                                html_doc += `<li> <b>Date</b>: ${lead.consultation.date}`;
//                            if (consultation.time)
//                                html_doc += `<li><b>Time</b>: ${lead.consultation.time}`;
//                            html_doc += `
//<li><b>Mode</b>: ${lead.consultation.mode}
//</ul>
//Kindly be available at the chosen date & time.
//<br>
//${mail_template_footer()}
//    `;

//                            var mailOptions_doc = {
//                                from: 'Modern Monk<support@modernmonk.in>',
//                                to: doc.data().email,
//                                subject: 'Appointment Scheduled | Modern Monk',
//                                html: html_doc
//                            }

//                            transporter.sendMail(mailOptions_doc, (err, info) => {
//                                transporter.close();
//                                if (err) {
//                                    console.log(err);
//                                } else {
//                                    console.log('Email sent to ' + doc.data().name + ': ' + info.response);
//                                }
//                            });

//                            scheduleReminder(lead, doctor);
//                        }
//                    })
//                }
//                else {
//                    var coachRef = db.collection('coaches').doc(lead.consultation.with);
//                    var getDoc = coachRef.get().then(doc => {
//                        if (doc.exists) {
//                            coach = doc.data();

//                            //Prepare html for the Lead
//                            if (lead.email) {
//                                var html_lead = mail_template_consultation_booking(lead, doc.data());

//                                //Send SMS
//                                var message = "Dear " + lead.name + ", your consultation with " +
//                                    doc.data().name + " is scheduled";
//                                if (lead.consultation.date) {
//                                    message += " for " + lead.consultation.date;

//                                    if (lead.consultation.time) {
//                                        message += " at " + lead.consultation.time;
//                                    }
//                                }
//                                message += ". Kindly be available at the chosen date and time.";

//                                send_sms(message, lead.phone);

//                                var mailOptions_lead = {
//                                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                                    to: lead.email,
//                                    subject: 'Appointment Scheduled | Modern Monk',
//                                    html: html_lead
//                                }

//                                transporter.sendMail(mailOptions_lead, (err, info) => {
//                                    transporter.close();
//                                    if (err) {
//                                        console.log(err);
//                                    } else {
//                                        console.log('Email sent to ' + lead.name + ': ' + info.response);
//                                    }
//                                });
//                            }

//                            //Prepare HTML for coach
//                            var html_coach = `
//    ${mail_template_header()}
//        <p style="color: grey">
//            Dear ${doc.data().coach_name},
//        </p>
//        <p style="color: grey">
//            &nbsp;&nbsp;&nbsp;&nbsp;
//An appointment for you has been booked.
//<br>
//Here are the appointment details:
//<br>
//<ul>
//<li><b>With</b>: ${lead.name}`;
//                            if (lead.consultation.date)
//                                html_coach += `<li> <b>Date</b>: ${lead.consultation.date}`;
//                            if (lead.consultation.time)
//                                html_coach += `<li><b>Time</b>: ${lead.consultation.time}`;
//                            html_coach += `
//<li><b>Mode</b>: ${lead.consultation.mode}
//</ul>
//Kindly be available at the chosen date & time.
//<br>
//${mail_template_footer()}
//    `;

//                            var mailOptions_coach = {
//                                from: 'Modern Monk<support@modernmonk.in>',
//                                to: doc.data().email,
//                                subject: 'Appointment Scheduled | Modern Monk',
//                                html: html_coach
//                            }

//                            transporter.sendMail(mailOptions_coach, (err, info) => {
//                                transporter.close();
//                                if (err) {
//                                    console.log(err);
//                                } else {
//                                    console.log('Email sent to ' + doc.data().coach_name + ': ' + info.response);
//                                }
//                            });

//                            scheduleReminder(lead, coach);
//                        }
//                    })
//                }
//            }
//        })
    res.send("Mail & SMS sent!");
})

app.post('/send_book_consultation_email', urlencodedParser, function (req, res) {
    var leadRef = db.collection('leads').doc(req.body.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists)
                res.send('No such lead!');
            else {
                //Store the lead data in a variable
                var lead = doc.data();
                var doctor;
                var coach;

                if (lead.consultation.type == 'Doctor') {
                    var docRef = db.collection('doctors').doc(lead.consultation.with);
                    var getDoc = docRef.get().then(doc => {
                        if (doc.exists) {

                            doctor = doc.data();
                            //Prepare html for the Lead
                            if (lead.email) {
                                var html_lead = mail_template_consultation_booking(lead, doc.data());

                                //Send SMS
                                var message = "Dear " + lead.name + ", your consultation with " +
                                    doc.data().name + " is scheduled";
                                if (lead.consultation.date) {
                                    message += " for " + lead.consultation.date;

                                    if (lead.consultation.time) {
                                        message += " at " + lead.consultation.time;
                                    }
                                }
                                message += ". Kindly be available at the chosen date and time.";

                                send_sms(message, lead.phone);

                                var mailOptions_lead = {
                                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                    to: lead.email,
                                    subject: 'Appointment Scheduled | Modern Monk',
                                    html: html_lead
                                }

                                transporter.sendMail(mailOptions_lead, (err, info) => {
                                    transporter.close();
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Email sent to ' + lead.name + ': ' + info.response);
                                    }
                                });
                            }

                            //Prepare html for the Doctor
                            var html_doc = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
An appointment for you has been booked.
<br>
Here are the appointment details:
<br>
<ul>
<li><b>With</b>: ${lead.name}`;
                            if (lead.consultation.date)
                                html_doc += `<li> <b>Date</b>: ${lead.consultation.date}`;
                            if (consultation.time)
                                html_doc += `<li><b>Time</b>: ${lead.consultation.time}`;
                            html_doc += `
<li><b>Mode</b>: ${lead.consultation.mode}
</ul>
Kindly be available at the chosen date & time.
<br>
${mail_template_footer()}
    `;

                            var mailOptions_doc = {
                                from: 'Modern Monk<support@modernmonk.in>',
                                to: doc.data().email,
                                subject: 'Appointment Scheduled | Modern Monk',
                                html: html_doc
                            }

                            transporter.sendMail(mailOptions_doc, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent to ' + doc.data().name + ': ' + info.response);
                                }
                            });

                            scheduleReminder(lead, doctor);
                        }
                    })
                }
                else {
                    var coachRef = db.collection('coaches').doc(lead.consultation.with);
                    var getDoc = coachRef.get().then(doc => {
                        if (doc.exists) {
                            coach = doc.data();

                            //Prepare html for the Lead
                            if (lead.email) {
                                var html_lead = mail_template_consultation_booking(lead, doc.data());

                                //Send SMS
                                var message = "Dear " + lead.name + ", your consultation with " +
                                    doc.data().coach_name + " is scheduled";
                                if (lead.consultation.date) {
                                    message += " for " + lead.consultation.date;

                                    if (lead.consultation.time) {
                                        message += " at " + lead.consultation.time;
                                    }
                                }
                                message += ". Kindly be available at the chosen date and time.";

                                send_sms(message, lead.phone);

                                var mailOptions_lead = {
                                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                    to: lead.email,
                                    subject: 'Appointment Scheduled | Modern Monk',
                                    html: html_lead
                                }

                                transporter.sendMail(mailOptions_lead, (err, info) => {
                                    transporter.close();
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Email sent to ' + lead.name + ': ' + info.response);
                                    }
                                });
                            }

                            //Prepare HTML for coach
                            var html_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().coach_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
An appointment for you has been booked.
<br>
Here are the appointment details:
<br>
<ul>
<li><b>With</b>: ${lead.name}`;
                            if (lead.consultation.date)
                                html_coach += `<li> <b>Date</b>: ${lead.consultation.date}`;
                            if (lead.consultation.time)
                                html_coach += `<li><b>Time</b>: ${lead.consultation.time}`;
                            html_coach += `
<li><b>Mode</b>: ${lead.consultation.mode}
</ul>
Kindly be available at the chosen date & time.
<br>
${mail_template_footer()}
    `;

                            var mailOptions_coach = {
                                from: 'Modern Monk<support@modernmonk.in>',
                                to: doc.data().email,
                                subject: 'Appointment Scheduled | Modern Monk',
                                html: html_coach
                            }

                            transporter.sendMail(mailOptions_coach, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent to ' + doc.data().coach_name + ': ' + info.response);
                                }
                            });

                            scheduleReminder(lead, coach);
                        }
                    })
                }
            }
        })
    res.send("Mail & SMS sent!");
})

//Sending Mail On Consultion List To Consultation Done
//app.post('/send_consultaion_done_email', urlencodedParser, function (req, res) {
//    var leadRef = db.collection('leads').doc(req.body.phone);
//    var getDoc = leadRef.get()
//        .then(doc => {
//            if (!doc.exists)
//                res.send('No such lead!');
//            else {
//                if (doc.data().email) {
//                    var lead = doc.data();
//                    var html_lead = `
//  ${mail_template_header()}
//      <p style="color: grey">
//          Dear ${lead.name},
//      </p>
//      <p style="color: grey">
//          &nbsp;&nbsp;&nbsp;&nbsp;
//Here's the suggestions for you from the consultation:<br>
//<br>
//<ul>`;
//                    html_lead += ` <li><b>Recommendations</b>: ${lead.consultation.recommendations}`;

//                    //Check For Medication 1

//                    if (lead.consultation.medication[0]) {
//                        if (lead.consultation.medication[0].medicine)
//                            html_lead += `<li> <b>Medicine 1</b>: ${lead.consultation.medication[0].medicine}`;

//                        if (lead.consultation.medication[0].amount)
//                            html_lead += `<li> <b>Dosage</b>: ${lead.consultation.medication[0].amount}`;

//                        if (lead.consultation.medication[0].frequency)
//                            html_lead += `<li> <b>Frequency</b>: ${lead.consultation.medication[0].frequency}`;

//                        if (lead.consultation.medication[0].othernotes)
//                            html_lead += `<li> <b>Other Notes</b>: ${lead.consultation.medication[0].othernotes}`;
//                    }

//                    //Check For Medication 2

//                    if (lead.consultation.medication[1]) {
//                        if (lead.consultation.medication[1].medicine)
//                            html_lead += `<li> <b>Medicine 1</b>: ${lead.consultation.medication[1].medicine}`;

//                        if (lead.consultation.medication[1].amount)
//                            html_lead += `<li> <b>Dosage</b>: ${lead.consultation.medication[1].amount}`;

//                        if (lead.consultation.medication[1].frequency)
//                            html_lead += `<li> <b>Frequency</b>: ${lead.consultation.medication[1].frequency}`;

//                        if (lead.consultation.medication[1].othernotes)
//                            html_lead += `<li> <b>Other Notes</b>: ${lead.consultation.medication[1].othernotes}`;
//                    }

//                    //Check For Medication 3

//                    if (lead.consultation.medication[2]) {
//                        if (lead.consultation.medication[2].medicine)
//                            html_lead += `<li> <b>Medicine 1</b>: ${lead.consultation.medication[2].medicine}`;

//                        if (lead.consultation.medication[2].amount)
//                            html_lead += `<li> <b>Dosage</b>: ${lead.consultation.medication[2].amount}`;

//                        if (lead.consultation.medication[2].frequency)
//                            html_lead += `<li> <b>Frequency</b>: ${lead.consultation.medication[2].frequency}`;

//                        if (lead.consultation.medication[2].othernotes)
//                            html_lead += `<li> <b>Other Notes</b>: ${lead.consultation.medication[2].othernotes}`;
//                    }

//                    //Check For Medication 4

//                    if (lead.consultation.medication[3]) {
//                        if (lead.consultation.medication[3].medicine)
//                            html_lead += `<li> <b>Medicine 1</b>: ${lead.consultation.medication[3].medicine}`;

//                        if (lead.consultation.medication[3].amount)
//                            html_lead += `<li> <b>Dosage</b>: ${lead.consultation.medication[3].amount}`;

//                        if (lead.consultation.medication[3].frequency)
//                            html_lead += `<li> <b>Frequency</b>: ${lead.consultation.medication[3].frequency}`;

//                        if (lead.consultation.medication[3].othernotes)
//                            html_lead += `<li> <b>Other Notes</b>: ${lead.consultation.medication[3].othernotes}`;
//                    }

//                    //Check For Medication 5

//                    if (lead.consultation.medication[4]) {
//                        if (lead.consultation.medication[4].medicine)
//                            html_lead += `<li> <b>Medicine 1</b>: ${lead.consultation.medication[4].medicine}`;

//                        if (lead.consultation.medication[4].amount)
//                            html_lead += `<li> <b>Dosage</b>: ${lead.consultation.medication[4].amount}`;

//                        if (lead.consultation.medication[4].frequency)
//                            html_lead += `<li> <b>Frequency</b>: ${lead.consultation.medication[4].frequency}`;

//                        if (lead.consultation.medication[4].othernotes)
//                            html_lead += `<li> <b>Other Notes</b>: ${lead.consultation.medication[4].othernotes}`;
//                    }

//                    html_lead += `</ul>
//Kindly be available at the chosen date & time.
//<br>
//${mail_template_footer()}
//  `;

//                    var mailOptions_lead = {
//                        from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                        to: lead.email,
//                        subject: 'Appointment Scheduled | Modern Monk',
//                        html: html_lead
//                    }

//                    transporter.sendMail(mailOptions_lead, (err, info) => {
//                        transporter.close();
//                        if (err) {
//                            console.log(err);
//                        } else {
//                            console.log('Email sent to ' + lead.name + ': ' + info.response);
//                        }
//                    });

//                    //Prepare html for the Doctor
//                    var html_doc = `
//  ${mail_template_header()}
//      <p style="color: grey">
//          Dear ${doc.data().name},
//      </p>
//      <p style="color: grey">
//          &nbsp;&nbsp;&nbsp;&nbsp;
//An appointment for you has been booked.
//<br>
//Here are the appointment details:
//<br>
//<ul>
//<li><b>With</b>: ${lead.name}`;
//                    if (lead.consultation.date)
//                        html_doc += `<li> <b>Date</b>: ${lead.consultation.date}`;
//                    if (consultation.time)
//                        html_doc += `<li><b>Time</b>: ${lead.consultation.time}`;
//                    html_doc += `
//<li><b>Mode</b>: ${lead.consultation.mode}
//</ul>
//Kindly be available at the chosen date & time.
//<br>
//${mail_template_footer()}
//  `;

//                    var mailOptions_doc = {
//                        from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                        to: doc.data().email,
//                        subject: 'Appointment Scheduled | Modern Monk',
//                        html: html_doc
//                    }

//                    transporter.sendMail(mailOptions_doc, (err, info) => {
//                        transporter.close();
//                        if (err) {
//                            console.log(err);
//                        } else {
//                            console.log('Email sent to ' + doc.data().name + ': ' + info.response);
//                        }
//                    });
//                }
//            })
//                  else {
//        var coachRef = db.collection('coaches').doc(lead.consultation.with);
//        var getDoc = coachRef.get().then(doc => {
//            if (doc.exists) {
//                if (lead.consultation.mode == 'In-Person') {
//                    html_lead += `<li><b>Address</b>: ${doc.data().address}`;
//                    html_lead += `<li><b>Google Maps</b>: ${doc.data().location}`;
//                }
//                if (lead.consultation.payment_options) {
//                    if (lead.consultation.payment_options == "To be paid")
//                        html_lead += `<li><b>Amount to be Paid</b>: "Rs" + ${lead.consultation.charges}`;
//                }
//                html_lead += `</ul>
//Kindly be available at the chosen date & time.
//<br>
//${mail_template_footer()}
//  `;

//                var mailOptions_lead = {
//                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                    to: lead.email,
//                    subject: 'Appointment Scheduled | Modern Monk',
//                    html: html_lead
//                }

//                transporter.sendMail(mailOptions_lead, (err, info) => {
//                    transporter.close();
//                    if (err) {
//                        console.log(err);
//                    } else {
//                        console.log('Email sent to ' + lead.name + ': ' + info.response);
//                    }
//                });

//                //Prepare HTML for coach
//                var html_coach = `
//  ${mail_template_header()}
//      <p style="color: grey">
//          Dear ${doc.data().coach_name},
//      </p>
//      <p style="color: grey">
//          &nbsp;&nbsp;&nbsp;&nbsp;
//An appointment for you has been booked.
//<br>
//Here are the appointment details:
//<br>
//<ul>
//<li><b>With</b>: ${lead.name}`;
//                if (lead.consultation.date)
//                    html_coach += `<li> <b>Date</b>: ${lead.consultation.date}`;
//                if (lead.consultation.time)
//                    html_coach += `<li><b>Time</b>: ${lead.consultation.time}`;
//                html_coach += `
//<li><b>Mode</b>: ${lead.consultation.mode}
//</ul>
//Kindly be available at the chosen date & time.
//<br>
//${mail_template_footer()}
//  `;

//                var mailOptions_coach = {
//                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                    to: doc.data().email,
//                    subject: 'Appointment Scheduled | Modern Monk',
//                    html: html_coach
//                }

//                transporter.sendMail(mailOptions_coach, (err, info) => {
//                    transporter.close();
//                    if (err) {
//                        console.log(err);
//                    } else {
//                        console.log('Email sent to ' + doc.data().coach_name + ': ' + info.response);
//                    }
//                });
//            }
//        })
//    }
//})

//Desc: This function gives the workout format of given coach on given date
function getWorkoutFormat(coach, date, new_items) {
    var coachRef = firebase.firestore().collection('coaches').doc(coach);
    coachRef.get().then(doc => {
        if (doc.exists) {
            new_items.new_workout_format = doc.data().availability[date.getDay()].format;
        }
    })
}

/*
 * Desc: This API deletes the chosen Vihara session and creates a new one
 * Input: new_date (Date + Time of the new session), req.body.fc (Name of the new coach), phone (lead/user's phone),
 * old_coach (Name of the old coach), old_date (Only Date of the old session)
 * Output: Returns a success messasge upon successful rescheduling
 * Caveat: This API currently works only for leads, not users
 */
app.post('/rescheduleOneViharaSession', urlencodedParser, function (req, res) {
    var new_items = {
        new_workout_format: ""
    };
    new_items.new_date = new Date(req.body.new_date);
    new_items.new_coach = req.body.fc;
    /*Now we need to relevant bookings in the lead doc & in the coach doc.
             * For the lead doc, we'll need the lead's phone and then we need to find the chosen slot
             * in the lead's vihara_data using the coach name. There, we update the array element.
            * For the coach, we need the coach's name. Then in the coach's schedule, we need to
            * find the entry matching the patientID. There, we update the array element */
    var phone = req.body.phone;
    var old_coach = req.body.old_coach;
    var old_date = req.body.old_date;

    getWorkoutFormat(new_items.new_coach, new_items.new_date, new_items);

    //Lead first
    var leadRef = firebase.firestore().collection('leads').doc(phone);
    leadRef.get().then(doc => {
        if (doc.exists) {
            for (var i = 0; i < doc.data().vihara_data.workoutCallDates.length; i++) {
                var _vihara_data = doc.data().vihara_data;

                //Compare stored coach with the coach from the table
                if (_vihara_data.workoutCallDates[i].coach == old_coach) {

                    if (old_date == changeTimestampToString(_vihara_data.workoutCallDates[i].callDate.toDate())) {
                        _vihara_data.workoutCallDates[i].callDate = new_items.new_date;
                        _vihara_data.workoutCallDates[i].coach = new_items.new_coach;
                        _vihara_data.workoutCallDates[i].workout_format = new_items.new_workout_format;
                        leadRef.update({ vihara_data: _vihara_data });

                        //Then old Coach
                        var coachRef_1 = firebase.firestore().collection('coaches').doc(old_coach);
                        coachRef_1.get().then(doc => {
                            if (doc.exists) {
                                for (var j = 0; j < doc.data().schedule.length; j++) {
                                    var _schedule = doc.data().schedule;

                                    if ((old_date == changeTimestampToString(_schedule[j].callDate.toDate())) && (phone == _schedule[j].patientID)) {

                                        //First update this array element with the right details
                                        _schedule[j].callDate = new_items.new_date;
                                        _schedule[j].coach = new_items.new_coach;
                                        _schedule[j].workout_format = new_items.new_workout_format;
                                        var schedule_obj = _schedule[j];

                                        //Now push this array element to the new coach's schedule
                                        var coachRef_2 = firebase.firestore().collection('coaches').doc(new_items.new_coach);
                                        coachRef_2.get().then(doc => {
                                            if (doc.exists) {
                                                var __schedule = doc.data().schedule;
                                                __schedule.push(schedule_obj);
                                                coachRef_2.update({ schedule: __schedule });
                                            }
                                        })
                                        //Now delete this array element from the old coach's schedule
                                        _schedule.splice(j, 1);
                                        coachRef_1.update({ schedule: _schedule });
                                        break;
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
    })
})

//Support->Record a Conversion (New/Renewal)
app.post('/sales_count', urlencodedParser, function (req, res) {
    /*
     * Prepare a dummy plan
     * Find the coach
     * Find the coach type
     * Find the number of conversions in this month so far
     * Calculate the points to be awarded based on that
     * Update the plan object with the points to be awarded
     * Call add_points() with the reason for the award of points
     */

    //Prepare a dummy plan
    var planRef = db.collection('plans').doc('Slimming');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var plan = doc.data();

                //Find the coach
                var coachRef = db.collection('coaches').doc(req.body.coach);
                var getDoc = coachRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            var coach = doc.data();
                            //Find the coach type
                            var add_NC = false, add_FC = false;
                            if (coach.coach_type == 'Achara')
                                add_NC = true;
                            else if (coach.coach_type == 'Vihara')
                                add_FC = true;

                            //Find the complaint number
                            var num_of_conversions = 0;
                            if (coach.num_of_conversions)
                                num_of_conversions = coach.num_of_conversions;

                            //Calculate the points to be awarded based on that
                            var points_to_be_awarded = 0;
                            points_to_be_awarded = Math.ceil(100 * Math.pow(1.05, num_of_conversions));
                            num_of_conversions++;

                            //Update the plan object with the points to be awarded
                            if (add_NC) {
                                plan.points_nc = points_to_be_awarded;
                            }
                            else if (add_FC) {
                                plan.points_fc = points_to_be_awarded;
                            }

                            var award_reason = "converting the user " + req.body.user + " ";

                            var date = new Date();

                            //Call deduct_points() with the reason for the points deduction
                            if (add_NC)
                                add_points(coach, plan, award_reason, date, 1, true, false, false, false);
                            else if (add_FC)
                                add_points(coach, plan, award_reason, date, 1, false, true, false, false);

                            coachRef.update({ points: coach.points });
                            coachRef.update({ points_history: coach.points_history });
                            coachRef.update({ num_of_conversions: num_of_conversions });
                        }
                    }).catch(err => {
                        console.log("Error: ", err);
                    });
            }
            res.send("Points awarded successfully");
        }).catch(err => {
            console.log("Error: ", err);
        });
})

//Support->Approve Review
app.post('/approve_review', urlencodedParser, function (req, res) {
    /*
     * Prepare a dummy plan
     * Find the coach
     * Find the coach type
     * Calculate the points to be awarded based on the type of review
     * Update the plan object with the points to be deducted
     * Call add_points() with the reason for the points addition
    */

    //Prepare a dummy plan
    var planRef = db.collection('plans').doc('Slimming');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var plan = doc.data();

                //Find the coach
                var coachRef = db.collection('coaches').doc(req.body.coach);
                var getDoc = coachRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            var coach = doc.data();
                            //Find the coach type
                            var add_NC = false, add_FC = false;
                            if (coach.coach_type == 'Achara')
                                add_NC = true;
                            else if (coach.coach_type == 'Vihara')
                                add_FC = true;

                            //Calculate the points to be awarded based on the type of review
                            var points_to_be_awarded = 0;
                            var award_reason = "";
                            switch (req.body.review_type) {
                                case 'app_store_rating':
                                    points_to_be_awarded = 80;
                                    award_reason = "Getting a rating on App Store";
                                    break;
                                case 'play_store_rating':
                                    points_to_be_awarded = 80;
                                    award_reason = "Getting a rating on Play Store";
                                    break;
                                case 'app_store_review':
                                    points_to_be_awarded = 100;
                                    award_reason = "Getting a review on App Store";
                                    break;
                                case 'play_store_review':
                                    points_to_be_awarded = 100;
                                    award_reason = "Getting a review on Play Store";
                                    break;
                                case 'fb_group_review':
                                    points_to_be_awarded = 30;
                                    award_reason = "Getting a review in an FB Group";
                                    break;
                                case 'fb_page_review':
                                    points_to_be_awarded = 80;
                                    award_reason = "Getting a review on FB Page";
                                    break;
                                case 'whatsapp_review':
                                    points_to_be_awarded = 10;
                                    award_reason = "Getting a review on WhatsApp";
                                    break;
                                case 'google_review':
                                    points_to_be_awarded = 80;
                                    award_reason = "Getting a review on Google";
                                    break;
                                case 'justdial_review':
                                    points_to_be_awarded = 50;
                                    award_reason = "Getting a review on JustDial";
                                    break;
                            }

                            //Update the plan object with the points to be deducted
                            if (add_NC) {
                                plan.points_nc = points_to_be_awarded;
                            }
                            else if (add_FC) {
                                plan.points_fc = points_to_be_awarded;
                            }

                            var date = new Date();

                            //Call add_points() with the reason for the points deduction
                            if (add_NC)
                                add_points(coach, plan, award_reason, date, 1, true, false, false, false);
                            else if (add_FC)
                                add_points(coach, plan, award_reason, date, 1, false, true, false, false);

                            coachRef.update({ points: coach.points });
                            coachRef.update({ points_history: coach.points_history });
                        }
                    }).catch(err => {
                        console.log("Error: ", err);
                    });
            }
            res.send("Points added successfully");
        }).catch(err => {
            console.log("Error: ", err);
        });
})


//Support->Add 5 star Ratings' Count
app.post('/five_star_ratings', urlencodedParser, function (req, res) {
    /*
     * Prepare a dummy plan
     * Find the coach
     * Find the coach type
     * Calculate the points to be awarded based on the number of ratings
     * Update the plan object with the points to be deducted
     * Call add_points() with the reason for the points addition
    */

    //Prepare a dummy plan
    var planRef = db.collection('plans').doc('Slimming');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var plan = doc.data();

                //Find the coach
                var coachRef = db.collection('coaches').doc(req.body.coach);
                var getDoc = coachRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            var coach = doc.data();
                            //Find the coach type
                            var add_NC = false, add_FC = false;
                            if (coach.coach_type == 'Achara')
                                add_NC = true;
                            else if (coach.coach_type == 'Vihara')
                                add_FC = true;

                            //Calculate the points to be awarded based on the type of review
                            var points_to_be_awarded = 50 * req.body.num_of_ratings;
                            var award_reason = req.body.num_of_ratings + " 5-star Ratings";

                            //Update the plan object with the points to be deducted
                            if (add_NC) {
                                plan.points_nc = points_to_be_awarded;
                            }
                            else if (add_FC) {
                                plan.points_fc = points_to_be_awarded;
                            }

                            var date = new Date();

                            //Call add_points() with the reason for the points deduction
                            if (add_NC)
                                add_points(coach, plan, award_reason, date, 1, true, false, false, false);
                            else if (add_FC)
                                add_points(coach, plan, award_reason, date, 1, false, true, false, false);

                            coachRef.update({ points: coach.points });
                            coachRef.update({ points_history: coach.points_history });
                        }
                    }).catch(err => {
                        console.log("Error: ", err);
                    });
            }
            res.send("Points added successfully");
        }).catch(err => {
            console.log("Error: ", err);
        });
})

//Support->Get Customer Feedback
app.get('/feedback_mail', urlencodedParser, function (req, res) {
    //Get today
    var today = new Date();
    today = changeTimestampToString(today);

    var userRef = db.collection('users');
    var getDoc = userRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            else {
                snapshot.forEach(doc => {
                    if (doc.data().email && doc.data().end_date >= today &&
                        doc.data().start_date <= today) {
                        var mailOptions1;
                        var user_name = doc.data().user_name;
                        var user_mail = doc.data().email;
                        var date1 = new Date(doc.data().start_date);
                        var date2 = new Date();
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        var dietitian_name;
                        if (doc.data().dietitian.coach_name) {
                            dietitian_name = doc.data().dietitian.coach_name
                        }
                        else {
                            dietitian_name = doc.data().dietitian;
                        }
                        switch (dietitian_name) {
                            case 'SW':
                                dietitian_name = 'Shradha Wai';
                                break;
                            case 'SK':
                                dietitian_name = 'Shainaz Khan';
                                break;
                            case 'SB':
                                dietitian_name = 'Sonali Bhanushali';
                                break;
                        }

                        var fitness_trainer_name;
                        if (doc.data().fitness_trainer) {
                            if (doc.data().fitness_trainer.coach_name) {
                                fitness_trainer_name = doc.data().fitness_trainer.coach_name;
                            }
                            else {
                                fitness_trainer_name = doc.data().fitness_trainer;
                            }
                        }

                        var dietitianRef = db.collection('coaches').doc(dietitian_name);
                        var getDoc = dietitianRef.get()
                            .then(doc => {
                                if (!doc.exists) {
                                    res.send('No such dietitian!');
                                }
                                else {
                                    var dietitian_feedback_url = doc.data().feedback_url;

                                    var fitness_trainer_ref = db.collection('coaches').doc(fitness_trainer_name);
                                    var getDoc = fitness_trainer_ref.get()
                                        .then(doc => {
                                            var fitness_trainer_feedback_url = "";

                                            if (!doc.exists) {
                                            }
                                            else {
                                                fitness_trainer_feedback_url = doc.data().feedback_url;
                                            }

                                            var html1 = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
Kudos on completing another week of your journey towards a pill-free life.
<br />
<br />
Please rate your experience with your Achara Coach <b>${dietitian_name}</b> 
and your Vihara Coach <b>${fitness_trainer_name}</b>.
<br />
<a href = "${dietitian_feedback_url}">Rate your Achara Coach</a>.
<br />`;
                                            if (fitness_trainer_feedback_url) {
                                                html1 += `<a href = "${fitness_trainer_feedback_url}">Rate your Vihara Coach</a>.
<br />`;
                                            }

                                            html1 += `</p>
    ${mail_template_footer()}
    `;

                                            if (!(diffDays % 7)) {
                                                mailOptions1 = {
                                                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                                    to: user_mail,
                                                    subject: 'Please Rate Your Coaches',
                                                    html: html1
                                                }

                                                transporter.sendMail(mailOptions1, (err, info) => {
                                                    transporter.close();
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        console.log('Email sent to customer: ' + info.response);
                                                    }
                                                });
                                            }
                                        });
                                }
                            });
                    }
                });
                res.send("Feedback e-mail successfully sent!");
            }
        })
        .catch(err => {
            console.log("Error: ", err);
        })
})

app.get('/complaint', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/support/" + "complaint.html");
})

app.post('/complaint', urlencodedParser, function (req, res) {
    /*
     * Prepare a dummy plan
     * Find the coach
     * Find the coach type
     * Find the complaint number
     * Calculate the points to be deducted based on that
     * Update the plan object with the points to be deducted
     * Call deduct_points() with the reason for the points deduction
     */

    //Prepare a dummy plan
    var planRef = db.collection('plans').doc('Slimming');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var plan = doc.data();

                //Find the coach
                var coachRef = db.collection('coaches').doc(req.body.coach);
                var getDoc = coachRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            var coach = doc.data();
                            //Find the coach type
                            var add_NC = false, add_FC = false;
                            if (coach.coach_type == 'Achara')
                                add_NC = true;
                            else if (coach.coach_type == 'Vihara')
                                add_FC = true;

                            //Find the complaint number
                            var num_of_complaints = 0;
                            if (coach.num_of_complaints)
                                num_of_complaints = coach.num_of_complaints;

                            //Calculate the points to be deducted based on that
                            var points_to_be_deducted = 0;
                            points_to_be_deducted = 500 * Math.pow(2, num_of_complaints);
                            num_of_complaints++;

                            //Update the plan object with the points to be deducted
                            if (add_NC) {
                                plan.points_nc = points_to_be_deducted;
                            }
                            else if (add_FC) {
                                plan.points_fc = points_to_be_deducted;
                            }

                            var deduction_reason = req.body.reason;

                            var date = new Date();

                            //Call deduct_points() with the reason for the points deduction
                            if (add_NC)
                                deduct_points(coach, plan, deduction_reason, date, 1, true, false);
                            else if (add_FC)
                                deduct_points(coach, plan, deduction_reason, date, 1, false, true);

                            coachRef.update({ points: coach.points });
                            coachRef.update({ points_history: coach.points_history });
                            coachRef.update({ num_of_complaints: num_of_complaints });
                        }
                    }).catch(err => {
                        console.log("Error: ", err);
                    });
            }
            res.send("Points deducted successfully");
        }).catch(err => {
            console.log("Error: ", err);
        });
})

app.get('/add_rating', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/" + "add_rating.html");
})



//Support->Refunds & Cancelations
app.get('/start_refund', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/refunds/" + "start_refund.html");
})

app.get('/refund_success', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/refunds/" + "refund_success.html");
})

//Support->Announcements
app.get('/mass_mail', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/" + "mass_mail.html");
})





function add_points(coach, plan, user_name, start_date, duration, add_NC, add_FC, add_AC, add_VC) {
    //Add points to coaches
    /* 1. Find all the months the points should be alotted for.
     * 2. Find which of those (month + year) are already there in the points array of the coach
     * 3. If they're there, update the points corresponding to that (month + year). If 
     * they're not, push the corresponding objects to the array 

    Note: The following piece of code doesn't work in the scenario when the first user assigned to 
    a coach starts her plan in a month that comes after the start-month of the second user.*/

    //1
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date = new Date(start_date);
    var month_arr_for_point_allotment = [];
    var ctr = 0;
    while (ctr < duration) {
        if (date.getMonth() + ctr <= 11) {
            month_arr_for_point_allotment.push(months[date.getMonth() + ctr] + ' ' + date.getFullYear());
        }
        else {
            var next_year = date.getFullYear() + 1;
            month_arr_for_point_allotment.push(months[date.getMonth() + ctr - 12] + ' ' + next_year);
        }
        ctr++;
    }

    var found = [];
    var iter = -1;

    //Initialize Points arrays
    if (!coach.points) {
        coach.points = [];
    }
    if (!coach.points_history) {
        coach.points_history = [];
    }


    //2
    for (var i = 0; i < month_arr_for_point_allotment.length; i++) {
        for (var j = 0; j < coach.points.length; j++) {
            if (coach.points[j].month == month_arr_for_point_allotment[i]) {
                found.push(true);
                if (iter == -1) {
                    iter = j;
                }
                break;
            }
        }

        //If after any iteration of the entire points array of the coach, the particular month
        //being searched was not found, the length of the found_NC array will be = i.
        //If this happens, it means that the corresponding months are also not there in the 
        //coach's points array.
        if (i == found.length) {
            while (found.length < month_arr_for_point_allotment.length) {
                found.push(false);
            }
        }

        //If found's length is same as that of month_arr_for_point_allotment, the
        //outer array's job is done.
        if (found.length == month_arr_for_point_allotment.length) {
            break;
        }
    }


    //3
    var todays_date = new Date();
    var points_to_be_added;
    if (add_NC) {
        points_to_be_added = plan.points_nc;
    }
    else if (add_FC) {
        points_to_be_added = plan.points_fc;
    }
    else if (add_AC) {
        points_to_be_added = plan.points_achara_coach;
    }
    else if (add_VC) {
        points_to_be_added = plan.points_vichara_coach;
    }

    for (i = 0; i < month_arr_for_point_allotment.length; i++) {
        if (found[i]) {
            var final_points = parseInt(coach.points[i + iter].points) + parseInt(points_to_be_added);
            coach.points[i + iter].points = final_points;
        }
        else {
            var points_obj = {
                month: month_arr_for_point_allotment[i],
                points: points_to_be_added
            }

            coach.points.push(points_obj);
        }
        if (parseInt(points_to_be_added)) {
            coach.points_history.push("Added " + points_to_be_added +
                " points for " + user_name + "(" + month_arr_for_point_allotment[i] +
                ")" + " on " + todays_date);
        }
    }

    var html = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${coach.coach_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
Congrats!
<br>
You have just been allotted points for ${user_name}.<br />
Please check your points history to see the details.
</p>
    ${mail_template_footer()}
    `;

    var mailOptions = {
        from: 'Modern Monk<support@modernmonk.in>',
        to: coach.email,
        subject: 'Points Allotted',
        html: html
    }

    transporter.sendMail(mailOptions, (err, info) => {
        transporter.close();
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent to ' + coach.coach_name + ': ' + info.response);
        }
    });
}

function deduct_points(coach, plan, user_name, start_date, duration, deduct_NC, deduct_FC) {
    //Deduct points from coaches
    /* 1. Find all the months the points should be deducted for.
     * 2. Find which of those (month + year) are already there in the points array of the coach
     * 3. If they're there, update the points corresponding to that (month + year). If 
     * they're not, do nothing

    Note: The following piece of code doesn't work in the scenario when the first user assigned to 
    a coach starts her plan in a month that comes after the start-month of the second user.*/
    //1
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date = new Date(start_date);
    var month_arr_for_point_deduction = [];
    var ctr = 0;
    while (ctr < duration) {
        if (date.getMonth() + ctr <= 11) {
            month_arr_for_point_deduction.push(months[date.getMonth() + ctr] + ' ' + date.getFullYear());
        }
        else {
            var next_year = date.getFullYear() + 1;
            month_arr_for_point_deduction.push(months[date.getMonth() + ctr - 12] + ' ' + next_year);
        }
        ctr++;
    }

    var found = [];
    var iter = -1;

    //Initialize Points arrays
    if (!coach.points) {
        return;
    }
    if (!coach.points_history) {
        return;
    }

    //2
    for (var i = 0; i < month_arr_for_point_deduction.length; i++) {
        for (var j = 0; j < coach.points.length; j++) {
            if (coach.points[j].month == month_arr_for_point_deduction[i]) {
                found.push(true);
                if (iter == -1) {
                    iter = j;
                }
                break;
            }
        }

        //If after any iteration of the entire points array of the coach, the particular month
        //being searched was not found, the length of the found_NC array will be = i.
        //If this happens, it means that the corresponding months are also not there in the 
        //coach's points array.
        if (i == found.length) {
            while (found.length < month_arr_for_point_deduction.length) {
                found.push(false);
            }
        }

        //If found's length is same as that of month_arr_for_point_deduction, the
        //outer array's job is done.
        if (found.length == month_arr_for_point_deduction.length) {
            break;
        }
    }


    //3
    var todays_date = new Date();
    var points_to_be_deducted;
    if (deduct_NC) {
        points_to_be_deducted = plan.points_nc;
    }
    else if (deduct_FC) {
        points_to_be_deducted = plan.points_fc;
    }
    /*  else if (add_AC) {
          if (coach.expertise == "Beginner")
              points_to_be_deducted = plan.points_achara_coach_b;
          else if (coach.expertise == "Intermediate")
              points_to_be_deducted = plan.points_achara_coach_i;
          else if (coach.expertise == "Advanced")
              points_to_be_deducted = plan.points_achara_coach_b;
      }
      else if (add_VC) {
          if (coach.expertise == "Beginner")
              points_to_be_deducted = plan.points_vichara_coach_b;
          else if (coach.expertise == "Intermediate")
              points_to_be_deducted = plan.points_vichara_coach_i;
          else if (coach.expertise == "Advanced")
              points_to_be_deducted = plan.points_vichara_coach_a;
      }*/

    for (i = 0; i < month_arr_for_point_deduction.length; i++) {
        if (deduct_NC) {
            if (found[i]) {
                var final_points = parseInt(coach.points[i + iter].points) - parseInt(points_to_be_deducted);
                var points_deducted = parseInt(coach.points[i + iter].points);
                if (final_points >= 0) {
                    coach.points[i + iter].points = final_points;
                    points_deducted = parseInt(points_to_be_deducted);
                }
                else {
                    coach.points[i + iter].points = 0;
                }
            }
            if (parseInt(points_to_be_deducted)) {
                coach.points_history.push("Deducted " + points_deducted +
                    " points for " + user_name + "(" + month_arr_for_point_deduction[i] +
                    ")" + " on " + todays_date);
            }
        }

        if (deduct_FC) {
            if (found[i]) {
                var final_points = parseInt(coach.points[i + iter].points) - parseInt(points_to_be_deducted);
                var points_deducted = parseInt(coach.points[i + iter].points);
                if (final_points >= 0) {
                    coach.points[i + iter].points = final_points;
                    points_deducted = parseInt(points_to_be_deducted);
                }
                else {
                    coach.points[i + iter].points = 0;
                }
            }
            if (parseInt(points_to_be_deducted)) {
                coach.points_history.push("Deducted " + points_deducted +
                    " points for " + user_name + "(" + month_arr_for_point_deduction[i] +
                    ")" + " on " + todays_date);
            }
        }
    }
    var html = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${coach.coach_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
Unfortunately, you have just gotten a deduction of points for ${user_name}.<br />
Please check your points history to see the details.
</p>
    ${mail_template_footer()}
    `;

    var mailOptions = {
        from: 'Anjali from Modern Monk<support@modernmonk.in>',
        to: coach.email,
        subject: 'Points Deducted',
        html: html
    }

    transporter.sendMail(mailOptions, (err, info) => {
        transporter.close();
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent to ' + coach.coach_name + ': ' + info.response);
        }
    });
}

app.post('/mass_mail_vanditha', urlencodedParser, function (req, res) {
    var userRef = db.collection('users');
    var getDoc = userRef.get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No user found.');
                return;
            }
            else {
                snapshot.forEach(doc => {
                    if (doc.data().email) {
                        if (doc.data().dietitian.coach_name == 'Vanditha Mohanan'
                            || doc.data().dietitian == 'Vanditha Mohanan') {
                            var mailOptions1;
                            var html1 = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
${req.body.mail_body}<br />
</p>
    ${mail_template_footer()}
    `;

                            mailOptions1 = {
                                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                to: doc.data().email,
                                subject: req.body.subject,
                                html: html1
                            }
                            transporter.sendMail(mailOptions1, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent to ' + doc.data().user_name + ': ' + info.response);
                                }
                            });
                        }
                    }
                });
                res.send("Mass e-mail successfully sent!");
            }
        })
        .catch(err => {
            console.log("Error: ", err);
        })
})

app.post('/change_coach_single', urlencodedParser, function (req, res) {
    /*
     * Get the new coach
     * Get the user
     * Get the plan
     * Prepare the HTMLs
     * Get the old coach
     * Assign the new coach to the user
     * Transfer the points from old coach to new coach
     * Mail the user & the coach
     */

    //Get the new Coach
    var newCoachRef = db.collection('coaches').doc(req.body.coach);
    var getDoc = newCoachRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No new coach found!');
            }
            else {
                var newCoach = doc.data();

                var add_NC = false, add_FC = false, add_BNC = false;

                var userRef = db.collection('users').doc(req.body.phone);
                var getDoc = userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such user!');
                        }
                        else {
                            //Get the Plan Name
                            var plan_name;
                            if (doc.data().plan.plan_name) {
                                plan_name = doc.data().plan.plan_name;
                            }
                            else {
                                plan_name = doc.data().plan;
                            }
                            switch (plan_name) {
                                case 'SL':
                                    plan_name = 'Slimming';
                                    break;
                                case 'TO':
                                    plan_name = 'Toning';
                                    break;
                                case 'TH':
                                    plan_name = 'Total Health';
                                    break;
                                case 'PR':
                                    plan_name = 'Premium';
                                    break;
                                case 'FR':
                                    plan_name = 'Free';
                                    break;
                            }

                            var date = new Date();
                            var end_month = new Date(doc.data().end_date).getMonth();
                            var duration = end_month - date.getMonth() + 1;
                            var user_name = doc.data().user_name;

                            var html_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newCoach.coach_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have shifted a user to you. Please check the details:
            <br />
            <br /> Name: ${doc.data().user_name}.
            <br /> Phone number: ${doc.data().phone}.
            <br /> Progam: ${plan_name}.
            <br /> Start Date: ${doc.data().start_date}.
            <br /> Start Date: ${doc.data().end_date}.
       </p>
    ${mail_template_footer()}
    `;

                            //Mail the customer
                            var html_user = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            Your new ${newCoach.coach_type} Coach is ${newCoach.coach_name}.
            <br />
You can reach out to them on WhatsApp on ${newCoach.phone}.
</p>
    ${mail_template_footer()}
    `;

                            var mailOptions_user = {
                                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                to: doc.data().email,
                                subject: 'New Health Coach Assigned',
                                html: html_user
                            }

                            var mailOptions_coach = {
                                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                to: newCoach.email,
                                subject: 'New User Transferred to you',
                                html: html_coach
                            }

                            //Get Old Coach
                            var oldCoach = {};
                            var oldCoachName;
                            switch (newCoach.coach_type) {
                                case 'Achara':
                                    if (doc.data().dietitian.coach_name) {
                                        oldCoachName = doc.data().dietitian.coach_name;
                                    }
                                    else {
                                        oldCoachName = doc.data().dietitian;
                                    }
                                    break;
                                case 'Vihara':
                                    if (doc.data().fitness_trainer.coach_name) {
                                        oldCoachName = doc.data().fitness_trainer.coach_name;
                                    }
                                    else {
                                        oldCoachName = doc.data().fitness_trainer;
                                    }
                            }
                            var oldCoachRef = db.collection('coaches').doc(oldCoachName);
                            var getDoc = oldCoachRef.get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        res.send('No such old coach!');
                                    }
                                    else {
                                        oldCoach = doc.data();

                                        //Update the new coach
                                        switch (newCoach.coach_type) {
                                            case 'Achara':
                                                userRef.update({ dietitian: newCoach.coach_name });
                                                add_NC = true;
                                                break;

                                            case 'Vihara':
                                                userRef.update({ fitness_trainer: newCoach.coach_name });
                                                add_FC = true;
                                        }

                                        //Transfer points
                                        var planRef = db.collection('plans').doc(plan_name);
                                        var getDoc = planRef.get()
                                            .then(doc => {
                                                if (!doc.exists) {
                                                    res.send('No such plan!');
                                                }
                                                else {
                                                    if (add_NC) {
                                                        add_points(newCoach, doc.data(), user_name, date, duration, true, false, false, false);
                                                        newCoachRef.update({ points: newCoach.points });
                                                        newCoachRef.update({ points_history: newCoach.points_history });

                                                        deduct_points(oldCoach, doc.data(), user_name, date, duration, true, false);
                                                        oldCoachRef.update({ points: oldCoach.points });
                                                        oldCoachRef.update({ points_history: oldCoach.points_history });
                                                    }
                                                    if (add_FC) {
                                                        add_points(newCoach, doc.data(), user_name, date, duration, false, true, false, false);
                                                        newCoachRef.update({ points: newCoach.points });
                                                        newCoachRef.update({ points_history: newCoach.points_history });

                                                        deduct_points(oldCoach, doc.data(), user_name, date, duration, false, true);
                                                        oldCoachRef.update({ points_history: oldCoach.points_history });
                                                        oldCoachRef.update({ points: oldCoach.points });
                                                    }

                                                    transporter.sendMail(mailOptions_user, (err, info) => {
                                                        transporter.close();
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            console.log('Email sent to customer: ' + info.response);
                                                        }
                                                    });

                                                    transporter.sendMail(mailOptions_coach, (err, info) => {
                                                        transporter.close();
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            console.log('Email sent to coach: ' + info.response);
                                                        }
                                                    });

                                                    res.send("Coach updated successfully!");
                                                }
                                            })
                                    }
                                }).catch(err => {
                                    console.log("Error: ", err);
                                });
                        }
                    })
                    .catch(err => {
                        console.log("Error: ", err);
                    });
            }
        }).catch(err => {
            console.log("Error: ", err);
        });
})

app.post('/change_coach', urlencodedParser, function (req, res) {
    /*
    * Get the old coach
    * Get the new coach
    * Get all users
    * Assign the new coach to the user
    * Get the plan
    * Transfer the points from old coach to new coach
    * Mail the user & the coach
    */

    var coachData = {
        custCount: req.body.custCount
    }

    //Get the old Coach
    var coachRef_old = db.collection('coaches').doc(req.body.oldCoachID);
    var getDoc = coachRef_old.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such coach!');
            }
            else {
                coachData.oldCoach = doc.data();

                var coachRef_new = db.collection('coaches').doc(req.body.newCoachID);
                var getDoc_1 = coachRef_new.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            coachData.newCoach = doc.data();

                            var today = new Date();
                            today = changeTimestampToString(today);

                            var userRef = db.collection('users');
                            var getDoc_2 = userRef.get()
                                .then(snapshot => {
                                    if (snapshot.empty) {
                                        console.log('No matching data');
                                        return;
                                    }
                                    else {
                                        snapshot.forEach(doc => {
                                            if (doc.data().end_date >= today) {
                                                if (coachData.custCount[0] > 0) {
                                                    var add_NC = false, add_FC = false;

                                                    var dietitian_name;
                                                    if (doc.data().dietitian.coach_name) {
                                                        dietitian_name = doc.data().dietitian.coach_name
                                                    }
                                                    else {
                                                        dietitian_name = doc.data().dietitian;
                                                    }

                                                    var fitness_trainer_name;
                                                    if (doc.data().fitness_trainer.coach_name) {
                                                        fitness_trainer_name = doc.data().fitness_trainer.coach_name;
                                                    }
                                                    else {
                                                        fitness_trainer_name = doc.data().fitness_trainer;
                                                    }

                                                    if (coachData.oldCoach.coach_name == dietitian_name) {
                                                        var updateUser = userRef.doc(doc.data().phone)
                                                            .update({ dietitian: coachData.newCoach.coach_name });
                                                        add_NC = true;
                                                    }
                                                    else if (coachData.oldCoach.coach_name == fitness_trainer_name) {
                                                        var updateUser = userRef.doc(doc.data().phone)
                                                            .update({ fitness_trainer: coachData.newCoach.coach_name });
                                                        add_FC = true;
                                                    }

                                                    if (add_NC || add_FC) {
                                                        //Get the Plan Name
                                                        var plan_name;
                                                        if (doc.data().plan.plan_name) {
                                                            plan_name = doc.data().plan.plan_name;
                                                        }
                                                        else {
                                                            plan_name = doc.data().plan;
                                                        }
                                                        switch (plan_name) {
                                                            case 'SL':
                                                                plan_name = 'Slimming';
                                                                break;
                                                            case 'TO':
                                                                plan_name = 'Toning';
                                                                break;
                                                            case 'TH':
                                                                plan_name = 'Total Health';
                                                                break;
                                                            case 'PR':
                                                                plan_name = 'Premium';
                                                                break;
                                                            case 'FR':
                                                                plan_name = 'Free';
                                                                break;
                                                        }

                                                        //Mail the customer
                                                        var html_user = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            Your new ${coachData.newCoach.coach_type} Coach is ${coachData.newCoach.coach_name}.
            <br />
You can reach out to them on WhatsApp on ${coachData.newCoach.phone}.
</p>
    ${mail_template_footer()}
    `;

                                                        var html_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${coachData.newCoach.coach_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have transferred a user to you. Please check the details:
            <br />
            <br /> Name: ${doc.data().user_name}.
            <br /> Phone number: ${doc.data().phone}.
            <br /> Progam: ${plan_name}.
            <br /> Start Date: ${doc.data().start_date}.
            <br /> Start Date: ${doc.data().end_date}.
       </p>
    ${mail_template_footer()}
    `;

                                                        var mailOptions_coach = {
                                                            from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                                            to: coachData.newCoach.email,
                                                            subject: 'New User Transferred to you',
                                                            html: html_coach
                                                        }

                                                        var mailOptions_user = {
                                                            from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                                            to: doc.data().email,
                                                            subject: 'New Health Coach Assigned',
                                                            html: html_user
                                                        }

                                                        coachData.custCount[0]--;

                                                        //Transfer points
                                                        var date = new Date();
                                                        var user_name = doc.data().user_name;
                                                        var end_month = new Date(doc.data().end_date).getMonth();
                                                        var duration = end_month - date.getMonth() + 1;
                                                        var planRef = db.collection('plans').doc(plan_name);
                                                        var getDoc = planRef.get()
                                                            .then(doc => {
                                                                if (!doc.exists) {
                                                                    res.send('No such plan!');
                                                                }
                                                                else {
                                                                    if (add_NC) {
                                                                        add_points(coachData.newCoach, doc.data(), user_name, date, duration, true, false, false, false);
                                                                        coachRef_new.update({ points: coachData.newCoach.points });
                                                                        coachRef_new.update({ points_history: coachData.newCoach.points_history });

                                                                        deduct_points(coachData.oldCoach, doc.data(), user_name, date, duration, true, false);
                                                                        coachRef_old.update({ points: coachData.oldCoach.points });
                                                                        coachRef_old.update({ points_history: coachData.oldCoach.points_history });
                                                                    }
                                                                    if (add_FC) {
                                                                        add_points(coachData.newCoach, doc.data(), user_name, date, duration, false, true, false, false);
                                                                        coachRef_new.update({ points: coachData.newCoach.points });
                                                                        coachRef_new.update({ points_history: coachData.newCoach.points_history });

                                                                        deduct_points(coachData.oldCoach, doc.data(), user_name, date, duration, false, true);
                                                                        coachRef_old.update({ points: coachData.oldCoach.points });
                                                                        coachRef_old.update({ points_history: coachData.oldCoach.points_history });
                                                                    }

                                                                    transporter.sendMail(mailOptions_user, (err, info) => {
                                                                        transporter.close();
                                                                        if (err) {
                                                                            console.log(err);
                                                                        } else {
                                                                            console.log('Email sent to customer: ' + info.response);
                                                                        }
                                                                    });

                                                                    transporter.sendMail(mailOptions_coach, (err, info) => {
                                                                        transporter.close();
                                                                        if (err) {
                                                                            console.log(err);
                                                                        } else {
                                                                            console.log('Email sent to coach: ' + info.response);
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                    }
                                                }
                                            }
                                        })
                                        res.send("Coach updated successfully!");
                                    }
                                }).catch(err => {
                                    console.log("Error: ", err);
                                });
                        }
                    }).catch(err => {
                        console.log("Error: ", err);
                    });
            }
        }).catch(err => {
            console.log("Error: ", err);
        });
})

app.post('/iat', urlencodedParser, function (req, res) {
    var lead = {
        name: req.body.form_response.answers[3].text,
        phone: req.body.form_response.answers[8].phone_number,
        email: req.body.form_response.answers[7].email,
        source: 'IAT',
        added_time: req.body.form_response.submitted_at,
        status: "Not Contacted",
        iat_data: {},
        last_interaction_on: new Date()
    };

    lead.iat_data = {
        count_preexisting_conditions: req.body.form_response.answers[0].choice.label,
        flu_frequency: req.body.form_response.answers[1].choice.label,
        lifestyle: req.body.form_response.answers[2].choice.label,
        frequency_healthy_diet: req.body.form_response.answers[4].choice.label,
        sleep_quality: req.body.form_response.answers[5].choice.label,
        frequency_exhaustion: req.body.form_response.answers[6].choice.label,
        immunity_score: req.body.form_response.calculated.score,
        taken_on: req.body.form_response.submitted_at
    };

    //Check if lead already exists. If she does, update her, otherwise add her
    var leadRef = db.collection('leads').doc(lead.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                var setDoc = db.collection("leads").doc(lead.phone).set(lead);
            }
            else {
                if (!doc.data().iat_data)
                    leadRef.update({ iat_data: lead.iat_data });
                if (!doc.data().source)
                    leadRef.update({ source: lead.source });
                if (!doc.data().added_time)
                    leadRef.update({ added_time: lead.added_time });
                leadRef.update({ status: lead.status });
                leadRef.update({ last_interaction_on: lead.last_interaction_on });
            }

            res.send("Lead saved!")

        }).catch(err => {
            res.send("Error: ", err);
        })
})

app.post('/pcos_quiz', urlencodedParser, function (req, res) {
    var lead = {
        name: req.body.form_response.answers[3].text,
        phone: req.body.form_response.answers[9].phone_number,
        email: req.body.form_response.answers[8].email,
        source: 'PCOS Quiz',
        funnel: ["PCOS"],
        added_time: req.body.form_response.submitted_at,
        status: "Not Contacted",
        pcos_quiz_data: {},
        last_interaction_on: new Date()
    };

    lead.pcos_quiz_data = {
        difficulty_losing_weight: req.body.form_response.answers[0].choice.label,
        facial_hair: req.body.form_response.answers[1].choice.label,
        irregular_cycle: req.body.form_response.answers[2].choice.label,
        infertility: req.body.form_response.answers[4].choice.label,
        acne: req.body.form_response.answers[5].choice.label,
        depression: req.body.form_response.answers[6].choice.label,
        most_concerning_symptom: req.body.form_response.answers[7].choice.label,
        pcos_risk: req.body.form_response.calculated.score,
        taken_on: req.body.form_response.submitted_at
    };

    var html_lead = mail_template_pcos(lead.name, lead.pcos_quiz_data.pcos_risk);

    var mailOptions_lead = {
        from: 'Anjali from Modern Monk<support@modernmonk.in>',
        to: lead.email,
        subject: 'Your PCOS Quiz Results | Modern Monk',
        html: html_lead
    }

    //Check if lead already exists. If she does, update her, otherwise add her
    var leadRef = db.collection('leads').doc(lead.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                var setDoc = db.collection("leads").doc(lead.phone).set(lead);
            }
            else {
                if (!doc.data().pcos_quiz_data)
                    leadRef.update({ pcos_quiz_data: lead.pcos_quiz_data });
                if (!doc.data().source)
                    leadRef.update({ source: lead.source });
                //If funnel already exists
                if (doc.data().funnel) {
                    //If the funnel doesn't contain Vihara
                    if (doc.data().funnel.indexOf("PCOS") == -1) {
                        var new_funnel = doc.data().funnel;
                        new_funnel.push("PCOS");
                        leadRef.update({ funnel: new_funnel });
                    }
                }
                else {
                    leadRef.update({ funnel: newLeadData.funnel });
                }
                if (!doc.data().added_time)
                    leadRef.update({ added_time: lead.added_time });
                leadRef.update({ status: lead.status });
                leadRef.update({ last_interaction_on: lead.last_interaction_on });
            }

            transporter.sendMail(mailOptions_lead, (err, info) => {
                transporter.close();
                if (err) {
                    console.log(err);
                } else {
                    console.log('PCOS Quiz report sent to lead');
                }
            });

            res.send("PCOS Quiz Report received & saved!")

        }).catch(err => {
            res.send("Error: ", err);
        })
})

app.post('/prakriti_analysis', urlencodedParser, function (req, res) {
    var lead = {
        name: req.body.first_name + " " + req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        added_time: req.body.added_time,
        source: "Prakriti Quiz",
        status: "Not Contacted",
        prakriti_quiz_data: {},
        last_interaction_on: new Date()
    };

    lead.prakriti_quiz_data = {
        body_type: req.body.body_type,
        weight_tendency: req.body.weight_tendency,
        temperature: req.body.temperature,
        height_category: req.body.height_category,
        bone_structure: req.body.bone_structure,
        joints: req.body.joints,
        complexion: req.body.complexion,
        skin_texture: req.body.skin_texture,
        hair: req.body.hair,
        lips: req.body.lips,
        nails: req.body.nails,
        appetite: req.body.appetite,
        bowel_movements: req.body.bowel_movements,
        communication: req.body.communication,
        pace_of_work: req.body.pace_of_work,
        reaction: req.body.reaction,
        sleep: req.body.sleep,
        mental_activity: req.body.mental_activity,
        concentration: req.body.concentration,
        taken_on: req.body.added_time
    }

    var vaata = 0, pitta = 0, kapha = 0;

    switch (lead.prakriti_quiz_data.body_type) {
        case "Thin and Lean":
            vaata += 1;
            break;
        case "Medium":
            pitta += 1;
            break;
        case "Well Built":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.weight_tendency) {
        case "Low & has difficulty in putting on weight":
            vaata += 1;
            break;
        case "Medium & can gain & lose weight easily":
            pitta += 1;
            break;
        case "Overweight & Difficult to lose weight":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.temperature) {
        case "Less than Normal, Hands and Feets are Cold":
            vaata += 1;
            break;
        case "More than Normal, Face and Forehead Hot":
            pitta += 1;
            break;
        case "Normal, Hands and Feet Slightly Cold":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.height_category) {
        case "Tall/Short":
            vaata += 1;
            break;
        case "Average":
            pitta += 1;
            break;
        case "Thin & sturdy/Short & stocky":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.bone_structure) {
        case "Light & small bones with Prominent joints":
            vaata += 1;
            break;
        case "Medium bone structure":
            pitta += 1;
            break;
        case "Large & broad shoulders with Heavy bone structure":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.joints) {
        case "Weak, Noise on Movement":
            vaata += 1;
            break;
        case "Healthy with Optimal Strength":
            pitta += 1;
            break;
        case "Heavy Weight Bearing":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.complexion) {
        case "Dark":
            vaata += 1;
            break;
        case "Pink to Red":
            pitta += 1;
            break;
        case "White & pale which tans evenly":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.skin_texture) {
        case "Dry with pigmentation and aging":
            vaata += 1;
            break;
        case "Freckles with many moles & redness & rashes & acne":
            pitta += 1;
            break;
        case "Soft & glowing & youthful":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.hair) {
        case "Dry and with Split Ends":
            vaata += 1;
            break;
        case "Normal thin and more Hair fall":
            pitta += 1;
            break;
        case "Greasy Heavy":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.lips) {
        case "Tight & thin & dry lips which chaps easily":
            vaata += 1;
            break;
        case "Lips are soft & medium-sized":
            pitta += 1;
            break;
        case "Lips are large & soft & pink & full":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.nails) {
        case "Blackish, Small , Brittle":
            vaata += 1;
            break;
        case "Reddish, Small":
            pitta += 1;
            break;
        case "Pinkish, Big, Smooth":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.appetite) {
        case "Irregular, Any Time":
            vaata += 1;
            break;
        case "Sudden Hunger Pangs, Sharp Hunger":
            pitta += 1;
            break;
        case "Can Skip any Meal Easily":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.bowel_movements) {
        case "Dry, Hard, Blackish, Scanty Stools":
            vaata += 1;
            break;
        case "Soft, Yellowish, Loose Stools":
            pitta += 1;
            break;
        case "Heavy, Thick, Stick Stools":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.communication) {
        case "Fast, Irrelevant Talk, Speech not Clear":
            vaata += 1;
            break;
        case "Good Speakers with Genuine Argumentative Skills":
            pitta += 1;
            break;
        case "Authoritative, Firm and Little Speech":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.pace_of_work) {
        case "Fast, Always in Hurry":
            vaata += 1;
            break;
        case "Medium, Energetic":
            pitta += 1;
            break;
        case "Slow, Steady":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.reaction) {
        case "Anxiety, Worry, Irritability":
            vaata += 1;
            break;
        case "Anger, Aggression":
            pitta += 1;
            break;
        case "Calm, Reclusive, Sometimes Depressive":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.sleep) {
        case "Interrupted, Less":
            vaata += 1;
            break;
        case "Moderate":
            pitta += 1;
            break;
        case "Sleepy, Lazy":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.mental_activity) {
        case "Quick, Restless":
            vaata += 1;
            break;
        case "Smart, Intellectual, Aggressive":
            pitta += 1;
            break;
        case "Calm, Stable":
            kapha += 1;
            break;
        default:
            break;
    }
    switch (lead.prakriti_quiz_data.concentration) {
        case "Good":
            vaata += 1;
            break;
        case "Moderate":
            pitta += 1;
            break;
        case "Poor":
            kapha += 1;
            break;
        default:
            break;
    }

    var prakriti;

    //One of the doshas is the greatest
    if (vaata > pitta && vaata > kapha) {
        if (pitta > kapha)
            prakriti = "Vaata Pittaj";
        else if (kapha > pitta)
            prakriti = "Vaata Kaphaj";
        else if (kapha == pitta)
            prakriti = "Vaataj";
    }
    //One of the doshas is the greatest
    else if (pitta > vaata && pitta > kapha) {
        if (vaata > kapha)
            prakriti = "Pitta Vaataj";
        else if (kapha > vaata)
            prakriti = "Pitta Kaphaj";
        else if (kapha == vaata)
            prakriti = "Pittaj";
    }
    //One of the doshas is the greatest
    else if (kapha > pitta && kapha > vaata) {
        if (pitta > vaata)
            prakriti = "Kapha Pittaj";
        else if (pitta < vaata)
            prakriti = "Kapha Vaataj";
        else if (vaata == pitta)
            prakriti = "Kaphaj";
    }
    //No one dominant Dosha
    else if (vaata == pitta && vaata > kapha) {
        prakriti = "Vaata Pittaj";
    }
    //No one dominant Dosha
    else if (vaata == kapha && vaata > pitta) {
        prakriti = "Vaata Kaphaj";
    }

    lead.prakriti_quiz_data.prakriti = prakriti;

    var html_lead = ``;
    // Mail If lead Have Selected Vattaj
    if (prakriti == "Vaata Pittaj" || "Vaata Kaphaj" || "Vaataj") {
        html_lead += `${mail_template_vaataj(req.body.first_name)}`;
    }

    //Mail If lead Has Selected Pittaj

    else if (prakriti == "Pitta Vaataj" || "Pitta Kaphaj" || "Pittaj") {
        html_lead += `${mail_template_pittaj(req.body.first_name)}`;
    }

    //Mail If lead Has Selected Kaphaj
    else if (prakriti == "Kapha Pittaj" || "Kapha Vaataj" || "Kaphaj") {
        html_lead += `${mail_template_Kaphaj(req.body.first_name)}`;
    }

    lead.prakriti_quiz_data.prakriti = prakriti;

    var mailOptions_lead = {
        from: 'Anjali from Modern Monk<support@modernmonk.in>',
        to: lead.email,
        subject: 'Your Prakriti Analysis',
        html: html_lead
    }

    //Check if lead already exists. If she does, update her, otherwise add her
    var leadRef = db.collection('leads').doc(lead.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                var setDoc = db.collection("leads").doc(lead.phone).set(lead);
            }
            else {
                if (!doc.data().prakriti_quiz_data)
                    leadRef.update({ prakriti_quiz_data: lead.prakriti_quiz_data });
                if (!doc.data().source)
                    leadRef.update({ source: lead.source });
                if (!doc.data().added_time)
                    leadRef.update({ added_time: lead.added_time });
                leadRef.update({ status: lead.status });
                leadRef.update({ last_interaction_on: lead.last_interaction_on });
            }
        });

    transporter.sendMail(mailOptions_lead, (err, info) => {
        transporter.close();
        if (err) {
            console.log(err);
        } else {
            console.log('Prakriti Analysis report sent to lead');
        }
    });

    res.send("Prakriti Quiz Report received & saved!")
});

app.post('/refund_success', urlencodedParser, function (req, res) {
    var userData = {
        phone: req.body.phone,
        amount: req.body.amount
    }

    //Get the Coach
    var userRef = db.collection('users').doc(userData.phone);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such coach!');
            }
            else {
                //Mail the customer
                var html = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            Your refund amount of ₹${userData.amount} has been processed successfully.
            <br />
It will reflect in your bank account within 3-4 business days.
            <br />
Please note that the refund is in line with our refund and cancelation policy. 
You can read more about the same by <a href="https://modernmonk.in/refund">clicking here</a>.
            <br />
            <br />
We are really sad to see you go. 
<br />
We would appreciate if you could tell us what went wrong by rating your coaches:
<br />
Rate your Achara Coach: ${doc.data().dietitian.feedback_url}.
<br />
Rate your Vihara Coach: ${doc.data().fitness_trainer.feedback_url}.
<br />
<br />
If you ever wish to restart your program, just <a href="mailto:support@modernmonk.in">write to us</a>.</p>
    ${mail_template_footer()}
    `;

                var mailOptions = {
                    from: 'Modern Monk<support@modernmonk.in>',
                    to: doc.data().email,
                    subject: 'Your Refund has been processed successfully',
                    html: html
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    transporter.close();
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent to customer: ' + info.response);
                    }
                });

                //Update end date of the customer
                var date = new Date();
                date = changeTimestampToString(date);
                userRef.update({ end_date: date });

                //deduct_points();                
                //Update Coaches' Data
                /*  NC_Ref.update({ points: newUserData.dietitian.points });
                  FC_Ref.update({ points: newUserData.fitness_trainer.points });
                  NC_Ref.update({ points_history: newUserData.dietitian.points_history });
                  FC_Ref.update({ points_history: newUserData.fitness_trainer.points_history });
                  */

                res.send("Mail sent successfully to " + doc.data().user_name + "!");
            }
        })
        .catch(err => {
            console.log("Error: ", err);
        })
})

/*This method allows the Dietitian to add to the list of 2 days prior to the chosen date
 * the name of the user. Example: If the Dietitian says that Suresh's next plan starts on 
 * 10th Dec, she will get a reminder on 8th Dec.*/
app.post('/nextdietplandate', urlencodedParser, function (req, res) {
    var newDate = {
        user_name: req.body.userlist,
        phone: req.body.phone,
        new_date: req.body.new_date,
    }

    var dietPlanDates = [];
    newDate.new_date = incr_date(newDate.new_date, -2);

    var userRef = db.collection('users').doc(newDate.phone);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                dietPlanDates = doc.data().dietPlanDates;

                //Corner case 1: All the dates need to be changed
                if (dietPlanDates[0] > newDate.new_date) {
                    //Remove all dates
                    dietPlanDates.length = 0;

                    //Add new dates in line with the New Date
                    var varDate = newDate.new_date;
                    //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                    while (varDate <= doc.data().end_date) {
                        dietPlanDates.push(varDate);
                        varDate = incr_date(varDate, 10);
                    }
                }
                //Corner case 2: It's the 'last call/plan day'
                else if (dietPlanDates[dietPlanDates.length - 1] < newDate.new_date) {
                    if (newDate.new_date < doc.data().end_date) {
                        dietPlanDates.push(newDate.new_date);
                    }
                }
                //all other cases
                else {
                    for (var j = 0; j < dietPlanDates.length; j++) {
                        if (dietPlanDates[j] < newDate.new_date && dietPlanDates[j + 1] > newDate.new_date) {
                            //Remove all dates after the last date before New Date
                            dietPlanDates.length = j + 1;

                            //Add new dates in line with the New Date
                            var varDate = newDate.new_date;
                            //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                            while (varDate <= doc.data().end_date) {
                                dietPlanDates.push(varDate);
                                varDate = incr_date(varDate, 10);
                            }
                        }
                    }
                }

                //Write to DB
                var updateUser = userRef.update({ dietPlanDates: dietPlanDates });
                res.send("Update successful!")
            }
        })
        .catch(err => {
            console.log('Error getting User', err);
        });
})

/*This method allows the Dietitian to add to the list of the chosen date the name of the user. 
 * Example: If the Dietitian says that Suresh should get a call on 10th Dec, she will
get a reminder on 10th Dec.*/
app.post('/nextdietcalldate', urlencodedParser, function (req, res) {
    var newDate = {
        user_name: req.body.userlist,
        phone: req.body.phone,
        new_date: req.body.new_date,
    }

    var dietCallDates = [];

    var userRef = db.collection('users').doc(newDate.phone);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                dietCallDates = doc.data().dietCallDates;

                //Corner case 1: All the dates need to be changed
                if (dietCallDates[0] > newDate.new_date) {
                    //Remove all dates
                    dietCallDates.length = 0;

                    //Add new dates in line with the New Date
                    var varDate = newDate.new_date;
                    //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                    if (doc.data().plan == "FREE") {
                        dietCallDates.push(varDate);
                        varDate = incr_date(varDate, 6);
                        dietCallDates.push(varDate);
                    }
                    else if (doc.data().plan == "SL") {
                        while (varDate <= doc.data().end_date) {
                            dietCallDates.push(varDate);
                            varDate = incr_date(varDate, 10);
                        }
                    }
                    else if (doc.data().plan == "TO" || doc.data().plan == "TH") {
                        while (varDate <= doc.data().end_date) {
                            dietCallDates.push(varDate);
                            varDate = incr_date(varDate, 5);
                        }
                    }
                    else if (doc.data().plan == "PR") {
                        while (varDate <= doc.data().end_date) {
                            dietCallDates.push(varDate);
                            varDate = incr_date(varDate, 3);
                        }
                    }
                }
                //Corner case 2: It's the 'last call/plan day'
                else if (dietCallDates[dietCallDates.length - 1] < newDate.new_date) {
                    if (doc.data().plan == "FREE") {
                        //Remove all dates
                        dietCallDates.length = 0;

                        dietCallDates.push(newDate.new_date);
                        var new_end_date = incr_date(newDate.new_date, 6);
                        dietCallDates.push(newDate.new_end_date);
                    }
                    else {
                        if (newDate.new_date < doc.data().end_date) {
                            dietCallDates.push(newDate.new_date);
                        }
                    }
                }
                //all other cases
                else {
                    for (var j = 0; j < dietCallDates.length; j++) {
                        if (dietCallDates[j] < newDate.new_date && dietCallDates[j + 1] > newDate.new_date) {
                            //Remove all dates after the last date before New Date
                            dietCallDates.length = j + 1;

                            //Add new dates in line with the New Date
                            var varDate = newDate.new_date;
                            //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                            if (doc.data().plan == "SL") {
                                while (varDate <= doc.data().end_date) {
                                    dietCallDates.push(varDate);
                                    varDate = incr_date(varDate, 10);
                                }
                            }
                            else if (doc.data().plan == "TO" || doc.data().plan == "TH") {
                                while (varDate <= doc.data().end_date) {
                                    dietCallDates.push(varDate);
                                    varDate = incr_date(varDate, 5);
                                }
                            }
                            else if (doc.data().plan == "PR") {
                                while (varDate <= doc.data().end_date) {
                                    dietCallDates.push(varDate);
                                    varDate = incr_date(varDate, 3);
                                }
                            }
                        }
                    }
                }

                //Push the end date
                if (doc.data().plan != "FREE") {
                    dietCallDates.push(doc.data().end_date);
                }

                //Write to DB
                var updateUser = userRef.update({ dietCallDates: dietCallDates });
                res.send("Update successful!")
            }
        })
        .catch(err => {
            console.log('Error getting User', err);
        });
})

app.post('/nextworkoutcalldate', urlencodedParser, function (req, res) {
    var newDate = {
        user_name: req.body.userlist,
        phone: req.body.phone,
        new_date: req.body.new_date,
    }

    var workoutCallDates = [];

    var userRef = db.collection('users').doc(newDate.phone);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                workoutCallDates = doc.data().workoutCallDates;

                //Corner case 1: All the dates need to be changed
                if (workoutCallDates[0] > newDate.new_date) {
                    //Remove all dates
                    workoutCallDates.length = 0;

                    //Add new dates in line with the New Date
                    var varDate = newDate.new_date;
                    //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                    if (doc.data().plan == "FREE") {
                        workoutCallDates.push(varDate);
                        varDate = incr_date(varDate, 6);
                        workoutCallDates.push(varDate);
                    }
                    else if (doc.data().plan == "SL") {
                    }
                    else if (doc.data().plan == "TO" || doc.data().plan == "TH") {
                        while (varDate <= doc.data().end_date) {
                            workoutCallDates.push(varDate);
                            varDate = incr_date(varDate, 5);
                        }
                    }
                    else if (doc.data().plan == "PR") {
                        while (varDate <= doc.data().end_date) {
                            workoutCallDates.push(varDate);
                            varDate = incr_date(varDate, 3);
                        }
                    }
                }
                //Corner case 2: It's the 'last call/plan day'
                else if (workoutCallDates[workoutCallDates.length - 1] < newDate.new_date) {
                    if (doc.data().plan == "FREE") {
                        //Remove all dates
                        workoutCallDates.length = 0;

                        workoutCallDates.push(newDate.new_date);
                        var new_end_date = incr_date(newDate.new_date, 6);
                        workoutCallDates.push(newDate.new_end_date);
                    }
                    else {
                        if (newDate.new_date < doc.data().end_date) {
                            workoutCallDates.push(newDate.new_date);
                        }
                    }
                }
                //all other cases
                else {
                    for (var j = 0; j < workoutCallDates.length; j++) {
                        if (workoutCallDates[j] < newDate.new_date && workoutCallDates[j + 1] > newDate.new_date) {
                            //Remove all dates after the last date before New Date
                            workoutCallDates.length = j + 1;

                            //Add new dates in line with the New Date
                            var varDate = newDate.new_date;
                            //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                            if (doc.data().plan == "SL") {
                            }
                            else if (doc.data().plan == "TO" || doc.data().plan == "TH") {
                                while (varDate <= doc.data().end_date) {
                                    workoutCallDates.push(varDate);
                                    varDate = incr_date(varDate, 5);
                                }
                            }
                            else if (doc.data().plan == "PR") {
                                while (varDate <= doc.data().end_date) {
                                    workoutCallDates.push(varDate);
                                    varDate = incr_date(varDate, 3);
                                }
                            }
                        }
                    }
                }

                //Push the end date
                if (doc.data().plan != "FREE" || doc.data().plan != "SL") {
                    workoutCallDates.push(doc.data().end_date);
                }

                //Write to DB
                var updateUser = userRef.update({ workoutCallDates: workoutCallDates });
                res.send("Update successful!")
            }
        })
        .catch(err => {
            console.log('Error getting User', err);
        });
})

/*This method allows the Coach to add to the list of 2 days prior to the chosen date
 * the name of the user. Example: If the Dietitian says that Suresh's next plan starts on 
 * 10th Dec, she will get a reminder on 8th Dec.*/
app.post('/nextacharaplandate', urlencodedParser, function (req, res) {
    //Get Plan
    var planRef = db.collection('plans').doc('Diabetes Management');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var newDate = {
                    user_name: req.body.userlist,
                    phone: req.body.phone,
                    new_date: req.body.new_date,
                }

                var acharaPlanDates = [];
                newDate.new_date = incr_date(newDate.new_date, -2);

                var userRef = db.collection('users').doc(newDate.phone);
                var getDoc = userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such user!');
                        }
                        else {
                            acharaPlanDates = doc.data().acharaPlanDates;

                            //Corner case 1: All the dates need to be changed
                            if (acharaPlanDates[0] > newDate.new_date) {
                                //Remove all dates
                                acharaPlanDates.length = 0;

                                //Add new dates in line with the New Date
                                var varDate = newDate.new_date;
                                //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                while (varDate <= doc.data().end_date) {
                                    acharaPlanDates.push(varDate);
                                    varDate = incr_date(varDate,
                                        Math.ceil(doc.data().duration / doc.data().achara_coach_plans_count));
                                }
                            }
                            //Corner case 2: It's the 'last call/plan day'
                            else if (acharaPlanDates[acharaPlanDates.length - 1] < newDate.new_date) {
                                if (newDate.new_date < doc.data().end_date) {
                                    acharaPlanDates.push(newDate.new_date);
                                }
                            }
                            //all other cases
                            else {
                                for (var j = 0; j < acharaPlanDates.length; j++) {
                                    if (acharaPlanDates[j] < newDate.new_date && acharaPlanDates[j + 1] > newDate.new_date) {
                                        //Remove all dates after the last date before New Date
                                        acharaPlanDates.length = j + 1;

                                        //Add new dates in line with the New Date
                                        var varDate = newDate.new_date;
                                        //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                        while (varDate <= doc.data().end_date) {
                                            acharaPlanDates.push(varDate);
                                            varDate = incr_date(varDate,
                                                Math.ceil(doc.data().duration / doc.data().achara_coach_plans_count));
                                        }
                                    }
                                }
                            }

                            //Write to DB
                            userRef.update({ acharaPlanDates: acharaPlanDates });
                            res.send("Update successful!")
                        }
                    })
                    .catch(err => {
                        console.log('Error getting User', err);
                    });
            }
        }).catch(err => {
            console.log('Error getting Plan', err);
        });
})

/*This method allows the Dietitian to add to the list of the chosen date the name of the user. 
 * Example: If the Dietitian says that Suresh should get a call on 10th Dec, she will
get a reminder on 10th Dec.*/
app.post('/nextacharacalldate', urlencodedParser, function (req, res) {
    //Get Plan
    var planRef = db.collection('plans').doc('Diabetes Management');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var newDate = {
                    user_name: req.body.userlist,
                    phone: req.body.phone,
                    new_date: req.body.new_date,
                }

                var acharaCallDates = [];

                var userRef = db.collection('users').doc(newDate.phone);
                var getDoc = userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such user!');
                        }
                        else {
                            acharaCallDates = doc.data().acharaCallDates;

                            //Corner case 1: All the dates need to be changed
                            if (acharaCallDates[0] > newDate.new_date) {
                                //Remove all dates
                                acharaCallDates.length = 0;

                                //Add new dates in line with the New Date
                                var varDate = newDate.new_date;
                                //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                while (varDate <= doc.data().end_date) {
                                    acharaCallDates.push(varDate);
                                    varDate = incr_date(varDate,
                                        Math.ceil(doc.data().duration / doc.data().achara_coach_calls_count));
                                }
                            }
                            //Corner case 2: It's the 'last call/plan day'
                            else if (acharaCallDates[acharaCallDates.length - 1] < newDate.new_date) {
                                if (newDate.new_date < doc.data().end_date) {
                                    acharaCallDates.push(newDate.new_date);
                                }
                            }
                            //all other cases
                            else {
                                for (var j = 0; j < acharaCallDates.length; j++) {
                                    if (acharaCallDates[j] < newDate.new_date && acharaCallDates[j + 1] > newDate.new_date) {
                                        //Remove all dates after the last date before New Date
                                        acharaCallDates.length = j + 1;

                                        //Add new dates in line with the New Date
                                        var varDate = newDate.new_date;
                                        //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                        while (varDate <= doc.data().end_date) {
                                            acharaCallDates.push(varDate);
                                            varDate = incr_date(varDate,
                                                Math.ceil(doc.data().duration / doc.data().achara_coach_calls_count));
                                        }
                                    }
                                }
                            }

                            //Push the end date
                            acharaCallDates.push(doc.data().end_date);

                            //Write to DB
                            var updateUser = userRef.update({ acharaCallDates: acharaCallDates });
                            res.send("Update successful!")
                        }
                    })
                    .catch(err => {
                        console.log('Error getting User', err);
                    });
            }
        }).catch(err => {
            console.log('Error getting User', err);
        });
})

/*This method allows the Coach to add to the list of 2 days prior to the chosen date
 * the name of the user. Example: If the Dietitian says that Suresh's next plan starts on 
 * 10th Dec, she will get a reminder on 8th Dec.*/
app.post('/nextvicharaplandate', urlencodedParser, function (req, res) {
    //Get Plan
    var planRef = db.collection('plans').doc('Diabetes Management');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var newDate = {
                    user_name: req.body.userlist,
                    phone: req.body.phone,
                    new_date: req.body.new_date,
                }

                var vicharaPlanDates = [];
                newDate.new_date = incr_date(newDate.new_date, -2);

                var userRef = db.collection('users').doc(newDate.phone);
                var getDoc = userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such user!');
                        }
                        else {
                            vicharaPlanDates = doc.data().vicharaPlanDates;

                            //Corner case 1: All the dates need to be changed
                            if (vicharaPlanDates[0] > newDate.new_date) {
                                //Remove all dates
                                vicharaPlanDates.length = 0;

                                //Add new dates in line with the New Date
                                var varDate = newDate.new_date;
                                //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                while (varDate <= doc.data().end_date) {
                                    vicharaPlanDates.push(varDate);
                                    varDate = incr_date(varDate,
                                        Math.ceil(doc.data().duration / doc.data().vichara_coach_plans_count));
                                }
                            }
                            //Corner case 2: It's the 'last call/plan day'
                            else if (vicharaPlanDates[vicharaPlanDates.length - 1] < newDate.new_date) {
                                if (newDate.new_date < doc.data().end_date) {
                                    vicharaPlanDates.push(newDate.new_date);
                                }
                            }
                            //all other cases
                            else {
                                for (var j = 0; j < vicharaPlanDates.length; j++) {
                                    if (vicharaPlanDates[j] < newDate.new_date && vicharaPlanDates[j + 1] > newDate.new_date) {
                                        //Remove all dates after the last date before New Date
                                        vicharaPlanDates.length = j + 1;

                                        //Add new dates in line with the New Date
                                        var varDate = newDate.new_date;
                                        //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                        while (varDate <= doc.data().end_date) {
                                            vicharaPlanDates.push(varDate);
                                            varDate = incr_date(varDate,
                                                Math.ceil(doc.data().duration / doc.data().vichara_coach_plans_count));
                                        }
                                    }
                                }
                            }

                            //Write to DB
                            userRef.update({ vicharaPlanDates: vicharaPlanDates });
                            res.send("Update successful!")
                        }
                    })
                    .catch(err => {
                        console.log('Error getting User', err);
                    });
            }
        }).catch(err => {
            console.log('Error getting Plan', err);
        });
})

/*This method allows the Dietitian to add to the list of the chosen date the name of the user. 
 * Example: If the Dietitian says that Suresh should get a call on 10th Dec, she will
get a reminder on 10th Dec.*/
app.post('/nextvicharacalldate', urlencodedParser, function (req, res) {
    //Get Plan
    var planRef = db.collection('plans').doc('Diabetes Management');
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var newDate = {
                    user_name: req.body.userlist,
                    phone: req.body.phone,
                    new_date: req.body.new_date,
                }

                var vicharaCallDates = [];

                var userRef = db.collection('users').doc(newDate.phone);
                var getDoc = userRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such user!');
                        }
                        else {
                            vicharaCallDates = doc.data().vicharaCallDates;

                            //Corner case 1: All the dates need to be changed
                            if (vicharaCallDates[0] > newDate.new_date) {
                                //Remove all dates
                                vicharaCallDates.length = 0;

                                //Add new dates in line with the New Date
                                var varDate = newDate.new_date;
                                //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                while (varDate <= doc.data().end_date) {
                                    vicharaCallDates.push(varDate);
                                    varDate = incr_date(varDate,
                                        Math.ceil(doc.data().duration / doc.data().vichara_coach_calls_count));
                                }
                            }
                            //Corner case 2: It's the 'last call/plan day'
                            else if (vicharaCallDates[vicharaCallDates.length - 1] < newDate.new_date) {
                                if (newDate.new_date < doc.data().end_date) {
                                    vicharaCallDates.push(newDate.new_date);
                                }
                            }
                            //all other cases
                            else {
                                for (var j = 0; j < vicharaCallDates.length; j++) {
                                    if (vicharaCallDates[j] < newDate.new_date && vicharaCallDates[j + 1] > newDate.new_date) {
                                        //Remove all dates after the last date before New Date
                                        vicharaCallDates.length = j + 1;

                                        //Add new dates in line with the New Date
                                        var varDate = newDate.new_date;
                                        //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                                        while (varDate <= doc.data().end_date) {
                                            vicharaCallDates.push(varDate);
                                            varDate = incr_date(varDate,
                                                Math.ceil(doc.data().duration / doc.data().vichara_coach_calls_count));
                                        }
                                    }
                                }
                            }

                            //Push the end date
                            vicharaCallDates.push(doc.data().end_date);

                            //Write to DB
                            var updateUser = userRef.update({ vicharaCallDates: vicharaCallDates });
                            res.send("Update successful!")
                        }
                    })
                    .catch(err => {
                        console.log('Error getting User', err);
                    });
            }
        }).catch(err => {
            console.log('Error getting User', err);
        });
})

app.post('/add_coach', urlencodedParser, function (req, res) {
    var newCoachData = {
        coach_name: req.body.coach_name,
        phone: req.body.phone,
        email: req.body.email,
        coach_type: req.body.coach_type,
        expertise: req.body.expertise,
        active_hours: req.body.active_hours,
        feedback_url: req.body.feedback_url,
        joining_date: req.body.joining_date
    }

    newCoachData.availability = [
        {
            timings: req.body.availability_time_sunday ? (req.body.availability_time_sunday + '').split(",") : "",
            format: req.body.availability_format_sunday
        },
        {
            timings: req.body.availability_time_monday ? (req.body.availability_time_monday+ '').split(",") : "",
            format: req.body.availability_format_monday
        },
        {
            timings: req.body.availability_time_tuesday ? (req.body.availability_time_tuesday+ '').split(",") : "",
            format: req.body.availability_format_tuesday
        },
        {
            timings: req.body.availability_time_wednesday ? (req.body.availability_time_wednesday+ '').split(",") : "",
            format: req.body.availability_format_wednesday
        },
        {
            timings: req.body.availability_time_thursday ? (req.body.availability_time_thursday + '').split(",") : "",
            format: req.body.availability_format_thursday
        },
        {
            timings: req.body.availability_time_friday ? (req.body.availability_time_friday + '').split(",") : "",
            format: req.body.availability_format_friday
        },
        {
            timings: req.body.availability_time_saturday ? (req.body.availability_time_saturday + '').split(",") : "",
            format: req.body.availability_format_saturday
        }
    ];

    var coachRef = db.collection("coaches").doc(newCoachData.coach_name);
    var getDoc = coachRef.get()
        .then(doc => {
            if (!doc.exists) {
                coachRef.set(newCoachData);
            }
            else {
                if (newCoachData.coach_name)
                    coachRef.update({ coach_name: newCoachData.coach_name });
                if (newCoachData.phone)
                    coachRef.update({ phone: newCoachData.phone });
                if (newCoachData.email)
                    coachRef.update({ email: newCoachData.email });
                if (newCoachData.coach_type)
                    coachRef.update({ coach_type: newCoachData.coach_type });
                if (newCoachData.expertise)
                    coachRef.update({ expertise: newCoachData.expertise });
                if (newCoachData.active_hours)
                    coachRef.update({ active_hours: newCoachData.active_hours });
                if (newCoachData.feedback_url)
                    coachRef.update({ feedback_url: newCoachData.feedback_url });
                if (newCoachData.joining_date)
                    coachRef.update({ joining_date: newCoachData.joining_date });
                if (newCoachData.availability)
                    coachRef.update({ availability: newCoachData.availability });
            }
            res.send("Coach added successfully!");
        }).catch(function (error) {
            res.send("Error adding Coach: ", error);
        });
})

app.post('/add_plan', urlencodedParser, function (req, res) {
    var newPlanData = {
        plan_name: req.body.plan_name,
        duration: req.body.duration,
        service: req.body.service,
        nc_plans_count: req.body.nc_plans_count,
        nc_calls_count: req.body.nc_calls_count,
        fc_plans_count: req.body.fc_plans_count,
        fc_calls_count: req.body.fc_calls_count,
        achara_coach_plans_count: req.body.achara_plans_count,
        achara_coach_calls_count: req.body.achara_calls_count,
        vichara_coach_plans_count: req.body.vichara_plans_count,
        vichara_coach_calls_count: req.body.vichara_calls_count,
        points_nc: req.body.points_nc,
        points_fc: req.body.points_fc,
        points_achara_coach: req.body.points_achara_coach,
        points_vichara_coach: req.body.points_vichara_coach,
        extra_points: req.body.extra_points,
        five_star_points: req.body.five_star_points,
    }

    var setDoc = db.collection("plans").doc(newPlanData.plan_name)
        .set(newPlanData).then(function () {
            res.send("Plan added successfully!");
        })
        .catch(function (error) {
            res.send("Error adding Plan: ", error);
        });
})

function findNextWorkoutDate(nextDay, pass) {
    if (pass == 1) {
        if (nextDay.getDay() == 6) {
            nextDay = nextDayOfTheWeek(nextDay, 4);
        }
        
        else {
            nextDay = new Date(incr_date(changeTimestampToString(nextDay),1));
        }
    }
    else {
        if (nextDay.getDay() == 5) {
            nextDay = nextDayOfTheWeek(nextDay, 2);
        }
        else if (nextDay.getDay() == 6) {
            nextDay = nextDayOfTheWeek(nextDay, 3);
        }
        else {
            nextDay = new Date(incr_date(changeTimestampToString(nextDay), 2));
        }
    }
    return nextDay;
}

function findNextWorkoutDate_demo(nextDay) {
    if (nextDay.getDay() == 6) {
        nextDay = nextDayOfTheWeek(nextDay, 4);
    }
    else {
        nextDay = new Date(incr_date(changeTimestampToString(nextDay), 1));
    }
    return nextDay;
}

function getDayName(date) {
    switch ((new Date(date)).getDay()) {
        case 0:
            return 'Sunday';
            break;
        case 1:
            return 'Monday';
            break;
        case 2:
            return 'Tuesday';
            break;
        case 3:
            return 'Wednesday';
            break;
        case 4:
            return 'Thursday';
            break;
        case 5:
            return 'Friday';
            break;
        case 6:
            return 'Saturday';
            break;
    }
}

app.post('/book_vihara_demo_new', urlencodedParser, function (req, res) {
    var newLeadData = {
        name: req.body.inp_name,
        phone: req.body.inp_phone,
        status: "Not Contacted",
        source: "Website",
        added_time: new Date(),
        last_interaction_on: new Date(),
        funnel: ["Vihara"]
   }
    console.log("Here");

    if (req.body.inp_email)
        newLeadData.email = req.body.inp_email;

    //Add or Update Lead
    var leadRef = db.collection('leads').doc(newLeadData.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                leadRef.set(newLeadData);
            }
            else {
                if (newLeadData.name)
                    leadRef.update({ name: newLeadData.name });
                if (newLeadData.email)
                    leadRef.update({ email: newLeadData.email });
                leadRef.update({ status: newLeadData.status });
                leadRef.update({ source: newLeadData.source });
                //If funnel already exists
                if (doc.data().funnel) {
                    //If the funnel doesn't contain Vihara
                    if (doc.data().funnel.indexOf("PCOS") == -1) {
                        var new_funnel = doc.data().funnel;
                        new_funnel.push("PCOS");
                        leadRef.update({ funnel: new_funnel });
                    }
                }
                else {
                    leadRef.update({ funnel: newLeadData.funnel });
                }
                if (!doc.data().added_time)
                    leadRef.update({ added_time: newLeadData.added_time });
                leadRef.update({ last_interaction_on: newLeadData.last_interaction_on });
            }

            if (newLeadData.email) {
                var html_user = mail_template_book_vihara_class(newLeadData.name);

                var mailOptions = {
                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
                    to: newLeadData.email,
                    subject: 'Appointment Scheduled | Modern Monk',
                    html: html_user
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    transporter.close();
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent to Lead: ' + info.response);
                    }
                });
            }

            //Send a confirmation SMS
            var message = "Dear " + newLeadData.name + ", your Vihara Consultation with Modern Monk is booked successfully! Someone shall get in touch with you soon.";
            send_sms(message, doc.data().phone);

            res.send("Lead added successfully!");
        }).catch(function (error) {
            res.send("Error: ", error);
        });
})

/*
 * Desc: This method books a consultation with just 3 coaches in consideration - George, Nikita & Munira - and
 * their twice a week each availability. Based on the day of the week the demo is being booked on, the order in 
 * which a user gets workout formats will vary.
 * So to start, we first hardcode an array of coaches depending on the day of booking & the coaches' availability.
 * Then, we add the corresponding objects in the workoutCallDates & schedules of the lead & the coaches, respectively.
 */
app.post('/book_vihara_consultation', urlencodedParser, function (req, res) {
    var newLeadData = {
        name: req.body.inp_name,
        phone: req.body.inp_phone,
        source: "Website",
        funnel: ["Vihara"],
        added_time: new Date(),
        vihara_data: {},
        last_interaction_on: new Date()
    }

    newLeadData.vihara_data = {
        preferred_slot: req.body.inp_slot,
        workoutCallDates: []
    }

    if (req.body.inp_email)
        newLeadData.email = req.body.inp_email;
    if (req.body.inp_date)
        newLeadData.call_date = req.body.inp_date;
    if (req.body.call_time)
        newLeadData.call_time = req.body.call_time;
    if (req.body.ailments)
        newLeadData.ailments = req.body.ailments;

    //Mail new lead details to team
    var html_lead = `${JSON.stringify(newLeadData)}`;

    var mailOptions_lead = {
        from: 'Modern Monk<support@modernmonk.in>',
        to: 'anjali@modernmonk.in',
        cc:'viniks1711@gmail.com',
        subject: 'Vihara Data',
        html: html_lead
    }

    transporter.sendMail(mailOptions_lead, (err, info) => {
        transporter.close();
        if (err) {
            console.log(err);
        } else {
            console.log('Mail sent to Anjali: ' + info.response);
        }
    });

    //Get the time of the day and based on that, change the date on which all calculations will happen
    var booking_date = new Date();
    if (booking_date.getHours() >= 14 || booking_date.getHours() < 19) {
        booking_date = new Date(incr_date(changeTimestampToString(booking_date), 1));
    }

    //Build the order in which the coaches' classes will come in
    /*
     * Coaches' availability:
     * Munira: Monday, Thursday. 
     * George: Tuesday, Friday. 
     * Rutu: Wednesday, Saturday.
     */
    var rutu = 0, george = 0, munira = 0;
    //Combination 1: Booking Date = Saturday or Sunday or Wednesday -> MGR
    if (booking_date.getDay() == 0 || booking_date.getDay() == 3 || booking_date.getDay() == 6) {
        george = 1;
        rutu = 2;
    }
    //Combination 2: Booking Date = Monday or Thursday -> GRM
    else if (booking_date.getDay() == 1 || booking_date.getDay() == 4) {
        rutu = 1;
        munira = 2;
    }
    //Combination 3: Booking Date = Tuesday or Friday -> RMG
    else if (booking_date.getDay() == 2 || booking_date.getDay() == 5) {
        munira = 1;
        george = 2;
    }

    //Build Slot Array
    //Example: Slot = 7-8 and today is Sunday, so Slot Array = [{7-8, Mon}, {7-8, Wed}, {7-8, Fri}]
    var slot_arr = [], trial_dates = [];
    var i = 0;
    var nextWorkoutDay = booking_date;
    while (i < 3) {
        nextWorkoutDay = findNextWorkoutDate_demo(nextWorkoutDay);
        //Set the time to match the preferred slot
        nextWorkoutDay.setHours(newLeadData.vihara_data.preferred_slot.slice(0, 2) - 6, 30, 0, 0);
        trial_dates.push(nextWorkoutDay);

        var slot_arr_obj = newLeadData.vihara_data.preferred_slot + ", " + getDayName(nextWorkoutDay);
        slot_arr.push(slot_arr_obj);
        i++;
    }

    //Build Joining URL
    var joinURL = "";

    switch (newLeadData.vihara_data.preferred_slot.slice(0, 2)) {
        case 6:
            break;
        case '7':
            joinURL = 'https://zoom.us/j/97473914237';
            break;
        case 8:
            joinURL = 'https://zoom.us/j/92460594661';
            break;
        case 11:
            joinURL = 'https://zoom.us/j/94318966289';
            break;
        case 16:
            joinURL = 'https://zoom.us/j/95152185589';
            break;
        case 17:
            joinURL = 'https://zoom.us/j/91122052255';
            break;
        case 18:
            joinURL = '';
            break;
    }

    var coachCol = db.collection('coaches').get()
        .then(snapshot => {
            if (snapshot.empty) {
            }
            //Store all the workout formats we encounter to ensure uniqueness
            var workoutFormats = [];
            var i = 0;
            snapshot.forEach(doc => {
                if (doc.data().coach_type == "Vihara") {
                    if (i < trial_dates.length) {

                        var workoutCallDate = {
                            coach: doc.data().coach_name,
                            classType: 'Demo',
                            patientID: newLeadData.phone,
                            status: "Not Done"
                        }

                        var found = false;
                        var classDate;

                        //Check if the coach is available on the desired day and if the workout format doesn't repeat for the lead
                        if (doc.data().coach_name == 'Raro George') {
                            var workoutDay = trial_dates[george].getDay();
                            classDate=trial_dates[george];

                            workoutCallDate.ID = 'c' + doc.data().phone + newLeadData.phone + changeTimestampToString(trial_dates[george]);
                            workoutCallDate.callDate = trial_dates[george];
                            workoutCallDate.workout_format = doc.data().availability[workoutDay].format;

                            workoutFormats.push(doc.data().availability[workoutDay].format);
                            found = true;
                        }
                        else if (doc.data().coach_name == 'Munira Fakir Sabuwala') {
                            var workoutDay = trial_dates[munira].getDay();
                            classDate = trial_dates[munira];

                            workoutCallDate.ID = 'c' + doc.data().phone + newLeadData.phone + changeTimestampToString(trial_dates[munira]);
                            workoutCallDate.callDate = trial_dates[munira];
                            workoutCallDate.workout_format = doc.data().availability[workoutDay].format;

                            workoutFormats.push(doc.data().availability[workoutDay].format);
                            found = true;
                        }
                        else if (doc.data().coach_name == 'Rutu') {
                            var workoutDay = trial_dates[rutu].getDay();
                            classDate=trial_dates[rutu];

                            workoutCallDate.ID = 'c' + doc.data().phone + newLeadData.phone + changeTimestampToString(trial_dates[rutu]);
                            workoutCallDate.callDate = trial_dates[rutu];
                            workoutCallDate.workout_format = doc.data().availability[workoutDay].format;

                            workoutFormats.push(doc.data().availability[workoutDay].format);
                            found = true;
                        }

                        if (found) {
                            //Schedule SMS Reminders
                            scheduleViharaReminders(newLeadData.phone, 'Demo', doc.data().coach_name, joinURL, classDate);

                            newLeadData.vihara_data.workoutCallDates.push(workoutCallDate);

                            //Update the coach with the class details
                            var coachRef = db.collection('coaches').doc(doc.data().coach_name);
                            var getDoc = coachRef.get()
                                .then(doc => {
                                    if (!doc.exists) {
                                    }
                                    else {
                                        var new_schedule = []
                                        if (doc.data().schedule) {
                                            new_schedule = doc.data().schedule;
                                        }

                                        new_schedule.push(workoutCallDate);
                                        coachRef.update({ schedule: new_schedule });
                                    }
                                })
                            i++;
                        }
                    }
                }
            })


            //Add or Update Lead
            var leadRef = db.collection('leads').doc(newLeadData.phone);
            var getDoc = leadRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        leadRef.set(newLeadData);
                    }
                    else {
                        if (newLeadData.name)
                            leadRef.update({ name: newLeadData.name });
                        if (newLeadData.email)
                            leadRef.update({ email: newLeadData.email });
                        if (newLeadData.call_date)
                            leadRef.update({ call_date: newLeadData.call_date });
                        if (newLeadData.call_time)
                            leadRef.update({ call_time: newLeadData.call_time });
                        if (newLeadData.ailments)
                            leadRef.update({ ailments: newLeadData.ailments });
                        leadRef.update({ source: newLeadData.source });
                        leadRef.update({ vihara_data: newLeadData.vihara_data });

                        if (workoutFormats.length != 3) {
                            leadRef.update({ status: 'Not Contacted' });
                            leadRef.update({ pre_consultant: 'Monk' });
                            leadRef.update({ pre_consultation_notes: 'Tried to book Vihara consultation, but chosen slot is not available with us. Contact to get alternative slots.' });
                        }

                        //If funnel already exists
                        if (doc.data().funnel) {
                            //If the funnel doesn't contain Vihara
                            if (doc.data().funnel.indexOf("Vihara") == -1) {
                                var new_funnel = doc.data().funnel;
                                new_funnel.push("Vihara");
                                leadRef.update({ funnel: new_funnel });
                            }
                        }
                        else {
                            leadRef.update({ funnel: newLeadData.funnel });
                        }
                        if (!doc.data().added_time)
                            leadRef.update({ added_time: newLeadData.added_time });
                        leadRef.update({ last_interaction_on: newLeadData.last_interaction_on });
                    }

                    if (newLeadData.email) {
                        var html_user = mail_template_book_vihara_class(newLeadData.name);

                        var mailOptions = {
                            from: 'Anjali from Modern Monk<support@modernmonk.in>',
                            to: newLeadData.email,
                            subject: 'Vihara Demo Booked | Modern Monk',
                            html: html_user
                        }

                        transporter.sendMail(mailOptions, (err, info) => {
                            transporter.close();
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Email sent to Lead: ' + info.response);
                            }
                        });
                    }

                    //Send a confirmation SMS
                    var message = "Dear " + doc.data().name + ", your Vihara Demo with Modern Monk is booked successfully! We'll remind you before each of your classes. See you there!";
                    console.log("Sending first SMS!");
                    send_sms(message, doc.data().phone);

                    //Push to post-consultation
                    leadRef.update({ status: 'Consultation Done' });
                    leadRef.update({ post_consultant: 'Monk' });
                    var new_consultation = {};
                    if (doc.data().consultation) {
                        new_consultation = doc.data().consultation;
                    }
                    new_consultation.post_consultation_notes = 'Vihara last class on ' + changeTimestampToString(trial_dates[2]);
                    leadRef.update({ consultation: new_consultation });

                    res.send("Lead added successfully!");
                }).catch(function (error) {
                    res.send("Error: ", error);
                });
        })

    //Schedule pushing to post consultation
    //schedule.scheduleJob(trial_dates[2], function () {
    //    var leadRef = db.collection('leads').doc(newLeadData.phone);
    //    var getDoc = leadRef.get()
    //        .then(doc => {
    //            if (!doc.exists) {
    //            }
    //            else {
    //                leadRef.update({ status: 'Consultation Done' });
    //                leadRef.update({ post_consultant: 'Monk' });
    //                var new_consultation = {};
    //                if (doc.data().consultation) {
    //                    new_consultation = doc.data().consultation;
    //                }
    //                new_consultation.post_consultation_notes = 'Demo over. Contact now for sales';
    //                leadRef.update({ consultation: new_consultation });
    //            }
    //        })
    //})
})

function getName(phone, classType) {
    if (classType == 'Demo') {
        var leadRef = firebase.firestore().collection("leads");
        leadRef.where('phone', '==', phone)
            .get().then(snapshot => {
                if (snapshot.empty) {
                }
                snapshot.forEach(doc => {
                    return doc.data().name;
                })
            })

    }
    else {
        var userRef = firebase.firestore().collection("users");
        userRef.where('phone', '==', phone)
            .get().then(snapshot => {
                if (snapshot.empty) {
                }
                snapshot.forEach(doc => {
                    return doc.data().user_name;
                })
            })
    }
}

/*
 * Desc: The old API that assumes that at least one coach of each of 3 workout formats is available everyday 
 * on the chosen slot. Temporarily, this is being replaced with another API of the same name that assumes that 
 * one coach (of a particular workout format) is available twice a week only, for the entire day.
 */
//app.post('/book_vihara_consultation', urlencodedParser, function (req, res) {
//    var newLeadData = {
//        name: req.body.inp_name,
//        phone: req.body.inp_phone,
//        source: "Website",
//        funnel: ["Vihara"],
//        added_time: new Date(),
//        vihara_data: {},
//        last_interaction_on: new Date()
//    }

//    newLeadData.vihara_data = {
//        preferred_slot: req.body.inp_slot,
//        workoutCallDates: []
//    }

//    if (req.body.inp_email)
//        newLeadData.email = req.body.inp_email;
//    if (req.body.inp_date)
//        newLeadData.call_date = req.body.inp_date;
//    if (req.body.call_time)
//        newLeadData.call_time = req.body.call_time;
//    if (req.body.ailments)
//        newLeadData.ailments = req.body.ailments;

//    //Mail new lead details to team
//    var html_lead = `${JSON.stringify(newLeadData)}`;

//    var mailOptions_lead = {
//        from: 'Modern Monk<support@modernmonk.in>',
//        to: 'anjali@modernmonk.in',
//        subject: 'Vihara Data',
//        html: html_lead
//    }

//    transporter.sendMail(mailOptions_lead, (err, info) => {
//        transporter.close();
//        if (err) {
//            console.log(err);
//        } else {
//            console.log('Mail sent to Anjali: ' + info.response);
//        }
//    });

//    //Build Slot Array
//    //Example: Slot = 7-8 and today is Sunday, so Slot Array = [{7-8, Mon}, {7-8, Wed}, {7-8, Fri}]
//    var slot_arr = [], trial_dates = [];
//    var i = 0;
//    var nextWorkoutDay = new Date();
//    while (i < 3) {
//        nextWorkoutDay = findNextWorkoutDate_demo(nextWorkoutDay);
//        console.log("next workout Day 1: " + nextWorkoutDay);
//        //Set the time to match the preferred slot
//        nextWorkoutDay.setHours(newLeadData.vihara_data.preferred_slot.slice(0, 2) - 6, 30, 0, 0);
//        trial_dates.push(nextWorkoutDay);
//        console.log("next workout Day 2: " + nextWorkoutDay);

//        var slot_arr_obj = newLeadData.vihara_data.preferred_slot + ", " + getDayName(nextWorkoutDay);
//        slot_arr.push(slot_arr_obj);
//        i++;
//    }

//    var coachCol = db.collection('coaches').get()
//        .then(snapshot => {
//            if (snapshot.empty) {
//            }
//            //Store all the workout formats we encounter to ensure uniqueness
//            var workoutFormats = [];
//            var i = 0;
//            snapshot.forEach(doc => {
//                if (doc.data().coach_type == "Vihara") {
//                    if (i < trial_dates.length) {
//                        var workoutDay = trial_dates[i].getDay();

//                        //Check if the coach is available on the desired day and if the workout format doesn't repeat for the lead
//                        if (doc.data().availability[workoutDay].timings.indexOf(newLeadData.vihara_data.preferred_slot) != -1 &&
//                            workoutFormats.indexOf(doc.data().availability[workoutDay].format) == -1) {
//                            var workoutCallDate = {
//                                ID: 'c' + doc.data().phone + newLeadData.phone + changeTimestampToString(trial_dates[i]),
//                                coach: doc.data().coach_name,
//                                classType: 'Demo',
//                                patientID: newLeadData.phone,
//                                callDate: trial_dates[i],
//                                workout_format: doc.data().availability[workoutDay].format,
//                                status: "Not Done"
//                            }
//                            workoutFormats.push(doc.data().availability[workoutDay].format);
//                            newLeadData.vihara_data.workoutCallDates.push(workoutCallDate);

//                            //Push to Pre-Consultation if the slots weren't available

//                            //Update the coach with the class details
//                            var coachRef = db.collection('coaches').doc(doc.data().coach_name);
//                            var getDoc = coachRef.get()
//                                .then(doc => {
//                                    if (!doc.exists) {
//                                    }
//                                    else {
//                                        var new_schedule = []
//                                        if (doc.data().schedule) {
//                                            new_schedule = doc.data().schedule;
//                                        }

//                                        new_schedule.push(workoutCallDate);
//                                        coachRef.update({ schedule: new_schedule });
//                                    }
//                                })
//                            i++;
//                        }
//                    }
//                }
//            })


//            //Add or Update Lead
//            var leadRef = db.collection('leads').doc(newLeadData.phone);
//            var getDoc = leadRef.get()
//                .then(doc => {
//                    if (!doc.exists) {
//                        leadRef.set(newLeadData);
//                    }
//                    else {
//                        if (newLeadData.name)
//                            leadRef.update({ name: newLeadData.name });
//                        if (newLeadData.email)
//                            leadRef.update({ email: newLeadData.email });
//                        if (newLeadData.call_date)
//                            leadRef.update({ call_date: newLeadData.call_date });
//                        if (newLeadData.call_time)
//                            leadRef.update({ call_time: newLeadData.call_time });
//                        if (newLeadData.ailments)
//                            leadRef.update({ ailments: newLeadData.ailments });
//                        leadRef.update({ source: newLeadData.source });
//                        leadRef.update({ vihara_data: newLeadData.vihara_data });

//                        if (workoutFormats.length != 3) {
//                            leadRef.update({ status: 'Not Contacted' });
//                            leadRef.update({ pre_consultant: 'Monk' });
//                            leadRef.update({ pre_consultation_notes: 'Tried to book Vihara consultation, but chosen slot is not available with us. Contact to get alternative slots.' });
//                        }

//                        //If funnel already exists
//                        if (doc.data().funnel) {
//                            //If the funnel doesn't contain Vihara
//                            if (doc.data().funnel.indexOf("Vihara") == -1) {
//                                var new_funnel = doc.data().funnel;
//                                new_funnel.push("Vihara");
//                                leadRef.update({ funnel: new_funnel });
//                            }
//                        }
//                        else {
//                            leadRef.update({ funnel: newLeadData.funnel });
//                        }
//                        if (!doc.data().added_time)
//                            leadRef.update({ added_time: newLeadData.added_time });
//                        leadRef.update({ last_interaction_on: newLeadData.last_interaction_on });
//                    }

//                    if (newLeadData.email) {
//                        var html_user = mail_template_book_vihara_class(newLeadData.name);

//                        var mailOptions = {
//                            from: 'Anjali from Modern Monk<support@modernmonk.in>',
//                            to: newLeadData.email,
//                            subject: 'Appointment Scheduled | Modern Monk',
//                            html: html_user
//                        }

//                        transporter.sendMail(mailOptions, (err, info) => {
//                            transporter.close();
//                            if (err) {
//                                console.log(err);
//                            } else {
//                                console.log('Email sent to Lead: ' + info.response);
//                            }
//                        });
//                    }

//                    res.send("Lead added successfully!");
//                }).catch(function (error) {
//                    res.send("Error: ", error);
//                });
//        })

//    //Schedule pushing to post consultation
//    schedule.scheduleJob(trial_dates[2], function () {
//        var leadRef = db.collection('leads').doc(newLeadData.phone);
//        var getDoc = leadRef.get()
//            .then(doc => {
//                if (!doc.exists) {
//                }
//                else {
//                    leadRef.update({ status: 'Consultation Done' });
//                    leadRef.update({ post_consultant: 'Monk' });
//                    var new_consultation = {};
//                    if (doc.data().consultation) {
//                        new_consultation = doc.data().consultation;
//                    }
//                    new_consultation.post_consultation_notes = 'Demo over. Contact now for sales';
//                    leadRef.update({ consultation: new_consultation });
//                }
//            })
//    })
//})

app.post('/book_stay_at_home_wl', urlencodedParser, function (req, res) {
    var newLeadData = {
        name: req.body.inp_name,
        phone: req.body.inp_phone,
        status: "Not Contacted",
        source: "Website",
        funnel: ["Weight Loss"],
        added_time: new Date(),
        last_interaction_on: new Date()
    }

    if (req.body.inp_email)
        newLeadData.email = req.body.inp_email;
    if (req.body.inp_date)
        newLeadData.call_date = req.body.inp_date;
    if (req.body.call_time)
        newLeadData.call_time = req.body.call_time;

    //Add or Update Lead
    var leadRef = db.collection('leads').doc(newLeadData.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                leadRef.set(newLeadData);
            }
            else {
                if (newLeadData.name)
                    leadRef.update({ name: newLeadData.name });
                if (newLeadData.email)
                    leadRef.update({ email: newLeadData.email });
                if (newLeadData.call_date)
                    leadRef.update({ call_date: newLeadData.call_date });
                if (newLeadData.call_time)
                    leadRef.update({ call_time: newLeadData.call_time });
                leadRef.update({ status: newLeadData.status });
                leadRef.update({ source: newLeadData.source });
                //If funnel already exists
                if (doc.data().funnel) {
                    //If the funnel doesn't contain Vihara
                    if (doc.data().funnel.indexOf("Weight Loss") == -1) {
                        var new_funnel = doc.data().funnel;
                        new_funnel.push("Weight Loss");
                        leadRef.update({ funnel: new_funnel });
                    }
                }
                else {
                    leadRef.update({ funnel: newLeadData.funnel });
                }
                if (!doc.data().added_time)
                    leadRef.update({ added_time: newLeadData.added_time });
                leadRef.update({ last_interaction_on: newLeadData.last_interaction_on });
            }

            if (newLeadData.email) {
                var html_user = mail_template_stay_at_home(newLeadData.name);

                var mailOptions = {
                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
                    to: newLeadData.email,
                    subject: 'Appointment Scheduled | Modern Monk',
                    html: html_user
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    transporter.close();
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent to Lead: ' + info.response);
                    }
                });

            }

            res.send("Lead added successfully!");
        }).catch(function (error) {
            res.send("Error: ", error);
        });
})

app.post('/book_consultation', urlencodedParser, function (req, res) {
    var newLeadData = {
        name: req.body.inp_name,
        phone: req.body.inp_phone,
        status: "Not Contacted",
        source: "Website",
        funnel: ["PCOS"],
        added_time: new Date(),
        last_interaction_on: new Date()
    }

    if (req.body.inp_email)
        newLeadData.email = req.body.inp_email;
    if (req.body.inp_date)
        newLeadData.call_date = req.body.inp_date;
    if (req.body.call_time)
        newLeadData.call_time = req.body.call_time;
    if (req.body.ailments)
        newLeadData.ailments = req.body.ailments;

    //Add or Update Lead
    var leadRef = db.collection('leads').doc(newLeadData.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                leadRef.set(newLeadData);
            }
            else {
                if (newLeadData.name)
                    leadRef.update({ name: newLeadData.name });
                if (newLeadData.email)
                    leadRef.update({ email: newLeadData.email });
                if (newLeadData.call_date)
                    leadRef.update({ call_date: newLeadData.call_date });
                if (newLeadData.call_time)
                    leadRef.update({ call_time: newLeadData.call_time });
                if (newLeadData.ailments)
                    leadRef.update({ ailments: newLeadData.ailments });
                leadRef.update({ status: newLeadData.status });
                leadRef.update({ source: newLeadData.source });
                //If funnel already exists
                if (doc.data().funnel) {
                    //If the funnel doesn't contain Vihara
                    if (doc.data().funnel.indexOf("PCOS") == -1) {
                        var new_funnel = doc.data().funnel;
                        new_funnel.push("PCOS");
                        leadRef.update({ funnel: new_funnel });
                    }
                }
                else {
                    leadRef.update({ funnel: newLeadData.funnel });
                }
                if (!doc.data().added_time)
                    leadRef.update({ added_time: newLeadData.added_time });
                leadRef.update({ last_interaction_on: newLeadData.last_interaction_on });
            }

            if (newLeadData.email) {
                var html_user = mail_template_book_pcos_consultation(newLeadData.name);

                var mailOptions = {
                    from: 'Anjali from Modern Monk<support@modernmonk.in>',
                    to: newLeadData.email,
                    subject: 'Appointment Scheduled | Modern Monk',
                    html: html_user
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    transporter.close();
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent to Lead: ' + info.response);
                    }
                });

            }

            res.send("Lead added successfully!");
        }).catch(function (error) {
            res.send("Error: ", error);
        });
})

app.post('/add_lead', urlencodedParser, function (req, res) {
    var newLeadData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        source: req.body.source,
        funnel: req.body.funnel,
        birthday: req.body.birthday,
        weight: req.body.weight,
        height: req.body.height,
        status: "Not Contacted",
        added_time: changeTimestampToString(new Date())
    }

    //Add or Update Lead
    var leadRef = db.collection('leads').doc(newLeadData.phone);
    var getDoc = leadRef.get()
        .then(doc => {
            if (!doc.exists) {
                leadRef.set(newLeadData);
            }
            else {
                if (newLeadData.name)
                    leadRef.update({ name: newLeadData.name });
                if (newLeadData.email)
                    leadRef.update({ email: newLeadData.email });
                leadRef.update({ source: newLeadData.source });
                //If funnel already exists
                if (doc.data().funnel) {
                    //If the funnel doesn't contain Vihara
                    if (doc.data().funnel.indexOf("PCOS") == -1) {
                        var new_funnel = doc.data().funnel;
                        new_funnel.push("PCOS");
                        leadRef.update({ funnel: new_funnel });
                    }
                }
                else {
                    leadRef.update({ funnel: newLeadData.funnel });
                }
                if (newLeadData.birthday)
                    leadRef.update({ birthday: newLeadData.birthday });
                if (newLeadData.weight)
                    leadRef.update({ weight: newLeadData.weight });
                if (newLeadData.height)
                    leadRef.update({ height: newLeadData.height });
                leadRef.update({ added_time: newLeadData.added_time });
            }

            res.send("Lead added successfully!");
        }).catch(function (error) {
            console.log("Error: ", error);
        });
})

//Template for mass updating the database
app.get('/update_pcos_quiz_data', urlencodedParser, function (req, res) {
    let FieldValue = require('firebase-admin').firestore.FieldValue;

    var leadCol = db.collection('leads').get()
        .then(snapshot => {
            if (snapshot.empty) {
            }
            snapshot.forEach(doc => {
                var quiz_data = {};

                if (doc.data().source == "PCOS Quiz") {
                    quiz_data.acne = (doc.data().acne || "N/A");
                    quiz_data.depression = (doc.data().depression || "N/A");
                    quiz_data.difficulty_losing_weight = (doc.data().difficulty_losing_weight || "N/A");
                    quiz_data.facial_hair = (doc.data().facial_hair || "N/A");
                    quiz_data.infertility = (doc.data().infertility || "N/A");
                    quiz_data.irregular_cycle = (doc.data().irregular_cycle || "N/A");
                    quiz_data.most_concerning_symptom = (doc.data().most_concerning_symptom || "N/A");
                    quiz_data.pcos_risk = (doc.data().pcos_risk || "N/A");

                    var leadRef = db.collection('leads').doc(doc.data().phone);
                    var getDoc = leadRef.get()
                        .then(doc => {
                            if (doc.exists) {
                                leadRef.update({ pcos_quiz_data: quiz_data });
                                leadRef.update({ acne: FieldValue.delete() });
                                leadRef.update({ depression: FieldValue.delete() });
                                leadRef.update({ difficulty_losing_weight: FieldValue.delete() });
                                leadRef.update({ facial_hair: FieldValue.delete() });
                                leadRef.update({ infertility: FieldValue.delete() });
                                leadRef.update({ irregular_cycle: FieldValue.delete() });
                                leadRef.update({ most_concerning_symptom: FieldValue.delete() });
                                leadRef.update({ pcos_risk: FieldValue.delete() });
                            }
                        })
                }
            })
        })
})

/*
 * @param {any} newUserData: 
 * @param {any} params
 * @param {any} source: 1 if it's a Fitness-only customer, 0 if otherwise
 */
function addViharaUser(newUserData, params, source) {
    //Add End Date
    if (source) {
        newUserData.end_date = incr_date(newUserData.start_date,
            (28 * params.duration_mul - 1));
    }

    //Build Slot Array
    //Example: Slot = 7-8 and today is Sunday, so Slot Array = [{7-8, Mon}, {7-8, Wed}, {7-8, Fri}]
    var slot_arr = [], class_dates = [];
    var i = 0;
    var nextWorkoutDay = new Date();

    //Iterate upto params.duration_mul*12 because there are 12 sessions every month (28 days)
    while (i++ < params.duration_mul * 12) {
        nextWorkoutDay = findNextWorkoutDate(nextWorkoutDay, i);
        //nextWorkoutDay.setHours(newUserData.vihara_data.preferred_slot.slice(0, 2) - 6, 30, 0, 0);
        class_dates.push(nextWorkoutDay);
        var slot_arr_obj = newUserData.vihara_data.preferred_slot + ", " + getDayName(nextWorkoutDay);
        slot_arr.push(slot_arr_obj);
    }
    //Create an array to track which date(s) a slot has been added for
    var slotAdded = [];
    for (var j = 0; j < class_dates.length; j++) {
        slotAdded.push(false);
    }

    var coachCol = db.collection('coaches').get()
        .then(snapshot => {
            if (snapshot.empty) {
            }
            //Store all the workout formats we encounter to ensure uniqueness
            var workoutFormats = [];
            var i = 0;
            snapshot.forEach(doc => {
                if (doc.data().coach_type == "Vihara") {
                    if (i < class_dates.length && !slotAdded[i]) {
                        var added = false;

                        //Loop so as to add a class with the same coach periodically. Example: If there are 3 chosen workout formats, every 3rd class should be with the same coach
                        for (var iter = i; iter < class_dates.length; iter += newUserData.vihara_data.workout_formats.length) {
                            var workoutDay = class_dates[iter].getDay();

                            /* Check:
                             * if the coach is available on the desired day
                             * if the workout format for the particular session is among the ones that the user has chosen*/
                            if (iter == 11) {
                                console.log("Workout Format Chosen by User: " + newUserData.vihara_data.workout_formats);
                                console.log("Coach's format: " + doc.data().availability[workoutDay].format);
                                console.log("Previous workout format: " + workoutFormats[iter - 1]);
                            }
                            if (doc.data().availability[workoutDay].timings.indexOf(newUserData.vihara_data.preferred_slot) != -1 &&
                                newUserData.vihara_data.workout_formats.indexOf(doc.data().availability[workoutDay].format) != -1) {

                                //Check if the workout format for this pass isn't the same as the one for the last pass
                                if (!workoutFormats[iter - 1] || (workoutFormats[iter - 1] != doc.data().availability[workoutDay].format)) {

                                    var workoutCallDate = {
                                        ID: 'c' + doc.data().phone + newUserData.phone + changeTimestampToString(class_dates[iter]),
                                        coach: doc.data().coach_name,
                                        classType: 'Paid',
                                        patientID: newUserData.phone,
                                        callDate: class_dates[iter],
                                        workout_format: doc.data().availability[workoutDay].format,
                                        status: "Not Done"
                                    }
                                    workoutFormats.push(doc.data().availability[workoutDay].format);
                                    //                                    newUserData.vihara_data.workoutCallDates.push(workoutCallDate);
                                    newUserData.vihara_data.workoutCallDates[iter] = workoutCallDate;
                                    added = true;
                                    slotAdded[iter] = true;

                                    //Update the coach with the call details
                                    var coachRef = db.collection('coaches').doc(doc.data().coach_name);
                                    var getDoc = coachRef.get()
                                        .then(doc => {
                                            if (!doc.exists) {
                                            }
                                            else {
                                                var new_schedule = []
                                                if (doc.data().schedule) {
                                                    new_schedule = doc.data().schedule;
                                                }

                                                new_schedule.push(workoutCallDate);
                                                coachRef.update({ schedule: new_schedule });
                                            }
                                        })
                                }
                            }
                        }
                        /*To ensure that we don't jump a particular value of the trial dates array in case 
                         * the coach in the current iteration didn't offer the workout format the user chose */
                        if (added) {
                            i++;
                        }
                    }
                }
            })

            var html_user = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newUserData.user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
Heartiest congratulations on having started your journey towards complete wellness
 with our Vihara program</b>.
<br /><br />
Before you start your journey, here's some things you need to know:
<ul>`;
            html_user += `<li>Your coaches don't have an incoming facility on their 
phones. If you ever wish to speak to them, you can just drop them a message on WhatsApp and 
they shall revert to you between 10am to 7pm, Mondays to Saturdays, except on public 
holidays.</li>
<li><b>Your Program Details</b>: Your program starts on <b>${newUserData.start_date}</b> and ends on 
<b>${newUserData.end_date}</b>. </li>
<li><b>Follow-up from your Coaches</b>: As per your current plan, you will get
<b>${class_dates.length} guided classes</b> from your 
<b>Vihara Coach</b> in a month.
</li>
<li><b>Rating your Coaches</b>: At the end of every month, you will get an automated e-mail from us asking you to rate your 
coaches. Please use that opportunity to share honest feedback. We try our best to ensure
that you get the best experience, but our efforts are incomplete without your feedback.
</br>To rate your coach, please use these link(s):`;

            html_user += `</li>
<li><b>What if you are unhappy with your Coach</b>: In case you are not happy with your coach, all you to do is
<a href="mailto:support@modernmonk.in">write to us</a> and we will make sure that you get the best
available coach.</li>
<li><b>Regarding Support</b>: If you ever face any issue related to our service, please
<a href="mailto:support@modernmonk.in">reach out to us</a>.</li>
</ul>
</p>
    ${mail_template_footer()}
    `;

            var userMailOptions = {
                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                to: newUserData.email,
                subject: 'Welcome to Modern Monk!',
                html: html_user
            }

            //Add or Update User
            var userRef = db.collection('users').doc(newUserData.phone);
            var getDoc = userRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        userRef.set(newUserData);
                    }
                    else {
                        if (source) {
                            userRef.update({ start_date: newUserData.start_date });
                            userRef.update({ end_date: newUserData.end_date });
                            userRef.update({ last_interaction_on: newUserData.last_interaction_on });

                            transporter.sendMail(userMailOptions, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent to Customer: ' + info.response);
                                }
                            });
                        }
                        userRef.update({ vihara_data: newUserData.vihara_data });
                    }

                    console.log("Vihara User added successfully!");
                }).catch(function (error) {
                    console.log("No User Found: ", error);
                });
        })
}

function addWLUser(newUserData, params) {
    //Get Plan
    var planRef = db.collection('plans').doc(newUserData.plan);
    var getDoc = planRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such plan!');
            }
            else {
                var plan = {};
                plan.duration = doc.data().duration;
                plan.nc_plans_count = doc.data().nc_plans_count;
                plan.nc_calls_count = doc.data().nc_calls_count;
                plan.vichara_coach_calls_count = doc.data().vichara_coach_calls_count;
                plan.plan_name = doc.data().plan_name;
                plan.points_nc = doc.data().points_nc;
                plan.points_fc = doc.data().points_fc;
                plan.points_vichara_coach = doc.data().points_vichara_coach;

                //Add End Date
                newUserData.end_date = incr_date(newUserData.start_date,
                    (plan.duration * params.duration_mul - 1));

                //Get Achara Coach
                var Achara_Coach_Ref = db.collection('coaches').doc(params.nc);
                var getDoc = Achara_Coach_Ref.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such Achara Coach!');
                        }
                        else {
                            var dietitian = {};
                            dietitian.phone = doc.data().phone;
                            dietitian.coach_name = doc.data().coach_name;
                            dietitian.active_hours = doc.data().active_hours;
                            dietitian.feedback_url = doc.data().feedback_url;
                            dietitian.email = doc.data().email;
                            dietitian.points = doc.data().points;
                            dietitian.points_history = doc.data().points_history;

                            //Get Vihara Coach
                            Vihara_Coach_Ref = db.collection('coaches').doc(params.fc);
                            getDoc = Vihara_Coach_Ref.get()
                                .then(doc => {
                                    var fitness_trainer = {};

                                    if (!doc.exists) {
                                        fitness_trainer.exists = false;
                                    }
                                    else {
                                        fitness_trainer.exists = true;
                                        fitness_trainer.coach_name = doc.data().coach_name;
                                        fitness_trainer.phone = doc.data().phone;
                                        fitness_trainer.active_hours = doc.data().active_hours;
                                        fitness_trainer.feedback_url = doc.data().feedback_url;
                                        fitness_trainer.email = doc.data().email;
                                        fitness_trainer.points = doc.data().points;
                                        fitness_trainer.points_history = doc.data().points_history;
                                    }

                                    //Get Vichara Coach
                                    Vichara_Coach_Ref = db.collection('coaches').doc(params.vc);
                                    getDoc = Vichara_Coach_Ref.get()
                                        .then(doc => {
                                            var vichara_coach = {};

                                            if (!doc.exists) {
                                                vichara_coach.exists = false;
                                            }
                                            else {
                                                vichara_coach.exists = true;
                                                vichara_coach.coach_name = doc.data().coach_name;
                                                vichara_coach.phone = doc.data().phone;
                                                vichara_coach.active_hours = doc.data().active_hours;
                                                vichara_coach.feedback_url = doc.data().feedback_url;
                                                vichara_coach.email = doc.data().email;
                                                vichara_coach.points = doc.data().points;
                                                vichara_coach.points_history = doc.data().points_history;
                                            }

                                            //Add arrays that list all future call & plan days
                                            newUserData.dietPlanDates = [];
                                            newUserData.dietCallDates = [];
                                            newUserData.workoutCallDates = [];
                                            newUserData.vicharaCallDates = [];
                                            // newUserData.bcaDates = [];

                                            /*1. DIET PLAN DATES*/
                                            //Set varDate to 2 days before Start Date
                                            var varDate = incr_date(newUserData.start_date, -2);

                                            //Loop until we find out whether today is a plan/call day or not & keep adding every nth day till then
                                            if (parseInt(plan.nc_plans_count)) {
                                                while (varDate < newUserData.end_date) {
                                                    varDate = resetToWeekday(varDate);
                                                    var dietPlanDate = {
                                                        ID: 'p' + dietitian.phone + newUserData.phone + varDate,
                                                        planDate: varDate,
                                                        status: "Not Done"
                                                    }
                                                    newUserData.dietPlanDates.push(dietPlanDate);
                                                    varDate = incr_date(varDate,
                                                        Math.round(plan.duration / plan.nc_plans_count));
                                                }
                                            }

                                            /*2. DIET CALL DATES*/
                                            //Set varDate to 2 days before Start Date
                                            varDate = incr_date(newUserData.start_date, -2);

                                            //Same thing for Diet follow ups. The number varies based on the plan
                                            if (parseInt(plan.nc_calls_count)) {
                                                while (varDate < newUserData.end_date) {

                                                    /*Handle the case when calls are to be done everyday. 
                                                     * resetToWeekday() would bring Saturday back to Friday. 
                                                    jumpToMonday() ensures the next day is Monday*/
                                                    if (Math.round(plan.duration / plan.nc_calls_count) != 1) {
                                                        varDate = resetToWeekday(varDate);

                                                    } else {
                                                        varDate = jumpToMonday(varDate);
                                                    }

                                                    var dietCallDate = {
                                                        ID: 'c' + dietitian.phone + newUserData.phone + varDate,
                                                        callDate: varDate,
                                                        status: "Not Done"
                                                    }
                                                    newUserData.dietCallDates.push(dietCallDate);
                                                    varDate = incr_date(varDate,
                                                        Math.round(plan.duration / plan.nc_calls_count));
                                                }
                                            }

                                            //Push the end date
                                            varDate = resetToWeekday(newUserData.end_date);
                                            var dietCallDate = {
                                                ID: 'c' + dietitian.phone + newUserData.phone + varDate,
                                                callDate: varDate,
                                                status: "Not Done"
                                            }
                                            newUserData.dietCallDates.push(dietCallDate);

                                            if (fitness_trainer.exists) {
                                                addViharaUser(newUserData, params, 0);
                                            }

                                            if (vichara_coach.exists) {
                                                /*5. VICHARA CALL DATES*/
                                                //Set varDate to the Start Date
                                                varDate = incr_date(newUserData.start_date, 0);

                                                if (parseInt(plan.vichara_coach_calls_count)) {
                                                    while (varDate < newUserData.end_date) {
                                                        varDate = resetToWeekday(varDate);
                                                        var vicharaCallDate = {
                                                            ID: 'c' + fitness_trainer.phone + newUserData.phone + varDate,
                                                            callDate: varDate,
                                                            status: "Not Done"
                                                        }
                                                        newUserData.vicharaCallDates.push(vicharaCallDate);
                                                        varDate = incr_date(varDate,
                                                            Math.round(plan.duration / plan.vichara_coach_calls_count));
                                                    }
                                                }
                                            }

                                            /*5. BCA DATES*/
                                            //Set varDate to 4 weeks after Start Date
                                            //varDate = incr_date(newUserData.start_date, 28);

                                            //if (plan.plan_name == "Total Health" || plan.plan_name == "Premium") {
                                            //    while (varDate < newUserData.end_date) {
                                            //        newUserData.bcaDates.push(varDate);
                                            //        varDate = incr_date(varDate, 28);
                                            //    }
                                            //}

                                            //Push the end date
                                            //if (plan.plan_name != "Free") {
                                            //    newUserData.bcaDates.push(newUserData.end_date);
                                            //}

                                            //Add to DB
                                            //    var queryAsObject = JSON.parse(JSON.stringify(newUserData));


                                            //Send mail to the Coaches when assigning a user to them
                                            var html_achara_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newUserData.dietitian},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have assigned you a user, please check the details:
            <br />
            <br /> Name: ${newUserData.user_name}.
            <br /> Phone number: ${newUserData.phone}.
            <br /> Progam: ${plan.plan_name}.
            <br /> Start Date: ${newUserData.start_date}.
       </p>
    ${mail_template_footer()}
    `;

                                            var html_vihara_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newUserData.fitness_trainer},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have assigned you a user, please check the details:
            <br />
            <br /> Name: ${newUserData.user_name}.
            <br /> Phone number: ${newUserData.phone}.
            <br /> Program: ${plan.plan_name}.
            <br /> Start Date: ${newUserData.start_date}.
            <br />
        </p>
    ${mail_template_footer()}
    `;

                                            var html_vichara_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newUserData.vichara_coach},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have assigned you a user, please check the details:
            <br />
            <br /> Name: ${newUserData.user_name}.
            <br /> Phone number: ${newUserData.phone}.
            <br /> Program: ${plan.plan_name}.
            <br /> Start Date: ${newUserData.start_date}.
            <br />
        </p>
    ${mail_template_footer()}
    `;

                                            var html_user = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newUserData.user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
Heartiest congratulations on having started your journey towards complete wellness
 with our <b>${plan.plan_name} program</b>.
<br /><br />
Before you start your journey, here's some things you need to know:
<ul>
<li><b>Your Achara Coach</b>: <b>${newUserData.dietitian}</b>. You can 
reach out to them on WhatsApp on <b>${dietitian.phone}</b> during 
<b>${dietitian.active_hours}</b>.</li>
`;
                                            if (fitness_trainer.exists) {
                                                html_user += `<li><b>Your Vihara Coach</b>: ${newUserData.fitness_trainer}</b >.
 You can reach out to them on WhatsApp on <b>${fitness_trainer.phone}</b> 
during <b>${fitness_trainer.active_hours}</b>.</li>`;
                                            }
                                            if (vichara_coach.exists) {
                                                html_user += `<li><b>Your Vichara Coach</b>: ${newUserData.vichara_coach}</b >.
 You can reach out to them on WhatsApp on <b>${vichara_coach.phone}</b> 
during <b>${vichara_coach.active_hours}</b>.</li>`;
                                            }
                                            html_user += `<li>Your coaches don't have an incoming facility on their 
phones. If you ever wish to speak to them, you can just drop them a message on WhatsApp and 
they shall revert to you between 10am to 7pm, Mondays to Saturdays, except on public 
holidays.</li>
<li><b>Your Program Details</b>: Your program starts on <b>${newUserData.start_date}</b> and ends on 
<b>${newUserData.end_date}</b>. </li>
<li><b>Follow-up from your Coaches</b>: As per your current plan, you will get
<b>${plan.nc_calls_count} follow-up calls</b> from your
<b>Achara Coach</b>, <b>${plan.fc_calls_count} follow-up calls</b> from your 
<b>Vihara Coach</b> and <b>${plan.vichara_coach_calls_count} follow-up calls</b> from your 
<b>Vichara Coach</b> in a month. If you wish to upgrade your plan to get more follow-up calls from 
your coaches, please reply to this email.
</li>
<li><b>Rating your Coaches</b>: At the end of every month, you will get an automated e-mail from us asking you to rate your 
coaches. Please use that opportunity to share honest feedback. We try our best to ensure
that you get the best experience, but our efforts are incomplete without your feedback.
</br>To rate your coaches, please use these link(s):
<br>${newUserData.dietitian}: ${dietitian.feedback_url}`;

                                            if (fitness_trainer.exists) {
                                                html_user += `<br>${newUserData.fitness_trainer}: ${fitness_trainer.feedback_url}`;
                                            }
                                            if (vichara_coach.exists) {
                                                html_user += `<br>${newUserData.vichara_coach}: ${vichara_coach.feedback_url}`;
                                            }
                                            html_user += `</li>
<li><b>What if you are unhappy with your Coach</b>: In case you are not happy with your coach, all you to do is
<a href="mailto:support@modernmonk.in">write to us</a> and we will make sure that you get the best
available coach.</li>
<li><b>Regarding Support</b>: If you ever face any issue related to our service, please
<a href="mailto:support@modernmonk.in">reach out to us</a>.</li>
</ul>
</p>
    ${mail_template_footer()}
    `;

                                            var mailOptions_achara_coach = {
                                                from: 'Modern Monk<support@modernmonk.in>',
                                                to: dietitian.email,
                                                subject: 'New User Assigned',
                                                html: html_achara_coach
                                            }

                                            var mailOptions_vihara_coach = {
                                                from: 'Modern Monk<support@modernmonk.in>',
                                                to: fitness_trainer.email,
                                                subject: 'New User Assigned',
                                                html: html_vihara_coach
                                            }

                                            var mailOptions_vichara_coach = {
                                                from: 'Modern Monk<support@modernmonk.in>',
                                                to: vichara_coach.email,
                                                subject: 'New User Assigned',
                                                html: html_vichara_coach
                                            }

                                            var userMailOptions = {
                                                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                                to: newUserData.email,
                                                subject: 'Welcome to Modern Monk!',
                                                html: html_user
                                            }

                                            add_points(dietitian, plan, newUserData.user_name, newUserData.start_date, params.duration_mul, true, false, false, false);
                                            if (fitness_trainer.exists) {
                                                add_points(fitness_trainer, plan, newUserData.user_name, newUserData.start_date, params.duration_mul, false, true, false, false);
                                            }
                                            if (vichara_coach.exists) {
                                                add_points(vichara_coach, plan, newUserData.user_name, newUserData.start_date, params.duration_mul, false, false, false, true);
                                            }

                                            //Update Coaches' Data
                                            Achara_Coach_Ref.update({ points: dietitian.points });
                                            Achara_Coach_Ref.update({ points_history: dietitian.points_history });
                                            if (fitness_trainer.exists) {
                                                Vihara_Coach_Ref.update({ points: fitness_trainer.points });
                                                Vihara_Coach_Ref.update({ points_history: fitness_trainer.points_history });
                                            }
                                            if (vichara_coach.exists) {
                                                Vichara_Coach_Ref.update({ points: vichara_coach.points });
                                                Vichara_Coach_Ref.update({ points_history: vichara_coach.points_history });
                                            }

                                            //Add or Update User
                                            var userRef = db.collection('users').doc(newUserData.phone);
                                            var getDoc = userRef.get()
                                                .then(doc => {
                                                    if (!doc.exists) {
                                                        userRef.set(newUserData);
                                                    }
                                                    else {
                                                        userRef.update({ start_date: newUserData.start_date });
                                                        userRef.update({ plan: newUserData.plan });
                                                        userRef.update({ dietitian: newUserData.dietitian });
                                                        if (vichara_coach.exists)
                                                            userRef.update({ vichara_coach: newUserData.vichara_coach });
                                                        userRef.update({ end_date: newUserData.end_date });
                                                        userRef.update({ dietPlanDates: newUserData.dietPlanDates });
                                                        userRef.update({ dietCallDates: newUserData.dietCallDates });
                                                        userRef.update({ vicharaCallDates: newUserData.vicharaCallDates });
                                                        userRef.update({ last_interaction_on: newUserData.last_interaction_on });
                                                    }

                                                    transporter.sendMail(userMailOptions, (err, info) => {
                                                        transporter.close();
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            console.log('Email sent to Customer: ' + info.response);
                                                        }
                                                    });

                                                    transporter.sendMail(mailOptions_achara_coach, (err, info) => {
                                                        transporter.close();
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            console.log('Email sent to Achara Coach: ' + info.response);
                                                        }
                                                    });

                                                    if (fitness_trainer.exists) {
                                                        transporter.sendMail(mailOptions_vihara_coach, (err, info) => {
                                                            transporter.close();
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log('Email sent to Vihara Coach: ' + info.response);
                                                            }
                                                        });
                                                    }

                                                    if (vichara_coach.exists) {
                                                        transporter.sendMail(mailOptions_vichara_coach, (err, info) => {
                                                            transporter.close();
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                console.log('Email sent to Vichara Coach: ' + info.response);
                                                            }
                                                        });
                                                    }

                                                    console.log("User added successfully!");
                                                }).catch(function (error) {
                                                    console.log("No User Found: ", error);
                                                });
                                        }).catch(function (error) {
                                            console.log("No Vichara Coach Found: ", error);
                                        });
                                }).catch(function (error) {
                                    console.log("No Vihara Coach Found: ", error);
                                });
                        }
                    }).catch(function (error) {
                        console.log("No Achara Coach Found: ", error);
                    });
            }
        });
}

app.post('/addUser', urlencodedParser, function (req, res) {
    var newUserData = {
        user_name: req.body.user_name,
        phone: req.body.phone,
        service: req.body.service,
        amount_paid: req.body.amount,
        start_date: req.body.start_date,
        plan: req.body.plan,
        vihara_data: {},
        lead_added_time: req.body.lead_added_time,
        lead_source: req.body.lead_source,
        date_added: changeTimestampToString(new Date()),
        last_interaction_on: new Date()
    }

    //If no start date has been specified, set the start date to tomorrow's
    if (req.body.start_date)
        newUserData.start_date = req.body.start_date;
    else
    newUserData.start_date = incr_date(changeTimestampToString(new Date()), 1);

    if (req.body.sales_rep) {
        newUserData.sales_details =
            {
                post_consultant: req.body.sales_rep
            };
    }

    //Store workout formats
    if (req.body.workout_formats) {
        newUserData.vihara_data.workout_formats = req.body.workout_formats ? (req.body.workout_formats + '').split(",") : "";
        newUserData.vihara_data.preferred_slot = req.body.preferred_slot;
        newUserData.vihara_data.workoutCallDates = [];
    }

    if (req.body.nc)
        newUserData.dietitian = req.body.nc;
    if (req.body.fc)
        newUserData.fitness_trainer = req.body.fc;
    if (req.body.vc)
        newUserData.vichara_coach = req.body.vc;
    if (req.body.pcos_quiz_data)
        newUserData.pcos_quiz_data = JSON.parse(req.body.pcos_quiz_data);
    if (req.body.prakriti_quiz_data)
        newUserData.prakriti_quiz_data = JSON.parse(req.body.prakriti_quiz_data);
    if (req.body.consultation)
        newUserData.consultation_details = JSON.parse(req.body.consultation);
    if (req.body.sales_details)
        newUserData.sales_details = JSON.parse(req.body.sales_details);
    if (req.body.email)
        newUserData.email = req.body.email;
    if (req.body.ailments)
        newUserData.ailments = req.body.ailments;
    if (req.body.height)
        newUserData.height = req.body.height;
    if (req.body.weight)
        newUserData.weight = req.body.weight;
    if (req.body.birthday)
        newUserData.birthday = req.body.birthday;
    if (req.body.funnel)
        newUserData.funnel = req.body.funnel;

    switch (newUserData.service) {
        case "Weight Loss":
            addWLUser(newUserData, req.body);
            break;
        case "Fitness":
            addViharaUser(newUserData, req.body, 1);
            break;
    }

    res.send("User added successfully!");
})

app.post('/remove_user', urlencodedParser, function (req, res) {
    //1. Get the user
    var userRef = db.collection('users').doc(req.body.phone);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                //Get the Plan Name
                var plan_name;
                if (doc.data().plan.plan_name) {
                    plan_name = doc.data().plan.plan_name;
                }
                else {
                    plan_name = doc.data().plan;
                }
                switch (plan_name) {
                    case 'SL':
                        plan_name = 'Slimming';
                        break;
                    case 'TO':
                        plan_name = 'Toning';
                        break;
                    case 'TH':
                        plan_name = 'Total Health';
                        break;
                    case 'PR':
                        plan_name = 'Premium';
                        break;
                    case 'FR':
                        plan_name = 'Free';
                        break;
                }

                var date = new Date();
                var end_month = new Date(doc.data().end_date).getMonth();
                var duration = end_month - date.getMonth() + 1;
                var user_name = "deletion of " + doc.data().user_name;

                //8. Update userRef with removed plans & calls dates
                var today = changeTimestampToString(date);
                var length;
                var dietPlanDates = [], dietCallDates = [], workoutCallDates = [];
                dietPlanDates = doc.data().dietPlanDates;
                length = dietPlanDates.findIndex(function (last_date) {
                    return last_date >= today;
                });
                if (dietPlanDates[length] == today) {
                    dietPlanDates.length = length + 1;
                }
                else {
                    if (length != -1)
                        dietPlanDates.length = length;
                }

                dietCallDates = doc.data().dietCallDates;
                length = dietCallDates.findIndex(function (last_date) {
                    return last_date >= today;
                });
                if (dietCallDates[length] == today) {
                    dietCallDates.length = length + 1;
                }
                else {
                    if (length != -1)
                        dietCallDates.length = length;
                }

                workoutCallDates = doc.data().workoutCallDates;
                length = workoutCallDates.findIndex(function (last_date) {
                    return last_date >= today;
                });
                if (workoutCallDates[length] == today) {
                    workoutCallDates.length = length + 1;
                }
                else {
                    if (length != -1)
                        workoutCallDates.length = length;
                }

                //Update userRef with new Plans & calls dates
                userRef.update({ dietPlanDates: dietPlanDates });
                userRef.update({ dietCallDates: dietCallDates });
                userRef.update({ workoutCallDates: workoutCallDates });

                //6. Update the userRef with end date
                userRef.update({ end_date: today });

                //2. Find the Achara & vihara coaches
                var achara_coach, vihara_coach;
                if (doc.data().dietitian.coach_name) {
                    achara_coach = doc.data().dietitian.coach_name;
                }
                else {
                    achara_coach = doc.data().dietitian;
                }

                if (doc.data().fitness_trainer.coach_name) {
                    vihara_coach = doc.data().fitness_trainer.coach_name;
                }
                else {
                    vihara_coach = doc.data().fitness_trainer;
                }

                //4. Get coachRefs
                var AcharaRef = db.collection('coaches').doc(achara_coach);
                var viharaRef = db.collection('coaches').doc(vihara_coach);

                //5. Deduct points for all following months of the coaches
                var planRef = db.collection('plans').doc(plan_name);
                var getDoc = planRef.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such plan!');
                        }
                        else {
                            deduct_points(achara_coach, doc.data(), user_name, date, duration, true, false);
                            deduct_points(vihara_coach, doc.data(), user_name, date, duration, false, true);

                            //7. Update all coachRefs
                            AcharaRef.update({ points: achara_coach.points });
                            AcharaRef.update({ points_history: achara_coach.points_history });
                            viharaRef.update({ points: vihara_coach.points });
                            viharaRef.update({ points_history: vihara_coach.points_history });
                        }

                        res.send("User removed successfully!");
                    }).catch(function (error) {
                        res.send("Error 1: " + error);
                    });
            }
        }).catch(function (error) {
            console.log("Encountered an error: " + error);
            res.send("Error 2: " + error);
        });
})

app.post('/sakhi_pairing', urlencodedParser, function (req, res) {
    var sakhiRef1 = db.collection('users').doc(req.body.phone1);
    var getDoc1 = sakhiRef1.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                var sakhi1 = doc.data();

                var sakhiRef2 = db.collection('users').doc(req.body.phone2);
                var getDoc2 = sakhiRef2.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such user!');
                        }
                        else {
                            var sakhi2 = doc.data();

                            var html_sone = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${sakhi1.user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
We are pleased to introduce your Sakhi <b>${sakhi2.user_name}</b> to you. 
<br>You can connect with him/her on <b>${sakhi2.phone}</b> or <b>${sakhi2.email}</b>
<br>
<br>
All the best for your upcoming program. See you in 
<a href="https://www.facebook.com/groups/modernmonk/">Modern Monk Wellness University</a>.
</p>
    ${mail_template_footer()}
    `;

                            var html_stwo = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${sakhi2.user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
We are pleased to introduce your Sakhi <b>${sakhi1.user_name}</b> to you. 
<br>You can connect with him/her on <b>${sakhi1.phone}</b> or <b>${sakhi1.email}</b>
<br>
<br>
All the best for your upcoming program. See you in 
<a href="https://www.facebook.com/groups/modernmonk/">Modern Monk Wellness University</a>.
</p>
    ${mail_template_footer()}
    `;

                            var mailOptions_sone = {
                                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                to: sakhi1.email,
                                subject: 'Meet your Sakhi',
                                html: html_sone
                            }

                            var mailOptions_stwo = {
                                from: 'Anjali from Modern Monk<support@modernmonk.in>',
                                to: sakhi2.email,
                                subject: 'Meet your Sakhi',
                                html: html_stwo
                            }

                            transporter.sendMail(mailOptions_sone, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log("Error" + err);
                                } else {
                                    console.log('Email sent to Sakhi 1: ' + info.response);
                                }
                            });

                            transporter.sendMail(mailOptions_stwo, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log("Error" + err);
                                } else {
                                    console.log('Email sent to Sakhi 2: ' + info.response);
                                }
                            });

                            res.send("Sakhis Paired successfully!");
                        }
                    }).catch(function (error) {
                        res.send("Error 1: " + error);
                    });
            }
        }).catch(function (error) {
            console.log("Encountered an error: " + error);
            res.send("Error 2: " + error);
        });
})

//testing git
exports.app = functions.https.onRequest(app);