require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.onxirkl.mongodb.net/EmployeeDB`);


  const employeeSchema = {
  id : Number,
  name : String,
  dob : String,
  department : String,
  occupation : String,
  hiredDate : String
};

const Employee = mongoose.model("Employee", employeeSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname+"/index.html");
});

app.post("/", async (req, res) => {
  const foundEmployee = await Employee.findOne({id:req.body.id});
  if(!foundEmployee){
    const employee = new Employee ({
      id : req.body.id,
      name : req.body.employeeName,
      dob : req.body.dob,
      department : req.body.department,
      occupation : req.body.occupation,
      hiredDate : req.body.hiredDate
    });
    employee.save();
    console.log("New employee successfully added to the DB");
    res.redirect("/employees");
  }else {
    res.send("Employee already existed. Please add a new employee");
  }

});

// use async to solve callback function depreciated error "Model.find() no longer accepts a callback"
app.get("/employees", async (req, res) => {
  const foundEmployees = await Employee.find({});
    res.render("employees", {
      foundEmployees: foundEmployees
  });
});

app.post("/delete", async (req, res) => {
  await Employee.findByIdAndRemove(req.body.employee);
  console.log("Employee successfully deleted from the DB");
  res.redirect("/employees");
});

  app.listen(3000, () => {
  console.log("Server has started on port 3000");
});
