from flask import request, jsonify
from . import api
from model import db, RecordSiswaHarian, RecordSiswaMingguan, User

@api.route('/submit-form-harian', methods=["POST"])
def submit_form_harian():
    data = request.get_json()
    
    submitData = {
        'bahagia'         : data.get('bahagia'),
        'semangat'        : data.get('semangat'),
        'fokus'           : data.get('fokus'),
        'bertenaga'       : data.get('bertenaga'),
        'stress'          : data.get('stress'),
        'dukungan_teman'  : data.get('dukungan_teman'),
        'dukungan_guru'   : data.get('dukungan_guru'),
        'aman'            : data.get('aman'),
        'rasakan'         : data.get('rasakan')
    }
    record = RecordSiswaHarian(**submitData)
    record.calculate_score()
    db.session.add(record)
    db.session.commit()
    
@api.route('/open-submit-access', methods=['POST'])
def open_submit_access():
    
    return jsonify({}), 200

    
    