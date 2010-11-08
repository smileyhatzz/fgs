var ravenwoodRequests = 
{	
	APPID: '201278444497',
	
	Click: function(id, dataPost, retry)
	{
		var info = {
			image: 'gfx/90px-cancel.png'
		}
		
		$.ajax({
			type: "POST",
			url: 'http://www.facebook.com/ajax/reqs.php?__a=1',
			data: dataPost,
			dataType: 'text',
			success: function(data)
			{
				try
				{
					var strTemp = data;
					var i1      =   strTemp.indexOf('goURI');
					if (i1 == -1) throw {message:"Cannot find goURI in page"}

					var i2        =   strTemp.indexOf(');"]',i1);
					strTemp   =   "'"+strTemp.slice(i1+6,i2)+"'";

					eval("strTemp =" + strTemp);

					var URI = JSON.parse(strTemp);
					
					
					$.ajax({
						type: "GET",
						url: URI,
						dataType: 'text',
						success: function(data2)
						{
							var data = data2.substr(data2.indexOf('<body'),data2.lastIndexOf('</body'));
							
							//info.image =
							var el = $('#app_content_120563477996213 > div > div > div > div > div', data);
							if($(el).length > 0)
							{
								if($(el).text().indexOf('You just accepted a neighbor request') != -1)
								{
									info.image = '';
									info.title = 'New neighbour';
									info.text  = $(el).text();
									info.time = Math.round(new Date().getTime() / 1000);
								}
								else
								{
									info.title = $(el).text();
									
									
									var i1 = $(el).text().indexOf('You just accepted this');
									if(i1 != -1)
									{
										var i2 = $(el).text().indexOf(' from ', i1);
										info.title = $(el).text().slice(i1+22, i2);
									}
									
									info.image = $('#app_content_120563477996213', data).find('img').attr("src");
									info.text  = $(el).text();
									info.time = Math.round(new Date().getTime() / 1000);
								}
								
								database.updateItem('requests', id, info);
								sendView('requestSuccess', id, info);
							}
							else
							{							
								if(typeof(retry) == 'undefined')
								{
									console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
									ravenwoodRequests.Click(id, dataPost, true);
								}
								else
								{
									info.error = 'receiving';
									info.time = Math.round(new Date().getTime() / 1000);
									
									database.updateErrorItem('requests', id, info);
									sendView('requestError', id, info);	
								}
							}
						},
						error: function()
						{
							if(typeof(retry) == 'undefined')
							{
								console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
								ravenwoodRequests.Click(id, dataPost, true);
							}
							else
							{
								info.error = 'connection';
								info.time = Math.round(new Date().getTime() / 1000);
								sendView('requestError', id, info);
							}
						}
					});
				}
				catch(err)
				{
					console.log(err);
					if(typeof(retry) == 'undefined')
					{
						console.log(getCurrentTime()+'[B] Connection error while receiving bonus, Retrying bonus with ID: '+id);
						ravenwoodRequests.Click(id, dataPost, true);
					}
					else
					{
						info.error = 'receiving';
						info.time = Math.round(new Date().getTime() / 1000);
						
						database.updateErrorItem('requests', id, info);
						sendView('requestError', id, info);	
					}
				}
			},
			error: function()
			{
				if(typeof(retry) == 'undefined')
				{
					console.log(getCurrentTime()+'[R] Connection error while receiving bonus, Retrying bonus with ID: '+id);
					ravenwoodRequests.Click(id, dataPost, true);
				}
				else
				{
					info.error = 'connection';
					info.time = Math.round(new Date().getTime() / 1000);
					sendView('requestError', id, info);
				}
			}
		});
	}
};