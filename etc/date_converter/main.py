from flask import Flask
from flask import request
import re

app = Flask(__name__)
month_dict = {
    'янв':'1',
    'фев':'2',
    'мар':'3',
    'апр':'4',
    'мая':'5',
    'июн':'6',
    'июл':'7',
    'авг':'8',
    'сен':'9',
    'окт':'10',
    'ноя':'11',
    'дек':'12'
}
full_date = re.compile('(?P<day>\d+) (?P<month>\w+)\.? (?P<year>\d{2,4})')
two_years = re.compile('(?P<year1>\d{2,4})\s?-\s?(?P<year2>\d{2,4})')
only_year = re.compile('\d{4}')

@app.route('/parse', methods=['GET']) #date='12 авг 2021'
def parse():
    date = request.args.get('date').lower().strip()
    if 'tba' in date or 'soon' in date or 'none' in date: return 'TBA'

    m = full_date.match(date)
    if m is not None:
        day = m.group('day')
        month = m.group('month')
        year = m.group('year')
        if len(year) == 2: year = '20'+year
        month = month_dict[month]
        return '{0}.{1}.{2}'.format(day, month, year)

    m = two_years.match(date)
    if m is not None:
        if int(m.group('year1')) > 21:
            year1_c = '20'
        else:
            year1_c = '19'
        if int(m.group('year2')) > 21:
            year2_c = '20'
        else:
            year2_c = '19'

        year1 = year1_c+m.group('year1') if len(m.group('year1')) == 2 else m.group('year1')
        year2 = year2_c+m.group('year2') if len(m.group('year2')) == 2 else m.group('year2')
        return 'D:'+year1+'-'+year2

    m = only_year.match(date)
    if m is not None:
        return date

    return 'TBA'
