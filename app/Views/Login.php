<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link rel="icon" type="image/png" sizes="16x16" href="../assets/images/favicon.png">
   <title><?php echo $title;?></title>
   <?php
   echo css_tag([
      'css/bootstrap.min.css',
      'css/blue.min.css',
      'css/style.min.css'
   ]);
   echo '<style type="text/css">';
   $minify = new \App\Libraries\Minify();
   echo $minify->css('public/css/blue.min.css');
   echo '</style>';
   ?>
   <!--[if lt IE 9]>
   <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
   <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
   <![endif]-->
</head>

<body>
   <section id="wrapper"></section>
   <?php
   echo script_tag([
      'js/jquery.min.js',
      'js/popper.min.js',
      'js/bootstrap.min.js',
   ]);
   echo '<script type="text/javascript">';
   echo 'var baseURL = "' . base_url() . '",';
   echo 'siteURL = "' . site_url() . '";';
   echo '</script>';
   echo $internalJs;
   ?>
</body>
</html>