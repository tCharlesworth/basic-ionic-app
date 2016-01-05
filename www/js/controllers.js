angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, apiService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    apiService.localLogin($scope.loginData).then(function(result){
      result = result.data;
      console.log("PASSED LOGIN", result);
      //Save Recipe Data
      window.localStorage.setItem('OnlineRecipesSaveData', JSON.stringify(result));
      //Save Auth Information
      $scope.loginData.lastAuth = Date.now();
      window.localStorage.setItem('OnlineRecipesAuthData', JSON.stringify($scope.loginData));
      $scope.closeLogin();
    }, function(err) {
      if(err.status === 401) { 
        console.error('Invalid Login');
      } else {
         console.error(err);
       }
    });
  };
})

.controller('BooksCtrl', function($scope, apiService, $ionicModal) {
  var load = function() {
    //Load the books
    var str = window.localStorage.getItem('OnlineRecipesSaveData');
    $scope.data = JSON.parse(str);
  }
  
    // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/newBook.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.createBook = function(bookName) {
    //Create locally
    apiService.newRecipeBook(bookName).then(function(result) {
      //update
      load();
      $scope.newRecipeBookName = '';
      $scope.modal.hide();
    });
  }
  
  $scope.openModal = function() {
    $scope.modal.show();
  }
  
  $scope.closeModal = function() {
    $scope.modal.hide();
  }
  
  load();
})

.controller('BookCtrl', function(apiService, $scope, $stateParams, $ionicModal) {
  
  var load = function() {
    //Load the book data
    var str = window.localStorage.getItem('OnlineRecipesSaveData');
    var data = JSON.parse(str);
    console.log("NEED TO LOAD", $stateParams.bookId);
    //find the recipe
    var found = false;
    for(var i = 0; !found && i < data.length; i++) {
      if(data[i]._id === $stateParams.bookId) {
        //Found the right one
        $scope.recipes = data[i].recipes;
        console.log("FOUND IT", $scope.recipes);
        $scope.book = data[i];
      }
    }
    
    $scope.newRecipe = {
      ingredients: [],
      instructions: []
    }
  }
  
  $scope.createRecipe = function(newRecipe) {
    console.log("Creating Recipe");
    console.log("New Recipe: ", newRecipe);
    apiService.newRecipe(newRecipe, $stateParams.bookId).then(function(result) {
      //Now What?
      $scope.closeModal();
      load();
    })
  }
  
  $scope.addIngredient = function() {
    $scope.newRecipe.ingredients.push('');
  }
  
  $scope.addInstruction = function() {
    $scope.newRecipe.instructions.push('');
  }
  
  $ionicModal.fromTemplateUrl('templates/newRecipe.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openModal = function() {
    $scope.modal.show();
  }
  
  $scope.closeModal = function() {
     $scope.newRecipe = {
       ingredients: [],
       instructions: []
     }
     $scope.modal.hide();
  }
  load();
})

.controller('RecipeCtrl', function($scope, $stateParams) {
  //Load the book data
  var str = window.localStorage.getItem('OnlineRecipesSaveData');
  var data = JSON.parse(str);
  console.log("BOOKID: ", $stateParams.bookId);
  var found = false;
  var book = {};
  for(var i = 0; i < data.length && !found; i++) {
    if(data[i]._id === $stateParams.bookId) {
      found = true;
      book = data[i];
      console.log("Found Book");
    }
  }
  console.log("RECIPEID: ", $stateParams.recipeId)
  found = false;
  for(var i = 0; i < book.recipes.length && !found; i++) {
    if(book.recipes[i]._id === $stateParams.recipeId) {
      $scope.recipe = book.recipes[i];
      console.log("Found Recipe");
    }
  }
})

.controller('SearchCtrl', function($scope) {
  //search through all available recipes
  var str = window.localStorage.getItem('OnlineRecipesSaveData');
  var data = JSON.parse(str);
  $scope.allRecipes = [];
  for(var i = 0; i < data.length; i++) {
    console.log(data[i]);
    $scope.allRecipes = $scope.allRecipes.concat(data[i].recipes);
  }
  console.log("Recipes Loaded: ", $scope.allRecipes);
})
