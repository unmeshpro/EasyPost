# EasyPost #

Microblogging Application that uses Flask-SQLAlchemy-ReactJS-MaterialUI

* Python 2.7+ or 3.x
* Pytest
* Flask
* React
* Redux
* React-Router 2.0
* React-Router-Redux

### Create Database

```sh
$ export DATABASE_URL="mysql+mysqlconnector://localhost/yourdb"


$ python manage.py create_db
$ python manage.py db upgrade
$ python manage.py db migrate
```

To update database after creating new migrations, use:

```sh
$ python manage.py db upgrade
```

### Install Front-End Requirements
```sh
$ cd static
$ npm install
```

### Run Back-End

```sh
$ python manage.py runserver
```

### Test Back-End

```sh
$ python test.py --cov-report=term --cov-report=html --cov=application/ tests/
```

### Run Front-End

```sh
$ cd static
$ npm start
```

### Build Front-End

```sh
$ npm run build:production
```
