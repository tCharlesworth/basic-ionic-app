angular.module('starter').service('apiService', function($http, $location) {
	var serverURL = 'http://online-recipes.herokuapp.com';
	// var serverURL = 'http://localhost:3000';
	this.localLogin = function(tryUser) {
		//encrypt information here?
		//send information to server
		return $http({
			method: 'POST',
			url: serverURL+'/mobileDownload',
			data: tryUser
		});
	}
	
	this.newRecipeBook = function(name) {
		//Create on Server
		var auth = window.localStorage.getItem('OnlineRecipesAuthData');
		auth = JSON.parse(auth);
		var data = {
			bookName: name,
			credentials: auth
		};
		return $http({
			method: 'POST',
			url: serverURL+'/mobile/newBook',
			data: data
		}).then(function(newBook) {
			//Create Locally
			var str = window.localStorage.getItem('OnlineRecipesSaveData');
			var data = JSON.parse(str);
			data.push(newBook.data);
			window.localStorage.setItem('OnlineRecipesSaveData', JSON.stringify(data));
		});
	}
	
	this.newRecipe = function(newRecipe, bookId) {
		var auth = window.localStorage.getItem('OnlineRecipesAuthData');
		auth = JSON.parse(auth);
		var data = {
			newRecipe: newRecipe,
			credentials: auth,
			bookId: bookId
		};
		return $http({
			method: 'POST',
			url: serverURL+'/mobile/newRecipe',
			data: data
		}).then(function(result) {
			//Create Locally
			console.log("Received: ", result);
			var str = window.localStorage.getItem('OnlineRecipesSaveData');
			var data = JSON.parse(str);
			var found = false;
			for(var i = 0; !found && i < data.length; i++) {
				if(data[i]._id === bookId) {
					console.log("Found Correct Book: ", data[i]);
					found = true;
					data[i].recipes.push(result.data);
					console.log("Added Recipe to List: ", data[i]);
				}
			}
			//Save
			str = JSON.stringify(data);
			window.localStorage.setItem('OnlineRecipesSaveData' ,str);
		});
	}
})
