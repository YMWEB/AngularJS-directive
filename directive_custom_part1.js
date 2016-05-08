angular.module('myApp',[])
.controller('MainController',function($scope){

})
.directive('myDirective',function(){
	return{
		restrict:'A',
		scope:{},
		priority:100,
		template:'<div>interior:{{myProperty}}<input ng-model="myProperty"/></div>'

	};
})
.directive('sideBox',function(){
	return {
		restrict:'EA',
		scope:{
			title:'@'
		},
		transclude:true,
		template:'<div class="sidebox"><div class="content"><h2 class="header">' +
             '{{ title }}</h2><span class="content" ng-transclude></span></div></div>' 
         }; 
	})
.directive('myDialog', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        'close': '&onClose'
      },
      templateUrl: 'my-dialog-close.html'
    };
})
.directive('helloWorld',function(){
	return{
		restrict:'AE',
		replace:true,
		template:'<p style="background-color:{{color}}">Hello World</p>',
		link:function(scope,elem,attrs){
			elem.bind('click',function(){

				elem.css('background-color','white');
				scope.$apply(function(){
					scope.color="white";

				});
			});
			elem.bind('mouseover',function(){

				elem.css('cursor','pointer');
			})
		}
	}
});