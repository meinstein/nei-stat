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