# jQuery Mobile Listview Pagination Plugin (aptly named  Listomatic)

Plugin to provide jquery mobile listview pagination. Try the demo at http://listomatic.stakbit.com/

## Requirements

Works on jQuery Mobile 1.3.0 (grab the latest copy at http://jquerymobile.com), though might work with older versions - never tested with old versions

## How To Use

First download the Listomatic plugin (jquery.mobile.listomatic.js)

Include the Listomatic plugin after the jquery mobile library: 

`<script type="text/javascript" src="<Path To This File>/jquery.mobile.listomatic.js"></script>`

Add the "data-listomatic" attribute to your ul list with a value of "true". You can also add the search box by adding the "data-filter" attribute with a value of "true".

`<ul id="listview" data-role="listview" data-filter="true" data-listomatic="true"></ul>`

The Listomatic plugin will take care of the rest, including setting sensible defaults (ie, 10 records per page, remembering state (ie, list offsets) and caching where appropriate for a great user experience.

# Register an Ajax Function

Register an Ajax function that will be called every time the "Show More" button is clicked or tapped on or when a "Search" is performed.

<pre>
$(document).on("pageinit", function(){
	var serviceURL = "http://www.your-domain.com/returns-json-numbers.php";	
	var getNumber = function() {
		return $.ajax({
			type: "post",
			beforeSend: function() { $.mobile.loading( 'show' ) }, //Show spinner
			complete: function() { $.mobile.loading( 'hide' ) }, //Hide spinner
			async: "true",
			dataType: 'json',
			url: serviceURL,
			data: { listomatic: $.mobile.listomatic.prototype.getResults() },
			success: function(data) {
				if (data.numbers) {
					var list = '';
					$.each(data.numbers, function(index, value) {
						list += '&lt;li data-icon="false" data-filtertext="' + value.date + '">' +
								'&lt;div class="latestNumber">' +
								'&lt;span class="circle">' + value.number[1] + '&lt;/span>' +
								'&lt;span class="circle">' + value.number[2] + '&lt;/span>' +
								'&lt;span class="circle">' + value.number[3] + '&lt;/span>' +
								'&lt;span class="circle">' + value.number[4] + '&lt;/span>' +
								'&lt;span class="circle">' + value.number[5] + '&lt;/span>' +
								'&lt;span class="circle powerball">' + value.number[6] + '&lt;/span>' +
								'&lt;/div>' +
								'&lt;p style="text-align:center;" class="latestNumberDate">' + value.date + '&lt;/p>' +
								'&lt;/li>';
					}); // end each	
				} // end if
				$('#listview').append(list).listview("refresh");
			} // end success
		}); // end ajax
	}
	$.extend($.mobile.listomatic.prototype.options, {perPage: 2, btnLabel: 'Show Me More', refreshContent: 'daily'});
	$.mobile.listomatic.prototype.registerAjaxCall(getNumber);
});
</pre>



#Server Side Configuration To Enable Pagination

For each Ajax call there will be several paramaters that will need to be hooked on to the sql query on the server side to allow for pagination by only getting a subset of records, one at a time.

<pre>
$perPage    = $_REQUEST['listomatic']['perPage'];
$listOffset = $_REQUEST['listomatic']['listOffset'];
$searchTerm = $_REQUEST['listomatic']['searchTerm'];

if ($searchTerm) {
	$sql = "SELECT * FROM yourTable 
	WHERE date LIKE '%$searchTerm%' 
	ORDER BY date DESC LIMIT $listOffset, $perPage";
	$result = mysqli_query($con, $sql);
} else {
	$sql = "SELECT * FROM yourTable 
	ORDER BY date DESC LIMIT $listOffset, $perPage";
	$result = mysqli_query($con,$sql);
}

while($row = mysqli_fetch_array($result)) {
	$aData['numbers'][] = array('date' => $row['date'] , 
				     'number' => array(1 => $row['num1'],
							2 => $row['num2'],
							3 => $row['num3'],
							4 => $row['num4'],
							5 => $row['num5'],
							6 => $row['num6']));
}
echo json_encode($aData);
exit;
</pre>

#Configuration 

The Listomatic plugin will set some default settings that can be overwritten, such as number of records to return per call (perPage), label text for the "Show More" button (btnLabel) and an option to refresh content (refreshContent), if set to 'false' the page will not refresh, if set to 'true' the page will refresh at midnight. 

<pre>
$.extend($.mobile.listomatic.prototype.options, {perPage: 5, btnLabel: 'Show Me More', refreshContent: true});
</pre>

# License

Author & copyright (c) 2013: [Stakbit](http://www.stakbit.com)

Released under the MIT license.
