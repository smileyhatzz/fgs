FGS.petvilleFreegifts = 
{
	Click: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://apps.facebook.com/petvillegame/'+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					i1          =   dataStr.indexOf('post_form_id:"')
					if (i1 == -1) throw {message:'Cannot post_form_id in page'}
					i1			+=	14;
					i2          =   dataStr.indexOf('"',i1);
					
					params.post_form_id = dataStr.slice(i1,i2);
					
					
					i1          =   dataStr.indexOf('fb_dtsg:"',i1)
					if (i1 == -1) throw {message:'Cannot find fb_dtsg in page'}
					i1			+=	9;
					i2          = dataStr.indexOf('"',i1);
					params.fb_dtsg		= dataStr.slice(i1,i2);

					
					
					var paramTmp = FGS.findIframeAfterId('#app_content_163576248142', dataStr);
					if(paramTmp == '') throw {message: 'no iframe'}
					
					var i1 = paramTmp.indexOf('pv_session=')+11;
					var i2 = paramTmp.indexOf('&', i1);
					
					
					
					params.pv_session = paramTmp.slice(i1, i2);
					FGS.petvilleFreegifts.Click2(params);
					
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	Click2: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;		
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		$.ajax({
			type: "GET",
			url: 'http://fb-client-0.petville.zynga.com/current/gifts_send.php?pv_session='+params.pv_session+'&giftRecipient=&ref=tab&view=petville&overlayed=true&send_gift=Proceed+to+Send+%3E%3E%3E&gift='+params.gift+addAntiBot,
			dataType: 'text',
			success: function(dataStr)
			{
				try
				{
					var strTemp = dataStr;

					if(dataStr.indexOf('snml:') == -1)
					{
						retry = true;
						throw {message: 'invalid gift'}
					}
					
					var data = dataStr.replace(/snml:/g, 'fb_');
					
					var outStr = '';
					
					
					
					var i1 = data.indexOf('<fb_serverSnml');
					
					var s1 = data.indexOf('<table', i1);
					var s2 = data.indexOf('/center>', s1);
					
					outStr += data.slice(s1, s2+8);
					
					//var s1 = data.indexOf('<div', i1);
					//var s2 = data.indexOf('/div', s1);
					
					//outStr += data.slice(s1, s2+5);
					
					var s1 	= data.indexOf('<fb_multi-friend-selector', i1);
					var s11 = data.indexOf('exclude_ids="', s1);
					s11+=13;
					var s12 = data.indexOf('"', s11);

					var exclude = data.slice(s11, s12);
					
					var f1 = data.indexOf('<fb_request-form', i1);
					
					var i1 = data.indexOf('invite="', f1);
					var a1 = data.indexOf('action="', f1);
					var m1 = data.indexOf('method="', f1);
					var t1 = data.indexOf('type="', f1);
					
					//outStr += '<div class="mfs">';
					
					var inviteAttr 	= data.slice(i1+8, data.indexOf('"', i1+8));
					var actionAttr	= data.slice(a1+8, data.indexOf('"', a1+8));
					var methodAttr 	= data.slice(m1+8, data.indexOf('"', m1+8));
					var typeAttr	= data.slice(t1+6, data.indexOf('"', t1+6));
					
					var c1 = data.indexOf('<fb_content', f1);
					var c11 = data.indexOf('>', c1);
					var c12 = data.indexOf('/fb_content>',c11);
					
					var contentTmp = data.slice(c11+1, c12-1).replace(/\"/g, "'");
					
					var contentAttr = FGS.encodeHtmlEntities(contentTmp);

					//$(FGS.HTMLParser('<p class="link" href="'+contentTmp+'">abc</p>')).find('p.link').attr('href');
					//var contentAttr = encodeURIComponent(data.slice(c11+1, c12-1));
					//var contentAttr = data.slice(c11+1, c12);
					
					
					outStr += '<fbGood_request-form invite="'+inviteAttr+'" action="'+actionAttr+'" method="'+methodAttr+'" type="'+typeAttr+'" content="'+contentAttr+'"><div><fb:multi-friend-selector cols="5" condensed="true" max="30" unselected_rows="6" selected_rows="5" email_invite="false" rows="5" exclude_ids="EXCLUDE_ARRAY_LIST" actiontext="Select a gift" import_external_friends="false"></fb:multi-friend-selector><fb:request-form-submit import_external_friends="false"></fb:request-form-submit><a style="display: none" href="http://fb-0.FGS.cityville.zynga.com/flash.php?skip=1">Skip</a></div></fbGood_request-form>';
					
					
					
					outStr += '</td></tr></table>';
					
					var cmd_id = new Date().getTime();
					
					var i1 = data.indexOf('SNAPI.init(');
					var i2 = data.indexOf('{', i1);
					var i3 = data.indexOf('}},', i2)+2;
					
					var session = data.slice(i2,i3);
					
					var exArr = exclude.split(',');
					
					var str = '';
					$(exArr).each(function(k,v)
					{
						str += '"'+v+'"'
						
						if(k+1 < exArr.length)
							str+= ',';
					});
					
					var i1 = data.indexOf('"zy_user":"')+11;
					var i2 = data.indexOf('"', i1);
					var zy_user = data.slice(i1,i2);	
					
					
					if(typeof(params.thankYou) != 'undefined')
					{
						str = params.sendTo[0];
					}	
					
					var postData = 
					{
						method: 'getSNUIDs',
						params:	'[['+str+'],"1"]',
						cmd_id:	cmd_id,
						app_id:	'75',
						authHash: session,
						zid:	zy_user,
						snid:	1,
					}
					
					params.postData = postData;
					params.excludeCity = exclude;
					
					params.outStr = outStr;
					
					
					
					FGS.petvilleFreegifts.Click3(params);
				}
				catch(err)
				{
					dump(err);
					dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(params, true);
					}
					else
					{
						if(typeof(params.sendTo) == 'undefined')
						{
							FGS.sendView('errorUpdatingNeighbours');
						}
						else
						{
							FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
						}
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(params, true);
				}
				else
				{
					if(typeof(params.sendTo) == 'undefined')
					{
						FGS.sendView('errorUpdatingNeighbours');
					}
					else
					{
						FGS.sendView('errorWithSend', (typeof(params.thankYou) != 'undefined' ? params.bonusID : '') );
					}
				}
			}
		});
	},
	
	Click3: function(params, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var addAntiBot = (typeof(retry) == 'undefined' ? '' : '&_fb_noscript=1');

		var outStr = params.outStr;
		
		
		$.post('http://fb-client-0.petville.zynga.com/current/SNAPIProxy.php', params.postData, function(data2)
		{
		
			var myParms = 'api_key=163576248142&locale=en_US&sdk=joey';
			
			var info = JSON.parse(data2);
			
			var str = '';
			
			for(var uid in info.body)
			{
				var t = info.body[uid];
				str+= t+',';					
			}
			params.excludeCity = str.slice(0, -1);
			
			if(typeof(params.thankYou) != 'undefined')
			{
				params.sendTo[0] = info.body[params.sendTo[0]];
			}
			
			outStr = outStr.replace('EXCLUDE_ARRAY_LIST', params.excludeCity);
			
			var str = outStr;
			
			str = str.replace(/fbgood_/gi, 'fb:');
			str = str.replace(/fb_req-choice/gi, 'fb:req-choice');
			str = str.replace('/fb:req-choice', '/fb:request');
			str = str.replace('/fb:req-choice', '/fb:req');
			
			var fbml = '<fb:fbml>'+str+'</fb:fbml>';
			
			
			myParms +=  '&fbml='+encodeURIComponent(fbml);

			params.myParms = myParms;

			//dump(FGS.getCurrentTime()+'[Z] FBMLinfo - OK');

			FGS.getFBML(params);
		});
	}
};

FGS.petvilleRequests = 
{	
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
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
					if(FGS.checkForNotFound(redirectUrl) === true)
					{
						FGS.endWithError('not found', currentType, id);
					}
					else if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try 
				{
					var src = FGS.findIframeAfterId('#app_content_163576248142', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}
				
					FGS.petvilleRequests.Click2(currentType, id, src);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = FGS.findIframeAfterId('#flashFrame', dataStr);
					if (URL == '') throw {message:"Cannot find <iframe src= in page"}

					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = dataStr.indexOf('ZYFrameManager.gotoTab');
					var i2 = dataStr.indexOf(",'", i1)+2;
					var i3 = dataStr.indexOf("'", i2);
					
					nextUrl = nextUrl+dataStr.slice(i2,i3);
					
					
					FGS.petvilleRequests.Click3(currentType, id, nextUrl);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click3:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					if($('.reqFrom_img', dataHTML).length > 0 && $(".giftConfirm_img" ,dataHTML).length == 0)
					{
						info.image = $(".reqFrom_img" ,dataHTML).children().attr("src");
						info.title = 'New neighbour';
						info.text  = $(".reqFrom_name" ,dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else if($('.giftFrom_img', dataHTML).length > 0 && $(".giftConfirm_img" ,dataHTML).length > 0)
					{
						var sendInfo = '';
						
						var tmpStr = unescape(currentURL);
						
						var i1 = tmpStr.indexOf('&gift=');
						if(i1 != -1)
						{
							var i2 = tmpStr.indexOf('&', i1+1);
								
							var giftName = tmpStr.slice(i1+6,i2);
							
							var i1 = tmpStr.indexOf('senderId=');
							var i2 = tmpStr.indexOf('&', i1+1);
							
							var giftRecipient = tmpStr.slice(i1+9,i2);						
								
							sendInfo = {
								gift: giftName,
								destInt: giftRecipient,
								destName: $('.giftFrom_name', dataHTML).children().text()
								}
						}
						info.thanks = sendInfo;
						
						info.image = $(".giftConfirm_img" ,dataHTML).children().attr("src");
						info.title = $(".giftConfirm_name" ,dataHTML).children().text();
						info.text  = $(".giftFrom_name" ,dataHTML).children().text();
						info.time = Math.round(new Date().getTime() / 1000);
						
						FGS.endWithSuccess(currentType, id, info);
					}
					else
					{
						throw {message: dataStr}
					}
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};

FGS.petvilleBonuses =
{
	Click: function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
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
						retryThis(currentType, id, redirectUrl, true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
					return;
				}
				
				try
				{
					var src = FGS.findIframeAfterId('#app_content_163576248142', dataStr);
					if (src == '') throw {message:"Cannot find <iframe src= in page"}

					FGS.petvilleBonuses.Click2(currentType, id, src);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click2:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var URL = FGS.findIframeAfterId('#flashFrame', dataStr);
					if (URL == '') throw {message:"Cannot find <iframe src= in page"}
					
					var i1 = 0;
					var i2 = URL.lastIndexOf('/')+1;
					
					var nextUrl = URL.slice(i1,i2);

					var i1 = dataStr.indexOf('ZYFrameManager.gotoTab');
					
					if(i1 == -1) throw {message: 'No ZYframeManager'}
					
					var i2 = dataStr.indexOf(",'", i1)+2;
					var i3 = dataStr.indexOf("'", i2);
					
					var nextUrl2 = dataStr.slice(i2,i3).replace('http://fb-client-0.petville.zynga.com/current/', '');
					
					nextUrl = nextUrl+nextUrl2+'&overlayed=true&'+new Date().getTime()+'#overlay';
					
					
					FGS.petvilleBonuses.Click3(currentType, id, nextUrl);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
	
	Click3:	function(currentType, id, currentURL, retry)
	{
		var $ = FGS.jQuery;
		var retryThis 	= arguments.callee;
		var info = {}
		
		$.ajax({
			type: "GET",
			url: currentURL,
			dataType: 'text',
			success: function(dataStr)
			{
				var dataHTML = FGS.HTMLParser(dataStr);
				
				try
				{
					var out = $.trim($('.main_giftConfirm_cont', dataHTML).text());
					
					if(out.indexOf('You already claimed') != -1 ||  out.indexOf('The item is all gone') != -1  || out.indexOf('already received') != -1 || out.indexOf('the celebration has ended') != -1 || out.indexOf('you cannot claim the celebration') != -1 || out.indexOf('this feed is only for friends') != -1)
					{
						var error_text = out;
						FGS.endWithError('limit', currentType, id, error_text);
						return;
					}
					
					if(out.indexOf('cannot claim more than') != -1 || out.indexOf('Claim more tomorrow') != -1)
					{
						var error_text = out;
						FGS.endWithError('other', currentType, id, error_text);
						return;
					}
					
					var outText = '';
					
					if(out.indexOf('been offered') != -1)
					{
						var i1 = out.indexOf(' been offered')+13;
						var i2 = out.indexOf('.', i1);
						var i3 = out.indexOf('!', i1);
						if(i3 != -1)
							if(i3 < i2 || i2 == -1)
								i2 = i3;
						
						outText = out.slice(i1,i2);
					}
					else if(out.indexOf('has shared a') != -1)
					{
						var i1 = out.indexOf('has shared a')+13;
						var i2 = out.indexOf('!', i1);
						var i3 = out.indexOf('with', i1);
						if(i3 != -1)
							if(i3 < i2 || i2 == -1)
								i2 = i3;
						
						outText = out.slice(i1,i2);						
						
						outText = outText.replace('bonus of', '');
					}
					else if(out.indexOf('want to claim') != -1)
					{
						var i1 = out.indexOf('want to claim')+13;
						var i2 = out.indexOf('?', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('You recieved a') != -1)
					{
						var i1 = out.indexOf('You recieved a')+15;
						var i2 = out.indexOf('from', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('You found a') != -1)
					{
						var i1 = out.indexOf('You found a')+12;
						var i2 = out.indexOf(',', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('Here are ') != -1)
					{
						var i1 = out.indexOf('Here are ')+9;
						var i2 = out.indexOf('for', i1);
						outText = out.slice(i1,i2);						
					}
					else if(out.indexOf('Thank you for offering ') != -1)
					{
						outText = out;
					}
					else
					{
						outText = out;
					}
					
					var postUrl = $('.main_giftConfirm_cont', dataHTML).find('form').attr('action');
					var postData = $('.main_giftConfirm_cont', dataHTML).find('form').serialize();

					$.post(postUrl, postData);

					info.text  = outText;
					info.image = 'gfx/90px-check.png';
					info.title = 'New bonus';
					
					info.time = Math.round(new Date().getTime() / 1000);
					
					FGS.endWithSuccess(currentType, id, info);
				}
				catch(err)
				{
					//dump(err);
					//dump(err.message);
					if(typeof(retry) == 'undefined')
					{
						retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
					}
					else
					{
						FGS.endWithError('receiving', currentType, id);
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					retryThis(currentType, id, currentURL+'&_fb_noscript=1', true);
				}
				else
				{
					FGS.endWithError('connection', currentType, id);
				}
			}
		});
	},
};