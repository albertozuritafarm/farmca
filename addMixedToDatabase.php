<?php
//include "connect.php";
include "connect_sande.php";

$connect = connect();

// Add the new data to the database.
$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $request     = json_decode($postdata);
    
    $newName  = preg_replace('/[^a-zA-Z ]/','',$request->name);
    $id  = (int)$request->recordId;
    $newQuantity =(int)$request->quantity;
    $newPrice = (double)$request->price;

    $sql = "INSERT INTO `temp_cart`(`realProductID`,`productName`, `quantity`, `price`) VALUES ('$id','$newName','$newQuantity', '$newPrice')";
    if(mysqli_query($connect,$sql)){
     echo "succesfull insertion";
    }
    else{
        echo "Error: " . $sql . "<br>" . mysqli_error($connect);
    }


exit;
}

?>
