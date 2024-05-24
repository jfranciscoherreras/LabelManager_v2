from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class CustomerSetup(db.Model):
    __tablename__ = 'Customersetups'
    CustomerSetupId = db.Column(db.Integer, primary_key=True)
    CustomerName = db.Column(db.String(255), nullable=False)
    database = db.Column(db.String(255), nullable=False)
    sqlserverid = db.Column(db.Integer, nullable=False)
    active = db.Column(db.Boolean, default=True)

class SqlServer(db.Model):
    __tablename__ = 'SqlServers'
    id = db.Column(db.Integer, primary_key=True)
    ServerURL = db.Column(db.String(255), nullable=False)
    ServerAdmin = db.Column(db.String(255), nullable=False)
    ServerPassword = db.Column(db.String(255), nullable=False)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class UpdateDatetime(db.Model):
    __tablename__ = 'vUpdateDatetime'
    id = db.Column(db.Integer, primary_key=True)
    Logo = db.Column(db.String)


class CustomerLabels(db.Model):
    __tablename__ = 'customerlabels'

    id = db.Column(db.Integer, primary_key=True)
    label_key = db.Column(db.String(255), nullable=False)
    label = db.Column(db.String(255), nullable=False)
    module = db.Column(db.String(255), nullable=False)
    language_id = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'label_key': self.label_key,
            'label': self.label,
            'module': self.module,
            'language_id': self.language_id
        }