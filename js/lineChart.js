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