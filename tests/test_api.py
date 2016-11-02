from testing_config import BaseTestConfig
from application.models import User, Post
import json
from application.utils import auth


class TestAPI(BaseTestConfig):
    some_user = {
        "email": "one@gmail.com",
        "password": "something1",
        "nickname": "somenickname1",
        "aboutme": "someaboutme1"
    }

    some_post = {
        "body": "this is sample post1",
        "timestamp": "2015-02-17 23:58:44.761000",
        "userid": "someid1"
    }

    def test_get_spa_from_index(self):
        result = self.app.get("/")
        self.assertIn('<html>', result.data.decode("utf-8"))

    def test_create_new_user(self):
        self.assertIsNone(User.query.filter_by(
                email=self.some_user["email"]
        ).first())

        res = self.app.post(
                "/api/create_user",
                data=json.dumps(self.some_user),
                content_type='application/json'
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(json.loads(res.data.decode("utf-8"))["token"])
        self.assertEqual(User.query.filter_by(email=self.some_user["email"]).first().email, self.some_user["email"])

        res2 = self.app.post(
                "/api/create_user",
                data=json.dumps(self.some_user),
                content_type='application/json'
        )

        self.assertEqual(res2.status_code, 409)

    def test_get_token_and_verify_token(self):
        res = self.app.post(
                "/api/get_token",
                data=json.dumps(self.default_user),
                content_type='application/json'
        )

        token = json.loads(res.data.decode("utf-8"))["token"]
        self.assertTrue(auth.verify_token(token))
        self.assertEqual(res.status_code, 200)

        res2 = self.app.post(
                "/api/is_token_valid",
                data=json.dumps({"token": token}),
                content_type='application/json'
        )

        self.assertTrue(json.loads(res2.data.decode("utf-8")), ["token_is_valid"])

        res3 = self.app.post(
                "/api/is_token_valid",
                data=json.dumps({"token": token + "something-else"}),
                content_type='application/json'
        )

        self.assertEqual(res3.status_code, 403)

        res4 = self.app.post(
                "/api/get_token",
                data=json.dumps(self.some_user),
                content_type='application/json'
        )

        self.assertEqual(res4.status_code, 403)

    def test_protected_route(self):
        headers = {
            'Authorization': self.token,
        }

        bad_headers = {
            'Authorization': self.token + "bad",
        }

        response = self.app.get('/api/user', headers=headers)
        self.assertEqual(response.status_code, 200)
        response2 = self.app.get('/api/user')
        self.assertEqual(response2.status_code, 401)
        response3 = self.app.get('/api/user', headers=bad_headers)
        self.assertEqual(response3.status_code, 401)


    def test_create_new_post(self):
        self.assertIsNone(Post.query.filter_by(
                userid=self.some_post["userid"],
                timestamp=self.some_post["timestamp"]

        ).first())

        # res = self.app.post(
        #         "/api/create_user", #This will become the post page url
        #         data=json.dumps(self.some_post),
        #         content_type='application/json'
        # )
        # self.assertEqual(res.status_code, 200)
        # self.assertTrue(json.loads(res.data.decode("utf-8"))["token"])
        # self.assertEqual(User.query.filter_by(body=self.some_post["body"]).first().body, self.some_post["body"])

        # res2 = self.app.post(
        #         "/api/create_user", #This will become the post page url
        #         data=json.dumps(self.some_user),
        #         content_type='application/json'
        # )

        # self.assertEqual(res2.status_code, 409)

