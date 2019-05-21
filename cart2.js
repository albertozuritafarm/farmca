angular.module('app', [])
.factory('cartStorage', function() {
		var _cart = {
items: [],
temp_items: [],
inco_terms_items: [],
};
var service = {
get cart() {
return _cart;
}
}
return service;
})
.controller('mainController', function(cartStorage,$scope,$http) {
//alert($scope.solidboxchoice);
	var _this = this;
        _this.Total=0;
	_this.cartStorage = cartStorage.cart;
        $scope.mixed_items = [];
        $scope.temp_items = [];
        $scope.inco_terms_items = [];
        $scope.todayDate= new Date();
       // $scope.stemboxunit = _this.getStemBoxSum();
        $scope.solidoptions={
model: null,
availableOptions:[
{id: '1', name:'1/8'}, {id:'2', name:'1/4'}
]
}
$scope.incoTermsOptions={
availableOptions:[
{structure: '1', name:'FOB UIO'}, {structure:'2', name:'FOB UIO (D)'}, {structure:'3', name:'FOB MIA PRESALE'}, {structure:'4', name:'FOB MIA (STOCK)'}
]
}
$scope.incoTermsSearch={
availableOptions:[
{inco: '1', name:'UIO'}, {inco:'2', name:'MIA'}
]
}
$scope.statusSearch={
availableOptions:[
{status: '1', name:'AIR'}, {status:'2', name:'LAND'}
]
}


$scope.mixoptions={
model: null,
availableOptions:[
{id: '1', name:'1/8'}, {id:'2', name:'1/4'}
]
}
//alert($scope.boxtype);

$http({

method: 'GET',
url: 'getCartProducts.php'

}).then(function (response) {
var p;
	// on success
	$scope.people = response.data;
        $scope.backup = response.data;
	_this.items = response.data;
_this.getIncoTermsStructure();
        p=_this.items;
        //alert($scope.solidboxchoice);
        //_this.updatePacking($scope.solidboxchoice);
        _this.getDatabaseCartProducts();

         for (var key in p) {
  var r1 = p[key];
                         // alert(r1);
        //push items into cart
      //  _this.addToCart(r1);
                          for (var key2 in r1){
  var r2 = r1[key2];
                         //   alert(r2);
                        }
              }
       // _this.addToCart(_this.items);
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

$scope.checkAvailability = function(availability, expiration){
//alert(availability);
var a = new Date(availability);
var e = new Date(expiration);
//alert(d.getDay());
if(e.getTime() > a.getTime()){
//alert('expiration greater than availability');
}

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
      //  alert(item.boxtype);
         //alert($scope.solidboxchoice);
	if($scope.solidboxchoice == '1'){
		//stem_bunches = 12;
		stem_bunches = item.boxtype; 
                //alert(stem_bunches);
	}else if($scope.solidboxchoice == '2'){
		stem_bunches = (item.boxtype) * 2; 
                //alert(stem_bunches);
	} else{ stem_bunches =0;}


	/*********** Calculate the cart of products cost:  ***************
	  STEM/BOX = BOXTYPE * ST/BU 
	 *****************************************************************/
       // alert('items stems are' + item.stems);
	var stembox = stem_bunches * item.stems;
        //alert(stembox);
	var cost;
	var number_boxes = item.quantity;
	cost = number_boxes * stembox * item.price;
        //alert('cost is: ' + cost);
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

 $scope.getTotal = function(itemsarray){
        var total;
        var p = itemsarray
            for (var key in p) {
  var r1 = p[key];
                         // alert(r1);
        //push items into cart
      //  _this.addToCart(r1);
                          for (var key2 in r1){
  var r2 = r1[key2];
                            //alert(r2);
                        }
              }
        //total = total + $scope.getMixesCost();
       total = 100;
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
//$scope.addAssortedRoot();
//_this.getIncoTermsStructure();
$scope.addToDatabase(_this.cartStorage.items);
//alert('iconterm is ' + $scope.incoterms);
//$scope.addMixedToDatabase();
_this.getDatabaseCartProducts();
$scope.showDetails = true;
setTimeout(location.reload.bind(location), 50);
//_this.updatePacking('1/4');
// Set to Default Packing
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
      //alert($scope.mixboxchoice);
      //alert($scope.solidboxchoice);
      if($scope.mix_number){
      //alert($scope.mix_number);
      }else{
      $scope.mix_number = 0;
      }
var cost;
var stembox;
var stem_bunches;
var number_boxes;
var mark_solid;
var mix_counter = 0;
var isMix = 0;
itemarray['mix_number']= $scope.mix_number;
for(var temp in itemarray) {
                   if(itemarray[temp].expiration > itemarray[temp].availability && itemarray[temp].quantity>0){
                   //alert("Warning.. can't pick products which are expired :)" + itemarray[temp].name);
                   //alert(itemarray[temp].box_type);
                   //exit;
                   }
                   
}
//alert($scope.getMixesCost());
      /*for(var temp in itemarray) {
                   if(itemarray[temp].mixed_quantity > 0 && mix_counter ==0){
                   //$scope.addAssortedRoot(itemarray[temp].mixed_quantity);
                   //$scope.addAssortedRoot();
                   isMix =1;
                   //mix_counter++;
                   //itemarray['isMix'] = mix_counter;
                   }
     } */ 
      
setTimeout(location.reload.bind(location), 500);
 $http({
                        method: 'POST',
                        url:  'addToDatabase.php',
                        //data: { recordId : itemarray[item].productid, quantity: itemarray[item].quantity, mixed_quantity: itemarray[item].mixed_quantity, name: itemarray[item].name, price: itemarray[item].price, cost: cost, marksolid: mark_solid, isMix: isMix , mixCounter: itemarray['isMix'], itemarray: itemarray}
                        data: {itemarray: itemarray, mix_number: $scope.mix_number}
                        }).then(function (response) {
                        //alert(response.data);
                        //alert(itemarray[item].name); //this points to the last product on list which makes sense
                       
                        //alert('hey');
              
                        }, function (response) {
                                   console.log(response.data,response.status);
                       });



      /*for(var item in itemarray) {
                         if(itemarray[item].mixed_quantity > 0 && mix_counter ==0){
                         mix_counter++;
                         } 
                        // else{isMix=0;} 
                   if(itemarray[item].quantity>0 || itemarray[item].mixed_quantity>0){ // try using same items array to insert Assorted item in temp_cart. The problem is how to use the same tempCartID. It might be possible that addToDatabase.php returns the last Assorted(0) index
                      // alert(itemarray[item].price);
	              //cost = number_boxes * stembox * product.price;
	              //stembox = stem_bunches * item.stems;
                      //alert('mixed quantity on same array is:' + itemarray[item].mixed_quantity);
                      alert('product to be inserted on db:' + itemarray[item].name);
                      if(itemarray[item].length==35){
                      stem_bunches = itemarray[item].thirty_thirty_five;
                      }
                      else if(itemarray[item].length==45){
                      stem_bunches = itemarray[item].forty_forty_five;
                      }
                      else if(itemarray[item].length==55){
                      stem_bunches = itemarray[item].fifty_fifty_five;
                      }
                      else if(itemarray[item].length==70){
                      stem_bunches = itemarray[item].seventy;
                      }
	              stembox = stem_bunches * itemarray[item].stems;
	 number_boxes = itemarray[item].quantity;
	 cost = number_boxes * stembox * itemarray[item].price;
                     // alert(cost);
                   //     alert(itemarray[item].length);
                        // alert(itemarray[item].cost);
                      //   alert(stem_bunches);
                        //alert(stembox);
                        //alert(number_boxes);
                        //alert(itemarray[item].marksolid);
                        mark_solid = itemarray[item].marksolid;
                        alert('mix counter' + itemarray['isMix']);

                        $http({
                        method: 'POST',
                        url:  'addToDatabase.php',
                        data: { recordId : itemarray[item].productid, quantity: itemarray[item].quantity, mixed_quantity: itemarray[item].mixed_quantity, name: itemarray[item].name, price: itemarray[item].price, cost: cost, marksolid: mark_solid, isMix: isMix , mixCounter: itemarray['isMix']}
                        }).then(function (response) {
                        alert(response.data);
                        //alert(itemarray[item].name); //this points to the last product on list which makes sense

                        //alert('hey');
                       
                        }, function (response) {
                                   console.log(response.data,response.status);
                       });
                  }// if
        }//for  */
     
/******   Add Assorted root of products (realProductID=0) to temp_cart, and insert products to mix_cart table *******/
/*var product;
var quantity;
                    for (i =0 ; i<$scope.mixed_items.length; i++){
                    //alert('mixed quantity is' + $scope.mixed_items[i].mixed_quantity);
                    //alert($scope.mixed_items[i].quantity); //this is pointing to solid quantities,and need to be adjusted to get the mixes quantity, even though it is just 3
                    //quantity = $scope.mixed_items[i].quantity;
                    quantity = $scope.mixed_items[i].mixed_quantity;
                    product = $scope.mixed_items[i];
                    if(quantity >0){
                    alert(product.price);
                    }
                    }*/
        
};

$scope.addAssortedRoot = function(){
                        $http({
                        method: 'POST',
                        url:  'addAssortedRoot.php',
                        data: { mixed_quantity: '32'}
                        }).then(function (response) {
                       // alert(response.data);
                       
                        }, function (response) {
                                   console.log(response.data,response.status);
                       });

};
$scope.getLastAssorted = function(){
$http.get("getLastAssorted.php")
    .then(function (response) { alert(response.data); return response.data;});
};

$scope.addMixedToDatabase = function(){
var product;
var quantity;
                    for (i =0 ; i<$scope.mixed_items.length; i++){
                    //alert('mixed quantity is' + $scope.mixed_items[i].mixed_quantity);
                    //alert($scope.mixed_items[i].quantity); //this is pointing to solid quantities,and need to be adjusted to get the mixes quantity, even though it is just 3
                    //quantity = $scope.mixed_items[i].quantity;
                    quantity = $scope.mixed_items[i].mixed_quantity;
                    product = $scope.mixed_items[i];
                    if(quantity >0){
                    alert(product.price);
                    }
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

_this.getIncoTermsStructure = function(){
 //alert($scope.incoterms + 'from getIncoStr func');

$http({
     method:'POST',
     url: 'getIncoTermsStructure.php',
     data: {structure: '8'}
     }).then(function (response){
        //alert("hi");
        //alert(response.data);
        _this.inco_terms_items = response.data;

     }, function (response){
        console.log(response.data, response.status);
        });
 


};

/***************************************************
function: updatePacking
args:  c and s
c = boxchoice where   1/8= 1    1/4= 2
s = incoterms search UIO, MIA 

***************************************************/

$scope.updatePacking = function( c, s){
if(c==null){
alert(c + ' is null!'); //this shows the selected incosort, and can be used to update the products on the cart based on keyboard to sort
}
else if(s==null){
alert(s + ' is  null');
}
else{ 
alert(c + ' is not null!'); //this shows the selected incosort, and can be used to update the products on the cart based on keyboard to sort
alert(s + ' is not null!'); //this shows the selected incosort, and can be used to update the products on the cart based on keyboard to sort
}

$http({
              method: 'POST',
              url:  'getCartProducts.php',
              //data: { packing: b}
              data: { packing: c , incosearch: s}

          }).then(function (response) {
             var p;
              _this.items = response.data;
             p= _this.items;
              for (var key in p) {
  var r1 = p[key];
                         // alert(r1);
        //push items into cart
        _this.addToCart(r1);
                          for (var key2 in r1){
  var r2 = r1[key2];
                         //   alert(r2);
                        }
              }

          }, function (response) {
              console.log(response.data,response.status);

          });
};

$scope.openWin = function(id,cartid){
var myWindow=window.open('','','width=200,height=100, top=500');
    //myWindow.document.write("this is " + id + "cart id " + cartid);
$http({
     method:'POST',
     url: 'getCartMixProducts.php',
     data: {cartid: cartid}
     }).then(function (response){
       // alert("hi");
       // alert(response.data);
        var p;
        p=response.data;
           for (var key in p) {
  var r1 = p[key];
                         // alert(r1);
                          for (var key2 in r1){
  var r2 = r1[key2];
                            //alert(r2);
                            myWindow.document.write(r2 + ' ');
                        }
                        myWindow.document.write('<br>');
              }
        

     }, function (response){
        console.log(response.data, response.status);
        });



};

_this.getStemBoxSum=function(){
var counter =0;
var product;
        for(var i = 0; i < _this.temp_items.length; i++){
                product = _this.temp_items[i];
                if(product.stembox){
                counter += product.stembox - 0;
                }
        }
return counter;
};

_this.getBunchBoxSum= function(){
var counter =0;
var product;
        for(var i = 0; i < _this.temp_items.length; i++){
                product = _this.temp_items[i];
                if(product.packing){
                counter += product.packing - 0;
                }
        }
return counter;



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
