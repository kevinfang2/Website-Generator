import subprocess
from bottle import route, run, template, static_file, get, post, request, redirect
import csv
import codecs

last_csv_name = '$2'

def run_mongo_script(collection):
    global last_csv_name
    print (last_csv_name)
    print (collection)

    with open('./mongodb_script.sh', 'r') as same:
        same1 = same.read()
        replaced = same1.replace(last_csv_name, collection)

    with open('./mongodb_script.sh', "w") as f:
        print (replaced)
        f.write(replaced)

    subprocess.call(['./mongodb_script.sh'])
    last_csv_name = collection
# run_mongo_script('123')

@route('/')
def index():
    output = template('index.tpl')
    return output

@route('/static/:filename#.*#')
def send_static(filename):
    return static_file(filename, root='./static/')

@post('/csv_upload')
def csv_upload():
    name = request.forms.get('name')
    reader = csv.reader(codecs.iterdecode(request.files.csvFile.file, 'utf-8'))

    myfile = open('temp-output-file.csv', "w")
    writer = csv.writer(myfile, quoting=csv.QUOTE_ALL)
    for row in reader:
        writer.writerow(row)
    run_mongo_script(name)
    redirect('/')

run(host='localhost', port=8000)
