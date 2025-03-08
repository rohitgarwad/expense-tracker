import './App.css'
import ExpenseForm from './components/ExpenseForm'
import ExpenseTable from './components/ExpenseTable'
import expenseData from './expenseData.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

function App() {

  const [expenses, setExpenses] = useLocalStorage('expenses', expenseData)

  return (
    <main>
      <h1>Track Your Expense</h1>
      <div className="expense-tracker">
        <ExpenseForm setExpenses={setExpenses} />
        <ExpenseTable expenses={expenses} setExpenses={setExpenses} />
      </div>
    </main>
  )
}

export default App
