import sqlite3 as lite
from os import path
import os
from dict_factory import dict_factory

class DatabaseManager(object):
    def __init__(self,db):
        self.db = path.join(os.path.join("databases",db))


    def getQuizQuestions(self,level,questionNumber):
        questions = self.getAllData(level)
        print(questionNumber)
        if len(questions) == 0 or questions == False:
            raise Exception("There are no questions in this table")
        question = questions[questionNumber]
        return question

    def getAllData(self,table):
        exisits = self.checkIfTableExisits(table)
        if exisits == False:
            return False
        self.con = lite.connect(self.db)
        self.con.execute("PRAGMA foreign_keys = 1")
        self.cur = self.con.cursor()
        self.cur.row_factory = dict_factory
        sql1 = (f'SELECT * FROM {table} ')
        self.cur.execute(sql1)
        results = self.cur.fetchall()
        return results

    def checkIfTableExisits(self,tableName):  #returns true or false if exisits or not
        self.con = lite.connect(self.db)
        self.con.execute("PRAGMA foreign_keys = 1")
        cur = self.con.cursor()
        sql1 = (f'SELECT name FROM sqlite_master WHERE type="table" AND name="{tableName}";')
        cur.execute(sql1)
        results = cur.fetchall()
        if len(results)==1:
            return True
        else:
            return False
