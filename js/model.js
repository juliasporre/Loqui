//model.js

LoquiApp.factory('model', function($resource){
	//Nu bara Mockups, ska hämtas från databasen senare
	this.recentCourses = ['DD1325','MD1454','DD4455'];
	this.getSchools = $resource('https://crossorigin.me/https://www.kth.se/api/kopps/v2/departments.sv.json',{},{
		get: {
			method: 'GET',
			isArray: true,
			transformResponse: function(data){
				var tmp =  angular.fromJson(data);
				return tmp;
			}
		}
	});

	this.getCourse = $resource('https://crossorigin.me/https://www.kth.se/api/kopps/v2/course/:query',{},{
		get: {
			method: 'GET',
			transformResponse: function(data){
				console.log("org");
				console.log(data);
				var tmp =  angular.fromJson(data);
				console.log("json");
				console.log(tmp);
				return {1:{
					code: tmp.code,
					name: tmp.title.en,
					url: tmp.href.en,
					level: tmp.level.en}
				};
			}
		}
	});

	this.addToRecent = function(course){
		this.recentCourses.push(course);
	}

	this.getRecentCourses = function(){
		return this.recentCourses;


	}



	return this;
});
