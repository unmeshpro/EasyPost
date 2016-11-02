from flask import request, render_template, jsonify, url_for, redirect, g
from .models import User, Post, Follow, Hashtagrelations
from index import app, db
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token
import json
import datetime

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    user_details = User.query.filter_by(email=g.current_user['email']).first()
    print user_details.serialize()
    result = user_details.serialize()
    print g.current_user

    user_posts = Post.query.filter_by(userid=g.current_user['email']).order_by(desc(Post.timestamp)).all()
    result2 = Post.serialize_list(user_posts)



    following_info = Follow.query.filter_by(followerid=user_details.id).all()
    result1 = Follow.serialize_list(following_info)

    follower_emails = []
    for eachRecord in following_info:
        following_more_info = User.query.filter_by(id=eachRecord.followedid).first()
        follower_emails.append(following_more_info.email)

    all_posts = []
    for eachFollowingEmail in follower_emails:
        followed_posts = Post.query.filter_by(userid=eachFollowingEmail).order_by(desc(Post.timestamp)).all()
        all_posts.append(Post.serialize_list(followed_posts))

    result3 = all_posts
    # following_posts = Post.query.filter_by(userid=g.current_user['email']).order_by(desc(Post.timestamp)).all()

    # return (json.dumps(result))
    # #return jsonify(result=user_details.serialize())
    print jsonify(g.current_user)
    print "all is well "
    #print jsonify(result2=result2)
    #print jsonify(result=result)
    print "India is well"
    result=[result, result2, result3]
    print result
    print "I am well"
    return jsonify(
        result=result
    )
    # user_details = User.query.filter_by(email=g.current_user['email']).first()
    # #print user_details.serialize()
    # result1 = user_details.serialize()
    # #print g.current_user
    # #print result1
    # # return (json.dumps(result))
    # # #return jsonify(result=user_details.serialize())
    # #print jsonify(g.current_user)
    # #print jsonify(result1)

    # new_post = Post.query.filter_by(userid=g.current_user['email']).order_by(desc(Post.timestamp)).first()
    # result2 = new_post.serialize()
    # #print result2

    # result11 = json.loads(json.dumps(result1))
    # result22 = json.loads(json.dumps(result2, default = myconverter))
    # data = {"userinfo": result11, "userpostinfo": result22}
    # result = json.dumps(data)
    # #jsonify(result)
    # #return jsonify(result=result)
    # return jsonify(
    #     userinfo=result1,
    #     userpostinfo=result2
    # )

def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()

@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"],
        nickname=incoming["nickname"],
        aboutme=incoming["aboutme"]
    )
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_recent_post", methods=["GET"])
def get_recent_post():
    print request.args['email']
    new_post = Post.query.filter_by(userid=request.args['email']).order_by(desc(Post.timestamp)).first()
    result = new_post.serialize()
    print result
    return jsonify(result=result)


@app.route("/api/create_post", methods=["POST"])
def create_post():
    print "Unmesh"
    incoming = request.get_json()
    print incoming["userid"]

    post = Post(
        body=incoming["body"],
        timestamp=incoming["timestamp"],
        userid=incoming["userid"]
    )
    db.session.add(post)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Post cannot be created"), 409

    tags=str(incoming["body"])
    hashtags={tag.strip("#").lower() for tag in tags.split() if tag.startswith("#")}

    for e in hashtags:
        hashtagrelation = Hashtagrelations (
            postid=post.id,
            hashtagname=e
        )
        db.session.add(hashtagrelation)
        db.session.commit()

    print hashtags

    return jsonify(
        id=post.id,
        post=post.body
    )


@app.route("/api/info_of_users", methods=["GET"])
@requires_auth
def get_info_of_users():
    users_info = User.query.all()
    result = User.serialize_list(users_info)

    user_details = User.query.filter_by(email=g.current_user['email']).first()
    followers_info = Follow.query.filter_by(followerid=user_details.id).all()
    result1 = Follow.serialize_list(followers_info)

    # return (json.dumps(result))
    # #return jsonify(result=user_details.serialize())
    result = [result, result1]
    print "IDHAR"
    print result
    print "UDHAR"
    print result1
    return jsonify(
        result=result
    )



@app.route("/api/get_follow_relations", methods=["GET"])
@requires_auth
def get_follow_relations():
    user_details = User.query.filter_by(email=g.current_user['email']).first()
    followers_info = Follow.query.filter_by(followerid=user_details.id).all()
    result = Follow.serialize_list(followers_info)

    # return (json.dumps(result))
    # #return jsonify(result=user_details.serialize())
    print "IDHAR"
    print result
    print "UDHAR"
    return jsonify(
        result=result
    )

@app.route("/api/make_follow_relation", methods=["POST"])
def make_follow_relation():
    incoming = request.get_json()
    print incoming["followedid"]
    user1_details = User.query.filter_by(email=incoming["followerid"]).first()
    user2_details = User.query.filter_by(email=incoming["followedid"]).first()
    followRelation = Follow(
        followerid=user1_details.id,
        followedid=user2_details.id,
    )
    db.session.add(followRelation)

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Cannot Follow"), 409

    new_relation = Follow.query.filter_by(followerid=user1_details.id, followedid=user2_details.id).first()
    new_relation = new_relation.serialize()

    return jsonify(
        followerid=new_relation['followerid'],
        followedid=new_relation['followedid']
    )

@app.route("/api/delete_follow_relation", methods=["POST"])
def delete_follow_relation():
    incoming = request.get_json()
    print incoming["followedid"]
    user1_details = User.query.filter_by(email=incoming["followerid"]).first()
    user2_details = User.query.filter_by(email=incoming["followedid"]).first()

    deleted_relation = Follow.query.filter_by(followerid=user1_details.id, followedid=user2_details.id).first()
    deleted_relation = deleted_relation.serialize()

    Follow.query.filter_by(followerid=user1_details.id, followedid=user2_details.id).delete()

    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="Cannot Follow"), 409

    return jsonify(
        id=deleted_relation['id'],
        followerid=deleted_relation['followerid'],
        followedid=deleted_relation['followedid']
    )

@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))
    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403
