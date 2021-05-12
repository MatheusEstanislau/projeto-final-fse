FROM python:3.8
ADD . /flaskApp
WORKDIR /flaskApp
EXPOSE 5000
RUN pip install Flask flask-restplus flask-cors Flask-MQTT Werkzeug==0.16.1
CMD FLASK_APP=app FLASK_ENV=development flask run --host 0.0.0.0