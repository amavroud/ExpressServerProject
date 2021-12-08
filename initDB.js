const mysql = require('mysql');

let conn = mysql.createConnection({
    host:'104.198.254.59',
    user: 'root',
    password: 'mypassword',
    database:'userDB'
});

conn.connect();


conn.query('Drop Table Booking', // delete existing table
                (err,rows,fields) => {
                    if(err)
                        console.log(err);
                    else   
                        console.log('Table Dropped');
                }
            )

// rows of a submission id, name for times, and 1 or 0 for y/n booking for set times
conn.query(`CREATE TABLE Booking (id INT AUTO_INCREMENT PRIMARY KEY, Name VARCHAR(255), 
            NineAM tinyint,
            TenAM tinyint,
            EllevenAM tinyint,
            TwelvePM tinyint,
            OnePM tinyint,
            TwoPM tinyint,
            ThreePM tinyint,
            FourPM tinyint, 
            FivePM tinyint,
            SixPM tinyint
            )`
            , (err,rows,fields) => {
            if(err)
                console.log(err);
            else   
                console.log('Table Created'); // we created new table above
})

//used to dictate what times can be booked out or not


//insert our first entry
conn.query(`insert into Booking (Name, 
                NineAM, 
                TenAM,
                EllevenAM,
                TwelvePM,
                OnePM,
                TwoPM,
                ThreePM,
                FourPM,
                FivePM,
                SixPM) values ("andy",
                "1","1","1","1","1","1","1","1","1","1")`
                , (err,rows,fields) => {
                if(err)
                    console.log(err);
                else   
                    console.log('One Row Inserted');
            })

// test if table works by print
conn.query('select * from Booking '
            , (err,rows,fields) => {
            if(err)
                console.log(err);
            else   
                console.log('One Row Inserted');
            for(r of rows)
                console.log(r);
        })

conn.end();