const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express();
const port = 30001;

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'rocked'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

// connection.end()




let certifications = [];

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Create certification
app.post('/createCertification', (req, res) => {
  const {
    certificate_code,
    certificate_name,
    issuer,
    overview,
    start_date,
    duration,
    creation_date,
    sumbitType
  } = req.body;

  if (!certificate_code || !certificate_name || !sumbitType) {
    return res.status(400).json({error: "Missing required fields"});
  }

  const startDate = new Date(start_date);
  const endDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(duration)));

  let status = sumbitType === "publish"? "published":"draft";

  if (status === "published" && new Date() >= startDate && new Date() <= endDate) {
    status = "active";
  }

  const newCertification = {
    certificate_code,
    certificate_name,
    issuer,
    overview,
    start_date,
    end_date: endDate,
    creation_date,
    sumbitType,
    status
  }

  certifications.push(newCertification);

  return res.status(201).json({
    message: `Certification ${sumbitType} created successfully`,
    certification: newCertification 
  });
});

// List all certifications
app.get('/listCerfication', (req, res) => {
  return res.status(200).json(certifications);
})


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
