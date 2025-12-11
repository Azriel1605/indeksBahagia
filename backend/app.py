from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from config import Config
from model import db, User, RecordSiswaHarianPermission, RecordSiswaMingguanPermission
from flask_mail import Mail, Message
from api import api

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)
mail = Mail(app)
CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=app.config['CORS_SUPPORTS_CREDENTIALS'])

migrate = Migrate(app, db)

# Register blueprints
app.register_blueprint(api, url_prefix='/api')

# Initialize database and create default users
with app.app_context():
    db.create_all()    
    user = db.session.query(User).all()
    if not user:
        admin = User(
            username='key',
            fullname = 'Ahmad Qeis Ismail',
            email='ahmad.qeis122@gmail.com',
            password_hash=bcrypt.generate_password_hash('Ra_sy6a7e2').decode('utf-8'),
            kelas='10',
            role='admin'
        )
        
        surveyStatusHarian = RecordSiswaHarianPermission(
            is_active = True
        )
        surveyStatusMingguan = RecordSiswaMingguanPermission(
            is_active = True
        )
        
        db.session.add(surveyStatusHarian)
        db.session.add(surveyStatusMingguan)
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
