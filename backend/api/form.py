from flask import request, jsonify, session
from . import api
from model import db, RecordSiswaHarian, RecordSiswaMingguan, RecordSiswaHarianPermission, User

@api.route('/submit-form-harian', methods=["POST"])
def submit_form_harian():
    data = request.get_json()
    print(data)
    
    # submitData = {
    #     'bahagia'         : data.get('bahagia'),
    #     'semangat'        : data.get('semangat'),
    #     'fokus'           : data.get('fokus'),
    #     'bertenaga'       : data.get('bertenaga'),
    #     'stress'          : data.get('stress'),
    #     'dukungan_teman'  : data.get('dukungan_teman'),
    #     'dukungan_guru'   : data.get('dukungan_guru'),
    #     'aman'            : data.get('aman'),
    #     'rasakan'         : data.get('rasakan')
    # }
    # record = RecordSiswaHarian(**submitData)
    # record.calculate_score()
    # db.session.add(record)
    # db.session.commit()
    
    return jsonify({
        'message' : "success"
    }), 200
    
@api.route('/open-submit-access', methods=['POST'])
def open_submit_access():
    kelas = session.get('kelas')
    change = RecordSiswaHarianPermission.query.filter(kelas=kelas).first()
    if not change:
        new = RecordSiswaHarian(
            kelas=kelas,
            is_active=True
        )
        db.session.add(new)
        db.session.commit()
        return jsonify({}), 200
    change.is_active = True
    db.session.commit()
    
    return jsonify({}), 200

@api.route('/valid-input/<string:tipe>', methods=['GET', 'POST'])
def valid_input(tipe):
    user = User.query.get(session.get('user_id'))
    allowed, message = user.can_fill_survey(tipe)
    
    return jsonify({
        'valid' : allowed,
        'message' : message,
    }), 200

    
    