from . import api
from flask_bcrypt import Bcrypt
from flask import jsonify

bcrypt = Bcrypt()

from flask import jsonify
from faker import Faker
import random
from datetime import datetime, timedelta, date

from model import (
    User,
    RecordSiswaHarianPermission,
    RecordSiswaHarian,
    RecordSiswaMingguanPermission,
    RecordSiswaMingguan,
    Note,
    db
)

faker = Faker("id_ID")

def rand5():
    return random.randint(1, 5)


@api.route("/seed-all", methods=["GET"])
def seed_all():
    try:
        # ============================
        # OPTIONAL: HAPUS DATA LAMA
        # ============================
        db.session.query(Note).delete()
        db.session.query(RecordSiswaHarian).delete()
        db.session.query(RecordSiswaMingguan).delete()
        db.session.query(RecordSiswaHarianPermission).delete()
        db.session.query(RecordSiswaMingguanPermission).delete()
        db.session.query(User).delete()
        db.session.commit()

        # ============================
        # CONFIG PARAMETER
        # ============================
        NUM_ADMIN = 2
        NUM_GURU = 5
        NUM_MURID = 40

        KELAS_LIST = ["A1", "A2", "B1", "B2", "C1"]

        # ============================
        # BUAT USER (ADMIN, GURU, MURID)
        # ============================
        all_users = []

        # ---- Admin ----
        for _ in range(NUM_ADMIN):
            u = User(
                username=faker.user_name(),
                email=faker.email(),
                password_hash="HASHED_DUMMY",
                role="admin",
                kode=f"ADM{random.randint(1000,9999)}",
                kelas=None
            )
            db.session.add(u)
            all_users.append(u)

        # ---- Guru ----
        for _ in range(NUM_GURU):
            kelas = random.choice(KELAS_LIST)
            u = User(
                username=faker.user_name(),
                email=faker.email(),
                password_hash="HASHED_DUMMY",
                role="guru",
                kode=f"GURU{random.randint(1000,9999)}",
                kelas=kelas
            )
            db.session.add(u)
            all_users.append(u)

        # ---- Murid ----
        murid_list = []
        for _ in range(NUM_MURID):
            kelas = random.choice(KELAS_LIST)
            u = User(
                username=faker.user_name(),
                email=faker.email(),
                password_hash="HASHED_DUMMY",
                role="user",
                kode=f"MURID{random.randint(1000,9999)}",
                kelas=kelas
            )
            db.session.add(u)
            all_users.append(u)
            murid_list.append(u)

        db.session.commit()

        # ============================
        # PERMISSION SURVEY HARIAN DAN MINGGUAN
        # ============================
        for k in KELAS_LIST:
            db.session.add(RecordSiswaHarianPermission(kelas=k, is_active=True))
            db.session.add(RecordSiswaMingguanPermission(kelas=k, is_active=True))

        db.session.commit()

        # ============================
        # RECORD HARIAN untuk Murid
        # ============================
        for m in murid_list:
            for i in range(5):  # 5 hari terakhir
                tanggal = datetime.now() - timedelta(days=i)
                r = RecordSiswaHarian(
                    user_id=m.id,
                    date=tanggal,
                    bahagia=rand5(),
                    semangat=rand5(),
                    fokus=rand5(),
                    bertenaga=rand5(),
                    stress=rand5(),
                    dukungan_teman=rand5(),
                    dukungan_guru=rand5(),
                    aman=rand5(),
                    rasakan=faker.sentence(),
                )
                r.calculate_score()
                db.session.add(r)

        db.session.commit()

        # ============================
        # RECORD MINGGUAN untuk Murid
        # ============================
        for m in murid_list:
            for i in range(3):  # Minggu terakhir
                tanggal = datetime.now() - timedelta(days=i * 7)
                r = RecordSiswaMingguan(
                    user_id=m.id,
                    date=tanggal,
                    bahagia=rand5(),
                    semangat=rand5(),
                    beban=rand5(),
                    cemas=rand5(),
                    bantuan_guru=rand5(),
                    menghargai=rand5(),
                    aman=rand5(),
                    bullying=random.choice([None, 1, 2, 3]),
                    desc_bullying=faker.sentence() if random.random() < 0.2 else None,
                    tidur=random.choice(["kurang", "cukup", "baik"]),
                    kehadiran=random.choice(["hadir", "izin", "alfa"]),
                    open_question=faker.sentence(),
                )
                r.calculate_score()
                db.session.add(r)

        db.session.commit()

        # ============================
        # NOTE GURU → MURID
        # ============================
        guru_list = [u for u in all_users if u.role == "guru"]

        for _ in range(80):
            guru = random.choice(guru_list)
            murid = random.choice(murid_list)

            n = Note(
                message=faker.paragraph(),
                creator_id=guru.id,
                target_id=murid.id,
            )
            db.session.add(n)

        db.session.commit()

        # ============================
        # DONE
        # ============================
        return jsonify({"status": "success", "msg": "Dummy data generated!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500
