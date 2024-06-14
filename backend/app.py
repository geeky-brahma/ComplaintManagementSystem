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
    # var = driver("hello")
    # return var

@app.route('/data', methods=["GET","POST"])
def data():
    print("summary endpoint reached...")
    if request.method == "GET":
        return "Hello"
    #     with open("users.json", "r") as f:
    #         data = json.load(f)
    #         data.append({
    #             "username": "user4",
    #             "pets": ["hamster"]
    #         })

    #         return flask.jsonify(data)
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

        # Construct the SQL INSERT statement
        sql = """INSERT INTO complaints (employee_no, employee_name, division_hq, department, website, module, description, reference, status, date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        # Execute the INSERT statement
        try:
            cursor = conn.cursor()
            cursor.execute(sql, (employee_no, employee_name, division_hq, department, website, module, description, reference, status, date))
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


@app.route('/login_users', methods=["POST"])  
def login_users():
    if request.method == "POST":
        json_data = request.get_json()
        name='user'
        id = json_data["id"]
        password = json_data["password"]
        print(id, password)
        data_json = {
            "data": {'name':name, 'id':id}
        }
        return flask.Response(response=json.dumps(data_json), status=201)
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


