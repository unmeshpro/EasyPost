import datetime
from index import db, bcrypt
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import backref
from .serializers import Serializer

class User(db.Model, Serializer):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    nickname = db.Column(db.String(255))
    password = db.Column(db.String(255))
    aboutme = db.Column(db.String(255))
    posts = db.relationship('Post', backref='author', lazy='dynamic')

    # def as_dict(self):
    #    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __init__(self, email, password, nickname, aboutme):
        self.email = email
        self.nickname = nickname
        self.active = True
        self.password = User.hashed_password(password)
        self.aboutme = aboutme

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

    def serialize(self):
        d = Serializer.serialize(self)
        del d['posts']
        del d['password']
        del d['author1']
        del d['author2']
        return d



class Post(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime)
    userid = db.Column(db.String(255), db.ForeignKey('user.email'))

    def __init__(self, body, timestamp, userid):
        self.body = body
        self.timestamp = Post.set_post_time()
        self.userid = userid

    # def __repr__(self):
    #     return '<Post %r>' % (self.body)

    def serialize(self):
        d = Serializer.serialize(self)
        del d['author']
        return d

    @staticmethod
    def set_post_time():
        return datetime.datetime.utcnow()



class Follow(db.Model, Serializer):
    id = db.Column(db.Integer)
    followerid = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    followedid = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    followers = db.relationship('User', foreign_keys=followerid, backref=backref('author1', lazy='dynamic'))
    following = db.relationship('User', foreign_keys=followedid, backref=backref('author2', lazy='dynamic'))


    def __init__(self, followerid, followedid):
        self.followerid = followerid
        self.followedid = followedid

    # def __repr__(self):
    #     return '<Post %r>' % (self.body)

    def serialize(self):
        d = Serializer.serialize(self)
        del d['followers']
        del d['following']
        return d


class Hashtagrelations(db.Model, Serializer):
    id = db.Column(db.Integer)
    postid = db.Column(db.Integer, db.ForeignKey('post.id'), primary_key=True)
    hashtagname = db.Column(db.String(140), primary_key=True)


    def __init__(self, postid, hashtagname):
        self.postid = postid
        self.hashtagname = hashtagname

    # def __repr__(self):
    #     return '<Post %r>' % (self.body)

    def serialize(self):
        d = Serializer.serialize(self)
        
        return d
