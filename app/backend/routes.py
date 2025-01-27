from flask import Flask, request, session, jsonify
from sqlalchemy import create_engine, text
from models import db, CustomerSetup, SqlServer, UpdateDatetime, Users, CustomerLabels
from sqlalchemy.exc import SQLAlchemyError
from flask import current_app, g
import bcrypt
from flask_cors import CORS
from sqlalchemy.orm import sessionmaker, scoped_session

app = Flask(__name__)
app.config.from_object('config.Config')
app.secret_key = 'your_secret_key'
db.init_app(app)
CORS(app)


def get_db_session():
    if 'sqlserver_id' not in session or 'database' not in session:
        return None

    sqlserver_id = session['sqlserver_id']
    database_name = session['database']

    sql_server = SqlServer.query.get_or_404(sqlserver_id)

    connection_string = (
        f"mssql+pyodbc://{sql_server.ServerAdmin}:{sql_server.ServerPassword}@{sql_server.ServerURL}/{database_name}?"
        "driver=ODBC+Driver+17+for+SQL+Server"
    )
    
    engine = create_engine(connection_string)
    Session = scoped_session(sessionmaker(bind=engine))
    return Session

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Correo y contraseña son requeridos'}), 400

    user = Users.query.filter_by(username=email).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'You have been logged out'}), 200

@app.route('/customers', methods=['GET'])
def get_customers():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authorized'}), 401

    customers = CustomerSetup.query.filter_by(active=True).all()
    customers_list = [{'CustomerSetupId': c.CustomerSetupId, 'CustomerName': c.CustomerName} for c in customers]
    return jsonify(customers_list), 200

@app.route('/select_customer/<int:customer_id>', methods=['POST'])
def select_customer(customer_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Not authorized'}), 401

    customer = CustomerSetup.query.get_or_404(customer_id)
    session['customer_id'] = customer_id
    session['sqlserver_id'] = customer.sqlserverid
    session['database'] = customer.database
    return jsonify({'message': 'Customer selected'}), 200


#desde aca se deben aplicar las solictudes a la base de datos seleccionada por el cliente

## Este endpoint Funciona
@app.route('/get_logo', methods=['GET'])
def get_logo():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authorized'}), 401

    if 'customer_id' not in session:
        return jsonify({'error': 'Customer not selected'}), 400

    db_session = get_db_session()
    if not db_session:
        return jsonify({'error': 'Database connection not established'}), 500

    try:
        with db_session() as connection:
            result = connection.execute(text('SELECT Logo FROM vUpdateDatetime'))
            logo = result.fetchone()

            if logo:
                return jsonify({'logo': logo[0]}), 200
            else:
                return jsonify({'error': 'No logo found'}), 404

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500


## Este endpoint NO FUNCIONA
@app.route('/filtro-dinamico', methods=['GET'])
def filtro_dinamico():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authorized'}), 401

    if 'customer_id' not in session:
        return jsonify({'error': 'Customer not selected'}), 400

    db_session = get_db_session()
    if not db_session:
        return jsonify({'error': 'Database connection not established'}), 500

    try:
        query = db_session.query(CustomerLabels)

        labelKey = request.args.get('labelKey')
        label = request.args.get('label')
        module = request.args.get('module')
        languageId = request.args.get('languageId', type=int)

        conditions = []
        if labelKey:
            conditions.append(CustomerLabels.labelKey.like(f'%{labelKey}%'))
        if label:
            conditions.append(CustomerLabels.label.like(f'%{label}%'))
        if module:
            conditions.append(CustomerLabels.module.like(f'%{module}%'))
        if languageId and languageId != 4:
            conditions.append(CustomerLabels.languageId == languageId)

        if conditions:
            query = query.filter(*conditions)

        resultados = query.all()
        return jsonify([label.to_dict() for label in resultados])

    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500



if __name__ == '__main__':
    app.run(debug=True)
