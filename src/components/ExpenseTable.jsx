import { useState } from 'react'
import { useFilter } from '../hooks/useFilter'
import ContextMenu from './ContextMenu'
import { useLocalStorage } from '../hooks/useLocalStorage'

function ExpenseTable({ expenses, setExpenses }) {

    const [filteredData, query, setQuery] = useFilter(expenses, (data) => data.category)
    const [contextMenuPosition, setContextMenuPosition] = useState({})
    const [rowId, setRowId] = useState('')
    const [editExpense, setEditExpense] = useLocalStorage('editExpense', {
        rowId: '',
        isEdit: false
    })
    const [errors, setErrors] = useState({})
    const [sortCallback, setSortCallback] = useState(() => () => {})

    const validateConfig = {
        title: [
            { required: true, message: "Title is required" },
            { minLength: 3, message: "Title should be 3 at least characters long" }
        ],
        category: [
            { required: true, message: "Please Select a Category" },
        ],
        amount: [
            { required: true, message: "Please Enter an Amount" },
            { pattern: /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/, message: "Please Enter a Valid Amount" }
        ]
    }

    const validate = (formData) => {
        const errorsData = {}

        Object.entries(formData).forEach(([key, value]) => {
            validateConfig[key].some((rule) => {
                if (rule.required && !value) {
                    errorsData[key] = rule.message
                    return true
                }
                if (rule.minLength && value.length < rule.minLength) {
                    errorsData[key] = rule.message
                    return true
                }
                if (rule.pattern && !rule.pattern.test(value)) {
                    errorsData[key] = rule.message
                    return true
                }
            })
        })

        setErrors(errorsData)
        return errorsData
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditExpense(prev => ({ ...prev, [name]: value }))
        setErrors({})
    }

    const handleClick = () => {

        const validateResult = validate({ title: editExpense.title, category: editExpense.category, amount: editExpense.amount })
        if (Object.keys(validateResult).length) return

        const editedData = expenses.map((expense) => {
            if (expense.id === editExpense.id) {
                return {
                    id: expense.id,
                    title: editExpense.title,
                    category: editExpense.category,
                    amount: editExpense.amount
                }
            }
            return expense
        })

        setExpenses(editedData)

        setEditExpense({
            rowId: '',
            isEdit: false
        })
    }

    const total = filteredData.reduce((total, { amount }) => total + Number.parseFloat(amount), 0)

    return (
        <div className='expense-table-container'>
            <ContextMenu
                contextMenuPosition={contextMenuPosition}
                setContextMenuPosition={setContextMenuPosition}
                expenses={expenses}
                setExpenses={setExpenses}
                rowId={rowId}
                setEditExpense={setEditExpense}
            />
            <table className="expense-table" onClick={() => {
                if (contextMenuPosition.left) {
                    setContextMenuPosition({})
                }
            }}>
                <thead>
                    <tr>
                    <th className="title-column">
                            <div>
                                <span>Title</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    viewBox="0 0 384 512"
                                    className="arrow up-arrow"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSortCallback(() => (a, b) => a.title.localeCompare(b.title))
                                    }}
                                >
                                    <title>Ascending</title>
                                    <path
                                        d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                                    />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    viewBox="0 0 384 512"
                                    className="arrow down-arrow"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSortCallback(() => (a, b) => b.title.localeCompare(a.title))
                                    }}
                                >
                                    <title>Descending</title>
                                    <path
                                        d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
                                    />
                                </svg>
                            </div>
                        </th>
                        <th>
                            <select value={query} onChange={(e) => setQuery(e.target.value)}>
                                <option value="">All</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Bills">Bills</option>
                                <option value="Education">Education</option>
                                <option value="Medicine">Medicine</option>
                            </select>
                        </th>
                        <th className="amount-column">
                            <div>
                                <span>Amount</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    viewBox="0 0 384 512"
                                    className="arrow up-arrow"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSortCallback(() => (a, b) => a.amount - b.amount)
                                    }}
                                >
                                    <title>Ascending</title>
                                    <path
                                        d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                                    />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    viewBox="0 0 384 512"
                                    className="arrow down-arrow"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSortCallback(() => (a, b) => b.amount - a.amount)
                                    }}
                                >
                                    <title>Descending</title>
                                    <path
                                        d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
                                    />
                                </svg>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredData.sort(sortCallback).map(({ id, title, category, amount }) => (
                            <tr key={id} onContextMenu={(e) => {
                                e.preventDefault()
                                setContextMenuPosition({ left: e.clientX + 4, top: e.clientY + 4 })
                                setRowId(id)
                            }}>
                                {
                                    editExpense.rowId === id && editExpense.isEdit ? (
                                        <>
                                            <td>
                                                <input className='expense-table-title-input' id='title' name='title' value={editExpense.title} onChange={handleChange} />
                                            </td>
                                            <td>
                                                <select className='expense-table-select select-input' id='category' name='category' value={editExpense.category} onChange={handleChange}>
                                                    <option value="Grocery">Grocery</option>
                                                    <option value="Clothes">Clothes</option>
                                                    <option value="Bills">Bills</option>
                                                    <option value="Education">Education</option>
                                                    <option value="Medicine">Medicine</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className='expense-table-amount-input-container'>
                                                    <input id='amount' name='amount' value={editExpense.amount} onChange={handleChange} />
                                                    <button onClick={handleClick}>Save</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{title}</td>
                                            <td>{category}</td>
                                            <td>₹{amount}</td>
                                        </>
                                    )
                                }

                            </tr>
                        ))
                    }
                    <tr>
                        <th>Total</th>
                        <th className='clear-sort' onClick={(e) => {
                            e.stopPropagation()
                            setSortCallback(() => () => {})
                        }}>Clear Sort</th>
                        <th>₹{total}</th>
                    </tr>
                </tbody>
            </table>
            {
                Object.values(errors).map((error) => (
                    <p className='expense-table-error'>{error}</p>))
            }
        </div>
    )
}

export default ExpenseTable