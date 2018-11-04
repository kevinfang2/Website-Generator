<!DOCTYPE html>
<html lang="en" class="no-js">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="Demo for the tutorial: Styling and Customizing File Inputs the Smart Way" />
		<meta name="keywords" content="cutom file input, styling, label, cross-browser, accessible, input type file" />
		<meta name="author" content="Osvaldas Valutis for Codrops" />
		<link rel="shortcut icon" href="favicon.ico">
		<link rel="stylesheet" type="text/css" href="static/css/normalize.css" />
		<link rel="stylesheet" type="text/css" href="static/css/demo.css" />
		<link rel="stylesheet" type="text/css" href="static/css/component.css" />
		<!--[if IE]>
  		<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->

		<!-- remove this if you use Modernizr -->
		<script>(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);</script>
	</head>
	<body>
    <div class="box">
      <h1> Submit your website info </h1><br>
      <form action='http://localhost:8000/frontpage_info' enctype="multipart/form-data" method="post">
        <input type="text" name="name" placeholder="Name of website"><br><br>
        <input type="text" name="image" placeholder="Link to image"><br><br>
        <input type="text" name="tagline" placeholder="Name of Tagline"><br><br>
        <input type="submit">
      </form>

    </div>
		<script src="static/js/custom-file-input.js"></script>

		<!-- // If you'd like to use jQuery, check out js/jquery.custom-file-input.js
		<script src="js/jquery-v1.min.js"></script>
		<script src="js/jquery.custom-file-input.js"></script>
		-->

	</body>
</html>
