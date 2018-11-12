import csv
import time
import re
from json import dumps
from urllib import urlopen
from bs4 import BeautifulSoup
import datetime
import os

# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC

fileName = datetime.datetime.now().strftime("%-m-%-d-%y_%I_%M_%p")
#get path to public dropbox folder
save_path = '/Users/maxeinstein/Dropbox/Public'
name_of_file = 'data.json'
completeName = os.path.join(save_path, name_of_file)  


csv_input = open('csv_input/NEISTAT_MASTER.csv', 'rU')
reader = csv.reader(csv_input)
#reader = csv.reader(open(csv_input, 'rU'), dialect=csv.excel_tab)
next(reader, None) # skip headers
output = {}
vlogs = []
ytBase = "http://youtube.com/"
viewsTotal = 0
likesTotal = 0
dislikesTotal = 0
commentsTotal = 0
durationTotal = 0
counter = 0

# delay = 20 # seconds
# driver = webdriver.Firefox()
now = datetime.datetime.now().strftime("%-m/%-d/%y at %I:%M %p")
now = 'Last updated on ' + now + ' UTC-8:00'

def tt(a):
	b = a.split(':')
	return int(b[0]) * 60 + int(b[1])

for row in reader:

	#id
	vlogID = row[ 7 ]
	if counter == 0:
		totalLen = 	vlogID

	#num
	vlogNum = row[ 6 ]
	#season
	season = row[ 8 ]
	#title
	title = row[ 0 ]
	#duration
	hms = row[ 2 ]
	duration = tt(hms)
	#music
	music = row[ 3 ]
	musicURL = row[ 4 ] 
	#city
	city = row[ 5 ]

	#url
	url = row[ 1 ]

	# driver.get( ytBase + url )

	# try:

	# 	WebDriverWait(driver, delay).until(EC.presence_of_element_located((By.ID, 'comment-section-renderer-items')))

	# finally:

		#html = driver.page_source
	html = urlopen( ytBase + url )
	soup = BeautifulSoup(html, "html.parser")

	#vidTitle = soup.find("h1", {"class", "watch-title-container"}).text.strip()
	#description = soup.find("p", {"id": "eow-description"}).get_text()

	#subscribers
	subs = soup.find("span", {"id": "watch7-subscription-container"}).findAll("span", {"class", "yt-subscriber-count"})[0].text
	subs = int(re.sub("[^0-9]", "", subs))
	#date
	date = soup.find("div", {"id": "watch-uploader-info"}).text
	date = date.split(' ',2)[2]
	date = datetime.datetime.strptime(date, "%b %d, %Y") 
	date = date.strftime('%-m/%-d/%y')
	#views
	views = soup.find("div", {"class", "watch-view-count"}).text
	views = int(re.sub("[^0-9]", "", views))
	#likes
	likes = soup.find("div", {"id": "watch8-sentiment-actions"}).findAll("span", {"class", "yt-uix-button-content"})[0].text
	likes = int(re.sub("[^0-9]", "", likes))
	#dislikes
	dislikes = soup.find("div", {"id": "watch8-sentiment-actions"}).findAll("span", {"class", "yt-uix-button-content"})[3].text
	dislikes = int(re.sub("[^0-9]", "", dislikes))
	#comments
	# comments = soup.find("h2", {"class", "comment-section-header-renderer"}).get_text().split(" ")[2]
	# comments = int(comments.replace(',',''))
	#top comment
	# topComment = soup.find("div", {"id": "comment-section-renderer-items"}).findAll("div", {"class", "comment-renderer-text-content"})[0].get_text()
	# topComment = topComment.replace(u'\ufeff', '')
	# topComment = topComment.replace('"', "'")

	viewsTotal += views
	likesTotal += likes
	dislikesTotal += dislikes
	# commentsTotal += comments
	durationTotal += duration

	counter += 1

	print `counter` + ' out of ' + totalLen
	# print title
	# print views
	# print '///////////////'

	dic = {"v":[
				views,
				likes,
				dislikes,
				#comments,
				duration,
				date,
				vlogNum,
				city,
				title,
				music,
				musicURL,
				#topComment,
				url,
				hms,
				vlogID,
				season
			]}

	vlogs.append(dic)
	# time.sleep(1)

# driver.close()

totalsDic = [
		viewsTotal,
		likesTotal,
		dislikesTotal,
		#commentsTotal,
		durationTotal
	]

avgDic = [
		int(viewsTotal / counter),
		int(likesTotal / counter),
		int(dislikesTotal / counter),
		#int(commentsTotal / counter),
		int(durationTotal / counter)
	]

output['totals'] = totalsDic
output['avg'] = avgDic
output['vlogs'] = vlogs
output['timestamp'] = now	
output['subs'] = subs	

json_output = open('json_output/' + fileName + '.json', 'w')
json_output.write(dumps(output, json_output, separators=(',',':'), sort_keys=True))

public_output = open(completeName, 'w')	
public_output.write(dumps(output, json_output, separators=(',',':'), sort_keys=True))

# dic = {"v":[
# 			views,		YES - auto
# 			likes,		YES - auto
# 			dislikes,	YES - auto
# 			comments,	YES - auto
# 			duration,	YES - hand
# 			date,		YES - auto
# 			vlogNum,	YES	- hand/auto?
# 			city,		YES - hand
# 			title,		YES - auto
# 			music,		YES	- hand
# 			musicURL,	YES - hand
# 			topComment,	YES - auto
# 			url 		YES - auto
# 		]}


