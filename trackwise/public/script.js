const API="http://localhost:3000/api";

function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

function formatDate(dateStr) {
  return dateStr;
}

function formatNumber(num) {
  return parseFloat(num).toLocaleString('en-IN');
}

function loadCategories() {
  console.log("loadCategories called");
  
  const categorySelect = document.getElementById("category");
  const editCategorySelect = document.getElementById("editCategory");
  
  console.log("categorySelect found:", !!categorySelect);
  console.log("editCategorySelect found:", !!editCategorySelect);
  
  if (!categorySelect) {
    console.error("ERROR: Could not find element with id='category'");
    return;
  }
  
  console.log("Fetching from:", API+"/expenses/categories");
  
  fetch(API+"/expenses/categories")
  .then(res => {
    console.log("Response status:", res.status, res.statusText);
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    return res.json();
  })
  .then(categories => {
    console.log("✓ Categories fetched successfully. Count:", categories.length);
    console.log("Categories data:", categories);
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    categories.forEach((cat, index) => {
      console.log("Adding option", index + 1, ":", cat.name);
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
    
    console.log("✓ All categories added to dropdown");
    console.log("Dropdown now has", categorySelect.options.length, "options");
    
    if (editCategorySelect) {
      editCategorySelect.innerHTML = '<option value="">Select Category</option>';
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        editCategorySelect.appendChild(option);
      });
      console.log("✓ Categories also added to edit dropdown");
    }
  })
  .catch(err => {
    console.error("✗ Error loading categories:", err.message);
    console.error("Full error:", err);
  });
}

function register(){

const data={
username:document.getElementById("rusername").value.trim(),
email:document.getElementById("remail").value.trim(),
password:document.getElementById("rpassword").value,
monthlyLimit:document.getElementById("limit").value
};

if(!data.username || !data.email || !data.password || !data.monthlyLimit){
alert("Please fill in all fields");
return;
}

fetch(API+"/auth/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})
.then(res=>{
if(!res.ok) throw new Error("Registration failed");
return res.json();
})
.then(response=>{
if(response.message && response.message.includes("Registered")){
alert("Registered Successfully! Please login now.");
window.location="login.html";
} else {
alert("Registration successful");
window.location="login.html";
}
})
.catch(error=>{
console.error("Error:", error);
alert("Error registering: " + error.message);
});
}


function login(){

const data={
username:document.getElementById("username").value.trim(),
password:document.getElementById("password").value
};

if(!data.username || !data.password){
alert("Please enter username and password");
return;
}

fetch(API+"/auth/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})
.then(res=>{
if(!res.ok) throw new Error("Login failed");
return res.json();
})
.then(user=>{
if(user.message && user.message.includes("Invalid")){
alert("Invalid username or password");
} else if(user.id){
localStorage.setItem("user",JSON.stringify(user));
setTimeout(()=>{
window.location="index.html";
}, 100);
} else {
alert("Login failed");
}
})
.catch(error=>{
console.error("Error:", error);
alert("Error logging in: " + error.message);
});
}


function addExpense(){

const user=JSON.parse(localStorage.getItem("user"));
if(!user){
alert("Please login first");
window.location="login.html";
return;
}

const titleInput = document.getElementById("title").value.trim();
const amountInput = document.getElementById("amount").value.trim();
const dateInput = document.getElementById("date").value;
const categoryInput = document.getElementById("category").value;

if(!titleInput || !amountInput || !dateInput || !categoryInput){
alert("Please fill in all fields");
return;
}

const data={
user_id:user.id,
amount:parseFloat(amountInput),
description:titleInput,
date:dateInput,
category:categoryInput
};

console.log("Sending expense data:", data);

fetch(API+"/expenses/add",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})
.then(res=>{
console.log("Response status:", res.status);
if(!res.ok){
return res.json().then(err => {
throw new Error(err.error || err.message || "Network response was not ok");
});
}
return res.json();
})
.then(response=> {
console.log("Response:", response);
alert(response.message);
document.getElementById("title").value = "";
document.getElementById("amount").value = "";
document.getElementById("date").value = new Date().toISOString().split('T')[0];
document.getElementById("category").value = "";
loadExpenses();
})
.catch(error=>{
console.error("Error:", error);
alert("Error adding expense: " + error.message);
});
}

function loadExpenses(){
const user=JSON.parse(localStorage.getItem("user"));
if(!user) {
  console.log("No user found in localStorage");
  return;
}

console.log("Loading expenses for user:", user.id);

const tableBody=document.getElementById("expenseTableBody");
console.log("Table body element found:", !!tableBody);

if (!tableBody) {
  console.error("ERROR: Could not find expenseTableBody element!");
  return;
}

fetch(API+"/expenses/"+user.id)
.then(res=>{
  console.log("API response status:", res.status);
  if(!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
})
.then(expenses=>{
  console.log("✓ Expenses received from API. Count:", expenses.length);
  console.log("Expenses data:", expenses);
  
  tableBody.innerHTML="";
  
  // Display ALL expenses (not filtering by month)
  let total = 0;
  
  expenses.forEach((exp, index)=>{
    console.log("Processing expense", index + 1, ":", exp.description, "Amount:", exp.amount, "Date:", exp.date);
    
    total += parseFloat(exp.amount);
    
    const row=document.createElement("tr");
    const amount = parseFloat(exp.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    
    // Format date: convert "2026-03-11T18:30:00.000Z" to "2026-03-11"
    const dateStr = exp.date.split('T')[0];
    
    row.innerHTML=`
<td>${exp.description}</td>
<td>${amount}</td>
<td>${dateStr}</td>
<td>${exp.category || 'N/A'}</td>
<td>
<button class="btn-edit" onclick="editExpense(${exp.id})">Edit</button>
<button class="btn-delete" onclick="deleteExpense(${exp.id})">Delete</button>
</td>
`;
    tableBody.appendChild(row);
    console.log("✓ Added row to table for:", exp.description);
  });

  // Set total and limit
  const totalFormatted = parseFloat(total).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', '').trim();
  const limitFormatted = parseFloat(user.monthlyLimit).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).replace('₹', '').trim();
  document.getElementById("total").textContent = totalFormatted;
  document.getElementById("limit").textContent = limitFormatted;
  
  console.log("✓ Total expenses displayed in table:", expenses.length);
  
  const warning = document.getElementById("warning");
  if(total > parseFloat(user.monthlyLimit)){
    warning.textContent = "⚠️ Warning: You have exceeded your monthly limit!";
    warning.classList.add("show");
  } else {
    warning.classList.remove("show");
  }
})
.catch(err=>{
  console.error("✗ Error loading expenses:", err.message);
  console.error("Full error:", err);
});
}

function deleteExpense(expenseId){
if(confirm("Are you sure you want to delete this expense?")){
fetch(API+"/expenses/"+expenseId,{
method:"DELETE",
headers:{"Content-Type":"application/json"}
})
.then(res=>res.json())
.then(response=>{
alert("Expense deleted");
loadExpenses();
})
.catch(err=>alert("Error deleting expense: " + err));
}
}

let currentEditingExpenseId = null;

function editExpense(expenseId){
fetch(API+"/expenses/single/"+expenseId)
.then(res=>{
if(!res.ok) throw new Error("Failed to fetch expense");
return res.json();
})
.then(expense=>{
if(expense){
currentEditingExpenseId = expense.id;
document.getElementById("editTitle").value = expense.description;
document.getElementById("editAmount").value = expense.amount;
document.getElementById("editDate").value = expense.date;
document.getElementById("editCategory").value = expense.category || "";
openEditModal();
} else {
alert("Expense not found");
}
})
.catch(err=>{
console.error("Error fetching expense:", err);
alert("Error loading expense: " + err.message);
});
}

function openEditModal(){
document.getElementById("editModal").classList.add("show");
}

function closeEditModal(){
document.getElementById("editModal").classList.remove("show");
currentEditingExpenseId = null;
}

function closeEditModalOnBackdrop(event){
if(event.target.id === "editModal"){
closeEditModal();
}
}

function saveExpense(){
if(!currentEditingExpenseId){
alert("No expense selected");
return;
}

const titleInput = document.getElementById("editTitle").value.trim();
const amountInput = document.getElementById("editAmount").value.trim();
const dateInput = document.getElementById("editDate").value;
const categoryInput = document.getElementById("editCategory").value;

if(!titleInput || !amountInput || !dateInput || !categoryInput){
alert("Please fill in all fields");
return;
}

const data={
description: titleInput,
amount: parseFloat(amountInput),
date: dateInput,
category: categoryInput
};

fetch(API+"/expenses/"+currentEditingExpenseId,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})
.then(res=>{
if(!res.ok) throw new Error("Update failed");
return res.json();
})
.then(response=>{
alert("Expense updated successfully");
closeEditModal();
loadExpenses();
})
.catch(error=>{
console.error("Error:", error);
alert("Error updating expense: " + error.message);
});
}

function updateUser(){
const user=JSON.parse(localStorage.getItem("user"));
const username = document.getElementById("susername").value.trim();
const password = document.getElementById("spassword").value;
const monthlyLimit = document.getElementById("slimit").value;

if(!username || !password || !monthlyLimit){
alert("Please fill in all fields");
return;
}

const data={
username: username,
email: user.email,
password: password,
monthlyLimit: monthlyLimit
};

fetch(API+"/auth/update/"+user.id,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})
.then(res=>{
if(!res.ok) throw new Error("Update failed");
return res.json();
})
.then(response=>{
alert(response.message);
// Update localStorage
user.username = data.username;
user.password = data.password;
user.monthlyLimit = data.monthlyLimit;
localStorage.setItem("user", JSON.stringify(user));
})
.catch(error=>{
console.error("Error:", error);
alert("Error updating profile: " + error.message);
});
}

function loadUser(){
const user=JSON.parse(localStorage.getItem("user"));
if(!user) return;
document.getElementById("susername").value = user.username;
document.getElementById("semail").value = user.email;
document.getElementById("spassword").value = user.password;
document.getElementById("slimit").value = user.monthlyLimit;
}

function logout(){
localStorage.removeItem("user");
window.location="login.html";
}

window.onload=function(){
console.log("Page loaded, checking user...");
const user=JSON.parse(localStorage.getItem("user"));

// Get current page
const currentPage = window.location.pathname;
console.log("Current page: " + currentPage);
console.log("User found: " + (user ? "YES" : "NO"));

if(currentPage.includes("login.html")){
// Login page - no special action needed
console.log("On login page");
} else if(currentPage.includes("register.html")){
// Register page - no special action needed
console.log("On register page");
} else if(currentPage.includes("settings.html")){
if(!user){
window.location="login.html";
return;
}
console.log("On settings page with user");
loadUser();
} else if(currentPage.includes("index.html") || currentPage === "/" || currentPage === ""){
if(!user){
console.log("No user found, redirecting to login");
window.location="login.html";
return;
}
console.log("On index/dashboard page with user, loading categories...");
const usernameEl = document.getElementById("username");
if (usernameEl) {
  usernameEl.textContent = "Welcome, " + user.username;
} else {
  console.error("Username element not found in HTML");
}
// Set today's date as default
const today = new Date().toISOString().split('T')[0];
const dateEl = document.getElementById("date");
if (dateEl) {
  dateEl.value = today;
}
console.log("Loading categories...");
loadCategories();
console.log("Loading expenses...");
loadExpenses();
}
}