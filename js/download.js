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
