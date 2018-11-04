import subprocess
from bottle import route, run, template, static_file, get, post, request, redirect
import csv
import codecs
import pandas as pd

last_csv_name = '$2'
last_title_name = 'Gunn Business'
last_image = '../img/carousel_3.jpg'
last_tagline = 'Tagline'
count = 1

def changePlatformPage(csv_reader, name):
    global count

    #for side bar update
    html_string_side =  '<li class="nav-item"> <a class="nav-link active" data-toggle="tab" href="#pag' + str(count) + '" role="tab" aria-controls="home">' + name + '</a></li> \n'

    with open('temp-output-file.csv', 'r') as file:
        d_reader = csv.DictReader(file)

        columns = d_reader.fieldnames
        df = pd.read_csv(file, names=columns)

    with open('../views/resources.ejs') as same:
        string_content = same.read()
        content = string_content.split('\n')
        marker1 = '<!-- BIG BIG MARKER -->'
        marker2 = '<!-- BIG BIG MARKER END -->'

        current_things = ''
        check = False
        for line in content:
            if(marker1 in line):
                check = True
            if(marker2 in line):
                break
            if(check):
                current_things += line + '\n'
        string_content = string_content.replace(current_things, current_things + html_string_side)

        marker3 = '<!-- BIG BLEH MARKER -->'
        marker4 = '<!-- BIG BLEH MARKER END -->'
        table_things = ''
        check = False
        for line in content:
            if(marker3 in line):
                check = True
            if(marker4 in line):
                break
            if(check):
                table_things += line + '\n'

        html_start = '<div class="tab-pane active" id="pag' + str(count) + '" role="tabpanel"> <div class="sv-tab-panel"> <h3>' + name + '</h3>'
        html_end = '</table></div></div>\n'
        one_section = html_start + df.to_html() + html_end
        string_content = string_content.replace(table_things, table_things + one_section)

        same.close()

    with open('../views/resources.ejs', 'w') as f:
        f.write(string_content)
        f.close()

    count += 1


def changefrontPage(title, tagline, image):
    global last_title_name
    global last_image
    global last_tagline

    with open('../routes/index.js') as same:
        same = same.read()
        replaced = same.replace(last_title_name, title)
    with open('../routes/index.js', 'w') as same2:
        same2.write(replaced)
        same2.close()
    last_title_name = title

    with open('../public/css/style.css') as f:
        same = f.read()
        last_image = same.replace(last_image, image)
    with open('../public/css/style.css', 'w') as f2:
        f2.write(last_image)
        f2.close()
    last_image = image

    with open('../views/home.ejs') as same3:
        same = same3.read()
        replaced = same.replace(last_tagline, tagline)
    with open('../views/home.ejs', 'w') as same4:
        same4.write(replaced)
        same4.close()
    last_tagline = tagline


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

    with open('temp-output-file.csv', "w") as myfile:
        writer = csv.writer(myfile, quoting=csv.QUOTE_ALL)
        for row in reader:
            writer.writerow(row)
    run_mongo_script(name)
    changePlatformPage(reader, name)
    redirect('/')

@post('/frontpage_info')
def frontpage_info():
    name = request.forms.get('name')
    image = request.forms.get('image')
    tagline = request.forms.get('tagline')
    changefrontPage(name, tagline, image)
    redirect('/')

run(host='localhost', port=8000)
