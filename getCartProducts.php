<?php
include 'connect_sande.php';
$connect = connect();

// Get the data
$people = array();
$products[] = array();
/*$sql = "SELECT IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P
 LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID";*/

$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata)){

  $request     = json_decode($postdata);

    $packing  = $request->packing;
    $incosearch = $request->incosearch;
    if($packing==1){
     $packing = '1/8 CAL';
    }else{
     $packing = '1/4 CAL';
    }

    if($incosearch=='UIO'){
       $incosearch=1;
       $is_sort=true;
    }else if($incosearch=='MIA'){
       $incosearch=2;
       $is_sort=true; 

    }else if($incosearch==null){
       $is_sort=false; 
    }
}else{
     $packing = '1/8 CAL';
}

/*$sql="SELECT DISTINCT specie,box,PA.box_type, PA.variety,PA.twenty_twenty_five,PA.thirty_thirty_five, PA.forty_forty_five, PA.fifty_fifty_five, PA.sixty,PA.seventy,PA.eighty,
PA.ninety,PA.one_hundred,IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype, expiration, availability FROM `products` AS P INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE 
PA.box_type='$packing'";*/

/*$sql="SELECT DISTINCT PR.plus30,PR.plus40,PA.box_type,specie,box, PA.variety,PA.twenty_twenty_five,PA.thirty_thirty_five, PA.forty_forty_five, PA.fifty_fifty_five, PA.sixty,PA.seventy,PA.eighty, PA.ninety,PA.one_hundred,IT.name, I.productID, description, P.color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype,expiration, availability FROM `products` AS P INNER JOIN `pricing` AS PR ON(P.specie = PR.flowerType) && P.description=PR.variety INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.box_type='1/8 CAL'";*/

if($is_sort){
$sql="SELECT DISTINCT PR.plus30,PR.plus40,PA.box_type,specie,box, PA.variety,PA.twenty_twenty_five,PA.thirty_thirty_five, PA.forty_forty_five, PA.fifty_fifty_five, PA.sixty,PA.seventy,PA.eighty, PA.ninety,PA.one_hundred,IT.name, I.productID, description, P.color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype,expiration, availability FROM `products` AS P INNER JOIN `pricing` AS PR ON(P.specie = PR.flowerType) && P.description=PR.variety INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.box_type='$packing'";
}else{

$sql="SELECT DISTINCT PR.plus30,PR.plus40,PA.box_type,specie,box, PA.variety,PA.twenty_twenty_five,PA.thirty_thirty_five, PA.forty_forty_five, PA.fifty_fifty_five, PA.sixty,PA.seventy,PA.eighty, PA.ninety,PA.one_hundred,IT.name, I.productID, description, P.color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype,expiration, availability FROM `products` AS P INNER JOIN `pricing` AS PR ON(P.specie = PR.flowerType) && P.description=PR.variety INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.box_type='$packing'";


}

/*$sql="SELECT DISTINCT specie,box, PA.variety,PA.twenty_twenty_five,PA.thirty_thirty_five, PA.forty_forty_five, PA.fifty_fifty_five, PA.sixty,PA.seventy,PA.eighty,
PA.ninety,PA.one_hundred,IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.seventy=6 && box=PA.box_type"; */

/*SELECT * FROM `products` AS PR LEFT JOIN packings AS PA on PR.specie = PA.variety
SELECT DISTINCT specie,  PA.variety,IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID
SELECT DISTINCT specie, PA.variety,PA.seventy,IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.seventy=6
SELECT DISTINCT specie,box, PA.variety,PA.seventy,IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.seventy=6 && box="1/8"*/
if($result = mysqli_query($connect,$sql))
{
  $count = mysqli_num_rows($result);
  $cr = 0;
  while($row = mysqli_fetch_assoc($result))
  {
    //  $people[$cr]['productID']    = $row['productID'];
    // echo $row['color'];
      //$products[$cr]['description'] = $row['description'];
      $products[$cr]['productid'] = $row['productID'];
      $products[$cr]['name'] = $row['description'];
      $products[$cr]['color']  = $row['color'];
      $products[$cr]['length'] = $row['length'];
      $products[$cr]['quantity'] = $row['quantity'];
      $products[$cr]['inventory_quantity'] = $row['inventory_quantity'];
      $products[$cr]['stems'] = $row['stems'];
      //$products[$cr]['price'] = $row['price'];
      $products[$cr]['mix_price'] = $row['mix_price'];
      $products[$cr]['quality'] = $row['quality'];
      $products[$cr]['boxtype'] = $row['boxtype'];
      $products[$cr]['inco_terms'] = $row['name'];
      $products[$cr]['mixes'] = 3; //  no DB value ..this value should be loaded from the DB as follows:
      $products[$cr]['mixed_quantity']= $row['mixed_quantity'];
      $products[$cr]['packing']=$row['seventy'];
      $products[$cr]['specie']=$row['specie'];
      $products[$cr]['expiration']=$row['expiration'];
      $products[$cr]['availability']=$row['availability'];
      $products[$cr]['twenty_twenty_five']=$row['twenty_twenty_five'];
      $products[$cr]['thirty_thirty_five']=$row['thirty_thirty_five'];
      $products[$cr]['forty_forty_five']=$row['forty_forty_five'];
      $products[$cr]['fifty_fifty_five']=$row['fifty_fifty_five'];
      $products[$cr]['sixty']=$row['sixty'];
      $products[$cr]['seventy']=$row['seventy'];
      $products[$cr]['eighty']=$row['eighty'];
      $products[$cr]['ninety']=$row['ninety'];
      $products[$cr]['one_hundred']=$row['one_hundred'];
      $products[$cr]['box_type']=$row['box_type'];
      $products[$cr]['price']=$row['plus30'];
     

      $cr++;
  } 
}

$json = json_encode($products);
echo $json;
exit;
?>

