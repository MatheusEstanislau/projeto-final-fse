FROM python:3.8
ADD . /flaskApp
WORKDIR /flaskApp
RUN pip install Flask flask-restplus Flask-MQTT Werkzeug==0.16.1
CMD python app.py