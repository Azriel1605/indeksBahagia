from flask import request, jsonify, session
from . import api
from model import db, User, RecordSiswaHarian, RecordSiswaMingguan
from datetime import date, datetime, timedelta
from sqlalchemy import func, or_, cast, Date, distinct
from sqlalchemy.sql import over
import math


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

@api.route('/heatmap', methods=["POST"])
def heatmap():
    data = request.get_json()
    kelas = data.get('kelas')
    end_date = data.get('date')
    page = int(data.get('page', 1))
    limit = int(data.get('limit', 20))

    if not kelas or not end_date:
        return jsonify({"message": "kelas and date are required"}), 400

    # Convert end_date string → date object
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    start_date = end_date - timedelta(days=30 - 1)

    # Filter kelas
    if kelas == "Semua Kelas":
        kelas_filter = True
    else:
        kelas_filter = (User.kelas == kelas)

    # Ambil siswa yang cocok
    students_query = db.session.query(User.id, User.kode).filter(kelas_filter, User.role == "user")

    total_students = students_query.count()
    total_pages = math.ceil(total_students / limit)

    # Pagination database (supaya ringan)
    students = (
        students_query
        .order_by(User.kode)
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    if not students:
        return jsonify({
            "students": [],
            "dates": [],
            "values": [],
            "total_students": 0,
            "total_pages": 0
        }), 200

    student_ids = [s.id for s in students]
    student_map = {s.id: s.kode for s in students}

    # Ambil semua record 30 hari untuk siswa ini
    records = (
        RecordSiswaHarian.query
        .filter(
            RecordSiswaHarian.user_id.in_(student_ids),
            func.date(RecordSiswaHarian.date).between(start_date, end_date)
        )
        .with_entities(
            RecordSiswaHarian.user_id,
            func.date(RecordSiswaHarian.date),
            RecordSiswaHarian.skor
        )
        .all()
    )

    # Format daftar tanggal
    date_list = []
    current = start_date
    while current <= end_date:
        date_list.append(current.strftime("%d %b"))
        current += timedelta(days=1)

    # Siapkan struktur array 2 dimensi
    values = []
    # values[row][col]  <-- row = siswa, col = tanggal

    # Buat dictionary untuk akses cepat
    record_map = {f"{uid}-{d.strftime("%d %b")}": skor for uid, d, skor in records}

    values = []  # hasil akhir: list of rows (array 2D)

    # students adalah list of tuples (id, kode)
    for s_id, s_kode in students:
        row_values = []
        for d in date_list:
            score = record_map.get(f"{s_id}-{d}", None)
            row_values.append(score)
        # optional: debugging
        values.append(row_values)

    valid_columns = []

    for col_idx in range(len(date_list)):
        # Cek apakah ada minimal satu siswa yang memiliki nilai bukan None di kolom ini
        any_score = any(row[col_idx] is not None for row in values)
        if any_score:
            valid_columns.append(col_idx)

    # Buang tanggal yang semua None
    date_list = [date_list[i] for i in valid_columns]

    # Buang nilai yang semua None kolomnya
    values = [
        [row[i] for i in valid_columns]
        for row in values
    ]
    
    return jsonify({
        "students": [s.kode for s in students],
        "dates": date_list,
        "values": values,
        "total_students": total_students,
        "total_pages": total_pages
    }), 200


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


@api.route('/get-top-low-tren', methods=["POST"])
def get_top_low_tren():
    data = request.get_json()
    kelas = data.get('kelas')
    date = data.get('date')

    if not kelas or not date:
        return jsonify({"message": "kelas and date are required"}), 400
    
    
    # Filter kelas
    if kelas == "Semua Kelas":
        kelas_filter = True
    else:
        kelas_filter = (User.kelas == kelas)
    date = datetime.strptime(date, "%Y-%m-%d").date()
    seven_days_ago = date - timedelta(days=7)

    # Skor terbaru
    latest_score_sq = (
        db.session.query(
            RecordSiswaHarian.user_id.label("user_id"),
            func.max(RecordSiswaHarian.date).label("latest_date")
        )
        .group_by(RecordSiswaHarian.user_id)
        .subquery()
    )

    latest_data_sq = (
        db.session.query(
            RecordSiswaHarian.user_id.label("user_id"),
            RecordSiswaHarian.skor.label("latest_score")
        )
        .join(
            latest_score_sq,
            (RecordSiswaHarian.user_id == latest_score_sq.c.user_id) &
            (RecordSiswaHarian.date == latest_score_sq.c.latest_date)
        )
        .subquery()
    )

    # Skor 7 hari lalu
    old_score_sq = (
        db.session.query(
            RecordSiswaHarian.user_id.label("user_id"),
            func.min(RecordSiswaHarian.date).label("old_date")  # data terlama di window 7 hari
        )
        .filter(
            RecordSiswaHarian.date >= seven_days_ago,
            RecordSiswaHarian.date < date  # sebelum nilai terbaru
        )
        .group_by(RecordSiswaHarian.user_id)
        .subquery()
    )


    old_data_sq = (
    db.session.query(
        RecordSiswaHarian.user_id.label("user_id"),
        RecordSiswaHarian.skor.label("old_score")
    )
    .join(
        old_score_sq,
        (RecordSiswaHarian.user_id == old_score_sq.c.user_id) &
        (RecordSiswaHarian.date == old_score_sq.c.old_date)
    )
    .subquery()
)


    # Query utama + FILTER kelas
    records = (
        db.session.query(
            User.kode.label("kode"),
            User.kelas.label("kelas"),
            latest_data_sq.c.latest_score.label("latest_score"),
            (latest_data_sq.c.latest_score - old_data_sq.c.old_score).label("trend")
        )
        .join(latest_data_sq, latest_data_sq.c.user_id == User.id)
        .join(old_data_sq, old_data_sq.c.user_id == User.id)
        .filter(kelas_filter)   # ⬅️ Filter kelas di sini
        .filter((latest_data_sq.c.latest_score - old_data_sq.c.old_score) < 0)
        .order_by((latest_data_sq.c.latest_score - old_data_sq.c.old_score))
        .limit(5)
        .all()
    )

    # Convert ke JSON
    result_json = [
        {
            "kode": r.kode,
            "kelas": r.kelas,
            "latest_score": float(r.latest_score),
            "trend": float(r.trend)
        }
        for r in records
    ]

    return jsonify(result_json)

@api.route('/get-barchart', methods=["POST"])
def get_barchart():
    data = request.get_json()
    date = data.get('date')

    if not date:
        return jsonify({"error": "Parameter 'tanggal' wajib diisi. Format: YYYY-MM-DD"}), 400

    try:
        tanggal = datetime.strptime(date, "%Y-%m-%d").date()
    except:
        return jsonify({"error": "invalid date format, use YYYY-MM-DD"}), 400

    # Query: join Record + User lalu group by kelas
    result = (
        db.session.query(
            User.kelas.label("kelas"),
            func.avg(RecordSiswaHarian.skor).label("nilai")
        )
        .join(User, User.id == RecordSiswaHarian.user_id)
        .filter(RecordSiswaHarian.date < tanggal)
        .group_by(User.kelas)
        .order_by(User.kelas)
        .all()
    )

    response = [
        {
            "kelas": row.kelas,
            "nilai": round(row.nilai, 2)
        }
        for row in result
    ]
    print("BAR CHART")
    print(response)

    return jsonify(response), 200

@api.route('/submission-percentage')
def submission_percentage():
    tipe = request.args.get('tipe', 'harian')

    if tipe == 'harian':
        RecordModel = RecordSiswaHarian
    elif tipe == 'mingguan':
        RecordModel = RecordSiswaMingguan
    else:
        return jsonify({
            "message": "Tipe survey tidak valid. Gunakan 'harian' atau 'mingguan'."
        }), 400

    # -----------------------------------------
    # 1. Hitung maksimal pengisian (distinct tanggal)
    # -----------------------------------------
    max_days = db.session.query(
        func.count(
            distinct(cast(RecordModel.date, Date))
        )
    ).scalar() or 0

    # -----------------------------------------
    # 2. Hitung jumlah pengisian per user
    # -----------------------------------------
    submissions = db.session.query(
        User.id.label('user_id'),
        User.fullname,
        User.kelas,
        func.count(
            distinct(cast(RecordModel.date, Date))
        ).label('filled_days')
    ).outerjoin(
        RecordModel, RecordModel.user_id == User.id
    ).group_by(
        User.id
    ).all()

    # -----------------------------------------
    # 3. Bangun response
    # -----------------------------------------
    results = []
    for row in submissions:
        percentage = 0
        if max_days > 0:
            percentage = round((row.filled_days / max_days) * 100, 2)

        results.append({
            "user_id": row.user_id,
            "fullname": row.fullname,
            "kelas": row.kelas,
            "filled_days": row.filled_days,
            "max_days": max_days,
            "percentage": percentage
        })

    return jsonify({
        "tipe": tipe,
        "max_distinct_days": max_days,
        "data": results
    }), 200

