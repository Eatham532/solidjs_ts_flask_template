from flask import Response, jsonify


def response_event_stream(event_stream):
    return Response(event_stream, mimetype="text/event-stream")

def response_json(resp):
    return jsonify(resp)

def response_text(resp, status=200):
    return Response(resp, status, mimetype="text/plain")

def response_ok():
    return Response(status=200)

def response_accepted():
    return Response(status=202)

def response_bad():
    return Response(status=400)

def response_unauthorised():
    return Response(status=401)

def response_forbidden():
    return Response(status=403)