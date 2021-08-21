import os
import time
from datetime import datetime
from flask import Flask
from flask import request
import uuid

from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import UUID

env_loaded = load_dotenv()
print(f'.env file loaded: {env_loaded}')

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

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auth_id = db.Column(db.String(128), unique=True, nullable=False)
    given_name = db.Column(db.String(256))
    family_name = db.Column(db.String(256))
    email = db.Column(db.String(256))
    first_login = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    projects = db.relationship('Projects', backref='user', lazy=True)

    def __repr__(self):
        return f'Name: {self.given_name} {self.family_name} email: {self.email}'

class Projects(db.Model):
    __tablename__ = 'projects'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id =  db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    project_name = db.Column(db.String(256), nullable=False)

    notes = db.relationship('Notes', backref='project', lazy=True)

class Notes(db.Model):

    __tablename__ = 'notes'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id =  db.Column(UUID(as_uuid=True), db.ForeignKey('projects.id'), nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    description = db.Column(db.Text)
    recording_start = db.Column(db.DateTime, nullable=False)
    recording_stop = db.Column(db.DateTime, nullable=False)
    video_location = db.Column(db.String(32))
    transcript_location = db.Column(db.String(32))

    tags = db.relationship('Tags', backref='note', lazy=True)

class Tags(db.Model):

    __tablename__ = 'tags'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    note_id =  db.Column(UUID(as_uuid=True), db.ForeignKey('notes.id'), nullable=False)

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    category = db.Column(db.String(32), nullable=False)
    comment = db.Column(db.Text)
    time = db.Column(db.Float, nullable=False)


@app.route('/api/time')
def get_current_time():
    return {'time': time.time(), "env":os.getenv("POSTGRES_USER")}

@app.route('/api/list_users')
def list_db():
    users = Users.query.all()
    return {'out': '\n'.join([str(user) for user in users])}

def check_keys(data, keys):
    datakeys = data.keys()
    for k in keys:
        if (k not in datakeys) or (len(data[k]) == 0):
            print(f'{k} not found in object {data}! or is empty!')
            return False
    return True

def create_new_user(auth_id, given_name, family_name, email):
    user = Users(auth_id=auth_id, given_name=given_name,
                 family_name=family_name, email=email)
    project = Projects(user=user, project_name="Default")
    db.session.add(user)
    db.session.add(project)
    db.session.commit()
    print("user created!")

def get_default_project_id(user):
    projects = user.projects

    assert len(projects) == 1, "Right now there should be exactly 1 project: default!"

    return projects[0].id

@app.route('/api/opened_dashboard', methods = ['POST'])
def openeed_dashboard():
    if request.method != 'POST':
        print(f'Request method not POST, but {request.method}!!!')
    
    request_data = request.get_json()

    print(request_data)

    user = Users.query.filter_by(auth_id=request_data['sub']).first()

    print(f"user: {user}")

    if user:
        print("User exists!")
    else:
        assert check_keys(request_data, ['sub', 'given_name', 'family_name', 'email'])
        create_new_user(request_data['sub'], request_data['given_name'], request_data['family_name'], request_data['email'])
        
    print(f'Returning: {get_default_project_id(user)}')

    return {'project_id': get_default_project_id(user)}


def _create_new_note(project_id, tap_data, start_time_str, end_time_str):

    project = Projects.query.filter_by(id=project_id).first()

    start_time = datetime.strptime(start_time_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    end_time = datetime.strptime(end_time_str, "%Y-%m-%dT%H:%M:%S.%fZ")

    note = Notes(project=project, recording_start=start_time, recording_stop=end_time)
    db.session.add(note)

    print(f"Collecting tap info for {len(tap_data)} categories")

    tags = []

    for row in tap_data:

        category, tap_times, comments = row['category'], row['tap_times'], row['comments']

        n = len(tap_times)

        assert n == len(comments), \
            f"Tap time length {n} and comment lenght {len(comments)} does not match!"
        
        if n == 0: 
            continue

        for (tap_time, comment) in zip(tap_times, comments):
            print("Adding tap at {tap_time} with comment {comment}")

            tap_ts = datetime.strptime(tap_time, "%Y-%m-%dT%H:%M:%S.%fZ")

            tap_time = (tap_ts - start_time).total_seconds()

            print(f"Tap at {tap_time}")

            db.session.add(Tags(note=note, category=category, time=tap_time, comment=comment))
            print('Tap added')

    db.session.commit()


@app.route('/api/create_new_note', methods = ['POST'])
def create_new_note():
    if request.method != 'POST':
        print(f'Request method not POST, but {request.method}!!!')
    
    request_data = request.get_json()

    assert check_keys(request_data, ['project_id', 'start_time', 'end_time', 'data'])

    print(request_data)

    _create_new_note(request_data['project_id'], request_data['data'], request_data['start_time'], request_data['end_time'])

    return {'text': 'Note successfully created!'}
