const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const router = express.Router()
const port = 30001;

// Middleware to parse JSON bodies
app.use(express.json());
// app.use(bodyParser.json());

let certifications = [];

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Sample API endpoint: GET /api/items
app.get('/api/items', (req, res) => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    res.json(items)
});

app.get('/api/user', (req, res) => {
  res.send('OK');
});

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
    message: "Cerfication ${sumbitType} created successfully",
    cerfication: newCertification 
  });
  // return res.send(req.body)
});

app.get('/listCerfication', (req, res) => {
  return res.status(200).json(certifications);
})


/*
// always invoked
router.use((req, res, next) => {
  res.send('Hello World')
})

app.use('/foo', router)
// app.use(router)
*/

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
