<?php
include 'connect_sande.php';

$connect = connect();

// Get the data
$people = array();
$products[] = array();
/*$sql = "SELECT IT.name, I.productID, description, color, length,inventory_quantity, quantity,stems, price,mix_price, quality, boxtype FROM `products` AS P
 LEFT JOIN `inventory` AS I ON P.productID = I.productID LEFT JOIN `inco_terms` AS IT on IT.incoTermsID=I.incoTermsID";*/
$sql = "SELECT stemBox, tempCartID, realProductID, productName, quantity,stemBox, color, grade, price, cost, boxMarking, packing from `temp_cart` WHERE 1"; 
//$sql = "SELECT tempCartID, realProductID, productName, quantity,stemBox, color, grade, price, cost, boxMarking, packing from `temp_cart` WHERE 1"; 
if($result = mysqli_query($connect,$sql))
{
  $count = mysqli_num_rows($result);

  $cr = 0;
  $solids_cost=0;
  while($row = mysqli_fetch_assoc($result))
  {
      //$products[$cr]['description'] = $row['description'];
      $products[$cr]['productid'] = $row['realProductID'];
      $products[$cr]['name'] = $row['productName'];
      $products[$cr]['color']  = $row['color'];
      $products[$cr]['grade'] = $row['grade'];
      $products[$cr]['quantity'] = $row['quantity'];
      $products[$cr]['stembox']= $row['stemBox'];
     // $products[$cr]['inventory_quantity'] = $row['inventory_quantity'];
     // $products[$cr]['stems'] = $row['stems'];
      $products[$cr]['price'] = $row['price'];
      //$products[$cr]['mix_price'] = $row['mix_price'];
      //$products[$cr]['quality'] = $row['quality'];
      //$products[$cr]['boxtype'] = $row['boxtype'];
      //$products[$cr]['inco_terms'] = $row['name'];
      //$products[$cr]['mixes'] = 3;
        $products[$cr]['tempcartid'] = $row['tempCartID'];
        $products[$cr]['cost'] = $row['cost'];
        $products[$cr]['marksolid'] = $row['boxMarking'];
        $products[$cr]['packing'] = $row['packing'];
        $products[$cr]['stembox'] = $row['stemBox'];
        if($row['quantity'] >0){
        $solids_cost += $products[$cr]['cost'];
        $products[$cr]['total_cost'] = $solids_cost;
        }
      $cr++;
  } 
}

$json = json_encode($products);
echo $json;
exit;

?>

