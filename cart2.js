angular.module('app', [])
.factory('cartStorage', function() {
		var _cart = {
items: [],
temp_items: []
};
var service = {
get cart() {
return _cart;
}
}
return service;
})
.controller('mainController', function(cartStorage,$scope,$http) {
	var _this = this;
	_this.cartStorage = cartStorage.cart;
        $scope.mixed_items = [];
        $scope.temp_items = [];
        $scope.solidoptions={
model: null,
availableOptions:[
{id: '1', name:'1/8'}, {id:'2', name:'1/4'}
]
}
 $scope.mixoptions={
model: null,
availableOptions:[
{id: '1', name:'1/8'}, {id:'2', name:'1/4'}
]
}
//alert($scope.boxtype);
        //alert($scope.mixboxchoice);

$http({

method: 'GET',
url: 'getCartProducts.php'

}).then(function (response) {
	// on success
	$scope.people = response.data;
        $scope.backup = response.data;
	_this.items = response.data;
	//_this.cartStorage.items.push({boxtype: $scope.boxtype});
	//alert($scope.people);
	// _this.cartStorage.items.push({boxtype:$scope.boxtype});

	}, function (response) {

	// on error
	console.log(response.data,response.status);

	});

 $scope.editPerson = function( itemarray ) {

      for(var item in itemarray) {
         //alert('item quantity is ' + itemarray[item].quantity);
         //alert('product id is ' + itemarray[item].productid);
      



          $http({

              method: 'POST',
              url:  'edit.php',
              //data: { recordId : id, quantity: quantity }
              data: { recordId : itemarray[item].productid, quantity: itemarray[item].quantity }

          }).then(function (response) {

              $scope.getPeople();

          }, function (response) {
   
              console.log(response.data,response.status);

          });
        }//for
  };

$scope.getStemsBox = function(stems,box){
var stemsbox = stems * box;

return stemsbox;
};


_this.addToCart = function(item) {
        _this.getDatabaseCartProducts();
       // $scope.mixed_items = [];
       //alert(item.inventory_quantity);
        //alert($scope.mixboxchoice);
	item['solidboxchoice'] = $scope.solidboxchoice;
	item['mixboxchoice'] = $scope.mixboxchoice;
	//item['mixes'] = $scope.mixes;
        //alert(item['mixes']);
	//item['mixcost'] = item.mixes;
	item.addedToCart = true;
       //alert(item.mixes);
	var stem_bunches;
       // alert(item.boxtype);
         //alert($scope.solidboxchoice);
	if($scope.solidboxchoice == '1'){
		//stem_bunches = 12;
		stem_bunches = item.boxtype; 
	}else if($scope.solidboxchoice == '2'){
		stem_bunches = (item.boxtype) * 2; 
	} else{ stem_bunches =0;}


	/*********** Calculate the cart of products cost:  ***************
	  STEM/BOX = BOXTYPE * ST/BU 
	 *****************************************************************/
	var stembox = stem_bunches * item.stems;
	var cost;
	var number_boxes = item.quantity;
	cost = number_boxes * stembox * item.price;
	item['cost'] = cost;
        //item['inventory_quantity'] = item.inventory_quantity - item.quantity;
        //alert(item['inventory_quantity']);
        /************************************************************
         CALCULATE THE MIX COST
        ************************************************************/
        var mixcost;
        var mixnumber;
        //mixcost = $scope.mix_number * $scope.getMixes();

       // $scope.getCurrentInventory(item);
          if(item.mixed_quantity >=0){
         //alert($scope.mix_number);
         //alert(item.mixes);
          //alert("item no null!");
         $scope.mixed_items.push(item); // for the assorted items preview items
        }
	_this.cartStorage.items.push(item);
    

};



_this.increaseItemAmount = function(item) {
	item.quantity++;

	item.showAddToCart = true;
}

_this.decreaseItemAmount = function(item) {
	item.quantity--;
	if (item.quantity <= 0) {
		item.quantity = 0;
		item.addedToCart = false;
		item.showAddToCart = false;
		var itemIndex = _this.cartStorage.items.indexOf(item);
		if (itemIndex > -1) {
			_this.cartStorage.items.splice(itemIndex, 1);
		}
	} else {
		item.showAddToCart = true;
	}
};

 $scope.getTotal = function(){
	var total = 0;
	var product;
	var stem_bunches;
        var stembox;
        var numboxes;
        var cost;
	for(var i = 0; i < _this.cartStorage.items.length; i++){
		product = _this.cartStorage.items[i];
        if($scope.solidboxchoice == '1'){
                //stem_bunches = 12;
                stem_bunches = product.boxtype;
                //alert(stem_bunches);
        }else{  
                stem_bunches = (product.boxtype) * 2;
                //alert(stem_bunches);
        }
	/*********** Calculate the cart of products cost:  ***************
	  STEM/BOX = BOXTYPE * ST/BU 
	  COST = NUM_BOXES * STEMBOX * PRICE
	 *****************************************************************/
	//var stembox = stem_bunches * item.stems;
	stembox = stem_bunches * product.stems;
        //alert('stembox is ' + stembox);
	//var number_boxes = item.quantity;
	number_boxes = product.quantity;
        //alert('number of boxes is ' + number_boxes);
        //alert('price is ' + item.price);
	//cost = number_boxes * stembox * item.price;
	cost = number_boxes * stembox * product.price;


		//total += product.price * product.quantity;
		total += cost; 
                //alert(total);
	}
          //alert($scope.getMixesCost());
        total = total + $scope.getMixesCost();
	return total;
}; 
 $scope.getMixes = function(){
	var total_mixes = 0;
        var total_mixes_cost = 0;
	var product;
	for(var i = 0; i < _this.cartStorage.items.length; i++){
		product = _this.cartStorage.items[i];
                if(product.mixes!=null){
		//total_mixes += parseInt(product.mixes);
		total_mixes += parseInt(product.mixed_quantity);
                }
	}

	return total_mixes;
};

$scope.getCurrentInventory = function(item){
var product;
    
       // item['inventory_quantity'] = item.inventory_quantity - item.quantity;
        //alert(item['inventory_quantity']);
        //alert('there are ' + _this.cartStorage.items.length + ' products in the cart');

return item['inventory_quantity'];


}; 


_this.update = function(item){
	
var product;
var temp;
       // item['inventory_quantity'] = item.inventory_quantity - item.quantity;
	for(var i = 0; i < _this.cartStorage.items.length; i++){
		product = _this.cartStorage.items[i];
               // product.inventory_quantity = product.inventory_quantity - product.quantity;
                //temp = product.inventory_quantity - product.quantity;
               //item['inventory_quantity'] = temp;
         //      alert('hi'); 
	} 

};
_this.updateQuantity = function(itemarray){
	
var product;
var temp;
//alert(itemarray);
var j=0;

/********ONLY UPDATE/GRAB CURRENT DATABASE PRODUCTS ********

Name: getDatabaseCartProducts

***********************************************************/
//_this.getDatabaseCartProducts();
//$scope.addMixedToDatabase();
$scope.addToDatabase(_this.cartStorage.items);
$scope.addMixedToDatabase();
_this.getDatabaseCartProducts();
$scope.showDetails = true;
setTimeout(location.reload.bind(location), 50);
};

$scope.setTimeout=function() {
    location.reload();
};
$scope.getMixesCost = function(){
	var total_mixes = 0;
        var total_mixes_cost = 0;
	var product;
        var stem_bunches;
        var boxtype;
        var stems;
        var mix_price; //pick the last one on array for testing
        var stembox;
        var numboxes;

	for(var i = 0; i < _this.cartStorage.items.length; i++){
		product = _this.cartStorage.items[i];
                if( product.mix_price!=null && product.mixed_quantity >0){
	//	total_mixes_cost += parseFloat(product.mix_price);
                boxtype = product.boxtype;
                //boxtype has to be always 12($1620) for this example, need to specify this for assorted mix because this has to be set already on array
                boxtype = 12;
                stems = product.stems;
                //alert(product.boxtype);
                //alert(product.stems);
                mix_price = parseFloat(product.mix_price);
                
	
        if($scope.mixboxchoice == '1'){
                //stem_bunches = 12;
                stem_bunches = boxtype;
        }else if($scope.mixboxchoice == '2'){ 
                stem_bunches = boxtype * 2;
        } else{ stem_bunches =0;} 

      //  alert(total_mixes_cost);

      // alert ("mix price is" + mix_price); 
	stembox = stem_bunches * stems;
        number_boxes = $scope.mix_number; // get this number from input scope.
	//cost = number_boxes * stembox * item.price;
	//total_mixes_cost = number_boxes * stembox * total_mixes_cost; 
        //alert('stembox is ' + stembox);
        //alert('number of boxes' + number_boxes);
        //alert('mix price is ' + mix_price);
        }

      }
       //alert('number of boxes' + number_boxes);
       //alert('stembox ' + stembox);
       //alert('mix price ' + mix_price);
       //get real mix price, not just the last one from products, otherwise when removing the product, the last price I was using will be gone
       mix_price = 0.45;
        total_mixes_cost = number_boxes * stembox * mix_price; 
       //alert('total mixes cost ' + total_mixes_cost);
	return total_mixes_cost;
}; 


 $scope.getCost = function(item){
	var cost;
	var stem_bunches;
        if($scope.solidboxchoice == '1'){
                //stem_bunches = 12;
                stem_bunches = item.boxtype;
        }else{  
                stem_bunches = (item.boxtype) * 2;
        }
//	cost = item.price * item.quantity;

	/*********** Calculate the cart of products cost:  ***************
	  STEM/BOX = BOXTYPE * ST/BU 
	  COST = NUM_BOXES * STEMBOX * PRICE
	 *****************************************************************/
	var stembox = stem_bunches * item.stems;
        //alert('stembox is ' + stembox);
	var number_boxes = item.quantity;
        //alert('number of boxes is ' + number_boxes);
        //alert('price is ' + item.price);
	cost = number_boxes * stembox * item.price;


	return cost;
};
$scope.getTotalCost = function(item){
var total_cost = 0;

         //total_cost += item.cost;
         //return total_cost;
        $scope.getCost(item);
total_cost += $scope.getCost(item);

return total_cost;

};
$scope.printFinalProducts = function(items){
              var product;
              var final_products = [];
                   //alert('hey');
                   // alert(items.length);
                    for (i =0 ; i<_this.cartStorage.items.length; i++){
                    product = _this.cartStorage.items[i];
                    if(product.quantity >0){
                   // alert(getCost(product));
                    product['cost'] = $scope.getCost(product);
                    final_products.push(product);
                    }
                       

                    }
                   return final_products; 

};

$scope.staticProducts = function(){
              var product;
              var final_products = [];
              var final_products2 = [];
              var q;
                   //alert('hey');
                   // alert(items.length);
                    for (i =0 ; i<_this.cartStorage.items.length; i++){
                    product = _this.cartStorage.items[i];
                    //product = cartStorage.items[i];
                    //product = items[i];
                   // _this.cartStorage.items.splice(i,1);
                    if(product.quantity >0){
                   // alert(getCost(product));
                    product['cost'] = $scope.getCost(product);
                    q = product.quantity;
                    final_products.push(product);
                    final_products2.push(q);
                    }


                    }
                   return final_products;

 };

$scope.addToDatabase = function(itemarray){
      alert($scope.mixboxchoice);
      alert($scope.solidboxchoice);
      
      for(var item in itemarray) {
                   if(itemarray[item].quantity>0){
                      // alert(itemarray[item].price);
                        $http({
                        method: 'POST',
                        url:  'addToDatabase.php',
                        data: { recordId : itemarray[item].productid, quantity: itemarray[item].quantity, name: itemarray[item].name, price: itemarray[item].price}
                        }).then(function (response) {
                        $scope.getPeople();
                        }, function (response) {
                                   console.log(response.data,response.status);
                       });
                  }// if
        }//for
};

$scope.addMixedToDatabase = function(){
var product;
                    for (i =0 ; i<$scope.mixed_items.length; i++){
                    //alert($scope.mixed_items[i].quantity); //this is pointing to solid quantities,and need to be adjusted to get the mixes quantity, even though it is just 3
                    product = $scope.mixed_items[i];
                    //alert(product.price);
                    }
};

_this.getDatabaseCartProducts=function(){

//alert("from getCartDatabase");
          $http({

              method: 'GET',
              //url:  'edit.php',
              //url:  'getConsignees.php',
              url:  'getDatabaseCartProducts.php',
              //data: { recordId : id, quantity: quantity }
           //   data: { recordId : itemarray[item].productid, quantity: itemarray[item].quantity }

          }).then(function (response) {

              //$scope.getPeople();
              //alert(response.data);
              //create a temo variable to hold the cart temp products:
              //$scope.temp_items = response.data;
              //alert(response.data);
              _this.temp_items = response.data;

          }, function (response) {

              console.log(response.data,response.status);

          });
     //alert(_this.temp_items); 
     return _this.temp_items; 
};



})

/***************** CART CONTROLLER ******************/

 .controller('cartController', function(cartStorage) {
		var _this = this;
		_this.cartStorage = cartStorage.cart;

		_this.increaseItemAmount = function(item) {
		item.quantity++;
		}

		_this.decreaseItemAmount = function(item) {
		item.quantity--;
		if (item.quantity <= 0) {
		item.quantity = 0;
		item.addedToCart = false;
		item.showAddToCart = false;
		var itemIndex = _this.cartStorage.items.indexOf(item);
		if (itemIndex > -1) {
		_this.cartStorage.items.splice(itemIndex, 1);
		}
		}
		}

		_this.removeFromCart = function(item) {
                      // item.inventory_quantity = parseInt(item.inventory_quantity) + parseInt(item.quantity); // to add items on cart back in the inventory 
		item.quantity = 0;
			item.addedToCart = false;
			item.showAddToCart = false;
			var itemIndex = _this.cartStorage.items.indexOf0(item);
			if (itemIndex > -1) {
				_this.cartStorage.items.splice(itemIndex, 1);
			}
		}


});  
