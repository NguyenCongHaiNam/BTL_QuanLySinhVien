from flask import Flask, request, render_template, jsonify, get_flashed_messages
from flask_sqlalchemy import SQLAlchemy
from os import path

app = Flask(__name__, template_folder='templates')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
db = SQLAlchemy(app)

# app.py

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    birth_year = db.Column(db.Integer)
    class_name = db.Column(db.String(80))

    def __init__(self, name, birth_year, class_name):
        self.name = name
        self.birth_year = birth_year
        self.class_name = class_name

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/add', methods=['POST','GET'])
def students():
    if request.method=="POST":
        name = request.form.get("name")
        birth_year = request.form.get("birth_year")
        class_name = request.form.get("class_name")

        if name and birth_year and class_name:
            new_student = Student(name=name, birth_year=birth_year, class_name=class_name)
            db.session.add(new_student)
            db.session.commit()
            return render_template("add.html", notice="1")
        else:
            return render_template("add.html", notice="0")
    return render_template("add.html")

@app.route('/students_list', methods=['GET'])
def students_list():
    students = Student.query.all()
    return render_template("students_list.html", students=students)


@app.route('/delete', methods=['POST', 'GET'])
def delete_student():
    if request.method == 'POST':
        name = request.form.get('name')
        student = Student.query.filter_by(name=name).first()
        if not student:
            return render_template("delete.html", notice="0")
        else:
            db.session.delete(student)
            db.session.commit()
            return render_template("delete.html", notice="1")
    return render_template("delete.html")

@app.route('/edit', methods=['POST', 'GET'])
def edit_student():
    students = Student.query.all()
    if request.method=='POST':
        # student_id = request.form.get('id')
        student_id = 1
        name = request.form.get('name')
        birth_year = request.form.get('birth_year')
        class_name = request.form.get('clas')

        student = Student.query.get(student_id)

        if student:
            student.name = name
            student.birth_year = birth_year
            student.class_name = class_name
            db.session.commit()
            return render_template('edit.html' , notice="1")
        else:
            return render_template('edit.html' , notice="0")
    return render_template("edit.html")


# @app.route('/api/students', methods=['GET'])
# def sort_students():
#     query_params = request.args.to_dict()
#     students = Student.query.filter_by(**query_params).all()

#     if 'sort_by' in query_params:
#         sort_by = query_params['sort_by']
#         students = sorted(students, key=lambda x: getattr(x, sort_by))

#     student_list = [{'id': student.id, 'name': student.name, 'birth_year': student.birth_year, 'class_name': student.class_name} for student in students]
#     return jsonify(student_list), 200


if __name__ == '__main__':
    if not path.exists("mydatabase.db"):
        db.create_all(app=app)
    app.run(debug=True)
