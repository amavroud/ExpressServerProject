const express = require('express');
const cookieParser = require('cookie-parser');
const newConnection = require('./DBConnection');
//setup requirements

const app = express();

app.use(cookieParser("my little secret")); // phrase used for encryption

//login page default
app.use(express.static('static'));

//neccesary for reading our req.body. inputs
app.use(express.urlencoded({
    extended: true
}));

app.post('/login', (req,res) => {
    let userName = req.body.usr;
    let password = req.body.pwd;
    let message = "Access Denied";
    //if admin admin is not entered it will display to user the error message
    if(userName == 'admin' && password == 'admin')
    {
        res.cookie("usr", userName);
        res.cookie("pwd", password, {signed:true});
        res.redirect('/adminLandingPage.html');// send us to admin landing page
    } else {
        res.send(message);
    }
})

//dynamic login form using the post above that will redirect to other pages
app.get('/login-form', (req,res) => {
    let userName, password;
    userName = req.cookies.usr || '' ;
    password = req.signedCookies.pwd || '';
    let content =
    `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Welcome to the booking login!</h1>
            <form action='/login' method ='post'>
                user name : <input name ='usr' value='${userName}' type='text'/>
                <br/>
                password: <input name='pwd' value ='${password}' type='text'/>
                <br/>
                <input type="submit"/>
            </form>
            <a href='/>Click here to go to main screen</a>
        </body>
        </html>
    `;
    res.send(content);
})


//submition post to data base
app.post('/add-availability', (req, res) => {
    let conn = newConnection(); // pointer to mysql connect function
    conn.connect();
    let nine, ten, elleven, twelve, one, two, three, four, five, six;

    // if its checked keep checked, otherwise assign value of 0 (for mysql purpose) instead of undef
    nine = req.body.NineAM == "1" ? "1":"0";
    ten = req.body.TenAM == "1" ? "1":"0";
    elleven = req.body.EllevenAM == "1" ? "1":"0";
    twelve = req.body.TwelvePM == "1" ? "1":"0";
    one = req.body.OnePM == "1" ? "1":"0";
    two = req.body.TwoPM == "1" ? "1":"0";
    three = req.body.ThreePM == "1" ? "1":"0";
    four = req.body.FourPM == "1" ? "1":"0";
    five = req.body.FivePM == "1" ? "1":"0";
    six = req.body.SixPM == "1" ? "1":"0";
    //insert the input into db
    conn.query(`insert into Booking (
        Name, 
        NineAM, 
        TenAM,
        EllevenAM,
        TwelvePM,
        OnePM,
        TwoPM,
        ThreePM,
        FourPM,
        FivePM,
        SixPM) values (
        '${req.body.desc}',
        '${nine}',
        '${ten}',
        '${elleven}'
        ,'${twelve}',
        '${one}',
        '${two}',
        '${three}'
        ,'${four}',
        '${five}'
        ,'${six}')`
            ,(err, rows, fields) => {
                res.redirect('/availability'); // redirect to dynamic page showing all avail
            });
    conn.end();
});

// update availability will pass in the id from the row the edit link is under in availability
app.get('/update-availability/:id', (req, res) => {
    let row_id = req.params.id;
    
    let createForm = (data) => {
        console.log(data);
        let currentAvail = data[0];
        let page = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <form action="/update" method="post">
                    <input type="hidden" name="row_id" value="${row_id}">
                    Name: <input Name='desc' value="${currentAvail.Name}"/>
                    <br/>
                    <div>
                        <input type="checkbox" ${currentAvail.NineAM ? 'checked' : ''}  name="NineAM" value="1"/>
                        <label for="NineAM">9AM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.TenAM ? 'checked' : ''} id="TenAM" name="TenAM" value="1"/>
                        <label for="TenAM">10AM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.EllevenAM ? 'checked' : ''} id="EllevenAM" name="EllevenAM" value="1"/>
                        <label for="EllevenAM">11AM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.TwelvePM ? 'checked' : ''} id="TwelvePM" name="TwelvePM" value="1"/>
                        <label for="TwelvePM">12PM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.OnePM ? 'checked' : ''} id="OnePM" name="OnePM" value="1"/>
                        <label for="OnePM">1PM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.TwoPM ? 'checked' : ''} id="TwoPM" name="TwoPM" value="1"/>
                        <label for="TwoPM">2PM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.ThreePM ? 'checked' : ''} id="ThreePM" name="ThreePM" value="1"/>
                        <label for="ThreePM">3PM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.FourPM ? 'checked' : ''} id="FourPM" name="FourPM" value="1"/>
                        <label for="FourPM">4PM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.FivePM ? 'checked' : ''} id="FivePM" name="FivePM" value="1"/>
                        <label for="FivePM">5PM</label>
                    </div>
                    <div>
                        <input type="checkbox" ${currentAvail.SixPM ? 'checked' : ''} id="SixPM" name="SixPM" value="1"/>
                        <label for="SixPM">6PM</label>
                    </div>
                    <input type="submit"/>
                </form>
        `
        res.send(page);
    }
    
    let conn = newConnection();
    conn.connect();
    conn.query(`SELECT * FROM Booking WHERE id=${row_id}`, (err, result) => {
        if (err) throw err;
        console.log(result);
        createForm(result);
    });
    conn.end()
})
//update our changes to the database for id we are changing
app.post('/update', (req, res) => {
    let conn = newConnection();
    conn.connect();
    
    let b = req.body;
    console.log(b);
    conn.query(`UPDATE Booking
    SET Name = '${b.desc}',
    NineAM = ${b.NineAM ? 1 : 0},
    TenAM = ${b.TenAM ? 1 : 0},
    EllevenAM = ${b.EllevenAM ? 1 : 0},
    TwelvePM = ${b.TwelvePM ? 1 : 0},
    OnePM = ${b.OnePM ? 1 : 0},
    TwoPM = ${b.TwoPM ? 1 : 0},
    ThreePM = ${b.ThreePM ? 1 : 0},
    FourPM = ${b.FourPM ? 1 : 0},
    FivePM = ${b.FivePM ? 1 : 0},
    SixPM = ${b.SixPM ? 1 : 0}
    WHERE id = ${b.row_id};`, (err, result) => {res.redirect('/admin-availability')});
})

//the page that diplays the avaialabiltiy of send listings
app.get('/availability', (request, response) => {
    let conn = newConnection();
    conn.connect();
    let availList;
    conn.query(`select * from Booking`, (err,rows,fields) => {
        if(err)
            response.send('Error: ' +err)
        else
        {
            availList = rows;
        
            let content =`
            <h2>1 Represents Availability, 0 Represents Lack Thereof\n</h2>
            <table>
                <tr>
                    <th>Name</th>
                    <th>9AM</th>
                    <th>10AM</th>
                    <th>11AM</th>
                    <th>12PM</th>
                    <th>1PM</th>
                    <th>2PM</th>
                    <th>3PM</th>
                    <th>4PM</th>
                    <th>5PM</th>
                    <th>6PM</th>
                </tr>
                `;
            // create table of values from database
            for(a of availList){
                content += '<tr>';
                    content += '<th>' + a.Name + '</th>' //take out the description from that row in list
                    content += '<th>' + a.NineAM + '</th>'
                    content += '<th>' + a.TenAM + '</th>'
                    content += '<th>' + a.EllevenAM +'</th>'
                    content += '<th>' + a.TwelvePM + '</th>'
                    content += '<th>' + a.OnePM + '</th>'
                    content += '<th>' + a.TwoPM + '</th>'
                    content += '<th>' + a.ThreePM + '</th>'
                    content += '<th>' + a.FourPM + '</th>'
                    content += '<th>' + a.FivePM + '</th>'
                    content += '<th>' + a.SixPM + '</th>'
                content += '</tr>';
            }
    
            response.send(content); // post it to the dynamic page
        }
    })
    
    conn.end();
})

app.get('/admin-availability', (request, response) => {
    let conn = newConnection();
    conn.connect();
    let availList;
    conn.query(`select * from Booking`, (err,rows,fields) => {
        if(err)
            response.send('Error: ' +err)
        else
        {
            availList = rows;
        
            let content =`
            <h2>1 Represents Availability, 0 Represents Lack Thereof\n</h2>
            <table>
                <tr>
                    <th>Name</th>
                    <th>9AM</th>
                    <th>10AM</th>
                    <th>11AM</th>
                    <th>12PM</th>
                    <th>1PM</th>
                    <th>2PM</th>
                    <th>3PM</th>
                    <th>4PM</th>
                    <th>5PM</th>
                    <th>6PM</th>
                </tr>
                `;
            // create table of values from database
            for(a of availList){
                content += '<tr>';
                    content += '<th>' + a.Name + '</th>' //take out the description from that row in list
                    content += '<th>' + a.NineAM + '</th>'
                    content += '<th>' + a.TenAM + '</th>'
                    content += '<th>' + a.EllevenAM +'</th>'
                    content += '<th>' + a.TwelvePM + '</th>'
                    content += '<th>' + a.OnePM + '</th>'
                    content += '<th>' + a.TwoPM + '</th>'
                    content += '<th>' + a.ThreePM + '</th>'
                    content += '<th>' + a.FourPM + '</th>'
                    content += '<th>' + a.FivePM + '</th>'
                    content += '<th>' + a.SixPM + '</th>'
                    content += '</tr>';
                    content += `<tr> 
                                <th>
                                <a href='/update-availability/${a.id}'>Edit</a>  
                                </th>
                                </tr>`

            }
    
            response.send(content); // post it to the dynamic page
        }
    })
    
    conn.end();
})


app.listen(80);