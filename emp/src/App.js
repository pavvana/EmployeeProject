import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
constructor (){
  super();
  this.state = {
    title : 'Employee information page',
    employee:[]
  }

}

removeEmployee(id){
var that = this;
let employee = this.state.employee;
let employ = employee.find(function(employ) {
   return employ.id === id
});
var request = new Request('http://localhost:3000/api/remove/'+ id, {
  method:'DELETE'
});

fetch(request)
.then(function(response) {
  employee.splice(employee.indexOf(employ), 1);
  that.setState({
    employee: employee 
  })

  response.json()

  .then(function(data){
  })
})

}

addEmployee(event){
  var that = this ;
  event.preventDefault();
  let employee_data = {
    first_name : this.refs.first_name.value,
    id:this.refs.id.value,
    organization:this.refs.organization.value
  };
  var request = new Request('http://localhost:3000/api/new-employee',{
    method:'POST',
    headers: new Headers ({ 'Content-Type' : 'application/json'}),  
    body:JSON.stringify(employee_data)
  });
  
  let employee = that.state.employee;
    employee.push(employee_data);
    that.setState({
      employee:employee
})

///XML https request 
  fetch(request)
  .then(function(response){
  
    response.json()
    .then(function(data){
    })
  })
    .catch(function(err){
      console.log(err)
    
  })
}

componentDidMount(){
  console.log('component has mounted');
  var that = this;

  fetch ('http://localhost:3000/api/employee')
  .then(function(response){
     response.json()
     .then(function(data){
     that.setState({
    employee: data
  })
     })
  })


}

  render() {
    let title=this.state.title;
    let employee = this.state.employee;
    return (
      <div className="App">
        <h1>{title}</h1>
        <form ref="employeeForm">
        <input type="text" ref="id" placeholder="Please enter ID" />
        <input type="text" ref="first_name" placeholder="Please enter firstname" />
        <input type="text" ref="organization" placeholder="Please enter Organization" />
        <button onClick={this.addEmployee.bind(this)}>Add employee</button>
        
          </form>
          <ul>
            {employee.map(employee =><li key = {employee.id} > {employee.id} {employee.first_name} {employee.organization} <button onClick ={this.removeEmployee.bind(this ,employee.id )}>Remove</button></li>)}
          </ul>
      </div>
    );
  }
}

export default App;
