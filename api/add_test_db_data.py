'''
Add test data to database
'''

from datetime import datetime

from api import db

from api import Users, Projects, Notes, Tags


user1 = Users(auth_id = 'asdfasdfasdfas', given_name='Test', family_name='test', email='asdfasf@test.com')
user2 = Users(auth_id = 'asdf2d34343434', given_name='Test2', family_name='test2', email='asdfasf2@test.com')

project1 = Projects(user=user1, project_name="Default")
project2 = Projects(user=user2, project_name="Default")

notes1 = Notes(project = project1, description='asdfhhjhasdf', recording_start=datetime.now(),
               recording_stop= datetime.now())

tags1 = Tags(note=notes1, category='Positive', comment='', time=5.51)
tags2 = Tags(note=notes1, category='Negative', comment='asdfsaf', time=15.51)
tags3 = Tags(note=notes1, category='Positive', comment='', time=25.51)

print('objects created!')

db.session.add(user1)
db.session.add(user2)
db.session.add(project1)
db.session.add(project2)
db.session.add(notes1)
db.session.add(tags1)
db.session.add(tags2)
db.session.add(tags3)

db.session.commit()

print("Example data added to database!")
