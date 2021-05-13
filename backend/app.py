from flask import Flask
from flask_restplus import Api, Resource, fields
from werkzeug.contrib.fixers import ProxyFix
import paho.mqtt.client as mqtt

app = Flask(__name__)


def on_log(client, userdata, level, buf):
    print("log: " + buf)


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected OK")
    else:
        print("Bad connection Returned code=", rc)


def on_disconnect(client, userdata, flags, rc=0):
    print("Disconnected result code " + str(rc))


def on_message(client, userdata, msg):
    print((str(msg.payload.decode("utf-8"))))


broker = "test.mosquitto.org"

client = mqtt.Client("python3")

client.on_connect = on_connect
client.on_log = on_log
client.on_disconnect = on_disconnect
client.on_message = on_message
client.on_message = on_message

print("Connecting to broker ", broker)
client.connect(broker)
client.loop_start()
client.subscribe("house/sensor1")

app.wsgi_app = ProxyFix(app.wsgi_app)
api = Api(app, version='1.0', title='FSE FINAL API',
          description='MVC API FOR FSE',
          )

ns = api.namespace('Rooms', description='Room operations')

room = api.model('Room', {
    'id': fields.Integer(readonly=True, description='Room identifier'),
    'room': fields.String(required=True, description='Name of the room')
})


class RoomDao(object):
    def __init__(self):
        self.counter = 0
        self.rooms = []

    def get(self, id):
        for room in self.rooms:
            if room['id'] == id:
                return room
        api.abort(404, "Todo {} doesn't exist".format(id))

    def create(self, data):
        room = data
        room['id'] = self.counter = self.counter + 1
        self.rooms.append(room)
        return room

    def update(self, id, data):
        room = self.get(id)
        room.update(data)
        return room

    def delete(self, id):
        room = self.get(id)
        self.rooms.remove(room)


DAO = RoomDao()
DAO.create({'room': 'Kitchen'})
DAO.create({'room': 'Living Room'})
DAO.create({'room': 'Backyard'})


@ns.route('/')
class RoomList(Resource):
    @ns.doc('list_todos')
    @ns.marshal_list_with(room)
    def get(self):
        """List of Rooms"""
        return DAO.rooms

    @ns.doc('create_todo')
    @ns.expect(room)
    @ns.marshal_with(room, code=201)
    def post(self):
        """Create a Room"""
        print(api.payload['room'])
        client.publish("house/sensor1", "Add room: "+api.payload['room'])
        return DAO.create(api.payload), 201


@ns.route('/<int:id>')
@ns.response(404, 'Todo not found')
@ns.param('id', 'The task identifier')
class Todo(Resource):
    @ns.doc('get rooms')
    @ns.marshal_with(room)
    def get(self, id):
        """Search room"""
        return DAO.get(id)

    @ns.doc('delete room')
    @ns.response(204, 'Todo deleted')
    def delete(self, id):
        """Delete room"""
        DAO.delete(id)
        return '', 204

    @ns.expect(room)
    @ns.marshal_with(room)
    def put(self, id):
        """Update room"""
        return DAO.update(id, api.payload)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
