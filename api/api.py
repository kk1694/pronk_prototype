import os
import time
from datetime import datetime
from flask import Flask
import uuid

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from noki_backend.guid import GUID

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f'postgresql+psycopg2://{os.getenv("POSTGRES_USER")}:' +
    f'{os.getenv("POSTGRES_PW")}@{os.getenv("POSTGRES_URL")}/{os.getenv("POSTGRES_DB")}'
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Users(db.Model):
    __tablename__ = 'users'

    id = db.Column(GUID, primary_key=True, default=uuid.UUID)
    auth_id = db.Column(db.String(128), unique=True, nullable=False)
    given_name = db.Column(db.String(256))
    family_name = db.Column(db.String(256))
    email = db.Column(db.String(256))
    first_login = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    users = db.relationship('Projects', backref='user_id', lazy=True)

    def __repr__(self):
        return f'Name: {self.given_name} {self.family_name} email: {self.email}'


class Projects(db.Model):
    __tablename__ = 'projects'

    id = db.Column(GUID, primary_key=True, default=uuid.UUID)
    user_id =  db.Column(GUID, db.ForeignKey('users.id'), nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    project_name = db.Column(db.String(256), nullable=False)

    projects = db.relationship('Notes', backref='project_id', lazy=True)


class Notes(db.Model):

    __tablename__ = 'notes'

    id = db.Column(GUID, primary_key=True, default=uuid.UUID)
    project_id =  db.Column(GUID, db.ForeignKey('projects.id'), nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    description = db.Column(db.Text)
    recording_start = db.Column(db.DateTime, nullable=False)
    recording_stop = db.Column(db.DateTime, nullable=False)
    video_location = db.Column(db.String(32))
    transcript_location = db.Column(db.String(32))

    notes = db.relationship('Tags', backref='note_id', lazy=True)


class Tags(db.Model):

    __tablename__ = 'tags'

    id = db.Column(GUID, primary_key=True, default=uuid.UUID)
    note_id =  db.Column(GUID, db.ForeignKey('notes.id'), nullable=False)


    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    category = db.Column(db.String(32), nullable=False)
    comment = db.Column(db.Text)
    time = db.Column(db.Float, nullable=False)














@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/api/list_users')
def list_db():
    users = User.query.all()
    return {'out': '\n'.join([str(user) for user in users])}
