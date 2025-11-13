from flask import request, jsonify, session
from . import api
from model import db, RecordSiswaHarian, RecordSiswaMingguan, RecordSiswaHarianPermission, User, RecordSiswaMingguanPermission

@api.route('/submit-form-harian', methods=["POST"])
def submit_form_harian():
    data = request.get_json()
    
    kelas = session.get('kelas')    
    print(kelas, type(kelas))
    permit = RecordSiswaHarianPermission.query.filter_by(kelas=kelas).first()
    
    if not permit:
        return jsonify({
            'message': 'Kelas tidak ditemukan'
        }), 400
    
    if not permit.is_active:
        return jsonify({
            'message': 'Akses survey sudah ditutup'
        }), 400
    
    submitData = {
        'bahagia'         : data.get('bahagia'),
        'semangat'        : data.get('semangat'),
        'fokus'           : data.get('fokus'),
        'bertenaga'       : data.get('bertenaga'),
        'stress'          : data.get('stress'),
        'dukungan_teman'  : data.get('dukungan_teman'),
        'dukungan_guru'   : data.get('dukungan_guru'),
        'aman'            : data.get('aman'),
        'rasakan'         : data.get('rasakan'),
        'user_id'         : session.get('user_id')
        
    }
    record = RecordSiswaHarian(**submitData)
    record.calculate_score()
    db.session.add(record)
    db.session.commit()
    
    print("SUCCESS")
    
    return jsonify({
        'message' : "success"
    }), 200
    
@api.route('/submit-form-mingguan', methods=["POST"])
def submit_form_mingguan():
    data = request.get_json()
    
    kelas = session.get('kelas')    
    print(kelas, type(kelas))
    permit = RecordSiswaMingguanPermission.query.filter_by(kelas=kelas).first()
    
    if not permit:
        return jsonify({
            'message': 'Kelas tidak ditemukan'
        }), 400
    
    if not permit.is_active:
        return jsonify({
            'message': 'Akses survey sudah ditutup'
        }), 400
        
    handleLikertTidur = {
        '1': "< 6 jam",
        '2': "6-7 jam",
        '3': "7-8 jam",
        '4': "> 8 jam"
    }
    
    handleLikertKehadiran={
        '1': "Baik",
        '2': "Sedang",
        '3': "Perlu Perbaikan"
    }
    
    
    
    submitData = {
        'bahagia'       : data.get('bahagia'),
        'semangat'      : data.get('semangat'),
        'beban'         : data.get('beban'),
        'cemas'         : data.get('cemas'),
        'bantuan_guru'  : data.get('bantuan_guru'),
        'menghargai'    : data.get('menghargai'),
        'aman'          : data.get('aman'),
        'bullying'      : data.get('bullying')%2,
        'desc_bullying' : data.get('desc_bullying'),
        'tidur'         : handleLikertTidur[str(data.get('tidur'))],
        'kehadiran'     : handleLikertKehadiran[str(data.get('kehadiran'))],
        'open_question' : data.get('open_question'),
        'user_id'       : session.get('user_id')
        
    }
    record = RecordSiswaMingguan(**submitData)
    record.calculate_score()
    db.session.add(record)
    db.session.commit()
    
    print("SUCCESS")
    
    return jsonify({
        'message' : "success"
    }), 200

@api.route('/status-survey', methods=['POST'])
def status_survey():
    kelas = session.get('kelas')
    
    if not kelas:
        return jsonify({"error": "Parameter 'kelas' diperlukan"}), 400
    
    data = request.get_json()
    
    # Pastikan ada field 'type'
    if not data or "type" not in data:
        return jsonify({"error": "Parameter 'type' diperlukan"}), 400
    
    survey_type = data["type"]
    
    if survey_type == "harian":
        res = RecordSiswaHarianPermission.query.filter_by(kelas=kelas).first()
        if not res:
            res = RecordSiswaHarianPermission(
                kelas=kelas,
                is_active=False
            )
            db.session.add(res)
            db.session.commit()
        
        return jsonify({
            'isOpen' : res.is_active,
            'message': 'success'   
        }), 200
    
    if survey_type == "mingguan":
        res = RecordSiswaMingguanPermission.query.filter_by(kelas=kelas).first()
        if not res:
            res = RecordSiswaMingguanPermission(
                kelas=kelas,
                is_active=False
            )
            db.session.add(res)
            db.session.commit()
        
        return jsonify({
            'isOpen' : res.is_active,
            'message': 'success'   
        }), 200
    
    
    pass

@api.route('/toggle-survey', methods=['POST'])
def toggle_survey():
    kelas = session.get('kelas')
    data = request.get_json()
    tipe = data.get('type')
    action = data.get('action')
    
    
    if tipe == "harian":
        change = RecordSiswaHarianPermission.query.filter_by(kelas=kelas).first()
        if action == "open":
            change.is_active = True
        if action == "close":
            change.is_active = False
        db.session.commit()
    if tipe == "mingguan":
        change = RecordSiswaMingguanPermission.query.filter_by(kelas=kelas).first()
        if action == "open":
            change.is_active = True
        if action == "close":
            change.is_active = False
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

    
    