(function(){
	var app, converter;

	converter = new Showdown.converter();

	var config = {
    				"title" : "顾晓伟同学",
    				"subTitle" : "加油",
    				"quickLinks" : [
        				{"text" : "Blog", "href" : "/"},
        				{"text" : "Resume", "href" : "#/resume"},
        				{"text" : "Github", "href" : "https://github.com/aim2ued"}
    				]
				}


	app = angular.module('aim2ued', ['ngSanitize']).config([
    '$routeProvider', function($routeProvider) {
      	return $routeProvider.when("", {
        		templateUrl: "partials/index-list.html"
      		}).when("/resume", {
        		templateUrl: "partials/resume.html"
      		}).when("/post/:postPath", {
        		templateUrl: "partials/post.html"
      		});
    	}
  	]).directive('ngMarkdown', function() {
    	return function(scope, element, attrs) {
      		return scope.$watch(attrs.ngMarkdown, function(value) {
        		var el, html, _i, _len, _ref;
        		if (value != null) {
          			html = converter.makeHtml(value);
          			element.html(html);
          			_ref = document.body.querySelectorAll('pre code');
          			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            			el = _ref[_i];
            			hljs.highlightBlock(el);
          			}
          			return MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        		}
      		});
    	};
  	}).factory("indexService", function($http) {
    	var indexService;
    	indexService = {
      		async: function() {
        	var promise;
        	promise = $http.get('post/index.json').then(function(response) {
          		return response.data;
        	});
        	return promise;
      		}
    	};
    	return indexService;
  	});

	app.controller('headerController',function($scope, $location){
		var getState = function(path) {
        	var items = path.split("/");
        	if (items.length > 1 && items[items.length - 1] === "resume") {
          		return "Resume";
        	}
        	return "Blog";
      	};
		$scope.config = config
		$scope.state = getState($location.path())
		return $scope.$on("$locationChangeSuccess", function(event, newLoc, oldLoc) {
        	return $scope.state = getState($location.path());
      	});
	})

	app.controller('IndexListCtrl', function($scope, $routeParams, indexService) {
    	return indexService.async().then(function(data) {
      		var buildTagList, tag;
      		buildTagList = function(indexData) {
        	var all_tags, post, tag, tags, _i, _j, _len, _len1;
        	all_tags = [];
        	for (_i = 0, _len = indexData.length; _i < _len; _i++) {
          		post = indexData[_i];
          		all_tags = all_tags.concat(post.tags);
        	}
        	tags = {};
        	for (_j = 0, _len1 = all_tags.length; _j < _len1; _j++) {
          		tag = all_tags[_j];
          		if (tags[tag]) {
            		tags[tag]["count"] += 1;
          		} else {
            		tags[tag] = {
              		"text": tag,
              		"href": "#/tag/" + tag,
              		"count": 1
            	};
          	}
        }
        tags["All"] = {
          "text": "All",
          "href": "#/",
          "count": indexData.length
        };
        return tags;
      };
      	$scope.indexList = data;
      	indexService.indexData = data;
      	$scope.tagList = buildTagList(data);
      	if (($routeParams.tag != null) && $routeParams.tag.length !== 0) {
        	tag = $routeParams.tag;
      	} else {
        	tag = "All";
      	}
      	$scope.currentTag = $scope.tagList[tag];
      	if (tag === "All") {
        	return $scope.currentTag.filter = "";
      	} else {
        	return $scope.currentTag.filter = tag;
      	}
    });
  });

	app.controller('PostCtrl', function($scope, $http, $routeParams, indexService) {
    	return $http.get("post/" + $routeParams.postPath + ".md").success(function(data) {
      		$scope.postContent = data;
      		return indexService.async().then(function(data) {
        		var i, post, _i, _len, _results;
        		i = 0;
        		_results = [];
        		for (_i = 0, _len = data.length; _i < _len; _i++) {
          			post = data[_i];
          			if (post.path === $routeParams.postPath) {
            			$scope.prevPostPath = "";
            			$scope.nextPostPath = "";
            			if (data[i - 1] != null) {
              				$scope.prevPostPath = "#/post/" + data[i - 1].path;
            			}
            			if (data[i + 1] != null) {
              				$scope.nextPostPath = "#/post/" + data[i + 1].path;
            			}
            		break;
          			}
          		_results.push(i++);
        		}
        	return _results;
      		});
    	});
 	});

}).call(this);