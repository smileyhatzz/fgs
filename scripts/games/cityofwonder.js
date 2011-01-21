FGS.cityofwonderRequests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
					return;
				}			
				
				try
				{
					var src = FGS.findIframeAfterId('#app_content_114335335255741', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					
					FGS.cityofwonderRequests.Click2(currentType, id, src);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	},
	Click2: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
				
					var i1 =  dataStr.indexOf('<fb:fbml>');
					var i2 =  dataStr.indexOf('/script>',i1)-1;
					var data = dataStr.slice(i1,i2);
					
					var dataHTML = FGS.HTMLParser(data);
					
					
					info.image = $('.ally_accept', dataHTML).find('img:first').attr('src');
					var txt = $('.ally_accept', dataHTML).find('h1').text();
					
					if(txt.indexOf('You can not accept this gift') != -1)
					{
						var error_text = txt;
						FGS.endWithError('limit', 'requests', id, error_text);						
						return;
					}
					
					if(txt.indexOf('You are now allies with') != -1)
					{
						info.title = txt.replace('<br>', ' ');
						info.text  = '';
					}
					else
					{
						txt = txt.replace('You just accepted ','');
						var i2 = txt.indexOf(' from ');
						
						txt = txt.slice(0, i2);
						
						info.title = txt;
						info.text  = '';
					}
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess($type, id, info);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	}
};

FGS.cityofwonderBonuses = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				var redirectUrl = FGS.checkForLocationReload(dataStr);
				
				if(redirectUrl != false)
				{
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
					return;
				}
				
				try 
				{
					var src = FGS.findIframeAfterId('#app_content_114335335255741', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
					FGS.cityofwonderBonuses.Click2(currentType, id, src);
				} 
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		$retry 	= arguments.callee;
		$type	= currentType;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var dataHTML = FGS.HTMLParser(dataStr);
					
					var out = $.trim($('div.msgs', dataHTML).text());
					
					if(out.indexOf('You already collected this bonus') != -1 || out.indexOf('is already complete') != -1 || out.indexOf('you cannot help now') != -1 || out.indexOf('No more bonuses to collect') != -1 || out.indexOf('already helped with') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', 'bonuses', id, error_text);
					
						return;
					}
					
					info.image = 'gfx/90px-check.png';
					info.title = 'Coins';
					info.text  = out.replace('<br>', ' ');;
					info.time = Math.round(new Date().getTime() / 1000);
					
					
					var i1 = dataStr.indexOf('onclick="awardClicked(');
					if(i1 != -1)
					{
						i1+=23;
						var i2 = dataStr.indexOf("'", i1);					
						var link = dataStr.slice(i1, i2);
						dump(link);
						$.get(link);
					}
					
					FGS.endWithSuccess($type, id, info);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', $type, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					$retry(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', $type, id);
				}
			}
		});
	},
}