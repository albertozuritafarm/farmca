<?php
//include "connect.php";
include "connect_sande.php";

$connect = connect();

// Add the new data to the database.
$postdata = file_get_contents("php://input");
if(isset($postdata) && !empty($postdata))
{
  $request     = json_decode($postdata);
  $items = $request->itemarray;
//$items['car'] = 3;
   foreach($items as $key => $value){
   //echo $value;


   }
function hasMix($items){
$isMix = 0;
foreach($items as $arr){
        $mix_quantity = $arr->mixed_quantity;
        if($mix_quantity >0){
        $isMix = 1; break; 
        }
}
return $isMix;

}

function getMixCost($items, $mix_number){
foreach($items as $arr){
        $mix_quantity = $arr->mixed_quantity;
        if($mix_quantity > 0 ){
        if($arr->length==35){
        $stem_bunches = $arr->thirty_thirty_five;
        }
        else if($arr->length==45){
        $stem_bunches = $arr->forty_forty_five;
        }
        else if($arr->length==55){
        $stem_bunches = $arr->fifty_fifty_five;
        }
        else if($arr->length==70){
        $stem_bunches = $arr->seventy;
        }
        $stembox = $stem_bunches * $arr->stems;
        $price = $arr->price;
        }
}
echo 'price ' . $price . ' stembox ' . $stembox . ' mix number ' . $mix_number;  // price is obtained from last product selected. This will change from DB price instead
$cost =$price * $stembox * $mix_number;
return $cost;

}

if(hasMix($items)==1){
    $rootName = 'Assorted';
    $rootSolid = 'Assorted';
    $id = 0;
    $mix_cost=getMixCost($items, $request->mix_number);
    $sql_is_mix = "INSERT INTO `temp_cart`(`realProductID`,`productName`, `quantity`, `price`, `cost`, `boxMarking`, `mixCost`) VALUES ('$id','$rootName','$request->mix_number', '0', '0', '$rootSolid', '$mix_cost')";
    if(mysqli_query($connect,$sql_is_mix)){
     //echo "succesfull insertion";
    }
    else{
        echo "Error: " . $sql_is_mix . "<br>" . mysqli_error($connect);
    }

}
$counter = 0;
foreach ($items as $arr) {
        $mix_quantity = $arr->mixed_quantity;
        if($mix_quantity >0){
        echo $arr->name;
        $counter++;
        }
}
//echo 'there are ' . $counter .   ' mix products ';

    $sql_assorted = "SELECT tempCartID from temp_cart where realProductID=0 order by tempCartID desc";
    if($assorted_result = mysqli_query($connect,$sql_assorted)){
    $count = mysqli_num_rows($assorted_result);
       if($row = mysqli_fetch_assoc($assorted_result)){
       $lastid = $row['tempCartID'];

       }
    }
echo $lastid;

//print_r($items);

foreach ($items as $arr) {

        $mix_quantity = $arr->mixed_quantity;
        $quantity = $arr->quantity;
        if($quantity > 0 ){
        if($arr->length==35){
        $stem_bunches = $arr->thirty_thirty_five;
        }
        else if($arr->length==45){
        $stem_bunches = $arr->forty_forty_five;
        }
        else if($arr->length==55){
        $stem_bunches = $arr->fifty_fifty_five;
        }
        else if($arr->length==70){
        $stem_bunches = $arr->seventy;
        }
        $stembox = $stem_bunches * $arr->stems;
        $number_boxes = $arr->quantity;
        $cost = $number_boxes * $stembox * $arr->price;
       // GET COST FOR MIAMI :
        //if($arr->inco_terms =='FOB MIA (STOCK)'){
        if($arr->inco_terms =='FOB UIO'){
        echo 'EUREKA! ' . $arr->box_type;
        
    $sql_kilos_per_box = "SELECT kilosPerBox from kilos_per_box where boxType='$arr->box_type'";
    if($kilos_box_cost = mysqli_query($connect,$sql_kilos_per_box)){
    $count = mysqli_num_rows($kilos_box_cost);
       if($row = mysqli_fetch_assoc($kilos_box_cost)){
       $kilo_cost = $row['kilosPerBox'];

       }
    }
        echo 'kilo cost is :' . $kilo_cost;
        //$cost = $cost * $kilo_cost;
        }

        $mix_quantity = $arr->mixed_quantity;
        $quantity = $arr->quantity;
        $id  = $arr->productid;
        $newName = $arr->name;
        $newQuantity =$arr->quantity;
        $newMixQuantity =$arr->mixed_quantity;
        $newPrice = $arr->price;
        //$newCost =  $arr->cost;
        $newCost =  $cost;
        $newMarkSolid  = $arr->marksolid;
        $sql_solid = "INSERT INTO `temp_cart`(`realProductID`,`productName`, `quantity`,`stemBox`, `price`, `cost`, `boxMarking`, `packing`) VALUES ('$id','$newName','$newQuantity',
        '$stembox','$newPrice', '$newCost', '$newMarkSolid', '$stem_bunches')";
        if(mysqli_query($connect,$sql_solid)){
        //echo "succesfull insertion";
        }
        else{
        echo "Error: " . $sql_solid . "<br>" . mysqli_error($connect);
        }
}


        if($mix_quantity >0){
        echo $arr->name;
        $mix_name = $arr->name;
        //$num_boxes = $arr->mix_number;
        $num_boxes = $request->mix_number;
        echo 'number of boxes is: ' . $num_boxes;

        $sql_mix = "INSERT INTO `mix_cart`(`tempCartID`,`name`, `mixed_quantity`, `number_boxes`) VALUES ('$lastid','$mix_name', '$mix_quantity', '$num_boxes')";
        if(mysqli_query($connect,$sql_mix)){
        }
        else{
        echo "Error: " . $sql . "<br>" . mysqli_error($connect);
        }
        }


}

//print_r($items);
//echo($items);
    
    /*$newName  = preg_replace('/[^a-zA-Z ]/','',$request->name);
    $id  = (int)$request->recordId;
    $newQuantity =(int)$request->quantity;
    //$newMixQuantity =(int)$request->mixed_quantity;
    $newMixQuantity =$request->mixed_quantity;
    $newPrice = (double)$request->price;
    $newCost =  (double)$request->cost;
    $newMarkSolid  = preg_replace('/[^a-zA-Z ]/','',$request->marksolid);
    $isMix = $request->isMix;
    $mixCounter = $request->mix_counter;
    //$isMix = 1;
    if($newQuantity >0){

    $sql = "INSERT INTO `temp_cart`(`realProductID`,`productName`, `quantity`, `price`, `cost`, `boxMarking`) VALUES ('$id','$newName','$newQuantity', '$newPrice', '$newCost', '$newMarkSolid')";
    if(mysqli_query($connect,$sql)){
     //echo "succesfull insertion";
    }
    else{
        echo "Error: " . $sql . "<br>" . mysqli_error($connect);
    }
    } // if quantity

    if($newMixQuantity > 0){
    if($isMix ==1 && $mixCounter ==0){
    $rootName = 'Assorted';
    $rootSolid = 'Assorted';
    $id = 0;
    $sql_is_mix = "INSERT INTO `temp_cart`(`realProductID`,`productName`, `quantity`, `price`, `cost`, `boxMarking`, `packing`) VALUES ('$id','$rootName','0', '0', '0', '$rootSolid', '0')";
    if(mysqli_query($connect,$sql_is_mix)){
     //echo "succesfull insertion";
    }
    else{
        echo "Error: " . $sql_is_mix . "<br>" . mysqli_error($connect);
    }
    } */ 

    /***** GET CURRENT ASSORTED tempCartID *********/

//$json = json_encode($id);
    
/*
    $sql_assorted = "SELECT tempCartID from temp_cart where realProductID=0 order by tempCartID desc";
    if($assorted_result = mysqli_query($connect,$sql_assorted)){
    $count = mysqli_num_rows($assorted_result);
       if($row = mysqli_fetch_assoc($assorted_result)){
       $lastid = $row['tempCartID'];

       }
    }
echo $lastid;

      
    //$sql_mix = "INSERT INTO `temp_cart`(`realProductID`,`productName`, `quantity`, `price`, `cost`, `boxMarking`) VALUES ('$id','$newName','$newQuantity', '$newPrice', '$newCost', '$newMarkSolid')";
    $sql_mix = "INSERT INTO `mix_cart`(`tempCartID`,`name`, `mixed_quantity`) VALUES ('$lastid','$newName', '$newMixQuantity')";
    if(mysqli_query($connect,$sql_mix)){
     //echo "succesfull insertion";
    }
    else{
        echo "Error: " . $sql . "<br>" . mysqli_error($connect);
    }
    }

exit; */
}

?>
