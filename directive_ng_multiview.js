var app = angular.module('app', []);

app.value('MultiViewPaths', 
  {'/' : {
     content : {
       template : '<h1>Home Page</h1><p>More Cats!</p>'
     },
     secondaryContent :  {
       template : '<h2>Visitors Online</h2><ul><li ng-repeat="user in users">{{user}}</li></ul>',
       controller : 'ListUsersCtrl'
     }
  },
  '/cats' : {
    content:  {
      template : '<h1>All Cats</h1><ul><li ng-repeat="cat in cats">{{cat}}</li></ul>',
      controller : 'ListCatsCtrl'
    },
    secondaryContent :  {
      template : '<h2>Cat of the Minute: {{cat}}</h2>',
      controller : 'CatOfTheMinuteCtrl'
    }
  }
});

app.directive("ngMultiView", ['$rootScope', '$compile', '$controller', '$location', 'MultiViewPaths', function($rootScope, $compile, $controller, $location, MultiViewPaths){
  return {
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile : function(element, attr, linker){
      return function(scope, $element, attr) {
        var currentElement,
            panel = attr.ngMultiView;
                
        $rootScope.$on('$locationChangeSuccess', update); 
        update();
                
        // update view
        function update(evt, newUrl, oldUrl){
          if(!newUrl){ return }
          var url = newUrl.match(/#(\/.*)/),
              match, template, controller;
         
          match = url ? MultiViewPaths[url[1]] : MultiViewPaths['/'];
          template = match[panel].template;
          controller = match[panel].controller;

          if(template){
            var newScope = scope.$new(),
                locals = {},
                newController = controller;        
       
            linker(newScope, function(clone){
              clone.html(template);
              $element.parent().append(clone);
              
              if(currentElement){
                currentElement.remove();
              }
              
              var link = $compile(clone.contents());
                            
              currentElement = clone;

              if (newController) {
                locals.$scope = newScope;
                var controller = $controller(newController, locals);
                clone.data('$ngControllerController', newController);
                clone.children().data('$ngControllerController', newController);
              }

              link(newScope);
              newScope.$emit('$viewContentLoaded');
            });
                        
          }else{
              //cleanup last view            
          }
        }
      }        
    }
  }
}]);

/* creating the controllers and their data */   
app.controller('ListUsersCtrl', ['$scope', function($scope){ 
  $scope.users = ['Lord Nikon', 'Acid Burn', 'Crash Override'];    
}]);    

app.value('cats', ['Toonces','Stache','Americat','Cassiopeia','Puck','Dica','Vivian','Shosh','Gray','Bashful','Querida','Ignatowski','Aenias','Ramsay','Ishcabible','Guinness','Roux','Gefahr']);
   
app.controller('ListCatsCtrl', ['$scope', 'cats', function($scope, cats){ 
  $scope.cats = cats;    
}]);

app.controller('CatOfTheMinuteCtrl', ['$scope', 'cats', function($scope, cats){ 
  var randIndex = Math.floor(Math.random() * cats.length);
  $scope.cat = cats[randIndex];    
}]); 