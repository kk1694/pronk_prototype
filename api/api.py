import os
import time
from flask import Flask

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f'postgresql+psycopg2://{os.getenv("POSTGRES_USER")}:' +
    f'{os.getenv("POSTGRES_PW")}@{os.getenv("POSTGRES_URL")}/{os.getenv("POSTGRES_DB")}'
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.String(63), primary_key=True)
    given_name = db.Column(db.String(255))
    family_name = db.Column(db.String(255))
    email = db.Column(db.String(255))

    def __init__(self, id:str, given_name: str, family_name: str, email: str):
        self.id = id
        self.given_name = given_name
        self.family_name = last_name
        self.email = email

    def __repr__(self):
        return f'Name: {self.given_name} {self.family_name} email: {self.email}'

@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/list_users')
def list_db():
    users = User.query.all()
    return {'out': '\n'.join([str(user) for user in users])}
