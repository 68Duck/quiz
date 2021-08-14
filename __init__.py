from flask import g,Flask,render_template,request
from flask_mail import Mail, Message
from getpass import getpass
from databaseManager import DatabaseManager

app = Flask(__name__)
databaseManager = DatabaseManager("quiz.db")

app.config['MAIL_SERVER']='mail.privateemail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

@app.route("/")
def index():
    return render_template("quizMainMenu.html")

@app.route("/elevenPlusQuiz")
def elevenPlusQuiz():
    return render_template("elevenPlusQuiz.html")

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

@app.route("/getQuizQuestions",methods=["POST"])
def getQuizQuestions():
    data = request.get_json()
    if data is None:
        return ("nothing")
    else:
        level,questionNumber = data
        try:
            question = databaseManager.getQuizQuestions(level,int(questionNumber))
            return question
        except Exception as e:
            print(e)
            return ("nothing")

@app.teardown_appcontext  #closes the database when the file is closed
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


if __name__ == '__main__':
   app.run(debug = False)
