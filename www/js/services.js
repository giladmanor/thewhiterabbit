angular.module('starter.services', []).factory('Chats', function() {
	// Might use a resource here that returns a JSON array

	// Some fake testing data
	var chats = [{
		id : 0,
		name : 'Ben Sparrow',
		lastText : 'You on your way?',
		face : 'img/ben.png'
	}, {
		id : 1,
		name : 'Max Lynx',
		lastText : 'Hey, it\'s me',
		face : 'img/max.png'
	}, {
		id : 2,
		name : 'Adam Bradleyson',
		lastText : 'I should buy a boat',
		face : 'img/adam.jpg'
	}, {
		id : 3,
		name : 'Perry Governor',
		lastText : 'Look at my mukluks!',
		face : 'img/perry.png'
	}, {
		id : 4,
		name : 'Mike Harrington',
		lastText : 'This is wicked good ice cream.',
		face : 'img/mike.png'
	}];

	return {
		all : function() {
			return chats;
		},
		remove : function(chat) {
			chats.splice(chats.indexOf(chat), 1);
		},
		get : function(chatId) {
			for (var i = 0; i < chats.length; i++) {
				if (chats[i].id === parseInt(chatId)) {
					return chats[i];
				}
			}
			return null;
		}
	};
}).factory('Sessions', function() {
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
		}
	};
});
