import json
from flask import Flask, request
import flask
from flask_cors import CORS
import psycopg2 as pg
def create_db():
    # Connect to default db 
    conn = pg.connect("host=127.0.0.1 dbname=postgres user=postgres password=lipuni123")
    conn.set_session(autocommit=True)
    cur = conn.cursor()
    
       
    return cur, conn

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
@app.route("/")
def hello():
    return "Hello, World!"
    
# Route to Register Complaint
@app.route('/data', methods=["POST"])
def data():
    if request.method == "POST":
        json_data = request.get_json()
        print(f"received data: {json_data}")
        cursor, conn = create_db()
        employee_no = json_data["employeeNo"]
        employee_name = json_data["employeeName"]
        division_hq = json_data["divisionHQ"]
        department = json_data["department"]
        website = json_data["website"]
        module = json_data["module"]
        description = json_data["description"]
        reference = json_data["reference"]
        date= json_data['date']
        status = json_data["status"]
        currently_with = json_data["currently_with"]

        # Construct the SQL INSERT statement
        sql = """INSERT INTO complaints (employee_no, employee_name, division_hq, department, website, module, description, reference, status, date, currently_with)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        # Execute the INSERT statement
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (employee_no, employee_name, division_hq, department, website, module, description, reference, status, date, currently_with))
            conn.commit()
            print("Data inserted successfully")
        except (Exception, pg.DatabaseError) as error:
            print("Error inserting data:", error)
            conn.rollback()
        finally:
            if conn is not None:
                cursor.execute("SELECT MAX(id) FROM complaints")
                last_id = cursor.fetchone()[0]
                conn.close()
        return_data = {
            "status": "success",
            "summary": "data received",
            "Complaint ID":last_id
        }
        
        return flask.Response(response=json.dumps(return_data), status=201)

# Route to check Complaint Status
@app.route('/status', methods=["POST"])
def status():
    if request.method == "POST":
        json_data = request.get_json()
        print(f"received data: {json_data}")
        IDType = json_data["IDType"]
        ID = str(json_data["ID"])
        cursor, conn = create_db()
        if IDType == 'id':
            query = "SELECT * FROM complaints WHERE id = %s"
            cursor.execute(query, (int(ID),))
        else:
            query = "SELECT * FROM complaints WHERE employee_no = %s"
            cursor.execute(query, (ID,))
        records = cursor.fetchall()
        print(records)

        # Print the fetched records
        for record in records:
            print(record)
        
        return_data = {
            "status": "success",
            "summary": "data received",
            "data": records
        }
        
        return flask.Response(response=json.dumps(return_data), status=201)

# Accessed by admin to see all complaints
@app.route('/all_complaints', methods=["GET"])  
def all_complaints():
    cursor, conn = create_db()
    query = "SELECT * FROM complaints order by id desc"
    cursor.execute(query)
    records = cursor.fetchall()
    print(records)
    data_json = {
        "data": records
    }
    return flask.Response(response=json.dumps(data_json), status=200)

# Login Users
@app.route('/login_users', methods=["POST"])  
def login_users():
    if request.method == "POST":
        json_data = request.get_json()
        id = json_data["id"]
        password = json_data["password"]
        cursor, conn = create_db()
        # try:
        query = "SELECT * FROM users WHERE employee_id = '1111'"
        cursor.execute(query, id)
        record = cursor.fetchone()
        if (record[0]==id):
            if (record[2]==password):
                if (record[3]):
                    role = 'admin'
                else:
                    role = 'user'
                print(id, password)
                data_json = {
                    "data": {
                        'name': record[1], 
                        'id': id,
                        'role': role
                        }
                }
            else:
                data_json = {
                    "data": { 
                        'alert': "Wrong Password" 
                        }
                }
        else:
            data_json = {
                    "data": { 
                        'alert': "No Access!!" 
                        }
                }
        return flask.Response(response=json.dumps(data_json), status=201)

# Register new User
@app.route('/register_users', methods=["POST"])  
def register_users():
    if request.method == "POST":
        json_data = request.get_json()
        
        name = json_data["name"]
        id = json_data["id"]
        password = json_data["password"]
        print(id, password)
        data_json = {
            "data": {'name':name, 'id':id}
        }
        return flask.Response(response=json.dumps(data_json), status=201)

# Close or forward a complaint
@app.route('/close_forward', methods=["POST"])  
def close_forward():
    if request.method == 'POST':
        json_data = request.get_json()
        cursor, conn = create_db()
        # status = json_data['status'] if json_data['status'] else None
        if('status' in json_data):
            id = json_data['id']
            remark= json_data['remarks']
            query = f"UPDATE complaints SET status = 'Closed', remarks='{remark}' WHERE id = {id}"
            cursor.execute(query)
            data_json = {
                "data": 'Closed'
            }
            return flask.Response(response=json.dumps(data_json), status=201)
        else:
            id = json_data['id']
            forwarded_to= json_data['forwarded_to']
            remark= json_data['remarks']
            date= json_data['date']
            try:
                # Update the complaints table
                query1 = """
                UPDATE complaints 
                SET currently_with = %s, remarks = %s 
                WHERE id = %s
                """
                cursor.execute(query1, (forwarded_to, remark, id))
                
                # Update the transactions table
                query2 = """
                    INSERT INTO transactions (fwd_from, fwd_to, remarks, date, complaint_id) 
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(query2, ('admin', forwarded_to, remark, date, id))
                
                # Commit the changes
                conn.commit()
                
                # Prepare the response
                data_json = {
                    "data": f'Forward to: {forwarded_to}'
                }
                return flask.Response(response=json.dumps(data_json), status=201, mimetype='application/json')
            
            except Exception as e:
                # Rollback the changes if an error occurs
                conn.rollback()
                return flask.Response(response=json.dumps({"error": str(e)}), status=500, mimetype='application/json')
            
            finally:
                # Close the cursor and connection
                cursor.close()
                conn.close()


@app.route('/complaint_details', methods=["POST"])
def complaint_details():
    if request.method == "POST":
        json_data = request.get_json()
        print(f"received data: {json_data}")
        IDType = json_data["IDType"]
        ID = str(json_data["ID"])
        cursor, conn = create_db()

        query = "SELECT * FROM complaints WHERE id = %s"
        cursor.execute(query, (int(ID),))
        record1 = cursor.fetchall()
        print(record1)

        query = "SELECT * FROM transactions WHERE complaint_id = %s ORDER by serial_id DESC"
        cursor.execute(query, (int(ID),))
        record2 = cursor.fetchall()
        print(record2)
        
        return_data = {
            "status": "success",
            "summary": "data received",
            "data": [record1, record2]
        }
        
        return flask.Response(response=json.dumps(return_data), status=201)