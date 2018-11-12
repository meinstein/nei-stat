var max;
var scale;
var oScale;
var data;
var stat = 0;
var stat_before = 0;
var currentRoute = 'date-sort';
var format = d3.format("0,000");
var parseDate = d3.time.format("%m/%d/%y").parse;
var formatDate = d3.time.format("%b %-d, %Y");
var formatSi = d3.format(".3s");
var lastIconIndex = -1;
var selector_click_array = [];
var download_data = [];
var selector_click_array_flag = false;
var lineGen;
var area;
var careerLine;
var width;
var height;
var x;
var y;
var chart_data = [];
var $stat_button = $('.stat_button');
var $sortIndex;
var tableOffset = 185;

var statName = [

	'VIEWS',
	'LIKES',
	'DISLIKES',
	'DURATION'
]

var margin = {

	top: 10, 
	right: 8, 
	bottom: 30, 
	left: 8
};

var dd = {
	
	'views': 		0,
	'likes': 		1,
	'dislikes': 	2,
	//'comments': 	3,
	'duration': 	3,
	'date': 		4,
	'vlogNum': 		5,
	'city': 		6,
	'title': 		7,
	'music': 		8,
	'musicURL': 	9,
	//'topComment': 11,
	'url': 			10,
	'hms': 			11,
	'vlogID': 		12,
	'season': 		13,
	'chartNum': 	4,
	'chartDate': 	5
};