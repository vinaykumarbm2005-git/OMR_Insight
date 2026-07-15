from flask import jsonify


def start_scan():

    return jsonify({
        "success": True,
        "message": "Scanning started",
        "data": {
            "status": "processing"
        }
    })


def scan_status(exam_id):

    return jsonify({
        "success": True,
        "data": {
            "exam_id": exam_id,
            "status": "processing",
            "progress": 35
        }
    })