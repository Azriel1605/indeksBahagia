import random
from app import app, db, bcrypt
from datetime import datetime, timedelta
from model import User, RecordSiswaHarian, RecordSiswaMingguan, Note
from faker import Faker

fake = Faker("id_ID")
app.app_context().push()

ROLES = ["admin", "guru", "user"]

def create_users(jumlah=200):
    users = []
    guru = []
    kelas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    i = 0
    
    for x in kelas:
        username = fake.user_name() + str(random.randint(10, 99))
        fullname = fake.name()
        email = fake.unique.email()

        user = User(
            username=username,
            fullname=fullname,
            email=email,
            password_hash=bcrypt.generate_password_hash("123123").decode('utf-8'),
            role="guru",
            kode=f"KODE-{i}",
            kelas=x
        )
        db.session.add(user)
        guru.append(user)
        i += 1
        for _ in range(int(jumlah / len(kelas))):
            print("---------CREATE-------------")
            username = fake.user_name() + str(random.randint(10, 99))
            fullname = fake.name()
            email = fake.unique.email()

            user = User(
                username=username,
                fullname=fullname,
                email=email,
                password_hash=bcrypt.generate_password_hash("123123").decode('utf-8'),
                role="user",
                kode=f"KODE-{i}",
                kelas=x
            )
            db.session.add(user)
            users.append(user)
            i += 1

    db.session.commit()
    return users, guru


def create_record_harian(user):
    today = datetime.now()

    for i in range(40):  # 40 hari terakhir
        tanggal = today - timedelta(days=i)

        r = RecordSiswaHarian(
            user_id=user.id,
            date=tanggal,
            bahagia=random.randint(1, 5),
            semangat=random.randint(1, 5),
            fokus=random.randint(1, 5),
            bertenaga=random.randint(1, 5),
            stress=random.randint(1, 5),
            dukungan_teman=random.randint(1, 5),
            dukungan_guru=random.randint(1, 5),
            aman=random.randint(1, 5),
            rasakan=fake.sentence(),
        )
        r.calculate_score()
        db.session.add(r)

    db.session.commit()


def create_record_mingguan(user):
    today = datetime.now()

    for i in range(10):  # 10 minggu terakhir
        tanggal = today - timedelta(weeks=i)

        r = RecordSiswaMingguan(
            user_id=user.id,
            date=tanggal,
            bahagia=random.randint(1, 5),
            semangat=random.randint(1, 5),
            beban=random.randint(1, 5),
            cemas=random.randint(1, 5),
            bantuan_guru=random.randint(1, 5),
            menghargai=random.randint(1, 5),
            aman=random.randint(1, 5),
            bullying=random.randint(0, 1),
            desc_bullying=fake.sentence(),
            tidur=random.choice(["< 6 jam", "6-7 jam", "7-8 jam", "> 8 jam"]),
            kehadiran=random.choice(["Baik", "Sedang", "Perlu Perbaikan"]),
            open_question=fake.sentence(),
        )
        r.calculate_score()
        db.session.add(r)

    db.session.commit()


def create_notes(users, guru, jumlah=50):
    for _ in range(jumlah):
        creator = random.choice(guru)
        target = random.choice(users)

        if creator.id == target.id:
            continue

        note = Note(
            date=fake.date_time_this_month(),
            message=fake.sentence(),
            creator_id=creator.id,
            target_id=target.id
        )
        db.session.add(note)

    db.session.commit()


def generate_dummy():
    print("Membuat user...")
    users, guru = create_users()

    print("Membuat record harian & mingguan...")
    for user in users:
        create_record_harian(user)
        create_record_mingguan(user)

    print("Membuat notes...")
    create_notes(users, guru)

    print("Selesai! Dummy data berhasil dibuat.")


if __name__ == "__main__":
    generate_dummy()

