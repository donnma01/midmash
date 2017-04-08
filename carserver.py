from flask import Flask, request
import requests as req
import json

app = Flask(__name__)

@app.route('/api/carandpowerinfo', methods=["GET"])
def proxy_edmunds_request():
  args = request.url.split('?')[1].replace('%2F', '/').replace('%3F', '?')
  keys = ['tb2smpfhgeayg63vx2ejcp9f', '538cs4nrsavz7afz94ru3fm5', '99bgw7sk973nr4n6ug7hm8zk']
  for key in keys:
    res = req.get("https://api.edmunds.com/api/vehicle/v2/"+args+key)
    if res.status_code == 200:
      break
  if res.status_code != 200:
    return("Error")
  

  styleInfo = res.json()
  styleID = styleInfo['styles'][0]['id']
  
  keys = ['tb2smpfhgeayg63vx2ejcp9f', '538cs4nrsavz7afz94ru3fm5', '99bgw7sk973nr4n6ug7hm8zk']
  for key in keys:
    rep = req.get("https://api.edmunds.com/api/vehicle/v2/styles/{}/equipment?fmt=json&api_key={}".format(styleID, key))
    if rep.status_code == 200:
      break
  if rep.status_code != 200:
    return("Error")

  equipmentInfo = rep.json()
  for element in equipmentInfo['equipment']:
    if element['name'] == 'Specifications':
      for item in element['attributes']:
        if item['name'] == 'Epa Combined Mpge':
          MPG = item['value']

  for element in equipmentInfo['equipment']:
    if element['equipmentType'] == 'ENGINE':
      fuelType = element['fuelType']
      if fuelType != "electric":
        return("Error2")
  '''name = "Chevy Volt"
  MPG = 98
  fuelType = 'Electricity' '''
  return json.dumps([MPG, fuelType])

@app.route('/api/electricinfo', methods=["GET"])
def proxy_wattTime_request():
  try:
    loc = request.url.split('?')[1]
    locdata = req.get("http://maps.googleapis.com/maps/api/geocode/json?address={}".format(loc)).json()
    coords = locdata['results'][0]['geometry']['location']
    coordinates = str(coords['lng']) + " " + str(coords['lat'])
  except:
    print("Please enter a valid location.")
    return("Error3")

  try:
    res = req.get("https://api.watttime.org:443/api/v1/balancing_authorities/?loc=POINT%20({})".format(coordinates), headers={'Authorization': '85991e1a23be03497ff89a97d28e6f8778e95473'}, verify=False)
    auth = res.json()[0]['abbrev']
    link = res.json()[0]['link']
    provname = res.json()[0]['name']
    dep = req.get("https://api.watttime.org/api/v1/datapoints/?ba={}&market=RT5M&page=1&page_size=1".format(auth), verify=False)
    genmix = dep.json()['results'][0]['genmix']
    enerdict = {}
    for element in genmix:
      enerdict[element['fuel']] = element['gen_MW']
    '''link = "google.com"    
    provname = "MISO"
    enerdict = { "natgas": 15997, "wind": 4926, "other": 1410, "coal": 33795, "nuclear": 10077 } '''
    return json.dumps([provname, enerdict, link])
  except:
    print("No balancing authority found for this location.")
    return("Error4")
  

  
  

app.run(debug=True)
