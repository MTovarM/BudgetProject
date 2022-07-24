const formulario = document.querySelector('#agregar-gasto');
const gastos = document.querySelector('#gastos ul');

EventListener();
function EventListener(){
    document.addEventListener('DOMContentLoaded', askingBudget)

    document.addEventListener('submit', submit);
}

class Budget{
    constructor(budget){
        this.budget = Number(budget);
        this.remaining = Number(budget);
        this.expenses = [];
    }

    fillBill(expensee){
        this.expenses = [...this.expenses, expensee];
        this.calRemaining();
    }

    calRemaining(){
        const spent = this.expenses.reduce( (total, e) => total + e.amount, 0);
        this.remaining = this.budget - spent;
    }

    calPercentage(){
        const med = this.budget * 0.5;
        const min = this.budget * 0.3;
        if (this.remaining < min) {
            ui.changeColorRemaining('alert-danger');
        } else if (this.remaining < med){
            ui.changeColorRemaining('alert-warning');
        } else{
            ui.changeColorRemaining('alert-success');
        }

        if(this.remaining < 0){
            ui.showAlert('exhausted budget','error');
            document.querySelector('button[type="submit"]').disabled = true;
        }
        else{
            document.querySelector('button[type="submit"]').disabled = false;
        }
    }

    removeExpense(id){
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.calRemaining();
    }
}

class UI{
    insertBudget(){
        document.querySelector('#total').textContent = budget.budget;
        document.querySelector('#restante').textContent = budget.remaining;
    }

    showAlert(message, typee){
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if (typee == 'error') divMessage.classList.add('alert-danger');
        else divMessage.classList.add('alert-success');

        divMessage.textContent = message;

        document.querySelector('.primario').insertBefore(divMessage, formulario);

        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    }

    showExpenses(expenses){
        this.cleanHTML();
        expenses.forEach( e =>{
            const {amount, name, id} = e;
            const liHTML = document.createElement('li');
            liHTML.className = 'list-group-item d-flex justify-content-between aling-items-center';
            liHTML.dataset.id = id;
            liHTML.textContent = name;
            const amountt = document.createElement('span');
            amountt.className = 'badge badge-primary badge-pill';
            amountt.textContent = `$ ${amount}`;
            liHTML.appendChild(amountt);

            const button = document.createElement('button');
            button.className = 'btn btn-danger borrar-gasto';
            button.textContent = 'Borrar X';
            button.onclick = () =>{
                removeExpense(id);
            };
            liHTML.appendChild(button);
            gastos.appendChild(liHTML)
        });
    }

    cleanHTML(){
        while(gastos.firstChild){
            gastos.removeChild(gastos.firstChild);
        }
    }

    changeRemaining(remaining){
        document.querySelector('#restante').textContent = remaining;
    }

    changeColorRemaining(classs){
        const remainingDiv = document.querySelector('.restante');
        remainingDiv.className = 'restante alert';
        remainingDiv.classList.add(classs);
        console.log(remainingDiv.classList)
    }
}

let budget;
const ui = new UI();

function askingBudget(){
    const question = prompt('Please, Enter you initial budget: ');

    if (question === '' || question === null || isNaN(question) || question <= 0) {
        window.location.reload();
    }

    budget = new Budget(question);
    ui.insertBudget();
}

function submit(e){
    e.preventDefault();
    const name = document.querySelector('#gasto').value;
    const amount = Number(document.querySelector('#cantidad').value);

    if (name === '' || amount === '') {
        ui.showAlert('Fill the empty fields please', 'error');
        return;
    } else if (amount <= 0 || isNaN(amount)) {
        ui.showAlert('Enter a valid amount', 'error');
        return;
    }
    //destructuring
    const expense = {name, amount, id: Date.now()};

    budget.fillBill(expense);
    ui.showAlert('Expense added');
    const {expenses, remaining } = budget;
    ui.showExpenses(expenses);
    ui.changeRemaining(remaining);
    budget.calPercentage();
}


function removeExpense(id){
    budget.removeExpense(id);
    const {expenses, remaining} = budget;
    ui.showExpenses(expenses);
    ui.changeRemaining(remaining);
    budget.calPercentage();
}