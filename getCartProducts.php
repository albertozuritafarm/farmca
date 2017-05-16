<?php
include 'connect_sande.php';

$connect = connect();

// Get the data
$people = array();
$products[] = array();
/*$sql = "SELECT IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P
 LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID";*/

$sql="SELECT DISTINCT specie,box, PA.variety,PA.twenty_twenty_five,PA.thirty_thirty_five, PA.forty_forty_five, PA.fifty_fifty_five, PA.sixty,PA.seventy,PA.eighty,
PA.ninety,PA.one_hundred,IT.name, I.productID, description, color, length,inventory_quantity, quantity,mixed_quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P INNER JOIN packings AS PA on (P.specie = PA.variety) LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID WHERE PA.seventy=6 && box=PA.box_type";

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
      $products[$cr]['price'] = $row['price'];
      $products[$cr]['mix_price'] = $row['mix_price'];
      $products[$cr]['quality'] = $row['quality'];
      $products[$cr]['boxtype'] = $row['boxtype'];
      $products[$cr]['inco_terms'] = $row['name'];
      $products[$cr]['mixes'] = 3; //  no DB value ..this value should be loaded from the DB as follows:
      $products[$cr]['mixed_quantity']= $row['mixed_quantity'];
      $products[$cr]['packing']=$row['seventy'];
      $products[$cr]['specie']=$row['specie'];
      $products[$cr]['twenty_twenty_five']=$row['twenty_twenty_five'];
      $products[$cr]['thirty_thirty_five']=$row['thirty_thirty_five'];
      $products[$cr]['forty_forty_five']=$row['forty_forty_five'];
      $products[$cr]['fifty_fifty_five']=$row['fifty_fifty_five'];
      $products[$cr]['sixty']=$row['sixty'];
      $products[$cr]['seventy']=$row['seventy'];
      $products[$cr]['eighty']=$row['eighty'];
      $products[$cr]['ninety']=$row['ninety'];
      $products[$cr]['one_hundred']=$row['one_hundred'];
     

      $cr++;
  } 
}

$json = json_encode($products);
echo $json;
exit;

?>

