# flask app
from flask import Flask, request
from flask_cors import CORS
import json

# google sheets
import gspread
from gspread_dataframe import get_as_dataframe, set_with_dataframe
import datetime
from hashlib import sha256

app = Flask(__name__)
CORS(app)


def check_in(team, members):
    # check if teams is empty
    if not team:
        print("No team to check-in!")
        return 400
    if len(team) == 0:
        print("No team to check-in!")
        return 400

    sample = ["TL", "M1", "M2", "M3", "M4"]

    if not members:
        print("No members to check-in!")
        return 400
    if len(members) == 0:
        print("No members to check-in!")
        return 400
    if len(members) > 5:
        print("Too many members to check-in!")
        return 400
    if not all(elem in sample for elem in members):
        print("Invalid members to check-in!")
        return 400

    gc = gspread.service_account(filename="credentials.json")
    sh = gc.open_by_key("1Y2JkNQYKJcvcYoOMzAAItWF6RGf0hWbviSWrwEOYN9M").get_worksheet(2)

    print("Connected to Google Sheet!")

    df = get_as_dataframe(sh)

    now = datetime.datetime.now()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

    # check if team exists
    if not df["Team Code"].isin(team).any():
        print("Team does not exist!")
        return 400

    df.loc[df["Team Code"].isin(team), "Check-in"] = "Yes"
    # check if timestamp exists
    if df.loc[df["Team Code"].isin(team), "Timestamp"].isnull().values.any():
        df.loc[df["Team Code"].isin(team), "Timestamp"] = timestamp
    else:
        df.loc[df["Team Code"].isin(team), "Timestamp"] = (
            str(df.loc[df["Team Code"].isin(team), "Timestamp"])
            + " | "
            + str(timestamp)
        )

    # if TL in members

    for member in members:
        col_name = member + " Check-in"
        df.loc[df["Team Code"].isin(team), col_name] = "Yes"

    # write back to google sheet
    set_with_dataframe(sh, df)

    print("Check-in successful!")
    return 200


def team_details(team):
    gc = gspread.service_account(filename="credentials.json")
    sh = gc.open_by_key("1Y2JkNQYKJcvcYoOMzAAItWF6RGf0hWbviSWrwEOYN9M").get_worksheet(2)

    print("Connected to Google Sheet!")

    df = get_as_dataframe(sh)

    # check if team exists
    if not df["Team Code"].isin([team]).any():
        print("Team does not exist!")
        return {"status": "failure"}

    # get the team details
    team_details = df.loc[df["Team Code"] == team]

    res = {
        "Team Name": str(team_details["Team Name"].values[0]),
        "Team ID": str(team_details["Team ID"].values[0]),
        "College": str(team_details["College"].values[0]),
        "City": str(team_details["City"].values[0]),
        "State": str(team_details["State"].values[0]),
        "Room Number": str(team_details["Room No"].values[0]),
        "TL": str(team_details["TL"].values[0]),
        "M1": str(team_details["M1"].values[0]),
        "M2": str(team_details["M2"].values[0]),
        "M3": str(team_details["M3"].values[0]),
        "M4": str(team_details["M4"].values[0]),

        "Check-in": str(team_details["Check-in"].values[0]),
        "Arrival": str(team_details["Arrival Date"].values[0]),
        "Departure": str(team_details["Departure Date"].values[0]),
        "Accomodation": str(team_details["Accomodation"].values[0]),

        "TL Check-in": str(team_details["TL Check-in"].values[0]),
        "M1 Check-in": str(team_details["M1 Check-in"].values[0]),
        "M2 Check-in": str(team_details["M2 Check-in"].values[0]),
        "M3 Check-in": str(team_details["M3 Check-in"].values[0]),
        "M4 Check-in": str(team_details["M4 Check-in"].values[0]),

        "TL Phone": str(team_details["TL Phone Number"].values[0]),
        "TL Email": str(team_details["TL Email"].values[0]),
        "M1 Phone": str(team_details["M1 Phone Number"].values[0]),
        "M1 Email": str(team_details["M1 Email"].values[0]),
        "M2 Phone": str(team_details["M2 Phone Number"].values[0]),
        "M2 Email": str(team_details["M2 Email"].values[0]),
        "M3 Phone": str(team_details["M3 Phone Number"].values[0]),
        "M3 Email": str(team_details["M3 Email"].values[0]),
        "M4 Phone": str(team_details["M4 Phone Number"].values[0]),
        "M4 Email": str(team_details["M4 Email"].values[0]),

    }

    print("Team details retrieved!")

    res = json.dumps(res)

    return res


@app.route("/", methods=["GET"])
def hello():
    return "<h1>Hello, World!</h1>"


@app.route("/checkin/<teamcode>", methods=["POST"])
def check_in_api(teamcode):
    # get the request body
    req = request.get_json()

    members = req["members"].split(",")
    print(members)
    status = check_in([teamcode], members)
    if status == 200:
        return json.dumps({"status": "success"})
    else:
        return json.dumps({"status": "failure"})


@app.route("/teamdetails/<teamcode>", methods=["GET"])
def team_details_api(teamcode):
    response = team_details(teamcode)

    # add headers to json.dumps

    # convert to json
    return response

@app.route("/teamcode/<teamid>", methods=["GET"])

def get_code(teamid):
    try:
        # hash the team id using sha256
        hashed = sha256(teamid.encode()).hexdigest()
        # get the first 6 characters of the hash
        response = {
            "teamcode": hashed[:7],
            "status": "success"
        }
    except:
        response = {
            "status": "failure"
        }
    return response


# run in debug mode
if __name__ == "__main__":
    app.run(debug=True)
