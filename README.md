# jQuery Mobile Listomatic Plugin

Plugin to provide jquery mobile listview pagination

## How to Use

Include the plugin after the jquery mobile plugin: 

<pre>
<script type="text/javascript" src="<Path To This File>/jquery.mobile.listomatic.js"></script> 
</pre>

Add the data-listomatic attribute to your ul list.

<pre>
<ul data-role="listview" data-filter="true" data-listomatic="true"></ul>
</pre>

# Register an Ajax function

Register an ajax function that will be called every time the "Show More" button is clicked or tapped on or when a Search is performed.

<pre>
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
			if (data) { 
				var template = $('#numbers-template').html();
				var list = Mustache.to_html(template, data);
				$('#listview').append(list).listview("refresh");
			}
		}
	});
}

$.mobile.listomatic.prototype.registerAjaxCall(getNumber);
</pre>

#Server Side Pagination

For each ajax call there will be several paramaters that will need to be hooked on to the sql query on the server side.

<pre>
$perPage    = $_REQUEST['listomatic']['perPage'];
$listOffset = $_REQUEST['listomatic']['listOffset'];
$searchTerm = $_REQUEST['listomatic']['searchTerm'];

if ($searchTerm) {
	$sql = "SELECT * FROM yourTable WHERE date LIKE '%$searchTerm%' ORDER BY date DESC LIMIT $listOffset, $perPage";
	$result = mysqli_query($con, $sql);
} else {
	$sql = "SELECT * FROM yourTable ORDER BY date DESC LIMIT $listOffset, $perPage";
	$result = mysqli_query($con,$sql);
}	
</pre>

#Configuration

<pre>
$.extend($.mobile.listomatic.prototype.options, {perPage: 5, btnLabel: 'Show Me More', refreshContent: 'daily'});
</pre>

# License

Author & copyright (c) 2013: [Stakbit](http://www.stakbit.com)

Released under the MIT license.
