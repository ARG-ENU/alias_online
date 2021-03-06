import json
from _ast import alias

from flask import Flask, render_template, jsonify, request
import os
import alias


app = Flask(__name__, template_folder='templates')
app.config['STATIC_FOLDER'] = 'static'
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'static')

af = None;

@app.route('/')
def demo():
    return render_template('index.html')

@app.route('/framework/<af_id>', methods=['POST'])
def framework(af_id):
    global af
    af = alias.read_tgf(static_file_dir + '/examples/' + af_id + '.tgf')
    return alias.get_json(af)

@app.route('/extension/<ext_id>', methods=['POST'])
def extension(ext_id):
    global af
    if af is not None:
        if ext_id == 'Stable':
            return json.dumps([list(v) for v in af.get_stable_extension()])
        if ext_id == 'Complete':
            return json.dumps([list(v) for v in af.get_complete_extension()])
        if ext_id == 'Preferred':
            return json.dumps([list(v) for v in af.get_preferred_extension()])
    else:
        return "Please select argumentation framework first"


@app.route('/upload_file', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        global af
        file.save(os.path.join("./upload/", file.filename))
        af = alias.read_tgf("./upload/" + file.filename)
        return alias.get_json(af)

@app.route('/addArgument/<arg>', methods=['GET'])
def add_argument(arg):
    global af
    if af is None:
        af = alias.ArgumentationFramework('Test')
    af.add_argument(arg)
    return alias.get_json(af)

@app.route('/addAttack/<attacker>/<attacked>', methods=['GET'])
def add_attack(attacker, attacked):
    global af
    if af is None:
        af = alias.ArgumentationFramework('Test')
    af.add_attack((attacker, attacked))
    return alias.get_json(af)

@app.route('/newFramework', methods=['GET'])
def new_framework():
    global af
    af = alias.ArgumentationFramework('Test')
    return alias.get_json(af)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int('5000'), debug=True)

