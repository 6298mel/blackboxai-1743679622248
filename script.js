// Load packages from products.json
document.addEventListener('DOMContentLoaded', function() {
    fetch('products.json')
        .then(response => response.json())
        .then(packages => {
            const container = document.getElementById('package-container');
            packages.forEach(pkg => {
                const packageCard = document.createElement('div');
                const featuredClass = pkg.highlight ? 'featured-card' : '';
                const popularBadge = pkg.popular ? `<span class="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</span>` : '';
                const businessBadge = pkg.business ? `<span class="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">BUSINESS</span>` : '';
                
                packageCard.className = `package-card bg-white rounded-lg p-6 shadow-lg relative ${featuredClass}`;
                packageCard.innerHTML = `
                    ${popularBadge}
                    ${businessBadge}
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${pkg.name}</h3>
                    <p class="text-blue-500 text-2xl font-bold mb-2">${pkg.price} KSH</p>
                    <p class="text-gray-600 mb-4">${pkg.data} | ${pkg.validity}</p>
                    <p class="text-gray-500 mb-4">${pkg.description}</p>
                    <div class="mt-4 border-t pt-4">
                        <h4 class="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                        <ul class="text-xs text-gray-600 space-y-1">
                            ${pkg.features.map(feature => `<li class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-2"></i>${feature}
                            </li>`).join('')}
                        </ul>
                    </div>
                    <button 
                        onclick="initiatePayment(${pkg.id})" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
                    >
                        Buy Now
                    </button>
                `;
                container.appendChild(packageCard);
            });
        })
        .catch(error => console.error('Error loading packages:', error));
});

// Payment initiation
function initiatePayment(packageId) {
    showPaymentModal(packageId);
}

// Show payment modal
function showPaymentModal(packageId) {
    fetch('products.json')
        .then(response => response.json())
        .then(packages => {
            const pkg = packages.find(p => p.id === packageId);
            if (!pkg) return;

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 class="text-xl font-bold mb-4">Complete Your Purchase</h3>
                    <p class="mb-2">Package: ${pkg.name}</p>
                    <p class="mb-4">Amount: <span class="text-blue-500">${pkg.price} KSH</span></p>
                    
                    <div class="mb-4">
                        <label class="block text-gray-800 mb-2">Safaricom Till Number</label>
                        <input 
                            type="text" 
                            value="4361534" 
                            class="w-full bg-gray-200 border border-gray-400 rounded py-2 px-3 text-gray-800" 
                            readonly
                        >
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-gray-800 mb-2">Transaction ID (From M-Pesa SMS)</label>
                        <input 
                            type="text" 
                            id="transactionId" 
                            placeholder="Enter transaction ID" 
                            class="w-full bg-gray-200 border border-gray-400 rounded py-2 px-3 text-gray-800"
                        >
                    </div>
                    
                    <div class="flex space-x-4">
                        <button 
                            onclick="verifyPayment(${pkg.id})" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
                        >
                            Verify Payment
                        </button>
                        <button 
                            onclick="this.closest('div[class*=\"fixed\"]').remove()" 
                            class="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        });
}

// Verify payment (simulated)
function verifyPayment(packageId) {
    const transactionId = document.getElementById('transactionId').value;
    if (!transactionId) {
        alert('Please enter your transaction ID');
        return;
    }

    setTimeout(() => {
        alert(`Payment verified successfully!\nTransaction ID: ${transactionId}\nYour data package will be activated shortly.\n\nYour new balance will reflect directly in your Safaricom line. You can exit this page now.`);
        document.querySelector('div[class*="fixed"]').remove();
    }, 1500);
}