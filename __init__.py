from flask import g,Flask,render_template,request
from flask_mail import Mail, Message
from getpass import getpass
app = Flask(__name__)
mail= Mail(app)

app.config['MAIL_SERVER']='mail.privateemail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sendEmail",methods=["POST"])
def sendEmail():
    data = request.get_json()
    if data is None:
        return ("nothing")
    else:
        # app.config['MAIL_USERNAME'] = 'josh@68Duck.co.uk'
        # app.config['MAIL_PASSWORD'] =
        print(data)
        msg = Message('Hello', sender = 'Josh@68Duck.co.uk', recipients = ['Josh68Duck@gmail.com'])
        msg.body = "Hello Flask message sent from Flask-Mail"
        mail.send(msg)
    return ("nothing")

if __name__ == '__main__':
   app.run(debug = False)
