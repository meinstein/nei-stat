function makeDownloadData() {
	
	selector_click_array.forEach(function(item){
		
		var newObj = {};
		var result = data.vlogs.filter(function( obj ) {
		  return obj.v[ dd.vlogID ] == parseInt(item);
		});

        newObj[ 'season' ]      =   result[0].v[ dd.season ];
		newObj[ 'vlog' ] 		= 	result[0].v[ dd.vlogNum ];
		newObj[ 'title' ] 		= 	result[0].v[ dd.title ];
		newObj[ 'date' ] 		= 	result[0].v[ dd.date ];
		newObj[ 'url' ] 		= 	'www.youtube.com' + result[0].v[ dd.url ];
		newObj[ 'music' ] 		= 	result[0].v[ dd.music ];		
		newObj[ 'views' ] 		= 	result[0].v[ dd.views ];
		newObj[ 'likes' ] 		= 	result[0].v[ dd.likes ];
		newObj[ 'dislikes' ] 	= 	result[0].v[ dd.dislikes ];
		newObj[ 'duration' ] 	= 	convertSeconds(result[0].v[ dd.duration ]);

		download_data.push(newObj)

	})

		downloadCSV({ filename: "neistat-data.csv" });

}

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    download_data = [];
    return result;
}

function downloadCSV(args) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: download_data
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}

function addEventHandlers(){

	// STAT BUTTONS
    $stat_button.on('click', function(){
       	stat = $(this).index();
       	$(this).addClass('selected').siblings().removeClass('selected');

       	if ( stat !== stat_before ) {
	        initScales();
	        transition();
	        lineTransition();
    	}
        if ( $sortIndex === 3 ) {
        	var $stat = $('.stat-sort');
			$stat.find('.fa').css('color', '#eee');
			$stat.find('.fa').removeClass('fa-angle-down');
			$stat.find('.fa').addClass('fa-angle-up');
		}
		stat_before = stat;
    });

    // TITLE+MUSIC+COMMENT
    $('.toggle-icon').on('click', function(){
    	var $this = $(this);
    	var $iconIndex = $this.index();
    	toggleIcon($this, $iconIndex);
    	toggleData($this, $iconIndex);
    })

    // SORT EVENTS
	var $sort = $('.sort');
	$sort.on('click', function(){

		var $this;
		$sortIndex = $(this).index();
		if 		($sortIndex === 1){$this = $('.vlog-sort')}
		else if ($sortIndex === 2){$this = $('.city-sort')}
		else if	($sortIndex === 3){$this = $('.stat-sort')}

		$sort.find('.fa').css('color','#eee');
		$this.find('.fa').css('color','indianred')
		toggleSortArrows( $this );
	})

	$('td.selector').on('click', function(){
		var $this = $(this);
		var $thisIcon = $this.find('span');
		selectorClick( $this, $thisIcon )
	});

	$('th.lock-icon').on('click', function(d){
		$thisIcon = $(this).find('span');
		lockIconClick($thisIcon);
	});

	$('.fa-info-circle').on('click', function(event){
		event.stopPropagation();
		initAbout();
	})

	$('#about').on('click', function(event){
		event.stopPropagation();
		closeAbout();	
	})
}

function lockIconClick($thisIcon) {

	if ($thisIcon.hasClass('fa-unlock-alt')){
		$thisIcon.removeClass('fa-unlock-alt');
		$thisIcon.addClass('fa-lock');

		$('#line_chart').addClass('fix-line-chart');
		$('#template_holder').addClass('template-holder-margin');
		$("#header-fixed").addClass('header-fixed-margin');

		tableOffset = 1;

	} else {
		$thisIcon.removeClass('fa-lock');
		$thisIcon.addClass('fa-unlock-alt');

		$('#line_chart').removeClass('fix-line-chart');
		$('#template_holder').removeClass('template-holder-margin');
		$("#header-fixed").removeClass('header-fixed-margin');

		tableOffset = 185;
	}
}

function selectorClick( $this, $thisIcon ) {

	var thisDatum, thisStat, thisNum;

	if ($thisIcon.hasClass('fa-square-o')){
		$thisIcon.removeClass('fa-square-o');
		$thisIcon.addClass('fa-check-square-o');
		$thisIcon.closest('.main-row').addClass('selected-row');

		thisDatum = d3.select($this[0].parentNode).datum();
		thisStat = thisDatum.v[stat];
		thisNum = thisDatum.v[dd.vlogID];
		addMarker(thisStat, thisNum);
		selector_click_array.push(thisNum);
		selector_click_array_flag = true;
		$('.a-download').removeClass('freeze');

	} else {
		$thisIcon.removeClass('fa-check-square-o');
		$thisIcon.addClass('fa-square-o');
		$thisIcon.closest('.main-row').removeClass('selected-row');

		thisDatum = d3.select($this[0].parentNode).datum();
		thisStat = thisDatum.v[stat];
		thisNum = thisDatum.v[dd.vlogID];
		removeMarker(thisNum);
	}
}

function removeMarker(thisNum ){
	d3.select('#id_' + thisNum).remove();
	var index = selector_click_array.indexOf(thisNum);
	if (index > -1) {
	    selector_click_array.splice(index, 1);
	}
	if (selector_click_array.length === 0){
		selector_click_array_flag = false;
		$('.a-download').addClass('freeze');
	}
}

function toggleData($this, $iconIndex) {

	var index;
	if ($iconIndex === 5) {
		d3.select($this[0].parentNode.parentNode).select('.toggle-text')
			.html(function(d){
				return "<a href=http://www.youtube.com" + d.v[dd.url] + " target='_blank'>" +
						"<i class='fa fa-youtube-play'></i>" + 
						d.v[dd.title] +
						"</a>"
			})
	}
	else if ($iconIndex === 6) {
		d3.select($this[0].parentNode.parentNode).select('.toggle-text')
			.html(function(d){
				return 'Published on ' + formatDate(parseDate(d.v[dd.date]))
			})
	}
	else if	($iconIndex === 7) {
		d3.select($this[0].parentNode.parentNode).select('.toggle-text')
			.html(function(d){
				if (d.v[dd.musicURL].charAt(0) === '/'){
					return "Music by: <a href=http://www.soundcloud.com" + d.v[dd.musicURL] + " target='_blank'>" + d.v[dd.music]
							+ "<i class='fa fa-angle-double-right'></i>"
							+ "</a>"
				}
				else if ( d.v[dd.musicURL] === 'na' ) {
					return 'N/A'
				}
				else {
					return "Music by: <a href=" + d.v[dd.musicURL] + " target='_blank'>" + d.v[dd.music] 
					+ "<i class='fa fa-angle-double-right'></i>"
					+ "</a>"
				}
			})
	}
}

function toggleIcon($this, $iconIndex) {

	if ($this.closest('.main-row').next().is(':visible') && $iconIndex === lastIconIndex) {
		$this.closest('.main-row').next().toggle();
		$('td.toggle-icon').removeClass('td-selected');
	} 
	else if ($this.closest('.main-row').next().is(':visible') && $iconIndex !== lastIconIndex) {
		$('td.toggle-icon').removeClass('td-selected');
		$this.addClass('td-selected');
	}
	else {
		$('tr.toggle-row').hide();
		$('td.toggle-icon').removeClass('td-selected');
		$this.closest('.main-row').next().toggle();
		$this.addClass('td-selected')
	}

	lastIconIndex = $iconIndex;

}

function initAbout(){
	$('#about').fadeIn('fast');
}

function closeAbout(){
	$('#about').fadeOut('fast');
}

function transition(){
	d3.select('.totals-label').html(statName[ stat ]);
	// update legend stats and sub totals
	d3.selectAll('.avg').style('opacity', 0).html(function(d){
		if (stat !== dd.duration){
			return formatAbbrv(data.avg[ stat ])
		} else {
			return convertSeconds(data.avg[ stat ])
		}
	}).transition().duration(500)
		.style('opacity', 1);
	d3.select('#stat-total').style('opacity', 0).html(function(d){
		if (stat !== dd.duration){
			return formatAbbrv(data.totals[ stat ])
		} else {
			return convertSecondsToHours(data.totals[ stat ])
		}
	}).transition().duration(500)
		.style('opacity', 1);
	d3.selectAll('.stat-name').style('opacity', 0).html(statName[ stat ]).transition().duration(500)
		.style('opacity', 1);
	d3.selectAll('.main-row').select('.stat').style('opacity', 0).html(function(d){
		if (stat !== dd.duration){
			return formatAbbrv(d.v[ stat ])
		} else {
			return d.v[ dd.hms ]
		}
	}).transition().duration(600).style('opacity', 1);
	// d1
	d3.selectAll('.main-row').select('.d1').transition().duration(1000)
	.styleTween('width', function(d, i, a){
		return d3.interpolateString(this.style.width, scale(d.v[ stat ]) + "%")
	})
	.style('opacity', function(d){
		return oScale(d.v[ stat ])
	});
	// d2
	d3.selectAll('.d2').transition().duration(1000).styleTween('width', function(d, i, a){
		return d3.interpolateString(this.style.width, scale(data.avg[ stat ]) + "%")
	});
}
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
function formatLineData() {
	var i;
	for (i = 0; i < data.vlogs.length; i++) {
		chart_data.push(
			{"v":[
				data.vlogs[i].v[dd.views],
				data.vlogs[i].v[dd.likes],
				data.vlogs[i].v[dd.dislikes],
				data.vlogs[i].v[dd.duration],
				data.vlogs[i].v[dd.vlogID],
				data.vlogs[i].v[dd.date]
			]
		});
	}

	$('.chart-loader').fadeOut('fast', function(){
		initLineChart();
		d3.select('svg').transition().duration(350)
			.style('opacity', 1);
	})

}

function initLineChart() {

	max = d3.max( chart_data, function(d){ return d.v[ stat ] });

	width = parseInt(d3.select('#line_chart').style('width'), 10);
	height = parseInt(d3.select('#line_chart').style('height'), 10);

	var svg = d3.select('#line_chart').append('svg')
		.attr('width', width)
		.attr('height', height)
		.style('background', '#1c1c1c')
		.style('opacity', 0);

	var x = d3.scale.linear()
			.range([margin.left, width - margin.right])
			.domain([ chart_data[0].v[dd.chartNum], chart_data[chart_data.length - 1].v[dd.chartNum] ]);

	var axisScale = d3.time.scale()
			.domain([ parseDate(chart_data[0].v[dd.chartDate]), parseDate(chart_data[chart_data.length - 1].v[dd.chartDate]) ])
			.range([margin.left, width - margin.right]);


	var y = d3.scale.linear().range([height - margin.bottom, margin.top]).domain([0, max]);

	var xAxis = d3.svg.axis()
	              .scale(axisScale)
	              // .tickFormat(d3.time.format('%-m/%-d/%y'))
	              .tickFormat(d3.time.format('%b %y'))
	              .outerTickSize(0)
	              .orient("bottom");

  	svg.append("g")
  		.attr("class", "axis")
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
  		.call(xAxis);

    lineGen = d3.svg.line()
        .x(function( d ) {return x( d.v[dd.chartNum] ); })
        .y(function( d ) {return y( d.v[ stat ] ); })
        .interpolate("cardinal");

    area = d3.svg.area()
        .x(function(d) { return x( d.v[dd.chartNum] ); })
        .y0(height - margin.bottom )
        .y1(function(d) {return y( d.v[ stat ] ); })
        .interpolate("cardinal");

    svg.append('path')
	    .datum(chart_data)
	    .attr('class', 'area')
	    .attr('fill', 'indianred')
	    .attr('opacity', 0.5)
	    .attr('shape-rendering', 'geometricPrecision')
	    .attr('d', area);

    svg.append('svg:path')
        .attr('d', lineGen( chart_data ))
        .attr('class', 'main-line')
        .attr('stroke', 'indianred')
        .attr('stroke-width', 2)
        .attr('opacity', 1)
        .attr('shape-rendering', 'geometricPrecision')
        .attr('fill', 'none');

    svg.append("svg:line")
    	.attr("class", "average-line")
	    .attr("x1", margin.left )
	   	.attr("y1", y( data.avg[stat] ) )
	    .attr("x2", width - margin.right )
	    .attr("y2", y( data.avg[stat] ) )
	    .style("stroke-width", 3)
	    .style("stroke-dasharray", ("7, 3"))
	    .style("opacity", 1)
	    .style("stroke", "3090c7"); 

 }

function resize() {

	width = parseInt(d3.select('#line_chart').style('width'), 10);

	var x = d3.scale.linear()
			.range([margin.left, width - margin.right])
			.domain([ chart_data[0].v[dd.chartNum], chart_data[chart_data.length - 1].v[dd.chartNum] ]);

	var axisScale = d3.time.scale()
			.domain([ parseDate(chart_data[0].v[dd.chartDate]), parseDate(chart_data[chart_data.length - 1].v[dd.chartDate]) ])
			.range([margin.left, width - margin.right]);


	var y = d3.scale.linear().range([height - margin.bottom, margin.top]).domain([0, max]);

	var xAxis = d3.svg.axis()
	              .scale(axisScale)
	              .tickFormat(d3.time.format('%-m/%-d/%y'))
	              .outerTickSize(0)
	              .orient("bottom");

	d3.select('svg').attr('width', width);

	d3.select('.axis')
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
  		.call(xAxis);

    lineGen = d3.svg.line()
        .x(function( d ) {return x( d.v[dd.chartNum] ); })
        .y(function( d ) {return y( d.v[ stat ] ); })
        .interpolate("cardinal");

    area = d3.svg.area()
        .x(function(d) { return x( d.v[dd.chartNum] ); })
        .y0(height - margin.bottom )
        .y1(function(d) {return y( d.v[ stat ] ); })
        .interpolate("cardinal");

    d3.select("line.average-line")
	    .attr("x1", margin.left )
	    .attr("x2", width - margin.right );

    d3.select('path.main-line')
    	.attr('d', lineGen( chart_data ))

    d3.select('path.area')
	    .datum(chart_data)
	    .attr('d', area);

	d3.selectAll('.marker')
		.attr("cx", function(d){
			return x(d.v[dd.chartNum])
		});

}

function lineTransition() {


	max = d3.max( chart_data, function(d){ return d.v[ stat ] });

	var x = d3.scale.linear()
			.range([margin.left, width - margin.right])
			.domain([ chart_data[0].v[dd.chartNum], chart_data[chart_data.length - 1].v[dd.chartNum] ]);

	var axisScale = d3.time.scale()
			.domain([ parseDate(chart_data[0].v[dd.chartDate]), parseDate(chart_data[chart_data.length - 1].v[dd.chartDate]) ])
			.range([margin.left, width - margin.right]);

	var y = d3.scale.linear().range([height - margin.bottom, margin.top]).domain([0, max]);
	var yMarker = d3.scale.linear().range([2, 8]).domain([0, max]);

    lineGen = d3.svg.line()
        .x(function( d ) { return x( d.v[dd.chartNum] ); })
        .y(function( d ) { return y( d.v[ stat ] ); })
        .interpolate("cardinal");

    area = d3.svg.area()
        .x(function(d) { return x( d.v[dd.chartNum] ); })
        .y0(height - margin.bottom )
        .y1(function(d) {return y( d.v[ stat ] ); })
        .interpolate("cardinal");

    d3.select("line.average-line")
    	.transition().duration(1000)
    	.attr("y1", y(data.avg[ stat ] ) )
	    .attr("y2", y(data.avg[ stat ] ) );

    d3.select('path.main-line')
    	.transition().duration(1000)
    	.attr('d', lineGen( chart_data ))

   d3.select('path.area')
	    .datum(chart_data)
	    .transition().duration(1000)
	    .attr('d', area);

	 d3.selectAll('.marker')
    	.transition().duration(1000)
    	.attr("r", function(d){
			return yMarker(d.v[stat])
		})
		.attr("cy", function(d){
			return y(d.v[stat])
		});
}

function addMarker(thisStat, thisNum){

	max = d3.max( chart_data, function(d){ return d.v[ stat ] });
	width = parseInt(d3.select('#line_chart').style('width'), 10);
	height = parseInt(d3.select('#line_chart').style('height'), 10);

	var svg = d3.select('svg');

	var x = d3.scale.linear()
			.range([margin.left, width - margin.right])
			.domain([ chart_data[0].v[dd.chartNum], chart_data[chart_data.length - 1].v[dd.chartNum] ]);

	var y = d3.scale.linear().range([height - margin.bottom, margin.top]).domain([0, max]);
	var yMarker = d3.scale.linear().range([2, 8]).domain([0, max]);
	var arrLength = chart_data.length - parseInt(thisNum) + 1;



	svg.append('circle')
		.datum(chart_data[ arrLength ])
		.attr("class", "marker")
		.attr('id', 'id_' + thisNum )
    	.attr('r', function(d){
    		return yMarker(d.v[stat])
    	})
    	.attr('stroke-width', 1)
    	.attr('stroke', '#eee')
    	.attr("fill", "rgba(238, 238, 238, 0.5)")
    	.attr("cx", function(){
    		return x( thisNum )
    	})
    	.attr("cy", function(){
    		return y( thisStat )
    	});
    	// .on("click", function(d){console.log(d.v[stat])})
}
function loadData() {
  // var url = "https://dl.dropboxusercontent.com/u/106304615/data.json";
  var url = '../data/data.json'
  d3.json(url, function(error, json) {
    if (error) return console.warn(error)
    data = json
    renderTemplate()
    formatLineData()
  })
}

function renderTemplate() {
  $stat_button.eq(stat).addClass('selected')

  $template_holder = $('#template_holder')

  $template_holder.fadeOut('fast', function() {
    $(this).empty()
    var template = $('#template').html(),
      rendered = Mustache.render(template, data)
    $(this).html(rendered)
    $(this).fadeIn('slow')
    $('.footer').fadeIn('slow')

    bindData()
    cloneHeader()
    addEventHandlers()
  })
}

function bindData() {
  d3.selectAll('.container')
    .data(data.vlogs)
    .enter()

  // add dates + playoffs
  d3.selectAll('.container')
    .select('.main-row')
    .select('.vlog')
    .html(function(d) {
      return 'S' + d.v[dd.season] + "<span class='episode'>V" + vlogFormat(d.v[dd.vlogNum]) + '</span>'
    })
  // add relevant city
  d3.selectAll('.container')
    .select('.main-row')
    .select('.city')
    .html(function(d) {
      return d.v[dd.city]
    })
  // add relevant metric
  d3.selectAll('.container')
    .select('.main-row')
    .select('.stat')
    .html(function(d) {
      return formatAbbrv(d.v[stat])
    })

  d3.selectAll('.avg').html(formatAbbrv(data.avg[stat]))
  d3.select('#vlog-count-val').html(formatAbbrv(data.subs))
  d3.selectAll('.last-updated-val').html(data.timestamp)
  d3.select('#stat-total').html(formatAbbrv(data.totals[stat]))
  d3.selectAll('.stat-name').html(statName[stat])
  d3.select('.totals-label').html(statName[stat])

  initScales()
  initMarker()
  initBar()
}

function initBar() {
  d3.selectAll('.main-row')
    .select('.d1')
    .style('width', function(d) {
      return scale(d.v[stat]) + '%'
    })
    .style('opacity', function(d) {
      return oScale(d.v[stat])
    })
}

function initMarker() {
  d3.selectAll('.d2').style('width', scale(data.avg[stat]) + '%')
}

function initScales() {
  max = d3.max(data.vlogs, function(d) {
    return d.v[stat]
  })
  scale = d3.scale
    .linear()
    .domain([0, max])
    .range([0, 97])
  oScale = d3.scale
    .linear()
    .domain([0, max])
    .range([0.4, 1])
}

function formatAbbrv(x) {
  var s = formatSi(x)
  switch (s[s.length - 1]) {
    case 'G':
      return s.slice(0, -1) + 'B'
  }
  return s
}

function vlogFormat(x) {
  if (x >= 100) {
    return x
  } else if (x >= 10 && x < 100) {
    return '0' + x
  } else if (x < 10) {
    return '00' + x
  } else {
    return x
  }
}

function convertSeconds(x) {
  var minutes = Math.floor(x / 60)
  var seconds = x % 60

  if (seconds < 10) {
    return minutes + ':0' + seconds
  } else {
    return minutes + ':' + seconds
  }
}

function convertSecondsToHours(x) {
  var minutes = Math.floor(x / 60)
  var hours = Math.floor(minutes / 60)
  var leftOverMinutes = minutes % 60

  if (leftOverMinutes < 10) {
    return hours + ':0' + leftOverMinutes + ':00'
  } else {
    return hours + ':' + leftOverMinutes + ':00'
  }
}

function cloneHeader() {
  var $header = $('#table > thead').clone()
  var $fixedHeader = $('#header-fixed').append($header)
  $header
    .find('th.lock-icon > span')
    .removeClass('fa-unlock-alt')
    .addClass('fa-lock')
  $header.find('th.lock-icon').addClass('avoid-clicks')

  setInterval(function() {
    var offset = $(window).scrollTop()

    if (offset >= tableOffset && $fixedHeader.is(':hidden')) {
      $fixedHeader.show()
    } else if (offset < tableOffset) {
      $fixedHeader.hide()
    }
  }, 100)
}

$(window).resize(function() {
  resize()
})

$(document).ready(function() {
  loadData()
})

function toggleSortArrows( $this ) {

	var $thisAngle = $this.find('.fa');
	var $siblings = $this.siblings('.sort').find('.fa');

	if (! $thisAngle.hasClass('fa-angle-down')) {

		$siblings.removeClass('fa-angle-down');
		$siblings.addClass('fa-angle-up');
		$thisAngle.removeClass('fa-angle-up'); 
		$thisAngle.addClass('fa-angle-down'); 

		sortData();
	}
}

function sortData() {

	if ( $sortIndex === 1 ){
		data.vlogs.sort(function(a,b){
			return b.v[ dd.vlogID ] - a.v[ dd.vlogID ];
		})
	}

	if ( $sortIndex === 2 ){
		data.vlogs.sort(function(a,b){
			return d3.ascending(a.v[ dd.city ], b.v[ dd.city ]) || a.v[ dd.vlogID ] - b.v[ dd.ID ];
		})
	}

	if ( $sortIndex === 3 ){
		data.vlogs.sort(function(a,b){
			return b.v[ stat ] - a.v[ stat ] || a.v[ dd.vlogID ] - b.v[ dd.vlogID ];
		})	
	}

	updateForSort();

}

function updateForSort(){
	// hide any toggle-rows
	$('.toggle-row').hide();
	$('.toggle-icon').removeClass('td-selected');
	// re-bind correct data
	var container = d3.selectAll('.container').data(data.vlogs);
	container.exit().remove();
	container.enter();

	d3.selectAll('.container').select('.main-row').select('.d1')
		.style('opacity', 0)
		.style('width', function(d){
			return scale(d.v[ stat ]) + "%";
		})
		.transition().duration( 1000 )
		.style('opacity', function(d){
			return oScale(d.v[ stat ]);
		});

	d3.selectAll('.container').select('.main-row').select('.stat')
		.style('opacity', 0)
		.html(function(d){
			if (stat !== dd.duration){
				return formatAbbrv(d.v[ stat ])
			} else {
				return d.v[ dd.hms ]
			}
		})
		.transition().duration( 1000 )
		.style('opacity', 1);

	d3.selectAll('.container').select('.main-row').select('.vlog')
		.style('opacity', 0)
		.html(function(d){ 
			return  "S" + d.v[ dd.season ] 
					+ "<span class='episode'>V"
					+ vlogFormat(d.v[ dd.vlogNum ]) 
					+ "</span>"
		})
		.transition().duration( 1000 )
		.style('opacity', 1);

	d3.selectAll('.container').select('.main-row').select('.city')
		.style('opacity', 0)
		.html(function(d){ return d.v[ dd.city ] })
		.transition().duration( 1000 )
		.style('opacity', 1);

	d3.selectAll('.container').select('.main-row').select('.circle')
		.style('opacity', 0)
		.classed('fa-square-o fa-check-square-o', false)
		.classed( 'fa-check-square-o', function(d){
			return selector_click_array.indexOf(d.v[dd.vlogID]) > -1
		})
		.classed( 'fa-square-o', function(d){
			return selector_click_array.indexOf(d.v[dd.vlogID]) === -1
		})
		.transition().duration( 1000 )
		.style('opacity', 1);

	d3.selectAll('.container').select('.main-row')
		.style('opacity', 0)
		.classed('selected-row', false)
		.classed('selected-row', function(d){
			return selector_click_array.indexOf(d.v[dd.vlogID]) > -1
		})
		.transition().duration( 1000 )
		.style('opacity', 1);
}