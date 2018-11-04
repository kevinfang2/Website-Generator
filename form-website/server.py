import subprocess
from bottle import route, run, template, static_file, get, post, request, redirect
import csv
import codecs

last_csv_name = '$2'
last_title_name = 'Gunn Business'
last_image = '../img/carousel_3.jpg'
last_tagline = 'tagline'

def changefrontPage(title, tagline, image):
    global last_title_name
    global last_image
    global last_tagline

    with open('../routes/index.js') as same:
        same = same.read()
        replaced = same.replace(last_title_name, title)
    with open('../routes/index.js', 'w') as same2:
        same2.write(replaced)
    last_title_name = title

    with open('../public/css/style.css') as f:
        same = f.read()
        last_image = same.replace(last_image, image)
    with open('../public/css/style.css', 'w') as f2:
        f2.write(last_image)
    last_image = image

    with open('../views/home.ejs') as same:
        same = same.read()
        replaced = same.replace(last_tagline, tagline)
    with open('../views/home.ejs', 'w') as same2:
        same2.write(replaced)
    last_tagline = tagline

    print (last_title_name)
    print (last_image)
    print (last_tagline)


def run_mongo_script(collection):
    global last_csv_name

    with open('./mongodb_script.sh', 'r') as same:
        same1 = same.read()
        replaced = same1.replace(last_csv_name, collection)

    with open('./mongodb_script.sh', "w") as f:
        f.write(replaced)

    subprocess.call(['./mongodb_script.sh'])
    last_csv_name = collection
# run_mongo_script('123')

@route('/')
def index():
    output = template('index.tpl')
    return output

@route('/frontpage')
def frontpage():
    output = template('form2.tpl')
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

@post('/frontpage_info')
def frontpage_info():
    name = request.forms.get('name')
    image = request.forms.get('image')
    tagline = request.forms.get('tagline')
    changefrontPage(name, tagline, image)
    redirect('/')

run(host='localhost', port=8000)
