const db = require('../db/db');

module.exports = {
  allUsers: (req, res) => {
    const query = 'SELECT * FROM users';

    db.query(query, '')
      .then((result) => {
        const records = result.rows;
        res.status(200).json({ data: records });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  },

  loginUsers: (req, res) => {
    const { id, password } = req.body;

    const query = 'SELECT * FROM users WHERE employee_id = $1';
    const values = [id];

    db.query(query, values)
      .then((result) => {
        const record = result.rows[0];

        if (!record) {
          res.status(401).json({ error: 'No access' });
        } else if (record.password !== password) {
          res.status(401).json({ error: 'Wrong password' });
        } else {
          const role = record.scope ? 'admin' : 'user';
          res.status(200).json({
            data: {
              name: record.employee_name,
              id: id,
              role: role,
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  },

  registerUsers: (req, res) => {
    const { name, id, password, role } = req.body;
    const scope = role === 'admin';

    const query = `
      INSERT INTO users (employee_id, employee_name, password, scope)
      VALUES ($1, $2, $3, $4)`;
    const values = [id, name, password, scope];

    db.query(query, values)
      .then(() => {
        res.status(201).json({
          data: `User Registered: ${name} with ID ${id}`,
        });
      })
      .catch((error) => {
        console.error('Error inserting data:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      });
  },

  
  dropUser: (req,res) => {
    const { empId } = req.params;
    const query = 'UPDATE users SET dropped = true WHERE employee_id = $1';
    // const query = 'DELETE FROM users WHERE employee_id = $1';
    const values = [empId];
    db.query(query, values)
      .then(() => {
        res.status(200).json({
          data: `User Deleted: ${empId}`,
        }
      )
      console.log('User Deleted', values);
      })
      .catch((error) => {
        console.error('Error deleting data:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      });
  },
  activateUser: (req,res) => {
    const { empId } = req.params;
    const query = 'UPDATE users SET dropped = false WHERE employee_id = $1';
    const values = [empId];
    db.query(query, values)
      .then(() => {
        res.status(200).json({
          data: `User Activated: ${empId}`,
        }
      )
      console.log('User Activated', values);
      })
      .catch((error) => {
        console.error('Error activating data:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      });
  }
};
