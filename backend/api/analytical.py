from flask import request, jsonify, session
from . import api
from model import db, User, RecordSiswaHarian, RecordSiswaMingguan
from datetime import date
from sqlalchemy import func

@api.route('/word-cloud', methods=["GET"])
def word_cloud():
    return jsonify({}), 200


@api.route('/shi-overall', methods=["POST"])
def shi_overall():
    kelas = session.get('kelas')
    today = date.today()
    
    data = request.get_json()
    user_ids = [u.id for u in User.query.filter_by(kelas=kelas).all()]
    tipe = data.get('type')
    if tipe == 'harian':
        avg = db.session.query(func.avg(RecordSiswaHarian.skor)).filter(
            RecordSiswaHarian.user_id.in_(user_ids),
            func.date(RecordSiswaHarian.date) == today
        ).scalar()
    if tipe == 'mingguan':
        avg = db.session.query(func.avg(RecordSiswaMingguan.skor)).filter(
            RecordSiswaMingguan.user_id.in_(user_ids),
            func.date(RecordSiswaMingguan.date) == today
        ).scalar()
        

    print(avg, "SHI GAES")
    
    return jsonify({
        'message'    : 'success',
        'shi': avg
    }), 200

# @api.route('/heatmap', methods=["GET"])
# def heatmap():
#     return jsonify({}), 200

# @api.route('/shi-oervall', methods=["GET"])
# def shi_overall():
#     return jsonify({}), 200

# @api.route('/distribusi-kelas', methods=["GET"])
# def distribusi_kelas():
#     return jsonify({}), 200

# @api.route('/alert-counter', methods=["GET"])
# def alert_counter():
#     return jsonify({}), 200

# @api.route('/alert-counter', methods=["GET"])
# def alert_counter():
#     return jsonify({}), 200
