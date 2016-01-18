angular.module('starter.services', []).factory('Sessions', function() {
	// init session table
	// localStorage.tags = "{}";
	// localStorage.sessions = "[]";
	
	console.log("init",localStorage.tags);
	console.log("init",localStorage.sessions);
	
	sessions = JSON.parse(localStorage.sessions || "[]");
	tags = JSON.parse(localStorage.tags || "{}");
	return {
		clear:function(){
			localStorage.tags = JSON.parse( "{}");
			localStorage.sessions = JSON.parse( "[]");
		},
		current:function(){
			return sessions[sessions.length-1];
		},
		is_live:function(){
			return sessions[sessions.length-1]!=null && ((sessions[sessions.length-1].stop || -1) <0);
		},
		start : function() {
			session = {
				start : Date.now(),

			};
			sessions.push(session);
			localStorage.sessions = JSON.stringify(sessions);
			console.log(sessions);
			return session;
		},
		stop : function(tag) {
			session = sessions.pop();
			session.stop = Date.now();
			session.tag = tag;
			if(Object.keys(tags).indexOf(tag)<0){
				tags[tag]={tag:tag};
				localStorage.tags = JSON.stringify(tags);
			}
			sessions.push(session);
			localStorage.sessions = JSON.stringify(sessions);
		},
		tags:function(){
			return tags;
		},
		setTag:function(tag){
			tags[tag.tag]=tag;
			localStorage.tags = JSON.stringify(tags);
		},
		getTag:function(tag){
			return tags[tag];
		},
		sumTags : function() {
			console.log("sumTags");
			dic = {};
			sessions.forEach(function(session){
				dic[session.tag] = dic[session.tag] || {tag:session.tag, time:0};
				dic[session.tag].time += (session.stop-session.start);
				dic[session.tag].color = tags[session.tag].color; 
			});
			res = [];
			Object.keys(dic).sort().map(function(o){return res.push(dic[o]);});
			return res;
		},
		listByTag:function(tag){
			res=[];
			sessions.forEach(function(session){
				if(session.tag===tag){
					res.push(session);
				}
			});
			return res;
		},
		getGraphData:function(){
			data ={};
			for(i=1;i<8;i++){
				data[i]={};
				for(j=1;j<25;j++){
					data[i][j]=null;
				}
			}
			
			week = 1000*60*60*24*7;
			weekago = Date.now()-week;
			i=sessions.length-1;
			
			while(sessions[i] && sessions[i].start-weekago>0){
				d = new Date(sessions[i].start);
				console.log(">",d.getDay()+1,d.getHours());
				data[d.getDay()+1][d.getHours()] =tags[sessions[i].tag].color || "#fff"; 
				i--;
			}
			
			res = [];
			for(i=1;i<8;i++){
				for(j=1;j<25;j++){
					res.push({day:i,hour:j,value:data[i][j]});
				}
			}
			
			return res;
		},
		
	};
});
