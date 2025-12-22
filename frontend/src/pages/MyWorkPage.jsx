import React from 'react';
import MobileBottomNav from '../components/MobileBottomNav';

const MyWorkPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="bg-white rounded-lg shadow-card p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Work History</h2>
                        <p className="text-gray-600">Your active and completed tasks will appear here.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyWorkPage;
