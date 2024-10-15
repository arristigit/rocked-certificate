const express = require('express');
const bodyParser = require('body-parser')
const db = require('./db');

const app = express();
const port = 30001;

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());


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
    submitType
  } = req.body;

  if (!certificate_code || !certificate_name || !submitType) {
    return res.status(400).json({error: "Missing required fields"});
  }

  const startDate = new Date(start_date);
  const endDate = new Date(startDate.setMonth(startDate.getMonth() + parseInt(duration)));

  let status = submitType === "publish"? "published":"draft";

  if (status === "published" && new Date() >= startDate && new Date() <= endDate) {
    status = "active";
  }

  // Store into db
  const sql = `INSERT INTO certifications (certificate_code, certificate_name, issuer, overview, start_date, end_date, creation_date, submit_type, status) VALUES (${certificate_code}, ${certificate_name}, ${issuer}, ${overview}, ${startDate}, ${endDate}, ${creation_date}, ${submitType}, ${status})`

  db.query(sql, [certificate_code, certificate_name, issuer, overview, start_date, endDate, creation_date, submitType, status], (err, result) => {
    if (err) {
      return res.status(500).json({error: "Database error", details: err});
    }
    res.status(201).json({message: `Certification ${submitType} successfully`, certificate_code});
  });
  
  /*
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
  */
  
});

// List all certifications
app.get('/listCerfication', (req, res) => {
  const sql = "SELECT * FROM certifications";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({error: "Database error", details: err});
    }
    return res.status(200).json(results);
  })
  // return res.status(200).json(certifications);
})

app.put("/editCertification/:certificate_code", (req, res) => {
  const {certificate_code} = req.params;
  const {
    certificate_name,
    issuer,
    overview,
    start_date,
    duration,
    submitType
  } = req.body
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
