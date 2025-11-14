from flask import request, jsonify, session
from . import api
from model import db, User, RecordSiswaHarian, RecordSiswaMingguan
from datetime import date, datetime, timedelta
from sqlalchemy import func, or_
from sqlalchemy.sql import over


@api.route('/word-cloud', methods=["POST"])
def word_cloud():
    kelas = session.get('kelas')
    today = date.today()
    
    data = request.get_json()
    user_ids = [u.id for u in User.query.filter_by(kelas=kelas).all()]
    tipe = data.get('type')
    if tipe == 'harian':
        data = (
        db.session.query(RecordSiswaHarian.rasakan)
        .filter(
            RecordSiswaHarian.user_id.in_(user_ids),
            func.date(RecordSiswaHarian.date) == today
        )
        .all()
    )

    elif tipe == 'mingguan':
        data = (
        db.session.query(RecordSiswaMingguan.open_question)
        .filter(
            RecordSiswaMingguan.user_id.in_(user_ids),
            func.date(RecordSiswaMingguan.date) == today
        )
        .all()
    )

    # convert list of tuples to list of strings
    list_text = [row[0] for row in data]

    print(list_text, "OPEN QUESTION")

    return jsonify({
        'message': 'success',
        'text': list_text
    }), 200



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

@api.route('/get-alerts', methods=["POST"])
def alert_counter():
    data = request.get_json()
    kelas, date = data.get('kelas'), data.get('date')
    print(kelas, date)
    
    result = {
        "alert_1": {"count": 0, "students": []},
        "alert_2": {"count": 0, "students": []},
        "alert_3": {"count": 0, "students": []}
    }
    
    if not (kelas and date):
        return jsonify({
            'message': 'Error kelas or date not found'
        }), 400

    print("Masuk")
    kelas_filter = "ALL"
        
    if kelas != "Semua Kelas":
        kelas_filter = User.kelas == kelas

    selected_date = datetime.strptime(date, "%Y-%m-%d").date()
    date_filter = RecordSiswaHarian.date <= selected_date
    
    sub = (
        db.session.query(
            RecordSiswaHarian.user_id,
            RecordSiswaHarian.date,
            RecordSiswaHarian.skor,
            (RecordSiswaHarian.date - over(
                func.lag(RecordSiswaHarian.date),
                partition_by=RecordSiswaHarian.user_id,
                order_by=RecordSiswaHarian.date
            )).label("diff1"),
        )
        .join(User, User.id == RecordSiswaHarian.user_id)
        .filter((kelas_filter) if kelas_filter != "ALL" else True
                , date_filter)
        .order_by(RecordSiswaHarian.user_id, RecordSiswaHarian.date)
        .subquery()
    )

    alert1 = (
        db.session.query(sub.c.user_id)
        .filter(sub.c.skor < 40)
        .group_by(sub.c.user_id)
        .having(func.count() >= 3)
        .all()
    )

    alert2 = (
        db.session.query(RecordSiswaMingguan.user_id)
        .join(User, User.id == RecordSiswaMingguan.user_id)
        .filter(
            (kelas_filter) if kelas_filter != "ALL" else True,
            date_filter,
            or_(
                RecordSiswaMingguan.aman <= 2,
                RecordSiswaMingguan.bullying == 1
            )
        )
        .group_by(RecordSiswaMingguan.user_id)
        .all()
    )

    seven_days_ago = selected_date - timedelta(days=7)

    current_scores = (
        db.session.query(
            RecordSiswaHarian.user_id,
            func.max(RecordSiswaHarian.skor).label("current_skor")
        )
        .join(User, User.id == RecordSiswaHarian.user_id)
        .filter((kelas_filter)if kelas_filter != "ALL" else True
                , RecordSiswaHarian.date <= selected_date)
        .group_by(RecordSiswaHarian.user_id)
        .subquery()
    )

    past_scores = (
        db.session.query(
            RecordSiswaHarian.user_id,
            func.max(RecordSiswaHarian.skor).label("past_skor")
        )
        .join(User, User.id == RecordSiswaHarian.user_id)
        .filter((kelas_filter) if kelas_filter != "ALL" else True,
                RecordSiswaHarian.date <= seven_days_ago)
        .group_by(RecordSiswaHarian.user_id)
        .subquery()
    )

    alert3 = (
        db.session.query(current_scores.c.user_id)
        .join(past_scores, current_scores.c.user_id == past_scores.c.user_id)
        .filter((past_scores.c.past_skor - current_scores.c.current_skor) >= 15)
        .all()
    )
    
    print("Alerr 1", len(alert1))
    print("Alerr 2", len(alert2))
    print("Alerr 3", len(alert3))

    return jsonify({
        'alert1': len(alert1),
        'alert2': len(alert2),
        'alert3': len(alert3)
    }), 200
