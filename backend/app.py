from flask import Flask
from flask_restplus import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)

@api.route('/hello')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'Olá Cristo'}

if __name__ == '__main__':
    app.run(host='0.0.0.0')