var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var firebase = require("firebase");
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

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
        user: 'iwantmore@yourstrulycare.com',
        pass: 'iwantmore@2019'
    }
}));

function mail_template_header() {
    return `
    <div style="
    max-width: 500px;
    margin: auto;">
        <center>
            <img width="100" src="https://yourstrulycare.com/wp-content/uploads/2018/10/logo-black.png" alt="">
        </center>

        <br>
    `;
}

function mail_template_footer() {
    return `
    <hr style="width: 50%">
        <center>
            <img width="200" src="https://yourstrulycare.com/wp-content/uploads/2018/10/step-3.png" alt="">
        </center>

        <div class="vc_column-inner ">
            <div class="wpb_wrapper">
                <div class="wpb_text_column wpb_content_element ">
                    <div class="wpb_wrapper">
                        <p style="text-align: center;"><strong>Phone:</strong><a style="color: #898989;" href="tel:+91-8448449062">+91-8448449062</a></p>
                        <p style="text-align: center;"><strong>Email ID:</strong><a style="color: #898989;" href="mailto:iwantmore@yourstrulycare.com">
                                iwantmore@yourstrulycare.com
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
                                    <a href="https://www.facebook.com/YT.Care/" target="_blank" rel="noopener">
                                        <img class="alignnone wp-image-11610 size-full" style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://yourstrulycare.com/wp-content/uploads/2018/10/facebook.png"
                                            alt="" width="30" height="30" />
                                    </a>
                                    <a href="https://twitter.com/yourstrulycare" target="_blank" rel="noopener">
                                        <img style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://yourstrulycare.com/wp-content/uploads/2018/10/twitter.png" alt=""
                                            width="30" height="30" />
                                    </a>
                                    <a href="https://www.instagram.com/yourstruly_care" target="_blank" rel="noopener">
                                        <img class="wp-image-11611 size-full alignnone" style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://yourstrulycare.com/wp-content/uploads/2018/10/instagram.png"
                                            alt="" width="30" height="30" />
                                    </a>
                                    <a href="https://www.linkedin.com/company/yours-truly-care" target="_blank" rel="noopener">
                                        <img class="alignnone wp-image-11612 size-full" style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://yourstrulycare.com/wp-content/uploads/2018/10/linked-in.png"
                                            alt="" width="30" height="30" />
                                    </a>
                                    <a href="https://www.youtube.com/channel/UCzXmNuRo87__g3k2En4EOfw" target="_blank"
                                        rel="noopener">
                                        <img style="margin: 0 10px;
                                        margin: 0 10px;
                                        border: 1px solid black;
                                        border-radius: 100%;"
                                            src="https://yourstrulycare.com/wp-content/uploads/2018/10/youtube.png" alt=""
                                            width="30" height="30" />
                                    </a>
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `
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

function getToday(today) {
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



//Coaches->Ahara Coaches->Shradha Wai
app.get('/shradhawai', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "shradhawai.html");
})

app.get('/shradhawai/plans', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "shradha_dietplan.html");
})

app.get('/shradhawai/calls', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "shradha_dietcall.html");
})

app.get('/shradhawai/mypoints', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "shradha_points.html");
})

app.get('/shradhawai/points_history', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "shradha_points_history.html");
})

app.get('/shradhawai/submit_review', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "submit_review.html");
})

app.get('/shradhawai/mass_mail', function (req, res) {
    res.sendFile(__dirname + "/shradha_wai/" + "mass_mail.html");
})




//Coaches->Ahara Coaches->Vanditha Mohanan
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




//Coaches->Ahara Coaches->Pallavi Kabra
app.get('/pallavi_kabra', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "pallavi_kabra.html");
})

app.get('/pallavi_kabra/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "plans.html");
})

app.get('/pallavi_kabra/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "calls.html");
})

app.get('/pallavi_kabra/mypoints', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "points.html");
})

app.get('/pallavi_kabra/points_history', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "points_history.html");
})

app.get('/pallavi_kabra/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "submit_review.html");
})

app.get('/pallavi_kabra/mass_mail', function (req, res) {
    res.sendFile(__dirname + "/coaches/pallavi_kabra/" + "mass_mail.html");
})






//Coaches->Vihara Coaches->Rachana Shah
app.get('/rachanashah', function (req, res) {
    res.sendFile(__dirname + "/coaches/rachana_shah/" + "rachanashah.html");
})

app.get('/rachanashah/plans', function (req, res) {
    res.sendFile(__dirname + "/coaches/rachana_shah/" + "rachna_woplan.html");
})

app.get('/rachanashah/calls', function (req, res) {
    res.sendFile(__dirname + "/coaches/rachana_shah/" + "rachna_wocall.html");
})

app.get('/rachanashah/mypoints', function (req, res) {
    res.sendFile(__dirname + "/coaches/rachana_shah/" + "rachana_points.html");
})

app.get('/rachanashah/points_history', function (req, res) {
    res.sendFile(__dirname + "/coaches/rachana_shah/" + "rachana_points_history.html");
})

app.get('/rachanashah/submit_review', function (req, res) {
    res.sendFile(__dirname + "/coaches/rachana_shah/" + "submit_review.html");
})




//Coaches->Achara Coaches
app.get('/prescribe_aushadhis', function (req, res) {
    res.sendFile(__dirname + "/" + "prescribe_aushadhis.html");
})

app.post('/prescribe_aushadhis', urlencodedParser, function (req, res) {
/*    var html1 = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear Team,
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
Kindly arrange for the delivery of the following Aushadhis for the patient
${req.body.userlist} (${req.body.phone}):
<br />
${req.body.aushadhi_list}
<br />
<br />
Best,
<br />
${req.body.coach_name}
<br />
Achara Coach
<br />
Modern Monk
</p>
    ${mail_template_footer()}
    `;

    mailOptions1 = {
        from: 'YTC<iwantmore@yourstrulycare.com>',
        to: 'iwantmore@yourstrulycare.com',
        subject: 'Aushadhi Delivery Order',
        html: html1
    }

        transporter.sendMail(mailOptions1, (err, info) => {
            transporter.close();
            if (err) {
                console.log(err);
            }
            else {
                console.log('Email sent to YTC: ' + info.response);
            }
        });*/
})

//Coaches->Update Dates
app.get('/nextdietplandate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextdietplandate.html");
})

app.get('/nextdietcalldate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextdietcalldate.html");
})

app.get('/nextworkoutplandate', function (req, res) {
    res.sendFile(__dirname + "/coaches/reschedule/" + "nextworkoutplandate.html");
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


//Operations->Add & View Users
app.get('/adduser', function (_req, res) {
    res.sendFile(__dirname + "/support/" + "adduser.html");
})

app.get('/adduser_wl', function (_req, res) {
    res.sendFile(__dirname + "/support/" + "adduser_wl.html");
})

app.get('/listUsers', function (req, res) {
    res.sendFile(__dirname + "/support/" + "activeusers.html");
})

app.get('/listUsers_historic', function (req, res) {
    res.sendFile(__dirname + "/support/" + "historic_users.html");
})


//Operations->BCAs
app.get('/todays_bca', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/operations/" + "todaysbca.html");
})

app.get('/test_appointment', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/operations/" + "test_appointment.html");
})



//Sales
app.get('/sales_followup', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales"+"/" + "sales_followup.html");
})

app.get('/upload_report', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/sales" + "/" + "upload_report.html");
})





//Support->Coaches
app.get('/add_coach', urlencodedParser, function (req, res) {
    res.sendFile(__dirname + "/coaches/" + "add_coach.html");
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


//Operations->Diagnostic Tests
app.get('/test_appointment', urlencodedParser, function (req, res) {
    var userRef = db.collection('users').doc(req.body.userlist);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                var html_user = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${doc.data().user_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            Your appointment for Blood Tests has been scheduled. 
<br>Please find the details of the appointment here:
<br><b>Appointment Date</b>: ${req.body.date}.
<br><b>Appointment Time</b>: ${req.body.time}.
<br><b>Tests to be done</b>: ${req.body.test_list}.
<br><b>Name of the Partner Lab conducting the test</b>: ${req.body.lab}.
<br><b>Amount to be paid</b>: Rs${req.body.amount}.
<br>
<br>
To cancel or reschedule your appointment, please 
<a href="mailto:iwantmore@yourstrulycare.com">write to us</a>.
</p>
    ${mail_template_footer()}
    `;

                var mailOptions_user = {
                    from: 'YTC<iwantmore@yourstrulycare.com>',
                    to: doc.data().email,
                    cc: 'iwantmore@yourstrulycare.com',
                    subject: 'Appointment for Blood Tests Scheduled',
                    html: html_user
                }

                transporter.sendMail(mailOptions_user, (err, info) => {
                    transporter.close();
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent to customer: ' + info.response);
                    }
                });
            }
        }).catch(err => {
            console.log("Error: ", err);
        });
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
                            if (coach.coach_type == 'Ahara')
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

                            //Update the plan object with the points to be deducted
                            if (add_NC)
                                plan.points_nc = points_to_be_awarded;
                            else if (add_FC)
                                plan.points_fc = points_to_be_awarded;

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
                            if (coach.coach_type == 'Ahara')
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
                            if (add_NC)
                                plan.points_nc = points_to_be_awarded;
                            else if (add_FC)
                                plan.points_fc = points_to_be_awarded;

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
                            if (coach.coach_type == 'Ahara')
                                add_NC = true;
                            else if (coach.coach_type == 'Vihara')
                                add_FC = true;

                            //Calculate the points to be awarded based on the type of review
                            var points_to_be_awarded = 50 * req.body.num_of_ratings;
                            var award_reason = req.body.num_of_ratings + " 5-star Ratings";

                            //Update the plan object with the points to be deducted
                            if (add_NC)
                                plan.points_nc = points_to_be_awarded;
                            else if (add_FC)
                                plan.points_fc = points_to_be_awarded;

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
    today = getToday(today);

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
                        if (doc.data().fitness_trainer.coach_name) {
                            fitness_trainer_name = doc.data().fitness_trainer.coach_name;
                        }
                        else {
                            fitness_trainer_name = doc.data().fitness_trainer;
                        }
                        switch (fitness_trainer_name) {
                            case 'RS':
                                fitness_trainer_name = 'Rachana Shah';
                                break;
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
                                            if (!doc.exists) {
                                                res.send('No such Vihara trainer!');
                                            }
                                            else {
                                                var fitness_trainer_feedback_url = doc.data().feedback_url;

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
Please rate your experience with your Ahara Coach <b>${dietitian_name}</b> 
and your Vihara Coach <b>${fitness_trainer_name}</b>.
<br />
<a href = "${dietitian_feedback_url}">Rate your Ahara Coach</a>.
<br />
<a href = "${fitness_trainer_feedback_url}">Rate your Vihara Coach</a>.
<br />

</p>
    ${mail_template_footer()}
    `;

                                                if (!(diffDays % 7)) {
                                                    mailOptions1 = {
                                                        from: 'YTC<iwantmore@yourstrulycare.com>',
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
                            if (coach.coach_type == 'Ahara')
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
                            if (add_NC)
                                plan.points_nc = points_to_be_deducted;
                            else if (add_FC)
                                plan.points_fc = points_to_be_deducted;

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
    if (add_NC)
        points_to_be_added = plan.points_nc;
    else if (add_FC)
        points_to_be_added = plan.points_fc;
    else if (add_AC)
        points_to_be_added = plan.points_achara_coach;
    else if (add_VC)
        points_to_be_added = plan.points_vichara_coach;

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
    for (i = 0; i < month_arr_for_point_deduction.length; i++) {
        if (deduct_NC) {
            if (found[i]) {
                var final_points = parseInt(coach.points[i + iter].points) - parseInt(plan.points_nc);
                var points_deducted = parseInt(coach.points[i + iter].points);
                if (final_points >= 0) {
                    coach.points[i + iter].points = final_points;
                    points_deducted = parseInt(plan.points_nc);
                }
                else {
                    coach.points[i + iter].points = 0;
                }
            }
            if (parseInt(plan.points_nc)) {
                coach.points_history.push("Deducted " + points_deducted +
                    " points for " + user_name + "(" + month_arr_for_point_deduction[i] +
                    ")" + " on " + todays_date);
            }
        }

        if (deduct_FC) {
            if (found[i]) {
                var final_points = parseInt(coach.points[i + iter].points) - parseInt(plan.points_fc);
                var points_deducted = parseInt(coach.points[i + iter].points);
                if (final_points >= 0) {
                    coach.points[i + iter].points = final_points;
                    points_deducted = parseInt(plan.points_fc);
                }
                else {
                    coach.points[i + iter].points = 0;
                }
            }
            if (parseInt(plan.points_fc)) {
                coach.points_history.push("Deducted " + points_deducted +
                    " points for " + user_name + "(" + month_arr_for_point_deduction[i] +
                    ")" + " on " + todays_date);
            }
        }
    }
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
                                from: 'YTC<iwantmore@yourstrulycare.com>',
                                to: doc.data().email,
                                subject: req.body.subject,
                                html: html1
                            }
                            transporter.sendMail(mailOptions1, (err, info) => {
                                transporter.close();
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent to customer: ' + info.response);
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

app.post('/change_coach', urlencodedParser, function (req, res) {
    var coachData = {
        custCount: req.body.custCount
    }

    //Get the Coach
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
                            today = getToday(today);

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
                                                    var add_NC = false, add_FC = false, add_BNC = false;

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
                                                    if (doc.data().fitness_trainer.coach_name) {
                                                        fitness_trainer_name = doc.data().fitness_trainer.coach_name;
                                                    }
                                                    else {
                                                        fitness_trainer_name = doc.data().fitness_trainer;
                                                    }
                                                    switch (fitness_trainer_name) {
                                                        case 'RS':
                                                            fitness_trainer_name = 'Rachana Shah';
                                                            break;
                                                    }

                                                    if (coachData.oldCoach.coach_name == dietitian_name) {
                                                        var updateUser = userRef.doc(doc.data().phone)
                                                            .update({ dietitian: coachData.newCoach.coach_name });
                                                        add_NC = true;
                                                        add_BNC = true;
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
            We have shifted a user to you. Please check the details:
            <br />
            <br /> Name: ${doc.data().user_name}.
            <br /> Phone number: ${doc.data().phone}.
            <br /> Plan: ${plan_name}.
            <br /> Start Date: ${doc.data().start_date}.
            <br /> Start Date: ${doc.data().end_date}.
       </p>
    ${mail_template_footer()}
    `;

                                                        var mailOptions_coach = {
                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                            to: doc.data().email,
                                                            bcc: 'laveenathakur67@gmail.com',
                                                            subject: 'New User Transferred to you',
                                                            html: html_coach
                                                        }

                                                        var mailOptions_user = {
                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                            to: doc.data().email,
                                                            bcc: 'laveenathakur67@gmail.com',
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
                                                                    }
                                                                    if (add_FC) {
                                                                        add_points(coachData.newCoach, doc.data(), user_name, date, duration, false, true, false, false);
                                                                        coachRef_new.update({ points: coachData.newCoach.points });
                                                                        coachRef_new.update({ points_history: coachData.newCoach.points_history });
                                                                    }
                                                                    //deduct_points();

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

app.post('/change_coach_single', urlencodedParser, function (req, res) {
    //Get the Coach
    var newCoachRef = db.collection('coaches').doc(req.body.coach);
    var getDoc = newCoachRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such coach!');
            }
            else {
                var coach = doc.data();

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
            Dear ${coach.coach_name},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have shifted a user to you. Please check the details:
            <br />
            <br /> Name: ${doc.data().user_name}.
            <br /> Phone number: ${doc.data().phone}.
            <br /> Plan: ${plan_name}.
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
            Your new ${coach.coach_type} Coach is ${coach.coach_name}.
            <br />
You can reach out to them on WhatsApp on ${coach.phone}.
</p>
    ${mail_template_footer()}
    `;

                            var mailOptions_user = {
                                from: 'YTC<iwantmore@yourstrulycare.com>',
                                to: doc.data().email,
                                bcc: 'laveenathakur67@gmail.com',
                                subject: 'New Health Coach Assigned',
                                html: html_user
                            }

                            var mailOptions_coach = {
                                from: 'YTC<iwantmore@yourstrulycare.com>',
                                to: doc.data().email,
                                bcc: 'laveenathakur67@gmail.com',
                                subject: 'New User Transferred to you',
                                html: html_coach
                            }

     //Get Old Coach
                            var oldCoach = {};
                            var oldCoachName;
                            switch (coach.coach_type) {
                                case 'Ahara':
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
                                        if (oldCoachName == 'RS') {
                                            oldCoachName = 'Rachana Shah';
                                        }
                                    }
                            }
                            var oldCoachRef = db.collection('coaches').doc(oldCoachName);
                            var getDoc = oldCoachRef.get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        res.send('No such coach!');
                                    }
                                    else {
                                        oldCoach = doc.data();

                                        //Update the new coach
                                        switch (coach.coach_type) {
                                            case 'Ahara':
                                                userRef.update({ dietitian: coach.coach_name });
                                                add_NC = true;
                                                break;

                                            case 'Vihara':
                                                userRef.update({ fitness_trainer: coach.coach_name });
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
                                                        add_points(coach, doc.data(), user_name, date, duration, true, false, false, false);
                                                        newCoachRef.update({ points: coach.points });
                                                        newCoachRef.update({ points_history: coach.points_history });

                                                        deduct_points(oldCoach, doc.data(), user_name, date, duration, true, false);
                                                        oldCoachRef.update({ points: oldCoach.points });
                                                        oldCoachRef.update({ points_history: oldCoach.points_history });
                                                    }
                                                    if (add_FC) {
                                                        add_points(coach, doc.data(), user_name, date, duration, false, true, false, false);
                                                        newCoachRef.update({ points: coach.points });
                                                        newCoachRef.update({ points_history: coach.points_history });

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
You can read more about the same by <a href="https://yourstrulycare.com/refund">clicking here</a>.
            <br />
            <br />
We are really sad to see you go. 
<br />
We would appreciate if you could tell us what went wrong by rating your coaches:
<br />
Rate your Ahara Coach: ${doc.data().dietitian.feedback_url}.
<br />
Rate your Vihara Coach: ${doc.data().fitness_trainer.feedback_url}.
<br />
<br />
If you ever wish to restart your plan, just <a href="mailto:iwantmore@yourstrulycare.com">write to us</a>.</p>
    ${mail_template_footer()}
    `;

                var mailOptions = {
                    from: 'YTC<iwantmore@yourstrulycare.com>',
                    to: doc.data().email,
                    bcc: 'laveenathakur67@gmail.com',
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
                date = getToday(date);
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

app.post('/nextworkoutplandate', urlencodedParser, function (req, res) {
    var newDate = {
        user_name: req.body.userlist,
        phone: req.body.phone,
        new_date: req.body.new_date,
    }

    var workoutPlanDates = [];
    newDate.new_date = incr_date(newDate.new_date, -1);

    var userRef = db.collection('users').doc(newDate.phone);
    var getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such user!');
            }
            else {
                workoutPlanDates = doc.data().workoutPlanDates;

                //Corner case 1: All the dates need to be changed
                if (workoutPlanDates[0] > newDate.new_date) {
                    //Remove all dates
                    workoutPlanDates.length = 0;

                    //Add new dates in line with the New Date
                    var varDate = newDate.new_date;
                    //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                    while (varDate <= doc.data().end_date) {
                        workoutPlanDates.push(varDate);
                        varDate = incr_date(varDate, 15);
                    }
                }
                //Corner case 2: It's the 'last call/plan day'
                else if (workoutPlanDates[workoutPlanDates.length - 1] < newDate.new_date) {
                    if (newDate.new_date < doc.data().end_date) {
                        workoutPlanDates.push(newDate.new_date);
                    }
                }
                //all other cases
                else {
                    for (var j = 0; j < workoutPlanDates.length; j++) {
                        if (workoutPlanDates[j] < newDate.new_date && workoutPlanDates[j + 1] > newDate.new_date) {
                            //Remove all dates after the last date before New Date
                            workoutPlanDates.length = j + 1;

                            //Add new dates in line with the New Date
                            var varDate = newDate.new_date;
                            //Loop until we find out whether varDate is a plan/call day or not & keep adding every nth day till then
                            while (varDate <= doc.data().end_date) {
                                workoutPlanDates.push(varDate);
                                varDate = incr_date(varDate, 15);
                            }
                        }
                    }
                }

                //Write to DB
                var updateUser = userRef.update({ workoutPlanDates: workoutPlanDates });
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
        active_hours: req.body.active_hours,
        feedback_url: req.body.feedback_url,
    }

    //Get Buddy Coach
    var coachRef = db.collection('coaches').doc(req.body.buddy_coach);
    var getDoc = coachRef.get()
        .then(doc => {
            if (!doc.exists) {
                res.send('No such buddy coach!');
            }
            else {
                newCoachData.buddy_coach = doc.data();
                var setDoc = db.collection("coaches").doc(newCoachData.coach_name)
                    .set(newCoachData).then(function () {
                        res.send("Coach added successfully!");
                    })
                    .catch(function (error) {
                        res.send("Error adding Coach: ", error);
                    });
            }
        });
})

app.post('/add_plan', urlencodedParser, function (req, res) {
    var newPlanData = {
        plan_name: req.body.plan_name,
        duration: req.body.duration,
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

app.post('/addUser_wl', urlencodedParser, function (req, res) {
    var newUserData = {
        user_name: req.body.user_name,
        phone: req.body.phone,
        email: req.body.email,
        start_date: req.body.start_date,
        plan: req.body.plan,
        dietitian: req.body.nc,
        fitness_trainer: req.body.fc,
    }

    //Get Plan
    var planRef = db.collection('plans').doc(req.body.plan);
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
                plan.fc_plans_count = doc.data().fc_plans_count;
                plan.fc_calls_count = doc.data().fc_calls_count;
                plan.plan_name = doc.data().plan_name;
                plan.points_nc = doc.data().points_nc;
                plan.points_fc = doc.data().points_fc;

                //Add End Date
                newUserData.end_date = incr_date(newUserData.start_date,
                    plan.duration * req.body.duration_mul);

                //Get Ahara Coach
                var Ahara_Coach_Ref = db.collection('coaches').doc(req.body.nc);
                var getDoc = Ahara_Coach_Ref.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            var dietitian = {};
                            dietitian.phone = doc.data().phone;
                            dietitian.active_hours = doc.data().active_hours;
                            dietitian.feedback_url = doc.data().feedback_url;
                            dietitian.email = doc.data().email;
                            dietitian.points = doc.data().points;
                            dietitian.points_history = doc.data().points_history;

                            //Get Vihara Coach
                            Vihara_Coach_Ref = db.collection('coaches').doc(req.body.fc);
                            getDoc = Vihara_Coach_Ref.get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        res.send('No such coach!');
                                    }
                                    else {
                                        var fitness_trainer = {};
                                        fitness_trainer.phone = doc.data().phone;
                                        fitness_trainer.active_hours = doc.data().active_hours;
                                        fitness_trainer.feedback_url = doc.data().feedback_url;
                                        fitness_trainer.email = doc.data().email;
                                        fitness_trainer.points = doc.data().points;
                                        fitness_trainer.points_history = doc.data().points_history;

                                                                        //Add arrays that list all future call & plan days
                                                                        newUserData.dietPlanDates = [];
                                                                        newUserData.dietCallDates = [];
                                                                        newUserData.workoutPlanDates = [];
                                                                        newUserData.workoutCallDates = [];
                                                                        // newUserData.bcaDates = [];

                                                                        /*1. DIET PLAN DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        var varDate = incr_date(newUserData.start_date, -2);

                                                                        //Loop until we find out whether today is a plan/call day or not & keep adding every nth day till then
                                                                        if (parseInt(plan.nc_plans_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.dietPlanDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.nc_plans_count));
                                                                            }
                                                                        }

                                                                        /*2. DIET CALL DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -2);

                                                                        //Same thing for Diet follow ups. The number varies based on the plan
                                                                        if (parseInt(plan.nc_calls_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.dietCallDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.nc_calls_count));
                                                                            }
                                                                        }

                                                                        //Push the end date
                                                                        newUserData.dietCallDates.push(newUserData.end_date);

                                                                        /*3. WORKOUT PLAN DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -1);

                                                                        if (parseInt(plan.fc_plans_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.workoutPlanDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.fc_plans_count));
                                                                            }
                                                                        }

                                                                        /*4. WORKOUT CALL DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -1);

                                                                        if (parseInt(plan.fc_calls_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.workoutCallDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.fc_plans_count));
                                                                            }
                                                                        }

                                                                        //Push the end date
                                                                        if (plan.plan_name != "Slimming") {
                                                                            newUserData.workoutCallDates.push(newUserData.end_date);
                                                                        }

                                                                        /*5. BCA DATES*/
                                                                        //Set varDate to 4 weeks after Start Date
                                                                        //varDate = incr_date(newUserData.start_date, 28);

                                                                        //if (plan.plan_name == "Total Health" || plan.plan_name == "Premium") {
                                                                        //    while (varDate <= newUserData.end_date) {
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
                                                                        var html_ahara_coach = `
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
            <br /> Plan: ${plan.plan_name}.
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
            <br /> Plan: ${plan.plan_name}.
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
 with our <b>${plan.plan_name} plan</b>.
<br /><br />
Before you start your journey, here's some things you need to know:
<ul>
<li><b>Your Ahara Coach</b>: <b>${newUserData.dietitian}</b>. You can 
reach out to them on WhatsApp on <b>${dietitian.phone}</b> during 
<b>${dietitian.active_hours}</b>.</li>
`;
                                                                        if (plan.plan_name == 'Slimming') { }
                                                                        else {
                                                                            html_user += `<li><b>Your Vihara Coach</b>: ${newUserData.fitness_trainer}</b >.
 You can reach out to them on WhatsApp on <b>${fitness_trainer.phone}</b> 
during <b>${fitness_trainer.active_hours}</b>.</li>`;
                                                                        }
                                                                        html_user += `<li>Your coaches don't have an incoming facility on their 
phones. If you ever wish to speak to them, you can just drop them a message on WhatsApp and 
they shall revert to you between 10am to 7pm, Mondays to Saturdays, except on public 
holidays.</li>
<li><b>Your Plan Details</b>: Your plan starts on <b>${newUserData.start_date}</b> and ends on 
<b>${newUserData.end_date}</b>. </li>
<li><b>Follow-up from your Coaches</b>: As per your current plan, you will get
<b>${plan.nc_calls_count} follow-up calls</b> from your
<b>Ahara Coach</b> and <b>${plan.fc_calls_count} follow-up calls</b> from your 
<b>Vihara Coach</b> in a month. If you wish to upgrade your plan to get more follow-up calls from 
your coaches, please reply to this email.
</li>
<li><b>Rating your Coaches</b>: At the end of every month, you will get an automated e-mail from us asking you to rate your 
coaches. Please use that opportunity to share honest feedback. We try our best to ensure
that you get the best experience, but our efforts are incomplete without your feedback.
</br>To rate your coaches, please use these links:
<br>${newUserData.dietitian}: ${dietitian.feedback_url}
<br>${newUserData.fitness_trainer}: ${fitness_trainer.feedback_url}`;
                                                                        html_user += `</li>
<li><b>What if you are unhappy with your Coach</b>: In case you are not happy with your coach, all you to do is
<a href="mailto:iwantmore@yourstrulycare.com">write to us</a> and we will make sure that you get the best
available coach.</li>
<li><b>Regarding Support</b>: If you ever face any issue related to our service, please
<a href="mailto:iwantmore@yourstrulycare.com">reach out to us</a>.</li>
</ul>
</p>
    ${mail_template_footer()}
    `;

                                                                        var mailOptions_ahara_coach = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: dietitian.email,
                                                                            cc: 'laveenathakur67@gmail.com',
                                                                            subject: 'New User Assigned',
                                                                            html: html_ahara_coach
                                                                        }

                                                                        var mailOptions_vihara_coach = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: fitness_trainer.email,
                                                                            cc: 'laveenathakur67@gmail.com',
                                                                            subject: 'New User Assigned',
                                                                            html: html_vihara_coach
                                                                        }

                                                                        var userMailOptions = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: newUserData.email,
                                                                            subject: 'Welcome to YTC!',
                                                                            html: html_user
                                                                        }

                                                                        add_points(dietitian, plan, newUserData.user_name, newUserData.start_date, req.body.duration_mul, true, false, false, false);
                                                                        add_points(fitness_trainer, plan, newUserData.user_name, newUserData.start_date, req.body.duration_mul, false, true, false, false);

                                                                        //Update Coaches' Data
                                                                        Ahara_Coach_Ref.update({ points: dietitian.points });
                                                                        Ahara_Coach_Ref.update({ points_history: dietitian.points_history });
                                                                        Vihara_Coach_Ref.update({ points: fitness_trainer.points });
                                                                        Vihara_Coach_Ref.update({ points_history: fitness_trainer.points_history });

                                                                        //Set User
                                                                        var setDoc = db.collection("users").doc(newUserData.phone).set(newUserData).then(function () {

                                                                            transporter.sendMail(userMailOptions, (err, info) => {
                                                                                transporter.close();
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log('Email sent to Customer: ' + info.response);
                                                                                }
                                                                            });

                                                                            transporter.sendMail(mailOptions_ahara_coach, (err, info) => {
                                                                                transporter.close();
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log('Email sent to Ahara Coach: ' + info.response);
                                                                                }
                                                                            });

                                                                            transporter.sendMail(mailOptions_vihara_coach, (err, info) => {
                                                                                transporter.close();
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log('Email sent to Vihara Coach: ' + info.response);
                                                                                }
                                                                            });

                                                                            res.send("User added successfully!");
                                                                        })
                                                                            .catch(function (error) {
                                                                                res.send("Error adding User: ", error);
                                                                            });
                                                                    }
                                                                }).catch(function (error) {
                                                                    res.send("No Vichara Coach Found: ", error);
                                                                });
                                                        }
                    }).catch(function (error) {
                        res.send("No Ahara Coach Found: ", error);
                    });
            }
        });
})

app.post('/addUser', urlencodedParser, function (req, res) {
    var newUserData = {
        user_name: req.body.user_name,
        phone: req.body.phone,
        email: req.body.email,
        start_date: req.body.start_date,
        plan: 'Diabetes Management',
        dietitian: req.body.nc,
        fitness_trainer: req.body.fc,
        achara_coach: req.body.achara_coach,
        vichara_coach: req.body.vichara_coach,
    }

    //Get Plan
    var planRef = db.collection('plans').doc('Diabetes Management');
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
                plan.fc_plans_count = doc.data().fc_plans_count;
                plan.fc_calls_count = doc.data().fc_calls_count;
                plan.plan_name = doc.data().plan_name;
                plan.points_nc = doc.data().points_nc;
                plan.points_fc = doc.data().points_fc;
                plan.points_achara_coach = doc.data().points_achara_coach;
                plan.points_vichara_coach = doc.data().points_vichara_coach;

                //Add End Date
                newUserData.end_date = incr_date(newUserData.start_date,
                    plan.duration * req.body.duration_mul);

                //Get Ahara Coach
                var Ahara_Coach_Ref = db.collection('coaches').doc(req.body.nc);
                var getDoc = Ahara_Coach_Ref.get()
                    .then(doc => {
                        if (!doc.exists) {
                            res.send('No such coach!');
                        }
                        else {
                            var dietitian = {};
                            dietitian.phone = doc.data().phone;
                            dietitian.active_hours = doc.data().active_hours;
                            dietitian.feedback_url = doc.data().feedback_url;
                            dietitian.email = doc.data().email;
                            dietitian.points = doc.data().points;
                            dietitian.points_history = doc.data().points_history;

                            //Get Vihara Coach
                            Vihara_Coach_Ref = db.collection('coaches').doc(req.body.fc);
                            getDoc = Vihara_Coach_Ref.get()
                                .then(doc => {
                                    if (!doc.exists) {
                                        res.send('No such coach!');
                                    }
                                    else {
                                        var fitness_trainer = {};
                                        fitness_trainer.phone = doc.data().phone;
                                        fitness_trainer.active_hours = doc.data().active_hours;
                                        fitness_trainer.feedback_url = doc.data().feedback_url;
                                        fitness_trainer.email = doc.data().email;
                                        fitness_trainer.points = doc.data().points;
                                        fitness_trainer.points_history = doc.data().points_history;

                                        //Get Achara Coach
                                        if (req.body.achara_coach) {
                                            Achara_Coach_Ref = db.collection('coaches').doc(req.body.achara_coach);
                                            getDoc = Achara_Coach_Ref.get()
                                                .then(doc => {
                                                    if (!doc.exists) {
                                                        res.send('No such coach!');
                                                    }
                                                    else {
                                                        var achara_coach = {};
                                                        achara_coach.phone = doc.data().phone;
                                                        achara_coach.active_hours = doc.data().active_hours;
                                                        achara_coach.feedback_url = doc.data().feedback_url;
                                                        achara_coach.email = doc.data().email;
                                                        achara_coach.points = doc.data().points;
                                                        achara_coach.points_history = doc.data().points_history;

                                                        //Get Vichara Coach
                                                        if (req.body.vichara_coach) {
                                                            Vichara_Coach_Ref = db.collection('coaches').doc(req.body.vichara_coach);
                                                            getDoc = Vichara_Coach_Ref.get()
                                                                .then(doc => {
                                                                    if (!doc.exists) {
                                                                        res.send('No such coach!');
                                                                    }
                                                                    else {
                                                                        var vichara_coach = {};
                                                                        vichara_coach.phone = doc.data().phone;
                                                                        vichara_coach.active_hours = doc.data().active_hours;
                                                                        vichara_coach.feedback_url = doc.data().feedback_url;
                                                                        vichara_coach.email = doc.data().email;
                                                                        vichara_coach.points = doc.data().points;
                                                                        vichara_coach.points_history = doc.data().points_history;

                                                                        //Add arrays that list all future call & plan days
                                                                        newUserData.dietPlanDates = [];
                                                                        newUserData.dietCallDates = [];
                                                                        newUserData.workoutPlanDates = [];
                                                                        newUserData.workoutCallDates = [];
                                                                        newUserData.acharaPlanDates = [];
                                                                        newUserData.acharaCallDates = [];
                                                                        newUserData.vicharaPlanDates = [];
                                                                        newUserData.vicharaCallDates = [];
                                                                        // newUserData.bcaDates = [];

                                                                        /*1. DIET PLAN DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        var varDate = incr_date(newUserData.start_date, -2);

                                                                        //Loop until we find out whether today is a plan/call day or not & keep adding every nth day till then
                                                                        if (parseInt(plan.nc_plans_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.dietPlanDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.nc_plans_count));
                                                                            }
                                                                        }

                                                                        /*2. DIET CALL DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -2);

                                                                        //Same thing for Diet follow ups. The number varies based on the plan
                                                                        if (parseInt(plan.nc_calls_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.dietCallDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.nc_calls_count));
                                                                            }
                                                                        }

                                                                        //Push the end date
                                                                        newUserData.dietCallDates.push(newUserData.end_date);

                                                                        /*3. WORKOUT PLAN DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -1);

                                                                        if (parseInt(plan.fc_plans_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.workoutPlanDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.fc_plans_count));
                                                                            }
                                                                        }

                                                                        /*4. WORKOUT CALL DATES*/
                                                                        //Set varDate to 2 days before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -1);

                                                                        if (parseInt(plan.fc_calls_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.workoutCallDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.fc_plans_count));
                                                                            }
                                                                        }

                                                                        //Push the end date
                                                                        if (plan.plan_name != "Slimming") {
                                                                            newUserData.workoutCallDates.push(newUserData.end_date);
                                                                        }

                                                                        /*5. BCA DATES*/
                                                                        //Set varDate to 4 weeks after Start Date
                                                                        //varDate = incr_date(newUserData.start_date, 28);

                                                                        //if (plan.plan_name == "Total Health" || plan.plan_name == "Premium") {
                                                                        //    while (varDate <= newUserData.end_date) {
                                                                        //        newUserData.bcaDates.push(varDate);
                                                                        //        varDate = incr_date(varDate, 28);
                                                                        //    }
                                                                        //}

                                                                        //Push the end date
                                                                        //if (plan.plan_name != "Free") {
                                                                        //    newUserData.bcaDates.push(newUserData.end_date);
                                                                        //}

                                                                        /*6. ACAHRA PLAN DATES*/
                                                                        //Set varDate to 1 day before Start Date
                                                                        if (plan.plan_name == "Diabetes Management") {
                                                                        varDate = incr_date(newUserData.start_date, -2);

                                                                        if (parseInt(plan.achara_plans_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.acharaPlanDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.achara_plans_count));
                                                                            }
                                                                        }

                                                                        /*7. ACHARA CALL DATES*/
                                                                        //Set varDate to 1 day before Start Date
                                                                        varDate = incr_date(newUserData.start_date, -2);

                                                                        if (parseInt(plan.achara_calls_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.acharaCallDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.achara_calls_count));
                                                                            }
                                                                        }

                                                                        //Push the end date
                                                                            newUserData.acharaCallDates.push(newUserData.end_date);
                                                                        }

                                                                        /*9. VICHARA PLAN DATES*/
                                                                        //Set varDate to Start Date
                                                                        if (plan.plan_name == "Diabetes Management") {
                                                                        varDate = newUserData.start_date;

                                                                        if (parseInt(plan.vichara_plans_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.vicharaPlanDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.vichara_plans_count));
                                                                            }
                                                                        }

                                                                        /*4. VICHARA CALL DATES*/
                                                                        //Set varDate to Start Date
                                                                        varDate = newUserData.start_date;

                                                                        if (parseInt(plan.vichara_calls_count)) {
                                                                            while (varDate <= newUserData.end_date) {
                                                                                newUserData.vicharaCallDates.push(varDate);
                                                                                varDate = incr_date(varDate,
                                                                                    Math.ceil(plan.duration / plan.vichara_calls_count));
                                                                            }
                                                                        }

                                                                        //Push the end date
                                                                            newUserData.vicharaCallDates.push(newUserData.end_date);
                                                                        }

                                                                        //Add to DB
                                                                        //    var queryAsObject = JSON.parse(JSON.stringify(newUserData));


                                                                        //Send mail to the Coaches when assigning a user to them
                                                                        var html_ahara_coach = `
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
            <br /> Plan: ${plan.plan_name}.
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
            <br /> Plan: ${plan.plan_name}.
            <br /> Start Date: ${newUserData.start_date}.
            <br />
        </p>
    ${mail_template_footer()}
    `;

                                                                        var html_achara_coach = `
    ${mail_template_header()}
        <p style="color: grey">
            Dear ${newUserData.achara_coach},
        </p>
        <p style="color: grey">
            &nbsp;&nbsp;&nbsp;&nbsp;
            We have assigned you a user, please check the details:
            <br />
            <br /> Name: ${newUserData.user_name}.
            <br /> Phone number: ${newUserData.phone}.
            <br /> Plan: ${plan.plan_name}.
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
            <br /> Plan: ${plan.plan_name}.
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
 with our <b>${plan.plan_name} plan</b>.
<br /><br />
Before you start your journey, here's some things you need to know:
<ul>
<li><b>Your Ahara Coach</b>: <b>${newUserData.dietitian}</b>. You can 
reach out to them on WhatsApp on <b>${dietitian.phone}</b> during 
<b>${dietitian.active_hours}</b>.</li>
`;
                                                                        if (plan.plan_name == 'Slimming') { }
                                                                        else {
                                                                            html_user += `<li><b>Your Vihara Coach</b>: ${newUserData.fitness_trainer}</b >.
 You can reach out to them on WhatsApp on <b>${fitness_trainer.phone}</b> 
during <b>${fitness_trainer.active_hours}</b>.</li>`;
                                                                        }
                                                                        if (plan.plan_name == 'Diabetes Management') {
                                                                            html_user += `<li><b>Your Achara Coach</b>: ${newUserData.achara_coach}</b >.
 You can reach out to them on WhatsApp on <b>${achara_coach.phone}</b> 
during <b>${achara_coach.active_hours}</b>.</li>`;
                                                                            html_user += `<li><b>Your Vichara Coach</b>: ${newUserData.vichara_coach}</b >.
 You can reach out to them on WhatsApp on <b>${vichara_coach.phone}</b> 
during <b>${vichara_coach.active_hours}</b>.</li>`;
                                                                        }
                                                                        html_user += `<li>Your coaches don't have an incoming facility on their 
phones. If you ever wish to speak to them, you can just drop them a message on WhatsApp and 
they shall revert to you between 10am to 7pm, Mondays to Saturdays, except on public 
holidays.</li>
<li><b>Your Plan Details</b>: Your plan starts on <b>${newUserData.start_date}</b> and ends on 
<b>${newUserData.end_date}</b>. </li>
<li><b>Follow-up from your Coaches</b>: As per your current plan, you will get
<b>${plan.nc_calls_count} follow-up calls</b> from your
<b>Ahara Coach</b> and <b>${plan.fc_calls_count} follow-up calls</b> from your 
<b>Vihara Coach</b> in a month. If you wish to upgrade your plan to get more follow-up calls from 
your coaches, please reply to this email.
</li>
<li><b>Rating your Coaches</b>: At the end of every month, you will get an automated e-mail from us asking you to rate your 
coaches. Please use that opportunity to share honest feedback. We try our best to ensure
that you get the best experience, but our efforts are incomplete without your feedback.
</br>To rate your coaches, please use these links:
<br>${newUserData.dietitian}: ${dietitian.feedback_url}
<br>${newUserData.fitness_trainer}: ${fitness_trainer.feedback_url}`;
                                                                        if (plan.plan_name == 'Diabetes Management') {
                                                                            html_user += `<br>${newUserData.achara_coach}: ${achara_coach.feedback_url}
                                                                                        <br>${newUserData.vichara_coach}: ${vichara_coach.feedback_url}`;
                                                                        }
                                                                        html_user += `</li>
<li><b>What if you are unhappy with your Coach</b>: In case you are not happy with your coach, all you to do is
<a href="mailto:iwantmore@yourstrulycare.com">write to us</a> and we will make sure that you get the best
available coach.</li>
<li><b>Regarding Support</b>: If you ever face any issue related to our service, please
<a href="mailto:iwantmore@yourstrulycare.com">reach out to us</a>.</li>
</ul>
</p>
    ${mail_template_footer()}
    `;

                                                                        var mailOptions_ahara_coach = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: dietitian.email,
                                                                            cc: 'laveenathakur67@gmail.com',
                                                                            subject: 'New User Assigned',
                                                                            html: html_ahara_coach
                                                                        }

                                                                        var mailOptions_vihara_coach = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: fitness_trainer.email,
                                                                            cc: 'laveenathakur67@gmail.com',
                                                                            subject: 'New User Assigned',
                                                                            html: html_vihara_coach
                                                                        }

                                                                        var mailOptions_achara_coach = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: achara_coach.email,
                                                                            cc: 'laveenathakur67@gmail.com',
                                                                            subject: 'New User Assigned',
                                                                            html: html_achara_coach
                                                                        }

                                                                        var mailOptions_vichara_coach = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: vichara_coach.email,
                                                                            cc: 'laveenathakur67@gmail.com',
                                                                            subject: 'New User Assigned',
                                                                            html: html_vichara_coach
                                                                        }

                                                                        var userMailOptions = {
                                                                            from: 'YTC<iwantmore@yourstrulycare.com>',
                                                                            to: newUserData.email,
                                                                            subject: 'Welcome to YTC!',
                                                                            html: html_user
                                                                        }

                                                                        add_points(dietitian, plan, newUserData.user_name, newUserData.start_date, req.body.duration_mul, true, false, false, false);
                                                                        add_points(fitness_trainer, plan, newUserData.user_name, newUserData.start_date, req.body.duration_mul, false, true, false, false);
                                                                        if (plan.plan_name == "Diabetes Management") {
                                                                            add_points(achara_coach, plan, newUserData.user_name, newUserData.start_date, req.body.duration_mul, false, false, true, false);
                                                                            add_points(vichara_coach, plan, newUserData.user_name, newUserData.start_date, req.body.duration_mul, false, false, false, true);
                                                                        }

                                                                        //Update Coaches' Data
                                                                        Ahara_Coach_Ref.update({ points: dietitian.points });
                                                                        Ahara_Coach_Ref.update({ points_history: dietitian.points_history });
                                                                        Vihara_Coach_Ref.update({ points: fitness_trainer.points });
                                                                        Vihara_Coach_Ref.update({ points_history: fitness_trainer.points_history });
                                                                        if (plan.plan_name == "Diabetes Management") {
                                                                            Achara_Coach_Ref.update({ points: achara_coach.points });
                                                                            Achara_Coach_Ref.update({ points_history: achara_coach.points_history });
                                                                            Vichara_Coach_Ref.update({ points: vichara_coach.points });
                                                                            Vichara_Coach_Ref.update({ points_history: vichara_coach.points_history });
                                                                        }

                                                                        //Set User
                                                                        var setDoc = db.collection("users").doc(newUserData.phone).set(newUserData).then(function () {

                                                                            transporter.sendMail(userMailOptions, (err, info) => {
                                                                                transporter.close();
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log('Email sent to Customer: ' + info.response);
                                                                                }
                                                                            });

                                                                            transporter.sendMail(mailOptions_ahara_coach, (err, info) => {
                                                                                transporter.close();
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log('Email sent to Ahara Coach: ' + info.response);
                                                                                }
                                                                            });

                                                                            transporter.sendMail(mailOptions_vihara_coach, (err, info) => {
                                                                                transporter.close();
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    console.log('Email sent to Vihara Coach: ' + info.response);
                                                                                }
                                                                            });

                                                                            if (plan.plan_name == "Diabetes Management") {
                                                                                transporter.sendMail(mailOptions_achara_coach, (err, info) => {
                                                                                    transporter.close();
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                    } else {
                                                                                        console.log('Email sent to Achara Coach: ' + info.response);
                                                                                    }
                                                                                });

                                                                                transporter.sendMail(mailOptions_vichara_coach, (err, info) => {
                                                                                    transporter.close();
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                    } else {
                                                                                        console.log('Email sent to Vichara Coach: ' + info.response);
                                                                                    }
                                                                                });
                                                                            }

                                                                            res.send("User added successfully!");
                                                                        })
                                                                            .catch(function (error) {
                                                                                res.send("Error adding User: ", error);
                                                                            });
                                                                    }
                                                                }).catch(function (error) {
                                                                    res.send("No Vichara Coach Found: ", error);
                                                                });
                                                        }
                                                    }
                                                }).catch(function (error) {
                                                    res.send("No Achara Coach Found: ", error);
                                                });
                                        }
                                    }
                                }).catch(function (error) {
                                    res.send("No Vihara Coach Found: ", error);
                                });
                        }
                    }).catch(function (error) {
                        res.send("No Ahara Coach Found: ", error);
                    });
            }
        });
})

exports.app = functions.https.onRequest(app);