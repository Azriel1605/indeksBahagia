from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, date, timedelta
from sqlalchemy import String, func, extract, cast, Integer, case
from sqlalchemy.dialects.postgresql import ARRAY

db = SQLAlchemy()

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    fullname = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='guest')
    kode = db.Column(db.String(50), unique=True, nullable=True)
    kelas = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    
    # RelationShip
    harian = db.relationship('RecordSiswaHarian', backref='users', uselist=False, cascade='all, delete-orphan')
    notes_created = db.relationship(
        'Note',
        foreign_keys='Note.creator_id',
        back_populates='creator',
        cascade='all, delete-orphan'
    )

    notes_received = db.relationship(
        'Note',
        foreign_keys='Note.target_id',
        back_populates='target',
        cascade='all, delete-orphan'
    )
    
    def has_filled_survey(self, tipe: str = "harian") -> bool:
        """Cek apakah user sudah mengisi survey berdasarkan tipe ('harian' / 'mingguan')."""
        today = date.today()

        if tipe == "harian":
            record = RecordSiswaHarian.query.filter(
                RecordSiswaHarian.user_id == self.id,
                func.date(RecordSiswaHarian.date) == today
            ).first()
        elif tipe == "mingguan":
            start_of_week = today - timedelta(days=today.weekday())  # Senin
            end_of_week = start_of_week + timedelta(days=6)
            record = RecordSiswaMingguan.query.filter(
                RecordSiswaMingguan.user_id == self.id,
                func.date(RecordSiswaMingguan.date).between(start_of_week, end_of_week)
            ).first()
        else:
            raise ValueError("Tipe survey tidak valid. Gunakan 'harian' atau 'mingguan'.")

        return record is not None
    
    def can_fill_survey(self, tipe: str = "harian"):
        print(tipe)
        """Cek apakah user boleh mengisi survey harian/mingguan."""

        if tipe == "harian":
            permission = RecordSiswaHarianPermission.query.first()
        
        elif tipe == "mingguan":
            permission = RecordSiswaMingguanPermission.query.first()
        
        else:
            raise ValueError("Tipe survey tidak valid. Gunakan 'harian' atau 'mingguan'.")

        if not permission or not permission.is_active:
            return False, f"Kelas kamu belum diizinkan mengisi survey {tipe}."

        if self.has_filled_survey(tipe):
            return False, f"Kamu sudah mengisi survey {tipe}."

        return True, f"Kamu boleh mengisi survey {tipe}."

class RecordSiswaHarianPermission(db.Model):
    __tablename__   = 'record_siswa_harian_permission'
    id              = db.Column(db.Integer, primary_key=True)
    is_active       = db.Column(db.Boolean, nullable=False, default="False")
    
class RecordSiswaHarian(db.Model):
    __tablename__ = 'record_siswa_harian'
    id              = db.Column(db.Integer, primary_key=True)
    # Relationship
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    date            = db.Column(db.DateTime, default=datetime.now)
    bahagia         = db.Column(db.Integer, nullable=False)
    semangat        = db.Column(db.Integer, nullable=False)
    fokus           = db.Column(db.Integer, nullable=False)
    bertenaga       = db.Column(db.Integer, nullable=False)
    stress          = db.Column(db.Integer, nullable=False)
    dukungan_teman  = db.Column(db.Integer, nullable=False)
    dukungan_guru   = db.Column(db.Integer, nullable=False)
    aman            = db.Column(db.Integer, nullable=False)
    rasakan         = db.Column(db.String, nullable=True)
    
    skor           = db.Column(db.Float, nullable=False)
    
    __tableargs__ = db.UniqueConstraint('usre_id', 'date', name='unique_user_tanggal')
    
    def calculate_score(self):
        self.skor = (((
            (self.bahagia or 0) +
            (self.semangat or 0) +
            (self.fokus or 0) +
            (self.bertenaga or 0) +
            (6 - (self.stress or 0)) +
            (self.dukungan_teman or 0) +
            (self.dukungan_guru or 0) +
            (self.aman or 0)
        ) / 8 ) - 1) * 25
        return self.skor
    
class RecordSiswaMingguanPermission(db.Model):
    __tablename__   = 'record_siswa_mingguan_permission'
    id              = db.Column(db.Integer, primary_key=True)
    is_active       = db.Column(db.Boolean, nullable=False, default="False")
    
class RecordSiswaMingguan(db.Model):
    __tablename__ = 'record_siswa_mingguan'
    id              = db.Column(db.Integer, primary_key=True)
    # Relationship
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    date            = db.Column(db.DateTime, default=datetime.now)
    bahagia         = db.Column(db.Integer, nullable=False)
    semangat        = db.Column(db.Integer, nullable=False)
    beban           = db.Column(db.Integer, nullable=False)
    cemas           = db.Column(db.Integer, nullable=False)
    bantuan_guru    = db.Column(db.Integer, nullable=False)
    menghargai      = db.Column(db.Integer, nullable=False)
    aman            = db.Column(db.Integer, nullable=False)
    bullying        = db.Column(db.Integer, nullable=True)
    desc_bullying   = db.Column(db.String, nullable=True)
    tidur           = db.Column(db.String, nullable=False)
    kehadiran       = db.Column(db.String, nullable=False)
    open_question   = db.Column(db.String(200), nullable=True)
    
    skor           = db.Column(db.Integer, nullable=False)
    
    __tableargs__ = db.UniqueConstraint('usre_id', 'date', name='unique_user_tanggal')
    
    def calculate_score(self):
        self.skor = (((
            (self.bahagia or 0) +
            (self.semangat or 0) +
            (6- (self.beban or 0)) +
            (6 - (self.cemas or 0)) +
            (self.bantuan_guru or 0) +
            (self.menghargai or 0) +
            (self.aman or 0)
        ) / 7 - 1)*25)
        return self.skor
    
class Note(db.Model):
    __tablename__ = 'note'
    id              = db.Column(db.Integer, primary_key=True)
    date            = db.Column(db.DateTime, default=datetime.now)
    message         = db.Column(db.String, nullable=False)
    
    creator_id      = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    target_id       = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    # Relasi balik
    creator = db.relationship('User', foreign_keys=[creator_id], back_populates='notes_created')
    target = db.relationship('User', foreign_keys=[target_id], back_populates='notes_received')
    

    
    
    



