// src/controllers/complaintsController.js

const db = require('../db/db');
const multer = require('multer');
const path = require('path');
const { report } = require('process');

const UPLOAD_FOLDER = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16 MB

const allowedFileTypes = new Set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.employeeNo}-${req.body.date}${ext}`);
    // cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.has(ext.substring(1))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
}).single('reference');

// Controller functions
module.exports = {
  data: (req, res) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error' });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      let {
        employeeNo,
        employeeName,
        divisionHQ,
        department,
        website,
        module,
        description,
        date,
        status,
        currentlyWith,
      } = req.body;

      const reference = req.file ? req.file.filename : null;
      date = new Date(date).toISOString().split('T')[0];
      const sql = `
        INSERT INTO complaints 
          (employee_no, employee_name, division_hq, department, website, module, description, reference, status, date, currently_with)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id`;

      const values = [
        employeeNo,
        employeeName,
        divisionHQ,
        department,
        website,
        module,
        description,
        reference,
        status,
        date,
        currentlyWith,
      ];

      db.query(sql, values)
        .then((result) => {
          const complaintId = result.rows[0].id;
          res.status(201).json({
            status: 'success',
            summary: 'Data received',
            complaintId: complaintId,
          });
        })
        .catch((error) => {
          console.error('Error inserting data:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    });
  },

  department: (req, res) => {
    query = `
    SELECT * FROM DEPARTMENT
    `
    params=''
    db.query(query, params)  // Pass correct params array based on query
      .then((result) => {
        const records = result.rows;
        // console.log(records)
        res.status(200).json({ data: records });
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Logging the error to console
        res.status(500).json({ error: 'Internal server error' });
      });
  },

  status: (req, res) => {
    const { IDType, ID } = req.body;

    let query, params;
    if (IDType === 'id') {
      query = 'SELECT * FROM complaints WHERE id = $1';
      params = [ID];
    } else {
      query = 'SELECT * FROM complaints WHERE employee_no = $1';
      params = [ID];
    }

    db.query(query, params)
      .then((result) => {
        const records = result.rows;
        res.status(200).json({
          status: 'success',
          summary: 'Data received',
          data: records,
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  },

  allComplaints: (req, res) => {
    const { role, id, name } = req.query;

    let query;
    let params = [];  // Initialize an empty array for parameters

    if (role === 'user') {
      query = `
            SELECT * FROM complaints 
            WHERE currently_with = (SELECT employee_name FROM users WHERE employee_id = $1)
            ORDER BY id DESC`;
      params = [id];  // Assign parameters based on condition
    } else {
      query = 'SELECT * FROM complaints ORDER BY id DESC';
    }

    db.query(query, params)  // Pass correct params array based on query
      .then((result) => {
        const records = result.rows;
        res.status(200).json({ data: records });
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Logging the error to console
        res.status(500).json({ error: 'Internal server error' });
      });
  },


  closeForward: (req, res) => {
    let { id, forwardedFrom, forwardedTo, remarks, date, time, now } = req.body;
    // convert date and time to postgres format
    // date = new Date(now).toISOString().split('T')[0];
    // time = now.toLocaleTimeString('en-GB');
    if (req.body.status) {
      const query = `UPDATE complaints SET status = 'Closed', remarks = $1 WHERE id = $2`;
      const values = [remarks, id];

      db.query(query, values)
        .then(() => {
          res.status(201).json({ data: 'Closed' });
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    } else {
      const query1 = `
        UPDATE complaints 
        SET currently_with = $1, remarks = $2 
        WHERE id = $3`;
      const values1 = [forwardedTo, remarks, id];

      const query2 = `
        INSERT INTO transactions (fwd_from, fwd_to, remarks, date, complaint_id, time) 
        VALUES ($1, $2, $3, $4, $5, $6)`;
      const values2 = [forwardedFrom, forwardedTo, remarks, date, id, time];

      db.query(query1, values1)
        .then(() => db.query(query2, values2))
        .then(() => {
          res.status(201).json({ data: `Forwarded to: ${forwardedTo}` });
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          res.status(500).json({ error: `Internal server error ${error}` });
        });
    }
  },

  complaintDetails: (req, res) => {
    const { IDType, ID } = req.body;

    const query1 = 'SELECT * FROM complaints WHERE id = $1';
    const query2 = 'SELECT * FROM transactions WHERE complaint_id = $1 ORDER BY serial_id DESC';
    const values = [ID];

    db.query(query1, values)
      .then((result1) => {
        const record1 = result1.rows;

        db.query(query2, values)
          .then((result2) => {
            const record2 = result2.rows;
            res.status(200).json({
              status: 'success',
              summary: 'Data received',
              data: [record1, record2],
            });
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  },

  sent: (req, res) => {
    const { role, id, name } = req.query;

    const query = `SELECT * FROM complaints WHERE id IN (SELECT complaint_id FROM transactions WHERE fwd_from = $1)`;
    const values = [name];

    db.query(query, values)
      .then((result) => {
        const records = result.rows;
        res.status(200).json({ data: records });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  },

  referenceDoc: (req, res) => {
    const { id } = req.query;
    let query = `SELECT REFERENCE FROM COMPLAINTS WHERE ID = $1`
    let params = [id]
    db.query(query, params)
      .then((results) => {
        record = results.rows[0];
        console.log(record);
        fileName = record.reference
        console.log(fileName)
        const filePath = path.join(__dirname, '../../uploads', fileName);
        // res.status(200).json({ data: record });
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Internal server error' });
          }
        });

      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Logging the error to console
        res.status(500).json({ error: 'Internal server error' });
      })
  },

  report: (req, res) => {
    let { startDate, endDate, status } = req.query;
    startDate = new Date(startDate).toISOString().split('T')[0];
    endDate = new Date(endDate).toISOString().split('T')[0];
    let query = `
      SELECT *, count(*) as total_complaints, sum(case when status = 'Closed' then 1 else 0 end) as closed_complaints, sum(case when status = 'Under Process' then 1 else 0 end) as under_process_complaints
      FROM complaints 
      WHERE date >= $1 AND date <= $2`;
    
    const values = [startDate, endDate];

    if (status) {
      query += ` AND status = $3`;
      values.push(status);
    }

    query += `
      GROUP BY id
      ORDER BY date DESC`;
    // const values = [startDate, endDate, status];

    db.query(query, values)
      .then((result) => {
        const records = result.rows;
        console.log(records)
        res.status(200).json({ data: records });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  },
};
