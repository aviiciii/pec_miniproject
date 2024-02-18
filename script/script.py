# write a script to connect to a google sheet via service account and read data
import gspread
import pandas as pd
import numpy as np
from gspread_dataframe import get_as_dataframe, set_with_dataframe
import datetime
def check_in(teams):
    gc = gspread.service_account(filename='credentials.json')
    sh = gc.open_by_key('1Y2JkNQYKJcvcYoOMzAAItWF6RGf0hWbviSWrwEOYN9M').sheet1

    print('Connected to Google Sheet!')

    df = get_as_dataframe(sh)

    now = datetime.datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

    df.loc[df['Team Name'].isin(teams), 'Check-in'] = 'Yes'
    df.loc[df['Team Name'].isin(teams), 'Check-in timestamp'] = str(timestamp)

    # write back to google sheet
    set_with_dataframe(sh, df)

    print('Check-in successful!')


# change check-in of selected teams to yes
teams=['A07 - Softflow', 'A13 - Smart Under Criticism', 'A14 - United We Work', 'A17 - SYNDICATES', 'A20 - HYPERLOOPHACKERS']

check_in(teams)