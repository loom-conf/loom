# coding: utf-8
import csv
import json
# import urllib.request

# url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQx0qXQ0W_v21uOrm1TUmpl__eRqGGopQL1-3cVvt3btpKztxtSEslK0UY9uPr2XKmnaAep_BhOiyZr/pub?gid=1413684712&single=true&output=csv"

# urllib.request.urlretrieve(url, "tools/generate_keycodes/qmk_keycodes.csv")

with open("./tools/generate_keycodes/qmk_keycodes.csv", "r", encoding="utf-8") as csvFile:
    f = csv.DictReader(csvFile)
    dist = [{
            "qmk": elm["qmk"] if elm["alt"] == "" else elm["alt"],
            "raw": int(elm["raw"], 16),
            "legend": elm["legend"],
            "altLegend": elm["altLegend"],
            "type": elm["type"]
            } for elm in f]

    with open("./utils/QMKKeycodes.json", "w", encoding="utf-8") as jsonFile:
        json.dump(dist, jsonFile, ensure_ascii=False, indent=2)
