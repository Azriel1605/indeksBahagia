from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from sqlalchemy import String, func, extract, cast, Integer, case
from sqlalchemy.dialects.postgresql import ARRAY

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
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
    

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
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
    
class RecordSiswaMingguan(db.Model):
    __tablename__ = 'record_siswa_mingguan'
    id              = db.Column(db.Integer, primary_key=True)
    # Relationship
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    date            = db.Column(db.DateTime, default=datetime.now)
    bahagia         = db.Column(db.Integer, nullable=False)
    semangat        = db.Column(db.Integer, nullable=False)
    beban           = db.Column(db.Integer, nullable=False)
    ceman           = db.Column(db.Integer, nullable=False)
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
            (self.beban or 0) +
            (self.ceman or 0) +
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
    

    
    
    



