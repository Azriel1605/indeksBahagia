from app import app, db
from model import RecordSiswaHarianPermission, RecordSiswaMingguanPermission
from datetime import datetime

app.app_context().push()

today = datetime.today().weekday()

if today in [0, 1, 2, 3]:
    RecordSiswaHarianPermission.query.update({"is_active":True})
else:
    RecordSiswaHarianPermission.query.update({"is_active":False})
    
if today == 4:
    RecordSiswaMingguanPermission.query.update({"is_active":True})
else:
    RecordSiswaMingguanPermission.query.update({"is_active":False})
    
db.session.commit()

