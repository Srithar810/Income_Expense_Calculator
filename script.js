const balance = document.querySelector("#balance");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");

// const dummyData =[
//     {id:1,description:"salary",amount:35000},
//     {id:2,description:"petrol",amount:-400},
//     {id:3,description:"rent",amount:-5000},
//     {id:4,description:"food",amount:-4500},
//     {id:5,description:"movie",amount:-1000},
//     {id:6,description:"emi",amount:-6000},
// ];

// let transaction = dummyData;

// localStorage
const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];

// transaction details get from data
function loadTransactionDetails(transaction){
    // console.log(transaction);
    const sign = transaction.amount < 0 ? "-" : "+";
    // console.log(sign)
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "exp": "inc");
    item.innerHTML = `
        ${transaction.description}
        <span> ${sign} ${Math.abs(transaction.amount)}</span>
        <button class="btn-del" onclick="removeTrans(${transaction.id})"> X </button>
    `;
    trans.appendChild(item);
}
// loadTransactionDetails(transaction);

function removeTrans(id){
    if (confirm("Are you sure you want to delete transaction?")){
        transactions = transactions.filter((transaction) => transaction.id != id);
        config();
        updateLocalStorange();
    }else{
        return;
    }
};



function updateAmount(){
    const amounts= transactions.map((transaction)=> transaction.amount);
    console.log(amounts);
    const total = amounts.reduce((acc,item)=>(acc += item),0).toFixed(2);
    balance.innerHTML= `₹ ${total}`;
    //income box
    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc,item) => (acc += item),0)
        .toFixed(2);
    inc_amt.innerHTML= `₹ ${Math.abs(income)}`;
    //expense box
    const expence = amounts
        .filter((item)=>item < 0)
        .reduce((acc,item) => (acc += item),0)
        .toFixed(2);
    exp_amt.innerHTML= `₹ ${Math.abs(expence)}`
    
}

// transaction area clear
function config(filter = 'all'){
    trans.innerHTML = '';
    let filteredTrans = transactions;

    if(filter === "income"){
        filteredTrans = transactions.filter(transaction => transaction.amount > 0);
    }else if(filter === "expense"){
        filteredTrans = transactions.filter(transaction =>transaction.amount < 0);
    }
    filteredTrans.forEach(loadTransactionDetails);


    // transactions.forEach(loadTransactionDetails);
    updateAmount();
}

function addTransaction(e){
    e.preventDefault();
    if(description.value.trim() == "" || amount.value.trim() == ""){
        alert("Please Enter Description and amount");
    }else{
        const transaction = {
            id:uniqueId(),
            description:description.value,
            amount:+amount.value,
        };
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        description.value = "";
        amount.value = "";
        updateAmount();
        updateLocalStorange();
    }
}

form.addEventListener("submit",addTransaction);

document.querySelectorAll('input[name="filter"]').forEach((radio)=>{
    radio.addEventListener("change", (e)=>{
        config(e.target.value);
    });
});

window.addEventListener('load',function(){
    config();
});



function updateLocalStorange(){
    localStorage.setItem("trans", JSON.stringify(transactions));
}


function uniqueId(){
    return Math.floor(Math.random()* 1000000)
};

