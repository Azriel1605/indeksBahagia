from flask import request, jsonify
from . import api
from model import db, User, RecordSiswaHarian, RecordSiswaMingguan

@api.route('/word-cloud', methods=["GET"])
def word_cloud():
    return jsonify({}), 200

@api.route('/heatmap', methods=["GET"])
def heatmap():
    return jsonify({}), 200

@api.route('/shi-oervall', methods=["GET"])
def shi_overall():
    return jsonify({}), 200

@api.route('/distribusi-kelas', methods=["GET"])
def distribusi_kelas():
    return jsonify({}), 200

@api.route('/alert-counter', methods=["GET"])
def alert_counter():
    return jsonify({}), 200

@api.route('/alert-counter', methods=["GET"])
def alert_counter():
    return jsonify({}), 200
