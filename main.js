document.getElementById("storebutton").addEventListener("click", loadStore);
document.getElementById("cartbutton").addEventListener("click", loadCart)

// Function that gets data with all products from the API.
//When te data is collectet, render-function is called to display all products.
function loadStore(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products/");
    xhr.send();

    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200){
            let resp = JSON.parse(xhr.responseText);
            renderProducts(resp);
        }
    }  
}

//Creates the page where all products is shown. This function renders all the HTML necessary to display all products in an 
//ordered way and then injects the code to the "target"-div
function renderProducts (products){
    let output = `<div class="row col-9 d-flex justify-center">`

    products.forEach(product => {
        output += `<div class="col-md-4 col-xs-6" style="max-height:800px; min-height:800px">
        <div style="background-color:white" class="product row">
            <div style="max-height:350px; min-height:350px" class="product-img col-2">
                <img style="max-height:350px" src="${product.image}" alt="">
            </div>
            <div class="product-body">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name"><a href="#">${product.title}</a></h3>
                <h4 class="product-price">$ ${product.price}</h4>
                <p>${product.description}</p>
            </div>
            <div class="add-to-cart">
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i> add to cart</button>
            </div>
        </div>
    </div>`
    });
    output +=`<div>`
    document.getElementById("target").innerHTML = output;
}

/* Is called when customer clicks on "add to cart" on any product. 
It creates a shoppingcart in the customers localstorage. The shoppingcart contains an array.
when i product is added, an array (productArray) is added to the shoppingcarts array and makes the shoppingcart a two-dimenstional array.
the fucntion also checks whether or not the product already exists in the shoppincart in localstorage. 
In that case, it pushes the new product into the productarray instead of into shoppingcart-array. This way we can keep track of the
number of same product the shoppingcart carries*/ 
function addToCart(id){
    xhr  = new XMLHttpRequest();
    xhr.open("GET", `https://fakestoreapi.com/products/${id}`);
    xhr.send();

    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && xhr.status == 200){
           
            let existed = false;
            let shoppingcart = []
            let product = JSON.parse(xhr.responseText)
            if(localStorage.getItem("shoppingcart")){
                shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"));
            }
            shoppingcart.forEach(productarray => {
                if(productarray[0].id == product.id){
                    productarray.push(product)
                    existed = true;
                }
            });
            if(!existed) shoppingcart.push([product])
            localStorage.setItem("shoppingcart", JSON.stringify(shoppingcart))
        }
    }
}


/*Gets all the products from localstorage. 
Because of the shoppingcarts structure this function doesnt accutally get *all products from shoppincart
but instead just the first of each productarray. We instead show the quanity of each product as a digit on each product.*/
function loadCart(){
    let shoppingcart = [];

    if(localStorage.getItem("shoppingcart")){
        shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"));
    }

    let output ="";
    let productArrayId = 0;
    shoppingcart.forEach(productarray => {
      
        output += 
        `
         <div class="row d-flex justify-around" style="height:170px">
            <div class="img-wrap col-lg-2">
                <img class="cartimg" src="${productarray[0].image}" />
            </div>
            <div class="col-lg-6" style="text-align:center">
                ${productarray[0].title}
                ${productarray[0].price}
            </div>
            <div class="col-lg-2">
                <button onclick="removeAll(${productArrayId})"class="btn btn-danger">Remove</button>
                <div>
                <button onclick="removeOne(${productArrayId})" class="btn btn-white">-</button>
                ${productarray.length}
                <button onclick="addOne(${productArrayId})" class="btn btn-white">+</button>
                </div>
            </div>
        </div>
        `
        productArrayId++;
    });
    if(shoppingcart.length>=1) output += `<div class="row">
                                            <div class="col-lg-6"><button onclick="loadCheckout()" class="btn btn-success">Checkout</div>
                                           <div class="col-lg-6"><button onclick="clearShoppingcart()" class="btn btn-danger">Clear shoppingcart</div>
                                           </div>`
    else output +=`<h2>Your cart is empty<h2>`
    document.getElementById("target").innerHTML = output
}

//removes *ALL products of chosen kind
function removeAll(productArrayId){
    let shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"));
    shoppingcart.splice(productArrayId, 1)

    localStorage.setItem("shoppingcart", JSON.stringify(shoppingcart))
    loadCart();
}

function clearShoppingcart(){
    localStorage.removeItem("shoppingcart")
    loadCart();
}

//removes *ONE product of chosen kind
function removeOne(productArrayId){
    let shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"));

    shoppingcart[productArrayId].pop()
    
    if(shoppingcart[productArrayId].length<1){
        
        shoppingcart.splice(productArrayId, 1)
    } 
    
    localStorage.setItem("shoppingcart", JSON.stringify(shoppingcart))
    loadCart();
}

//Add one prodcut on chosen kind
function addOne(productArrayId){
    let shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"));
    
    shoppingcart[productArrayId].push(shoppingcart[productArrayId][0])

    localStorage.setItem("shoppingcart", JSON.stringify(shoppingcart))

    loadCart();
}

/*Generates HTML-code that creats checkoutform then injects the code into target-div. 
Then calls the method to generate a summary of the customers shoppingcart*/   
function loadCheckout(){
    
    let output =`
    <div class="row">
    <div class="col-lg-6 container bg-default">
			
    <h4 class="my-4">
            Billing Address
    </h4>
    
    <form>
        <div class="form-row">
            <div class="form-group p-0">
                <label for="firstname">First Name</label>
                <input id="firstname" type="text" class="form-control" >

            </div>

            <div class="form-group">
                <label for="lastname">Last Name</label>
                <input id="lastname" type="text" class="form-control" >

            </div>
        </div>

        <div class="form-group">
                <label for="phonenumber">Phonenumber</label>
                <input id="phonenumber" type="phonenumber" class="form-control">
        </div>

        <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" class="form-control" >
        </div>

        <div class="form-group">
            <label for="adress">Adress</label>
            <input id="adress" type="text" class="form-control" >

        </div>

        <div class="form-group">
            <label for="city">city</label>
            <input id="city" type="text" class="form-control" >

        </div>

        <div class="form-group">
            <label for="address2">Country
            </label>
            <input id="country" type="text" class="form-control" id="Country">
        </div>
        <div id="errorfield" style="color:red"></div>
        <button onclick="validateCheckout()" type="submit" class="btn btn-success">Purchase</button>
       </form>
</div>
    <div class="col-lg-6" id="checkoutsummary"></div>
</div>`
    document.getElementById("target").innerHTML = output;
    checkoutsummary();
}
/**Gets all the products from localstorage and generates a summary. 
 *It then injects the code into the checkoutsummary-div inside the target-div */
function checkoutsummary(){
    let shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"))
    totalprice = 0;
    shoppingcart.forEach(productarray => {
        productarray.forEach(product => {
            totalprice +=product.price
        });
    });
    let output =""

    shoppingcart.forEach(productarray => {
        output+=`
        <h2>Summary</h2>
       
        <div class="row d-flex justify-around" style="height:170px">
            <div class="img-wrap col-lg-1">
                <img class="cartimg" src="${productarray[0].image}" />
            </div>
            <div class="col-lg-6" style="text-align:center">
                ${productarray[0].title} <br>
                $ ${productarray[0].price}
            </div>
            <div class="col-lg-2">
                amount: ${productarray.length} 
            </div>
        </div>`
    });
    output +=`<div style="text-align: right;"><h4>Total price: $${totalprice}</h4></div>`
    document.getElementById("checkoutsummary").innerHTML = output;
}

/**Creates a simple validation to insure that the checkoutform is not left empty.
 * then calls the thankyou-function if the validation is accepted.
 */
function validateCheckout(){
    let output = []
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let email = document.getElementById("email").value;
    let phonenumber = document.getElementById("phonenumber").value;
    let city = document.getElementById("city").value;
    let adress = document.getElementById("adress").value;

    if(firstname == "") output.push("Firstname required")
    if(lastname == "") output.push("Lastname required")
    if(email == "") output.push("Email reguired")
    if(phonenumber == "") output.push("Number required")
    if(city == "") output.push("City required")
    if(adress == "") output.push("Adress required")
    console.log(output)

    if(output.length>0) document.getElementById("errorfield").innerHTML = output.join(",<br>");
    else thankyou();

}

function thankyou(){
    localStorage.removeItem("shoppingcart");
    document.getElementById("target").innerHTML = `<h1>Thank you for your purchase!</h1>`;
}
