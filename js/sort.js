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