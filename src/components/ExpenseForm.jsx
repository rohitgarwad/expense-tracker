import React, { useState } from 'react'
import Input from './Input'
import Select from './Select'
import { useLocalStorage } from '../hooks/useLocalStorage'

function ExpenseForm({ setExpenses }) {

    const [expense, setExpense] = useLocalStorage('expense', {
        title: '',
        category: '',
        amount: '',
    })
    const [errors, setErrors] = useState({})

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
            { pattern: /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/, message: "Please Enter a Valid Amount"}
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
        setExpense(prev => ({ ...prev, [name]: value }))
        setErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const validateResult = validate(expense)
        if (Object.keys(validateResult).length) return

        expense.id = crypto.randomUUID()
        setExpenses(prev => [...prev, expense])
        setExpense({
            title: '',
            category: '',
            amount: '',
        })
    }

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <Input
                id="title"
                label="Title"
                name="title"
                value={expense.title}
                onChange={handleChange}
                error={errors.title}
            />
            <Select
                id="category"
                label="Category"
                name="category"
                value={expense.category}
                onChange={handleChange}
                error={errors.category}
                options={[
                    { name: "Grocery", value: "Grocery" },
                    { name: "Clothes", value: "Clothes" },
                    { name: "Bills", value: "Bills" },
                    { name: "Education", value: "Education" },
                    { name: "Medicine", value: "Medicine" }
                ]}
                defaultOption="Select Category"
            />
            <Input
                id="amount"
                label="Amount"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                error={errors.amount}
            />
            <button className="add-btn">Add</button>
        </form>
    )
}

export default ExpenseForm