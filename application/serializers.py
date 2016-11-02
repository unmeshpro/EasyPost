from sqlalchemy.inspection import inspect

class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]


# from marshmallow import Serializer

# ###### USER SERIALIZER #####
# class UserSerializer(Serializer):
#     class Meta:
#         # Fields to expose
#         fields = ('email', 'password', 'nickname', 'aboutme')
#         # you can add any other member of class user in fields

# #Return the user data in json format
# def get_user_serialized(user):
#     return UserSerializer(user).data