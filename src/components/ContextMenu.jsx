function ContextMenu({ contextMenuPosition, setContextMenuPosition, expenses, setExpenses, rowId, setEditExpense }) {
    if (!contextMenuPosition.left) return
    return (
        <div className="context-menu" style={contextMenuPosition}>
            <div onClick={() => {
                const [data] = expenses.filter((expense) => expense.id === rowId)
                setEditExpense({
                    rowId: rowId,
                    isEdit: true,
                    ...data
                })
                setContextMenuPosition({})
            }}>Edit</div>
            <div onClick={() => {
                setExpenses((prev) => prev.filter((expense) => expense.id !== rowId))
                setContextMenuPosition({})
            }}>Delete</div>
        </div>
    )
}

export default ContextMenu