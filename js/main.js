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
