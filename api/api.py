import os
import time
from datetime import datetime
from flask import Flask
from flask import request
import uuid
import requests
import json

from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.dialects.postgresql import UUID

import boto3
from botocore.config import Config


env_loaded = load_dotenv()
print(f'.env file loaded: {env_loaded}')

my_config = Config(
    region_name = 'eu-west-2',
    signature_version = 's3v4',
    retries = {
        'max_attempts': 10,
    },
    s3={'addressing_style': 'path'},
)

VIDEO_BUCKET = 'pronk-videos'
TRANSCRIPT_BUCKET = 'pronk-transcripts'

s3_client = boto3.client('s3',config=my_config,
                         aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                         aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

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
    video_location = db.Column(db.String(50))

    # 0 - not done
    # 1 - in progress
    # 2 - done
    transcription_status = db.Column(db.Integer, default=0)

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

    return {'status': 'Note successfully created!'}



@app.route('/api/get_notes/<project_id>', methods = ['GET'])
def get_notes(project_id):
    
    project = Projects.query.filter_by(id=project_id).first()

    print(f"returning notes for {project}")

    if not project:
        return {'status': 'Did not recognize project ID', 'note_list':[]}

    notes = project.notes

    out = []

    for i, note in enumerate(notes):
        _temp = {'id': i, 'title': "TODO"}
        _temp['description'] = note.description
        _temp['note_id'] = note.id
        _temp['subtitle'] = note.recording_start.strftime("%Y / %m / %d")

        out.append(_temp)
    
    print(f'returning {out}')

    return {'status': 'Success', 'note_list': out}


def generate_presigned_url(object_name, bucket=VIDEO_BUCKET):
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket, 'Key': object_name},
        ExpiresIn=604800,
        HttpMethod=None
    )
    return url

def job_exists(job_name, transcription_client):
      
    # all the transcriptions
    existed_jobs = transcription_client.list_transcription_jobs()

    for job in existed_jobs['TranscriptionJobSummaries']:
        if job_name == job['TranscriptionJobName']:
            return True
    return False

def upload_transcript(note, transcript):

    assert note.video_location != ""

    fname = (note.video_location).split('.')[0] + ".json"

    s3_client.put_object(
     Body=json.dumps(transcript),
     Bucket=TRANSCRIPT_BUCKET,
     Key=fname
    )

    print(f'Successfully uploaded transcript to S3 at {fname}')

    note.transcription_status = 2
    db.session.add(note)
    db.session.commit()

    return True


def transcribe_video(note, max_iter=60):

    video_uri = note.video_location

    input_uri = os.path.join('s3://', VIDEO_BUCKET, video_uri) # your S3 access link

    print(f'video input: {input_uri}')

    job_name = (video_uri.split('.')[0]).replace(" ", "")

    # file format
    file_format = video_uri.split('.')[1]

    assert note.transcription_status == 0, f"Transcription status is {note.transcription_status}!"

    # Update to in-progress
    note.transcription_status = 1
    db.session.add(note)
    db.session.commit()

    transcribe = boto3.client('transcribe',
                            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                            region_name = 'eu-west-2')

    assert not job_exists(job_name, transcribe)

    start = time.time()
    result = transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': input_uri},
        MediaFormat=file_format,
        LanguageCode='en-US',
        Settings = {'ShowSpeakerLabels': True, 'MaxSpeakerLabels': 8}
    )

    for i in range(max_iter):
        if result['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            print(f"Transcription took {time.time() - start} seconds")
            break
        time.sleep(15)
        if i == max_iter -1:
            print(f"Still no transcription result after {max_iter} iterations. Raising error!")
            assert False
        result = transcribe.get_transcription_job(TranscriptionJobName=job_name)

    out = requests.get(result['TranscriptionJob']['Transcript']['TranscriptFileUri']).json()
    assert out['status'] == "COMPLETED"

    return upload_transcript(note, out)


def process_video(file, note_id):

    fname = str(uuid.uuid4()) + ".mp4"
    file.save(fname)

    note = Notes.query.filter_by(id=note_id).first()

    s3_client.upload_file(fname, VIDEO_BUCKET, fname)

    note.video_location = fname
    db.session.commit()

    success = transcribe_video(note)

    print("Successfully finished all phases of transcription!")

    return True

@app.route('/api/upload', methods = ['POST'])
def upload_file():
    ##file = request.files['file']
    print(request)
    print(request.files)
    #check_keys(request.files, ['file', 'note_id'])

    #import pdb; pdb.set_trace();
    print(f"note id: {request.form['note_id']}")
    process_video(request.files["file"], request.form['note_id'])

    return {'status':'Sucess'}

@app.route('/api/get_video_url/<note_id>', methods = ['GET'])
def get_video_url(note_id):

    print(f"getting video url for {note_id}")
    note = Notes.query.filter_by(id=note_id).first()

    if (note.video_location is None) or (note.video_location == ""):
        print(f"No video avaiable for {note.id}")
        return {'status': "No video uploaded", 'url': ''}

    url = generate_presigned_url(note.video_location)

    print(f'Video for {note.id} at url: {url}')

    return {'status': "Success", 'url': url}


def start_times(transcript_results):
    '''
    Starting time to speaker mapping for all non-punctuation items.
    '''
    labels = transcript_results['results']['speaker_labels']['segments']
    speaker_start_times={}

    for label in labels:
        for item in label['items']:
            speaker_start_times[item['start_time']] = item['speaker_label']
    return speaker_start_times

def get_lines(transcript_results, speaker_start_times=None):
    '''
    from https://github.com/viethoangtranduong/AWS-Transcribe-Tutorial/blob/master/AWS_Transcribe_Tutorial.ipynb
    '''

    assert transcript_results['status'] == "COMPLETED"

    if not speaker_start_times:
        speaker_start_times = start_times(transcript_results)

    items = transcript_results['results']['items']
    lines = []
    line = ''
    time = 0
    speaker = None 

    # loop through all elements
    for item in items:
        content = item['alternatives'][0]['content']

        # if it's starting time
        if item.get('start_time'):
            current_speaker = speaker_start_times[item['start_time']]

        # in AWS output, there are types as punctuation
        elif item['type'] == 'punctuation':
            line = line + content

        # handle different speaker
        if current_speaker != speaker:
            if speaker:
                lines.append({'speaker':speaker, 'line':line, 'time':time})
            line = content
            speaker = current_speaker
            time = item['start_time']

        elif item['type'] != 'punctuation':
            line = line + ' ' + content

    lines.append({'speaker': speaker, 'line': line,'time': time})
    sorted_lines = sorted(lines,key=lambda k: float(k['time']))

    return sorted_lines

def get_tag(transcript_results, time, prev_time=None, speaker_start_times=None, max_snippet_lenght=20):
    '''
    modified version of get_lines.
    '''
    
    assert transcript_results['status'] == "COMPLETED"
    
    if not speaker_start_times:
        speaker_start_times = start_times(transcript_results)

    items = transcript_results['results']['items']
    line = ''
    time_start = ''
    speaker = None 
    current_speaker = ''
    
    if speaker_start_times and (float(list(speaker_start_times.keys())[-1]) < time):
        return '', ''

    # loop through all elements
    for item in items:
        content = item['alternatives'][0]['content']

        # if it's starting time
        if item.get('start_time'):
            start_time = float(item['start_time'])
            if prev_time and (start_time < prev_time):
                continue
            elif start_time < time - max_snippet_lenght:
                continue
            elif start_time > time:
                break
            current_speaker = speaker_start_times[item['start_time']]

        # in AWS output, there are types as punctuation
        elif item['type'] == 'punctuation':
            line = line + content

        # handle different speaker
        if current_speaker != speaker:
            line = content
            speaker = current_speaker
            if item['type'] != 'punctuation':
                time_start = item['start_time']

        elif item['type'] != 'punctuation':
            line = line + ' ' + content

    return line, time_start, current_speaker

def transcription_output(transcript_uri):

    try:
        data_in_bytes = s3_client.get_object(Bucket=TRANSCRIPT_BUCKET, Key=transcript_uri)['Body'].read()
    except Exception as err:
        print("encountered error. TODO handle error")
        print(err)
        assert False
    decoded_data = data_in_bytes.decode('utf-8')

    return json.loads(decoded_data)

def get_tag_snippets(note, transcript, speaker_start_times = None):
    out = []
    prev_time = None
    for tag in note.tags:
        line, time_start, speaker = get_tag(transcript, tag.time, prev_time, speaker_start_times)
        out.append({"line": line, "time": time, "speaker": speaker, "category": tag.category, "comment": tag.comment})
        prev_time = tag.time
    print(f"Returning these tag snippets: {out}")
    return out


@app.route('/api/transcription/<note_id>', methods = ['GET'])
def transcription(note_id):

    print(f"getting transcription status for {note_id}")
    note = Notes.query.filter_by(id=note_id).first()

    status = "Not started"
    lines = []
    tags = []

    if (note.transcription_status == 1):
        status = "Incomplete"
    elif (note.transcription_status == 2):
        status = "Completed"
        transc_out = transcription_output(note.video_location)
        speaker_start_times = start_times(transc_out)
        lines = get_lines(transc_out, speaker_start_times)
        tags = get_tag_snippets(note, transc_out, speaker_start_times)

    return {'status': status, "lines": lines, "tags": tags}
