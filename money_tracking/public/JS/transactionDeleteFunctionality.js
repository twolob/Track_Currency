function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        fetch(`/dashboard/transaction/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove the transaction from the DOM
                    const transactionElement = document.querySelector(`.single-display[data-id="${id}"]`);
                    if (transactionElement) {
                        transactionElement.remove();
                    }
                    alert('Transaction deleted successfully');
                    // Reload the page to reflect the changes
                    location.reload();
                } else {
                    alert('Failed to delete transaction');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the transaction');
            });
    }
}